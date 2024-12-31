from flask import Flask, request, jsonify
import lyricsgenius
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Genius API token
genius_token = "YMz4dUuJjVUzBAy4c5isjZtaMCBcgBd6P0___lMu9YaE1vTn1yEprqoTaBPGW7I8"

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Replace with your MongoDB URI
db = client["typing_db"]  # Database name
collection = db["songs"]  # Collection name

# Initialize Genius API client
genius = lyricsgenius.Genius(genius_token)

@app.route('/songs', methods=['POST'])
def run_python():
    data = request.json
    song_title = data.get('song')
    artist_name = data.get('artist')

    if not song_title or not artist_name:
        return jsonify({"error": "Song and artist are required"}), 400

    try:
        # Check if the song already exists in the database by title and artist
        existing_song = collection.find_one({"title": song_title, "artist": artist_name})

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
        songs = collection.find()

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


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
