export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  link: string;
  details?: string;
}

export const services: Service[] = [
  {
    id: "pavement-inspection",
    name: "Pavement Inspection",
    description: "Comprehensive pavement condition assessment and evaluation services.",
    price: "Starting at $500",
    link: "/services/pavement-inspection",
    details: `
      <p>Our pavement inspection service includes:</p>
      <ul>
        <li>Visual condition assessment</li>
        <li>Surface distress evaluation</li>
        <li>Drainage system inspection</li>
        <li>Detailed report with recommendations</li>
      </ul>
    `
  },
  {
    id: "pavement-maintenance",
    name: "Pavement Maintenance",
    description: "Regular maintenance and repair services to extend pavement life.",
    price: "Starting at $1,000",
    link: "/services/pavement-maintenance",
    details: `
      <p>Our maintenance services include:</p>
      <ul>
        <li>Crack sealing and filling</li>
        <li>Pothole repair</li>
        <li>Surface patching</li>
        <li>Preventive maintenance treatments</li>
      </ul>
    `
  },
  {
    id: "pavement-design",
    name: "Pavement Design",
    description: "Custom pavement design solutions for new construction projects.",
    price: "Starting at $2,000",
    link: "/services/pavement-design",
    details: `
      <p>Our design services include:</p>
      <ul>
        <li>Structural design analysis</li>
        <li>Material selection</li>
        <li>Drainage design</li>
        <li>Construction specifications</li>
      </ul>
    `
  }
]; 