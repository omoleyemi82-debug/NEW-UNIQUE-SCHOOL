import { 
  Student, 
  Teacher, 
  Course, 
  GradeRecord, 
  AttendanceRecord, 
  Quiz, 
  CalendarEvent, 
  QuizSubmission,
  Parent,
  PaymentCategory,
  PaymentRecord,
  SchoolNotification,
  SchoolMessage,
  Subject,
  TeacherAssignment
} from './types';

export const initialStudents: Student[] = [
  {
    id: 's_01',
    name: 'Julian Alvarez',
    email: 'j.alvarez@academy.org',
    gradeLevel: 'SS1 Science',
    guardianName: 'Robert Alvarez',
    guardianPhone: '+234 (0) 812 345 6789',
    joinedDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-001',
    username: 'NUA/2026/001',
    gender: 'Male',
    department: 'Science',
    nationality: 'Nigeria',
    state: 'Lagos'
  },
  {
    id: 's_02',
    name: 'Emma Watson',
    email: 'e.watson@academy.org',
    gradeLevel: 'JSS1A',
    guardianName: 'Jacqueline Luesby',
    guardianPhone: '+234 (0) 803 123 4567',
    joinedDate: '2024-09-01',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-002',
    username: 'NUA/2026/002',
    gender: 'Female',
    department: 'N/A',
    nationality: 'Nigeria',
    state: 'Oyo'
  },
  {
    id: 's_03',
    name: 'Marcus Rashford',
    email: 'm.rashford@academy.org',
    gradeLevel: 'SS1 Science',
    guardianName: 'Melanie Rashford',
    guardianPhone: '+234 (0) 815 987 6543',
    joinedDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-003',
    username: 'NUA/2026/003',
    gender: 'Male',
    department: 'Science',
    nationality: 'Nigeria',
    state: 'Kaduna'
  },
  {
    id: 's_04',
    name: 'Sophia Loren',
    email: 's.loren@academy.org',
    gradeLevel: 'JSS1A',
    guardianName: 'Romilda Villani',
    guardianPhone: '+234 (0) 708 345 6789',
    joinedDate: '2025-09-01',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-004',
    username: 'NUA/2026/004',
    gender: 'Female',
    department: 'N/A',
    nationality: 'Nigeria',
    state: 'Enugu'
  },
  {
    id: 's_05',
    name: 'Dev Patel',
    email: 'd.patel@academy.org',
    gradeLevel: 'JSS1B',
    guardianName: 'Anita Patel',
    guardianPhone: '+234 (0) 905 456 7890',
    joinedDate: '2024-09-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-005',
    username: 'NUA/2026/005',
    gender: 'Male',
    department: 'N/A',
    nationality: 'Nigeria',
    state: 'Rivers'
  },
  {
    id: 's_06',
    name: 'Adebayo Adeniran',
    email: 'a.adeniran@academy.org',
    gradeLevel: 'SS1 Science',
    guardianName: 'Oluwagbenga Adeniran',
    guardianPhone: '+234 (0) 802 876 5432',
    joinedDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-006',
    username: 'NUA/2026/006',
    gender: 'Male',
    department: 'Science',
    nationality: 'Nigeria',
    state: 'Ogun'
  },
  {
    id: 's_07',
    name: 'Adelakun Oluwaseun',
    email: 'a.oluwaseun@academy.org',
    gradeLevel: 'SS2 Art',
    guardianName: 'Abiodun Adelakun',
    guardianPhone: '+234 (0) 811 555 4433',
    joinedDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-007',
    username: 'NUA/2026/007',
    gender: 'Male',
    department: 'Art',
    nationality: 'Nigeria',
    state: 'Oyo'
  },
  {
    id: 's_08',
    name: 'Adeniyi Babajide',
    email: 'a.babajide@academy.org',
    gradeLevel: 'JSS1A',
    guardianName: 'Adeolu Adeniyi',
    guardianPhone: '+234 (0) 903 444 5555',
    joinedDate: '2024-09-01',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-008',
    username: 'NUA/2026/008',
    gender: 'Male',
    department: 'N/A',
    nationality: 'Nigeria',
    state: 'Osun'
  },
  {
    id: 's_09',
    name: 'Chioma Nwachukwu',
    email: 'c.nwachukwu@academy.org',
    gradeLevel: 'SS3 Commerce',
    guardianName: 'Nnamdi Nwachukwu',
    guardianPhone: '+234 (0) 805 777 8888',
    joinedDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-009',
    username: 'NUA/2026/009',
    gender: 'Female',
    department: 'Commerce',
    nationality: 'Nigeria',
    state: 'Anambra'
  },
  {
    id: 's_10',
    name: 'Amina Yusuf',
    email: 'a.yusuf@academy.org',
    gradeLevel: 'SS1 Science',
    guardianName: 'Yusuf Bello',
    guardianPhone: '+234 (0) 806 999 1111',
    joinedDate: '2024-09-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    admissionNumber: 'NUA-26-010',
    username: 'NUA/2026/010',
    gender: 'Female',
    department: 'Science',
    nationality: 'Nigeria',
    state: 'Kano'
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: 't_01',
    name: 'Dr. Elizabeth Blackwell',
    email: 'e.blackwell@academy.org',
    department: 'Sciences',
    bio: 'Ph.D. in Cellular Biology with 12 years of teaching experience. Passionate about interactive labs and mentoring student researchers.',
    joinedDate: '2016-08-15',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 't_02',
    name: 'Prof. Alan Turing',
    email: 'a.turing@academy.org',
    department: 'Mathematics',
    bio: 'Masters in Pure Mathematics. Dedicated to teaching cryptography, mathematical logic, and building problem-solving intuition.',
    joinedDate: '2018-09-10',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 't_03',
    name: 'Sarah G. Blanding',
    email: 's.blanding@academy.org',
    department: 'Humanities',
    bio: 'BA and MA in English and History. Promotes argumentative writing, critical analysis of literature, and global historical insights.',
    joinedDate: '2019-01-20',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialSubjects: Subject[] = [
  { id: 'sub_math', name: 'Mathematics', code: 'MATH' },
  { id: 'sub_english', name: 'English Language', code: 'ENG' },
  { id: 'sub_science', name: 'Basic Science', code: 'SCI' },
  { id: 'sub_social', name: 'Social Studies', code: 'SOC' },
  { id: 'sub_computer', name: 'Computer Studies', code: 'COMP' },
  { id: 'sub_physics', name: 'Physics', code: 'PHY' },
  { id: 'sub_chemistry', name: 'Chemistry', code: 'CHM' },
  { id: 'sub_biology', name: 'Biology', code: 'BIO' }
];

export const initialTeacherAssignments: TeacherAssignment[] = [
  { id: 'ta_1', teacherId: 't_02', subjectId: 'sub_math', classroomId: 'c_math' },
  { id: 'ta_2', teacherId: 't_02', subjectId: 'sub_math', classroomId: 'c_literature' },
  { id: 'ta_3', teacherId: 't_02', subjectId: 'sub_math', classroomId: 'c_science' },
  { id: 'ta_4', teacherId: 't_01', subjectId: 'sub_english', classroomId: 'c_history' },
  { id: 'ta_5', teacherId: 't_01', subjectId: 'sub_english', classroomId: 'c_math' }
];

export const initialCourses: Course[] = [
  {
    id: 'c_math',
    name: 'JSS1A',
    code: 'JSS1A',
    level: 'JSS1',
    teacherId: 't_02',
    room: 'Room 302',
    capacity: 30,
    isActive: true,
    studentIds: ['s_02', 's_04'],
    subjectIds: ['sub_math', 'sub_english', 'sub_science', 'sub_social', 'sub_computer'],
    schedule: {
      days: ['Monday', 'Wednesday'],
      time: '09:00 AM - 10:30 AM'
    },
    syllabus: 'This classroom covers fundamental subjects for Junior Secondary School Level 1.'
  },
  {
    id: 'c_science',
    name: 'SS1 Science',
    code: 'SS1-SCI',
    level: 'SS1',
    teacherId: 't_01',
    room: 'Lab Section B',
    capacity: 2, // Set to 2 to demonstrate capacity overflow (currently has s_01, s_03)
    isActive: true,
    studentIds: ['s_01', 's_03'],
    subjectIds: ['sub_math', 'sub_physics', 'sub_chemistry', 'sub_biology', 'sub_english'],
    schedule: {
      days: ['Tuesday', 'Thursday'],
      time: '11:00 AM - 12:30 PM'
    },
    syllabus: 'High School Level 1 Science specialization, focusing on the core science subjects.'
  },
  {
    id: 'c_literature',
    name: 'JSS1B',
    code: 'JSS1B',
    level: 'JSS1',
    teacherId: 't_03',
    room: 'Seminar Hall A',
    capacity: 30,
    isActive: true,
    studentIds: ['s_05'],
    subjectIds: ['sub_math', 'sub_english', 'sub_science'],
    schedule: {
      days: ['Monday', 'Friday'],
      time: '01:00 PM - 02:30 PM'
    },
    syllabus: 'Alternative Junior Secondary School Level 1 stream.'
  },
  {
    id: 'c_history',
    name: 'Primary 1A',
    code: 'P1A',
    level: 'Primary 1',
    teacherId: 't_03',
    room: 'Room 110',
    capacity: 15,
    isActive: true,
    studentIds: [],
    subjectIds: ['sub_math', 'sub_english'],
    schedule: {
      days: ['Tuesday', 'Friday'],
      time: '03:00 PM - 04:30 PM'
    },
    syllabus: 'Lower primary learning curriculum, reading and counting blocks.'
  }
];

// Seed some grades for Julian Alvarez (s_01) and Emma Watson (s_02)
export const initialGrades: GradeRecord[] = [
  // Math - s_01
  { id: 'g_001', studentId: 's_01', courseId: 'c_math', title: 'Calculus Limits Test', score: 88, maxScore: 100, date: '2026-04-10', category: 'exam', term: 'Spring 2026' },
  { id: 'g_002', studentId: 's_01', courseId: 'c_math', title: 'Trigonometry Homework', score: 95, maxScore: 100, date: '2026-04-18', category: 'homework', term: 'Spring 2026' },
  { id: 'g_003', studentId: 's_01', courseId: 'c_math', title: 'Matrices Midterm Exam', score: 92, maxScore: 100, date: '2026-05-01', category: 'exam', term: 'Spring 2026' },
  { id: 'g_004', studentId: 's_01', courseId: 'c_math', title: 'Sequence & Series Problem Set', score: 79, maxScore: 100, date: '2026-05-10', category: 'homework', term: 'Spring 2026' },

  // Math - s_02 (Emma)
  { id: 'g_005', studentId: 's_02', courseId: 'c_math', title: 'Calculus Limits Test', score: 94, maxScore: 100, date: '2026-04-10', category: 'exam', term: 'Spring 2026' },
  { id: 'g_006', studentId: 's_02', courseId: 'c_math', title: 'Trigonometry Homework', score: 100, maxScore: 100, date: '2026-04-18', category: 'homework', term: 'Spring 2026' },
  { id: 'g_007', studentId: 's_02', courseId: 'c_math', title: 'Matrices Midterm Exam', score: 96, maxScore: 100, date: '2026-05-01', category: 'exam', term: 'Spring 2026' },

  // Science - s_01
  { id: 'g_008', studentId: 's_01', courseId: 'c_science', title: 'Cell division quiz', score: 18, maxScore: 20, date: '2026-04-12', category: 'quiz', term: 'Spring 2026' },
  { id: 'g_009', studentId: 's_01', courseId: 'c_science', title: 'Lab report 1: Synthesis', score: 45, maxScore: 50, date: '2026-04-22', category: 'project', term: 'Spring 2026' },
  { id: 'g_010', studentId: 's_01', courseId: 'c_science', title: 'Genetics Exam', score: 81, maxScore: 100, date: '2026-05-08', category: 'exam', term: 'Spring 2026' },

  // Science - s_02
  { id: 'g_011', studentId: 's_02', courseId: 'c_science', title: 'Cell division quiz', score: 20, maxScore: 20, date: '2026-04-12', category: 'quiz', term: 'Spring 2026' },
  { id: 'g_012', studentId: 's_02', courseId: 'c_science', title: 'Lab report 1: Synthesis', score: 48, maxScore: 50, date: '2026-04-22', category: 'project', term: 'Spring 2026' },
  { id: 'g_013', studentId: 's_02', courseId: 'c_science', title: 'Genetics Exam', score: 95, maxScore: 100, date: '2026-05-08', category: 'exam', term: 'Spring 2026' },

  // Science - s_03 (Marcus)
  { id: 'g_014', studentId: 's_03', courseId: 'c_science', title: 'Cell division quiz', score: 14, maxScore: 20, date: '2026-04-12', category: 'quiz', term: 'Spring 2026' },
  { id: 'g_015', studentId: 's_03', courseId: 'c_science', title: 'Lab report 1: Synthesis', score: 41, maxScore: 50, date: '2026-04-22', category: 'project', term: 'Spring 2026' },
  { id: 'g_016', studentId: 's_03', courseId: 'c_science', title: 'Genetics Exam', score: 76, maxScore: 100, date: '2026-05-08', category: 'exam', term: 'Spring 2026' },

  // Literature - s_01
  { id: 'g_017', studentId: 's_01', courseId: 'c_literature', title: 'Shakespeare Analysis Essay', score: 92, maxScore: 100, date: '2026-04-15', category: 'project', term: 'Spring 2026' },
  { id: 'g_018', studentId: 's_01', courseId: 'c_literature', title: 'Poetry Vocabulary Quiz', score: 15, maxScore: 20, date: '2026-04-29', category: 'quiz', term: 'Spring 2026' },

  // Literature - s_02
  { id: 'g_019', studentId: 's_02', courseId: 'c_literature', title: 'Shakespeare Analysis Essay', score: 98, maxScore: 100, date: '2026-04-15', category: 'project', term: 'Spring 2026' },
  { id: 'g_020', studentId: 's_02', courseId: 'c_literature', title: 'Poetry Vocabulary Quiz', score: 19, maxScore: 20, date: '2026-04-29', category: 'quiz', term: 'Spring 2026' }
];

// Seed attendance for the current month
export const initialAttendance: AttendanceRecord[] = [
  // Math
  { id: 'a_001', studentId: 's_01', courseId: 'c_math', date: '2026-05-11', status: 'present' },
  { id: 'a_002', studentId: 's_02', courseId: 'c_math', date: '2026-05-11', status: 'present' },
  { id: 'a_003', studentId: 's_03', courseId: 'c_math', date: '2026-05-11', status: 'absent', notes: 'Unexcused soccer travel' },
  { id: 'a_004', studentId: 's_04', courseId: 'c_math', date: '2026-05-11', status: 'present' },
  { id: 'a_005', studentId: 's_05', courseId: 'c_math', date: '2026-05-11', status: 'late' },

  { id: 'a_006', studentId: 's_01', courseId: 'c_math', date: '2026-05-18', status: 'present' },
  { id: 'a_007', studentId: 's_02', courseId: 'c_math', date: '2026-05-18', status: 'present' },
  { id: 'a_008', studentId: 's_03', courseId: 'c_math', date: '2026-05-18', status: 'present' },
  { id: 'a_009', studentId: 's_04', courseId: 'c_math', date: '2026-05-18', status: 'excused', notes: 'Dentist appointment' },
  { id: 'a_010', studentId: 's_05', courseId: 'c_math', date: '2026-05-18', status: 'present' },

  // Science
  { id: 'a_011', studentId: 's_01', courseId: 'c_science', date: '2026-05-12', status: 'present' },
  { id: 'a_012', studentId: 's_02', courseId: 'c_science', date: '2026-05-12', status: 'present' },
  { id: 'a_013', studentId: 's_03', courseId: 'c_science', date: '2026-05-12', status: 'present' },
  { id: 'a_014', studentId: 's_04', courseId: 'c_science', date: '2026-05-12', status: 'late' },
  { id: 'a_015', studentId: 's_05', courseId: 'c_science', date: '2026-05-12', status: 'absent' },

  { id: 'a_016', studentId: 's_01', courseId: 'c_science', date: '2026-05-19', status: 'late', notes: 'Missed school bus' },
  { id: 'a_017', studentId: 's_02', courseId: 'c_science', date: '2026-05-19', status: 'present' },
  { id: 'a_018', studentId: 's_03', courseId: 'c_science', date: '2026-05-19', status: 'present' },
  { id: 'a_019', studentId: 's_04', courseId: 'c_science', date: '2026-05-19', status: 'present' },
  { id: 'a_020', studentId: 's_05', courseId: 'c_science', date: '2026-05-19', status: 'present' }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'q_01',
    courseId: 'c_math',
    title: 'Differential Calculus Essentials',
    description: 'This quiz tests conceptual limits, tangent slope estimations, and initial derivatives. Review Chapter 4 slide decks.',
    timeLimitMinutes: 10,
    dueDate: '2026-05-30',
    isActive: true,
    questions: [
      {
        id: 'qm_1',
        questionText: 'What is the derivative of f(x) = x³ - 3x + 5 with respect to x?',
        options: [
          '3x² - 3',
          '3x² - 3x',
          '2x² - 3',
          '3x³ - 3'
        ],
        correctOptionIndex: 0,
        explanation: 'By the Power Rule, d/dx(x³) = 3x² and d/dx(-3x) = -3, while the derivative of a constant (5) is 0.'
      },
      {
        id: 'qm_2',
        questionText: 'Evaluate the limit: lim(x->2) (x² - 4)/(x - 2).',
        options: [
          '0',
          '2',
          '4',
          'Undefined'
        ],
        correctOptionIndex: 2,
        explanation: 'Factoring (x² - 4) as (x - 2)(x + 2). Canceling (x - 2) gives lim(x->2) (x+2) = 4.'
      },
      {
        id: 'qm_3',
        questionText: 'What does the first derivative of a function represent graphically?',
        options: [
          'The area under the curve',
          'The slope of the tangent line at a point',
          'The x-intercepts of the function',
          'The concavity of the function curve'
        ],
        correctOptionIndex: 1,
        explanation: 'The derivative represents the instantaneous rate of change, which is the slope of the tangent line at any given point.'
      }
    ]
  },
  {
    id: 'q_02',
    courseId: 'c_science',
    title: 'Cellular Division & Mitosis Check',
    description: 'Quick check of chromosome configurations during mitotic division stages.',
    timeLimitMinutes: 5,
    dueDate: '2026-05-28',
    isActive: true,
    questions: [
      {
        id: 'qs_1',
        questionText: 'During which phase of mitosis do sister chromatids align along the equator of the cell?',
        options: [
          'Prophase',
          'Anaphase',
          'Metaphase',
          'Telophase'
        ],
        correctOptionIndex: 2,
        explanation: 'During Metaphase, chromosomes align on the metaphase plate (the equator) before being pulled apart.'
      },
      {
        id: 'qs_2',
        questionText: 'How many chromosomes does a normal human somatic cell contain before replication?',
        options: [
          '23',
          '46',
          '92',
          '48'
        ],
        correctOptionIndex: 1,
        explanation: 'Somatic human cells are diploid, comprising 23 pairs, giving a total of 46 chromosomes.'
      }
    ]
  }
];

export const initialSubmissions: QuizSubmission[] = [
  {
    id: 'sub_01',
    quizId: 'q_02',
    studentId: 's_02', // Emma Watson took Mitosis quiz
    answers: {
      'qs_1': 2,
      'qs_2': 1
    },
    score: 2,
    maxScore: 2,
    submittedAt: '2026-05-15T14:30:00Z',
    feedback: 'Excellent job Emma! Full Marks.'
  }
];

export const initialEvents: CalendarEvent[] = [
  {
    id: 'e_01',
    title: 'Spring Parent-Teacher Conference',
    description: 'Biannual discussion of grades, classroom performance, and graduation progress in all core departments.',
    date: '2026-05-25',
    type: 'academic',
    location: 'Main Gymnasium',
    time: '4:00 PM - 7:30 PM'
  },
  {
    id: 'e_02',
    title: 'Annual Sports Day & Track Meets',
    description: 'Inter-house athletic events featuring track, field, high jump, volleyball, and tug-of-war tournaments.',
    date: '2026-05-31',
    type: 'sports',
    location: 'NEW UNIQUE ACADEMY Stadium Field',
    time: '9:00 AM - 4:00 PM'
  },
  {
    id: 'e_03',
    title: 'Memorial Day Observance Break',
    description: 'No scheduled school sessions on Memorial Day. Administrative offices are closed.',
    date: '2026-05-25',
    type: 'holiday',
    location: 'Campus-wide',
    time: 'All Day'
  },
  {
    id: 'e_04',
    title: 'Art Showcase & Orchestral Concert',
    description: 'An exhibition of student painting portfolios in the lobby followed by our classical music orchestral set.',
    date: '2026-06-04',
    type: 'arts',
    location: 'Preston Auditorium',
    time: '6:30 PM - 9:00 PM'
  },
  {
    id: 'e_05',
    title: 'Biology Field Trip to Coastal Dunes',
    description: 'Marine ecology survey, tide pool analysis, and environmental photography. Bus departs at 7:30 AM.',
    date: '2026-06-10',
    type: 'excursion',
    location: 'Sandy Point State Park',
    time: '7:30 AM - 5:00 PM'
  }
];

export const initialParents: Parent[] = [
  {
    id: 'p_01',
    name: 'Robert Alvarez',
    email: 'robert.alvarez@mail.com',
    phone: '+1 (555) 123-4567',
    password: 'parent123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    address: '742 Evergreen Terrace, Lagos',
    studentIds: ['s_01'],
    isActiveAccount: true
  },
  {
    id: 'p_02',
    name: 'Jacqueline Luesby',
    email: 'jacqueline@mail.com',
    phone: '+1 (555) 987-6543',
    password: 'parent123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    address: '99 Victoria Island Blvd, Lagos',
    studentIds: ['s_02'],
    isActiveAccount: true
  },
  {
    id: 'p_03',
    name: 'Melanie Rashford',
    email: 'melanie@mail.com',
    phone: '+1 (555) 234-5678',
    password: 'parent123',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    address: '24 Old Trafford Estate, Ikeja',
    studentIds: ['s_03'],
    isActiveAccount: true
  },
  {
    id: 'p_04',
    name: 'John Doe',
    email: 'john.doe@mail.com',
    phone: '+1 (555) 304-4000',
    password: 'parent123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    address: '12 Admiral Way, Lekki',
    studentIds: ['s_04', 's_05'], // Multiple linked students!
    isActiveAccount: true
  }
];

export const initialPaymentCategories: PaymentCategory[] = [
  {
    id: 'pc_tuition',
    name: 'Tuition Fee',
    amount: 3000,
    description: 'Core classroom lecturing instruction, e-library resource license and internet bandwidth fee.',
    appliesToClass: 'All',
    deadline: '2026-06-15',
    isCompulsory: true
  },
  {
    id: 'pc_registration',
    name: 'Registration Fee',
    amount: 500,
    description: 'Admissions handling, system badging and identity card database indexing.',
    appliesToClass: 'All',
    deadline: '2026-05-30',
    isCompulsory: true
  },
  {
    id: 'pc_examination',
    name: 'Examination Fee',
    amount: 400,
    description: 'Term sheets and WAEC standard grading review board assessment.',
    appliesToClass: 'All',
    deadline: '2026-06-05',
    isCompulsory: true
  },
  {
    id: 'pc_sports',
    name: 'Sports Fee',
    amount: 200,
    description: 'Athletic wear, stadium training accessories, and inter-house game support.',
    appliesToClass: 'All',
    deadline: '2026-06-20',
    isCompulsory: false
  },
  {
    id: 'pc_transport',
    name: 'Transport Fee',
    amount: 300,
    description: 'Daily centralized bus shuttle routing with explicit drops.',
    appliesToClass: 'All',
    deadline: '2026-06-10',
    isCompulsory: false
  },
  {
    id: 'pc_hostel',
    name: 'Hostel Fee',
    amount: 800,
    description: 'On-premises dormitory room allocation, heating utility electricity and dinner plan keys.',
    appliesToClass: 'Grade 12',
    deadline: '2026-05-25',
    isCompulsory: false
  }
];

export const initialPaymentRecords: PaymentRecord[] = [
  {
    id: 'pr_01',
    studentId: 's_01',
    parentId: 'p_01',
    categoryId: 'pc_registration',
    categoryName: 'Registration Fee',
    amountPaid: 500,
    date: '2026-05-01',
    method: 'Card',
    referenceId: 'TXN-PSTK-99204A8',
    receiptNo: 'REC-529104',
    currency: 'USD'
  },
  {
    id: 'pr_02',
    studentId: 's_01',
    parentId: 'p_01',
    categoryId: 'pc_examination',
    categoryName: 'Examination Fee',
    amountPaid: 400,
    date: '2026-05-10',
    method: 'Bank Transfer',
    referenceId: 'TXN-WIRE-77310BB',
    receiptNo: 'REC-302914',
    currency: 'USD'
  },
  {
    id: 'pr_03',
    studentId: 's_02',
    parentId: 'p_02',
    categoryId: 'pc_registration',
    categoryName: 'Registration Fee',
    amountPaid: 500,
    date: '2026-05-02',
    method: 'Card',
    referenceId: 'TXN-PSTK-11204C9',
    receiptNo: 'REC-824041',
    currency: 'USD'
  }
];

export const initialNotifications: SchoolNotification[] = [
  {
    id: 'n_01',
    studentId: 's_01',
    parentId: 'p_01',
    title: 'New Grade Entry Recorded',
    message: 'Teacher Sarah G. Blanding submitted a Grade 100% for composition test.',
    date: '2026-05-20',
    type: 'result',
    isRead: false
  },
  {
    id: 'n_02',
    studentId: 's_01',
    parentId: 'p_01',
    title: 'Outstanding School Fees Due',
    message: 'Compulsory Tuition Fee deadline is 2026-06-15. Avoid classroom suspension by settling fees early.',
    date: '2026-05-22',
    type: 'payment_reminder',
    isRead: false
  },
  {
    id: 'n_03',
    studentId: 's_01',
    parentId: 'p_01',
    title: 'Payment Succeeded',
    message: 'Approved transaction for Examination Fee $400 has cleared. Dynamic Receipt REC-302914 available.',
    date: '2026-05-10',
    type: 'payment_success',
    isRead: true
  }
];

export const initialMessages: SchoolMessage[] = [
  {
    id: 'm_01',
    studentId: 's_01',
    parentId: 'p_01',
    sender: 'Principal Benson',
    text: 'Good afternoon, dear parents. We are excited to welcome your ward to modern AP sessions this week. Feel free to contact our administrative desk for any assistance.',
    date: '2026-05-15'
  },
  {
    id: 'm_02',
    studentId: 's_01',
    parentId: 'p_01',
    sender: 'Prof. Alan Turing',
    text: 'Julian Alvarez is performing excellently in Advanced Calculus, although I highly endorse reviewing quadratic series patterns over the coming weekend.',
    date: '2026-05-21'
  }
];

