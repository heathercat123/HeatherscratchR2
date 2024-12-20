from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson as json
from django.conf import settings

def error404(request, exception):
	return render(request, "404.html")
	
def error500(request, exception):
	return render(request, "500.html")
	
def homepage(request):
	context = {}
	# Test data uses the javascript-style true/false whereas we need the python-style True/False
	# When projects will be stored in the database, Django will automatically fix this for us
	false = False
	true = True
	context["featuredprojects"] = [{"fields": {"view_count": 5, "favorite_count": 4, "remixers_count": 0, "creator": {"username": "Heathercar123", "pk": 147805619, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/147805619.png", "admin": false}, "title": "Fixing Scratch News", "isPublished": true, "datetime_created": "2024-12-16T17:37:50", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/1111465171.png", "visibility": "visible", "love_count": 4, "datetime_modified": "2024-12-16T17:39:48", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/1111465171_100x80.png", "thumbnail": "1111465171.png", "datetime_shared": "2024-12-16T17:39:48", "commenters_count": 0}, "model": "projects.project", "pk": 1111465171}, {"fields": {"view_count": 15, "favorite_count": 1, "remixers_count": 0, "creator": {"username": "Heathercar123", "pk": 147805619, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/147805619.png", "admin": false}, "title": "Modern ScratchR2 with the Alpha CSS", "isPublished": true, "datetime_created": "2024-12-07T15:24:44", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/1107526738.png", "visibility": "visible", "love_count": 3, "datetime_modified": "2024-12-12T12:55:27", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/1107526738_100x80.png", "thumbnail": "1107526738.png", "datetime_shared": "2024-12-07T15:26:32", "commenters_count": 0}, "model": "projects.project", "pk": 1107526738}, {"fields": {"view_count": 37, "favorite_count": 2, "remixers_count": 0, "creator": {"username": "Heathercar123", "pk": 147805619, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/147805619.png", "admin": false}, "title": "So I removed every display:none from main.css...", "isPublished": true, "datetime_created": "2024-12-07T14:46:26", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/1107518042.png", "visibility": "visible", "love_count": 2, "datetime_modified": "2024-12-07T14:48:50", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/1107518042_100x80.png", "thumbnail": "1107518042.png", "datetime_shared": "2024-12-07T14:48:50", "commenters_count": 2}, "model": "projects.project", "pk": 1107518042}, {"fields": {"view_count": 56, "favorite_count": 1, "remixers_count": 0, "creator": {"username": "Heathercar123", "pk": 147805619, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/147805619.png", "admin": false}, "title": "ST did not like my admin discoveries", "isPublished": true, "datetime_created": "2024-12-07T13:15:06", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/1107497234.png", "visibility": "visible", "love_count": 1, "datetime_modified": "2024-12-07T13:24:58", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/1107497234_100x80.png", "thumbnail": "1107497234.png", "datetime_shared": "2024-12-07T13:15:57", "commenters_count": 9}, "model": "projects.project", "pk": 1107497234}]
	# Test data taken from https://scratch.mit.edu/site-api/projects/shared/
	# Those are every shared heathercar123 project as of 19/12/2024
	context["featuredgalleries"] = [{"fields": {"curators_count": 9, "projecters_count": 84, "title": "Epic SCT People", "datetime_created": "2024-01-30T16:42:47", "thumbnail_url": "//scratch.mit.edu/get_image/gallery/34563002_170x100.png", "commenters_count": 100, "datetime_modified": "2024-11-16T00:04:23", "owner": {"username": "DaMLGGGCAT", "pk": 81223966, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/81223966.png", "admin": false}}, "model": "galleries.gallery", "pk": 34222407}]
	# Studios test data taken from https://scratch.mit.edu/site-api/galleries/
	# Yes, I joined a random studio just for this
	# But I edited it so it shows up as Epic SCT People instead
	context["curated"] = context["featuredprojects"]
	context["sds"] = context["featuredprojects"]
	context["remixes"] = context["featuredprojects"]
	context["loves"] = context["featuredprojects"]
	return render(request, "homepage/index.html", context)

def forgot_settings_1(request):
	return render(request, "heather/forgot_settings_1.html")

def forgot_settings_2(request):
	return render(request, "heather/forgot_settings_2.html")

def csrf(request):
	"""
	On the OG HeatherscratchR 2, this function was a stub because
	modern django sets the CSRF cookie automatically.
	However, on Django 1.4, this isn't the case.
	As such, for ScratchR2_PY27, we have to get this working.
	Django seems to not want to give us the CSRF token that we need,
	so everything that uses a POST request is broken unless we disable csrf.
	"""
	response = HttpResponse()
	csrf_token = "placeholder"
	request.META["CSRF_COOKIE"] = csrf_token
	response.set_cookie(settings.CSRF_COOKIE_NAME,
						request.META["CSRF_COOKIE"],
						max_age = 60 * 60 * 24 * 7 * 52,
                        domain=settings.CSRF_COOKIE_DOMAIN,
                        path=settings.CSRF_COOKIE_PATH,
                        secure=settings.CSRF_COOKIE_SECURE
                        )

	return response

def session(request):
	response = HttpResponse(json.dumps({ }, indent=3))
	return response