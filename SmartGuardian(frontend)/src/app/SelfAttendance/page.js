"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Sidebar from "../components/dashboardComponents/Sidebar";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SelfAttendance = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("daily"); // Tabs: daily, weekly, monthly
  const router = useRouter();

  // Function to fetch user data based on the token
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

      const response = await fetch(
        `http://localhost:8000/api/users/${decodedToken.username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const user = await response.json();
      setUserData(user);
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Data for the graph
  const generateChartData = () => {
    if (!userData) return { labels: [], datasets: [] };

    const attendanceData = {
      daily: [8, 7, 8, 9, 7, 8, 6], // Example daily attendance
      weekly: [40, 42, 38, 36], // Example weekly attendance
      monthly: [160, 170, 150, 180], // Example monthly attendance
    };

    const labels =
      selectedTab === "daily"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : selectedTab === "weekly"
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
        : ["Jan", "Feb", "Mar", "Apr"];

    return {
      labels,
      datasets: [
        {
          label: "Attendance Hours",
          data: attendanceData[selectedTab],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Attendance`,
      },
    },
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar className="w-1/5 h-full" />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto ml-[14%]">
        <h1 className="text-3xl font-bold mb-6">Self Attendance</h1>

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

        {!loading && userData && (
          <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              My Attendance Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">username:</span>
                <span className="text-lg text-gray-800">{userData.username || ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">major:</span>
                <span className="text-lg text-gray-800">{userData.major || ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">year:</span>
                <span className="text-lg text-gray-800">{userData.year || ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-600">total attendance:</span>
                <span className="text-lg text-gray-800">{userData.total_attendance || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Graph Section */}
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Attendance Graph</h2>

          {/* Tabs for Daily, Weekly, Monthly */}
          <div className="flex mb-4">
            {["daily", "weekly", "monthly"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 font-medium rounded-lg ${
                  selectedTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Graph */}
          <div className="w-full max-w-4xl mx-auto h-64">
            <Bar data={generateChartData()} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfAttendance;
