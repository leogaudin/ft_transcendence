from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models.fields import related

# Models are classes that contain data


class User(models.Model):
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    # avatar = models.ImageField(upload_to="avatars/") # This needs "Pillow" to be installed
    friends = models.ManyToManyField("self", blank=True, symmetrical=True)
    created = models.DateField(auto_now=True)
    wins = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
        ],
    )
    losses = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
        ],
    )

    def __str__(self):
        return self.alias


class Match(models.Model):
    date = models.DateField(auto_now=True)
    left_player = models.ForeignKey(
        User, related_name="left_player_matches", on_delete=models.CASCADE
    )
    right_player = models.ForeignKey(
        User, related_name="right_player_matches", on_delete=models.CASCADE
    )
    winner = models.ForeignKey(
        User, related_name="won_matches", on_delete=models.CASCADE
    )


class Tournament(models.Model):
    name = models.CharField(max_length=255)
    player_amount = models.IntegerField(
        validators=[MinValueValidator(4), MaxValueValidator(16)]
    )
