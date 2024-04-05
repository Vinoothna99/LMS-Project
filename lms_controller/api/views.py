from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
from .models import Users
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status



# Create your views here.
def main(request):
    return HttpResponse("Hello");

def userreg(request):
    return render(request, "../templates/userreg.html", {})

'''def insertuser(request):
    vuid = request.POST['tuid'];
    vuname = request.POST['tuname'];
    vuemail = request.POST['tuemail'];
    vucontact = request.POST['tucontact'];
    us=Users(uid=vuid, uname=vuname, uemail=vuemail, ucontact=vucontact);
    us.save();
    last_query = connection.queries[-1]['sql']
    print(last_query)
    return render(request, '../templates/userreg.html', {}) '''



"""
def insertuser(request):
    
    vuname = request.POST['tuname'];
    vuemail = request.POST['tuemail'];
    vupassword = request.POST['tupassword'];
    cursor = connection.cursor()
    #cursor.execute("INSERT INTO `user` (`uid`, `uname`, `uemail`, `ucontact`) VALUES (vuid, vuname, vuemail, vucontact)")
    cursor.execute("INSERT INTO `users` (`username`, `email`, `password`) VALUES (%s, %s, %s)", [vuname, vuemail, vupassword])
    return render(request, '../templates/userreg.html', {}) 
"""

@api_view(['POST'])
def insertuser(request):
    
    vuname = request.data['tuname'];
    vuemail = request.data['tuemail'];
    vupassword = request.data['tupassword'];
    cursor = connection.cursor()
    #cursor.execute("INSERT INTO `user` (`uid`, `uname`, `uemail`, `ucontact`) VALUES (vuid, vuname, vuemail, vucontact)")
    cursor.execute("INSERT INTO `users` (`username`, `email`, `password`) VALUES (%s, %s, %s)", [vuname, vuemail, vupassword])
    return Response({"message":"User inserted"}) 


@api_view(['GET'])
def getUsers(request):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM `users` ")
    columns = [col[0] for col in cursor.description]
    data = [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]
    return Response(data)


@api_view(['POST'])
def register(request):
    
    vuname = request.data.get('username')
    vuemail = request.data.get('email')
    vupassword = request.data.get('password')
    vrole = request.data.get('role')

    with connection.cursor() as cursor:
        # Check if user or email already exists
        cursor.execute("SELECT * FROM `users` WHERE `username` = %s OR `email` = %s", [vuname, vuemail])
        if cursor.fetchone():
            return Response({"message": "Username or email already exists"}, status=400)

        # Insert into users table
        cursor.execute("INSERT INTO `users` (`username`, `email`, `password`) VALUES (%s, %s, %s)", [vuname, vuemail, vupassword])

        # Insert into role table
        cursor.execute("INSERT INTO `roles` (`username_id`, `role`) VALUES (%s, %s)", [vuname, vrole])

    return Response({"message": "User registered successfully"}, status=201)

@api_view(['POST'])
def login(request):
    vuname = request.data.get('username')
    vpassword = request.data.get('password')

    with connection.cursor() as cursor:
        cursor.execute("SELECT `password`, `role` FROM `users` JOIN `roles` ON `users`.`username` = `roles`.`username_id` WHERE `users`.`username` = %s", [vuname])
        row = cursor.fetchone()

        if row and row[0] == vpassword:
            return Response({"username": vuname, "role": row[1]}, status=200)

    return Response({"message": "Invalid username or password"}, status=400)


@api_view(['GET'])
def list_courses(request):
    # Extract the username from the request query parameters
    username = request.query_params.get('username')


    if not username:
        return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        # Call the stored procedure
        #cursor.callproc('all_courses', [username])
        cursor.execute("CALL all_courses(%s)",[username])


        # Fetch the results from the stored procedure call
        result = cursor.fetchall()


        # If result is empty, return a meaningful response
        if not result:
            return Response({"message": "No courses found for this user"}, status=status.HTTP_404_NOT_FOUND)

        columns = [col[0] for col in cursor.description]
        courses = [dict(zip(columns, row)) for row in result]

    return Response({"courses": courses}, status=status.HTTP_200_OK)



@api_view(['POST'])
def join_course(request):
     #INSERT INTO Enrollment (course_id, enrollment_date, status, student_id)
#VALUES (your_course_id, CURDATE(), 'your_status', 'your_student_id');
    vucourse_id = request.data.get('course_id')
    vustatus = "active"
    vustudent_id = request.data.get('student_id')
    

    with connection.cursor() as cursor:

        # Insert into users table
        cursor.execute("INSERT INTO `enrollment` (`course_id`, `enrollment_date`, `status`, `student_id`) VALUES (%s, CURDATE(), %s,  %s)", [vucourse_id, vustatus, vustudent_id])


    return Response({"message": "User joined course successfully"}, status=201)


@api_view(['POST'])
def rate(request):
    vucourse_id = request.data.get('course_id')
    vurating = request.data.get('rating')
    vustudent_id = request.data.get('student_id')

    with connection.cursor() as cursor:
        # Check if the rating already exists
        cursor.execute("SELECT id FROM rating WHERE course_id = %s AND student_id = %s", [vucourse_id, vucourse_id])
        existing_rating = cursor.fetchone()

        if existing_rating:
            # Update the existing rating
            cursor.execute("UPDATE rating SET rating = %s WHERE course_id = %s AND student_id = %s", [vurating, vucourse_id, vustudent_id])
            action = 'updated'
        else:
            # Insert a new rating
            cursor.execute("INSERT INTO rating (course_id, student_id, rating) VALUES (%s, %s, %s)", [vucourse_id, vustudent_id, vurating])
            action = 'created'

    return Response({"message": f"Rating {action} successfully."}, status=status.HTTP_200_OK)



