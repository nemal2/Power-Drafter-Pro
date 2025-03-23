import React from "react";

interface FooterLinkProps {
  text: string;
}

export function FooterLink({ text }: FooterLinkProps): JSX.Element {
  return (
    <div className="flex flex-col mt-5">
      <a href="#" className="text-base tracking-wide text-white text-opacity-60">
        {text}
      </a>
    </div>
  );
}