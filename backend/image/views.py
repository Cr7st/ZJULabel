from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from .serializers import FileSerializer
from django.contrib.auth.models import User
from .models import ImageModel
from django.contrib.auth.decorators import login_required

# Create your views here.


def get_images_from_video(video):
    pass


class ImageView(viewsets.ModelViewSet):
    queryset = ImageModel.objects.all()
    serializer_class = FileSerializer

    @login_required
    @action(methods=['POST'], url_path='upload/', detail=False)
    def upload(self, request):
        serializer = FileSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if serializer.data['type'] == 'IMAGE':
            user = request.user
            image = serializer.data['file']
            ImageModel.objects.create(uploader=user, image=image)
