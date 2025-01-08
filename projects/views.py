from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
def editor(request, id=None):
	"""
	TODO: Fix tips and don't show the full project page
	"""
	return render(request, "projects/editor.html")