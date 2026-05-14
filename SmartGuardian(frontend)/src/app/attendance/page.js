"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Sidebar from "../components/dashboardComponents/Sidebar";
import NotificationContainer from "../components/webSocketComponents/NotificationContainer";
import { Bar } from "react-chartjs-2";
import UserDetailsPopup from "../components/AttendanceComponent/UserDetailsPopup";
import UpdateUserForm from "../components/AttendanceComponent/UpdateUserForm";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Attendance = () => {
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [previousStatus, setPreviousStatus] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(""); // Add userRole state
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [timeFilter, setTimeFilter] = useState("daily");
  const router = useRouter();

  const [filteredChartData, setFilteredChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Add this function to process names with attendance data
const processAttendanceWithNames = (users, timeFilter) => {
  const attendanceMap = {};
  
  users.forEach((user) => {
    const date = new Date(user.last_attendance_time);
    let timeKey;
    
    switch (timeFilter) {
      case 'daily':
        timeKey = date.toLocaleDateString();
        break;
      case 'weekly':
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        timeKey = `Week of ${weekStart.toLocaleDateString()}`;
        break;
      case 'monthly':
        timeKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
        break;
      default:
        timeKey = date.toLocaleDateString();
    }
    
    if (!attendanceMap[timeKey]) {
      attendanceMap[timeKey] = {
        count: 0,
        users: []
      };
    }
    
    attendanceMap[timeKey].count += 1;
    attendanceMap[timeKey].users.push(user.username);
  });
  
  return Object.entries(attendanceMap).map(([timeKey, data]) => ({
    label: timeKey,
    value: data.count,
    users: data.users.join(', ')
  }));
};

// Update your processChartData function
const processChartData = () => {
  let filteredUsers = [...allUsers];

  // Filter by date if selected
  if (filterDate) {
    filteredUsers = filteredUsers.filter((user) => {
      const attendanceDate = new Date(user.last_attendance_time).toLocaleDateString();
      const selectedDate = new Date(filterDate).toLocaleDateString();
      return attendanceDate === selectedDate;
    });
  }

  // Filter by attendance type if selected
  if (filterType) {
    filteredUsers = filteredUsers.filter(
      (user) => user.Attendance_type?.toLowerCase() === filterType.toLowerCase()
    );
  }

  // Process data with names
  const processedData = processAttendanceWithNames(filteredUsers, timeFilter);

  // Update chart data with processed data
  setFilteredChartData({
    labels: processedData.map((item) => `${item.label}\n(${item.users})`),
    datasets: [
      {
        label: `${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Attendance Count`,
        data: processedData.map((item) => item.value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
};
  // Update your attendance type options to match the actual values
  const attendanceTypeOptions = [
    { value: "", label: "All Attendance Types" },
    { value: "geofence", label: "Geofence" },
    { value: "attendance_with_webcam", label: "attendance_with_webcam" },
    { value: "mobile_submission", label: "Mobile Submission" },
  ];

  // Helper functions to process data for different time periods
  const processDailyData = (users) => {
    const dailyCount = {};
    users.forEach((user) => {
      const date = new Date(user.last_attendance_time).toLocaleDateString();
      dailyCount[date] = (dailyCount[date] || 0) + 1;
    });
    return Object.entries(dailyCount).map(([date, count]) => ({
      label: date,
      value: count,
    }));
  };

  const processWeeklyData = (users) => {
    const weeklyCount = {};
    users.forEach((user) => {
      const date = new Date(user.last_attendance_time);
      const weekStart = new Date(
        date.setDate(date.getDate() - date.getDay())
      ).toLocaleDateString();
      weeklyCount[weekStart] = (weeklyCount[weekStart] || 0) + 1;
    });
    return Object.entries(weeklyCount).map(([week, count]) => ({
      label: `Week of ${week}`,
      value: count,
    }));
  };

  const processMonthlyData = (users) => {
    const monthlyCount = {};
    users.forEach((user) => {
      const date = new Date(user.last_attendance_time);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlyCount[monthYear] = (monthlyCount[monthYear] || 0) + 1;
    });
    return Object.entries(monthlyCount).map(([month, count]) => ({
      label: month,
      value: count,
    }));
  };

  // Update chart when filters or data change
  useEffect(() => {
    if (allUsers.length > 0) {
      processChartData();
    }
  }, [filterDate, filterType, timeFilter, allUsers]);

  // Function to open delete confirmation
  const handleDeleteClick = (e, user) => {
    e.stopPropagation(); // Prevent row click event
    setUserToDelete(user);
  };

  // Function to check if we should show a notification based on system status
  const shouldShowNotification = (status) => {
    return (
      status.unrecognized_person_detected === true &&
      status.last_unrecognized_time &&
      status.last_unrecognized_time.trim() !== ""
    );
  };

  const handleUpdateClick = (e, user) => {
    e.stopPropagation(); // Prevent row click event
    setUserToUpdate(user);
  };

  const handleUserUpdate = (updatedUser) => {
    console.log("Handling user update:", updatedUser);
    setAllUsers((prev) =>
      prev.map((user) =>
        user.username === updatedUser.username ? updatedUser : user
      )
    );
  };

  // Function to handle record click
  const handleRecordClick = (user) => {
    setSelectedUser(user);
  };

  // Helper function to safely convert boolean to string
  const boolToString = (value) => {
    return value !== undefined ? value.toString() : "false";
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const decodedToken = jwt.decode(token);
      if (!decodedToken || !decodedToken.username) {
        throw new Error("Invalid token");
      }

      const matchedUser = allUsers.find(
        (user) => user.username === decodedToken.username
      );

      if (matchedUser) {
        setUserData(matchedUser);
        setError(null);
      } else {
        setError("No matching user found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to remove a notification
  const removeNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch user role from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.role) {
        setUserRole(decodedToken.role);
      }
    }
  }, []);

  // Fetch all users or filtered users based on role
  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:8000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const users = await response.json();

      // If user is admin, show all users
      if (userRole === "ROLE_ADMIN") {
        setAllUsers(users);
      }
      // If user is regular user, fetch groups and filter users
      else if (userRole === "ROLE_USER") {
        const groupsResponse = await fetch("http://localhost:8080/api/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!groupsResponse.ok) {
          throw new Error("Failed to fetch groups");
        }

        const groups = await groupsResponse.json();

        // Filter groups where the current user is a member
        const currentUsername = jwt.decode(token).username;
        const userGroups = groups.filter((group) =>
          group.employees.some((emp) => emp.username === currentUsername)
        );

        // Extract unique users from these groups
        const uniqueUsers = [];
        userGroups.forEach((group) => {
          group.employees.forEach((emp) => {
            if (!uniqueUsers.some((u) => u.username === emp.username)) {
              uniqueUsers.push(emp);
            }
          });
        });

        // Filter users based on unique users from groups
        const filteredUsers = users.filter((user) =>
          uniqueUsers.some((u) => u.username === user.username)
        );

        setAllUsers(filteredUsers);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      router.push("/login");
    }
  };

  // Fetch all users when component mounts or userRole changes
  useEffect(() => {
    fetchAllUsers();
  }, [userRole]);

  // Rest of the code remains the same...
  // (Include all other functions and JSX as in your original code)

  // Function to handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/users/${userToDelete.username}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove user from allUsers state
        setAllUsers((prev) =>
          prev.filter((user) => user.username !== userToDelete.username)
        );
        setUserToDelete(null); // Close dialog
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // You might want to show an error message to the user here
    }
  };
  // Update your chart data to use filtered users
  const chartData = {
    labels: filteredUsers.map((user) => user.username),
    datasets: [
      {
        label: "Total Attendance",
        data: filteredUsers.map((user) => user.total_attendance),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const isAdmin = userData?.roles?.some((role) => role.name === "ROLE_ADMIN");

  return (
    <div className="flex">
      <Sidebar userData={userData} />

      {selectedUser && (
        <UserDetailsPopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the user record for{" "}
              {userToDelete?.username}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Debug display - only shown in development */}
      {process.env.NODE_ENV === "development" && userRole === "ROLE_ADMIN" && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg opacity-75 z-50">
          <h3>Debug Info:</h3>
          <p>
            Unrecognized Person:{" "}
            {systemStatus?.unrecognized_person_detected ? "Yes" : "No"}
          </p>
          <p>Last Time: {systemStatus?.last_unrecognized_time || "None"}</p>
          <p>Active Notifications: {notifications.length}</p>
        </div>
      )}

      {userToUpdate && (
        <UpdateUserForm
          user={userToUpdate}
          isOpen={!!userToUpdate}
          onClose={() => setUserToUpdate(null)}
          onUpdate={handleUserUpdate}
        />
      )}

      {/* Notification Container */}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Attendance Page</h1>

        <button
          onClick={fetchUserData}
          className="mb-6 text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          My Attendance Status
        </button>

        {loading && !error && (
          <div className="flex justify-center items-center h-72">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading && allUsers.length > 0 && (
          <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              All Users Attendance
            </h2>
            {/* Add search input with Tailwind classes */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-sm px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-3 text-left">username</th>
                    <th className="border p-3 text-left">major</th>
                    <th className="border p-3 text-left">year</th>
                    <th className="border p-3 text-left">starting_year</th>
                    <th className="border p-3 text-left">total_attendance</th>
                    <th className="border p-3 text-left">
                      last_attendance_time
                    </th>
                    <th className="border p-3 text-left">exit_time</th>
                    <th className="border p-3 text-left">
                      total_time_user_spent
                    </th>
                    <th className="border p-3 text-left">
                      exit_user_attendance
                    </th>
                    <th className="border p-3 text-left">standing</th>
                    <th className="border p-3 text-left">Attendance Type</th>
                    {/* {isAdmin && ( */}
                    <th className="border p-3 text-left">Actions</th>
                    {/* )} */}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={`${user.username}-${index}`}
                      className="hover:bg-gray-100 cursor-pointer relative"
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="border p-3">{user.username || ""}</td>
                      <td className="border p-3">{user.major || ""}</td>
                      <td className="border p-3">{user.year || ""}</td>
                      <td className="border p-3">{user.starting_year || ""}</td>
                      <td className="border p-3">
                        {user.total_attendance || 0}
                      </td>
                      <td className="border p-3">
                        {user.last_attendance_time || ""}
                      </td>
                      <td className="border p-3">{user.exit_time || ""}</td>
                      <td className="border p-3">
                        {user.total_time_user_spent || 0}
                      </td>
                      <td className="border p-3">
                        {boolToString(user.exit_user_attendance)}
                      </td>
                      <td className="border p-3">{user.standing || ""}</td>
                      <td className="border p-3">
                        {user.Attendance_type || ""}
                      </td>
                      {/* {isAdmin &&( */}
                      <td className="border p-3 relative">
                        <button
                          onClick={(e) => handleUpdateClick(e, user)}
                          className="transition-colors text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                          Update
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, user)}
                          className="transition-colors text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                          Delete
                        </button>
                      </td>
                      {/* )} */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {userData && !loading && (
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              My Attendance Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  username:
                </span>
                <span className="text-lg text-gray-800">
                  {userData.username || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  major:
                </span>
                <span className="text-lg text-gray-800">
                  {userData.major || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">year:</span>
                <span className="text-lg text-gray-800">
                  {userData.year || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  starting_year:
                </span>
                <span className="text-lg text-gray-800">
                  {userData.starting_year || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  total_attendance:
                </span>
                <span className="text-lg text-gray-800">
                  {userData.total_attendance || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  last_attendance_time:
                </span>
                <span className="text-lg text-gray-800">
                  {userData.last_attendance_time || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  exit_time:
                </span>
                <span className="text-lg text-gray-800">
                  {userData.exit_time || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  total_time_user_spent:
                </span>
                <span className="text-lg text-gray-800">
                  {userData.total_time_user_spent || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  exit_user_attendance:
                </span>
                <span className="text-lg text-gray-800">
                  {boolToString(userData.exit_user_attendance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  standing:
                </span>
                <span className="text-lg text-gray-800">
                  {userData.standing || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">
                  Attendance Type:
                </span>
                <span className="text-lg text-gray-800">
                  {userData.Attendance_type || ""}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {!loading && allUsers.length > 0 && (
          <div className="bg-white shadow-xl rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              User Attendance Statistics
            </h2>
            <div className="w-full h-80">
              <Bar data={chartData} options={{responsive: true, plugins: { legend: { position: "top" }, title: { display: true, text: "Attendance by User" },}, }} />
            </div>
          </div>
        )}

        <div className="flex">
          {/* <Sidebar userData={userData} /> */}
          <div className="ml-64 p-6 w-full">
            <h1 className="text-3xl font-bold mb-6">Attendance Page</h1>

            <div className="mb-6 flex space-x-4">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              >
                {attendanceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="bg-white shadow-xl rounded-lg p-6 mt-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Attendance Comparison ({timeFilter})
              </h2>
              <div className="w-full h-80">
              <Bar
  data={filteredChartData}
  options={{
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Attendance Comparison (${timeFilter})`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const users = filteredChartData.labels[dataIndex].split('\n')[1];
            return [`Count: ${context.parsed.y}`, `Users: ${users}`];
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          padding: 10,
          autoSkip: false,
          font: {
            size: 11
          }
        }
      }
    }
  }}
/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;