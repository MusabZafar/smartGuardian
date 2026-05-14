"use client"
import React, { useEffect, useState, useRef } from 'react';

const FloorPlanMap = ({ userLocations, onLoad }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const animationRef = useRef(null);
  const [currentFloor, setCurrentFloor] = useState('basement');
  const [floorImage] = useState(new Image());

  // Floor plans configuration
  const FLOOR_CONFIGS = {
    basement: {
      imagePath: '/floorplan.png',
      bounds: {
        minLat: 33.677165,
        maxLat: 33.677313,
        minLng: 73.067863,
        maxLng: 73.068210
      }
    },
    ground: {
      imagePath: '/groundFloor.png',
      bounds: {
        minLat: 33.676754,  // Bottom (bottom-right latitude)
        maxLat: 33.677058,  // Top (top-left latitude)
        minLng: 73.068148,  // Left (top-left longitude)
        maxLng: 73.068502   // Right (bottom-right longitude)
      }
    },
    first: {
      imagePath: '/firstFloor.png',
      bounds: {
        minLat: 33.676549,  // Bottom (bottom-right latitude)
        maxLat: 33.676899,  // Top (top-left latitude)
        minLng: 73.067798,  // Left (top-left longitude)
        maxLng: 73.068117   // Right (bottom-right longitude)
      }
    }
  };

  useEffect(() => {
    const loadImage = () => {
      try {
        floorImage.src = FLOOR_CONFIGS[currentFloor].imagePath;
        floorImage.onload = () => {
          console.log(`${currentFloor} floor plan image loaded successfully`);
          console.log('Image dimensions:', {
            width: floorImage.width,
            height: floorImage.height
          });
          setImageLoaded(true);
          if (onLoad) onLoad();
        };
        floorImage.onerror = (e) => {
          console.error(`Error loading ${currentFloor} floor plan image:`, e);
        };
      } catch (error) {
        console.error('Error in image loading:', error);
      }
    };
    setImageLoaded(false);
    loadImage();
  }, [currentFloor]);

  const getCurrentFloorBounds = () => {
    return FLOOR_CONFIGS[currentFloor].bounds;
  };

  const getColorForUser = (username) => {
    const colors = ["#2196F3", "#4CAF50", "#F44336", "#FFC107", "#9C27B0"];
    const index = Math.abs(
      username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % colors.length;
    return colors[index];
  };

  const convertLocationToPixel = (location) => {
    if (!location || !location.lat || !location.lng) return null;

    try {
      const mapWidth = floorImage.width;
      const mapHeight = floorImage.height;
      const bounds = getCurrentFloorBounds();
      
      console.log('Converting location:', location);
      console.log('Map dimensions:', { width: mapWidth, height: mapHeight });
      
      const lngPercent = (location.lng - bounds.minLng) / 
                        (bounds.maxLng - bounds.minLng);
      const latPercent = (bounds.maxLat - location.lat) / 
                        (bounds.maxLat - bounds.minLat);

      console.log('Position percentages:', { lngPercent, latPercent });

      const x = lngPercent * mapWidth;
      const y = latPercent * mapHeight;

      console.log('Calculated pixel coordinates:', { x, y });

      return { x, y };
    } catch (error) {
      console.error('Error converting coordinates:', error);
      return null;
    }
  };

  const drawUserMarker = (ctx, x, y, username, color) => {
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = `${color}33`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(username, x + 15, y + 5);
  };

  const drawCanvas = () => {
    if (!canvasRef.current || !containerRef.current || !imageLoaded) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    const scaleX = canvas.width / floorImage.width;
    const scaleY = canvas.height / floorImage.height;
    const scaleFactor = Math.min(scaleX, scaleY);

    const scaledWidth = floorImage.width * scaleFactor;
    const scaledHeight = floorImage.height * scaleFactor;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    ctx.drawImage(floorImage, x, y, scaledWidth, scaledHeight);

    // Only draw users on the current floor
    Object.entries(userLocations).forEach(([username, location]) => {
      if (location.floor === currentFloor || (!location.floor && currentFloor === 'basement')) {
        const point = convertLocationToPixel(location);
        if (point) {
          const scaledPoint = {
            x: x + (point.x * scaleFactor),
            y: y + (point.y * scaleFactor)
          };
          drawUserMarker(ctx, scaledPoint.x, scaledPoint.y, username, getColorForUser(username));
        }
      }
    });

    ctx.restore();
  };

  const animate = () => {
    drawCanvas();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [imageLoaded, userLocations, scale, offset]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const newScale = Math.min(Math.max(scale + delta * 0.001, 0.5), 3);
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-4 bg-white border-b">
        <select
          value={currentFloor}
          onChange={(e) => setCurrentFloor(e.target.value)}
          className="block w-full max-w-xs px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="basement">Basement</option>
          <option value="ground">First Floor</option>
          <option value="first">Second Floor</option>
        </select>
      </div>
      <div 
        ref={containerRef}
        className="relative flex-1 w-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
};

export default FloorPlanMap;