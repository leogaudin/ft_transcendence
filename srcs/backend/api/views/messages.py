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
        sender_username = data.get("sender")
        receiver_username = data.get("receiver")
        body = data.get("body")
        if not all([sender_username, receiver_username, body]):
            return JsonResponse({"error": "All fields are required"}, status=400)
        try:
            sender = User.objects.get(username=sender_username)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {sender_username} does not exist"},
                status=404,
            )
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with alias {receiver_username} does not exist"},
                status=404,
            )
        chat = find_chat(sender, receiver)
        message = Message.objects.create(chat=chat, sender=sender, body=body)
        return JsonResponse(
            {
                "id": message.id,
                "sender": message.sender.username,
                "body": message.body,
            },
            status=201,
        )
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_message(request, id):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)
    try:
        if not id:
            return JsonResponse({"error": "No ID provided"}, status=400)
        message = Message.objects.get(id=id)
        return JsonResponse(
            {
                "id": message.id,
                "sender": message.sender.alias,
                "date": message.date,
                "body": message.body,
            }
        )
    except Message.DoesNotExist:
        return JsonResponse(
            {"error": f"Unable to find message with id {id}"}, status=404
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def delete_message(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE requests are allowed"}, status=405)
    try:
        data = json.loads(request.body)
        message_id = data.get("id")
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
