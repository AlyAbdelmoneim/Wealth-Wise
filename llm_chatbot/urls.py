from django.urls import path
from .views import chat_with_model

urlpatterns = [
    path("chat/", chat_with_model, name="chat_with_model"),
]
