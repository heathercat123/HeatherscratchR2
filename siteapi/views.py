from django.shortcuts import render


def usercomments(request, username):
    return render(request, "comments/list.html")
