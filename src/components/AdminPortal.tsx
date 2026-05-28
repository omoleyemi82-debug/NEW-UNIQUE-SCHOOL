import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { EventType, UserRole, Subject, TeacherAssignment, Admin, RoleConfig, LoginActivity, Student } from '../types';
import ClassroomSubjectManager from './ClassroomSubjectManager';
import CBTQuizManagement from './CBTQuizManagement';
import ReportSheet from './ReportSheet';
import StudentDirectorySearch from './StudentDirectorySearch';
import { encryptPassword, verifyPassword } from '../utils/security';
import { SearchableDropdown } from './SearchableDropdown';
import { countriesList, countryStatesMap, getDistrictsForState } from '../utils/locationData';
import {
  Users,
  Activity,
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Mail,
  FolderPlus,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Eye,
  Printer,
  X,
  DollarSign,
  CreditCard,
  Building,
  AlertCircle,
  Pencil,
  ShieldAlert,
  Search,
  Settings,
  Globe,
  Check,
  RefreshCw,
  FileText
} from 'lucide-react';

export default function AdminPortal({ activeTab }: { activeTab: string }) {
  const {
    students,
    teachers,
    courses,
    events,
    grades,
    sessions,
    terms,
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
    addEvent,
    deleteEvent,
    addAcademicSession,
    deleteAcademicSession,
    addTerm,
    deleteTerm,
    setStaffClassroomPermission,
    parents,
    paymentCategories,
    paymentRecords,
    paymentMethods,
    updatePaymentMethod,
    updatePaymentRecord,
    addParent,
    updateParent,
    removeParent,
    addPaymentCategory,
    updatePaymentCategory,
    deletePaymentCategory,
    addNotification,
    addMessage,
    subjects,
    teacherAssignments,
    addSubject,
    updateSubject,
    deleteSubject,
    addTeacherAssignment,
    removeTeacherAssignment,
    assignSubjectsToClass,
    admins,
    addAdmin,
    updateAdmin
  } = useSchool();

  // Selected student/teacher for detail inspecting
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [adminSelectedStudentId, setAdminSelectedStudentId] = useState<string>(() => students[0]?.id || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  // Search & Filter state
  const [searchTeacherQuery, setSearchTeacherQuery] = useState('');
  const [filterTeacherDept, setFilterTeacherDept] = useState('');
  const [filterTeacherSubject, setFilterTeacherSubject] = useState('');

  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [filterStudentGrade, setFilterStudentGrade] = useState('');

  // Image Handles for Profile Photo
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [selectedAvatarPreset, setSelectedAvatarPreset] = useState<string>('');

  // Advanced Registry Form Fields
  const [regGender, setRegGender] = useState('Male');
  const [regDOB, setRegDOB] = useState('2009-01-01');
  const [regNationality, setRegNationality] = useState('Nigeria');
  const [regState, setRegState] = useState('Lagos');
  const [regLGA, setRegLGA] = useState('Ikeja');
  const [regReligion, setRegReligion] = useState('Christianity');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regMedicalNotes, setRegMedicalNotes] = useState('None');
  const [regHomeAddress, setRegHomeAddress] = useState('');
  const [regEmergencyContactName, setRegEmergencyContactName] = useState('');
  const [regEmergencyContactPhone, setRegEmergencyContactPhone] = useState('');
  const [regStudentPhone, setRegStudentPhone] = useState('');
  const [regGuardianEmail, setRegGuardianEmail] = useState('');

  // Teacher Academic Profile Details
  const [regQualification, setRegQualification] = useState('');
  const [regInstitutionAttended, setRegInstitutionAttended] = useState('');
  const [regYearCompleted, setRegYearCompleted] = useState('');
  const [regYearsOfExperience, setRegYearsOfExperience] = useState<string>('0');
  const [regProfessionalCertification, setRegProfessionalCertification] = useState('');
  const [regAcademicDepartments, setRegAcademicDepartments] = useState<string[]>([]);
  const [tempDeptInput, setTempDeptInput] = useState('');
  const [regTeacherPhone, setRegTeacherPhone] = useState('');
  const [regTeacherEmergencyContact, setRegTeacherEmergencyContact] = useState('');
  const [regTeacherStaffId, setRegTeacherStaffId] = useState('');

  // Credential Management State
  const [credUsernameType, setCredUsernameType] = useState<'auto' | 'manual'>('auto');
  const [credManualUsername, setCredManualUsername] = useState('');
  const [credPasswordType, setCredPasswordType] = useState<'auto' | 'manual'>('auto');
  const [credManualPassword, setCredManualPassword] = useState('');
  const [credForcePasswordChange, setCredForcePasswordChange] = useState(false);

  // Administrative payments state
  const [adminPayAmountInput, setAdminPayAmountInput] = useState('1000');
  const [adminPayMethod, setAdminPayMethod] = useState<'Card' | 'Bank Transfer'>('Bank Transfer');
  const [adminPaySuccess, setAdminPaySuccess] = useState(false);

  // Escrow Audit verification states
  const [rejectionRecordId, setRejectionRecordId] = useState<string | null>(null);
  const [rejectionCommentStr, setRejectionCommentStr] = useState<string>('');
  const [viewingAttachment, setViewingAttachment] = useState<string | null>(null);

  // Registry form state
  const [registryRole, setRegistryRole] = useState<'student' | 'teacher'>('student');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regGradeLevel, setRegGradeLevel] = useState('');
  const [regDepartment, setRegDepartment] = useState('Sciences');
  const [regGuardianName, setRegGuardianName] = useState('');
  const [regGuardianPhone, setRegGuardianPhone] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [regErrorMsg, setRegErrorMsg] = useState('');

  // Edit states for user & course
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Classroom Management Extended States
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [classCapacityInput, setClassCapacityInput] = useState('30');
  const [courseSearchStudent, setCourseSearchStudent] = useState('');

  // Sessions and Terms Input state
  const [newSessionInput, setNewSessionInput] = useState('');
  const [newTermInput, setNewTermInput] = useState('');

  // Parent Management states
  const [activeRosterTab, setActiveRosterTab] = useState<'students' | 'teachers' | 'parents' | 'admins' | 'logs'>('students');
  const [searchParentQuery, setSearchParentQuery] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);

  // Additional Admin Registration States
  const [adminFormName, setAdminFormName] = useState('');
  const [adminFormUsername, setAdminFormUsername] = useState('');
  const [adminFormPassword, setAdminFormPassword] = useState('');
  const [adminFormEmail, setAdminFormEmail] = useState('');
  const [adminFormPhone, setAdminFormPhone] = useState('');
  const [adminFormPermissions, setAdminFormPermissions] = useState<string[]>(['user_management', 'grades']);
  const [adminFormAvatar, setAdminFormAvatar] = useState('');
  const [adminFormSuccess, setAdminFormSuccess] = useState('');
  const [adminFormError, setAdminFormError] = useState('');
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  const [parentFormName, setParentFormName] = useState('');
  const [parentFormEmail, setParentFormEmail] = useState('');
  const [parentFormPhone, setParentFormPhone] = useState('');
  const [parentFormPassword, setParentFormPassword] = useState('');
  const [parentFormAddress, setParentFormAddress] = useState('');
  const [parentFormCountry, setParentFormCountry] = useState('Nigeria');
  const [parentFormState, setParentFormState] = useState('Lagos');
  const [parentFormLGA, setParentFormLGA] = useState('Ikeja');
  const [parentFormAvatar, setParentFormAvatar] = useState('');
  const [parentFormSelectedStudentIds, setParentFormSelectedStudentIds] = useState<string[]>([]);
  const [parentFormIsActive, setParentFormIsActive] = useState(true);
  const [parentSuccessMsg, setParentSuccessMsg] = useState('');

  // Payment Category configuration states
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catNameInput, setCatNameInput] = useState('');
  const [catAmountInput, setCatAmountInput] = useState('');
  const [catDeadlineInput, setCatDeadlineInput] = useState('');
  const [catApplicableInput, setCatApplicableInput] = useState('All');
  const [catCompulsoryInput, setCatCompulsoryInput] = useState(true);
  const [catSuccessMsg, setCatSuccessMsg] = useState('');

  // Payment Gateways & Billing local states
  const [billingSubTab, setBillingSubTab] = useState<'gateways' | 'categories' | 'transactions'>('gateways');
  const [editingGatewayId, setEditingGatewayId] = useState<string | null>(null);
  const [gwApiKey, setGwApiKey] = useState('');
  const [gwApiSecret, setGwApiSecret] = useState('');
  const [gwCountries, setGwCountries] = useState('');
  const [gwEnabled, setGwEnabled] = useState(false);
  const [gwIsDefault, setGwIsDefault] = useState(false);
  const [gwSearchTerm, setGwSearchTerm] = useState('');
  const [gwFilterType, setGwFilterType] = useState('All');

  // School country select list
  const availableCountries = ['All Countries', 'Nigeria', 'United States', 'United Kingdom', 'China', 'Hong Kong', 'Canada', 'Germany', 'Ghana', 'South Africa'];

  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  ];

  const handleRegisterMember = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMsg('');
    if (!regName || !regEmail) {
      setRegErrorMsg('Name and Email are required.');
      return;
    }

    const matchedCountry = countriesList.find(c => c.name === regNationality) || countriesList[2];
    
    // Validate guardian phone if student
    if (registryRole === 'student' && regGuardianPhone) {
      const cleanDigits = regGuardianPhone.replace(/\D/g, '');
      if (cleanDigits.length !== matchedCountry.phoneLength) {
        setRegErrorMsg(`Phone digits must be exactly ${matchedCountry.phoneLength} digits for ${matchedCountry.name} (entered: ${cleanDigits.length}).`);
        return;
      }
    }

    // Validate custom credentials if manual
    if (credUsernameType === 'manual' && !credManualUsername.trim()) {
      setRegErrorMsg('Please provide a manual custom username.');
      return;
    }
    if (credPasswordType === 'manual' && !credManualPassword.trim()) {
      setRegErrorMsg('Please provide a manual custom password.');
      return;
    }

    const finalPhoto = uploadedPhoto || selectedAvatarPreset || avatarPresets[Math.floor(Math.random() * avatarPresets.length)];

    if (isEditingUser && editingUserId) {
      if (registryRole === 'student') {
        updateStudent(editingUserId, {
          name: regName,
          email: regEmail,
          gradeLevel: regGradeLevel,
          guardianName: regGuardianName,
          guardianPhone: regGuardianPhone ? `${matchedCountry.code} ${regGuardianPhone.replace(/\D/g, '')}` : '',
          guardianEmail: regGuardianEmail,
          avatar: finalPhoto,
          gender: regGender,
          dateOfBirth: regDOB,
          nationality: regNationality,
          state: regState,
          lga: regLGA,
          religion: regReligion,
          bloodGroup: regBloodGroup,
          medicalNotes: regMedicalNotes,
          homeAddress: regHomeAddress,
          emergencyContactName: regEmergencyContactName,
          emergencyContactPhone: regEmergencyContactPhone ? `${matchedCountry.code} ${regEmergencyContactPhone.replace(/\D/g, '')}` : '',
          username: credUsernameType === 'manual' ? credManualUsername : undefined,
          password: credPasswordType === 'manual' ? encryptPassword(credManualPassword) : undefined,
          forcePasswordChange: credForcePasswordChange
        });
      } else {
        updateTeacher(editingUserId, {
          name: regName,
          email: regEmail,
          department: regAcademicDepartments[0] || regDepartment || 'Sciences',
          bio: regBio,
          avatar: finalPhoto,
          username: credUsernameType === 'manual' ? credManualUsername : undefined,
          password: credPasswordType === 'manual' ? encryptPassword(credManualPassword) : undefined,
          forcePasswordChange: credForcePasswordChange,
          gender: regGender,
          dateOfBirth: regDOB,
          nationality: regNationality,
          state: regState,
          lga: regLGA,
          address: regHomeAddress,
          phone: regTeacherPhone,
          emergencyContact: regTeacherEmergencyContact,
          staffId: regTeacherStaffId || editingUserId,
          qualification: regQualification,
          institutionAttended: regInstitutionAttended,
          yearCompleted: regYearCompleted,
          yearsOfExperience: parseInt(regYearsOfExperience) || 0,
          professionalCertification: regProfessionalCertification,
          academicDepartments: regAcademicDepartments,
          subjects: regAcademicDepartments.length > 0 ? regAcademicDepartments : [regDepartment]
        });
      }
      setIsEditingUser(false);
      setEditingUserId(null);
    } else {
      // Create Operation
      let autoUsername = '';
      if (registryRole === 'student') {
        const clsObj = courses.find(c => c.id === regGradeLevel || c.name === regGradeLevel);
        const prefixClass = clsObj ? clsObj.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() : 'P1A';
        const rawSeqStr = String(students.length + 1).padStart(3, '0');
        autoUsername = `${prefixClass}-${rawSeqStr}`;
      } else {
        const firstNameTeacher = regName.split(' ')[0]?.toLowerCase() || 'teacher';
        const deptTag = (regAcademicDepartments[0] || regDepartment || 'maths').toLowerCase().substring(0, 5);
        autoUsername = `${firstNameTeacher}.${deptTag}`;
      }

      const finalUsername = credUsernameType === 'auto' ? autoUsername : credManualUsername;

      const rawPass = credPasswordType === 'auto'
        ? `temp_${Math.floor(1000 + Math.random() * 9000)}`
        : credManualPassword;
      const encryptedUserPass = encryptPassword(rawPass);

      if (registryRole === 'student') {
        if (!regGradeLevel) {
          alert('Please select an active classroom for this student.');
          return;
        }
        const clsObj = courses.find(c => c.id === regGradeLevel || c.name === regGradeLevel);
        if (!clsObj) {
          alert('Selected classroom was not found.');
          return;
        }
        if (!clsObj.isActive) {
          alert('Selected classroom is currently inactive.');
          return;
        }
        const currentCount = clsObj.studentIds ? clsObj.studentIds.length : 0;
        const capacityLimit = clsObj.capacity || 30;
        if (currentCount >= capacityLimit) {
          alert(`Selected classroom "${clsObj.name}" is already full (${currentCount}/${capacityLimit}).`);
          return;
        }

        addStudent({
          name: regName,
          email: regEmail,
          gradeLevel: regGradeLevel,
          guardianName: regGuardianName || 'Primary Parent',
          guardianPhone: regGuardianPhone ? `${matchedCountry.code} ${regGuardianPhone.replace(/\D/g, '')}` : matchedCountry.code + ' 8010000000',
          guardianEmail: regGuardianEmail || `${regName.split(' ').slice(-1)[0]?.toLowerCase()}@guardian.com`,
          avatar: finalPhoto,
          gender: regGender,
          dateOfBirth: regDOB,
          nationality: regNationality,
          state: regState,
          lga: regLGA,
          religion: regReligion,
          bloodGroup: regBloodGroup,
          medicalNotes: regMedicalNotes,
          homeAddress: regHomeAddress || '12 School Crescent Road',
          emergencyContactName: regEmergencyContactName || regGuardianName || 'Advisory Office',
          emergencyContactPhone: regEmergencyContactPhone ? `${matchedCountry.code} ${regEmergencyContactPhone.replace(/\D/g, '')}` : matchedCountry.code + ' 8010000001',
          username: finalUsername,
          password: encryptedUserPass,
          isActiveAccount: true,
          forcePasswordChange: credForcePasswordChange
        });
      } else {
        const generatedStaffId = regTeacherStaffId.trim() || `NUA/TCHR/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`;
        addTeacher({
          name: regName,
          email: regEmail,
          department: regAcademicDepartments[0] || regDepartment || 'Sciences',
          bio: regBio || 'Faculty Specialist',
          avatar: finalPhoto,
          username: finalUsername,
          password: encryptedUserPass,
          isActiveAccount: true,
          forcePasswordChange: credForcePasswordChange,
          subjects: regAcademicDepartments.length > 0 ? regAcademicDepartments : [regDepartment],
          classrooms: [],
          gender: regGender,
          dateOfBirth: regDOB,
          nationality: regNationality,
          state: regState,
          lga: regLGA,
          address: regHomeAddress,
          phone: regTeacherPhone,
          emergencyContact: regTeacherEmergencyContact,
          staffId: generatedStaffId,
          qualification: regQualification,
          institutionAttended: regInstitutionAttended,
          yearCompleted: regYearCompleted,
          yearsOfExperience: parseInt(regYearsOfExperience) || 0,
          professionalCertification: regProfessionalCertification,
          academicDepartments: regAcademicDepartments.length > 0 ? regAcademicDepartments : [regDepartment]
        });
      }
    }

    // Reset Form fields
    setRegName('');
    setRegEmail('');
    setRegGradeLevel('');
    setRegGuardianName('');
    setRegGuardianPhone('');
    setRegGuardianEmail('');
    setRegBio('');
    setUploadedPhoto(null);
    setSelectedAvatarPreset('');
    setRegHomeAddress('');
    setRegEmergencyContactName('');
    setRegEmergencyContactPhone('');
    setRegStudentPhone('');
    setCredManualUsername('');
    setCredManualPassword('');
    setCredForcePasswordChange(false);
    setCredUsernameType('auto');
    setCredPasswordType('auto');

    // Reset Teacher-Only Fields
    setRegQualification('');
    setRegInstitutionAttended('');
    setRegYearCompleted('');
    setRegYearsOfExperience('0');
    setRegProfessionalCertification('');
    setRegAcademicDepartments([]);
    setTempDeptInput('');
    setRegTeacherPhone('');
    setRegTeacherEmergencyContact('');
    setRegTeacherStaffId('');

    setRegSuccess(true);
    setRegGuardianPhone('');
    setRegGuardianEmail('');
    setRegBio('');
    setUploadedPhoto(null);
    setSelectedAvatarPreset('');
    setRegHomeAddress('');
    setRegEmergencyContactName('');
    setRegEmergencyContactPhone('');
    setRegStudentPhone('');
    setCredManualUsername('');
    setCredManualPassword('');
    setCredForcePasswordChange(false);
    setCredUsernameType('auto');
    setCredPasswordType('auto');
    setRegSuccess(true);
    setTimeout(() => setRegSuccess(false), 3000);
  };

  // Course Form state
  const [coursesSubTab, setCoursesSubTab] = useState<'classrooms' | 'subjects' | 'assignments'>('classrooms');
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseTeacherId, setCourseTeacherId] = useState(() => teachers[0]?.id || 't_01');
  const [courseRoom, setCourseRoom] = useState('Room 101');
  const [courseDays, setCourseDays] = useState<string[]>(['Monday', 'Wednesday']);
  const [courseTime, setCourseTime] = useState('10:00 AM - 11:30 AM');
  const [courseCapacity, setCourseCapacity] = useState(30);
  const [courseLevel, setCourseLevel] = useState('Primary 1');
  const [courseIsActive, setCourseIsActive] = useState(true);
  const [courseSuccess, setCourseSuccess] = useState(false);

  // Subject Management State
  const [subFormName, setSubFormName] = useState('');
  const [subFormCode, setSubFormCode] = useState('');
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // Teacher Assignment State
  const [assFormTeacherId, setAssFormTeacherId] = useState('');
  const [assFormClassId, setAssFormClassId] = useState('');
  const [assFormSubjectId, setAssFormSubjectId] = useState('');

  const handleRegisterCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !courseCode) return;

    if (isEditingCourse && editingCourseId) {
      updateCourse(editingCourseId, {
        name: courseName,
        code: courseCode.toUpperCase(),
        teacherId: courseTeacherId,
        room: courseRoom,
        capacity: courseCapacity,
        level: courseLevel,
        isActive: courseIsActive,
        schedule: {
          days: courseDays,
          time: courseTime
        }
      });
      setIsEditingCourse(false);
      setEditingCourseId(null);
    } else {
      addCourse({
        name: courseName,
        code: courseCode.toUpperCase(),
        teacherId: courseTeacherId,
        room: courseRoom,
        capacity: courseCapacity,
        level: courseLevel,
        isActive: courseIsActive,
        studentIds: [],
        subjectIds: [],
        schedule: {
          days: courseDays,
          time: courseTime
        }
      });
    }

    setCourseName('');
    setCourseCode('');
    setCourseCapacity(30);
    setCourseLevel('Primary 1');
    setCourseIsActive(true);
    setCourseSuccess(true);
    setTimeout(() => setCourseSuccess(false), 3050);
  };

  const handleRegisterSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subFormName || !subFormCode) return;

    if (isEditingSubject && editingSubjectId) {
      updateSubject(editingSubjectId, {
        name: subFormName,
        code: subFormCode.toUpperCase()
      });
      setIsEditingSubject(false);
      setEditingSubjectId(null);
    } else {
      addSubject({
        name: subFormName,
        code: subFormCode.toUpperCase()
      });
    }
    setSubFormName('');
    setSubFormCode('');
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assFormTeacherId || !assFormClassId || !assFormSubjectId) {
      alert("Please select a teacher, classroom, and subject.");
      return;
    }
    
    // Check if classroom has subjects assigned:
    const selectedClassObj = courses.find(c => c.id === assFormClassId);
    if (!selectedClassObj) {
      alert("Classroom does not exist!");
      return;
    }

    // Add teacher assignment
    addTeacherAssignment({
      teacherId: assFormTeacherId,
      classroomId: assFormClassId,
      subjectId: assFormSubjectId
    });

    // Reset fields
    setAssFormTeacherId('');
    setAssFormClassId('');
    setAssFormSubjectId('');
  };

  // Submit handlers for Parent Accounts
  const handleRegisterParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentFormName || !parentFormEmail) {
      alert('Kindly fill in the parent’s name and email.');
      return;
    }

    const matchedCountry = countriesList.find(c => c.name === parentFormCountry) || countriesList[2];
    const cleanDigits = parentFormPhone.replace(/\D/g, '');
    if (cleanDigits.length !== matchedCountry.phoneLength) {
      alert(`Parent's Phone digits must be exactly ${matchedCountry.phoneLength} digits for ${matchedCountry.name} (entered: ${cleanDigits.length}).`);
      return;
    }

    const finalPhone = `${matchedCountry.code} ${cleanDigits}`;

    const parentGenUsername = `parent-${parentFormName.toLowerCase().split(' ')[0] || 'parent'}`;
    const rawPassParent = parentFormPassword || `parent_${Math.floor(1000 + Math.random() * 9000)}`;
    const encryptedParentPass = encryptPassword(rawPassParent);

    if (isEditingParent && editingParentId) {
      updateParent(editingParentId, {
        name: parentFormName,
        username: parentGenUsername,
        email: parentFormEmail,
        phone: finalPhone,
        password: encryptedParentPass,
        address: parentFormAddress,
        avatar: parentFormAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        studentIds: parentFormSelectedStudentIds,
        isActiveAccount: parentFormIsActive,
        nationality: parentFormCountry,
        state: parentFormState,
        lga: parentFormLGA
      });
      setParentSuccessMsg(`Parent account successfully updated! Username: ${parentGenUsername}`);
    } else {
      const newPId = 'PAR-' + Math.floor(100000 + Math.random() * 900000);
      addParent({
        id: newPId,
        name: parentFormName,
        username: parentGenUsername,
        email: parentFormEmail,
        phone: finalPhone,
        password: encryptedParentPass,
        address: parentFormAddress,
        avatar: parentFormAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        studentIds: parentFormSelectedStudentIds,
        isActiveAccount: true,
        nationality: parentFormCountry,
        state: parentFormState,
        lga: parentFormLGA
      });
      setParentSuccessMsg(`New Parent account created! Auto-credentials: Username is "${parentGenUsername}" & password is "${rawPassParent}".`);
    }

    // Reset parent form
    setTimeout(() => {
      setParentSuccessMsg('');
      setIsEditingParent(false);
      setEditingParentId(null);
      setParentFormName('');
      setParentFormEmail('');
      setParentFormPhone('');
      setParentFormPassword('');
      setParentFormAddress('');
      setParentFormAvatar('');
      setParentFormSelectedStudentIds([]);
      setParentFormCountry('Nigeria');
      setParentFormState('Lagos');
      setParentFormLGA('Ikeja');
    }, 2500);
  };

  // Submit handlers for Additional Admin Accounts
  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormError('');
    setAdminFormSuccess('');

    if (!adminFormName || !adminFormEmail) {
      setAdminFormError('Kindly provide the Admin Name and Email Address.');
      return;
    }

    const parentGenUsername = adminFormUsername.trim() || `admin-${adminFormName.toLowerCase().split(' ')[0] || 'helper'}`;
    const rawPassAdmin = adminFormPassword.trim() || `admin_${Math.floor(1000 + Math.random() * 9000)}`;
    const encryptedPass = encryptPassword(rawPassAdmin);

    if (isEditingAdmin && editingAdminId) {
      updateAdmin(editingAdminId, {
        name: adminFormName,
        username: parentGenUsername.toLowerCase(),
        email: adminFormEmail.toLowerCase(),
        phone: adminFormPhone,
        password: encryptedPass,
        permissions: adminFormPermissions,
        avatar: adminFormAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
      setAdminFormSuccess(`Administrator account successfully updated! Username: ${parentGenUsername.toLowerCase()}`);
    } else {
      addAdmin({
        name: adminFormName,
        username: parentGenUsername.toLowerCase(),
        email: adminFormEmail.toLowerCase(),
        phone: adminFormPhone,
        password: encryptedPass,
        role: 'admin',
        permissions: adminFormPermissions,
         isActiveAccount: true,
        avatar: adminFormAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
      setAdminFormSuccess(`New Administrator account created! Auto-credentials: Username is "${parentGenUsername.toLowerCase()}" & password is "${rawPassAdmin}".`);
    }

    // Reset fields
    setTimeout(() => {
      setAdminFormSuccess('');
      setIsEditingAdmin(false);
      setEditingAdminId(null);
      setAdminFormName('');
      setAdminFormUsername('');
      setAdminFormPassword('');
      setAdminFormEmail('');
      setAdminFormPhone('');
      setAdminFormPermissions(['user_management', 'grades']);
      setAdminFormAvatar('');
    }, 4500);
  };

  // Submit handlers for Payment Categories
  const handleRegisterCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(catAmountInput);
    if (!catNameInput || isNaN(parsedAmt) || parsedAmt < 0) {
      alert('Provide a valid category fee name and non-negative amount.');
      return;
    }

    if (isEditingCategory && editingCategoryId) {
      updatePaymentCategory(editingCategoryId, {
        name: catNameInput,
        amount: parsedAmt,
        deadline: catDeadlineInput || '2026-06-30',
        applicableGradeLevels: catApplicableInput === 'All' ? courses.map(c => c.name) : [catApplicableInput],
        isCompulsory: catCompulsoryInput
      });
      setCatSuccessMsg('Fee category updated successfully.');
    } else {
      const newCId = 'FEE-' + Math.floor(1000 + Math.random() * 9000);
      addPaymentCategory({
        id: newCId,
        name: catNameInput,
        amount: parsedAmt,
        deadline: catDeadlineInput || '2026-06-30',
        applicableGradeLevels: catApplicableInput === 'All' ? courses.map(c => c.name) : [catApplicableInput],
        isCompulsory: catCompulsoryInput
      });
      setCatSuccessMsg('New Fee Category registered successfully!');
    }

    // Reset payment category form
    setTimeout(() => {
      setCatSuccessMsg('');
      setIsEditingCategory(false);
      setEditingCategoryId(null);
      setCatNameInput('');
      setCatAmountInput('');
      setCatDeadlineInput('');
      setCatCompulsoryInput(true);
    }, 2500);
  };

  const toggleDaySelection = (day: string) => {
    setCourseDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Event creation Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [eventType, setEventType] = useState<EventType>('academic');
  const [eventLocation, setEventLocation] = useState('Assembly Hall');
  const [eventTime, setEventTime] = useState('1:00 PM - 2:30 PM');
  const [eventSuccess, setEventSuccess] = useState(false);

  const handleRegisterEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;

    addEvent({
      title: eventTitle,
      description: eventDesc,
      date: eventDate,
      type: eventType,
      location: eventLocation,
      time: eventTime
    });

    setEventTitle('');
    setEventDesc('');
    setEventSuccess(true);
    setTimeout(() => setEventSuccess(false), 3050);
  };

  // Overall calculations
  const totalSubmissionsCount = grades.length;
  const schoolAveragePercentage = grades.length > 0 
    ? Math.round((grades.reduce((sum, current) => sum + (current.score / current.maxScore), 0) / grades.length) * 10) * 10
    : 85;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. ADMIN OVERVIEW TAB */}
      {activeTab === 'dash' && (
        <>
          {/* Main system indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-205 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Authorized Students</span>
                <span className="text-3xl font-black text-slate-905 tracking-tight">{students.length}</span>
              </div>
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                <Users className="w-6 h-6" id="total-students-icon" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-205 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Faculty Instructors</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tight">{teachers.length}</span>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-205 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Classrooms Active</span>
                <span className="text-3xl font-black text-amber-600 tracking-tight">{courses.length}</span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-205 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Campus Events Logs</span>
                <span className="text-3xl font-black text-pink-600 tracking-tight">{events.length}</span>
              </div>
              <div className="p-3 bg-pink-50 text-pink-650 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Database status and reports */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">System Database Verification</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block pb-3">Automated school statistics metrics validation</span>
                </div>
                <Users className="w-5 h-5 text-slate-350" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Core School-wide Marks average</span>
                  <p className="text-2xl font-black text-slate-901">{schoolAveragePercentage}%</p>
                  <p className="text-[10px] text-slate-440 font-medium">Derived dynamically from {totalSubmissionsCount} individual gradebooks record files.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Security Protocols</span>
                  <div className="flex items-center gap-2 text-emerald-650">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-bold leading-none">Sandbox Mode Operational</span>
                  </div>
                  <p className="text-[10px] text-slate-440 font-medium">Administrative edits append to browser LocalStorage instance.</p>
                </div>
              </div>
            </div>

            {/* Quick overview directory list */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">Registrar Faculty Registry</h4>
              <div className="divide-y divide-slate-100">
                {teachers.slice(0, 3).map((v) => (
                  <div key={v.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={v.avatar} alt="Avatar teacher" className="w-8 h-8 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{v.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{v.department}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 text-right">Faculty</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comprehensive Student Report Cards Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h4 className="font-extrabold text-slate-905 text-sm mb-1">Student Terminal Report Sheets & Endorsements Log</h4>
              <p className="text-xs text-slate-500">Dual-plane supervisor mode. View, override, and print certified terminals for any enrolled student with exact WAEC weight scales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-sans">Student Target Record</label>
                <select
                  value={adminSelectedStudentId}
                  onChange={(e) => setAdminSelectedStudentId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-800"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.gradeLevel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {adminSelectedStudentId && (
              <div className="border border-slate-200 rounded-3xl overflow-hidden p-0 bg-slate-50">
                <ReportSheet initialStudentId={adminSelectedStudentId} isReadOnly={false} />
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. MANAGE USERS TAB */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* User Registration Form */}
          {activeRosterTab !== 'logs' && (
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 font-sans">
              {activeRosterTab === 'parents' ? (
                <div className="space-y-4 animate-fade-in text-natural-charcoal">
                  <div>
                    <h4 className="font-extrabold text-[#1A365D] text-sm">{isEditingParent ? 'Edit' : 'Register'} Parent / Guardian Profile</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{isEditingParent ? 'Modify parent fields & links' : 'Add new guardian account to system ledger'}</span>
                  </div>

                  <form onSubmit={handleRegisterParent} className="space-y-4">
                    <div className="space-y-3.5 pt-1">
                      <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">1. Contact Identity</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Parent Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Robert Alvarez"
                            value={parentFormName}
                            onChange={(e) => setParentFormName(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Email *</label>
                            <input
                              type="email"
                              required
                              placeholder="e.g. robert.alvarez@email.com"
                              value={parentFormEmail}
                              onChange={(e) => setParentFormEmail(e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Phone Number *</label>
                          <div className="flex gap-1.5">
                            <span className="bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-2 py-1.5 text-xs font-mono self-center">
                              {countriesList.find(c => c.name === parentFormCountry)?.code || '+234'}
                            </span>
                            <input
                              type="text"
                              required
                              placeholder={`Enter ${countriesList.find(c => c.name === parentFormCountry)?.phoneLength || 10} digits`}
                              value={parentFormPhone}
                              onChange={(e) => setParentFormPhone(e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Parent Nationality and Origin Selection Cascade */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border border-indigo-50/50 p-2.5 rounded-xl bg-slate-50/30">
                        <SearchableDropdown
                          id="parent-reg-country"
                          label="Country selection"
                          options={countriesList.map(c => c.name)}
                          value={parentFormCountry}
                          onChange={(country) => {
                            setParentFormCountry(country);
                            setParentFormState('');
                            setParentFormLGA('');
                          }}
                          placeholder="Choose Country"
                          required
                        />

                        <SearchableDropdown
                          id="parent-reg-state"
                          label="State Choice"
                          options={parentFormCountry ? (countryStatesMap[parentFormCountry] || []) : []}
                          value={parentFormState}
                          onChange={(state) => {
                            setParentFormState(state);
                            setParentFormLGA('');
                          }}
                          placeholder={parentFormCountry ? "Choose State/Region" : "— Select Country First —"}
                          disabled={!parentFormCountry}
                          required
                        />

                        <SearchableDropdown
                          id="parent-reg-lga"
                          label="Local Gov Area / District"
                          options={parentFormState ? getDistrictsForState(parentFormState) : []}
                          value={parentFormLGA}
                          onChange={(lga) => setParentFormLGA(lga)}
                          placeholder={parentFormState ? "Choose LGA / District" : "— Select State First —"}
                          disabled={!parentFormState}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Physical Address *</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="e.g. 742 Evergreen Terrace, Lagos"
                          value={parentFormAddress}
                          onChange={(e) => setParentFormAddress(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Profile Photo / Avatar URL</label>
                        <input
                          type="text"
                          placeholder="e.g. https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                          value={parentFormAvatar}
                          onChange={(e) => setParentFormAvatar(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">2. Security Gate Credentials</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Portal Login Password *</label>
                        <input
                          type="text"
                          required
                          placeholder="Provide stable access passcode key"
                          value={parentFormPassword}
                          onChange={(e) => setParentFormPassword(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-3">
                        <input
                          type="checkbox"
                          id="parentFormIsActive"
                          checked={parentFormIsActive}
                          onChange={(e) => setParentFormIsActive(e.target.checked)}
                          className="rounded text-[#1A365D] focus:ring-[#1A365D]"
                        />
                        <label htmlFor="parentFormIsActive" className="text-xs font-bold text-slate-700 cursor-pointer select-none">Account Active Status</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between border-b pb-1">
                      <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest">3. Link Students / Children</h5>
                      <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">{parentFormSelectedStudentIds.length} Linked</span>
                    </div>
                    
                    <p className="text-[9.5px] text-slate-400">Search and bind one or multiple pupils to this parent account:</p>
                    <div className="max-h-36 overflow-y-auto bg-slate-50 border rounded-lg p-2 space-y-1.5">
                      {students.map(student => {
                        const isLinked = parentFormSelectedStudentIds.includes(student.id);
                        return (
                          <label key={student.id} className="flex items-center justify-between p-1.5 hover:bg-white rounded transition-all cursor-pointer select-none">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isLinked}
                                onChange={() => {
                                  if (isLinked) {
                                    setParentFormSelectedStudentIds(prev => prev.filter(id => id !== student.id));
                                  } else {
                                    setParentFormSelectedStudentIds(prev => [...prev, student.id]);
                                  }
                                }}
                                className="rounded text-[#1A365D] focus:ring-[#1A365D]"
                              />
                              <img src={student.avatar} alt="Avatar pupil" className="w-5 h-5 rounded-full object-cover border" referrerPolicy="no-referrer" />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block leading-none">{student.name}</span>
                                <span className="text-[9px] text-slate-400 block">{student.gradeLevel} • Adm: {student.admissionNumber}</span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer shadow-md select-none transition-colors"
                    >
                      {isEditingParent ? 'Commit Updates' : 'Register Parent Account'}
                    </button>
                    {isEditingParent && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingParent(false);
                          setEditingParentId(null);
                          setParentFormName('');
                          setParentFormEmail('');
                          setParentFormPhone('');
                          setParentFormPassword('');
                          setParentFormAddress('');
                          setParentFormAvatar('');
                          setParentFormSelectedStudentIds([]);
                        }}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {parentSuccessMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" /> {parentSuccessMsg}
                    </div>
                  )}
                </form>
              </div>
            ) : activeRosterTab === 'admins' ? (
              <div className="space-y-4 animate-fade-in text-natural-charcoal">
                <div>
                  <h4 className="font-extrabold text-[#1A365D] text-sm">{isEditingAdmin ? 'Edit' : 'Register'} Platform Admin Account</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{isEditingAdmin ? 'Modify administrator fields & override permissions' : 'Add new helper admin login credentials'}</span>
                </div>

                {adminFormError && (
                  <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
                    <span>{adminFormError}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterAdmin} className="space-y-4">
                  <div className="space-y-3.5 pt-1">
                    <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">1. Contact Identity</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Admin Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sandra Jenkins"
                          value={adminFormName}
                          onChange={(e) => setAdminFormName(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Email Connection *</label>
                          <input
                            type="email"
                            required
                            placeholder="sandra@academy.org"
                            value={adminFormEmail}
                            onChange={(e) => setAdminFormEmail(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Phone Number</label>
                          <input
                            type="text"
                            placeholder="e.g. +234 803 111 2222"
                            value={adminFormPhone}
                            onChange={(e) => setAdminFormPhone(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">2. Custom Credentials Override</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Username (Empty for Auto-Gen)</label>
                        <input
                          type="text"
                          placeholder="e.g. sandra.admin"
                          value={adminFormUsername}
                          onChange={(e) => setAdminFormUsername(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Password (Empty for Auto-Gen)</label>
                        <input
                          type="text"
                          placeholder="e.g. passcode123"
                          value={adminFormPassword}
                          onChange={(e) => setAdminFormPassword(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">3. Role Permissions Scope</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                      {[
                        { label: 'User Registration', val: 'user_management' },
                        { label: 'Financial ledger', val: 'finances' },
                        { label: 'Academic grades', val: 'grades' },
                        { label: 'CBT examination', val: 'cbt' }
                      ].map(perm => {
                        const hasPerm = adminFormPermissions.includes(perm.val);
                        return (
                          <label key={perm.val} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hasPerm}
                              onChange={() => {
                                if (hasPerm) {
                                  setAdminFormPermissions(prev => prev.filter(p => p !== perm.val));
                                } else {
                                  setAdminFormPermissions(prev => [...prev, perm.val]);
                                }
                              }}
                              className="rounded text-[#1A365D]"
                            />
                            <span>{perm.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer shadow-md transition-colors"
                    >
                      {isEditingAdmin ? 'Commit Updates' : 'Register Admin Account'}
                    </button>
                    {isEditingAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAdmin(false);
                          setEditingAdminId(null);
                          setAdminFormName('');
                          setAdminFormUsername('');
                          setAdminFormPassword('');
                          setAdminFormEmail('');
                          setAdminFormPhone('');
                          setAdminFormPermissions(['user_management', 'grades']);
                        }}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {adminFormSuccess && (
                     <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex flex-col gap-1">
                       <span className="flex items-center gap-2 font-bold text-emerald-900 border-b border-emerald-200/50 pb-1">
                         <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" /> Action completed!
                       </span>
                       <span className="leading-relaxed text-[11px] font-medium">{adminFormSuccess}</span>
                     </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{isEditingUser ? 'Edit' : 'Register'} Student / Staff Profile</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{isEditingUser ? 'Modify profile fields' : 'Add credentials to system ledger'}</span>
                </div>

                {regErrorMsg && (
                  <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {regErrorMsg}
                  </div>
                )}

                <form onSubmit={handleRegisterMember} className="space-y-4">
              {/* Role Radio Slider */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 border border-slate-200 rounded-xl select-none">
                <button
                  type="button"
                  onClick={() => setRegistryRole('student')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                    registryRole === 'student' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Student Entry
                </button>
                <button
                  type="button"
                  onClick={() => setRegistryRole('teacher')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                    registryRole === 'teacher' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Teacher Entry
                </button>
              </div>

              {/* SECTION A: PRIMARY IDENTITIES */}
              <div className="space-y-3.5 pt-1">
                <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">1. Personal Identity</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Henderson"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Primary Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. liam@academy.org"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Gender</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={regDOB}
                      onChange={(e) => setRegDOB(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: GEOGRAPHICAL ADDRESS (Prevention of manual typing) */}
              <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">2. Nationality & Origin</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <SearchableDropdown
                    id="member-reg-country"
                    label="Country selection"
                    options={countriesList.map(c => c.name)}
                    value={regNationality}
                    onChange={(country) => {
                      setRegNationality(country);
                      setRegState('');
                      setRegLGA('');
                    }}
                    placeholder="Choose Country"
                    required
                  />

                  <SearchableDropdown
                    id="member-reg-state"
                    label="State choice"
                    options={regNationality ? (countryStatesMap[regNationality] || []) : []}
                    value={regState}
                    onChange={(state) => {
                      setRegState(state);
                      setRegLGA('');
                    }}
                    placeholder={regNationality ? "Choose State/Region" : "— Select Country First —"}
                    disabled={!regNationality}
                    required
                  />

                  <SearchableDropdown
                    id="member-reg-lga"
                    label="Local Gov Area / District"
                    options={regState ? getDistrictsForState(regState) : []}
                    value={regLGA}
                    onChange={(lga) => setRegLGA(lga)}
                    placeholder={regState ? "Choose LGA / District" : "— Select State First —"}
                    disabled={!regState}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Religion</label>
                    <select
                      value={regReligion}
                      onChange={(e) => setRegReligion(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
                    >
                      <option value="Christianity">Christianity</option>
                      <option value="Islam">Islam</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Traditional">Traditional</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Blood Group</label>
                    <select
                      value={regBloodGroup}
                      onChange={(e) => setRegBloodGroup(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Medical Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. None / Asthma inhaler required"
                      value={regMedicalNotes}
                      onChange={(e) => setRegMedicalNotes(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Home Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12 High Street Avenue"
                    value={regHomeAddress}
                    onChange={(e) => setRegHomeAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* SECTION C: STUDENT vs TEACHER fields */}
              {registryRole === 'student' ? (
                <div className="space-y-3 pt-1">
                  <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">3. Guardian Details</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Assigned Classroom</label>
                      <select
                        value={regGradeLevel}
                        onChange={(e) => setRegGradeLevel(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      >
                        <option value="">-- Choose Active Classroom --</option>
                        {courses
                          .filter(cls => cls.isActive)
                          .map(cls => {
                            const currentEnrolled = cls.studentIds ? cls.studentIds.length : 0;
                            const limit = cls.capacity || 30;
                            const isFull = currentEnrolled >= limit;
                            return (
                              <option 
                                key={cls.id} 
                                value={cls.id} 
                                disabled={isFull}
                              >
                                {cls.name} ({currentEnrolled}/{limit} seats) {isFull ? '[FULL]' : ''}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Guardian Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Parent full name"
                        value={regGuardianName}
                        onChange={(e) => setRegGuardianName(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Guardian Email</label>
                      <input
                        type="email"
                        placeholder="parent@example.com"
                        value={regGuardianEmail}
                        onChange={(e) => setRegGuardianEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Guardian Phone *</label>
                      <div className="flex gap-1.5">
                        <span className="bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-2 py-1.5 text-xs font-mono self-center">
                          {countriesList.find(c => c.name === regNationality)?.code || '+234'}
                        </span>
                        <input
                          type="text"
                          required
                          placeholder={`Enter ${countriesList.find(c => c.name === regNationality)?.phoneLength || 10} digits`}
                          value={regGuardianPhone}
                          onChange={(e) => setRegGuardianPhone(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t pt-2 mt-2">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Emergency Contact Name</label>
                      <input
                        type="text"
                        placeholder="Alternative contact name"
                        value={regEmergencyContactName}
                        onChange={(e) => setRegEmergencyContactName(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Emergency Contact Phone</label>
                      <input
                        type="text"
                        placeholder="Alternate phone number"
                        value={regEmergencyContactPhone}
                        onChange={(e) => setRegEmergencyContactPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">3. Teacher Registry Details</h5>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Staff ID (Auto-Generated if empty)</label>
                      <input
                        type="text"
                        placeholder="e.g. NUA/TCHR/2026/101"
                        value={regTeacherStaffId}
                        onChange={(e) => setRegTeacherStaffId(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Phone Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +234 812 345 6789"
                        value={regTeacherPhone}
                        onChange={(e) => setRegTeacherPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Emergency Contact Info *</label>
                      <input
                        type="text"
                        required
                        placeholder="Emergency contact name, relation, and phone (e.g. Jane Doe (Spouse) - 08012345678)"
                        value={regTeacherEmergencyContact}
                        onChange={(e) => setRegTeacherEmergencyContact(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">4. Academic Profile</h5>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Qualification *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. B.Sc. Ed, M.Sc. Mathematics"
                        value={regQualification}
                        onChange={(e) => setRegQualification(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Institution Attended *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. University of Ibadan"
                        value={regInstitutionAttended}
                        onChange={(e) => setRegInstitutionAttended(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Year Completed *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2018"
                        value={regYearCompleted}
                        onChange={(e) => setRegYearCompleted(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Years of Experience *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={regYearsOfExperience}
                        onChange={(e) => setRegYearsOfExperience(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Certification(s)</label>
                      <input
                        type="text"
                        placeholder="e.g. TRCN certified"
                        value={regProfessionalCertification}
                        onChange={(e) => setRegProfessionalCertification(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  {/* Academic Department / Subject Area tags */}
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Academic Department / Subject Area *</label>
                    <div className="flex gap-1.5 mb-2">
                      <input
                        type="text"
                        placeholder="Press Enter or Add to map (e.g. Mathematics)"
                        value={tempDeptInput}
                        onChange={(e) => setTempDeptInput(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (tempDeptInput.trim()) {
                              if (!regAcademicDepartments.includes(tempDeptInput.trim())) {
                                setRegAcademicDepartments([...regAcademicDepartments, tempDeptInput.trim()]);
                              }
                              setTempDeptInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempDeptInput.trim()) {
                            if (!regAcademicDepartments.includes(tempDeptInput.trim())) {
                              setRegAcademicDepartments([...regAcademicDepartments, tempDeptInput.trim()]);
                            }
                            setTempDeptInput('');
                          }
                        }}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition"
                      >
                        + Add
                      </button>
                    </div>
                    {regAcademicDepartments.length === 0 ? (
                      <p className="text-[10px] text-rose-500 italic font-semibold">Please assign at least one department/subject area.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border rounded-xl border-slate-200/50">
                        {regAcademicDepartments.map((dept, dIdx) => (
                          <span key={dIdx} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-650">
                            {dept}
                            <button
                              type="button"
                              onClick={() => setRegAcademicDepartments(regAcademicDepartments.filter(item => item !== dept))}
                              className="text-rose-500 hover:text-rose-700 font-extrabold cursor-pointer text-xs ml-1"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Faculty Biography Summary</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Master degree with 3 years high school tutorial experience."
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                </div>
              )}

              {/* SECTION D: PROFILE PICTURE HANDLES */}
              <div className="space-y-3 pt-1">
                <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest border-b pb-1">4. Photo & Avatar Selection</h5>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-4 justify-self-center">
                    <img
                      src={uploadedPhoto || selectedAvatarPreset || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-350 bg-slate-100"
                    />
                  </div>
                  <div className="sm:col-span-8">
                    <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Upload Photo (JPG / PNG)</label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const fileType = file.type;
                          if (!['image/jpeg', 'image/png'].includes(fileType)) {
                            setRegErrorMsg("Accepting only JPG, JPEG, and PNG image file types.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const img = new Image();
                            img.src = ev.target?.result as string;
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              canvas.width = 150;
                              canvas.height = 150;
                              const ctx = canvas.getContext('2d');
                              ctx?.drawImage(img, 0, 0, 150, 150);
                              setUploadedPhoto(canvas.toDataURL('image/jpeg', 0.8));
                              setSelectedAvatarPreset('');
                            };
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-[10px] text-slate-500 bg-slate-100 p-1 rounded-lg border border-dashed border-slate-300 outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-bold uppercase text-slate-400 mb-1 text-center">Or click to select a preset avatar</label>
                  <div className="grid grid-cols-6 gap-2">
                    {avatarPresets.map((preset, pIdx) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setSelectedAvatarPreset(preset);
                          setUploadedPhoto(null);
                        }}
                        className={`relative rounded-full overflow-hidden border-2 transition ${
                          selectedAvatarPreset === preset ? 'border-indigo-600 scale-105' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${pIdx + 1}`} className="w-8 h-8 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION E: LOGIN CREDENTIAL MANAGEMENT */}
              <div className="space-y-3 pt-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <h5 className="text-[10px] font-black uppercase text-indigo-650 tracking-widest flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-neutral-dark inline" /> 5. Account Security Credentials
                </h5>
                
                {/* Username Assignment */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-550">
                    <span>PORTAL USERNAME SETUP</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="usernameSetup"
                          checked={credUsernameType === 'auto'}
                          onChange={() => setCredUsernameType('auto')}
                        />
                        <span>System Auto</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="usernameSetup"
                          checked={credUsernameType === 'manual'}
                          onChange={() => setCredUsernameType('manual')}
                        />
                        <span>Custom Manual</span>
                      </label>
                    </div>
                  </div>

                  {credUsernameType === 'auto' ? (
                    <div className="text-[10px] text-slate-500 font-mono font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                      Preview: {regName ? `student_${regName.split(' ').slice(-1)[0]?.toLowerCase()}*` : 'Pending full name input...'}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. luke.skywalker.nua"
                      value={credManualUsername}
                      onChange={(e) => setCredManualUsername(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                  )}
                </div>

                {/* Password Assignment */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-550">
                    <span>TEMPORARY SYSTEM PASSWORD</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="passwordSetup"
                          checked={credPasswordType === 'auto'}
                          onChange={() => setCredPasswordType('auto')}
                        />
                        <span>System Auto</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="passwordSetup"
                          checked={credPasswordType === 'manual'}
                          onChange={() => setCredPasswordType('manual')}
                        />
                        <span>Custom Manual</span>
                      </label>
                    </div>
                  </div>

                  {credPasswordType === 'auto' ? (
                    <div className="text-[10px] text-[#A15C07] font-mono font-bold bg-[#FFF9F2] border border-amber-200 px-3 py-1.5 rounded-lg flex justify-between">
                      <span>Preview: temp_xxxx (Generated on save)</span>
                      <span className="text-[8px] uppercase tracking-wider bg-amber-100 text-amber-800 px-1 rounded-sm">TEMPORARY</span>
                    </div>
                  ) : (
                    <input
                      type="password"
                      placeholder="Enter security passcode key"
                      value={credManualPassword}
                      onChange={(e) => setCredManualPassword(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                  )}
                </div>

                {/* Force Change on First Login */}
                <label className="flex items-center gap-2 select-none cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={credForcePasswordChange}
                    onChange={(e) => setCredForcePasswordChange(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-[10px] font-bold text-slate-650 uppercase tracking-tight">Force credentials renewal on first login</span>
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer shadow-md select-none transition-colors"
                >
                  {isEditingUser ? 'Save Updates' : 'Register Member Listing'}
                </button>
                {isEditingUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingUser(false);
                      setEditingUserId(null);
                      setRegName('');
                      setRegEmail('');
                      setRegGuardianName('');
                      setRegGuardianPhone('');
                      setRegGuardianEmail('');
                      setRegBio('');
                      setUploadedPhoto(null);
                      setSelectedAvatarPreset('');
                      setRegHomeAddress('');
                      setRegEmergencyContactName('');
                      setRegEmergencyContactPhone('');
                      setRegStudentPhone('');
                      setCredManualUsername('');
                      setCredManualPassword('');
                      setCredForcePasswordChange(false);
                      setCredUsernameType('auto');
                      setCredPasswordType('auto');
                    }}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {regSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Member profile written to credentials database!
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    )}

        {/* Roster lists cards split */}
        <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              {/* Directory Tab Slider */}
              <div className="flex items-center justify-between border-b pb-2 select-none">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRosterTab('students');
                    }}
                    className={`font-extrabold text-[12.5px] uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                      activeRosterTab === 'students' ? 'text-[#1A365D] border-b-2 border-indigo-650' : 'text-slate-500 hover:text-slate-750'
                    }`}
                  >
                    Students Directory
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRosterTab('teachers');
                    }}
                    className={`font-extrabold text-[12.5px] uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                      activeRosterTab === 'teachers' ? 'text-[#1A365D] border-b-2 border-indigo-650' : 'text-slate-500 hover:text-slate-750'
                    }`}
                  >
                    Faculty Board
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRosterTab('parents');
                      // Reset parent editing state
                      setIsEditingParent(false);
                      setEditingParentId(null);
                    }}
                    className={`font-extrabold text-[12.5px] uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                      activeRosterTab === 'parents' ? 'text-[#1A365D] border-b-2 border-indigo-650' : 'text-slate-500 hover:text-slate-755'
                    }`}
                  >
                    Parents & Guardians
                  </button>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Registry Ledger
                </span>
              </div>

              {/* STUDENTS DIRECTORY ROUTER WITH LIVE SEARCH & FILTERS */}
              {activeRosterTab === 'students' && (
                <StudentDirectorySearch
                  students={students}
                  courses={courses}
                  selectedStudentId={selectedStudentId}
                  onInspect={(studentId) => {
                    setSelectedStudentId(studentId);
                    setSelectedTeacherId(null);
                  }}
                  onEdit={(st) => {
                    setIsEditingUser(true);
                    setEditingUserId(st.id);
                    setRegistryRole('student');
                    setRegName(st.name);
                    setRegEmail(st.email);
                    setRegGender(st.gender || 'Male');
                    setRegDOB(st.dateOfBirth || '');
                    setRegNationality(st.nationality || 'Nigeria');
                    setRegState(st.state || 'Lagos');
                    setRegLGA(st.lga || '');
                    setRegReligion(st.religion || 'Christianity');
                    setRegBloodGroup(st.bloodGroup || 'O+');
                    setRegMedicalNotes(st.medicalNotes || '');
                    setRegHomeAddress(st.homeAddress || '');
                    setRegGradeLevel(st.gradeLevel);
                    setRegGuardianName(st.guardianName || '');
                    setRegGuardianPhone(st.guardianPhone || '');
                    setRegGuardianEmail(st.guardianEmail || '');
                    setRegEmergencyContactName(st.emergencyContactName || '');
                    setRegEmergencyContactPhone(st.emergencyContactPhone || '');
                    setUploadedPhoto(st.passportPhoto || st.avatar || null);
                  }}
                  onDelete={(studentId) => {
                    if (selectedStudentId === studentId) setSelectedStudentId(null);
                    if (editingUserId === studentId) {
                      setIsEditingUser(false);
                      setEditingUserId(null);
                    }
                    removeStudent(studentId);
                  }}
                />
              )}

              {/* TEACHERS DIRECTORY WITH FILTER BY DEPARTMENT AND SUBJECTS */}
              {activeRosterTab === 'teachers' && (
                <div id="teacherDirList" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                  <div className="sm:col-span-1">
                    <label className="block text-[8px] font-bold text-slate-405 uppercase tracking-widest mb-0.5">Search Educator</label>
                    <div className="relative">
                      <Search className="w-3 h-3 absolute left-2 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Name/email..."
                        value={searchTeacherQuery}
                        onChange={(e) => setSearchTeacherQuery(e.target.value)}
                        className="w-full text-[10.5px] pl-6 pr-1 py-1 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-405 uppercase tracking-widest mb-0.5">Faculty Department</label>
                    <select
                      value={filterTeacherDept}
                      onChange={(e) => setFilterTeacherDept(e.target.value)}
                      className="w-full text-[10.5px] px-1 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                    >
                      <option value="All Departments">All Depts</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Sciences">Sciences</option>
                      <option value="Humanities">Humanities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-405 uppercase tracking-widest mb-0.5">Taught Subject</label>
                    <select
                      value={filterTeacherSubject}
                      onChange={(e) => setFilterTeacherSubject(e.target.value)}
                      className="w-full text-[10.5px] px-1 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                    >
                      <option value="All Subjects">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Literature">Literature</option>
                      <option value="History">History</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto pr-2">
                  {teachers
                    .filter((tc) => {
                      const matchesSearch = tc.name.toLowerCase().includes(searchTeacherQuery.toLowerCase()) || 
                                           tc.email.toLowerCase().includes(searchTeacherQuery.toLowerCase());
                      const matchesDept = filterTeacherDept === 'All Departments' || tc.department === filterTeacherDept;
                      const matchesSubject = filterTeacherSubject === 'All Subjects' || 
                                            (tc.subjects && tc.subjects.includes(filterTeacherSubject));
                      return matchesSearch && matchesDept && matchesSubject;
                    })
                    .map((tc) => {
                      const isAcctActive = tc.isActiveAccount !== false; // defaults to true
                      return (
                        <div key={tc.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={tc.avatar} alt="Avatar educator" className="w-9 h-9 object-cover rounded-full border border-slate-201" referrerPolicy="no-referrer" />
                              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${isAcctActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900 block">{tc.name}</span>
                                {!isAcctActive && (
                                  <span className="text-[7.5px] uppercase font-bold tracking-tight bg-rose-50 text-rose-600 px-1 rounded">SUSPENDED</span>
                                )}
                              </div>
                              <span className="text-[9.5px] text-slate-400 font-bold block">{tc.department} Department • ID: {tc.id}</span>
                              {tc.subjects && tc.subjects.length > 0 && (
                                <div className="flex gap-1 flex-wrap mt-1">
                                  {tc.subjects.map(sub => (
                                    <span key={sub} className="text-[7.5px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded">{sub}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 font-sans">
                            <button
                              onClick={() => {
                                setSelectedTeacherId(tc.id);
                                setSelectedStudentId(null);
                              }}
                              className="p-1.5 bg-slate-150 hover:bg-slate-200 rounded text-neutral-green hover:text-indigo-900 cursor-pointer transition-colors"
                              title="Inspect Educator Profile & Permissions"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingUser(true);
                                setEditingUserId(tc.id);
                                setRegistryRole('teacher');
                                setRegName(tc.name);
                                setRegEmail(tc.email);
                                setRegGender(tc.gender || 'Male');
                                setRegDOB(tc.dateOfBirth || '');
                                setRegNationality(tc.nationality || 'Nigeria');
                                setRegState(tc.state || 'Lagos');
                                setRegLGA(tc.lga || '');
                                setRegReligion(tc.religion || 'Christianity');
                                setRegBloodGroup(tc.bloodGroup || 'O+');
                                setRegMedicalNotes(tc.medicalNotes || '');
                                setRegHomeAddress(tc.homeAddress || tc.address || '');
                                setRegDepartment(tc.department);
                                setRegBio(tc.bio || '');
                                setUploadedPhoto(tc.avatar || null);

                                // Load new Teacher fields
                                setRegQualification(tc.qualification || '');
                                setRegInstitutionAttended(tc.institutionAttended || '');
                                setRegYearCompleted(tc.yearCompleted || '');
                                setRegYearsOfExperience(tc.yearsOfExperience?.toString() || '0');
                                setRegProfessionalCertification(tc.professionalCertification || '');
                                setRegAcademicDepartments(tc.academicDepartments || tc.subjects || [tc.department]);
                                setRegTeacherPhone(tc.phone || '');
                                setRegTeacherEmergencyContact(tc.emergencyContact || '');
                                setRegTeacherStaffId(tc.staffId || '');
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-205 rounded text-indigo-650 hover:text-indigo-805 cursor-pointer transition-colors"
                              title="Edit Registry Instructor Data"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (selectedTeacherId === tc.id) setSelectedTeacherId(null);
                                if (editingUserId === tc.id) {
                                  setIsEditingUser(false);
                                  setEditingUserId(null);
                                }
                                removeTeacher(tc.id);
                              }}
                              className="p-1.5 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-700 cursor-pointer transition-colors"
                              title="Delete Faculty Profile Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              )}

              {/* PARENTS DIRECTORY WITH LINKED STUDENTS AND ACCESS TOGGLE */}
              {activeRosterTab === 'parents' && (
                <div id="parentDirList" className="space-y-4 animate-fade-in font-sans">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Search Parents / Guardians</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by parent name, email, phone or address..."
                        value={searchParentQuery}
                        onChange={(e) => setSearchParentQuery(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto pr-2 font-sans">
                    {parents && parents
                      .filter((p) => {
                        const q = searchParentQuery.toLowerCase();
                        return (
                          p.name.toLowerCase().includes(q) ||
                          p.email.toLowerCase().includes(q) ||
                          (p.phone && p.phone.includes(q)) ||
                          (p.address && p.address.toLowerCase().includes(q))
                        );
                      })
                      .map((p) => {
                        const isParentActive = p.isActiveAccount !== false;
                        const linkedChildren = students.filter(s => p.studentIds?.includes(s.id)) || [];
                        return (
                          <div key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                            <div className="flex items-start gap-3">
                              <div className="relative shrink-0">
                                <img src={p.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'} alt="Avatar parent" className="w-10 h-10 object-cover rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${isParentActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900 block">{p.name}</span>
                                  {!isParentActive && (
                                    <span className="text-[7.5px] uppercase font-bold tracking-tight bg-rose-50 text-rose-600 px-1 rounded">DEACTIVATED</span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 font-semibold block font-mono">{p.email} • {p.phone}</span>
                                <span className="text-[9.5px] text-slate-400 block leading-tight">{p.address}</span>
                                
                                {/* Linked pupils list */}
                                {linkedChildren.length > 0 ? (
                                  <div className="flex gap-1.5 flex-wrap items-center mt-1.5 pt-1 border-t border-slate-100">
                                    <span className="text-[8px] text-slate-400 uppercase font-extrabold tracking-wider">Linked Children:</span>
                                    {linkedChildren.map(child => (
                                      <span key={child.id} className="text-[8.5px] font-bold bg-[#FAF9F5] border border-natural-beige text-[#1A365D] rounded px-1.5 py-0.5" title={`Admission: ${child.admissionNumber}`}>
                                        {child.name} ({child.gradeLevel})
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[8.5px] text-rose-500 font-bold block mt-1">⚠️ No pupils linked yet</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              {/* Edit details */}
                              <button
                                onClick={() => {
                                  setIsEditingParent(true);
                                  setEditingParentId(p.id);
                                  setParentFormName(p.name);
                                  setParentFormEmail(p.email);
                                  setParentFormPhone(p.phone);
                                  setParentFormPassword(p.password || 'parent123');
                                  setParentFormAddress(p.address || '');
                                  setParentFormCountry(p.nationality || 'Nigeria');
                                  setParentFormState(p.state || 'Lagos');
                                  setParentFormLGA(p.lga || 'Ikeja');
                                  setParentFormAvatar(p.avatar || '');
                                  setParentFormSelectedStudentIds(p.studentIds || []);
                                  setParentFormIsActive(p.isActiveAccount !== false);
                                  // Switch form header view dynamically
                                  setActiveRosterTab('parents');
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-indigo-600 cursor-pointer transition-colors"
                                title="Edit Parent details & passwords"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              {/* Activate/Deactivate Toggle */}
                              <button
                                onClick={() => {
                                  updateParent(p.id, { isActiveAccount: !isParentActive });
                                }}
                                className={`p-1 hover:opacity-90 rounded cursor-pointer transition-colors text-[8.5px] font-black uppercase tracking-wider px-2 py-1 select-none ${
                                  isParentActive ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                                title={isParentActive ? 'Deactivate parent account portal access' : 'Activate parent account portal access'}
                              >
                                {isParentActive ? 'Deactivate' : 'Activate'}
                              </button>

                              {/* Delete account */}
                              <button
                                onClick={() => {
                                  if (confirm(`Expel guardian "${p.name}" profile security card from active databases?`)) {
                                    if (editingParentId === p.id) {
                                      setIsEditingParent(false);
                                      setEditingParentId(null);
                                    }
                                    removeParent(p.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-700 cursor-pointer transition-colors"
                                title="Delete Guardian Profile"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    {(!parents || parents.length === 0) && (
                      <p className="text-xs text-slate-400 italic text-center py-6">No parent profiles recorded in the database ledger.</p>
                    )}
                  </div>
                </div>
              )}
              </div>
            </div>

          {/* Selected Student Records Inspector View */}
          {selectedStudentId && (() => {
            const stProfile = students.find((s) => s.id === selectedStudentId);
            if (!stProfile) return null;

            const inspectingBalance = Math.max(0, (stProfile.tuitionTotal || 4500) - (stProfile.tuitionPaid || 0));

            const handleAdminRegisterPayment = (e: React.FormEvent) => {
              e.preventDefault();
              const paymentAmt = parseFloat(adminPayAmountInput);
              if (isNaN(paymentAmt) || paymentAmt <= 0) {
                alert('Please provide a valid cash payment value.');
                return;
              }
              if (paymentAmt > inspectingBalance) {
                alert('Tender value cannot exceed the remaining balance.');
                return;
              }

              payTuition(stProfile.id, paymentAmt, adminPayMethod);
              setAdminPaySuccess(true);
              setTimeout(() => setAdminPaySuccess(false), 3000);
            };

            const toggleStudentAccountStatus = () => {
              const currentActive = stProfile.isActiveAccount !== false;
              updateStudent(stProfile.id, { isActiveAccount: !currentActive });
            };

            const toggleStudentForcePassword = () => {
              const currentForce = stProfile.forcePasswordChange === true;
              updateStudent(stProfile.id, { forcePasswordChange: !currentForce });
            };

            const handleUpdateStudentCredentials = (e: React.FormEvent) => {
              e.preventDefault();
              const targetUser = document.getElementById('inspectStUsername') as HTMLInputElement;
              const targetPass = document.getElementById('inspectStPassword') as HTMLInputElement;
              
              updateStudent(stProfile.id, {
                username: targetUser?.value || stProfile.username,
                password: targetPass?.value || stProfile.password
              });
              alert("Student security credentials successfully updated!");
            };

            return (
              <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-6 animate-fade-in font-sans">
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-widest block">ADMINISTRATIVE CORE ARCHIVE</span>
                    <h3 className="text-xl font-serif font-bold text-slate-100">{stProfile.name}'s Deep Profile & Credentials</h3>
                  </div>
                  <button
                    onClick={() => setSelectedStudentId(null)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content grids split */}
                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Part A: Comprehensive Biodata Sheet */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <h4 className="font-serif font-black text-slate-900 text-sm">Official Biodata Dossier Sheet</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Comprehensive registration parameters verified on {stProfile.joinedDate || '2026-05-22'}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">REGISTRATION IDENTIFIER</span>
                        <span className="font-mono font-bold text-slate-900">{stProfile.id}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">ADMISSION REFERENCE CODE</span>
                        <span className="font-mono font-bold text-slate-900">{stProfile.admissionNumber || 'NUA-26-4012'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">STUDENT GENDER CATEGORY</span>
                        <span className="font-bold text-slate-800">{stProfile.gender || 'Male'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">DATE OF BIRTH</span>
                        <span className="font-bold text-slate-800">{stProfile.dateOfBirth || '2009-02-14'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">CLASS PLACEMENT LEVEL</span>
                        <span className="font-bold text-slate-900">{stProfile.gradeLevel}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">NATIONALITY & REGIONAL STATE</span>
                        <span className="font-bold text-slate-800">{stProfile.nationality || 'Nigeria'} ({stProfile.state || 'Lagos'})</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">LOCAL GOV AREA (LGA) & RELIGION</span>
                        <span className="font-bold text-slate-800">{stProfile.lga || 'Ikeja'} • Religion: {stProfile.religion || 'Christianity'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">BLOOD GROUP & MEDICAL REGISTRY</span>
                        <span className="font-bold text-rose-600 font-semibold">Group: {stProfile.bloodGroup || 'O+'} • {stProfile.medicalNotes || 'None'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">GUARDIAN / PRIMARY CORRESPONDENT</span>
                        <span className="font-bold text-[#5A634A]">{stProfile.guardianName} ({stProfile.guardianEmail || 'parent@example.com'})</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">CORRESPONDENT TELEPHONE</span>
                        <span className="font-bold text-slate-900">{stProfile.guardianPhone || '+234 803 123 4567'}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">VERIFIED HOME ADDRESS LOCATION</span>
                        <span className="font-bold text-slate-700">{stProfile.homeAddress || '12 Alternative Route Lane, Preston'}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">EMERGENCY CONTACT PHONE</span>
                        <span className="font-bold text-slate-900">{stProfile.emergencyContactName || 'Robert Alvarez'} ({stProfile.emergencyContactPhone || 'None'})</span>
                      </div>
                    </div>

                    {/* Part B: Administrative Settle Tuition Payments Form */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-6">
                      <div className="md:col-span-2 space-y-1.5 self-center font-sans">
                        <h5 className="font-serif font-black text-xs text-slate-900">Administrative Tuition Registrar</h5>
                        <p className="text-[10.5px] leading-normal text-slate-500">Enter payments made in cash or bank wire to settle student balances manually.</p>
                      </div>
                      <form onSubmit={handleAdminRegisterPayment} className="md:col-span-3 grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">AMNT RECEIVED ($)</label>
                          <input
                            type="number"
                            required
                            min="1"
                            max={inspectingBalance}
                            value={adminPayAmountInput}
                            onChange={(e) => setAdminPayAmountInput(e.target.value)}
                            disabled={inspectingBalance <= 0}
                            placeholder="1000"
                            className="bg-white border border-slate-205 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 outline-none w-full"
                          />
                        </div>
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">PROCESS METHOD</label>
                          <select
                            value={adminPayMethod}
                            onChange={(e) => setAdminPayMethod(e.target.value as any)}
                            disabled={inspectingBalance <= 0}
                            className="bg-white border border-slate-250 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none w-full font-semibold"
                          >
                            <option value="Card">Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                          </select>
                        </div>
                        <div className="sm:col-span-12">
                          <button
                            type="submit"
                            disabled={inspectingBalance <= 0}
                            className="w-full py-2.5 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                          >
                            {inspectingBalance <= 0 ? 'FEE COMPLETELY CLEARED' : 'LOG TRANSACTION RECEIPT'}
                          </button>
                        </div>
                        {adminPaySuccess && (
                          <div className="sm:col-span-12 p-2 bg-emerald-50 text-[#5A634A] text-[10.5px] rounded border border-emerald-100 flex items-center gap-1.5 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                            Tuition indicators updated in the database registry!
                          </div>
                        )}
                      </form>
                    </div>

                    {/* Part C: Administrative Login Credential Manager */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h5 className="font-serif font-bold text-xs text-slate-900">Portal Security Console</h5>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">CREDENTIAL RESET, RECOVERY & SUSPENSION ENGINE</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={toggleStudentAccountStatus}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition ${
                              stProfile.isActiveAccount !== false
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {stProfile.isActiveAccount !== false ? '● Active: Enabled' : '○ Suspended: Disabled'}
                          </button>
                          <button
                            type="button"
                            onClick={toggleStudentForcePassword}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition ${
                              stProfile.forcePasswordChange === true
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {stProfile.forcePasswordChange === true ? 'Force Change On' : 'No Force Change'}
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleUpdateStudentCredentials} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block">SECURITY USERNAME</label>
                          <input
                            type="text"
                            id="inspectStUsername"
                            defaultValue={stProfile.username || `student_${stProfile.id.substring(0,6)}`}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none w-full font-mono"
                          />
                        </div>
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block">RESET PORTAL PASSWORD</label>
                          <input
                            type="text"
                            id="inspectStPassword"
                            defaultValue={stProfile.password || 'student123'}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none w-full font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2 self-end">
                          <button
                            type="submit"
                            className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg text-center cursor-pointer"
                          >
                            COMMIT CREDENTIALS
                          </button>
                        </div>
                      </form>
                    </div>

                  </div>

                  {/* Part D: Graphical Student Identity Card Generator & Printer */}
                  <div className="lg:col-span-4 space-y-5">
                    <div>
                      <h4 className="font-serif font-black text-slate-900 text-sm">Badge Printer Control</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Physical card generator engine for campus gating pass</p>
                    </div>

                    {/* ID Card Wrapper Graphic */}
                    <div className="bg-[#1A365D] border-4 border-[#C29B38] rounded-3xl p-5 text-white relative shadow-lg space-y-4 max-w-sm mx-auto select-none">
                      
                      {/* Badge Top Header */}
                      <div className="text-center border-b border-[#C29B38]/40 pb-3 flex items-center justify-center gap-2">
                        <div className="w-8 h-8 bg-white p-0.5 rounded-full flex items-center justify-center shadow-xs shrink-0">
                          <img 
                            src="/logo.png" 
                            alt="NUA Logo" 
                            className="w-7 h-7 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-left">
                          <h5 className="font-serif font-black tracking-wide text-[10.5px] leading-tight">NEW UNIQUE ACADEMY</h5>
                          <span className="text-[8px] tracking-widest text-[#C29B38] block uppercase font-bold leading-none">PRESTON ESTABLISHED 2012</span>
                        </div>
                      </div>

                      {/* Badge Body */}
                      <div className="flex flex-col items-center text-center space-y-3">
                        <img
                          src={stProfile.avatar}
                          alt="Badge passport student"
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-[#C29B38]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <span className="text-[8px] bg-[#C29B38] text-slate-900 px-3 py-0.5 rounded-full font-bold uppercase tracking-widest">
                            CAMPUS STUDENT PASS
                          </span>
                          <h4 className="text-sm font-black text-slate-100 tracking-wide mt-1.5">{stProfile.name}</h4>
                          <span className="text-[10px] text-teal-400 block font-mono font-semibold">
                            ID: {stProfile.admissionNumber || `NUA-26-${stProfile.id.substring(0,4).toUpperCase()}`}
                          </span>
                        </div>
                      </div>

                      {/* Badge Footer Grid details */}
                      <div className="bg-[#050D1A]/50 p-3 rounded-2xl border border-slate-850/50 grid grid-cols-2 gap-2 text-[10px] leading-normal text-slate-300">
                        <div>
                          <span className="block text-[7.5px] text-slate-400 font-bold uppercase">LEVEL GRADE</span>
                          <span className="text-slate-100 font-bold">{stProfile.gradeLevel}</span>
                        </div>
                        <div>
                          <span className="block text-[7.5px] text-slate-400 font-bold uppercase">ZONE VENUE</span>
                          <span className="text-slate-100 font-bold">Main Campus</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[7.5px] text-slate-400 font-bold uppercase">VERIFIED EMERGENCY TELEPHONE</span>
                          <span className="text-slate-100 font-bold">{stProfile.guardianPhone || '+234 803 123 4567'}</span>
                        </div>
                      </div>

                      <div className="text-center font-bold text-[8.5px] text-[#C29B38] uppercase tracking-widest pt-1 leading-none">
                        Academic Excellence is Our Pride
                      </div>

                    </div>

                    <button
                      onClick={() => window.print()}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-205 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-emerald-600" /> Print Official Student ID Badge
                    </button>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* Selected Teacher Core Assignment Board */}
          {selectedTeacherId && (() => {
            const tcProfile = teachers.find((t) => t.id === selectedTeacherId);
            if (!tcProfile) return null;

            // Form handler for assigning a new subject tag
            const handleAddSubjectTag = (e: React.FormEvent) => {
              e.preventDefault();
              const subjectInput = document.getElementById('newSubjectTagSelect') as HTMLSelectElement;
              const val = subjectInput?.value;
              if (val) {
                const currentSubjects = tcProfile.subjects || [];
                if (currentSubjects.includes(val)) {
                  alert("Subject is already registered on this teacher.");
                  return;
                }
                updateTeacher(tcProfile.id, {
                  subjects: [...currentSubjects, val]
                });
              }
            };

            // Remove a subject tag from teacher's portfolio
            const handleRemoveSubjectTag = (sub: string) => {
              const currentSubjects = tcProfile.subjects || [];
              updateTeacher(tcProfile.id, {
                subjects: currentSubjects.filter(s => s !== sub)
              });
            };

            // Unlink or Link teacherId on courses
            const handleToggleClassroomAssignment = (courseId: string) => {
              const course = courses.find(c => c.id === courseId);
              if (!course) return;

              if (course.teacherId === tcProfile.id) {
                // Unassign teacher
                updateCourse(courseId, { teacherId: '' });
              } else {
                // Assign teacher
                updateCourse(courseId, { teacherId: tcProfile.id });
              }
            };

            const toggleTeacherAccountStatus = () => {
              const currentActive = tcProfile.isActiveAccount !== false;
              updateTeacher(tcProfile.id, { isActiveAccount: !currentActive });
            };

            const toggleTeacherForcePassword = () => {
              const currentForce = tcProfile.forcePasswordChange === true;
              updateTeacher(tcProfile.id, { forcePasswordChange: !currentForce });
            };

            const handleUpdateTeacherCredentials = (e: React.FormEvent) => {
              e.preventDefault();
              const targetUser = document.getElementById('inspectTcUsername') as HTMLInputElement;
              const targetPass = document.getElementById('inspectTcPassword') as HTMLInputElement;
              
              updateTeacher(tcProfile.id, {
                username: targetUser?.value || tcProfile.username,
                password: targetPass?.value || tcProfile.password
              });
              alert("Teacher credentials successfully updated!");
            };

            return (
              <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-6 animate-fade-in font-sans">
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block">ADMINISTRATIVE COGNITIVE LEGER</span>
                    <h3 className="text-xl font-serif font-bold text-slate-100">{tcProfile.name}'s Academic Dossier</h3>
                  </div>
                  <button
                    onClick={() => setSelectedTeacherId(null)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Body */}
                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Column 1: Biodata & Subject Tags Assigner */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Part A: Profile Spec Grid */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 text-xs text-slate-700">
                      <div className="border-b pb-2">
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-700">1. Personal Information & Biodata</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Staff / Instructor ID</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">{tcProfile.staffId || tcProfile.id}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Full Name</span>
                          <span className="font-bold text-slate-800">{tcProfile.name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Gender</span>
                          <span className="font-bold text-slate-800">{tcProfile.gender || 'Not Specified'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Date of Birth</span>
                          <span className="font-bold text-slate-800">{tcProfile.dateOfBirth || 'Not Specified'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Nationality & State</span>
                          <span className="font-bold text-slate-800">{tcProfile.nationality || 'Nigeria'} {tcProfile.state ? `(${tcProfile.state} State)` : ''}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Primary phone number</span>
                          <span className="font-mono font-bold text-slate-800">{tcProfile.phone || 'Not Specified'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Email Address</span>
                          <span className="font-mono text-slate-800">{tcProfile.email}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Emergency Contact</span>
                          <span className="font-bold text-slate-800">{tcProfile.emergencyContact || 'Not Specified'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Home Street Address</span>
                          <span className="font-semibold text-slate-800">{tcProfile.address || tcProfile.homeAddress || 'Not Specified'}</span>
                        </div>
                      </div>

                      <div className="border-b pt-2 pb-2">
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-700">2. Academic Background & Credentials</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Qualification</span>
                          <span className="font-bold text-slate-900">{tcProfile.qualification || 'Not Specified'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Institution Attended</span>
                          <span className="font-bold text-indigo-750">{tcProfile.institutionAttended || 'Not Specified'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Year Completed</span>
                          <span className="font-mono font-bold text-slate-800">{tcProfile.yearCompleted || 'Not Specified'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Years of Teaching Experience</span>
                          <span className="font-bold text-slate-800">{tcProfile.yearsOfExperience !== undefined ? `${tcProfile.yearsOfExperience} years` : 'Not Specified'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Professional Certification(s)</span>
                          <span className="font-semibold text-teal-700">{tcProfile.professionalCertification || 'None'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Manual Departments & Subject Areas</span>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {(!tcProfile.academicDepartments || tcProfile.academicDepartments.length === 0) ? (
                              <span className="text-[10px] italic text-slate-400">No departments specified. Default: {tcProfile.department}</span>
                            ) : (
                              tcProfile.academicDepartments.map((dept, idx) => (
                                <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                  {dept}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 border-t pt-2.5">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Teacher Biography Excerpt</span>
                          <p className="font-bold text-slate-650 leading-normal">{tcProfile.bio || "No faculty biographical details configured yet."}</p>
                        </div>
                      </div>
                    </div>

                    {/* Part B: TEACHER SUBJECT PORTFOLIO ASSIGNMENTS */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                      <div>
                        <h5 className="font-serif font-bold text-xs text-slate-900">Academic Subject Specializations</h5>
                        <span className="text-[8.5px] text-slate-400 font-semibold uppercase tracking-wider">Configure which topics this teacher is certified to guide</span>
                      </div>

                      {/* Extant Subject Tags */}
                      <div className="flex gap-2 flex-wrap">
                        {(!tcProfile.subjects || tcProfile.subjects.length === 0) ? (
                          <span className="text-xs text-slate-400 bg-white border px-3 py-1 rounded-lg">No subjects assigned yet</span>
                        ) : (
                          tcProfile.subjects.map(sub => (
                            <span key={sub} className="flex items-center gap-1 bg-indigo-50 text-indigo-805 text-[11px] font-bold px-3 py-1 rounded-full border border-indigo-200">
                              {sub}
                              <button
                                type="button"
                                onClick={() => handleRemoveSubjectTag(sub)}
                                className="text-indigo-400 hover:text-indigo-800 font-extrabold cursor-pointer text-xs ml-1"
                                title="Revoke Subject Certification"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        )}
                      </div>

                      {/* Dropdown to add tag */}
                      <form onSubmit={handleAddSubjectTag} className="flex gap-2 max-w-sm">
                        <select
                          id="newSubjectTagSelect"
                          className="bg-white border border-slate-200 rounded-lg text-xs px-3 py-1 outline-none flex-1 font-semibold"
                        >
                          <option value="Mathematics">Mathematics</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Biology">Biology</option>
                          <option value="Literature">Literature</option>
                          <option value="History">History</option>
                        </select>
                        <button
                          type="submit"
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-lg transition"
                        >
                          ADD TAG
                        </button>
                      </form>
                    </div>

                    {/* Part C: TEACHER CLASSROOM ALLOCATIONS (ADMIN PERMISSION LINKER) */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                      <div>
                        <h5 className="font-serif font-bold text-xs text-[#1A365D]">Classrooms Course Assignments</h5>
                        <span className="text-[8.5px] text-slate-400 font-semibold uppercase tracking-wider">Allocate which classroom courses this educator commands directly</span>
                      </div>

                      <div className="divide-y divide-slate-150 max-h-[180px] overflow-y-auto bg-white border border-slate-200 rounded-xl px-4 py-1">
                        {courses.map(course => {
                          const isAssigned = course.teacherId === tcProfile.id;
                          return (
                            <div key={course.id} className="py-2.5 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-slate-900 block">{course.name} ({course.code})</span>
                                <span className="text-[9px] text-slate-400 font-medium tracking-wide">
                                  Days: {course.schedule?.days.join(', ') || 'N/A'} • Room: {course.room || 'Primary Venue'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleClassroomAssignment(course.id)}
                                className={`px-3 py-1 rounded-lg text-[9.5px] font-bold uppercase transition flex items-center gap-1 ${
                                  isAssigned
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-emerald-200'
                                    : 'bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-600 hover:text-indigo-700 hover:border-indigo-200'
                                }`}
                              >
                                {isAssigned ? '✓ Linked (Assignee)' : '+ Bind Classroom'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Part D: Portal Security Console for teacher */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h5 className="font-serif font-bold text-xs text-slate-905">Portal Security Console</h5>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">CREDENTIAL RESET, RECOVERY & SUSPENSION ENGINE</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={toggleTeacherAccountStatus}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition ${
                              tcProfile.isActiveAccount !== false
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {tcProfile.isActiveAccount !== false ? '● Active: Enabled' : '○ Suspended: Disabled'}
                          </button>
                          <button
                            type="button"
                            onClick={toggleTeacherForcePassword}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition ${
                              tcProfile.forcePasswordChange === true
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {tcProfile.forcePasswordChange === true ? 'Force Change On' : 'No Force Change'}
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleUpdateTeacherCredentials} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block">SECURITY USERNAME</label>
                          <input
                            type="text"
                            id="inspectTcUsername"
                            defaultValue={tcProfile.username || `teacher_${tcProfile.id.substring(0,6)}`}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none w-full font-mono font-bold"
                          />
                        </div>
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block">RESET PORTAL PASSWORD</label>
                          <input
                            type="text"
                            id="inspectTcPassword"
                            defaultValue={tcProfile.password || 'teacher123'}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none w-full font-mono font-bold"
                          />
                        </div>
                        <div className="sm:col-span-2 self-end">
                          <button
                            type="submit"
                            className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg text-center cursor-pointer"
                          >
                            COMMIT CREDENTIALS
                          </button>
                        </div>
                      </form>
                    </div>

                  </div>

                  {/* Column 2: Teacher Security Badge pass */}
                  <div className="lg:col-span-4 space-y-4">
                    <div>
                      <h4 className="font-serif font-black text-slate-905 text-sm">Badge Printer Control</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Physical card generator engine for campus gating pass</p>
                    </div>

                    {/* ID Card Wrapper Graphic */}
                    <div className="bg-[#1C202B] border-4 border-[#C29B38] rounded-3xl p-5 text-white relative shadow-lg space-y-4 max-w-sm mx-auto select-none font-sans">
                      
                      {/* Badge Top Header */}
                      <div className="text-center border-b border-[#C29B38]/40 pb-3 flex items-center justify-center gap-2">
                        <div className="w-8 h-8 bg-white p-0.5 rounded-full flex items-center justify-center shadow-xs shrink-0">
                          <img 
                            src="/logo.png" 
                            alt="NUA Logo" 
                            className="w-7 h-7 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-left">
                          <h5 className="font-serif font-black tracking-wide text-[10.5px] leading-tight">NEW UNIQUE ACADEMY</h5>
                          <span className="text-[8px] tracking-widest text-[#C29B38] block uppercase font-bold leading-none">PRESTON ESTABLISHED 2012</span>
                        </div>
                      </div>

                      {/* Badge Body */}
                      <div className="flex flex-col items-center text-center space-y-3">
                        <img
                          src={tcProfile.avatar}
                          alt="Badge passport teacher"
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-[#C29B38]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <span className="text-[8px] bg-indigo-600 text-white px-3 py-0.5 rounded-full font-bold uppercase tracking-widest">
                            CAMPUS FACULTY PASS
                          </span>
                          <h4 className="text-sm font-black text-slate-105 tracking-wide mt-1.5">{tcProfile.name}</h4>
                          <span className="text-[10px] text-teal-400 block font-mono font-semibold">
                            STAFF ID: {tcProfile.id.substring(0,8).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Badge Footer Grid details */}
                      <div className="bg-[#0D111A]/60 p-3 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2 text-[10px] leading-normal text-slate-300">
                        <div>
                          <span className="block text-[7.5px] text-slate-400 font-bold uppercase">PRIMARY DEPT</span>
                          <span className="text-slate-100 font-bold">{tcProfile.department}</span>
                        </div>
                        <div>
                          <span className="block text-[7.5px] text-slate-400 font-bold uppercase">ACCESS CLEARANCE</span>
                          <span className="text-slate-100 font-bold text-teal-400 font-extrabold">All Zones</span>
                        </div>
                      </div>

                      <div className="text-center font-bold text-[8.5px] text-[#C29B38] uppercase tracking-widest pt-1 leading-none">
                        Instructing Minds, Changing Spheres
                      </div>

                    </div>

                    <button
                      onClick={() => window.print()}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-205 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-[#C29B38]" /> Print Faculty Pass ID
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. MANAGE CLASSROOMS TAB */}
      {activeTab === 'courses' && (
        <ClassroomSubjectManager />
      )}

      {/* 4. CALENDAR SCHEDULING TAB */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create event Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h4 className="font-extrabold text-slate-950 text-sm">Coordinate School Public Event</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Add calendar item shown inside core portals and public web pages</span>
            </div>

            <form onSubmit={handleRegisterEvent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sports Day Meet"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Timing Hour</label>
                  <input
                    type="text"
                    placeholder="e.g. 9:00 AM - 4:00 PM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700"
                  >
                    <option value="academic">Academic</option>
                    <option value="holiday">Holiday</option>
                    <option value="sports">Sports Day</option>
                    <option value="arts">Creative Arts</option>
                    <option value="excursion">Excursion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Location Campus</label>
                  <input
                    type="text"
                    placeholder="e.g. Auditorium Hall"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Public Description Detail</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell students or visitors details..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer shadow-md shadow-teal-600/10"
              >
                Schedule Campus Event Detail
              </button>

              {eventSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 animate-pulse" /> School public registries calendar updated.
                </div>
              )}
            </form>
          </div>

          {/* List of current events designed */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm">Upcoming Calendars Event Lists ({events.length})</h4>
            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto pr-1">
              {events.map((evItem) => (
                <div key={evItem.id} className="py-4 hover:bg-slate-50/40 rounded-lg px-2 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{evItem.type}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{evItem.date}</span>
                    </div>
                    <span className="font-extrabold text-slate-910 block text-xs">{evItem.title}</span>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{evItem.description}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{evItem.time || 'All Day'} • Location: {evItem.location}</p>
                  </div>
                  <button
                    onClick={() => deleteEvent(evItem.id)}
                    className="p-1.5 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-700 cursor-pointer shrink-0"
                    title="Cancel Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. FEE CONFIGURATION & PAYMENT GATEWAY SETTINGS TAB */}
      {activeTab === 'billing' && (
        <div className="space-y-8 font-sans animate-fade-in">
          {/* Header Dashboard Metrics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div>
              <h3 className="text-lg font-serif font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Bursar Financial Records & Gateway Protocols
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">
                Establish tuition dues, configure instant APIs, authorize gateway countries, and supervise transactions
              </p>
            </div>
            
            {/* Tab Swappers */}
            <div className="flex gap-2 bg-slate-100 p-1 border border-slate-200 rounded-xl shrink-0 select-none">
              <button
                type="button"
                onClick={() => setBillingSubTab('gateways')}
                className={`px-4 py-2 font-bold text-[10.5px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  billingSubTab === 'gateways' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5 inline mr-1" />
                Gateways API Setup
              </button>
              <button
                type="button"
                onClick={() => setBillingSubTab('categories')}
                className={`px-4 py-2 font-bold text-[10.5px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  billingSubTab === 'categories' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5 inline mr-1" />
                Fee Catalog Config
              </button>
              <button
                type="button"
                onClick={() => setBillingSubTab('transactions')}
                className={`px-4 py-2 font-bold text-[10.5px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  billingSubTab === 'transactions' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5 inline mr-1" />
                Bursar Ledger Reports
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Cumulative Dues paid */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-mono">Gross Bursar Balance Ledger</span>
              <p className="text-2xl font-serif font-black text-emerald-750">
                ${paymentRecords.reduce((acc, r) => acc + (r.amountPaid), 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block bg-emerald-50 px-2 py-0.5 rounded w-fit">
                ● Fully Escrow Audited
              </span>
            </div>
            {/* Card 2: Ledger Logs */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-mono font-bold">Total Successful Settlements</span>
              <p className="text-2xl font-serif font-black text-slate-905">
                {paymentRecords.length} Invoice Logs
              </p>
              <span className="text-[10px] text-slate-500 block">Across standard students grade categories</span>
            </div>
            {/* Card 3: Active processors */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-mono font-bold">Active Gateway Links</span>
              <p className="text-2xl font-serif font-black text-slate-905">
                {paymentMethods?.filter(pm => pm.isEnabled).length} Enabled
              </p>
              <span className="text-[10px] text-emerald-700 block font-semibold">
                Default: {paymentMethods?.find(pm => pm.isDefault)?.name.split(' (')[0] || 'None'}
              </span>
            </div>
            {/* Card 4: Country Coverage */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-mono font-bold">Regional Inbound Security</span>
              <p className="text-2xl font-serif font-black text-slate-905">
                Global Range
              </p>
              <span className="text-[10px] text-indigo-750 font-bold block bg-indigo-50 px-2 py-0.5 rounded w-fit">
                GeoIP Verified Restrictions
              </span>
            </div>
          </div>

          {/* SUB-PAGES RENDER */}
          
          {/* SUB-TAB A: GATEWAYS API SETUP */}
          {billingSubTab === 'gateways' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side: Gateways Grid Checklist */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div>
                    <h4 className="font-extrabold text-slate-910 text-sm">Secured Multi-Gateway Directory</h4>
                    <p className="text-[11px] text-slate-400">Configure public payment options made accessible to guardians on checkouts</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {paymentMethods?.map((pm) => {
                      const isDefault = pm.isDefault;
                      const hasRestrictions = pm.restrictedCountries && pm.restrictedCountries.length > 0;
                      
                      return (
                        <div 
                          key={pm.id} 
                          className={`border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-xs bg-slate-50/50 ${
                            pm.isEnabled ? 'border-slate-200' : 'border-slate-100 opacity-60'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded font-mono ${
                                pm.type === 'primary' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {pm.type} METHOD
                              </span>
                              
                              <div className="flex items-center gap-2">
                                {/* Toggle switch */}
                                <button
                                  type="button"
                                  onClick={() => updatePaymentMethod(pm.id, { isEnabled: !pm.isEnabled })}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                    pm.isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                                      pm.isEnabled ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>

                            <h5 className="font-extrabold text-slate-900 text-xs tracking-tight">{pm.name}</h5>
                            
                            {/* Key parameters */}
                            <div className="text-[11px] text-slate-400 space-y-1 bg-white p-2.5 border border-slate-100 rounded-lg">
                              <p className="flex justify-between items-center">
                                <span className="font-semibold text-slate-400">Default Primary Trigger:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (pm.isEnabled) {
                                      updatePaymentMethod(pm.id, { isDefault: true });
                                    } else {
                                      alert("Enable the payment method first before setting as default.");
                                    }
                                  }}
                                  className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                                    isDefault 
                                      ? 'bg-indigo-600 text-white border-indigo-700' 
                                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-650 hover:bg-slate-100'
                                  }`}
                                >
                                  {isDefault ? '● Set Default' : '○ Set as Default'}
                                </button>
                              </p>
                              
                              <p className="flex justify-between items-center pt-1 border-t border-slate-50">
                                <span className="font-semibold text-slate-400">API Key Mask:</span>
                                <span className="font-mono text-[10px] font-bold text-slate-600">
                                  {pm.apiKey ? `${pm.apiKey.slice(0, 10)}...` : 'Not Configured'}
                                </span>
                              </p>
                              
                              <p className="flex justify-between items-center">
                                <span className="font-semibold text-slate-400">Geo Restrictions:</span>
                                <span className="text-[10px] font-bold text-slate-705">
                                  {hasRestrictions ? pm.restrictedCountries.join(', ') : 'Global (No limit)'}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingGatewayId(pm.id);
                                setGwApiKey(pm.apiKey || '');
                                setGwApiSecret(pm.apiSecret || '');
                                setGwCountries(pm.restrictedCountries?.join(', ') || '');
                                setGwEnabled(pm.isEnabled);
                                setGwIsDefault(pm.isDefault);
                              }}
                              className="w-full text-[10.5px] font-extrabold pb-2 pt-2 uppercase tracking-wide bg-slate-100 hover:bg-slate-200 hover:text-indigo-805 text-indigo-700 rounded-lg text-center transition cursor-pointer flex justify-center items-center gap-1.5"
                            >
                              <Settings className="w-3.5 h-3.5" /> Adjust Credentials
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Side: Gateway Credentials Editor Form Block */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 animate-fade-in">
                {editingGatewayId ? (() => {
                  const targetMethod = paymentMethods.find(p => p.id === editingGatewayId);
                  if (!targetMethod) return null;

                  return (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const countryArray = gwCountries
                          ? gwCountries.split(',').map(c => c.trim()).filter(Boolean)
                          : [];
                        
                        updatePaymentMethod(editingGatewayId, {
                          apiKey: gwApiKey,
                          apiSecret: gwApiSecret,
                          restrictedCountries: countryArray,
                          isEnabled: gwEnabled,
                          isDefault: gwIsDefault
                        });
                        
                        setEditingGatewayId(null);
                        alert(`Gateway credentials successfully updated for ${targetMethod.name}!`);
                      }}
                      className="space-y-4 font-sans"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <div>
                          <h4 className="font-extrabold text-slate-905 text-sm">Gateways SDK Config</h4>
                          <span className="text-[9px] uppercase font-bold text-indigo-650 tracking-wider font-mono block mt-0.5">{targetMethod.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingGatewayId(null)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold uppercase text-slate-405">Processor Public API Key / Client ID</label>
                        <input
                          type="text"
                          value={gwApiKey}
                          onChange={(e) => setGwApiKey(e.target.value)}
                          placeholder="e.g. pk_live_5544..."
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold uppercase text-slate-405">Processor Secret API Key / Private ID</label>
                        <input
                          type="password"
                          value={gwApiSecret}
                          onChange={(e) => setGwApiSecret(e.target.value)}
                          placeholder="••••••••••••••••••••••••"
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold uppercase text-slate-405">Restrict By Country (Comma Separated)</label>
                        <input
                          type="text"
                          value={gwCountries}
                          onChange={(e) => setGwCountries(e.target.value)}
                          placeholder="e.g. China, Hong Kong, Nigeria"
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                        />
                        <p className="text-[9px] text-slate-400 leading-normal">
                          Leave empty to mark as global status. Guardian browser Geo-IP will be inspected at parent portal billing checks.
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Live Ingress System</span>
                          <span className="text-[10px] font-extrabold text-slate-700">{gwEnabled ? '● Securely Online' : '○ Disabled'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setGwEnabled(!gwEnabled)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            gwEnabled ? 'bg-indigo-650' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              gwEnabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Primary Preset</span>
                          <span className="text-[10px] font-extrabold text-slate-700">{gwIsDefault ? '● Set Default Method' : '○ Standby Method'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setGwIsDefault(!gwIsDefault)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            gwIsDefault ? 'bg-indigo-650' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              gwIsDefault ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-indigo-650 hover:bg-slate-905 text-white font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer"
                        >
                          Save Credentials Setup
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingGatewayId(null)}
                          className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-705 font-bold uppercase text-xs tracking-wider rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  );
                })() : (
                  <div className="text-center p-8 border-2 border-dashed border-slate-150 rounded-2xl select-none">
                    <Settings className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-spin-slow" />
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Adjustment Panel Standby</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Select "Adjust Credentials" on any primary or additional payment method block card to edit instant keys, geo limits, and presets config.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB B: FEE CATALOG CONFIG */}
          {billingSubTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side: Create/Edit Category form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-950 text-sm">
                    {isEditingCategory ? 'Modify Core Fee Parameters' : 'Register New School Fee Category'}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {isEditingCategory ? 'Update active parameters for student invoices' : 'Instantly bill active student classes'}
                  </span>
                </div>

                <form onSubmit={handleRegisterCategory} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-bold">Fee Item name *</label>
                    <select
                      value={catNameInput}
                      onChange={(e) => setCatNameInput(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-750"
                      required
                    >
                      <option value="">Select Category Title Template...</option>
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Examination Fee">Examination Fee</option>
                      <option value="Registration Fee">Registration Fee</option>
                      <option value="Transport Fee">Transport Fee</option>
                      <option value="Hostel Fee">Hostel Fee</option>
                      <option value="Sports Fee">Sports Fee</option>
                      <option value="Books Fee">Books Fee</option>
                      <option value="Other Fees">Other Fees</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-bold">Amount Due (USD) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 500"
                        value={catAmountInput}
                        onChange={(e) => setCatAmountInput(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-sans font-bold">Applies to Class Range *</label>
                      <select
                        value={catApplicableInput}
                        onChange={(e) => setCatApplicableInput(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-[#1A365D]"
                      >
                        <option value="All">All Classes</option>
                        {courses.filter(c => c.isActive !== false).map((cls) => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-bold">Settlement Deadline Date *</label>
                    <input
                      type="date"
                      required
                      value={catDeadlineInput}
                      onChange={(e) => setCatDeadlineInput(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2 select-none">
                    <input
                      type="checkbox"
                      id="comp_check_ad"
                      checked={catCompulsoryInput}
                      onChange={(e) => setCatCompulsoryInput(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <label htmlFor="comp_check_ad" className="text-[11px] font-semibold text-slate-600 cursor-pointer">
                      Mark as Mandatory Compulsory Clearing (Block results release if unpaid)
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-indigo-600 hover:bg-slate-905 text-white font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer shadow-md transition"
                    >
                      {isEditingCategory ? 'Update core category' : 'Publish Fee Category'}
                    </button>
                    {isEditingCategory && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingCategory(false);
                          setEditingCategoryId(null);
                          setCatNameInput('');
                          setCatAmountInput('');
                          setCatDeadlineInput('');
                          setCatApplicableInput('All');
                          setCatCompulsoryInput(true);
                        }}
                        className="px-4 py-3 bg-slate-100 text-slate-700 font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {catSuccessMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 animate-bounce" /> {catSuccessMsg}
                    </div>
                  )}
                </form>
              </div>

              {/* Right Side: Active general billed lists */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-905 text-sm">Active School Invoiced Fee Items ({paymentCategories.length})</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">These fee items are automatically published inside parent payment portfolios</p>
                </div>

                <div className="divide-y divide-slate-100">
                  {paymentCategories.map(cat => {
                    const mappedApplies = cat.appliesToClass;
                    return (
                      <div key={cat.id} className="py-4 hover:bg-slate-50/20 px-2 rounded-xl flex items-center justify-between gap-4 transition duration-200">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm">{cat.name}</span>
                            <span className={`text-[8.5px] uppercase font-bold tracking-wider font-mono px-2 py-0.5 rounded ${
                              cat.isCompulsory ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {cat.isCompulsory ? 'Mandatory' : 'Optional Extra'}
                            </span>
                          </div>
                          
                          <p className="text-[10.5px] text-slate-405 leading-relaxed mt-1 font-medium select-none">
                            Deadline Target: <strong className="text-slate-700 font-bold font-mono">{cat.deadline}</strong> • Applies to: <strong className="text-indigo-650 font-bold uppercase">{mappedApplies}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-serif font-black text-slate-910 text-md">${cat.amount}</span>
                          
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingCategory(true);
                                setEditingCategoryId(cat.id);
                                setCatNameInput(cat.name);
                                setCatAmountInput(String(cat.amount));
                                setCatDeadlineInput(cat.deadline);
                                setCatApplicableInput(cat.appliesToClass || 'All');
                                setCatCompulsoryInput(cat.isCompulsory);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-indigo-650 cursor-pointer"
                              title="Edit Category parameters"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                deletePaymentCategory(cat.id);
                                alert('Fee item has been successfully deregistered!');
                              }}
                              className="p-1.5 hover:bg-rose-50 rounded text-rose-550 hover:text-rose-750 cursor-pointer"
                              title="Delete catalog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {paymentCategories.length === 0 && (
                    <p className="text-center text-slate-400 py-12 italic text-xs">No active tuition schedules published.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB C: BURSAR LEDGER REPORTS */}
          {billingSubTab === 'transactions' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-extrabold text-slate-905 text-sm">Escrow Financial Auditing Ledger</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Inspecting historical transaction receipts issued by gateway APIs</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:max-w-[265px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search Pupil Name / Ref..."
                      value={gwSearchTerm}
                      onChange={(e) => setGwSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white font-semibold text-slate-700"
                    />
                  </div>
                  
                  <select
                    value={gwFilterType}
                    onChange={(e) => setGwFilterType(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none"
                  >
                    <option value="All">All Methods Options</option>
                    <option value="Card">Visa / Mastercard / Verve</option>
                    <option value="Bank Transfer">Bank Wire Transfer</option>
                    <option value="PayPal">PayPal Checkout</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="AliPay">AliPay+</option>
                    <option value="Opay">Opay Wallet</option>
                  </select>
                </div>
              </div>

              {/* Transactions list */}
              <div className="overflow-x-auto text-[#1A365D]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4 text-slate-400">Receipt Ref ID</th>
                      <th className="py-3 px-4 text-slate-400">Pupil Student</th>
                      <th className="py-3 px-4 text-slate-400">Invoice Category</th>
                      <th className="py-3 px-4 text-slate-400">Method Protocol</th>
                      <th className="py-3 px-4 text-slate-400">Authorized Date</th>
                      <th className="py-3 px-4 text-slate-400 font-mono">Doc File</th>
                      <th className="py-3 px-4 text-slate-400">Audit Verification Status</th>
                      <th className="py-3 px-4 text-right text-slate-400">Tender Sum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {paymentRecords
                      ?.filter(rec => {
                        const studentObj = students.find(s => s.id === rec.studentId);
                        const parentObj = parents.find(p => p.id === rec.parentId);
                        
                        const textMatch = gwSearchTerm
                          ? (studentObj?.name?.toLowerCase().includes(gwSearchTerm.toLowerCase()) ||
                             parentObj?.name?.toLowerCase().includes(gwSearchTerm.toLowerCase()) ||
                             rec.referenceId?.toLowerCase().includes(gwSearchTerm.toLowerCase()) ||
                             rec.receiptNo?.toLowerCase().includes(gwSearchTerm.toLowerCase()))
                          : true;

                        const methodMatch = gwFilterType === 'All'
                          ? true
                          : rec.method?.toLowerCase().includes(gwFilterType.toLowerCase());

                        return textMatch && methodMatch;
                      })
                      .map((rec) => {
                        const sObj = students.find(s => s.id === rec.studentId);
                        const statusVal = rec.status || 'Approved';

                        return (
                          <tr key={rec.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-[11px] font-bold text-slate-905 block">{rec.receiptNo}</span>
                              <span className="text-[9px] text-slate-400 font-bold font-mono uppercase">{rec.referenceId}</span>
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-slate-800">
                              {sObj ? sObj.name : 'Unknown Pupil'}
                              <span className="text-[9.5px] font-medium text-slate-450 block uppercase tracking-wider font-mono">{sObj?.gradeLevel || 'External Class'}</span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-650">{rec.categoryName}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-full text-[9.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/60 inline-flex items-center gap-1 uppercase select-none font-mono">
                                <CreditCard className="w-3 h-3 text-[#C29B38]" /> {rec.method}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{rec.date}</td>
                            
                            {/* Receipt Proof Attachment */}
                            <td className="py-3.5 px-4">
                              {rec.receiptImage ? (
                                <button
                                  type="button"
                                  onClick={() => setViewingAttachment(rec.receiptImage || null)}
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 leading-none"
                                >
                                  <FileText className="w-3.5 h-3.5" /> View Proof
                                </button>
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">None Provided</span>
                              )}
                            </td>

                            {/* Verification Audits Status / Controls */}
                            <td className="py-3.5 px-4">
                              {statusVal === 'Pending Verification' ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Approve payment settlement of ${rec.currency === 'NGN' ? '₦' : '$'}${rec.amountPaid.toLocaleString()}? This updates student balances.`)) {
                                        updatePaymentRecord(rec.id, { status: 'Approved' });
                                        alert('Transaction approved and tuition record updated successfully!');
                                      }
                                    }}
                                    className="p-1 px-2.5 bg-emerald-100 hover:bg-emerald-250 border border-emerald-300 rounded-lg text-emerald-800 font-bold text-[10px] cursor-pointer flex items-center gap-1 transition"
                                    title="Approve Settlement"
                                  >
                                    <Check className="w-3 h-3 text-emerald-600 shrink-0" /> Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectionRecordId(rec.id);
                                      setRejectionCommentStr('');
                                    }}
                                    className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg text-rose-800 font-bold text-[10px] cursor-pointer flex items-center gap-1 transition"
                                    title="Reject Claim"
                                  >
                                    <X className="w-3 h-3 text-rose-650 shrink-0" /> Reject
                                  </button>
                                </div>
                              ) : statusVal === 'Approved' ? (
                                <span className="p-1 px-2.5 bg-emerald-50 text-emerald-800 font-black text-[9px] uppercase tracking-wider rounded-lg border border-emerald-250 leading-none inline-block font-mono">
                                  ✓ Cleared Settled
                                </span>
                              ) : (
                                <div className="space-y-1">
                                  <span className="p-1 px-2.5 bg-rose-50 text-rose-850 font-black text-[9px] uppercase tracking-wider rounded-lg border border-rose-250 leading-none inline-block font-mono">
                                    ✕ Claims Rejected
                                  </span>
                                  {rec.adminComment && (
                                    <p className="text-[9.5px] text-rose-700 italic max-w-[155px] truncate font-medium block" title={rec.adminComment}>
                                      "{rec.adminComment}"
                                    </p>
                                  )}
                                </div>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right font-serif font-black text-emerald-700 text-sm">
                              {rec.currency === 'NGN' ? `₦${(rec.amountPaid * 1500).toLocaleString()}` : `$${rec.amountPaid}`}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {paymentRecords.length === 0 && (
                  <div className="text-center py-12 text-slate-400 italic">No historical treasury settlements recorded.</div>
                )}

                {/* VIEW IMAGE PROOF MODAL OVERLAY */}
                {viewingAttachment && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-2xl w-full border border-slate-200 space-y-4 font-sans">
                      <div className="flex justify-between items-center border-b pb-2 border-slate-100">
                        <h4 className="font-serif font-black text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                          <FileText className="w-4 h-4 text-indigo-600" /> Payment Proof Audit Attachment
                        </h4>
                        <button
                          type="button"
                          onClick={() => setViewingAttachment(null)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 font-bold text-xs"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="max-h-[460px] overflow-auto border border-slate-100 rounded-2xl bg-slate-50 flex items-center justify-center p-2">
                        {viewingAttachment.startsWith('data:application/pdf') ? (
                          <div className="text-center py-12 space-y-3">
                            <FileText className="w-16 h-16 text-rose-600 mx-auto" />
                            <p className="text-xs font-bold text-slate-600">Attached PDF Document</p>
                            <a
                              href={viewingAttachment}
                              download="payment_proof_receipt.pdf"
                              className="inline-block p-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Download PDF File
                            </a>
                          </div>
                        ) : (
                          <img src={viewingAttachment} alt="Payment Proof Attachment Document" className="max-w-full h-auto object-contain rounded-xl max-h-[400px]" />
                        )}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setViewingAttachment(null)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                        >
                          Close Document Preview
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* WRITE REJECTION COMMENTS STATE MODAL */}
                {rejectionRecordId && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200 space-y-4 font-sans text-left">
                      <div className="space-y-1">
                        <h4 className="font-serif font-extrabold text-slate-850 text-xs uppercase tracking-wide">Disapprove Settlement Claim</h4>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-tight">Provide formal feedback narrative for client notification</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[8.5px] uppercase font-bold text-slate-450 tracking-wider">Rejection narrative comments *</label>
                        <textarea
                          required
                          value={rejectionCommentStr}
                          onChange={(e) => setRejectionCommentStr(e.target.value)}
                          className="w-full text-xs p-3 border rounded-xl outline-none focus:border-rose-450 bg-slate-50 focus:bg-white text-slate-700 placeholder-slate-400 font-medium"
                          rows={4}
                          placeholder="Please formulate comments here to explain details of payment claim rejection (e.g. Inconsistent base64 screenshot file, uncredited transfer ledger mismatch, etc...)"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => setRejectionRecordId(null)}
                          className="px-3.5 py-2 hover:bg-slate-100 rounded-lg text-slate-500 font-bold cursor-pointer"
                        >
                          CANCEL
                        </button>
                        <button
                          type="button"
                          disabled={!rejectionCommentStr.trim()}
                          onClick={() => {
                            updatePaymentRecord(rejectionRecordId, {
                              status: 'Rejected',
                              adminComment: rejectionCommentStr
                            });
                            alert('Transaction claim rejected successfully with feedback notes compiled.');
                            setRejectionRecordId(null);
                          }}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg disabled:opacity-50 cursor-pointer border-none"
                        >
                          CONFIRM REJECTION
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'quiz' && (
        <CBTQuizManagement />
      )}
    </div>
  );
}

