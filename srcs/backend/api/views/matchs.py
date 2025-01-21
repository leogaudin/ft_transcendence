from ..models import Match, User
from django.http import JsonResponse
import json


def add_match(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        left_player_alias = data.get("left_player")
        right_player_alias = data.get("right_player")
        result = data.get("result")
        if not all([left_player_alias, right_player_alias, result]):
            return JsonResponse({"error": "All fields are required"}, status=400)
        try:
            left_player = User.objects.get(alias=left_player_alias)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {left_player_alias} does not exist"},
                status=404,
            )
        try:
            right_player = User.objects.get(alias=right_player_alias)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {right_player_alias} does not exist"},
                status=404,
            )
        # Should a tie be possible?
        # if result[0] == result[1]:
        #     tie ?
        if result[0] > result[1]:
            winner, loser = left_player, right_player
        else:
            winner, loser = right_player, left_player
        match = Match.objects.create(
            left_player=left_player,
            right_player=right_player,
            result=result,
            winner=winner,
            loser=loser,
        )
        return JsonResponse(
            {
                "created": {
                    "id": match.id,
                    "left_user": match.left_player.alias,
                    "right_user": match.right_player.alias,
                    "result": match.result,
                    "winner": match.winner.alias,
                    "loser": match.loser.alias,
                }
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_match(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        match_id = data.get("id")
        if not match_id:
            return JsonResponse({"error": "No ID provided"}, status=400)
        match = Match.objects.get(id=match_id)
        return JsonResponse(
            {
                "id": match.id,
                "left_player": match.left_player.alias,
                "right_player": match.right_player.alias,
                "result": match.result,
                "winner": match.winner.alias,
                "loser": match.loser.alias,
            }
        )
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except User.DoesNotExist:
        return JsonResponse(
            {"error": f"Unable to find match with id {match_id}"}, status=404
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def delete_match(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        match_id = data.get("id")
        if not match_id:
            return JsonResponse({"error": "All fields are required"}, status=400)
        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return JsonResponse(
                {"error": f"Match with id {match_id} does not exist"},
                status=404,
            )
        match.delete()

        return JsonResponse(
            {"success": f"Match with id {match_id} deleted"}, status=200
        )
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
