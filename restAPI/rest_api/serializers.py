from rest_framework import serializers
from .models import Person

class PersonSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Person
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']