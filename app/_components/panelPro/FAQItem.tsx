import React from "react";

interface FAQItemProps {
  question: string;
}

export function FAQItem({ question }: FAQItemProps): JSX.Element {
  return (
    <div className="flex justify-between pb-6 mt-6 w-full text-lg font-medium text-black border-b border-solid border-zinc-300">
      <div>{question}</div>
      <div className="flex gap-2.5 self-start text-cyan-800">+</div>
    </div>
  );
}