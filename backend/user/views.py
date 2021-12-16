from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

# Create your views here.


class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(methods=['POST'], url_path='register', detail=False)
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.data['username']
            password = serializer.data['password']
            email = serializer.data['email']
            user = User.objects.create_user(username=username, email=email, password=password)
            if user.is_active:
                login(request, user)
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['POST'], url_path='login', detail=False)
    def login(self, request):
        serializer = UserSerializer(data=request.data)
        print(request.data)
        if 'username' not in serializer.initial_data or 'password' not in serializer.initial_data:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        username = serializer.initial_data['username']
        password = serializer.initial_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_200_OK, data='login fail')

    @action(methods=['GET'], url_path='logout', detail=False)
    def logout(self, request):
        logout(request)
        request.session.delete()
        return Response(status=status.HTTP_200_OK)
