import React, { useMemo } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

const GeoFenceCard = ({
  geoFenceData,
  onDelete,
  onView,
  users = [],
  groups = [],
  onEdit,
}) => {
  const Google_Map_Api_key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!geoFenceData) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  const getUserNames = useMemo(() => {
    if (!geoFenceData.selectedUsers || geoFenceData.selectedUsers.length === 0)
      return [];

    return geoFenceData.selectedUsers.map((userId) => {
      const user = users.find((u) => u.id.toString() === userId.toString());
      return user ? `${user.firstName} ${user.lastName}` : `User ID: ${userId}`;
    });
  }, [geoFenceData.selectedUsers, users]);

  const getGroupNames = useMemo(() => {
    if (
      !geoFenceData.selectedGroups ||
      geoFenceData.selectedGroups.length === 0
    )
      return [];

    return geoFenceData.selectedGroups.map((groupId) => {
      const group = groups.find((g) => g.id.toString() === groupId.toString());
      return group ? group.name : `Group ID: ${groupId}`;
    });
  }, [geoFenceData.selectedGroups, groups]);

  // Format polygon coordinates for Google Maps
  const polygonCoordinates = useMemo(() => {
    if (!geoFenceData.polygonCoordinates) return [];

    return geoFenceData.polygonCoordinates.map((coord) => {
      if (typeof coord === "string") {
        const [lat, lng] = coord.split(",").map(Number);
        return { lat, lng };
      }
      return coord;
    });
  }, [geoFenceData.polygonCoordinates]);

  // Calculate map center from polygon coordinates
  const mapCenter = useMemo(() => {
    if (!polygonCoordinates.length || !window.google?.maps) {
      return { lat: 0, lng: 0 };
    }

    const bounds = new window.google.maps.LatLngBounds();
    polygonCoordinates.forEach((coord) => {
      bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
    });

    return {
      lat: bounds.getCenter().lat(),
      lng: bounds.getCenter().lng(),
    };
  }, [polygonCoordinates]);

  const handleEditClick = () => {
    // Pass formatted polygon coordinates to edit handler
    onEdit({
      ...geoFenceData,
      polygonCoordinates: polygonCoordinates,
    });
  };

  return (
    <div
      className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white border border-gray-300 mb-6"
      style={{
        borderLeft: `10px solid ${geoFenceData.polygonColor || "#000"}`,
      }}
    >
      <table className="w-full text-sm text-left text-gray-700">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          {geoFenceData.name || "No Name"}
          <p className="mt-1 text-sm font-normal text-gray-500">
            GeoFence details and configuration.
          </p>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Field
            </th>
            <th scope="col" className="px-6 py-3">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              Description
            </th>
            <td className="px-6 py-4">
              {geoFenceData.description || "No Description"}
            </td>
          </tr>
          <tr className="bg-white border-b">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              Selected Users
            </th>
            <td className="px-6 py-4">
              {getUserNames.length > 0 ? (
                getUserNames.map((userName, index) => (
                  <div key={index} className="text-gray-700">
                    {userName}
                  </div>
                ))
              ) : (
                <span className="text-gray-700">No users selected</span>
              )}
            </td>
          </tr>
          <tr className="bg-white border-b">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              Selected Groups
            </th>
            <td className="px-6 py-4">
              {getGroupNames.length > 0 ? (
                getGroupNames.map((groupName, index) => (
                  <div key={index} className="text-gray-700">
                    {groupName}
                  </div>
                ))
              ) : (
                <span className="text-gray-700">No groups selected</span>
              )}
            </td>
          </tr>
          <tr className="bg-white border-b">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              Polygon Area
            </th>
            <td className="px-6 py-4">
              <div style={{ height: "200px", width: "100%" }}>
                {polygonCoordinates.length > 0 && (
                  <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={mapCenter}
                    zoom={13}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                    }}
                  >
                    <Polygon
                      paths={polygonCoordinates}
                      options={{
                        fillColor: geoFenceData.polygonColor || "#000000",
                        fillOpacity: 0.35,
                        strokeColor: geoFenceData.polygonColor || "#000000",
                        strokeOpacity: 1,
                        strokeWeight: 2,
                      }}
                    />
                  </GoogleMap>
                )}
              </div>
            </td>
          </tr>
          {geoFenceData.polygonColor && (
            <tr className="bg-white">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                Polygon Color
              </th>
              <td className="px-6 py-4">
                <div
                  className="w-12 h-6 rounded-md border"
                  style={{ backgroundColor: geoFenceData.polygonColor }}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="absolute top-4 right-4 flex space-x-2">
      <button
          onClick={() => onView(geoFenceData)}  // Add view button
          className="transition-colors text-gray-700 hover:text-white border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          View
        </button>

        <button
          onClick={handleEditClick}
          className="transition-colors text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(geoFenceData.id)}
          className="transition-colors text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
        >
          Delete
        </button>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4 text-center">
        <p className="text-sm text-gray-500">
          <i>Last updated: {new Date().toLocaleString()}</i>
        </p>
      </div>
    </div>
  );
};

export default GeoFenceCard;
