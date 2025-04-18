// import React, { useContext, useEffect, useRef } from "react";
// import CatSprite from "./CatSprite";
// import Icon from "./Icon";
// import { ScratchContext } from "./ScratchContext";

// export default function PreviewArea() {
//   const {
//     sprites,
//     selectedSpriteId,
//     setSelectedSpriteId,
//     isPlaying,
//     resetSprites,
//     updateSpritePosition,
//     updateSpriteRotation,
//     setSpriteMessage
//   } = useContext(ScratchContext);

//   //const animationFrameRef = useRef(null);
//   const dragState = useRef({
//     isDragging: false,
//     startX: 0,
//     startY: 0,
//     spriteId: null
//   });

//   // useEffect(() => {
//   //   if (isPlaying) {
//   //     sprites.forEach((sprite) => {
//   //       if (sprite.isExecuting && sprite.scripts.length > 0) {
//   //         runScriptsSequentially(sprite);
//   //       }
//   //     });
//   //   }

//   //   return () => {
//   //     if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
//   //   };
//   // }, [isPlaying, sprites]);


//   useEffect(() => {
//     if (!isPlaying) return;

//     // sprites.forEach((sprite) => {
//     //   if (sprite.isExecuting && sprite.scripts.length > 0) {
//     //     runScriptsSequentially(sprite);
//     //   }
//     // });

//     // Modified useEffect to start all sprites' scripts simultaneously

//     // Start all sprite scripts simultaneously
//     const executeAllSprites = async () => {
//       // Create a promise for each sprite's scripts execution
//       const spritePromises = sprites
//         .filter(sprite => sprite.isExecuting && sprite.scripts.length > 0)
//         .map(sprite => runScriptsSequentially(sprite));
      
//       // Run all sprite script sequences in parallel
//       await Promise.all(spritePromises);
//     };
    
//     executeAllSprites();

 
//   }, [isPlaying]);  // Only run when isPlaying changes



//   // 🖱️ Global mouse event listeners for drag functionality
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!dragState.current.isDragging) return;

//       const { startX, startY, spriteId } = dragState.current;
//       const deltaX = e.clientX - startX;
//       const deltaY = e.clientY - startY;

//       const sprite = sprites.find((s) => s.id === spriteId);
//       if (sprite) {
//         updateSpritePosition(sprite.id, sprite.x + deltaX, sprite.y + deltaY);
//         dragState.current.startX = e.clientX;
//         dragState.current.startY = e.clientY;
//       }
//     };

//     const handleMouseUp = () => {
//       dragState.current.isDragging = false;
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [sprites]);

//   // 👇 Drag start handler
//   const handleMouseDown = (e, sprite) => {
//     if (isPlaying) return;
//     dragState.current = {
//       isDragging: true,
//       startX: e.clientX,
//       startY: e.clientY,
//       spriteId: sprite.id
//     };
//   };

//   const runScriptsSequentially = async (sprite) => {
//      // Execute each script in sequence for this sprite
//     for (let script of sprite.scripts) {
//       await executeScript(sprite, script);
//     }
//   };

//   const executeScript = async (sprite, script) => {
//     const { type, subtype } = script;

//     const delay = (ms) => new Promise((res) => setTimeout(res, ms));

//     if (type === "motion") {
//       switch (subtype) {
//         case "move_steps":
//           {
//             const angle = sprite.rotation * (Math.PI / 180);
//             const newX = sprite.x + script.steps * Math.cos(angle);
//             const newY = sprite.y + script.steps * Math.sin(angle);
//             updateSpritePosition(sprite.id, newX, newY);
//           }
//           break;

//         case "turn_degrees":
//           {
//             const delta = script.direction === "left" ? -script.degrees : script.degrees;
//             updateSpriteRotation(sprite.id, sprite.rotation + delta);
//           }
//           break;

//         case "goto_xy":
//           updateSpritePosition(sprite.id, script.x, script.y);
//           break;

//         default:
//           break;
//       }
//       await delay(300);
//     } else if (type === "looks") {
//       if (subtype === "say_for_seconds" || subtype === "think_for_seconds") {
//         setSpriteMessage(sprite.id, subtype.includes("say") ? "say" : "think", script.message, script.duration);
//         await delay(script.duration * 1000);
//       }
//     } else if (type === "control" && subtype === "repeat") {
//       for (let i = 0; i < script.times; i++) {
//         for (let innerScript of sprite.scripts) {
//           if (innerScript !== script) {
//             await executeScript(sprite, innerScript);
//           }
//         }
//       }
//     }
//   };

