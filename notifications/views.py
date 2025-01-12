from django.shortcuts import render


def user_feed(request):
    return render(request, "notifications/includes/user-feed.html")


def notifications(request):
    """
    TODO: Re-create the ScratchR2 messages page and make it work
    """
    return render(request, "notifications/notifications.html")
