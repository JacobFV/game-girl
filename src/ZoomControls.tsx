import { useState, useEffect } from 'react';

interface ZoomControlsProps {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  minZoom = 0.5,
  maxZoom = 2.0,
  zoomStep = 0.1
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Apply zoom to the app container
  useEffect(() => {
    const appContainer = document.querySelector('.app-container') as HTMLElement;
    if (appContainer) {
      appContainer.style.transform = `scale(${zoomLevel})`;
      appContainer.classList.add('zoomed');
      
      // Adjust the body height to accommodate the zoomed content
      document.body.style.minHeight = `${100 * zoomLevel}vh`;
    }
    
    return () => {
      if (appContainer) {
        appContainer.classList.remove('zoomed');
      }
    };
  }, [zoomLevel]);
  
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + zoomStep, maxZoom));
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - zoomStep, minZoom));
  };
  
  const resetZoom = () => {
    setZoomLevel(1);
  };
  
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      resetZoom();
    }
  };
  
  return (
    <div className="zoom-controls">
      <button 
        type="button" 
        className="zoom-button" 
        onClick={zoomOut} 
        title="Zoom Out"
      >
        -
      </button>
      <button 
        type="button"
        className="zoom-level" 
        onClick={resetZoom} 
        onKeyUp={handleKeyPress}
        title="Reset Zoom"
      >
        {Math.round(zoomLevel * 100)}%
      </button>
      <button 
        type="button" 
        className="zoom-button" 
        onClick={zoomIn} 
        title="Zoom In"
      >
        +
      </button>
    </div>
  );
};

export default ZoomControls; 