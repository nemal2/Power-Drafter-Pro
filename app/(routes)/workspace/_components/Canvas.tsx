import React, { useRef, useEffect, useState, useCallback } from "react";
import Draggable from "react-draggable";
import { useDrop } from "react-dnd";
import { LibraryItem } from "./CanvasSidebar/LibraryItems";
import html2canvas from "html2canvas";
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { ZoomIn, ZoomOut, Move, Save, Printer } from 'lucide-react';

interface CanvasComponent extends LibraryItem {
  x: number;
  y: number;
  instanceId: string;
  rotation?: number;
}

interface CanvasProps {
  fileId: Id<"files">;
  onDragStart: (e: React.DragEvent<HTMLImageElement>, src: string) => void;
  draggedImage: string | null;
  onDropComplete: () => void;
  onComponentAdd?: (component: any, actionType: string) => void;
  components: CanvasComponent[];
  onComponentDelete?: (instanceId: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  fileId,
  onDragStart,
  draggedImage,
  onDropComplete,
  onComponentAdd,
  components,
  onComponentDelete
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [rotations, setRotations] = useState<Record<string, number>>({});
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100% zoom
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastMousePosition, setLastMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [cursorStyle, setCursorStyle] = useState<string>("default");
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    instanceId: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    instanceId: '',
  });

  // Constants for zoom
  const MIN_ZOOM = 0.5;  // 50% minimum zoom
  const MAX_ZOOM = 3.0;  // 300% maximum zoom
  const ZOOM_STEP = 0.1; // 10% zoom per scroll step
  
  // Functions to convert between screen and canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Adjust for current pan offset and zoom
    const x = (screenX - canvasRect.left - panOffset.x) / zoomLevel;
    const y = (screenY - canvasRect.top - panOffset.y) / zoomLevel;
    
    return { x, y };
  }, [zoomLevel, panOffset]);

  // Toggle between pan tool and selection tool
  const togglePanTool = useCallback(() => {
    setCursorStyle(prev => prev === "grab" ? "default" : "grab");
  }, []);

  useEffect(() => {
    if (!components) return;
    
    const initialPositions: Record<string, { x: number; y: number }> = {};
    const initialRotations: Record<string, number> = {};
    components.forEach(comp => {
      if (comp) {
        initialPositions[comp.instanceId] = { x: comp.x, y: comp.y };
        initialRotations[comp.instanceId] = comp.rotation || 0;
      }
    });
    setPositions(initialPositions);
    setRotations(initialRotations);
  }, [components]);

  // Handle mouse wheel for zooming - now with focus point zoom
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.buttons === 4 || (e.buttons === 1 && e.altKey)) {
      // If middle button is pressed during scroll, handle panning instead
      const deltaX = e.deltaX;
      const deltaY = e.deltaY;
      setPanOffset(prev => ({
        x: prev.x - deltaX,
        y: prev.y - deltaY
      }));
      return;
    }
    
    const containerRect = canvasContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    // Get mouse position relative to container
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    // Calculate position before zoom
    const beforeX = (mouseX - panOffset.x) / zoomLevel;
    const beforeY = (mouseY - panOffset.y) / zoomLevel;
    
    // Determine zoom direction
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    
    // Calculate new zoom level with constraints
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomLevel + delta));
    
    // Calculate position after zoom
    const afterX = (mouseX - panOffset.x) / newZoom;
    const afterY = (mouseY - panOffset.y) / newZoom;
    
    // Adjust pan offset to keep the point under mouse in the same position
    const newPanOffsetX = panOffset.x - (afterX - beforeX) * newZoom;
    const newPanOffsetY = panOffset.y - (afterY - beforeY) * newZoom;
    
    setZoomLevel(newZoom);
    setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });
  }, [zoomLevel, panOffset]);

  // Handle mouse events for panning
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Middle mouse button (button 1) or left mouse with Alt key for panning
    if (e.button === 1 || (e.button === 0 && (e.altKey || cursorStyle === "grab"))) {
      e.preventDefault();
      setIsPanning(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
      setCursorStyle("grabbing");
    }
  }, [cursorStyle]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning && lastMousePosition) {
      const deltaX = e.clientX - lastMousePosition.x;
      const deltaY = e.clientY - lastMousePosition.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastMousePosition]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      setCursorStyle(cursorStyle === "grabbing" ? "grab" : "default");
    }
  }, [isPanning, cursorStyle]);

  // Also stop panning if mouse leaves the canvas area
  const handleMouseLeave = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      setCursorStyle(cursorStyle === "grabbing" ? "grab" : "default");
    }
  }, [isPanning, cursorStyle]);

  // Register global mouse up to handle cases where mouse is released outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        setCursorStyle(cursorStyle === "grabbing" ? "grab" : "default");
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isPanning, cursorStyle]);

  // Zoom in button handler
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(MAX_ZOOM, zoomLevel + ZOOM_STEP);
    setZoomLevel(newZoom);
  }, [zoomLevel]);

  // Zoom out button handler
  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(MIN_ZOOM, zoomLevel - ZOOM_STEP);
    setZoomLevel(newZoom);
  }, [zoomLevel]);

  // Reset zoom and pan button handler
  const resetZoomAndPan = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Modified handleDrop function to account for zoom level and pan offset
  const handleDrop = useCallback((item: LibraryItem, dropX: number, dropY: number) => {
    if (onComponentAdd) {
      // Calculate the center point offset based on item dimensions
      const centerOffsetX = (item.width || 100) / 2;
      const centerOffsetY = (item.height || 100) / 2;
      
      // Convert screen coordinates to canvas coordinates
      const canvasCoords = screenToCanvas(dropX, dropY);
      
      // Adjust the drop position for component center
      const adjustedX = Math.max(0, canvasCoords.x - centerOffsetX);
      const adjustedY = Math.max(0, canvasCoords.y - centerOffsetY);
      
      // Ensure the item has all required specs
      const newComponent = {
        ...item,
        x: adjustedX,
        y: adjustedY,
        instanceId: `${item.id}-${Date.now()}`,
        rotation: 0.0,
        // Ensure specs object has all required fields
        specs: {
          power: item.specs?.power || ["default"],
          resistance: item.specs?.resistance || ["default"],
          tolerance: item.specs?.tolerance || ["default"],
          ...item.specs
        }
      };
      onComponentAdd(newComponent, 'add');
    }
    onDropComplete();
  }, [onComponentAdd, onDropComplete, screenToCanvas]);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "libraryItem",
    drop: (item: LibraryItem, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        handleDrop(item, offset.x, offset.y);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [handleDrop]);
  
  const handleDragStop = useCallback((instanceId: string, data: { x: number; y: number }) => {
    if (!components) return;
  
    const updatedPositions = {
      ...positions,
      [instanceId]: { x: data.x, y: data.y }
    };
    setPositions(updatedPositions);
    
    const component = components.find(comp => comp.instanceId === instanceId);
    if (component && onComponentAdd) {
      onComponentAdd({ 
        ...component, 
        x: data.x, 
        y: data.y,
        rotation: rotations[instanceId] || 0.0,
        // Ensure specs object has all required fields
        specs: {
          power: component.specs?.power || ["default"],
          resistance: component.specs?.resistance || ["default"],
          tolerance: component.specs?.tolerance || ["default"],
          ...component.specs
        }
      }, 'move');
    }
  }, [components, positions, rotations, onComponentAdd]);
  
  const handleRotate = useCallback((instanceId: string, degrees: number) => {
    const currentRotation = rotations[instanceId] || 0;
    const newRotation = (currentRotation + degrees) % 360;
    
    setRotations(prev => ({
      ...prev,
      [instanceId]: newRotation
    }));
  
    const component = components.find(comp => comp.instanceId === instanceId);
    if (component && onComponentAdd) {
      onComponentAdd({
        ...component,
        rotation: newRotation,
        x: positions[instanceId]?.x || component.x,
        y: positions[instanceId]?.y || component.y,
        // Ensure specs object has all required fields
        specs: {
          power: component.specs?.power || ["default"],
          resistance: component.specs?.resistance || ["default"],
          tolerance: component.specs?.tolerance || ["default"],
          ...component.specs
        }
      }, 'move');
    }
    setContextMenu({ visible: false, x: 0, y: 0, instanceId: '' });
  }, [components, positions, rotations, onComponentAdd]);

  const saveAsPNG = useCallback(() => {
    if (!canvasRef.current) return;
    html2canvas(canvasRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "canvas.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }, []);

  const printCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    html2canvas(canvasRef.current).then((canvas) => {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.body.innerHTML = `<img src="${canvas.toDataURL()}" style="width:100%; height:auto;">`;
        newWindow.print();
      }
    });
  }, []);

  // Handle right-click to open context menu - FIXED POSITIONING
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Get the instanceId from the target element's data attribute
    const target = e.currentTarget as HTMLElement;
    const instanceId = target.dataset.instanceId || '';
    
    // Position context menu near the click point but with a slight offset
    // This keeps the menu close to where the user clicked
    const menuX = e.clientX + 5; // 5px offset to the right
    const menuY = e.clientY + 5; // 5px offset down
    
    setContextMenu({
      visible: true,
      x: menuX,
      y: menuY,
      instanceId
    });
  }, []);

  // Handle delete from context menu
  const handleDelete = useCallback(() => {
    if (contextMenu.instanceId && onComponentDelete) {
      onComponentDelete(contextMenu.instanceId);
    }
    setContextMenu({ visible: false, x: 0, y: 0, instanceId: '' });
  }, [contextMenu.instanceId, onComponentDelete]);

  // Hide context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, instanceId: '' });
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu.visible]);

  // Keyboard shortcuts for panning and zooming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar toggle pan mode
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setCursorStyle(prev => prev === "grab" ? "default" : "grab");
      }
      
      // + key for zoom in
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      }
      
      // - key for zoom out
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      }
      
      // 0 or r key for reset
      if (e.key === '0' || e.key === 'r') {
        e.preventDefault();
        resetZoomAndPan();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Release space bar
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isPanning) {
          setCursorStyle(prev => prev === "grab" ? "default" : "grab");
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleZoomIn, handleZoomOut, resetZoomAndPan, isPanning]);

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Top Controls Bar - Combined zoom controls and export buttons */}
      <div className="w-full bg-gray-100 p-2 flex items-center justify-between mb-1">
        {/* Left side: Zoom controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleZoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            className={`p-1 rounded ${zoomLevel <= MIN_ZOOM ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-100'}`}
            title="Zoom Out (- key)"
          >
            <ZoomOut size={18} />
          </button>
          
          <div className="text-sm font-medium w-16 text-center">
            {Math.round(zoomLevel * 100)}%
          </div>
          
          <button 
            onClick={handleZoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            className={`p-1 rounded ${zoomLevel >= MAX_ZOOM ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-100'}`}
            title="Zoom In (+ key)"
          >
            <ZoomIn size={18} />
          </button>
          
          <button
            onClick={togglePanTool}
            className={`p-1 rounded ${cursorStyle === "grab" || cursorStyle === "grabbing" ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
            title="Pan Tool (Space key)"
          >
            <Move size={18} />
          </button>
          
          <button
            onClick={resetZoomAndPan}
            className="text-xs text-blue-600 hover:underline"
            title="Reset View (0 key)"
          >
            Reset
          </button>
        </div>
        
        {/* Center: Info */}
        <div className="text-xs text-gray-500 hidden md:inline">
          (Middle-click to pan, scroll to zoom)
        </div>
        
        {/* Right side: Export buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={saveAsPNG}
            className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600 text-sm"
            title="Save as PNG"
          >
            <Save size={16} />
            <span>PNG</span>
          </button>
          <button
            onClick={printCanvas}
            className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded shadow hover:bg-green-600 text-sm"
            title="Print Canvas"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>
      </div>
      
      {/* Canvas Container with Overflow */}
      <div 
        ref={canvasContainerRef}
        className="flex-grow w-full p-1 overflow-auto"
        style={{ height: "calc(100vh - 110px)" }} // Adjusted height to fit in viewport
      >
        <div
          ref={(node) => {
            drop(node);
            canvasRef.current = node;
          }}
          className={`relative bg-[#eff0f1] ${
            isOver ? "border-2 border-blue-500" : ""
          }`}
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top left",
            transition: "transform 0.1s ease-out",
            cursor: cursorStyle,
            marginLeft: panOffset.x,
            marginTop: panOffset.y
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {components?.map((item) => (
            <Draggable
              key={item.instanceId}
              defaultPosition={{ x: item.x, y: item.y }}
              position={positions[item.instanceId]}
              onStop={(e, data) => handleDragStop(item.instanceId, data)}
              bounds="parent"
              handle=".drag-handle"
              scale={zoomLevel} // Scale factor for Draggable
              disabled={isPanning || cursorStyle === "grab"} // Disable dragging when panning
            >
              <div 
                className="absolute cursor-move"
                data-instance-id={item.instanceId} // Important! Store instanceId as data attribute
                onContextMenu={handleContextMenu} // Simplified context menu handler
              >
                <div 
                  className="drag-handle relative"
                  style={{
                    backgroundImage: `url(${item.svg})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    width: `${item.width || 100}px`,
                    height: `${item.height || 100}px`,
                    transform: `rotate(${rotations[item.instanceId] || 0}deg)`,
                    transition: 'transform 0.3s ease',
                    cursor: isPanning || cursorStyle === "grab" ? cursorStyle : "move"
                  }}
                />
              </div>
            </Draggable>
          ))}

          {/* Context Menu - Now positioned close to the mouse click point */}
          {contextMenu.visible && (
            <div 
              className="fixed bg-white shadow-lg rounded-md py-2 z-50"
              style={{
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleRotate(contextMenu.instanceId, 90)}
              >
                Rotate 90°
              </button>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleRotate(contextMenu.instanceId, 180)}
              >
                Rotate 180°
              </button>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;