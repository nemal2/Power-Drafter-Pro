// "use client";
// import React, { useRef, useState } from "react";
// import Draggable from "react-draggable"; // Import ReactDraggable
// import { LibraryItems } from "./CanvasSidebar/LibraryItems";

// interface LibraryItem {
//   id: string;
//   name: string;
//   svg: string;
//   x: number;
//   y: number;
// }

// const Canvas: React.FC = () => {
//   const canvasRef = useRef<HTMLDivElement | null>(null);
//   const [board, setBoard] = useState<LibraryItem[]>([]);

//   // Function to handle dropping items onto the canvas
//   const handleDrop = (item: LibraryItem, x: number, y: number) => {
//     setBoard((prevBoard) => [
//       ...prevBoard,
//       { ...item, x, y }, // Add position to the item
//     ]);
//   };

//   // Mock function to simulate adding items (replace with actual drag-and-drop logic)
//   const addLibraryItem = (itemId: string) => {
//     const libraryItem = LibraryItems.find((item) => item.id === itemId);
//     if (libraryItem && canvasRef.current) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       const x = rect.width / 2 - 25; // Center horizontally (adjust as needed)
//       const y = rect.height / 2 - 25; // Center vertically (adjust as needed)
//       handleDrop(libraryItem, x, y);
//     }
//   };

//   return (
//     <div
//       ref={canvasRef}
//       className="relative w-full h-full bg-[#317873]"
//       style={{
//         width: "800px",
//         height: "600px",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Add Buttons for Testing (simulate adding items) */}
//       <div className="absolute top-4 left-4 flex gap-2">
//         {LibraryItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => addLibraryItem(item.id)}
//             className="bg-white text-black px-3 py-1 rounded shadow"
//           >
//             Add {item.name}
//           </button>
//         ))}
//       </div>

//       {/* Render items on the canvas */}
//       {board.map((item) => (
//         <Draggable
//           key={item.id}
//           bounds="parent"
//           defaultPosition={{ x: item.x, y: item.y }}
//         >
//           <div
//             style={{
//               width: "50px",
//               height: "50px",
//               backgroundImage: `url(${item.svg})`,
//               backgroundSize: "contain",
//               backgroundRepeat: "no-repeat",
//               position: "absolute",
//               cursor: "move",
//             }}
//           ></div>
//         </Draggable>
//       ))}
//     </div>
//   );
// };

// export default Canvas;



// "use client";
// import React, { useRef, useState } from "react";
// import Draggable from "react-draggable"; // Import ReactDraggable
// import { LibraryItems } from "./CanvasSidebar/LibraryItems";
// import html2canvas from "html2canvas";


// interface LibraryItem {
//   id: string;
//   name: string;
//   svg: string;
//   x: number;
//   y: number;
// }

// const Canvas: React.FC = () => {
//   const canvasRef = useRef<HTMLDivElement | null>(null);
//   const [board, setBoard] = useState<LibraryItem[]>([]);

//   // Function to handle dropping items onto the canvas
//   const handleDrop = (item: LibraryItem, x: number, y: number) => {
//     setBoard((prevBoard) => [
//       ...prevBoard,
//       { ...item, x, y }, // Add position to the item
//     ]);
//   };

//   // Mock function to simulate adding items (replace with actual drag-and-drop logic)
//   const addLibraryItem = (itemId: string) => {
//     const libraryItem = LibraryItems.find((item) => item.id === itemId);
//     if (libraryItem && canvasRef.current) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       const x = rect.width / 2 - 25; // Center horizontally (adjust as needed)
//       const y = rect.height / 2 - 25; // Center vertically (adjust as needed)
//       handleDrop(libraryItem, x, y);
//     }
//   };

//   // Save canvas as PNG
//   const saveAsPNG = () => {
//     if (!canvasRef.current) return;

