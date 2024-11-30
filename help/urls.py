from django.urls import path

from . import views

app_name = "help"
urlpatterns = [
	path("studio/tips/<path:tip>", views.tips, name="tips"),
]