import axios from 'axios';

const   API_URL = process.env.NEXT_PUBLIC_API_URL;
// Check if the email exists
export const validateEmail = async (email) => {
    return axios.post('http://localhost:8080/api/auth/validate-email', null, {
        params: { email }
    });
}

// Reset the password
export const resetPassword = async (email, password) => {
    return axios.post('http://localhost:8080/api/auth/reset-password', null, {
        params: { email, password }
    });
}


// Check if the email exists and request OTP
export const requestOtp = async (email) => {
    return axios.post(`${API_URL}/forgot-password`, null, {
        params: { email }
    });
}

// Verify OTP
export const verifyOtp = async (email, otp) => {
    return axios.post(`${API_URL}/verify-otp`, null, {
        params: { email, otp }
    });
}

