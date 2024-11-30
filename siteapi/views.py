from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
def usercomments(request, username):
    return render(request, "comments/list.html")