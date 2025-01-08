from django.shortcuts import render

# Create your views here.
def user_feed(request):
    return render(request, "notifications/includes/user-feed.html")

def notifications(request):
	"""
	TODO: Make re-create the ScratchR2 messages page and make it work
	"""
	return render(request, "notifications/notifications.html")