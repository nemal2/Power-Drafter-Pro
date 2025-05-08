import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

// Simplified categories with only the 4 required types
export const categories = {
  passive: "Passive Components",
  active: "Active Components",
  protection: "Protection Devices",
  connectors: "Connectors"
};

export interface ComponentFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  imageFile: File | null;  // Changed from imageUrl to imageFile
  imageUrl: string;        // Keep this for previewing
  width: number;
  height: number;
  specs?: Record<string, string[]>;
}

interface AddComponentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (componentData: ComponentFormData) => void;
  initialData?: ComponentFormData;
}

const AddComponentDialog: React.FC<AddComponentDialogProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ComponentFormData>(initialData || {
    name: '',
    description: '',
    category: 'passive', // Default category
    price: 0,
    imageFile: null,
    imageUrl: '/components/default.png', // Default image
    width: 100,
    height: 100,
    specs: {
      power: ['0.25W', '0.5W', '1W'],
      tolerance: ['±5%', '±2%', '±1%']
    }
  });

  const [specKeys, setSpecKeys] = useState<string[]>(
    initialData?.specs ? Object.keys(initialData.specs) : ['power', 'tolerance']
  );
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValues, setNewSpecValues] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'width' || name === 'height' ? parseFloat(value) : value
    }));
  };

  const handleSpecValuesChange = (key: string, values: string) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: values.split(',').map(v => v.trim())
      }
    }));
  };

  const handleAddSpec = () => {
    if (newSpecKey && newSpecValues) {
      setSpecKeys(prev => [...prev, newSpecKey]);
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [newSpecKey]: newSpecValues.split(',').map(v => v.trim())
        }
      }));
      setNewSpecKey('');
      setNewSpecValues('');
    }
  };

  const handleDeleteSpec = (keyToDelete: string) => {
    setSpecKeys(prev => prev.filter(key => key !== keyToDelete));
    setFormData(prev => {
      const newSpecs = { ...prev.specs };
      delete newSpecs[keyToDelete];
      return {
        ...prev,
        specs: newSpecs
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file object
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: objectUrl
      }));

      // Create an image element to get natural dimensions
      const img = new Image();
      img.onload = () => {
        setFormData(prev => ({
          ...prev,
          width: img.naturalWidth,
          height: img.naturalHeight
        }));
      };
      img.src = objectUrl;
    }
  };

  const handleOpenFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If there's no imageFile and we're editing a component, 
    // we need to ensure we keep the existing imageUrl
    const dataToSave = formData.imageFile ? formData : {
      ...formData,
      imageUrl: formData.imageUrl // Keep the existing URL
    };
    
    onSave(dataToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Component' : 'Add New Component'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Component Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (LKR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Width (px)</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                min="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Height (px)</label>
              <input
                type="number"
                name="height"
                onChange={handleInputChange}
                value={formData.height}
                className="w-full p-2 border rounded-md"
                min="10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Component Image</label>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={handleOpenFileSelector}
                className="bg-blue-500 text-white rounded-md px-4 py-2"
              >
                Select Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden" // Hide the actual file input
              />
              <div className="text-sm text-gray-500">
                {formData.imageFile ? formData.imageFile.name : 'No file selected'}
              </div>
            </div>
            {formData.imageUrl && (
              <div className="mt-2">
                <img src={formData.imageUrl} alt="Component preview" className="max-h-32 border rounded" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Specifications</label>
            
            {specKeys.map(key => (
              <div key={key} className="grid grid-cols-3 gap-2 items-center">
                <div className="col-span-1">
                  <span className="font-medium">{key}:</span>
                </div>
                <div className="col-span-1">
                  <input
                    type="text"
                    value={formData.specs?.[key]?.join(', ') || ''}
                    onChange={(e) => handleSpecValuesChange(key, e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="value1, value2, value3"
                  />
                </div>
                <div className="col-span-1">
                  <button 
                    type="button"
                    onClick={() => handleDeleteSpec(key)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="col-span-1">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="New spec name"
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <input
                  type="text"
                  value={newSpecValues}
                  onChange={(e) => setNewSpecValues(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="value1, value2, value3"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="bg-blue-500 text-white rounded-md px-3 py-2"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 rounded-md px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md px-4 py-2"
            >
              {initialData ? 'Update Component' : 'Save Component'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComponentDialog;