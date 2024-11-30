from django.db import models

# Create your models here.
class Member(models.Model):
  username = models.SlugField(default="", null=False)