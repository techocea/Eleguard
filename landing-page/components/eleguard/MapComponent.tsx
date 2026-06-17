"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
  useEffect(() => {
    // Matara, Sri Lanka coordinates
    const matara = { lat: 5.8474, lng: 80.5353 };

    // Create map
    const map = L.map("map-container").setView([matara.lat, matara.lng], 13);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Add marker
    const marker = L.marker([matara.lat, matara.lng], {
      icon: L.icon({
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
    }).addTo(map);

    marker.bindPopup("<b>EleGuardLK</b><br>Matara, Sri Lanka").openPopup();

    // Cleanup
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="map-container"
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    />
  );
}
