from django.db import models
from django.contrib.auth.models import User
from image.models import ImageModel

# Create your models here.


class TaskModel(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    description = models.TextField()
    uploader = models.ForeignKey(User, on_delete=models.CASCADE)
    end_date = models.DateField()
    images = models.ManyToManyField(ImageModel, blank=True)
