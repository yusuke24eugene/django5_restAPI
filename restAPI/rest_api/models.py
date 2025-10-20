from django.db import models

# Create your models here.
class Gender(models.TextChoices):
    Male = 'M', 'Male'
    Female = 'F', 'Female'

class Person(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    birth_date = models.DateField()
    gender = models.CharField(max_length=1, choices=Gender)
    height_in_cm = models.IntegerField()
    weight_in_kg = models.FloatField()
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    # Method to get full name
    def get_full_name(self):
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"

    # Property for full name
    @property
    def full_name(self):
        return self.get_full_name()