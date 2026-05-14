"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../components/dashboardComponents/Sidebar";
import axios from "axios";
import jwt from "jsonwebtoken";
import "animate.css";
import NotificationContainer from "../components/webSocketComponents/NotificationContainer";
import { useWebSocketConnection } from "../api/useWebSocketConnection";

export default function Dashboard() {
  const [userRole, setUserRole] = useState("");
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  // Use WebSocket hook with userRole
  const { notifications, removeNotification } = useWebSocketConnection(userRole);

  // Page cards configuration with local images
  const pageCards = [
    {
      title: "Geo-Fencing",
      image: "/geofence.png",
      description: "Manage Geo-Fencing Locations",
      route: "/GeoFence",
      allowedRoles: ["ROLE_ADMIN"], // Add allowed roles for each card
    },
    {
      title: "Groups",
      image: "/groups.png",
      description: "Manage and View Groups",
      route: "/GroupsPage",
      allowedRoles: ["ROLE_ADMIN"], // Add allowed roles for each card
    },
    {
      title: "Attendance",
      image: "/attendance.png",
      description: "View and Manage Attendance",
      route: "/attendance",
      allowedRoles: ["ROLE_ADMIN", "ROLE_USER"], // Visible for all roles
    },
    {
      title: "Employees",
      image: "/employees.png",
      description: "Employee Management",
      route: "/EmployeesPage",
      allowedRoles: ["ROLE_ADMIN"],
    },
    {
      title: "IPS",
      image: "/cctv.png",
      description: "Indoor Positioning System",
      route: "/IPS",
      allowedRoles: ["ROLE_ADMIN", "ROLE_USER"], // Visible for all roles
    },
    {
      title: "Profile",
      image: "/user.png",
      description: "Profile Management",
      route: "/profile",
      allowedRoles: ["ROLE_ADMIN", "ROLE_USER"], // Visible for all roles
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.role) {
        setUserRole(decodedToken.role); // Set user's role
        fetchUserData(decodedToken.sub);
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

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

  const handlePageCardClick = (route) => {
    router.push(route);
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

      <div className="ml-[260px] p-8 flex-1 flex justify-center items-center">
        {/* Page Cards Grid */}
        <div className="grid grid-cols-3 gap-8">
          {pageCards
            .filter((card) => card.allowedRoles.includes(userRole)) // Filter cards by role
            .map((card, index) => (
              <div
                key={index}
                onClick={() => handlePageCardClick(card.route)}
                className="group bg-white hover:bg-[#7e22ce] shadow-lg rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
              >
                <div className="relative w-[400px] h-20 mb-4">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Title */}
                <h3 className="mt-4 text-lg font-semibold text-black group-hover:text-white">
                  {card.title}
                </h3>
                {/* Description */}
                <p className="text-sm text-black text-center mt-2 group-hover:text-white">
                  {card.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
