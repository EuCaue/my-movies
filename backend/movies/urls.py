from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MovieViewSet

router = DefaultRouter()
router.register(r"movies", MovieViewSet, basename="movie")
router.register(r'users', UserViewSet, basename='user')  

urlpatterns = [
    path("", include(router.urls)),
]
