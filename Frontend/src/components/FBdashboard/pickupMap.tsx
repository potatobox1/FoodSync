import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, latLng } from "leaflet";
import styles from "../../styles/pickupMap.module.css";

const restaurantLocations = [
  { name: "Baradari", lat: 31.5497, lng: 74.3436 },
  { name: "Spice Garden", lat: 31.5204, lng: 74.3587 },
  { name: "Fresh Bites", lat: 31.5566, lng: 74.3418 },
];

const MapComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [distances, setDistances] = useState<number[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [avgDistance, setAvgDistance] = useState<number | null>(null);

  useEffect(() => {
    const fallbackLocation = [31.5497, 74.3436]; // Default location (Lahore, Pakistan)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation([userLat, userLng]);

          // Calculate distances
          const calculatedDistances = restaurantLocations.map((restaurant) =>
            latLng(userLat, userLng).distanceTo(latLng(restaurant.lat, restaurant.lng)) / 1000 // convert to km
          );
          setDistances(calculatedDistances);

          // Calculate MAX and AVG distance
          const max = Math.max(...calculatedDistances);
          const avg = calculatedDistances.reduce((a, b) => a + b, 0) / calculatedDistances.length;

          setMaxDistance(max);
          setAvgDistance(avg);
        },
        (error) => {
          console.error("Error getting location", error);
          // setUserLocation(fallbackLocation); // Fallback to default location
        }
      );
    } else {
      // setUserLocation(fallbackLocation); // Fallback if geolocation is not available
    }
  }, []);

  if (!userLocation) {
    return <div>Loading map...</div>; // Wait until we get the user's location
  }

  return (
    <div className={styles.mapContainer}>
      <div className={styles.metrics}>
        <div>MAX Distance: {maxDistance ? maxDistance.toFixed(2) : "Loading..."} km</div>
        <div>AVG Distance: {avgDistance ? avgDistance.toFixed(2) : "Loading..."} km</div>
      </div>
      <MapContainer center={userLocation} zoom={12} style={{ height: "400px", width: "100%" }}>
      <TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
/>




        {/* User's location */}
        <Marker position={userLocation}>
          <Popup>You</Popup>
        </Marker>

        {/* Restaurant markers */}
        {restaurantLocations.map((restaurant, index) => (
          <Marker
            key={restaurant.name}
            position={[restaurant.lat, restaurant.lng] as LatLngExpression}
          >
            <Popup>
              {restaurant.name} - {distances[index]?.toFixed(2)} km away
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
