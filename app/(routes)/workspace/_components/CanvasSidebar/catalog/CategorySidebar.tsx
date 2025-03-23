"use client";

import React from "react";
import { categories } from "./data/componentData";

interface CategorySidebarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="w-48 space-y-2">
      {Object.entries(categories).map(([key, label]) => (
        <button
          key={key}
          onClick={() => setActiveCategory(key)}
          className={`w-full text-left px-4 py-2 rounded ${
            activeCategory === key ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default CategorySidebar;
