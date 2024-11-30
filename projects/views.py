from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
def editor(request, id=None):
    return render(request, "projects/editor.html")