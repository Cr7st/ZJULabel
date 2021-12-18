from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from .serializers import FileUploadSerializer, ImageModelSerializer, ImagePreviewSerializer
from .models import ImageModel
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from PIL import Image

# Create your views here.


def get_images_from_video(video):
    pass


class ImageView(viewsets.ModelViewSet):
    serializer_class = ImageModelSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        return ImageModel.objects.filter(uploader=user)

    @action(methods=['POST'], url_path='upload', detail=False)
    def upload(self, request):
        serializer = FileUploadSerializer(data=request.data)
        print(serializer.initial_data)
        if not serializer.is_valid():
            print(serializer.initial_data)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if serializer.validated_data['type'] == 'IMAGE':
            user = request.user
            image = serializer.validated_data['file']
            name = serializer.validated_data['name']
            ImageModel.objects.create(uploader=user, image=image, name=name)
            return Response(status=status.HTTP_200_OK)
        elif serializer.validated_data['type'] == 'VIDEO':
            user = request.user
            file = serializer.validated_data['file']
            images = get_images_from_video(file)
            for image in images:
                ImageModel.objects.create(uploader=user, image=image)

    @action(methods=['GET'], url_path='pre_list', detail=False)
    def pre_list(self, request):
        queryset = self.get_queryset()
        json = []
        for object in queryset:
            serializer = ImagePreviewSerializer(object)
            json.append(serializer.data)
        print(json)
        return Response(data=json)