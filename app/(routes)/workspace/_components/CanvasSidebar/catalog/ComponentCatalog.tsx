"use client";

import React, { useState } from "react";
import { Package, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { categories, initialComponents } from "./data/componentData";
import CategorySidebar from "./CategorySidebar";
import ComponentList from "./ComponentList";

interface ComponentCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (component: any) => void;
}

const ComponentCatalog: React.FC<ComponentCatalogProps> = ({ isOpen, onClose, onSelectComponent }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [components, setComponents] = useState(initialComponents);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              <span>Component Catalog</span>
            </div>
            <button className="p-2 mr-5 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 p-4">
          <CategorySidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          <ComponentList 
            activeCategory={activeCategory} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            components={components} 
            onSelectComponent={onSelectComponent} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentCatalog;
