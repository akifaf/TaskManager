# Generated by Django 5.1.2 on 2024-10-23 03:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_remove_user_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='username',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]