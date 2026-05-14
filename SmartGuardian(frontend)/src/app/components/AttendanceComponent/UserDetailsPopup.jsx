import React from 'react';

const UserDetailsPopup = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Username:</span>
              <span className="ml-2">{user.username || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Major:</span>
              <span className="ml-2">{user.major || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Year:</span>
              <span className="ml-2">{user.year || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Starting Year:</span>
              <span className="ml-2">{user.starting_year || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Standing:</span>
              <span className="ml-2">{user.standing || 'N/A'}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Total Attendance:</span>
              <span className="ml-2">{user.total_attendance || '0'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Last Attendance:</span>
              <span className="ml-2">{user.last_attendance_time || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Exit Time:</span>
              <span className="ml-2">{user.exit_time || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Time Spent:</span>
              <span className="ml-2">{user.total_time_user_spent || '0'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Attendance Type:</span>
              <span className="ml-2">{user.Attendance_type || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPopup;