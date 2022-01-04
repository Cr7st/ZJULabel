from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from .serializers import FileUploadSerializer, ImageModelSerializer, ImagePreviewSerializer
from .models import ImageModel
from rest_framework.permissions import IsAuthenticated
import datetime, os
from backend.settings import MEDIA_ROOT
import cv2

# Create your views here.


def get_images_from_video(video):
    video_name = datetime.datetime.now().strftime("%Y%m%d%H%M%S") + '_' + video.name.replace(' ', '_').split('.')[0]
    video_abs_path = MEDIA_ROOT + '/' + video_name + '.' + video.name.split('.')[-1]
    print(video_abs_path)
    try:
        with open(video_abs_path, 'wb+') as f:
            f.write(video.read())
    except Exception as e:
        raise e
    vc = cv2.VideoCapture(video_abs_path)
    c = 0
    images = []
    frame_rate = 200  # 帧数截取间隔（每隔200帧截取一帧）
    if vc.isOpened():  # 判断是否正常打开
        try:
            while (True):
                ret, frame = vc.read()
                if (ret):
                    if (c % frame_rate == 0):
                        file_name = video_name + '_' + str(c) + ".jpg"
                        cv2.imencode('.jpg', frame)[1].tofile(MEDIA_ROOT + '/images/' + file_name)
                        images.append(['images/' + file_name, file_name])
                    c += 1
                    cv2.waitKey(0)
                else:
                    # print("所有帧都已经保存完成")
                    break
            vc.release()

        except Exception as e:
            raise e
    else:
        raise Exception("视频打开失败")
    os.remove(video_abs_path)
    return images


class ImageView(viewsets.ModelViewSet):
    serializer_class = ImageModelSerializer
    permission_classes = (IsAuthenticated, )
    queryset = ImageModel.objects.all()

    def list(self, request):
        json = []
        set = ImageModel.objects.filter(uploader=request.user)
        for obj in set:
            serializer = self.serializer_class(obj)
            json.append(serializer.data)
        return Response(data=json)

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
            try:
                images = get_images_from_video(file)
            except Exception as e:
                print(e)
                return Response(status=500, data={'msg': '无法从该文件中截取图片'})
            for image in images:
                print(image)
                ImageModel.objects.create(uploader=user, image=image[0], name=image[1])
            return Response(status=status.HTTP_200_OK, data={'msg': '成功上传并生成截图'})

    @action(methods=['GET'], url_path='pre_list', detail=False)
    def pre_list(self, request):
        queryset = self.get_queryset()
        json = []
        for object in queryset:
            serializer = ImagePreviewSerializer(object)
            json.append(serializer.data)
        print(json)
        return Response(data=json)