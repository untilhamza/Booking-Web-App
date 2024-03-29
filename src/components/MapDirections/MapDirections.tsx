import React from 'react'
import Button from "react-bootstrap/Button";


const MapDirections = () => {

  const handleViewKakaoMapClick = () => {
    window.open(`https://map.kakao.com/link/to/Elkpro services,37.535323741447456, 126.99206905398854`);
  };
  const handleViewGoogleMapClick = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=37.535323741447456, 126.99206905398854`);
  };
  return (
    <div className="mb-2 row p-3 gap-2">
      <Button variant="primary col" className="d-block w-100" onClick={handleViewKakaoMapClick}>
        Kakao Map Directions
      </Button>
      <Button variant="primary col" className="d-block w-100" onClick={handleViewGoogleMapClick}>
        Google Map Directions
      </Button>
    </div>
  );
}

export default MapDirections