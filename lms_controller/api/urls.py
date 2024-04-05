from django.urls import path
from .views import main, getUsers, register, login
from . import views

urlpatterns = [
    path('', main),
    path('users', getUsers),
    path('registration/', register),
    path('login/', login),
    path('insertuser/', views.insertuser, name = 'insertuser'),
]
