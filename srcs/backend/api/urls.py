from django.urls import path
from . import views

urlpatterns = [
    path("test/", views.api_test, name="test"),
    path("add-user/", views.add_user, name="add-user"),
]
