from ..models import Tournament, User
from django.http import JsonResponse
import json


def add_tournament(request):  # TEST:
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            player_amount = data.get("player_amount")
            player_aliases = data.get("players")
            if not all([name, player_amount, player_aliases]):
                return JsonResponse({"error": "All fields are required"}, status=400)
            players = []
            for i in enumerate(player_aliases):
                if i > player_amount:
                    raise Exception("Too many players for the given tournament.")
                try:
                    players[i] = User.objects.get(alias=player_aliases[i])
                except User.DoesNotExist:
                    return JsonResponse(
                        {
                            "error": f"User with alias {player_aliases[i]} does not exist"
                        },
                        status=404,
                    )
            tournament = Tournament.objects.create(
                name=name,
                player_amount=player_amount,
                players=players,  # Does this work like this?
            )
            return JsonResponse(
                {
                    "created": {
                        "id": tournament.id,
                        "name": tournament.name,
                        "player_amount": tournament.player_amount,
                        "players": tournament.players.alias,  # Also this?
                    }
                },
                status=201,
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)


def delete_tournament(request):  # TEST:
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)
            tournament_id = data.get("tournament_id")
            if not tournament_id:
                return JsonResponse({"error": "All fields are required"}, status=400)
            try:
                tournament = Tournament.objects.get(id=tournament_id)
            except Tournament.DoesNotExist:
                return JsonResponse(
                    {"error": f"Tournament with id {tournament_id} does not exist"},
                    status=404,
                )
            tournament.delete()

            return JsonResponse(
                {"success": f"Tournament with id {tournament_id} deleted"}, status=200
            )
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    else:
        return JsonResponse({"error": "Only DELETE requests are allowed"}, status=405)
