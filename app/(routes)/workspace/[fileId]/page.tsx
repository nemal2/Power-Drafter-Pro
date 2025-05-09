"use client";
import React, { useCallback, useEffect, useState } from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import BudgetCalculator from "../_components/BudgetCalculator";
import { useConvex } from "convex/react";
import CanvasSidebar from "../_components/CanvasSidebar";
import Canvas from "../_components/Canvas";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LibraryItem } from "../_components/CanvasSidebar/ComponentPanel";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Undo2, Redo2, RotateCcw, Calculator } from 'lucide-react';
import { FadingDots } from "react-cssfx-loading";

interface CanvasComponent extends LibraryItem {
  x: number;
  y: number;
  instanceId: string;
}

// Different types of actions that can be performed
type ActionType = 'add' | 'remove' | 'move' | 'quantity' | 'reset';

// Action object with detailed information about what changed
interface HistoryAction {
  type: ActionType;
  affectedItems: string[]; // Instance IDs of affected components
  snapshot: CanvasComponent[]; // Full state after this action
}

const Workspace: React.FC<{ params: { fileId: string } }> = ({ params }) => {
  const convex = useConvex();
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showBudgetCalculator, setShowBudgetCalculator] = useState(false); // Changed to false by default
  
  // History states
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);

  const toggleBudgetCalculator = useCallback(() => {
    setShowBudgetCalculator(prev => !prev);
  }, []);

  // Debug helper function
  const debugHistory = () => {
    console.log("Current step:", currentStep);
    console.log("History length:", history.length);
    if (history.length > 0) {
      console.log("History:", history.map((h, i) => ({
        index: i,
        type: h.type,
        affectedItems: h.affectedItems,
        isCurrent: i === currentStep
      })));
    }
  };

  useEffect(() => {
    // Updated loadState function to merge dimensions from localStorage
const loadState = async () => {
  try {
    setLoading(true);
    const state = await convex.query(api.files.getFileById, {
      fileId: params.fileId as Id<"files">
    });
    
    if (state?.canvasComponents?.length > 0) {
      // Create deep copies to prevent reference issues
      let initialComponents = JSON.parse(JSON.stringify(state.canvasComponents));
      
      // Try to load dimensions from localStorage
      const savedDimensions = localStorage.getItem(`canvas_dimensions_${params.fileId}`);
      if (savedDimensions) {
        try {
          const dimensionsData = JSON.parse(savedDimensions);
          
          // Create a map of dimensions by instanceId
          const dimensionsMap = {};
          dimensionsData.forEach(item => {
            if (item.instanceId && (item.width || item.height)) {
              dimensionsMap[item.instanceId] = {
                width: item.width || 100,
                height: item.height || 100
              };
            }
          });
          
          // Apply dimensions to loaded components
          initialComponents = initialComponents.map(comp => {
            const savedDims = dimensionsMap[comp.instanceId];
            if (savedDims) {
              return {
                ...comp,
                width: savedDims.width,
                height: savedDims.height
              };
            }
            return {
              ...comp,
              width: comp.width || 100,  // Default width
              height: comp.height || 100 // Default height
            };
          });
        } catch (e) {
          console.error("Error parsing saved dimensions:", e);
        }
      } else {
        // If no saved dimensions, ensure all components have default width/height
        initialComponents = initialComponents.map(comp => ({
          ...comp,
          width: 100,  // Default width
          height: 100  // Default height
        }));
      }
      
      setComponents(initialComponents);
      
      // Initialize history with a single initial state
      const initialHistory = [{ 
        type: 'add',
        affectedItems: initialComponents.map((c: any) => c.instanceId),
        snapshot: initialComponents
      }];
      setHistory(initialHistory);
      setCurrentStep(0);
    } else {
      // Initialize with empty state
      setComponents([]);
      setHistory([{ type: 'reset', affectedItems: [], snapshot: [] }]);
      setCurrentStep(0);
    }
  } catch (error) {
    console.error("Error loading state:", error);
    toast.error("Failed to load workspace");
  } finally {
    setLoading(false);
  }
};

    if (params.fileId) {
      loadState();
    }
  }, [convex, params.fileId]);

  // New approach: Track individual components but maintain full snapshots
  const addToHistory = useCallback((
    newComponents: CanvasComponent[],
    actionType: ActionType,
    affectedInstanceIds: string[] = []
  ) => {
    try {
      // Create a deep copy of the new components
      const componentsCopy = JSON.parse(JSON.stringify(newComponents));
      
      // If we're not at the end of history, truncate future steps
      const updatedHistory = [...history.slice(0, currentStep + 1), {
        type: actionType,
        affectedItems: affectedInstanceIds,
        snapshot: componentsCopy
      }];
      
      // Update history and step
      setHistory(updatedHistory);
      setCurrentStep(currentStep + 1);
      
      // Update components state
      setComponents(componentsCopy);
    } catch (error) {
      console.error("Error adding to history:", error);
      setComponents(newComponents); // Fallback to ensure components are updated
    }
  }, [currentStep, history]);

  // Handle component addition
  const handleComponentAdd = useCallback((component: LibraryItem, actionType: string = 'add') => {
    try {
      // Ensure component has all required properties
      const completeComponent = {
        ...component,
        x: component.x || 100,
        y: component.y || 100,
        instanceId: component.instanceId || `${component.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        width: component.width || 100,
        height: component.height || 100,
        rotation: component.rotation || 0,
        // Ensure specs are defined
        specs: {
          power: component.specs?.power || ["default"],
          resistance: component.specs?.resistance || ["default"],
          tolerance: component.specs?.tolerance || ["default"],
          ...component.specs
        }
      };
      
      setComponents(prev => {
        try {
          // Create a deep copy of the previous state
          const prevCopy = JSON.parse(JSON.stringify(prev));
          
          // Check if this component already exists (for updates)
          const existingIndex = prevCopy.findIndex(comp => comp.instanceId === completeComponent.instanceId);
          let newComponents;
          
          if (existingIndex !== -1) {
            // Update existing component
            newComponents = [...prevCopy];
            newComponents[existingIndex] = completeComponent;
            
            // Record this as a move action
            addToHistory(newComponents, 'move', [completeComponent.instanceId]);
          } else {
            // Add new component
            newComponents = [...prevCopy, completeComponent];
            
            // Record this as an add action
            addToHistory(newComponents, 'add', [completeComponent.instanceId]);
          }
          
          return newComponents;
        } catch (innerError) {
          console.error("Error in component add:", innerError);
          // If there's an error, at least try to add the component
          return [...prev, completeComponent];
        }
      });
    } catch (error) {
      console.error("Error adding component:", error);
      toast.error("Failed to add component");
    }
  }, [addToHistory]);

  // Handle component deletion
  const handleComponentDelete = useCallback((instanceId: string) => {
    setComponents(prev => {
      const newComponents = prev.filter(comp => comp.instanceId !== instanceId);
      addToHistory(newComponents, 'remove', [instanceId]);
      return newComponents;
    });
  }, [addToHistory]);

  // Handle quantity updates
  const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
    setComponents(prev => {
      try {
        // Get the current components with this ID
        const currentComponents = prev.filter(comp => comp.id === id);
        const otherComponents = prev.filter(comp => comp.id !== id);
        
        if (currentComponents.length === 0) {
          console.error(`No components found with id: ${id}`);
          return prev;
        }
        
        // Track affected instance IDs for history
        const affectedInstanceIds: string[] = [];
        
        let newComponents;
        
        if (newQuantity <= 0) {
          // Remove all components with this id
          affectedInstanceIds.push(...currentComponents.map(c => c.instanceId));
          newComponents = otherComponents;
        } else if (newQuantity > currentComponents.length) {
          // Need to add more components
          const template = currentComponents[0];
          const toAdd = newQuantity - currentComponents.length;
          
          // Create new components with unique IDs
          const newItems = Array(toAdd).fill(null).map(() => {
            const newInstanceId = `${template.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            affectedInstanceIds.push(newInstanceId);
            
            return {
              ...template,
              instanceId: newInstanceId,
              x: Math.random() * 500 + 50,
              y: Math.random() * 300 + 50
            };
          });
          
          newComponents = [...otherComponents, ...currentComponents, ...newItems];
        } else {
          // Need to remove some components
          const toRemove = currentComponents.slice(newQuantity);
          affectedInstanceIds.push(...toRemove.map(c => c.instanceId));
          
          newComponents = [...otherComponents, ...currentComponents.slice(0, newQuantity)];
        }
        
        // Add to history
        addToHistory(newComponents, 'quantity', affectedInstanceIds);
        
        return newComponents;
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
        return prev;
      }
    });
  }, [addToHistory]);

  // Handle removing all instances of an item
  const handleRemoveItem = useCallback((id: string) => {
    setComponents(prev => {
      const itemsToRemove = prev.filter(comp => comp.id === id);
      const affectedIds = itemsToRemove.map(item => item.instanceId);
      const newComponents = prev.filter(comp => comp.id !== id);
      
      addToHistory(newComponents, 'remove', affectedIds);
      return newComponents;
    });
  }, [addToHistory]);

  // Undo function that works correctly with add/remove operations
  const handleUndo = useCallback(() => {
    if (currentStep > 0) {
      try {
        // Get the previous state
        const previousAction = history[currentStep - 1];
        
        if (!previousAction || !previousAction.snapshot) {
          console.error("Invalid history state for undo");
          return;
        }
        
        // Restore the previous snapshot
        const previousSnapshot = JSON.parse(JSON.stringify(previousAction.snapshot));
        setComponents(previousSnapshot);
        setCurrentStep(currentStep - 1);
        
      } catch (error) {
        console.error("Error during undo operation:", error);
        toast.error("Failed to undo");
      }
    }
  }, [currentStep, history]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (currentStep < history.length - 1) {
      try {
        // Get the next state
        const nextAction = history[currentStep + 1];
        
        if (!nextAction || !nextAction.snapshot) {
          console.error("Invalid history state for redo");
          return;
        }
        
        // Restore the next snapshot
        const nextSnapshot = JSON.parse(JSON.stringify(nextAction.snapshot));
        setComponents(nextSnapshot);
        setCurrentStep(currentStep + 1);
        
      } catch (error) {
        console.error("Error during redo operation:", error);
        toast.error("Failed to redo");
      }
    }
  }, [currentStep, history]);

  // Reset canvas function
  const handleResetCanvas = useCallback(() => {
    try {
      if (components.length > 0) {
        // Create empty state
        const emptyComponents: CanvasComponent[] = [];
        
        // Add reset action to history with all component IDs as affected
        const affectedIds = components.map(c => c.instanceId);
        addToHistory(emptyComponents, 'reset', affectedIds);
        
        toast.success("Canvas reset successfully");
      }
    } catch (error) {
      console.error("Error resetting canvas:", error);
      toast.error("Failed to reset canvas");
    }
  }, [components, addToHistory]);

  // Save the current state
