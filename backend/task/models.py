from django.db import models
from django.contrib.auth.models import User
from image.models import ImageModel

# Create your models here.


class TaskModel(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    description = models.TextField()
    uploader = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, default="RUNNING")
    images = models.ManyToManyField(ImageModel, blank=True)


class COCODatasetModel(models.Model):
    task = models.ForeignKey(TaskModel, on_delete=models.SET_NULL, null=True)
    dataset_file = models.FileField(upload_to='datasets/')
