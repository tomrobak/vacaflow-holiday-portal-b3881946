
import { useEffect, useRef } from "react";

interface GoogleMapProps {
  location: string;
  address?: string;
}

const GoogleMap = ({ location, address }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Load Google Maps script if it hasn't been loaded yet
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, [location]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Default to a generic location if geocoding fails
    const defaultLatLng = { lat: 40.7128, lng: -74.006 };
    
    // Initialize the map with default location
    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: defaultLatLng,
      zoom: 12,
      scrollwheel: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    // Use Geocoding service to convert address to coordinates
    const geocoder = new google.maps.Geocoder();
    const searchLocation = address || location;
    
    geocoder.geocode({ address: searchLocation }, (results, status) => {
      if (status === "OK" && results && results[0] && mapInstanceRef.current) {
        const position = results[0].geometry.location;
        mapInstanceRef.current.setCenter(position);
        
        // Add a marker
        new google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          animation: google.maps.Animation.DROP,
        });
      }
    });
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[300px] rounded-md overflow-hidden"
      aria-label={`Map showing location of ${location}`}
    />
  );
};

export default GoogleMap;
