from django.shortcuts import render
from rest_framework import generics

from django.shortcuts import get_object_or_404


from main.models import User
from task.models import Task as TaskModel
from .serializers import TaskSerializer
from main.serializer import UserSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class TaskList(generics.ListCreateAPIView):
    queryset = TaskModel.objects.all()  
    serializer_class = TaskSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        task = TaskModel.objects.filter(user=user)
        return task


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    # permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['user_id']
        task_id = self.kwargs['task_id']

        user = User.objects.get(id=user_id)
        task = TaskModel.objects.get(id=task_id, user=user)

        return task
    
class TaskMarkCompleted(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    # permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['user_id']
        task_id = self.kwargs['task_id']

        user = User.objects.get(id=user_id)
        task = TaskModel.objects.get(id=task_id, user=user)

        task.is_completed = True
        task.save()

        return task
    
class TaskMarkInCompleted(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    # permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['user_id']
        task_id = self.kwargs['task_id']

        user = User.objects.get(id=user_id)
        task = TaskModel.objects.get(id=task_id, user=user)

        task.is_completed = False
        task.save()

        return task
    

class UserList(generics.ListAPIView):

    serializer_class = UserSerializer
    queryset = User.objects.all()
    # permission_classes = [IsAdminUser]

# class UserTask(generics.ListAPIView):

#     serializer_class = TaskSerializer
#     queryset = TaskModel


    