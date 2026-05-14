"use client"
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const UpdateUserForm = ({ user, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    major: user?.major || '',
    year: user?.year || '',
    starting_year: user?.starting_year || '',
    total_attendance: user?.total_attendance || 0,
    last_attendance_time: user?.last_attendance_time || '',
    exit_time: user?.exit_time || '',
    total_time_user_spent: user?.total_time_user_spent || 0,
    exit_user_attendance: user?.exit_user_attendance || false,
    standing: user?.standing || '',
    Attendance_type: user?.Attendance_type || ''
  });

  const [error, setError] = useState('');

  // Log initial user data
  useEffect(() => {
    console.log('Initial user data:', user);
    console.log('Initial form data:', formData);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    console.log(`Field ${name} changed to:`, newValue);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submission started');
    console.log('Form data being submitted:', formData);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making API request to:', `http://localhost:8000/api/users/${user.username}/`);
      
      const response = await fetch(`http://localhost:8000/api/users/${user.username}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        console.log('Update successful');
        onUpdate(responseData);
        onClose();
      } else {
        throw new Error(responseData.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error in update process:', error);
      setError(error.message);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Update User: {user?.username}</AlertDialogTitle>
        </AlertDialogHeader>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Major</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Starting Year</label>
              <input
                type="text"
                name="starting_year"
                value={formData.starting_year}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Standing</label>
              <input
                type="text"
                name="standing"
                value={formData.standing}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Attendance Type</label>
              <input
                type="text"
                name="Attendance_type"
                value={formData.Attendance_type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update User
            </button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateUserForm;