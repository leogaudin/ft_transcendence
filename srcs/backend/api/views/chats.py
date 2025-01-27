from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


from ..models import Chat
from ..serializers import ChatSerializer


class ListCreateChatsView(ListCreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer


class RetrieveUpdateDestroyChatsView(RetrieveUpdateDestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    lookup_field = "id"
