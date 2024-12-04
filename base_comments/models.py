from django.db import models

# Create your models here.
class BaseComment(models.Model):
	def user_is_muted(self, User):
		return False