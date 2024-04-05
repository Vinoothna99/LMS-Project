from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
from .models import Users
from rest_framework.response import Response
from rest_framework.decorators import api_view



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


