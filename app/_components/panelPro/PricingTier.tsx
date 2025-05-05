import React from 'react';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export const PricingTier: React.FC<PricingTierProps> = ({ 
  name, 
  price, 
  description, 
  features, 
  isPopular = false 
}) => {
  return (
    <div className={`flex flex-col p-5 md:p-6 lg:p-8 w-full rounded-xl shadow-md ${
      isPopular ? 'bg-gradient-to-b from-[#7cbbA8] to-[#b5d5c0] text-white' : 'bg-white text-black'
    }`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold">{name}</h3>
          {isPopular && (
            <span className="px-2 py-0.5 md:px-3 md:py-1 text-xs font-medium bg-white text-cyan-800 rounded-full">
              Popular
            </span>
          )}
        </div>
        <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">{price}</div>
        <p className="text-xs md:text-sm lg:text-base mb-4 md:mb-6 opacity-80">{description}</p>
      </div>
      
      <ul className="flex flex-col gap-2 md:gap-3 mb-6 md:mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-xs md:text-sm lg:text-base">
            <svg 
              className={`w-4 h-4 md:w-5 md:h-5 ${isPopular ? 'text-white' : 'text-cyan-800'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <button className={`mt-auto py-2 md:py-3 px-4 md:px-6 rounded-[50px] text-sm md:text-base font-medium transition-all duration-300 ${
        isPopular 
          ? 'bg-white text-cyan-800 hover:bg-gray-100 hover:shadow-lg' 
          : 'bg-cyan-800 text-white hover:bg-cyan-700 hover:shadow-lg'
      }`}>
        Get Started
      </button>
    </div>
  );
};
