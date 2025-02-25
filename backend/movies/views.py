from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.views import Response
from .models import Movie
from .serializers import MovieSerializer, CustomPasswordChangeSerializer
from dj_rest_auth.views import PasswordChangeView


class CustomPasswordChangeView(PasswordChangeView):
    serializer_class = CustomPasswordChangeSerializer


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://127.0.0.1:3000/"
    client_class = OAuth2Client


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=["get"])
    def my_movies(self, request):
        movies = Movie.objects.filter(owner=request.user)
        serializer = self.get_serializer(movies, many=True)
        return Response(serializer.data)
