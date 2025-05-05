import React from "react";

interface FooterLinkProps {
  text: string;
}

export function FooterLink({ text }: FooterLinkProps): JSX.Element {
  return (
    <div className="flex flex-col mt-3 md:mt-5">
      <a 
        href="#" 
        className="text-sm md:text-base tracking-wide text-white text-opacity-60 hover:text-opacity-100 transition-colors duration-300"
      >
        {text}
      </a>
    </div>
  );
}
