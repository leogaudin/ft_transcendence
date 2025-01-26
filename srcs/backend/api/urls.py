from django.urls import path
from . import views

# Here we define the different urls our api has
# Each path needs a route, a function that will be called, and a name to identify it


urlpatterns = [
    path("users/", views.ListCreateUsersView.as_view(), name="user-list-create"),
    path(
        "users/<str:username>/",
        views.RetrieveUpdateDestroyUsersView.as_view(),
        name="user-retrieve-update-destroy",
    ),
    path("chats/", views.ListCreateChatsView.as_view(), name="chat-list-create"),
    path(
        "chats/<int:id>/",
        views.RetrieveUpdateDestroyChatsView.as_view(),
        name="chat-retrieve-update-destroy",
    ),
    path(
        "messages/", views.ListCreateMessagesView.as_view(), name="message-list-create"
    ),
    path(
        "messages/<int:id>/",
        views.RetrieveUpdateDestroyMessagesView.as_view(),
        name="message-retrieve-update-destroy",
    ),
    path("matchs/", views.ListCreateMatchsView.as_view(), name="match-list-create"),
    path(
        "matchs/<int:id>/",
        views.RetrieveUpdateDestroyMatchsView.as_view(),
        name="match-retrieve-update-destroy",
    ),
    path(
        "tournaments/",
        views.ListCreateTournamentsView.as_view(),
        name="tournament-list-create",
    ),
    path(
        "tournaments/<int:id>/",
        views.RetrieveUpdateDestroyTournamentsView.as_view(),
        name="tournament-retrieve-update-destroy",
    ),
]
