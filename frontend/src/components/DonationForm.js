import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/DonationForm.css';

const DonationForm = () => {
  const [formData, setFormData] = useState({
    donorName: '',
    amount: '',
    description: '',
    address: '',
    date: '',
    type: 'cash',
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/donations`, formData, {
        headers: { 'x-auth-token': token },
      });
      alert('Donation added successfully');
      setFormData({ donorName: '', amount: '', description: '', address: '', date: '', type: 'cash' });
    } catch (err) {
      console.error(err.response?.data || 'Error');
      alert('Error adding donation');
    }
  };

  return (
    <div className="donation-form-container">
      <h2>Add Donation</h2>
      <form onSubmit={onSubmit}>
        <input type="text" name="donorName" placeholder="Donor Name" value={formData.donorName} onChange={onChange} required />
        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={onChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={onChange} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={onChange} />
        <input type="date" name="date" value={formData.date} onChange={onChange} required />
        <select name="type" value={formData.type} onChange={onChange} required>
          <option value="cash">Cash</option>
          <option value="online">Online</option>
        </select>
        <button type="submit" className="btn">Submit Donation</button>
        <button type="button" className="btn" onClick={() => navigate('/donations')}>
          Go to Donation List
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
