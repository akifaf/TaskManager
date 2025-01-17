from django.urls import path
from .views import *

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name ='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name ='token_refresh'),
    path('register/', UserRegister.as_view(), name='user_register')
]
