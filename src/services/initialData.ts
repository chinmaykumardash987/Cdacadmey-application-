import { Note, Lecture, DPP, User } from '../types';

export const INITIAL_STUDENTS: User[] = [
  {
    id: 'student-1',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'student',
    classLevel: 'Class 11',
    status: 'active',
    createdAt: '2026-09-15T10:30:00.000Z'
  },
  {
    id: 'student-2',
    fullName: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98123 45678',
    role: 'student',
    classLevel: 'Class 12',
    status: 'active',
    createdAt: '2026-09-18T14:15:00.000Z'
  },
  {
    id: 'student-3',
    fullName: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    phone: '+91 97234 56789',
    role: 'student',
    classLevel: 'Class 11',
    status: 'active',
    createdAt: '2026-09-22T09:00:00.000Z'
  },
  {
    id: 'student-4',
    fullName: 'Ananya Verma',
    email: 'ananya.v@example.com',
    phone: '+91 96345 67890',
    role: 'student',
    classLevel: 'Class 12',
    status: 'active',
    createdAt: '2026-09-25T16:45:00.000Z'
  },
  {
    id: 'student-5',
    fullName: 'Devendra Mehra',
    email: 'dev.mehra@example.com',
    phone: '+91 95456 78901',
    role: 'student',
    classLevel: 'Class 11',
    status: 'suspended',
    createdAt: '2026-09-28T11:20:00.000Z'
  }
];

export const INITIAL_ADMIN: User = {
  id: 'admin-1',
  fullName: 'CD ACADEMY Administrator',
  email: 'cdacademy992@gmail.com',
  phone: '+91 98999 88877',
  role: 'admin',
  classLevel: 'All',
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z'
};