//     // Convert the canvas to an image
//     const svgElements = canvasRef.current.querySelectorAll("svg");
//     svgElements.forEach((svg) => {
//       const outerHTML = svg.outerHTML;
//       const blob = new Blob([outerHTML], { type: "image/svg+xml;charset=utf-8" });
//       const url = URL.createObjectURL(blob);
//       const img = new Image();
//       img.src = url;
//       img.onload = () => URL.revokeObjectURL(url);
//     });

//     html2canvas(canvasRef.current).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = "canvas.png";
//       link.href = canvas.toDataURL();
//       link.click();
//     });
//   };

//   // Print canvas
//   const printCanvas = () => {
//     if (!canvasRef.current) return;

//     html2canvas(canvasRef.current).then((canvas) => {
//       const newWindow = window.open();
//       if (newWindow) {
//         newWindow.document.body.innerHTML = `
//           <img src="${canvas.toDataURL()}" style="width:100%; height:auto;">
//         `;
//         newWindow.print();
//       }
//     });
//   };

//   return (
//     <div>
//       <div className="relative w-full h-full bg-[#317873]" style={{ width: "800px", height: "600px", position: "relative", overflow: "hidden" }} ref={canvasRef}>
//         {/* Add Buttons for Testing (simulate adding items) */}
//         <div className="absolute top-4 left-4 flex gap-2">
//           {LibraryItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => addLibraryItem(item.id)}
//               className="bg-white text-black px-3 py-1 rounded shadow"
//             >
//               Add {item.name}
//             </button>
//           ))}
//         </div>

//         {/* Render items on the canvas */}
//         {board.map((item) => (
//           <Draggable
//             key={item.id}
//             bounds="parent"
//             defaultPosition={{ x: item.x, y: item.y }}
//           >
//             <div
//               style={{
//                 width: "50px",
//                 height: "50px",
//                 backgroundImage: `url(${item.svg})`,
//                 backgroundSize: "contain",
//                 backgroundRepeat: "no-repeat",
//                 position: "absolute",
//                 cursor: "move",
//               }}
//             ></div>
//           </Draggable>
//         ))}
//       </div>

//       {/* Save and Print Buttons */}
//       <div className="mt-4 flex gap-4">
//         <button
//           onClick={saveAsPNG}
//           className="bg-blue-500 text-white px-4 py-2 rounded shadow"
//         >
//           Save as PNG
//         </button>
//         <button
//           onClick={printCanvas}
//           className="bg-green-500 text-white px-4 py-2 rounded shadow"
//         >
//           Print Canvas
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Canvas;

///superb one--------------------------------------------------------------------------------------------------
// "use client";
// import React, { useRef, useState } from "react";
// import Draggable from "react-draggable"; // Import ReactDraggable
// import { LibraryItems } from "./CanvasSidebar/LibraryItems";

// interface LibraryItem {
//   id: string;
//   name: string;
//   svg: string;
//   x: number;
//   y: number;
// }

// const Canvas: React.FC = () => {
//   const canvasRef = useRef<HTMLDivElement | null>(null);
//   const [board, setBoard] = useState<LibraryItem[]>([]);

//   // Function to handle dropping items onto the canvas
//   const handleDrop = (item: LibraryItem, x: number, y: number) => {
//     setBoard((prevBoard) => [
//       ...prevBoard,
//       { ...item, x, y }, // Add position to the item
//     ]);
//   };

//   // Mock function to simulate adding items (replace with actual drag-and-drop logic)
//   const addLibraryItem = (itemId: string) => {
//     const libraryItem = LibraryItems.find((item) => item.id === itemId);
//     if (libraryItem && canvasRef.current) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       const x = rect.width / 2 - 25; // Center horizontally (adjust as needed)
//       const y = rect.height / 2 - 25; // Center vertically (adjust as needed)
//       handleDrop(libraryItem, x, y);
//     }
//   };

//   // Save canvas as PNG
//   const saveAsPNG = () => {
//     if (!canvasRef.current) return;

