import React from 'react';
import { Pin, X } from 'lucide-react';

function BudgetCalculator() {
  const components = [
    { name: 'Single-Pole Breaker', price: 3650, quantity: 1 },
    { name: 'Single-Pole Switch', price: 2920, quantity: 1 },
    { name: 'Medium Panel Board', price: 21200, quantity: 1 },
    { name: 'Single-Pole Breaker', price: 3650, quantity: 1 },
    { name: 'Single-Pole Breaker', price: 3650, quantity: 1 },
    { name: 'Single-Pole Breaker', price: 3650, quantity: 1 },
    { name: 'Single-Pole Breaker', price: 3650, quantity: 1 },
  ];

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
            <li key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700">{item.name}</p>
                <p className="text-sm text-gray-500">LKR{item.price} x Qty: {item.quantity}</p>
              </div>
              <span className="text-gray-900 font-semibold">LKR {item.price.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className=" bottom-0 left-0 w-full bg-[#f5f5dc] p-6 border-t flex justify-between items-center">
        <strong className="text-lg">Total</strong>
        <span className="text-lg font-semibold">LKR {total.toLocaleString()}</span>
      </div>
      <div className='text-center text-custom-teal border-2 rounded-lg border-custom-teal'>
          Get Quotation
        </div>
    </div>
  );
}

export default BudgetCalculator;
