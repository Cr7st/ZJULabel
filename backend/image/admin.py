from django.contrib import admin

# Register your models here.
from .models import ImageModel

class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'uploader', 'image')

# Register your models here.

admin.site.register(ImageModel, ImageAdmin)