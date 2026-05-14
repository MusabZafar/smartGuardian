import React from 'react';
import { GoogleMap, Polygon } from '@react-google-maps/api';
import { X } from 'lucide-react';

const GeoFenceView = ({ geofence, onClose, users, groups }) => {
  // Calculate map center from polygon coordinates
  const calculateCenter = (coordinates) => {
    if (!coordinates || coordinates.length === 0) {
      return { lat: 0, lng: 0 };
    }

    const bounds = new window.google.maps.LatLngBounds();
    coordinates.forEach(coord => {
      const position = typeof coord === 'string' 
        ? { lat: parseFloat(coord.split(',')[0]), lng: parseFloat(coord.split(',')[1]) }
        : coord;
      bounds.extend(new window.google.maps.LatLng(position.lat, position.lng));
    });

    return {
      lat: bounds.getCenter().lat(),
      lng: bounds.getCenter().lng()
    };
  };

  // Format polygon coordinates for Google Maps
  const formatCoordinates = (coords) => {
    return coords.map(coord => {
      if (typeof coord === 'string') {
        const [lat, lng] = coord.split(',').map(Number);
        return { lat, lng };
      }
      return coord;
    });
  };

  // Get user names from IDs
  const getUserNames = () => {
    if (!geofence.selectedUsers || !users) return [];
    return geofence.selectedUsers.map(userId => {
      const user = users.find(u => u.id.toString() === userId.toString());
      return user ? `${user.firstName} ${user.lastName}` : `User ID: ${userId}`;
    });
  };

  // Get group names from IDs
  const getGroupNames = () => {
    if (!geofence.selectedGroups || !groups) return [];
    return geofence.selectedGroups.map(groupId => {
      const group = groups.find(g => g.id.toString() === groupId.toString());
      return group ? group.name : `Group ID: ${groupId}`;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{geofence.name}</h2>
            <span className="text-sm text-gray-500">
              ID: {geofence.id}
            </span>
          </div>
          
          <div className="space-y-6">
            {/* Map View */}
            <div className="border rounded-lg overflow-hidden">
              <div className="h-64 w-full">
                <GoogleMap
                  mapContainerStyle={{ height: '100%', width: '100%' }}
                  center={calculateCenter(geofence.polygonCoordinates)}
                  zoom={14}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                  }}
                >
                  <Polygon
                    paths={formatCoordinates(geofence.polygonCoordinates)}
                    options={{
                      fillColor: geofence.polygonColor,
                      fillOpacity: 0.35,
                      strokeColor: geofence.polygonColor,
                      strokeOpacity: 1,
                      strokeWeight: 2,
                    }}
                  />
                </GoogleMap>
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{geofence.description || 'No description provided'}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold mb-2">Assigned Users</h3>
                <div className="space-y-1">
                  {getUserNames().map((name, index) => (
                    <div key={index} className="text-gray-700 bg-white p-2 rounded">
                      {name}
                    </div>
                  ))}
                  {getUserNames().length === 0 && (
                    <p className="text-gray-500 italic">No users assigned</p>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold mb-2">Assigned Groups</h3>
                <div className="space-y-1">
                  {getGroupNames().map((name, index) => (
                    <div key={index} className="text-gray-700 bg-white p-2 rounded">
                      {name}
                    </div>
                  ))}
                  {getGroupNames().length === 0 && (
                    <p className="text-gray-500 italic">No groups assigned</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Geofence Color</h3>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: geofence.polygonColor }}
                  />
                  <span className="text-gray-700">{geofence.polygonColor}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Coordinates</h3>
                <div className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-700">
                    {JSON.stringify(geofence.polygonCoordinates, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoFenceView;