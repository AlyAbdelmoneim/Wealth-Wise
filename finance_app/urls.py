# finance_app/urls.py
from django.urls import path
from .views import get_financial_data

urlpatterns = [
    path('financial-data/', get_financial_data, name='financial_data'),
]
