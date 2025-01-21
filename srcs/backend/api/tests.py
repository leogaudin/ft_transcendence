from django.test import TestCase

# Create your tests here.


# TODO:Try to understand tests and create them to test the API
#
# from django.test import TestCase, Client
# from django.urls import reverse
# from django.contrib.auth.models import User
# import json
# class AddUserTestCase(TestCase):
#     def setUp(self):
#         self.client = Client()
#         self.url = reverse("add-user")  # Replace 'add_user' with your URL pattern name
#         self.valid_payload = {
#             "username": "testuser",
#             "alias": "testalias",
#             "password": "testpassword123",
#             "email": "testuser@example.com",
#         }
#         self.invalid_payload = {
#             "username": "testuser",
#             "alias": "testalias",
#             # Missing password and email
#         }
#
#     def test_create_user_success(self):
#         response = self.client.post(
#             self.url,
#             data=json.dumps(self.valid_payload),
#             content_type="application/json",
#         )
#         self.assertEqual(response.status_code, 201)
#         self.assertIn("id", response.json())
#         self.assertIn("username", response.json())
#         self.assertIn("alias", response.json())
#         self.assertIn("email", response.json())
#
#     def test_create_user_missing_fields(self):
#         response = self.client.post(
#             self.url,
#             data=json.dumps(self.invalid_payload),
#             content_type="application/json",
#         )
#         self.assertEqual(response.status_code, 400)
#         self.assertEqual(response.json(), {"error": "All fields are required"})
#
#     def test_create_user_invalid_method(self):
#         response = self.client.get(self.url)  # Using GET instead of POST
#         self.assertEqual(response.status_code, 405)
#         self.assertEqual(response.json(), {"error": "Only POST requests are allowed"})
#
#     def test_create_user_invalid_json(self):
#         response = self.client.post(
#             self.url, data="Invalid JSON", content_type="application/json"
#         )
#         self.assertEqual(response.status_code, 400)
#         self.assertEqual(response.json(), {"error": "Invalid JSON"})
