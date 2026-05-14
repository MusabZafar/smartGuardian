"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Sidebar from '../components/dashboardComponents/Sidebar'; // Import the Sidebar component
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import NotificationContainer from "../components/webSocketComponents/NotificationContainer"; // Import Notification Container
import { useWebSocketConnection } from "../api/useWebSocketConnection";

export default function GroupsPage() {
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', employeeIds: [] });
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState(null); // State to hold user data
  const [userRole, setUserRole] = useState("");

  const [isLoading, setIsLoading] = useState(true); // Loading state for user data

  // Use WebSocket hook with userRole
  const { notifications, removeNotification } = useWebSocketConnection(userRole);

  // Fetch token and user data once on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserData(savedToken); // Fetch user data when token is available
    }
  }, []);

  // Fetching user data to display username and email for the logged in user 
  const fetchUserData = async (username) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/users/by-username?username=${encodeURIComponent(
          username
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response.data);
      console.log(userData)
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.role) {
        setUserRole(decodedToken.role);
        fetchUserData(decodedToken.sub);
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchGroups();
      fetchEmployees();
    }
  }, [token]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Get the currently logged-in user's username from the token
      const decodedToken = jwt.decode(token);
      const currentUsername = decodedToken.sub;
  
      // If the user is an admin, show all groups
      if (userRole === "ROLE_ADMIN") {
        setGroups(response.data);
      } 
      // If the user is a regular user, filter groups to only include those where the current user is a member
      else if (userRole === "ROLE_USER") {
        const filteredGroups = response.data.filter(group => 
          group.employees.some(emp => emp.username === currentUsername)
        );
        setGroups(filteredGroups);
      }
    } catch (error) {
      console.error('Error fetching groups', error);
      setError('Failed to fetch groups.');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees', error);
      setError('Failed to fetch employees.');
    }
  };

  const handleCreateGroup = async () => {
    try {
      if (editingGroupId) {
        await axios.put(`http://localhost:8080/api/groups/${editingGroupId}`, newGroup, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:8080/api/groups', newGroup, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchGroups();
      setNewGroup({ name: '', description: '', employeeIds: [] });
      setShowForm(false);
      setEditingGroupId(null);
      setError(null);
    } catch (error) {
      console.error('Error creating or updating group', error);
      setError('Failed to save group.');
    }
  };

  const handleEditGroup = (group) => {
    setNewGroup({
      name: group.name,
      description: group.description,
      employeeIds: group.employees.map(emp => emp.id),
    });
    setEditingGroupId(group.id);
    setShowForm(true);
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`http://localhost:8080/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGroups();
      setError(null);
    } catch (error) {
      console.error('Error deleting group', error);
      setError('Failed to delete group.');
    }
  };

  const toggleEmployeeSelection = (employeeId) => {
    setNewGroup((prevGroup) => {
      const updatedEmployeeIds = prevGroup.employeeIds.includes(employeeId)
        ? prevGroup.employeeIds.filter(id => id !== employeeId)
        : [...prevGroup.employeeIds, employeeId];
      return { ...prevGroup, employeeIds: updatedEmployeeIds };
    });
  };

  return (
    <div className="flex">
      {/* Sidebar - only render if userData is loaded */}
      <Sidebar userData={userData}/>

      {/* Add Notification Container for Admin */}
      {userRole === "ROLE_ADMIN" && (
        <NotificationContainer 
          notifications={notifications}
          removeNotification={removeNotification}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 ml-[260px]">
        <h1 className="text-2xl font-bold mb-4 text-center">Groups</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Toggle Button for Create Group Form */}
        {userRole !== "ROLE_USER" && (
          <button
            onClick={() => {
              setShowForm(true);
              setNewGroup({ name: '', description: '', employeeIds: [] });
              setEditingGroupId(null);
            }}
            className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
          >
            Add Group
          </button>
        )}

        {/* Create/Edit Group Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl mb-4">{editingGroupId ? 'Edit Group' : 'Create New Group'}</h2>
              <input
                type="text"
                placeholder="Group Name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                className="p-2 border rounded mb-2 w-full"
              />
              <textarea
                placeholder="Description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                className="p-2 border rounded mb-2 w-full"
              />
              <div className="mb-2">
                <h3 className="font-semibold mb-1">Select Employees:</h3>
                {employees.map(employee => (
                  <label key={employee.id} className="block">
                    <input
                      type="checkbox"
                      checked={newGroup.employeeIds.includes(employee.id)}
                      onChange={() => toggleEmployeeSelection(employee.id)}
                    />
                    <span className="ml-2">{employee.firstName} {employee.lastName}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingGroupId(null);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button onClick={handleCreateGroup} className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editingGroupId ? 'Save Changes' : 'Create Group'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Groups List as a Table */}
        <div className="mt-6">
          <table className="w-full border-collapse shadow-lg rounded text-[13px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b text-left">ID</th>
                <th className="p-3 border-b text-left">Name</th>
                <th className="p-3 border-b text-left">Description</th>
                <th className="p-3 border-b text-left">Employees</th>
                {userRole !== "ROLE_USER" && (
                  <th className="p-3 border-b text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{group.id}</td>
                  <td className="p-3 font-semibold">{group.name}</td>
                  <td className="p-3">{group.description}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {group.employees.map(emp => `${emp.firstName} ${emp.lastName}`).join(', ')}
                  </td>
                  {userRole !== "ROLE_USER" && (
                    <td className="p-3 space-x-2 flex items-center">
                      <button onClick={() => handleEditGroup(group)} className="text-blue-600 hover:text-blue-800">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDeleteGroup(group.id)} className="text-red-600 hover:text-red-800">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}