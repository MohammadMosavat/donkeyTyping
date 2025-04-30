from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId
from datetime import datetime
import email.utils
import bcrypt

app = Flask(__name__)
CORS(app)


client = MongoClient("mongodb://localhost:27017/")
db = client["typing_db"]
collection_users = db['users']
wpm_collection = db["wpm_records"]

collection_users.create_index("username", unique=True)
collection_users.create_index("email", unique=True)

def parse_rfc1123_date(date_str):
    try:
        return email.utils.parsedate_to_datetime(date_str)
    except Exception:
        return None

@app.route('/store_wpm', methods=['POST'])
def store_wpm():
    data = request.json
    required_fields = ['username', 'wpm', 'correct_char', 'incorrect_char', 'date', 'language']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
    try:
        date = datetime.fromisoformat(data['date'].replace("Z", "+00:00"))
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400
    try:
        record = {
            'username': data['username'],
            'wpm': data['wpm'],
            'correct_char': data['correct_char'],
            'incorrect_char': data['incorrect_char'],
            'time': data['time'],
            'word': data['word'],
            'date': date,
            'language': data['language']
        }
    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {e}'}), 400
    result = wpm_collection.insert_one(record)
    return jsonify({
        'message': 'WPM record stored successfully!',
        'record_id': str(result.inserted_id)
    }), 201

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"message": "Email and password are required."}), 400
        user = collection_users.find_one({"email": email})
        if not user:
            return jsonify({"message": "Invalid email or password."}), 401
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
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

@app.route("/store_wpm", methods=["GET"])
def get_wpm_records():
    try:
        user_id = request.args.get('id_username')
        username = request.args.get('username')
        sort_by = request.args.get("sort")
        query = {}
        if user_id:
            try:
                query["id_username"] = ObjectId(user_id)
            except Exception as e:
                return jsonify({"message": f"Invalid id_username format: {e}"}), 400
        if username:
            query["username"] = username
        records = list(wpm_collection.find(query))
        if not records:
            return jsonify({"message": "No records found for the given criteria"}), 404
        for record in records:
            record["_id"] = str(record["_id"])
            record["word"] = record.get("word")
            if "date" in record and isinstance(record["date"], str):
                parsed_date = parse_rfc1123_date(record["date"])
                if parsed_date:
                    record["parsed_date"] = parsed_date
                else:
                    record["parsed_date"] = datetime.min
        if sort_by == "highest":
            records.sort(key=lambda x: (x.get("wpm") or 0), reverse=True)
        elif sort_by == "lowest":
            records.sort(key=lambda x: (x.get("wpm") or 0))
        elif sort_by == "newest":
            records.sort(key=lambda x: x.get("parsed_date", datetime.min), reverse=True)
        elif sort_by == "oldest":
            records.sort(key=lambda x: x.get("parsed_date", datetime.min))
        for record in records:
            if isinstance(record.get("parsed_date"), datetime):
                record["date"] = record["parsed_date"].strftime("%a, %d %b %Y %H:%M:%S GMT")
                del record["parsed_date"]
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