//   const renderSprite = (sprite) => {
//     const spriteStyle = {
//       position: "absolute",
//       left: `calc(50% + ${sprite.x}px)`,
//       top: `calc(50% + ${sprite.y}px)`,
//       transform: `translate(-50%, -50%) rotate(${sprite.rotation}deg)`,
//       cursor: isPlaying ? "default" : "pointer",
//       border: sprite.id === selectedSpriteId ? "2px solid blue" : "none",
//       transition: "transform 0.2s ease-out",
//     };

//     const speechBubbleStyle = {
//       position: "absolute",
//       backgroundColor: "white",
//       border: "1px solid black",
//       borderRadius: sprite.sayText ? "10px" : "50%",
//       padding: "5px 10px",
//       minWidth: "80px",
//       maxWidth: "150px",
//       textAlign: "center",
//       top: "-60px",
//       left: "30px",
//       display: sprite.sayText || sprite.thinkText ? "block" : "none"
//     };

//     return (
//       <div
//         key={sprite.id}
//         style={spriteStyle}
//         onMouseDown={(e) => handleMouseDown(e, sprite)}
//         onClick={() => !isPlaying && setSelectedSpriteId(sprite.id)}
//       >
//         <div style={speechBubbleStyle}>
//           {sprite.sayText || sprite.thinkText}
//         </div>
//         <CatSprite />
//       </div>
//     );
//   };

//   return (
//     <div className="flex-auto overflow-hidden p-2 relative">
//       <div className="absolute top-2 right-2 z-10">
//         <button
//           className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 my-2 rounded-md font-bold"
//           onClick={resetSprites}
//         >
//           Reset
//           <Icon name="redo" size={15} className="text-white mx-2" />
//         </button>
//       </div>
//       <div className="w-full h-full relative border-2 border-dashed border-gray-300 rounded-lg">
//         {sprites.map((sprite) => renderSprite(sprite))}
//       </div>
//     </div>
//   );
// }
import React, { useContext, useEffect, useRef, useState } from "react";
import CatSprite from "./CatSprite";
import DogSprite from "./dogSprite";
import BirdSprite from "./BirdSprite";
import FishSprite from "./FishSprite";
import RobotSprite from "./RobotSprite";
import Icon from "./Icon";
import { ScratchContext } from "./ScratchContext";

