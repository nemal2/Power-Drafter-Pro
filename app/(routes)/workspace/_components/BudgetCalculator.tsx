// components/BudgetCalculator.tsx
import React, { useState, useEffect } from 'react';
import { Pin, X, Trash2 } from 'lucide-react';

interface Component {
  name: string;
  price: number;
  quantity: number;
}

interface BudgetCalculatorProps {
  onDeleteComponent?: (index: number) => void;
}

function BudgetCalculator({ onDeleteComponent }: BudgetCalculatorProps) {
  const [components, setComponents] = useState<Component[]>([]);

  const addComponent = (component: Component) => {
    setComponents(prev => {
      // Check if component already exists
      const existingIndex = prev.findIndex(c => c.name === component.name);
      if (existingIndex >= 0) {
        // Update quantity of existing component
        const updated = [...prev];
        updated[existingIndex].quantity += component.quantity;
        return updated;
      }
      // Add new component
      return [...prev, component];
    });
  };

  const removeComponent = (index: number) => {
    setComponents(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    onDeleteComponent?.(index);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    setComponents(prev => {
      const updated = [...prev];
      updated[index].quantity = Math.max(1, newQuantity);
      return updated;
    });
  };

  const total = components.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-[#f5f5dc] p-6 max-w-md mx-auto min-h-[90vh] flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          <Pin />
          <span>Components</span>
          <X />
        </h2>
        <ul className="space-y-4">
          {components.map((item, index) => (
            <li key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
              <div className="flex-1">
                <p className="font-medium text-gray-700">{item.name}</p>
                <div className="flex items-center mt-1">
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="mx-2">Qty: {item.quantity}</span>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-900 font-semibold">
                  LKR {(item.price * item.quantity).toLocaleString()}
                </span>
                <button 
                  onClick={() => removeComponent(index)}
                  className="text-red-500 hover:text-red-700 mt-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="bottom-0 left-0 w-full bg-[#f5f5dc] p-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <strong className="text-lg">Total</strong>
          <span className="text-lg font-semibold">LKR {total.toLocaleString()}</span>
        </div>
        <button className="w-full text-center text-custom-teal border-2 rounded-lg border-custom-teal p-2 hover:bg-custom-teal hover:text-white transition-colors">
          Get Quotation
        </button>
      </div>
    </div>
  );
}

export default BudgetCalculator;