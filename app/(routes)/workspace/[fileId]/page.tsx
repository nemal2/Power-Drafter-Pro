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


interface BudgetItem {
  name: string;
  price: number;
  quantity: number;
  type: string;
}

function Workspace({ params }: { params: { fileId: string } }) {
  const [triggerSave, setTriggerSave] = useState(false);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [fileData, setFileData] = useState<FILE | null>(null);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const convex = useConvex();

  // Add budget item to the list
  const handleComponentAdd = (component: BudgetItem) => {
    setBudgetItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.name === component.name
      );
      if (existingIndex !== -1) {
        const updatedItems = [...prev];
        updatedItems[existingIndex].quantity += 1;
        return updatedItems;
      }
      return [...prev, { ...component, quantity: 1 }];
    });
  };

  // Handle drag start from the sidebar
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>, src: string) => {
    setDraggedImage(src);
  };

  // Handle drop event on the canvas to clear dragged image after dropping
  const handleDropComplete = () => {
    setDraggedImage(null);
  };

  return (
    <div>
      <WorkspaceHeader
        onSave={() => setTriggerSave(true)}
        fileName={fileData?.fileName || "Untitled"}
      />
      <div className="grid grid-cols-[1fr_15fr_4fr] h-screen">
        {/* Sidebar */}
        <div>
        <DndProvider backend={HTML5Backend}>
          <CanvasSidebar onAddElement={handleComponentAdd} />
        </DndProvider>
        </div>

        {/* Canvas */}
        <DndProvider backend={HTML5Backend}>

        <Canvas
          onDragStart={handleDragStart}
          draggedImage={draggedImage}
          onDropComplete={handleDropComplete}
        />
        </DndProvider>

        {/* Budget Calculator */}
        <div className="bg-custom-beige border-l-2 border-custom-teal">
          <BudgetCalculator items={budgetItems} setItems={setBudgetItems} />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
