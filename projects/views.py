from django.shortcuts import render


def editor(request, pk=None):
    """
    TODO: Fix tips and don't show the full project page
    """
    return render(request, "projects/editor.html")
