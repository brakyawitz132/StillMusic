#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from models import User

# Local imports
from app import app
from models import db

with app.app_context():
    user = User(name='jacob', email='test@test.test')
    user.password_hash = '123'

    db.session.add(user)
    db.session.commit()
if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
