from rest_framework import serializers
from .models import ImageModel


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    type = serializers.ChoiceField(choices=[('IMAGE', 'image'), ('VIDEO', 'video')])
    name = serializers.CharField(max_length=100)


class ImageModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageModel
        fields = ['id', 'image', 'name']
