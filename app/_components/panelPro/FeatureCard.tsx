import React from "react";

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export function FeatureCard({ title, icon, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="flex flex-col grow shrink-0 basis-0 max-w-full w-96 bg-[#F7F7F7] transition-all duration-300 ease-in-out hover:-translate-y-1">
      <div className="flex flex-col items-center bg-white py-6 rounded-xl px-4 text-center">
        <div className="flex gap-2.5 text-3xl text-cyan-800 justify-center">{icon}</div>
        <h3 className="mt-2.5 text-xl font-semibold">{title}</h3>
        <p className="mt-2.5 text-base leading-6 text-slate-500 max-w-[250px]">
          {description}
        </p>
      </div>
    </div>
  );
}
