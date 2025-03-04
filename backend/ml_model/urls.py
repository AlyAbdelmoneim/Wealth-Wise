from django.urls import path
from .views import predict_income

urlpatterns = [
    path('predict-income/', predict_income, name='predict_income'),
]
