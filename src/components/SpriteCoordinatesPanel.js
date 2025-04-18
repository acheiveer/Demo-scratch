import React, { useContext, useState, useEffect, useRef } from "react";
import { ScratchContext } from "./ScratchContext";

export default function SpriteCoordinatesPanel() {
  const { sprites, updateSpritePosition, selectedSpriteId } = useContext(ScratchContext);
  const [tempCoords, setTempCoords] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const initializedRef = useRef(false);

  // Initialize tempCoords from sprites on first render only
  useEffect(() => {
    if (!initializedRef.current) {
      const initialCoords = {};
      sprites.forEach(sprite => {
        initialCoords[sprite.id] = {
          x: sprite.x,
          y: sprite.y
        };
      });
      setTempCoords(initialCoords);
      initializedRef.current = true;
    }
  }, [sprites]);

  // Update tempCoords when sprites change position and we're not editing
  useEffect(() => {
    const updatedTempCoords = {...tempCoords};
    let changed = false;
    
    sprites.forEach(sprite => {
      // Only update if we're not currently editing this coordinate
      if (!isEditing[sprite.id]?.x && (!tempCoords[sprite.id] || tempCoords[sprite.id].x !== sprite.x)) {
        if (!updatedTempCoords[sprite.id]) updatedTempCoords[sprite.id] = {};
        updatedTempCoords[sprite.id].x = sprite.x;
        changed = true;
      }
      
      if (!isEditing[sprite.id]?.y && (!tempCoords[sprite.id] || tempCoords[sprite.id].y !== sprite.y)) {
        if (!updatedTempCoords[sprite.id]) updatedTempCoords[sprite.id] = {};
        updatedTempCoords[sprite.id].y = sprite.y;
        changed = true;
      }
    });
    
    if (changed) {
      setTempCoords(updatedTempCoords);
    }
  }, [sprites, isEditing]);

  // Handle input focus (start editing)
  const handleFocus = (spriteId, axis) => {
    setIsEditing(prev => ({
      ...prev,
      [spriteId]: {
        ...(prev[spriteId] || {}),
        [axis]: true
      }
    }));
  };

  // Handle input blur (end editing)
  const handleBlur = (spriteId, axis) => {
    applyCoordChange(spriteId, axis);
    setIsEditing(prev => ({
      ...prev,
      [spriteId]: {
        ...(prev[spriteId] || {}),
        [axis]: false
      }
    }));
  };

  // Handle input change for coordinates
  const handleCoordChange = (spriteId, axis, value) => {
    // Store temporary value during editing
    setTempCoords({
      ...tempCoords,
      [spriteId]: {
        ...(tempCoords[spriteId] || {}),
        [axis]: value
      }
    });
  };

  // Apply the coordinate change when input is confirmed (on blur or enter key)
  const applyCoordChange = (spriteId, axis) => {
    if (!tempCoords[spriteId] || tempCoords[spriteId][axis] === undefined) return;
    
    const sprite = sprites.find(s => s.id === spriteId);
    if (!sprite) return;
    
    const value = parseInt(tempCoords[spriteId][axis], 10);
    if (isNaN(value)) {
      // Reset to sprite's current value if invalid
      setTempCoords(prev => ({
        ...prev,
        [spriteId]: {
          ...(prev[spriteId] || {}),
          [axis]: sprite[axis]
        }
      }));
      return;
    }
    
    // Update the sprite position
    if (axis === 'x') {
      updateSpritePosition(spriteId, value, sprite.y);
    } else if (axis === 'y') {
      updateSpritePosition(spriteId, sprite.x, value);
    }
  };

  // Handle keypress events (Enter key)
  const handleKeyPress = (e, spriteId, axis) => {
    if (e.key === 'Enter') {
      applyCoordChange(spriteId, axis);
      e.target.blur();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3 h-full overflow-y-auto">
      <div className="text-sm font-semibold mb-3">Sprite Position</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sprites.map((sprite) => (
          <div
            key={sprite.id}
            className={`border rounded-md p-3 ${
              sprite.id === selectedSpriteId
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="text-sm font-medium mb-2">{sprite.name}</div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 break-words">
              <div className="flex items-center gap-1 min-w-0">
                <label className="text-xs font-medium text-gray-600">X:</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-20 text-sm min-w-0"
                  value={tempCoords[sprite.id]?.x !== undefined ? tempCoords[sprite.id].x : sprite.x}
                  onChange={(e) => handleCoordChange(sprite.id, "x", e.target.value)}
                  onFocus={() => handleFocus(sprite.id, "x")}
                  onBlur={() => handleBlur(sprite.id, "x")}
                  onKeyPress={(e) => handleKeyPress(e, sprite.id, "x")}
                />
              </div>

              <div className="flex items-center gap-1 min-w-0">
                <label className="text-xs font-medium text-gray-600">Y:</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-20 text-sm min-w-0"
                  value={tempCoords[sprite.id]?.y !== undefined ? tempCoords[sprite.id].y : sprite.y}
                  onChange={(e) => handleCoordChange(sprite.id, "y", e.target.value)}
                  onFocus={() => handleFocus(sprite.id, "y")}
                  onBlur={() => handleBlur(sprite.id, "y")}
                  onKeyPress={(e) => handleKeyPress(e, sprite.id, "y")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}