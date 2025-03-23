"use client";

import React, { useState } from "react";
import { Search, Edit, Trash, ChevronDown, ChevronUp } from "lucide-react";
import ComponentItem from "./ComponentItem";



interface Component {
    id: string;
    name: string;
    svg: string;
    price: number;
    description: string;
    specs: Record<string, string[]>;
  }

  
  type ComponentCategory = Record<string, Component[]>; // Categories mapped to arrays of components
  
  interface ComponentListProps {
    activeCategory: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    components: ComponentCategory;
    onSelectComponent: (component: Component) => void;
  }

const ComponentList: React.FC<ComponentListProps> = ({ activeCategory, searchQuery, setSearchQuery, components, onSelectComponent }) => {
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});

  const toggleSpecs = (componentId: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [componentId]: !prev[componentId],
    }));
  };

  const filteredComponents = Object.entries(components).flatMap(([category, items]) => {
    if (activeCategory !== "all" && activeCategory !== category) return [];
  
    return (items as Component[]).filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  

  return (
    <div className="flex-1 flex flex-col min-h-0">
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

      <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-4">
        {filteredComponents.map(component => (
          <ComponentItem key={component.id} component={component} toggleSpecs={toggleSpecs} expandedSpecs={expandedSpecs} onSelectComponent={onSelectComponent} />
        ))}
      </div>
    </div>
  );
};

export default ComponentList;
