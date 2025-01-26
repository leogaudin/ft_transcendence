from rest_framework import serializers
from ..models import Tournament, User


class TournamentSerializer(serializers.ModelSerializer):
    players = serializers.SlugRelatedField(
        many=True, queryset=User.objects.all(), slug_field="username"
    )

    class Meta:
        model = Tournament
        fields = "__all__"
