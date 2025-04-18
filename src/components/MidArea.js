// import React, { useContext, useState } from "react";
// import { ScratchContext } from "./ScratchContext";
// import Block from "./Block";
// import {v4 as uuidv4} from "uuid";

// export default function MidArea() {

//   const { sprites, selectedSpriteId, updateSpriteScripts , addBlockToSprite, setSprites} = useContext(ScratchContext);
//   const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  
//   const selectedSprite = sprites.find(sprite => sprite.id === selectedSpriteId);
  
//   const handleUpdateBlock = (updatedBlock, index) => {
//     const updatedScripts = [...selectedSprite.scripts];
//     updatedScripts[index] = updatedBlock;
//     updateSpriteScripts(updatedScripts);
//   };
  
//   const handleDeleteBlock = (index) => {
//     const updatedScripts = [...selectedSprite.scripts];
//     updatedScripts.splice(index, 1);
//     updateSpriteScripts(updatedScripts);
//   };

//   // Reorder blocks function
//   const reorderBlocks = (sourceIndex, targetIndex) => {
//     setSprites(sprites.map(sprite => {
//       if (sprite.id === selectedSpriteId) {
//         const updatedScripts = [...sprite.scripts];
//         const [removed] = updatedScripts.splice(sourceIndex, 1);
//         updatedScripts.splice(targetIndex, 0, removed);
//         return {
//           ...sprite,
//           scripts: updatedScripts
//         };
//       }
//       return sprite;
//     }));
//   };

//   // Handle drop event for new blocks from sidebar
//   const handleDrop = (e) => {
//     e.preventDefault();
    
//     try {
//       // Get the block data from drag event
//       const blockData = JSON.parse(e.dataTransfer.getData("application/json"));
      
//       if (blockData && blockData.type) {
//         // Add block to the selected sprite
//         addBlockToSprite(blockData.type, {
//           subtype: blockData.subtype,
//           ...blockData
//         });
//       }
//       // Handle block reordering from within the midArea
//       else if (blockData && blockData.action === "reorder" && blockData.block) {
//         // Find source index
//         const sourceIndex = selectedSprite.scripts.findIndex(
//           script => script.id === blockData.block.id
//         );
        
//         if (sourceIndex !== -1) {
//           // If dropped on the main area (not on a specific block), append to the end
//           const targetIndex = selectedSprite.scripts.length;
//           reorderBlocks(sourceIndex, targetIndex);
//         }
//       }
//     } catch (error) {
//       console.error("Error handling drop:", error);
//     }
//   };
  
//   // Handle drag over event
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     //e.dataTransfer.dropEffect = "copy"; // Show copy cursor

//     // Determine the appropriate cursor based on data being dragged
//     try {
//       const data = JSON.parse(e.dataTransfer.getData("application/json"));
//       e.dataTransfer.dropEffect = data.action === "reorder" ? "move" : "copy";
//     } catch {
//       // Default to copy if we can't determine the type
//       e.dataTransfer.dropEffect = "copy";
//     }
//   };

//   // Handle block-specific drop for reordering
//   const handleBlockDrop = (e, targetIndex) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDraggedOverIndex(null);
    
//     try {
//       const data = JSON.parse(e.dataTransfer.getData("application/json"));
      
//       if (data && data.action === "reorder" && data.block) {
//         // Find the source index
//         const sourceIndex = selectedSprite.scripts.findIndex(
//           script => script.id === data.block.id
//         );
        
//         if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
//           reorderBlocks(sourceIndex, targetIndex);
//         }
//       }
//     } catch (error) {
//       console.error("Error handling block drop:", error);
//     }
//   };

//   // Handle block-specific drag over
//   const handleBlockDragOver = (e, index) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     try {
//       const data = JSON.parse(e.dataTransfer.getData("application/json"));
//       // Only show drop indicator for reordering actions
//       if (data && data.action === "reorder") {
//         setDraggedOverIndex(index);
//         e.dataTransfer.dropEffect = "move";
//       }
//     } catch {
//       // For non-reordering drags, we don't show indicators
//     }
//   };

//   // Handle drag leave
//   const handleDragLeave = () => {
//     setDraggedOverIndex(null);
//   };
  
