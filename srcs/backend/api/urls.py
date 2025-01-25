from django.urls import path
from .views import UserCreateView, UserListView, UserDetailView, UserDeleteView

# Here we define the different urls our api has
# Each path needs a route, a function that will be called, and a name to identify it

# For the URLS to be REST appropiate, they should work in the following way:
# users/ with GET retrieves all users
# users/ with POST creates a new user
# for these two ^ use ListCreateAPIView in one url path / view
# users/<slug>/ with GET retrieves that user
# users/<slug>/ with DELETE deletes that user
# users/<slug>/ with PUT updates the whole user
# users/<slug>/ with PATCH updates the user in the given field
# for these four ^ use RetrieveUpdateDestroyAPIView in one path / view

urlpatterns = [
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/", UserCreateView.as_view(), name="user-create"), # Change to "users/create/" or something
    path("users/<str:username>/", UserDetailView.as_view(), name="user-detail"),
    path("users/<str:username>/delete/", UserDeleteView.as_view(), name="user-delete"),
    # path("", views.default, name="default"),
    # path("add/user/", views.add_user, name="add-user"),
    # path("add/chat/", views.add_chat, name="add-chat"),
    # path("add/message/", views.add_message, name="add-message"),
    # path("add/match/", views.add_match, name="add-match"),
    # path("add/tournament/", views.add_tournament, name="add-tournament"),
    # path("get/user/<str:username>/", views.get_user, name="get-user"),
    # path("get/chat/<int:id>/", views.get_chat, name="get-chat"),
    # path("get/message/<int:id>/", views.get_message, name="get-message"),
    # path("get/match/<int:id>/", views.get_match, name="get-match"),
    # path("get/tournament/<int:id>/", views.get_tournament, name="get-tournament"),
    # path("delete/user/", views.delete_user, name="delete-user"),
    # path("delete/chat/", views.delete_chat, name="delete-chat"),
    # path("delete/message/", views.delete_message, name="delete-message"),
    # path("delete/match/", views.delete_match, name="delete-match"),
    # path("delete/tournament/", views.delete_tournament, name="delete-tournament"),
]
