import React, { useState } from "react";
import { LayoutGrid, Cpu, FolderPlus, Text, Package } from "lucide-react";
import ComponentPanel, { LibraryItem } from "./ComponentPanel";
import { LibraryItems } from "./LibraryItems";

function CanvasSidebar({
  onAddElement,
}: {
  onAddElement: (element: LibraryItem) => void;
}) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const togglePanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  return (
    <div className="flex h-full">
      {/* Main Sidebar */}
      <div className="flex flex-col space-y-8 text-gray-500 items-center p-4 bg-white border-r">
        <Text
          className="text-2xl cursor-pointer hover:text-gray-700"
          onClick={() => togglePanel("text")}
        />
        <LayoutGrid
          className="text-2xl cursor-pointer hover:text-gray-700"
          onClick={() => togglePanel("grid")}
        />
        <Package
          className="text-2xl cursor-pointer hover:text-gray-700"
          onClick={() => togglePanel("components")}
        />
        <Cpu
          className="text-2xl cursor-pointer hover:text-gray-700"
          onClick={() => togglePanel("cpu")}
        />
        <FolderPlus
          className="text-2xl cursor-pointer hover:text-gray-700"
          onClick={() => togglePanel("folder")}
        />
      </div>

      {/* Component Panel */}
      {activePanel === "components" && (
        <ComponentPanel
          items={LibraryItems}
          onSelectComponent={onAddElement}
        />
      )}
    </div>
  );
}

export default CanvasSidebar;
