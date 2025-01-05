import React from "react";
import { useDrag } from "react-dnd";

export interface LibraryItem {
  id: string;
  name: string;
  svg: string;
  price: number;  // Add price field
}

export const LibraryItems: LibraryItem[] = [
  {
    id: "1",
    name: "Resistor",
    svg: "/components/a1.png",
    price: 50.00
  },
  {
    id: "2",
    name: "Capacitor",
    svg: "/components/a2.png",
    price: 75.00
  },
  {
    id: "3",
    name: "Switch",
    svg: "/components/a3.png",
    price: 120.00
  },
  {
    id: "4",
    name: "Breaker",
    svg: "/components/a1.png",
    price: 200.00
  }
];
export const LibraryItemComponent: React.FC<{ item: LibraryItem }> = ({
  item,
}) => {
  const [, drag] = useDrag(() => ({
    type: "libraryItem",
    item,
  }));

  return (
    <div
      ref={drag}
      className="cursor-pointer p-2 border rounded bg-white shadow text-center "
    >
      <img src={item.svg} alt={item.name} className="w-12 h-12 items-center" />
      <p className="text-sm mt-2">{item.name}</p>
    </div>
  );
};
