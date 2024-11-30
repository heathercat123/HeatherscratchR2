from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
def modal_registration(request):
    return render(request, "modal-registration.html")

def check_username(request, username):
	if username == "taken":
		msg = "username exists"
	elif username == "badusername":
		msg = "bad username"
	elif username == "invalid":
		msg = "invalid username"
	else:
		msg = "valid username"
	
	jsonTuple = ('[{"username": ', username, ', "msg": ', msg, '}]')
	json = '"'.join(jsonTuple)
	response = HttpResponse(json, content_type='application/json')
	response['Content-Length'] = len(json)
	return response