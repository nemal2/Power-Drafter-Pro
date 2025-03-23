import React from "react";

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export function FeatureCard({ title, icon, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="flex flex-col grow shrink-0 basis-0 max-w-full w-96">
      <div className="flex flex-col">
        <div className="flex gap-2.5 text-3xl text-cyan-800">{icon}</div>
        <h3 className="mt-2.5 text-xl font-semibold">{title}</h3>
        <p className="mt-2.5 text-base leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}