//     html2canvas(canvasRef.current).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = "canvas.png";
//       link.href = canvas.toDataURL();
//       link.click();
//     });
//   };

//   // Print canvas
//   const printCanvas = () => {
//     if (!canvasRef.current) return;

//     html2canvas(canvasRef.current).then((canvas) => {
//       const newWindow = window.open();
//       if (newWindow) {
//         newWindow.document.body.innerHTML = `
//           <img src="${canvas.toDataURL()}" style="width:100%; height:auto;">
//         `;
//         newWindow.print();
//       }
//     });
//   };

//   return (
//     <div>
//       <div
//         className="relative w-full h-full bg-[#317873]"
//         style={{
//           width: "1300px", // Increased width
//           height: "750px",
//           position: "relative",
//           overflow: "hidden",
//         }}
//         ref={canvasRef}
//       >
//         {/* Add Buttons for Testing (simulate adding items) */}
//         <div className="absolute top-4 left-4 flex gap-2">
//           {LibraryItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => addLibraryItem(item.id)}
//               className="bg-white text-black px-3 py-1 rounded shadow"
//             >
//               Add {item.name}
//             </button>
//           ))}
//         </div>

//         {/* Render items on the canvas */}
//         {board.map((item) => (
//           <Draggable
//             key={item.id}
//             bounds="parent"
//             defaultPosition={{ x: item.x, y: item.y }}
//           >
//             <div
//               style={{
//                 width: "50px",
//                 height: "50px",
//                 backgroundImage: `url(${item.svg})`,
//                 backgroundSize: "contain",
//                 backgroundRepeat: "no-repeat",
//                 position: "absolute",
//                 cursor: "move",
//               }}
//             ></div>
//           </Draggable>
//         ))}
//       </div>

//       {/* Save and Print Buttons */}
//       <div className="mt-4 flex gap-4">
//         <button
//           onClick={saveAsPNG}
//           className="bg-blue-500 text-white px-4 py-2 rounded shadow"
//         >
//           Save as PNG
//         </button>
//         <button
//           onClick={printCanvas}
//           className="bg-green-500 text-white px-4 py-2 rounded shadow"
//         >
//           Print Canvas
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Canvas;



// // 






// //////////////////////////////////////////////////////////////////////////////////////

// "use client";
// import React, { useRef, useState } from "react";
// import Draggable from "react-draggable";
// import { useDrag, useDrop } from "react-dnd";
// import { LibraryItems } from "./CanvasSidebar/LibraryItems";
// import html2canvas from "html2canvas";

// interface LibraryItem {
//   id: string;
//   name: string;
//   svg: string;
//   x: number;
//   y: number;
// }

// const Canvas: React.FC = () => {
//   const canvasRef = useRef<HTMLDivElement | null>(null);
//   const [board, setBoard] = useState<LibraryItem[]>([]);

//   // Function to handle dropping items onto the canvas
//   const handleDrop = (item: LibraryItem, x: number, y: number) => {
//     setBoard((prevBoard) => [
//       ...prevBoard,
//       { ...item, x, y }, // Add position to the item
//     ]);
//   };

//   // React-DnD drop functionality
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: "libraryItem",
//     drop: (item: LibraryItem, monitor) => {
//       const offset = monitor.getClientOffset();
//       if (offset && canvasRef.current) {
//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = offset.x - rect.left;
//         const y = offset.y - rect.top;
//         handleDrop(item, x, y);
//       }
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   // React-DnD drag functionality
//   const LibraryItemComponent: React.FC<{ item: LibraryItem }> = ({ item }) => {
//     const [, drag] = useDrag(() => ({
//       type: "libraryItem",
//       item,
//     }));
//     return (
//       <div
//         ref={drag}
//         className="cursor-pointer p-2 border rounded bg-white shadow"
//       >
//         {item.name}
//       </div>
//     );
//   };

