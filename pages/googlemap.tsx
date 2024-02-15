import { useEffect, useRef, useState } from 'react';


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
  markers?: { location: { _lat: number; _long: number }; }[];
}

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
      markers.forEach((marker) => {
        new google.maps.Marker({
          position: { lat: marker.location._lat, lng: marker.location._long },
          map,
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
      style={{ width: '100%', height: '400px', ...style }}
    />
  );
};

export default GoogleMap;
