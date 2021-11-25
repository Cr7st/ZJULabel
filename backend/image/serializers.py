from rest_framework import serializers
from .models import ImageModel


class FileSerializer(serializers.Serializer):
    file = serializers.FileField()
    type = serializers.ChoiceField(choices=[('IMAGE', 'image'), ('VIDEO', 'video')])
