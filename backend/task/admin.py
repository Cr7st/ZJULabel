from django.contrib import admin

# Register your models here.
from .models import TaskModel, COCODatasetModel, VOCDatasetModel

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'uploader', 'name')

class COCODatasetAdmin(admin.ModelAdmin):
    list_display = ('task', 'dataset_file')

class VOCDatasetAdmin(admin.ModelAdmin):
    list_display = ('task', 'image' ,'annotation_file')

# Register your models here.

admin.site.register(TaskModel, TaskAdmin)
admin.site.register(COCODatasetModel, COCODatasetAdmin)
admin.site.register(VOCDatasetModel, VOCDatasetAdmin)
