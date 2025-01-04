from rest_framework import serializers
from .models import Movie, CustomUser
from dj_rest_auth.registration.serializers import RegisterSerializer


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"
        read_only_fields = ["owner"]


class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["pk", "email", "username"]
