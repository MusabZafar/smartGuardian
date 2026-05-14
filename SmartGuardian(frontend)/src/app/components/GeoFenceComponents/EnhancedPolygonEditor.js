"use client"
import React, { useEffect, useRef } from 'react';

const EnhancedPolygonEditor = ({ map, polygon, onChange }) => {
  const markersRef = useRef([]);
  const midpointMarkersRef = useRef([]);

  useEffect(() => {
    if (!map || !polygon) return;

    // Disable dragging of the entire polygon
    polygon.setDraggable(false);
    
    const path = polygon.getPath();
    
    // Function to create vertex markers
    const createVertexMarkers = () => {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add a marker for each vertex
      for (let i = 0; i < path.getLength(); i++) {
        const marker = new google.maps.Marker({
          position: path.getAt(i),
          map: map,
          draggable: true,
          cursor: 'move',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 7
          },
          zIndex: 2
        });

        // Update polygon vertex when marker is dragged
        marker.addListener('drag', () => {
          path.setAt(i, marker.getPosition());
          updateMidpointMarkers();
        });

        marker.addListener('dragend', () => {
          if (onChange) {
            const coordinates = Array.from({length: path.getLength()}, (_, i) => {
              const point = path.getAt(i);
              return `${point.lat()},${point.lng()}`;
            });
            onChange(coordinates);
          }
        });

        markersRef.current.push(marker);
      }
    };

    // Function to create/update midpoint markers
    const createMidpointMarker = (position, idx1, idx2) => {
      const marker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: true,
        cursor: 'pointer',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#FFA500',
          fillOpacity: 0.7,
          strokeWeight: 1,
          strokeColor: '#FFFFFF',
          scale: 5
        },
        zIndex: 1
      });

      // Create info window for "Drag to curve" message
      const infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 5px;">Drag to curve</div>',
        disableAutoPan: true
      });

      // Show info window on hover
      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
      });

      // Handle midpoint marker drag
      marker.addListener('drag', () => {
        const p1 = path.getAt(idx1);
        const p2 = path.getAt(idx2);
        const currentPos = marker.getPosition();
        
        // Calculate curve points
        const curvePoints = calculateCurvePoints(p1, currentPos, p2);
        
        // Update polygon path with curve points
        while (path.getLength() > idx1 + 1) {
          path.removeAt(idx1 + 1);
        }
        curvePoints.forEach((point, index) => {
          if (index > 0 && index < curvePoints.length - 1) {
            path.insertAt(idx1 + index, point);
          }
        });
        
        updateMidpointMarkers();
      });

      marker.addListener('dragend', () => {
        if (onChange) {
          const coordinates = Array.from({length: path.getLength()}, (_, i) => {
            const point = path.getAt(i);
            return `${point.lat()},${point.lng()}`;
          });
          onChange(coordinates);
        }
      });

      return marker;
    };

    // Function to update midpoint markers
    const updateMidpointMarkers = () => {
      // Clear existing midpoint markers
      midpointMarkersRef.current.forEach(marker => marker.setMap(null));
      midpointMarkersRef.current = [];

      // Create new midpoint markers
      for (let i = 0; i < path.getLength(); i++) {
        const p1 = path.getAt(i);
        const p2 = path.getAt((i + 1) % path.getLength());
        
        const midpoint = new google.maps.LatLng(
          (p1.lat() + p2.lat()) / 2,
          (p1.lng() + p2.lng()) / 2
        );

        const marker = createMidpointMarker(midpoint, i, (i + 1) % path.getLength());
        midpointMarkersRef.current.push(marker);
      }
    };

    // Function to calculate curve points using quadratic Bezier curve
    const calculateCurvePoints = (p1, control, p2, numPoints = 8) => {
      const points = [];
      for (let t = 0; t <= 1; t += 1/numPoints) {
        const lat = Math.pow(1-t, 2) * p1.lat() +
                   2 * (1-t) * t * control.lat() +
                   Math.pow(t, 2) * p2.lat();
        const lng = Math.pow(1-t, 2) * p1.lng() +
                   2 * (1-t) * t * control.lng() +
                   Math.pow(t, 2) * p2.lng();
        points.push(new google.maps.LatLng(lat, lng));
      }
      return points;
    };

    // Initialize the editor
    createVertexMarkers();
    updateMidpointMarkers();

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      midpointMarkersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [map, polygon, onChange]);

  return null;
};

export default EnhancedPolygonEditor;