export default function PreviewArea() {
  const {
    sprites,
    selectedSpriteId,
    setSelectedSpriteId,
    isPlaying,
    resetSprites,
    updateSpritePosition,
    updateSpriteRotation,
    setSpriteMessage,
    collisionOccurred
  } = useContext(ScratchContext);

  // Track which sprites are currently being animated
  const [animatingSprites, setAnimatingSprites] = useState(new Set());
  
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    spriteId: null
  });

  // Effect to start animations when isPlaying changes to true
  useEffect(() => {
    if (isPlaying) {
      // Start animations for all sprites with scripts
      const spritesToAnimate = sprites.filter(sprite => 
        sprite.isExecuting && sprite.scripts.length > 0
      );
      
      // Create a set of sprite IDs that are being animated
      const newAnimatingSprites = new Set(
        spritesToAnimate.map(sprite => sprite.id)
      );
      setAnimatingSprites(newAnimatingSprites);
      
      // Start animation for each sprite
      spritesToAnimate.forEach(sprite => {
        animateSprite(sprite);
      });
    } else {
      // When stopping, clear the animating sprites set
      setAnimatingSprites(new Set());
    }
  }, [isPlaying]); // Only depends on isPlaying state

  // Define the animateSprite function inside useEffect to access latest state
  const animateSprite = async (sprite) => {
    try {
      for (let i = 0; i < sprite.scripts.length; i++) {
        const script = sprite.scripts[i];
        await executeScript(sprite, script);
      }
    } catch (error) {
      console.error(`Error animating sprite ${sprite.id}:`, error);
    } finally {
      // Remove this sprite from animating set when done
      setAnimatingSprites(prev => {
        const updated = new Set(prev);
        updated.delete(sprite.id);
        return updated;
      });
    }
  };

  // Drag functionality
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragState.current.isDragging) return;

      const { startX, startY, spriteId } = dragState.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const sprite = sprites.find((s) => s.id === spriteId);
      if (sprite) {
        updateSpritePosition(sprite.id, sprite.x + deltaX, sprite.y + deltaY);
        dragState.current.startX = e.clientX;
        dragState.current.startY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      dragState.current.isDragging = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [sprites, updateSpritePosition]);

  const handleMouseDown = (e, sprite) => {
    if (isPlaying) return;
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      spriteId: sprite.id
    };
  };

  // // Execute a single script for a sprite
  // const executeScript = async (sprite, script) => {
  //   const { type, subtype } = script;
  //   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  //   if (type === "motion") {
  //     switch (subtype) {
  //       case "move_steps":
  //         {
  //           const angle = sprite.rotation * (Math.PI / 180);
  //           const newX = sprite.x + script.steps * Math.cos(angle);
  //           const newY = sprite.y + script.steps * Math.sin(angle);
  //           updateSpritePosition(sprite.id, newX, newY);
  //           await delay(300); // Add delay for visual effect
  //         }
  //         break;

  //       case "turn_degrees":
  //         {
  //           const delta = script.direction === "left" ? -script.degrees : script.degrees;
  //           updateSpriteRotation(sprite.id, sprite.rotation + delta);
  //           await delay(300);
  //         }
  //         break;

  //       case "goto_xy":
  //         updateSpritePosition(sprite.id, script.x, script.y);
  //         await delay(300);
  //         break;

  //       default:
  //         break;
  //     }
  //   } else if (type === "looks") {
  //     if (subtype === "say_for_seconds" || subtype === "think_for_seconds") {
  //       setSpriteMessage(
  //         sprite.id, 
  //         subtype.includes("say") ? "say" : "think", 
  //         script.message, 
  //         script.duration
  //       );
  //       await delay(script.duration * 1000);
  //     }
  //   } else if (type === "control" && subtype === "repeat") {
  //     // Execute each script (except this repeat) multiple times
  //     for (let i = 0; i < script.times; i++) {
  //       for (let innerScript of sprite.scripts) {
  //         if (innerScript !== script) { // Skip the repeat block itself
  //           await executeScript(sprite, innerScript);
  //         }
  //       }
  //     }
  //   }
  // };


  const executeScript = async (sprite, script) => {
    const { type, subtype } = script;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
    if (type === "motion") {
      switch (subtype) {
        case "move_steps":
          {
            // For movement, use smaller incremental steps to detect collisions better
            const angle = sprite.rotation * (Math.PI / 180);
            const totalSteps = script.steps;
            const stepSize = 5; // Move in smaller increments
            const stepCount = Math.abs(Math.ceil(totalSteps / stepSize));
            const actualStepSize = totalSteps / stepCount;
            
            // Move in small steps to allow for collision detection
            for (let i = 0; i < stepCount; i++) {
              const stepX = sprite.x + actualStepSize * Math.cos(angle);
              const stepY = sprite.y + actualStepSize * Math.sin(angle);
              updateSpritePosition(sprite.id, stepX, stepY);
              await delay(50); // Small delay between incremental moves
            }
          }
          break;
  
        case "turn_degrees":
          {
            const delta = script.direction === "left" ? -script.degrees : script.degrees;
            updateSpriteRotation(sprite.id, sprite.rotation + delta);
            await delay(300);
          }
          break;
  
        case "goto_xy":
          // For goto, also use incremental movement for better collision detection
          {
            const startX = sprite.x;
            const startY = sprite.y;
            const targetX = script.x;
            const targetY = script.y;
            const dx = targetX - startX;
            const dy = targetY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only use incremental movement for longer distances
            if (distance > 50) {
              const steps = Math.ceil(distance / 10);
              const stepX = dx / steps;
              const stepY = dy / steps;
              
              for (let i = 0; i < steps; i++) {
                const newX = startX + stepX * (i + 1);
                const newY = startY + stepY * (i + 1);
                updateSpritePosition(sprite.id, newX, newY);
                await delay(50);
              }
            } else {
              // For short distances, just go directly
              updateSpritePosition(sprite.id, targetX, targetY);
              await delay(300);
            }
          }
          break;
  
        default:
          break;
      }
    } else if (type === "looks") {
      if (subtype === "say_for_seconds" || subtype === "think_for_seconds") {
        setSpriteMessage(
          sprite.id, 
          subtype.includes("say") ? "say" : "think", 
          script.message, 
          script.duration
        );
        await delay(script.duration * 1000);
      }
    } else if (type === "control" && subtype === "repeat") {
      for (let i = 0; i < script.times; i++) {
        for (let innerScript of sprite.scripts) {
          if (innerScript !== script) {
            await executeScript(sprite, innerScript);
          }
        }
      }
    }
  };

  const renderSpriteComponent = (spriteType) => {
    switch (spriteType) {
      case "cat":
        return <CatSprite />;
      case "dog":
        return <DogSprite />;
      case "bird":
        return <BirdSprite />;
      case "fish":
        return <FishSprite />;
      case "robot":
        return <RobotSprite />;
      default:
        return <CatSprite />;
    }
  };

  const renderSprite = (sprite) => {
    const spriteStyle = {
      position: "absolute",
      left: `calc(50% + ${sprite.x}px)`,
      top: `calc(50% + ${sprite.y}px)`,
      transform: `translate(-50%, -50%) rotate(${sprite.rotation}deg)`,
      cursor: isPlaying ? "default" : "pointer",
      border: sprite.id === selectedSpriteId ? "2px solid blue" : "none",
      transition: isPlaying ? "all 0.3s ease-out" : "none",
      // Debug styling - adds a visible border
      backgroundColor: "rgba(200, 200, 200, 0.1)",
      padding: "5px",
      borderRadius: "5px",
      width: "60px",
      height: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      // Add glow effect on collision
      boxShadow: collisionOccurred && animatingSprites.has(sprite.id) ? "0 0 10px 5px rgba(255, 215, 0, 0.7)" : "none"
    };

    const speechBubbleStyle = {
      position: "absolute",
      backgroundColor: "white",
      border: "1px solid black",
      borderRadius: sprite.sayText ? "10px" : "50%",
      padding: "5px 10px",
      minWidth: "80px",
      maxWidth: "150px",
      textAlign: "center",
      top: "-60px",
      left: "30px",
      display: sprite.sayText || sprite.thinkText ? "block" : "none"
    };

    // Show running indicator if the sprite is currently animating
    const isAnimating = animatingSprites.has(sprite.id);

    // Display coordinates for debugging collision detection
    const coordsStyle = {
      position: "absolute",
      bottom: "-20px",
      left: "0",
      fontSize: "10px",
      color: "#666",
      whiteSpace: "nowrap"
    };

    return (
      <div
        key={sprite.id}
        style={spriteStyle}
        onMouseDown={(e) => handleMouseDown(e, sprite)}
        onClick={() => !isPlaying && setSelectedSpriteId(sprite.id)}
        className={collisionOccurred ? "animate-pulse" : ""}        // collison
      >
        {isAnimating && (
          <div className="absolute -top-5 -right-5 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        )}
        <div style={speechBubbleStyle}>
          {sprite.sayText || sprite.thinkText}
        </div>
        {renderSpriteComponent(sprite.type)}
        {/* <CatSprite /> */}

        {/* Show coordinates for debugging for collison purpose*/}
        <div style={coordsStyle}> 
          x: {Math.round(sprite.x)}, y: {Math.round(sprite.y)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-hidden p-2 relative">  
      <div className="absolute top-2 right-2 z-10">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 my-2 rounded-md font-bold"
          onClick={resetSprites}
        >
          Reset
          <Icon name="redo" size={15} className="text-white mx-2" />
        </button>
      </div>
      <div className="w-full h-full relative border-2  border-gray-300 rounded-lg">
        {sprites.map(sprite => renderSprite(sprite))}

        {/* Visual overlay for collision feedback */}
        {collisionOccurred && (
          <div className="absolute inset-0 bg-yellow-100 bg-opacity-20 pointer-events-none animate-pulse">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-yellow-600 bg-white bg-opacity-70 px-4 py-2 rounded-lg">
              Collison! Actions Swapped
            </div>
          </div>
        )}

      </div>
    </div>
  );
}