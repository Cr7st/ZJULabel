from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'tasks', views.TaskView, 'task')
router.register(r'datasets/COCO', views.COCODatasetView, 'COCOdataset')
router.register(r'datasets/VOC', views.VOCDatasetViewset, 'VOCdataset')

urlpatterns = [
    path('', include(router.urls)),
]
