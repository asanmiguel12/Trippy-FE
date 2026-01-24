import React, { useState } from 'react';
import { GoogleMap, Marker, LoadScript, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

interface TripMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
}

const TripMap: React.FC<TripMapProps> = ({
  center = defaultCenter,
  zoom = 10,
  markers = [],
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;

  const [mapCenter, setMapCenter] = useState(center);
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  if (!apiKey) {
    return <div>Google Maps API key not configured</div>;
  }

  const onPlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setMapCenter({ lat, lng });
    setSearchMarker({ lat, lng });
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
      {/* Search Bar */}
      <div className="mb-3">
        <Autocomplete
          onLoad={(auto) => setAutocomplete(auto)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a location"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Existing markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
          />
        ))}

        {/* Marker from search */}
        {searchMarker && <Marker position={searchMarker} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default TripMap;
