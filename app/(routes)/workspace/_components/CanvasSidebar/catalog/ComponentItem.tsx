"use client";

import React from "react";
import { Edit, Trash, ChevronDown, ChevronUp } from "lucide-react";

interface ComponentItemProps {
  component: any;
  toggleSpecs: (componentId: string) => void;
  expandedSpecs: Record<string, boolean>;
  onSelectComponent: (component: any) => void;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ component, toggleSpecs, expandedSpecs, onSelectComponent }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img src={component.svg} alt={component.name} className="w-16 h-16 object-contain" />

        <div className="flex-1">
          <h3 className="font-semibold text-lg">{component.name}</h3>
          <p className="text-sm text-gray-600">{component.description}</p>
          <p className="text-sm font-semibold mt-1">Base Price: LKR {component.price.toFixed(2)}</p>
        </div>

        <div className="flex gap-2">
          <button className="text-yellow-600 hover:text-yellow-700"><Edit className="w-5 h-5" /></button>
          <button className="text-red-600 hover:text-red-800"><Trash className="w-5 h-5" /></button>
        </div>
      </div>

      <button onClick={() => toggleSpecs(component.id)} className="w-full mt-2 flex items-center justify-between text-sm text-blue-600 hover:text-blue-700">
        {expandedSpecs[component.id] ? <><span>Hide specifications</span><ChevronUp className="w-4 h-4" /></> : <><span>Show specifications</span><ChevronDown className="w-4 h-4" /></>}
      </button>
    </div>
  );
};

export default ComponentItem;
