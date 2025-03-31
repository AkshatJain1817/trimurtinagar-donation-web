import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../css/DonationList.css';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [editingDonation, setEditingDonation] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/donations`, {
        headers: { 'x-auth-token': token },
      });
      setDonations(res.data);
    } catch (err) {
      console.error(err.response?.data || 'Error');
      alert('Error fetching donations');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    try {
      await axios.delete(`${API_URL}/api/donations/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setDonations(donations.filter(donation => donation._id !== id));
    } catch (err) {
      console.error(err.response?.data || 'Error');
      alert('Error deleting donation');
    }
  };

  const handleEdit = (donation) => {
    setEditingDonation(donation._id);
    setEditFormData(donation);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/donations/${editingDonation}`, editFormData, {
        headers: { 'x-auth-token': token },
      });
      setDonations(donations.map(d => (d._id === editingDonation ? res.data : d)));
      setEditingDonation(null);
    } catch (err) {
      console.error(err.response?.data || 'Error');
      alert('Error updating donation');
    }
  };

  // Print Function
  const handlePrint = () => {
    window.print();
  };

  // Export to Excel Function
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(donations.map(donation => ({
      'Donor Name': donation.donorName,
      'Amount': donation.amount,
      'Description': donation.description,
      'Address': donation.address,
      'Date': new Date(donation.date).toLocaleDateString(),
      'Type': donation.type
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Donations');
    XLSX.writeFile(workbook, 'Donations.xlsx');
  };

  return (
    <div className="donation-list-container">
      <h2>Donation List</h2>
      <button className="btn" onClick={() => navigate('/add-donation')}>Add Donation</button>
      <button className="btn print-btn" onClick={handlePrint}>Print</button>
      <button className="btn export-btn" onClick={handleExportToExcel}>Export to Excel</button>
      <table className="donation-table">
        <thead>
          <tr>
            <th>Donor Name</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Address</th>
            <th>Date</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map(donation => (
            <tr key={donation._id}>
              {editingDonation === donation._id ? (
                <>
                  <td><input type="text" value={editFormData.donorName} onChange={e => setEditFormData({ ...editFormData, donorName: e.target.value })} /></td>
                  <td><input type="number" value={editFormData.amount} onChange={e => setEditFormData({ ...editFormData, amount: e.target.value })} /></td>
                  <td><input type="text" value={editFormData.description} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} /></td>
                  <td><input type="text" value={editFormData.address} onChange={e => setEditFormData({ ...editFormData, address: e.target.value })} /></td>
                  <td><input type="date" value={editFormData.date} onChange={e => setEditFormData({ ...editFormData, date: e.target.value })} /></td>
                  <td>
                    <select value={editFormData.type} onChange={e => setEditFormData({ ...editFormData, type: e.target.value })}>
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn save-btn" onClick={handleUpdate}>Save</button>
                    <button className="btn cancel-btn" onClick={() => setEditingDonation(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{donation.donorName}</td>
                  <td>{donation.amount}</td>
                  <td>{donation.description}</td>
                  <td>{donation.address}</td>
                  <td>{new Date(donation.date).toLocaleDateString()}</td>
                  <td>{donation.type}</td>
                  <td>
                    <button className="btn edit-btn" onClick={() => handleEdit(donation)}>Edit</button>
                    <button className="btn delete-btn" onClick={() => handleDelete(donation._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationList;
