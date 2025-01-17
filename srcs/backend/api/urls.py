from django.urls import path
from . import views

# Here we define the different urls our api has
# Each path needs a route, a function that will be called, and a name to identify it

urlpatterns = [
    path("", views.default, name="default"),
    path("add-user/", views.add_user, name="add-user"),
    path("delete-user/", views.delete_user, name="delete-user"),
    path("add-chat/", views.add_chat, name="add-chat"),
]
