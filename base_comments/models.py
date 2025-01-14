from django.db import models
from django.contrib.auth.models import User


class BaseComment(models.Model):
    def user_is_muted(self, user):
        """
        TODO: Somehow find out why MIT put this is in "BaseComment"
        instead of userprofiles.UserProfile. Perhaps BaseComment handles
        everything comment-related except comments?
        """
        return False
