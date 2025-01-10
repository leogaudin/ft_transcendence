from django.http import HttpResponse
from django.http import JsonResponse


def hello_world(request):
    data = {
        "message": "Hello World!",
        "status": "success",
    }
    return JsonResponse(data)
    # return HttpResponse("Hello, World!")
