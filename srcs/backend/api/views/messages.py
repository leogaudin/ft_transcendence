from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


from ..models import Message
from ..serializers import MessageSerializer


class ListCreateMessagesView(ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class RetrieveUpdateDestroyMessagesView(RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    lookup_field = "id"
