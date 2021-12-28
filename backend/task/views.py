from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from .serializers import TaskModelSerializer, COCODatasetModelSerializer, DatasetSubmitSerializer
from .models import TaskModel, COCODatasetModel
from django.contrib.auth.models import User
import json
from backend.settings import STATIC_URL
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class TaskView(viewsets.ModelViewSet):
    queryset = TaskModel.objects.all()
    serializer_class = TaskModelSerializer
    permission_classes = (IsAuthenticated, )

    @action(methods=['POST'], url_path='publish', detail=False)
    def publish(self, request):
        serializer = TaskModelSerializer(data=request.data)
        print(serializer.initial_data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        print(serializer.validated_data)
        user = request.user
        images = serializer.validated_data['images']
        name = serializer.validated_data['name']
        description = serializer.validated_data['description']
        end_date = serializer.validated_data['end_date']
        new_task = TaskModel.objects.create(uploader=user, name=name, description=description, end_date=end_date)
        new_task.images.set(images)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['GET'], url_path='list_mine', detail=False)
    def list_mine(self, request):
        models = TaskModel.objects.filter(uploader=request.user)
        data_list = []
        for model in models:
            serializer = self.serializer_class(instance=model)
            data_list.append(serializer.data)
        return Response(data_list)


class COCODatasetView(viewsets.ModelViewSet):
    queryset = COCODatasetModel.objects.all()
    serializer_class = COCODatasetModelSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        serializer = DatasetSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        user = User.objects.get(pk=user)
        json_data = serializer.validated_data['json_data']
        json_data['info']['contributor'] = user.username
        task = TaskModel.object.get(pk=serializer.validated_data['task'])
        with open(STATIC_URL + json_data['info']['description'].replace(' ', '_') + '_COCO.json', 'w') as f:
            json.dump(json_data, f)
        COCODatasetModel.object.create(task=task, dataset_file=f)
        return Response(status=status.HTTP_200_OK)

