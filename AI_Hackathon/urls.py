# AI_Hackathon/urls.py
from django.contrib import admin
from django.urls import path, include
from .views import HomeView, AddUserView, AddTransactionView, FinancialDataView, DisplayDataView, AddEmployeeView, \
    LinkUsersView, AddFixedIncomeView, AddVariableIncomeView, AddWorkExpenseView, AddLuxuryExpenseView, \
    AddLivingExpenseView
from .views import LinkedDataView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', HomeView.as_view(), name='home'),
    path('add-user/', AddUserView.as_view(), name='add_user'),
    path('add-transaction/', AddTransactionView.as_view(), name='add_transaction'),
    path('api/financial-data/', FinancialDataView.as_view(), name='financial_data'),
    path('display-data/', DisplayDataView.as_view(), name='display_data'),

    # path("api/", include("llm_chatbot.urls")),
    # path('ml/', include('ml_model.urls')),
    path('add-employee/', AddEmployeeView.as_view(), name='add_employee'),
 
    path('linked-data/', LinkedDataView.as_view(), name='linked_data'),
    path('link-users/', LinkUsersView.as_view(), name='link_users'),
    path('add-fixed-income/', AddFixedIncomeView.as_view(), name='add_fixed_income'),
    path('add-variable-income/', AddVariableIncomeView.as_view(), name='add_variable_income'),
    path('add-work-expense/', AddWorkExpenseView.as_view(), name='add_work_expense'),
    path('add-luxury-expense/', AddLuxuryExpenseView.as_view(), name='add_luxury_expense'),
    path('add-living-expense/', AddLivingExpenseView.as_view(), name='add_living_expense'),

]