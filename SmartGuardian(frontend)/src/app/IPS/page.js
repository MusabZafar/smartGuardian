"use client";
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/dashboardComponents/Sidebar";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import FloorPlanMap from "../components/IPSComponents/FloorPlanMap";

const IPSPage = () => {
  const [userLocations, setUserLocations] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 33.6772167,
    lng: 73.0680806,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "600px",
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const updateMapView = useCallback(
    (newLocation) => {
      if (map && newLocation) {
        map.panTo({ lat: newLocation.lat, lng: newLocation.lng });
        map.setZoom(21);
      }
    },
    [map]
  );

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        client.subscribe("/topic/locations", (message) => {
          try {
            const locationUpdate = JSON.parse(message.body);
            const newLocation = {
              lat: locationUpdate.latitude,
              lng: locationUpdate.longitude,
              timestamp: locationUpdate.timestamp,
              floor: locationUpdate.floor || 'basement', // Add floor information
            };

            setUserLocations((prev) => ({
              ...prev,
              [locationUpdate.username]: newLocation,
            }));

            setMapCenter(newLocation);
            updateMapView(newLocation);
          } catch (error) {
            console.error("Error processing location update:", error);
          }
        });
      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
      onError: (error) => console.error("WebSocket Error:", error),
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) client.deactivate();
    };
  }, [updateMapView]);

  const getColorForUser = (username) => {
    const colors = ["#2196F3", "#4CAF50", "#F44336", "#FFC107", "#9C27B0"];
    const index = Math.abs(
      username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">
              Indoor Positioning System (IPS)
            </h1>
          </header>

          <div className="flex flex-col space-y-6">
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="h-[500px] w-full">
                <FloorPlanMap
                  userLocations={userLocations}
                  onLoad={() => console.log("Floor plan loaded")}
                />
              </div>
            </div>

            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Active Users
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(userLocations).map(([username, location]) => (
                  <div
                    key={username}
                    className="bg-slate-50 rounded-lg p-4 transition-all hover:bg-slate-100"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getColorForUser(username) }}
                      />
                      <span className="font-medium text-gray-900">
                        {username}
                      </span>
                    </div>
                    <div className="ml-6 space-y-1">
                      <div className="text-sm text-gray-500">
                        Last update:{" "}
                        {new Date(location.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        Floor: {location.floor || 'basement'}
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        Lat: {location.lat.toFixed(6)}
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        Lng: {location.lng.toFixed(6)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IPSPage;