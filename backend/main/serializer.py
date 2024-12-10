from rest_framework import serializers
from main.models import User
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'username', 'is_superuser']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True, 'allow_blank': False}
        }

    def validate_email(self, value):
        # Check if email format is valid
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise serializers.ValidationError("Invalid email format.")
        
        # Check if email is unique
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        return value

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        if not re.match("^[A-Za-z ]+$", value):
            raise serializers.ValidationError("First name can only contain alphabetic characters.")
        return value

    def validate_last_name(self, value):
        if value and not re.match("^[A-Za-z ]+$", value):
            raise serializers.ValidationError("Last name can only contain alphabetic characters.")
        return value
    
    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must contain atleast 6 character.")
        return value
        
    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        if 'password' in validated_data:
            user.set_password(validated_data['password'])
        user.save()
        return user
