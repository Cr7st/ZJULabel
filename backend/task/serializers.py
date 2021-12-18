from rest_framework import serializers
from .models import TaskModel


class TaskModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskModel
        fields = ['name', 'description', 'images', 'end_date']


class CreateTaskSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=64)
    description = serializers.CharField(max_length=200)
    images_id = serializers.ListField()
    end_date = serializers.DateField()
