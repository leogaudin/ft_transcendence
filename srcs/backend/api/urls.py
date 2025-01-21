from django.urls import path
from . import views

# Here we define the different urls our api has
# Each path needs a route, a function that will be called, and a name to identify it

urlpatterns = [
    path("", views.default, name="default"),
    path("add/user/", views.add_user, name="add-user"),
    path("delete/user/", views.delete_user, name="delete-user"),
    path("add/chat/", views.add_chat, name="add-chat"),
    path("delete/chat/", views.delete_chat, name="delete-chat"),
    path("add/message/", views.add_message, name="add-message"),
    path("delete/message/", views.delete_message, name="delete-message"),
    path("add/match/", views.add_match, name="add-match"),
    path("delete/match/", views.delete_match, name="delete-match"),
    path("add/tournament/", views.add_tournament, name="add-tournament"),
    path("delete/tournament/", views.delete_tournament, name="delete-tournament"),
    # TODO:
    # Make sure these return the ID of the given object
    # Otherwise it would be impossible to delete them
    path("get/user/", views.get_user, name="get-user"),
    path("get/chat/", views.get_chat, name="get-chat"),
    path("get/message/", views.get_message, name="get-message"),
    path("get/match/", views.get_match, name="get-match"),
    path("get/tournament/", views.get_tournament, name="get-tournament"),
]
