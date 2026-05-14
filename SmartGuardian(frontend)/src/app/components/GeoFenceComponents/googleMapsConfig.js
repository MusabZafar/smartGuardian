// config/googleMapsConfig.js

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export const defaultMapConfig = {
  libraries: ["drawing"],
  googleMapsApiKey: GOOGLE_MAPS_API_KEY
};

export const defaultMapContainerStyle = {
  width: '100%',
  height: '400px'
};

export const defaultCenter = {
  lat: 24.8607,
  lng: 67.0011
};