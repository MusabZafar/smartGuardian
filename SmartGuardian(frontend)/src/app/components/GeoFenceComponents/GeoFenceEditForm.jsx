import React, { useState, useEffect } from 'react';
import { GoogleMap, DrawingManager, Polygon } from '@react-google-maps/api';

const GeoFenceEditForm = ({ geofence, onSave, onCancel, users, groups }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedUsers: [],
    selectedGroups: [],
    polygonCoordinates: [],
    polygonColor: '#FF0000'
  });
  
  const [map, setMap] = useState(null);
  const [existingPolygon, setExistingPolygon] = useState(null);
  const [error, setError] = useState('');
  
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  // Function to parse coordinates
  const parseCoordinates = (coords) => {
    if (!coords) return [];
    
    return coords.map(coord => {
      if (typeof coord === 'string') {
        const [lat, lng] = coord.split(',').map(Number);
        return { lat, lng };
      }
      return coord;
    });
  };

  // Function to calculate map center and bounds
  const calculateMapView = (coordinates) => {
    if (!coordinates || coordinates.length === 0) {
      return { center: { lat: 24.8607, lng: 67.0011 }, zoom: 12 };
    }

    const bounds = new window.google.maps.LatLngBounds();
    coordinates.forEach(coord => {
      bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
    });

    return {
      center: {
        lat: bounds.getCenter().lat(),
        lng: bounds.getCenter().lng()
      },
      zoom: 12
    };
  };

  useEffect(() => {
    if (geofence) {
      const formattedCoordinates = parseCoordinates(geofence.polygonCoordinates);
      
      setFormData({
        name: geofence.name || '',
        description: geofence.description || '',
        selectedUsers: geofence.selectedUsers || [],
        selectedGroups: geofence.selectedGroups || [],
        polygonCoordinates: formattedCoordinates,
        polygonColor: geofence.polygonColor || '#FF0000'
      });

      // If map is already loaded, create the polygon
      if (map) {
        createPolygon(formattedCoordinates, geofence.polygonColor || '#FF0000');
      }
    }
  }, [geofence, map]);

  const createPolygon = (coordinates, color) => {
    // Clear existing polygon
    if (existingPolygon) {
      existingPolygon.setMap(null);
    }

    // Create new polygon
    const newPolygon = new window.google.maps.Polygon({
      paths: coordinates,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      editable: true,
      draggable: true
    });

    newPolygon.setMap(map);
    setExistingPolygon(newPolygon);

    // Add listeners for polygon changes
    const path = newPolygon.getPath();
    ['set_at', 'insert_at', 'remove_at'].forEach(event => {
      window.google.maps.event.addListener(path, event, () => {
        const updatedCoords = path.getArray().map(coord => ({
          lat: coord.lat(),
          lng: coord.lng()
        }));
        setFormData(prev => ({ ...prev, polygonCoordinates: updatedCoords }));
      });
    });

    // Fit bounds to show the polygon
    const bounds = new window.google.maps.LatLngBounds();
    coordinates.forEach(coord => {
      bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
    });
    map.fitBounds(bounds);
  };

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    
    if (formData.polygonCoordinates.length > 0) {
      createPolygon(formData.polygonCoordinates, formData.polygonColor);
    }
  };

  const onPolygonComplete = (poly) => {
    const coordinates = poly.getPath().getArray().map(coord => ({
      lat: coord.lat(),
      lng: coord.lng()
    }));

    // Remove the newly drawn polygon
    poly.setMap(null);

    // Create our managed polygon
    createPolygon(coordinates, formData.polygonColor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.polygonCoordinates.length < 3) {
      setError('Please draw a valid polygon with at least 3 points');
      return;
    }

    // Get final coordinates from the polygon
    let finalCoordinates = formData.polygonCoordinates;
    if (existingPolygon) {
      finalCoordinates = existingPolygon.getPath().getArray().map(coord => ({
        lat: coord.lat(),
        lng: coord.lng()
      }));
    }

    try {
      await onSave({
        ...formData,
        polygonCoordinates: finalCoordinates
      });
    } catch (err) {
      setError('Failed to save geofence. Please try again.');
    }
  };

  const { center, zoom } = calculateMapView(formData.polygonCoordinates);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{geofence ? 'Edit' : 'Create'} Geofence</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Users:</label>
            <select
              multiple
              value={formData.selectedUsers}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  option => option.value
                );
                setFormData(prev => ({ ...prev, selectedUsers: selectedOptions }));
              }}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              {users?.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Groups:</label>
            <select
              multiple
              value={formData.selectedGroups}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  option => option.value
                );
                setFormData(prev => ({ ...prev, selectedGroups: selectedOptions }));
              }}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              {groups?.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Area:</label>
            <div className="border rounded">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
                onLoad={onMapLoad}
              >
                <DrawingManager
                  onPolygonComplete={onPolygonComplete}
                  options={{
                    drawingControl: true,
                    drawingControlOptions: {
                      position: window.google.maps.ControlPosition.TOP_CENTER,
                      drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
                    },
                    polygonOptions: {
                      fillColor: formData.polygonColor,
                      strokeColor: formData.polygonColor
                    }
                  }}
                />
              </GoogleMap>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Draw a polygon to define the geofence area. You can edit the polygon by dragging its points.
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {geofence ? 'Update' : 'Create'} Geofence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeoFenceEditForm;