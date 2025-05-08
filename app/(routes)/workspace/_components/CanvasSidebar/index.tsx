import React, { useState, useEffect } from "react";
import { LayoutGrid, Cpu, FolderPlus, Text, Package, List, KeyRound, Trash2, X } from "lucide-react";
import { LibraryItems as DefaultLibraryItems, LibraryItem, LibraryItemComponent } from "./LibraryItems";
import ComponentCatalog from "./Catalog";
import AdminPrivileges from "./AdminPrivileges";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Create a local storage key for components
const CUSTOM_COMPONENTS_STORAGE_KEY = "powerdrafter_custom_components";

// Simple custom dialog component to replace AlertDialog
const SimpleDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  description 
}: { 
  open: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  description: string;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-500">{description}</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

function CanvasSidebar({
  onAddElement,
  toggleBudgetCalculator,
}: {
  onAddElement: (element: LibraryItem) => void;
  toggleBudgetCalculator: () => void;
}) {
  const [activePanel, setActivePanel] = useState<string | null>("components");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Initialize with default items plus any stored custom items
  const [sidebarItems, setSidebarItems] = useState<LibraryItem[]>([]);

  // Load components from storage on initial render
  useEffect(() => {
    // Load default items
    const defaultItems = [...DefaultLibraryItems];
    
    // Try to load custom components from localStorage
    try {
      const storedComponents = localStorage.getItem(CUSTOM_COMPONENTS_STORAGE_KEY);
      if (storedComponents) {
        const parsedComponents = JSON.parse(storedComponents);
        // Combine default and custom components
        setSidebarItems([...defaultItems, ...parsedComponents]);
      } else {
        setSidebarItems(defaultItems);
      }
    } catch (error) {
      console.error("Error loading custom components:", error);
      setSidebarItems(defaultItems);
    }
  }, []);

  const togglePanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  // This function handles components selected from the catalog
  const handleComponentSelect = (component: LibraryItem) => {
    // Add the selected component to the sidebar items
    setSidebarItems(prev => {
      // Check if component already exists in sidebar to avoid duplicates
      const exists = prev.some(item => item.id === component.id);
      if (exists) return prev;
      
      // Ensure the component has all required specs
      const completeComponent = {
        ...component,
        specs: {
          power: component.specs?.power || ["default"],
          resistance: component.specs?.resistance || ["default"],
          tolerance: component.specs?.tolerance || ["default"],
          ...component.specs
        }
      };
      
      return [...prev, completeComponent];
    });
  };

  // This function handles new components added from the admin panel
  const handleNewComponent = (componentData: any) => {
    // Create a properly formatted component object with required specs
    const newComponent: LibraryItem = {
      id: `custom-${Date.now()}`,
      name: componentData.name,
      description: componentData.description || "",
      svg: componentData.imageUrl || "/components/default.png", // Use the uploaded image URL
      price: componentData.price,
      specs: {
        power: componentData.specs?.power || ["default"],
        resistance: componentData.specs?.resistance || ["default"],
        tolerance: componentData.specs?.tolerance || ["default"],
        ...componentData.specs
      },
      width: componentData.width,
      height: componentData.height
    };

    // Add to sidebar items
    setSidebarItems(prev => {
      const newItems = [...prev, newComponent];
      
      // Save to localStorage
      try {
        // Only save custom components, not default ones
        const customComponents = newItems.filter(
          item => !DefaultLibraryItems.some(defaultItem => defaultItem.id === item.id)
        );
        localStorage.setItem(CUSTOM_COMPONENTS_STORAGE_KEY, JSON.stringify(customComponents));
      } catch (error) {
        console.error("Error saving custom components:", error);
      }
      
      return newItems;
    });
  };

  // This function is passed to CatalogAdmin
  const handleSaveComponent = (componentData: any) => {
    handleNewComponent(componentData);
    return true; // Indicate success
  };

  // Handle deleting a component from the sidebar
  const handleDeleteComponent = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteDialogOpen(true);
  };

  // Confirm component deletion
  const confirmDelete = () => {
    if (itemToDelete) {
      // Remove the component from the sidebar items
      setSidebarItems(prev => {
        const newItems = prev.filter(item => item.id !== itemToDelete);
        
        // Update localStorage
        try {
          // Only save custom components, not default ones
          const customComponents = newItems.filter(
            item => !DefaultLibraryItems.some(defaultItem => defaultItem.id === item.id)
          );
          localStorage.setItem(CUSTOM_COMPONENTS_STORAGE_KEY, JSON.stringify(customComponents));
        } catch (error) {
          console.error("Error saving custom components:", error);
        }
        
        return newItems;
      });
    }
    
    // Reset the item to delete
    setItemToDelete(null);
  };

  return (
    <div className="flex h-full">
      {/* Main Sidebar */}
      <div className="flex flex-col space-y-8 text-gray-500 items-center p-4 bg-white border-r">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Text
                className="text-2xl cursor-pointer hover:text-gray-700"
                onClick={() => togglePanel("text")}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Text Tools</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <LayoutGrid
                className="text-2xl cursor-pointer hover:text-gray-700"
                onClick={() => togglePanel("grid")}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Layout Grid</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Package
                className="text-2xl cursor-pointer hover:text-gray-700"
                onClick={() => togglePanel("components")}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Components</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <FolderPlus
                className="text-2xl cursor-pointer hover:text-gray-700"
                onClick={() => setIsCatalogOpen(true)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Components</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Cpu
                className="text-2xl cursor-pointer hover:text-gray-700"
                onClick={() => togglePanel("cpu")}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>System Components</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <List
                className="text-2xl cursor-pointer hover:text-gray-700"
                onClick={toggleBudgetCalculator}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Budget Calculator</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <KeyRound
                className="text-2xl cursor-pointer hover:text-gray-700 mt-56"
                onClick={() => setIsAdminOpen(true)} 
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Admin Privileges</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Sidebar Component Panel */}
      <div className="border-r shadow bg-slate-50 radius">
        {activePanel === "components" && (
          <div className="grid grid-cols-2 gap-4 w-60 p-2">
            {sidebarItems.map((item) => (
              <LibraryItemComponent
                key={item.id}
                item={item}
                onClick={() => onAddElement({
                  ...item,
                  // Ensure properties needed for drag and drop are set
                  instanceId: `${item.id}-${Date.now()}`,
                  x: 100,
                  y: 100,
                  // Pass width and height if available, or use defaults
                  width: item.width || 100,
                  height: item.height || 100
                })}
                onDelete={handleDeleteComponent}
                allowDelete={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Component Catalog Modal */}
      <ComponentCatalog
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectComponent={handleComponentSelect}
      />

      {/* Admin Privileges Dialog */}
      <AdminPrivileges 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onComponentSave={handleNewComponent}
      />

      {/* Custom Delete Confirmation Dialog */}
      <SimpleDialog 
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Component"
        description="Are you sure you want to delete this component? This action cannot be undone."
      />
    </div>
  );
}

export default CanvasSidebar;