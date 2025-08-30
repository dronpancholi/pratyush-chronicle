export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortName: string;
  category: 'engineering' | 'technology' | 'science' | 'administrative';
  established?: number;
}

export const departments: Department[] = [
  {
    id: '1',
    name: 'Administrative',
    slug: 'administrative',
    shortName: 'Admin',
    description: 'Administrative operations and management of the institution',
    category: 'administrative'
  },
  {
    id: '2',
    name: 'Architecture',
    slug: 'architecture',
    shortName: 'Arch',
    description: 'Architectural design, planning, and construction technology',
    category: 'engineering'
  },
  {
    id: '3',
    name: 'Automation and Robotics Engineering',
    slug: 'automation-robotics',
    shortName: 'ARE',
    description: 'Automation systems, robotics, and control engineering',
    category: 'engineering'
  },
  {
    id: '4',
    name: 'Automobile Engineering',
    slug: 'automobile',
    shortName: 'Auto',
    description: 'Automotive technology, design, and manufacturing',
    category: 'engineering'
  },
  {
    id: '5',
    name: 'Biomedical Engineering',
    slug: 'biomedical',
    shortName: 'BME',
    description: 'Medical device technology and bioengineering solutions',
    category: 'engineering'
  },
  {
    id: '6',
    name: 'Civil Engineering',
    slug: 'civil',
    shortName: 'Civil',
    description: 'Infrastructure development, construction, and urban planning',
    category: 'engineering'
  },
  {
    id: '7',
    name: 'Computer Engineering',
    slug: 'computer',
    shortName: 'CE',
    description: 'Computer systems, software development, and digital technology',
    category: 'technology'
  },
  {
    id: '8',
    name: 'Electrical Engineering',
    slug: 'electrical',
    shortName: 'EE',
    description: 'Power systems, electrical machines, and energy technology',
    category: 'engineering'
  },
  {
    id: '9',
    name: 'Electronics and Communication Engineering',
    slug: 'electronics-communication',
    shortName: 'ECE',
    description: 'Electronics, telecommunications, and signal processing',
    category: 'engineering'
  },
  {
    id: '10',
    name: 'Information and Communication Technology',
    slug: 'ict',
    shortName: 'ICT',
    description: 'Information systems, networking, and communication technology',
    category: 'technology'
  },
  {
    id: '11',
    name: 'Information Technology',
    slug: 'information-technology',
    shortName: 'IT',
    description: 'Software development, databases, and IT infrastructure',
    category: 'technology'
  },
  {
    id: '12',
    name: 'Instrumentation and Control Engineering',
    slug: 'instrumentation-control',
    shortName: 'ICE',
    description: 'Process control, measurement systems, and industrial automation',
    category: 'engineering'
  },
  {
    id: '13',
    name: 'Mechanical Engineering',
    slug: 'mechanical',
    shortName: 'ME',
    description: 'Mechanical systems, thermal engineering, and manufacturing',
    category: 'engineering'
  },
  {
    id: '14',
    name: 'Mechanical Engineering CAD/CAM',
    slug: 'mechanical-cadcam',
    shortName: 'ME CAD/CAM',
    description: 'Computer-aided design, manufacturing, and digital fabrication',
    category: 'engineering'
  },
  {
    id: '15',
    name: 'Plastic Engineering',
    slug: 'plastic',
    shortName: 'PE',
    description: 'Polymer technology, plastic processing, and materials engineering',
    category: 'engineering'
  },
];

export const getDepartmentBySlug = (slug: string): Department | undefined => {
  return departments.find(dept => dept.slug === slug);
};

export const getDepartmentsByCategory = (category: Department['category']): Department[] => {
  return departments.filter(dept => dept.category === category);
};

export const searchDepartments = (query: string): Department[] => {
  if (!query) return departments;
  
  const lowercaseQuery = query.toLowerCase();
  return departments.filter(dept => 
    dept.name.toLowerCase().includes(lowercaseQuery) ||
    dept.shortName.toLowerCase().includes(lowercaseQuery) ||
    dept.description.toLowerCase().includes(lowercaseQuery)
  );
};