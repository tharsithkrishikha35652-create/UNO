import React, { useState, useEffect } from 'react';
import { X, Check, BookOpen } from 'lucide-react';
import { CourseType } from '../types';

export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface PresetCourse {
  id: string;
  name: string;
  code: string;
  type: string;
  courseType: CourseType;
  semester: SemesterNumber;
  group?: 'core' | 'elective';
  electiveSlot?: string;
}

export const CSE_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Open Elective I', 'Professional Elective I'],
  6: ['Open Elective II', 'Professional Elective II', 'Professional Elective III'],
  7: ['Professional Elective IV', 'Professional Elective V', 'Professional Elective VI'],
};

export const ECE_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Professional Elective I'],
  6: ['Emerging Technology Course I', 'Open Elective I'],
  7: [
    'Professional Elective II',
    'Professional Elective III',
    'Professional Elective IV',
    'Emerging Technology Course II',
    'Open Elective II',
  ],
};

export const CIVIL_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Professional Elective I', 'Professional Elective II', 'Open Elective I'],
  6: ['Professional Elective III', 'Open Elective II', 'Emerging Technology Course I'],
  7: [
    'Professional Elective IV',
    'Professional Elective V',
    'Professional Elective VI',
    'Emerging Technology Course II',
  ],
};

export const GEO_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Professional Elective I', 'Emerging Technology Course I', 'Open Elective I'],
  6: ['Professional Elective II', 'Professional Elective III', 'Professional Elective IV', 'Open Elective II'],
  7: [
    'Professional Elective V',
    'Professional Elective VI',
    'Emerging Technology Course II',
  ],
};

export const BME_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  4: ['Open Elective I'],
  5: ['Professional Elective I', 'Professional Elective II'],
  6: ['Emerging Technology Course I', 'Professional Elective III', 'Open Elective II'],
  7: [
    'Emerging Technology Course II',
    'Professional Elective IV',
    'Professional Elective V',
    'Professional Elective VI',
  ],
};

export const IT_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Professional Elective I'],
  6: ['Emerging Technology Course I', 'Professional Elective II', 'Professional Elective III', 'Open Elective I'],
  7: [
    'Emerging Technology Course II',
    'Professional Elective IV',
    'Professional Elective V',
    'Professional Elective VI',
    'Open Elective II',
  ],
};

export const EEE_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  4: ['Emerging Technology Course I'],
  5: ['Professional Elective I'],
  6: ['Professional Elective II', 'Professional Elective III', 'Open Elective I'],
  7: [
    'Emerging Technology Course II',
    'Professional Elective IV',
    'Professional Elective V',
    'Professional Elective VI',
    'Open Elective II',
  ],
};

export const MFG_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Emerging Technology Course I'],
  6: [
    'Professional Elective I',
    'Professional Elective II',
    'Professional Elective III',
    'Professional Elective IV',
    'Professional Elective V',
    'Open Elective I',
  ],
  7: [
    'Emerging Technology Course II',
    'Professional Elective VI',
    'Open Elective II',
  ],
};

export const VLSI_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Emerging Technology I', 'Professional Elective I'],
  6: [
    'Emerging Technology II',
    'Professional Elective II',
    'Professional Elective III',
    'Open Elective I',
  ],
  7: [
    'Professional Elective IV',
    'Professional Elective V',
    'Professional Elective VI',
    'Open Elective II',
  ],
};

export const MECH_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Professional Elective I'],
  6: [
    'Professional Elective II',
    'Professional Elective III',
    'Professional Elective IV',
    'Professional Elective V',
    'Open Elective I',
    'Emerging Technology Course I',
  ],
  7: [
    'Emerging Technology Course II',
    'Professional Elective VI',
    'Open Elective II',
  ],
};

export const PT_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Emerging Technology Course I'],
  6: [
    'Emerging Technology Course II',
    'Professional Elective I',
    'Professional Elective II',
    'Professional Elective III',
    'Professional Elective IV',
    'Open Elective I',
  ],
  7: [
    'Professional Elective V',
    'Professional Elective VI',
    'Open Elective II',
  ],
};

export const MINING_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Professional Elective I'],
  6: [
    'Open Elective I',
    'Professional Elective II',
    'Professional Elective III',
    'Professional Elective IV',
  ],
  7: [
    'Professional Elective V',
    'Professional Elective VI',
    'Open Elective II',
  ],
};

export const MSE_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Emerging Technology Course I'],
  6: [
    'Emerging Technology Course II',
    'Professional Elective I',
    'Professional Elective II',
    'Professional Elective III',
    'Open Elective I',
  ],
  7: [
    'Professional Elective IV',
    'Professional Elective V',
    'Professional Elective VI',
    'Open Elective II',
  ],
};

export const IE_ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  6: [
    'Professional Elective I',
    'Professional Elective II',
    'Professional Elective III',
    'Professional Elective IV',
    'Emerging Technology Course I',
    'Open Elective I',
    'Emerging Technology Course II',
  ],
  7: [
    'Professional Elective V',
    'Professional Elective VI',
    'Open Elective II',
  ],
};


