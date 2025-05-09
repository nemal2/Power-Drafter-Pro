import React from "react";
import { useDrag } from "react-dnd";
import { Trash2 } from "lucide-react";

export interface LibraryItem {
  id: string;
  name: string;
  svg: string;
  price: number;
  description?: string;
  specs?: Record<string, string[]>;
  selectedSpecs?: Record<string, string>;
  width?: number;
  height?: number;
  instanceId?: string;
  x?: number;
  y?: number;
  rotation?: number;
}

// Default library items that always show in the sidebar
// Added the required specs field with power, resistance, and tolerance arrays
export const LibraryItems: LibraryItem[] = [
  {
    id: "1",
    name: "Breaker",
    svg: "/components/22.png",
    price: 50.00,
    width: 100,
    height: 100,
    specs: {
      power: ["default"],
      resistance: ["default"],
      tolerance: ["default"]
    }
  },
  {
    id: "2",
    name: "Breaker2",
    svg: "/components/223.png",
    price: 75.00,
    width: 120,
    height: 120,
    specs: {
      power: ["default"],
      resistance: ["default"],
      tolerance: ["default"]
    }
  },
  {
    id: "3",
    name: "Breaker4",
    svg: "/components/switch disconnector-4.png",
    price: 120.00,
    width: 150,
    height: 150,
    specs: {
      power: ["default"],
      resistance: ["default"],
      tolerance: ["default"]
    }
  },
  {
    id: "4",
    name: "OVR T2",
    svg: "/components/OVR.png",
    price: 200.00,
    width: 70,
    height: 80,
    specs: {
      power: ["default"],
      resistance: ["default"],
      tolerance: ["default"]
    }
  }
   
];

export const LibraryItemComponent: React.FC<{
  item: LibraryItem;
  onClick?: (item: LibraryItem) => void;
  onDelete?: (itemId: string) => void;
  allowDelete?: boolean;
}> = ({ item, onClick, onDelete, allowDelete = true }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "libraryItem",
    item: { ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Check if this is a default library item
  const isDefaultItem = LibraryItems.some(defaultItem => defaultItem.id === item.id);

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the onClick of the parent div
    if (onDelete) {
      onDelete(item.id);
    }
  };

  return (
    <div
      ref={drag}
      className={`cursor-pointer p-3 border rounded bg-white shadow text-center relative ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onClick?.(item)}
    >
      <img 
        src={item.svg} 
        alt={item.name} 
        className="w-12 h-12 mx-auto" 
      />
      <p className="text-sm mt-2">{item.name}</p>
      <p className="text-xs text-gray-600">LKR {item.price}</p>
      
      {/* Delete button - only show for custom items if allowDelete is true */}
      {allowDelete && !isDefaultItem && (
        <button 
          className="absolute top-1 right-1 text-red-500 hover:text-red-700 p-1"
          onClick={handleDelete}
          title="Delete component"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};