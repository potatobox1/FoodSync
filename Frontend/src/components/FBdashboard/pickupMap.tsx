"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import styles from "../../styles/pickupMap.module.css";
import { fetchPickupMapData } from "../../services/analytics";
import { useAppSelector } from "../../redux/hooks";

interface Restaurant {
  name: string;
  coordinates: [number, number]; 
  distance: number;
}

const MapComponent: React.FC = () => {
  const foodbankId = useAppSelector((state: any) => state.user.type_id);
  const [foodbankLocation, setFoodbankLocation] = useState<LatLngExpression | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [avgDistance, setAvgDistance] = useState<number | null>(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const data = await fetchPickupMapData(foodbankId);
        setFoodbankLocation(data.foodbankLocation.coordinates);
        setRestaurants(data.restaurants);
        setAvgDistance(data.avgDistance);
      } catch (err) {
        console.error("❌ Failed to load pickup map data:", err);
      }
    };

    if (foodbankId) loadMapData();
  }, [foodbankId]);

  if (!foodbankLocation) return <div>Loading map...</div>;

  return (
    <div className={styles.mapContainer}>
      <div className={styles.metrics}>
        <div>Average Pickup Distance: {avgDistance ?? "—"} km</div>
      </div>
      <MapContainer center={foodbankLocation} zoom={12} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

       
        <Marker position={foodbankLocation}>
          <Popup>Foodbank</Popup>
        </Marker>

       
        {restaurants.map((r, i) => (
          <Marker key={i} position={r.coordinates}>
            <Popup>
              {r.name} - {r.distance.toFixed(2)} km
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
