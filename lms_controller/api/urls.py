from django.urls import path
from . import views

urlpatterns = [
    path('', views.main),
    path('users', views.getUsers),
    path('registration/', views.register),
    path('login/', views.login),
    path('courses/', views.list_courses),
    path('joincourse/', views.join_course),
    path('rate/', views.rate),
    path('modules/', views.view_course),
    path('comments/', views.view_comments),
    path('quiz/', views.view_quiz),
    path('writecomment/', views.write_comment),
    path('submitquiz/', views.submit_quiz),
    path('teaching/', views.courses_taught),
    path('deletecourse/', views.delete_course),
    path('createcourse/', views.create_course),
     path('grades/', views.view_grades),
    path('insertuser/', views.insertuser, name = 'insertuser'),

]
