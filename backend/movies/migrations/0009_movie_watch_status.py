# Generated by Django 5.1.4 on 2024-12-23 18:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0008_movie_favorite'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='watch_status',
            field=models.CharField(choices=[('Not Watched', 'Not Watched'), ('Watching', 'Watching'), ('Watched', 'Watched')], default='Not Watched', max_length=20),
        ),
    ]
