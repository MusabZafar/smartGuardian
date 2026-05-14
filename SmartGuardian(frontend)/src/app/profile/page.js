'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, createOrUpdateUserDocument } from '../firebaseConfig';
import Sidebar from '../components/dashboardComponents/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const router = useRouter();

  // Authentication Token Retrieval
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Username Extraction from Token
  const getUsernameFromToken = (token) => {
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.username || decodedToken.sub || decodedToken.user || decodedToken.name;
    } catch (err) {
      console.error('Token decoding error:', err);
      return null;
    }
  };

  // Fetch User Profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getAuthToken();
        const username = getUsernameFromToken(token);

        if (!username || !token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/users/by-username`, {
          params: { username },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setUser(response.data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch user profile');
        setLoading(false);
        console.error(err);

        if (err.response && err.response.status === 401) {
          router.push('/login');
        }
      }
    };

    fetchUserProfile();
  }, [router]);

  // File Selection Handler
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, and GIF images are allowed');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Image Upload Handler
  const handleImageUpload = async () => {
    if (!selectedFile || !user) {
      toast.error('Please select a file');
      return;
    }

    try {
      setLoading(true);

      // Create storage reference
      const storageRef = ref(
        storage, 
        `profile_images/${user.username}/${user.username}_${Date.now()}`
      );
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update backend
      const token = getAuthToken();
      const updateResponse = await axios.put(
        `http://localhost:8080/api/users/update-image`,
        null,
        {
          params: {
            username: user.username,
            imageUrl: downloadURL,
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update local state
      setUser(updateResponse.data);

      // Create/Update Firestore document
      await createOrUpdateUserDocument(user.username, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: downloadURL,
        username: user.username
      });

      // Reset states
      setSelectedFile(null);
      setPreviewImage(null);
      setLoading(false);

      toast.success('Profile image updated successfully');
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error('Failed to upload image');
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        <span className="font-semibold text-lg">{error}</span>
      </div>
    );
  }

  // No User Found
  if (!user) {
    return <div className="text-center mt-10">No user found</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar userData={user} />
      
      <div className="flex-grow flex justify-center items-center bg-gray-100 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
          <div className="p-8 flex flex-col items-center">
            {/* Profile Image Section */}
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg">
                {previewImage ? (
                  <Image 
                    src={previewImage} 
                    alt="Preview" 
                    layout="fill" 
                    objectFit="cover" 
                  />
                ) : user.imageUrl ? (
                  <Image 
                    src={user.imageUrl} 
                    alt="Profile" 
                    layout="fill" 
                    objectFit="cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-indigo-600 font-medium">@{user.username}</p>
              <p className="text-gray-600 mt-2">{user.email}</p>
            </div>

            {/* Image Upload Section */}
            <div className="w-full space-y-4">
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileSelect}
                className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {selectedFile && (
                <button
                  onClick={handleImageUpload}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload Image'}
                </button>
              )}
            </div>


          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Profile;