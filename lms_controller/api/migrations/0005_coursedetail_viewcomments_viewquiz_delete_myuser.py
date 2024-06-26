# Generated by Django 5.0.3 on 2024-04-05 03:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_myuser'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_title', models.CharField(max_length=255)),
                ('module_number', models.IntegerField()),
                ('module_name', models.CharField(max_length=255)),
                ('lesson_number', models.IntegerField()),
                ('lesson_name', models.CharField(max_length=255)),
                ('lesson_url', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'course_detail',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ViewComments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_title', models.CharField(max_length=255)),
                ('username', models.CharField(max_length=255)),
                ('user_role', models.CharField(max_length=50)),
                ('comment_date', models.DateField()),
                ('comment', models.TextField()),
            ],
            options={
                'db_table': 'view_comments',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ViewQuiz',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_title', models.CharField(max_length=255)),
                ('question_number', models.IntegerField()),
                ('answer_option_number', models.IntegerField()),
                ('option_text', models.TextField()),
            ],
            options={
                'db_table': 'view_quiz',
                'managed': False,
            },
        ),
        migrations.DeleteModel(
            name='MyUser',
        ),
    ]
