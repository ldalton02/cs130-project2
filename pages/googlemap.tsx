import { useEffect, useRef } from 'react';
import { images } from '../assets/index';
import { Button } from '@/components/ui/button';
import { InfoWindow } from "@react-google-maps/api";

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
  onMarkerChange: (index: string | null) => void;
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
  notSignedIn,
  signInCheckResult,
  setIsOpen,
  setPlace,
  onMarkerChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current || !markers || markers.length === 0) return;

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        streetViewControl,
        clickableIcons,
        maxZoom,
        minZoom,
      });

      // Calculate distances from user location to each marker
      const distances = markers.map((marker) => {
        const markerLocation = new google.maps.LatLng(marker.location._lat, marker.location._long);
        return google.maps.geometry.spherical.computeDistanceBetween(center, markerLocation);
      });

      // Find the index of the closest marker within 50 meters
      let closestMarkerIndex = -1;
      let minDistance = Infinity;
      distances.forEach((distance, index) => {
        if (distance < 50 && distance < minDistance) {
          minDistance = distance;
          closestMarkerIndex = index;
        }
      });

      // Invoke the callback function with the closestMarkerIndex
      if (closestMarkerIndex !== -1) {
        onMarkerChange(markers[closestMarkerIndex].name);
      }
      else {
        onMarkerChange(null);
      }

      // Add markers to the map
      markers.forEach((marker, index) => {
        const iconMarker = new google.maps.Marker({
          position: { lat: marker.location._lat, lng: marker.location._long },
          map,
          animation: google.maps.Animation.DROP,
          icon: images[`${marker.type}_green`],
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
