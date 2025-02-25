from allauth.account.adapter import validate_password
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import PasswordChangeSerializer
from rest_framework import serializers
from .models import CustomUser, Movie
from django.utils.translation import gettext_lazy as _


class CustomPasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True, write_only=True, validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    new_password1 = None
    new_password2 = None

    def validate(self, attrs):
        if "current_password" not in attrs:
            raise serializers.ValidationError(
                {"current_password": _("This field is required.")}
            )

        if attrs.get("new_password") != attrs.get("new_password_confirm"):
            raise serializers.ValidationError(
                {"new_password_confirm": _("Passwords do not match.")}
            )

        user = self.context["request"].user
        if not user.check_password(attrs.get("current_password")):
            raise serializers.ValidationError(
                {"current_password": _("Old password is incorrect.")}
            )

        return attrs

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


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
