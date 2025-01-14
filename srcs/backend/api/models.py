from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

# Models are classes that contain data


class User(models.Model):
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    # avatar = models.ImageField(upload_to="avatars/") # This needs "Pillow" to be installed
    friends = models.ManyToManyField("self", blank=True, symmetrical=True)
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


class Tournament(models.Model):
    name = models.CharField(max_length=255)
    playerAmount = models.IntegerField(
        validators=[MinValueValidator(4), MaxValueValidator(16)]
    )
