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

    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop("password1", None)
        self.fields.pop("password2", None)

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "The password should be the same."}
            )
        return data

    def save(self, request):
        self.validated_data["password1"] = self.validated_data.pop("password")
        self.validated_data["password2"] = self.validated_data.pop("password_confirm")
        return super().save(request)


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["pk", "email", "username"]
