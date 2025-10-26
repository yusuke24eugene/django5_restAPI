import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import './List.css';

const List = () => {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);

    // API base URL - adjust according to your Django server
    const API_BASE_URL = 'http://localhost:8000';

    // Fetch all persons
    const fetchPersons = async (query = '') => {
        try {
        setLoading(true);
        let url = `${API_BASE_URL}/persons/`;
        
        if (query) {
            url = `${API_BASE_URL}/persons/search/?q=${encodeURIComponent(query)}`;
        }
        
        const response = await axios.get(url);
        setPersons(response.data);
        setError('');
        } catch (err) {
        setError('Failed to fetch persons');
        console.error('Error fetching persons:', err);
        } finally {
        setLoading(false);
        }
    };

    // Delete a person
    const deletePerson = async (personId) => {
        if (!window.confirm('Are you sure you want to delete this person?')) {
        return;
        }

        try {
        setDeleteLoading(personId);
        await axios.delete(`${API_BASE_URL}/persons/${personId}/`);
        
        // Remove the deleted person from state
        setPersons(persons.filter(person => person.id !== personId));
        setError('');
        } catch (err) {
        setError('Failed to delete person');
        console.error('Error deleting person:', err);
        } finally {
        setDeleteLoading(null);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchPersons(searchQuery);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery('');
        fetchPersons();
    };

    // Fetch persons on component mount
    useEffect(() => {
        fetchPersons();
    }, []);

    if (loading) {
        return (
        <div className="container">
            <div className="loading">Loading persons...</div>
        </div>
        );
    }

    return (
    <div className="container">
      <div className="page-header">
        <h1>Person List</h1>
        <Link to="/create-person" className="btn btn-primary">
          Create New Person
        </Link>
      </div>

      {/* Search Form */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {searchQuery && (
            <button 
              type="button" 
              onClick={handleClearSearch}
              className="btn btn-outline"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Persons List */}
      {persons.length === 0 ? (
        <div className="empty-state">
          <p>No persons found.</p>
          <Link to="/create-person" className="btn btn-primary">
            Create First Person
          </Link>
        </div>
      ) : (
        <div className="persons-grid">
          {persons.map((person) => (
            <div key={person.id} className="person-card">
              <div className="person-info">
                <h3>
                  {person.first_name} 
                  {person.middle_name && ` ${person.middle_name}`} 
                  {person.last_name && ` ${person.last_name}`}
                </h3>
                
                {person.birth_date && (
                  <p className="person-birth_date">
                    <strong>Birth Date:</strong> {new Date(person.birth_date).toLocaleDateString()}
                  </p>
                )}
                
                {person.gender && (
                  <p className="person-gender">
                    <strong>Gender:</strong> {person.gender}
                  </p>
                )}

                {person.height_in_cm && (
                  <p className="person-height_in_cm">
                    <strong>Height:</strong> {person.height_in_cm} cm
                  </p>
                )}

                {person.weight_in_kg && (
                  <p className="person-weight_in_kg">
                    <strong>Weight:</strong> {person.weight_in_kg} kg
                  </p>
                )}
                
                <p className="person-created">
                  <strong>Created:</strong> {new Date(person.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="person-actions">
                <Link 
                  to={`/persons/${person.id}`} 
                  className="btn btn-outline"
                >
                  View
                </Link>
                
                <Link 
                  to={`/persons/${person.id}/edit`} 
                  className="btn btn-outline"
                >
                  Edit
                </Link>
                
                <button
                  onClick={() => deletePerson(person.id)}
                  disabled={deleteLoading === person.id}
                  className="btn btn-danger"
                >
                  {deleteLoading === person.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;