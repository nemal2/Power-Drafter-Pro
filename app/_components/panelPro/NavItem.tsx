import React from 'react';

interface NavItemProps {
  text: string;
  sectionId: string;
}

export const NavItem: React.FC<NavItemProps> = ({ text, sectionId }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${sectionId}`}
      onClick={handleClick}
      className="text-base md:text-lg text-black hover:text-cyan-700 transition-colors duration-300"
    >
      {text}
    </a>
  );
};
