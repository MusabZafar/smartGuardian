"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/dashboardComponents/Sidebar";
import AddEmployeeModal from "../components/dashboardComponents/AddEmployeeModal";
import axios from "axios";
import jwt from "jsonwebtoken";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import NotificationContainer from "../components/webSocketComponents/NotificationContainer";
import { useWebSocketConnection } from "../api/useWebSocketConnection";

export default function EmployeesPage() {
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userData, setUserData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [groups, setGroups] = useState([]); // State to store groups
  const router = useRouter();

  // Use WebSocket hook with userRole
  const { notifications, removeNotification } = useWebSocketConnection(userRole);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.role) {
        setUserRole(decodedToken.role);
        fetchUserData(decodedToken.sub);

        // Fetch employees based on role
        if (decodedToken.role === "ROLE_ADMIN") {
          fetchEmployees();
        } else if (decodedToken.role === "ROLE_USER") {
          fetchGroupsForUser(decodedToken.sub); // Fetch groups for the current user
        }
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch user data
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
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  // Fetch all employees (for admin)
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  // Fetch groups for the current user (for regular users)
  const fetchGroupsForUser = async (username) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter groups where the current user is a member
      const userGroups = response.data.filter((group) =>
        group.employees.some((emp) => emp.username === username)
      );

      // Extract unique employees from these groups
      const uniqueEmployees = [];
      userGroups.forEach((group) => {
        group.employees.forEach((emp) => {
          if (!uniqueEmployees.some((e) => e.id === emp.id)) {
            uniqueEmployees.push(emp);
          }
        });
      });

      setEmployees(uniqueEmployees); // Set filtered employees
    } catch (error) {
      console.error("Failed to fetch groups for user", error);
    }
  };

  const handleAddEmployeeClick = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");
      console.log(employeeId)
      await axios.delete(`http://localhost:8080/api/employees/${employeeId}`, {
       
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(employees.filter((emp) => emp.id !== employeeId));
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      const token = localStorage.getItem("token");

      if (selectedEmployee) {
        const response = await axios.put(
          `http://localhost:8080/api/employees/${selectedEmployee.id}`,
          employeeData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployees(
          employees.map((emp) =>
            emp.id === response.data.id ? response.data : emp
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/employees",
          employeeData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployees([...employees, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save employee", error);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar userData={userData} />

      {userRole === "ROLE_ADMIN" && (
        <NotificationContainer 
          notifications={notifications}
          removeNotification={removeNotification}
        />
      )}

      <div className="ml-[260px] p-8 flex-1">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Employees Management
        </h1>

        {userRole === "ROLE_ADMIN" && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleAddEmployeeClick}
              className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Add Employee
            </button>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-1/12 px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-semibold">Phone Number</th>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-semibold">Username</th>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-semibold">Role</th>
                  {userRole === "ROLE_ADMIN" && (
                    <th className="w-1/6 px-4 py-3 text-left text-sm font-semibold">ACTIONS</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-4 py-4 text-gray-500">{employee.id}</td>
                    <td className="px-4 py-4 flex items-center">
                      <img
                        src={
                          employee.profileImage ||
                          "https://via.placeholder.com/100"
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-3 shadow-md"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {employee.firstName} {employee.lastName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{employee.email}</td>
                    <td className="px-4 py-4 text-gray-500">
                      {employee.phoneNumber}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {employee.username}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {employee.userType}
                    </td>
                    {userRole === "ROLE_ADMIN" && (
                      <td className="px-4 py-4 flex items-center space-x-4">
                        <PencilIcon
                          onClick={() => handleEditEmployee(employee)}
                          className="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-pointer transition-all duration-150"
                        />
                        <TrashIcon
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="w-4 h-4 text-red-600 hover:text-red-800 cursor-pointer transition-all duration-150"
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <AddEmployeeModal
            onClose={handleCloseModal}
            onSave={handleSaveEmployee}
            existingEmployee={selectedEmployee}
          />
        )}
      </div>
    </div>
  );
}