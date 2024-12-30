from rest_framework import status, viewsets
from rest_framework.views import Response
from .models import Movie
from django.contrib.auth.models import User
from .serializers import MovieSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwner


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return Movie.objects.filter(owner=self.request.user)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        return Response(status=status.HTTP_403_FORBIDDEN)

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        elif self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsOwner()]
        return [IsAuthenticated()]
