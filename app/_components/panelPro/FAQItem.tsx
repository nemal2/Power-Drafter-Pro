import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full border-b border-gray-200 py-3 md:py-4">
      <button 
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg font-medium text-neutral-700">{question}</span>
        <span 
          className="text-[#7cbba8] text-lg md:text-xl transform transition-transform duration-300" 
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          &gt;
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-2 md:mt-3 text-sm md:text-base text-gray-600 animate-fadeIn">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
