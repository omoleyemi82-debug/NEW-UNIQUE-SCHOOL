import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  Course,
  GradeRecord,
  AttendanceRecord,
  Quiz,
  QuizSubmission,
  CalendarEvent,
  UserRole,
  AttendanceStatus,
  Parent,
  PaymentCategory,
  PaymentRecord,
  SchoolNotification,
  SchoolMessage,
  Subject,
  TeacherAssignment,
  PaymentMethodConfig,
  Admin,
  RoleConfig,
  LoginActivity
} from '../types';
import {
  initialStudents,
  initialTeachers,
  initialCourses,
  initialGrades,
  initialAttendance,
  initialQuizzes,
  initialSubmissions,
  initialEvents,
  initialParents,
  initialPaymentCategories,
  initialPaymentRecords,
  initialNotifications,
  initialMessages,
  initialSubjects,
  initialTeacherAssignments
} from '../initialData';
import { encryptPassword } from '../utils/security';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface SchoolContextProps {
  loading: boolean;
  currentRole: UserRole;
  currentUserId: string;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  quizzes: Quiz[];
  submissions: QuizSubmission[];
  events: CalendarEvent[];
  parents: Parent[];
  paymentCategories: PaymentCategory[];
  paymentRecords: PaymentRecord[];
  paymentMethods: PaymentMethodConfig[];
  notifications: SchoolNotification[];
  messages: SchoolMessage[];
  sessions: string[];
  terms: string[];
  staffClassroomPermission: boolean;
  subjects: Subject[];
  teacherAssignments: TeacherAssignment[];
  admins: Admin[];
  rolesConfig: RoleConfig[];
  loginSessions: LoginActivity[];
  schoolName: string;

  // Actions
  setRole: (role: UserRole, userId?: string) => void;
  addStudent: (student: Omit<Student, 'id' | 'joinedDate'>) => void;
  updateStudent: (studentId: string, updatedData: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  payTuition: (studentId: string, amount: number, method: 'Card' | 'Bank Transfer') => void;
  addTeacher: (teacher: Omit<Teacher, 'id' | 'joinedDate'>) => void;
  updateTeacher: (id: string, updatedData: Partial<Teacher>) => void;
  removeTeacher: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updatedData: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addGrade: (grade: Omit<GradeRecord, 'id'>) => void;
  updateGrade: (id: string, score: number) => void;
  deleteGrade: (id: string) => void;
  submitAttendance: (courseId: string, date: string, records: { studentId: string; status: AttendanceStatus; notes: string }[]) => void;
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  updateQuiz: (id: string, updatedData: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  toggleQuizActive: (id: string) => void;
  addQuizSubmission: (submission: Omit<QuizSubmission, 'id'>) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  addAcademicSession: (session: string) => void;
  deleteAcademicSession: (session: string) => void;
  addTerm: (term: string) => void;
  deleteTerm: (term: string) => void;
  setStaffClassroomPermission: (allowed: boolean) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updatedData: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addTeacherAssignment: (assignment: Omit<TeacherAssignment, 'id'>) => void;
  removeTeacherAssignment: (id: string) => void;
  assignSubjectsToClass: (classroomId: string, subjectIds: string[]) => void;
  addParent: (parent: Omit<Parent, 'id'>) => void;
  updateParent: (parentId: string, updatedData: Partial<Parent>) => void;
  removeParent: (id: string) => void;
  addPaymentCategory: (category: Omit<PaymentCategory, 'id'>) => void;
  updatePaymentCategory: (id: string, updatedData: Partial<PaymentCategory>) => void;
  deletePaymentCategory: (id: string) => void;
  addPaymentRecord: (record: Omit<PaymentRecord, 'id'>) => void;
  updatePaymentRecord: (id: string, updatedData: Partial<PaymentRecord>) => void;
  updatePaymentMethod: (id: string, updatedData: Partial<PaymentMethodConfig>) => void;
  addNotification: (notification: Omit<SchoolNotification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  addMessage: (message: Omit<SchoolMessage, 'id'>) => void;
  addAdmin: (admin: Omit<Admin, 'id'>) => void;
  updateAdmin: (id: string, updatedData: Partial<Admin>) => void;
  removeAdmin: (id: string) => void;
  trackLoginActivity: (username: string, role: string, status: 'SUCCESS' | 'FAILED' | 'PASSWORD_RESET', details?: string) => void;
  updateSchoolName: (name: string) => void;
}

const SchoolContext = createContext<SchoolContextProps | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('role') as UserRole) || 'guest';
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('userId') || 'guest';
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignment[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [staffClassroomPermission, setStaffClassroomPermissionState] = useState<boolean>(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(() => {
    return [
      { id: 'card', name: 'Card Payments (Visa, Mastercard, Verve)', isEnabled: true, isDefault: true, restrictedCountries: [], type: 'primary', apiKey: 'pk_sandbox_5588771122aabb', apiSecret: 'sk_sandbox_112233aa' },
      { id: 'paypal', name: 'PayPal Checkout', isEnabled: true, isDefault: false, restrictedCountries: [], type: 'primary', apiKey: 'client_id_paypal_sandbox_882200' },
      { id: 'googlepay', name: 'Google Pay', isEnabled: true, isDefault: false, restrictedCountries: [], type: 'primary', apiKey: 'gpay_merchant_id_9922' },
      { id: 'applepay', name: 'Apple Pay', isEnabled: true, isDefault: false, restrictedCountries: [], type: 'primary', apiKey: 'apple_merchant_id_77bb' },
      { id: 'alipay_cn', name: 'AliPay+ CN', isEnabled: true, isDefault: false, restrictedCountries: ['China', 'Hong Kong'], type: 'additional' },
      { id: 'alipay_hk', name: 'AliPay+ HK', isEnabled: true, isDefault: false, restrictedCountries: ['Hong Kong'], type: 'additional' },
      { id: 'coingate', name: 'Coingate', isEnabled: true, isDefault: false, restrictedCountries: [], type: 'additional', apiKey: 'cg_sandbox_333222111' },
      { id: 'opay', name: 'Opay (Pay with OPay App)', isEnabled: true, isDefault: false, restrictedCountries: ['Nigeria'], type: 'additional', apiKey: 'opay_priv_889922' }
    ];
  });

  const [notifications, setNotifications] = useState<SchoolNotification[]>([]);
  const [messages, setMessages] = useState<SchoolMessage[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [rolesConfig] = useState<RoleConfig[]>(() => [
    { id: 'r1', role: 'super_admin', name: 'Super Admin', description: 'Complete system oversight, admin creation, secure records deletion, backups, full academic & payment ledger tables.', permissions: ['full_access', 'user_management'] },
    { id: 'r2', role: 'admin', name: 'Administrator', description: 'System-wide scheduling and operations, edit calendars, register classes, handle bursa approvals & invoices, deactivate users.', permissions: ['user_management', 'finances', 'grades', 'cbt'] },
    { id: 'r3', role: 'teacher', name: 'Faculty Member', description: 'Enter test and assignment marks, upload attendance lists, direct digital quiz classrooms and syllabus.', permissions: ['attendance', 'grades', 'cbt'] },
    { id: 'r4', role: 'parent', name: 'Parent Representative', description: 'Inspect academic marks, download receipts, review notifications and invoices for linked children.', permissions: ['read_only_records'] },
    { id: 'r5', role: 'student', name: 'Enrolled Student', description: 'Review progress charts, undertake CBT tests, download syllabus records, view school calender.', permissions: ['undertake_cbt'] },
  ]);

  const [loginSessions, setLoginSessions] = useState<LoginActivity[]>([]);
  const [schoolName, setSchoolName] = useState<string>('New Unique Academy');

  // Load from Firestore and seed if empty
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, 'users'));
        
        if (userSnapshot.empty) {
          console.log('Database is clean. Initiating seeding process...');

          const superAdminId = 'admin';
          const superAdminUser: Admin = {
            id: superAdminId,
            name: "Super Admin",
            username: "superadmin",
            email: "admin@academy.org",
            phone: "+234 812 345 6789",
            password: encryptPassword("admin123"),
            role: 'super_admin',
            permissions: ["full_access", "user_management"],
            isActiveAccount: true,
            schoolName: "NEW UNIQUE ACADEMY"
          };
          await setDoc(doc(db, 'users', superAdminId), superAdminUser);

          for (const s of initialStudents) {
            const pass = s.password || 'student123';
            const cleanStu: Student = {
              ...s,
              password: pass,
              joinedDate: s.joinedDate || new Date().toISOString().split('T')[0],
              admissionNumber: s.admissionNumber || `NUA-26-${Math.floor(1000 + Math.random() * 9000)}`,
              username: s.username || `NUA/2026/${String(s.id).replace(/\D/g, '').slice(0, 3).padStart(3, '0')}`,
              isActiveAccount: s.isActiveAccount !== undefined ? s.isActiveAccount : true,
              forcePasswordChange: s.forcePasswordChange !== undefined ? s.forcePasswordChange : false
            };
            await setDoc(doc(db, 'students', s.id), cleanStu);
            await setDoc(doc(db, 'users', s.id), {
              id: s.id,
              name: s.name,
              email: s.email,
              username: cleanStu.username,
              password: encryptPassword(pass),
              role: 'student',
              isActiveAccount: true
            });
          }

          for (const t of initialTeachers) {
            const pass = t.password || 'teacher123';
            const cleanTch = {
              ...t,
              password: pass,
              joinedDate: t.joinedDate || new Date().toISOString().split('T')[0]
            };
            await setDoc(doc(db, 'teachers', t.id), cleanTch);
            await setDoc(doc(db, 'users', t.id), {
              id: t.id,
              name: t.name,
              email: t.email,
              username: t.username || `edu_${t.id}`,
              password: encryptPassword(pass),
              role: 'teacher',
              isActiveAccount: true
            });
          }

          for (const p of initialParents) {
            const pass = p.password || 'parent123';
            const cleanPar = {
              ...p,
              password: pass
            };
            await setDoc(doc(db, 'parents', p.id), cleanPar);
            await setDoc(doc(db, 'users', p.id), {
              id: p.id,
              name: p.name,
              email: p.email,
              username: p.username || `parent-${p.id}`,
              password: encryptPassword(pass),
              role: 'parent',
              isActiveAccount: true
            });
          }

          for (const c of initialCourses) {
            await setDoc(doc(db, 'courses', c.id), c);
          }

          for (const s of initialSubjects) {
            await setDoc(doc(db, 'school_subjects', s.id), s);
          }

          for (const ta of initialTeacherAssignments) {
            await setDoc(doc(db, 'school_teacher_assignments', ta.id), ta);
          }

          for (const g of initialGrades) {
            await setDoc(doc(db, 'grades', g.id), g);
          }

          for (const a of initialAttendance) {
            await setDoc(doc(db, 'attendance', a.id), a);
          }

          for (const q of initialQuizzes) {
            await setDoc(doc(db, 'quizzes', q.id), q);
          }

          for (const sub of initialSubmissions) {
            await setDoc(doc(db, 'submissions', sub.id), sub);
          }

          for (const e of initialEvents) {
            await setDoc(doc(db, 'events', e.id), e);
          }

          for (const pc of initialPaymentCategories) {
            await setDoc(doc(db, 'payment_categories', pc.id), pc);
          }

          for (const pr of initialPaymentRecords) {
            await setDoc(doc(db, 'payment_records', pr.id), pr);
          }

          for (const n of initialNotifications) {
            await setDoc(doc(db, 'school_notifications', n.id), n);
          }

          for (const m of initialMessages) {
            await setDoc(doc(db, 'school_messages', m.id), m);
          }

          await setDoc(doc(db, 'schoolConfig', 'main'), {
            schoolName: 'NEW UNIQUE ACADEMY',
            sessions: ["2025/2026 Academic Session", "2026/2027 Academic Session"],
            terms: ["1st Term 2026", "Spring 2026", "Fall 2026"],
            staffClassroomPermission: false
          });

          console.log('Cloud database pre-seeded successfully.');
        }

        const userDocs = await getDocs(collection(db, 'users'));
        const studentsDocs = await getDocs(collection(db, 'students'));
        const teachersDocs = await getDocs(collection(db, 'teachers'));
        const parentsDocs = await getDocs(collection(db, 'parents'));
        const coursesDocs = await getDocs(collection(db, 'courses'));
        const subjectsDocs = await getDocs(collection(db, 'school_subjects'));
        const teacherAssignmentsDocs = await getDocs(collection(db, 'school_teacher_assignments'));
        const gradesDocs = await getDocs(collection(db, 'grades'));
        const attendanceDocs = await getDocs(collection(db, 'attendance'));
        const quizzesDocs = await getDocs(collection(db, 'quizzes'));
        const submissionsDocs = await getDocs(collection(db, 'submissions'));
        const eventsDocs = await getDocs(collection(db, 'events'));
        const categoriesDocs = await getDocs(collection(db, 'payment_categories'));
        const paymentRecordsDocs = await getDocs(collection(db, 'payment_records'));
        const notificationsDocs = await getDocs(collection(db, 'school_notifications'));
        const messagesDocs = await getDocs(collection(db, 'school_messages'));
        const loginSessionsDocs = await getDocs(collection(db, 'login_sessions'));
        
        let configData: any = {
          schoolName: 'NEW UNIQUE ACADEMY',
          sessions: ["2025/2026 Academic Session", "2026/2027 Academic Session"],
          terms: ["1st Term 2026", "Spring 2026", "Fall 2026"],
          staffClassroomPermission: false
        };
        const configDocs = await getDocs(collection(db, 'schoolConfig'));
        configDocs.forEach((d) => {
          if (d.id === 'main') configData = d.data();
        });

        const usersList: any[] = [];
        userDocs.forEach(d => usersList.push(d.data()));

        const studentList: any[] = [];
        studentsDocs.forEach(d => studentList.push(d.data()));

        const teacherList: any[] = [];
        teachersDocs.forEach(d => teacherList.push(d.data()));

        const parentList: any[] = [];
        parentsDocs.forEach(d => parentList.push(d.data()));

        const courseList: any[] = [];
        coursesDocs.forEach(d => courseList.push(d.data()));

        const subjectList: any[] = [];
        subjectsDocs.forEach(d => subjectList.push(d.data()));

        const taList: any[] = [];
        teacherAssignmentsDocs.forEach(d => taList.push(d.data()));

        const gradeList: any[] = [];
        gradesDocs.forEach(d => gradeList.push(d.data()));

        const attendanceList: any[] = [];
        attendanceDocs.forEach(d => attendanceList.push(d.data()));

        const quizList: any[] = [];
        quizzesDocs.forEach(d => quizList.push(d.data()));

        const submissionList: any[] = [];
        submissionsDocs.forEach(d => submissionList.push(d.data()));

        const eventList: any[] = [];
        eventsDocs.forEach(d => eventList.push(d.data()));

        const payCatList: any[] = [];
        categoriesDocs.forEach(d => payCatList.push(d.data()));

        const payRecList: any[] = [];
        paymentRecordsDocs.forEach(d => payRecList.push(d.data()));

        const notifList: any[] = [];
        notificationsDocs.forEach(d => notifList.push(d.data()));

        const msgList: any[] = [];
        messagesDocs.forEach(d => msgList.push(d.data()));

        const loginSessList: any[] = [];
        loginSessionsDocs.forEach(d => loginSessList.push(d.data()));

        setAdmins(usersList.filter(u => u.role === 'admin' || u.role === 'super_admin'));
        setStudents(studentList);
        setTeachers(teacherList);
        setParents(parentList);
        setCourses(courseList);
        setSubjects(subjectList);
        setTeacherAssignments(taList);
        setGrades(gradeList);
        setAttendance(attendanceList);
        setQuizzes(quizList);
        setSubmissions(submissionList);
        setEvents(eventList);
        setPaymentCategories(payCatList);
        setPaymentRecords(payRecList);
        setNotifications(notifList);
        setMessages(msgList);
        setLoginSessions(loginSessList);

        setSchoolName(configData.schoolName || 'NEW UNIQUE ACADEMY');
        setSessions(configData.sessions || []);
        setTerms(configData.terms || []);
        setStaffClassroomPermissionState(!!configData.staffClassroomPermission);

        setLoading(false);
      } catch (err) {
        console.error("Failed loading databases:", err);
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  // Sync active authentication token to client cache
  useEffect(() => {
    localStorage.setItem('role', currentRole);
    localStorage.setItem('userId', currentUserId);
  }, [currentRole, currentUserId]);

  const setRole = (role: UserRole, userId?: string) => {
    setCurrentRole(role);
    if (userId) {
      setCurrentUserId(userId);
    } else {
      if (role === 'admin') setCurrentUserId('admin');
      else if (role === 'guest') setCurrentUserId('guest');
      else if (role === 'teacher') setCurrentUserId(teachers[0]?.id || 't_01');
      else if (role === 'student' || role === 'parent') setCurrentUserId(students[0]?.id || 's_01');
    }
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'joinedDate'>) => {
    const nextIdx = students.length + 1;
    const newStudentId = `s_${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id: newStudentId,
      joinedDate: new Date().toISOString().split('T')[0],
      admissionNumber: studentData.admissionNumber || `NUA-26-${Math.floor(1000 + Math.random() * 9000)}`,
      username: studentData.username || `NUA/2026/${String(nextIdx).padStart(3, '0')}`,
      password: studentData.password || 'student123',
      isActiveAccount: studentData.isActiveAccount !== undefined ? studentData.isActiveAccount : true,
      forcePasswordChange: studentData.forcePasswordChange !== undefined ? studentData.forcePasswordChange : false,
      gender: studentData.gender || 'Male',
      dateOfBirth: studentData.dateOfBirth || '2009-01-01',
      nationality: studentData.nationality || 'Nigeria',
      state: studentData.state || 'Lagos',
      lga: studentData.lga || 'Ikeja',
      religion: studentData.religion || 'Christianity',
      bloodGroup: studentData.bloodGroup || 'O+',
      medicalNotes: studentData.medicalNotes || 'None',
      homeAddress: studentData.homeAddress || '101 Academic Way, Lagos',
      guardianEmail: studentData.guardianEmail || '',
      studentPhone: studentData.studentPhone || studentData.guardianPhone || '+234 801 000 0000',
      emergencyContactName: studentData.emergencyContactName || studentData.guardianName || '',
      emergencyContactPhone: studentData.emergencyContactPhone || studentData.guardianPhone || '',
      tuitionTotal: studentData.tuitionTotal || 4500,
      tuitionPaid: studentData.tuitionPaid || 0,
      paymentMethod: studentData.paymentMethod || 'None',
      paymentDate: studentData.paymentDate || '',
      paymentReceiptId: studentData.paymentReceiptId || ''
    };

    setDoc(doc(db, 'students', newStudentId), newStudent).catch(e => handleFirestoreError(e, OperationType.CREATE, `students/${newStudentId}`));
    setDoc(doc(db, 'users', newStudentId), {
      id: newStudentId,
      name: newStudent.name,
      email: newStudent.email,
      username: newStudent.username,
      password: encryptPassword(newStudent.password || 'student123'),
      role: 'student',
      isActiveAccount: newStudent.isActiveAccount
    }).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${newStudentId}`));

    setStudents((prev) => [...prev, newStudent]);

    if (studentData.gradeLevel) {
      setCourses((prevCourses) =>
        prevCourses.map((c) => {
          if (c.id === studentData.gradeLevel || c.name === studentData.gradeLevel) {
            const currentList = c.studentIds || [];
            if (!currentList.includes(newStudentId)) {
              const updated = [...currentList, newStudentId];
              setDoc(doc(db, 'courses', c.id), { ...c, studentIds: updated }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `courses/${c.id}`));
              return { ...c, studentIds: updated };
            }
          }
          return c;
        })
      );
    }
  };

  const updateStudent = (studentId: string, updatedData: Partial<Student>) => {
    setStudents((prev) => {
      const oldStu = prev.find(s => s.id === studentId);
      const updated = prev.map((s) => (s.id === studentId ? { ...s, ...updatedData } : s));
      const targetStu = updated.find(s => s.id === studentId);

      if (targetStu) {
        setDoc(doc(db, 'students', studentId), targetStu).catch(e => handleFirestoreError(e, OperationType.UPDATE, `students/${studentId}`));
        setDoc(doc(db, 'users', studentId), {
          id: studentId,
          name: targetStu.name,
          email: targetStu.email,
          username: targetStu.username,
          password: encryptPassword(targetStu.password || 'student123'),
          role: 'student',
          isActiveAccount: targetStu.isActiveAccount
        }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `users/${studentId}`));
      }

      if (updatedData.gradeLevel && oldStu && oldStu.gradeLevel !== updatedData.gradeLevel) {
        setCourses((prevCourses) =>
          prevCourses.map((c) => {
            let sids = c.studentIds || [];
            let changed = false;
            if (c.id === oldStu.gradeLevel || c.name === oldStu.gradeLevel) {
              sids = sids.filter(id => id !== studentId);
              changed = true;
            }
            if (c.id === updatedData.gradeLevel || c.name === updatedData.gradeLevel) {
              if (!sids.includes(studentId)) {
                sids = [...sids, studentId];
                changed = true;
              }
            }
            if (changed) {
              setDoc(doc(db, 'courses', c.id), { ...c, studentIds: sids }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `courses/${c.id}`));
            }
            return { ...c, studentIds: sids };
          })
        );
      }
      return updated;
    });
  };

  const payTuition = (studentId: string, amount: number, method: 'Card' | 'Bank Transfer') => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const currentTotalPaid = (s.tuitionPaid || 0) + amount;
          const updatedStu: Student = {
            ...s,
            tuitionPaid: Math.min(s.tuitionTotal || 4500, currentTotalPaid),
            paymentMethod: method,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentReceiptId: `REC-${Math.floor(100000 + Math.random() * 900000)}`
          };
          setDoc(doc(db, 'students', studentId), updatedStu).catch(e => handleFirestoreError(e, OperationType.UPDATE, `students/${studentId}`));
          return updatedStu;
        }
        return s;
      })
    );
  };

  const removeStudent = (id: string) => {
    deleteDoc(doc(db, 'students', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `students/${id}`));
    deleteDoc(doc(db, 'users', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `users/${id}`));
    
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setGrades((prev) => {
      const remainingGrades = prev.filter((g) => g.studentId !== id);
      prev.filter((g) => g.studentId === id).forEach(g => {
        deleteDoc(doc(db, 'grades', g.id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `grades/${g.id}`));
      });
      return remainingGrades;
    });
    setSubmissions((prev) => {
      const remainingSubs = prev.filter((sub) => sub.studentId !== id);
      prev.filter((sub) => sub.studentId === id).forEach(sub => {
        deleteDoc(doc(db, 'submissions', sub.id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `submissions/${sub.id}`));
      });
      return remainingSubs;
    });
    setAttendance((prev) => {
      const remainingAtt = prev.filter((att) => att.studentId !== id);
      prev.filter((att) => att.studentId === id).forEach(att => {
        deleteDoc(doc(db, 'attendance', att.id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `attendance/${att.id}`));
      });
      return remainingAtt;
    });

    setCourses((prev) =>
      prev.map((c) => {
        const sids = c.studentIds ? c.studentIds.filter((sid) => sid !== id) : [];
        setDoc(doc(db, 'courses', c.id), { ...c, studentIds: sids }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `courses/${c.id}`));
        return { ...c, studentIds: sids };
      })
    );
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'joinedDate'>) => {
    const nextIdx = teachers.length + 1;
    const parts = teacherData.name.split(' ');
    const lastName = parts[parts.length - 1]?.toLowerCase() || 'faculty';
    const teacherId = `t_${Date.now()}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id: teacherId,
      joinedDate: new Date().toISOString().split('T')[0],
      username: teacherData.username || `edu_${lastName}${nextIdx}`,
      password: teacherData.password || 'teacher123',
      isActiveAccount: teacherData.isActiveAccount !== undefined ? teacherData.isActiveAccount : true,
      forcePasswordChange: teacherData.forcePasswordChange !== undefined ? teacherData.forcePasswordChange : false,
      subjects: teacherData.subjects || [teacherData.department],
      classrooms: teacherData.classrooms || []
    };

    setDoc(doc(db, 'teachers', teacherId), newTeacher).catch(e => handleFirestoreError(e, OperationType.CREATE, `teachers/${teacherId}`));
    setDoc(doc(db, 'users', teacherId), {
      id: teacherId,
      name: newTeacher.name,
      email: newTeacher.email,
      username: newTeacher.username,
      password: encryptPassword(newTeacher.password || 'teacher123'),
      role: 'teacher',
      isActiveAccount: newTeacher.isActiveAccount
    }).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${teacherId}`));

    setTeachers((prev) => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, updatedData: Partial<Teacher>) => {
    setTeachers((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t));
      const targetTch = updated.find(t => t.id === id);
      if (targetTch) {
        setDoc(doc(db, 'teachers', id), targetTch).catch(e => handleFirestoreError(e, OperationType.UPDATE, `teachers/${id}`));
        setDoc(doc(db, 'users', id), {
          id,
          name: targetTch.name,
          email: targetTch.email,
          username: targetTch.username,
          password: encryptPassword(targetTch.password || 'teacher123'),
          role: 'teacher',
          isActiveAccount: targetTch.isActiveAccount
        }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `users/${id}`));
      }
      return updated;
    });
  };

  const removeTeacher = (id: string) => {
    deleteDoc(doc(db, 'teachers', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `teachers/${id}`));
    deleteDoc(doc(db, 'users', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `users/${id}`));

    setTeachers((prev) => prev.filter((t) => t.id !== id));
    setCourses((prev) =>
      prev.map((c) => {
        if (c.teacherId === id) {
          setDoc(doc(db, 'courses', c.id), { ...c, teacherId: '' }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `courses/${c.id}`));
          return { ...c, teacherId: '' };
        }
        return c;
      })
    );
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const cid = `c_${Date.now()}`;
    const newCourse: Course = {
      ...courseData,
      id: cid,
      capacity: courseData.capacity || 30,
      studentIds: courseData.studentIds || []
    };
    setDoc(doc(db, 'courses', cid), newCourse).catch(e => handleFirestoreError(e, OperationType.CREATE, `courses/${cid}`));
    setCourses((prev) => [...prev, newCourse]);
  };

  const updateCourse = (id: string, updatedData: Partial<Course>) => {
    setCourses((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
      const targetCourse = updated.find(c => c.id === id);
      if (targetCourse) {
        setDoc(doc(db, 'courses', id), targetCourse).catch(e => handleFirestoreError(e, OperationType.UPDATE, `courses/${id}`));
      }
      return updated;
    });
  };

  const deleteCourse = (id: string) => {
    deleteDoc(doc(db, 'courses', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `courses/${id}`));

    setCourses((prev) => prev.filter((c) => c.id !== id));
    setGrades((prev) => {
      const rem = prev.filter((g) => g.courseId !== id);
      prev.filter(g => g.courseId === id).forEach(g => {
        deleteDoc(doc(db, 'grades', g.id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `grades/${g.id}`));
      });
      return rem;
    });
    setAttendance((prev) => {
      const rem = prev.filter((a) => a.courseId !== id);
      prev.filter(a => a.courseId === id).forEach(a => {
        deleteDoc(doc(db, 'attendance', a.id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `attendance/${a.id}`));
      });
      return rem;
    });
    setQuizzes((prev) => {
      const rem = prev.filter((q) => q.courseId !== id);
      prev.filter(q => q.courseId === id).forEach(q => {
        deleteDoc(doc(db, 'quizzes', q.id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `quizzes/${q.id}`));
      });
      return rem;
    });
  };

  const addGrade = (gradeData: Omit<GradeRecord, 'id'>) => {
    const gid = `g_${Date.now()}`;
    const newGrade: GradeRecord = {
      ...gradeData,
      id: gid
    };
    setDoc(doc(db, 'grades', gid), newGrade).catch(e => handleFirestoreError(e, OperationType.CREATE, `grades/${gid}`));
    setGrades((prev) => [...prev, newGrade]);
  };

  const updateGrade = (id: string, score: number) => {
    setGrades((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, score } : g));
      const targetGrade = updated.find(g => g.id === id);
      if (targetGrade) {
        setDoc(doc(db, 'grades', id), targetGrade).catch(e => handleFirestoreError(e, OperationType.UPDATE, `grades/${id}`));
      }
      return updated;
    });
  };

  const deleteGrade = (id: string) => {
    deleteDoc(doc(db, 'grades', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `grades/${id}`));
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const submitAttendance = (
    courseId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; notes: string }[]
  ) => {
    setAttendance((prev) => {
      const filtered = prev.filter((r) => !(r.courseId === courseId && r.date === date));
      prev.filter((r) => (r.courseId === courseId && r.date === date)).forEach(r => {
        deleteDoc(doc(db, 'attendance', r.id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `attendance/${r.id}`));
      });
      
      const fresh: AttendanceRecord[] = records.map((rec) => {
        const aid = `att_${Date.now()}_${rec.studentId}`;
        const newRecord: AttendanceRecord = {
          id: aid,
          studentId: rec.studentId,
          courseId,
          date,
          status: rec.status,
          notes: rec.notes || undefined
        };
        setDoc(doc(db, 'attendance', aid), newRecord).catch(e => handleFirestoreError(e, OperationType.CREATE, `attendance/${aid}`));
        return newRecord;
      });
      return [...filtered, ...fresh];
    });
  };

  const addQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const qid = `q_${Date.now()}`;
    const newQuiz: Quiz = {
      ...quizData,
      id: qid
    };
    setDoc(doc(db, 'quizzes', qid), newQuiz).catch(e => handleFirestoreError(e, OperationType.CREATE, `quizzes/${qid}`));
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const updateQuiz = (id: string, updatedData: Partial<Quiz>) => {
    setQuizzes((prev) => {
      const updated = prev.map((q) => (q.id === id ? { ...q, ...updatedData } : q));
      const targetQuiz = updated.find(q => q.id === id);
      if (targetQuiz) {
        setDoc(doc(db, 'quizzes', id), targetQuiz).catch(e => handleFirestoreError(e, OperationType.UPDATE, `quizzes/${id}`));
      }
      return updated;
    });
  };

  const deleteQuiz = (id: string) => {
    deleteDoc(doc(db, 'quizzes', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `quizzes/${id}`));
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const toggleQuizActive = (id: string) => {
    setQuizzes((prev) => {
      const updated = prev.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q));
      const targetQuiz = updated.find(q => q.id === id);
      if (targetQuiz) {
        setDoc(doc(db, 'quizzes', id), targetQuiz).catch(e => handleFirestoreError(e, OperationType.UPDATE, `quizzes/${id}`));
      }
      return updated;
    });
  };

  const addQuizSubmission = (submissionData: Omit<QuizSubmission, 'id'>) => {
    const subid = `sub_${Date.now()}`;
    const newSubmission: QuizSubmission = {
      ...submissionData,
      id: subid
    };
    setDoc(doc(db, 'submissions', subid), newSubmission).catch(e => handleFirestoreError(e, OperationType.CREATE, `submissions/${subid}`));
    setSubmissions((prev) => [...prev, newSubmission]);

    const quizObj = quizzes.find(q => q.id === submissionData.quizId);
    if (quizObj) {
      addGrade({
        studentId: submissionData.studentId,
        courseId: quizObj.courseId,
        title: `Quiz: ${quizObj.title}`,
        score: submissionData.score,
        maxScore: submissionData.maxScore,
        date: new Date().toISOString().split('T')[0],
        category: 'quiz',
        term: 'Spring 2026'
      });
    }
  };

  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const eid = `e_${Date.now()}`;
    const newEvent: CalendarEvent = {
      ...eventData,
      id: eid
    };
    setDoc(doc(db, 'events', eid), newEvent).catch(e => handleFirestoreError(e, OperationType.CREATE, `events/${eid}`));
    setEvents((prev) => [...prev, newEvent]);
  };

  const deleteEvent = (id: string) => {
    deleteDoc(doc(db, 'events', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `events/${id}`));
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const saveConfigDoc = (updatedFields: Record<string, any>) => {
    const freshConfig = {
      schoolName,
      sessions,
      terms,
      staffClassroomPermission,
      ...updatedFields
    };
    setDoc(doc(db, 'schoolConfig', 'main'), freshConfig).catch(e => handleFirestoreError(e, OperationType.UPDATE, `schoolConfig/main`));
  };

  const addAcademicSession = (session: string) => {
    if (!sessions.includes(session)) {
      const nextSessions = [...sessions, session];
      setSessions(nextSessions);
      saveConfigDoc({ sessions: nextSessions });
    }
  };

  const deleteAcademicSession = (session: string) => {
    const nextSessions = sessions.filter((s) => s !== session);
    setSessions(nextSessions);
    saveConfigDoc({ sessions: nextSessions });
  };

  const addTerm = (term: string) => {
    if (!terms.includes(term)) {
      const nextTerms = [...terms, term];
      setTerms(nextTerms);
      saveConfigDoc({ terms: nextTerms });
    }
  };

  const deleteTerm = (term: string) => {
    const nextTerms = terms.filter((t) => t !== term);
    setTerms(nextTerms);
    saveConfigDoc({ terms: nextTerms });
  };

  const setStaffClassroomPermission = (allowed: boolean) => {
    setStaffClassroomPermission(allowed);
    saveConfigDoc({ staffClassroomPermission: allowed });
  };

  const addParent = (parentData: Omit<Parent, 'id'>) => {
    const parentId = `p_${Date.now()}`;
    const newParent: Parent = {
      ...parentData,
      id: parentId,
      isActiveAccount: parentData.isActiveAccount !== undefined ? parentData.isActiveAccount : true
    };
    setDoc(doc(db, 'parents', parentId), newParent).catch(e => handleFirestoreError(e, OperationType.CREATE, `parents/${parentId}`));
    setDoc(doc(db, 'users', parentId), {
      id: parentId,
      name: newParent.name,
      email: newParent.email,
      username: newParent.username || `parent-${newParent.id}`,
      password: encryptPassword(newParent.password || 'parent123'),
      role: 'parent',
      isActiveAccount: newParent.isActiveAccount
    }).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${parentId}`));

    setParents((prev) => [...prev, newParent]);
  };

  const updateParent = (parentId: string, updatedData: Partial<Parent>) => {
    setParents((prev) => {
      const updated = prev.map((p) => (p.id === parentId ? { ...p, ...updatedData } : p));
      const targetPar = updated.find(p => p.id === parentId);
      if (targetPar) {
        setDoc(doc(db, 'parents', parentId), targetPar).catch(e => handleFirestoreError(e, OperationType.UPDATE, `parents/${parentId}`));
        setDoc(doc(db, 'users', parentId), {
          id: parentId,
          name: targetPar.name,
          email: targetPar.email,
          username: targetPar.username,
          password: encryptPassword(targetPar.password || 'parent123'),
          role: 'parent',
          isActiveAccount: targetPar.isActiveAccount
        }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `users/${parentId}`));
      }
      return updated;
    });
  };

  const removeParent = (id: string) => {
    deleteDoc(doc(db, 'parents', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `parents/${id}`));
    deleteDoc(doc(db, 'users', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `users/${id}`));
    setParents((prev) => prev.filter((p) => p.id !== id));
  };

  const addPaymentCategory = (categoryData: Omit<PaymentCategory, 'id'>) => {
    const pcid = `pc_${Date.now()}`;
    const newCategory: PaymentCategory = {
      ...categoryData,
      id: pcid
    };
    setDoc(doc(db, 'payment_categories', pcid), newCategory).catch(e => handleFirestoreError(e, OperationType.CREATE, `payment_categories/${pcid}`));
    setPaymentCategories((prev) => [...prev, newCategory]);
  };

  const updatePaymentCategory = (id: string, updatedData: Partial<PaymentCategory>) => {
    setPaymentCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
      const targetCat = updated.find(c => c.id === id);
      if (targetCat) {
        setDoc(doc(db, 'payment_categories', id), targetCat).catch(e => handleFirestoreError(e, OperationType.UPDATE, `payment_categories/${id}`));
      }
      return updated;
    });
  };

  const deletePaymentCategory = (id: string) => {
    deleteDoc(doc(db, 'payment_categories', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `payment_categories/${id}`));
    setPaymentCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addPaymentRecord = (recordData: Omit<PaymentRecord, 'id'>) => {
    const prid = `pr_${Date.now()}`;
    const newRecord: PaymentRecord = {
      ...recordData,
      id: prid
    };
    setDoc(doc(db, 'payment_records', prid), newRecord).catch(e => handleFirestoreError(e, OperationType.CREATE, `payment_records/${prid}`));
    setPaymentRecords((prev) => [...prev, newRecord]);

    if (newRecord.status !== 'Pending Verification' && newRecord.status !== 'Rejected') {
      if (recordData.categoryId === 'pc_tuition' || recordData.categoryName === 'Tuition Fee' || recordData.categoryId === 'pc_1') {
        payTuition(recordData.studentId, recordData.amountPaid, recordData.method);
      }
    }
  };

  const updatePaymentRecord = (id: string, updatedData: Partial<PaymentRecord>) => {
    setPaymentRecords((prev) =>
      prev.map((pr) => {
        if (pr.id === id) {
          const updatedRecord = { ...pr, ...updatedData };
          setDoc(doc(db, 'payment_records', id), updatedRecord).catch(e => handleFirestoreError(e, OperationType.UPDATE, `payment_records/${id}`));
          
          if (updatedData.status === 'Approved' && pr.status !== 'Approved') {
            if (pr.categoryId === 'pc_tuition' || pr.categoryName === 'Tuition Fee' || pr.categoryId === 'pc_1') {
              payTuition(pr.studentId, pr.amountPaid, pr.method);
            }
          }
          return updatedRecord;
        }
        return pr;
      })
    );
  };

  const updatePaymentMethod = (id: string, updatedData: Partial<PaymentMethodConfig>) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => {
        if (pm.id === id) {
          return { ...pm, ...updatedData };
        } else {
          if (updatedData.isDefault) {
            return { ...pm, isDefault: false };
          }
          return pm;
        }
      })
    );
  };

  const addNotification = (notifData: Omit<SchoolNotification, 'id'>) => {
    const nid = `n_${Date.now()}`;
    const newNotif: SchoolNotification = {
      ...notifData,
      id: nid,
      isRead: false
    };
    setDoc(doc(db, 'school_notifications', nid), newNotif).catch(e => handleFirestoreError(e, OperationType.CREATE, `school_notifications/${nid}`));
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      const targetNo = updated.find(n => n.id === id);
      if (targetNo) {
        setDoc(doc(db, 'school_notifications', id), targetNo).catch(e => handleFirestoreError(e, OperationType.UPDATE, `school_notifications/${id}`));
      }
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications((prev) => {
      prev.forEach(n => {
        deleteDoc(doc(db, 'school_notifications', n.id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `school_notifications/${n.id}`));
      });
      return [];
    });
  };

  const addMessage = (messageData: Omit<SchoolMessage, 'id'>) => {
    const mid = `m_${Date.now()}`;
    const newMsg: SchoolMessage = {
      ...messageData,
      id: mid
    };
    setDoc(doc(db, 'school_messages', mid), newMsg).catch(e => handleFirestoreError(e, OperationType.CREATE, `school_messages/${mid}`));
    setMessages((prev) => [...prev, newMsg]);
  };

  const addAdmin = (adminData: Omit<Admin, 'id'>) => {
    const adminId = `admin_${Date.now()}`;
    const newAdmin: Admin = {
      ...adminData,
      id: adminId
    };
    setDoc(doc(db, 'users', adminId), {
      id: adminId,
      name: newAdmin.name,
      email: newAdmin.email,
      username: newAdmin.username,
      password: encryptPassword(newAdmin.password || 'admin123'),
      role: 'admin',
      permissions: newAdmin.permissions || ['user_management'],
      isActiveAccount: true,
      schoolName: 'NEW UNIQUE ACADEMY'
    }).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${adminId}`));

    setAdmins(prev => [...prev, newAdmin]);
  };

  const updateAdmin = (id: string, updatedData: Partial<Admin>) => {
    setAdmins(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...updatedData } : a);
      const targetAdmin = updated.find(a => a.id === id);
      if (targetAdmin) {
        setDoc(doc(db, 'users', id), {
          id,
          name: targetAdmin.name,
          email: targetAdmin.email,
          username: targetAdmin.username,
          password: encryptPassword(targetAdmin.password || 'admin123'),
          role: targetAdmin.role || 'admin',
          permissions: targetAdmin.permissions || ['user_management'],
          isActiveAccount: targetAdmin.isActiveAccount !== undefined ? targetAdmin.isActiveAccount : true,
          schoolName: 'NEW UNIQUE ACADEMY'
        }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `users/${id}`));
      }
      return updated;
    });
  };

  const removeAdmin = (id: string) => {
    deleteDoc(doc(db, 'users', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `users/${id}`));
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  const trackLoginActivity = (username: string, role: string, status: 'SUCCESS' | 'FAILED' | 'PASSWORD_RESET', details?: string) => {
    const ips = ['192.168.1.112', '102.89.22.41', '197.210.64.9', '41.190.2.14', '127.0.0.1'];
    const browsers = [
      'Chrome v124.0 (Windows NT 10.0)',
      'Safari v17.4 (Macintosh OS X)',
      'Firefox v125.0 (Ubuntu Linux)',
      'Chrome Mobile (iOS)'
    ];
    const logId = `act_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
    const newActivity: LoginActivity = {
      id: logId,
      userId: username || 'anonymous',
      username: username || 'Anonymous User',
      role: role || 'guest',
      timestamp: new Date().toISOString(),
      ip: ips[Math.floor(Math.random() * ips.length)] || '127.0.0.1',
      browser: browsers[Math.floor(Math.random() * browsers.length)] || 'Chrome v124.0',
      status,
      details
    };
    
    setDoc(doc(db, 'login_sessions', logId), newActivity).catch(e => handleFirestoreError(e, OperationType.CREATE, `login_sessions/${logId}`));
    setLoginSessions(prev => [newActivity, ...prev].slice(0, 100));
  };

  const updateSchoolName = (name: string) => {
    setSchoolName(name);
    saveConfigDoc({ schoolName: name });
  };

  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const sid = `sub_${Date.now()}`;
    const newSubject: Subject = {
      ...subjectData,
      id: sid
    };
    setDoc(doc(db, 'school_subjects', sid), newSubject).catch(e => handleFirestoreError(e, OperationType.CREATE, `school_subjects/${sid}`));
    setSubjects((prev) => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updatedData: Partial<Subject>) => {
    setSubjects((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
      const targetSub = updated.find(s => s.id === id);
      if (targetSub) {
        setDoc(doc(db, 'school_subjects', id), targetSub).catch(e => handleFirestoreError(e, OperationType.UPDATE, `school_subjects/${id}`));
      }
      return updated;
    });
  };

  const deleteSubject = (id: string) => {
    deleteDoc(doc(db, 'school_subjects', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `school_subjects/${id}`));
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    
    setCourses((prev) =>
      prev.map((c) => {
        const sids = c.subjectIds ? c.subjectIds.filter((sid) => sid !== id) : [];
        setDoc(doc(db, 'courses', c.id), { ...c, subjectIds: sids }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `courses/${c.id}`));
        return { ...c, subjectIds: sids };
      })
    );

    setTeacherAssignments((prev) => {
      const rem = prev.filter((ta) => ta.subjectId !== id);
      prev.filter(ta => ta.subjectId === id).forEach(ta => {
        deleteDoc(doc(db, 'school_teacher_assignments', ta.id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `school_teacher_assignments/${ta.id}`));
      });
      return rem;
    });
  };

  const addTeacherAssignment = (assignmentData: Omit<TeacherAssignment, 'id'>) => {
    const taid = `ta_${Date.now()}`;
    const newAssignment: TeacherAssignment = {
      ...assignmentData,
      id: taid
    };
    setDoc(doc(db, 'school_teacher_assignments', taid), newAssignment).catch(e => handleFirestoreError(e, OperationType.CREATE, `school_teacher_assignments/${taid}`));
    setTeacherAssignments((prev) => [...prev, newAssignment]);
  };

  const removeTeacherAssignment = (id: string) => {
    deleteDoc(doc(db, 'school_teacher_assignments', id)).catch(e => handleFirestoreError(e, OperationType.DELETE, `school_teacher_assignments/${id}`));
    setTeacherAssignments((prev) => prev.filter((ta) => ta.id !== id));
  };

  const assignSubjectsToClass = (classroomId: string, selectedSubjectIds: string[]) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === classroomId) {
          const updated = { ...c, subjectIds: selectedSubjectIds };
          setDoc(doc(db, 'courses', classroomId), updated).catch(e => handleFirestoreError(e, OperationType.UPDATE, `courses/${classroomId}`));
          return updated;
        }
        return c;
      })
    );
  };

  return (
    <SchoolContext.Provider
      value={{
        loading,
        currentRole,
        currentUserId,
        students,
        teachers,
        courses,
        grades,
        attendance,
        quizzes,
        submissions,
        events,
        parents,
        paymentCategories,
        paymentRecords,
        paymentMethods,
        notifications,
        messages,
        sessions,
        terms,
        staffClassroomPermission,
        subjects,
        teacherAssignments,
        setRole,
        addStudent,
        updateStudent,
        removeStudent,
        payTuition,
        addTeacher,
        updateTeacher,
        removeTeacher,
        addCourse,
        updateCourse,
        deleteCourse,
        addGrade,
        updateGrade,
        deleteGrade,
        submitAttendance,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        toggleQuizActive,
        addQuizSubmission,
        addEvent,
        deleteEvent,
        addAcademicSession,
        deleteAcademicSession,
        addTerm,
        deleteTerm,
        setStaffClassroomPermission,
        addSubject,
        updateSubject,
        deleteSubject,
        addTeacherAssignment,
        removeTeacherAssignment,
        assignSubjectsToClass,
        addParent,
        updateParent,
        removeParent,
        addPaymentCategory,
        updatePaymentCategory,
        deletePaymentCategory,
        addPaymentRecord,
        updatePaymentRecord,
        updatePaymentMethod,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        addMessage,
        admins,
        rolesConfig,
        loginSessions,
        schoolName,
        addAdmin,
        updateAdmin,
        removeAdmin,
        trackLoginActivity,
        updateSchoolName
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
