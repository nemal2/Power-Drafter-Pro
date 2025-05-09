import React, { useEffect, useState, useRef } from 'react';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isHighlighted?: boolean;
  savingsText?: string;
  isFlipping?: boolean;
  isAnnual?: boolean;
}

export const PricingTier: React.FC<PricingTierProps> = ({ 
  name, 
  price, 
  description, 
  features, 
  buttonText,
  isHighlighted = false,
  savingsText,
  isFlipping = false,
  isAnnual = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Optimize animation by using requestAnimationFrame
  useEffect(() => {
    if (isFlipping) {
      // Add will-change property before animation starts
      if (cardRef.current) {
        cardRef.current.style.willChange = 'transform';
      }
      
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        setIsFlipped(!isFlipped);
        
        // Clean up will-change after animation completes
        const cleanupTimer = setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.willChange = 'auto';
          }
        }, 600); // Match this to the CSS transition duration
        
        return () => clearTimeout(cleanupTimer);
      });
    }
  }, [isFlipping, isFlipped]);

  // Directly sync with isAnnual when not in a flipping state
  useEffect(() => {
    if (!isFlipping) {
      setIsFlipped(isAnnual);
    }
  }, [isAnnual, isFlipping]);

  // Create a card face component to avoid repetition
  const CardFace = ({ isBackFace = false }: { isBackFace?: boolean }) => (
    <div 
      className={`${isBackFace ? 'absolute top-0 left-0 rotate-y-180' : ''} 
        flex flex-col p-4 sm:p-5 md:p-6 lg:p-7 w-full h-full rounded-xl shadow-md backface-hidden
        ${isHighlighted ? 'bg-gradient-to-b from-[#7cbbA8] to-[#b5d5c0] text-white' : 'bg-white text-black'}`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <h3 className="text-lg md:text-xl font-bold">{name}</h3>
          {isHighlighted && (
            <span className="px-1 py-0.5 sm:px-2 text-xs font-medium bg-white text-cyan-800 rounded-full">
              Popular
            </span>
          )}
        </div>
        <div className="text-xl md:text-2xl font-bold mb-1">{price}</div>
        {savingsText && (
          <span className="text-xs font-medium bg-white text-cyan-800 px-2 py-0.5 rounded-full self-start mb-1">
            {savingsText}
          </span>
        )}
        <p className="text-xs md:text-sm mb-3 opacity-80">{description}</p>
      </div>
      
      <ul className="flex flex-col gap-1 mb-3 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-xs md:text-sm">
            <svg 
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isHighlighted ? 'text-white' : 'text-cyan-800'}`} 
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
      
      <button className={`mt-auto py-2 md:py-3 px-4 md:px-5 rounded-[50px] text-sm font-medium transition-all duration-300 ${
        isHighlighted 
          ? 'bg-white text-cyan-800 hover:bg-gray-100 hover:shadow-lg' 
          : 'bg-cyan-800 text-white hover:bg-cyan-700 hover:shadow-lg'
      }`}>
        {buttonText}
      </button>
    </div>
  );
  
  return (
    <div className="h-full min-h-[400px] sm:min-h-[430px] md:min-h-[480px] w-full perspective-1000">
      <div 
        ref={cardRef}
        className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front face */}
        <CardFace />
        
        {/* Back face */}
        <CardFace isBackFace={true} />
      </div>
    </div>
  );
};
