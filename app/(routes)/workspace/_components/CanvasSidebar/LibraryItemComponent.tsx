import { useDrag } from "react-dnd";
import { LibraryItem } from "./ComponentPanel";
import { useEffect, useRef } from "react";

export const LibraryItemComponent: React.FC<{
    item: LibraryItem;
    onClick?: (item: LibraryItem) => void;
    onDelete?: (id: string) => void;
  }> = ({ item, onClick, onDelete }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "libraryItem",
      item: { ...item },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    const [showContextMenu, setShowContextMenu] = useState(false);
    const contextMenuRef = useRef<HTMLDivElement>(null);
  
    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowContextMenu(true);
    };
  
    const handleDelete = () => {
      if (onDelete) {
        onDelete(item.id);
      }
      setShowContextMenu(false);
    };
  
    // Close context menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
          setShowContextMenu(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    return (
      <div
        ref={drag}
        className={`cursor-pointer p-3 border rounded bg-white shadow text-center relative ${
          isDragging ? 'opacity-50' : ''
        }`}
        onClick={() => onClick?.(item)}
        onContextMenu={handleContextMenu}
      >
        <img 
          src={item.svg} 
          alt={item.name} 
          className="w-12 h-12 mx-auto" 
        />
        <p className="text-sm mt-2">{item.name}</p>
        <p className="text-xs text-gray-600">LKR {item.price}</p>
  
        {/* Context Menu */}
        {showContextMenu && (
          <div 
            ref={contextMenuRef}
            className="absolute z-50 bg-white shadow-lg rounded-md py-2 right-0 mt-1"
            style={{ top: '100%' }}
          >
            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };