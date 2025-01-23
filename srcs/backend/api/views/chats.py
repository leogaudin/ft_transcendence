from ..models import Chat, User
from django.http import JsonResponse
import json


def add_chat(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        first_user_username = data.get("first_user")
        second_user_username = data.get("second_user")
        if not all([first_user_username, second_user_username]):
            return JsonResponse({"error": "All fields are required"}, status=400)
        try:
            first_user = User.objects.get(username=first_user_username)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {first_user_username} does not exist"},
                status=404,
            )
        try:
            second_user = User.objects.get(username=second_user_username)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {second_user_username} does not exist"},
                status=404,
            )
        if first_user.id > second_user.id:
            first_user, second_user = second_user, first_user
        chat = Chat.objects.create(first_user=first_user, second_user=second_user)
        return JsonResponse(
            {
                "id": chat.id,
                "first_user": chat.first_user.username,
                "second_user": chat.second_user.username,
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_chat(request, id):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)
    try:
        if not id:
            return JsonResponse({"error": "No ID provided"}, status=400)
        chat = Chat.objects.get(id=id)
        return JsonResponse(
            {
                "id": chat.id,
                "first_user": chat.first_user.username,
                "second_user": chat.second_user.username,
                "created_at": chat.created_at,
            }
        )
    except Chat.DoesNotExist:
        return JsonResponse({"error": f"Unable to find chat with id {id}"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def delete_chat(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        first_user_username = data.get("first_user")
        second_user_username = data.get("second_user")
        if not all([first_user_username, second_user_username]):
            return JsonResponse({"error": "All fields are required"}, status=400)
        try:
            first_user = User.objects.get(username=first_user_username)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {first_user_username} does not exist"},
                status=404,
            )
        try:
            second_user = User.objects.get(username=second_user_username)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {second_user_username} does not exist"},
                status=404,
            )

        if first_user.id > second_user.id:
            first_user, second_user = second_user, first_user
        chat = Chat.objects.get(first_user=first_user, second_user=second_user)
        chat.delete()

        return JsonResponse(
            {
                "success": f"Chat between {first_user_username} and {second_user_username} deleted"
            },
            status=200,
        )
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