//   // Save canvas as PNG
//   const saveAsPNG = () => {
//     if (!canvasRef.current) return;

//     html2canvas(canvasRef.current).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = "canvas.png";
//       link.href = canvas.toDataURL();
//       link.click();
//     });
//   };

//   // Print canvas
//   const printCanvas = () => {
//     if (!canvasRef.current) return;

//     html2canvas(canvasRef.current).then((canvas) => {
//       const newWindow = window.open();
//       if (newWindow) {
//         newWindow.document.body.innerHTML = `
//           <img src="${canvas.toDataURL()}" style="width:100%; height:auto;">
//         `;
//         newWindow.print();
//       }
//     });
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar with Library Items */}
//       <div className="w-1/4 p-4 bg-gray-100 border-r">
//         <h2 className="text-lg font-bold mb-4">Library Items</h2>
//         {LibraryItems.map((item) => (
//           <LibraryItemComponent key={item.id} item={item} />
//         ))}
//       </div>

//       {/* Canvas */}
//       <div className="w-3/4 p-4">
//         <div
//           ref={(node) => {
//             drop(node);
//             canvasRef.current = node;
//           }}
//           className={`relative bg-[#317873] w-full h-[750px] ${
//             isOver ? "border-4 border-blue-500" : ""
//           }`}
//           style={{ position: "relative", overflow: "hidden" }}
//         >
//           {board.map((item) => (
//             <Draggable
//               key={item.id}
//               bounds="parent"
//               defaultPosition={{ x: item.x, y: item.y }}
//             >
//               <div
//                 style={{
//                   width: "50px",
//                   height: "50px",
//                   backgroundImage: `url(${item.svg})`,
//                   backgroundSize: "contain",
//                   backgroundRepeat: "no-repeat",
//                   position: "absolute",
//                   cursor: "move",
//                 }}
//               ></div>
//             </Draggable>
//           ))}
//         </div>

//         {/* Save and Print Buttons */}
//         <div className="mt-4 flex gap-4">
//           <button
//             onClick={saveAsPNG}
//             className="bg-blue-500 text-white px-4 py-2 rounded shadow"
//           >
//             Save as PNG
//           </button>
//           <button
//             onClick={printCanvas}
//             className="bg-green-500 text-white px-4 py-2 rounded shadow"
//           >
//             Print Canvas
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Canvas;



















/////////////////////////////////////////////



// "use client";

// import React, { useRef, useState } from "react";
// import Draggable from "react-draggable";
// import { useDrag, useDrop } from "react-dnd";
// import { LibraryItems } from "./CanvasSidebar/LibraryItems";
// import html2canvas from "html2canvas";

// interface LibraryItem {
//   id: string;
//   name: string;
//   svg: string;
//   x: number;
//   y: number;
// }

// const Canvas: React.FC = () => {
//   const canvasRef = useRef<HTMLDivElement | null>(null);
//   const [board, setBoard] = useState<LibraryItem[]>([]);

//   // Function to handle dropping items onto the canvas
//   const handleDrop = (item: LibraryItem, x: number, y: number) => {
//     setBoard((prevBoard) => [
//       ...prevBoard,
//       { ...item, x, y }, // Add position to the item
//     ]);
//   };

//   // React DnD drop functionality
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: "libraryItem",
//     drop: (item: LibraryItem, monitor) => {
//       const offset = monitor.getClientOffset();
//       if (offset && canvasRef.current) {
//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = offset.x - rect.left;
//         const y = offset.y - rect.top;
//         handleDrop(item, x, y);
//       }
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   // React DnD drag functionality for library items
//   const LibraryItemComponent: React.FC<{ item: LibraryItem }> = ({ item }) => {
//     const [, drag] = useDrag(() => ({
//       type: "libraryItem",
//       item,
//     }));

//     return (
//       <div
//         ref={drag}
//         className="cursor-pointer p-2 border rounded bg-white shadow text-center"
//       >
//         <img src={item.svg} alt={item.name} className="w-12 h-12" />
//         <p className="text-sm mt-2">{item.name}</p>
//       </div>
//     );
//   };

