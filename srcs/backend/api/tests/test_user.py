# from django.test import TestCase, Client
# from django.urls import reverse
# import json
#
#
# def create_user(self, payload=None):
#     if payload is None:
#         return self.client.post(
#             self.url,
#             data="Invalid JSON",
#             content_type="application/json",
#         )
#     else:
#         return self.client.post(
#             self.url,
#             data=json.dumps(payload),
#             content_type="application/json",
#         )
#
#
# def delete_user(self, payload=None):
#     if payload is None:
#         return self.client.delete(
#             self.url,
#             data="Invalid JSON",
#             content_type="application/json",
#         )
#     else:
#         return self.client.delete(
#             self.url,
#             data=json.dumps(payload),
#             content_type="application/json",
#         )
#
#
# class AddUserTestCase(TestCase):
#     def setUp(self):
#         self.client = Client()
#         self.url = reverse("add-user")
#         self.valid_payload = {
#             "username": "testuser",
#             "alias": "testalias",
#             "password": "testpassword123",
#             "email": "testuser@example.com",
#         }
#         self.duplicate_payload = {
#             "username": "testuser",  # Duplicate username
#             "alias": "testalias",
#             "password": "testpassword123",
#             "email": "testuser@example.com",
#         }
#         self.incomplete_payload = {
#             "username": "testuser",
#             "alias": "testalias",
#             # Missing password and email
#         }
#
#     def test_success(self):
#         response = create_user(self, self.valid_payload)
#         data = response.json()
#         self.assertEqual(response.status_code, 201)
#         self.assertIn("id", data)
#         data.pop("id")
#         self.assertDictEqual(
#             data,
#             {
#                 "username": "testuser",
#                 "alias": "testalias",
#                 "email": "testuser@example.com",
#                 "wins": 0,
#                 "losses": 0,
#             },
#         )
#
#     def test_invalid_json(self):
#         response = create_user(self, None)
#         self.assertEqual(response.status_code, 400)
#
#     def test_incorrect_method(self):
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, 405)
#
#     def test_missing_data(self):
#         response = create_user(self, {})
#         self.assertEqual(response.status_code, 422)
#
#     def test_duplicate_username(self):
#         response = create_user(self, self.valid_payload)
#         response = create_user(self, self.duplicate_payload)
#         self.assertEqual(response.status_code, 500)
#
#
# class GetUserTestCase(TestCase):
#     def setUp(self):
#         self.client = Client()
#         self.add_url = reverse("add-user")
#         self.url = reverse("add-user")
#         self.incorrect_url = "http://localhost:9000/api/get/user/wrongtestuser/"
#         self.create_payload = {
#             "username": "testuser",
#             "alias": "testalias",
#             "password": "testpassword123",
#             "email": "testuser@example.com",
#         }
#         create_user(self, self.create_payload)
#         self.url = "http://localhost:9000/api/get/user/testuser/"
#
#     def test_success(self):
#         response = self.client.get(self.url)
#         data = response.json()
#         self.assertEqual(response.status_code, 200)
#         self.assertIn("id", data)
#         data.pop("id")
#         self.assertDictEqual(
#             data,
#             {
#                 "username": "testuser",
#                 "alias": "testalias",
#                 "email": "testuser@example.com",
#                 "wins": 0,
#                 "losses": 0,
#             },
#         )
#
#     def test_incorrect_url(self):
#         response = self.client.get(self.incorrect_url)
#         self.assertEqual(response.status_code, 404)
#
#     def test_incorrect_method(self):
#         response = self.client.post(self.url)
#         self.assertEqual(response.status_code, 405)
#
#
# class DeleteUserTestCase(TestCase):
#     def setUp(self):
#         self.client = Client()
#         self.url = reverse("add-user")
#         self.create_payload = {
#             "username": "testuser",
#             "alias": "testalias",
#             "password": "testpassword123",
#             "email": "testuser@example.com",
#         }
#         self.valid_payload = {"username": "testuser"}
#         self.incorrect_payload = {"username": "wrongtestuser"}
#         create_user(self, self.create_payload)
#         self.url = reverse("delete-user")
#
#     def test_success(self):
#         response = delete_user(self, self.valid_payload)
#         self.assertEqual(response.status_code, 200)
#
#     def test_invalid_json(self):
#         response = delete_user(self, None)
#         self.assertEqual(response.status_code, 400)
#
#     def test_incorrect_user(self):
#         response = delete_user(self, self.incorrect_payload)
#         self.assertEqual(response.status_code, 404)
#
#     def test_incorrect_method(self):
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, 405)
#
#     def test_missing_data(self):
#         response = delete_user(self, {})
#         self.assertEqual(response.status_code, 422)
