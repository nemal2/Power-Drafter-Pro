import React from "react";
import Link from 'next/link';

interface NavItemProps {
  text: string;
  sectionId?: string;
}

export function NavItem({ text, sectionId = "" }: NavItemProps): JSX.Element {
  // Create the href with a hash for section navigation
  const href = sectionId ? `#${sectionId}` : "#";
  
  // Function to handle smooth scrolling
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Update URL without page reload
        window.history.pushState({}, '', href);
      }
    }
  };

  return (
    <Link 
      href={href}
      onClick={handleClick}
      className="relative font-medium transition-colors duration-300 ease-in-out hover:text-cyan-700 group cursor-pointer"
    >
      {text}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-700 transition-all duration-300 ease-in-out group-hover:w-full"></span>
    </Link>
  );
}