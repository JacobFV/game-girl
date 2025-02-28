import { useState, useRef, useEffect, ReactNode } from 'react';

interface DraggablePanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  initialPosition?: { x: number; y: number };
}

const DraggablePanel = ({
  title,
  children,
  className = '',
  initialPosition = { x: 0, y: 0 }
}: DraggablePanelProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Set initial position
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      setIsDragging(true);
      
      // Calculate the offset from the mouse position to the panel's top-left corner
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && panelRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        setPosition({ x: newX, y: newY });
        panelRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div 
      ref={panelRef}
      className={`panel draggable-panel ${className} ${isDragging ? 'dragging' : ''}`}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <div 
        className="panel-header"
        onMouseDown={handleMouseDown}
      >
        <div className="panel-title">{title}</div>
      </div>
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
};

export default DraggablePanel; 