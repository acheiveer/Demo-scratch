import React from "react";
import CatSprite from "./CatSprite";
import BirdSprite from "./BirdSprite";
import DogSprite from "./dogSprite";
import FishSprite from "./FishSprite";
import RobotSprite from "./RobotSprite";

export default function SpriteSelectionModal({ isOpen, onClose, onSelectSprite }) {
  if (!isOpen) return null;

  const spriteOptions = [
    { id: "cat", name: "Cat", component: <CatSprite /> },
    { id: "dog", name: "Dog", component: <DogSprite /> },
    { id: "bird", name: "Bird", component: <BirdSprite /> },
    { id: "fish", name: "Fish", component: <FishSprite /> },
    { id: "robot", name: "Robot", component: <RobotSprite /> }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80%] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Select a Sprite</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {spriteOptions.map((sprite) => (
            <div 
              key={sprite.id}
              className="border rounded-lg p-3 hover:bg-blue-100 cursor-pointer flex flex-col items-center transition-colors"
              onClick={() => {
                onSelectSprite(sprite.id);
                onClose();
              }}
            >
              <div className="h-24 w-24 flex items-center justify-center">
                {sprite.component}
              </div>
              <p className="text-center mt-2 font-medium">{sprite.name}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}