export const INITIAL_NOTES: Note[] = [
  // Class 11 Notes
  {
    id: 'note-11-phy-1',
    title: 'Kinematics & Motion in 1D - Complete Handwritten Notes',
    classLevel: 'Class 11',
    subject: 'Physics',
    chapter: 'Motion in a Straight Line',
    description: 'High yield formulae sheet, instantaneous velocity, acceleration graphs, calculus method derivations, and solved NCERT problems.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Class11_Physics_Kinematics_Full_Notes.pdf',
    fileSize: '4.8 MB',
    pageCount: 28,
    uploaderId: 'admin-1',
    uploaderName: 'Prof. R. K. Verma',
    createdAt: '2026-09-20T10:00:00.000Z',
    tags: ['Mechanics', 'Kinematics', 'Formulas'],
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=b1t41Q3xRM8',
    youtubeVideoTitle: 'Kinematics Complete Video Lecture'
  },
  {
    id: 'note-11-chem-1',
    title: 'Structure of Atom & Quantum Numbers - Comprehensive Guide',
    classLevel: 'Class 11',
    subject: 'Chemistry',
    chapter: 'Structure of Atom',
    description: 'Bohr model postulates, de Broglie relation, Heisenberg uncertainty principle, Quantum numbers, Pauli exclusion & Hund rule.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Class11_Chemistry_Structure_of_Atom.pdf',
    fileSize: '3.6 MB',
    pageCount: 22,
    uploaderId: 'admin-1',
    uploaderName: 'Dr. S. Mukherjee',
    createdAt: '2026-09-22T11:30:00.000Z',
    tags: ['Physical Chemistry', 'Atomic Structure'],
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=Asq4_Q_i_cM',
    youtubeVideoTitle: 'Atomic Structure Visual Concept Lecture'
  },
  {
    id: 'note-11-math-1',
    title: 'Trigonometric Functions & Identities Mindmap',
    classLevel: 'Class 11',
    subject: 'Mathematics',
    chapter: 'Trigonometric Functions',
    description: 'Compound angles, multiple & sub-multiple angles, transformation formulae, conditional trigonometric identities, and domain-range tables.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Class11_Maths_Trigonometry_Master_Notes.pdf',
    fileSize: '5.1 MB',
    pageCount: 34,
    uploaderId: 'admin-1',
    uploaderName: 'Er. C. D. Das',
    createdAt: '2026-09-24T08:15:00.000Z',
    tags: ['Trigonometry', 'Formulas', 'Quick Revision']
  },
  {
    id: 'note-11-bio-1',
    title: 'Cell: The Unit of Life - Diagrammatic Revision Notes',
    classLevel: 'Class 11',
    subject: 'Biology',
    chapter: 'Cell - The Unit of Life',
    description: 'Prokaryotic vs Eukaryotic cells, endomembrane system, mitochondria, chloroplasts, ribosomes, and ultra-high resolution labeled cell diagrams.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Class11_Biology_Cell_Biology_Notes.pdf',
    fileSize: '6.4 MB',
    pageCount: 26,
    uploaderId: 'admin-1',
    uploaderName: 'Dr. Neha Sengupta',
    createdAt: '2026-09-26T14:00:00.000Z',
    tags: ['Cytology', 'NCERT Diagrams']
  },

  // Class 12 Notes
  {
    id: 'note-12-phy-1',
    title: 'Electrostatics & Electric Potential - Formulae & Derivations',
    classLevel: 'Class 12',
    subject: 'Physics',
    chapter: 'Electric Charges and Fields',
    description: 'Coulomb law in vector form, Gauss theorem applications, electric dipole in uniform electric field, and capacitance combinations.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Class12_Physics_Electrostatics_Full_Notes.pdf',
    fileSize: '5.9 MB',
    pageCount: 36,
    uploaderId: 'admin-1',
    uploaderName: 'Prof. R. K. Verma',
    createdAt: '2026-09-19T09:00:00.000Z',
    tags: ['Electromagnetism', 'Derivations', 'Board Exam']
  },
  {
    id: 'note-12-chem-1',
    title: 'Solutions & Colligative Properties - Numerical Master Sheet',
    classLevel: 'Class 12',
    subject: 'Chemistry',
    chapter: 'Solutions',
    description: 'Raoult law, ideal & non-ideal solutions, relative lowering of vapour pressure, elevation in boiling point, depression in freezing point, van\'t Hoff factor.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Class12_Chemistry_Solutions_Notes.pdf',
    fileSize: '4.2 MB',
    pageCount: 24,
    uploaderId: 'admin-1',
    uploaderName: 'Dr. S. Mukherjee',
    createdAt: '2026-09-23T15:20:00.000Z',
    tags: ['Physical Chemistry', 'Numericals']
  },
  {
    id: 'note-12-math-1',
    title: 'Calculus: Continuity, Differentiability & Derivatives',
    classLevel: 'Class 12',
    subject: 'Mathematics',
    chapter: 'Continuity and Differentiability',
    description: 'Chain rule, logarithmic differentiation, parametric differentiation, second order derivative and Mean Value Theorem step-by-step.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Class12_Maths_Calculus_Differential_Calculus.pdf',
    fileSize: '6.8 MB',
    pageCount: 42,
    uploaderId: 'admin-1',
    uploaderName: 'Er. C. D. Das',
    createdAt: '2026-09-27T10:45:00.000Z',
    tags: ['Calculus', 'Derivatives', 'High Weightage']
  }
];

