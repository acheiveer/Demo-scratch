import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import { ScratchProvider } from "./components/ScratchContext";
import SpriteCoordinatesPanel from "./components/SpriteCoordinatesPanel";

export default function App() {
  const [midAreaWidth, setMidAreaWidth] = useState(60); // Initial width in percentage (67%)
  const [isDragging, setIsDragging] = useState(false);
  const splitPaneRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const container = splitPaneRef.current;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const mouseX = e.clientX - container.getBoundingClientRect().left;
    
    // Calculate percentage width (between 20% and 80%)
    let newWidth = (mouseX / containerWidth) * 100;
    newWidth = Math.max(20, Math.min(80, newWidth));
    
    setMidAreaWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners when dragging starts
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <ScratchProvider>
      <div className="bg-blue-200  font-sans">
        <div 
          ref={splitPaneRef}
          className="h-screen overflow-hidden flex flex-row"
          style={{ cursor: isDragging ? 'col-resize' : 'default' }}
        >
          <div 
            className="h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl my-2 ml-2 mr-1"
            style={{ width: `${midAreaWidth}%` }}
          >
            <Sidebar />
            <MidArea />
          </div>

          {/* Resize Handle */}
          <div
            className="w-2 h-screen bg-gray-300 hover:bg-gray-400 cursor-col-resize z-10"
            onMouseDown={handleMouseDown}
          />

          <div
            className="h-screen overflow-hidden flex flex-col bg-white border-t border-l border-gray-200 mx-4 mt-2 rounded-tl-xl ml-2 "
            style={{ width: `${100 - midAreaWidth - 1}%` }}
          >
            <div style={{ height: '75%' }} className="overflow-hidden ">
              <PreviewArea />
            </div>
            <div style={{ height: '25%' }} className="border-t border-gray-200">
              <SpriteCoordinatesPanel />
            </div>
          </div>
        </div>
      </div>
    </ScratchProvider>
  );
}