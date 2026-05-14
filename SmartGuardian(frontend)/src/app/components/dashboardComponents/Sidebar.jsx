"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaUsers,
  FaUserFriends,
  FaMapPin,
  FaSignOutAlt,
  FaUser,
  FaClipboardList,
  FaTimes,
  FaMapMarkedAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // सही तरीके से इम्पोर्ट किया

const Sidebar = () => {
  const router = useRouter();
  const defaultImage = "/defaultUserImage.svg";

  const [userData, setUserData] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(defaultImage);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef(null);
  const [attendanceDropdown, setAttendanceDropdown] = useState(false);

  // टोकन से यूजरनेम निकालने का फंक्शन
  const extractUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.sub; // अपने टोकन की संरचना के अनुसार एडजस्ट करें
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  const fetchUserData = async (username) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/users/by-username`,
        {
          params: { username },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUserData(response.data);

      if (response.data.imageUrl) {
        setUserProfileImage(response.data.imageUrl);
      }
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response ? error.response.data : error.message
      );

      setUserProfileImage(defaultImage);
    }
  };

  const handleMouseEnter = () => {
    if (isSidebarHidden) {
      setIsHovering(true);
      setIsSidebarHidden(false);
    }
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      if (isHovering) {
        setIsSidebarHidden(true);
        setIsHovering(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
    setIsHovering(false);
  };

  useEffect(() => {
    const username = extractUsernameFromToken();
    if (username) {
      fetchUserData(username);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarHidden === false
      ) {
        setIsSidebarHidden(true);
        setIsHovering(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarHidden]);

  const isAdmin = userData?.roles?.some((role) => role.name === "ROLE_ADMIN");

  const toggleAttendanceDropdown = () => {
    setAttendanceDropdown(!attendanceDropdown);
  };

  return (
    <nav
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-white text-black shadow-xl h-screen fixed top-0 left-0 transition-all duration-300 ${
        isSidebarHidden ? "w-16" : "w-64"
      } py-6 px-4 font-sans flex flex-col z-50`}
    >
      {!isSidebarHidden && (
        <div className="flex flex-col items-center mb-8 group">
          <div className="relative w-20 h-20 text-black rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform">
            <Image
              src={userProfileImage}
              alt="User Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center text-black mt-4">
            <p className="text-xl font-bold text-black">
              {userData?.firstName && userData?.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : "User Name"}
            </p>
            <p className="text-sm text-black">{userData?.email || "Email"}</p>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => router.push("/profile")} // Navigate to the profile page
            className="mt-4 px-2 py-1 text-[12px]  bg-slate-800  border-black text-white rounded-lg    transition-all"
          >
            Edit Profile
          </button>
        </div>
      )}

      {!isSidebarHidden && (
        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={toggleSidebar}
        >
          <FaTimes size={20} />
        </div>
      )}

      <hr className="border-gray-200 mb-6" />

      <ul className="space-y-2 ">
        <SidebarLink
          href="/dashboard"
          icon={<FaHome className="text-3xl" />}
          isSidebarHidden={isSidebarHidden}
        >
          Dashboard
        </SidebarLink>
        <SidebarLink
          href="/EmployeesPage"
          icon={<FaUsers className="text-3xl" />}
          isSidebarHidden={isSidebarHidden}
        >
          Team Members
        </SidebarLink>
        <SidebarLink
          href="/GroupsPage"
          icon={<FaUserFriends className="text-3xl" />}
          isSidebarHidden={isSidebarHidden}
        >
          Groups
        </SidebarLink>
        {isAdmin && (
          <SidebarLink
            href="/GeoFence"
            icon={<FaMapPin className="text-3xl" />}
            isSidebarHidden={isSidebarHidden}
          >
            Geo-fencing
          </SidebarLink>
        )}
        {/* Attendance with Dropdown */}
        <li>
  <div
    onClick={toggleAttendanceDropdown}
    className={`flex items-center text-black hover:text-blue-600 hover:bg-blue-50 p-3 rounded-lg transition-all cursor-pointer ${
      isSidebarHidden ? "justify-center" : "justify-start"
    }`}
  >
    <div className={`text-2xl ${isSidebarHidden ? "mx-auto" : "mr-3"}`}>
      <FaClipboardList />
    </div>
    {!isSidebarHidden && (
      <span className="text-sm font-medium">Attendance</span>
    )}
    {!isSidebarHidden && (
      <div className="ml-auto">
        {attendanceDropdown ? (
          <FaChevronUp className="text-sm" /> // Up arrow when dropdown is open
        ) : (
          <FaChevronDown className="text-sm" /> // Down arrow when dropdown is closed
        )}
      </div>
    )}
  </div>

  {attendanceDropdown && !isSidebarHidden && (
    <ul className="ml-8 mt-2 space-y-2">
      {/* Self Attendance Option */}
      <SidebarLink
        href="/SelfAttendance"
        icon={<FaUser className="text-xl" />}
        isSidebarHidden={false}
      >
        Self Attendance
      </SidebarLink>

      {/* Team Attendance Option */}
      <SidebarLink
        href="/attendance"
        icon={<FaUsers className="text-xl" />} // Team icon
        isSidebarHidden={false}
      >
        Team Attendance
      </SidebarLink>
    </ul>
  )}
</li>


        <SidebarLink
          href="/profile"
          icon={<FaUser className="text-3xl" />}
          isSidebarHidden={isSidebarHidden}
        >
          Profile
        </SidebarLink>
        {/* नया IPS लिंक */}
        <SidebarLink
          href="/IPS"
          icon={<FaMapMarkedAlt className="text-3xl" />}
          isSidebarHidden={isSidebarHidden}
        >
          IPS (Indoor-Positioning System)
        </SidebarLink>
      </ul>

      <div className="mt-auto ">
        <hr className="border-gray-200 mb-4" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center text-black hover:bg-red-50 p-3 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="text-3xl" />
          {!isSidebarHidden && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </nav>
  );
};

const SidebarLink = ({ href, icon, children, isSidebarHidden }) => (
  <li>
    <Link
      href={href}
      className={`flex items-center   text-black hover:text-blue-600 hover:bg-blue-50 p-3 rounded-lg transition-all ${
        isSidebarHidden ? "justify-center" : "justify-start"
      }`}
    >
      <div className={`text-2xl ${isSidebarHidden ? "mx-auto" : "mr-3"}`}>
        {icon}
      </div>
      {!isSidebarHidden && (
        <span className=" text-sm font-medium ">{children}</span>
      )}
    </Link>
  </li>
);

export default Sidebar;
