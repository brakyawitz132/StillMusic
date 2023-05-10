#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Song, Favorite

# Views go here!

# Models

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)
    
    def post(self):
        data = request.get_json()

        new_user = User(
            name = data['name'],
            email = data['email'],
            password = data['password']
        )

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
        pass

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
    pass

# Authentication and Authorization

class Login(Resource):

    def post(self):
        
        username = request.get_json()['username']
        user = User.query.filter(User.username == username).first()

        session['user_id'] = user.id

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
