from django.core.management.base import BaseCommand
from django.core.management import call_command
import requests


class Command(BaseCommand):
    help = "Populates the database with mockup users, chats, messages and more"

    def handle(self, *args, **kwargs):
        print("Creating mockup users...")
        users = [
            {
                "username": "foo",
                "alias": "foo",
                "password": "foo1234",
                "email": "foo@gmail.com",
            },
            {
                "username": "bar",
                "alias": "bar",
                "password": "bar1234",
                "email": "bar@gmail.com",
            },
            {
                "username": "baz",
                "alias": "baz",
                "password": "baz1234",
                "email": "baz@gmail.com",
            },
            {
                "username": "qux",
                "alias": "qux",
                "password": "qux1234",
                "email": "qux@gmail.com",
            },
            {
                "username": "anonymous",
                "alias": "anonymous",
                "password": "anonymous1234",
                "email": "anonymous@gmail.com",
            },
        ]
        for user in users:
            requests.post("http://localhost:9000/api/users/", json=user)

        print("Creating mockup chats...")
        chats = [
            {"first_user": "foo", "second_user": "bar"},
            {"first_user": "bar", "second_user": "baz"},
            {"first_user": "qux", "second_user": "foo"},
        ]
        for chat in chats:
            requests.post("http://localhost:9000/api/chats/", json=chat)

        print("Creating mockup messages...")
        messages = [
            {"sender": "foo", "body": "message one", "chat": 1},
            {"sender": "foo", "body": "message two", "chat": 1},
            {"sender": "bar", "body": "message three", "chat": 2},
            {"sender": "bar", "body": "message four", "chat": 2},
            {"sender": "qux", "body": "message five", "chat": 3},
            {"sender": "qux", "body": "message six", "chat": 3},
        ]
        for message in messages:
            requests.post("http://localhost:9000/api/messages/", json=message)

        print("Creating mockup matches...")
        matchs = [
            {
                "left_player": "foo",
                "right_player": "bar",
                "winner": "foo",
                "loser": "bar",
                "result": [3, 2],
            },
            {
                "left_player": "foo",
                "right_player": "bar",
                "winner": "bar",
                "loser": "foo",
                "result": [2, 3],
            },
        ]
        for match in matchs:
            requests.post("http://localhost:9000/api/matchs/", json=match)

        print("Creating mockup tournaments...")
        tournaments = [
            {
                "name": "test tournament one",
                "player_amount": 4,
                "players": ["foo", "bar", "baz", "qux"],
            },
            {
                "name": "test tournament two",
                "player_amount": 4,
                "players": ["foo", "bar", "baz", "qux"],
            },
        ]
        for tournament in tournaments:
            requests.post("http://localhost:9000/api/tournaments/", json=tournament)

        print("All done!")
