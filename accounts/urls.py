from django.urls import path

from . import views

app_name = "accounts"
urlpatterns = [
	path("modal-registration", views.modal_registration, name="modal-registration"),
	path("check_username/<str:username>/", views.check_username, name="check_username"),
]