export const categories = {
    all: "All Components",
    passive: "Passive Components",
    active: "Active Components",
    protection: "Protection Devices",
    connectors: "Connectors",
  };
  
  export const initialComponents = {
    passive: [
      {
        id: "1",
        name: "Resistor",
        svg: "/components/a1.png",
        price: 50.00,
        description: "Standard resistor",
        specs: { resistance: ["10Ω", "100Ω"], power: ["1/4W", "1/2W"], tolerance: ["±1%", "±5%"] },
      },
    ],
  };
  