export const INITIAL_LECTURES: Lecture[] = [
  // Class 11 Lectures
  {
    id: 'lec-11-phy-1',
    title: 'Lec 01: Introduction to Vectors & Coordinate Systems',
    classLevel: 'Class 11',
    subject: 'Physics',
    chapter: 'Motion in a Plane',
    lectureNumber: '01',
    description: 'Scalar vs Vector quantities, triangle law of vector addition, parallelogram law, resolution of vectors in 2D & 3D coordinate systems.',
    videoUrl: 'https://www.youtube.com/watch?v=b1t41Q3xRM8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
    duration: '48:30 min',
    uploaderId: 'admin-1',
    uploaderName: 'Prof. R. K. Verma',
    createdAt: '2026-09-18T10:00:00.000Z'
  },
  {
    id: 'lec-11-phy-2',
    title: 'Lec 02: Projectile Motion on Level Ground & Inclined Planes',
    classLevel: 'Class 11',
    subject: 'Physics',
    chapter: 'Motion in a Plane',
    lectureNumber: '02',
    description: 'Time of flight, maximum height, horizontal range derivations, trajectory equations, and challenging competitive exam questions.',
    videoUrl: 'https://www.youtube.com/watch?v=ZZbjsmXJm04',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    duration: '52:15 min',
    uploaderId: 'admin-1',
    uploaderName: 'Prof. R. K. Verma',
    createdAt: '2026-09-21T11:00:00.000Z'
  },
  {
    id: 'lec-11-chem-1',
    title: 'Lec 01: Mole Concept, Empirical Formula & Stoichiometry',
    classLevel: 'Class 11',
    subject: 'Chemistry',
    chapter: 'Some Basic Concepts of Chemistry',
    lectureNumber: '01',
    description: 'Avogadro number, atomic mass unit, molar mass calculations, limiting reagent concepts with easy visual shortcut tricks.',
    videoUrl: 'https://www.youtube.com/watch?v=Asq4_Q_i_cM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    duration: '45:10 min',
    uploaderId: 'admin-1',
    uploaderName: 'Dr. S. Mukherjee',
    createdAt: '2026-09-24T12:00:00.000Z'
  },
  {
    id: 'lec-11-math-1',
    title: 'Lec 01: Sets, Subsets & Venn Diagram Applications',
    classLevel: 'Class 11',
    subject: 'Mathematics',
    chapter: 'Sets',
    lectureNumber: '01',
    description: 'Roster and Set-builder forms, empty set, finite/infinite sets, power set, Cartesian product, union and intersection properties.',
    videoUrl: 'https://www.youtube.com/watch?v=tyDKR4FG3Yw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
    duration: '41:40 min',
    uploaderId: 'admin-1',
    uploaderName: 'Er. C. D. Das',
    createdAt: '2026-09-25T14:30:00.000Z'
  },

  // Class 12 Lectures
  {
    id: 'lec-12-phy-1',
    title: 'Lec 01: Coulomb Law & Electric Field Lines Visualized',
    classLevel: 'Class 12',
    subject: 'Physics',
    chapter: 'Electric Charges and Fields',
    lectureNumber: '01',
    description: 'Electric charge conservation, quantization, Coulomb law in dielectric media, superposition principle and field vector field plotting.',
    videoUrl: 'https://www.youtube.com/watch?v=mdulz9n2K-g',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
    duration: '55:20 min',
    uploaderId: 'admin-1',
    uploaderName: 'Prof. R. K. Verma',
    createdAt: '2026-09-17T09:30:00.000Z'
  },
  {
    id: 'lec-12-chem-1',
    title: 'Lec 01: Chemical Kinetics & Rate Law Equations',
    classLevel: 'Class 12',
    subject: 'Chemistry',
    chapter: 'Chemical Kinetics',
    lectureNumber: '01',
    description: 'Rate of reaction, instantaneous rate, factors influencing reaction rate, order and molecularity of a chemical reaction.',
    videoUrl: 'https://www.youtube.com/watch?v=l_a6aY2r75A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80',
    duration: '49:05 min',
    uploaderId: 'admin-1',
    uploaderName: 'Dr. S. Mukherjee',
    createdAt: '2026-09-20T16:00:00.000Z'
  },
  {
    id: 'lec-12-math-1',
    title: 'Lec 01: Matrices & Determinants - Properties and Tricks',
    classLevel: 'Class 12',
    subject: 'Mathematics',
    chapter: 'Matrices',
    lectureNumber: '01',
    description: 'Matrix multiplication properties, transpose of matrix, symmetric and skew symmetric matrices, inverse calculation by adjoint method.',
    videoUrl: 'https://www.youtube.com/watch?v=2sp5vXk5qYk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    duration: '50:45 min',
    uploaderId: 'admin-1',
    uploaderName: 'Er. C. D. Das',
    createdAt: '2026-09-26T17:15:00.000Z'
  }
];

