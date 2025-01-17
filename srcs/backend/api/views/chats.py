from ..models import Chat, User
from django.http import JsonResponse
import json


def add_chat(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            first_user_alias = data.get("first_user")
            second_user_alias = data.get("second_user")
            if not all([first_user_alias, second_user_alias]):
                return JsonResponse({"error": "All fields are required"}, status=400)
            try:
                first_user = User.objects.get(alias=first_user_alias)
            except User.DoesNotExist:
                return JsonResponse(
                    {"error": f"User with alias {first_user_alias} does not exist"},
                    status=404,
                )
            try:
                second_user = User.objects.get(alias=second_user_alias)
            except User.DoesNotExist:
                return JsonResponse(
                    {"error": f"User with alias {second_user_alias} does not exist"},
                    status=404,
                )
            chat = Chat.objects.create(first_user=first_user, second_user=second_user)
            return JsonResponse(
                {
                    "created": {
                        "id": chat.id,
                        "first_user": chat.first_user.alias,
                        "second_user": chat.second_user.alias,
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
