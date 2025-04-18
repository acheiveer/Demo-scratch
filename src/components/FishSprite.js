import React from "react";

export default function FishSprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      version="1.1"
      xmlSpace="preserve"
    >
      <g>
        {/* Body */}
        <ellipse cx="50" cy="50" rx="30" ry="20" fill="#FF7F50" stroke="#000" strokeWidth="1.2" />
        
        {/* Tail */}
        <path d="M20,50 L5,65 L5,35 Z" fill="#FF7F50" stroke="#000" strokeWidth="1.2" />
        
        {/* Top Fin */}
        <path d="M45,30 Q50,10 60,30" fill="#FF7F50" stroke="#000" strokeWidth="1.2" />
        
        {/* Bottom Fin */}
        <path d="M45,70 Q50,90 60,70" fill="#FF7F50" stroke="#000" strokeWidth="1.2" />
        
        {/* Eye */}
        <circle cx="70" cy="45" r="5" fill="#FFF" stroke="#000" strokeWidth="0.8" />
        <circle cx="72" cy="45" r="2" fill="#000" />
        
        {/* Gills */}
        <path d="M65,55 Q60,50 65,45" fill="none" stroke="#000" strokeWidth="0.8" />
      </g>
    </svg>
  );
}