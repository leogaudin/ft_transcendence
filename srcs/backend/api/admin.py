from django.contrib import admin
from .models import User, Match, Tournament

# We register our models here so we can access them in the admin panel ("localhost:9000/admin")
# Only authorized users can access the admin panel

admin.site.register(User)
admin.site.register(Match)
admin.site.register(Tournament)
