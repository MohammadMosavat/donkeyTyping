from flask import Flask, request, jsonify
import lyricsgenius
from pymongo import MongoClient , errors
from flask_cors import CORS
import requests
import pyttsx3
from bson import ObjectId
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Genius API token
genius_token = "YMz4dUuJjVUzBAy4c5isjZtaMCBcgBd6P0___lMu9YaE1vTn1yEprqoTaBPGW7I8"

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Replace with your MongoDB URI
db = client["typing_db"]  # Database name
collection_songs = db["songs"]  # Collection songs
collection_quotes = db["quotes"]  # Collection songs
collection_listen_word = db['words_listen']  # Collection words_listen
collection_users = db['users']  # Collection words_listen
wpm_collection = db["wpm_records"]  # Replace with your collection name
# Initialize Genius API client
genius = lyricsgenius.Genius(genius_token)

# Ensure 'username' field is unique
collection_users.create_index("username", unique=True)
collection_users.create_index("email", unique=True)

@app.route('/store_wpm', methods=['POST'])
def store_wpm():
    # Get data from the request
    data = request.json

    # Validate required fields
    required_fields = ['username', 'id_username', 'wpm', 'correct_char', 'incorrect_char', 'date', 'language']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Prepare the record
    try:
        record = {
            'username': data['username'],
            'id_username': data['id_username'],
            'wpm': (data['wpm']),
            'correct_char': (data['correct_char']),
            'incorrect_char': (data['incorrect_char']),
            'date': (data['date']),
            'language': data['language']
        }
    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {e}'}), 400

    # Insert into MongoDB
    result = wpm_collection.insert_one(record)

    return jsonify({
        'message': 'WPM record stored successfully!',
        'record_id': str(result.inserted_id)
    }), 201

@app.route('/store_wpm', methods=['GET'])
def get_wpm_records():
    # Get query parameters
    username = request.args.get('username')  # Optional: Filter by username
    start_date = request.args.get('start_date')  # Optional: Filter by start date
    end_date = request.args.get('end_date')  # Optional: Filter by end date

    # Build the query
    query = {}
    if username:
        query['username'] = username

    if start_date or end_date:
        query['date'] = {}
        if start_date:
            query['date']['$gte'] = datetime.strptime(start_date, '%Y-%m-%d')  # Start date filter
        if end_date:
            query['date']['$lte'] = datetime.strptime(end_date, '%Y-%m-%d')  # End date filter

    # Fetch records from MongoDB
    try:
        records = list(wpm_collection.find(query, {'_id': 0}))  # Exclude `_id` from response
        return jsonify(records), 200
    except Exception as e:
        return jsonify({'error': f'Error fetching records: {e}'}), 500

@app.route("/signup", methods=["POST", "GET"])
def signup():
    if request.method == "POST":
        try:
            # Parse JSON data from request
            data = request.json
            username = data.get("username")
            email = data.get("email")
            location = data.get("location")
            joinedAt = data.get("joinedAt")

            # Validate input
            if not username or not email or not location:
                return jsonify({"message": "Username, email, and location are required."}), 400


            # Insert user into the database with the joinedAt field
            user = {"username": username, "email": email, "location": location, "joinedAt": joinedAt}
            result = collection_users.insert_one(user)

            # Convert the `_id` to a string for the response
            user["_id"] = str(result.inserted_id)

            return jsonify({"message": "Sign up successful!", "user": user}), 201

        except errors.DuplicateKeyError:
            return jsonify({"message": "Username or email already exists. Please choose another one."}), 409
        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 500

    elif request.method == "GET":
        try:
            # Retrieve all users from the database
            users = list(collection_users.find())
            # Convert ObjectId to string for JSON serialization
            for user in users:
                user["_id"] = str(user["_id"])

            return jsonify(users), 200

        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route('/user/<string:identifier>', methods=['GET'])
def get_user(identifier):
    query = {}

    # Check if identifier is a valid ObjectId (for MongoDB _id)
    try:
        query['_id'] = ObjectId(identifier)
    except:
        # If not a valid ObjectId, assume it is a username
        query['username'] = identifier

    # Query MongoDB
    user = collection_users.find_one(query)
    if user:
        # Convert MongoDB ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    else:
        return jsonify({'error': 'User not found'}), 404


@app.route('/songs', methods=['POST'])
def run_python():
    data = request.json
    song_title = data.get('song')
    artist_name = data.get('artist')

    if not song_title or not artist_name:
        return jsonify({"error": "Song and artist are required"}), 400

    try:
        # Check if the song already exists in the database by title and artist
        existing_song = collection_songs.find_one({"title": song_title, "artist": artist_name})

        if existing_song:
            # If song already exists, return existing song data without inserting it again
            return jsonify({
                "message": "Song already exists in the database",
                "song_id": str(existing_song["_id"]),
                "lyrics": existing_song["lyrics"]
            }), 200

        # Search for the song using the Genius API if not found in the database
        song = genius.search_song(song_title, artist_name)

        if song:
            song_data = {
                "title": song.title,
                "artist": song.artist,
                "lyrics": song.lyrics
            }

            # Do not insert data into MongoDB if the song already exists
            return jsonify({
                "message": "Song lyrics found but not inserted into the database, as it already exists",
                "lyrics": song.lyrics
            }), 200
        else:
            return jsonify({"error": "Song not found on Genius API"}), 404

    except Exception as e:
        # Log and return the error message for easier debugging
        print(f"Error occurred: {str(e)}")  # Log to console
        return jsonify({"error": f"Error occurred: {str(e)}"}), 500

# Route to fetch songs from the MongoDB collection
@app.route('/songs', methods=['GET'])
def get_songs():
    try:
        # Fetch all songs from the MongoDB collection
        songs = collection_songs.find()

        # Convert MongoDB cursor to a list of dictionaries
        songs_list = []
        for song in songs:
            song_data = {
                "id": str(song["_id"]),
                "title": song["title"],
                "artist": song["artist"],
                "lyrics": song["lyrics"]
            }
            songs_list.append(song_data)

        # Return the list of songs as JSON
        return jsonify(songs_list), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log to console
        return jsonify({"error": f"Error occurred: {str(e)}"}), 500


@app.route('/store-quotes', methods=['POST'])
def store_quotes():
    # Fetch data from ZenQuotes API
    response = requests.get("https://zenquotes.io/api/random")
    
    if response.status_code == 200:
        quotes = response.json()
        
        # Insert the quotes into MongoDB
        if quotes:
            collection_quotes.insert_many(quotes)
            return jsonify({"message": "Quotes stored successfully!"}), 200
        else:
            return jsonify({"message": "No quotes found in response."}), 400
    else:
        return jsonify({"message": "Failed to fetch quotes from API."}), 500

@app.route('/get-quotes', methods=['GET'])
def get_quotes():
    # Fetch all quotes from MongoDB
    quotes = list(collection_quotes.find({}, {'_id': 0}))  # Exclude '_id' field
    if quotes:
        return jsonify(quotes), 200
    else:
        return jsonify({"message": "No quotes found in database."}), 404

# Text-to-Speech Engine
engine = pyttsx3.init()

@app.route('/post-random-word', methods=['POST'])
def post_random_word():
    try:
        # Get JSON data from the request
        data = request.json

        if not data or 'word' not in data:
            return jsonify({"message": "Invalid input. 'word' is required."}), 400

        # Extract the word
        word = data['word']

        # Insert the word into MongoDB
        word_entry = {"word": word}
        collection_listen_word.insert_one(word_entry)

        return jsonify({"message": f"Word '{word}' stored successfully!"}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
