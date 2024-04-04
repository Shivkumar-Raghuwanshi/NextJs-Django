from rest_framework import serializers
from .models import Activity, UserActivity, UserActivityLog
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'is_active']

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'activity', 'completed']
        

class UserActivityLogSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()

    class Meta:
        model = UserActivityLog
        fields = ['id', 'user_activity', 'score', 'created_at', 'started_at', 'ended_at', 'completed']

    def get_completed(self, obj):
        user_activity = UserActivity.objects.get(id=obj.user_activity.id)
        return user_activity.completed