//   return (
//     <div className="flex-1 h-full overflow-auto p-4"
//     onDrop={handleDrop}
//     onDragOver={handleDragOver}
//     onDragLeave={handleDragLeave}
//     >
//       <h2 className="text-lg font-bold mb-4">
//         {selectedSprite ? `${selectedSprite.name} Scripts` : "Select a Sprite"}
//       </h2>
      
//       {selectedSprite && (
//         <div className="space-y-1">
//           {selectedSprite.scripts.map((block, index) => (
//             <div
//               key={block.id || index}
//               onDragOver={(e) => handleBlockDragOver(e, index)}
//               onDrop={(e) => handleBlockDrop(e, index)}
//               className={draggedOverIndex === index ? "border-t-2 border-white" : ""}
//             >
//             <Block
//               // key={block.id || index}
//               // block={block}
//               // onUpdate={(updatedBlock) => handleUpdateBlock(updatedBlock, index)}
//               // onDelete={() => handleDeleteBlock(index)}
//               block={{...block, id: block.id || uuidv4()}}
//                 onUpdate={(updatedBlock) => handleUpdateBlock(updatedBlock, index)}
//                 onDelete={() => handleDeleteBlock(index)}
//                 isDragging={false}
//             />
//             </div>
//           ))}
          
//           {selectedSprite.scripts.length === 0 && (
//             <div className="text-gray-500 italic">
//               Drag blocks from the sidebar to add scripts
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// when ading more sprite in midArea
import React, { useContext, useState } from "react";
import { ScratchContext } from "./ScratchContext";
import Block from "./Block";
import {v4 as uuidv4} from "uuid";