@api_view(['GET'])
def view_course(request):
    # Extract the username from the request query parameters
    course_title = request.query_params.get('title')
    

    if not course_title:
        return Response({"message": "Course title is required"}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        # Call the stored procedure
        #cursor.callproc('all_courses', [username])
        cursor.execute("SELECT * FROM course_detail WHERE course_title = %s",[course_title])


        # Fetch the results from the stored procedure call
        result = cursor.fetchall()


        # If result is empty, return a meaningful response
        if not result:
            return Response({"message": "No modules found for this course"}, status=status.HTTP_404_NOT_FOUND)

        columns = [col[0] for col in cursor.description]
        courses = [dict(zip(columns, row)) for row in result]

    return Response({"course modules and lessons": courses}, status=status.HTTP_200_OK)


@api_view(['GET'])
def view_comments(request):
    # Extract the username from the request query parameters
    course_title = request.query_params.get('title')
    

    if not course_title:
        return Response({"message": "Course title is required"}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        # Call the stored procedure
        #cursor.callproc('all_courses', [username])
        cursor.execute("SELECT * FROM view_comments WHERE course_title = %s",[course_title])


        # Fetch the results from the stored procedure call
        result = cursor.fetchall()


        # If result is empty, return a meaningful response
        if not result:
            return Response({"message": "No comments found for this course"}, status=status.HTTP_404_NOT_FOUND)

        columns = [col[0] for col in cursor.description]
        comments = [dict(zip(columns, row)) for row in result]

    return Response({"course comments": comments}, status=status.HTTP_200_OK)


@api_view(['GET'])
def view_quiz(request):
    # Extract the username from the request query parameters
    course_title = request.query_params.get('title')
    

    if not course_title:
        return Response({"message": "Course title is required"}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        # Call the stored procedure
        #cursor.callproc('all_courses', [username])
        cursor.execute("SELECT * FROM view_quiz WHERE course_title = %s",[course_title])


        # Fetch the results from the stored procedure call
        result = cursor.fetchall()


        # If result is empty, return a meaningful response
        if not result:
            return Response({"message": "No quiz found for this course"}, status=status.HTTP_404_NOT_FOUND)

        columns = [col[0] for col in cursor.description]
        quiz = [dict(zip(columns, row)) for row in result]

    return Response({"course quiz": quiz}, status=status.HTTP_200_OK)


@api_view(['POST'])
def write_comment(request):
    # Extract the username from the request 
    username = request.data.get('username')
    course_title = request.data.get('title')
    comment = request.data.get('comment')


    if not username or not course_title or not comment:
        return Response({"message": "Username, title, and comment are required"}, status=status.HTTP_400_BAD_REQUEST)


    with connection.cursor() as cursor:
        # Call the stored procedure
        cursor.execute("CALL write_comment(%s, %s, %s)",(username, course_title, comment))


    return Response({"message": "Comment added successfully"}, status=201)


@api_view(['POST'])
def submit_quiz(request):
    # Extract the username from the request 
    username = request.data.get('username')
    course_title = request.data.get('title')
    grade = request.data.get('grade')


    if not username or not course_title or not grade:
        return Response({"message": "Username, title, and grade are required"}, status=status.HTTP_400_BAD_REQUEST)


    with connection.cursor() as cursor:
        # Call the stored procedure
        cursor.execute("CALL submit_quiz(%s, %s, %s)",(username, grade, course_title))


    return Response({"message": "Grade added successfully"}, status=201)




@api_view(['GET'])
def courses_taught(request):
    # Extract the username from the request query parameters
    username = request.query_params.get('username')


    if not username:
        return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        # Call the stored procedure
        #cursor.callproc('all_courses', [username])
        cursor.execute("CALL courses_taught(%s)",[username])


        # Fetch the results from the stored procedure call
        result = cursor.fetchall()


        # If result is empty, return a meaningful response
        if not result:
            return Response({"message": "No courses found for this user"}, status=status.HTTP_404_NOT_FOUND)

        columns = [col[0] for col in cursor.description]
        courses = [dict(zip(columns, row)) for row in result]

    return Response({"courses": courses}, status=status.HTTP_200_OK)



@api_view(['DELETE'])
def delete_course(request):
    # Extract the username from the request query parameters
    course_title = request.query_params.get('title')


    if not course_title:
        return Response({"message": "Course title is required"}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        # Call the stored procedure
        #cursor.callproc('all_courses', [username])
        cursor.execute("CALL delete_course(%s)",[course_title])

    return Response({"message": "Course successfully deleted"}, status=201)


@api_view(['POST'])
def create_course(request):
    # Extract course details from the request
    title = request.data.get('title')
    category = request.data.get('category')
    credits = request.data.get('credits')
    user_id = request.data.get('user_id')
    modules = request.data.get('modules', [])  # Default to empty list if not provided

    if not title or not category or not credits or not user_id:
        return Response({"message": "Course title, category, credits, and user ID are required"}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        # Call the stored procedure to create the course
        cursor.execute("CALL create_course(%s, %s, %s, %s)", (title, category, credits, user_id))

        # Iterate over each module and its lessons to create them
        for module in modules:
            module_number = module.get('module_number')
            module_name = module.get('module_name')
            cursor.execute("CALL create_module(%s, %s, %s)", (module_number, title, module_name))

            for lesson in module.get('lessons', []):  # Default to empty list if not provided
                lesson_number = lesson.get('lesson_number')
                lesson_name = lesson.get('lesson_name')
                lesson_url = lesson.get('lesson_url')
                cursor.execute("CALL create_lesson(%s, %s, %s, %s, %s)", (lesson_number, title, module_name, lesson_name, lesson_url))

    return Response({"message": "Course with modules and lessons created successfully"}, status=status.HTTP_201_CREATED)