// handleSave function with fix to preserve width and height
// handleSave function that removes width and height to match the server validator
const handleSave = async () => {
  try {
    setSaving(true);
    
    // Calculate budget items from current components
    const budget = {
      total: components.reduce((sum, item) => sum + item.price, 0),
      items: Array.from(
        components.reduce((map, item) => {
          const existing = map.get(item.id);
          if (existing) {
            existing.quantity += 1;
          } else {
            map.set(item.id, {
              id: item.id,
              name: item.name,
              quantity: 1,
              price: item.price
            });
          }
          return map;
        }, new Map())
      ).map(([_, item]) => item)
    };

    // Store original component data in localStorage before saving to server
    // This preserves width/height that the server validator doesn't accept
    const componentsWithDimensions = JSON.stringify(components);
    localStorage.setItem(`canvas_dimensions_${params.fileId}`, componentsWithDimensions);

    // Remove width and height for the server since they're not in the validator
    const componentsToSave = components.map(comp => {
      // Extract only the fields that the server validator accepts
      const { width, height, category, ...serverSafeComponent } = comp;
      
      return {
        ...serverSafeComponent,
        rotation: serverSafeComponent.rotation ?? 0.0,
        // Ensure specs object has resistance field
        specs: {
          ...comp.specs,
          resistance: comp.specs?.resistance || ["default"]
        }
      };
    });

    await convex.mutation(api.files.saveCanvasState, {
      fileId: params.fileId as Id<"files">,
      components: componentsToSave,
      budget
    });

    toast.success("Workspace saved successfully");
  } catch (error) {
    console.error("Error saving workspace:", error);
    toast.error("Failed to save workspace");
  } finally {
    setSaving(false);
  }
};
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <FadingDots color="#3B82F6" width="80px" height="80px" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header and Controls Row - Combined into a single row */}
      <div className="flex-shrink-0">
        <WorkspaceHeader 
          onSave={handleSave} 
          fileName={params.fileId} 
          saving={saving}
        />
        <div className="flex justify-between items-center px-4 py-1 bg-gray-50 border-b">
          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              disabled={currentStep <= 0}
              className={`p-1.5 rounded ${currentStep <= 0 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              title="Undo"
            >
              <Undo2 size={18} />
            </button>
            <button
              onClick={handleRedo}
              disabled={currentStep >= history.length - 1}
              className={`p-1.5 rounded ${currentStep >= history.length - 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              title="Redo"
            >
              <Redo2 size={18} />
            </button>
            <button
              onClick={handleResetCanvas}
              disabled={components.length === 0}
              className={`p-1.5 rounded ${components.length === 0 ? 'bg-gray-300' : 'bg-red-500 text-white hover:bg-red-600'}`}
              title="Reset Canvas"
            >
              <RotateCcw size={18} />
            </button>
          </div>
          
          {/* Calculator toggle - moved to top bar */}
          <button
            onClick={toggleBudgetCalculator}
            className={`p-1.5 rounded flex items-center ${showBudgetCalculator ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            title="Toggle Budget Calculator"
          >
            <Calculator size={18} />
            <span className="ml-1 text-sm">Budget</span>
          </button>
        </div>
      </div>
      
      {/* Main Content - Takes remaining space */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-grow h-full overflow-hidden">
          {/* Sidebar */}
          <div className="flex-shrink-0">
            <CanvasSidebar 
              onAddElement={handleComponentAdd}
              toggleBudgetCalculator={toggleBudgetCalculator} 
            />
          </div>
          
          {/* Canvas - Takes remaining space */}
          <div className="flex-grow overflow-hidden">
            <Canvas
              fileId={params.fileId as Id<"files">}
              components={components}
              onComponentAdd={handleComponentAdd}
              onComponentDelete={handleComponentDelete}
              onDragStart={(e, src) => setDraggedImage(src)}
              draggedImage={draggedImage}
              onDropComplete={() => setDraggedImage(null)}
            />
          </div>
          
          {/* Budget Calculator - Overlay that slides in/out */}
          <div
            className={`fixed right-0 top-16 bottom-0 w-60 bg-white shadow-lg z-50 transition-transform duration-300 flex flex-col ${
              showBudgetCalculator ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <BudgetCalculator
              items={components}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClose={toggleBudgetCalculator}
            />
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default Workspace;