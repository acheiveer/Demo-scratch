import React from "react";

export default function DogSprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      version="1.1"
      xmlSpace="preserve"
    >
      <g>
        {/* Body */}
        <ellipse cx="50" cy="60" rx="30" ry="20" fill="#A0522D" stroke="#000" strokeWidth="1.2" />
        
        {/* Head */}
        <circle cx="75" cy="45" r="18" fill="#A0522D" stroke="#000" strokeWidth="1.2" />
        
        {/* Eyes */}
        <circle cx="82" cy="40" r="3" fill="#FFF" stroke="#000" strokeWidth="0.8" />
        <circle cx="82" cy="40" r="1" fill="#000" />
        <circle cx="69" cy="40" r="3" fill="#FFF" stroke="#000" strokeWidth="0.8" />
        <circle cx="69" cy="40" r="1" fill="#000" />
        
        {/* Nose */}
        <ellipse cx="76" cy="49" rx="5" ry="3" fill="#000" />
        
        {/* Ears */}
        <path d="M62,35 Q60,20 70,25" fill="#A0522D" stroke="#000" strokeWidth="1.2" />
        <path d="M88,35 Q90,20 80,25" fill="#A0522D" stroke="#000" strokeWidth="1.2" />
        
        {/* Legs */}
        <rect x="30" y="70" width="5" height="20" rx="2" fill="#A0522D" stroke="#000" strokeWidth="1" />
        <rect x="42" y="70" width="5" height="20" rx="2" fill="#A0522D" stroke="#000" strokeWidth="1" />
        <rect x="54" y="70" width="5" height="20" rx="2" fill="#A0522D" stroke="#000" strokeWidth="1" />
        <rect x="66" y="70" width="5" height="20" rx="2" fill="#A0522D" stroke="#000" strokeWidth="1" />
        
        {/* Tail */}
        <path d="M20,60 Q10,40 15,35" fill="#A0522D" stroke="#000" strokeWidth="1.2" />
      </g>
    </svg>
  );
}