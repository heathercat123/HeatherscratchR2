from django.urls import path

from . import views

app_name = "site-api"
urlpatterns = [
	path("comments/user/<str:username>/", views.usercomments, name="usercomments"),
]