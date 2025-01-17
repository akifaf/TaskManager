# tasks/utils.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_task_update(data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'task_updates',
        {
            'type': 'task_update',
            'message': data
        }
    )
