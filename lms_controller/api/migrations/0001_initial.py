# Generated by Django 5.0.3 on 2024-03-20 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uid', models.CharField(max_length=20)),
                ('uname', models.CharField(max_length=100)),
                ('uemail', models.EmailField(max_length=254)),
                ('ucontact', models.CharField(max_length=15)),
            ],
            options={
                'db_table': 'user',
            },
        ),
    ]
