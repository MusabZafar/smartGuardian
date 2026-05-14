"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/dashboardComponents/Sidebar";
import GeoFenceCard from "../components/GeoFenceComponents/GeoFenceCard";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import NotificationContainer from "../components/webSocketComponents/NotificationContainer"; // Import Notification Container
import { useWebSocketConnection } from "../api/useWebSocketConnection";
import GeoFenceEditForm from '../components/GeoFenceComponents/GeoFenceEditForm';
import { defaultMapConfig, defaultMapContainerStyle, defaultCenter } from '../components/GeoFenceComponents/googleMapsConfig';
import GeoFenceView from '../components/GeoFenceComponents/GeoFenceView';

const GeoFencePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGeoFence, setEditingGeoFence] = useState(null);
  const [viewingGeofence, setViewingGeofence] = useState(null);

  const [geoFenceData, setGeoFenceData] = useState({
    name: "",
    description: "",
    selectedUsers: [],
    selectedGroups: [],
    polygonCoordinates: [],
    polygonColor: "",
    polygonOverlay: null,
  });
  const [savedGeoFences, setSavedGeoFences] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 24.8607,
    lng: 67.0011,
  });
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [polygons, setPolygons] = useState([]);

  const { notifications, removeNotification } = useWebSocketConnection(userRole);

  const [editingGeofence, setEditingGeofence] = useState(null);

  const handleViewGeofence = (geofence) => {
    setViewingGeofence(geofence);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenFromStorage = localStorage.getItem("token");
      setToken(tokenFromStorage);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const usersResponse = await axios.get(
            "http://localhost:8080/api/employees",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUsers(usersResponse.data);

          const groupsResponse = await axios.get(
            "http://localhost:8080/api/groups",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setGroups(groupsResponse.data);

          const geoFencesResponse = await axios.get(
            "http://localhost:8080/api/geofences",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSavedGeoFences(geoFencesResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [token]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoomLevel(15);
        },
        () => {
          console.error("Unable to retrieve your location.");
        }
      );
    }
  }, []);

  const handleScriptLoad = () => {
    setIsLoaded(true);
  };

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);

    if (window.google && window.google.maps.drawing) {
      const drawingManagerInstance =
        new window.google.maps.drawing.DrawingManager({
          drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ["polygon"],
          },
          polygonOptions: {
            editable: true,
            draggable: true,
          },
        });

      drawingManagerInstance.setMap(mapInstance);
      setDrawingManager(drawingManagerInstance);

      window.google.maps.event.addListener(
        drawingManagerInstance,
        "overlaycomplete",
        (event) => {
          if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
            const path = event.overlay
              .getPath()
              .getArray()
              .map((latlng) => `${latlng.lat()},${latlng.lng()}`);

            const color =
              "#" + Math.floor(Math.random() * 16777215).toString(16);

            window.google.maps.event.addListener(
              event.overlay,
              "rightclick",
              () => {
                handleDeletePolygon(event.overlay);
              }
            );


            

            setGeoFenceData((prevState) => ({
              ...prevState,
              polygonCoordinates: path,
              polygonColor: color,
              polygonOverlay: event.overlay,
            }));

            event.overlay.setOptions({
              fillColor: color,
              strokeColor: color,
            });

            setPolygons((prevPolygons) => [
              ...prevPolygons,
              {
                coordinates: path,
                color: color,
                overlay: event.overlay,
              },
            ]);
          }
        }
      );
    }
  };


  const handleDeletePolygon = (overlay) => {
    overlay.setMap(null);

    setPolygons((prevPolygons) =>
      prevPolygons.filter((polygon) => polygon.overlay !== overlay)
    );

    if (geoFenceData.polygonOverlay === overlay) {
      setGeoFenceData((prevState) => ({
        ...prevState,
        polygonCoordinates: [],
        polygonColor: "",
        polygonOverlay: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (geoFenceData.polygonCoordinates.length < 3) {
      alert("Please create a polygon on the map first.");
      return;
    }

    try {
      const payload = {
        name: geoFenceData.name,
        description: geoFenceData.description,
        selectedUsers: geoFenceData.selectedUsers,
        selectedGroups: geoFenceData.selectedGroups,
        polygonCoordinates: geoFenceData.polygonCoordinates,
        polygonColor: geoFenceData.polygonColor,
      };

      let response;
      if (isEditMode && editingGeoFence) {
        response = await axios.put(
          `http://localhost:8080/api/geofences/${editingGeoFence.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setSavedGeoFences((prevState) =>
          prevState.map((geoFence) =>
            geoFence.id === editingGeoFence.id ? response.data : geoFence
          )
        );
      } else {
        response = await axios.post(
          "http://localhost:8080/api/geofences",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setSavedGeoFences((prevState) => [...prevState, response.data]);
      }

      setShowForm(false);
      setGeoFenceData({
        name: "",
        description: "",
        selectedUsers: [],
        selectedGroups: [],
        polygonCoordinates: [],
        polygonColor: "",
      });
      setIsEditMode(false);
      setEditingGeoFence(null);

      if (geoFenceData.polygonOverlay) {
        geoFenceData.polygonOverlay.setMap(null);
      }
      setPolygons([]);
    } catch (error) {
      console.error("Error saving GeoFence:", error);
      alert("Failed to save GeoFence. Please try again.");
    }
  };

  const handleEditGeoFence = (geoFence) => {
    setEditingGeoFence(geoFence);
    setGeoFenceData({
      name: geoFence.name,
      description: geoFence.description,
      selectedUsers: geoFence.selectedUsers,
      selectedGroups: geoFence.selectedGroups,
      polygonCoordinates: geoFence.polygonCoordinates,
      polygonColor: geoFence.polygonColor,
    });
    setShowForm(true);
    setIsEditMode(true);
  };

  const handleDeleteGeoFence = async (geoFenceId) => {
    try {
      await axios.delete(`http://localhost:8080/api/geofences/${geoFenceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedGeoFences((prevState) =>
        prevState.filter((geoFence) => geoFence.id !== geoFenceId)
      );
    } catch (error) {
      console.error("Error deleting GeoFence:", error);
      alert("Failed to delete GeoFence. Please try again.");
    }
  };


 const handleEdit = (geofence) => {
  setEditingGeofence({
    ...geofence,
    polygonCoordinates: geofence.polygonCoordinates.map(coord => {
      if (typeof coord === 'string') {
        const [lat, lng] = coord.split(',').map(Number);
        return { lat, lng };
      }
      return coord;
    })
  });
};

  const handleSave = async (updatedGeofence) => {
    try {
      await axios.put(
        `http://localhost:8080/api/geofences/${editingGeofence.id}`,
        updatedGeofence,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      fetchGeofences(); // Refresh the list
      setEditingGeofence(null); // Close the edit form
    } catch (error) {
      console.error('Error updating geofence:', error);
      setError('Failed to update geofence.');
    }
  };

  return (

    <LoadScript
    googleMapsApiKey="AIzaSyCnKuhzNXj8cMaxtiuX_9Qyc2Cg47pvCuo"
    onLoad={handleScriptLoad}
    libraries={["drawing"]}
  >
    <div className="flex relative">
      <Sidebar userData={userData} />
      {userRole === "ROLE_ADMIN" && (
        <NotificationContainer
          notifications={notifications}
          removeNotification={removeNotification}
        />
      )}

{editingGeofence && (
        <GeoFenceEditForm
          geofence={editingGeofence}
          onSave={handleSave}
          onCancel={() => setEditingGeofence(null)}
        />
      )}

{viewingGeofence && (
          <GeoFenceView
            geofence={viewingGeofence}
            onClose={() => setViewingGeofence(null)}
            users={users}
            groups={groups}
          />
        )}
      <div className="flex-1 ml-[260px] p-6">
        <h1 className="text-3xl font-semibold mb-4">GeoFence Page</h1>

        <button
          onClick={() => setShowForm(true)}
          className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Add GeoFence
        </button>

        {showForm && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10">
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-8 rounded-lg shadow-lg w-[80%] max-w-[1200px] overflow-y-auto max-h-[80vh]">
              <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit GeoFence" : "Add GeoFence"}
              </h2>
              <form onSubmit={handleSubmit}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="absolute top-2 text-3xl right-2 text-gray-600 hover:text-gray-900"
                >
                  &times;
                </button>

                <div>
                  <label htmlFor="name" className="block">
                    GeoFence Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={geoFenceData.name}
                    onChange={(e) =>
                      setGeoFenceData({
                        ...geoFenceData,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="description" className="block">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={geoFenceData.description}
                    onChange={(e) =>
                      setGeoFenceData({
                        ...geoFenceData,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block">Select Area on Map</label>
                 
                    {isLoaded && (
                      <GoogleMap
                        mapContainerStyle={{ height: "300px", width: "100%" }}
                        center={currentLocation}
                        zoom={zoomLevel}
                        onLoad={onMapLoad}
                      >
                        <Marker position={currentLocation} />
                      </GoogleMap>
                    )}
                  
                  <p className="text-sm text-gray-600 mt-2">
                    Use drawing tools to create a polygon. Right-click to delete.
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block">Select Users</label>
                  <div className="border p-2 rounded">
                    <select
                      multiple
                      value={geoFenceData.selectedUsers}
                      onChange={(e) => {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        setGeoFenceData((prevState) => ({
                          ...prevState,
                          selectedUsers: selectedOptions,
                        }));
                      }}
                      className="w-full p-2 border rounded"
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block">Select Groups</label>
                  <div className="border p-2 rounded">
                    <select
                      multiple
                      value={geoFenceData.selectedGroups}
                      onChange={(e) => {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        setGeoFenceData((prevState) => ({
                          ...prevState,
                          selectedGroups: selectedOptions,
                        }));
                      }}
                      className="w-full p-2 border rounded"
                    >
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    {isEditMode ? "Update GeoFence" : "Save GeoFence"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Tip: Right-click on a polygon to delete it
            </p>
          </div>
          {savedGeoFences.length > 0 ? (
            savedGeoFences.map((geoFence) => (
              <GeoFenceCard
                key={geoFence.id}
                geoFenceData={geoFence}
                onDelete={() => handleDeleteGeoFence(geoFence.id)}
                onEdit={() => handleEditGeoFence(geoFence)}
                onView={() => handleViewGeofence(geoFence)}  // Add this prop
                users={users}
                groups={groups}
              />
            ))
          ) : (
            <p>No GeoFences saved yet.</p>
          )}
        </div>
      </div>
    </div>
    </LoadScript>
  );
};

export default GeoFencePage;
