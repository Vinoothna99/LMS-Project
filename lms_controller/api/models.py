from django.db import models

# Create your models here.

"""
class User(models.Model):
    uid = models.CharField(max_length=20)
    uname = models.CharField(max_length=100)
    uemail = models.EmailField()
    ucontact = models.CharField(max_length=15)

    class Meta:
        db_table = "user"
"""

# Users Table
class Users(models.Model):
    username = models.CharField(max_length=255, primary_key=True)
    email = models.EmailField(max_length=255)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = "users"

# Roles Table
class Roles(models.Model):
    username = models.ForeignKey(Users, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)

    class Meta:
        db_table = "roles"

# Courses Table
class Courses(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    credits = models.IntegerField()

    class Meta:
        db_table = "courses"

# Enrollment Table
class Enrollment(models.Model):
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    student = models.ForeignKey(Users, on_delete=models.CASCADE)
    enrollment_date = models.DateField()
    status = models.CharField(max_length=50, null=True)

    class Meta:
        db_table = "enrollment"

# Teaches Table
class Teaches(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)

    class Meta:
        db_table = "teaches"

# Modules Table
class Modules(models.Model):
    module_number = models.IntegerField()
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    module_name = models.CharField(max_length=255)

    class Meta:
        db_table = "modules"

# Lessons Table
class Lessons(models.Model):
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    lesson_number = models.IntegerField()
    lesson_name = models.CharField(max_length=255)
    lesson_url = models.CharField(max_length=255)

    class Meta:
        db_table = "lessons"

# Comments Table
class Comments(models.Model):
    comment_date = models.DateField()
    comment_time = models.TimeField()
    comment = models.TextField()

    class Meta:
        db_table = "comments"

# PostedComments Table
class PostedComments(models.Model):
    student = models.ForeignKey(Users, on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comments, on_delete=models.CASCADE)

    class Meta:
        db_table = "postedcomments"

# Quiz Table
class Quiz(models.Model):
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    question_no = models.IntegerField()
    answer_option_no = models.IntegerField()

    class Meta:
        db_table = "quiz"

# Options Table
class AnswerOptions(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question_no = models.IntegerField()
    option_no = models.IntegerField()
    option_text = models.TextField()

    class Meta:
        db_table = "answeroptions"

# Grades Table
class Grades(models.Model):
    student = models.ForeignKey(Users, on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    latest_grade = models.CharField(max_length=50)

    class Meta:
        db_table = "grades"

# TakenQuiz Table
class TakenQuiz(models.Model):
    student = models.ForeignKey(Users, on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    date_taken = models.DateField()
    time_taken = models.TimeField()

    class Meta:
        db_table = "takenquiz"


# Rating Table
class Rating(models.Model):
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    student = models.ForeignKey(Users, on_delete=models.CASCADE)
    rating = models.IntegerField()

    class Meta:
        db_table = "rating"

# AverageRating Table
class AverageRating(models.Model):
    course = models.OneToOneField(Courses, on_delete=models.CASCADE, primary_key=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2)

    class Meta:
        db_table = "averagerating"


