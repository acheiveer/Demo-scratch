import React from "react";

export default function BirdSprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      version="1.1"
      xmlSpace="preserve"
    >
      <g>
        {/* Body */}
        <ellipse cx="50" cy="60" rx="25" ry="20" fill="#4682B4" stroke="#000" strokeWidth="1.2" />
        
        {/* Head */}
        <circle cx="78" cy="45" r="15" fill="#4682B4" stroke="#000" strokeWidth="1.2" />
        
        {/* Eyes */}
        <circle cx="83" cy="40" r="3" fill="#FFF" stroke="#000" strokeWidth="0.8" />
        <circle cx="83" cy="40" r="1" fill="#000" />
        
        {/* Beak */}
        <path d="M90,45 L100,42 L90,48 Z" fill="#F6AD00" stroke="#000" strokeWidth="0.8" />
        
        {/* Wings */}
        <path d="M40,45 Q50,25 65,40" fill="#30597F" stroke="#000" strokeWidth="1.2" />
        <path d="M50,80 Q40,70 30,80" fill="#30597F" stroke="#000" strokeWidth="1.2" />
        
        {/* Tail */}
        <path d="M25,60 L10,45 L15,65 Z" fill="#30597F" stroke="#000" strokeWidth="1.2" />
        
        {/* Legs */}
        <line x1="55" y1="80" x2="55" y2="90" stroke="#F6AD00" strokeWidth="2" />
        <line x1="45" y1="80" x2="45" y2="90" stroke="#F6AD00" strokeWidth="2" />
      </g>
    </svg>
  );
}