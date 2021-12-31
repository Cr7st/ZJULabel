from rest_framework.response import Response
from django.http import FileResponse
from rest_framework.decorators import action
from rest_framework import status, viewsets
from .serializers import TaskModelSerializer, COCODatasetModelSerializer, DatasetSubmitSerializer
from .models import TaskModel, COCODatasetModel
from django.core.files.base import ContentFile
import json
import os
from backend.settings import MEDIA_ROOT
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
        new_task = TaskModel.objects.create(uploader=user, name=name, description=description)
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

    @action(methods=['GET'], url_path='list_finished', detail=False)
    def list_finished(self, request):
        models = TaskModel.objects.filter(uploader=request.user).filter(status="FINISHED")
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
        print(serializer.initial_data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        json_data = serializer.validated_data['json_data']
        json_data['info']['contributor'] = user.username
        task = TaskModel.objects.get(pk=serializer.validated_data['task'])
        task.status = 'FINISHED'
        task.save()
        json_data['info']['url'] = 'http://localhost:8000/media/datasets/' + json_data['info']['description'].replace(' ', '_') + '_COCO.json'
        file = ContentFile(json.dumps(json_data), name=json_data['info']['description'].replace(' ', '_') + '_COCO.json')
        COCODatasetModel.objects.create(task=task, dataset_file=file)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['GET'], url_path='download', detail=False)
    def download(self, request):
        task_id = int(request.query_params.get('task'))
        if not isinstance(task_id, int):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        file = COCODatasetModel.objects.get(task=task_id).dataset_file
        res = FileResponse(file, as_attachment=True, headers={
            'Access-Control-Expose-Headers': 'Content-Disposition'
        })
        return res


