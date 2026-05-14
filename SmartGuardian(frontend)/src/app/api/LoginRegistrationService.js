import axios from 'axios';

// Base URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const OAUTH2_URL = process.env.NEXT_PUBLIC_OAUTH2_URL;

// Register user API call
export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    return response.data;  // Success message or data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/loginPage`, formData);
    return response.data;  // Return JWT token and other data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};




// OAuth2 login API call
export const oauth2Login = async (provider) => {
    try {
      const response = await axios.get(`${OAUTH2_URL}/oauth2/code/${provider}`);
      return response.data;  // Return the response from OAuth2 provider
    } catch (error) {
       console.log("catch called...")
      throw new Error(error.response?.data?.message || 'OAuth2 login failed');
     
    }
  };