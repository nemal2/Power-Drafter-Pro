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
import { Undo2, Redo2, RotateCcw } from 'lucide-react';
import { FadingDots } from "react-cssfx-loading";

interface CanvasComponent extends LibraryItem {
  x: number;
  y: number;
  instanceId: string;
  price?: number;
  rotation?: number;
}

// Interface for the expected shape in the API
interface SavedCanvasComponent extends Omit<CanvasComponent, 'price'> {
  price: number;  // Non-optional price for API
}

interface HistoryAction {
  type: 'add' | 'remove' | 'move' | 'quantity'| 'reset';
  components: CanvasComponent[];
  componentId?: string;
  previousState?: CanvasComponent[];
}

interface BudgetItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const Workspace: React.FC<{ params: { fileId: string } }> = ({ params }) => {
  const convex = useConvex();
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showBudgetCalculator, setShowBudgetCalculator] = useState(true);

  const toggleBudgetCalculator = useCallback(() => {
    setShowBudgetCalculator(prev => !prev);
  }, []);

 // History states with action type
 const [history, setHistory] = useState<HistoryAction[]>([]);
 const [currentStep, setCurrentStep] = useState(-1);


 useEffect(() => {
  const loadState = async () => {
    try {
      setLoading(true);
      const state = await convex.query(api.files.getFileById, {
        fileId: params.fileId as Id<"files">
      });
      
      if (state?.canvasComponents?.length) {
        setComponents(state.canvasComponents);
        setHistory([{ type: 'add', components: state.canvasComponents }]);
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

   const addToHistory = useCallback((newComponents: CanvasComponent[], actionType: string, componentId?: string) => {
    const previousState = components;
    setHistory(prev => [...prev.slice(0, currentStep + 1), {
      type: actionType as 'add' | 'remove' | 'move' | 'quantity' | 'reset',
      components: newComponents,
      componentId,
      previousState
    }]);
    setCurrentStep(prev => prev + 1);
    setComponents(newComponents);
  }, [currentStep, components]);


  const handleComponentAdd = useCallback((component: CanvasComponent, actionType: string) => {
    setComponents(prev => {
      const existingIndex = prev.findIndex(comp => comp.instanceId === component.instanceId);
      let newComponents;
      
      if (existingIndex !== -1) {
        newComponents = [...prev];
        newComponents[existingIndex] = component;
      } else {
        newComponents = [...prev, component];
      }
      
      addToHistory(newComponents, actionType, component.instanceId);
      return newComponents;
    });
  }, [addToHistory]);


  const handleComponentDelete = useCallback((instanceId: string) => {
    setComponents(prev => {
      const newComponents = prev.filter(comp => comp.instanceId !== instanceId);
      addToHistory(newComponents, 'remove', instanceId);
      return newComponents;
    });
  }, [addToHistory]);


   const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
    setComponents(prev => {
      const currentComponents = prev.filter(comp => comp.id === id);
      const otherComponents = prev.filter(comp => comp.id !== id);
      
      let newComponents;
      if (newQuantity <= 0) {
        newComponents = otherComponents;
      } else if (newQuantity > currentComponents.length) {
        const template = currentComponents[0];
        const toAdd = newQuantity - currentComponents.length;
        const newItems = Array(toAdd).fill(null).map(() => ({
          ...template,
          instanceId: `${template.id}-${Date.now()}-${Math.random()}`,
          x: Math.random() * 500 + 50,
          y: Math.random() * 300 + 50
        }));
        newComponents = [...otherComponents, ...currentComponents, ...newItems];
      } else {
        newComponents = [...otherComponents, ...currentComponents.slice(0, newQuantity)];
      }
      
      addToHistory(newComponents, 'quantity', id);
      return newComponents;
    });
  }, [addToHistory]);


  const handleRemoveItem = useCallback((id: string) => {
    setComponents(prev => {
      const newComponents = prev.filter(comp => comp.id !== id);
      addToHistory(newComponents, 'remove', id);
      return newComponents;
    });
  }, [addToHistory]);

  const handleUndo = useCallback(() => {
    if (currentStep > 0) {
      const previousAction = history[currentStep - 1];
      setCurrentStep(prev => prev - 1);
      setComponents(previousAction.components);
    }
  }, [currentStep, history]);

  const handleRedo = useCallback(() => {
    if (currentStep < history.length - 1) {
      const nextAction = history[currentStep + 1];
      setCurrentStep(prev => prev + 1);
      setComponents(nextAction.components);
    }
  }, [currentStep, history]);

  const handleResetCanvas = useCallback(() => {
    if (components.length > 0) {
      addToHistory([], 'reset');
    }
  }, [addToHistory, components.length]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const budget = {
        total: components.reduce((sum, item) => sum + (item.price || 0), 0),
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
                price: item.price || 0
              } as BudgetItem);
            }
            return map;
          }, new Map<string, BudgetItem>())
        ).map(([_, item]) => item)
      };
  
      // Ensure all components have a rotation value AND a price value
      const componentsWithRotation = components.map(comp => ({
        ...comp,
        rotation: comp.rotation ?? 0.0,
        price: comp.price ?? 0
      })) as SavedCanvasComponent[];
  
      await convex.mutation(api.files.saveCanvasState, {
        fileId: params.fileId as Id<"files">,
        components: componentsWithRotation,
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
  
  return (
    <div>
      <WorkspaceHeader 
        onSave={handleSave} 
        fileName={params.fileId} 
        saving={saving}
      />
      <div className="flex justify-start gap-2 m-2 ml-4">
        <button
          onClick={handleUndo}
          disabled={currentStep <= 0}
          className={`p-2 rounded ${currentStep <= 0 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          title="Undo"
        >
          <Undo2 size={20} />
        </button>
        <button
          onClick={handleRedo}
          disabled={currentStep >= history.length - 1}
          className={`p-2 rounded ${currentStep >= history.length - 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          title="Redo"
        >
          <Redo2 size={20} />
        </button>
        <button
          onClick={handleResetCanvas}
          disabled={components.length === 0}
          className={`p-2 rounded ${components.length === 0 ? 'bg-gray-300' : 'bg-red-500 text-white hover:bg-red-600'}`}
          title="Reset Canvas"
        >
          <RotateCcw size={20} />
        </button>
      </div>
      
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-[1fr_16fr] gap-0">
          <CanvasSidebar 
            onAddElement={handleComponentAdd}
            toggleBudgetCalculator={toggleBudgetCalculator} 
          />
          <Canvas
            fileId={params.fileId as Id<"files">}
            components={components}
            onComponentAdd={handleComponentAdd}
            onComponentDelete={handleComponentDelete}
            onDragStart={(e, src) => setDraggedImage(src)}
            draggedImage={draggedImage}
            onDropComplete={() => setDraggedImage(null)}
          />
          <div
            className={`border-l-2 transition-transform duration-300 ${
              showBudgetCalculator ? "translate-x-0" : "translate-x-full"
            } fixed right-0 top-0 h-full w-60 bg-white shadow-lg z-50`}
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