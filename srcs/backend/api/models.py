from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.contrib.postgres.fields import ArrayField

# Models are classes that contain data


# Anonymize an user when they're deleted
def anonymize():
    return User.objects.get_or_create(username="anonymous")[0]


class User(models.Model):
    username = models.CharField(max_length=255)
    alias = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    # avatar = models.ImageField(upload_to="avatars/") # This needs "Pillow" to be installed
    friends = models.ManyToManyField("self", blank=True, symmetrical=True)
    created = models.DateField(auto_now=True)
    is_online = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)
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

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["username"], name="unique_user"),
        ]

    def __str__(self):
        return self.username


class Tournament(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    players = models.ManyToManyField(User, related_name="tournaments")
    player_amount = models.IntegerField(
        validators=[MinValueValidator(4), MaxValueValidator(16)]
    )

    def __str__(self):
        return (
            f"Tournament {self.name} at {self.date} with {self.player_amount} players"
        )


class Match(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    left_player = models.ForeignKey(
        User, related_name="left_player_matches", on_delete=models.SET(anonymize)
    )
    right_player = models.ForeignKey(
        User, related_name="right_player_matches", on_delete=models.SET(anonymize)
    )
    result = ArrayField(models.IntegerField(), size=2)
    winner = models.ForeignKey(
        User, related_name="won_matches", on_delete=models.SET(anonymize)
    )
    loser = models.ForeignKey(
        User, related_name="lost_matches", on_delete=models.SET(anonymize)
    )
    tournament = models.ForeignKey(
        Tournament,
        related_name="matches",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return (
            f"Match between {self.left_player} and {self.right_player} ({self.result})"
        )


class Chat(models.Model):
    first_user = models.ForeignKey(
        User, related_name="chats_as_first_user", on_delete=models.SET(anonymize)
    )
    second_user = models.ForeignKey(
        User, related_name="chats_as_second_user", on_delete=models.SET(anonymize)
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["first_user", "second_user"], name="unique_chat"
            ),
        ]

    def __str__(self):
        return f"Chat between {self.first_user} and {self.second_user}"


class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(
        User, related_name="messages_sent", on_delete=models.SET(anonymize)
    )
    body = models.CharField(max_length=4096)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.alias} at {self.date}"
