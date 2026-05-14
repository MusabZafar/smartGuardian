"use client";
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export function useWebSocketConnection(userRole) {
  const [notifications, setNotifications] = useState([]);

  const handleAttendanceTracking = async (notification) => {
    console.log('🚀 Starting attendance tracking process');
    console.log('📝 Received notification:', notification);

    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwt.decode(token);
      console.log('👤 Decoded token:', decodedToken);

      if (!decodedToken?.sub) {
        console.error('❌ No username found in token');
        return;
      }

      // First get the current user data
      const response = await axios.get(
        `http://localhost:8000/api/users/${decodedToken.sub}/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('📥 Current user data:', response.data);

      // Prepare the update data while maintaining the existing structure
      const updatedData = {
        ...response.data,
        Attendance_type: "Geofence",  // Note the capital A to match your API
        total_attendance: (response.data.total_attendance || 0) + 1  // Increment total_attendance
      };
      console.log('📤 Sending updated data:', updatedData);

      // Update the user data
      const updateResponse = await axios.put(
        `http://localhost:8000/api/users/${decodedToken.sub}/`,
        updatedData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Attendance updated successfully', updateResponse.data);
    } catch (error) {
      console.error('❌ Failed to update attendance:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
    }
  };

  useEffect(() => {
    console.log('🔄 WebSocket hook initialized with userRole:', userRole);

    if (userRole !== 'ROLE_ADMIN') {
      console.log('👋 Not connecting WebSocket - user is not admin');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('🚫 No token found in localStorage');
      return;
    }

    console.log('🔌 Setting up WebSocket connection...');
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log('🟢 WebSocket Connected for Admin');

        client.subscribe('/topic/geofence-entries', (message) => {
          console.log('📨 Received geofence entry message:', message.body);
          const notification = JSON.parse(message.body);
          setNotifications(prev => {
            console.log('📝 Adding entry notification to state');
            return [...prev, { ...notification, type: 'entry' }];
          });
          
          handleAttendanceTracking(notification);
        });

        client.subscribe('/topic/geofence-exits', (message) => {
          console.log('📨 Received geofence exit message:', message.body);
          const notification = JSON.parse(message.body);
          setNotifications(prev => {
            console.log('📝 Adding exit notification to state');
            return [...prev, { ...notification, type: 'exit' }];
          });
        });
      },
      onDisconnect: () => {
        console.log('🔴 WebSocket Disconnected');
      },
      debug: (str) => console.log('🔍 WebSocket Debug:', str),
    });

    client.activate();
    console.log('🚀 WebSocket client activated');

    return () => {
      console.log('🛑 Cleaning up WebSocket connection');
      client.deactivate();
    };
  }, [userRole]);

  const removeNotification = (indexToRemove) => {
    console.log('🗑️ Removing notification at index:', indexToRemove);
    setNotifications(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return { notifications, removeNotification };
}