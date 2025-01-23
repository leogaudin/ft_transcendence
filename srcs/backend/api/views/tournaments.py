from ..models import Tournament, User
from django.http import JsonResponse
import json


def add_tournament(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        name = data.get("name")
        player_amount = int(data.get("player_amount"))
        player_usernames = data.get("players")
        if not all([name, player_amount, player_usernames]):
            return JsonResponse({"error": "All fields are required"}, status=400)
        players = [None] * player_amount
        for i, player in enumerate(player_usernames):
            if i >= player_amount:
                raise Exception("Too many players for the given tournament.")
            try:
                players[i] = User.objects.get(alias=player_usernames[i])
            except User.DoesNotExist:
                return JsonResponse(
                    {"error": f"User with alias {player_usernames[i]} does not exist"},
                    status=404,
                )
        tournament = Tournament.objects.create(
            name=name,
            player_amount=player_amount,
        )
        tournament.players.set(players)
        return JsonResponse(
            {
                "id": tournament.id,
                "name": tournament.name,
                "player_amount": tournament.player_amount,
                "players": [player.alias for player in tournament.players.all()],
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_tournament(request, id):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)
    try:
        if not id:
            return JsonResponse({"error": "No ID provided"}, status=400)
        tournament = Tournament.objects.get(id=id)
        return JsonResponse(
            {
                "id": tournament.id,
                "name": tournament.name,
                "player_amount": tournament.player_amount,
                "players": [player.username for player in tournament.players.all()],
            }
        )
    except Tournament.DoesNotExist:
        return JsonResponse(
            {"error": f"Unable to find tournament with ID {id}"}, status=404
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def delete_tournament(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        tournament_id = data.get("id")
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
