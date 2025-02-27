# AI_Hackathon/urls.py
from django.contrib import admin
from django.urls import path
from .views import HomeView, AddUserView, AddTransactionView, FinancialDataView, DisplayDataView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', HomeView.as_view(), name='home'),
    path('add-user/', AddUserView.as_view(), name='add_user'),
    path('add-transaction/', AddTransactionView.as_view(), name='add_transaction'),
    path('api/financial-data/', FinancialDataView.as_view(), name='financial_data'),
    path('display-data/', DisplayDataView.as_view(), name='display_data'),
]
