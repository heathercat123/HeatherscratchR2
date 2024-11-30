from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class ScratchUser(models.Model):
    user = models.OneToOneField(User)
    is_ip_banned = models.BooleanField('Is IP Banned', default=False)