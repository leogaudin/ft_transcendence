from ..models import Message, Chat, User
from django.http import JsonResponse
import json


def find_chat(first_user, second_user):
    if first_user.id > second_user.id:
        first_user, second_user = second_user, first_user
    chat = Chat.objects.get(first_user=first_user, second_user=second_user)
    return chat


def add_message(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        sender_alias = data.get("sender")
        receiver_alias = data.get("receiver")
        body = data.get("body")
        if not all([sender_alias, receiver_alias, body]):
            return JsonResponse({"error": "All fields are required"}, status=400)
        try:
            sender = User.objects.get(alias=sender_alias)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {sender_alias} does not exist"},
                status=404,
            )
        try:
            receiver = User.objects.get(alias=receiver_alias)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {receiver_alias} does not exist"},
                status=404,
            )
        chat = find_chat(sender, receiver)
        message = Message.objects.create(chat=chat, sender=sender, body=body)
        return JsonResponse(
            {
                "created": {
                    "id": message.id,
                    "sender": message.sender.alias,
                    "body": message.body,
                }
            },
            status=201,
        )
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def delete_message(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        message_id = data.get("message_id")
        if not message_id:
            return JsonResponse({"error": "All fields are required"}, status=400)
        try:
            message = Message.objects.get(id=message_id)
        except Message.DoesNotExist:
            return JsonResponse(
                {"error": f"Message with id {message_id} does not exist"},
                status=404,
            )
        message.delete()

        return JsonResponse(
            {"success": f"Message with id {message_id} deleted"}, status=200
        )
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
