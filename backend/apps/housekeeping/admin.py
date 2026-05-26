from django.contrib import admin
from .models import SupplyLog, HygieneReport, CleaningTask

admin.site.register(SupplyLog)
admin.site.register(HygieneReport)
admin.site.register(CleaningTask)
