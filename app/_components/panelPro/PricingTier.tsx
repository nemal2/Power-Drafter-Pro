import React from "react";

interface PricingTierProps {
  name: string;
  features: string[];
  price: number;
  buttonText: string;
  isHighlighted?: boolean;
  savingsText?: string;
}

export function PricingTier({ 
  name, 
  features, 
  price, 
  buttonText, 
  isHighlighted, 
  savingsText 
}: PricingTierProps): JSX.Element {
  return (
    <div className={`flex flex-col items-center pt-14 pb-7 px-7 rounded-3xl ${isHighlighted ? "bg-cyan-800 text-white shadow-2xl" : "bg-white"}`}>
      <h3 className={`text-2xl font-bold ${isHighlighted ? "text-white" : "text-neutral-700"}`}>
        {name}
      </h3>
      <div className="flex flex-col self-stretch mt-6">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2 py-3 pr-5 border-b border-solid border-slate-200">
            <div className="flex-1">{feature}</div>
          </div>
        ))}
      </div>
      <div className={`flex gap-0.5 mt-5 ${isHighlighted ? "text-white" : "text-black"}`}>
        <div className="text-xl">$</div>
        <div className="text-4xl font-semibold">{price}</div>
        <div className="self-end text-sm">/month</div>
      </div>
      {savingsText && (
        <div className="mt-1 text-xs text-center text-cyan-200">{savingsText}</div>
      )}
      <button className={`justify-center items-center px-6 py-3 mt-5 text-base font-medium rounded-xl ${isHighlighted ? "bg-white text-cyan-800" : "bg-cyan-800 text-white"}`}>
        {buttonText}
      </button>
    </div>
  );
}