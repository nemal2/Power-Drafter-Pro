import React, { useState } from 'react';
import { Pin, X, Trash2 } from 'lucide-react';
import { LibraryItem } from './CanvasSidebar/ComponentPanel';

interface Component {
  name: string;
  price: number;
  quantity: number;
}

interface BudgetCalculatorProps {
  items: LibraryItem[];
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onRemoveItem?: (id: string) => void;
}

const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem
}) => {
  // Calculate quantities for each unique item
  const itemCounts = items.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Create unique items list with quantities
  const uniqueItems = Object.entries(itemCounts).map(([id, quantity]) => {
    const item = items.find(i => i.id === id)!;
    return {
      ...item,
      quantity,
      totalPrice: item.price * quantity
    };
  });

  const total = uniqueItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="bg-[#f5f5dc] p-6 max-w-md mx-auto min-h-[90vh] flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          <Pin />
          <span>Components List</span>
          <X />
        </h2>
        <ul className="space-y-4">
          {uniqueItems.map((item) => (
            <li key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
              <div className="flex-1">
                <p className="font-medium text-gray-700">{item.name}</p>
                <div className="flex items-center mt-1">
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="mx-2">Qty: {item.quantity}</span>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-900 font-semibold">
                  LKR {item.totalPrice.toLocaleString()}
                </span>
                <button 
                  onClick={() => onRemoveItem?.(item.id)}
                  className="text-red-500 hover:text-red-700 mt-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <strong className="text-lg">Total</strong>
          <span className="text-lg font-semibold">LKR {total.toLocaleString()}</span>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Get Quotation
        </button>
      </div>
    </div>
  );
};

export default BudgetCalculator;