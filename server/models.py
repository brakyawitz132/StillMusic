from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

# Models go here!

class User(db.Model,SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key = True)
    name  = db.Column(db.String(80))
    email = db.Column(db.String(100))
    _password_hash = db.Column(db.String(30))

    favorites = db.relationship('Favorite', backref='user')
    songs = association_proxy('favorites', 'song')

    @hybrid_property
    def password_hash(self):
        raise Exception("Password hashes cannot be viewed")
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError('Enter valid email address')
        existing_user = User.query.filter_by(email=email).first()
        if existing_user and existing_user.id != self.id:
            raise ValueError('Email already exists')
        return email
    

class Song(db.Model,SerializerMixin):
    __tablename__ = "songs"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    image = db.Column(db.LargeBinary, nullable = False) # image placeholder
    song = db.Column(db.LargeBinary, nullable = False) # audio placeholder
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    favorites = db.relationship('Favorite', backref='song')


class Favorite(db.Model,SerializerMixin):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'))


    