from django.db import models


class Customer(models.Model):

    class IDType(models.TextChoices):
        PASSPORT = 'passport',       'Passport'
        NATIONAL_ID = 'national_id',    'National ID'
        DRIVERS_LICENSE = 'drivers_license', "Driver's License"

    class Gender(models.TextChoices):
        MALE = 'male',   'Male'
        FEMALE = 'female', 'Female'
        OTHER = 'other',  'Other'

    # Personal Info
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    gender = models.CharField(
                     max_length=10,
                     choices=Gender.choices,
                     blank=True
                   )
    date_of_birth = models.DateField(null=True, blank=True)

    # ID Document
    id_type = models.CharField(
                     max_length=20,
                     choices=IDType.choices,
                     blank=True
                   )
    id_number = models.CharField(max_length=50, blank=True)

    # Address
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)

    # Meta
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
