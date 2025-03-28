import os
from flask import Flask, request, jsonify
import lyricsgenius
from pymongo import MongoClient, errors,DESCENDING, ASCENDING
from flask_cors import CORS
import requests
import pyttsx3
from bson import ObjectId
from datetime import datetime
import email.utils 
import bcrypt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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

def parse_rfc1123_date(date_str):
    """Convert RFC 1123 date string to datetime object."""
    try:
        return email.utils.parsedate_to_datetime(date_str)
    except Exception:
        return None  # Return None if parsing fails

from datetime import datetime

@app.route('/store_wpm', methods=['POST'])
def store_wpm():
    # Get data from the request
    data = request.json
    print(data)  # To check what is received

    # Validate required fields
    required_fields = ['username', 'wpm', 'correct_char', 'incorrect_char', 'date', 'language']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # Ensure the date is a valid ISO 8601 string and convert it to a datetime object
    try:
        # Remove 'Z' and convert to datetime
        date = datetime.fromisoformat(data['date'].replace("Z", "+00:00"))
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    # Prepare the record
    try:
        record = {
            'username': data['username'],
            'wpm': data['wpm'],
            'correct_char': data['correct_char'],
            'incorrect_char': data['incorrect_char'],
            'time': data['time'],
            'word': data['word'],
            'date': date,  # Use the datetime object for MongoDB
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

@app.route("/login", methods=["POST"])
def login():
    try:
        # Get email and password from the request
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Validate input
        if not email or not password:
            return jsonify({"message": "Email and password are required."}), 400

        # Find the user by email
        user = collection_users.find_one({"email": email})

        if not user:
            return jsonify({"message": "Invalid email or password."}), 401

        # Compare the hashed password with the provided password
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            # If passwords match, return a success response with user info (excluding password)
            user_data = {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "location": user["location"],
                "joinedAt": user["joinedAt"]
            }
            return jsonify({"message": "Login successful", "user": user_data}), 200
        else:
            return jsonify({"message": "Invalid email or password."}), 401

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route("/send-welcome-email", methods=["POST"])
def send_welcome_email():
    try:
        data = request.json
        recipient_email = data.get("email")
        username = data.get("username")

        if not recipient_email or not username:
            return jsonify({"error": "Email and username are required"}), 400

        # Create message
        msg = MIMEMultipart()
        msg['From'] = 'typeracer.app.2024@gmail.com'  # Sender email address
        msg['To'] = recipient_email
        msg['Subject'] = f"Welcome to TypeRacer, {username}!"

        body = f"""
        Hi {username},

        Welcome to TypeRacer! We're excited to have you join our community.
        Start practicing your typing skills and compete with others.

        Happy Typing!
        The TypeRacer Team
        """
        
        msg.attach(MIMEText(body, 'plain'))

        # Create SMTP session
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        
        # Login using environment variables for security
        email = 'typeracer.app.2024@gmail.com'  # Fixed email address
        password = 'qxwm rnxk yvxp rlzm'  # App password generated from Google Account
        
        if not password:
            return jsonify({"error": "Failed to send welcome email: Email password not properly configured"}), 500
            
        server.login(email, password)
        
        # Send email
        server.send_message(msg)
        server.quit()

        return jsonify({"message": "Welcome email sent successfully"}), 200

    except Exception as e:
        print(f"Email error: {str(e)}")
        return jsonify({"error": f"Failed to send welcome email: {str(e)}"}), 500

@app.route("/store_wpm", methods=["GET"])
def get_wpm_records():
    try:
        # Get query parameters
        user_id = request.args.get('id_username')
        username = request.args.get('username')
        sort_by = request.args.get("sort")

        # Build the query
        query = {}

        if user_id:
            try:
                query["id_username"] = ObjectId(user_id)
            except Exception as e:
                return jsonify({"message": f"Invalid id_username format: {e}"}), 400  

        if username:
            query["username"] = username

        # Fetch records
        records = list(wpm_collection.find(query))

        if not records:
            return jsonify({"message": "No records found for the given criteria"}), 404

        # Convert `_id` to string and parse dates
        for record in records:
            record["_id"] = str(record["_id"])

            # Ensure 'word' is included in the response (if it exists)
            record["word"] = record.get("word")  # Default to 0 if missing

            # Convert string date to datetime object
            if "date" in record and isinstance(record["date"], str):
                parsed_date = parse_rfc1123_date(record["date"])
                if parsed_date:
                    record["parsed_date"] = parsed_date  # Store separately for sorting
                else:
                    record["parsed_date"] = datetime.min  # Default value for invalid dates

        # Sorting logic
        if sort_by == "highest":
            records.sort(key=lambda x: (x.get("wpm") or 0), reverse=True)  # Highest WPM first
        elif sort_by == "lowest":
            records.sort(key=lambda x: (x.get("wpm") or 0))  # Lowest WPM first
        elif sort_by == "newest":
            records.sort(key=lambda x: x.get("parsed_date", datetime.min), reverse=True)  # Newest first
        elif sort_by == "oldest":
            records.sort(key=lambda x: x.get("parsed_date", datetime.min))  # Oldest first

        # Convert `datetime` back to RFC 1123 string before returning response
        for record in records:
            if isinstance(record.get("parsed_date"), datetime):
                record["date"] = record["parsed_date"].strftime("%a, %d %b %Y %H:%M:%S GMT")
                del record["parsed_date"]  # Remove temporary field

        return jsonify(records), 200

    except Exception as e:
        return jsonify({"error": f"Error fetching records: {str(e)}"}), 500

@app.route("/user", methods=["POST", "GET", "DELETE"])
def user_operations():
    if request.method == "POST":
        try:
            data = request.json
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            location = data.get("location")
            joinedAt = data.get("joinedAt")

            if not username or not email or not password or not location:
                return jsonify({"message": "Username, email, password, and location are required."}), 400

            existing_username = collection_users.find_one({"username": username})
            if existing_username:
                return jsonify({"message": "Username already exists. Please choose another one."}), 409

            existing_email = collection_users.find_one({"email": email})
            if existing_email:
                return jsonify({"message": "Email already exists. Please use another email address."}), 409

            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            user = {
                "username": username,
                "email": email,
                "password": hashed_password.decode('utf-8'),
                "location": location,
                "joinedAt": joinedAt
            }
            result = collection_users.insert_one(user)
            user["_id"] = str(result.inserted_id)

            return jsonify({"message": "Sign up successful!", "user": user}), 201

        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 500

    elif request.method == "GET":
        try:
            user_id = request.args.get("id")
            username = request.args.get("username")
            start_date = request.args.get("start_date")
            end_date = request.args.get("end_date")

            query = {}
            if user_id:
                try:
                    query["_id"] = ObjectId(user_id)
                except Exception as e:
                    return jsonify({"message": f"Invalid _id format: {e}"}), 400

            if username:
                query["username"] = username

            if start_date or end_date:
                query["joinedAt"] = {}
                if start_date:
                    query["joinedAt"]["$gte"] = datetime.strptime(start_date, "%Y-%m-%d")
                if end_date:
                    query["joinedAt"]["$lte"] = datetime.strptime(end_date, "%Y-%m-%d")

            users = list(collection_users.find(query))
            for user in users:
                user["_id"] = str(user["_id"])

            if not users:
                return jsonify({"message": "No users found matching the criteria."}), 404

            return jsonify(users), 200

        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 500

    elif request.method == "DELETE":
        try:
            data = request.json
            user_id = data.get("id")

            if not user_id:
                return jsonify({"message": "User ID is required."}), 400

            try:
                result = collection_users.delete_one({"_id": ObjectId(user_id)})
            except Exception as e:
                return jsonify({"message": f"Invalid _id format: {e}"}), 400

            if result.deleted_count == 0:
                return jsonify({"message": "User not found."}), 404

            return jsonify({"message": "User deleted successfully."}), 200

        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 500
        
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
