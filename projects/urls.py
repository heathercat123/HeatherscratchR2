from django.urls import path

from . import views

app_name = "projects"
urlpatterns = [
	path("<int:id>/editor/", views.editor, name="editor"),
	path("editor/", views.editor, name="editor"),
]