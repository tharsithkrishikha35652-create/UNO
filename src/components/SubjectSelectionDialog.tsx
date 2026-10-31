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

export function getPresetCourses(department?: string): PresetCourse[] {
    return department === 'ECE' ? ECE_PRESET_COURSES : CSE_PRESET_COURSES;
}

export function getElectiveSlotsBySemester(department?: string): Record<number, string[]> {
    return department === 'ECE' ? ECE_ELECTIVE_SLOTS_BY_SEMESTER : CSE_ELECTIVE_SLOTS_BY_SEMESTER;
}

export function getAllPresetCourses(): PresetCourse[] {
  return [...CSE_PRESET_COURSES, ...ECE_PRESET_COURSES];
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
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                          {course.code}
                        </span>
                      )}
                      <span className="rounded bg-blue-100/70 px-1.5 py-0.5 text-[10px] font-bold text-blue-900 border border-blue-200/50">
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
