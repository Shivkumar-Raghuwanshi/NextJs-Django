from django.urls import path, include
from rest_framework import routers
from .views import ActivityViewSet, UserActivityViewSet, UserActivityLogViewSet ,  RegisterView, MyTokenObtainPairView, TrainingModuleView, LeaderboardView, UserScoreView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register('activities', ActivityViewSet)
router.register('user-activities', UserActivityViewSet)
router.register('user-activity-logs', UserActivityLogViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/leaderboard/', LeaderboardView.as_view(), name='api_leaderboard'),
    path('api/user-score/', UserScoreView.as_view(), name='api_user_score'),
    path('api/training/<int:activity_id>/', TrainingModuleView.as_view(), name='training_module'),
]