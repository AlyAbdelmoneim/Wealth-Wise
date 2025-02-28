# AI_Hackathon/urls.py
from django.contrib import admin
from django.contrib.auth import logout
from django.urls import path, include
from .views import HomeView, AddUserView, AddTransactionView, FinancialDataView, DisplayDataView, chat_with_palm

from .views import HomeView, AddUserView, AddTransactionView, FinancialDataView, DisplayDataView, AddEmployeeView, \
    LinkUsersView, AddFixedIncomeView, AddVariableIncomeView, AddWorkExpenseView, AddLuxuryExpenseView, \
    AddLivingExpenseView, FinancialOperationsView
from .views import LinkedDataView
from .views import ChatbotAPI
from .views import get_financial_data

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', HomeView.as_view(), name='home'),
    path('add-user/', AddUserView.as_view(), name='add_user'),
    path('add-transaction/', AddTransactionView.as_view(), name='add_transaction'),
    path('api/financial-data/', FinancialDataView.as_view(), name='financial_data'),
    path('display-data/', DisplayDataView.as_view(), name='display_data'),
    path('financial-data/', FinancialDataView.as_view(), name='financial_data'),
    # path("api/", include("llm_chatbot.urls")),
    # path('ml/', include('ml_model.urls')),
    # path("chat/", " chat_with_palm"),

    # path("api/", include("llm_chatbot.urls")),
    # path('ml/', include('ml_model.urls')),
    path('add-employee/', AddEmployeeView.as_view(), name='add_employee'),
    path('financial-data/', get_financial_data, name='financial_data'),

    path('linked-data/', LinkedDataView.as_view(), name='linked_data'),
    path('link-users/', LinkUsersView.as_view(), name='link_users'),
    path('add-fixed-income/', AddFixedIncomeView.as_view(), name='add_fixed_income'),
    path('add-variable-income/', AddVariableIncomeView.as_view(), name='add_variable_income'),
    path('add-work-expense/', AddWorkExpenseView.as_view(), name='add_work_expense'),
    path('add-luxury-expense/', AddLuxuryExpenseView.as_view(), name='add_luxury_expense'),
    path('add-living-expense/', AddLivingExpenseView.as_view(), name='add_living_expense'),
    path('financial-operations/', FinancialOperationsView.as_view(), name='financial_operations'),
    path('logout/', logout, name='logout'),
    path('chatbot-api/', ChatbotAPI.as_view(), name='chatbot_api'),

]
