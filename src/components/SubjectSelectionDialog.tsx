import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
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

export const ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Open Elective I', 'Professional Elective I'],
  6: ['Open Elective II', 'Professional Elective II', 'Professional Elective III'],
  7: ['Professional Elective IV', 'Professional Elective V', 'Professional Elective VI'],
};

const ELECTIVE_COURSE_OPTIONS: Omit<PresetCourse, 'id'>[] = [
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

const ELECTIVE_OPTION_BOOK: PresetCourse[] = ELECTIVE_COURSE_OPTIONS.map((course, index) => ({
  id: `${course.semester}-${course.electiveSlot}-${index}`,
  ...course,
}));

export const PRESET_COURSES: PresetCourse[] = [
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
    type: 'One test + assignments',
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
    id: 'SDC_SEM3_I',
    name: 'Skill Development Course – I',
    code: '',
    type: 'Laboratory · 60% CA / 40% ESE',
    courseType: 'laboratory-course',
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
    id: 'SDC_SEM4_II',
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
    type: '3-0-0',
    courseType: 'theory',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23504',
    name: 'Open Elective I',
    code: 'OE-I',
    type: '3-0-0',
    courseType: 'theory',
    semester: 5,
    group: 'elective',
    electiveSlot: 'Open Elective I',
  },
  {
    id: 'CS23505',
    name: 'Self Learning Course',
    code: 'CS23L01',
    type: 'External Course Result',
    courseType: 'self-learning',
    semester: 5,
    group: 'core',
  },
  {
    id: 'UC23E01',
    name: 'Engineering Entrepreneurship Development',
    code: 'UC23E01',
    type: 'UC · evaluated as LIT (2-0-2)',
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
    id: 'SDC_SEM5_III',
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
    id: 'OPEN_ELECTIVE_II',
    name: 'Open Elective II',
    code: 'OE-II',
    type: '3-0-0',
    courseType: 'theory',
    semester: 6,
    group: 'elective',
    electiveSlot: 'Open Elective II',
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

  ...ELECTIVE_OPTION_BOOK,
];

interface SubjectSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (course: PresetCourse) => void;
  initialSemester?: SemesterNumber | null;
  initialElectiveSlot?: string | null;
}

export const SubjectSelectionDialog: React.FC<SubjectSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  initialSemester,
  initialElectiveSlot,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<SemesterNumber>(1);
  const [selectedCourse, setSelectedCourse] = useState<PresetCourse>(PRESET_COURSES[0]);
  const [selectedElectiveSlot, setSelectedElectiveSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const semester = initialSemester ?? selectedSemester;
    const slots = ELECTIVE_SLOTS_BY_SEMESTER[semester] ?? [];
    const slot = initialElectiveSlot && slots.includes(initialElectiveSlot)
      ? initialElectiveSlot
      : slots[0] ?? null;
    const firstOption = PRESET_COURSES.find(
      (course) => course.semester === semester && course.group === 'elective' && course.electiveSlot === slot
    );
    setSelectedSemester(semester);
    setSelectedCourse(firstOption ?? PRESET_COURSES[0]);
    setSelectedElectiveSlot(slot);
  }, [isOpen, initialSemester, initialElectiveSlot]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const electiveSlots = ELECTIVE_SLOTS_BY_SEMESTER[selectedSemester] ?? [];
  const filteredCourses = PRESET_COURSES.filter((course) =>
    course.semester === selectedSemester &&
    course.group === 'elective' &&
    course.electiveSlot === selectedElectiveSlot
  );

  const handleSemesterChange = (nextSemester: SemesterNumber) => {
    setSelectedSemester(nextSemester);
    const nextSlots = ELECTIVE_SLOTS_BY_SEMESTER[nextSemester] ?? [];
    const nextDefaultSlot = nextSlots[0] ?? null;
    const nextDefaultCourse = PRESET_COURSES.find(
      (course) => course.semester === nextSemester && course.group === 'elective' && course.electiveSlot === nextDefaultSlot
    );
    const fallbackCourse = nextDefaultCourse ?? PRESET_COURSES[0];
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
      <div className="bg-white border border-slate-300 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Dialog Header */}
        <div className="bg-[#172554] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#172554]">
          <h2 id="dialog-title" className="text-sm font-black uppercase tracking-wider">
            Select Course
          </h2>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="text-slate-300 hover:text-white p-1 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialog Body - Semester selector and course list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => {
              const isSelected = selectedSemester === semester;
              return (
                <button
                  key={semester}
                  type="button"
                  onClick={() => handleSemesterChange(semester as SemesterNumber)}
                  className={`px-3 py-2 text-xs font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#172554] text-white border-[#172554]'
                      : 'bg-white text-[#172554] border-slate-300 hover:border-[#172554] hover:bg-slate-50'
                  }`}
                >
                  Semester {semester}
                </button>
              );
            })}
          </div>

          {electiveSlots.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {electiveSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setSelectedElectiveSlot(slot);
                      const firstOption = PRESET_COURSES.find(
                        (course) => course.semester === selectedSemester && course.group === 'elective' && course.electiveSlot === slot
                      );
                      if (firstOption) setSelectedCourse(firstOption);
                    }}
                    className={`px-3 py-2 text-[11px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                      selectedElectiveSlot === slot
                        ? 'bg-blue-100 text-[#172554] border-[#172554]'
                        : 'bg-white text-[#172554] border-slate-300 hover:border-[#172554] hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {filteredCourses.map((course) => {
              const isSelected = selectedCourse.id === course.id;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  aria-pressed={isSelected}
                  className={`w-full text-left p-3.5 border cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#172554] bg-blue-50'
                      : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm sm:text-base font-black text-[#172554]">
                      {course.name}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider bg-[#172554] text-white px-2 py-0.5">
                      {course.type}
                    </span>
                    {course.code && (
                      <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-300 px-1.5 py-0.5">
                        {course.code}
                      </span>
                    )}
                  </div>

                  <div
                    className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[#172554] bg-[#172554] text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-[#172554] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#172554] border border-[#172554] bg-white hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!filteredCourses.some((course) => course.id === selectedCourse.id)}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors cursor-pointer"
          >
            Select Course
          </button>
        </div>
      </div>
    </div>
  );
};
