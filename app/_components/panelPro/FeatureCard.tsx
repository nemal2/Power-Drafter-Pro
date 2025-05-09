import React from "react";

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export function FeatureCard({ title, icon, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="flex flex-col w-full sm:flex-1 mb-6 last:mb-0 sm:mb-0 max-w-[350px] mx-auto sm:mx-0 bg-[#F7F7F7] transition-all duration-300 ease-in-out hover:-translate-y-1">
      <div className="flex flex-col items-center bg-white py-6 rounded-xl px-4 text-center h-full shadow-sm">
        <div className="flex gap-2.5 text-3xl text-cyan-800 justify-center">{icon}</div>
        <h3 className="mt-2.5 text-xl font-semibold">{title}</h3>
        <p className="mt-2.5 text-base leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
