from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

def error404(request, exception):
	context = {}
	return render(request, "404.html", context)
	
def error500(request, exception):
	context = {}
	return render(request, "500.html", context)
	
def homepage(request):
	context = {}
	return render(request, "homepage/index.html", context)

def csrf(request):
	return HttpResponse("")

def session(request):
	return render(request, "session.html")