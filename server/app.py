#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify, session
from flask_restful import Resource
# from flask_jwt_extended import create_access_token
# from flask_jwt_extended import get_jwt_identity
# from flask_jwt_extended import current_user
# from flask_jwt_extended import jwt_required
# from flask_jwt_extended import JWTManager

# Local imports
from config import *
from models import User, Song, Favorite
app.secret_key = 'ianiscool'

# app.config["JWT_SECRET_KEY"] = "lkjq43berg9y82945qouhgrnq"  # Change this!
# jwt = JWTManager(app)

# CORS(app,origins="http://localhost:4000", supports_credentials=True)
# app.config['CORS_HEADERS'] = 'Content-Type'

# @app.route("/token", methods=["POST"])
# def create_token():
#     email = request.json.get("email")
#     password = request.json.get("password")
#     user=User.query.filter_by(email=email).first()
#     print(user)
#     if not user or not user.password == password:
#         return jsonify({"msg": "Bad email or password"}), 401

#     # additional_claims = {"id": user.id}
#     access_token = create_access_token(identity=email)
#     return jsonify(access_token=access_token, user_id=user.id)

# @app.route("/protected", methods=["GET"])
# @jwt_required()
# def protected():
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200

# Models

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)
    
    def post(self):
        data = request.get_json()
        try:
            new_user = User(
                name = data['name'],
                email = data['email'],
                password = data['password']
            )
            db.session.add(new_user)
            db.session.commit()

        except Exception as e:
            return make_response({
                "errors": [e.__str__()]
            }, 422)
        
        return make_response(new_user.to_dict(), 201)
        

api.add_resource(Users, '/users')


class UsersById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        return make_response(user, 200)
    
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({
                "error": "User not found"
            }, 404)
        data = request.get_json()
        for key in data.keys():
            setattr(user, key, data[key])
        db.session.add(user)
        db.session.commit()
        return make_response(user.to_dict(), 200)
    
    def delete(self,id):
        user = User.query.filter_by(id = id).first()
        if not user:
            return make_response({
                "error": "User not found"
            }, 404)
        db.session.delete(user)
        db.session.commit()

api.add_resource(UsersById, '/users/<int:id>')

class Songs(Resource):
    def get(self):
        song = [song.to_dict() for song in Song.query.all()]
        return make_response(song, 200)
    
    def post(self):
        song_name = request.form.get('songName')
        image_blob = request.files['image']
        midi_blob = request.files['midi']
        try:
            # Read the binary data from the image and MIDI files
            image_data = image_blob.read()
            midi_data = midi_blob.read()

            new_song = Song(
                name=song_name,
                image=image_data,
                song=midi_data,
                user_id= 1#current_user.id  # if using Flask-Login for authentication
            )
            db.session.add(new_song)
            db.session.commit()

        except Exception as e:
            return make_response({
                "errors": [e.__str__()]
            }, 422)
        
        return make_response(new_song.to_dict(), 201)

api.add_resource(Songs, '/songs')

class SongsById(Resource):
    def get(self, id):
        song = Song.query.filter_by(id=id).first()
        return make_response(song, 200)
    
    def patch(self, id):
        song = Song.query.filter_by(id=id).first()
        if not song:
            return make_response({
                "error": "Song not found"
            }, 404)
        data = request.get_json()
        for key in data.keys():
            setattr(song, key, data[key])
        db.session.add(song)
        db.session.commit()
        return make_response(song.to_dict(), 200)
    
    def delete(self, id):
        song = Song.query.filter_by(id = id).first()
        if not song:
            return make_response({
                "error": "Song not found"
            }, 404)
        db.session.delete(song)
        db.session.commit()

api.add_resource(SongsById, '/songs/<int:id>')

class Favorites(Resource):
    def get(self):
        favorites = [fav.to_dict() for fav in Favorite.query.all()]
        return make_response(favorites, 200)
    
    def post(self):
        data = request.get_json()
        try:
            new_user = User(
                name = data['name'],
                email = data['email'],
                password = data['password']
            )
            db.session.add(new_user)
            db.session.commit()

        except Exception as e:
            return make_response({
                "errors": [e.__str__()]
            }, 422)
        
        return make_response(new_user.to_dict(), 201)

api.add_resource(Favorites, '/favorites')

class FavoritesById(Resource):
    def get(self, id):
        favorite = Favorite.query.filter_by(id=id).first()
        return make_response(favorite, 200)
    
    def delete(self, id):
        favorite = Favorite.query.filter_by(id = id).first()
        if not favorite:
            return make_response({
                "error": "Favorite not found"
            }, 404)
        db.session.delete(favorite)
        db.session.commit()

api.add_resource(FavoritesById, '/favorites/<int:id>')

# Authentication and Authorization

class Login(Resource):

    def post(self):
        data = request.get_json()
        user = User.query.filter(User.email == data["email"]).first()
        if not user:
            return make_response(jsonify({'error': "bitch doesnt exist"}), 404)
        if user.authenticate(data['password']):
            session['user_id'] = user.id
            print(session)
        return user.to_dict(), 200

class Logout(Resource):

    def delete(self):

        session['user_id'] = None
        
        return {}, 204

class CheckSession(Resource):

    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200
        
        return {}, 401
    
class ClearSession(Resource):

    def delete(self):
    
        session['page_views'] = None
        session['user_id'] = None

        return {}, 204

api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')
api.add_resource(ClearSession, '/clear')



if __name__ == '__main__':
    app.run(port=5555, debug=True)
