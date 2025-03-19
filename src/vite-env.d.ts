
/// <reference types="vite/client" />

// Google Maps type definitions
interface Window {
  google?: {
    maps: {
      Map: typeof google.maps.Map;
      Marker: typeof google.maps.Marker;
      Geocoder: typeof google.maps.Geocoder;
      Animation: {
        DROP: number;
      };
      places: any;
    };
  };
}
