// CanvasSidebar/componentsList.ts

export const categories = {
    all: 'All Components',
    passive: 'Passive Components',
    active: 'Active Components',
    protection: 'Protection Devices',
    connectors: 'Connectors'
  };
  
  export const components = {
    passive: [
      {
        id: '1',
        name: 'Breaker-1',
        svg: '/components/22.png',
        price: 50.00,
        specs: {
          resistance: ['10Ω', '100Ω', '1kΩ', '10kΩ'],
          power: ['1/4W', '1/2W', '1W'],
          tolerance: ['±1%', '±5%']
        },
        description: 'Standard through-hole resistor for general-purpose applications'
      },
      {
        id: '2',
        name: 'Breaker 4',
        svg: '/components/223.png',
        price: 500.00,
        specs: {
          resistance: ['10Ω', '100Ω', '1kΩ', '10kΩ'],
          power: ['1/4W', '1/2W', '1W'],
          tolerance: ['±1%', '±5%']
        },
        description: 'Standard through hole resistor for general-purpose applications'
      },
      // ... other passive components
    ],
    active: [
      {
        id: '3',
        name: 'OVR T2',
        svg: '/components/OVR T2 2L.png',
        price: 500.00,
        specs: {
          resistance: ['10Ω', '100Ω', '1kΩ', '10kΩ'],
          power: ['1/4W', '1/2W', '1W'],
          tolerance: ['±1%', '±5%']
        },
        description: 'Standard through hole resistor for general-purpose applications'
      },    ],
    protection: [
      // ... protection components
    ]
  };
  