//   // Save canvas as PNG
//   const saveAsPNG = () => {
//     if (!canvasRef.current) return;

//     html2canvas(canvasRef.current).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = "canvas.png";
//       link.href = canvas.toDataURL("image/png");
//       link.click();
//     });
//   };

//   // Print canvas
//   const printCanvas = () => {
//     if (!canvasRef.current) return;

//     html2canvas(canvasRef.current).then((canvas) => {
//       const newWindow = window.open();
//       if (newWindow) {
//         newWindow.document.body.innerHTML = `<img src="${canvas.toDataURL()}" style="width:100%; height:auto;">`;
//         newWindow.print();
//       }
//     });
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar with Library Items */}
//       <div className="w-1/4 p-4 bg-gray-100 border-r">
//         <h2 className="text-lg font-bold mb-4">Library Items</h2>
//         {LibraryItems.map((item) => (
//           <LibraryItemComponent key={item.id} item={item} />
//         ))}
//       </div>

//       {/* Canvas */}
//       <div className="w-3/4 p-4">
//         <div
//           ref={(node) => {
//             drop(node);
//             canvasRef.current = node;
//           }}
//           className={`relative bg-[#317873] w-full h-[750px] ${
//             isOver ? "border-4 border-blue-500" : ""
//           }`}
//           style={{ position: "relative", overflow: "hidden" }}
//         >
//           {board.map((item, index) => (
//             <Draggable
//               key={`${item.id}-${index}`}
//               bounds="parent"
//               defaultPosition={{ x: item.x, y: item.y }}
//             >
//               <div
//                 style={{
//                   width: "50px",
//                   height: "50px",
//                   backgroundImage: `url(${item.svg})`,
//                   backgroundSize: "contain",
//                   backgroundRepeat: "no-repeat",
//                   position: "absolute",
//                   cursor: "move",
//                 }}
//               ></div>
//             </Draggable>
//           ))}
//         </div>

//         {/* Save and Print Buttons */}
//         <div className="mt-4 flex gap-4">
//           <button
//             onClick={saveAsPNG}
//             className="bg-blue-500 text-white px-4 py-2 rounded shadow"
//           >
//             Save as PNG
//           </button>
//           <button
//             onClick={printCanvas}
//             className="bg-green-500 text-white px-4 py-2 rounded shadow"
//           >
//             Print Canvas
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Canvas;




/////



// "use client";

// import React, { useRef, useState } from "react";
// import Draggable from "react-draggable";
// import { useDrop } from "react-dnd";
// import { LibraryItems, LibraryItemComponent, LibraryItem } from "./CanvasSidebar/LibraryItems";
// import html2canvas from "html2canvas";

// const Canvas: React.FC = () => {
//   const canvasRef = useRef<HTMLDivElement | null>(null);
//   const [board, setBoard] = useState<LibraryItem[]>([]);

//   const handleDrop = (item: LibraryItem, x: number, y: number) => {
//     setBoard((prevBoard) => [
//       ...prevBoard,
//       { ...item, x, y },
//     ]);
//   };

