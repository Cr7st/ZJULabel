from django.contrib import admin

# Register your models here.
from .models import TaskModel, COCODatasetModel

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'uploader', 'name')

class COCODatasetAdmin(admin.ModelAdmin):
    list_display = ('task', 'dataset_file')

# Register your models here.

admin.site.register(TaskModel, TaskAdmin)
admin.site.register(COCODatasetModel, COCODatasetAdmin)
