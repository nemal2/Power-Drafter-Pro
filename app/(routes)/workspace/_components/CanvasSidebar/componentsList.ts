export const categories = {
  'passive': 'Passive Components',
  'active': 'Active Components',
  'protection': 'Protection Devices',
  'connectors': 'Connectors'

};

export const components = {
  'passive': [
    {
      id: 'breaker-1',
      name: 'Breaker',
      description: 'Standard circuit breaker',
      svg: '/components/22.png',
      price: 60.00,
      width: 100,
      height: 100,
      specs: {
        'power': ['0.5W', '1W', '2W'],
        'current': ['10A', '15A', '20A'],
        'tolerance': ['±5%', '±2%', '±1%']
      }
    },
    {
      id: 'breaker-2',
      name: 'Breaker2',
      description: 'Advanced circuit breaker',
      svg: '/components/223.png',
      price: 75.00,
      width: 120,
      height: 120,
      specs: {
        'power': ['1W', '2W', '5W'],
        'current': ['20A', '30A', '40A'],
        'tolerance': ['±2%', '±1%']
      }
    },
    {
      id: 'breaker-4',
      name: 'Breaker4',
      description: 'Heavy duty circuit breaker',
      svg: '/components/switch4.png',
      price: 120.00,
      width: 150,
      height: 150,
      specs: {
        'power': ['5W', '10W', '15W'],
       
        'tolerance': ['±1%']
      }
    }
  ],
  'active': [
    {
      id: 'ovr-t2',
      name: 'OVR T2',
      description: 'OVR T2 2L switch',
      svg: '/components/OVR.png',
      price: 200.00,
      width: 100,
      height: 120,
      specs: {
        'power': ['1W', '2W', '5W'],
  
        'tolerance': ['±2%', '±1%']
      }
    },
    {
      id: 'breaker-2a',
      name: 'Breaker-2',
      description: 'Secondary breaker switch',
      svg: '/components/22.png',
      price: 200.00,
      width: 100,
      height: 100,
      specs: {
        'power': ['0.5W', '1W', '2W'],
        
        'tolerance': ['±5%', '±2%']
      }
    },
    {
      id: 'switch-2',
      name: 'Switch-2',
      description: 'Basic power switch',
      svg: '/components/22.png',
      price: 120.00,
      width: 80,
      height: 80,
      specs: {
        power: ['0.25W', '0.5W', '1W'],
      tolerance: ['±5%', '±2%', '±1%']
      }
    }
  ],
  'protection': [
    {
      id: 'controller-1',
      name: 'Controller',
      description: 'Basic controller unit',
      svg: '/components/223.png',
      price: 200.00,
      width: 150,
      height: 100,
      specs: {
        power: ['0.25W', '0.5W', '1W'],
      tolerance: ['±5%', '±2%', '±1%']
      }
    }
  ]
};


// Helper function to get all components regardless of category
export const getAllComponents = () => {
  return Object.values(components).flat();
};

// Helper function to save custom components to localStorage
export const saveCustomComponents = (customComponents) => {
  localStorage.setItem('catalog_custom_components', JSON.stringify(customComponents));
};

// Helper function to load custom components from localStorage
export const loadCustomComponents = () => {
  try {
    const storedComponents = localStorage.getItem('catalog_custom_components');
    return storedComponents ? JSON.parse(storedComponents) : [];
  } catch (error) {
    console.error("Error loading custom components:", error);
    return [];
  }
};