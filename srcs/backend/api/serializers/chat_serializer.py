from rest_framework import serializers
from ..models import Chat, User


class ChatSerializer(serializers.ModelSerializer):
    first_user = serializers.SlugRelatedField(
        queryset=User.objects.all(), slug_field="username"
    )
    second_user = serializers.SlugRelatedField(
        queryset=User.objects.all(), slug_field="username"
    )

    class Meta:
        model = Chat
        fields = "__all__"

    def validate(self, data):
        first_user = data["first_user"]
        second_user = data["second_user"]

        if first_user == second_user:
            raise serializers.ValidationError(
                "First user and second user must be different"
            )
        chat_one = Chat.objects.filter(first_user=first_user, second_user=second_user)
        chat_two = Chat.objects.filter(first_user=second_user, second_user=first_user)
        if chat_one.exists() or chat_two.exists():
            raise serializers.ValidationError(
                "A chat already exists between these users"
            )
        return data
