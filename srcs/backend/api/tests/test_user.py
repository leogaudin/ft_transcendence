from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


class UserTestCase(APITestCase):
    list_create_url = reverse("user-list-create")
    retrieve_update_destroy_url = reverse("user-retrieve-update-destroy", kwargs={"username": "testuser"})
    retrieve_update_destroy_url_invalid = reverse("user-retrieve-update-destroy", kwargs={"username": "missing"})
    set_up_data = {
        "username": "testuser",
        "alias": "testalias",
        "password": "testpassword",
        "email": "test@gmail.com",
    }
    create_data = {
        "username": "testuser2",
        "alias": "testalias2",
        "password": "testpassword2",
        "email": "test2@gmail.com",
    }
    missing_data = {}
    patch_data = {"alias": "testaliasPATCHED"}
    put_data = {
        "username": "testuserPUT",
        "alias": "testaliasPUT",
        "password": "testpasswordPUT",
        "email": "testPUT@gmail.com",
    }

    def setUp(self):
        self.client.post(self.list_create_url, self.set_up_data, format="json")

    def test_create_user_valid(self):
        response = self.client.post(self.list_create_url, self.create_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_list_user_valid(self):
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_user_invalid(self):
        response = self.client.post(self.list_create_url, self.missing_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_valid(self):
        response = self.client.get(self.retrieve_update_destroy_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_invalid(self):
        response = self.client.get(self.retrieve_update_destroy_url_invalid)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_user_valid(self):
        response = self.client.patch(
            self.retrieve_update_destroy_url,
            self.patch_data,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["alias"], "testaliasPATCHED")

    def test_put_user_valid(self):
        response = self.client.patch(
            self.retrieve_update_destroy_url,
            self.put_data,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["alias"], "testaliasPUT")

    def test_delete_user_valid(self):
        response = self.client.delete(self.retrieve_update_destroy_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
