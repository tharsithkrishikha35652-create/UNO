export interface GpaCourse {
  code: string;
  name: string;
  credits: number;
  semester: number;
  electiveSlot?: string;
}

export const CSE_GPA_COURSES: readonly GpaCourse[] = [
  { code: 'EN23C03', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 1 },
  {
    code: 'EE23C02',
    name: 'Fundamentals of Electrical and Electronics Engineering',
    credits: 3,
    semester: 1,
  },
  { code: 'CS23C04', name: 'Programming in C', credits: 4, semester: 1 },
  { code: 'CS23101', name: 'Computational Thinking', credits: 2, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C04', name: 'Discrete Mathematics', credits: 4, semester: 2 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 2 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modeling', credits: 4, semester: 2 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },
  { code: 'CS23201', name: 'Object Oriented Programming', credits: 3, semester: 2 },

  { code: 'MA23C05', name: 'Probability and Statistics', credits: 4, semester: 3 },
  { code: 'CS23301', name: 'Software Engineering', credits: 3, semester: 3 },
  { code: 'CS23U01', name: 'Standards - Computer Science & Engg.', credits: 1, semester: 3 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 3 },
  { code: 'CS23302', name: 'Data Structures', credits: 5, semester: 3 },
  { code: 'CS23303', name: 'Digital System Design', credits: 5, semester: 3 },
  { code: 'CS23304', name: 'Java Programming', credits: 5, semester: 3 },
  { code: '', name: 'Skill Development Course – I', credits: 2, semester: 3 },

  { code: 'MA23C03', name: 'Linear Algebra and Numerical Methods', credits: 4, semester: 4 },
  { code: 'CS23402', name: 'Computer Architecture', credits: 4, semester: 4 },
  { code: 'CS23403', name: 'Full Stack Technologies', credits: 4, semester: 4 },
  { code: 'CS23404', name: 'Design and Analysis of Algorithms', credits: 3, semester: 4 },
  { code: 'CS23401', name: 'Database Management Systems', credits: 5, semester: 4 },
  { code: '', name: 'Skill Development Course – II', credits: 2, semester: 4 },
  { code: '', name: 'Industry Oriented Course I', credits: 1, semester: 4 },

  { code: 'CS23501', name: 'Operating Systems', credits: 5, semester: 5 },
  { code: 'CS23502', name: 'Networks and Data Communication', credits: 5, semester: 5 },
  { code: 'CS23503', name: 'Theory of Computation', credits: 3, semester: 5 },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 5, electiveSlot: 'Open Elective I' },
  { code: 'CS23L01', name: 'Self Learning Course', credits: 1, semester: 5 },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: '', name: 'Industry Oriented Course – II', credits: 1, semester: 5 },
  { code: '', name: 'Skill Development Course – III', credits: 2, semester: 5 },

  { code: 'CS23601', name: 'Cryptography and System Security', credits: 4, semester: 6 },
  { code: 'CS23602', name: 'Compiler Design', credits: 4, semester: 6 },
  { code: 'CS23603', name: 'Machine Learning', credits: 5, semester: 6 },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 6, electiveSlot: 'Open Elective II' },
  { code: 'CS23U02', name: 'Perspectives of Sustainability Development', credits: 3, semester: 6 },
  { code: 'CS23604', name: 'Creative and Innovative Project', credits: 2, semester: 6 },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },

  { code: 'ETC-I', name: 'Emerging Technology Course I', credits: 4, semester: 7, electiveSlot: 'Emerging Technology Course I' },
  { code: 'ETC-II', name: 'Emerging Technology Course II', credits: 3, semester: 7, electiveSlot: 'Emerging Technology Course II' },
  { code: '', name: 'Industry Oriented Course III', credits: 1, semester: 7 },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 7, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },

  { code: 'CS23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const ECE_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (23 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modelling', credits: 4, semester: 1 },
  { code: 'CS23C04', name: 'Programming in C', credits: 4, semester: 1 },
  { code: 'ME23C04', name: 'Maker space', credits: 3, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (24 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C02', name: 'Ordinary Differential Equations and Transform Techniques', credits: 4, semester: 2 },
  { code: 'EC23C03', name: 'Electronic Devices', credits: 4, semester: 2 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 2 },
  { code: 'EC23C06', name: 'Data Structures and Programming in C++', credits: 4, semester: 2 },
  { code: 'EC23C04', name: 'Circuit Analysis', credits: 4, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (22 credits)
  { code: 'MA23C03', name: 'Linear Algebra and Numerical Methods', credits: 4, semester: 3 },
  { code: 'EC23301', name: 'Electromagnetic Fields', credits: 3, semester: 3 },
  { code: 'EC23C13', name: 'Digital Electronics and System Design', credits: 4, semester: 3 },
  { code: 'EC23302', name: 'Signals and Systems', credits: 3, semester: 3 },
  { code: 'EC23C02', name: 'Analog Circuits Design', credits: 4, semester: 3 },
  { code: 'EC23S01', name: 'Skill Development Course – I', credits: 2, semester: 3 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 3 },

  // Semester 4 (24 credits)
  { code: 'EC23401', name: 'Digital Signal Processing', credits: 4, semester: 4 },
  { code: 'EC23402', name: 'Transmission Lines', credits: 3, semester: 4 },
  { code: 'EC23403', name: 'Analog and Baseband Communication', credits: 4, semester: 4 },
  { code: 'EC23C05', name: 'Analog Electronic System Design', credits: 4, semester: 4 },
  { code: 'EC23C10', name: 'Computer Architecture and Organization', credits: 3, semester: 4 },
  { code: 'EC23C11', name: 'Control Systems', credits: 3, semester: 4 },
  { code: 'EC23S02', name: 'Skill Development Course – II', credits: 2, semester: 4 },
  { code: 'EC23L01', name: 'Self Learning Course', credits: 1, semester: 4 },

  // Semester 5 (23 credits)
  { code: 'EC23501', name: 'Antenna and Wave Propagation', credits: 4, semester: 5 },
  { code: 'EC23502', name: 'Digital Communication', credits: 4, semester: 5 },
  { code: 'EC23C21', name: 'Microprocessors and Microcontrollers', credits: 4, semester: 5 },
  { code: 'EC23503', name: 'Communication Networks', credits: 4, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course I', credits: 1, semester: 5 },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 5 },

  // Semester 6 (23 credits)
  { code: 'EC23C14', name: 'Digital VLSI Design', credits: 4, semester: 6 },
  { code: 'EC23601', name: 'Wireless Communications', credits: 4, semester: 6 },
  { code: 'EC23602', name: 'Machine Learning', credits: 3, semester: 6 },
  { code: 'ETC-I', name: 'Emerging Technology Course I', credits: 3, semester: 6, electiveSlot: 'Emerging Technology Course I' },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'EC23S03', name: 'Skill Development Course – III', credits: 2, semester: 6 },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course II', credits: 1, semester: 6 },
  { code: 'EC23U02', name: 'Perspectives of Sustainable Development', credits: 3, semester: 6 },

  // Semester 7 (23 credits)
  { code: 'EC23701', name: 'Millimeter Wave and Optical Communication', credits: 4, semester: 7 },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 7, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 7, electiveSlot: 'Professional Elective III' },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 7, electiveSlot: 'Professional Elective IV' },
  { code: 'ETC-II', name: 'Emerging Technology Course II', credits: 3, semester: 7, electiveSlot: 'Emerging Technology Course II' },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'EC23702', name: 'Mini Project', credits: 2, semester: 7 },
  { code: 'EC23703', name: 'Industry Oriented Course III', credits: 1, semester: 7 },
  { code: 'EC23U01', name: 'Standards – Electronics and Communication Engineering', credits: 1, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'EC23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const CIVIL_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (26 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 1 },
  {
    code: 'EE23C02',
    name: 'Fundamentals of Electrical and Electronics Engineering',
    credits: 3,
    semester: 1,
  },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modelling', credits: 4, semester: 1 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (23 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  {
    code: 'MA23C02',
    name: 'Ordinary Differential Equations and Transform Techniques',
    credits: 4,
    semester: 2,
  },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 2 },
  { code: 'CS23C04', name: 'Programming in C', credits: 4, semester: 2 },
  { code: 'GY23C01', name: 'Engineering Geology', credits: 3, semester: 2 },
  { code: 'ME23C03', name: 'Engineering Mechanics', credits: 4, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (26 credits)
  { code: 'CE23301', name: 'Strength of Materials - I', credits: 4, semester: 3 },
  { code: 'CE23302', name: 'Construction Engineering', credits: 4, semester: 3 },
  { code: 'CE23303', name: 'Fluid Mechanics', credits: 4, semester: 3 },
  { code: 'CE23304', name: 'Railways, Airports and Harbour Engineering', credits: 3, semester: 3 },
  { code: 'CE23305', name: 'Water Supply Engineering', credits: 4, semester: 3 },
  { code: 'CE23C04', name: 'Principles of Surveying', credits: 5, semester: 3 },
  { code: 'CE23S01', name: 'Skill Development Course – I', credits: 2, semester: 3 },

  // Semester 4 (26 credits)
  { code: 'CE23401', name: 'Strength of Materials - II', credits: 3, semester: 4 },
  { code: 'CE23402', name: 'Soil Mechanics', credits: 5, semester: 4 },
  { code: 'CE23403', name: 'Applied Hydraulic Engineering', credits: 4, semester: 4 },
  { code: 'CE23404', name: 'Highway Engineering', credits: 5, semester: 4 },
  { code: 'CE23405', name: 'Waste Water Engineering', credits: 4, semester: 4 },
  { code: 'CE23U01', name: 'Standards – Civil Engineering', credits: 1, semester: 4 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 4 },
  { code: 'CE23S02', name: 'Skill Development Course – II', credits: 2, semester: 4 },

  // Semester 5 (25 credits)
  { code: 'CE23501', name: 'Structural Analysis - I', credits: 3, semester: 5 },
  { code: 'CE23502', name: 'Design of Reinforced Cement Concrete Structures', credits: 3, semester: 5 },
  { code: 'CE23503', name: 'Foundation Engineering', credits: 3, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 5, electiveSlot: 'Professional Elective II' },
  { code: 'CE23504', name: 'Environmental Engineering Drawing', credits: 1, semester: 5 },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 5, electiveSlot: 'Open Elective I' },
  { code: 'CE23U02', name: 'Perspectives of Sustainable Development', credits: 3, semester: 5 },
  { code: 'CE23S03', name: 'Skill Development Course – III', credits: 2, semester: 5 },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course I', credits: 1, semester: 5 },

  // Semester 6 (21 credits)
  { code: 'CE23601', name: 'Structural Analysis - II', credits: 3, semester: 6 },
  { code: 'CE23602', name: 'Design of Steel Structures', credits: 3, semester: 6 },
  { code: 'CE23603', name: 'Building and Structural Drawing', credits: 2, semester: 6 },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 6, electiveSlot: 'Open Elective II' },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 6 },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course II', credits: 1, semester: 6 },
  { code: 'ETC-I', name: 'Emerging Technology Course I', credits: 3, semester: 6, electiveSlot: 'Emerging Technology Course I' },

  // Semester 7 (21 credits)
  { code: 'CE23701', name: 'Irrigation Engineering', credits: 4, semester: 7 },
  { code: 'CE23702', name: 'Estimation, Costing and Valuation Engineering', credits: 3, semester: 7 },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 7, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course III', credits: 1, semester: 7 },
  { code: 'ETC-II', name: 'Emerging Technology Course II', credits: 3, semester: 7, electiveSlot: 'Emerging Technology Course II' },
  { code: 'CE23L01', name: 'Self-Learning Course', credits: 1, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'CE23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const GEO_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (27 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing & 3D Modelling', credits: 4, semester: 1 },
  {
    code: 'EE23C02',
    name: 'Fundamentals of Electrical and Electronics Engineering',
    credits: 3,
    semester: 1,
  },
  { code: 'CS23C04', name: 'Programming in C', credits: 4, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (21 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  {
    code: 'MA23C02',
    name: 'Ordinary Differential Equations and Transform Techniques',
    credits: 4,
    semester: 2,
  },
  {
    code: 'PH23C02',
    name: 'Principles and Applications of Electromagnetic radiation in Remote Sensing',
    credits: 3,
    semester: 2,
  },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 2 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 2 },
  { code: 'GI23201', name: 'Geoinformatics Systems', credits: 3, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (24 credits)
  { code: 'MA23C05', name: 'Probability and Statistics', credits: 4, semester: 3 },
  { code: 'CS23C02', name: 'Computer Programming in Python', credits: 4, semester: 3 },
  { code: 'GI23301', name: 'Spatial Database Management System', credits: 3, semester: 3 },
  { code: 'GI23302', name: 'Surveying', credits: 5, semester: 3 },
  { code: 'GI23303', name: 'Remote Sensing', credits: 3, semester: 3 },
  { code: 'GI23304', name: 'Principles of Photogrammetry', credits: 3, semester: 3 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 3 },

  // Semester 4 (25 credits)
  { code: 'GI23401', name: 'Cartography and GIS', credits: 5, semester: 4 },
  { code: 'GI23402', name: 'Electronic Surveying', credits: 5, semester: 4 },
  { code: 'GI23403', name: 'Digital Image Processing', credits: 5, semester: 4 },
  { code: 'GI23404', name: 'Geodesy', credits: 3, semester: 4 },
  { code: 'GI23405', name: 'Hyperspectral & Thermal Remote Sensing', credits: 3, semester: 4 },
  { code: 'GI23406', name: 'Environmental Sciences and Sustainability', credits: 2, semester: 4 },
  { code: 'GI23S01', name: 'Skill Development Course I', credits: 2, semester: 4 },

  // Semester 5 (27 credits)
  { code: 'GI23501', name: 'Microwave Remote Sensing', credits: 4, semester: 5 },
  { code: 'GI23502', name: 'Laser Scanning for Terrain Mapping', credits: 4, semester: 5 },
  { code: 'GI23503', name: 'Spatial Analytics', credits: 4, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: 'ETC-I', name: 'Emerging Technology Course – I', credits: 3, semester: 5, electiveSlot: 'Emerging Technology Course I' },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 5, electiveSlot: 'Open Elective I' },
  { code: 'GI23S02', name: 'Skill Development Course II', credits: 2, semester: 5 },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course I', credits: 1, semester: 5 },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 5 },

  // Semester 6 (24 credits)
  { code: 'GI23601', name: 'Geospatial Analysis with Python Programming', credits: 3, semester: 6 },
  { code: 'GI23602', name: 'Spatial Data Adjustment', credits: 3, semester: 6 },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 6, electiveSlot: 'Professional Elective IV' },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 6, electiveSlot: 'Open Elective II' },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course II', credits: 1, semester: 6 },
  { code: 'GI23S03', name: 'Skill Development Course III', credits: 2, semester: 6 },
  { code: 'UC23U02', name: 'Perspectives of Sustainable Development', credits: 3, semester: 6 },

  // Semester 7 (19 credits)
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'GI23701', name: 'Web and Cloud Based GIS', credits: 3, semester: 7 },
  { code: 'GI23702', name: 'Natural Resource Management with Geomatics', credits: 3, semester: 7 },
  { code: 'ETC-II', name: 'Emerging Technology Course - II', credits: 3, semester: 7, electiveSlot: 'Emerging Technology Course II' },
  { code: 'GI23703', name: 'Survey and Mapping Project with Standards', credits: 2, semester: 7 },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course III', credits: 1, semester: 7 },
  { code: 'GI23L01', name: 'Self-Learning Course', credits: 1, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'GI23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const BME_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (18 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 1 },
  { code: 'CS23C04', name: 'Programming in C', credits: 4, semester: 1 },
  { code: 'EE23C01', name: 'Basics of Electrical Engineering', credits: 2, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (27 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  {
    code: 'MA23C02',
    name: 'Ordinary Differential Equations and Transform Techniques',
    credits: 4,
    semester: 2,
  },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 2 },
  { code: 'ME23C03', name: 'Engineering Mechanics', credits: 4, semester: 2 },
  {
    code: 'BM23201',
    name: 'Data Structures and Object Oriented Programming in C++',
    credits: 4,
    semester: 2,
  },
  { code: 'BM23202', name: 'Anatomy and Physiology', credits: 4, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 2 },

  // Semester 3 (21 credits)
  { code: 'MA23C03', name: 'Linear Algebra and Numerical Methods', credits: 4, semester: 3 },
  { code: 'BM23301', name: 'Fundamentals of Biochemistry', credits: 3, semester: 3 },
  { code: 'EC23C04', name: 'Circuit Analysis', credits: 4, semester: 3 },
  { code: 'BM23302', name: 'Electronic Devices and Circuits', credits: 4, semester: 3 },
  { code: 'BM23303', name: 'Sensors and Measurements', credits: 4, semester: 3 },
  { code: 'BM23S01', name: 'Sensors and System Engineering', credits: 2, semester: 3 },

  // Semester 4 (23 credits)
  { code: 'BM23401', name: 'Biomedical Instrumentation', credits: 4, semester: 4 },
  { code: 'BM23402', name: 'Discrete Time Signal Processing', credits: 4, semester: 4 },
  { code: 'BM23403', name: 'Analog and Digital Integrated Circuits', credits: 5, semester: 4 },
  { code: 'BM23U01', name: 'Medical Standards and Regulations', credits: 3, semester: 4 },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 4, electiveSlot: 'Open Elective I' },
  {
    code: 'BM23S02',
    name: 'Design and Development of Lab prototype for Biomedical Applications',
    credits: 2,
    semester: 4,
  },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 4 },

  // Semester 5 (25 credits)
  { code: 'BM23501', name: 'Diagnostic and Therapeutic Equipment I', credits: 4, semester: 5 },
  { code: 'BM23502', name: 'Control System for Biomedical Engineering', credits: 3, semester: 5 },
  { code: 'BM23503', name: 'Microcontrollers and Embedded Systems', credits: 4, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 5, electiveSlot: 'Professional Elective II' },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course I', credits: 1, semester: 5 },
  { code: 'BM23U02', name: 'Perspectives of Sustainable Development', credits: 3, semester: 5 },
  { code: 'BM23504', name: 'Summer Internship', credits: 2, semester: 5 },
  { code: 'BM23S03', name: 'Design and Development of Wearable biosensors', credits: 2, semester: 5 },

  // Semester 6 (24 credits)
  { code: 'BM23601', name: 'Diagnostic and Therapeutic Equipment II', credits: 4, semester: 6 },
  { code: 'BM23602', name: 'Biomechanics', credits: 4, semester: 6 },
  { code: 'BM23C02', name: 'Radiological Equipment', credits: 3, semester: 6 },
  { code: 'ETC-I', name: 'Emerging Technology Course I', credits: 3, semester: 6, electiveSlot: 'Emerging Technology Course I' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 6, electiveSlot: 'Open Elective II' },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 6 },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course II', credits: 1, semester: 6 },

  // Semester 7 (23 credits)
  { code: 'BM23701', name: 'Digital Image Processing', credits: 4, semester: 7 },
  { code: 'ETC-II', name: 'Emerging Technology Course II', credits: 3, semester: 7, electiveSlot: 'Emerging Technology Course II' },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 7, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'BM23L01', name: 'Self-learning Course', credits: 1, semester: 7 },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course III', credits: 1, semester: 7 },
  { code: 'BM23703', name: 'Hospital Training (4 weeks)', credits: 3, semester: 7 },
  { code: 'BM23704', name: 'Mini Project', credits: 2, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'BM23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const IT_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (26 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modeling', credits: 4, semester: 1 },
  {
    code: 'EE23C02',
    name: 'Fundamentals of Electrical and Electronics Engineering',
    credits: 3,
    semester: 1,
  },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (23 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C03', name: 'Linear Algebra and Numerical Methods', credits: 4, semester: 2 },
  {
    code: 'PH23C08',
    name: 'Fundamentals of Electronic Materials and Devices',
    credits: 3,
    semester: 2,
  },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 2 },
  { code: 'CS23C04', name: 'Programming in C', credits: 4, semester: 2 },
  { code: 'IT23201', name: 'Information Technology Essentials', credits: 4, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (21 credits)
  { code: 'MA23C09', name: 'Finite State Automata and Discrete Structures', credits: 4, semester: 3 },
  { code: 'IT23301', name: 'Digital Logic and Design', credits: 4, semester: 3 },
  { code: 'IT23302', name: 'Data Structures', credits: 4, semester: 3 },
  { code: 'IT23303', name: 'Database Management Systems', credits: 4, semester: 3 },
  { code: 'IT23304', name: 'Object Oriented Programming', credits: 2, semester: 3 },
  { code: 'IT23U01', name: 'Standards – IT', credits: 1, semester: 3 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 3 },

  // Semester 4 (24 credits)
  { code: 'MA23C05', name: 'Probability and Statistics', credits: 4, semester: 4 },
  { code: 'IT23401', name: 'Advanced Data Structures', credits: 4, semester: 4 },
  { code: 'IT23C01', name: 'Design and Analysis of Algorithms', credits: 3, semester: 4 },
  { code: 'IT23402', name: 'Computer Organization and Architecture', credits: 3, semester: 4 },
  { code: 'IT23403', name: 'Software Engineering', credits: 3, semester: 4 },
  { code: 'IT23C02', name: 'Operating Systems', credits: 4, semester: 4 },
  { code: 'IT23L01', name: 'Self-Learning Course', credits: 1, semester: 4 },
  { code: 'IT23S01', name: 'Skill Development Course I', credits: 2, semester: 4 },

  // Semester 5 (25 credits)
  { code: 'IT23501', name: 'Computer Networks', credits: 4, semester: 5 },
  { code: 'IT23502', name: 'Web Programming', credits: 4, semester: 5 },
  { code: 'IT23503', name: 'Compiler Design', credits: 3, semester: 5 },
  { code: 'IT23504', name: 'Machine Learning', credits: 4, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 5 },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course I', credits: 1, semester: 5 },
  { code: 'IT23S02', name: 'Skill Development Course II', credits: 2, semester: 5 },
  { code: 'IT23505', name: 'Societal Oriented Project', credits: 1, semester: 5 },

  // Semester 6 (25 credits)
  { code: 'IT23601', name: 'Distributed Systems and Computing', credits: 3, semester: 6 },
  { code: 'IT23602', name: 'Natural Language and Image Processing', credits: 4, semester: 6 },
  { code: 'ETC-I', name: 'Emerging Technology Course I', credits: 3, semester: 6, electiveSlot: 'Emerging Technology Course I' },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'IT23S03', name: 'Skill Development Course III', credits: 2, semester: 6 },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course II', credits: 1, semester: 6 },
  { code: 'IT23U02', name: 'Perspectives of Sustainability Development', credits: 3, semester: 6 },

  // Semester 7 (22 credits)
  { code: 'IT23701', name: 'Cryptography and Network Security', credits: 4, semester: 7 },
  { code: 'ETC-II', name: 'Emerging Technology Course II', credits: 3, semester: 7, electiveSlot: 'Emerging Technology Course II' },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 7, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course III', credits: 1, semester: 7 },
  { code: 'IT23702', name: 'Software Development Project Laboratory', credits: 2, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'IT23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const EEE_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (28 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modeling', credits: 4, semester: 1 },
  { code: 'ME23C05', name: 'Basics of Mechanical Engineering', credits: 2, semester: 1 },
  { code: 'CE23C03', name: 'Basic Civil Engineering', credits: 2, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },
  { code: 'CS23C04', name: 'Programming in C', credits: 4, semester: 1 },

  // Semester 2 (22 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C02', name: 'Ordinary Differential Equations and Transform Techniques', credits: 4, semester: 2 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 2 },
  { code: 'PH23C10', name: 'Electronic Properties of Materials', credits: 3, semester: 2 },
  { code: 'ME23C03', name: 'Engineering Mechanics', credits: 4, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 2 },

  // Semester 3 (24 credits)
  { code: 'MA23C03', name: 'Linear Algebra and Numerical Methods', credits: 4, semester: 3 },
  { code: 'EE23301', name: 'Electrical Circuit Analysis', credits: 4, semester: 3 },
  { code: 'EE23302', name: 'Electromagnetic Theory', credits: 4, semester: 3 },
  { code: 'EE23303', name: 'Digital Electronics', credits: 4, semester: 3 },
  { code: 'EE23304', name: 'Analog Electronics', credits: 4, semester: 3 },
  { code: 'EE23S01', name: 'Skill Development Course I', credits: 2, semester: 3 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 3 },

  // Semester 4 (26 credits)
  { code: 'EE23401', name: 'Signal and Systems for Electrical Engineers', credits: 4, semester: 4 },
  { code: 'EE23402', name: 'Electrical Machines - I', credits: 3, semester: 4 },
  { code: 'EE23403', name: 'Measurement and Instrumentation', credits: 4, semester: 4 },
  { code: 'EE23404', name: 'Microprocessors and Microcontrollers', credits: 4, semester: 4 },
  { code: 'EE23405', name: 'Transmission and Distribution', credits: 3, semester: 4 },
  { code: 'ETC-I', name: 'Emerging Technology Course I', credits: 4, semester: 4, electiveSlot: 'Emerging Technology Course I' },
  { code: 'EE23S02', name: 'Skill Development Course II', credits: 2, semester: 4 },
  { code: 'EE23406', name: 'Electrical Machines Laboratory – I', credits: 2, semester: 4 },

  // Semester 5 (25 credits)
  { code: 'EE23501', name: 'Electrical Machines – II', credits: 3, semester: 5 },
  { code: 'EE23502', name: 'Control Systems Design', credits: 4, semester: 5 },
  { code: 'EE23503', name: 'Power System Analysis', credits: 4, semester: 5 },
  { code: 'EE23504', name: 'Power Electronics', credits: 4, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course I', credits: 1, semester: 5 },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 5 },
  { code: 'EE23L01', name: 'Self-Learning Course', credits: 1, semester: 5 },
  { code: 'EE23505', name: 'Electrical Machines Laboratory – II', credits: 2, semester: 5 },

  // Semester 6 (23 credits)
  { code: 'EE23601', name: 'Power System Operation and Control', credits: 4, semester: 6 },
  { code: 'EE23602', name: 'Protection and Switchgear', credits: 4, semester: 6 },
  { code: 'EE23U02', name: 'Sustainable Development – Electrical Engineering', credits: 3, semester: 6 },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'EE23S03', name: 'Skill Development Course – III', credits: 2, semester: 6 },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course II', credits: 1, semester: 6 },

  // Semester 7 (22 credits)
  { code: 'EE23701', name: 'High Voltage Engineering', credits: 4, semester: 7 },
  { code: 'ETC-II', name: 'Emerging Technology Course II', credits: 4, semester: 7, electiveSlot: 'Emerging Technology Course II' },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 7, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course III', credits: 1, semester: 7 },
  { code: 'EE23U01', name: 'Standards - Electrical Engineering', credits: 1, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'EE23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const MFG_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (29 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modelling', credits: 4, semester: 1 },
  { code: 'CS23C02', name: 'Computer Programming in Python', credits: 4, semester: 1 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 1 },

  // Semester 2 (21 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C02', name: 'Ordinary Differential Equations and Transform Techniques', credits: 4, semester: 2 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 2 },
  { code: 'EE23C03', name: 'Basics of Electrical and Electronics Engineering', credits: 3, semester: 2 },
  { code: 'MF23201', name: 'Evolution of Manufacturing Engineering', credits: 2, semester: 2 },
  { code: 'ME23C03', name: 'Engineering Mechanics', credits: 4, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (24 credits)
  { code: 'MF23301', name: 'Thermodynamics and Heat Transfer', credits: 4, semester: 3 },
  { code: 'MF23302', name: 'Casting and Welding Technology', credits: 3, semester: 3 },
  { code: 'MF23303', name: 'Forming Technology', credits: 3, semester: 3 },
  { code: 'MF23304', name: 'Engineering Materials and Metallurgy', credits: 4, semester: 3 },
  { code: 'CE23C01', name: 'Mechanics of Materials', credits: 4, semester: 3 },
  { code: 'CE23C02', name: 'Fluid Mechanics and Machinery', credits: 4, semester: 3 },
  { code: 'MF23S01', name: 'Skill Development - I', credits: 2, semester: 3 },

  // Semester 4 (23 credits)
  { code: 'MF23401', name: 'Machining Technology', credits: 4, semester: 4 },
  { code: 'ME23C15', name: 'Design of Machine Elements', credits: 3, semester: 4 },
  { code: 'ME23C11', name: 'Kinematics and Dynamics of Machinery', credits: 4, semester: 4 },
  { code: 'MF23402', name: 'Fluid Power Systems', credits: 3, semester: 4 },
  { code: 'MF23403', name: 'Computer Aided Design', credits: 4, semester: 4 },
  { code: 'MF23404', name: 'Additive Manufacturing', credits: 4, semester: 4 },
  { code: 'MF23L01', name: 'Self-Learning Course', credits: 1, semester: 4 },

  // Semester 5 (23 credits)
  { code: 'MF23501', name: 'CNC Machine Tools', credits: 4, semester: 5 },
  { code: 'MF23C02', name: 'Non-Traditional Machining Processes', credits: 3, semester: 5 },
  { code: 'MF23502', name: 'Metrology and Computer Aided Inspection', credits: 4, semester: 5 },
  { code: 'ETC-I', name: 'Emerging Technology Course 1', credits: 4, semester: 5, electiveSlot: 'Emerging Technology Course I' },
  { code: 'MF23U02', name: 'Perspectives of Sustainable Development in Manufacturing Engineering', credits: 3, semester: 5 },
  { code: 'MF23S02', name: 'Skill Development Course - II', credits: 2, semester: 5 },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course – I', credits: 1, semester: 5 },
  { code: 'MF23503', name: 'Summer Internship', credits: 2, semester: 5 },

  // Semester 6 (21 credits)
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 6, electiveSlot: 'Professional Elective I' },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 6, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 6, electiveSlot: 'Professional Elective V' },
  { code: 'OE-I', name: 'Open Elective – I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course – II', credits: 1, semester: 6 },
  { code: 'MF23601', name: 'Advanced Manufacturing Lab', credits: 2, semester: 6 },

  // Semester 7 (23 credits)
  { code: 'MF23701', name: 'Manufacturing Management Systems', credits: 3, semester: 7 },
  { code: 'ME23C12', name: 'Mechatronics and IoT', credits: 4, semester: 7 },
  { code: 'OE-II', name: 'Open Elective – II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'ETC-II', name: 'Emerging Technology Course- II', credits: 3, semester: 7, electiveSlot: 'Emerging Technology Course II' },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course – III', credits: 1, semester: 7 },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 7 },
  { code: 'MF23U01', name: 'Standards for Manufacturing Engineering', credits: 1, semester: 7 },
  { code: 'MF23S03', name: 'Skill Development - III', credits: 2, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'MF23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const VLSI_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (27 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modelling', credits: 4, semester: 1 },
  { code: 'CS23C04', name: 'Programming in C', credits: 4, semester: 1 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (24 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C02', name: 'Ordinary Differential Equations and Transform Techniques', credits: 4, semester: 2 },
  { code: 'EC23C03', name: 'Electronic Devices', credits: 4, semester: 2 },
  { code: 'EC23C06', name: 'Data Structures and Programming in C++', credits: 4, semester: 2 },
  { code: 'EC23C04', name: 'Circuit Analysis', credits: 4, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 2 },

  // Semester 3 (23 credits)
  { code: 'MA23C03', name: 'Linear Algebra and Numerical Methods', credits: 4, semester: 3 },
  { code: 'VL23301', name: 'MOS Device Physics and Simulation', credits: 4, semester: 3 },
  { code: 'EC23C13', name: 'Digital Electronics and System Design', credits: 4, semester: 3 },
  { code: 'VL23302', name: 'Fundamentals of Signals and Systems', credits: 3, semester: 3 },
  { code: 'EC23C02', name: 'Analog Circuits Design', credits: 4, semester: 3 },
  { code: 'VL23S01', name: 'Skill Development Course – I', credits: 2, semester: 3 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 3 },

  // Semester 4 (24 credits)
  { code: 'MA23C05', name: 'Probability and Statistics', credits: 4, semester: 4 },
  { code: 'VL23401', name: 'Discrete Time Signal Processing', credits: 4, semester: 4 },
  { code: 'VL23402', name: 'Analog and Digital Communication', credits: 3, semester: 4 },
  { code: 'EC23C05', name: 'Analog Electronic System Design', credits: 4, semester: 4 },
  { code: 'EC23C10', name: 'Computer Architecture and Organization', credits: 3, semester: 4 },
  { code: 'EC23C11', name: 'Control Systems', credits: 3, semester: 4 },
  { code: 'VL23S02', name: 'Skill Development Course – II', credits: 2, semester: 4 },
  { code: 'VL23L01', name: 'Self Learning Course', credits: 1, semester: 4 },

  // Semester 5 (24 credits)
  { code: 'VL23503', name: 'VLSI Design', credits: 4, semester: 5 },
  { code: 'VL23501', name: 'RTL Design and Logic Synthesis', credits: 3, semester: 5 },
  { code: 'EC23C21', name: 'Microprocessors and Microcontrollers', credits: 4, semester: 5 },
  { code: 'ETC-I', name: 'Emerging Technology - I', credits: 3, semester: 5, electiveSlot: 'Emerging Technology I' },
  { code: 'VL23502', name: 'Wireless Communication for VLSI Design', credits: 3, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective - I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course I / Summer Internship- I', credits: 1, semester: 5 },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 5 },

  // Semester 6 (24 credits)
  { code: 'VL23601', name: 'VLSI Verification and Testing', credits: 3, semester: 6 },
  { code: 'ETC-II', name: 'Emerging Technology - II', credits: 3, semester: 6, electiveSlot: 'Emerging Technology II' },
  { code: 'VL23602', name: 'Electromagnetic Interference and Compatibility for VLSI', credits: 3, semester: 6 },
  { code: 'PE-II', name: 'Professional Elective - II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective - III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'OE-I', name: 'Open Elective – I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'VL23S03', name: 'Skill Development Course – 3', credits: 2, semester: 6 },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course II', credits: 1, semester: 6 },
  { code: 'VL23U02', name: 'Sustainability Course', credits: 3, semester: 6 },

  // Semester 7 (22 credits)
  { code: 'VL23701', name: 'ASIC Design', credits: 3, semester: 7 },
  { code: 'VL23702', name: 'Embedded Systems', credits: 3, semester: 7 },
  { code: 'PE-IV', name: 'Professional Elective - IV', credits: 3, semester: 7, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective - V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective - VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'OE-II', name: 'Open Elective - II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'VL23703', name: 'Idea to Product', credits: 2, semester: 7 },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course III / Summer Internship- II', credits: 1, semester: 7 },
  { code: 'VL23U01', name: 'Standards - Electronics Engineering (VLSI Design and Technology)', credits: 1, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'VL23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const MECH_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (27 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modelling', credits: 4, semester: 1 },
  { code: 'ME23C03', name: 'Engineering Mechanics', credits: 4, semester: 1 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (22 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C02', name: 'Ordinary Differential Equations and Transform Techniques', credits: 4, semester: 2 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 2 },
  { code: 'CS23C02', name: 'Computer Programming in Python', credits: 4, semester: 2 },
  { code: 'EE23C03', name: 'Basics of Electrical and Electronics Engineering', credits: 3, semester: 2 },
  { code: 'ME23C06', name: 'Design Thinking', credits: 3, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (25 credits)
  { code: 'MA23C06', name: 'Partial Differential Equations and Complex Functions', credits: 4, semester: 3 },
  { code: 'ME23C11', name: 'Kinematics and Dynamics of Machinery', credits: 4, semester: 3 },
  { code: 'ME23C08', name: 'Engineering Thermodynamics', credits: 4, semester: 3 },
  { code: 'ME23301', name: 'Manufacturing Technology', credits: 4, semester: 3 },
  { code: 'MS23C01', name: 'Engineering Materials and Metallurgy', credits: 3, semester: 3 },
  { code: 'CE23C01', name: 'Mechanics of Materials', credits: 4, semester: 3 },
  { code: 'ME23S01', name: 'Skill Development Course I', credits: 2, semester: 3 },

  // Semester 4 (25 credits)
  { code: 'ME23401', name: 'Metal Cutting and Machine Tools', credits: 4, semester: 4 },
  { code: 'ME23402', name: 'Thermal Engineering - I', credits: 4, semester: 4 },
  { code: 'CE23C02', name: 'Fluid Mechanics and Machinery', credits: 4, semester: 4 },
  { code: 'ME23C15', name: 'Design of Machine Elements', credits: 3, semester: 4 },
  { code: 'ME23403', name: 'Fluid Power Automation', credits: 4, semester: 4 },
  { code: 'ME23404', name: 'Product Design and Development', credits: 3, semester: 4 },
  { code: 'ME23S02', name: 'Skill Development Course II', credits: 2, semester: 4 },
  { code: 'IOC_SEM4_I', name: 'Industry Oriented Course-1/ Industrial lecture', credits: 1, semester: 4 },

  // Semester 5 (27 credits)
  { code: 'ME23501', name: 'Metrology and Measurements', credits: 4, semester: 5 },
  { code: 'ME23502', name: 'Thermal Engineering II', credits: 4, semester: 5 },
  { code: 'ME23503', name: 'Project and Financial Management', credits: 3, semester: 5 },
  { code: 'ME23504', name: 'Design of Transmission Systems', credits: 3, semester: 5 },
  { code: 'ME23U02', name: 'Perspectives of Sustainable Development', credits: 3, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective - I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: 'IOC_SEM5_II', name: 'Industry Oriented Course II', credits: 1, semester: 5 },
  { code: 'ME23L01', name: 'Self-Learning Course', credits: 1, semester: 5 },
  { code: 'ME23S03', name: 'Skill Development Course III', credits: 2, semester: 5 },
  { code: 'ME23U01', name: 'Standards - Mechanical Engineering', credits: 1, semester: 5 },
  { code: 'ME23505', name: 'Computer Aided Machine Drawing', credits: 2, semester: 5 },

  // Semester 6 (21 credits)
  { code: 'PE-II', name: 'Professional Elective - II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective - III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'PE-IV', name: 'Professional Elective - IV', credits: 3, semester: 6, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective - V', credits: 3, semester: 6, electiveSlot: 'Professional Elective V' },
  { code: 'OE-I', name: 'Open Elective – I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'ETC-I', name: 'Emerging Technology Course - I', credits: 3, semester: 6, electiveSlot: 'Emerging Technology Course I' },
  { code: 'IOC_SEM6_III', name: 'Industry Oriented Course - III', credits: 1, semester: 6 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 6 },

  // Semester 7 (26 credits)
  { code: 'ME23C12', name: 'Mechatronics and IoT', credits: 4, semester: 7 },
  { code: 'ME23C09', name: 'Finite Element Analysis', credits: 3, semester: 7 },
  { code: 'ME23701', name: 'Heat and Mass Transfer', credits: 4, semester: 7 },
  { code: 'ETC-II', name: 'Emerging Technology Course – II', credits: 3, semester: 7, electiveSlot: 'Emerging Technology Course II' },
  { code: 'PE-VI', name: 'Professional Elective - VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'OE-II', name: 'Open Electives - II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 7 },
  { code: 'ME23702', name: 'Simulation and Analysis Laboratory', credits: 2, semester: 7 },
  { code: 'ME23703', name: 'Summer Internship', credits: 1, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'ME23801', name: 'Project Work / Internship Cum Project Work', credits: 8, semester: 8 },
] as const;

export const PT_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (28 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modelling', credits: 4, semester: 1 },
  { code: 'ME23C03', name: 'Engineering Mechanics', credits: 4, semester: 1 },
  { code: 'CS23C02', name: 'Computer Programming in Python', credits: 4, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (21 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C02', name: 'Ordinary Differential Equations and Transform Techniques', credits: 4, semester: 2 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 2 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 2 },
  { code: 'EE23C03', name: 'Basics of Electrical and Electronics Engineering', credits: 3, semester: 2 },
  { code: 'CY23C04', name: 'Chemistry for Printing Technology', credits: 3, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (26 credits)
  { code: 'MA23C05', name: 'Probability and Statistics', credits: 4, semester: 3 },
  { code: 'CE23C01', name: 'Mechanics of Materials', credits: 4, semester: 3 },
  { code: 'PP23301', name: 'Machine Kinematics and Maintenance', credits: 4, semester: 3 },
  { code: 'PP23302', name: 'Design for Print Media', credits: 3, semester: 3 },
  { code: 'PP23303', name: 'Flexography Printing and Converting', credits: 3, semester: 3 },
  { code: 'PP23304', name: 'Paper and Paperboard', credits: 4, semester: 3 },
  { code: 'PP23305', name: 'Prepress Laboratory', credits: 2, semester: 3 },
  { code: 'PP23S01', name: 'Skill Development Course – I', credits: 2, semester: 3 },

  // Semester 4 (25 credits)
  { code: 'ME23C12', name: 'Mechatronics and IOT', credits: 4, semester: 4 },
  { code: 'PP23401', name: 'Offset Printing Technology', credits: 3, semester: 4 },
  { code: 'PP23402', name: 'Prepress and Imaging Technology', credits: 5, semester: 4 },
  { code: 'PP23403', name: 'Packaging Techniques and Processes', credits: 4, semester: 4 },
  { code: 'PP23404', name: 'Packaging Materials I', credits: 3, semester: 4 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 4 },
  { code: 'PP23405', name: 'Printing Machine Laboratory', credits: 2, semester: 4 },
  { code: 'PP23S02', name: 'Skill Development Course II', credits: 2, semester: 4 },

  // Semester 5 (25 credits)
  { code: 'PP23501', name: 'Gravure and Screen Printing Technology', credits: 3, semester: 5 },
  { code: 'PP23502', name: 'Packaging Materials II', credits: 4, semester: 5 },
  { code: 'PP23503', name: 'Print Conversion Techniques', credits: 3, semester: 5 },
  { code: 'ETC-I', name: 'Emerging Technology Course I', credits: 3, semester: 5, electiveSlot: 'Emerging Technology Course I' },
  { code: 'PP23504', name: 'Print Operations Management', credits: 2, semester: 5 },
  { code: 'PP23U02', name: 'Perspectives of Sustainable Development – Printing and Packaging', credits: 3, semester: 5 },
  { code: 'PP23505', name: 'Printing Inks', credits: 2, semester: 5 },
  { code: 'PP23506', name: 'Print Conversion Laboratory', credits: 2, semester: 5 },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course – I', credits: 1, semester: 5 },
  { code: 'PP23S03', name: 'Skill Development Course III', credits: 2, semester: 5 },

  // Semester 6 (23 credits)
  { code: 'ETC-II', name: 'Emerging Technology Course II', credits: 3, semester: 6, electiveSlot: 'Emerging Technology Course II' },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 6, electiveSlot: 'Professional Elective I' },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 6, electiveSlot: 'Professional Elective IV' },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'PP23L01', name: 'Self-Learning Course', credits: 1, semester: 6 },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 6 },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course II', credits: 1, semester: 6 },

  // Semester 7 (23 credits)
  { code: 'PP23701', name: 'Costing and Estimating for Printing and Packaging', credits: 3, semester: 7 },
  { code: 'PP23702', name: 'Electronic Publishing', credits: 4, semester: 7 },
  { code: 'PP23703', name: 'Logistics and Supply Chain Management for Packaging', credits: 2, semester: 7 },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'PP23U01', name: 'Standards - Printing and Packaging Technology', credits: 1, semester: 7 },
  { code: 'PP23704', name: 'Summer Internship', credits: 1, semester: 7 },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course III', credits: 1, semester: 7 },
  { code: 'PP23705', name: 'Creative and Innovative Project', credits: 2, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'PP23801', name: 'Project Work / Internship with Project Work', credits: 8, semester: 8 },
] as const;

export const MINING_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (26 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 1 },
  { code: 'ME23C05', name: 'Basics of Mechanical Engineering', credits: 2, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing & 3D Modelling', credits: 4, semester: 1 },
  { code: 'CS23C02', name: 'Computer Programming in Python', credits: 4, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (22 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C02', name: 'Ordinary Differential Equations and Transform Techniques', credits: 4, semester: 2 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 2 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 2 },
  { code: 'ME23C03', name: 'Engineering Mechanics', credits: 4, semester: 2 },
  { code: 'EE23C03', name: 'Basics of Electrical and Electronics Engineering', credits: 3, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (21 credits)
  { code: 'MA23C07', name: 'Numerical and Statistical Methods', credits: 4, semester: 3 },
  { code: 'CE23C02', name: 'Fluid Mechanics and Machinery', credits: 4, semester: 3 },
  { code: 'CE23C04', name: 'Principles of Surveying', credits: 5, semester: 3 },
  { code: 'MI23301', name: 'Mine Development', credits: 3, semester: 3 },
  { code: 'GY23C03', name: 'Geology for Mining Engineering – I', credits: 3, semester: 3 },
  { code: 'GY23C04', name: 'Geology Laboratory – I & Field Work for Mining Engineering', credits: 2, semester: 3 },

  // Semester 4 (26 credits)
  { code: 'GY23C05', name: 'Geology for Mining Engineering – II', credits: 3, semester: 4 },
  { code: 'MI23401', name: 'Mine Surveying', credits: 3, semester: 4 },
  { code: 'MI23402', name: 'Mine Environment and Ventilation', credits: 4, semester: 4 },
  { code: 'IE23C06', name: 'Operations Research', credits: 3, semester: 4 },
  { code: 'MI23403', name: 'Mining Machinery-I', credits: 4, semester: 4 },
  { code: 'MI23404', name: 'Surface Mining', credits: 3, semester: 4 },
  { code: 'MI23U01', name: 'Standards – Mining Engineering', credits: 1, semester: 4 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 4 },
  { code: 'GY23C06', name: 'Geology Laboratory-II & Field Work for Mining Engineering', credits: 1, semester: 4 },
  { code: 'MI23S01', name: 'Skill Development Course – I', credits: 2, semester: 4 },

  // Semester 5 (26 credits)
  { code: 'MI23501', name: 'Mining Machinery-II', credits: 4, semester: 5 },
  { code: 'MI23502', name: 'Underground Mining Methods – Coal', credits: 3, semester: 5 },
  { code: 'MI23503', name: 'Rock Mechanics and Ground Control', credits: 4, semester: 5 },
  { code: 'MI23504', name: 'Underground Mining Methods – Metal', credits: 3, semester: 5 },
  { code: 'MI23U02', name: 'Perspectives of Sustainable Development', credits: 3, semester: 5 },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 5, electiveSlot: 'Professional Elective I' },
  { code: 'MI23L01', name: 'Self-Learning Course', credits: 1, semester: 5 },
  { code: 'MI23S02', name: 'Skill Development Course – II', credits: 2, semester: 5 },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course - I', credits: 1, semester: 5 },
  { code: 'MI23505', name: 'Industrial Training – I', credits: 2, semester: 5 },

  // Semester 6 (28 credits)
  { code: 'MI23601', name: 'Mine Economics and Investment', credits: 3, semester: 6 },
  { code: 'MI23602', name: 'Mineral Processing', credits: 4, semester: 6 },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 6, electiveSlot: 'Professional Elective IV' },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 6 },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course - II', credits: 1, semester: 6 },
  { code: 'MI23S03', name: 'Skill Development Course – III', credits: 2, semester: 6 },
  { code: 'MI23603', name: 'Advanced Rock Blasting Laboratory', credits: 2, semester: 6 },
  { code: 'MI23604', name: 'Mine Survey Camp', credits: 1, semester: 6 },

  // Semester 7 (28 credits)
  { code: 'MI23701', name: 'Mine Management, Legislation and General Safety', credits: 4, semester: 7 },
  { code: 'MI23702', name: 'Mine Digitalization and Automation', credits: 3, semester: 7 },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'MI23703', name: 'Mine Environmental Engineering', credits: 3, semester: 7 },
  { code: 'IE23C08', name: 'Project Management', credits: 3, semester: 7 },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course - III', credits: 1, semester: 7 },
  { code: 'MI23706', name: 'Computer Aided Mine Planning and Design (CAMPAD) Laboratory', credits: 2, semester: 7 },
  { code: 'MI23704', name: 'Comprehension', credits: 1, semester: 7 },
  { code: 'MI23705', name: 'Industrial Training – II', credits: 2, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'MI23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const MSE_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (27 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modelling', credits: 4, semester: 1 },
  { code: 'EE23C03', name: 'Basics of Electrical and Electronics Engineering', credits: 3, semester: 1 },
  { code: 'CS23C02', name: 'Computer Programming in Python', credits: 4, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (22 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C02', name: 'Ordinary Differential Equations and Transform Techniques', credits: 4, semester: 2 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 2 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 2 },
  { code: 'ME23C03', name: 'Engineering Mechanics', credits: 4, semester: 2 },
  { code: 'MS23201', name: 'Reaction Kinetics and Dynamics', credits: 3, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (24 credits)
  { code: 'MA23C06', name: 'Partial Differential Equations and Complex Functions', credits: 4, semester: 3 },
  { code: 'CY23C02', name: 'Polymers, Bio-materials and Ceramics', credits: 3, semester: 3 },
  { code: 'CE23C01', name: 'Mechanics of Materials', credits: 4, semester: 3 },
  { code: 'MS23301', name: 'Structure and Properties of Materials', credits: 3, semester: 3 },
  { code: 'MS23302', name: 'Metallurgical Thermodynamics', credits: 4, semester: 3 },
  { code: 'MS23303', name: 'Physical Metallurgy', credits: 4, semester: 3 },
  { code: 'MS23S01', name: 'Skill Development Course – I', credits: 2, semester: 3 },

  // Semester 4 (27 credits)
  { code: 'MS23401', name: 'Heat Treatment of Materials', credits: 4, semester: 4 },
  { code: 'MS23402', name: 'Casting and Welding Metallurgy', credits: 4, semester: 4 },
  { code: 'MS23403', name: 'Mechanical Metallurgy', credits: 3, semester: 4 },
  { code: 'MS23404', name: 'Powder Metallurgy', credits: 4, semester: 4 },
  { code: 'MS23405', name: 'Analytical Instrumentation Techniques', credits: 3, semester: 4 },
  { code: 'MS23406', name: 'Iron and Steel Making', credits: 3, semester: 4 },
  { code: 'MS23U01', name: 'Standards for Materials and Testing', credits: 1, semester: 4 },
  { code: 'MS23S02', name: 'Skill Development Course - II', credits: 2, semester: 4 },
  { code: 'MS23L01', name: 'Self-learning Course', credits: 1, semester: 4 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 4 },

  // Semester 5 (28 credits)
  { code: 'MS23501', name: 'Transport phenomena in Metallurgical Processes', credits: 3, semester: 5 },
  { code: 'MS23502', name: 'Theory and Applications of Material Forming', credits: 4, semester: 5 },
  { code: 'MS23503', name: 'Surface Engineering', credits: 4, semester: 5 },
  { code: 'MS23504', name: 'Composite Materials and Mechanics', credits: 4, semester: 5 },
  { code: 'MS23505', name: 'Introduction to Electronic Materials', credits: 3, semester: 5 },
  { code: 'MS23506', name: 'Characterization of Materials', credits: 4, semester: 5 },
  { code: 'ETC-I', name: 'Emerging Technology Course - I', credits: 3, semester: 5, electiveSlot: 'Emerging Technology Course I' },
  { code: 'MS23S03', name: 'Skill Development Course - III', credits: 2, semester: 5 },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course – I', credits: 1, semester: 5 },

  // Semester 6 (19 credits)
  { code: 'ETC-II', name: 'Emerging Technology Course – II', credits: 3, semester: 6, electiveSlot: 'Emerging Technology Course II' },
  { code: 'PE-I', name: 'Professional Elective I', credits: 3, semester: 6, electiveSlot: 'Professional Elective I' },
  { code: 'PE-II', name: 'Professional Elective II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course – II', credits: 1, semester: 6 },
  { code: 'OE-I', name: 'Open Elective I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'MS23U02', name: 'Perspectives of Sustainable Development', credits: 3, semester: 6 },

  // Semester 7 (25 credits)
  { code: 'MS23701', name: 'Computational Materials Engineering', credits: 4, semester: 7 },
  { code: 'MS23702', name: 'Non-Destructive Testing and Evaluation', credits: 4, semester: 7 },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 7 },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 7, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course – III', credits: 1, semester: 7 },
  { code: 'OE-II', name: 'Open Elective II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'MS23703', name: 'Mini Project / Summer Internship', credits: 1, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'MS23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const IE_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (28 credits)
  { code: 'EN23C05', name: 'Foundation English', credits: 3, semester: 1 },
  { code: 'MA23C11', name: 'Calculus', credits: 4, semester: 1 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4, semester: 1 },
  { code: 'ME23C01', name: 'Engineering Drawing and 3D Modelling', credits: 4, semester: 1 },
  { code: 'CY23C10', name: 'Engineering Chemistry', credits: 4, semester: 1 },
  { code: 'CS23C02', name: 'Computer Programming in Python', credits: 4, semester: 1 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1, semester: 1 },

  // Semester 2 (21 credits)
  { code: 'EN23C04', name: 'Professional Communication', credits: 3, semester: 2 },
  { code: 'MA23C02', name: 'Ordinary Differential Equations and Transform Techniques', credits: 4, semester: 2 },
  { code: 'PH23C03', name: 'Material Science', credits: 3, semester: 2 },
  { code: 'EE23C03', name: 'Basics of Electrical and Electronics Engineering', credits: 3, semester: 2 },
  { code: 'ME23C04', name: 'Makerspace', credits: 3, semester: 2 },
  { code: 'ME23C03', name: 'Engineering Mechanics', credits: 4, semester: 2 },
  { code: 'UC23H02', name: 'Tamils and Technology', credits: 1, semester: 2 },

  // Semester 3 (23 credits)
  { code: 'MA23C05', name: 'Probability and Statistics', credits: 4, semester: 3 },
  { code: 'IE23301', name: 'Work System Design', credits: 4, semester: 3 },
  { code: 'ME23C02', name: 'Manufacturing Processes', credits: 4, semester: 3 },
  { code: 'CE23C02', name: 'Fluid Mechanics and Machinery', credits: 4, semester: 3 },
  { code: 'CE23C01', name: 'Mechanics of Materials', credits: 4, semester: 3 },
  { code: 'IE23U01', name: 'Industrial Standards for Industrial Engineering', credits: 1, semester: 3 },
  { code: 'UC23U01', name: 'Universal Human Values', credits: 2, semester: 3 },

  // Semester 4 (23 credits)
  { code: 'IE23403', name: 'Mechanics of Machines', credits: 4, semester: 4 },
  { code: 'ME23C14', name: 'Thermodynamics and Heat Transfer', credits: 3, semester: 4 },
  { code: 'IE23401', name: 'Applied Ergonomics', credits: 4, semester: 4 },
  { code: 'IE23404', name: 'Operations Research', credits: 4, semester: 4 },
  { code: 'IE23402', name: 'Manufacturing Automation', credits: 3, semester: 4 },
  { code: 'ME23C06', name: 'Design Thinking', credits: 3, semester: 4 },
  { code: 'IE23S01', name: 'Skill Development Course - I', credits: 2, semester: 4 },

  // Semester 5 (28 credits)
  { code: 'IE23501', name: 'Production and Operations Management', credits: 4, semester: 5 },
  { code: 'IE23C01', name: 'Engineering Quality Control', credits: 4, semester: 5 },
  { code: 'IE23C07', name: 'Total Quality Management', credits: 3, semester: 5 },
  { code: 'ME23C17', name: 'Machine Design', credits: 4, semester: 5 },
  { code: 'IE23502', name: 'Design of Experiments', credits: 4, semester: 5 },
  { code: 'IE23503', name: 'Reliability Engineering', credits: 3, semester: 5 },
  { code: 'IOC_SEM5_I', name: 'Industry Oriented Course- I', credits: 1, semester: 5 },
  { code: 'UC23E01', name: 'Engineering Entrepreneurship Development', credits: 3, semester: 5 },
  { code: 'IE23S02', name: 'Skill Development Course-II', credits: 2, semester: 5 },

  // Semester 6 (23 credits)
  { code: 'PE-I', name: 'Professional Elective Course- I', credits: 3, semester: 6, electiveSlot: 'Professional Elective I' },
  { code: 'PE-II', name: 'Professional Elective Course- II', credits: 3, semester: 6, electiveSlot: 'Professional Elective II' },
  { code: 'PE-III', name: 'Professional Elective Course- III', credits: 3, semester: 6, electiveSlot: 'Professional Elective III' },
  { code: 'PE-IV', name: 'Professional Elective Course- IV', credits: 3, semester: 6, electiveSlot: 'Professional Elective IV' },
  { code: 'ETC-I', name: 'Emerging Technology Course I', credits: 3, semester: 6, electiveSlot: 'Emerging Technology Course I' },
  { code: 'OE-I', name: 'Open Elective – I', credits: 3, semester: 6, electiveSlot: 'Open Elective I' },
  { code: 'ETC-II', name: 'Emerging Technology Course II', credits: 3, semester: 6, electiveSlot: 'Emerging Technology Course II' },
  { code: 'IOC_SEM6_II', name: 'Industry Oriented Course- II', credits: 1, semester: 6 },
  { code: 'IE23L01', name: 'Self-Learning Course', credits: 1, semester: 6 },

  // Semester 7 (27 credits)
  { code: 'IE23701', name: 'Applied Multivariate Analysis', credits: 4, semester: 7 },
  { code: 'IE23702', name: 'Simulation Modelling and Analysis', credits: 4, semester: 7 },
  { code: 'IE23703', name: 'Supply Chain Management', credits: 4, semester: 7 },
  { code: 'PE-V', name: 'Professional Elective Course- V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective Course- VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },
  { code: 'IE23U02', name: 'Perspective of Sustainable Development', credits: 3, semester: 7 },
  { code: 'OE-II', name: 'Open Elective - II', credits: 3, semester: 7, electiveSlot: 'Open Elective II' },
  { code: 'IOC_SEM7_III', name: 'Industry Oriented Course-III', credits: 1, semester: 7 },
  { code: 'IE23S03', name: 'Skill Development Course-III', credits: 2, semester: 7 },

  // Semester 8 (8 credits)
  { code: 'IE23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export function getGpaCourses(department?: string): readonly GpaCourse[] {
  let list: readonly GpaCourse[];
  if (department === 'ECE') list = ECE_GPA_COURSES;
  else if (department === 'CIVIL' || department === 'CE') list = CIVIL_GPA_COURSES;
  else if (department === 'GEO' || department === 'GI' || department === 'GEOINFORMATICS') list = GEO_GPA_COURSES;
  else if (department === 'BME' || department === 'BM' || department === 'BIOMEDICAL') list = BME_GPA_COURSES;
  else if (department === 'IT' || department === 'INFORMATION_TECHNOLOGY' || department === 'INFOTECH') list = IT_GPA_COURSES;
  else if (department === 'EEE' || department === 'ELECTRICAL') list = EEE_GPA_COURSES;
  else if (department === 'MFG' || department === 'MANUFACTURING') list = MFG_GPA_COURSES;
  else if (department === 'VLSI' || department === 'ELECTRONICS_VLSI') list = VLSI_GPA_COURSES;
  else if (department === 'MECH' || department === 'MECHANICAL') list = MECH_GPA_COURSES;
  else if (department === 'PT' || department === 'PRINTING' || department === 'PPT') list = PT_GPA_COURSES;
  else if (department === 'MINING' || department === 'MINE' || department === 'MN' || department === 'MI') list = MINING_GPA_COURSES;
  else if (department === 'MSE' || department === 'MATSCI' || department === 'MS') list = MSE_GPA_COURSES;
  else if (department === 'IE' || department === 'INDUSTRIAL') list = IE_GPA_COURSES;
  else list = CSE_GPA_COURSES;
  return list;
}

export function getAllGpaCourses(): readonly GpaCourse[] {
  return [
    ...CSE_GPA_COURSES,
    ...ECE_GPA_COURSES,
    ...CIVIL_GPA_COURSES,
    ...GEO_GPA_COURSES,
    ...BME_GPA_COURSES,
    ...IT_GPA_COURSES,
    ...EEE_GPA_COURSES,
    ...MFG_GPA_COURSES,
    ...VLSI_GPA_COURSES,
    ...MECH_GPA_COURSES,
    ...PT_GPA_COURSES,
    ...MINING_GPA_COURSES,
    ...MSE_GPA_COURSES,
    ...IE_GPA_COURSES,
  ];
}

// Preserve backwards-compatibility for existing code/tests expecting GPA_COURSES
export const GPA_COURSES: readonly GpaCourse[] = CSE_GPA_COURSES;
