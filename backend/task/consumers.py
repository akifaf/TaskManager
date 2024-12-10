import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Task as TaskModel
from .serializers import TaskSerializer

class TaskConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f'user_{self.room_name}'

        # Add the user to the WebSocket group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        self.accept()

        # Fetch tasks and send them as JSON
        try:
            tasks = TaskModel.give_task_details(self.room_name)
            serialized_tasks = TaskSerializer(tasks, many=True).data
            self.send(text_data=json.dumps({
                'payload': serialized_tasks
            }))
        except Exception as e:
            self.send(text_data=json.dumps({
                'error': 'Failed to fetch tasks'
            }))

    def receive(self, text_data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'task_update',
                'payload': text_data
            }
        )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def task_update(self, event):
        self.send(text_data=json.dumps({
            'payload': event['payload']
        }))
