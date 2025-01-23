from django.test import TestCase, Client
from django.urls import reverse
import json


def create_users_and_chat(self):
    self.client.post(
        self.add_url,
        data=json.dumps(
            {
                "username": "sender",
                "alias": "senderalias",
                "password": "testpassword123",
                "email": "senderemail@example.com",
            }
        ),
        content_type="application/json",
    )
    self.client.post(
        self.add_url,
        data=json.dumps(
            {
                "username": "receiver",
                "alias": "receiver",
                "password": "testpassword123",
                "email": "receiveremail@example.com",
            }
        ),
        content_type="application/json",
    )
    self.client.post(
        self.add_chat_url,
        data=json.dumps(
            {
                "first_user": "sender",
                "second_user": "receiver",
            }
        ),
        content_type="application/json",
    )


def create_message(self, payload=None):
    if payload is None:
        return self.client.post(
            self.url,
            data="Invalid JSON",
            content_type="application/json",
        )
    else:
        return self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )


class AddMessageTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse("add-message")
        self.add_url = reverse("add-user")
        self.add_chat_url = reverse("add-chat")
        self.delete_chat_url = reverse("delete-chat")
        self.valid_payload = {
            "sender": "sender",
            "receiver": "receiver",
            "body": "body of the message",
        }
        self.incomplete_payload = {
            "sender": "sender",
            "receiver": "receiver",
        }
        self.missing_user_payload = {
            "sender": "wrongsender",
            "receiver": "wrongreceiver",
            "body": "body of the message",
        }
        create_users_and_chat(self)

    def test_success(self):
        response = create_message(self, self.valid_payload)
        data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn("id", data)
        data.pop("id")
        self.assertDictEqual(
            data,
            {
                "sender": "sender",
                "body": "body of the message",
            },
        )

    def test_missing_user(self):
        response = create_message(self, self.missing_user_payload)
        self.assertEqual(response.status_code, 404)

    def test_missing_chat(self):
        self.client.delete(
            self.delete_chat_url,
            data=json.dumps(
                {
                    "first_user": "sender",
                    "second_user": "receiver",
                }
            ),
            content_type="application/json",
        )
        response = create_message(self, self.valid_payload)
        self.assertEqual(response.status_code, 500)

    def test_missing_data(self):
        response = create_message(self, self.incomplete_payload)
        self.assertEqual(response.status_code, 422)

    def test_incorrect_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)

    def test_invalid_json(self):
        response = create_message(self, None)
        self.assertEqual(response.status_code, 400)


class GetMessageTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.add_url = reverse("add-user")
        self.add_chat_url = reverse("add-chat")
        self.delete_chat_url = reverse("delete-chat")
        self.valid_payload = {
            "sender": "sender",
            "receiver": "receiver",
            "body": "body of the message",
        }
        create_users_and_chat(self)
        self.url = reverse("add-message")
        message_id = create_message(self, self.valid_payload).json()["id"]
        self.url = "http://localhost:9000/api/get/message/" + str(message_id) + "/"

    def test_success(self):
        response = self.client.get(self.url)
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertIn("id", data)
        data.pop("id")
        self.assertIn("date", data)
        data.pop("date")
        self.assertDictEqual(
            data,
            {
                "sender": "sender",
                "body": "body of the message",
            },
        )

    def test_incorrect_url(self):
        response = self.client.get(self.url[:-2] + "99999/")
        self.assertEqual(response.status_code, 404)

    def test_empty_url(self):
        response = self.client.get(self.url[:-2] + "0/")
        self.assertEqual(response.status_code, 422)

    def test_incorrect_method(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 405)


class DeleteMessageTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.add_url = reverse("add-user")
        self.add_chat_url = reverse("add-chat")
        self.delete_chat_url = reverse("delete-chat")
        self.valid_payload = {
            "sender": "sender",
            "receiver": "receiver",
            "body": "body of the message",
        }
        self.nonexisting_payload = {"id": 999999}
        self.missing_user_payload = {}
        create_users_and_chat(self)
        self.url = reverse("add-message")
        message_id = create_message(self, self.valid_payload).json()["id"]
        self.deletion_payload = {"id": message_id}
        self.url = reverse("delete-message")

    def test_success(self):
        response = self.client.delete(
            self.url,
            data=json.dumps(self.deletion_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)

    def test_invalid_json(self):
        response = self.client.delete(
            self.url, data="Invalid JSON", content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

    def test_nonexisting_message(self):
        response = self.client.delete(
            self.url,
            data=json.dumps(self.nonexisting_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 404)

    def test_incorrect_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)

    def test_missing_data(self):
        response = self.client.delete(
            self.url,
            data=json.dumps(self.missing_user_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 422)
