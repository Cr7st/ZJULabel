from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class ImageModel(models.Model):
    id = models.AutoField(primary_key=True)
    uploader = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100, default="default name")
    image = models.ImageField(upload_to="images/")
