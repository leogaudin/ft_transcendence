from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.hashers import make_password
from ..models import User
import json

# These are views, views are functions that get called when you access a url like "localhost:9000/api/test/"
# They can return HTML content, like "api_test" or a JSON, like "add_user"


def api_test(request):
    return HttpResponse("Hello world!")


def add_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            alias = data.get("alias")
            password = data.get("password")
            email = data.get("email")

            if not all([name, alias, password, email]):
                return JsonResponse({"error": "All fields are required"}, status=400)
            user = User.objects.create(
                name=name,
                alias=alias,
                password=make_password(password),
                email=email,
            )
            return JsonResponse(
                {
                    "id": user.id,
                    "name": user.name,
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
    else:
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)
