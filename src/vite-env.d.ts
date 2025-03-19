
/// <reference types="vite/client" />

// Google Maps type definitions
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: { lat: number; lng: number } | { lat(): number; lng(): number }): void;
    }
    class Marker {
      constructor(opts?: MarkerOptions);
    }
    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: string) => void): void;
    }
    interface MapOptions {
      center?: { lat: number; lng: number };
      zoom?: number;
      [key: string]: any;
    }
    interface MarkerOptions {
      position?: { lat: number; lng: number } | { lat(): number; lng(): number };
      map?: Map;
      animation?: number;
      [key: string]: any;
    }
    interface GeocoderRequest {
      address?: string;
      [key: string]: any;
    }
    interface GeocoderResult {
      geometry: {
        location: {
          lat(): number;
          lng(): number;
        };
      };
      [key: string]: any;
    }
  }
}

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