export default function MidArea() {
  const { sprites, selectedSpriteId, deleteSprite, setSprites, clearSpriteScripts } = useContext(ScratchContext);
  const [draggedOverInfo, setDraggedOverInfo] = useState({ spriteId: null, index: null });
  
  const handleUpdateBlock = (spriteId, updatedBlock, index) => {
    setSprites(sprites.map(sprite => {
      if (sprite.id === spriteId) {
        const updatedScripts = [...sprite.scripts];
        updatedScripts[index] = updatedBlock;
        return {
          ...sprite,
          scripts: updatedScripts
        };
      }
      return sprite;
    }));
  };
  
  const handleDeleteBlock = (spriteId, index) => {
    setSprites(sprites.map(sprite => {
      if (sprite.id === spriteId) {
        const updatedScripts = [...sprite.scripts];
        updatedScripts.splice(index, 1);
        return {
          ...sprite,
          scripts: updatedScripts
        };
      }
      return sprite;
    }));
  };

  // Reorder blocks function
  const reorderBlocks = (spriteId, sourceIndex, targetIndex) => {
    setSprites(sprites.map(sprite => {
      if (sprite.id === spriteId) {
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

  // Handle drop event for new blocks from sidebar
  const handleDrop = (e, spriteId) => {
    e.preventDefault();
    
    try {
      // Get the block data from drag event
      const blockData = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (blockData && blockData.type) {
        // Add block to the specific sprite
        setSprites(sprites.map(sprite => {
          if (sprite.id === spriteId) {
            return {
              ...sprite,
              scripts: [...sprite.scripts, {
                id: uuidv4(),
                type: blockData.type,
                subtype: blockData.subtype,
                ...blockData
              }]
            };
          }
          return sprite;
        }));
      }
      // Handle block reordering from within the midArea
      else if (blockData && blockData.action === "reorder" && blockData.block) {
        // Find source sprite and index
        let sourceSprite = null;
        let sourceIndex = -1;
        
        for (const sprite of sprites) {
          sourceIndex = sprite.scripts.findIndex(script => script.id === blockData.block.id);
          if (sourceIndex !== -1) {
            sourceSprite = sprite;
            break;
          }
        }
        
        if (sourceSprite && sourceIndex !== -1) {
          // If moving within same sprite
          if (sourceSprite.id === spriteId) {
            // If dropped on the main area (not on a specific block), append to the end
            const targetIndex = sourceSprite.scripts.length;
            reorderBlocks(spriteId, sourceIndex, targetIndex);
          } 
          // If moving between different sprites
          else {
            // Add to target sprite and remove from source sprite
            setSprites(sprites.map(sprite => {
              if (sprite.id === spriteId) {
                // Add to target sprite
                return {
                  ...sprite,
                  scripts: [...sprite.scripts, {...blockData.block, id: uuidv4()}]
                };
              } else if (sprite.id === sourceSprite.id) {
                // Remove from source sprite
                const updatedScripts = [...sprite.scripts];
                updatedScripts.splice(sourceIndex, 1);
                return {
                  ...sprite,
                  scripts: updatedScripts
                };
              }
              return sprite;
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
    
    // Reset drag over state
    setDraggedOverInfo({ spriteId: null, index: null });
  };
  
  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      e.dataTransfer.dropEffect = data.action === "reorder" ? "move" : "copy";
    } catch {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  // Handle block-specific drop for reordering
  const handleBlockDrop = (e, spriteId, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverInfo({ spriteId: null, index: null });
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (data && data.action === "reorder" && data.block) {
        // Find the source sprite and index
        let sourceSprite = null;
        let sourceIndex = -1;
        
        for (const sprite of sprites) {
          sourceIndex = sprite.scripts.findIndex(script => script.id === data.block.id);
          if (sourceIndex !== -1) {
            sourceSprite = sprite;
            break;
          }
        }
        
        if (sourceSprite && sourceIndex !== -1) {
          // If moving within same sprite
          if (sourceSprite.id === spriteId && sourceIndex !== targetIndex) {
            reorderBlocks(spriteId, sourceIndex, targetIndex);
          } 
          // If moving between different sprites
          else if (sourceSprite.id !== spriteId) {
            // Add to target sprite at specific position and remove from source sprite
            setSprites(sprites.map(sprite => {
              if (sprite.id === spriteId) {
                // Add to target sprite
                const updatedScripts = [...sprite.scripts];
                updatedScripts.splice(targetIndex, 0, {...data.block, id: uuidv4()});
                return {
                  ...sprite,
                  scripts: updatedScripts
                };
              } else if (sprite.id === sourceSprite.id) {
                // Remove from source sprite
                const updatedScripts = [...sprite.scripts];
                updatedScripts.splice(sourceIndex, 1);
                return {
                  ...sprite,
                  scripts: updatedScripts
                };
              }
              return sprite;
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error handling block drop:", error);
    }
  };

  // Handle block-specific drag over
  const handleBlockDragOver = (e, spriteId, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      // Only show drop indicator for reordering actions
      if (data && data.action === "reorder") {
        setDraggedOverInfo({ spriteId, index });
        e.dataTransfer.dropEffect = "move";
      }
    } catch {
      // For non-reordering drags, we don't show indicators
    }
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDraggedOverInfo({ spriteId: null, index: null });
  };
  
  return (
    <div className="flex-1 h-full overflow-auto p-4 flex flex-col">
      {sprites.map(sprite => (
        <div 
          key={sprite.id} 
          className={`mb-4 p-3 rounded-lg ${sprite.id === selectedSpriteId ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}
          onDrop={(e) => handleDrop(e, sprite.id)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">
          Program Your {sprite.name} 
          </h2>
          <div className="flex space-x-2">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-sm"
              onClick={() => clearSpriteScripts(sprite.id)}
              disabled={sprite.scripts.length === 0}
            >
              Clear
            </button>
            {sprites.length > 1 && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                onClick={() => deleteSprite(sprite.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
          
          <div className="space-y-1">
            {sprite.scripts.map((block, index) => (
              <div
                key={block.id || index}
                onDragOver={(e) => handleBlockDragOver(e, sprite.id, index)}
                onDrop={(e) => handleBlockDrop(e, sprite.id, index)}
                className={draggedOverInfo.spriteId === sprite.id && draggedOverInfo.index === index ? "border-t-2 border-white" : ""}
              >
                <Block
                  block={{...block, id: block.id || uuidv4()}}
                  onUpdate={(updatedBlock) => handleUpdateBlock(sprite.id, updatedBlock, index)}
                  onDelete={() => handleDeleteBlock(sprite.id, index)}
                  isDragging={false}
                />
              </div>
            ))}
            
            {sprite.scripts.length === 0 && (
              <div className="text-gray-500 italic">
                Drag blocks from the sidebar to add actions
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}