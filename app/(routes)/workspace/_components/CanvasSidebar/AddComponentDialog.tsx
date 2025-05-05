import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary, CloudinaryUploadResult } from '@/lib/cloudinary';

interface AddComponentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (componentData: ComponentFormData) => void;
}

export interface ComponentFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  imagePublicId: string;
  width: number;
  height: number;
  specs: {
    [key: string]: string[];
  };
}

const AddComponentDialog: React.FC<AddComponentDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<ComponentFormData, 'imageUrl' | 'imagePublicId'> & {
    imageUrl: string | null;
    imagePublicId: string | null;
  }>({
    name: '',
    description: '',
    price: 0,
    category: 'resistors',
    imageUrl: null,
    imagePublicId: null,
    width: 100,
    height: 100,
    specs: {
      power: ['0.25W', '0.5W', '1W'],
      tolerance: ['±5%', '±2%', '±1%'],
    },
  });

  const [currentSpec, setCurrentSpec] = useState({ key: '', value: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'width' || name === 'height') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Upload to Cloudinary
      const result = await uploadToCloudinary(file);
      
      setFormData({
        ...formData,
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
        width: result.width,
        height: result.height,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors({
        ...errors,
        image: 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      imageUrl: null,
      imagePublicId: null,
    });
  };

  const handleAddSpec = () => {
    if (!currentSpec.key.trim() || !currentSpec.value.trim()) return;
    
    setFormData({
      ...formData,
      specs: {
        ...formData.specs,
        [currentSpec.key]: [
          ...(formData.specs[currentSpec.key] || []),
          currentSpec.value,
        ],
      },
    });
    
    setCurrentSpec({ key: currentSpec.key, value: '' });
  };

  const handleRemoveSpecValue = (key: string, value: string) => {
    const updatedValues = formData.specs[key].filter(v => v !== value);
    
    const updatedSpecs = { ...formData.specs };
    if (updatedValues.length === 0) {
      delete updatedSpecs[key];
    } else {
      updatedSpecs[key] = updatedValues;
    }
    
    setFormData({
      ...formData,
      specs: updatedSpecs,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.imageUrl) {
      newErrors.image = 'Component image is required';
    }
    
    if (formData.width <= 0) {
      newErrors.width = 'Width must be greater than 0';
    }
    
    if (formData.height <= 0) {
      newErrors.height = 'Height must be greater than 0';
    }
    
    if (Object.keys(formData.specs).length === 0) {
      newErrors.specs = 'At least one specification is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && formData.imageUrl && formData.imagePublicId) {
      onSave({
        ...formData,
        imageUrl: formData.imageUrl,
        imagePublicId: formData.imagePublicId,
      } as ComponentFormData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Component</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Component Name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="resistors">Resistors</option>
                  <option value="capacitors">Capacitors</option>
                  <option value="inductors">Inductors</option>
                  <option value="transistors">Transistors</option>
                  <option value="ics">Integrated Circuits</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Price (LKR)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Component Image</label>
                {!formData.imageUrl ? (
                  <div className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
                    <label className="cursor-pointer flex flex-col items-center">
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                      <span className="mt-2 text-sm text-gray-500">
                        {isUploading ? 'Uploading...' : 'Click to upload image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="mt-2 relative">
                    <img
                      src={formData.imageUrl}
                      alt="Component preview"
                      className="max-w-full h-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="width" className="block text-sm font-medium mb-1">Width (px)</label>
                  <input
                    id="width"
                    name="width"
                    type="number"
                    min="1"
                    value={formData.width}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.width ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
                </div>
                
                <div>
                  <label htmlFor="height" className="block text-sm font-medium mb-1">Height (px)</label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    min="1"
                    value={formData.height}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Specifications section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Specifications</h3>
            {errors.specs && <p className="text-red-500 text-sm">{errors.specs}</p>}
            
            <div className="flex gap-2">
              <input
                placeholder="Spec name (e.g., power)"
                value={currentSpec.key}
                onChange={(e) => setCurrentSpec({ ...currentSpec, key: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                placeholder="Value (e.g., 0.5W)"
                value={currentSpec.value}
                onChange={(e) => setCurrentSpec({ ...currentSpec, value: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              {Object.entries(formData.specs).map(([key, values]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium capitalize">{key}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {values.map((value) => (
                      <div key={value} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                        <span>{value}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecValue(key, value)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Uploading...' : 'Save Component'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
  
};

export default AddComponentDialog;
