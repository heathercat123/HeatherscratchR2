from django.shortcuts import render

# Create your views here.
def user_feed(request):
    return render(request, "notifications/includes/user-feed.html")