from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Activity, UserActivity, UserActivityLog
from .serializers import ActivitySerializer, UserActivitySerializer, UserActivityLogSerializer, UserSerializer
from rest_framework.permissions import AllowAny
from .models import do_training
from django.db.models import Sum, Avg, Count
from django.db.models import Q



@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = (AllowAny,)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class UserActivityViewSet(viewsets.ModelViewSet):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer

class UserActivityLogViewSet(viewsets.ModelViewSet):
    queryset = UserActivityLog.objects.all()
    serializer_class = UserActivityLogSerializer


class LeaderboardView(APIView):
    def get(self, request):
        leaderboard_data = UserActivityLog.objects.values(
            'user_activity__user__username'
        ).annotate(
            total_score=Sum('score'), avg_score=Avg('score'), completed_activities=Count('user_activity')
        ).order_by('-total_score')

        leaderboard = []
        for entry in leaderboard_data:
            leaderboard.append({
                'username': entry['user_activity__user__username'],
                'total_score': entry['total_score'],
                'avg_score': entry['avg_score'],
                'completed_activities': entry['completed_activities'],
            })

        return Response(leaderboard, status=status.HTTP_200_OK)
    
    
class UserScoreView(APIView):
    def get(self, request):
        user = request.user
        user_scores = UserActivityLog.objects.filter(user_activity__user=user).values(
            'user_activity__activity__name',
            'user_activity__completed',
        ).annotate(
            total_score=Sum('score'),
            avg_score=Avg('score'),
            completed_activities=Count('user_activity', filter=Q(user_activity__completed=True)),
        )

        if user_scores:
            user_scores = [{
                'username': user.username,
                'activityName': score['user_activity__activity__name'],
                'completed': score['user_activity__completed'],
                'total_score': score['total_score'],
                'avg_score': score['avg_score'],
                'completed_activities': score['completed_activities'],
            } for score in user_scores]
            return Response(user_scores, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No activities completed yet'}, status=status.HTTP_200_OK)


class TrainingModuleView(APIView):
    def post(self, request, activity_id):
        user = request.user
        try:
            user_activity = UserActivity.objects.get(user=user, activity_id=activity_id)
        except UserActivity.DoesNotExist:
            return Response({'error': 'User activity not found'}, status=status.HTTP_404_NOT_FOUND)

        # if user_activity.completed:
        #     return Response({'error': 'Activity already completed'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            score = do_training()
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user_activity_log = UserActivityLog.objects.create(
            user_activity=user_activity,
            score=score,
        )

        # Update the UserActivity instance to set completed=True
        user_activity.completed = True
        user_activity.save()

        # Serialize the UserActivityLog instance
        serializer = UserActivityLogSerializer(user_activity_log)
        data = serializer.data

        return Response(data, status=status.HTTP_201_CREATED)