import React from "react";

export default function RobotSprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      version="1.1"
      xmlSpace="preserve"
    >
      <g>
        {/* Head */}
        <rect x="35" y="15" width="30" height="25" rx="2" fill="#7D7D7D" stroke="#000" strokeWidth="1.2" />
        
        {/* Antenna */}
        <line x1="50" y1="15" x2="50" y2="5" stroke="#000" strokeWidth="1.5" />
        <circle cx="50" cy="3" r="2" fill="#FF0000" />
        
        {/* Eyes */}
        <circle cx="43" cy="25" r="5" fill="#3498DB" stroke="#000" strokeWidth="0.8" />
        <circle cx="57" cy="25" r="5" fill="#3498DB" stroke="#000" strokeWidth="0.8" />
        
        {/* Mouth */}
        <rect x="40" y="32" width="20" height="3" fill="#333" />
        
        {/* Body */}
        <rect x="30" y="45" width="40" height="30" rx="2" fill="#9E9E9E" stroke="#000" strokeWidth="1.2" />
        
        {/* Neck */}
        <rect x="45" y="40" width="10" height="5" fill="#7D7D7D" stroke="#000" strokeWidth="1" />
        
        {/* Arms */}
        <rect x="20" y="50" width="10" height="25" rx="2" fill="#7D7D7D" stroke="#000" strokeWidth="1" />
        <rect x="70" y="50" width="10" height="25" rx="2" fill="#7D7D7D" stroke="#000" strokeWidth="1" />
        
        {/* Legs */}
        <rect x="35" y="75" width="10" height="20" rx="2" fill="#7D7D7D" stroke="#000" strokeWidth="1" />
        <rect x="55" y="75" width="10" height="20" rx="2" fill="#7D7D7D" stroke="#000" strokeWidth="1" />
        
        {/* Control Panel */}
        <rect x="40" y="50" width="20" height="10" rx="1" fill="#333" stroke="#000" strokeWidth="0.8" />
        <circle cx="45" cy="55" r="2" fill="#FF0000" />
        <circle cx="55" cy="55" r="2" fill="#00FF00" />
      </g>
    </svg>
  );
}