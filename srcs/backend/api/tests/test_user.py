from django.test import TestCase, Client
from django.urls import reverse
import json


class AddUserTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse("add-user")
        self.valid_payload = {
            "username": "testuser",
            "alias": "testalias",
            "password": "testpassword123",
            "email": "testuser@example.com",
        }
        self.duplicate_payload = {
            "username": "testuser",  # Duplicate username
            "alias": "testalias",
            "password": "testpassword123",
            "email": "testuser@example.com",
        }
        self.incomplete_payload = {
            "username": "testuser",
            "alias": "testalias",
            # Missing password and email
        }

    def test_success(self):
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn("id", data)
        data.pop("id")
        self.assertDictEqual(
            data,
            {
                "username": "testuser",
                "alias": "testalias",
                "email": "testuser@example.com",
                "wins": 0,
                "losses": 0,
            },
        )

    def test_missing_data(self):
        response = self.client.post(
            self.url,
            data=json.dumps(self.incomplete_payload),
            content_type="application/json",
        )
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {"error": "All fields are required"})

    def test_duplicate_username(self):
        setup_response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        response = self.client.post(
            self.url,
            data=json.dumps(self.duplicate_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 500)
        self.assertEqual(
            response.json(),
            {
                "error": 'duplicate key value violates unique constraint "unique_user"\n'
                "DETAIL:  Key (username)=(testuser) already exists.\n"
            },
        )

    def test_incorrect_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json(), {"error": "Only POST requests are allowed"})

    def test_invalid_json(self):
        response = self.client.post(
            self.url, data="Invalid JSON", content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"error": "Invalid JSON"})


class GetUserTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.add_url = reverse("add-user")
        self.url = "http://localhost:9000/api/get/user/testuser/"
        self.incorrect_url = "http://localhost:9000/api/get/user/wrongtestuser/"
        self.create_payload = {
            "username": "testuser",
            "alias": "testalias",
            "password": "testpassword123",
            "email": "testuser@example.com",
        }
        self.client.post(
            self.add_url,
            data=json.dumps(self.create_payload),
            content_type="application/json",
        )

    def test_success(self):
        response = self.client.get(self.url)
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertIn("id", data)
        data.pop("id")
        self.assertDictEqual(
            data,
            {
                "username": "testuser",
                "alias": "testalias",
                "email": "testuser@example.com",
                "wins": 0,
                "losses": 0,
            },
        )

    def test_incorrect_url(self):
        response = self.client.get(self.incorrect_url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            response.json()["error"], "Unable to find user name wrongtestuser"
        )

    def test_incorrect_method(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()["error"], "Only GET requests are allowed")


class DeleteUserTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.add_url = reverse("add-user")
        self.url = reverse("delete-user")
        self.create_payload = {
            "username": "testuser",
            "alias": "testalias",
            "password": "testpassword123",
            "email": "testuser@example.com",
        }
        self.valid_payload = {"username": "testuser"}
        self.incorrect_payload = {"username": "wrongtestuser"}
        self.missing_payload = {}
        self.client.post(
            self.add_url,
            data=json.dumps(self.create_payload),
            content_type="application/json",
        )

    def test_success(self):
        response = self.client.delete(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], "User testuser deleted")

    def test_missing_data(self):
        response = self.client.delete(
            self.url,
            data=json.dumps(self.missing_payload),
            content_type="application/json",
        )
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "No name provided")

    def test_incorrect_user(self):
        response = self.client.delete(
            self.url,
            data=json.dumps(self.incorrect_payload),
            content_type="application/json",
        )
        data = response.json()
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["error"], "Unable to find user name wrongtestuser")

    def test_invalid_json(self):
        response = self.client.delete(
            self.url, data="Invalid JSON", content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"error": "Invalid JSON"})

    def test_incorrect_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json(), {"error": "Only DELETE requests are allowed"})
