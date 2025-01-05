import React, { useState } from "react";
import { LayoutGrid, Cpu, FolderPlus, Text, Package } from "lucide-react";
import { LibraryItems, LibraryItemComponent, LibraryItem } from "./LibraryItems";

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

      {/* Render components for the active panel */}
      <div className="flex-1 p-4 bg-gray-100">
        {activePanel === "components" && (
          <div className="grid grid-cols-3 gap-4 w-60">
            {LibraryItems.map((item) => (
              <LibraryItemComponent
                key={item.id}
                item={item}
                onClick={() => onAddElement(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CanvasSidebar;
