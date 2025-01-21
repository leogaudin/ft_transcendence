from django.http import HttpResponse, JsonResponse
from django.contrib.auth.hashers import make_password
from ..models import User
import json

# These are views, views are functions that get called when you access a url like "localhost:9000/api/"
# They can return HTML content, like "default" or a JSON, like "add_user"


def default(request):
    return HttpResponse("Nothing to see here.")


def add_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get("username")
        alias = data.get("alias")
        password = data.get("password")
        email = data.get("email")

        if not all([username, alias, password, email]):
            return JsonResponse({"error": "All fields are required"}, status=400)
        user = User.objects.create(
            username=username,
            alias=alias,
            password=make_password(password),
            email=email,
        )
        return JsonResponse(
            {
                "id": user.id,
                "username": user.username,
                "alias": user.alias,
                "email": user.email,
                "wins": user.wins,
                "losses": user.losses,
            },
            status=201,
        )
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_user(request, username):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)
    try:
        if not username:
            return JsonResponse({"error": "No name provided"}, status=400)
        user = User.objects.get(username=username)
        return JsonResponse(
            {
                "id": user.id,
                "username": user.username,
                "alias": user.alias,
                "email": user.email,
                "wins": user.wins,
                "losses": user.losses,
            }
        )
    except User.DoesNotExist:
        return JsonResponse(
            {"error": f"Unable to find user name {username}"}, status=404
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def delete_user(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get("username")
        if not username:
            return JsonResponse({"error": "No name provided"}, status=400)
        user = User.objects.get(username=username)
        user.delete()
        return JsonResponse({"success": f"User {username} deleted"}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except User.DoesNotExist:
        return JsonResponse(
            {"error": f"Unable to find user name {username}"}, status=404
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