export const INITIAL_DPPS: DPP[] = [
  // Class 11 DPPs
  {
    id: 'dpp-11-phy-1',
    title: 'DPP #01 - Vectors, Resolution & Relative Motion',
    classLevel: 'Class 11',
    subject: 'Physics',
    chapter: 'Motion in a Plane',
    description: '15 High-impact conceptual questions with step-by-step hints and answer keys for Class 11 Foundation & Boards.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    questionsCount: 15,
    maxMarks: 60,
    uploaderId: 'admin-1',
    uploaderName: 'Prof. R. K. Verma',
    createdAt: '2026-09-19T11:00:00.000Z',
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=ZZbjsmXJm04',
    youtubeVideoTitle: 'Vectors & Relative Motion Video Solution'
  },
  {
    id: 'dpp-11-chem-1',
    title: 'DPP #01 - Mole Concept & Stoichiometric Calculations',
    classLevel: 'Class 11',
    subject: 'Chemistry',
    chapter: 'Some Basic Concepts of Chemistry',
    description: 'Numerical practice sheet covering percentage composition, empirical formula, molarity, and normality.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    questionsCount: 20,
    maxMarks: 80,
    uploaderId: 'admin-1',
    uploaderName: 'Dr. S. Mukherjee',
    createdAt: '2026-09-24T14:00:00.000Z'
  },
  {
    id: 'dpp-11-math-1',
    title: 'DPP #01 - Sets Operations & De Morgan Laws',
    classLevel: 'Class 11',
    subject: 'Mathematics',
    chapter: 'Sets',
    description: 'Comprehensive problem sheet with union, intersection, complement proof exercises, and word problems.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    questionsCount: 18,
    maxMarks: 72,
    uploaderId: 'admin-1',
    uploaderName: 'Er. C. D. Das',
    createdAt: '2026-09-25T16:00:00.000Z'
  },

  // Class 12 DPPs
  {
    id: 'dpp-12-phy-1',
    title: 'DPP #01 - Coulomb Law & Electric Flux Problems',
    classLevel: 'Class 12',
    subject: 'Physics',
    chapter: 'Electric Charges and Fields',
    description: 'Calculations on continuous charge distributions, Gauss law integration, and symmetrical charge arrangements.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    questionsCount: 15,
    maxMarks: 60,
    uploaderId: 'admin-1',
    uploaderName: 'Prof. R. K. Verma',
    createdAt: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'dpp-12-chem-1',
    title: 'DPP #01 - Rate Laws, Half-Life & Arrhenius Equation',
    classLevel: 'Class 12',
    subject: 'Chemistry',
    chapter: 'Chemical Kinetics',
    description: 'First order kinetics derivations, half life period, activation energy graphs, and temperature dependence numericals.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    questionsCount: 20,
    maxMarks: 80,
    uploaderId: 'admin-1',
    uploaderName: 'Dr. S. Mukherjee',
    createdAt: '2026-09-21T15:30:00.000Z'
  },
  {
    id: 'dpp-12-math-1',
    title: 'DPP #01 - Matrix Operations & System of Linear Equations',
    classLevel: 'Class 12',
    subject: 'Mathematics',
    chapter: 'Matrices',
    description: 'Solving 3x3 linear equation systems using matrix inversion, Cramer rule, and properties of determinants.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    questionsCount: 15,
    maxMarks: 60,
    uploaderId: 'admin-1',
    uploaderName: 'Er. C. D. Das',
    createdAt: '2026-09-27T14:00:00.000Z'
  }
];