//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: "libraryItem",
//     drop: (item: LibraryItem, monitor) => {
//       const offset = monitor.getClientOffset();
//       if (offset && canvasRef.current) {
//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = offset.x - rect.left;
//         const y = offset.y - rect.top;
//         handleDrop(item, x, y);
//       }
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   const saveAsPNG = () => {
//     if (!canvasRef.current) return;
//     html2canvas(canvasRef.current).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = "canvas.png";
//       link.href = canvas.toDataURL("image/png");
//       link.click();
//     });
//   };

//   const printCanvas = () => {
//     if (!canvasRef.current) return;
//     html2canvas(canvasRef.current).then((canvas) => {
//       const newWindow = window.open();
//       if (newWindow) {
//         newWindow.document.body.innerHTML = `<img src="${canvas.toDataURL()}" style="width:100%; height:auto;">`;
//         newWindow.print();
//       }
//     });
//   };

//   return (
//     <div className="flex">
//       {/* <div className="w-1/4 p-4 bg-gray-100 border-r">
//         <h2 className="text-lg font-bold mb-4">Library Items</h2>
//         {LibraryItems.map((item) => (
//           <LibraryItemComponent key={item.id} item={item} />
//         ))}
//       </div> */}

//       <div className="w-3/4 p-4">
//         <div
//           ref={(node) => {
//             drop(node);
//             canvasRef.current = node;
//           }}
//           className={`relative bg-[#317873] w-full h-[750px] ${
//             isOver ? "border-4 border-blue-500" : ""
//           }`}
//           style={{ position: "relative", overflow: "hidden" }}
//         >
//           {board.map((item, index) => (
//             <Draggable
//               key={`${item.id}-${index}`}
//               bounds="parent"
//               defaultPosition={{ x: item.x, y: item.y }}
//             >
//               <div
//                 style={{
//                   width: "50px",
//                   height: "50px",
//                   backgroundImage: `url(${item.svg})`,
//                   backgroundSize: "contain",
//                   backgroundRepeat: "no-repeat",
//                   position: "absolute",
//                   cursor: "move",
//                 }}
//               ></div>
//             </Draggable>
//           ))}
//         </div>

//         <div className="mt-4 flex gap-4">
//           <button
//             onClick={saveAsPNG}
//             className="bg-blue-500 text-white px-4 py-2 rounded shadow"
//           >
//             Save as PNG
//           </button>
//           <button
//             onClick={printCanvas}
//             className="bg-green-500 text-white px-4 py-2 rounded shadow"
//           >
//             Print Canvas
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Canvas;




"use client";

import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { useDrop } from "react-dnd";
import { LibraryItems, LibraryItemComponent, LibraryItem } from "./CanvasSidebar/LibraryItems";
import html2canvas from "html2canvas";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [board, setBoard] = useState<LibraryItem[]>([]);

  const handleDrop = (item: LibraryItem, x: number, y: number) => {
    setBoard((prevBoard) => [
      ...prevBoard,
      { ...item, x, y },
    ]);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "libraryItem",
    drop: (item: LibraryItem, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = offset.x - rect.left;
        const y = offset.y - rect.top;
        handleDrop(item, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const saveAsPNG = () => {
    if (!canvasRef.current) return;
    html2canvas(canvasRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "canvas.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const printCanvas = () => {
    if (!canvasRef.current) return;
    html2canvas(canvasRef.current).then((canvas) => {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.body.innerHTML = `<img src="${canvas.toDataURL()}" style="width:100%; height:auto;">`;
        newWindow.print();
      }
    });
  };

  return (
    <div className="flex">
      {/* <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-lg font-bold mb-4">Library Items</h2>
        {LibraryItems.map((item) => (
          <LibraryItemComponent key={item.id} item={item} />
        ))}
      </div> */}

      <div className="w-3/4 p-4">
        <div
          ref={(node) => {
            drop(node);
            canvasRef.current = node;
          }}
          className={`relative bg-[#317873] w-[1300px] h-[750px] ${isOver ? "border-1 border-blue-500" : ""}`}
          style={{ position: "relative", overflow: "hidden" }}
        >
          {board.map((item, index) => (
            <Draggable
              key={`${item.id}-${index}`}
              bounds="parent"
              defaultPosition={{ x: item.x, y: item.y }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundImage: `url(${item.svg})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  position: "absolute",
                  cursor: "move",
                }}
              ></div>
            </Draggable>
          ))}
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={saveAsPNG}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Save as PNG
          </button>
          <button
            onClick={printCanvas}
            className="bg-green-500 text-white px-4 py-2 rounded shadow"
          >
            Print Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
