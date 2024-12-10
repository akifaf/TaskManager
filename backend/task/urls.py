from django.urls import path
from .views import *


urlpatterns = [
    path('<int:user_id>/', TaskList.as_view(), name='task_list'),
    path('task-detail/<int:user_id>/<int:task_id>/', TaskDetailView.as_view(), name='task-detail'),
    path('task-mark-as-completed/<int:user_id>/<int:task_id>/', TaskMarkCompleted.as_view(), name='task-detail'),
    path('task-mark-as-incompleted/<int:user_id>/<int:task_id>/', TaskMarkInCompleted.as_view(), name='task-detail'),

    path('user-list', UserList.as_view(), name='user_list')
]
