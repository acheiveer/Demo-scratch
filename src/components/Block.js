import React from "react";
import Icon from "./Icon";
import { useState } from "react";

export default function Block({ block, onUpdate, onDelete, isDragging }) {
    const [isDraggedOver, setIsDraggedOver] = useState(false);
  const getBlockStyle = () => {
    switch (block.type) {
      case "motion":
        return "bg-blue-500";
      case "looks":
        return "bg-purple-500";
      case "control":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleInputChange = (field, value) => {
    onUpdate({ ...block, [field]: value });
  };

   // Handle drag start for reordering
   const handleDragStart = (e) => {
    e.dataTransfer.setData("application/json", JSON.stringify({
      block: block,
      action: "reorder"
    }));
    e.dataTransfer.effectAllowed = "move";
  };
  
  // Handle drag over for reordering indication
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggedOver(true);
    e.dataTransfer.dropEffect = "move";
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };


  // Render block content based on type and subtype
  const renderBlockContent = () => {
    switch (block.type) {
      case "motion":
        switch (block.subtype) {
          case "move_steps":
            return (
              <div className="flex items-center">
                <span>Move</span>
                <input
                  type="number"
                  className="mx-2 w-12 px-1 py-0.5 text-black rounded"
                  value={block.steps}
                  onChange={(e) => handleInputChange("steps", Number(e.target.value))}
                />
                <span>steps</span>
              </div>
            );
          case "turn_degrees":
            return (
              <div className="flex items-center">
                <span>Turn</span>
                {block.direction === "left" ? (
                  <Icon name="undo" size={15} className="text-white mx-2" />
                ) : (
                  <Icon name="redo" size={15} className="text-white mx-2" />
                )}
                <input
                  type="number"
                  className="mx-2 w-12 px-1 py-0.5 text-black rounded"
                  value={block.degrees}
                  onChange={(e) => handleInputChange("degrees", Number(e.target.value))}
                />
                <span>degrees</span>
              </div>
            );
          case "goto_xy":
            return (
              <div className="flex items-center">
                <span>Go to x:</span>
                <input
                  type="number"
                  className="mx-2 w-12 px-1 py-0.5 text-black rounded"
                  value={block.x}
                  onChange={(e) => handleInputChange("x", Number(e.target.value))}
                />
                <span>y:</span>
                <input
                  type="number"
                  className="mx-2 w-12 px-1 py-0.5 text-black rounded"
                  value={block.y}
                  onChange={(e) => handleInputChange("y", Number(e.target.value))}
                />
              </div>
            );
          default:
            return null;
        }

      case "looks":
        switch (block.subtype) {
          case "say_for_seconds":
            return (
              <div className="flex items-center">
                <span>Say</span>
                <input
                  type="text"
                  className="mx-2 w-20 px-1 py-0.5 text-black rounded"
                  value={block.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
                <span>for</span>
                <input
                  type="number"
                  className="mx-2 w-12 px-1 py-0.5 text-black rounded"
                  value={block.duration}
                  onChange={(e) => handleInputChange("duration", Number(e.target.value))}
                />
                <span>seconds</span>
              </div>
            );
          case "think_for_seconds":
            return (
              <div className="flex items-center">
                <span>Think</span>
                <input
                  type="text"
                  className="mx-2 w-20 px-1 py-0.5 text-black rounded"
                  value={block.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
                <span>for</span>
                <input
                  type="number"
                  className="mx-2 w-12 px-1 py-0.5 text-black rounded"
                  value={block.duration}
                  onChange={(e) => handleInputChange("duration", Number(e.target.value))}
                />
                <span>seconds</span>
              </div>
            );
          default:
            return null;
        }

      case "control":
        if (block.subtype === "repeat") {
          return (
            <div className="flex items-center">
              <span>Repeat</span>
              <input
                type="number"
                className="mx-2 w-12 px-1 py-0.5 text-black rounded"
                value={block.times}
                onChange={(e) => handleInputChange("times", Number(e.target.value))}
              />
              <span>times</span>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div
      className={`${getBlockStyle()} text-white px-2 py-1 my-2 text-sm rounded 
                cursor-move ${isDragging ? "opacity-50" : ""}
                ${isDraggedOver ? "border-2 border-white" : ""}`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">{renderBlockContent()}</div>
        <button
          className="ml-2 text-xs bg-red-600 hover:bg-red-700 text-white px-1 rounded"
          onClick={onDelete}
        >
          ✕
        </button>
      </div>
    </div>
  );
}