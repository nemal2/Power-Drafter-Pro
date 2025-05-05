import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import CatalogAdmin from "./CatalogAdmin"; // Adjust the import path as needed

// Define the types for the props
interface AdminPrivilegesProps {
    
  isOpen: boolean;
  onClose: () => void;
}

// Import the LibraryItem type or define it here if not already imported
interface LibraryItem {
  id: string;
  name: string;
  description: string;
  svg: string;
  price: number;
  specs: Record<string, string[]>;
  selectedSpecs?: Record<string, string>;
}

const AdminPrivileges: React.FC<AdminPrivilegesProps> = ({ isOpen, onClose }) => {
  const [passkey, setPasskey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [showCatalogAdmin, setShowCatalogAdmin] = useState(false);

  // The correct passkey
  const CORRECT_PASSKEY = "admin123"; // You should store this securely in environment variables

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passkey === CORRECT_PASSKEY) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setPasskey("");
    setIsAuthenticated(false);
    setError("");
    setShowCatalogAdmin(false);
    onClose();
  };

  const handleSelectComponent = (component: LibraryItem) => {
    // Handle the selected component if needed
    console.log("Selected component:", component);
    // You might want to do something with the selected component
  };

  // If showing catalog admin, render that
  if (isAuthenticated && showCatalogAdmin) {
    return (
      <CatalogAdmin 
        isOpen={true} 
        onClose={() => setShowCatalogAdmin(false)} 
        onSelectComponent={handleSelectComponent} 
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogTrigger />
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col p-6">
        <DialogTitle>Admin Privileges</DialogTitle>
        
        {!isAuthenticated ? (
          <>
            <DialogDescription>
              Please enter the admin License to continue.
            </DialogDescription>
            
            <form onSubmit={handlePasskeySubmit} className="mt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="passkey" className="block text-sm font-medium text-gray-700">
                  License
                  </label>
                  <input
                    type="password"
                    id="passkey"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter passkey"
                    required
                  />
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-gray-200 text-gray-800 rounded-md px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-md px-4 py-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogDescription>
              Manage and assign admin privileges to users here.
            </DialogDescription>

            <div className="mt-4 flex-1 overflow-y-auto">
              {/* Admin Privileges content */}
              <p>Settings for Admin Privileges would go here.</p>
              
              {/* Component Catalog Management Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowCatalogAdmin(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Manage Component Catalog
                </button>
              </div>
              
              {/* Add more admin features */}
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium">User Management</h3>
                <p className="mt-2">You can manage user permissions and roles here.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className="bg-red-500 text-white rounded-md px-4 py-2"
              >
                Close
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminPrivileges;
