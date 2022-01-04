from rest_framework import serializers
from .models import TaskModel, COCODatasetModel, VOCDatasetModel


class TaskModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskModel
        fields = ['id', 'name', 'description', 'images', 'status']


class COCODatasetModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = COCODatasetModel
        fields = ['task', 'dataset_file']


class COCODatasetSubmitSerializer(serializers.Serializer):
    task = serializers.IntegerField()
    json_data = serializers.JSONField()


class VOCDatasetModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = VOCDatasetModel
        fields = '__all__'
