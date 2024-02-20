import { useEffect, useRef, useState } from 'react';
import { images } from '../assets/index';
import { Button } from '@/components/ui/button';
interface GoogleMapProps {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  streetViewControl?: boolean;
  clickableIcons?: boolean;
  disableDefaultUI?: boolean;
  maxZoom?: number;
  minZoom?: number;
  markers?: { location: { _lat: number; _long: number }; type: string; name: string}[];
  notSignedIn: () => void;
  signInCheckResult: boolean,
  setIsOpen: (isOpen: boolean) => void;
  setPlace: (place: any) => void;
}

import { InfoWindow } from "@react-google-maps/api";

const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey,
  center,
  zoom = 15,
  className,
  style,
  streetViewControl = false,
  clickableIcons = false,
  maxZoom = 20,
  minZoom = 15,
  markers,
  notSignedIn,
  signInCheckResult,
  setIsOpen,
  setPlace,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        streetViewControl,
        clickableIcons,
        maxZoom,
        minZoom,
      });

      // Add markers to the map
      if (!markers) return;
      var previousInfoWindow = false;

      markers.forEach((marker) => {
        const iconMarker = new google.maps.Marker({
          position: { lat: marker.location._lat, lng: marker.location._long },
          map,
          animation: google.maps.Animation.DROP,
          // TODO: Change the icon color based on activity levels
          // Roccos not showing up for some reason (very fitting)
          icon: images[`${marker.type}_green`]
        });
        
        iconMarker.addListener("click", () => {
          if (signInCheckResult) {
            setPlace(marker);
            setIsOpen(true);    
          } else {
            notSignedIn();
          }          
        });
      });
    }

    return () => {
      // Clean up the script tag when the component unmounts
      document.head.removeChild(script);
    };
  }, [apiKey, center, zoom, markers]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width: '100%', height: '70vh', ...style }}
    />
  );
};

export default GoogleMap;
