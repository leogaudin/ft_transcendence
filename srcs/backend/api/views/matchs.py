from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


from ..models import Match
from ..serializers import MatchSerializer


class ListCreateMatchsView(ListCreateAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


class RetrieveUpdateDestroyMatchsView(RetrieveUpdateDestroyAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    lookup_field = "id"
