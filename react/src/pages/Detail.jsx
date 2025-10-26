import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Detail.css';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_BASE_URL = 'http://localhost:8000';

    // Fetch person details
    const fetchPerson = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/persons/${id}/`);
            setPerson(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch person details');
            console.error('Error fetching person:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete person
    const deletePerson = async () => {
        if (!window.confirm('Are you sure you want to delete this person?')) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/persons/${id}/`);
            navigate('/'); // Redirect to list after deletion
        } catch (err) {
            setError('Failed to delete person');
            console.error('Error deleting person:', err);
        }
    };

    useEffect(() => {
        fetchPerson();
    }, [id]);

    if (loading) {
        return (
            <div className="container">
                <div className="loading">Loading person details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="alert alert-error">{error}</div>
                <Link to="/" className="btn btn-outline">Back to List</Link>
            </div>
        );
    }

    if (!person) {
        return (
            <div className="container">
                <div className="alert alert-error">Person not found</div>
                <Link to="/" className="btn btn-outline">Back to List</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>Person Details</h1>
                <Link to="/" className="btn btn-outline">
                    Back to List
                </Link>
            </div>

            <div className="person-detail-card">
                <div className="person-header">
                    <h2>
                        {person.first_name} 
                        {person.middle_name && ` ${person.middle_name}`} 
                        {person.last_name && ` ${person.last_name}`}
                    </h2>
                </div>

                <div className="person-details">
                    <div className="detail-row">
                        <span className="detail-label">First Name:</span>
                        <span className="detail-value">{person.first_name}</span>
                    </div>

                    {person.middle_name && (
                        <div className="detail-row">
                            <span className="detail-label">Middle Name:</span>
                            <span className="detail-value">{person.middle_name}</span>
                        </div>
                    )}

                    {person.last_name && (
                        <div className="detail-row">
                            <span className="detail-label">Last Name:</span>
                            <span className="detail-value">{person.last_name}</span>
                        </div>
                    )}

                    {person.birth_date && (
                        <div className="detail-row">
                            <span className="detail-label">Birth Date:</span>
                            <span className="detail-value">
                                {new Date(person.birth_date).toLocaleDateString()}
                            </span>
                        </div>
                    )}

                    {person.gender && (
                        <div className="detail-row">
                            <span className="detail-label">Gender:</span>
                            <span className="detail-value">
                                {person.gender === 'M' ? 'Male' : 
                                 person.gender === 'F' ? 'Female' : 
                                 person.gender === 'O' ? 'Other' : 
                                 person.gender === 'U' ? 'Prefer not to say' : person.gender}
                            </span>
                        </div>
                    )}

                    {person.height_in_cm && (
                        <div className="detail-row">
                            <span className="detail-label">Height:</span>
                            <span className="detail-value">{person.height_in_cm} cm</span>
                        </div>
                    )}

                    {person.weight_in_kg && (
                        <div className="detail-row">
                            <span className="detail-label">Weight:</span>
                            <span className="detail-value">{person.weight_in_kg} kg</span>
                        </div>
                    )}

                    <div className="detail-row">
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">
                            {new Date(person.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="person-actions">
                    <Link 
                        to={`/persons/${person.id}/edit`} 
                        className="btn btn-primary"
                    >
                        Edit Person
                    </Link>
                    <button
                        onClick={deletePerson}
                        className="btn btn-danger"
                    >
                        Delete Person
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Detail;