from django.urls import path

from . import views

app_name = "internalapi"
urlpatterns = [
	path("swf-settings", views.modal_registration, name="modal-registration"),
]