const CSE_ELECTIVE_COURSE_OPTIONS: Omit<PresetCourse, 'id'>[] = [
  { name: 'Exploratory Data Analysis', code: 'CS23001', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Recommender Systems', code: 'CS23002', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Data Warehousing', code: 'CS23003', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Data Mining', code: 'CS23004', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Business Analytics', code: 'CS23005', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Image and Video Analytics', code: 'CS23006', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Natural Language Processing', code: 'CS23007', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Big Data Analytics', code: 'CS23008', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Bio Informatics', code: 'CS23009', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },

  { name: 'Web Technologies', code: 'CS23010', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'App Development', code: 'CS23011', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Cloud Services Management', code: 'CS23012', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'UI and UX Design', code: 'CS23013', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Software Testing and Automation', code: 'CS23014', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Web Application Security', code: 'CS23015', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'DevOps', code: 'CS23016', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Programming Paradigms', code: 'CS23017', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Software Project Management', code: 'CS23018', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },

  { name: 'Cloud Computing', code: 'CS23019', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Virtualization', code: 'CS23020', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Information Visualization', code: 'CS23021', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Unix Internals', code: 'CS23022', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Storage Technologies', code: 'CS23023', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Software Defined Networks', code: 'CS23024', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Stream Processing', code: 'CS23025', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Security and Privacy in Cloud', code: 'CS23026', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'GPU Computing', code: 'CS23027', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },

  { name: 'Ethical Hacking', code: 'CS23028', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Digital and Mobile Forensics', code: 'CS23029', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Social Network Security', code: 'CS23030', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Modern Cryptography', code: 'CS23031', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Engineering Secure Software Systems', code: 'CS23032', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Cyber Security', code: 'CS23033', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Network Security', code: 'CS23034', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Information Security', code: 'CS23035', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Mobile Networks', code: 'CS23036', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },

  { name: 'Distributed Systems', code: 'CS23037', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Multimedia and Animation', code: 'CS23038', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Video Creation and Editing', code: 'CS23039', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Game Theory', code: 'CS23040', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Digital Marketing', code: 'CS23041', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Visual Effects', code: 'CS23042', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Game Development', code: 'CS23043', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Graph Theory', code: 'CS23044', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Image Processing', code: 'CS23045', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },

  { name: 'Augmented Reality / Virtual Reality', code: 'CS23046', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Robotic Process Automation', code: 'CS23047', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Healthcare Analytics', code: 'CS23048', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Large Language Models', code: 'CS23049', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Quantum Computing', code: 'CS23050', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Cryptocurrency and Blockchain Technologies', code: 'CS23051', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Metaverse', code: 'CS23052', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: '3D Printing and Design', code: 'CS23053', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Autonomous Vehicles', code: 'CS23054', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },

  { name: 'Knowledge Engineering', code: 'CS23055', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Soft Computing', code: 'CS23056', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Deep Learning', code: 'CS23057', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Text and Speech Analysis', code: 'CS23058', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Optimization Techniques', code: 'CS23059', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Social Network Analysis', code: 'CS23060', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Cognitive Science', code: 'CS23061', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Responsible AI', code: 'CS23062', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Generative AI', code: 'CS23063', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
];

const CSE_ELECTIVE_OPTION_BOOK: PresetCourse[] = CSE_ELECTIVE_COURSE_OPTIONS.map((course, index) => ({
  id: `${course.semester}-${course.electiveSlot}-${index}`,
  ...course,
}));

export const CSE_PRESET_COURSES: PresetCourse[] = [
  // Semester I
  {
    id: 'EN23C03',
    name: 'Foundation English',
    code: 'EN23C03',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 1,
  },
  {
    id: 'PH23C11',
    name: 'Engineering Physics',
    code: 'PH23C11',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 1,
  },
  {
    id: 'CS23C04',
    name: 'Programming in C',
    code: 'CS23C04',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 1,
  },
  {
    id: 'CS23101',
    name: 'Computational Thinking',
    code: 'CS23101',
    type: '1-0-2',
    courseType: '1-0-2',
    semester: 1,
  },
  {
    id: 'HERITAGE_OF_TAMILS',
    name: 'Heritage of Tamils',
    code: 'UC23H01',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
  },
  {
    id: 'CALCULUS',
    name: 'Calculus',
    code: 'MA23C11',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
  },
  {
    id: 'FEEE',
    name: 'Fundamentals of Electrical and Electronics Engineering',
    code: 'EE23C02',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
  },

  // Semester II
  {
    id: 'EN23C04',
    name: 'Professional Communication',
    code: 'EN23C04',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 2,
  },
  {
    id: 'MA23C04',
    name: 'Discrete Mathematics',
    code: 'MA23C04',
    type: 'Theory',
    courseType: 'theory',
    semester: 2,
  },
  {
    id: 'CY23C10',
    name: 'Engineering Chemistry',
    code: 'CY23C10',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 2,
  },
  {
    id: 'ME23C01',
    name: 'Engineering Drawing and 3D Modeling',
    code: 'ME23C01',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 2,
  },
  {
    id: 'ME23C04',
    name: 'Makerspace',
    code: 'ME23C04',
    type: '1-0-4',
    courseType: '1-0-4',
    semester: 2,
  },
  {
    id: 'UC23H02',
    name: 'Tamils and Technology',
    code: 'UC23H02',
    type: 'Theory',
    courseType: 'theory',
    semester: 2,
  },
  {
    id: 'CS23201',
    name: 'Object Oriented Programming',
    code: 'CS23201',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 2,
  },
  {
    id: 'AUDIT_COURSE_I',
    name: 'Audit Course I',
    code: '',
    type: 'Two Tests · Equal Weight · No ESE',
    courseType: 'audit-course',
    semester: 2,
    group: 'core',
  },

  // Semester III
  {
    id: 'MA23C05',
    name: 'Probability and Statistics',
    code: 'MA23C05',
    type: 'Theory',
    courseType: 'theory',
    semester: 3,
  },
  {
    id: 'CS23301',
    name: 'Software Engineering',
    code: 'CS23301',
    type: 'Theory',
    courseType: 'theory',
    semester: 3,
  },
  {
    id: 'CS23U01',
    name: 'Standards - Computer Science & Engg.',
    code: 'CS23U01',
    type: 'Two Tests · Equal Weight · No ESE',
    courseType: 'standards-course',
    semester: 3,
  },
  {
    id: 'UC23U01',
    name: 'Universal Human Values',
    code: 'UC23U01',
    type: 'Test 70% · Assignments 30%',
    courseType: 'universal-human-values',
    semester: 3,
  },
  {
    id: 'CS23302',
    name: 'Data Structures',
    code: 'CS23302',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 3,
  },
  {
    id: 'CS23303',
    name: 'Digital System Design',
    code: 'CS23303',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 3,
  },
  {
    id: 'CS23304',
    name: 'Java Programming',
    code: 'CS23304',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 3,
  },
  {
    id: 'CS23S01',
    name: 'Skill Development Course – I',
    code: '',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 3,
    group: 'core',
  },

  // Semester IV
  {
    id: 'MA23C03',
    name: 'Linear Algebra and Numerical Methods',
    code: 'MA23C03',
    type: 'Theory',
    courseType: 'theory',
    semester: 4,
  },
  {
    id: 'CS23402',
    name: 'Computer Architecture',
    code: 'CS23402',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 4,
  },
  {
    id: 'CS23403',
    name: 'Full Stack Technologies',
    code: 'CS23403',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 4,
  },
  {
    id: 'CS23404',
    name: 'Design and Analysis of Algorithms',
    code: 'CS23404',
    type: 'Theory',
    courseType: 'theory',
    semester: 4,
  },
  {
    id: 'CS23401',
    name: 'Database Management Systems',
    code: 'CS23401',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 4,
  },
  {
    id: 'CS23S02',
    name: 'Skill Development Course – II',
    code: '',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 4,
    group: 'core',
  },
  {
    id: 'IOC_SEM4_I',
    name: 'Industry Oriented Course I',
    code: '',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 4,
    group: 'core',
  },
  {
    id: 'AUDIT_COURSE_II',
    name: 'Audit Course II',
    code: '',
    type: 'Two Tests · Equal Weight · No ESE',
    courseType: 'audit-course',
    semester: 4,
    group: 'core',
  },

  // Semester V
  {
    id: 'CS23501',
    name: 'Operating Systems',
    code: 'CS23501',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23502',
    name: 'Networks and Data Communication',
    code: 'CS23502',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23503',
    name: 'Theory of Computation',
    code: 'CS23503',
    type: 'Theory',
    courseType: 'theory',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23L01',
    name: 'Self Learning Course',
    code: 'CS23L01',
    type: 'Pass / Fail (Credits Awarded)',
    courseType: 'self-learning',
    semester: 5,
    group: 'core',
  },
  {
    id: 'UC23E01',
    name: 'Engineering Entrepreneurship Development',
    code: 'UC23E01',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 5,
    group: 'core',
  },
  {
    id: 'IOC_SEM5_II',
    name: 'Industry Oriented Course – II',
    code: '',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23S03',
    name: 'Skill Development Course – III',
    code: '',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 5,
    group: 'core',
  },

  // Semester VI
  {
    id: 'CS23601',
    name: 'Cryptography and System Security',
    code: 'CS23601',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CS23602',
    name: 'Compiler Design',
    code: 'CS23602',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CS23603',
    name: 'Machine Learning',
    code: 'CS23603',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CS23604',
    name: 'Creative and Innovative Project',
    code: 'CS23604',
    type: 'Laboratory · 60% CA / 40% ESE',
    courseType: 'laboratory-course',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CS23605',
    name: 'Perspectives of Sustainability Development',
    code: 'CS23U02',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 6,
    group: 'core',
  },

  // Semester VII
  {
    id: 'CS23701',
    name: 'Emerging Technology Course I',
    code: 'CS23701',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 7,
    group: 'core',
  },
  {
    id: 'CS23702',
    name: 'Emerging Technology Course II',
    code: 'CS23702',
    type: '3-0-0',
    courseType: 'theory',
    semester: 7,
    group: 'core',
  },
  {
    id: 'IOC_SEM7_III',
    name: 'Industry Oriented Course III',
    code: '',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 7,
    group: 'core',
  },

  // Semester VIII
  {
    id: 'CS23801',
    name: 'Project Work / Internship cum Project Work',
    code: 'CS23801',
    type: 'PW · Regulation 17.7 (60% CA / 40% ESE)',
    courseType: 'project',
    semester: 8,
    group: 'core',
  },

  ...CSE_ELECTIVE_OPTION_BOOK,
];

// --- ECE PRESET CATALOG (Anna University Regulations 2023 - CEG Campus) ---

// ECE Vertical Electives (PE-I in Sem 5; PE-II, PE-III, PE-IV in Sem 7)
const ECE_VERTICAL_ELECTIVES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  // Vertical 1: Signal and Image Processing
  { name: 'Advanced Digital Signal Processing', code: 'EC23C23', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Speech Processing', code: 'EC23C24', type: 'Theory', courseType: 'theory' },
  { name: 'DSP Architecture and Programming', code: 'EC23C15', type: '2-0-2', courseType: '2-0-2' },
  { name: 'VLSI Signal Processing', code: 'EC23001', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Control Engineering', code: 'EC23C19', type: 'Theory', courseType: 'theory' },
  { name: 'Multimedia Compression and Networks', code: 'EC23C25', type: 'Theory', courseType: 'theory' },

  // Vertical 2: Semiconductor Chip Design
  { name: 'CMOS Analog IC Design', code: 'EC23002', type: 'Theory', courseType: 'theory' },
  { name: 'VLSI Testing and Design for Testability', code: 'EC23003', type: 'Theory', courseType: 'theory' },
  { name: 'Data Converters', code: 'EC23C12', type: 'Theory', courseType: 'theory' },
  { name: 'RF Microelectronics', code: 'EC23004', type: 'Theory', courseType: 'theory' },
  { name: 'VLSI Physical Design Automation', code: 'EC23005', type: 'Theory', courseType: 'theory' },
  { name: 'Optoelectronics', code: 'EC23006', type: 'Theory', courseType: 'theory' },
  { name: 'Signal Integrity', code: 'EC23007', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Introduction to Nano Electronics', code: 'EC23C17', type: 'Theory', courseType: 'theory' },
  { name: 'Introduction to SoC Design', code: 'EC23008', type: 'Theory', courseType: 'theory' },

  // Vertical 3: Wireless Communication Technologies
  { name: 'Space Time Wireless Communication', code: 'EC23009', type: 'Theory', courseType: 'theory' },
  { name: 'Cognitive Radio Networks', code: 'EC23010', type: 'Theory', courseType: 'theory' },
  { name: 'Satellite Communication', code: 'EC23011', type: 'Theory', courseType: 'theory' },
  { name: 'Optical Wireless Communications', code: 'EC23012', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Switching and Networking', code: 'EC23013', type: 'Theory', courseType: 'theory' },
  { name: 'Adhoc and Wireless Sensor Networks', code: 'EC23014', type: 'Theory', courseType: 'theory' },
  { name: 'Radar Technologies', code: 'EC23015', type: 'Theory', courseType: 'theory' },

  // Vertical 4: RF Technologies
  { name: 'Microwave Electronics', code: 'EC23016', type: 'Theory', courseType: 'theory' },
  { name: 'Passive RF and Microwave Integrated Circuits', code: 'EC23017', type: 'Theory', courseType: 'theory' },
  { name: 'Electronic warfare', code: 'EC23018', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Antennas', code: 'EC23019', type: 'Theory', courseType: 'theory' },

  // Vertical 5: Embedded Systems
  { name: 'PIC Microcontrollers', code: 'EC23020', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Microcontrollers', code: 'EC23021', type: 'Theory', courseType: 'theory' },
  { name: 'Real Time Embedded Systems', code: 'EC23022', type: 'Theory', courseType: 'theory' },
  { name: 'Operating Systems', code: 'EC23023', type: 'Theory', courseType: 'theory' },
  { name: 'Parallel and Distributed Processing', code: 'EC23024', type: 'Theory', courseType: 'theory' },
  { name: 'Foundation Skills In Integrated Product Development', code: 'EC23C22', type: 'Theory', courseType: 'theory' },
  { name: 'Electronic System Prototyping', code: 'EC23025', type: '1-0-4', courseType: '1-0-4' },
  { name: 'Measurements and Instrumentation', code: 'EC23026', type: 'Theory', courseType: 'theory' },

  // Vertical 6: Computational Intelligence
  { name: 'Soft Computing', code: 'EC23027', type: 'Theory', courseType: 'theory' },
  { name: 'Bio-inspired Computing', code: 'EC23C20', type: 'Theory', courseType: 'theory' },
  { name: 'Pattern Recognition', code: 'EC23028', type: 'Theory', courseType: 'theory' },
  { name: 'Robotics', code: 'EC23C33', type: 'Theory', courseType: 'theory' },

  // Vertical 7: Sensor Technologies and IoT
  { name: 'Introduction to MEMS and NEMS', code: 'EC23C16', type: 'Theory', courseType: 'theory' },
  { name: 'Sensors Actuators and Interface Electronics', code: 'EC23029', type: 'Theory', courseType: 'theory' },
  { name: 'Wireless Sensor Network Design', code: 'EC23C01', type: 'Theory', courseType: 'theory' },
  { name: 'Fiber Optic Sensor', code: 'EC23030', type: 'Theory', courseType: 'theory' },

  // Vertical 8: Biomedical Technologies
  { name: 'Biomedical Instrumentation', code: 'EC23C09', type: 'Theory', courseType: 'theory' },
  { name: 'Biomedical Assist Devices', code: 'EC23C07', type: 'Theory', courseType: 'theory' },
  { name: 'Radiological Equipment', code: 'BM23C02', type: 'Theory', courseType: 'theory' },
  { name: 'Brain Computer Interface and its Applications', code: 'EC23C08', type: 'Theory', courseType: 'theory' },
  { name: 'Soft Computing and its Applications', code: 'EC23C18', type: 'Theory', courseType: 'theory' },
  { name: 'Medical image analysis', code: 'EC23031', type: 'Theory', courseType: 'theory' },
  { name: 'Introduction to Biomimicry', code: 'EC23032', type: 'Theory', courseType: 'theory' },
];

// ECE Emerging Technology Courses (ETC-I in Sem 6; ETC-II in Sem 7)
const ECE_ETC_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Principles of Digital Image Processing', code: 'EC23E01', type: 'Theory', courseType: 'theory' },
  { name: '5G Wireless Communication Networks', code: 'EC23E02', type: 'Theory', courseType: 'theory' },
  { name: 'Spintronics And Quantum Computing', code: 'EC23E03', type: 'Theory', courseType: 'theory' },
  { name: 'Clock and Power Management Circuits', code: 'EC23E04', type: 'Theory', courseType: 'theory' },
  { name: 'Electro Magnetic Interference and Compatibility in Electronic Systems', code: 'EC23E05', type: 'Theory', courseType: 'theory' },
  { name: 'Cryptography and Network Security', code: 'EC23E06', type: 'Theory', courseType: 'theory' },
  { name: 'IoT Enabled Systems Design', code: 'EC23E07', type: 'Theory', courseType: 'theory' },
  { name: 'Industrial IoT and Industry 4.0', code: 'EC23E08', type: '2-0-2', courseType: '2-0-2' },
];

// ECE Open Electives (OE-I in Sem 6; OE-II in Sem 7)
const ECE_OE_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Automotive Electronics', code: 'EC23901', type: 'Theory', courseType: 'theory' },
  { name: 'Electronics Engineering', code: 'EC23902', type: 'Theory', courseType: 'theory' },
  { name: 'Wireless Technologies', code: 'EC23903', type: 'Theory', courseType: 'theory' },
  { name: 'Microcontroller Programming', code: 'EC23904', type: 'Theory', courseType: 'theory' },
  { name: 'Consumer Electronics', code: 'EC23905', type: 'Theory', courseType: 'theory' },
  { name: 'Principles of Modern Communication System', code: 'EC23906', type: 'Theory', courseType: 'theory' },
  { name: 'Computer Vision and Machine Learning', code: 'EC23907', type: 'Theory', courseType: 'theory' },
  { name: 'Robotics and its Applications', code: 'EC23908', type: 'Theory', courseType: 'theory' },
];

const ECE_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5: Professional Elective I
  ...ECE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `ece-5-PE-I-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 6: Emerging Technology Course I
  ...ECE_ETC_COURSES.map((course, idx) => ({
    id: `ece-6-ETC-I-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 6: Open Elective I
  ...ECE_OE_COURSES.map((course, idx) => ({
    id: `ece-6-OE-I-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 7: Professional Elective II
  ...ECE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `ece-7-PE-II-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),

  // Sem 7: Professional Elective III
  ...ECE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `ece-7-PE-III-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 7: Professional Elective IV
  ...ECE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `ece-7-PE-IV-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 7: Emerging Technology Course II
  ...ECE_ETC_COURSES.map((course, idx) => ({
    id: `ece-7-ETC-II-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),

  // Sem 7: Open Elective II
  ...ECE_OE_COURSES.map((course, idx) => ({
    id: `ece-7-OE-II-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const ECE_PRESET_COURSES: PresetCourse[] = [
  // Semester I (23 credits)
  {
    id: 'EN23C03_ECE',
    name: 'Foundation English',
    code: 'EN23C03',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 1,
    group: 'core',
  },
  {
    id: 'MA23C11_ECE',
    name: 'Calculus',
    code: 'MA23C11',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
    group: 'core',
  },
  {
    id: 'PH23C11_ECE',
    name: 'Engineering Physics',
    code: 'PH23C11',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 1,
    group: 'core',
  },
  {
    id: 'ME23C01_ECE',
    name: 'Engineering Drawing and 3D Modelling',
    code: 'ME23C01',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 1,
    group: 'core',
  },
  {
    id: 'CS23C04_ECE',
    name: 'Programming in C',
    code: 'CS23C04',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 1,
    group: 'core',
  },
  {
    id: 'ME23C04_ECE',
    name: 'Maker space',
    code: 'ME23C04',
    type: '1-0-4',
    courseType: '1-0-4',
    semester: 1,
    group: 'core',
  },
  {
    id: 'UC23H01_ECE',
    name: 'Heritage of Tamils',
    code: 'UC23H01',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
    group: 'core',
  },

  // Semester II (24 credits)
  {
    id: 'EN23C04_ECE',
    name: 'Professional Communication',
    code: 'EN23C04',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 2,
    group: 'core',
  },
  {
    id: 'MA23C02',
    name: 'Ordinary Differential Equations and Transform Techniques',
    code: 'MA23C02',
    type: 'Theory',
    courseType: 'theory',
    semester: 2,
    group: 'core',
  },
  {
    id: 'EC23C03',
    name: 'Electronic Devices',
    code: 'EC23C03',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 2,
    group: 'core',
  },
  {
    id: 'CY23C10_ECE',
    name: 'Engineering Chemistry',
    code: 'CY23C10',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 2,
    group: 'core',
  },
  {
    id: 'EC23C06',
    name: 'Data Structures and Programming in C++',
    code: 'EC23C06',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 2,
    group: 'core',
  },
  {
    id: 'EC23C04',
    name: 'Circuit Analysis',
    code: 'EC23C04',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 2,
    group: 'core',
  },
  {
    id: 'UC23H02_ECE',
    name: 'Tamils and Technology',
    code: 'UC23H02',
    type: 'Theory',
    courseType: 'theory',
    semester: 2,
    group: 'core',
  },
  {
    id: 'AUDIT_COURSE_I_ECE',
    name: 'Audit Course I',
    code: '',
    type: 'Two Tests · Equal Weight · No ESE',
    courseType: 'audit-course',
    semester: 2,
    group: 'core',
  },

  // Semester III (22 credits)
  {
    id: 'MA23C03_ECE',
    name: 'Linear Algebra and Numerical Methods',
    code: 'MA23C03',
    type: 'Theory',
    courseType: 'theory',
    semester: 3,
    group: 'core',
  },
  {
    id: 'EC23301',
    name: 'Electromagnetic Fields',
    code: 'EC23301',
    type: 'Theory',
    courseType: 'theory',
    semester: 3,
    group: 'core',
  },
  {
    id: 'EC23C13',
    name: 'Digital Electronics and System Design',
    code: 'EC23C13',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 3,
    group: 'core',
  },
  {
    id: 'EC23302',
    name: 'Signals and Systems',
    code: 'EC23302',
    type: 'Theory',
    courseType: 'theory',
    semester: 3,
    group: 'core',
  },
  {
    id: 'EC23C02',
    name: 'Analog Circuits Design',
    code: 'EC23C02',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 3,
    group: 'core',
  },
  {
    id: 'EC23S01',
    name: 'Skill Development Course – I',
    code: 'EC23S01',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 3,
    group: 'core',
  },
  {
    id: 'UC23U01_ECE',
    name: 'Universal Human Values',
    code: 'UC23U01',
    type: 'Test 70% · Assignments 30%',
    courseType: 'universal-human-values',
    semester: 3,
    group: 'core',
  },

  // Semester IV (24 credits)
  {
    id: 'EC23401',
    name: 'Digital Signal Processing',
    code: 'EC23401',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 4,
    group: 'core',
  },
  {
    id: 'EC23402',
    name: 'Transmission Lines',
    code: 'EC23402',
    type: 'Theory',
    courseType: 'theory',
    semester: 4,
    group: 'core',
  },
  {
    id: 'EC23403',
    name: 'Analog and Baseband Communication',
    code: 'EC23403',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 4,
    group: 'core',
  },
  {
    id: 'EC23C05',
    name: 'Analog Electronic System Design',
    code: 'EC23C05',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 4,
    group: 'core',
  },
  {
    id: 'EC23C10',
    name: 'Computer Architecture and Organization',
    code: 'EC23C10',
    type: 'Theory',
    courseType: 'theory',
    semester: 4,
    group: 'core',
  },
  {
    id: 'EC23C11',
    name: 'Control Systems',
    code: 'EC23C11',
    type: 'Theory',
    courseType: 'theory',
    semester: 4,
    group: 'core',
  },
  {
    id: 'EC23S02',
    name: 'Skill Development Course – II',
    code: 'EC23S02',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 4,
    group: 'core',
  },
  {
    id: 'EC23L01',
    name: 'Self Learning Course',
    code: 'EC23L01',
    type: 'Pass / Fail (Credits Awarded)',
    courseType: 'self-learning',
    semester: 4,
    group: 'core',
  },
  {
    id: 'AUDIT_COURSE_II_ECE',
    name: 'Audit Course II',
    code: '',
    type: 'Two Tests · Equal Weight · No ESE',
    courseType: 'audit-course',
    semester: 4,
    group: 'core',
  },

  // Semester V (23 credits)
  {
    id: 'EC23501',
    name: 'Antenna and Wave Propagation',
    code: 'EC23501',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 5,
    group: 'core',
  },
  {
    id: 'EC23502',
    name: 'Digital Communication',
    code: 'EC23502',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 5,
    group: 'core',
  },
  {
    id: 'EC23C21',
    name: 'Microprocessors and Microcontrollers',
    code: 'EC23C21',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 5,
    group: 'core',
  },
  {
    id: 'EC23503',
    name: 'Communication Networks',
    code: 'EC23503',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 5,
    group: 'core',
  },
  {
    id: 'IOC_SEM5_I_ECE',
    name: 'Industry Oriented Course I',
    code: '',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 5,
    group: 'core',
  },
  {
    id: 'UC23E01_ECE',
    name: 'Engineering Entrepreneurship Development',
    code: 'UC23E01',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 5,
    group: 'core',
  },

  // Semester VI (23 credits)
  {
    id: 'EC23C14',
    name: 'Digital VLSI Design',
    code: 'EC23C14',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 6,
    group: 'core',
  },
  {
    id: 'EC23601',
    name: 'Wireless Communications',
    code: 'EC23601',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 6,
    group: 'core',
  },
  {
    id: 'EC23602',
    name: 'Machine Learning',
    code: 'EC23602',
    type: 'Theory',
    courseType: 'theory',
    semester: 6,
    group: 'core',
  },
  {
    id: 'EC23S03',
    name: 'Skill Development Course – III',
    code: 'EC23S03',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 6,
    group: 'core',
  },
  {
    id: 'IOC_SEM6_II_ECE',
    name: 'Industry Oriented Course II',
    code: '',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 6,
    group: 'core',
  },
  {
    id: 'EC23U02',
    name: 'Perspectives of Sustainable Development',
    code: 'EC23U02',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 6,
    group: 'core',
  },

  // Semester VII (23 credits)
  {
    id: 'EC23701',
    name: 'Millimeter Wave and Optical Communication',
    code: 'EC23701',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 7,
    group: 'core',
  },
  {
    id: 'EC23702',
    name: 'Mini Project',
    code: 'EC23702',
    type: 'Laboratory · 60% CA / 40% ESE',
    courseType: 'laboratory-course',
    semester: 7,
    group: 'core',
  },
  {
    id: 'EC23703',
    name: 'Industry Oriented Course III',
    code: 'EC23703',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 7,
    group: 'core',
  },
  {
    id: 'EC23U01',
    name: 'Standards – Electronics and Communication Engineering',
    code: 'EC23U01',
    type: 'Two Tests · Equal Weight · No ESE',
    courseType: 'standards-course',
    semester: 7,
    group: 'core',
  },

  // Semester VIII (8 credits)
  {
    id: 'EC23801',
    name: 'Project Work / Internship cum Project Work',
    code: 'EC23801',
    type: 'PW · Regulation 17.7 (60% CA / 40% ESE)',
    courseType: 'project',
    semester: 8,
    group: 'core',
  },

  ...ECE_ELECTIVE_OPTION_BOOK,
];

// --- CIVIL PRESET CATALOG (Anna University Regulations 2023 - CEG Campus) ---

// Civil Vertical Electives (PE-I & PE-II in Sem 5; PE-III in Sem 6; PE-IV, PE-V, PE-VI in Sem 7)
const CIVIL_VERTICAL_ELECTIVES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  // Vertical I: Structures
  { name: 'Concrete Technology', code: 'CE23001', type: 'Theory', courseType: 'theory' },
  { name: 'Prefabricated Structures', code: 'CE23002', type: 'Theory', courseType: 'theory' },
  { name: 'Prestressed Concrete Structures', code: 'CE23003', type: 'Theory', courseType: 'theory' },
  { name: 'Structural Retrofit and Rehabilitation', code: 'CE23004', type: 'Theory', courseType: 'theory' },
  { name: 'Dynamics and Earthquake Resistant Structures', code: 'CE23005', type: 'Theory', courseType: 'theory' },
  { name: 'Finite Element Method in Civil Engineering', code: 'CE23006', type: 'Theory', courseType: 'theory' },

  // Vertical II: Construction Techniques and Practices
  { name: 'Construction Equipment and Machinery', code: 'CE23007', type: 'Theory', courseType: 'theory' },
  { name: 'Construction Project Management Through Lean Concepts', code: 'CE23008', type: 'Theory', courseType: 'theory' },
  { name: 'Construction Quality and Safety', code: 'CE23009', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Construction Techniques', code: 'CE23010', type: 'Theory', courseType: 'theory' },
  { name: 'Energy Efficient Buildings', code: 'ME23C07', type: 'Theory', courseType: 'theory' },
  { name: 'Digitalized Construction Lab', code: 'CE23011', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course' },

  // Vertical III: Geotechnical
  { name: 'Geo-Environmental Engineering', code: 'CE23012', type: 'Theory', courseType: 'theory' },
  { name: 'Ground Improvement Techniques', code: 'CE23013', type: 'Theory', courseType: 'theory' },
  { name: 'Soil Dynamics and Machine Foundations', code: 'CE23014', type: 'Theory', courseType: 'theory' },
  { name: 'Rock Mechanics', code: 'CE23015', type: 'Theory', courseType: 'theory' },
  { name: 'Earth and Earth Retaining Structures', code: 'CE23016', type: 'Theory', courseType: 'theory' },
  { name: 'Pile Foundations', code: 'CE23017', type: 'Theory', courseType: 'theory' },

  // Vertical IV: Geo-Informatics
  { name: 'Environmental Geoinformatics', code: 'GI23C02', type: 'Theory', courseType: 'theory' },
  { name: 'Transportation Geomatics', code: 'CE23018', type: 'Theory', courseType: 'theory' },
  { name: 'Geomatics for Hydrology and Water Resources', code: 'GI23C03', type: 'Theory', courseType: 'theory' },
  { name: 'Geomatics for Disaster and Risk Mitigation', code: 'GI23C04', type: 'Theory', courseType: 'theory' },
  { name: 'Geomatics for Agriculture and Forestry', code: 'CE23019', type: 'Theory', courseType: 'theory' },
  { name: 'Geomatics for Ocean and Coastal Applications', code: 'GI23C05', type: 'Theory', courseType: 'theory' },

  // Vertical V: Transportation Infrastructure
  { name: 'Traffic Engineering and Management', code: 'CE23020', type: 'Theory', courseType: 'theory' },
  { name: 'Transportation Planning Process', code: 'CE23021', type: 'Theory', courseType: 'theory' },
  { name: 'Urban and Regional Planning', code: 'CE23022', type: 'Theory', courseType: 'theory' },
  { name: 'Transport and Environment', code: 'CE23023', type: 'Theory', courseType: 'theory' },
  { name: 'Smart Cities', code: 'CE23024', type: 'Theory', courseType: 'theory' },
  { name: 'Intelligent Transportation Systems', code: 'CE23025', type: 'Theory', courseType: 'theory' },

  // Vertical VI: Environment
  { name: 'Climate Change Adaptation and Mitigation', code: 'CE23026', type: 'Theory', courseType: 'theory' },
  { name: 'Air Pollution Control Engineering', code: 'CE23027', type: 'Theory', courseType: 'theory' },
  { name: 'Environmental Impact Assessment', code: 'CE23028', type: 'Theory', courseType: 'theory' },
  { name: 'Industrial Wastewater Management', code: 'CE23029', type: 'Theory', courseType: 'theory' },
  { name: 'Solid and Hazardous Waste Management', code: 'CE23030', type: 'Theory', courseType: 'theory' },
  { name: 'Environmental Legislations in India', code: 'CE23031', type: 'Theory', courseType: 'theory' },

  // Vertical VII: Water Resources
  { name: 'Hydrology and Water Resources Engineering', code: 'CE23032', type: 'Theory', courseType: 'theory' },
  { name: 'Integrated Water Resources Management', code: 'CE23033', type: 'Theory', courseType: 'theory' },
  { name: 'Groundwater Engineering', code: 'CE23034', type: 'Theory', courseType: 'theory' },
  { name: 'Watershed Management', code: 'CE23035', type: 'Theory', courseType: 'theory' },
  { name: 'Rainwater Harvesting', code: 'CE23036', type: 'Theory', courseType: 'theory' },
  { name: 'Water Resources and Global Climate Change', code: 'CE23037', type: 'Theory', courseType: 'theory' },

  // Vertical VIII: Ocean Engineering
  { name: 'Oceanography', code: 'CE23038', type: 'Theory', courseType: 'theory' },
  { name: 'Ocean Wave Dynamics', code: 'CE23039', type: 'Theory', courseType: 'theory' },
  { name: 'Sea Surveying and Monitoring', code: 'CE23040', type: 'Theory', courseType: 'theory' },
  { name: 'Port and Harbour Engineering', code: 'CE23041', type: 'Theory', courseType: 'theory' },
  { name: 'Coastal Engineering', code: 'CE23042', type: 'Theory', courseType: 'theory' },
  { name: 'Offshore Technology', code: 'CE23043', type: 'Theory', courseType: 'theory' },
];

// Civil Emerging Technology Courses (ETC-I in Sem 6; ETC-II in Sem 7)
const CIVIL_ETC_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Artificial Intelligence in Civil Engineering', code: 'CE23E01', type: 'Theory', courseType: 'theory' },
  { name: 'Unmanned Aerial System (UAS) For Large Scale Mapping', code: 'CE23E02', type: 'Theory', courseType: 'theory' },
  { name: 'Robotics in Construction', code: 'CE23E03', type: 'Theory', courseType: 'theory' },
  { name: 'Advances in Water Resources Engineering', code: 'CE23E04', type: 'Theory', courseType: 'theory' },
];

// Civil Open Electives (OE-I in Sem 5; OE-II in Sem 6)
const CIVIL_OE_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Sustainable Engineering', code: 'CE23901', type: 'Theory', courseType: 'theory' },
  { name: 'Waste to Energy', code: 'CE23902', type: 'Theory', courseType: 'theory' },
  { name: 'Hydrology', code: 'CE23903', type: 'Theory', courseType: 'theory' },
  { name: 'Automotive Electronics', code: 'EC23901', type: 'Theory', courseType: 'theory' },
  { name: 'Electronics Engineering', code: 'EC23902', type: 'Theory', courseType: 'theory' },
  { name: 'Wireless Technologies', code: 'EC23903', type: 'Theory', courseType: 'theory' },
  { name: 'Microcontroller Programming', code: 'EC23904', type: 'Theory', courseType: 'theory' },
  { name: 'Consumer Electronics', code: 'EC23905', type: 'Theory', courseType: 'theory' },
  { name: 'Robotics and its Applications', code: 'EC23908', type: 'Theory', courseType: 'theory' },
  { name: 'UI and UX Design', code: 'CS23013', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Web Technologies', code: 'CS23010', type: '2-0-2', courseType: '2-0-2' },
];

const CIVIL_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5: Professional Elective I
  ...CIVIL_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `civil-5-PE-I-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 5: Professional Elective II
  ...CIVIL_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `civil-5-PE-II-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),

  // Sem 5: Open Elective I
  ...CIVIL_OE_COURSES.map((course, idx) => ({
    id: `civil-5-OE-I-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 6: Professional Elective III
  ...CIVIL_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `civil-6-PE-III-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 6: Open Elective II
  ...CIVIL_OE_COURSES.map((course, idx) => ({
    id: `civil-6-OE-II-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),

  // Sem 6: Emerging Technology Course I
  ...CIVIL_ETC_COURSES.map((course, idx) => ({
    id: `civil-6-ETC-I-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 7: Professional Elective IV
  ...CIVIL_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `civil-7-PE-IV-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 7: Professional Elective V
  ...CIVIL_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `civil-7-PE-V-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),

  // Sem 7: Professional Elective VI
  ...CIVIL_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `civil-7-PE-VI-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7: Emerging Technology Course II
  ...CIVIL_ETC_COURSES.map((course, idx) => ({
    id: `civil-7-ETC-II-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),
];

export const CIVIL_PRESET_COURSES: PresetCourse[] = [
  // Semester I (22 credits)
  {
    id: 'EN23C05',
    name: 'Foundation English',
    code: 'EN23C05',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 1,
    group: 'core',
  },
  {
    id: 'MA23C11_CIVIL',
    name: 'Calculus',
    code: 'MA23C11',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
    group: 'core',
  },
  {
    id: 'CY23C10_CIVIL',
    name: 'Engineering Chemistry',
    code: 'CY23C10',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 1,
    group: 'core',
  },
  {
    id: 'EE23C02_CIVIL',
    name: 'Fundamentals of Electrical and Electronics Engineering',
    code: 'EE23C02',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
    group: 'core',
  },
  {
    id: 'ME23C01_CIVIL',
    name: 'Engineering Drawing and 3D Modelling',
    code: 'ME23C01',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 1,
    group: 'core',
  },
  {
    id: 'ME23C04_CIVIL',
    name: 'Makerspace',
    code: 'ME23C04',
    type: '1-0-4',
    courseType: '1-0-4',
    semester: 1,
    group: 'core',
  },
  {
    id: 'UC23H01_CIVIL',
    name: 'Heritage of Tamils',
    code: 'UC23H01',
    type: 'Theory',
    courseType: 'heritage-course',
    semester: 1,
    group: 'core',
  },
  {
    id: 'AUDIT_COURSE_I_CIVIL',
    name: 'Audit Course I',
    code: '',
    type: 'Two Tests · Equal Weight · No ESE',
    courseType: 'audit-course',
    semester: 1,
    group: 'core',
  },

  // Semester II (23 credits)
  {
    id: 'EN23C04_CIVIL',
    name: 'Professional Communication',
    code: 'EN23C04',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 2,
    group: 'core',
  },
  {
    id: 'MA23C02_CIVIL',
    name: 'Ordinary Differential Equations and Transform Techniques',
    code: 'MA23C02',
    type: 'Theory',
    courseType: 'theory',
    semester: 2,
    group: 'core',
  },
  {
    id: 'PH23C11_CIVIL',
    name: 'Engineering Physics',
    code: 'PH23C11',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 2,
    group: 'core',
  },
  {
    id: 'CS23C04_CIVIL',
    name: 'Programming in C',
    code: 'CS23C04',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 2,
    group: 'core',
  },
  {
    id: 'GY23C01',
    name: 'Engineering Geology',
    code: 'GY23C01',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 2,
    group: 'core',
  },
  {
    id: 'ME23C03',
    name: 'Engineering Mechanics',
    code: 'ME23C03',
    type: 'Theory',
    courseType: 'theory',
    semester: 2,
    group: 'core',
  },
  {
    id: 'UC23H02_CIVIL',
    name: 'Tamils and Technology',
    code: 'UC23H02',
    type: 'Theory',
    courseType: 'heritage-course',
    semester: 2,
    group: 'core',
  },

  // Semester III (26 credits)
  {
    id: 'CE23301',
    name: 'Strength of Materials - I',
    code: 'CE23301',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 3,
    group: 'core',
  },
  {
    id: 'CE23302',
    name: 'Construction Engineering',
    code: 'CE23302',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 3,
    group: 'core',
  },
  {
    id: 'CE23303',
    name: 'Fluid Mechanics',
    code: 'CE23303',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 3,
    group: 'core',
  },
  {
    id: 'CE23304',
    name: 'Railways, Airports and Harbour Engineering',
    code: 'CE23304',
    type: 'Theory',
    courseType: 'theory',
    semester: 3,
    group: 'core',
  },
  {
    id: 'CE23305',
    name: 'Water Supply Engineering',
    code: 'CE23305',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 3,
    group: 'core',
  },
  {
    id: 'CE23C04',
    name: 'Principles of Surveying',
    code: 'CE23C04',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 3,
    group: 'core',
  },
  {
    id: 'CE23S01',
    name: 'Skill Development Course – I',
    code: 'CE23S01',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 3,
    group: 'core',
  },
  {
    id: 'AUDIT_COURSE_II_CIVIL',
    name: 'Audit Course II',
    code: '',
    type: 'Two Tests · Equal Weight · No ESE',
    courseType: 'audit-course',
    semester: 3,
    group: 'core',
  },

  // Semester IV (26 credits)
  {
    id: 'CE23401',
    name: 'Strength of Materials - II',
    code: 'CE23401',
    type: 'Theory',
    courseType: 'theory',
    semester: 4,
    group: 'core',
  },
  {
    id: 'CE23402',
    name: 'Soil Mechanics',
    code: 'CE23402',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 4,
    group: 'core',
  },
  {
    id: 'CE23403',
    name: 'Applied Hydraulic Engineering',
    code: 'CE23403',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 4,
    group: 'core',
  },
  {
    id: 'CE23404',
    name: 'Highway Engineering',
    code: 'CE23404',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 4,
    group: 'core',
  },
  {
    id: 'CE23405',
    name: 'Waste Water Engineering',
    code: 'CE23405',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 4,
    group: 'core',
  },
  {
    id: 'CE23U01',
    name: 'Standards – Civil Engineering',
    code: 'CE23U01',
    type: 'Two Tests · Equal Weight · No ESE',
    courseType: 'standards-course',
    semester: 4,
    group: 'core',
  },
  {
    id: 'UC23U01_CIVIL',
    name: 'Universal Human Values',
    code: 'UC23U01',
    type: 'Test 70% · Assignments 30%',
    courseType: 'universal-human-values',
    semester: 4,
    group: 'core',
  },
  {
    id: 'CE23S02',
    name: 'Skill Development Course – II',
    code: 'CE23S02',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 4,
    group: 'core',
  },

  // Semester V (25 credits)
  {
    id: 'CE23501',
    name: 'Structural Analysis - I',
    code: 'CE23501',
    type: 'Theory',
    courseType: 'theory',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CE23502',
    name: 'Design of Reinforced Cement Concrete Structures',
    code: 'CE23502',
    type: 'Theory',
    courseType: 'theory',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CE23503',
    name: 'Foundation Engineering',
    code: 'CE23503',
    type: 'Theory',
    courseType: 'theory',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CE23504',
    name: 'Environmental Engineering Drawing',
    code: 'CE23504',
    type: 'Laboratory · 60% CA / 40% ESE',
    courseType: 'laboratory-course',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CE23U02',
    name: 'Perspectives of Sustainable Development',
    code: 'CE23U02',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CE23S03',
    name: 'Skill Development Course – III',
    code: 'CE23S03',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 5,
    group: 'core',
  },
  {
    id: 'IOC_SEM5_I_CIVIL',
    name: 'Industry Oriented Course I',
    code: '',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 5,
    group: 'core',
  },

  // Semester VI (21 credits)
  {
    id: 'CE23601',
    name: 'Structural Analysis - II',
    code: 'CE23601',
    type: 'Theory',
    courseType: 'theory',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CE23602',
    name: 'Design of Steel Structures',
    code: 'CE23602',
    type: 'Theory',
    courseType: 'theory',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CE23603',
    name: 'Building and Structural Drawing',
    code: 'CE23603',
    type: 'Laboratory · 60% CA / 40% ESE',
    courseType: 'laboratory-course',
    semester: 6,
    group: 'core',
  },
  {
    id: 'UC23E01_CIVIL',
    name: 'Engineering Entrepreneurship Development',
    code: 'UC23E01',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 6,
    group: 'core',
  },
  {
    id: 'IOC_SEM6_II_CIVIL',
    name: 'Industry Oriented Course II',
    code: '',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 6,
    group: 'core',
  },

  // Semester VII (21 credits)
  {
    id: 'CE23701',
    name: 'Irrigation Engineering',
    code: 'CE23701',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 7,
    group: 'core',
  },
  {
    id: 'CE23702',
    name: 'Estimation, Costing and Valuation Engineering',
    code: 'CE23702',
    type: 'Theory',
    courseType: 'theory',
    semester: 7,
    group: 'core',
  },
  {
    id: 'IOC_SEM7_III_CIVIL',
    name: 'Industry Oriented Course III',
    code: '',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 7,
    group: 'core',
  },
  {
    id: 'CE23L01_CIVIL',
    name: 'Self-Learning Course',
    code: 'CE23L01',
    type: 'Pass / Fail (Credits Awarded)',
    courseType: 'self-learning',
    semester: 7,
    group: 'core',
  },

  // Semester VIII (8 credits)
  {
    id: 'CE23801',
    name: 'Project Work / Internship cum Project Work',
    code: 'CE23801',
    type: 'PW · Regulation 17.7 (60% CA / 40% ESE)',
    courseType: 'project',
    semester: 8,
    group: 'core',
  },

  ...CIVIL_ELECTIVE_OPTION_BOOK,
];

// --- GEOINFORMATICS PRESET CATALOG (Anna University Regulations 2023 - CEG Campus) ---

const GEO_VERTICAL_ELECTIVES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  // Vertical I: Surveying & Mapping
  { name: 'Terrestrial and Satellite Photogrammetry', code: 'GI23001', type: 'Theory', courseType: 'theory' },
  { name: 'GNSS Surveying', code: 'GI23002', type: 'Theory', courseType: 'theory' },
  { name: 'Terrestrial and Bathymetric Laser Scanning', code: 'GI23003', type: 'Theory', courseType: 'theory' },
  { name: 'Unmanned Aerial System (UAS) for Large Scale mapping', code: 'GI23004', type: 'Theory', courseType: 'theory' },
  { name: 'Underground and Hydrographic Surveying', code: 'GI23005', type: 'Theory', courseType: 'theory' },
  { name: 'Cadastral Surveying', code: 'GI23006', type: 'Theory', courseType: 'theory' },

  // Vertical II: Geospatial Data Analytics
  { name: 'GIS Customization and Scripting', code: 'GI23007', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Location Based Geospatial Services', code: 'GI23008', type: 'Theory', courseType: 'theory' },
  { name: 'Space Syntax', code: 'GI23009', type: 'Theory', courseType: 'theory' },
  { name: 'GIS based Utility and Asset Management', code: 'GI23010', type: 'Theory', courseType: 'theory' },
  { name: 'GeoSpatial Modeling & Simulation', code: 'GI23011', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Development Goals and Geomatics', code: 'GI23012', type: 'Theory', courseType: 'theory' },

  // Vertical III: Image Processing and Analysis
  { name: 'Soft Computing Techniques', code: 'GI23013', type: 'Theory', courseType: 'theory' },
  { name: 'Polarimetry and Interferometry', code: 'GI23014', type: 'Theory', courseType: 'theory' },
  { name: 'Pattern Recognition', code: 'GI23015', type: 'Theory', courseType: 'theory' },
  { name: 'Raster Data Modelling', code: 'GI23016', type: 'Theory', courseType: 'theory' },
  { name: 'Agriculture and Forest Management using Geomatics', code: 'GI23017', type: 'Theory', courseType: 'theory' },
  { name: 'Spatial Statistics', code: 'GI23018', type: 'Theory', courseType: 'theory' },

  // Vertical IV: GeoSpatial Applications
  { name: 'Environmental Geoinformatics', code: 'GI23C02', type: 'Theory', courseType: 'theory' },
  { name: 'Transportation Geomatics', code: 'GI23019', type: 'Theory', courseType: 'theory' },
  { name: 'Geomatics for Hydrology and Water Resources', code: 'GI23C03', type: 'Theory', courseType: 'theory' },
  { name: 'Geomatics for Disaster and Risk Mitigation', code: 'GI23C04', type: 'Theory', courseType: 'theory' },
  { name: 'Satellite Meteorology', code: 'GI23020', type: 'Theory', courseType: 'theory' },
  { name: 'Geomatics for ocean and Coastal Applications', code: 'GI23C05', type: 'Theory', courseType: 'theory' },

  // Vertical V: Geodesy
  { name: 'Advanced Geodesy', code: 'GI23021', type: 'Theory', courseType: 'theory' },
  { name: 'Satellite Geodesy', code: 'GI23022', type: 'Theory', courseType: 'theory' },
  { name: 'Physical Geodesy', code: 'GI23023', type: 'Theory', courseType: 'theory' },
  { name: 'Geodetic Interferometry', code: 'GI23024', type: 'Theory', courseType: 'theory' },
  { name: 'Geodetic Control Survey and Adjustment', code: 'GI23025', type: 'Theory', courseType: 'theory' },
  { name: 'Geodetic Astronomy', code: 'GI23026', type: 'Theory', courseType: 'theory' },

  // Vertical VI: Geo-Intelligence
  { name: 'Digital Twins & BIM', code: 'GI23027', type: 'Theory', courseType: 'theory' },
  { name: 'Big Data Analytics for Geomatics', code: 'GI23028', type: 'Theory', courseType: 'theory' },
  { name: 'IoT Applications in Geomatics', code: 'GI23029', type: 'Theory', courseType: 'theory' },
  { name: 'Decision Support Systems for Geomatics', code: 'GI23030', type: 'Theory', courseType: 'theory' },
  { name: 'Location Intelligence & Surveillance', code: 'GI23031', type: 'Theory', courseType: 'theory' },
  { name: 'Geomatics for Smart Cities', code: 'GI23032', type: 'Theory', courseType: 'theory' },
];

const GEO_ETC_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'AI/ML for Geoinformatics', code: 'GI23E01', type: 'Theory', courseType: 'theory' },
  { name: 'Geographic Information System for Climate and Disaster Risk Assessment', code: 'GI23E02', type: 'Theory', courseType: 'theory' },
  { name: 'Environmental Economics', code: 'GI23E03', type: 'Theory', courseType: 'theory' },
  { name: 'Waste management for circular economy', code: 'GI23E04', type: 'Theory', courseType: 'theory' },
];

const GEO_OE_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Photogrammetry', code: 'GI23901', type: 'Theory', courseType: 'theory' },
  { name: 'Total Station and GPS Surveying', code: 'GI23902', type: 'Theory', courseType: 'theory' },
  { name: 'Computer Vision and Satellite Image Processing', code: 'GI23903', type: 'Theory', courseType: 'theory' },
  { name: 'Remote Sensing Concepts', code: 'GI23904', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Engineering', code: 'CE23901', type: 'Theory', courseType: 'theory' },
  { name: 'Electronics Engineering', code: 'EC23902', type: 'Theory', courseType: 'theory' },
  { name: 'UI and UX Design', code: 'CS23013', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Web Technologies', code: 'CS23010', type: '2-0-2', courseType: '2-0-2' },
];

const GEO_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5: Professional Elective I
  ...GEO_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `geo-5-PE-I-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 5: Emerging Technology Course I
  ...GEO_ETC_COURSES.map((course, idx) => ({
    id: `geo-5-ETC-I-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 5: Open Elective I
  ...GEO_OE_COURSES.map((course, idx) => ({
    id: `geo-5-OE-I-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 6: Professional Elective II
  ...GEO_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `geo-6-PE-II-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),

  // Sem 6: Professional Elective III
  ...GEO_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `geo-6-PE-III-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 6: Professional Elective IV
  ...GEO_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `geo-6-PE-IV-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 6: Open Elective II
  ...GEO_OE_COURSES.map((course, idx) => ({
    id: `geo-6-OE-II-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),

  // Sem 7: Professional Elective V
  ...GEO_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `geo-7-PE-V-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),

  // Sem 7: Professional Elective VI
  ...GEO_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `geo-7-PE-VI-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7: Emerging Technology Course II
  ...GEO_ETC_COURSES.map((course, idx) => ({
    id: `geo-7-ETC-II-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),
];

export const GEO_PRESET_COURSES: PresetCourse[] = [
  // Semester I (23 credits)
  { id: 'EN23C05_GEO', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_GEO', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'PH23C11_GEO', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C01_GEO', name: 'Engineering Drawing & 3D Modelling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'EE23C02_GEO', name: 'Fundamentals of Electrical and Electronics Engineering', code: 'EE23C02', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'CS23C04_GEO', name: 'Programming in C', code: 'CS23C04', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'UC23H01_GEO', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },

  // Semester II (21 credits)
  { id: 'EN23C04_GEO', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_GEO', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'PH23C02_GEO', name: 'Principles and Applications of Electromagnetic radiation in Remote Sensing', code: 'PH23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'CY23C10_GEO', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'ME23C04_GEO', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 2, group: 'core' },
  { id: 'GI23201_GEO', name: 'Geoinformatics Systems', code: 'GI23201', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'UC23H02_GEO', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },
  { id: 'AUDIT_COURSE_I_GEO', name: 'Audit Course – I', code: '', type: 'Audit Course', courseType: 'audit-course', semester: 2, group: 'core' },

  // Semester III (24 credits)
  { id: 'MA23C05_GEO', name: 'Probability and Statistics', code: 'MA23C05', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'CS23C02_GEO', name: 'Computer Programming in Python', code: 'CS23C02', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'GI23301_GEO', name: 'Spatial Database Management System', code: 'GI23301', type: '2-0-2', courseType: '2-0-2', semester: 3, group: 'core' },
  { id: 'GI23302_GEO', name: 'Surveying', code: 'GI23302', type: '3-0-4', courseType: '3-0-4', semester: 3, group: 'core' },
  { id: 'GI23303_GEO', name: 'Remote Sensing', code: 'GI23303', type: '2-0-2', courseType: '2-0-2', semester: 3, group: 'core' },
  { id: 'GI23304_GEO', name: 'Principles of Photogrammetry', code: 'GI23304', type: '2-0-2', courseType: '2-0-2', semester: 3, group: 'core' },
  { id: 'UC23U01_GEO', name: 'Universal Human Values', code: 'UC23U01', type: 'UHV', courseType: 'universal-human-values', semester: 3, group: 'core' },

  // Semester IV (25 credits)
  { id: 'GI23401_GEO', name: 'Cartography and GIS', code: 'GI23401', type: '3-0-4', courseType: '3-0-4', semester: 4, group: 'core' },
  { id: 'GI23402_GEO', name: 'Electronic Surveying', code: 'GI23402', type: '3-0-4', courseType: '3-0-4', semester: 4, group: 'core' },
  { id: 'GI23403_GEO', name: 'Digital Image Processing', code: 'GI23403', type: '3-0-4', courseType: '3-0-4', semester: 4, group: 'core' },
  { id: 'GI23404_GEO', name: 'Geodesy', code: 'GI23404', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'GI23405_GEO', name: 'Hyperspectral & Thermal Remote Sensing', code: 'GI23405', type: '2-0-2', courseType: '2-0-2', semester: 4, group: 'core' },
  { id: 'GI23406_GEO', name: 'Environmental Sciences and Sustainability', code: 'GI23406', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'GI23S01_GEO', name: 'Skill Development Course I', code: 'GI23S01', type: '1-0-2', courseType: '1-0-2', semester: 4, group: 'core' },
  { id: 'AUDIT_COURSE_II_GEO', name: 'Audit Course – II', code: '', type: 'Audit Course', courseType: 'audit-course', semester: 4, group: 'core' },

  // Semester V (27 credits)
  { id: 'GI23501_GEO', name: 'Microwave Remote Sensing', code: 'GI23501', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'GI23502_GEO', name: 'Laser Scanning for Terrain Mapping', code: 'GI23502', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'GI23503_GEO', name: 'Spatial Analytics', code: 'GI23503', type: '2-0-4', courseType: '2-0-4', semester: 5, group: 'core' },
  { id: 'GI23S02_GEO', name: 'Skill Development Course II', code: 'GI23S02', type: '1-0-2', courseType: '1-0-2', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_GEO', name: 'Industry Oriented Course I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'UC23E01_GEO', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'core' },

  // Semester VI (24 credits)
  { id: 'GI23601_GEO', name: 'Geospatial Analysis with Python Programming', code: 'GI23601', type: '1-0-4', courseType: '1-0-4', semester: 6, group: 'core' },
  { id: 'GI23602_GEO', name: 'Spatial Data Adjustment', code: 'GI23602', type: 'Theory', courseType: 'theory', semester: 6, group: 'core' },
  { id: 'IOC_SEM6_II_GEO', name: 'Industry Oriented Course II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },
  { id: 'GI23S03_GEO', name: 'Skill Development Course III', code: 'GI23S03', type: '1-0-2', courseType: '1-0-2', semester: 6, group: 'core' },
  { id: 'UC23U02_GEO', name: 'Perspectives of Sustainable Development', code: 'UC23U02', type: 'Theory', courseType: 'theory', semester: 6, group: 'core' },

  // Semester VII (19 credits)
  { id: 'GI23701_GEO', name: 'Web and Cloud Based GIS', code: 'GI23701', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'core' },
  { id: 'GI23702_GEO', name: 'Natural Resource Management with Geomatics', code: 'GI23702', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'GI23703_GEO', name: 'Survey and Mapping Project with Standards', code: 'GI23703', type: '1-0-2', courseType: '1-0-2', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_GEO', name: 'Industry Oriented Course III', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'GI23L01_GEO', name: 'Self-Learning Course', code: 'GI23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'GI23801_GEO', name: 'Project Work / Internship cum Project Work', code: 'GI23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...GEO_ELECTIVE_OPTION_BOOK,
];

// --- BIOMEDICAL ENGINEERING PRESET CATALOG (Anna University Regulations 2023 - CEG Campus) ---

const BME_VERTICAL_ELECTIVES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  // Vertical I: Bio Engineering
  { name: 'Medical Physics', code: 'BM23001', type: 'Theory', courseType: 'theory' },
  { name: 'Pathology and Microbiology', code: 'BM23002', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Biomaterials and Artificial organs', code: 'BM23003', type: 'Theory', courseType: 'theory' },
  { name: 'Biomaterials and Characterization', code: 'BM23004', type: 'Theory', courseType: 'theory' },
  { name: 'Principles of Tissue Engineering', code: 'BM23005', type: 'Theory', courseType: 'theory' },
  { name: 'Neural Engineering', code: 'BM23006', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced bioanalytical and therapeutic techniques', code: 'BM23007', type: 'Theory', courseType: 'theory' },
  { name: 'Biostatistics', code: 'BM23008', type: 'Theory', courseType: 'theory' },
  { name: 'Indian traditional medical systems', code: 'BM23009', type: 'Theory', courseType: 'theory' },

  // Vertical II: Biosignal and Medical Image Processing
  { name: 'Biometric systems', code: 'BM23010', type: 'Theory', courseType: 'theory' },
  { name: 'Pattern Recognition and Neural Networks', code: 'BM23011', type: 'Theory', courseType: 'theory' },
  { name: 'Biomedical signal processing', code: 'BM23012', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Artificial Intelligence in Healthcare', code: 'BM23013', type: 'Theory', courseType: 'theory' },
  { name: 'Medical Image Analysis & its applications', code: 'BM23014', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Soft Computing and its applications', code: 'BM23015', type: 'Theory', courseType: 'theory' },
  { name: 'Brain Computer Interface and its Applications', code: 'BM23016', type: 'Theory', courseType: 'theory' },

  // Vertical III: Biomedical Device Development
  { name: 'Foundation Skills in Integrated Product Development', code: 'EC23C22', type: 'Theory', courseType: 'theory' },
  { name: 'Biomedical Device Design and development', code: 'BM23017', type: 'Theory', courseType: 'theory' },
  { name: 'Wearable systems', code: 'BM23018', type: 'Theory', courseType: 'theory' },
  { name: 'Body Area Networks', code: 'BM23C01', type: 'Theory', courseType: 'theory' },
  { name: 'Smart healthcare technologies and systems', code: 'BM23019', type: 'Theory', courseType: 'theory' },
  { name: 'MEMS and its Biomedical Applications', code: 'BM23020', type: 'Theory', courseType: 'theory' },
  { name: 'Bio Micro Fluidic Devices', code: 'BM23021', type: 'Theory', courseType: 'theory' },
  { name: 'Medical Optics', code: 'BM23022', type: 'Theory', courseType: 'theory' },

  // Vertical IV: Rehabilitation Engineering
  { name: 'Rehabilitation Engineering', code: 'BM23023', type: 'Theory', courseType: 'theory' },
  { name: 'Assistive technology', code: 'BM23024', type: 'Theory', courseType: 'theory' },
  { name: 'Ergonomics', code: 'BM23025', type: 'Theory', courseType: 'theory' },
  { name: 'Sports Engineering and Technology', code: 'BM23026', type: 'Theory', courseType: 'theory' },
  { name: 'Medical Robotics', code: 'BM23027', type: 'Theory', courseType: 'theory' },
  { name: 'Haptics', code: 'BM23028', type: 'Theory', courseType: 'theory' },
  { name: 'Physiological Modelling', code: 'BM23029', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Finite Element methods for biomedical engineering', code: 'BM23030', type: 'Theory', courseType: 'theory' },
  { name: 'Health care information systems', code: 'BM23031', type: 'Theory', courseType: 'theory' },
  { name: 'Hospital Management', code: 'BM23032', type: 'Theory', courseType: 'theory' },

  // Vertical V: AI in Health Care Systems
  { name: 'Health Care Data Analytics', code: 'BM23033', type: 'Theory', courseType: 'theory' },
  { name: 'Virtual Augmented and mixed Reality in Medicine', code: 'BM23034', type: 'Theory', courseType: 'theory' },
  { name: 'Deep Learning', code: 'BM23035', type: 'Theory', courseType: 'theory' },
  { name: 'Telemedicine technology', code: 'BM23036', type: 'Theory', courseType: 'theory' },
];

const BME_ETC_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Artificial Intelligence and Machine Learning', code: 'BM23E01', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Internet of Medical Things', code: 'BM23E02', type: 'Theory', courseType: 'theory' },
  { name: 'Biosensors', code: 'BM23E03', type: 'Theory', courseType: 'theory' },
  { name: 'Embedded System Design', code: 'BM23E04', type: '2-0-2', courseType: '2-0-2' },
];

const BME_OE_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Management of Wastes in Hospitals', code: 'BM23901', type: 'Theory', courseType: 'theory' },
  { name: 'Introduction to Biomaterials', code: 'BM23902', type: 'Theory', courseType: 'theory' },
  { name: 'Medical Instrumentation', code: 'BM23037', type: 'Theory', courseType: 'theory' },
  { name: 'Biomedical Equipment', code: 'BM23038', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Engineering', code: 'CE23901', type: 'Theory', courseType: 'theory' },
  { name: 'Electronics Engineering', code: 'EC23902', type: 'Theory', courseType: 'theory' },
  { name: 'UI and UX Design', code: 'CS23013', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Web Technologies', code: 'CS23010', type: '2-0-2', courseType: '2-0-2' },
];

const BME_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 4: Open Elective I
  ...BME_OE_COURSES.map((course, idx) => ({
    id: `bme-4-OE-I-${idx}`,
    ...course,
    semester: 4 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 5: Professional Elective I
  ...BME_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `bme-5-PE-I-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 5: Professional Elective II
  ...BME_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `bme-5-PE-II-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),

  // Sem 6: Emerging Technology Course I
  ...BME_ETC_COURSES.map((course, idx) => ({
    id: `bme-6-ETC-I-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 6: Professional Elective III
  ...BME_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `bme-6-PE-III-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 6: Open Elective II
  ...BME_OE_COURSES.map((course, idx) => ({
    id: `bme-6-OE-II-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),

  // Sem 7: Emerging Technology Course II
  ...BME_ETC_COURSES.map((course, idx) => ({
    id: `bme-7-ETC-II-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),

  // Sem 7: Professional Elective IV
  ...BME_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `bme-7-PE-IV-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 7: Professional Elective V
  ...BME_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `bme-7-PE-V-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),

  // Sem 7: Professional Elective VI
  ...BME_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `bme-7-PE-VI-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),
];

export const BME_PRESET_COURSES: PresetCourse[] = [
  // Semester I (18 credits)
  { id: 'EN23C05_BME', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_BME', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'CY23C10_BME', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'CS23C04_BME', name: 'Programming in C', code: 'CS23C04', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'EE23C01_BME', name: 'Basics of Electrical Engineering', code: 'EE23C01', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'UC23H01_BME', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },

  // Semester II (27 credits)
  { id: 'EN23C04_BME', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_BME', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'PH23C11_BME', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'ME23C03_BME', name: 'Engineering Mechanics', code: 'ME23C03', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'BM23201_BME', name: 'Data Structures and Object Oriented Programming in C++', code: 'BM23201', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'BM23202_BME', name: 'Anatomy and Physiology', code: 'BM23202', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'UC23H02_BME', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },
  { id: 'ME23C04_BME', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 2, group: 'core' },

  // Semester III (21 credits)
  { id: 'MA23C03_BME', name: 'Linear Algebra and Numerical Methods', code: 'MA23C03', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'BM23301_BME', name: 'Fundamentals of Biochemistry', code: 'BM23301', type: '2-0-2', courseType: '2-0-2', semester: 3, group: 'core' },
  { id: 'EC23C04_BME', name: 'Circuit Analysis', code: 'EC23C04', type: '2-1-2', courseType: '2-0-2', semester: 3, group: 'core' },
  { id: 'BM23302_BME', name: 'Electronic Devices and Circuits', code: 'BM23302', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'BM23303_BME', name: 'Sensors and Measurements', code: 'BM23303', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'BM23S01_BME', name: 'Sensors and System Engineering', code: 'BM23S01', type: '1-0-2', courseType: '1-0-2', semester: 3, group: 'core' },
  { id: 'AUDIT_COURSE_II_BME', name: 'Audit Course- II', code: '', type: 'Audit Course', courseType: 'audit-course', semester: 3, group: 'core' },

  // Semester IV (23 credits)
  { id: 'BM23401_BME', name: 'Biomedical Instrumentation', code: 'BM23401', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'BM23402_BME', name: 'Discrete Time Signal Processing', code: 'BM23402', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'BM23403_BME', name: 'Analog and Digital Integrated Circuits', code: 'BM23403', type: '3-0-4', courseType: '3-0-4', semester: 4, group: 'core' },
  { id: 'BM23U01_BME', name: 'Medical Standards and Regulations', code: 'BM23U01', type: 'Standards', courseType: 'standards-course', semester: 4, group: 'core' },
  { id: 'BM23S02_BME', name: 'Design and Development of Lab prototype for Biomedical Applications', code: 'BM23S02', type: '1-0-2', courseType: '1-0-2', semester: 4, group: 'core' },
  { id: 'UC23U01_BME', name: 'Universal Human Values', code: 'UC23U01', type: 'UHV', courseType: 'universal-human-values', semester: 4, group: 'core' },

  // Semester V (25 credits)
  { id: 'BM23501_BME', name: 'Diagnostic and Therapeutic Equipment I', code: 'BM23501', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'BM23502_BME', name: 'Control System for Biomedical Engineering', code: 'BM23502', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'BM23503_BME', name: 'Microcontrollers and Embedded Systems', code: 'BM23503', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_BME', name: 'Industry Oriented Course I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'BM23U02_BME', name: 'Perspectives of Sustainable Development', code: 'BM23U02', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'BM23504_BME', name: 'Summer Internship', code: 'BM23504', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 5, group: 'core' },
  { id: 'BM23S03_BME', name: 'Design and Development of Wearable biosensors', code: 'BM23S03', type: '1-0-2', courseType: '1-0-2', semester: 5, group: 'core' },

  // Semester VI (24 credits)
  { id: 'BM23601_BME', name: 'Diagnostic and Therapeutic Equipment II', code: 'BM23601', type: '3-0-2', courseType: '3-0-2', semester: 6, group: 'core' },
  { id: 'BM23602_BME', name: 'Biomechanics', code: 'BM23602', type: '3-0-2', courseType: '3-0-2', semester: 6, group: 'core' },
  { id: 'BM23C02_BME', name: 'Radiological Equipment', code: 'BM23C02', type: 'Theory', courseType: 'theory', semester: 6, group: 'core' },
  { id: 'UC23E01_BME', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'core' },
  { id: 'IOC_SEM6_II_BME', name: 'Industry Oriented Course II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },

  // Semester VII (23 credits)
  { id: 'BM23701_BME', name: 'Digital Image Processing', code: 'BM23701', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'BM23L01_BME', name: 'Self-learning Course', code: 'BM23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_BME', name: 'Industry Oriented Course III', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'BM23703_BME', name: 'Hospital Training (4 weeks)', code: 'BM23703', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 7, group: 'core' },
  { id: 'BM23704_BME', name: 'Mini Project', code: 'BM23704', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'BM23801_BME', name: 'Project Work / Internship cum Project Work', code: 'BM23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...BME_ELECTIVE_OPTION_BOOK,
];

// --- INFORMATION TECHNOLOGY PRESET CATALOG (Anna University Regulations 2023 - CEG/MIT Campuses) ---

const IT_VERTICAL_ELECTIVES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  // Vertical I: AI, ML and Data Science
  { name: 'Artificial Intelligence', code: 'IT23001', type: 'Theory', courseType: 'theory' },
  { name: 'Soft Computing', code: 'IT23002', type: 'Theory', courseType: 'theory' },
  { name: 'Big Data Analytics', code: 'IT23003', type: 'Theory', courseType: 'theory' },
  { name: 'Deep Learning', code: 'IT23004', type: 'Theory', courseType: 'theory' },
  { name: 'Social Network Analysis', code: 'IT23005', type: 'Theory', courseType: 'theory' },
  { name: 'Recommender Systems', code: 'IT23006', type: 'Theory', courseType: 'theory' },
  { name: 'Conversational Systems', code: 'IT23007', type: 'Theory', courseType: 'theory' },
  { name: 'Large Language Models (LLM)', code: 'IT23008', type: 'Theory', courseType: 'theory' },
  { name: 'MLOps', code: 'IT23009', type: 'Theory', courseType: 'theory' },
  { name: 'Bio informatics', code: 'IT23C14', type: 'Theory', courseType: 'theory' },
  { name: 'Healthcare Analytics', code: 'IT23C07', type: 'Theory', courseType: 'theory' },
  { name: 'Responsible AI', code: 'IT23C15', type: 'Theory', courseType: 'theory' },
  { name: 'Reinforcement Learning', code: 'IT23C08', type: 'Theory', courseType: 'theory' },
  { name: 'Cognitive Computing', code: 'IT23011', type: 'Theory', courseType: 'theory' },
  { name: 'Autonomous Ground Vehicle Systems', code: 'IT23012', type: 'Theory', courseType: 'theory' },
  { name: 'Robotic process Automation', code: 'IT23013', type: 'Theory', courseType: 'theory' },

  // Vertical II: Data, Web and Cloud Related Technologies
  { name: 'Advanced Databases', code: 'IT23014', type: 'Theory', courseType: 'theory' },
  { name: 'Data warehousing & Mining', code: 'IT23015', type: 'Theory', courseType: 'theory' },
  { name: 'Cloud Computing', code: 'IT23016', type: 'Theory', courseType: 'theory' },
  { name: 'Full Stack Development', code: 'IT23017', type: 'Theory', courseType: 'theory' },
  { name: 'C# & .Net programming', code: 'IT23018', type: 'Theory', courseType: 'theory' },
  { name: 'Enterprise Application Development', code: 'IT23019', type: 'Theory', courseType: 'theory' },
  { name: 'Software Testing and Automation', code: 'IT23020', type: 'Theory', courseType: 'theory' },
  { name: 'Virtualization', code: 'IT23021', type: 'Theory', courseType: 'theory' },
  { name: 'Serverless Computing', code: 'IT23022', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable IT and Green Technologies', code: 'IT23023', type: 'Theory', courseType: 'theory' },
  { name: 'Geospatial Data Analysis', code: 'IT23024', type: 'Theory', courseType: 'theory' },

  // Vertical III: Network and Security
  { name: 'Security in Computing', code: 'IT23025', type: 'Theory', courseType: 'theory' },
  { name: 'Ethical Hacking', code: 'IT23C10', type: 'Theory', courseType: 'theory' },
  { name: 'Mobile Computing', code: 'IT23026', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Networks', code: 'IT23C03', type: 'Theory', courseType: 'theory' },
  { name: 'Security and Privacy in Cloud', code: 'IT23C12', type: 'Theory', courseType: 'theory' },
  { name: 'Cyber Forensics and Malware Analysis', code: 'IT23027', type: 'Theory', courseType: 'theory' },
  { name: 'Blockchain and Cryptocurrency', code: 'IT23C05', type: 'Theory', courseType: 'theory' },
  { name: 'Software Defined Networks', code: 'IT23C13', type: 'Theory', courseType: 'theory' },
  { name: 'Next Generation Wireless Networks', code: 'IT23028', type: 'Theory', courseType: 'theory' },
  { name: 'Privacy and Security in Online Social Media', code: 'IT23029', type: 'Theory', courseType: 'theory' },

  // Vertical IV: Multimedia Technologies
  { name: 'Image Processing and Computer Vision', code: 'IT23030', type: 'Theory', courseType: 'theory' },
  { name: 'Human Computer Interaction', code: 'IT23031', type: 'Theory', courseType: 'theory' },
  { name: 'UI and UX Design', code: 'IT23032', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Marketing', code: 'IT23033', type: 'Theory', courseType: 'theory' },
  { name: 'Visual Effects (VFX)', code: 'IT23034', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Computer Graphics', code: 'IT23035', type: 'Theory', courseType: 'theory' },
  { name: 'Augmented and Virtual Reality', code: 'IT23C04', type: 'Theory', courseType: 'theory' },
  { name: 'Metaverse', code: 'IT23C11', type: 'Theory', courseType: 'theory' },
  { name: 'Game Design and Development', code: 'IT23C06', type: 'Theory', courseType: 'theory' },

  // Vertical V: Systems and Computational Theory
  { name: 'Unix Internals', code: 'IT23036', type: 'Theory', courseType: 'theory' },
  { name: 'Graph Theory', code: 'IT23037', type: 'Theory', courseType: 'theory' },
  { name: 'Embedded Systems', code: 'IT23C09', type: 'Theory', courseType: 'theory' },
  { name: 'Quantum Computing', code: 'IT23038', type: 'Theory', courseType: 'theory' },
  { name: 'Multicore Architecture and Programming', code: 'IT23010', type: 'Theory', courseType: 'theory' },
];

const IT_ETC_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'IoT Based Smart Systems', code: 'IT23E01', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Generative AI', code: 'IT23E02', type: 'Theory', courseType: 'theory' },
];

const IT_OE_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Information Technology Essentials', code: 'IT23901', type: 'Theory', courseType: 'theory' },
  { name: 'Data Science Fundamentals', code: 'IT23902', type: 'Theory', courseType: 'theory' },
  { name: 'Fundamentals of Machine Learning', code: 'IT23903', type: 'Theory', courseType: 'theory' },
  { name: 'IOT Basics and Applications', code: 'IT23904', type: 'Theory', courseType: 'theory' },
  { name: 'Principles in Object Oriented Programming', code: 'IT23905', type: 'Theory', courseType: 'theory' },
  { name: 'Introduction of Web Programming', code: 'IT23906', type: 'Theory', courseType: 'theory' },
  { name: 'Full Stack Development', code: 'IT23907', type: 'Theory', courseType: 'theory' },
  { name: 'Augmented and Virtual Reality', code: 'IT23908', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Engineering', code: 'CE23901', type: 'Theory', courseType: 'theory' },
  { name: 'Electronics Engineering', code: 'EC23902', type: 'Theory', courseType: 'theory' },
];

const IT_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5: Professional Elective I
  ...IT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `it-5-PE-I-${idx}`,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 6: Emerging Technology Course I
  ...IT_ETC_COURSES.map((course, idx) => ({
    id: `it-6-ETC-I-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 6: Professional Elective II
  ...IT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `it-6-PE-II-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),

  // Sem 6: Professional Elective III
  ...IT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `it-6-PE-III-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 6: Open Elective I
  ...IT_OE_COURSES.map((course, idx) => ({
    id: `it-6-OE-I-${idx}`,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 7: Emerging Technology Course II
  ...IT_ETC_COURSES.map((course, idx) => ({
    id: `it-7-ETC-II-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),

  // Sem 7: Professional Elective IV
  ...IT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `it-7-PE-IV-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 7: Professional Elective V
  ...IT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `it-7-PE-V-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),

  // Sem 7: Professional Elective VI
  ...IT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `it-7-PE-VI-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7: Open Elective II
  ...IT_OE_COURSES.map((course, idx) => ({
    id: `it-7-OE-II-${idx}`,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const IT_PRESET_COURSES: PresetCourse[] = [
  // Semester I (22 credits)
  { id: 'EN23C05_IT', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_IT', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'PH23C11_IT', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C01_IT', name: 'Engineering Drawing and 3D Modeling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'EE23C02_IT', name: 'Fundamentals of Electrical and Electronics Engineering', code: 'EE23C02', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'ME23C04_IT', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 1, group: 'core' },
  { id: 'UC23H01_IT', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },

  // Semester II (23 credits)
  { id: 'EN23C04_IT', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C03_IT', name: 'Linear Algebra and Numerical Methods', code: 'MA23C03', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'PH23C08_IT', name: 'Fundamentals of Electronic Materials and Devices', code: 'PH23C08', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'CY23C10_IT', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'CS23C04_IT', name: 'Programming in C', code: 'CS23C04', type: '2-0-4', courseType: '2-0-4', semester: 2, group: 'core' },
  { id: 'IT23201_IT', name: 'Information Technology Essentials', code: 'IT23201', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'UC23H02_IT', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },
  { id: 'AUDIT_COURSE_I_IT', name: 'Audit Course - I', code: '', type: 'Audit Course', courseType: 'audit-course', semester: 2, group: 'core' },

  // Semester III (21 credits)
  { id: 'MA23C09_IT', name: 'Finite State Automata and Discrete Structures', code: 'MA23C09', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'IT23301_IT', name: 'Digital Logic and Design', code: 'IT23301', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'IT23302_IT', name: 'Data Structures', code: 'IT23302', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'IT23303_IT', name: 'Database Management Systems', code: 'IT23303', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'IT23304_IT', name: 'Object Oriented Programming', code: 'IT23304', type: '1-0-2', courseType: '1-0-2', semester: 3, group: 'core' },
  { id: 'IT23U01_IT', name: 'Standards – IT', code: 'IT23U01', type: 'Standards', courseType: 'standards-course', semester: 3, group: 'core' },
  { id: 'UC23U01_IT', name: 'Universal Human Values', code: 'UC23U01', type: 'UHV', courseType: 'universal-human-values', semester: 3, group: 'core' },

  // Semester IV (24 credits)
  { id: 'MA23C05_IT', name: 'Probability and Statistics', code: 'MA23C05', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'IT23401_IT', name: 'Advanced Data Structures', code: 'IT23401', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'IT23C01_IT', name: 'Design and Analysis of Algorithms', code: 'IT23C01', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'IT23402_IT', name: 'Computer Organization and Architecture', code: 'IT23402', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'IT23403_IT', name: 'Software Engineering', code: 'IT23403', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'IT23C02_IT', name: 'Operating Systems', code: 'IT23C02', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'IT23L01_IT', name: 'Self-Learning Course', code: 'IT23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 4, group: 'core' },
  { id: 'AUDIT_COURSE_II_IT', name: 'Audit Course-II', code: '', type: 'Audit Course', courseType: 'audit-course', semester: 4, group: 'core' },
  { id: 'IT23S01_IT', name: 'Skill Development Course I', code: 'IT23S01', type: '1-0-2', courseType: '1-0-2', semester: 4, group: 'core' },

  // Semester V (25 credits)
  { id: 'IT23501_IT', name: 'Computer Networks', code: 'IT23501', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'IT23502_IT', name: 'Web Programming', code: 'IT23502', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'IT23503_IT', name: 'Compiler Design', code: 'IT23503', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'IT23504_IT', name: 'Machine Learning', code: 'IT23504', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'UC23E01_IT', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_IT', name: 'Industry Oriented Course I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'IT23S02_IT', name: 'Skill Development Course II', code: 'IT23S02', type: 'Skill Development', courseType: 'self-development', semester: 5, group: 'core' },
  { id: 'IT23505_IT', name: 'Societal Oriented Project', code: 'IT23505', type: 'Project', courseType: 'laboratory-course', semester: 5, group: 'core' },

  // Semester VI (25 credits)
  { id: 'IT23601_IT', name: 'Distributed Systems and Computing', code: 'IT23601', type: 'Theory', courseType: 'theory', semester: 6, group: 'core' },
  { id: 'IT23602_IT', name: 'Natural Language and Image Processing', code: 'IT23602', type: '3-0-2', courseType: '3-0-2', semester: 6, group: 'core' },
  { id: 'IT23S03_IT', name: 'Skill Development Course III', code: 'IT23S03', type: 'Skill Development', courseType: 'self-development', semester: 6, group: 'core' },
  { id: 'IOC_SEM6_II_IT', name: 'Industry Oriented Course II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },
  { id: 'IT23U02_IT', name: 'Perspectives of Sustainability Development', code: 'IT23U02', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'core' },

  // Semester VII (22 credits)
  { id: 'IT23701_IT', name: 'Cryptography and Network Security', code: 'IT23701', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_IT', name: 'Industry Oriented Course III', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'IT23702_IT', name: 'Software Development Project Laboratory', code: 'IT23702', type: 'Project Lab', courseType: 'laboratory-course', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'IT23801_IT', name: 'Project Work / Internship cum Project Work', code: 'IT23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...IT_ELECTIVE_OPTION_BOOK,
];



const EEE_VERTICAL_ELECTIVES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Utilization and Conservation of Electrical Energy', code: 'EE23001', type: 'Theory', courseType: 'theory' },
  { name: 'Substation Engineering and Automation', code: 'EE23002', type: 'Theory', courseType: 'theory' },
  { name: 'HVDC and FACTS', code: 'EE23003', type: 'Theory', courseType: 'theory' },
  { name: 'Energy Management and Auditing', code: 'EE23004', type: 'Theory', courseType: 'theory' },
  { name: 'Power System Transients', code: 'EE23005', type: 'Theory', courseType: 'theory' },
  { name: 'Smart Grid', code: 'EE23006', type: 'Theory', courseType: 'theory' },
  { name: 'Restructured Power Market', code: 'EE23007', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable HV Insulation System', code: 'EE23008', type: 'Theory', courseType: 'theory' },
  { name: 'Electrical Machines-III', code: 'EE23009', type: 'Theory', courseType: 'theory' },
  { name: 'Analysis of Electrical Machines', code: 'EE23010', type: 'Theory', courseType: 'theory' },
  { name: 'Multilevel Power Converters', code: 'EE23011', type: 'Theory', courseType: 'theory' },
  { name: 'Electrical Drives', code: 'EE23012', type: 'Theory', courseType: 'theory' },
  { name: 'SMPS and UPS', code: 'EE23013', type: 'Theory', courseType: 'theory' },
  { name: 'Power Electronics for Renewable Energy Systems', code: 'EE23014', type: 'Theory', courseType: 'theory' },
  { name: 'Control of Power Electronics Circuits', code: 'EE23015', type: 'Theory', courseType: 'theory' },
  { name: 'Power Quality', code: 'EE23016', type: 'Theory', courseType: 'theory' },
  { name: 'Embedded C- Programming', code: 'EE23017', type: 'Theory', courseType: 'theory' },
  { name: 'Embedded Processors', code: 'EE23018', type: 'Theory', courseType: 'theory' },
  { name: 'Embedded Control for Electric Drives', code: 'EE23019', type: 'Theory', courseType: 'theory' },
  { name: 'Smart System Automation', code: 'EE23020', type: 'Theory', courseType: 'theory' },
  { name: 'Embedded System for Automotive Applications', code: 'EE23021', type: 'Theory', courseType: 'theory' },
  { name: 'VLSI Design', code: 'EE23022', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Signal Processing', code: 'EE23023', type: 'Theory', courseType: 'theory' },
  { name: 'Big Data Analytics', code: 'EE23024', type: 'Theory', courseType: 'theory' },
  { name: 'Electric Vehicle Architecture and Dynamics', code: 'EE23025', type: 'Theory', courseType: 'theory' },
  { name: 'Electric Vehicle Design, Modelling and Control', code: 'EE23026', type: 'Theory', courseType: 'theory' },
  { name: 'Design of Electric Vehicle Charging System', code: 'EE23027', type: 'Theory', courseType: 'theory' },
  { name: 'Testing of Electric Vehicles', code: 'EE23028', type: 'Theory', courseType: 'theory' },
  { name: 'Grid Integration of Electric Vehicles', code: 'EE23029', type: 'Theory', courseType: 'theory' },
  { name: 'Energy Storage Systems', code: 'EE23030', type: 'Theory', courseType: 'theory' },
  { name: 'Industrial Automation Systems', code: 'EE23031', type: 'Theory', courseType: 'theory' },
  { name: 'Robotics And Automation', code: 'EE23032', type: 'Theory', courseType: 'theory' },
  { name: 'Model Based Control', code: 'EE23033', type: 'Theory', courseType: 'theory' },
  { name: 'Non Linear Control', code: 'EE23034', type: 'Theory', courseType: 'theory' },
  { name: 'System Identification', code: 'EE23035', type: 'Theory', courseType: 'theory' },
  { name: 'Adaptive Control', code: 'EE23036', type: 'Theory', courseType: 'theory' },
  { name: 'Process Modeling and Simulation', code: 'EE23037', type: 'Theory', courseType: 'theory' },
  { name: 'Computer Control of Processes', code: 'EE23038', type: 'Theory', courseType: 'theory' },
];

const EEE_ETC_COURSES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'AI and ML Fundamentals', code: 'EE23E01', type: '3-0-2', courseType: '3-0-2' },
  { name: 'Electrical Machine Design for EV', code: 'EE23E02', type: '3-0-2', courseType: '3-0-2' },
  { name: 'Sustainable Electrification for Remote Communities', code: 'EE23E03', type: '3-0-2', courseType: '3-0-2' },
  { name: 'Embedded System Design', code: 'EE23E04', type: '3-0-2', courseType: '3-0-2' },
  { name: 'MEMS and NEMS', code: 'EE23E05', type: '3-0-2', courseType: '3-0-2' },
];

const EEE_OE_COURSES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Introduction to Control System', code: 'EE23901', type: 'Theory', courseType: 'theory' },
  { name: 'Electrical Vehicle Technologies', code: 'EE23902', type: 'Theory', courseType: 'theory' },
  { name: 'Introduction to Embedded Systems', code: 'EE23903', type: 'Theory', courseType: 'theory' },
];

const EEE_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 4: Emerging Technology Course I
  ...EEE_ETC_COURSES.map((course, idx) => ({
    id: 'eee-4-ETC-I-' + idx,
    ...course,
    semester: 4 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 5: Professional Elective I
  ...EEE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'eee-5-PE-I-' + idx,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 6: Professional Elective II
  ...EEE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'eee-6-PE-II-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),

  // Sem 6: Professional Elective III
  ...EEE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'eee-6-PE-III-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 6: Open Elective I
  ...EEE_OE_COURSES.map((course, idx) => ({
    id: 'eee-6-OE-I-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 7: Emerging Technology Course II
  ...EEE_ETC_COURSES.map((course, idx) => ({
    id: 'eee-7-ETC-II-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),

  // Sem 7: Professional Elective IV
  ...EEE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'eee-7-PE-IV-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 7: Professional Elective V
  ...EEE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'eee-7-PE-V-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),

  // Sem 7: Professional Elective VI
  ...EEE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'eee-7-PE-VI-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7: Open Elective II
  ...EEE_OE_COURSES.map((course, idx) => ({
    id: 'eee-7-OE-II-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const EEE_PRESET_COURSES: PresetCourse[] = [
  // Semester I (24 credits)
  { id: 'EN23C05_EEE', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_EEE', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'PH23C11_EEE', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C01_EEE', name: 'Engineering Drawing and 3D Modeling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'ME23C05_EEE', name: 'Basics of Mechanical Engineering', code: 'ME23C05', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'CE23C03_EEE', name: 'Basic Civil Engineering', code: 'CE23C03', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'UC23H01_EEE', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },
  { id: 'CS23C04_EEE', name: 'Programming in C', code: 'CS23C04', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },

  // Semester II (22 credits)
  { id: 'EN23C04_EEE', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_EEE', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'CY23C10_EEE', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'PH23C10_EEE', name: 'Electronic Properties of Materials', code: 'PH23C10', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'ME23C03_EEE', name: 'Engineering Mechanics', code: 'ME23C03', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'UC23H02_EEE', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },
  { id: 'ME23C04_EEE', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 2, group: 'core' },

  // Semester III (24 credits)
  { id: 'MA23C03_EEE', name: 'Linear Algebra and Numerical Methods', code: 'MA23C03', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'EE23301_EEE', name: 'Electrical Circuit Analysis', code: 'EE23301', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'EE23302_EEE', name: 'Electromagnetic Theory', code: 'EE23302', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'EE23303_EEE', name: 'Digital Electronics', code: 'EE23303', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'EE23304_EEE', name: 'Analog Electronics', code: 'EE23304', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'EE23S01_EEE', name: 'Skill Development Course I', code: 'EE23S01', type: '1-0-2', courseType: '1-0-2', semester: 3, group: 'core' },
  { id: 'UC23U01_EEE', name: 'Universal Human Values', code: 'UC23U01', type: 'Universal Human Values', courseType: 'universal-human-values', semester: 3, group: 'core' },

  // Semester IV (26 credits)
  { id: 'EE23401_EEE', name: 'Signal and Systems for Electrical Engineers', code: 'EE23401', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'EE23402_EEE', name: 'Electrical Machines - I', code: 'EE23402', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'EE23403_EEE', name: 'Measurement and Instrumentation', code: 'EE23403', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'EE23404_EEE', name: 'Microprocessors and Microcontrollers', code: 'EE23404', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'EE23405_EEE', name: 'Transmission and Distribution', code: 'EE23405', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'EE23S02_EEE', name: 'Skill Development Course II', code: 'EE23S02', type: '1-0-2', courseType: '1-0-2', semester: 4, group: 'core' },
  { id: 'EE23406_EEE', name: 'Electrical Machines Laboratory – I', code: 'EE23406', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 4, group: 'core' },

  // Semester V (25 credits)
  { id: 'EE23501_EEE', name: 'Electrical Machines – II', code: 'EE23501', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'EE23502_EEE', name: 'Control Systems Design', code: 'EE23502', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'EE23503_EEE', name: 'Power System Analysis', code: 'EE23503', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'EE23504_EEE', name: 'Power Electronics', code: 'EE23504', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_EEE', name: 'Industry Oriented Course I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'UC23E01_EEE', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'core' },
  { id: 'EE23L01_EEE', name: 'Self-Learning Course', code: 'EE23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 5, group: 'core' },
  { id: 'EE23505_EEE', name: 'Electrical Machines Laboratory – II', code: 'EE23505', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 5, group: 'core' },

  // Semester VI (23 credits)
  { id: 'EE23601_EEE', name: 'Power System Operation and Control', code: 'EE23601', type: '3-0-2', courseType: '3-0-2', semester: 6, group: 'core' },
  { id: 'EE23602_EEE', name: 'Protection and Switchgear', code: 'EE23602', type: '3-0-2', courseType: '3-0-2', semester: 6, group: 'core' },
  { id: 'EE23U02_EEE', name: 'Sustainable Development – Electrical Engineering', code: 'EE23U02', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'core' },
  { id: 'EE23S03_EEE', name: 'Skill Development Course – III', code: 'EE23S03', type: '1-0-2', courseType: '1-0-2', semester: 6, group: 'core' },
  { id: 'IOC_SEM6_II_EEE', name: 'Industry Oriented Course II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },

  // Semester VII (22 credits)
  { id: 'EE23701_EEE', name: 'High Voltage Engineering', code: 'EE23701', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_EEE', name: 'Industry Oriented Course III', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'EE23U01_EEE', name: 'Standards - Electrical Engineering', code: 'EE23U01', type: 'Standards Course', courseType: 'standards-course', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'EE23801_EEE', name: 'Project Work / Internship cum Project Work', code: 'EE23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...EEE_ELECTIVE_OPTION_BOOK,
];


const MFG_VERTICAL_ELECTIVES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Industrial Robotics and Automation', code: 'MF23001', type: 'Theory', courseType: 'theory' },
  { name: 'Machine vision', code: 'PR23C05', type: 'Theory', courseType: 'theory' },
  { name: 'Drives and Actuators', code: 'MF23002', type: 'Theory', courseType: 'theory' },
  { name: 'Sensors for Condition Monitoring and Intelligent systems', code: 'MF23003', type: 'Theory', courseType: 'theory' },
  { name: 'Flexible Manufacturing system', code: 'MF23004', type: 'Theory', courseType: 'theory' },
  { name: 'Drone Technologies', code: 'ME23C16', type: 'Theory', courseType: 'theory' },
  { name: 'Operations Research', code: 'IE23C06', type: 'Theory', courseType: 'theory' },
  { name: 'Total Productive Maintenance', code: 'MF23C04', type: 'Theory', courseType: 'theory' },
  { name: 'Total Quality Management', code: 'IE23C07', type: 'Theory', courseType: 'theory' },
  { name: 'Supply Chain Analytics', code: 'IE23C10', type: 'Theory', courseType: 'theory' },
  { name: 'Engineering Quality Control', code: 'IE23C01', type: 'Theory', courseType: 'theory' },
  { name: 'Fundamentals of Lean Six Sigma', code: 'IE23C02', type: 'Theory', courseType: 'theory' },
  { name: 'Design of Jigs, Fixtures and Gauges', code: 'PR23C03', type: 'Theory', courseType: 'theory' },
  { name: 'Finite Element Analysis', code: 'ME23C09', type: 'Theory', courseType: 'theory' },
  { name: 'Design for Manufacturing', code: 'MF23005', type: 'Theory', courseType: 'theory' },
  { name: 'New Product Development', code: 'MF23006', type: 'Theory', courseType: 'theory' },
  { name: 'Design for Sustainability', code: 'MF23007', type: 'Theory', courseType: 'theory' },
  { name: 'Ergonomics and Human factors Engineering', code: 'MF23C03', type: 'Theory', courseType: 'theory' },
  { name: 'Advances in Conventional Manufacturing Technologies', code: 'MF23008', type: 'Theory', courseType: 'theory' },
  { name: 'Precision Manufacturing and Nano Technology', code: 'MF23C06', type: 'Theory', courseType: 'theory' },
  { name: 'Micromachining and Microfabrication Technologies', code: 'MF23009', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Manufacturing', code: 'MF23C05', type: 'Theory', courseType: 'theory' },
  { name: 'Electronics Manufacturing Technology', code: 'MF23010', type: 'Theory', courseType: 'theory' },
  { name: 'Laser Based Manufacturing', code: 'MF23011', type: 'Theory', courseType: 'theory' },
  { name: 'Design of Mechatronics System', code: 'MF23012', type: 'Theory', courseType: 'theory' },
  { name: 'IIoT in Manufacturing', code: 'MF23013', type: 'Theory', courseType: 'theory' },
  { name: 'Engineering Data Analytics', code: 'RA23C01', type: 'Theory', courseType: 'theory' },
  { name: 'Haptics and Immersive Technologies', code: 'ME23C10', type: 'Theory', courseType: 'theory' },
  { name: 'Blockchain in manufacturing', code: 'MF23014', type: 'Theory', courseType: 'theory' },
  { name: 'Modern Robotics', code: 'ME23C13', type: 'Theory', courseType: 'theory' },
  { name: 'An Introduction to Reverse Engineering', code: 'MF23015', type: 'Theory', courseType: 'theory' },
  { name: 'Industrial Standards and Quality control for Additive Manufacturing', code: 'MF23016', type: 'Theory', courseType: 'theory' },
  { name: 'Business Improvement Strategies with Additive Manufacturing', code: 'MF23017', type: 'Theory', courseType: 'theory' },
  { name: 'Metallurgical aspects of Additive Manufacturing', code: 'MF23018', type: 'Theory', courseType: 'theory' },
  { name: 'Design for Additive Manufacturing', code: 'MF23019', type: 'Theory', courseType: 'theory' },
  { name: 'Modelling and Simulation in Additive Manufacturing', code: 'MF23020', type: 'Theory', courseType: 'theory' },
];

const MFG_ETC1_COURSES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Smart Manufacturing', code: 'MF23E01', type: '3-0-2', courseType: '3-0-2' },
  { name: 'Nano Manufacturing and Characterization', code: 'MF23E02', type: 'Theory', courseType: 'theory' },
];

const MFG_ETC2_COURSES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Electronic Chip Manufacturing', code: 'MF23E03', type: 'Theory', courseType: 'theory' },
];

const MFG_OE_COURSES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Electronics Packaging Technology', code: 'MF23901', type: 'Theory', courseType: 'theory' },
  { name: 'Industrial and Bio-Inspired Robotics', code: 'MF23902', type: 'Theory', courseType: 'theory' },
];

const MFG_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5: Emerging Technology Course I
  ...MFG_ETC1_COURSES.map((course, idx) => ({
    id: 'mfg-5-ETC-I-' + idx,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 6: Professional Elective I
  ...MFG_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mfg-6-PE-I-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 6: Professional Elective II
  ...MFG_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mfg-6-PE-II-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),

  // Sem 6: Professional Elective III
  ...MFG_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mfg-6-PE-III-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 6: Professional Elective IV
  ...MFG_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mfg-6-PE-IV-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 6: Professional Elective V
  ...MFG_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mfg-6-PE-V-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),

  // Sem 6: Open Elective I
  ...MFG_OE_COURSES.map((course, idx) => ({
    id: 'mfg-6-OE-I-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 7: Emerging Technology Course II
  ...MFG_ETC2_COURSES.map((course, idx) => ({
    id: 'mfg-7-ETC-II-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),

  // Sem 7: Professional Elective VI
  ...MFG_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mfg-7-PE-VI-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7: Open Elective II
  ...MFG_OE_COURSES.map((course, idx) => ({
    id: 'mfg-7-OE-II-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const MFG_PRESET_COURSES: PresetCourse[] = [
  // Semester I (25 credits)
  { id: 'EN23C05_MFG', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_MFG', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'CY23C10_MFG', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C01_MFG', name: 'Engineering Drawing and 3D Modelling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'CS23C02_MFG', name: 'Computer Programming in Python', code: 'CS23C02', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C04_MFG', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 1, group: 'core' },
  { id: 'UC23H01_MFG', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },
  { id: 'UC23U01_MFG', name: 'Universal Human Values', code: 'UC23U01', type: 'Universal Human Values', courseType: 'universal-human-values', semester: 1, group: 'core' },

  // Semester II (21 credits)
  { id: 'EN23C04_MFG', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_MFG', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'PH23C11_MFG', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'EE23C03_MFG', name: 'Basics of Electrical and Electronics Engineering', code: 'EE23C03', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MF23201_MFG', name: 'Evolution of Manufacturing Engineering', code: 'MF23201', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'ME23C03_MFG', name: 'Engineering Mechanics', code: 'ME23C03', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'UC23H02_MFG', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },

  // Semester III (24 credits)
  { id: 'MF23301_MFG', name: 'Thermodynamics and Heat Transfer', code: 'MF23301', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'MF23302_MFG', name: 'Casting and Welding Technology', code: 'MF23302', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'MF23303_MFG', name: 'Forming Technology', code: 'MF23303', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'MF23304_MFG', name: 'Engineering Materials and Metallurgy', code: 'MF23304', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'CE23C01_MFG', name: 'Mechanics of Materials', code: 'CE23C01', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'CE23C02_MFG', name: 'Fluid Mechanics and Machinery', code: 'CE23C02', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'MF23S01_MFG', name: 'Skill Development - I', code: 'MF23S01', type: '1-0-2', courseType: '1-0-2', semester: 3, group: 'core' },

  // Semester IV (23 credits)
  { id: 'MF23401_MFG', name: 'Machining Technology', code: 'MF23401', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'ME23C15_MFG', name: 'Design of Machine Elements', code: 'ME23C15', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'ME23C11_MFG', name: 'Kinematics and Dynamics of Machinery', code: 'ME23C11', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'MF23402_MFG', name: 'Fluid Power Systems', code: 'MF23402', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'MF23403_MFG', name: 'Computer Aided Design', code: 'MF23403', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'MF23404_MFG', name: 'Additive Manufacturing', code: 'MF23404', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'MF23L01_MFG', name: 'Self-Learning Course', code: 'MF23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 4, group: 'core' },

  // Semester V (23 credits)
  { id: 'MF23501_MFG', name: 'CNC Machine Tools', code: 'MF23501', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'MF23C02_MFG', name: 'Non-Traditional Machining Processes', code: 'MF23C02', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'MF23502_MFG', name: 'Metrology and Computer Aided Inspection', code: 'MF23502', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'MF23U02_MFG', name: 'Perspectives of Sustainable Development in Manufacturing Engineering', code: 'MF23U02', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'core' },
  { id: 'MF23S02_MFG', name: 'Skill Development Course - II', code: 'MF23S02', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_MFG', name: 'Industry Oriented Course – I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'MF23503_MFG', name: 'Summer Internship', code: 'MF23503', type: 'Project', courseType: 'project', semester: 5, group: 'core' },

  // Semester VI (21 credits)
  { id: 'IOC_SEM6_II_MFG', name: 'Industry Oriented Course – II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },
  { id: 'MF23601_MFG', name: 'Advanced Manufacturing Lab', code: 'MF23601', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 6, group: 'core' },

  // Semester VII (23 credits)
  { id: 'MF23701_MFG', name: 'Manufacturing Management Systems', code: 'MF23701', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'ME23C12_MFG', name: 'Mechatronics and IoT', code: 'ME23C12', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_MFG', name: 'Industry Oriented Course – III', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'UC23E01_MFG', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'core' },
  { id: 'MF23U01_MFG', name: 'Standards for Manufacturing Engineering', code: 'MF23U01', type: 'Standards Course', courseType: 'standards-course', semester: 7, group: 'core' },
  { id: 'MF23S03_MFG', name: 'Skill Development - III', code: 'MF23S03', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'MF23801_MFG', name: 'Project Work / Internship cum Project Work', code: 'MF23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...MFG_ELECTIVE_OPTION_BOOK,
];


const VLSI_VERTICAL_ELECTIVES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Advanced Digital Signal Processing', code: 'EC23C23', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Speech Processing', code: 'EC23C24', type: 'Theory', courseType: 'theory' },
  { name: 'Principles of Digital Image Processing', code: 'VL23001', type: 'Theory', courseType: 'theory' },
  { name: 'DSP Architecture and Programming', code: 'EC23C15', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Digital Control Engineering', code: 'EC23C19', type: 'Theory', courseType: 'theory' },
  { name: 'Multimedia Compression and Networks', code: 'EC23C25', type: 'Theory', courseType: 'theory' },
  { name: 'Microwave Engineering', code: 'VL23002', type: 'Theory', courseType: 'theory' },
  { name: 'Passive RF And Integrated Circuits', code: 'VL23003', type: 'Theory', courseType: 'theory' },
  { name: 'RF IC Design', code: 'VL23004', type: 'Theory', courseType: 'theory' },
  { name: 'Analog IC Design', code: 'VL23005', type: 'Theory', courseType: 'theory' },
  { name: 'Mixed Signal IC Design', code: 'VL23006', type: 'Theory', courseType: 'theory' },
  { name: 'Data Converters', code: 'EC23C12', type: 'Theory', courseType: 'theory' },
  { name: 'Power Management and Clock Distribution Circuits', code: 'VL23007', type: 'Theory', courseType: 'theory' },
  { name: 'Design Of Analog Filters and Signal Conditioning Circuits', code: 'VL23008', type: 'Theory', courseType: 'theory' },
  { name: 'Low Power VLSI Design Techniques', code: 'VL23009', type: 'Theory', courseType: 'theory' },
  { name: 'Signal Integrity for High-Speed Design', code: 'VL23010', type: 'Theory', courseType: 'theory' },
  { name: 'Microcontroller Based System Design', code: 'VL23011', type: 'Theory', courseType: 'theory' },
  { name: 'Embedded Artificial Intelligence', code: 'VL23012', type: 'Theory', courseType: 'theory' },
  { name: 'Introduction To Industry 4.0', code: 'VL23013', type: 'Theory', courseType: 'theory' },
  { name: 'IOT Processor', code: 'VL23014', type: 'Theory', courseType: 'theory' },
  { name: 'Data Analytics for IOT', code: 'VL23015', type: 'Theory', courseType: 'theory' },
  { name: 'Sensor For IOT Application', code: 'VL23016', type: 'Theory', courseType: 'theory' },
  { name: 'IOT for Smart Agriculture', code: 'VL23017', type: 'Theory', courseType: 'theory' },
  { name: 'IOT and Edge Computing', code: 'VL23018', type: 'Theory', courseType: 'theory' },
  { name: 'IOT Security', code: 'VL23019', type: 'Theory', courseType: 'theory' },
  { name: 'Soft Computing and Its Applications', code: 'EC23C18', type: 'Theory', courseType: 'theory' },
  { name: 'Bio-Inspired Computing', code: 'EC23C20', type: 'Theory', courseType: 'theory' },
  { name: 'Machine Learning in VLSI System Design', code: 'VL23020', type: 'Theory', courseType: 'theory' },
  { name: 'Neuromorphic Computing and Design', code: 'VL23021', type: 'Theory', courseType: 'theory' },
  { name: 'Cyber Security', code: 'VL23022', type: 'Theory', courseType: 'theory' },
  { name: 'Reconfigurable Computing System and Applications', code: 'VL23023', type: 'Theory', courseType: 'theory' },
  { name: 'Algorithms For VLSI', code: 'VL23024', type: 'Theory', courseType: 'theory' },
  { name: 'Hardware and Software Aspects of Embedded Systems', code: 'VL23025', type: 'Theory', courseType: 'theory' },
  { name: 'Scripting Language and Verification', code: 'VL23026', type: 'Theory', courseType: 'theory' },
  { name: 'Robotics', code: 'EC23C33', type: 'Theory', courseType: 'theory' },
  { name: 'Biomedical Instrumentation', code: 'EC23C09', type: 'Theory', courseType: 'theory' },
  { name: 'Biomedical Assist Devices', code: 'EC23C07', type: 'Theory', courseType: 'theory' },
  { name: 'Biosignal Processing', code: 'VL23027', type: 'Theory', courseType: 'theory' },
  { name: 'Body Area Network', code: 'BM23C01', type: 'Theory', courseType: 'theory' },
  { name: 'Brain Computer Interface And Its Applications', code: 'EC23C08', type: 'Theory', courseType: 'theory' },
  { name: 'Microfluidics Biomedical Devices', code: 'VL23028', type: 'Theory', courseType: 'theory' },
  { name: 'Human Assist Devices', code: 'VL23029', type: 'Theory', courseType: 'theory' },
  { name: 'Medical Imaging Systems and Radia Therapy', code: 'VL23030', type: 'Theory', courseType: 'theory' },
  { name: 'Introduction To Nano Electronics', code: 'EC23C17', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced MOSFET Modeling', code: 'VL23031', type: 'Theory', courseType: 'theory' },
  { name: 'Compound Semiconductor Devices', code: 'VL23032', type: 'Theory', courseType: 'theory' },
  { name: 'Nanosensors And Devices', code: 'VL23033', type: 'Theory', courseType: 'theory' },
  { name: 'Introduction To Mems and Nems', code: 'EC23C16', type: 'Theory', courseType: 'theory' },
  { name: 'Nanophotonic Devices', code: 'VL23034', type: 'Theory', courseType: 'theory' },
  { name: 'Organic Semiconductors and Polymers', code: 'VL23035', type: 'Theory', courseType: 'theory' },
  { name: 'Solar PV Fundamentals and Applications', code: 'VL23036', type: 'Theory', courseType: 'theory' },
  { name: 'Wide Bandgap Devices', code: 'VL23037', type: 'Theory', courseType: 'theory' },
  { name: 'Design For Verification using UVM', code: 'VL23038', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Introduction To VLSI Lifecycle', code: 'VL23039', type: 'Theory', courseType: 'theory' },
  { name: 'PCB And System Design', code: 'VL23041', type: 'Theory', courseType: 'theory' },
  { name: 'Electronic Packaging Technologies', code: 'VL23042', type: 'Theory', courseType: 'theory' },
  { name: 'Wireless Sensor Network Design', code: 'EC23C01', type: 'Theory', courseType: 'theory' },
  { name: 'Natural Language Processing', code: 'VL23043', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Computer Vision', code: 'VL23044', type: 'Theory', courseType: 'theory' },
];

const VLSI_ETC_COURSES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Quantum Computing Technologies', code: 'VL23E01', type: 'Theory', courseType: 'theory' },
  { name: 'Neuromorphic VLSI Design', code: 'VL23E02', type: 'Theory', courseType: 'theory' },
  { name: 'Hardware Security and Trust', code: 'VL23E03', type: 'Theory', courseType: 'theory' },
  { name: 'Silicon Photonics', code: 'VL23E04', type: 'Theory', courseType: 'theory' },
];

const VLSI_OE_COURSES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Fundamentals of VLSI Design', code: 'VL23901', type: 'Theory', courseType: 'theory' },
  { name: 'Introduction to Embedded Systems', code: 'VL23902', type: 'Theory', courseType: 'theory' },
  { name: 'Sensors and Actuators', code: 'VL23903', type: 'Theory', courseType: 'theory' },
];

const VLSI_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5: Emerging Technology I
  ...VLSI_ETC_COURSES.map((course, idx) => ({
    id: 'vlsi-5-ETC-I-' + idx,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology I',
  })),

  // Sem 5: Professional Elective I
  ...VLSI_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'vlsi-5-PE-I-' + idx,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 6: Emerging Technology II
  ...VLSI_ETC_COURSES.map((course, idx) => ({
    id: 'vlsi-6-ETC-II-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology II',
  })),

  // Sem 6: Professional Elective II
  ...VLSI_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'vlsi-6-PE-II-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),

  // Sem 6: Professional Elective III
  ...VLSI_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'vlsi-6-PE-III-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 6: Open Elective I
  ...VLSI_OE_COURSES.map((course, idx) => ({
    id: 'vlsi-6-OE-I-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 7: Professional Elective IV
  ...VLSI_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'vlsi-7-PE-IV-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 7: Professional Elective V
  ...VLSI_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'vlsi-7-PE-V-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),

  // Sem 7: Professional Elective VI
  ...VLSI_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'vlsi-7-PE-VI-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7: Open Elective II
  ...VLSI_OE_COURSES.map((course, idx) => ({
    id: 'vlsi-7-OE-II-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const VLSI_PRESET_COURSES: PresetCourse[] = [
  // Semester I (23 credits)
  { id: 'EN23C05_VLSI', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_VLSI', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'PH23C11_VLSI', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C01_VLSI', name: 'Engineering Drawing and 3D Modelling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'CS23C04_VLSI', name: 'Programming in C', code: 'CS23C04', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'ME23C04_VLSI', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 1, group: 'core' },
  { id: 'UC23H01_VLSI', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },

  // Semester II (24 credits)
  { id: 'EN23C04_VLSI', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_VLSI', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'EC23C03_VLSI', name: 'Electronic Devices', code: 'EC23C03', type: '2-0-4', courseType: '2-0-4', semester: 2, group: 'core' },
  { id: 'EC23C06_VLSI', name: 'Data Structures and Programming in C++', code: 'EC23C06', type: '2-0-4', courseType: '2-0-4', semester: 2, group: 'core' },
  { id: 'EC23C04_VLSI', name: 'Circuit Analysis', code: 'EC23C04', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'UC23H02_VLSI', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },
  { id: 'CY23C10_VLSI', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },

  // Semester III (23 credits)
  { id: 'MA23C03_VLSI', name: 'Linear Algebra and Numerical Methods', code: 'MA23C03', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'VL23301_VLSI', name: 'MOS Device Physics and Simulation', code: 'VL23301', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'EC23C13_VLSI', name: 'Digital Electronics and System Design', code: 'EC23C13', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'VL23302_VLSI', name: 'Fundamentals of Signals and Systems', code: 'VL23302', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'EC23C02_VLSI', name: 'Analog Circuits Design', code: 'EC23C02', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'VL23S01_VLSI', name: 'Skill Development Course – I', code: 'VL23S01', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 3, group: 'core' },
  { id: 'UC23U01_VLSI', name: 'Universal Human Values', code: 'UC23U01', type: 'Universal Human Values', courseType: 'universal-human-values', semester: 3, group: 'core' },

  // Semester IV (24 credits)
  { id: 'MA23C05_VLSI', name: 'Probability and Statistics', code: 'MA23C05', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'VL23401_VLSI', name: 'Discrete Time Signal Processing', code: 'VL23401', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'VL23402_VLSI', name: 'Analog and Digital Communication', code: 'VL23402', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'EC23C05_VLSI', name: 'Analog Electronic System Design', code: 'EC23C05', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'EC23C10_VLSI', name: 'Computer Architecture and Organization', code: 'EC23C10', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'EC23C11_VLSI', name: 'Control Systems', code: 'EC23C11', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'VL23S02_VLSI', name: 'Skill Development Course – II', code: 'VL23S02', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 4, group: 'core' },
  { id: 'VL23L01_VLSI', name: 'Self Learning Course', code: 'VL23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 4, group: 'core' },

  // Semester V (24 credits)
  { id: 'VL23503_VLSI', name: 'VLSI Design', code: 'VL23503', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'VL23501_VLSI', name: 'RTL Design and Logic Synthesis', code: 'VL23501', type: '1-0-4', courseType: '1-0-4', semester: 5, group: 'core' },
  { id: 'EC23C21_VLSI', name: 'Microprocessors and Microcontrollers', code: 'EC23C21', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'VL23502_VLSI', name: 'Wireless Communication for VLSI Design', code: 'VL23502', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_VLSI', name: 'Industry Oriented Course I / Summer Internship- I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'UC23E01_VLSI', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'core' },

  // Semester VI (24 credits)
  { id: 'VL23601_VLSI', name: 'VLSI Verification and Testing', code: 'VL23601', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'core' },
  { id: 'VL23602_VLSI', name: 'Electromagnetic Interference and Compatibility for VLSI', code: 'VL23602', type: 'Theory', courseType: 'theory', semester: 6, group: 'core' },
  { id: 'VL23S03_VLSI', name: 'Skill Development Course – 3', code: 'VL23S03', type: 'Theory', courseType: 'theory', semester: 6, group: 'core' },
  { id: 'IOC_SEM6_II_VLSI', name: 'Industry Oriented Course II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },
  { id: 'VL23U02_VLSI', name: 'Sustainability Course', code: 'VL23U02', type: 'Theory', courseType: 'theory', semester: 6, group: 'core' },

  // Semester VII (22 credits)
  { id: 'VL23701_VLSI', name: 'ASIC Design', code: 'VL23701', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'core' },
  { id: 'VL23702_VLSI', name: 'Embedded Systems', code: 'VL23702', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'core' },
  { id: 'VL23703_VLSI', name: 'Idea to Product', code: 'VL23703', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_VLSI', name: 'Industry Oriented Course III / Summer Internship- II', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'VL23U01_VLSI', name: 'Standards - Electronics Engineering (VLSI Design and Technology)', code: 'VL23U01', type: 'Standards Course', courseType: 'standards-course', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'VL23801_VLSI', name: 'Project Work / Internship cum Project Work', code: 'VL23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...VLSI_ELECTIVE_OPTION_BOOK,
];


const MECH_VERTICAL_ELECTIVES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Value Engineering', code: 'ME23001', type: 'Theory', courseType: 'theory' },
  { name: 'Additive Manufacturing', code: 'MF23C01', type: 'Theory', courseType: 'theory' },
  { name: 'Product Life Cycle Management', code: 'IE23C04', type: 'Theory', courseType: 'theory' },
  { name: 'Design for X', code: 'ME23002', type: 'Theory', courseType: 'theory' },
  { name: 'Ergonomics in Design', code: 'ME23003', type: 'Theory', courseType: 'theory' },
  { name: 'CAD/CAM', code: 'ME23004', type: 'Theory', courseType: 'theory' },
  { name: 'Materials Selection', code: 'ME23005', type: 'Theory', courseType: 'theory' },
  { name: 'Integrated Product Design and Manufacturing using GD&T', code: 'ME23C19', type: 'Theory', courseType: 'theory' },
  { name: 'Electrical Drives and Actuators', code: 'ME23006', type: 'Theory', courseType: 'theory' },
  { name: 'Embedded Systems and Programming', code: 'ME23007', type: 'Theory', courseType: 'theory' },
  { name: 'Robotics', code: 'ME23008', type: 'Theory', courseType: 'theory' },
  { name: 'Sensors and Instrumentation', code: 'ME23009', type: 'Theory', courseType: 'theory' },
  { name: 'Smart Mobility and Intelligent Vehicles', code: 'ME23010', type: 'Theory', courseType: 'theory' },
  { name: 'Haptics and Immersive Technologies', code: 'ME23C10', type: 'Theory', courseType: 'theory' },
  { name: 'Drone Technologies', code: 'ME23C16', type: 'Theory', courseType: 'theory' },
  { name: 'Marine robotics', code: 'ME23011', type: 'Theory', courseType: 'theory' },
  { name: 'Machine Learning for Intelligent Systems', code: 'ME23012', type: 'Theory', courseType: 'theory' },
  { name: 'Environment Sustainability and Impact Assessment', code: 'ME23013', type: 'Theory', courseType: 'theory' },
  { name: 'Green Manufacturing Design and Practices', code: 'ME23014', type: 'Theory', courseType: 'theory' },
  { name: 'Lean Manufacturing', code: 'ME23015', type: 'Theory', courseType: 'theory' },
  { name: 'Green Supply Chain Management', code: 'ME23016', type: 'Theory', courseType: 'theory' },
  { name: 'Modern Robotics', code: 'ME23C13', type: 'Theory', courseType: 'theory' },
  { name: 'Design of Pressure Vessels', code: 'ME23017', type: 'Theory', courseType: 'theory' },
  { name: 'Failure Analysis and NDT Techniques', code: 'ME23018', type: 'Theory', courseType: 'theory' },
  { name: 'Material Handling and solid processing Equipment', code: 'ME23019', type: 'Theory', courseType: 'theory' },
  { name: 'Rotating Machinery Design', code: 'ME23020', type: 'Theory', courseType: 'theory' },
  { name: 'Thermal and Fired Equipment design', code: 'ME23021', type: 'Theory', courseType: 'theory' },
  { name: 'Industrial Layout Design and Safety', code: 'ME23022', type: 'Theory', courseType: 'theory' },
  { name: 'Design Codes and Standards', code: 'ME23023', type: 'Theory', courseType: 'theory' },
  { name: 'Bioenergy Conversion Technologies', code: 'ME23024', type: 'Theory', courseType: 'theory' },
  { name: 'Carbon Footprint estimation and reduction techniques', code: 'ME23025', type: 'Theory', courseType: 'theory' },
  { name: 'Energy Conservation in Industries', code: 'ME23026', type: 'Theory', courseType: 'theory' },
  { name: 'Wind Energy Technology', code: 'ME23027', type: 'Theory', courseType: 'theory' },
  { name: 'Energy Storage Devices', code: 'ME23028', type: 'Theory', courseType: 'theory' },
  { name: 'Renewable Energy Technologies', code: 'ME23029', type: 'Theory', courseType: 'theory' },
  { name: 'Polygeneration Systems', code: 'ME23030', type: 'Theory', courseType: 'theory' },
  { name: 'Solar Power generation', code: 'ME23031', type: 'Theory', courseType: 'theory' },
  { name: 'Green Hydrogen Production Storage and Transportation', code: 'ME23C18', type: 'Theory', courseType: 'theory' },
  { name: 'Non-traditional Machining Processes', code: 'ME23032', type: 'Theory', courseType: 'theory' },
  { name: 'Casting and Welding Processes', code: 'ME23033', type: 'Theory', courseType: 'theory' },
  { name: 'Process Planning and Cost Estimation', code: 'ME23034', type: 'Theory', courseType: 'theory' },
  { name: 'Surface Engineering', code: 'ME23035', type: 'Theory', courseType: 'theory' },
  { name: 'Precision Manufacturing', code: 'ME23036', type: 'Theory', courseType: 'theory' },
  { name: 'Industry 4.0 in Manufacturing', code: 'ME23037', type: 'Theory', courseType: 'theory' },
  { name: 'Computer Integrated manufacturing', code: 'ME23038', type: 'Theory', courseType: 'theory' },
  { name: 'Applied Operation Research', code: 'ME23039', type: 'Theory', courseType: 'theory' },
  { name: 'Measurements and Controls', code: 'ME23040', type: 'Theory', courseType: 'theory' },
  { name: 'Design Concepts in Engineering', code: 'ME23041', type: 'Theory', courseType: 'theory' },
  { name: 'Composite Materials and Mechanics', code: 'ME23042', type: 'Theory', courseType: 'theory' },
  { name: 'Refrigeration and Air Conditioning', code: 'ME23043', type: 'Theory', courseType: 'theory' },
  { name: 'Energy Efficient Buildings', code: 'ME23C07', type: 'Theory', courseType: 'theory' },
  { name: 'Turbo Machines', code: 'ME23044', type: 'Theory', courseType: 'theory' },
  { name: 'Computational Fluid Dynamics', code: 'ME23045', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Statistics and Data Analytics', code: 'ME23046', type: 'Theory', courseType: 'theory' },
];

const MECH_ETC_COURSES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Industrial 5.0 and IoT', code: 'ME23E01', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Manufacturing', code: 'ME23E02', type: 'Theory', courseType: 'theory' },
  { name: 'Topology Optimization and Generative Design', code: 'ME23E03', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Twins', code: 'ME23E04', type: 'Theory', courseType: 'theory' },
  { name: 'Augmented Reality & Virtual Reality', code: 'ME23E05', type: 'Theory', courseType: 'theory' },
  { name: 'Semiconductor Manufacturing', code: 'ME23E06', type: 'Theory', courseType: 'theory' },
];

const MECH_OE_COURSES: Omit<PresetCourse, 'id' | 'semester' | 'group' | 'electiveSlot'>[] = [
  { name: 'Basic Automobile Engineering', code: 'ME23901', type: 'Theory', courseType: 'theory' },
  { name: 'Product Design and Process Development', code: 'ME23902', type: 'Theory', courseType: 'theory' },
  { name: 'Applications of 3D printing Techniques', code: 'ME23903', type: 'Theory', courseType: 'theory' },
  { name: 'Fuel Cells', code: 'ME23904', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Energy Technologies and Assessment', code: 'ME23905', type: 'Theory', courseType: 'theory' },
  { name: 'Modern Healthcare Machines', code: 'ME23906', type: 'Theory', courseType: 'theory' },
];

const MECH_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5: Professional Elective I
  ...MECH_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mech-5-PE-I-' + idx,
    ...course,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 6: Professional Elective II
  ...MECH_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mech-6-PE-II-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),

  // Sem 6: Professional Elective III
  ...MECH_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mech-6-PE-III-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 6: Professional Elective IV
  ...MECH_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mech-6-PE-IV-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 6: Professional Elective V
  ...MECH_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mech-6-PE-V-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),

  // Sem 6: Open Elective I
  ...MECH_OE_COURSES.map((course, idx) => ({
    id: 'mech-6-OE-I-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 6: Emerging Technology Course I
  ...MECH_ETC_COURSES.map((course, idx) => ({
    id: 'mech-6-ETC-I-' + idx,
    ...course,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 7: Emerging Technology Course II
  ...MECH_ETC_COURSES.map((course, idx) => ({
    id: 'mech-7-ETC-II-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),

  // Sem 7: Professional Elective VI
  ...MECH_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: 'mech-7-PE-VI-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7: Open Elective II
  ...MECH_OE_COURSES.map((course, idx) => ({
    id: 'mech-7-OE-II-' + idx,
    ...course,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const MECH_PRESET_COURSES: PresetCourse[] = [
  // Semester I (23 credits)
  { id: 'EN23C05_MECH', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_MECH', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'CY23C10_MECH', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C01_MECH', name: 'Engineering Drawing and 3D Modelling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'ME23C03_MECH', name: 'Engineering Mechanics', code: 'ME23C03', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'ME23C04_MECH', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 1, group: 'core' },
  { id: 'UC23H01_MECH', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },

  // Semester II (22 credits)
  { id: 'EN23C04_MECH', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_MECH', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'PH23C11_MECH', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'CS23C02_MECH', name: 'Computer Programming in Python', code: 'CS23C02', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'EE23C03_MECH', name: 'Basics of Electrical and Electronics Engineering', code: 'EE23C03', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'ME23C06_MECH', name: 'Design Thinking', code: 'ME23C06', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'UC23H02_MECH', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },

  // Semester III (25 credits)
  { id: 'MA23C06_MECH', name: 'Partial Differential Equations and Complex Functions', code: 'MA23C06', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'ME23C11_MECH', name: 'Kinematics and Dynamics of Machinery', code: 'ME23C11', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'ME23C08_MECH', name: 'Engineering Thermodynamics', code: 'ME23C08', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'ME23301_MECH', name: 'Manufacturing Technology', code: 'ME23301', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'MS23C01_MECH', name: 'Engineering Materials and Metallurgy', code: 'MS23C01', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'CE23C01_MECH', name: 'Mechanics of Materials', code: 'CE23C01', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'ME23S01_MECH', name: 'Skill Development Course I', code: 'ME23S01', type: '1-0-2', courseType: '1-0-2', semester: 3, group: 'core' },

  // Semester IV (24 credits)
  { id: 'ME23401_MECH', name: 'Metal Cutting and Machine Tools', code: 'ME23401', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'ME23402_MECH', name: 'Thermal Engineering - I', code: 'ME23402', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'CE23C02_MECH', name: 'Fluid Mechanics and Machinery', code: 'CE23C02', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'ME23C15_MECH', name: 'Design of Machine Elements', code: 'ME23C15', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'ME23403_MECH', name: 'Fluid Power Automation', code: 'ME23403', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'ME23404_MECH', name: 'Product Design and Development', code: 'ME23404', type: '2-0-2', courseType: '2-0-2', semester: 4, group: 'core' },
  { id: 'ME23S02_MECH', name: 'Skill Development Course II', code: 'ME23S02', type: '1-0-2', courseType: '1-0-2', semester: 4, group: 'core' },
  { id: 'IOC_SEM4_I_MECH', name: 'Industry Oriented Course-1/ Industrial lecture', code: 'IOC_SEM4_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 4, group: 'core' },

  // Semester V (27 credits)
  { id: 'ME23501_MECH', name: 'Metrology and Measurements', code: 'ME23501', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'ME23502_MECH', name: 'Thermal Engineering II', code: 'ME23502', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'ME23503_MECH', name: 'Project and Financial Management', code: 'ME23503', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'ME23504_MECH', name: 'Design of Transmission Systems', code: 'ME23504', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'ME23U02_MECH', name: 'Perspectives of Sustainable Development', code: 'ME23U02', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_II_MECH', name: 'Industry Oriented Course II', code: 'IOC_SEM5_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'ME23L01_MECH', name: 'Self-Learning Course', code: 'ME23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 5, group: 'core' },
  { id: 'ME23S03_MECH', name: 'Skill Development Course III', code: 'ME23S03', type: '1-0-2', courseType: '1-0-2', semester: 5, group: 'core' },
  { id: 'ME23U01_MECH', name: 'Standards - Mechanical Engineering', code: 'ME23U01', type: 'Standards Course', courseType: 'standards-course', semester: 5, group: 'core' },
  { id: 'ME23505_MECH', name: 'Computer Aided Machine Drawing', code: 'ME23505', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 5, group: 'core' },

  // Semester VI (21 credits)
  { id: 'IOC_SEM6_III_MECH', name: 'Industry Oriented Course - III', code: 'IOC_SEM6_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },
  { id: 'UC23U01_MECH', name: 'Universal Human Values', code: 'UC23U01', type: 'Universal Human Values', courseType: 'universal-human-values', semester: 6, group: 'core' },

  // Semester VII (26 credits)
  { id: 'ME23C12_MECH', name: 'Mechatronics and IoT', code: 'ME23C12', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'ME23C09_MECH', name: 'Finite Element Analysis', code: 'ME23C09', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'ME23701_MECH', name: 'Heat and Mass Transfer', code: 'ME23701', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'UC23E01_MECH', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'core' },
  { id: 'ME23702_MECH', name: 'Simulation and Analysis Laboratory', code: 'ME23702', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 7, group: 'core' },
  { id: 'ME23703_MECH', name: 'Summer Internship', code: 'ME23703', type: 'Project', courseType: 'project', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'ME23801_MECH', name: 'Project Work / Internship Cum Project Work', code: 'ME23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...MECH_ELECTIVE_OPTION_BOOK,
];

// --- PRINTING AND PACKAGING TECHNOLOGY PRESET CATALOG (Anna University Regulations 2023 - CEG Campus) ---

const PT_VERTICAL_ELECTIVES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  // Vertical I: Printing
  { name: 'Security Printing', code: 'PP23001', type: 'Theory', courseType: 'theory' },
  { name: 'Web Offset Printing Technology', code: 'PP23002', type: 'Theory', courseType: 'theory' },
  { name: 'Additive Manufacturing for Print Prototyping', code: 'PP23003', type: 'Theory', courseType: 'theory' },
  { name: 'Printed Electronics', code: 'PP23004', type: 'Theory', courseType: 'theory' },
  { name: 'Speciality Printing', code: 'PP23005', type: 'Theory', courseType: 'theory' },
  { name: 'Printing Machinery Maintenance', code: 'PP23006', type: 'Theory', courseType: 'theory' },

  // Vertical II: Packaging
  { name: 'Package Design and Standards', code: 'PP23007', type: 'Theory', courseType: 'theory' },
  { name: 'Consumer Goods Packaging', code: 'PP23008', type: 'Theory', courseType: 'theory' },
  { name: 'Healthcare Packaging', code: 'PP23009', type: 'Theory', courseType: 'theory' },
  { name: 'Quality Control in Printing and Packaging', code: 'PP23010', type: 'Theory', courseType: 'theory' },
  { name: 'Industrial Packaging', code: 'PP23011', type: 'Theory', courseType: 'theory' },
  { name: 'Packaging Laws and Regulations', code: 'PP23012', type: 'Theory', courseType: 'theory' },

  // Vertical III: Publishing
  { name: 'Publishing Workflow and Processes', code: 'PP23013', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Media Management', code: 'PP23014', type: 'Theory', courseType: 'theory' },
  { name: 'User Interface Design', code: 'PP23015', type: 'Theory', courseType: 'theory' },
  { name: 'Software Testing for Graphic Applications', code: 'PP23016', type: 'Theory', courseType: 'theory' },
  { name: 'Engineering Data Analytics', code: 'RA23C01', type: 'Theory', courseType: 'theory' },
  { name: 'Cloud Computing and Cyber Security', code: 'PP23018', type: 'Theory', courseType: 'theory' },

  // Vertical IV: Print Management
  { name: 'Print Marketing Management', code: 'PP23019', type: 'Theory', courseType: 'theory' },
  { name: 'Elements of Financial Management', code: 'PP23020', type: 'Theory', courseType: 'theory' },
  { name: 'Quantitative Techniques in Management', code: 'RA23026', type: 'Theory', courseType: 'theory' },
  { name: 'Professional Ethics in Engineering', code: 'PP23021', type: 'Theory', courseType: 'theory' },
  { name: 'Human Resource Management for Entrepreneurs', code: 'PP23022', type: 'Theory', courseType: 'theory' },
  { name: 'Total Quality Management', code: 'IE23C07', type: 'Theory', courseType: 'theory' },

  // Vertical V: Print Media
  { name: 'Creativity and Innovation in Printing and Packaging', code: 'PP23023', type: 'Theory', courseType: 'theory' },
  { name: 'Mass Communication', code: 'PP23024', type: 'Theory', courseType: 'theory' },
  { name: 'Book Publishing', code: 'PP23025', type: 'Theory', courseType: 'theory' },
  { name: 'Newspaper and Periodical Publishing', code: 'PP23026', type: 'Theory', courseType: 'theory' },
  { name: 'Advertising Techniques', code: 'PP23027', type: 'Theory', courseType: 'theory' },
  { name: 'Visual Communication', code: 'PP23028', type: 'Theory', courseType: 'theory' },

  // Vertical VI: Diversified Group of Electives
  { name: 'Ergonomics and Human Factors Engineering', code: 'MF23C03', type: 'Theory', courseType: 'theory' },
  { name: 'Safety Engineering and Management', code: 'IE23C09', type: 'Theory', courseType: 'theory' },
  { name: 'Lean Manufacturing and Six Sigma', code: 'IE23C03', type: 'Theory', courseType: 'theory' },
  { name: 'Life Cycle Assessment', code: 'IE23028', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Manufacturing', code: 'MF23C05', type: 'Theory', courseType: 'theory' },
  { name: 'Design Thinking', code: 'ME23C06', type: '2-0-2', courseType: '2-0-2' },
];

const PT_ETC_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Artificial Intelligence and Machine Learning', code: 'PP23E01', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Printing Technologies', code: 'PP23E02', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Augmented Reality in Graphic Design', code: 'PP23E03', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Industry 4.0', code: 'PP23E04', type: 'Theory', courseType: 'theory' },
];

const PT_OE_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Printing Processes and Management', code: 'PP23901', type: 'Theory', courseType: 'theory' },
  { name: 'Digital Photography', code: 'PP23902', type: 'Theory', courseType: 'theory' },
  { name: 'Screen Printing', code: 'PP23903', type: 'Theory', courseType: 'theory' },
];

const PT_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5 ETC I
  ...PT_ETC_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM5_ETC1_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 6 ETC II
  ...PT_ETC_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM6_ETC2_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),

  // Sem 6 PE I - IV
  ...PT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE1_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),
  ...PT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE2_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),
  ...PT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE3_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),
  ...PT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE4_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 6 OE I
  ...PT_OE_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM6_OE1_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 7 PE V, VI
  ...PT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM7_PE5_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),
  ...PT_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM7_PE6_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7 OE II
  ...PT_OE_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM7_OE2_PT_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const PT_PRESET_COURSES: PresetCourse[] = [
  // Semester I (24 credits)
  { id: 'EN23C05_PT', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_PT', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'CY23C10_PT', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C01_PT', name: 'Engineering Drawing and 3D Modelling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'ME23C03_PT', name: 'Engineering Mechanics', code: 'ME23C03', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'CS23C02_PT', name: 'Computer Programming in Python', code: 'CS23C02', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'UC23H01_PT', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },

  // Semester II (21 credits)
  { id: 'EN23C04_PT', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_PT', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'PH23C11_PT', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'ME23C04_PT', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 2, group: 'core' },
  { id: 'EE23C03_PT', name: 'Basics of Electrical and Electronics Engineering', code: 'EE23C03', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'CY23C04_PT', name: 'Chemistry for Printing Technology', code: 'CY23C04', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'UC23H02_PT', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },

  // Semester III (26 credits)
  { id: 'MA23C05_PT', name: 'Probability and Statistics', code: 'MA23C05', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'CE23C01_PT', name: 'Mechanics of Materials', code: 'CE23C01', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'PP23301_PT', name: 'Machine Kinematics and Maintenance', code: 'PP23301', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'PP23302_PT', name: 'Design for Print Media', code: 'PP23302', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'PP23303_PT', name: 'Flexography Printing and Converting', code: 'PP23303', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'PP23304_PT', name: 'Paper and Paperboard', code: 'PP23304', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'PP23305_PT', name: 'Prepress Laboratory', code: 'PP23305', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 3, group: 'core' },
  { id: 'PP23S01_PT', name: 'Skill Development Course – I', code: 'PP23S01', type: '1-0-2', courseType: '1-0-2', semester: 3, group: 'core' },

  // Semester IV (25 credits)
  { id: 'ME23C12_PT', name: 'Mechatronics and IOT', code: 'ME23C12', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'PP23401_PT', name: 'Offset Printing Technology', code: 'PP23401', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'PP23402_PT', name: 'Prepress and Imaging Technology', code: 'PP23402', type: '3-0-4', courseType: '3-0-4', semester: 4, group: 'core' },
  { id: 'PP23403_PT', name: 'Packaging Techniques and Processes', code: 'PP23403', type: '2-0-4', courseType: '2-0-4', semester: 4, group: 'core' },
  { id: 'PP23404_PT', name: 'Packaging Materials I', code: 'PP23404', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'UC23U01_PT', name: 'Universal Human Values', code: 'UC23U01', type: 'Universal Human Values', courseType: 'universal-human-values', semester: 4, group: 'core' },
  { id: 'PP23405_PT', name: 'Printing Machine Laboratory', code: 'PP23405', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 4, group: 'core' },
  { id: 'PP23S02_PT', name: 'Skill Development Course II', code: 'PP23S02', type: '1-0-2', courseType: '1-0-2', semester: 4, group: 'core' },

  // Semester V (25 credits)
  { id: 'PP23501_PT', name: 'Gravure and Screen Printing Technology', code: 'PP23501', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'PP23502_PT', name: 'Packaging Materials II', code: 'PP23502', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'PP23503_PT', name: 'Print Conversion Techniques', code: 'PP23503', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'PP23504_PT', name: 'Print Operations Management', code: 'PP23504', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'PP23U02_PT', name: 'Perspectives of Sustainable Development – Printing and Packaging', code: 'PP23U02', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'core' },
  { id: 'PP23505_PT', name: 'Printing Inks', code: 'PP23505', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'PP23506_PT', name: 'Print Conversion Laboratory', code: 'PP23506', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_PT', name: 'Industry Oriented Course – I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'PP23S03_PT', name: 'Skill Development Course III', code: 'PP23S03', type: '1-0-2', courseType: '1-0-2', semester: 5, group: 'core' },

  // Semester VI (23 credits)
  { id: 'PP23L01_PT', name: 'Self-Learning Course', code: 'PP23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 6, group: 'core' },
  { id: 'UC23E01_PT', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'core' },
  { id: 'IOC_SEM6_II_PT', name: 'Industry Oriented Course II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },

  // Semester VII (23 credits)
  { id: 'PP23701_PT', name: 'Costing and Estimating for Printing and Packaging', code: 'PP23701', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'PP23702_PT', name: 'Electronic Publishing', code: 'PP23702', type: '2-0-4', courseType: '2-0-4', semester: 7, group: 'core' },
  { id: 'PP23703_PT', name: 'Logistics and Supply Chain Management for Packaging', code: 'PP23703', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'PP23U01_PT', name: 'Standards - Printing and Packaging Technology', code: 'PP23U01', type: 'Standards Course', courseType: 'standards-course', semester: 7, group: 'core' },
  { id: 'PP23704_PT', name: 'Summer Internship', code: 'PP23704', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_PT', name: 'Industry Oriented Course III', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'PP23705_PT', name: 'Creative and Innovative Project', code: 'PP23705', type: 'Project', courseType: 'project', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'PP23801_PT', name: 'Project Work / Internship with Project Work', code: 'PP23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...PT_ELECTIVE_OPTION_BOOK,
];


// --- MINING ENGINEERING PRESET CATALOG (Anna University Regulations 2023 - CEG Campus) ---

const MINING_VERTICAL_ELECTIVES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  // Vertical I: Rock Mechanics
  { name: 'Applied Rock Engineering', code: 'MI23037', type: 'Theory', courseType: 'theory' },
  { name: 'Subsidence Engineering', code: 'MI23001', type: 'Theory', courseType: 'theory' },
  { name: 'Rock Reinforcement Engineering', code: 'MI23002', type: 'Theory', courseType: 'theory' },
  { name: 'Rock Slope Engineering', code: 'MI23003', type: 'Theory', courseType: 'theory' },
  { name: 'Rock Excavation Engineering', code: 'MI23004', type: 'Theory', courseType: 'theory' },
  { name: 'Drilling and Blasting Engineering', code: 'MI23005', type: 'Theory', courseType: 'theory' },

  // Vertical II: Advanced Mining
  { name: 'Innovative Mining Systems', code: 'MI23006', type: 'Theory', courseType: 'theory' },
  { name: 'Material Handling', code: 'MI23007', type: 'Theory', courseType: 'theory' },
  { name: 'Small Scale Mining and Marine Mining', code: 'MI23008', type: 'Theory', courseType: 'theory' },
  { name: 'Computer Applications in Mining', code: 'MI23009', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Surface Mining Technology', code: 'MI23010', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Rock Blasting Technology', code: 'MI23011', type: 'Theory', courseType: 'theory' },

  // Vertical III: Safety, Health and Environment
  { name: 'Hazard Analysis and Risk Assessment', code: 'MI23012', type: 'Theory', courseType: 'theory' },
  { name: 'Mine Safety Engineering', code: 'MI23013', type: 'Theory', courseType: 'theory' },
  { name: 'Risk and Workplace Safety Management', code: 'MI23014', type: 'Theory', courseType: 'theory' },
  { name: 'Occupational Health Aspects in Mines', code: 'MI23015', type: 'Theory', courseType: 'theory' },
  { name: 'Eco-friendly Mining', code: 'MI23016', type: 'Theory', courseType: 'theory' },
  { name: 'Environmental Management in Mines', code: 'MI23017', type: 'Theory', courseType: 'theory' },

  // Vertical IV: Mining Governance
  { name: 'Mine Economics and Investment', code: 'MI23018', type: 'Theory', courseType: 'theory' },
  { name: 'Energy Conservation And Management', code: 'MI23019', type: 'Theory', courseType: 'theory' },
  { name: 'Mine Digitalization and Automation', code: 'MI23020', type: 'Theory', courseType: 'theory' },
  { name: 'Mining, Energy and Climate Change', code: 'MI23021', type: 'Theory', courseType: 'theory' },
  { name: 'System Engineering in Mining', code: 'MI23022', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Mining', code: 'MI23023', type: 'Theory', courseType: 'theory' },

  // Vertical V: Geological Exploration
  { name: 'Applied Hydrogeology', code: 'GY23C09', type: 'Theory', courseType: 'theory' },
  { name: 'Geospatial Technology', code: 'GY23C10', type: 'Theory', courseType: 'theory' },
  { name: 'Geophysical Exploration', code: 'GY23C11', type: 'Theory', courseType: 'theory' },
  { name: 'Marine Exploration', code: 'GY23C12', type: 'Theory', courseType: 'theory' },
  { name: 'Coal and Petroleum Geology', code: 'GY23C13', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Mining Geology', code: 'GY23C14', type: 'Theory', courseType: 'theory' },

  // Vertical VI: Other Electives
  { name: 'Chemistry for Mining Engineering', code: 'CY23C05', type: 'Theory', courseType: 'theory' },
  { name: 'Electrical Drives and Control', code: 'EE23050', type: 'Theory', courseType: 'theory' },
  { name: 'Tunnelling Engineering', code: 'MI23024', type: 'Theory', courseType: 'theory' },
  { name: 'Underground Space Technology', code: 'MI23025', type: 'Theory', courseType: 'theory' },
  { name: 'Numerical Methods in Mining Engineering', code: 'MI23026', type: 'Theory', courseType: 'theory' },
  { name: 'Non-Destructive Testing', code: 'MI23027', type: 'Theory', courseType: 'theory' },
];

const MINING_OE_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Mining For Nation Building', code: 'MI23901', type: 'Theory', courseType: 'theory' },
  { name: 'Rock Blasting Engineering', code: 'MI23902', type: 'Theory', courseType: 'theory' },
  { name: 'Oil Exploration And Production', code: 'GY23901', type: 'Theory', courseType: 'theory' },
];

const MINING_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5 PE I
  ...MINING_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM5_PE1_MINING_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),

  // Sem 6 PE II - IV
  ...MINING_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE2_MINING_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),
  ...MINING_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE3_MINING_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),
  ...MINING_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE4_MINING_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 6 OE I
  ...MINING_OE_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM6_OE1_MINING_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 7 PE V, VI
  ...MINING_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM7_PE5_MINING_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),
  ...MINING_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM7_PE6_MINING_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7 OE II
  ...MINING_OE_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM7_OE2_MINING_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const MINING_PRESET_COURSES: PresetCourse[] = [
  // Semester I (22 credits)
  { id: 'EN23C05_MINING', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_MINING', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'CY23C10_MINING', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C05_MINING', name: 'Basics of Mechanical Engineering', code: 'ME23C05', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'ME23C01_MINING', name: 'Engineering Drawing & 3D Modelling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'CS23C02_MINING', name: 'Computer Programming in Python', code: 'CS23C02', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'UC23H01_MINING', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },

  // Semester II (22 credits)
  { id: 'EN23C04_MINING', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_MINING', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'PH23C11_MINING', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'ME23C04_MINING', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 2, group: 'core' },
  { id: 'ME23C03_MINING', name: 'Engineering Mechanics', code: 'ME23C03', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'EE23C03_MINING', name: 'Basics of Electrical and Electronics Engineering', code: 'EE23C03', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'UC23H02_MINING', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },

  // Semester III (21 credits)
  { id: 'MA23C07_MINING', name: 'Numerical and Statistical Methods', code: 'MA23C07', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'CE23C02_MINING', name: 'Fluid Mechanics and Machinery', code: 'CE23C02', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'CE23C04_MINING', name: 'Principles of Surveying', code: 'CE23C04', type: '3-0-4', courseType: '3-0-4', semester: 3, group: 'core' },
  { id: 'MI23301_MINING', name: 'Mine Development', code: 'MI23301', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'GY23C03_MINING', name: 'Geology for Mining Engineering – I', code: 'GY23C03', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'GY23C04_MINING', name: 'Geology Laboratory – I & Field Work for Mining Engineering', code: 'GY23C04', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 3, group: 'core' },

  // Semester IV (26 credits)
  { id: 'GY23C05_MINING', name: 'Geology for Mining Engineering – II', code: 'GY23C05', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'MI23401_MINING', name: 'Mine Surveying', code: 'MI23401', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'MI23402_MINING', name: 'Mine Environment and Ventilation', code: 'MI23402', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'IE23C06_MINING', name: 'Operations Research', code: 'IE23C06', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'MI23403_MINING', name: 'Mining Machinery-I', code: 'MI23403', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'MI23404_MINING', name: 'Surface Mining', code: 'MI23404', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'MI23U01_MINING', name: 'Standards – Mining Engineering', code: 'MI23U01', type: 'Standards Course', courseType: 'standards-course', semester: 4, group: 'core' },
  { id: 'UC23U01_MINING', name: 'Universal Human Values', code: 'UC23U01', type: 'Universal Human Values', courseType: 'universal-human-values', semester: 4, group: 'core' },
  { id: 'GY23C06_MINING', name: 'Geology Laboratory-II & Field Work for Mining Engineering', code: 'GY23C06', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 4, group: 'core' },
  { id: 'MI23S01_MINING', name: 'Skill Development Course – I', code: 'MI23S01', type: '1-0-2', courseType: '1-0-2', semester: 4, group: 'core' },

  // Semester V (26 credits)
  { id: 'MI23501_MINING', name: 'Mining Machinery-II', code: 'MI23501', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'MI23502_MINING', name: 'Underground Mining Methods – Coal', code: 'MI23502', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'MI23503_MINING', name: 'Rock Mechanics and Ground Control', code: 'MI23503', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'MI23504_MINING', name: 'Underground Mining Methods – Metal', code: 'MI23504', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'MI23U02_MINING', name: 'Perspectives of Sustainable Development', code: 'MI23U02', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'core' },
  { id: 'MI23L01_MINING', name: 'Self-Learning Course', code: 'MI23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 5, group: 'core' },
  { id: 'MI23S02_MINING', name: 'Skill Development Course – II', code: 'MI23S02', type: '1-0-2', courseType: '1-0-2', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_MINING', name: 'Industry Oriented Course - I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'MI23505_MINING', name: 'Industrial Training – I', code: 'MI23505', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 5, group: 'core' },

  // Semester VI (28 credits)
  { id: 'MI23601_MINING', name: 'Mine Economics and Investment', code: 'MI23601', type: 'Theory', courseType: 'theory', semester: 6, group: 'core' },
  { id: 'MI23602_MINING', name: 'Mineral Processing', code: 'MI23602', type: '3-0-2', courseType: '3-0-2', semester: 6, group: 'core' },
  { id: 'UC23E01_MINING', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'core' },
  { id: 'IOC_SEM6_II_MINING', name: 'Industry Oriented Course - II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },
  { id: 'MI23S03_MINING', name: 'Skill Development Course – III', code: 'MI23S03', type: '1-0-2', courseType: '1-0-2', semester: 6, group: 'core' },
  { id: 'MI23603_MINING', name: 'Advanced Rock Blasting Laboratory', code: 'MI23603', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 6, group: 'core' },
  { id: 'MI23604_MINING', name: 'Mine Survey Camp', code: 'MI23604', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 6, group: 'core' },

  // Semester VII (28 credits)
  { id: 'MI23701_MINING', name: 'Mine Management, Legislation and General Safety', code: 'MI23701', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'MI23702_MINING', name: 'Mine Digitalization and Automation', code: 'MI23702', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'MI23703_MINING', name: 'Mine Environmental Engineering', code: 'MI23703', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'IE23C08_MINING', name: 'Project Management', code: 'IE23C08', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_MINING', name: 'Industry Oriented Course - III', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'MI23706_MINING', name: 'Computer Aided Mine Planning and Design (CAMPAD) Laboratory', code: 'MI23706', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 7, group: 'core' },
  { id: 'MI23704_MINING', name: 'Comprehension', code: 'MI23704', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 7, group: 'core' },
  { id: 'MI23705_MINING', name: 'Industrial Training – II', code: 'MI23705', type: 'Laboratory · 60% CA / 40% ESE', courseType: 'laboratory-course', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'MI23801_MINING', name: 'Project Work / Internship cum Project Work', code: 'MI23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...MINING_ELECTIVE_OPTION_BOOK,
];


// --- MATERIALS SCIENCE AND ENGINEERING PRESET CATALOG (Anna University Regulations 2023 - CEG Campus) ---

const MSE_VERTICAL_ELECTIVES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  // Vertical I: Mechanical Behaviour & Materials Characterization
  { name: 'Fracture Mechanics and Failure Analysis', code: 'MS23001', type: 'Theory', courseType: 'theory' },
  { name: 'Creep and Fatigue Behaviour of Materials', code: 'MS23002', type: 'Theory', courseType: 'theory' },
  { name: 'Electron Microscopy', code: 'MS23003', type: 'Theory', courseType: 'theory' },
  { name: 'X-ray Diffraction techniques', code: 'MS23004', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Metallographic techniques', code: 'MS23005', type: 'Theory', courseType: 'theory' },
  { name: 'Phase Transformations', code: 'MS23006', type: 'Theory', courseType: 'theory' },

  // Vertical II: Advanced Materials and Processing
  { name: 'Nano Structured & Quantum Materials', code: 'MS23007', type: 'Theory', courseType: 'theory' },
  { name: 'Micro and Nano-Manufacturing Processes', code: 'MS23008', type: 'Theory', courseType: 'theory' },
  { name: 'Automotive and Aerospace Materials', code: 'MS23009', type: 'Theory', courseType: 'theory' },
  { name: 'Additive Manufacturing', code: 'MF23C01', type: 'Theory', courseType: 'theory' },
  { name: 'Cryogenic Treatment of Materials', code: 'MS23010', type: 'Theory', courseType: 'theory' },
  { name: 'Materials for Defense and Nuclear Applications', code: 'MS23011', type: 'Theory', courseType: 'theory' },

  // Vertical III: Materials for Electrical and Optoelectronic Applications
  { name: 'Smart Materials', code: 'MS23012', type: 'Theory', courseType: 'theory' },
  { name: 'Energy Storage Devices', code: 'MS23013', type: 'Theory', courseType: 'theory' },
  { name: 'Fuel Cell Technology', code: 'MS23014', type: 'Theory', courseType: 'theory' },
  { name: 'Semiconductors, optoelectronic materials and devices', code: 'PH23C12', type: 'Theory', courseType: 'theory' },
  { name: 'Thin film Technology', code: 'MS23015', type: 'Theory', courseType: 'theory' },
  { name: 'MEMS and Nanotechnology', code: 'MS23016', type: 'Theory', courseType: 'theory' },

  // Vertical IV: Non-Destructive Testing Techniques
  { name: 'Surface NDE Techniques', code: 'MS23017', type: 'Theory', courseType: 'theory' },
  { name: 'Ultrasonic Testing', code: 'MS23018', type: 'Theory', courseType: 'theory' },
  { name: 'Radiography Testing and Radiation safety', code: 'MS23019', type: 'Theory', courseType: 'theory' },
  { name: 'Advancements in Ultrasonic Technique', code: 'MS23020', type: 'Theory', courseType: 'theory' },
  { name: 'Eddy current Testing', code: 'MS23021', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced NDE Techniques', code: 'MS23022', type: 'Theory', courseType: 'theory' },

  // Vertical V: Materials for High-Temperature Applications
  { name: 'Fuels, Refractories and Furnaces', code: 'MS23023', type: 'Theory', courseType: 'theory' },
  { name: 'Ceramic Processing', code: 'MS23024', type: 'Theory', courseType: 'theory' },
  { name: 'Mechanical performance of Ceramics', code: 'MS23025', type: 'Theory', courseType: 'theory' },
  { name: 'Glass Science technology', code: 'MS23026', type: 'Theory', courseType: 'theory' },
  { name: 'Abrasives and Cutting Tools', code: 'MS23027', type: 'Theory', courseType: 'theory' },
  { name: 'Metals and Alloys for High Temperature applications', code: 'MS23028', type: 'Theory', courseType: 'theory' },

  // Vertical VI: Diversified Group
  { name: 'Material Selection & Design', code: 'MS23029', type: 'Theory', courseType: 'theory' },
  { name: 'Metallurgy of Tool Materials and Special Steels', code: 'MS23030', type: 'Theory', courseType: 'theory' },
  { name: 'Laser Processing of Materials', code: 'MS23031', type: 'Theory', courseType: 'theory' },
  { name: 'Making and Metallurgy of Stainless Steels', code: 'MS23032', type: 'Theory', courseType: 'theory' },
  { name: 'Non-ferrous Metallurgy', code: 'MS23033', type: 'Theory', courseType: 'theory' },
  { name: 'Manufacturing Processes', code: 'MS23034', type: 'Theory', courseType: 'theory' },
];

const MSE_ETC_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Advanced Sintering technology', code: 'MS23E01', type: 'Theory', courseType: 'theory' },
  { name: 'Industrial 5.0 & IOT', code: 'MS23E02', type: 'Theory', courseType: 'theory' },
  { name: 'Machine Learning in Materials Science', code: 'MS23E03', type: '2-0-2', courseType: '2-0-2' },
  { name: 'Atomistic Modelling of Materials', code: 'MS23E04', type: 'Theory', courseType: 'theory' },
];

const MSE_OE_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Introduction to Non-destructive testing', code: 'MS23901', type: 'Theory', courseType: 'theory' },
  { name: 'Materials Characterization Techniques', code: 'MS23902', type: 'Theory', courseType: 'theory' },
  { name: 'Functional Materials & Devices', code: 'MS23903', type: 'Theory', courseType: 'theory' },
];

const MSE_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 5 ETC I
  ...MSE_ETC_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM5_ETC1_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 5 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),

  // Sem 6 ETC II
  ...MSE_ETC_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM6_ETC2_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),

  // Sem 6 PE I - III
  ...MSE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE1_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),
  ...MSE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE2_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),
  ...MSE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE3_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),

  // Sem 6 OE I
  ...MSE_OE_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM6_OE1_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 7 PE IV - VI
  ...MSE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM7_PE4_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),
  ...MSE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM7_PE5_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),
  ...MSE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM7_PE6_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7 OE II
  ...MSE_OE_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM7_OE2_MSE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const MSE_PRESET_COURSES: PresetCourse[] = [
  // Semester I (23 credits)
  { id: 'EN23C05_MSE', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_MSE', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'CY23C10_MSE', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C01_MSE', name: 'Engineering Drawing and 3D Modelling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'EE23C03_MSE', name: 'Basics of Electrical and Electronics Engineering', code: 'EE23C03', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'CS23C02_MSE', name: 'Computer Programming in Python', code: 'CS23C02', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'UC23H01_MSE', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },

  // Semester II (22 credits)
  { id: 'EN23C04_MSE', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_MSE', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'PH23C11_MSE', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 2, group: 'core' },
  { id: 'ME23C04_MSE', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 2, group: 'core' },
  { id: 'ME23C03_MSE', name: 'Engineering Mechanics', code: 'ME23C03', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'MS23201_MSE', name: 'Reaction Kinetics and Dynamics', code: 'MS23201', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'UC23H02_MSE', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },

  // Semester III (24 credits)
  { id: 'MA23C06_MSE', name: 'Partial Differential Equations and Complex Functions', code: 'MA23C06', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'CY23C02_MSE', name: 'Polymers, Bio-materials and Ceramics', code: 'CY23C02', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'CE23C01_MSE', name: 'Mechanics of Materials', code: 'CE23C01', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'MS23301_MSE', name: 'Structure and Properties of Materials', code: 'MS23301', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'MS23302_MSE', name: 'Metallurgical Thermodynamics', code: 'MS23302', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'MS23303_MSE', name: 'Physical Metallurgy', code: 'MS23303', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'MS23S01_MSE', name: 'Skill Development Course – I', code: 'MS23S01', type: '1-0-2', courseType: '1-0-2', semester: 3, group: 'core' },

  // Semester IV (27 credits)
  { id: 'MS23401_MSE', name: 'Heat Treatment of Materials', code: 'MS23401', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'MS23402_MSE', name: 'Casting and Welding Metallurgy', code: 'MS23402', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'MS23403_MSE', name: 'Mechanical Metallurgy', code: 'MS23403', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'MS23404_MSE', name: 'Powder Metallurgy', code: 'MS23404', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'MS23405_MSE', name: 'Analytical Instrumentation Techniques', code: 'MS23405', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'MS23406_MSE', name: 'Iron and Steel Making', code: 'MS23406', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'MS23U01_MSE', name: 'Standards for Materials and Testing', code: 'MS23U01', type: 'Standards Course', courseType: 'standards-course', semester: 4, group: 'core' },
  { id: 'MS23S02_MSE', name: 'Skill Development Course - II', code: 'MS23S02', type: '1-0-2', courseType: '1-0-2', semester: 4, group: 'core' },
  { id: 'MS23L01_MSE', name: 'Self-learning Course', code: 'MS23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 4, group: 'core' },
  { id: 'UC23U01_MSE', name: 'Universal Human Values', code: 'UC23U01', type: 'Universal Human Values', courseType: 'universal-human-values', semester: 4, group: 'core' },

  // Semester V (28 credits)
  { id: 'MS23501_MSE', name: 'Transport phenomena in Metallurgical Processes', code: 'MS23501', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'MS23502_MSE', name: 'Theory and Applications of Material Forming', code: 'MS23502', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'MS23503_MSE', name: 'Surface Engineering', code: 'MS23503', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'MS23504_MSE', name: 'Composite Materials and Mechanics', code: 'MS23504', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'MS23505_MSE', name: 'Introduction to Electronic Materials', code: 'MS23505', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'MS23506_MSE', name: 'Characterization of Materials', code: 'MS23506', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'MS23S03_MSE', name: 'Skill Development Course - III', code: 'MS23S03', type: '1-0-2', courseType: '1-0-2', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_MSE', name: 'Industry Oriented Course – I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },

  // Semester VI (19 credits)
  { id: 'IOC_SEM6_II_MSE', name: 'Industry Oriented Course – II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },
  { id: 'MS23U02_MSE', name: 'Perspectives of Sustainable Development', code: 'MS23U02', type: 'Theory', courseType: 'theory', semester: 6, group: 'core' },

  // Semester VII (25 credits)
  { id: 'MS23701_MSE', name: 'Computational Materials Engineering', code: 'MS23701', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'MS23702_MSE', name: 'Non-Destructive Testing and Evaluation', code: 'MS23702', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'UC23E01_MSE', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: 'Theory', courseType: 'theory', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_MSE', name: 'Industry Oriented Course – III', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'MS23703_MSE', name: 'Mini Project / Summer Internship', code: 'MS23703', type: 'Project', courseType: 'project', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'MS23801_MSE', name: 'Project Work / Internship cum Project Work', code: 'MS23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...MSE_ELECTIVE_OPTION_BOOK,
];


// --- INDUSTRIAL ENGINEERING PRESET CATALOG (Anna University Regulations 2023 - CEG Campus) ---

const IE_VERTICAL_ELECTIVES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  // Vertical I: Operations and Supply Chain
  { name: 'Operations Management', code: 'IE23001', type: 'Theory', courseType: 'theory' },
  { name: 'Supply Chain Management Decisions', code: 'IE23002', type: 'Theory', courseType: 'theory' },
  { name: 'Logistics Management', code: 'IE23003', type: 'Theory', courseType: 'theory' },
  { name: 'Warehousing', code: 'IE23004', type: 'Theory', courseType: 'theory' },
  { name: 'Facilities Planning and Design', code: 'IE23005', type: 'Theory', courseType: 'theory' },
  { name: 'Global Supply Chain Management', code: 'IE23006', type: 'Theory', courseType: 'theory' },

  // Vertical II: Quality Systems
  { name: 'Applied Statistical Quality Control', code: 'IE23007', type: 'Theory', courseType: 'theory' },
  { name: 'Six Sigma and Lean Manufacturing', code: 'IE23008', type: 'Theory', courseType: 'theory' },
  { name: 'Reliability Engineering Techniques', code: 'IE23009', type: 'Theory', courseType: 'theory' },
  { name: 'Maintenance Engineering and Management', code: 'IE23010', type: 'Theory', courseType: 'theory' },
  { name: 'Quality Analytics', code: 'IE23011', type: 'Theory', courseType: 'theory' },
  { name: 'Quality Management Systems and Auditing', code: 'IE23012', type: 'Theory', courseType: 'theory' },

  // Vertical III: Manufacturing Systems
  { name: 'Flexible Manufacturing Systems', code: 'IE23013', type: 'Theory', courseType: 'theory' },
  { name: 'Advanced Manufacturing Processes', code: 'IE23014', type: 'Theory', courseType: 'theory' },
  { name: 'Additive Manufacturing', code: 'IE23015', type: 'Theory', courseType: 'theory' },
  { name: 'Computer Integrated Manufacturing', code: 'IE23016', type: 'Theory', courseType: 'theory' },
  { name: 'Industry 4.0 in Manufacturing', code: 'IE23017', type: 'Theory', courseType: 'theory' },
  { name: 'Smart Factory and Industrial IoT', code: 'IE23018', type: 'Theory', courseType: 'theory' },

  // Vertical IV: Product and Process Development
  { name: 'Product Lifecycle Management', code: 'IE23019', type: 'Theory', courseType: 'theory' },
  { name: 'Value Engineering and Analysis', code: 'IE23020', type: 'Theory', courseType: 'theory' },
  { name: 'Design for Manufacturing and Assembly', code: 'IE23021', type: 'Theory', courseType: 'theory' },
  { name: 'Innovation and New Product Development', code: 'IE23022', type: 'Theory', courseType: 'theory' },
  { name: 'Process Optimization Techniques', code: 'IE23023', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Product Development', code: 'IE23024', type: 'Theory', courseType: 'theory' },

  // Vertical V: Human Factors
  { name: 'Cognitive Ergonomics', code: 'IE23025', type: 'Theory', courseType: 'theory' },
  { name: 'Occupational Health and Industrial Safety', code: 'IE23026', type: 'Theory', courseType: 'theory' },
  { name: 'Human Factors in Engineering Design', code: 'IE23027', type: 'Theory', courseType: 'theory' },
  { name: 'Workstation and Workspace Design', code: 'IE23028', type: 'Theory', courseType: 'theory' },
  { name: 'Environmental Ergonomics', code: 'IE23029', type: 'Theory', courseType: 'theory' },
  { name: 'Ergonomics Simulation and Modelling', code: 'IE23030', type: 'Theory', courseType: 'theory' },

  // Vertical VI: Sustainable Systems
  { name: 'Systems Engineering and Management', code: 'IE23031', type: 'Theory', courseType: 'theory' },
  { name: 'Waste Management and Circular Economy', code: 'IE23032', type: 'Theory', courseType: 'theory' },
  { name: 'Energy Management and Auditing', code: 'IE23033', type: 'Theory', courseType: 'theory' },
  { name: 'Life Cycle Assessment and Carbon Footprint', code: 'IE23034', type: 'Theory', courseType: 'theory' },
  { name: 'Sustainable Manufacturing Systems', code: 'IE23035', type: 'Theory', courseType: 'theory' },
  { name: 'Green Supply Chain Management', code: 'IE23036', type: 'Theory', courseType: 'theory' },
];

const IE_ETC_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Artificial Intelligence and Machine Learning', code: 'IE23E01', type: 'Theory', courseType: 'theory' },
  { name: 'Industry 4.0', code: 'IE23E02', type: 'Theory', courseType: 'theory' },
  { name: 'Design for X', code: 'IE23E03', type: 'Theory', courseType: 'theory' },
  { name: 'Blockchain Technology', code: 'IE23E04', type: 'Theory', courseType: 'theory' },
];

const IE_OE_COURSES: Array<{ name: string; code: string; type: string; courseType: CourseType }> = [
  { name: 'Introduction to Industrial Engineering', code: 'IE23901', type: 'Theory', courseType: 'theory' },
  { name: 'Design of Experiments for Parameter optimization', code: 'IE23902', type: 'Theory', courseType: 'theory' },
  { name: 'Quality control and Assurance', code: 'IE23903', type: 'Theory', courseType: 'theory' },
  { name: 'Reliability Assessment and Management', code: 'IE23904', type: 'Theory', courseType: 'theory' },
];

const IE_ELECTIVE_OPTION_BOOK: PresetCourse[] = [
  // Sem 6 PE I - IV
  ...IE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE1_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective I',
  })),
  ...IE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE2_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective II',
  })),
  ...IE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE3_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective III',
  })),
  ...IE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM6_PE4_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective IV',
  })),

  // Sem 6 ETC I, II
  ...IE_ETC_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM6_ETC1_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course I',
  })),
  ...IE_ETC_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM6_ETC2_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Emerging Technology Course II',
  })),

  // Sem 6 OE I
  ...IE_OE_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM6_OE1_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 6 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective I',
  })),

  // Sem 7 PE V, VI
  ...IE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM7_PE5_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective V',
  })),
  ...IE_VERTICAL_ELECTIVES.map((course, idx) => ({
    id: `${course.code}_SEM7_PE6_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Professional Elective VI',
  })),

  // Sem 7 OE II
  ...IE_OE_COURSES.map((course, idx) => ({
    id: `${course.code}_SEM7_OE2_IE_${idx}`,
    name: course.name,
    code: course.code,
    type: course.type,
    courseType: course.courseType,
    semester: 7 as SemesterNumber,
    group: 'elective' as const,
    electiveSlot: 'Open Elective II',
  })),
];

export const IE_PRESET_COURSES: PresetCourse[] = [
  // Semester I (24 credits)
  { id: 'EN23C05_IE', name: 'Foundation English', code: 'EN23C05', type: '2-0-2', courseType: '2-0-2', semester: 1, group: 'core' },
  { id: 'MA23C11_IE', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, group: 'core' },
  { id: 'PH23C11_IE', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'ME23C01_IE', name: 'Engineering Drawing and 3D Modelling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 1, group: 'core' },
  { id: 'CY23C10_IE', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'CS23C02_IE', name: 'Computer Programming in Python', code: 'CS23C02', type: '3-0-2', courseType: '3-0-2', semester: 1, group: 'core' },
  { id: 'UC23H01_IE', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Heritage Course', courseType: 'heritage-course', semester: 1, group: 'core' },

  // Semester II (21 credits)
  { id: 'EN23C04_IE', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'MA23C02_IE', name: 'Ordinary Differential Equations and Transform Techniques', code: 'MA23C02', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'PH23C03_IE', name: 'Material Science', code: 'PH23C03', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'EE23C03_IE', name: 'Basics of Electrical and Electronics Engineering', code: 'EE23C03', type: '2-0-2', courseType: '2-0-2', semester: 2, group: 'core' },
  { id: 'ME23C04_IE', name: 'Makerspace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 2, group: 'core' },
  { id: 'ME23C03_IE', name: 'Engineering Mechanics', code: 'ME23C03', type: 'Theory', courseType: 'theory', semester: 2, group: 'core' },
  { id: 'UC23H02_IE', name: 'Tamils and Technology', code: 'UC23H02', type: 'Heritage Course', courseType: 'heritage-course', semester: 2, group: 'core' },

  // Semester III (23 credits)
  { id: 'MA23C05_IE', name: 'Probability and Statistics', code: 'MA23C05', type: 'Theory', courseType: 'theory', semester: 3, group: 'core' },
  { id: 'IE23301_IE', name: 'Work System Design', code: 'IE23301', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'ME23C02_IE', name: 'Manufacturing Processes', code: 'ME23C02', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'CE23C02_IE', name: 'Fluid Mechanics and Machinery', code: 'CE23C02', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'CE23C01_IE', name: 'Mechanics of Materials', code: 'CE23C01', type: '3-0-2', courseType: '3-0-2', semester: 3, group: 'core' },
  { id: 'IE23U01_IE', name: 'Industrial Standards for Industrial Engineering', code: 'IE23U01', type: 'Standards Course', courseType: 'standards-course', semester: 3, group: 'core' },
  { id: 'UC23U01_IE', name: 'Universal Human Values', code: 'UC23U01', type: 'Universal Human Values', courseType: 'universal-human-values', semester: 3, group: 'core' },

  // Semester IV (23 credits)
  { id: 'IE23403_IE', name: 'Mechanics of Machines', code: 'IE23403', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'ME23C14_IE', name: 'Thermodynamics and Heat Transfer', code: 'ME23C14', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'IE23401_IE', name: 'Applied Ergonomics', code: 'IE23401', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'IE23404_IE', name: 'Operations Research', code: 'IE23404', type: '3-0-2', courseType: '3-0-2', semester: 4, group: 'core' },
  { id: 'IE23402_IE', name: 'Manufacturing Automation', code: 'IE23402', type: 'Theory', courseType: 'theory', semester: 4, group: 'core' },
  { id: 'ME23C06_IE', name: 'Design Thinking', code: 'ME23C06', type: '2-0-2', courseType: '2-0-2', semester: 4, group: 'core' },
  { id: 'IE23S01_IE', name: 'Skill Development Course - I', code: 'IE23S01', type: '1-0-2', courseType: '1-0-2', semester: 4, group: 'core' },

  // Semester V (28 credits)
  { id: 'IE23501_IE', name: 'Production and Operations Management', code: 'IE23501', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'IE23C01_IE', name: 'Engineering Quality Control', code: 'IE23C01', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'IE23C07_IE', name: 'Total Quality Management', code: 'IE23C07', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'ME23C17_IE', name: 'Machine Design', code: 'ME23C17', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'IE23502_IE', name: 'Design of Experiments', code: 'IE23502', type: '3-0-2', courseType: '3-0-2', semester: 5, group: 'core' },
  { id: 'IE23503_IE', name: 'Reliability Engineering', code: 'IE23503', type: 'Theory', courseType: 'theory', semester: 5, group: 'core' },
  { id: 'IOC_SEM5_I_IE', name: 'Industry Oriented Course- I', code: 'IOC_SEM5_I', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 5, group: 'core' },
  { id: 'UC23E01_IE', name: 'Engineering Entrepreneurship Development', code: 'UC23E01', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'core' },
  { id: 'IE23S02_IE', name: 'Skill Development Course-II', code: 'IE23S02', type: '1-0-2', courseType: '1-0-2', semester: 5, group: 'core' },

  // Semester VI (23 credits)
  { id: 'IOC_SEM6_II_IE', name: 'Industry Oriented Course- II', code: 'IOC_SEM6_II', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 6, group: 'core' },
  { id: 'IE23L01_IE', name: 'Self-Learning Course', code: 'IE23L01', type: 'Self-Learning Course', courseType: 'self-learning', semester: 6, group: 'core' },

  // Semester VII (27 credits)
  { id: 'IE23701_IE', name: 'Applied Multivariate Analysis', code: 'IE23701', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'IE23702_IE', name: 'Simulation Modelling and Analysis', code: 'IE23702', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'IE23703_IE', name: 'Supply Chain Management', code: 'IE23703', type: '3-0-2', courseType: '3-0-2', semester: 7, group: 'core' },
  { id: 'IE23U02_IE', name: 'Perspective of Sustainable Development', code: 'IE23U02', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'core' },
  { id: 'IOC_SEM7_III_IE', name: 'Industry Oriented Course-III', code: 'IOC_SEM7_III', type: 'IOC · Two Tests (50% Each)', courseType: 'industry-oriented-tests', semester: 7, group: 'core' },
  { id: 'IE23S03_IE', name: 'Skill Development Course-III', code: 'IE23S03', type: '1-0-4', courseType: '1-0-4', semester: 7, group: 'core' },

  // Semester VIII (8 credits)
  { id: 'IE23801_IE', name: 'Project Work / Internship cum Project Work', code: 'IE23801', type: 'PW · Regulation 17.7 (60% CA / 40% ESE)', courseType: 'project', semester: 8, group: 'core' },

  ...IE_ELECTIVE_OPTION_BOOK,
];


export function getPresetCourses(department?: string): PresetCourse[] {
  if (department === 'ECE') return ECE_PRESET_COURSES;
  if (department === 'CIVIL' || department === 'CE') return CIVIL_PRESET_COURSES;
  if (department === 'GEO' || department === 'GI' || department === 'GEOINFORMATICS') return GEO_PRESET_COURSES;
  if (department === 'BME' || department === 'BM' || department === 'BIOMEDICAL') return BME_PRESET_COURSES;
  if (department === 'IT' || department === 'INFORMATION_TECHNOLOGY' || department === 'INFOTECH') return IT_PRESET_COURSES;
  if (department === 'EEE' || department === 'ELECTRICAL') return EEE_PRESET_COURSES;
  if (department === 'MFG' || department === 'MANUFACTURING') return MFG_PRESET_COURSES;
  if (department === 'VLSI' || department === 'ELECTRONICS_VLSI') return VLSI_PRESET_COURSES;
  if (department === 'MECH' || department === 'MECHANICAL') return MECH_PRESET_COURSES;
  if (department === 'PT' || department === 'PRINTING' || department === 'PPT') return PT_PRESET_COURSES;
  if (department === 'MINING' || department === 'MINE' || department === 'MN' || department === 'MI') return MINING_PRESET_COURSES;
  if (department === 'MSE' || department === 'MATSCI' || department === 'MS') return MSE_PRESET_COURSES;
  if (department === 'IE' || department === 'INDUSTRIAL') return IE_PRESET_COURSES;
  return CSE_PRESET_COURSES;
}

export function getElectiveSlotsBySemester(department?: string): Record<number, string[]> {
  if (department === 'ECE') return ECE_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'CIVIL' || department === 'CE') return CIVIL_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'GEO' || department === 'GI' || department === 'GEOINFORMATICS') return GEO_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'BME' || department === 'BM' || department === 'BIOMEDICAL') return BME_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'IT' || department === 'INFORMATION_TECHNOLOGY' || department === 'INFOTECH') return IT_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'EEE' || department === 'ELECTRICAL') return EEE_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'MFG' || department === 'MANUFACTURING') return MFG_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'VLSI' || department === 'ELECTRONICS_VLSI') return VLSI_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'MECH' || department === 'MECHANICAL') return MECH_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'PT' || department === 'PRINTING' || department === 'PPT') return PT_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'MINING' || department === 'MINE' || department === 'MN' || department === 'MI') return MINING_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'MSE' || department === 'MATSCI' || department === 'MS') return MSE_ELECTIVE_SLOTS_BY_SEMESTER;
  if (department === 'IE' || department === 'INDUSTRIAL') return IE_ELECTIVE_SLOTS_BY_SEMESTER;
  return CSE_ELECTIVE_SLOTS_BY_SEMESTER;
}

export function getAllPresetCourses(): PresetCourse[] {
  return [
    ...CSE_PRESET_COURSES,
    ...ECE_PRESET_COURSES,
    ...CIVIL_PRESET_COURSES,
    ...GEO_PRESET_COURSES,
    ...BME_PRESET_COURSES,
    ...IT_PRESET_COURSES,
    ...EEE_PRESET_COURSES,
    ...MFG_PRESET_COURSES,
    ...VLSI_PRESET_COURSES,
    ...MECH_PRESET_COURSES,
    ...PT_PRESET_COURSES,
    ...MINING_PRESET_COURSES,
    ...MSE_PRESET_COURSES,
    ...IE_PRESET_COURSES,
  ];
}


// Preserve backwards-compatibility for existing code expecting PRESET_COURSES and ELECTIVE_SLOTS_BY_SEMESTER
export const PRESET_COURSES: PresetCourse[] = CSE_PRESET_COURSES;
export const ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = CSE_ELECTIVE_SLOTS_BY_SEMESTER;

interface SubjectSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (course: PresetCourse) => void;
  initialSemester?: SemesterNumber | null;
  initialElectiveSlot?: string | null;
  department?: string;
}

export const SubjectSelectionDialog: React.FC<SubjectSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  initialSemester,
  initialElectiveSlot,
  department,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<SemesterNumber>(1);
  const activePresets = getPresetCourses(department);
  const activeElectiveSlots = getElectiveSlotsBySemester(department);
  const [selectedCourse, setSelectedCourse] = useState<PresetCourse>(activePresets[0]);
  const [selectedElectiveSlot, setSelectedElectiveSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const semester = initialSemester ?? selectedSemester;
    const slots = activeElectiveSlots[semester] ?? [];
    const slot = initialElectiveSlot && slots.includes(initialElectiveSlot)
      ? initialElectiveSlot
      : slots[0] ?? null;
    const firstOption = activePresets.find(
      (course) => course.semester === semester && course.group === 'elective' && course.electiveSlot === slot
    );
    setSelectedSemester(semester);
    setSelectedCourse(firstOption ?? activePresets[0]);
    setSelectedElectiveSlot(slot);
  }, [isOpen, initialSemester, initialElectiveSlot, department]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const electiveSlots = activeElectiveSlots[selectedSemester] ?? [];
  const filteredCourses = activePresets.filter((course) =>
    course.semester === selectedSemester &&
    course.group === 'elective' &&
    course.electiveSlot === selectedElectiveSlot
  );

  const handleSemesterChange = (nextSemester: SemesterNumber) => {
    setSelectedSemester(nextSemester);
    const nextSlots = activeElectiveSlots[nextSemester] ?? [];
    const nextDefaultSlot = nextSlots[0] ?? null;
    const nextDefaultCourse = activePresets.find(
      (course) => course.semester === nextSemester && course.group === 'elective' && course.electiveSlot === nextDefaultSlot
    );
    const fallbackCourse = nextDefaultCourse ?? activePresets[0];
    setSelectedCourse(fallbackCourse);
    setSelectedElectiveSlot(nextDefaultSlot);
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!filteredCourses.some((course) => course.id === selectedCourse.id)) return;
    onSelectCourse(selectedCourse);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
          return;
        }
        if (event.key !== 'Tab') return;
        const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) {
          event.preventDefault();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <div className="overlay-panel relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modern Dialog Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#172554] text-blue-100">
              <BookOpen className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            </span>
            <div>
              <h2 id="dialog-title" className="text-sm font-bold text-[#172554]">
                {selectedElectiveSlot ? `Select ${selectedElectiveSlot}` : 'Select course'}
              </h2>
              <p className="text-[11px] font-medium text-slate-500">
                Semester {selectedSemester} · Choose an elective option
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-[#172554] hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-[#172554] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Elective slot switcher (shown only when multiple slots exist in this semester) */}
        {electiveSlots.length > 1 && (
          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mr-1">
                Slot:
              </span>
              {electiveSlots.map((slot) => {
                const isSlotSelected = selectedElectiveSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setSelectedElectiveSlot(slot);
                      const firstOption = activePresets.find(
                        (course) => course.semester === selectedSemester && course.group === 'elective' && course.electiveSlot === slot
                      );
                      if (firstOption) setSelectedCourse(firstOption);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                      isSlotSelected
                        ? 'border-[#172554] bg-[#172554] text-white shadow-xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dialog Body - Modern course selection cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {filteredCourses.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs font-semibold text-slate-500">
                No elective courses found for {selectedElectiveSlot || `Semester ${selectedSemester}`}.
              </p>
            </div>
          ) : (
            filteredCourses.map((course) => {
              const isSelected = selectedCourse.id === course.id;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  aria-pressed={isSelected}
                  className={`flex min-h-13 w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#172554] ${
                    isSelected
                      ? 'border-[#172554] bg-blue-50/80 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs sm:text-sm font-bold text-[#172554] leading-snug break-words">
                      {course.name}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      {course.code && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200 font-mono">
                          {course.code}
                        </span>
                      )}
                      <span className="rounded bg-blue-100/70 px-1.5 py-0.5 text-[10px] font-bold text-blue-900 border border-blue-200/50 font-numeric tabular-nums">
                        {course.type}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? 'border-[#172554] bg-[#172554] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modern Dialog Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 bg-slate-50/80 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-[#172554] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!filteredCourses.some((course) => course.id === selectedCourse.id)}
            className="min-h-10 rounded-xl bg-[#172554] px-5 py-2 text-xs font-bold text-white hover:bg-[#1e3a8a] transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-xs"
          >
            Select course
          </button>
        </div>
      </div>
    </div>
  );
};
