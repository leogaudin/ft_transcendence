from rest_framework import serializers
from ..models import Message, User


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="username")

    class Meta:
        model = Message
        fields = "__all__"
