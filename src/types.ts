export type UserRole = 'guest' | 'student' | 'teacher' | 'parent' | 'admin';

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  gradeLevel: string; // e.g. "Grade 10", "Grade 11", "Grade 12"
  guardianName: string;
  guardianPhone: string;
  joinedDate: string;
  
  // Custom biodata parameters for NEW UNIQUE ACADEMY online admission
  admissionNumber?: string;
  username?: string; // e.g. "NUA/2026/001"
  password?: string; // editable by student, visible by Administrator
  isActiveAccount?: boolean;
  forcePasswordChange?: boolean;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  state?: string;
  lga?: string; // Local Government Area
  religion?: string;
  bloodGroup?: string;
  medicalNotes?: string;
  homeAddress?: string;
  guardianEmail?: string;
  studentPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Invoice & Tuition balance tracker
  tuitionTotal?: number;
  tuitionPaid?: number;
  paymentMethod?: 'Card' | 'Bank Transfer' | 'None';
  paymentDate?: string;
  paymentReceiptId?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string; // fallback department
  bio: string;
  joinedDate: string;
  subjects?: string[]; // Subjects they are assigned to teach
  classrooms?: string[]; // Classrooms (course IDs) they are assigned to
  username?: string;
  password?: string;
  isActiveAccount?: boolean;
  forcePasswordChange?: boolean;

  // New Personal Information
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  state?: string;
  lga?: string;
  address?: string;
  phone?: string;
  emergencyContact?: string;
  staffId?: string; // e.g. NUA/TCHR/2026/001

  // Academic Profile
  qualification?: string;
  institutionAttended?: string;
  yearCompleted?: string;
  yearsOfExperience?: number;
  professionalCertification?: string;
  academicDepartments?: string[]; // Manual typing, multiple entries, custom subjects, editable anytime
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  room: string;
  schedule: {
    days: string[]; // e.g. ["Monday", "Wednesday"]
    time: string; // e.g. "10:00 AM - 11:30 AM"
  };
  syllabus?: string;
  capacity?: number; // Maximum limit of learners
  studentIds?: string[]; // List of student IDs registered in this classroom
  isActive?: boolean; // Active or deactivated status
  level?: string; // Class level (e.g., Primary 1, JSS1, SS1, etc)
  subjectIds?: string[]; // List of subject IDs assigned to this classroom
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classroomId: string; // Classroom or course ID
}

export type GradeCategory = 'homework' | 'quiz' | 'exam' | 'project';

export interface GradeRecord {
  id: string;
  studentId: string;
  courseId: string;
  subjectId?: string; // Opt subject-level tracking
  title: string; // e.g. "Algebra Quiz 1"
  score: number;
  maxScore: number;
  date: string;
  category: GradeCategory;
  term: string; // e.g. "Fall 2026", "Spring 2026"
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  subjectId?: string; // Opt subject-level tracking
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  dueDate: string;
  isActive: boolean;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  studentId: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  score: number;
  maxScore: number;
  submittedAt: string;
  feedback?: string;
}

export type EventType = 'academic' | 'holiday' | 'sports' | 'arts' | 'excursion';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  location: string;
  time?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: string;
  address?: string;
  studentIds: string[]; // Linked students
  isActiveAccount?: boolean;
  nationality?: string;
  state?: string;
  lga?: string;
}

export interface PaymentCategory {
  id: string;
  name: string; // "Tuition Fee" | "Registration Fee" | "Examination Fee" | "Sports Fee" | "Transport Fee" | "Hostel Fee" etc.
  amount: number; // in USD
  description: string;
  appliesToClass: string; // "All" or e.g. "Grade 12", "Grade 11", "Grade 10"
  deadline: string; // YYYY-MM-DD
  isCompulsory: boolean;
  isActive?: boolean;
  session?: string;
  term?: string;
  installmentsEnabled?: boolean;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  parentId?: string;
  categoryId: string;
  categoryName: string;
  amountPaid: number; // in USD
  date: string;
  method: 'Card' | 'Bank Transfer';
  referenceId: string;
  receiptNo: string;
  currency: 'USD' | 'NGN';
  status?: 'Pending Verification' | 'Approved' | 'Rejected';
  receiptImage?: string;
  adminComment?: string;
}

export interface SchoolNotification {
  id: string;
  studentId?: string; // linked student if any
  parentId?: string; // linked parent if any
  title: string;
  message: string;
  date: string;
  type: 'payment_reminder' | 'payment_success' | 'due_date' | 'result' | 'announcement';
  isRead: boolean;
}

export interface SchoolMessage {
  id: string;
  studentId?: string;
  parentId?: string;
  sender: string;
  text: string;
  date: string;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  isEnabled: boolean;
  isDefault: boolean;
  restrictedCountries: string[];
  type: 'primary' | 'additional';
  apiKey?: string;
  apiSecret?: string;
  clientSecret?: string;
}


