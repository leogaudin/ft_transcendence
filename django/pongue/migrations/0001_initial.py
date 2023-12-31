# Generated by Django 4.2.3 on 2023-11-19 15:29

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('access_token', models.CharField(max_length=50, blank=True)),
                ('display_name', models.CharField(max_length=50)),
                ('username', models.CharField(max_length=50)),
                ('password', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('avatar_base64', models.TextField(default='',blank=True)),
                ('status', models.CharField(default='offline', max_length=50)),
                ('games_won', models.IntegerField(default=0)),
                ('games_lost', models.IntegerField(default=0)),
                ('games_played', models.IntegerField(default=0)),
                ('has_2fa', models.BooleanField(default=False)),
            ],
        ),
    ]
