export const categories = {
  'all': 'All Categories',
  'resistors': 'Resistors',
  'capacitors': 'Capacitors',
  'transistors': 'Transistors',
  'breakers': 'Circuit Breakers',
  'switches': 'Switches',
  'controllers': 'Controllers',
  'misc': 'Miscellaneous'
};

export const components = {
  'breakers': [
    {
      id: 'breaker-1',
      name: 'Breaker',
      description: 'Standard circuit breaker',
      svg: '/components/22.png',
      price: 50.00,
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
      svg: '/components/switch disconnector-4.png',
      price: 120.00,
      width: 150,
      height: 150,
      specs: {
        'power': ['5W', '10W', '15W'],
        'current': ['40A', '50A', '60A'],
        'tolerance': ['±1%']
      }
    }
  ],
  'switches': [
    {
      id: 'ovr-t2',
      name: 'OVR T2',
      description: 'OVR T2 2L switch',
      svg: '/components/OVR T2 2L.png',
      price: 200.00,
      width: 100,
      height: 120,
      specs: {
        'power': ['1W', '2W', '5W'],
        'voltage': ['110V', '220V', '380V'],
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
        'voltage': ['110V', '220V'],
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
        'power': ['0.25W', '0.5W', '1W'],
        'voltage': ['24V', '48V', '110V'],
        'tolerance': ['±5%']
      }
    }
  ],
  'controllers': [
    {
      id: 'controller-1',
      name: 'Controller',
      description: 'Basic controller unit',
      svg: '/components/223.png',
      price: 200.00,
      width: 150,
      height: 100,
      specs: {
        'power': ['1W', '2W'],
        'connectivity': ['Wired', 'Wireless'],
        'protocol': ['I2C', 'SPI', 'UART']
      }
    }
  ]
};