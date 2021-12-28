from django.contrib import admin

# Register your models here.
from .models import TaskModel

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'uploader', 'name')

# Register your models here.

admin.site.register(TaskModel, TaskAdmin)
