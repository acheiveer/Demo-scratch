import React, { createContext, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export const ScratchContext = createContext();

export const ScratchProvider = ({ children }) => {
    const [sprites, setSprites] = useState([
        {
            id: uuidv4(),
            name: "Cat",
            x: 0,
            y: 0,
            type: "cat", // Added sprite type
            scripts: [],
            isExecuting: false,
            sayText: "",
            thinkText: "",
            messageTimer: null,
            rotation: 0
        }
    ]);

    const [selectedSpriteId, setSelectedSpriteId] = useState(sprites[0].id);
    const [isPlaying, setIsPlaying] = useState(false);
    // State to control sprite selection modal visibility
    const [spriteModalOpen, setSpriteModalOpen] = useState(false);

    const [collisionOccurred, setCollisionOccurred] = useState(false); // collison

    // // Effect to check for collisions while playing
    // useEffect(() => {
    //     if (isPlaying) {
    //         const collisionInterval = setInterval(() => {
    //             if (checkCollisions()) {
    //                 // Show a notification or visual feedback when collision occurs
    //                 setCollisionOccurred(true);
    //                 setTimeout(() => setCollisionOccurred(false), 1000); // Reset after 1 second
    //             }
    //         }, 500); // Check every 500ms
            
    //         return () => clearInterval(collisionInterval);
    //     }
    // }, [isPlaying, sprites]);

    // Track which sprites have already had their scripts swapped to prevent continuous swapping
    const swappedPairs = useRef(new Set());
    
    // Reset swapped pairs when play state changes
    // useEffect(() => {
    //     swappedPairs.current.clear();
    //     setCollisionOccurred(false);
    // }, [isPlaying]);

    // Effect to check for collisions while playing
    useEffect(() => {
        if (isPlaying) {
            // //Delete this interval-based approach
            // const collisionInterval = setInterval(() => {
            //     checkCollisions();
            // }, 500); // Check every 500ms

            // No need for any interval here as we'll check collisions on movement
            
            return () => {
                // Clear swapped pairs when play state changes
                swappedPairs.current.clear();
                setCollisionOccurred(false);
            }
        }
    }, [isPlaying]);  //[isPlaying, sprites]



    const openSpriteSelector = () => {
        setSpriteModalOpen(true);
    };

    // Close sprite selection modal
    const closeSpriteSelector = () => {
        setSpriteModalOpen(false);
    };

    function capitalizeFirstLetterForSprite(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const addSprite = (spriteType = "cat") => {
        const randomX = Math.floor(Math.random() * 300 - 150); // -150 to +150
        const randomY = Math.floor(Math.random() * 300 - 150);
        const newSprite = {
            id: uuidv4(),
            // name: `Sprite ${sprites.length + 1}`,
            name: `${capitalizeFirstLetterForSprite(spriteType)}`,
            x: randomX,
            y: randomY,
            type: spriteType, // Use the selected sprite type
            scripts: [],
            isExecuting: false,
            sayText: "",
            thinkText: "",
            messageTimer: null,
            rotation: 0
        };
        setSprites([...sprites, newSprite]);
        setSelectedSpriteId(newSprite.id);
        swappedPairs.current.clear(); // Clear swapped pairs on reset
        setCollisionOccurred(false); // Reset collision state
    };

    const resetSprites = () => {
        const newSprites = sprites.map((sprite) => {
            const randomX = Math.floor(Math.random() * 300 - 150);
            const randomY = Math.floor(Math.random() * 300 - 150);
            return {
                ...sprite,
                x: randomX,
                y: randomY,
                rotation: 0,
                sayText: "",
                thinkText: "",
                isExecuting: false
            };
        });
        setSprites(newSprites);
        setIsPlaying(false); // stop animation if running
        setCollisionOccurred(false); // collison
    };

    const addBlockToSprite = (blockType, blockData) => {
        if (!selectedSpriteId) return;

        setSprites(sprites.map(sprite => {
            if (sprite.id === selectedSpriteId) {
                return {
                    ...sprite,
                    scripts: [...sprite.scripts, {
                        id: uuidv4(),
                        type: blockType,
                        ...blockData
                    }]
                };
            }
            return sprite;
        }));
    };

    const updateSpriteScripts = (scripts) => {
        setSprites(sprites.map(sprite => {
            if (sprite.id === selectedSpriteId) {
                return {
                    ...sprite,
                    scripts
                };
            }
            return sprite;
        }));
    };

  
    const deleteSprite = (spriteId) => {
        // Don't delete if it's the last sprite
        if (sprites.length <= 1) {
            return;
        }

        // Filter out the sprite to be deleted
        const updatedSprites = sprites.filter(sprite => sprite.id !== spriteId);
        setSprites(updatedSprites);

        // If the deleted sprite was selected, select another sprite
        if (selectedSpriteId === spriteId) {
            setSelectedSpriteId(updatedSprites[0]?.id);
        }
    };

    const clearSpriteScripts = (spriteId) => {
        setSprites(sprites.map(sprite => {
          if (sprite.id === spriteId) {
            return {
              ...sprite,
              scripts: [] // Clear all scripts
            };
          }
          return sprite;
        }));
      };


    const reorderBlocks = (sourceIndex, targetIndex) => {
        setSprites(sprites.map(sprite => {
            if (sprite.id === selectedSpriteId) {
                const updatedScripts = [...sprite.scripts];
                const [removed] = updatedScripts.splice(sourceIndex, 1);
                updatedScripts.splice(targetIndex, 0, removed);
                return {
                    ...sprite,
                    scripts: updatedScripts
                };
            }
            return sprite;
        }));
    };

    const togglePlay = () => {
        if (isPlaying) {
            setSprites(sprites.map(sprite => ({
                ...sprite,
                isExecuting: false,
                sayText: "",
                thinkText: ""
            })));
            swappedPairs.current.clear(); // Clear swapped pairs when stopping
            setCollisionOccurred(false); // Reset collision state
        } else {
            setSprites(sprites.map(sprite => ({
                ...sprite,
                isExecuting: true
            })));
        }
        setIsPlaying(!isPlaying);
    };

    // const updateSpritePosition = (id, x, y) => {
    //     setSprites(sprites.map(sprite => {
    //         if (sprite.id === id) {
    //             return { ...sprite, x, y };
    //         }
    //         return sprite;
    //     }));
    // };
    // Individual sprite updates - these need to be atomic to avoid race conditions
    // const updateSpritePosition = (id, x, y) => {
    //     setSprites(prevSprites => prevSprites.map(sprite => {
    //         if (sprite.id === id) {
    //             return { ...sprite, x, y };
    //         }
    //         return sprite;
    //     }));
    // };
    // Update the updateSpritePosition function to check for collisions after every move
    const updateSpritePosition = (id, x, y) => {
        // First update the sprite position
        setSprites(prevSprites => {
            const newSprites = prevSprites.map(sprite => {
                if (sprite.id === id) {
                    return { ...sprite, x, y };
                }
                return sprite;
            });

            // Then check for collisions with the updated positions
            if (isPlaying) {
                setTimeout(() => {
                    checkCollisionsForSprite(id, x, y, newSprites);
                }, 0);
            }

            return newSprites;
        });
    };

    //Add a new function to check collisions just for a specific sprite
const checkCollisionsForSprite = (movedSpriteId, x, y, currentSprites) => {
  // Skip if not playing
  if (!isPlaying) return false;
  
  // Get the sprite that just moved
  const movedSprite = currentSprites.find(s => s.id === movedSpriteId);
  if (!movedSprite || movedSprite.scripts.length === 0) return false;
  
  // Check for collisions with other sprites
  let collisionDetected = false;
  
  currentSprites.forEach(otherSprite => {
    // Skip self-collision or sprites without scripts
    if (otherSprite.id === movedSpriteId || otherSprite.scripts.length === 0) {
      return;
    }
    
    // Generate unique pair key for these sprites
    const pairKey = movedSpriteId < otherSprite.id ? 
      `${movedSpriteId}-${otherSprite.id}` : 
      `${otherSprite.id}-${movedSpriteId}`;
    
    // Skip if these sprites have already collided
    if (swappedPairs.current.has(pairKey)) {
      return;
    }
    
    // Calculate distance between sprites - actual coordinate-based collision detection
    const dx = x - otherSprite.x;
    const dy = y - otherSprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Collision threshold - adjust this value based on your sprite sizes
    const collisionThreshold = 50;
    
    // If sprites are close enough, it's a collision
    if (distance < collisionThreshold) {
      // Visual feedback - make the sprites say something
      setSpriteMessage(movedSpriteId, "say", "Collision!", 1);
      setSpriteMessage(otherSprite.id, "say", "Ouch!", 1);
      
      // Swap scripts between the two sprites
      const movedSpriteScripts = [...movedSprite.scripts];
      
      // Update state with the swapped scripts
      setSprites(prevSprites => 
        prevSprites.map(s => {
          if (s.id === movedSpriteId) {
            return { 
              ...s, 
              scripts: [...otherSprite.scripts],
              isExecuting: false // Reset execution state to trigger animation restart
            };
          } else if (s.id === otherSprite.id) {
            return { 
              ...s, 
              scripts: movedSpriteScripts,
              isExecuting: false // Reset execution state to trigger animation restart
            };
          }
          return s;
        })
      );
      
      // Mark this pair as having swapped
      swappedPairs.current.add(pairKey);
      
      // Show collision notification
      setCollisionOccurred(true);
      
      // Reset sprites to executing after a short delay (to re-trigger animations)
      setTimeout(() => {
        setSprites(prevSprites => 
          prevSprites.map(s => {
            if (s.id === movedSpriteId || s.id === otherSprite.id) {
              return { 
                ...s, 
                isExecuting: true // Restart execution with new scripts
              };
            }
            return s;
          })
        );
        
        // Hide collision notification after delay
        setTimeout(() => {
          setCollisionOccurred(false);
        }, 800); // Show feedback a bit longer
      }, 100);
      
      collisionDetected = true;
    }
  });
  
  return collisionDetected;
};

    // const updateSpriteRotation = (id, rotation) => {
    //     setSprites(sprites.map(sprite => {
    //         if (sprite.id === id) {
    //             return { ...sprite, rotation };
    //         }
    //         return sprite;
    //     }));
    // };
    const updateSpriteRotation = (id, rotation) => {
        setSprites(prevSprites => prevSprites.map(sprite => {
            if (sprite.id === id) {
                return { ...sprite, rotation };
            }
            return sprite;
        }));
    };

    // const setSpriteMessage = (id, type, text, duration) => {
    //     setSprites(sprites.map(sprite => {
    //         if (sprite.id === id) {
    //             // Clear any existing message timer
    //             if (sprite.messageTimer) {
    //                 clearTimeout(sprite.messageTimer);
    //             }

    //             // Set the new message
    //             let updates = {};
    //             if (type === "say") {
    //                 updates = { sayText: text, thinkText: "" };
    //             } else {
    //                 updates = { sayText: "", thinkText: text };
    //             }

    //             // Set a timer to clear the message after duration (if specified)
    //             let messageTimer = null;
    //             if (duration) {
    //                 messageTimer = setTimeout(() => {
    //                     setSprites(prevSprites =>
    //                         prevSprites.map(s =>
    //                             s.id === id ? { ...s, sayText: "", thinkText: "", messageTimer: null } : s
    //                         )
    //                     );
    //                 }, duration * 1000);
    //             }

    //             return { ...sprite, ...updates, messageTimer };
    //         }
    //         return sprite;
    //     }));
    // };
    const setSpriteMessage = (id, type, text, duration) => {
        setSprites(prevSprites => prevSprites.map(sprite => {
            if (sprite.id === id) {
                // Clear any existing message timer
                if (sprite.messageTimer) {
                    clearTimeout(sprite.messageTimer);
                }

                // Set the new message
                let updates = {};
                if (type === "say") {
                    updates = { sayText: text, thinkText: "" };
                } else {
                    updates = { sayText: "", thinkText: text };
                }

                // Set a timer to clear the message after duration (if specified)
                let messageTimer = null;
                if (duration) {
                    messageTimer = setTimeout(() => {
                        setSprites(currentSprites =>
                            currentSprites.map(s =>
                                s.id === id ? { ...s, sayText: "", thinkText: "", messageTimer: null } : s
                            )
                        );
                    }, duration * 1000);
                }

                return { ...sprite, ...updates, messageTimer };
            }
            return sprite;
        }));
    };

    // Helper to create a unique pair key for tracking collisions
    const getPairKey = (id1, id2) => {
        return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
    };

    // // Hero Feature: Check for collisions between sprites and swap animations
    // const checkCollisions = () => {
    //     if (sprites.length < 2) return false; // Need at least 2 sprites to check collisions
        
    //     const spritesArray = [...sprites];
    //     let collisionDetected = false;
        
    //     // Check each pair of sprites for collision
    //     for (let i = 0; i < spritesArray.length; i++) {
    //         for (let j = i + 1; j < spritesArray.length; j++) {
    //             const sprite1 = spritesArray[i];
    //             const sprite2 = spritesArray[j];
                
    //             // Skip if either sprite has no scripts
    //             if (sprite1.scripts.length === 0 || sprite2.scripts.length === 0) {
    //                 continue;
    //             }

    //             // Simple collision detection based on distance between sprites
    //             const dx = sprite1.x - sprite2.x;
    //             const dy = sprite1.y - sprite2.y;
    //             const distance = Math.sqrt(dx * dx + dy * dy);

    //             // If sprites are close enough (within 50px), consider it a collision
    //             if (distance < 50) {
    //                 // Visual feedback - make the sprites say something
    //                 setSpriteMessage(sprite1.id, "say", "Collision!", 1);
    //                 setSpriteMessage(sprite2.id, "say", "Ouch!", 1);
                    
    //                 // Swap scripts between the two sprites
    //                 const updatedSprites = spritesArray.map(s => {
    //                     if (s.id === sprite1.id) {
    //                         return { ...s, scripts: [...sprite2.scripts] };
    //                     } else if (s.id === sprite2.id) {
    //                         return { ...s, scripts: [...sprite1.scripts] };
    //                     }
    //                     return s;
    //                 });
                    
    //                 // Update state with the swapped scripts
    //                 setSprites(updatedSprites);
    //                 collisionDetected = true;
    //                 return true; // Return after first collision to avoid multiple swaps
    //             }
    //         }
    //     }
        
    //     return collisionDetected;
    // };

    // Hero Feature: Check for collisions between sprites and swap animations
    // Update your checkCollisions function with this simpler approach
//     const checkCollisions = () => {
//     if (sprites.length < 2) return false; // Need at least 2 sprites to check collisions
    
//     const spritesArray = [...sprites];
//     let collisionDetected = false;
    
//     // Check each pair of sprites for collision
//     for (let i = 0; i < spritesArray.length; i++) {
//       for (let j = i + 1; j < spritesArray.length; j++) {
//         const sprite1 = spritesArray[i];
//         const sprite2 = spritesArray[j];
        
//         // Skip if either sprite has no scripts
//         if (sprite1.scripts.length === 0 || sprite2.scripts.length === 0) {
//           continue;
//         }
  
//         // Generate a unique key for this sprite pair
//         const pairKey = sprite1.id < sprite2.id ? 
//           `${sprite1.id}-${sprite2.id}` : 
//           `${sprite2.id}-${sprite1.id}`;
        
//         // Skip if these sprites have already collided and swapped scripts
//         if (swappedPairs.current.has(pairKey)) {
//           continue;
//         }
  
//         // Simple collision detection based on distance between sprites
//         const dx = sprite1.x - sprite2.x;
//         const dy = sprite1.y - sprite2.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);
  
//         // If sprites are close enough (within 50px), consider it a collision
//         if (distance < 50) {
//           // Visual feedback - make the sprites say something
//           setSpriteMessage(sprite1.id, "say", "Collision!", 1);
//           setSpriteMessage(sprite2.id, "say", "Ouch!", 1);
          
//           // Swap scripts between the two sprites
//           const temp = [...sprite1.scripts];
          
//           // Update state with the swapped scripts
//           setSprites(prevSprites => 
//             prevSprites.map(s => {
//               if (s.id === sprite1.id) {
//                 return { 
//                   ...s, 
//                   scripts: [...sprite2.scripts],
//                   // Reset execution state to trigger animation restart
//                   isExecuting: false 
//                 };
//               } else if (s.id === sprite2.id) {
//                 return { 
//                   ...s, 
//                   scripts: temp,
//                   // Reset execution state to trigger animation restart 
//                   isExecuting: false 
//                 };
//               }
//               return s;
//             })
//           );
          
//           // Mark this pair as having swapped
//           swappedPairs.current.add(pairKey);
          
//           // Show collision notification
//           setCollisionOccurred(true);
          
//           // Reset sprites to executing after a short delay (to re-trigger animations)
//           setTimeout(() => {
//             setSprites(prevSprites => 
//               prevSprites.map(s => {
//                 if (s.id === sprite1.id || s.id === sprite2.id) {
//                   return { 
//                     ...s, 
//                     isExecuting: true  // Restart execution with new scripts
//                   };
//                 }
//                 return s;
//               })
//             );
            
//             // Hide collision notification after delay
//             setTimeout(() => {
//               setCollisionOccurred(false);
//             }, 600);
//           }, 100);
          
//           collisionDetected = true;
//           return true; // Return after first collision to avoid multiple swaps
//         }
//       }
//     }
    
//     return collisionDetected;
//   };

    return (
        <ScratchContext.Provider
            value={{
                sprites,
                setSprites,
                selectedSpriteId,
                isPlaying,
                resetSprites,
                setSelectedSpriteId,
                addSprite,
                clearSpriteScripts,
                deleteSprite,
                addBlockToSprite,
                updateSpriteScripts,
                reorderBlocks,
                togglePlay,
                updateSpritePosition,
                updateSpriteRotation,
                setSpriteMessage,
                spriteModalOpen,
                openSpriteSelector,
                closeSpriteSelector,
                //checkCollisions,
                collisionOccurred
            }}
        >
            {children}
        </ScratchContext.Provider>
    );
};