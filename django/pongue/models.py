from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

# Create your models here.
class PongueUser(AbstractUser):

	class Status(models.TextChoices):
		ONLINE = 'ON', _('Online')
		OFFLINE = 'OFF', _('Offline')
		LGAME = 'L_GAME', _('Looking for a game')
		LTOURNAMENT ='L_TOURNAMENT', _('Looking for a tournament')
		INGAME = 'IN_GAME', _('Playing a game')
		INTOURNAMENT = 'IN_TOURNAMENT', _('Registered on a tournament')

	id = models.AutoField(primary_key=True)
	username = models.CharField(max_length=50, unique=True, verbose_name="Username")
	access_token = models.CharField(max_length=50, blank=True, verbose_name="Token")
	display_name = models.CharField(max_length=50, verbose_name="Display name")
	created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created at")
	updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")
	avatar_base64 = models.TextField(default="", blank=True, verbose_name="Avatar")
	status = models.CharField(max_length=25, choices=Status.choices, default=Status.OFFLINE, verbose_name="Status")
	# status = models.CharField(max_length=50, default="offline", verbose_name="Status")
	games_won = models.IntegerField(default=0, verbose_name="Wins")
	games_lost = models.IntegerField(default=0, verbose_name="Losses")
	games_played = models.IntegerField(default=0, verbose_name="Games played")
	tournaments = models.IntegerField(default=0, verbose_name="Tournaments played")
	has_2fa = models.BooleanField(default=False, verbose_name="2FA activated")
	from_42 = models.BooleanField(default=False, verbose_name="42 User")
	friends = models.CharField(max_length=1000, default="", verbose_name="Friends")
	# friends = models.ManyToManyField('self', related_name="Friends", symmetrical=False, verbose_name="Friends")
	points = models.BigIntegerField(default=0, verbose_name="Ranking points")

	class Meta:
		db_table = "Users"
		verbose_name = "User"
		verbose_name_plural = "Users"

	def __str__(self):
		return self.username

	REQUIRED_FIELDS = ["display_name"]

class GameResults(models.Model):
	id = models.AutoField(primary_key=True)
	player_1 = models.ForeignKey(PongueUser, on_delete=models.CASCADE, related_name="player_1")
	player_2 = models.ForeignKey(PongueUser, on_delete=models.CASCADE, related_name="player_2")
	player_1_score = models.IntegerField(verbose_name="Player 1 Score")
	player_2_score = models.IntegerField(verbose_name="Player 2 Score")
	created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created at")
	updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")

	class Meta:
		db_table = "Results"
		verbose_name = "Result"
		verbose_name_plural = "Results"

	def __str__(self):
		return f"{self.player_1} vs {self.player_2} - {self.player_1_score} - {self.player_2_score}"

