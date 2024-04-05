from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('loginregister',index),
    path('comments',index),
    path('courses',index),
    path('coursesteaching',index),
    path('coursestaken',index),
    path('course',index),
    path('createcourse',index),
    path('student',index),
    path('instructor',index),
    path('quiz',index)
]