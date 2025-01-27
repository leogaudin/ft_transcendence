from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection


class Command(BaseCommand):
    help = "Drops and resets the PostgreSQL database"

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            print("Dropping current database...")
            cursor.execute("DROP SCHEMA public CASCADE;")
            print("Creating new database...")
            cursor.execute("CREATE SCHEMA public;")
        call_command("migrate")
