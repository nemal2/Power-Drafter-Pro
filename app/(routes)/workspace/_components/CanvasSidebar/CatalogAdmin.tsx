import React, { useState, useEffect } from 'react';
import { X, Search, Package, ChevronDown, ChevronUp, Edit, Trash, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { categories, components } from './componentsList';
import AddComponentDialog, { ComponentFormData } from './AddComponentDialog';

interface LibraryItem {
  id: string;
  name: string;
  description: string;
  svg: string;
  price: number;
  specs: Record<string, string[]>;
  selectedSpecs?: Record<string, string>;
  width?: number;
  height?: number;
}

interface CatalogAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (component: LibraryItem) => void;
  onSaveComponent?: (componentData: any) => void;
}

const CatalogAdmin: React.FC<CatalogAdminProps> = ({ 
  isOpen, 
  onClose, 
  onSelectComponent,
  onSaveComponent 
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, Record<string, string>>>({});
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  
  // State to keep track of custom components
  const [customComponents, setCustomComponents] = useState<ComponentFormData[]>([]);

  // Load custom components on initial render if they exist in localStorage
  useEffect(() => {
    try {
      const storedComponents = localStorage.getItem('catalog_custom_components');
      if (storedComponents) {
        setCustomComponents(JSON.parse(storedComponents));
      }
    } catch (error) {
      console.error("Error loading custom components:", error);
    }
  }, []);

  const hasPermission = (permission: string) => {
    return true; // Allow all actions for all users
  };

  const handleDelete = (componentId: string) => {
    // Remove the component from customComponents
    const updatedComponents = customComponents.filter(comp => comp.name !== componentId);
    setCustomComponents(updatedComponents);
    
    // Update localStorage
    localStorage.setItem('catalog_custom_components', JSON.stringify(updatedComponents));
    
    alert(`Component "${componentId}" has been deleted!`);
  };

  const handleEdit = (component: any) => {
    // TODO: Implement edit functionality
    alert('Edit Component functionality coming soon!');
  };

  const handleAddComponent = () => {
    setIsAddComponentOpen(true);
  };

  const handleSaveComponent = (componentData: ComponentFormData) => {
    // Add to local state
    setCustomComponents(prev => {
      const updated = [...prev, componentData];
      // Save to localStorage
      localStorage.setItem('catalog_custom_components', JSON.stringify(updated));
      return updated;
    });
    
    // If parent provided onSaveComponent handler, call it
    if (onSaveComponent) {
      onSaveComponent(componentData);
    }
    
    // Close the dialog
    setIsAddComponentOpen(false);
  };

  const handleSpecSelect = (componentId: string, specType: string, value: string) => {
    setSelectedSpecs((prev) => ({
      ...prev,
      [componentId]: {
        ...(prev[componentId] || {}),
        [specType]: value,
      },
    }));
  };

  const handleAddToSidebar = (component: any) => {
    const specs = selectedSpecs[component.id];
    const updatedPrice = calculatePrice(component, specs);

    // Create a complete component object to pass to the sidebar
    // Ensure we're passing only the fields expected by the backend schema
    const completeComponent = {
      id: component.id,
      name: component.name,
      description: component.description || "",
      svg: component.svg,
      price: updatedPrice,
      selectedSpecs: specs,
      specs: component.specs || {},
      // Include width and height but they won't be sent to backend during save
      width: component.width || 100,
      height: component.height || 100
    };

    onSelectComponent(completeComponent);
    
    // Show confirmation
    alert(`Component "${component.name}" added to sidebar!`);
  };

  const calculatePrice = (component: any, specs: any) => {
    let basePrice = component.price;
    if (specs?.power?.includes('1W')) basePrice *= 1.5;
    if (specs?.tolerance?.includes('±1%')) basePrice *= 1.2;
    return basePrice;
  };

  // Combine built-in components and custom components
  const allComponents = [...Object.entries(components).flatMap(([category, items]) => {
    if (activeCategory !== 'all' && activeCategory !== category) return [];
    return items;
  })];

  // Add custom components if they match the active category or if viewing all
  if (customComponents.length > 0) {
    customComponents.forEach(comp => {
      if (activeCategory === 'all' || activeCategory === comp.category) {
        allComponents.push({
          id: comp.name, // Using name as ID for now
          name: comp.name,
          description: comp.description,
          svg: comp.imageUrl,
          price: comp.price,
          specs: comp.specs || {},
          width: comp.width,
          height: comp.height
        });
      }
    });
  }

  // Filter components based on search query
  const filteredComponents = allComponents.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSpecs = (componentId: string) => {
    setExpandedSpecs((prev) => ({
      ...prev,
      [componentId]: !prev[componentId],
    }));
  };

  // In CatalogAdmin.tsx, update the return statement
return (
  <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              <span>Component Catalog</span>
            </div>
            {/* Allow Add button for all users */}
            <button
              onClick={handleAddComponent}
              className="p-2 mr-5 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 p-4 h-[calc(80vh-130px)]">
          {/* Categories sidebar */}
          <div className="w-48 space-y-2 overflow-y-auto border-r pr-2">
            <button
              key="all"
              onClick={() => setActiveCategory('all')}
              className={`w-full text-left px-4 py-2 rounded ${activeCategory === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              All Categories
            </button>
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`w-full text-left px-4 py-2 rounded ${activeCategory === key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Main content - Made scrollable */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Search bar */}
            <div className="mb-4 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            {/* Components grid - Properly configured scrollable container */}
            <div className="overflow-y-auto flex-1 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((component) => (
                    <div key={component.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                      {/* Component header */}
                      <div className="flex items-start gap-4">
                        <img src={component.svg} alt={component.name} className="w-16 h-16 object-contain" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{component.name}</h3>
                          <p className="text-sm text-gray-600">{component.description || "No description"}</p>
                          <p className="text-sm font-semibold mt-1">Base Price: LKR {component.price.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(component)} className="text-yellow-600 hover:text-yellow-700">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(component.name)} className="text-red-600 hover:text-red-800">
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Specifications toggle */}
                      <button
                        onClick={() => toggleSpecs(component.id)}
                        className="w-full mt-2 flex items-center justify-between text-sm text-blue-600 hover:text-blue-700"
                      >
                        {expandedSpecs[component.id] ? (
                          <>
                            <span>Hide specifications</span>
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Show specifications</span>
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Specifications selection */}
                      {expandedSpecs[component.id] && (
                        <div className="mt-2 space-y-2">
                          {component.specs && Object.entries(component.specs).map(([key, values]) => (
                            <div key={key} className="space-y-1">
                              <label className="text-sm font-medium capitalize">{key}:</label>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(values) && values.map((value: string) => (
                                  <button
                                    key={value}
                                    onClick={() => handleSpecSelect(component.id, key, value)}
                                    className={`px-3 py-1 text-sm rounded-full ${selectedSpecs[component.id]?.[key] === value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-blue-50'}`}
                                  >
                                    {value}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          {/* Add to Sidebar button */}
                          <button
                            onClick={() => handleAddToSidebar(component)}
                            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Add to Sidebar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    No components found. Try a different search or category.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Add Component Dialog */}
    {isAddComponentOpen && (
      <AddComponentDialog
        isOpen={isAddComponentOpen}
        onClose={() => setIsAddComponentOpen(false)}
        onSave={handleSaveComponent}
      />
    )}
  </>
);
};

export default CatalogAdmin;