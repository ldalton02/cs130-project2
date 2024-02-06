"use client"; // This is a client component 👈🏽

import styles from '../../styles/css/Homepage.module.css'
import MapComponent from '../../components/CustomMap'
import React, { useEffect, useState } from 'react';


export default function Home() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);


  useEffect(() => {

    // Check if geolocation is supported by the browser
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }


  }, []);



  return (
    <div className={styles.homepage}>
      <h1>Bruin Banter</h1>
      <div>
        <MapComponent userLocation={userLocation} />
      </div>

    </div>
  );
}
