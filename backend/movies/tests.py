from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class UserCreateTests(APITestCase):
    def test_create_user(self):
        url = reverse("user-list")
        data = {
            "username": "testuser",
            "password": "testpassword",
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], data["username"])
        self.assertNotIn("password", response.data)


class UserListTests(APITestCase):
    def test_list_users(self):
        User.objects.create_user(username="testuser", password="testpassword")
        url = reverse("user-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserAccessTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.login_url = reverse("token_obtain_pair")
        self.movies_url = reverse("movie-list")

        response = self.client.post(
            self.login_url,
            {
                "username": "testuser",
                "password": "testpassword",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.token = response.data["access"]

    def test_access_movies_protected(self):
        response = self.client.get(self.movies_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        response = self.client.get(self.movies_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
