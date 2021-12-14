from rest_framework import serializers
from .models import ImageModel


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    type = serializers.ChoiceField(choices=[('IMAGE', 'image'), ('VIDEO', 'video')])


class ImageModelSerializer(serializers.ModelSerializer):
    type = serializers.ChoiceField(choices=[('IMAGE', 'image'), ('VIDEO', 'video')])

    class Meta:
        model = ImageModel
        fields = ['id', 'uploader', 'image', 'type']
