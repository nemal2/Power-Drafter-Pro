import React, { useState, useEffect } from 'react';
import { X, Search, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { categories } from './AddComponentDialog';
import { LibraryItem } from './LibraryItems';

interface ComponentCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (component: LibraryItem) => void;
}

// Define initial built-in components based on categories
const initialComponents = {
  passive: [
    {
      id: '1',
      name: 'Resistor',
      svg: '/components/a1.png',
      price: 50.00,
      specs: {
        resistance: ['10Ω', '100Ω', '1kΩ', '10kΩ'],
        power: ['1/4W', '1/2W', '1W'],
        tolerance: ['±1%', '±5%']
        
      },
      description: 'Standard through-hole resistor for general-purpose applications'
    },
    {
      id: '2',
      name: 'Resistor2',
      svg: '/components/a1.png',
      price: 500.00,
      specs: {
        resistance: ['10Ω', '100Ω', '1kΩ', '10kΩ'],
        power: ['1/4W', '1/2W', '1W'],
        tolerance: ['±1%', '±5%']
        
      },
      description: 'Standard through hole resistor for general-purpose applications'
    },
    // ... other passive components
  ],
  active: [
    // ... active components
  ],
  protection: [
    // ... protection components
  ]
};

const ComponentCatalog: React.FC<ComponentCatalogProps> = ({ isOpen, onClose, onSelectComponent }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, Record<string, string>>>({});
  const [customComponents, setCustomComponents] = useState<any[]>([]);

  // Load custom components when the component mounts or when isOpen changes
  useEffect(() => {
    if (isOpen) {
      try {
        const storedComponents = localStorage.getItem('catalog_custom_components');
        if (storedComponents) {
          setCustomComponents(JSON.parse(storedComponents));
        } else {
          setCustomComponents([]);
        }
      } catch (error) {
        console.error("Error loading custom components:", error);
        setCustomComponents([]);
      }
    }
  }, [isOpen]);

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

    onSelectComponent({
      ...component,
      selectedSpecs: specs,
      price: updatedPrice,
      width: component.width || 100,
      height: component.height || 100
    });
    
    onClose(); // Close the catalog after adding component
  };

  const calculatePrice = (component: any, specs: any) => {
    if (!specs) return component.price;
    
    let basePrice = component.price;
    
    // Apply adjustments based on selected specs
    // This is simplified - in a real app you'd have more complex price calculations
    Object.entries(specs).forEach(([key, value]) => {
      if (key === 'power' && value === '1W') basePrice *= 1.5;
      if (key === 'tolerance' && value === '±1%') basePrice *= 1.2;
      if (key === 'current' && value === '20A') basePrice *= 1.3;
      if (key === 'poles' && value === '3P') basePrice *= 1.5;
    });
    
    return basePrice;
  };

  // Combine built-in components and custom components
  const allComponents = [
    // Add built-in components from the appropriate category or all categories
    ...Object.entries(initialComponents).flatMap(([category, items]) => {
      if (activeCategory !== 'all' && activeCategory !== category) return [];
      return items;
    })
  ];

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
          width: comp.width || 100,
          height: comp.height || 100
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              <span>Component Catalog</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 p-4 h-[calc(80vh-120px)]">
          {/* Categories sidebar */}
          <div className="w-48 space-y-2 overflow-y-auto">
            <button
              key="all"
              onClick={() => setActiveCategory('all')}
              className={`w-full text-left px-4 py-2 rounded ${
                activeCategory === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              All Categories
            </button>
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeCategory === key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-0">
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

            {/* Components grid - with proper scrolling */}
            <div className="overflow-y-auto pr-2 flex-1">
              <div className="grid grid-cols-2 gap-4 pb-4">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((component) => (
                    <div
                      key={component.id}
                      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Component header */}
                      <div className="flex items-start gap-4">
                        <img
                          src={component.svg}
                          alt={component.name}
                          className="w-16 h-16 object-contain"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{component.name}</h3>
                          <p className="text-sm text-gray-600">{component.description}</p>
                          <p className="text-sm font-semibold mt-1">
                            Base Price: LKR {component.price.toFixed(2)}
                          </p>
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
                                {Array.isArray(values) && values.map((value) => (
                                  <button
                                    key={value}
                                    onClick={() => handleSpecSelect(component.id, key, value)}
                                    className={`px-3 py-1 text-sm rounded-full ${
                                      selectedSpecs[component.id]?.[key] === value
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 hover:bg-blue-50'
                                    }`}
                                  >
                                    {value}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
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
  );
};

export default ComponentCatalog;