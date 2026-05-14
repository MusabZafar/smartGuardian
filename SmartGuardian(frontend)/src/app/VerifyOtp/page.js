"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOtp } from '../api/RequestResetService';

export default function VerifyOtp() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); // Get email from URL query parameter
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyOtp(email, otp); // Verify OTP with backend
      setMessage(response.data);
      router.push(`/ResetPassword?email=${email}`); // Redirect to password reset page
    } catch (error) {
      setMessage('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">Smart Guardian</h1>
          <p className="text-white mt-1">Grow Your Business With Smart Guardian</p>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>

      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form onSubmit={handleSubmit} className="bg-white">
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Verify OTP</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Enter the OTP sent to your email</p>

          {message && <p className="text-red-600 mb-4">{message}</p>}

          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
