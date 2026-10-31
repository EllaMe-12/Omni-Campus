import React, { useState } from 'react';
import './CampusExplorer.css';

export default function CampusExplorer({ targetCollegeName, targetAddress }) {
  const [transportMode, setTransportMode] = useState('driving');
  const [showStreetView, setShowStreetView] = useState(false);

  return (
    <div className="campus-explorer-container">
      <h3>Route to {targetCollegeName}</h3>
      <p className="address-text">Destination: {targetAddress}</p>

      {/* Travel Modes */}
      <div className="transport-tabs">
        <button onClick={() => setTransportMode('driving')} className={transportMode === 'driving' ? 'active' : ''}>🚗 Driving (24 mins)</button>
        <button onClick={() => setTransportMode('transit')} className={transportMode === 'transit' ? 'active' : ''}>🚌 Public Transit (40 mins)</button>
        <button onClick={() => setTransportMode('walking')} className={transportMode === 'walking' ? 'active' : ''}>🚶 Walking (1.5 hrs)</button>
      </div>

      {/* Real-time Map Simulation / Embed */}
      <div className="map-preview-box">
        <iframe
          title="Route Map"
          width="100%"
          height="250"
          style={{ border: 0, borderRadius: '8px' }}
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_API_KEY&origin=Your+College&destination=${encodeURIComponent(targetAddress)}&mode=${transportMode}`}
        ></iframe>
      </div>

      {/* 360 Degree Street View Toggle */}
      <button className="street-view-btn" onClick={() => setShowStreetView(!showStreetView)}>
        {showStreetView ? 'Close 360° View' : 'Explore 360° Facility View 🌐'}
      </button>

      {showStreetView && (
        <div className="pano-container">
          <iframe
            title="360 Panorama"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '8px' }}
            src="https://maps.google.com/maps?q=&output=embed"
          ></iframe>
          <span className="pano-badge">Interactive 360° Campus View Active</span>
        </div>
      )}
    </div>
  );
}