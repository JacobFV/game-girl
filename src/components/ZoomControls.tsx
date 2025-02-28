import React from 'react';
import '../styles/ZoomControls.css';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset
}) => {
  return (
    <div className="zoom-controls">
      <button 
        className="zoom-button" 
        onClick={onZoomOut}
        disabled={zoomLevel <= 0.5}
        aria-label="Zoom Out"
        type="button"
      >
        −
      </button>
      
      <button 
        className="zoom-button zoom-reset" 
        onClick={onZoomReset}
        aria-label="Reset Zoom"
        type="button"
      >
        {Math.round(zoomLevel * 100)}%
      </button>
      
      <button 
        className="zoom-button" 
        onClick={onZoomIn}
        disabled={zoomLevel >= 2}
        aria-label="Zoom In"
        type="button"
      >
        +
      </button>
    </div>
  );
};

export default ZoomControls; 