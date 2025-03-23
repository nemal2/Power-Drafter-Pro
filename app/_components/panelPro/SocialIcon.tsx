import React from "react";

interface SocialIconProps {
  src: string;
  alt: string;
}

export function SocialIcon({ src, alt }: SocialIconProps): JSX.Element {
  return (
    <div className="flex gap-2.5 justify-center items-center self-start">
      <img
        loading="lazy"
        src={src}
        alt={alt}
        className="w-5 h-5 object-cover"
      />
    </div>
  );
}