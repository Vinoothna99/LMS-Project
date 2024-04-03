from django.urls import path
from .views import main, userreg, getUsers
from . import views

urlpatterns = [
    path('', main),
    path('users', getUsers),
    path('registration/', userreg, name='userreg'),
    path('insertuser/', views.insertuser, name = 'insertuser'),
]
