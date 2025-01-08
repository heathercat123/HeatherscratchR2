from django.db import models

# Create your models here.
class BaseComment(models.Model):
	def user_is_muted(self, User): 
		"""
		TODO: Somehow find out why MIT put this is in "BaseComment" instead of userprofiles.UserProfile
		Perhaps BaseComment handles everything comment-related except comments?
		"""
		return False