from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, "mystuff/studio.html",{
	'projects_count': 'PLACEHOLDER',
	'shared_count': 'PLACEHOLDER',
	'notshared_count': 'PLACEHOLDER',
	'gallery_count': 'PLACEHOLDER',
	})