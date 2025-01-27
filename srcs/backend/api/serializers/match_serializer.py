from rest_framework import serializers
from ..models import Match, User


class MatchSerializer(serializers.ModelSerializer):
    left_player = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="username")
    right_player = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="username")
    winner = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="username")
    loser = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="username")

    class Meta:
        model = Match
        fields = "__all__"
