from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!

class User(SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key = True)
    name  = db.Column(db.String(80))
    email = db.Column(db.String(100))
    password = db.Column(db.String(30))

    songs  = db.relationship('Song', backref='user')

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError('Enter valid email address')
        return email
    

class Song(SerializerMixin):
    __tablename__ = "songs"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    image = db.Column(db.LargeBinary, nullable = False) # image placeholder
    song = db.Column(db.LargeBinary, nullable = False) # audio placeholder
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


class Favorite(SerializerMixin):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'))


    