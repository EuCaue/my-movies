from django.db import models
from django.contrib.auth.models import User


class Movie(models.Model):
    WATCH_STATUS = [
        ("Not Watched", "Not Watched"),
        ("Watching", "Watching"),
        ("Watched", "Watched"),
    ]
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="movies")
    title = models.CharField(max_length=120)
    description = models.TextField()
    release_year = models.IntegerField()
    movie_rating = models.DecimalField(max_digits=3, decimal_places=2)
    favorite = models.BooleanField(default=False)
    watch_status = models.CharField(
        max_length=20, choices=WATCH_STATUS, default="Not Watched"
    )
    created_at = models.DateTimeField(auto_now_add=True)