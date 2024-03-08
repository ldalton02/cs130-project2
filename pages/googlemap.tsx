import { useEffect, useRef } from 'react';
import { images } from '../assets/index';

interface GoogleMapProps {
  apiKey: string;
  center: { lat: number; lng: number };
  selectedLocation: { lat: number; lng: number };
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
  onMarkerChange: (index: string[] | null) => void;

}

const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey,
  center,
  selectedLocation,
  zoom = selectedLocation ? 20 : 15,
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
        center: selectedLocation || center, // Use selectedLocation if available, otherwise use center
        zoom,
        streetViewControl,
        clickableIcons,
        maxZoom,
        minZoom,
      });
  
      // Add marker for the user's location
      const userMarker = new google.maps.Marker({
        position: center,
        map,
        animation: google.maps.Animation.DROP,
        icon: images["user_location"], // Provide the appropriate image for the user's location marker
      });
  
      // Calculate distances from user location to each marker
      const distances = markers.map((marker) => {
        const markerLocation = new google.maps.LatLng(marker.location._lat, marker.location._long);
        return {
          index: marker.name, // Store the index of the marker
          distance: google.maps.geometry.spherical.computeDistanceBetween(center, markerLocation) 
        };
      });
  
      // Find markers within {threshold} meters and store their indices
      const closestMarkersIndices : string[] = [];
      const thresholdDistance = 200; // Adjust the threshold distance as needed
      distances.forEach((item) => {
        if (item.distance < thresholdDistance) {
          closestMarkersIndices.push(item.index);
        }
      });
  
      // Invoke the callback function with the closestMarkersIndices
      onMarkerChange(closestMarkersIndices.length > 0 ? closestMarkersIndices : null);
  
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
  }, [apiKey, center, zoom, markers, selectedLocation]); // Add selectedLocation to dependency array
  

  return (
    
    <div
      ref={mapRef}
      className={className}
      style={{ width: '100%', height: '70vh', ...style }}
    />
  );
};

export default GoogleMap;
