import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (data.success) {
      alert('Signup successful!');
      setUser(data.user);
      navigate('/');
    } else {
      alert('Signup failed. Email may already exist.');
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([field, value]) => (
          <div key={field}>
            <label>{field.replace('_', ' ')}:</label>
            <input
              type="text"
              name={field}
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Create Account</button>
        <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Signup;
