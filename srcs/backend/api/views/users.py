from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


from ..models import User
from ..serializers import UserSerializer


class ListCreateUsersView(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RetrieveUpdateDestroyUsersView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"
