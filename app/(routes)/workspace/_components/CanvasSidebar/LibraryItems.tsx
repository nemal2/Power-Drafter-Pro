import React from "react";
import { useDrag } from "react-dnd";

export interface LibraryItem {
  id: string;
  name: string;
  svg: string;
}

export const LibraryItems: LibraryItem[] = [
  {
    id: "1",
    name: "resiistor",
    svg: "/components/a1.png",
  },
  {
    id: "2",
    name: "Square",
    svg: "/components/a2.png",
  },
  {
    id: "3",
    name: "Triangle",
    svg: "/components/a3.png",
  },
  // Add more items as needed
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
