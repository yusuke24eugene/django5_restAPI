import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Create.css';

const Update = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get person ID from URL params
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        birth_date: '',
        height_in_cm: '',
        weight_in_kg: '',
    });

    const API_BASE_URL = 'http://localhost:8000';

    // Fetch person data when component mounts
    useEffect(() => {
        const fetchPerson = async () => {
            try {
                setFetchLoading(true);
                const response = await axios.get(`${API_BASE_URL}/persons/${id}/`);
                
                if (response.status === 200) {
                    // Format the data for the form
                    const personData = response.data;
                    setFormData({
                        first_name: personData.first_name || '',
                        middle_name: personData.middle_name || '',
                        last_name: personData.last_name || '',
                        gender: personData.gender || '',
                        birth_date: personData.birth_date || '',
                        height_in_cm: personData.height_in_cm || '',
                        weight_in_kg: personData.weight_in_kg || '',
                    });
                }
            } catch (err) {
                setError('Failed to load person data. Please try again.');
                console.error('Error fetching person:', err);
            } finally {
                setFetchLoading(false);
            }
        };

        if (id) {
            fetchPerson();
        }
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission for UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.put(`${API_BASE_URL}/persons/${id}/`, formData);
            
            if (response.status === 200) {
                // Success - redirect to person list or detail page
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                // Django validation errors
                const errorData = err.response.data;
                if (typeof errorData === 'object') {
                    // Handle field-specific errors
                    const errorMessages = Object.values(errorData).flat().join(', ');
                    setError(`Validation error: ${errorMessages}`);
                } else {
                    setError(errorData.toString());
                }
            } else {
                setError('Failed to update person. Please try again.');
            }
            console.error('Error updating person:', err);
        } finally {
            setLoading(false);
        }
    };

    // Reset form to original values
    const handleReset = () => {
        // Re-fetch original data
        const fetchOriginalData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/persons/${id}/`);
                if (response.status === 200) {
                    const personData = response.data;
                    setFormData({
                        first_name: personData.first_name || '',
                        middle_name: personData.middle_name || '',
                        last_name: personData.last_name || '',
                        gender: personData.gender || '',
                        birth_date: personData.birth_date || '',
                        height_in_cm: personData.height_in_cm || '',
                        weight_in_kg: personData.weight_in_kg || '',
                    });
                    setError('');
                }
            } catch (err) {
                setError('Failed to reset form. Please refresh the page.');
            }
        };

        fetchOriginalData();
    };

    // Handle cancel and go back
    const handleCancel = () => {
        navigate('/');
    };

    if (fetchLoading) {
        return (
            <div className="container">
                <div className="loading">Loading person data...</div>
            </div>
        );
    }

    return(
        <div className="container">
            <div className="page-header">
                <h1>Edit Person</h1>
                <Link to="/" className="btn btn-outline">
                    Back to List
                </Link>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div className="form-container">
                <form onSubmit={handleSubmit} className="person-form">
                    {/* Name Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name" className="form-label">
                                First Name *
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={loading}
                                placeholder="Enter first name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="middle_name" className="form-label">
                                Middle Name
                            </label>
                            <input
                                type="text"
                                id="middle_name"
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={handleChange}
                                className="form-control"
                                disabled={loading}
                                placeholder="Enter middle name"
                            />
                        </div>
                    </div>

                    {/* Last Name and Birth Date Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="last_name" className="form-label">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={loading}
                                placeholder="Enter last name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="birth_date" className="form-label">
                                Birth Date
                            </label>
                            <input
                                type="date"
                                id="birth_date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                className="form-control"
                                disabled={loading}
                                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                            />
                        </div>
                    </div>

                    {/* Physical Attributes Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="height_in_cm" className="form-label">
                                Height (cm)
                            </label>
                            <input
                                type="number"
                                id="height_in_cm"
                                name="height_in_cm"
                                value={formData.height_in_cm}
                                onChange={handleChange}
                                className="form-control"
                                min="1"
                                max="300"
                                step="0.1"
                                disabled={loading}
                                placeholder="Enter height in centimeters"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="weight_in_kg" className="form-label">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                id="weight_in_kg"
                                name="weight_in_kg"
                                value={formData.weight_in_kg}
                                onChange={handleChange}
                                className="form-control"
                                min="1"
                                max="500"
                                step="0.1"
                                disabled={loading}
                                placeholder="Enter weight in kilograms"
                            />
                        </div>
                    </div>

                    {/* Gender Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="gender" className="form-label">
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="form-control"
                                disabled={loading}
                            >
                                <option value="">Select Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                        <div className="form-group">
                            {/* Empty div for grid alignment */}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-outline"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline"
                            disabled={loading}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Person'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;