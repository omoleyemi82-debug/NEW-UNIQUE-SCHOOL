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

interface SchoolContextProps {
  currentRole: UserRole;
  currentUserId: string; // e.g. "s_01" for Julian (student), "t_02" for Alan Turing (teacher), "admin" for admin
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

  // New Parent Account/Linking Actions
  addParent: (parent: Omit<Parent, 'id'>) => void;
  updateParent: (parentId: string, updatedData: Partial<Parent>) => void;
  removeParent: (id: string) => void;
  
  // Payment System Actions
  addPaymentCategory: (category: Omit<PaymentCategory, 'id'>) => void;
  updatePaymentCategory: (id: string, updatedData: Partial<PaymentCategory>) => void;
  deletePaymentCategory: (id: string) => void;
  addPaymentRecord: (record: Omit<PaymentRecord, 'id'>) => void;
  updatePaymentRecord: (id: string, updatedData: Partial<PaymentRecord>) => void;
  updatePaymentMethod: (id: string, updatedData: Partial<PaymentMethodConfig>) => void;
  
  // Notifications/Alerts Actions
  addNotification: (notification: Omit<SchoolNotification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Messages Actions
  addMessage: (message: Omit<SchoolMessage, 'id'>) => void;

  // Authentication & Security Additions
  admins: Admin[];
  rolesConfig: RoleConfig[];
  loginSessions: LoginActivity[];
  schoolName: string;
  addAdmin: (admin: Omit<Admin, 'id'>) => void;
  updateAdmin: (id: string, updatedData: Partial<Admin>) => void;
  removeAdmin: (id: string) => void;
  trackLoginActivity: (username: string, role: string, status: 'SUCCESS' | 'FAILED' | 'PASSWORD_RESET', details?: string) => void;
  updateSchoolName: (name: string) => void;
}

const SchoolContext = createContext<SchoolContextProps | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or use defaults
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('role') as UserRole) || 'guest';
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('userId') || 'guest';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    const parsed = saved ? JSON.parse(saved) : initialStudents;
    return parsed.map((s: Student, idx: number) => ({
      ...s,
      admissionNumber: s.admissionNumber || `NUA-26-004${idx + 1}`,
      username: s.username || `NUA/2026/${String(idx + 1).padStart(3, '0')}`,
      password: s.password || 'student123',
      gender: s.gender || (idx % 2 === 0 ? 'Male' : 'Female'),
      dateOfBirth: s.dateOfBirth || (idx % 2 === 0 ? '2008-04-12' : '2009-09-24'),
      nationality: s.nationality || 'Nigeria',
      state: s.state || 'Lagos',
      lga: s.lga || 'Ikeja',
      religion: s.religion || 'Christianity',
      bloodGroup: s.bloodGroup || 'O+',
      medicalNotes: s.medicalNotes || 'No known allergies, fully fit.',
      homeAddress: s.homeAddress || '742 Evergreen Terrace, Lagos',
      guardianEmail: s.guardianEmail || `${s.guardianName?.toLowerCase().replace(/\s/g, '.')}@mail.com`,
      studentPhone: s.studentPhone || `+1 (555) 304-${1000 + idx}`,
      emergencyContactName: s.emergencyContactName || s.guardianName,
      emergencyContactPhone: s.emergencyContactPhone || s.guardianPhone,
      tuitionTotal: s.tuitionTotal || 4500,
      tuitionPaid: s.tuitionPaid !== undefined ? s.tuitionPaid : (idx === 0 ? 4500 : (idx === 1 ? 0 : 1800)),
      paymentMethod: s.paymentMethod || (idx === 0 ? 'Card' : 'None'),
      paymentDate: s.paymentDate || (idx === 0 ? '2026-05-15' : ''),
      paymentReceiptId: s.paymentReceiptId || (idx === 0 ? 'REC-824042' : '')
    }));
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('teachers');
    const parsed = saved ? JSON.parse(saved) : initialTeachers;
    return parsed.map((t: Teacher, idx: number) => {
      const parts = t.name.split(' ');
      const lastName = parts[parts.length - 1]?.toLowerCase() || 'faculty';
      return {
        ...t,
        username: t.username || `edu_${lastName}${idx + 1}`,
        password: t.password || 'teacher123',
        isActiveAccount: t.isActiveAccount !== undefined ? t.isActiveAccount : true,
        forcePasswordChange: t.forcePasswordChange !== undefined ? t.forcePasswordChange : false,
        subjects: t.subjects || [t.department, 'Foundation Science'],
        classrooms: t.classrooms || []
      };
    });
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('courses');
    const parsed = saved ? JSON.parse(saved) : initialCourses;
    return parsed.map((c: Course) => {
      return {
        ...c,
        capacity: c.capacity || 30,
        isActive: c.isActive !== undefined ? c.isActive : true,
        studentIds: c.studentIds || [],
        subjectIds: c.subjectIds || []
      };
    });
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('school_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignment[]>(() => {
    const saved = localStorage.getItem('school_teacher_assignments');
    return saved ? JSON.parse(saved) : initialTeacherAssignments;
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : initialGrades;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('quizzes');
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => {
    const saved = localStorage.getItem('submissions');
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [sessions, setSessions] = useState<string[]>(() => {
    const saved = localStorage.getItem('school_sessions');
    return saved ? JSON.parse(saved) : ["2025/2026 Academic Session", "2026/2027 Academic Session"];
  });

  const [terms, setTerms] = useState<string[]>(() => {
    const saved = localStorage.getItem('school_terms');
    return saved ? JSON.parse(saved) : ["1st Term 2026", "Spring 2026", "Fall 2026"];
  });

  const [staffClassroomPermission, setStaffClassroomPermission] = useState<boolean>(() => {
    const saved = localStorage.getItem('staff_classroom_permission');
    return saved ? saved === 'true' : false;
  });

  const [parents, setParents] = useState<Parent[]>(() => {
    const saved = localStorage.getItem('parents');
    return saved ? JSON.parse(saved) : initialParents;
  });

  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[]>(() => {
    const saved = localStorage.getItem('payment_categories');
    return saved ? JSON.parse(saved) : initialPaymentCategories;
  });

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('payment_records');
    return saved ? JSON.parse(saved) : initialPaymentRecords;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(() => {
    const saved = localStorage.getItem('school_payment_methods');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
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

  const [notifications, setNotifications] = useState<SchoolNotification[]>(() => {
    const saved = localStorage.getItem('school_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [messages, setMessages] = useState<SchoolMessage[]>(() => {
    const saved = localStorage.getItem('school_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [admins, setAdmins] = useState<Admin[]>(() => {
    const saved = localStorage.getItem('school_admins');
    return saved ? JSON.parse(saved) : [];
  });

  const [rolesConfig, setRolesConfig] = useState<RoleConfig[]>(() => {
    const saved = localStorage.getItem('roles_config');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'r1', role: 'super_admin', name: 'Super Admin', description: 'Complete system oversight, admin creation, secure records deletion, backups, full academic & payment ledger tables.', permissions: ['full_access', 'user_management'] },
      { id: 'r2', role: 'admin', name: 'Administrator', description: 'System-wide scheduling and operations, edit calendars, register classes, handle bursa approvals & invoices, deactivate users.', permissions: ['user_management', 'finances', 'grades', 'cbt'] },
      { id: 'r3', role: 'teacher', name: 'Faculty Member', description: 'Enter test and assignment marks, upload attendance lists, direct digital quiz classrooms and syllabus.', permissions: ['attendance', 'grades', 'cbt'] },
      { id: 'r4', role: 'parent', name: 'Parent Representative', description: 'Inspect academic marks, download receipts, review notifications and invoices for linked children.', permissions: ['read_only_records'] },
      { id: 'r5', role: 'student', name: 'Enrolled Student', description: 'Review progress charts, undertake CBT tests, download syllabus records, view school calender.', permissions: ['undertake_cbt'] },
    ];
  });

  const [loginSessions, setLoginSessions] = useState<LoginActivity[]>(() => {
    const saved = localStorage.getItem('login_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [schoolName, setSchoolName] = useState<string>(() => {
    return localStorage.getItem('school_name') || 'New Unique Academy';
  });

  // Sync state to localStorage on any change
  useEffect(() => {
    localStorage.setItem('role', currentRole);
    localStorage.setItem('userId', currentUserId);
  }, [currentRole, currentUserId]);

  useEffect(() => {
    localStorage.setItem('parents', JSON.stringify(parents));
  }, [parents]);

  useEffect(() => {
    localStorage.setItem('payment_categories', JSON.stringify(paymentCategories));
  }, [paymentCategories]);

  useEffect(() => {
    localStorage.setItem('payment_records', JSON.stringify(paymentRecords));
  }, [paymentRecords]);

  useEffect(() => {
    localStorage.setItem('school_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('school_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('school_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('school_admins', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem('roles_config', JSON.stringify(rolesConfig));
  }, [rolesConfig]);

  useEffect(() => {
    localStorage.setItem('login_sessions', JSON.stringify(loginSessions));
  }, [loginSessions]);

  useEffect(() => {
    localStorage.setItem('school_name', schoolName);
  }, [schoolName]);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('school_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('school_teacher_assignments', JSON.stringify(teacherAssignments));
  }, [teacherAssignments]);

  useEffect(() => {
    localStorage.setItem('grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('school_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('school_terms', JSON.stringify(terms));
  }, [terms]);

  useEffect(() => {
    localStorage.setItem('staff_classroom_permission', String(staffClassroomPermission));
  }, [staffClassroomPermission]);

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
    setStudents((prev) => [...prev, newStudent]);

    // Automatically map to Classroom's studentIds
    if (studentData.gradeLevel) {
      setCourses((prevCourses) =>
        prevCourses.map((c) => {
          if (c.id === studentData.gradeLevel || c.name === studentData.gradeLevel) {
            const currentList = c.studentIds || [];
            if (!currentList.includes(newStudentId)) {
              return { ...c, studentIds: [...currentList, newStudentId] };
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

      // If the classroom (gradeLevel) changed, update classroom student lists!
      if (updatedData.gradeLevel && oldStu && oldStu.gradeLevel !== updatedData.gradeLevel) {
        setCourses((prevCourses) =>
          prevCourses.map((c) => {
            let sids = c.studentIds || [];
            // Remove from old class
            if (c.id === oldStu.gradeLevel || c.name === oldStu.gradeLevel) {
              sids = sids.filter(id => id !== studentId);
            }
            // Add to new class
            if (c.id === updatedData.gradeLevel || c.name === updatedData.gradeLevel) {
              if (!sids.includes(studentId)) {
                sids = [...sids, studentId];
              }
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
          return {
            ...s,
            tuitionPaid: Math.min(s.tuitionTotal || 4500, currentTotalPaid),
            paymentMethod: method,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentReceiptId: `REC-${Math.floor(100000 + Math.random() * 900000)}`
          };
        }
        return s;
      })
    );
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Cascade delete grades & submissions
    setGrades((prev) => prev.filter((g) => g.studentId !== id));
    setSubmissions((prev) => prev.filter((sub) => sub.studentId !== id));
    setAttendance((prev) => prev.filter((att) => att.studentId !== id));

    // Clean out from classroom seating lists
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        studentIds: c.studentIds ? c.studentIds.filter((sid) => sid !== id) : []
      }))
    );
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'joinedDate'>) => {
    const nextIdx = teachers.length + 1;
    const parts = teacherData.name.split(' ');
    const lastName = parts[parts.length - 1]?.toLowerCase() || 'faculty';
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      username: teacherData.username || `edu_${lastName}${nextIdx}`,
      password: teacherData.password || 'teacher123',
      isActiveAccount: teacherData.isActiveAccount !== undefined ? teacherData.isActiveAccount : true,
      forcePasswordChange: teacherData.forcePasswordChange !== undefined ? teacherData.forcePasswordChange : false,
      subjects: teacherData.subjects || [teacherData.department],
      classrooms: teacherData.classrooms || []
    };
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, updatedData: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );
  };

  const removeTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    // Set teacherId of courses assigned to this teacher to empty allocated
    setCourses((prev) =>
      prev.map((c) => (c.teacherId === id ? { ...c, teacherId: '' } : c))
    );
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `c_${Date.now()}`,
      capacity: courseData.capacity || 30,
      studentIds: courseData.studentIds || []
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const updateCourse = (id: string, updatedData: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setGrades((prev) => prev.filter((g) => g.courseId !== id));
    setAttendance((prev) => prev.filter((a) => a.courseId !== id));
    setQuizzes((prev) => prev.filter((q) => q.courseId !== id));
  };

  const addGrade = (gradeData: Omit<GradeRecord, 'id'>) => {
    const newGrade: GradeRecord = {
      ...gradeData,
      id: `g_${Date.now()}`
    };
    setGrades((prev) => [...prev, newGrade]);
  };

  const updateGrade = (id: string, score: number) => {
    setGrades((prev) =>
      prev.map((g) => (g.id === id ? { ...g, score } : g))
    );
  };

  const deleteGrade = (id: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const submitAttendance = (
    courseId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; notes: string }[]
  ) => {
    setAttendance((prev) => {
      // Filter out existing records for this class on this date to support editing attendance
      const filtered = prev.filter((r) => !(r.courseId === courseId && r.date === date));
      const fresh: AttendanceRecord[] = records.map((rec) => ({
        id: `att_${Date.now()}_${rec.studentId}`,
        studentId: rec.studentId,
        courseId,
        date,
        status: rec.status,
        notes: rec.notes || undefined
      }));
      return [...filtered, ...fresh];
    });
  };

  const addQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `q_${Date.now()}`
    };
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const toggleQuizActive = (id: string) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q))
    );
  };

  const addQuizSubmission = (submissionData: Omit<QuizSubmission, 'id'>) => {
    const newSubmission: QuizSubmission = {
      ...submissionData,
      id: `sub_${Date.now()}`
    };
    setSubmissions((prev) => [...prev, newSubmission]);

    // Also automatically create a 'quiz' grade entry for the student so grade tracking gets updated instantly!
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
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `e_${Date.now()}`
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const addAcademicSession = (session: string) => {
    if (!sessions.includes(session)) {
      setSessions((prev) => [...prev, session]);
    }
  };

  const deleteAcademicSession = (session: string) => {
    setSessions((prev) => prev.filter((s) => s !== session));
  };

  const addTerm = (term: string) => {
    if (!terms.includes(term)) {
      setTerms((prev) => [...prev, term]);
    }
  };

  const deleteTerm = (term: string) => {
    setTerms((prev) => prev.filter((t) => t !== term));
  };

  // Parent system actions
  const addParent = (parentData: Omit<Parent, 'id'>) => {
    const parentId = `p_${Date.now()}`;
    const newParent: Parent = {
      ...parentData,
      id: parentId,
      isActiveAccount: parentData.isActiveAccount !== undefined ? parentData.isActiveAccount : true
    };
    setParents((prev) => [...prev, newParent]);
  };

  const updateParent = (parentId: string, updatedData: Partial<Parent>) => {
    setParents((prev) =>
      prev.map((p) => (p.id === parentId ? { ...p, ...updatedData } : p))
    );
  };

  const removeParent = (id: string) => {
    setParents((prev) => prev.filter((p) => p.id !== id));
  };

  // Payment categories actions
  const addPaymentCategory = (categoryData: Omit<PaymentCategory, 'id'>) => {
    const newCategory: PaymentCategory = {
      ...categoryData,
      id: `pc_${Date.now()}`
    };
    setPaymentCategories((prev) => [...prev, newCategory]);
  };

  const updatePaymentCategory = (id: string, updatedData: Partial<PaymentCategory>) => {
    setPaymentCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
  };

  const deletePaymentCategory = (id: string) => {
    setPaymentCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addPaymentRecord = (recordData: Omit<PaymentRecord, 'id'>) => {
    const newRecord: PaymentRecord = {
      ...recordData,
      id: `pr_${Date.now()}`
    };
    setPaymentRecords((prev) => [...prev, newRecord]);

    // Update student's tuitionPaid inside student object only if status is not Pending Verification or Rejected
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
          // If status transitions to Approved, apply the tuition update
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
          const updated = { ...pm, ...updatedData };
          if (updatedData.isDefault) {
            return { ...updated, isDefault: true };
          }
          return updated;
        } else {
          if (updatedData.isDefault) {
            return { ...pm, isDefault: false };
          }
          return pm;
        }
      })
    );
  };

  // Notifications actions
  const addNotification = (notifData: Omit<SchoolNotification, 'id'>) => {
    const newNotif: SchoolNotification = {
      ...notifData,
      id: `n_${Date.now()}`,
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Messages actions
  const addMessage = (messageData: Omit<SchoolMessage, 'id'>) => {
    const newMsg: SchoolMessage = {
      ...messageData,
      id: `m_${Date.now()}`
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Authentication & Security actions
  const addAdmin = (adminData: Omit<Admin, 'id'>) => {
    const newAdmin: Admin = {
      ...adminData,
      id: `admin_${Date.now()}`
    };
    setAdmins(prev => [...prev, newAdmin]);
  };

  const updateAdmin = (id: string, updatedData: Partial<Admin>) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const removeAdmin = (id: string) => {
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
    const newActivity: LoginActivity = {
      id: `act_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      userId: username || 'anonymous',
      username: username || 'Anonymous User',
      role: role || 'guest',
      timestamp: new Date().toISOString(),
      ip: ips[Math.floor(Math.random() * ips.length)] || '127.0.0.1',
      browser: browsers[Math.floor(Math.random() * browsers.length)] || 'Chrome v124.0',
      status,
      details
    };
    setLoginSessions(prev => [newActivity, ...prev].slice(0, 100)); // Keep last 100 activities
  };

  const updateSchoolName = (name: string) => {
    setSchoolName(name);
  };

  // Subjects and Assignments actions
  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub_${Date.now()}`
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updatedData: Partial<Subject>) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        subjectIds: c.subjectIds ? c.subjectIds.filter((sid) => sid !== id) : []
      }))
    );
    setTeacherAssignments((prev) => prev.filter((ta) => ta.subjectId !== id));
  };

  const addTeacherAssignment = (assignmentData: Omit<TeacherAssignment, 'id'>) => {
    const newAssignment: TeacherAssignment = {
      ...assignmentData,
      id: `ta_${Date.now()}`
    };
    setTeacherAssignments((prev) => [...prev, newAssignment]);
  };

  const removeTeacherAssignment = (id: string) => {
    setTeacherAssignments((prev) => prev.filter((ta) => ta.id !== id));
  };

  const assignSubjectsToClass = (classroomId: string, selectedSubjectIds: string[]) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === classroomId ? { ...c, subjectIds: selectedSubjectIds } : c))
    );
  };

  return (
    <SchoolContext.Provider
      value={{
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
