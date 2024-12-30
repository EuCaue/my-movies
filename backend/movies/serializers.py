from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Movie


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        # here you declare what fields be required for POST,PUT,PATCH
        fields = "__all__"
        # make the owner of the movie read only
        read_only_fields = ["owner"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
