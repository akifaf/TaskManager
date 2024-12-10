from rest_framework import serializers
from .models import Task
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from main.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'user', 'title', 'description', 'created_at', 'updated_at', 'is_completed']
        

@receiver(post_save, sender=Task)
def task_update_receiver(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    group_name = f'user_{instance.user_id}'

    try:
        # Serialize the updated task instance
        task = Task.objects.filter(user_id=instance.user_id)
        serialized_task = TaskSerializer(task, many=True).data

        # Send the serialized task to the group
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'task_update',
                'payload': serialized_task
            }
        )
    except Exception as e:
        print(f"Error sending task update: {e}")

@receiver(post_delete, sender=Task)
def task_delete_receiver(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    group_name = f'user_{instance.user_id}'

    try:
        # Serialize the updated task instance
        task = Task.objects.filter(user_id=instance.user_id)
        serialized_task = TaskSerializer(task, many=True).data

        # Send the serialized task to the group
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'task_update',
                'payload': serialized_task
            }
        )
    except Exception as e:
        print(f"Error sending task update: {e}")