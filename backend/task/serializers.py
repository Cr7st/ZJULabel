from rest_framework import serializers
from .models import TaskModel, COCODatasetModel


class TaskModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskModel
        fields = ['id', 'name', 'description', 'images', 'status']


class COCODatasetModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = COCODatasetModel
        fields = ['task', 'dataset_file']


class DatasetSubmitSerializer(serializers.Serializer):
    task = serializers.IntegerField()
    json_data = serializers.JSONField()

