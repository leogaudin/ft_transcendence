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
    # TODO:
    # path("add/match/", views.add_match, name="add-match"),
    # path("delete/match/", views.delete_match, name="delete-match"),
    # path("add/tournament/", views.add_tournament, name="add-tournament"),
    # path("delete/tournament/", views.delete_tournament, name="delete-tournament"),
]
