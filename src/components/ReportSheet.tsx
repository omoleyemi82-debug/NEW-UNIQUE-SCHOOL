import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student, Course, GradeRecord, AttendanceRecord } from '../types';
import { 
  Printer, Download, Sparkles, CheckCircle, Search, Save, 
  Edit, RefreshCw, X, Check, Award, ShieldAlert, BookOpen, 
  User, Calendar, Info, FileText, Settings, Upload, Image as ImageIcon,
  CheckCircle2, HelpCircle, Lock, Unlock
} from 'lucide-react';
import { getWAECGrade, calculateTermPerformance } from '../utils/gradeUtils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Sample stable avatars for student photos
const SAMPLE_PASSPORTS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',
];

interface ReportSheetProps {
  initialStudentId?: string;
  isReadOnly?: boolean;
}

// Local grading scale based strictly on user requirement:
// 70–100 = A (Excellent)
// 59–69 = B (Good)
// 45–58 = C (Average)
// 0–44 = E (Poor)
const getNUA_Grade = (percentage: number) => {
  if (percentage >= 70) {
    return { grade: 'A', desc: 'Excellent', colorClass: 'text-emerald-800 font-extrabold', bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-900' };
  }
  if (percentage >= 59) {
    return { grade: 'B', desc: 'Good', colorClass: 'text-indigo-805 font-bold', bgClass: 'bg-indigo-50 border-indigo-200 text-indigo-900' };
  }
  if (percentage >= 45) {
    return { grade: 'C', desc: 'Average', colorClass: 'text-amber-800 font-semibold', bgClass: 'bg-amber-50 border-amber-200 text-amber-900' };
  }
  return { grade: 'E', desc: 'Poor', colorClass: 'text-rose-800 font-bold', bgClass: 'bg-rose-50 border-rose-200 text-rose-950' };
};

export default function ReportSheet({ initialStudentId, isReadOnly = false }: ReportSheetProps) {
  const { 
    students, 
    courses, 
    grades, 
    attendance, 
    updateStudent,
    currentRole 
  } = useSchool();

  // Role permissions
  const canEdit = !isReadOnly && (currentRole === 'admin' || currentRole === 'teacher');

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('1st Term 2026');
  const [selectedSession, setSelectedSession] = useState<string>('2025/2026');
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'view' | 'edit'>('view');

  // Overrides & Metadata parameters
  const [termOpenedDays, setTermOpenedDays] = useState<number>(120);
  const [termPresentDays, setTermPresentDays] = useState<number>(115);
  const [termAbsentDays, setTermAbsentDays] = useState<number>(5);
  const [nextTermBegins, setNextTermBegins] = useState<string>('2026-09-14');
  const [vacationDate, setVacationDate] = useState<string>('2026-07-24'); // Vacation date field
  const [classTeacherName, setClassTeacherName] = useState<string>('Mrs. Evelyn Sterling');
  const [principalName, setPrincipalName] = useState<string>('Dr. (Mrs) A. B. Adebayo');
  const [promotionStatus, setPromotionStatus] = useState<string>('Promoted with Distinction');
  const [teacherComments, setTeacherComments] = useState<string>('Demonstrates outstanding focus and continuous intellectual improvement.');
  const [principalComments, setPrincipalComments] = useState<string>('A stellar performance representing the highest moral and academic standards of the Academy.');
  const [guardianComments, setGuardianComments] = useState<string>(''); // Parent feedback comments
  const [isApproved, setIsApproved] = useState<boolean>(true); // Admin result approval state

  // Psychomotor Skills
  const [skillsCreativity, setSkillsCreativity] = useState<string>('A');
  const [skillsVerbal, setSkillsVerbal] = useState<string>('B');
  const [skillsGames, setSkillsGames] = useState<string>('A');
  const [skillsSports, setSkillsSports] = useState<string>('B');
  const [skillsTools, setSkillsTools] = useState<string>('B');
  const [skillsDrawing, setSkillsDrawing] = useState<string>('C');
  const [skillsMusic, setSkillsMusic] = useState<string>('B');

  // Affective Areas
  const [affPunctuality, setAffPunctuality] = useState<string>('A');
  const [affNeatness, setAffNeatness] = useState<string>('A');
  const [affPoliteness, setAffPoliteness] = useState<string>('B');
  const [affHonesty, setAffHonesty] = useState<string>('A');
  const [affRelationship, setAffRelationship] = useState<string>('A');
  const [affLeadership, setAffLeadership] = useState<string>('B');
  const [affStability, setAffStability] = useState<string>('B');
  const [affHealth, setAffHealth] = useState<string>('A');
  const [affAttitude, setAffAttitude] = useState<string>('A');
  const [affAttentiveness, setAffAttentiveness] = useState<string>('B');
  const [affPerseverance, setAffPerseverance] = useState<string>('A');

  // Map of Hybrid Score Entries: Record<courseId, ScoreObject>
  const [hybridScores, setHybridScores] = useState<Record<string, {
    test1: number;
    test2: number;
    test3: number;
    theory: number;
    cbt: number;
    lastTerm: number;
  }>>({});

  // Bio fields
  const [selectedDept, setSelectedDept] = useState<'Science' | 'Art' | 'Commerce' | 'N/A'>('Science');
  const [selectedHouse, setSelectedHouse] = useState<string>('Lions House (Red)');
  const [selectedPassport, setSelectedPassport] = useState<string>(SAMPLE_PASSPORTS[0]);
  const [dobInput, setDobInput] = useState<string>('2010-04-12');
  const [genderInput, setGenderInput] = useState<string>('Male');

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Sync selection
  useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId);
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [initialStudentId, students]);

  // Load Overrides & Hybrid Grades from localStorage
  useEffect(() => {
    if (!selectedStudentId) return;
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    // Load custom first-class bio properties on Student
    setSelectedDept(student.department || 'Science');
    setSelectedHouse(student.houseUnit || 'Lions House (Red)');
    setSelectedPassport(student.passportPhoto || student.avatar || SAMPLE_PASSPORTS[0]);
    setDobInput(student.dateOfBirth || '2010-04-12');
    setGenderInput(student.gender || 'Male');

    const overrideKey = `nua_report_override_${selectedStudentId}_${selectedSession.replace(/\//g, '_')}_${selectedTerm.replace(/\s+/g, '_')}`;
    const savedOverrides = localStorage.getItem(overrideKey);

    const studentAttendance = attendance.filter(a => a.studentId === selectedStudentId);
    const presentCount = studentAttendance.filter(a => a.status === 'present' || a.status === 'late' || a.status === 'excused').length;
    const absentCount = studentAttendance.filter(a => a.status === 'absent').length;
    const calculatedOpened = Math.max(120, presentCount + absentCount);

    if (savedOverrides) {
      try {
        const data = JSON.parse(savedOverrides);
        setTermOpenedDays(data.opened !== undefined ? data.opened : calculatedOpened);
        setTermPresentDays(data.present !== undefined ? data.present : (presentCount || 115));
        setTermAbsentDays(data.absent !== undefined ? data.absent : (absentCount || 5));
        setNextTermBegins(data.nextTerm || '2026-09-14');
        setVacationDate(data.vacationDate || '2026-07-24');
        setClassTeacherName(data.teacherName || 'Mrs. Evelyn Sterling');
        setPrincipalName(data.principalName || 'Dr. (Mrs) A. B. Adebayo');
        setPromotionStatus(data.promoStatus || 'Promoted with Distinction');
        setTeacherComments(data.teacherComm || 'The student exhibits a highly commendable cognitive pattern.');
        setPrincipalComments(data.principalComm || 'Certified approved for promotional advancement representing the highest standards.');
        setGuardianComments(data.guardianComm || '');
        setIsApproved(data.isApproved !== undefined ? data.isApproved : true);

        // Psychomotor
        setSkillsCreativity(data.skillsCreativity || 'A');
        setSkillsVerbal(data.skillsVerbal || 'B');
        setSkillsGames(data.skillsGames || 'A');
        setSkillsSports(data.skillsSports || 'B');
        setSkillsTools(data.skillsTools || 'B');
        setSkillsDrawing(data.skillsDrawing || 'C');
        setSkillsMusic(data.skillsMusic || 'B');

        // Affective
        setAffPunctuality(data.affPunctuality || 'A');
        setAffNeatness(data.affNeatness || 'A');
        setAffPoliteness(data.affPoliteness || 'B');
        setAffHonesty(data.affHonesty || 'A');
        setAffRelationship(data.affRelationship || 'A');
        setAffLeadership(data.affLeadership || 'B');
        setAffStability(data.affStability || 'B');
        setAffHealth(data.affHealth || 'A');
        setAffAttitude(data.affAttitude || 'A');
        setAffAttentiveness(data.affAttentiveness || 'B');
        setAffPerseverance(data.affPerseverance || 'A');

        // Hybrid Scores list
        setHybridScores(data.hybridScores || {});
      } catch (e) {
        console.error('Failed to parse report card overrides', e);
      }
    } else {
      setTermOpenedDays(calculatedOpened);
      setTermPresentDays(presentCount > 0 ? presentCount : 115);
      setTermAbsentDays(absentCount > 0 ? absentCount : 5);
      setNextTermBegins('2026-09-14');
      setVacationDate('2026-07-24');
      setClassTeacherName('Mrs. Evelyn Sterling');
      setPrincipalName('Dr. (Mrs) A. B. Adebayo');
      setPromotionStatus(genderInput === 'Male' ? 'Promoted. Outstanding standing.' : 'Promoted with high honours.');
      setTeacherComments('The student exhibits a highly commendable cognitive pattern. Active contributor.');
      setPrincipalComments('Impeccable academic progress report. Certified approved for promotional advancement.');
      setGuardianComments('');
      setIsApproved(true);

      // Defaults
      setSkillsCreativity('A');
      setSkillsVerbal('B');
      setSkillsGames('A');
      setSkillsSports('B');
      setSkillsTools('B');
      setSkillsDrawing('C');
      setSkillsMusic('B');

      // Affective defaults
      setAffPunctuality('A');
      setAffNeatness('A');
      setAffPoliteness('B');
      setAffHonesty('A');
      setAffRelationship('A');
      setAffLeadership('B');
      setAffStability('B');
      setAffHealth('A');
      setAffAttitude('A');
      setAffAttentiveness('B');
      setAffPerseverance('A');

      setHybridScores({});
    }
  }, [selectedStudentId, selectedTerm, selectedSession, students, attendance]);

  const activeStudent = students.find(s => s.id === selectedStudentId);

  // Filter student grades to look up CBT exams automatically if any
  const studentGrades = grades.filter(g => {
    if (g.studentId !== selectedStudentId) return false;
    if (selectedTerm === '1st Term 2026') {
      return g.term === '1st Term 2026' || g.term === 'Spring 2026' || g.term === 'Fall 2026';
    }
    return g.term === selectedTerm;
  });

  // Calculate high fidelity fallback grades dynamically
  const getHybridScoreForCourse = (courseId: string) => {
    if (hybridScores && hybridScores[courseId]) {
      return hybridScores[courseId];
    }
    
    // Generate logical seed values out of 10/40/30:
    const charCodeSum = courseId.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + selectedStudentId.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const test1 = 7 + (charCodeSum % 4); 
    const test2 = 6 + ((charCodeSum + 1) % 5);
    const test3 = 7 + ((charCodeSum + 2) % 4);
    
    // Auto lookup actual quizzes/CBT submissions
    const actualQuizzes = studentGrades.filter(g => g.courseId === courseId && g.category === 'quiz');
    let cbt = 20 + (charCodeSum % 11); // max 30 fallback
    if (actualQuizzes.length > 0) {
      const avgPct = actualQuizzes.reduce((sum, q) => sum + (q.score / q.maxScore), 0) / actualQuizzes.length;
      cbt = Math.round(avgPct * 30);
    }
    
    // Auto lookup actual exams
    const actualExams = studentGrades.filter(g => g.courseId === courseId && g.category === 'exam');
    let theory = 25 + (charCodeSum % 16); // max 40 fallback
    if (actualExams.length > 0) {
      const avgPct = actualExams.reduce((sum, ex) => sum + (ex.score / ex.maxScore), 0) / actualExams.length;
      theory = Math.round(avgPct * 40);
    }
    
    const lastTerm = 65 + (charCodeSum % 16); // last term out of 80 to scale cumulative avg
    
    return { test1, test2, test3, theory, cbt, lastTerm };
  };

  // Safe handler to save or change guardian comment directly (Parent View integration)
  const handleSaveGuardianComments = (comment: string) => {
    if (!selectedStudentId) return;
    setGuardianComments(comment);
    
    const overrideKey = `nua_report_override_${selectedStudentId}_${selectedSession.replace(/\//g, '_')}_${selectedTerm.replace(/\s+/g, '_')}`;
    const savedOverrides = localStorage.getItem(overrideKey);
    let existingData: Record<string, any> = {};
    if (savedOverrides) {
      try { existingData = JSON.parse(savedOverrides); } catch (e) {}
    }
    
    existingData.guardianComm = comment;
    localStorage.setItem(overrideKey, JSON.stringify(existingData));
  };

  // Handle saving overrides/student records
  const handleSaveOverrides = () => {
    if (!selectedStudentId) return;

    // 1. Update Student Bio Profile in database Context
    updateStudent(selectedStudentId, {
      department: selectedDept,
      houseUnit: selectedHouse,
      passportPhoto: selectedPassport,
      dateOfBirth: dobInput,
      gender: genderInput
    });

    // 2. Save term specific configs & dynamic grades matrix together
    const overrideKey = `nua_report_override_${selectedStudentId}_${selectedSession.replace(/\//g, '_')}_${selectedTerm.replace(/\s+/g, '_')}`;
    const data = {
      opened: Number(termOpenedDays),
      present: Number(termPresentDays),
      absent: Number(termAbsentDays),
      nextTerm: nextTermBegins,
      vacationDate: vacationDate,
      teacherName: classTeacherName,
      principalName: principalName,
      promoStatus: promotionStatus,
      teacherComm: teacherComments,
      principalComm: principalComments,
      guardianComm: guardianComments,
      isApproved: isApproved,
      
      // Psychomotor
      skillsCreativity,
      skillsVerbal,
      skillsGames,
      skillsSports,
      skillsTools,
      skillsDrawing,
      skillsMusic,

      // Affective
      affPunctuality,
      affNeatness,
      affPoliteness,
      affHonesty,
      affRelationship,
      affLeadership,
      affStability,
      affHealth,
      affAttitude,
      affAttentiveness,
      affPerseverance,

      // Scores
      hybridScores
    };
    
    localStorage.setItem(overrideKey, JSON.stringify(data));
    setActiveSubTab('view');
  };

  // Quick Action Attendance
  const handleSetPerfectAttendance = () => {
    setTermOpenedDays(120);
    setTermPresentDays(120);
    setTermAbsentDays(0);
  };

  // Class rank calculations compare student total score (F)
  const getSubjectRank = (courseId: string, currentStudentF: number) => {
    const classmates = students.filter(s => s.gradeLevel === activeStudent?.gradeLevel);
    const subjectTotals = classmates.map(s => {
      const savedOverrides = localStorage.getItem(`nua_report_override_${s.id}_${selectedSession.replace(/\//g, '_')}_${selectedTerm.replace(/\s+/g, '_')}`);
      let sScores: any = {};
      if (savedOverrides) {
        try {
          sScores = JSON.parse(savedOverrides).hybridScores || {};
        } catch (e) {}
      }
      
      const getSScore = () => {
        if (sScores[courseId]) return sScores[courseId];
        const charCodeSum = courseId.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + s.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const test1 = 7 + (charCodeSum % 4); 
        const test2 = 6 + ((charCodeSum + 1) % 5);
        const test3 = 7 + ((charCodeSum + 2) % 4);
        
        const sGrades = grades.filter(g => g.studentId === s.id);
        const actualQuizzes = sGrades.filter(g => g.courseId === courseId && g.category === 'quiz');
        let cbt = 20 + (charCodeSum % 11);
        if (actualQuizzes.length > 0) {
          cbt = Math.round((actualQuizzes.reduce((sum, q) => sum + (q.score / q.maxScore), 0) / actualQuizzes.length) * 30);
        }
        
        const actualExams = sGrades.filter(g => g.courseId === courseId && g.category === 'exam');
        let theory = 25 + (charCodeSum % 16);
        if (actualExams.length > 0) {
          theory = Math.round((actualExams.reduce((sum, ex) => sum + (ex.score / ex.maxScore), 0) / actualExams.length) * 40);
        }
        return { test1, test2, test3, theory, cbt };
      };

      const c = getSScore();
      const top2 = [c.test1, c.test2, c.test3].sort((x, y) => y - x).slice(0, 2);
      const sAvg = (top2[0] + top2[1]) / 2;
      const sTotal = sAvg + c.theory + c.cbt;
      return { id: s.id, total: sTotal };
    });

    subjectTotals.sort((a, b) => b.total - a.total);
    const rankIdx = subjectTotals.findIndex(item => item.id === selectedStudentId);
    return {
      rank: rankIdx !== -1 ? rankIdx + 1 : 1,
      total: classmates.length
    };
  };

  // Compute 1st class performance matrix for all subjects
  const getSubjectMatrix = () => {
    if (!activeStudent) return [];
    
    // Fetch courses registered in student level or general courses
    const representedCourses = courses.filter(c => 
      c.level === activeStudent.gradeLevel || 
      c.name.toLowerCase().includes('english') || 
      c.name.toLowerCase().includes('math') ||
      c.studentIds?.includes(activeStudent.id)
    );

    const actualList = representedCourses.length > 0 ? representedCourses : courses.slice(0, 6);

    return actualList.map(courseObj => {
      const cScores = getHybridScoreForCourse(courseObj.id);
      
      const test1 = Number(cScores.test1 || 0);
      const test2 = Number(cScores.test2 || 0);
      const test3 = Number(cScores.test3 || 0);
      const theory = Number(cScores.theory || 0);
      const cbt = Number(cScores.cbt || 0);
      const lastTerm = Number(cScores.lastTerm || 0);

      // Compute top 2 test average (D)
      const testList = [test1, test2, test3].sort((a, b) => b - a);
      const testAvg = Number(((testList[0] + testList[1]) / 2).toFixed(1));

      // Terminal Exam Score (E)
      const examScore = theory + cbt;

      // F - Total Score out of 80 (D + E)
      const totalScore = Number((testAvg + examScore).toFixed(1));

      // Cumulative average
      const cumAverage = Number(((lastTerm + totalScore) / 2).toFixed(1));

      // Calculate grade out of 100% evaluated on F out of 80
      const percentValue = Math.round((totalScore / 80) * 100);
      const gradeObj = getNUA_Grade(percentValue);

      // Class Standing Rank Position
      const ranking = getSubjectRank(courseObj.id, totalScore);

      return {
        courseId: courseObj.id,
        subjectLabel: courseObj.name,
        subjectCode: courseObj.code,
        test1,
        test2,
        test3,
        testAvg,
        theory,
        cbt,
        examScore,
        totalScore,
        lastTerm,
        cumAverage,
        percentValue,
        grade: gradeObj.grade,
        colorClass: gradeObj.colorClass,
        bgClass: gradeObj.bgClass,
        remark: gradeObj.desc,
        rank: ranking.rank,
        classmatesCount: ranking.total
      };
    });
  };

  const performanceMatrix = getSubjectMatrix();

  // Overall statistics math
  const overallTotalScore = Number(performanceMatrix.reduce((acc, curr) => acc + curr.totalScore, 0).toFixed(1));
  const overallAveragePercent = performanceMatrix.length > 0
    ? Math.round(performanceMatrix.reduce((acc, curr) => acc + curr.percentValue, 0) / performanceMatrix.length)
    : 72;

  const overallNuaGrade = getNUA_Grade(overallAveragePercent);

  // Overall cumulative class ranking position
  const getOverallClassRank = () => {
    if (!activeStudent) return { pos: 1, total: students.length };
    const classmates = students.filter(s => s.gradeLevel === activeStudent.gradeLevel);
    
    const studentAverages = classmates.map(s => {
      const savedOverrides = localStorage.getItem(`nua_report_override_${s.id}_${selectedSession.replace(/\//g, '_')}_${selectedTerm.replace(/\s+/g, '_')}`);
      let sScores: any = {};
      if (savedOverrides) {
        try { sScores = JSON.parse(savedOverrides).hybridScores || {}; } catch (e) {}
      }

      // Sum all represented course scores
      let totalFSum = 0;
      let count = 0;
      courses.slice(0, 6).forEach(courseObj => {
        let scores = sScores[courseObj.id];
        if (!scores) {
          const charCodeSum = courseObj.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + s.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
          scores = {
            test1: 7 + (charCodeSum % 4),
            test2: 6 + ((charCodeSum + 1) % 5),
            test3: 7 + ((charCodeSum + 2) % 4),
            theory: 25 + (charCodeSum % 16),
            cbt: 20 + (charCodeSum % 11)
          };
        }
        
        const top2 = [scores.test1, scores.test2, scores.test3].sort((x, y) => y - x).slice(0, 2);
        const sAvg = (top2[0] + top2[1]) / 2;
        const sF = sAvg + scores.theory + scores.cbt;
        totalFSum += sF;
        count++;
      });

      return { id: s.id, totalAmt: totalFSum };
    });

    studentAverages.sort((a, b) => b.totalAmt - a.totalAmt);
    const posIdx = studentAverages.findIndex(item => item.id === selectedStudentId);
    return {
      pos: posIdx !== -1 ? posIdx + 1 : 1,
      total: classmates.length
    };
  };

  const rankResult = getOverallClassRank();

  // PDF Download Action
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FAF9F5'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const widthVal = canvas.width * ratio;
      const heightVal = canvas.height * ratio;

      const posX = (pdfWidth - widthVal) / 2;
      const posY = 10;

      pdf.addImage(imgData, 'PNG', posX, posY, widthVal, heightVal);
      pdf.save(`${activeStudent?.name.replace(/\s+/g, '_')}_HybridReport_${selectedSession.replace(/\//g, '_')}_${selectedTerm.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating report PDF:', error);
      alert('An issue occurred during PDF compression. Please use the Print feature.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintStandard = () => {
    window.print();
  };

  // Real-time student directory search filter
  const filteredStudentsSelect = students.filter(s => {
    const cleanQuery = searchStudentQuery.trim().toLowerCase();
    if (!cleanQuery) return true;

    const nameParts = s.name.toLowerCase().split(/\s+/);
    const queryParts = cleanQuery.split(/\s+/);

    const matchesName = queryParts.every(qPart => 
      nameParts.some(nPart => nPart.includes(qPart))
    );

    const matchesAdmission = (s.admissionNumber || '').toLowerCase().includes(cleanQuery) || 
                             (s.username || '').toLowerCase().includes(cleanQuery);
    const matchesClass = s.gradeLevel.toLowerCase().includes(cleanQuery);
    const matchesDept = (s.department || '').toLowerCase().includes(cleanQuery);

    return matchesName || matchesAdmission || matchesClass || matchesDept;
  });

  // Handle single cell input changes in scorecard editing screen
  const handleScorecardChange = (courseId: string, field: string, value: number) => {
    // Enforce range checks based on maximum guidelines
    let cleanVal = Number(value);
    if (field.startsWith('test') && cleanVal > 10) cleanVal = 10;
    if (field === 'theory' && cleanVal > 40) cleanVal = 40;
    if (field === 'cbt' && cleanVal > 30) cleanVal = 30;
    if (field === 'lastTerm' && cleanVal > 80) cleanVal = 80;
    if (cleanVal < 0) cleanVal = 0;

    const existingCourseScores = getHybridScoreForCourse(courseId);
    
    setHybridScores(prev => ({
      ...prev,
      [courseId]: {
        ...existingCourseScores,
        [field]: cleanVal
      }
    }));
  };

  // If student/parent logs in and results are NOT approved by admin yet, lock with premium screen
  const isLockedForViewer = !isApproved && (currentRole === 'student' || currentRole === 'parent');

  return (
    <div className="space-y-6 text-natural-charcoal print:p-0 print:bg-white" id="nua-hybrid-results-system">
      
      {/* 1. SELECTION & ACTION FLAGS (HIDDEN DURING PRINT) */}
      <div className="bg-white p-6 rounded-3xl border border-natural-beige shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase text-natural-green tracking-widest block">HYBRID RESULT sheets</span>
          <h2 className="text-2xl font-serif font-black text-slate-900 leading-tight">Terminal Evaluation & Certified Report</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Supports manual Continuous Assessments, auto-graded CBT objective scores, and manual theory entries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {canEdit && (
            <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-xl text-xs font-bold font-sans">
              <button
                onClick={() => setActiveSubTab('view')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeSubTab === 'view' ? 'bg-white text-natural-green shadow-xs' : 'text-slate-505 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> View Evaluation Card
              </button>
              <button
                onClick={() => setActiveSubTab('edit')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeSubTab === 'edit' ? 'bg-white text-natural-green shadow-xs' : 'text-slate-505 hover:text-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> Edit Marks & Domains
              </button>
            </div>
          )}

          {!isLockedForViewer && activeStudent && (
            <>
              <button
                onClick={handlePrintStandard}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Report
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-4 py-2.5 bg-natural-green hover:bg-natural-green/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDownloading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download PDF
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. LIVE DESK FILTERS (HIDDEN DURING PRINT) */}
      {!initialStudentId && (currentRole === 'admin' || currentRole === 'teacher') && (
        <div className="bg-white p-5 rounded-2xl border border-natural-beige shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center print:hidden">
          
          <div className="md:col-span-5 relative">
            <label className="block text-[9px] uppercase font-black text-slate-450 mb-1">Search & Select Student</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Type and trace instantly by name or admission number..."
                value={searchStudentQuery}
                onChange={(e) => setSearchStudentQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none"
              />
            </div>
            {searchStudentQuery && (
              <div className="absolute z-45 left-0 right-0 mt-1 max-h-[250px] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl divide-y divide-slate-150">
                {filteredStudentsSelect.map(s => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      setSearchStudentQuery('');
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-xs font-semibold flex items-center justify-between gap-3 group transition cursor-pointer text-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={s.passportPhoto || s.avatar || SAMPLE_PASSPORTS[0]} 
                        alt={`${s.name} Avatar`} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-150 shadow-xs animate-pulse" 
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = SAMPLE_PASSPORTS[0]; }}
                      />
                      <div>
                        <span className="font-bold block text-[#0e382b] group-hover:text-amber-700 transition-colors">{s.name}</span>
                        <span className="text-[9px] text-slate-500 font-bold block">No: {s.admissionNumber || 'NUA-26-'} • Dept: {s.department || 'N/A'}</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#0e382b] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-extrabold">{s.gradeLevel}</span>
                  </button>
                ))}
                {filteredStudentsSelect.length === 0 && (
                  <div className="p-4 text-center text-xs text-rose-600 font-bold">
                    No matching student found. Keep typing different characters!
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <label className="block text-[9px] uppercase font-black text-slate-450 mb-1">Active Report Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="1st Term 2026">1st Term (Advent Period)</option>
              <option value="2nd Term 2026">2nd Term (Lent Period)</option>
              <option value="3rd Term 2026">3rd Term (Trinity Period)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[9px] uppercase font-black text-slate-450 mb-1">School Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="2025/2026">2025/2026 Academic</option>
              <option value="2026/2027">2026/2027 Academic</option>
            </select>
          </div>

          <div className="md:col-span-2 text-center bg-natural-light/50 p-2.5 rounded-xl border border-natural-beige">
            <span className="text-[8px] text-natural-charcoal/50 uppercase font-bold block">Overall Mean Average</span>
            <span className="text-base font-serif font-black text-emerald-800">{overallAveragePercent}%</span>
          </div>
        </div>
      )}

      {/* STUDENT SELF JUMPER */}
      {(initialStudentId || currentRole === 'student' || currentRole === 'parent') && (
        <div className="bg-white p-4 rounded-xl border border-natural-beige shadow-xs flex justify-between items-center text-xs print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-natural-green animate-bounce" />
            <span className="font-bold text-[#0B1F3B] hidden sm:inline">Active Segment:</span>
            <span className="bg-natural-light border border-natural-beige px-3 py-1 rounded-lg font-black text-emerald-800 uppercase text-[10px]">
              {selectedTerm} • {selectedSession} Session
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">Choose Term:</span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-natural-light border border-natural-beige text-[11px] font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer text-[#0B1F3B]"
            >
              <option value="1st Term 2026">First Term (Advent)</option>
              <option value="2nd Term 2026">Second Term (Lent)</option>
              <option value="3rd Term 2026">Third Term (Trinity)</option>
            </select>
          </div>
        </div>
      )}

      {/* 3. REPORT EDIT / OVERRIDES CONFIGURATION PANEL */}
      {activeSubTab === 'edit' && canEdit && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-natural-beige shadow-md space-y-6 animate-fade-in print:hidden">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-serif font-extrabold text-[#0B1F3B]">Configure Scholar Performance Metres & Scores</h3>
              <p className="text-xs text-slate-500">Manual Continuous Assessments (CA) and high-fidelity exam aggregates with auto-calculated summaries.</p>
            </div>
            <button
              onClick={() => setActiveSubTab('view')}
              className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Approval Flag (Only Admins can toggle this) */}
          {currentRole === 'admin' && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <label className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5 label-contrast">
                <ShieldAlert className="w-4 h-4 text-amber-700" /> Result Approval Authorization (Admin Rule)
              </label>
              <select
                value={isApproved ? 'approved' : 'pending'}
                onChange={(e) => setIsApproved(e.target.value === 'approved')}
                className="text-xs px-3.5 py-2 bg-white border border-amber-300 rounded-xl outline-none font-bold text-amber-900 cursor-pointer w-full sm:w-auto"
              >
                <option value="approved">✅ APPROVED & PUBLISHED (Visible to parents/students)</option>
                <option value="pending">🔒 PENDING AUTHORIZATION (Access Locked from parent/student interfaces)</option>
              </select>
              <p className="text-[10px] text-amber-800 leading-snug">
                Approved state allows students or parents to download or print reports. Pending state triggers an educational lock holding sheet for review.
              </p>
            </div>
          )}

          {currentRole === 'teacher' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
              <span>
                <strong>Tutor Note:</strong> Admin approval lock is currently set to: <strong>{isApproved ? 'Approved & Published' : 'Pending Admin Authorization'}</strong>. Only administrators can alter this publishing gate state.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Student bio details */}
            <div className="md:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-[10px] font-black text-[#0B1F3B] uppercase tracking-widest block font-mono border-b border-slate-200 pb-2">Student Profile Bio</span>
              
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-500">Gender</label>
                <select
                  value={genderInput}
                  onChange={(e) => setGenderInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-500">Date of Birth</label>
                <input
                  type="date"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-500">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                >
                  <option value="N/A">N/A (General Junior)</option>
                  <option value="Science">Science Department</option>
                  <option value="Art">Art Department</option>
                  <option value="Commerce">Commerce Department</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-500">House Unit</label>
                <input
                  type="text"
                  value={selectedHouse}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                  placeholder="e.g. Lions House (Red)"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none text-slate-800 font-bold"
                />
              </div>

              {/* Passport photo list selection */}
              <div className="space-y-2">
                <label className="block text-[10px] font-extrabold uppercase text-slate-500">Passport Photo Avatars</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {SAMPLE_PASSPORTS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPassport(url)}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 transition ${
                        selectedPassport === url ? 'border-[#0B1F3B] scale-105' : 'border-transparent opacity-80'
                      }`}
                    >
                      <img src={url} alt="Passport Option" className="w-full h-full object-cover" />
                      {selectedPassport === url && (
                        <div className="absolute inset-0 bg-[#0B1F3B]/10 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white bg-[#0e382b] rounded-full p-0.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Attendance & Tutors Comments Block */}
            <div className="md:col-span-8 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-[10px] font-black text-[#0B1F3B] uppercase tracking-widest block font-mono border-b border-slate-200 pb-2">School indicators & Endorsements</span>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500">Times Opened</label>
                  <input
                    type="number"
                    value={termOpenedDays}
                    onChange={(e) => setTermOpenedDays(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500">Times Present</label>
                  <input
                    type="number"
                    value={termPresentDays}
                    onChange={(e) => setTermPresentDays(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500">Times Absent</label>
                  <input
                    type="number"
                    value={termAbsentDays}
                    onChange={(e) => setTermAbsentDays(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSetPerfectAttendance}
                  className="px-2.5 py-1 text-[9.5px] uppercase font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-150 border border-indigo-200 rounded transition cursor-pointer"
                >
                  Set Perfect Attendance (120 Days)
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500">Promotion Status</label>
                  <input
                    type="text"
                    value={promotionStatus}
                    onChange={(e) => setPromotionStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500">Vacation Date *</label>
                  <input
                    type="date"
                    value={vacationDate}
                    onChange={(e) => setVacationDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500">Resumption Date *</label>
                  <input
                    type="date"
                    value={nextTermBegins}
                    onChange={(e) => setNextTermBegins(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500">Class Teacher Name</label>
                  <input
                    type="text"
                    value={classTeacherName}
                    onChange={(e) => setClassTeacherName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500">School Principal Name</label>
                  <input
                    type="text"
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-500">Class Teacher's Comment Evaluation</label>
                <textarea
                  rows={2}
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-250 rounded-lg outline-none text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-500">Principal's comment Endorsement</label>
                <textarea
                  rows={2}
                  value={principalComments}
                  onChange={(e) => setPrincipalComments(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-250 rounded-lg outline-none text-slate-800"
                />
              </div>
            </div>

          </div>

          {/* Unified SCORECARD HYBRID ENTRIES MATRIX */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <BookOpen className="w-5 h-5 text-indigo-700" />
              <div>
                <span className="text-[10px] font-black text-[#0B1F3B] uppercase tracking-widest block font-mono">1. Academic Subjects Scorecard Matrix Entries</span>
                <p className="text-[10px] text-slate-500">
                  Periodic Tests (Max 10 per test), Theory exam (Max 40), CBT exam (Max 30) automatically combine together in exam column (Max 70).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800 min-w-[700px]">
                <thead>
                  <tr className="bg-slate-200/60 uppercase text-[9px] font-black tracking-wider text-slate-600">
                    <th className="px-3 py-2 flex items-center gap-1">Course Discipline</th>
                    <th className="px-2 py-2 text-center text-rose-800 font-bold">PT 1 (Max 10)</th>
                    <th className="px-2 py-2 text-center text-rose-800 font-bold">PT 2 (Max 10)</th>
                    <th className="px-2 py-2 text-center text-rose-800 font-bold">PT 3 (Max 10)</th>
                    <th className="px-2 py-2 text-center text-slate-600 bg-slate-200 font-black">Top 2 Avg (10)</th>
                    <th className="px-2 py-2 text-center text-[#0B1F3B] font-bold">Theory Score (Max 40)</th>
                    <th className="px-2 py-2 text-center text-[#0B1F3B] font-bold">CBT Objective (Max 30)</th>
                    <th className="px-2 py-2 text-center text-[#0B1F3B] bg-slate-200 font-black">Exam Sum (70)</th>
                    <th className="px-2 py-2 text-center text-teal-800 font-bold" title="Result aggregation out of 80 score metric">Total Score (80)</th>
                    <th className="px-2 py-2 text-center text-emerald-800 font-bold">Last Term Cum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {courses.slice(0, 6).map(courseObj => {
                    const localScores = getHybridScoreForCourse(courseObj.id);
                    
                    const test1 = hybridScores[courseObj.id]?.test1 !== undefined ? hybridScores[courseObj.id].test1 : localScores.test1;
                    const test2 = hybridScores[courseObj.id]?.test2 !== undefined ? hybridScores[courseObj.id].test2 : localScores.test2;
                    const test3 = hybridScores[courseObj.id]?.test3 !== undefined ? hybridScores[courseObj.id].test3 : localScores.test3;
                    const theory = hybridScores[courseObj.id]?.theory !== undefined ? hybridScores[courseObj.id].theory : localScores.theory;
                    const cbt = hybridScores[courseObj.id]?.cbt !== undefined ? hybridScores[courseObj.id].cbt : localScores.cbt;
                    const lastTerm = hybridScores[courseObj.id]?.lastTerm !== undefined ? hybridScores[courseObj.id].lastTerm : localScores.lastTerm;

                    // calculate top 2 test average
                    const sortedTests = [test1, test2, test3].sort((x, y) => y - x);
                    const localAvg = ((sortedTests[0] + sortedTests[1]) / 2);
                    const examTotal = theory + cbt;
                    const aggTotal = Number((localAvg + examTotal).toFixed(1));

                    return (
                      <tr key={courseObj.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 font-black text-slate-900 border-r border-slate-100">
                          <span className="block text-[11px] text-[#0e382b]">{courseObj.name}</span>
                          <span className="block font-mono text-[8px] text-slate-400">{courseObj.code}</span>
                        </td>
                        
                        {/* Test 1 */}
                        <td className="px-2 py-2 text-center">
                          <input 
                            type="number" 
                            min="0" 
                            max="10" 
                            value={test1}
                            onChange={(e) => handleScorecardChange(courseObj.id, 'test1', Number(e.target.value))}
                            className="w-14 text-center text-xs font-mono border border-slate-250 rounded p-1 bg-[#FAF9F5]" 
                          />
                        </td>

                        {/* Test 2 */}
                        <td className="px-2 py-2 text-center">
                          <input 
                            type="number" 
                            min="0" 
                            max="10" 
                            value={test2}
                            onChange={(e) => handleScorecardChange(courseObj.id, 'test2', Number(e.target.value))}
                            className="w-14 text-center text-xs font-mono border border-slate-250 rounded p-1 bg-[#FAF9F5]" 
                          />
                        </td>

                        {/* Test 3 */}
                        <td className="px-2 py-2 text-center border-r border-slate-200">
                          <input 
                            type="number" 
                            min="0" 
                            max="10" 
                            value={test3}
                            onChange={(e) => handleScorecardChange(courseObj.id, 'test3', Number(e.target.value))}
                            className="w-14 text-center text-xs font-mono border border-slate-250 rounded p-1 bg-[#FAF9F5]" 
                          />
                        </td>

                        {/* Computed Test Avg */}
                        <td className="px-2 py-2 text-center font-mono font-black text-[#0B1F3B] bg-slate-100 border-r border-slate-200">
                          {localAvg}
                        </td>

                        {/* Theory Score */}
                        <td className="px-2 py-2 text-center">
                          <input 
                            type="number" 
                            min="0" 
                            max="40" 
                            value={theory}
                            onChange={(e) => handleScorecardChange(courseObj.id, 'theory', Number(e.target.value))}
                            className="w-16 text-center text-xs font-semibold border border-slate-250 rounded p-1" 
                          />
                        </td>

                        {/* CBT Exam Score */}
                        <td className="px-2 py-2 text-center border-r border-slate-100 relative">
                          <input 
                            type="number" 
                            min="0" 
                            max="30" 
                            value={cbt}
                            onChange={(e) => handleScorecardChange(courseObj.id, 'cbt', Number(e.target.value))}
                            className="w-16 text-center text-xs font-semibold border border-slate-250 rounded p-1 bg-emerald-50/40" 
                          />
                        </td>

                        {/* Exam Sum D + E */}
                        <td className="px-2 py-2 text-center font-black text-[#0e382b] bg-slate-100 border-r border-slate-200">
                          {examTotal} <span className="text-[8px] text-slate-400">/70</span>
                        </td>

                        {/* Agg Total */}
                        <td className="px-2 py-2 text-center font-black text-indigo-700 bg-indigo-50/50 border-r border-slate-200">
                          {aggTotal} <span className="text-[8px] text-[#A6802B]">/80</span>
                        </td>

                        {/* Last Term Cumulative */}
                        <td className="px-2 py-2 text-center">
                          <input 
                            type="number" 
                            min="0" 
                            max="80" 
                            value={lastTerm}
                            onChange={(e) => handleScorecardChange(courseObj.id, 'lastTerm', Number(e.target.value))}
                            className="w-16 text-center text-xs border border-slate-250 rounded p-1 bg-amber-50/30 text-amber-900 font-bold" 
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* PSYCHOMOTOR & AFFECTIVE DOMAINS GRADING BLOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            
            {/* Psychomotor Skills */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-[#0B1F3B] uppercase tracking-widest block font-mono border-b border-slate-200 pb-1 flex items-center gap-1.5 label-contrast">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" /> 2. Psychomotor Skills Grade (A to E)
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-650">
                <div className="space-y-1">
                  <label className="block text-[9.5px] font-bold text-slate-600">Creativity</label>
                  <select value={skillsCreativity} onChange={(e) => setSkillsCreativity(e.target.value)} className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded outline-none font-bold">
                    <option value="A">A - Excellent</option><option value="B">B - Good</option><option value="C">C - Average</option><option value="D">D - Fair</option><option value="E">E - Poor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9.5px] font-bold text-slate-600">Verbal Fluency</label>
                  <select value={skillsVerbal} onChange={(e) => setSkillsVerbal(e.target.value)} className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded outline-none font-bold">
                    <option value="A">A - Excellent</option><option value="B">B - Good</option><option value="C">C - Average</option><option value="D">D - Fair</option><option value="E">E - Poor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9.5px] font-bold text-slate-600">Games</label>
                  <select value={skillsGames} onChange={(e) => setSkillsGames(e.target.value)} className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded outline-none font-bold">
                    <option value="A">A - Excellent</option><option value="B">B - Good</option><option value="C">C - Average</option><option value="D">D - Fair</option><option value="E">E - Poor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9.5px] font-bold text-slate-600">Sports</label>
                  <select value={skillsSports} onChange={(e) => setSkillsSports(e.target.value)} className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded outline-none font-bold">
                    <option value="A">A - Excellent</option><option value="B">B - Good</option><option value="C">C - Average</option><option value="D">D - Fair</option><option value="E">E - Poor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9.5px] font-bold text-slate-600">Handling Tools</label>
                  <select value={skillsTools} onChange={(e) => setSkillsTools(e.target.value)} className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded outline-none font-bold">
                    <option value="A">A - Excellent</option><option value="B">B - Good</option><option value="C">C - Average</option><option value="D">D - Fair</option><option value="E">E - Poor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9.5px] font-bold text-slate-600">Drawing & Painting</label>
                  <select value={skillsDrawing} onChange={(e) => setSkillsDrawing(e.target.value)} className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded outline-none font-bold">
                    <option value="A">A - Excellent</option><option value="B">B - Good</option><option value="C">C - Average</option><option value="D">D - Fair</option><option value="E">E - Poor</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="block text-[9.5px] font-bold text-slate-600">Musical Skills</label>
                  <select value={skillsMusic} onChange={(e) => setSkillsMusic(e.target.value)} className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded outline-none font-bold">
                    <option value="A">A - Excellent</option><option value="B">B - Good</option><option value="C">C - Average</option><option value="D">D - Fair</option><option value="E">E - Poor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Affective Areas */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-[#0B1F3B] uppercase tracking-widest block font-mono border-b border-slate-200 pb-1 flex items-center gap-1.5 label-contrast">
                <Award className="w-4 h-4 text-emerald-700" /> 3. Affective Domains evaluation (A to E)
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-650">
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-slate-600">Punctuality</label>
                  <select value={affPunctuality} onChange={(e) => setAffPunctuality(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-slate-600">Neatness</label>
                  <select value={affNeatness} onChange={(e) => setAffNeatness(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-slate-600">Politeness</label>
                  <select value={affPoliteness} onChange={(e) => setAffPoliteness(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-slate-600">Honesty</label>
                  <select value={affHonesty} onChange={(e) => setAffHonesty(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-slate-600">Relationship with Others</label>
                  <select value={affRelationship} onChange={(e) => setAffRelationship(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-slate-600">Leadership</label>
                  <select value={affLeadership} onChange={(e) => setAffLeadership(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-slate-600">Emotional Stability</label>
                  <select value={affStability} onChange={(e) => setAffStability(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-slate-600">Health</label>
                  <select value={affHealth} onChange={(e) => setAffHealth(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5 text-slate-500">
                  <label className="block text-[9px] font-bold text-slate-600">Attitude to Work</label>
                  <select value={affAttitude} onChange={(e) => setAffAttitude(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-slate-600">Attentiveness</label>
                  <select value={affAttentiveness} onChange={(e) => setAffAttentiveness(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
                <div className="space-y-0.5 col-span-2">
                  <label className="block text-[9px] font-bold text-slate-600">Perseverance</label>
                  <select value={affPerseverance} onChange={(e) => setAffPerseverance(e.target.value)} className="w-full text-xs p-1 bg-white border border-slate-250 rounded font-bold">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              onClick={() => setActiveSubTab('view')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveOverrides}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0e382b] hover:bg-emerald-900 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" /> Save Certified report Card
            </button>
          </div>
        </div>
      )}

      {/* ADMIN LEVEL NOT APPROVED BLOCKED LOCK screen for Parents & Students */}
      {isLockedForViewer ? (
        <div className="p-16 text-center bg-white border border-amber-200 rounded-3xl space-y-4 max-w-2xl mx-auto shadow-xl flex flex-col items-center">
          <div className="h-16 w-16 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center text-amber-600 shadow-md">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-serif font-black text-slate-800 tracking-tight">🔒 Evaluation Sheet Under Certification Review</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md">
            Outstanding parameters or Continuous Assessments are currently being compiled by the classroom counselors. Your <strong>{selectedTerm}</strong> report card will be instantly accessible upon final Authorization and approval from the Office of the Admin.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] font-mono text-slate-400">
            NUA PUBLISHING CODE: REF_PENDING_EXCO
          </div>
        </div>
      ) : activeStudent ? (
        
        /* 4. PREMIUM COMPREHENSIVE CERTIFICATE REPORT CARD STACK */
        <div className="w-full overflow-x-auto select-none print:overflow-visible p-1">
          
          <div 
            ref={reportRef}
            id="nua-official-report-sheet"
            className="w-full min-w-[790px] print:min-w-0 bg-[#FAF9F5] border-8 border-double border-[#A6802B]/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl print:border-none print:shadow-none print:bg-white print:p-0"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            
            {/* Elegant Background Certificate Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none z-0">
              <svg 
                className="w-[480px] h-[480px] text-natural-green fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93V4.07z"/>
              </svg>
            </div>

            <div className="absolute inset-4 border border-[#A6802B]/20 pointer-events-none rounded-2xl z-0 print:border-none" />

            <div className="relative z-10 space-y-6">
              
              {/* SECTION A: SCHOOL HEADER LEDGER */}
              <div className="flex items-center justify-between gap-6 pb-4 border-b-2 border-dashed border-[#A6802B]/30">
                <div className="flex items-center justify-center border-4 border-[#A6802B] rounded-full p-2 h-20 w-20 bg-white shadow-md font-serif font-black text-[#0e382b] text-center uppercase text-xl shrink-0">
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-mono font-bold text-[#A6802B]">NUA</span>
                    <span className="text-[9px]">Lekki</span>
                    <span className="text-[7.5px] font-sans font-black tracking-widest text-[#A6802B] block">★</span>
                  </div>
                </div>

                <div className="text-center flex-1 space-y-0.5">
                  <h1 className="text-3xl font-serif font-black text-[#0B1F3B] tracking-tight leading-none uppercase">NEW UNIQUE ACADEMY</h1>
                  <p className="text-[9.5px] text-[#A6802B] font-black tracking-widest leading-none uppercase">Academic Excellence Is Our Pride</p>
                  <p className="text-[10px] text-slate-500 font-serif italic">"Honour and Integrity for Global Intellectual elevation"</p>
                  <p className="text-[9px] text-[#333333] font-medium">
                    Plot 12, Academy Way, Lekki Phase 1, Lagos, Nigeria | Tel: +234 (0) 812 345 6789 | info@newuniqueacademy.edu.ng
                  </p>
                </div>

                <div className="border border-[#A6802B]/40 bg-white p-1.5 text-center shrink-0 rounded-lg">
                  <div className="grid grid-cols-4 gap-0.5 w-[38px] h-[38px] opacity-70">
                    <div className="bg-[#0e382b] rounded-xs" /><div className="bg-[#0e382b] rounded-xs" /><div className="bg-transparent" /><div className="bg-[#0e382b] rounded-xs" />
                    <div className="bg-transparent" /><div className="bg-[#0e382b] rounded-xs" /><div className="bg-[#0e382b] rounded-xs" /><div className="bg-transparent" />
                    <div className="bg-[#0e382b] rounded-xs" /><div className="bg-transparent" /><div className="bg-[#0e382b] rounded-xs" /><div className="bg-[#0e382b] rounded-xs" />
                    <div className="bg-[#0e382b] rounded-xs" /><div className="bg-[#0e382b] rounded-xs" /><div className="bg-transparent" /><div className="bg-[#0e382b] rounded-xs" />
                  </div>
                  <span className="text-[6.5px] text-[#A6802B] font-mono font-bold uppercase tracking-wider block mt-1">APPROVED</span>
                </div>
              </div>

              {/* SHEET DESCRIPTION */}
              <div className="text-center bg-[#0e382b] text-white p-2.5 rounded-xl border border-[#A6802B]/40 shadow-xs flex justify-between items-center px-6">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FAF9F5]">
                  OFFICIAL INDIVIDUAL PROGRESS REPORT SHEET
                </span>
                <div className="flex items-center gap-4 text-[9.5px] font-bold uppercase tracking-wider text-amber-200">
                  <span>Session: {selectedSession}</span>
                  <span>•</span>
                  <span className="underline underline-offset-4 font-black text-white">{selectedTerm}</span>
                </div>
              </div>

              {/* SECTION B: STUDENT BIO LEDGER */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Passport photo */}
                <div className="md:col-span-3 flex flex-col justify-center items-center gap-3 bg-white p-4 rounded-2xl border border-[#A6802B]/20 text-center">
                  <div className="relative h-24 w-22 border-4 border-[#0e382b] bg-white rounded-md shadow-md overflow-hidden">
                    <img 
                      src={selectedPassport} 
                      alt={activeStudent.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.src = SAMPLE_PASSPORTS[0]; }}
                    />
                    <div className="absolute -bottom-2 -right-4 h-10 w-10 rounded-full border border-[#FAF9F5] bg-[#0e382b] text-[#FAF9F5] text-[6px] font-bold flex items-center justify-center transform -rotate-12 scale-90">
                      <span>VERIFIED</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-slate-400 block pb-0.5">REGISTRATION CODE</span>
                    <span className="font-mono text-[10px] font-black text-emerald-800">{activeStudent.username || 'NUA/STUD/' + activeStudent.id}</span>
                  </div>
                </div>

                {/* Biography card */}
                <div className="md:col-span-6 bg-white p-4 rounded-2xl border border-[#A6802B]/20 text-xs text-[#333333] grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-extrabold text-slate-450 block">Student Full Name</span>
                    <span className="font-serif font-black text-[#0B1F3B] text-[13px]">{activeStudent.name}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-extrabold text-slate-450 block">Admission Code</span>
                    <span className="font-mono font-bold text-amber-800">{activeStudent.admissionNumber || 'NUA-26-00' + activeStudent.id.substring(2)}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-extrabold text-slate-450 block">Gender</span>
                    <span className="font-semibold">{genderInput}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-extrabold text-slate-450 block">Date of Birth</span>
                    <span className="font-semibold">{dobInput ? new Date(dobInput).toLocaleDateString() : '12th April 2010'}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-extrabold text-slate-450 block">Academic Class</span>
                    <span className="font-bold text-[#0e382b]">{activeStudent.gradeLevel}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-extrabold text-slate-450 block">Registered Tracks</span>
                    <span className="font-bold bg-indigo-50 border border-indigo-100 text-indigo-900 px-1.5 py-0.25 rounded text-[9.5px] inline-block">
                      {selectedDept} track
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-extrabold text-slate-450 block">House/Assembly Unit</span>
                    <span className="font-semibold text-rose-700">{selectedHouse}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-extrabold text-slate-450 block">School Registry ID</span>
                    <span className="font-mono text-[9.5px] text-slate-400">{activeStudent.id}</span>
                  </div>
                </div>

                {/* Attendance LEDGERS */}
                <div className="md:col-span-3 bg-white p-4 rounded-2xl border border-[#A6802B]/20 text-xs flex flex-col justify-between">
                  <div className="space-y-1 pb-1 border-b border-[#A6802B]/20 text-center">
                    <span className="font-serif font-black text-[#0B1F3B] block text-[10.5px] uppercase tracking-wide">
                      Attendance ledger
                    </span>
                  </div>

                  <div className="space-y-1 my-1.5 flex-grow flex flex-col justify-center">
                    <div className="flex justify-between items-center bg-slate-50 p-1 rounded border border-slate-100 text-[10.5px]">
                      <span className="text-[8.5px] text-slate-500 uppercase font-black">Period Opened:</span>
                      <span className="font-mono font-bold text-slate-800">{termOpenedDays} Days</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-50/40 p-1 rounded border border-emerald-100 text-[10.5px]">
                      <span className="text-[8.5px] text-emerald-800 uppercase font-black">Actual Present:</span>
                      <span className="font-mono font-black text-emerald-850">{termPresentDays} Days</span>
                    </div>
                    <div className="flex justify-between items-center bg-rose-50/40 p-1 rounded border border-rose-100 text-[10.5px]">
                      <span className="text-[8.5px] text-rose-800 uppercase font-black">Total Absent:</span>
                      <span className="font-mono font-bold text-rose-750">{termAbsentDays} Days</span>
                    </div>
                  </div>

                  <div className="text-[8.5px] text-slate-450 border-t border-slate-100 pt-1 text-center font-mono">
                    Atnd Rate: {Math.round((termPresentDays / Math.max(1, termOpenedDays)) * 100)}% Verified
                  </div>
                </div>
              </div>

              {/* SECTION C: 12-COLUMN SUBJECT PERFORMANCE MATRIX */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end border-b-2 border-slate-200 pb-0.5">
                  <h4 className="font-serif font-black text-[#0B1F3B] text-xs uppercase tracking-widest">
                    Academic Subjects Grades Matrix (Hybrid entries)
                  </h4>
                  <span className="text-[8px] font-bold text-[#A6802B] uppercase">NEW UNIQUE ACADEMY EXAMS BOARD</span>
                </div>

                <div className="overflow-x-auto bg-white border border-[#A6802B]/30 rounded-xl shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs min-w-[780px] break-inside-avoid">
                    <thead className="bg-[#0e382b] text-[#FAF9F5] text-[8.5px] font-black uppercase tracking-wider border-b border-[#A6802B] text-center">
                      <tr>
                        <th className="px-3 py-2 text-left w-36">SUBJECT DISCIPLINE</th>
                        <th className="px-1 py-2" title="Periodic Continuous Assessment Test 1 score (Max 10)">Periodic Test 1 (10)</th>
                        <th className="px-1 py-2" title="Periodic Continuous Assessment Test 2 score (Max 10)">Periodic Test 2 (10)</th>
                        <th className="px-1 py-2" title="Periodic Continuous Assessment Test 3 score (Max 10)">Periodic Test 3 (10)</th>
                        <th className="px-1 py-2 bg-[#0C3025] text-amber-300 font-bold" title="Average score calculated from Top 2 test scores (Max 10)">Test Avg D (10)</th>
                        <th className="px-1 py-2 font-medium" title="Terminal Examination score (Theory + CBT combined, Max 70)">Tml Exam E (70)</th>
                        <th className="px-1 py-2 bg-[#0C3025] font-black" title="Subject Aggregate score (D + E, Max 80)">F - Total (80)</th>
                        <th className="px-1 py-2 text-teal-250 font-bold" title="Academic Cumulative Score of Last Term (Max 80)">Last Term Cumulative</th>
                        <th className="px-1 py-2 text-amber-250 font-black" title="Average Cumulative across terms (Max 80)">Cum. Average</th>
                        <th className="px-2 py-2">Grade</th>
                        <th className="px-1 py-2" title="Student relative ranking inside selected subject classroom">Subject Rank</th>
                        <th className="px-2 py-2 text-right">Tudor remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-center text-slate-800">
                      {performanceMatrix.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors text-[10.5px]">
                          <td className="px-3 py-2.5 text-left border-r border-slate-100 font-bold">
                            <span className="font-serif text-[#0B1F3B] block leading-tight">{sub.subjectLabel}</span>
                            <span className="font-mono text-[8px] text-[#A6802B] block mt-0.5">{sub.subjectCode}</span>
                          </td>
                          
                          <td className="px-1 py-2.5 font-mono text-slate-600 bg-[#FAF9F5]/40">{sub.test1}</td>
                          <td className="px-1 py-2.5 font-mono text-slate-600 bg-[#FAF9F5]/40">{sub.test2}</td>
                          <td className="px-1 py-2.5 font-mono text-slate-600 bg-[#FAF9F5]/40">{sub.test3}</td>
                          
                          {/* Test Average (D) */}
                          <td className="px-1 py-2.5 font-mono font-black text-[#0B1F3B] bg-amber-500/10 border-x border-slate-200">
                            {sub.testAvg}
                          </td>

                          {/* Terminal Exam Score (Theory + CBT Score combined) (E) */}
                          <td className="px-1 py-2.5 font-mono text-slate-800 bg-[#FAF9F5]/40 font-bold">
                            {sub.examScore}
                          </td>

                          {/* F - Aggregate score (D + E) */}
                          <td className="px-1 py-2.5 font-serif font-black text-[#0B1F3B] text-[12.5px] bg-slate-50">
                            {sub.totalScore}
                          </td>

                          {/* Last Term Cumulative */}
                          <td className="px-1 py-2.5 font-mono text-teal-800 font-bold bg-[#FAF9F5]/40">
                            {sub.lastTerm}
                          </td>

                          {/* Cumulative Average */}
                          <td className="px-1 py-2.5 font-mono text-amber-800 font-extrabold bg-[#FAF9F5]/40">
                            {sub.cumAverage}
                          </td>

                          {/* Grade (A, B, C, E boundaries) */}
                          <td className="px-2 py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded font-mono font-black text-[10px] uppercase tracking-wide border ${sub.bgClass} ${sub.colorClass}`}>
                              {sub.grade}
                            </span>
                          </td>

                          {/* Subject Position rank */}
                          <td className="px-1 py-2.5 font-mono font-bold text-[#0e382b] bg-[#FAF9F5]/40">
                            {sub.rank} <span className="text-[8px] text-slate-400">/ {sub.classmatesCount}</span>
                          </td>

                          {/* Tutor Remarks */}
                          <td className="px-2 py-2.5 text-right font-serif text-[9.5px] italic text-[#333333] max-w-[130px] leading-tight">
                            {sub.remark === 'Excellent' && 'Superb cognitive capability.'}
                            {sub.remark === 'Good' && 'Capable, very good understanding.'}
                            {sub.remark === 'Average' && 'Steady, keep reading.'}
                            {sub.remark === 'Poor' && 'Review assignments carefully.'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* STATISTICAL PERFORMANCE SUMMARY OVERVIEW CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
                <div className="bg-white p-3 rounded-xl border border-[#A6802B]/25 text-center shadow-xs">
                  <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-[#A6802B] block mb-0.5">
                    Terminal Overall Score
                  </span>
                  <span className="text-base font-serif font-black text-[#0B1F3B]">{overallTotalScore} Marks</span>
                  <span className="text-[8px] text-slate-400 block pt-0.5 font-mono">Aggregated sum total</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#A6802B]/25 text-center shadow-xs">
                  <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-[#A6802B] block mb-0.5">
                    Academic Percent Average
                  </span>
                  <span className="text-base font-serif font-black text-emerald-800">{overallAveragePercent}%</span>
                  <span className="text-[8px] text-slate-400 block pt-0.5 font-mono">Percentage mean index</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#A6802B]/25 text-center shadow-xs">
                  <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-[#A6802B] block mb-0.5">
                    OVERALL POSITION RANK
                  </span>
                  <span className="text-base font-serif font-black text-amber-800">
                    {rankResult.pos} <span className="text-[10px] font-sans text-slate-400">of {rankResult.total}</span>
                  </span>
                  <span className="text-[8px] text-slate-400 block pt-0.5 font-mono">Classroom standing</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#A6802B]/25 text-center shadow-xs">
                  <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-[#A6802B] block mb-0.5">
                    terminal average Grade
                  </span>
                  <span className={`inline-block px-3 py-0.5 rounded font-mono font-black text-xs uppercase ${overallNuaGrade.bgClass} ${overallNuaGrade.colorClass}`}>
                    {overallNuaGrade.grade}
                  </span>
                  <span className="text-[8px] text-[#333333] block pt-0.5 leading-none font-bold uppercase">{overallNuaGrade.desc}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#A6802B]/25 text-center shadow-xs">
                  <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-[#A6802B] block mb-0.5">
                    PROMOTION STATUS
                  </span>
                  <span className="text-[10px] uppercase font-black text-[#0B1F3B] bg-slate-100 hover:bg-slate-205 py-1 px-1 rounded block mt-0.5 truncate border border-[#A6802B]/20">
                    {promotionStatus}
                  </span>
                </div>
              </div>

              {/* SECTION D: TWO-COLUMN SKILLS & AFFECTIVE DOMAINS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Psychomotor Skills Card */}
                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 space-y-2">
                  <h5 className="font-serif font-black text-[#0e382b] uppercase text-[10px] tracking-wide border-b border-[#A6802B]/20 pb-1 flex justify-between">
                    <span>Psychomotor Domain Ratings</span>
                    <span className="text-[7.5px] font-mono font-bold tracking-widest text-[#A6802B]">SCALE: A-EXCELLENT, E-POOR</span>
                  </h5>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10.5px] text-[#333333]">
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10px] text-[#333333]">Creativity:</span>
                      <span className="font-mono font-black text-emerald-850">{skillsCreativity}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10px] text-[#333333]">Verbal Fluency:</span>
                      <span className="font-mono font-black text-emerald-850">{skillsVerbal}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10px] text-[#333333]">Games:</span>
                      <span className="font-mono font-black text-emerald-850">{skillsGames}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10px] text-[#333333]">Sports:</span>
                      <span className="font-mono font-black text-emerald-850">{skillsSports}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10px] text-[#333333]">Handling Tools:</span>
                      <span className="font-mono font-black text-emerald-850">{skillsTools}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10px] text-[#333333]">Drawing & Painting:</span>
                      <span className="font-mono font-black text-emerald-850">{skillsDrawing}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5 col-span-2">
                      <span className="font-medium text-[10px] text-[#333333]">Musical Skills:</span>
                      <span className="font-mono font-black text-emerald-850">{skillsMusic}</span>
                    </div>
                  </div>
                </div>

                {/* Affective Areas Card */}
                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 space-y-2">
                  <h5 className="font-serif font-black text-[#0e382b] uppercase text-[10px] tracking-wide border-b border-[#A6802B]/20 pb-1 flex justify-between">
                    <span>Affective Areas Ratings</span>
                    <span className="text-[7.5px] font-mono font-bold tracking-widest text-[#A6802B]">SCALE: A-EXCELLENT, E-POOR</span>
                  </h5>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10.5px] text-[#333333]">
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Punctuality:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affPunctuality}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Neatness:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affNeatness}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Politeness:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affPoliteness}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Honesty:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affHonesty}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Relationship:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affRelationship}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Leadership:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affLeadership}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Emotional Stability:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affStability}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Health status:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affHealth}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Attitude to Study:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affAttitude}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5">
                      <span className="font-medium text-[10.5px] text-[#333333]">Attentiveness:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affAttentiveness}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-150 py-0.5 col-span-2">
                      <span className="font-medium text-[10.5px] text-[#333333]">Perseverance diligence:</span>
                      <span className="font-mono font-black text-[#0e382b]">{affPerseverance}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION E: TUTORS, PRINCIPALS & GUARDIANS DECISIONS NOTES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-serif">
                
                {/* Tutors Remarks */}
                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 text-xs text-[#333333] flex flex-col justify-between h-40">
                  <div>
                    <h5 className="font-bold text-[#0e382b] uppercase text-[10px] tracking-wide border-b border-slate-150 pb-1 flex justify-between font-serif">
                      <span>1. Class Tutor Remarks</span>
                      <span className="text-[7.5px] font-mono text-[#A6802B]">SIG: YES</span>
                    </h5>
                    <p className="italic leading-normal pt-1 text-[#333333] line-clamp-3 select-text">
                      "{teacherComments}"
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="font-mono text-[7px] text-slate-400 block tracking-widest">{classTeacherName.toUpperCase()}</span>
                    <div className="h-0.5 w-12 bg-[#A6802B] mt-0.5" />
                  </div>
                </div>

                {/* Principal Comments */}
                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 text-xs text-[#333333] flex flex-col justify-between h-40">
                  <div>
                    <h5 className="font-bold text-emerald-800 uppercase text-[10px] tracking-wide border-b border-slate-150 pb-1 flex justify-between font-serif">
                      <span>2. Principal’s Comment</span>
                      <span className="text-[7.5px] font-mono text-[#A6802B]">OFFICIAL SEAL</span>
                    </h5>
                    <p className="italic leading-normal pt-1 text-[#333333] line-clamp-3 select-text">
                      "{principalComments}"
                    </p>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[7px] text-slate-400 block tracking-widest">{principalName.toUpperCase()}</span>
                      <div className="h-0.5 w-10 bg-[#0e382b] mt-0.5" />
                    </div>
                    {/* Circle seal */}
                    <div className="border-2 border-emerald-700/80 text-emerald-700 text-[6.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded transform -rotate-6 select-none leading-none">
                      APPROVED STAMP
                    </div>
                  </div>
                </div>

                {/* Parent Comments (Interactive feedback allowed!) */}
                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 text-xs text-[#333333] flex flex-col justify-between h-40">
                  <div>
                    <h5 className="font-bold text-[#0B1F3B] uppercase text-[10px] tracking-wide border-b border-slate-150 pb-1 flex justify-between font-serif">
                      <span>3. Parent comments</span>
                      <span className="text-[7.5px] font-mono text-[#A6802B]">GUARDIAN COGNIZANCE</span>
                    </h5>
                    
                    {currentRole === 'parent' ? (
                      <div className="space-y-1.5 mt-1">
                        <textarea
                          placeholder="Type your feedback message / thoughts here..."
                          rows={2}
                          value={guardianComments}
                          onChange={(e) => handleSaveGuardianComments(e.target.value)}
                          className="w-full text-[10px] px-2 py-1 bg-[#FAF9F5] border border-slate-350 rounded-md outline-none text-[#333333] focus:bg-white placeholder:text-slate-400"
                        />
                        <span className="text-[8px] text-emerald-700 font-bold block leading-none">
                          ✓ Auto-saved instantly into student ledger
                        </span>
                      </div>
                    ) : (
                      <p className="italic leading-normal pt-1 text-[#333333] line-clamp-3 select-text">
                        {guardianComments ? `"${guardianComments}"` : 'No comment has been registered by parent yet.'}
                      </p>
                    )}
                  </div>
                  <div className="pt-2">
                    <span className="font-mono text-[7px] text-slate-400 block tracking-widest">
                      {currentRole === 'parent' ? 'LOGGED PARENT FEEDBACK' : 'PARENT/GUARDIAN SIGN-OFF'}
                    </span>
                    <div className="h-0.5 w-12 bg-[#0B1F3B] mt-0.5" />
                  </div>
                </div>

              </div>

              {/* SECTION F: FOOTER CALENDAR & vacation */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0e382b] text-[#FAF9F5] p-3.5 rounded-xl text-[10.5px] gap-3 font-mono">
                <div className="flex items-center gap-2 leading-none flex-wrap">
                  <Calendar className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span className="font-bold text-amber-200 uppercase text-[8.5px]">Vacation Date:</span>
                  <span className="font-black text-white mr-2">
                    {vacationDate ? new Date(vacationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'July 24, 2026'}
                  </span>
                  <span>|</span>
                  <span className="font-bold text-amber-200 uppercase text-[8.5px] ml-2">Next Term Begins:</span>
                  <span className="font-black text-white">
                    {nextTermBegins ? new Date(nextTermBegins).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Sept 14, 2026'}
                  </span>
                </div>

                <div className="text-[8.5px] text-[#FAF9F5]/70 flex items-center gap-1">
                  <span>Certification: NUA-HYBD-A96</span>
                  <span>|</span>
                  <span>Printed: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="p-16 text-center bg-white border border-natural-beige rounded-3xl space-y-3">
          <Info className="w-12 h-12 text-[#A6802B] mx-auto" />
          <h4 className="font-serif font-black text-slate-800 text-sm">Select Student to load Dashboard</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Please select a pupil on the filter toolbar deck to render the report transcript sheet.</p>
        </div>
      )}

    </div>
  );
}
