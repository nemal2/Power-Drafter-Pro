"use client";
import React, { useRef, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { LibraryItems } from "./CanvasSidebar/LibraryItems";

interface LibraryItem {
  id: string;
  name: string;
  svg: string;
  x: number;
  y: number;
}

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [board, setBoard] = useState<LibraryItem[]>([]);

  // Initialize canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#317873"; // Custom teal background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  // Draw items on canvas when the board changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw background
        ctx.fillStyle = "#317873";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw each item
        board.forEach((item) => {
          const img = new Image();
          img.src = item.svg;
          img.onload = () => {
            ctx.drawImage(img, item.x, item.y, 50, 50); // Fixed size 50x50
          };
        });
      }
    }
  }, [board]);

  // React-DnD drop functionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "images",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = offset.x - rect.left;
        const y = offset.y - rect.top;

        // Find the dropped item by ID and add it to the board
        const libraryItem = LibraryItems.find((lib) => lib.id === item.id);
        if (libraryItem) {
          setBoard((prevBoard) => [
            ...prevBoard,
            { ...libraryItem, x, y }, // Add position to the item
          ]);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleSaveCanvasAsPNG = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "canvas.png";
      link.click();
    }
  };

  const handlePrintCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(
          `<img src="${dataUrl}" style="width:100%;height:auto;">`
        );
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  return (
    <div ref={drop} className="relative w-full h-full">
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={handlePrintCanvas}
          className="bg-white text-black px-3 py-1 rounded shadow"
        >
          Print
        </button>
        <button
          onClick={handleSaveCanvasAsPNG}
          className="bg-white text-black px-3 py-1 rounded shadow"
        >
          Save as PNG
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full"
        style={{
          display: "block",
          background: isOver ? "rgba(0, 0, 0, 0.1)" : undefined,
        }}
      ></canvas>
    </div>
  );
};

export default Canvas;
