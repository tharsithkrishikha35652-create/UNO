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

  { code: 'CS23701', name: 'Emerging Technology Course I', credits: 4, semester: 7 },
  { code: 'CS23702', name: 'Emerging Technology Course II', credits: 3, semester: 7 },
  { code: '', name: 'Industry Oriented Course III', credits: 1, semester: 7 },
  { code: 'PE-IV', name: 'Professional Elective IV', credits: 3, semester: 7, electiveSlot: 'Professional Elective IV' },
  { code: 'PE-V', name: 'Professional Elective V', credits: 3, semester: 7, electiveSlot: 'Professional Elective V' },
  { code: 'PE-VI', name: 'Professional Elective VI', credits: 3, semester: 7, electiveSlot: 'Professional Elective VI' },

  { code: 'CS23801', name: 'Project Work / Internship cum Project Work', credits: 8, semester: 8 },
] as const;

export const ECE_GPA_COURSES: readonly GpaCourse[] = [
  // Semester 1 (23 credits)
  { code: 'EN23C03', name: 'Foundation English', credits: 3, semester: 1 },
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

export function getGpaCourses(department?: string): readonly GpaCourse[] {
  return department === 'ECE' ? ECE_GPA_COURSES : CSE_GPA_COURSES;
}

export function getAllGpaCourses(): readonly GpaCourse[] {
  return [...CSE_GPA_COURSES, ...ECE_GPA_COURSES];
}

// Preserve backwards-compatibility for existing code/tests expecting GPA_COURSES
export const GPA_COURSES: readonly GpaCourse[] = CSE_GPA_COURSES;
