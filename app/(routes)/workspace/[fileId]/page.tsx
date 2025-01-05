"use client";
import React, { useState } from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import BudgetCalculator from "../_components/BudgetCalculator";
import { useConvex } from "convex/react";
import { FILE } from "../../dashboard/_components/FileList";
import CanvasSidebar from "../_components/CanvasSidebar";
import Canvas from "../_components/Canvas";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LibraryItem } from "../_components/CanvasSidebar/ComponentPanel";
import { LibraryItems } from "../_components/CanvasSidebar/LibraryItems";


interface BudgetItem {
  name: string;
  price: number;
  quantity: number;
  type: string;
}

interface WorkspaceProps {
  params: { fileId: string };
}


const Workspace: React.FC<WorkspaceProps> = ({ params }) => {
  const [components, setComponents] = useState<LibraryItem[]>([]);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  
  const handleComponentAdd = (component: LibraryItem) => {
    setComponents(prev => [...prev, component]);
  };

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>, src: string) => {
    setDraggedImage(src);
  };

  const handleDropComplete = () => {
    setDraggedImage(null);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove all instances of this component
      setComponents(prev => prev.filter(comp => comp.id !== id));
    } else {
      const currentQuantity = components.filter(comp => comp.id === id).length;
      if (newQuantity > currentQuantity) {
        // Add more components
        const componentToAdd = LibraryItems.find(item => item.id === id)!;
        setComponents(prev => [...prev, componentToAdd]);
      } else {
        // Remove one component
        const index = components.findIndex(comp => comp.id === id);
        setComponents(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
  };

  return (
    <div>
      <WorkspaceHeader
        onSave={() => {}}
        fileName={params.fileId || "Untitled"}
      />
      <div className="grid grid-cols-[1fr_15fr_4fr] h-screen">
        <DndProvider backend={HTML5Backend}>
          <CanvasSidebar onAddElement={handleComponentAdd} />
          <Canvas
            onComponentAdd={handleComponentAdd}
            onDragStart={handleDragStart}
            draggedImage={draggedImage}
            onDropComplete={handleDropComplete}
          />
          <div className="bg-custom-beige border-l-2 border-custom-teal">
            <BudgetCalculator
              items={components}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </DndProvider>
      </div>
    </div>
  );
};

export default Workspace;