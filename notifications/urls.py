from django.urls import path

from . import views

app_name = "notifications"
urlpatterns = [
	path("ajax/user-activity/", views.user_feed, name="user_feed"),
]