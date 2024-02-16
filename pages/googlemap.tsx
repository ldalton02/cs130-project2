import { useEffect, useRef, useState } from 'react';
import { images } from '../assets/index';


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
  markers?: { location: { _lat: number; _long: number }; type: string}[];
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
      var previousInfoWindow = false;

      markers.forEach((marker) => {
        console.log(marker)
        const iconMarker = new google.maps.Marker({
          position: { lat: marker.location._lat, lng: marker.location._long },
          map,
          animation: google.maps.Animation.DROP,
          // TODO: Change the icon color based on activity levels
          // Roccos not showing up for some reason (very fitting)
          icon: images[`${marker.type}_green`],
        });

        // Click event listener
        const infoWindow = new google.maps.InfoWindow();
        const infoWindowContentString = `
          <div>
            <h2 style="padding-bottom: 5px; font-weight: bold;"></h2>
            <a href="/login">
              <button style="background-color: #007bff; color: #ffffff; border-radius: 10px; cursor: pointer; padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px;">
                Join
              </button>
            </a>
          </div>
        `;

        iconMarker.addListener("click", () => {
          //keeps only one info window open at a time
          if(previousInfoWindow) {
            previousInfoWindow.close();
          }
          previousInfoWindow = infoWindow;

          //set info window content
          infoWindow.setContent(infoWindowContentString);
          infoWindow.open(iconMarker.getMap(), iconMarker);
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
