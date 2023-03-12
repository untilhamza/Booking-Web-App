import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import styled from "styled-components";
import { useMemo } from "react";
import "./Map.css";

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const center = useMemo(() => ({ lat: 37.5317, lng: 127.001 }), []);

  return (
    <MapWrapper>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap mapContainerClassName="google-map" center={center} zoom={20}>
          <Marker position={{ lat: 37.5317, lng: 127.001 }} />
        </GoogleMap>
      )}
    </MapWrapper>
  );
};

export default Map;

const MapWrapper = styled.div`
  margin-top: 20px;
  max-width: 500px;
  width: 100vw;
  height: 431px;
`;
