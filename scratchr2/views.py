from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson as json
from django.conf import settings

def error404(request, exception):
	return render(request, "404.html")
	
def error500(request, exception):
	return render(request, "500.html")
	
def homepage(request):
	return render(request, "homepage/index.html")

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