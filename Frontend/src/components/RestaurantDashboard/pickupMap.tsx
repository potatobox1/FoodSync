"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import styles from "../../styles/pickupMap.module.css";
import { useAppSelector } from "../../redux/hooks";
import { fetchRestaurantPickupMapData } from "../../services/analytics";

interface FoodBank {
  name: string;
  coordinates: [number, number]; // [lat, lng]
  distance: number;
}

const RestaurantPickupMap: React.FC = () => {
  const restaurantId = useAppSelector((state: any) => state.user.type_id);
  const [restaurantLocation, setRestaurantLocation] = useState<LatLngExpression | null>(null);
  const [foodbanks, setFoodbanks] = useState<FoodBank[]>([]);
  const [avgDistance, setAvgDistance] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRestaurantPickupMapData(restaurantId);
        setRestaurantLocation(data.restaurantLocation.coordinates);
        setFoodbanks(data.foodbanks);
        setAvgDistance(data.avgDistance);
      } catch (err) {
        console.error("❌ Failed to load pickup map data:", err);
      }
    };

    if (restaurantId) loadData();
  }, [restaurantId]);

  if (!restaurantLocation) return <div>Loading map...</div>;

  return (
    <div className={styles.mapContainer}>
      <div className={styles.metrics}>
        <div>Average Pickup Distance: {avgDistance ?? "—"} km</div>
      </div>
      <MapContainer center={restaurantLocation} zoom={12} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <Marker position={restaurantLocation}>
          <Popup>Restaurant</Popup>
        </Marker>

        {foodbanks.map((fb, index) => (
          <Marker key={index} position={fb.coordinates}>
            <Popup>{fb.name} - {fb.distance.toFixed(2)} km</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RestaurantPickupMap;
