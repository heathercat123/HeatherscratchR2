from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def modal_registration(request): # TODO: Make it create a new account
    return render(request, "modal-registration.html")

def verify_email_popup(request): # LOGINONLYTODO: Redirect to login page when logged out
	return render(request, "email_verification/includes/verify_email_popup.html")

def check_username(request, username):
	if username == "taken": # TODO: Turn this into an actual filter
		msg = "username exists"
	elif username == "badusername":
		msg = "bad username"
	elif username == "invalid":
		msg = "invalid username"
	else:
		msg = "valid username"

	json = '[{"username": "' + username + '", "msg": "' + msg + '"}]'
	response = HttpResponse(json, content_type='application/json')
	response['Content-Length'] = len(json)
	return response
