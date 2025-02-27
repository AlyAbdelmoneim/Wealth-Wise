"""
URL configuration for AI_Hackathon project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# AI_Hackathon/urls.py
from django.contrib import admin
from django.urls import path, include

from AI_Hackathon.views import home, display_data

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', home, name='home'),
    path('display-data/', display_data, name='display_data'),

    path('ml/', include('ml_model.urls')),

    path("api/", include("llm_chatbot.urls")),

]