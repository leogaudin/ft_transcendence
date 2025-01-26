from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


from ..models import Tournament
from ..serializers import TournamentSerializer


class ListCreateTournamentsView(ListCreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer


class RetrieveUpdateDestroyTournamentsView(RetrieveUpdateDestroyAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"
