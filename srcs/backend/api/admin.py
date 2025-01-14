from django.contrib import admin
from .models import User

# We register our models here so we can access them in the admin panel ("localhost:9000/admin")
# Only authorized users can access the admin panel

admin.site.register(User)
