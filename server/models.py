from sqlalchemy_serializer import SerializerMixin

from config import db

# Models go here!

class User(SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key = True)
    name  = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    

class Song(SerializerMixin):
    __tablename__ = "songs"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    # image placeholder
    # audio placeholder
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


class Favorite(SerializerMixin):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'))


    