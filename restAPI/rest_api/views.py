from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Person
from .serializers import PersonSerializer

# Create your views here.
class PersonViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for handling CRUD operations for Person model.
    """
    queryset = Person.objects.all().order_by('-created_at')
    serializer_class = PersonSerializer

    def retrieve(self, request, pk=None):
        """Get a specific person by ID"""
        person = get_object_or_404(Person, pk=pk)
        serializer = self.get_serializer(person)
        return Response(serializer.data)

    def create(self, request):
        """Create a new person"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        """Update an entire person record"""
        person = get_object_or_404(Person, pk=pk)
        serializer = self.get_serializer(person, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        """Partially update a person record"""
        person = get_object_or_404(Person, pk=pk)
        serializer = self.get_serializer(person, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """Delete a person record"""
        person = get_object_or_404(Person, pk=pk)
        person.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        """Custom action to search persons by name"""
        query = request.query_params.get('q', '')
        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if query:
            persons = Person.objects.filter(
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(middle_name__icontains=query)
            )
        else:
            persons = Person.objects.all()
        
        serializer = self.get_serializer(persons, many=True)
        return Response(serializer.data)