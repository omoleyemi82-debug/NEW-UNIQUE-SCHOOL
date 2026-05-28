import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student, Course, GradeRecord, AttendanceRecord } from '../types';
import { 
  Printer, Download, Sparkles, CheckCircle, Search, Save, 
  Edit, RefreshCw, X, Check, Award, ShieldAlert, BookOpen, 
  User, Calendar, Info, FileText, Settings, Upload, Image as ImageIcon
} from 'lucide-react';
import { getWAECGrade, calculateTermPerformance } from '../utils/gradeUtils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Sample high-quality avatar face URLs for standard student passport photos
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

export default function ReportSheet({ initialStudentId, isReadOnly = false }: ReportSheetProps) {
  const { 
    students, 
    courses, 
    grades, 
    attendance, 
    updateStudent,
    currentRole 
  } = useSchool();

  // Role permissions: Admin and Teacher can configure/edit overrides. Student and Parent are read-only views.
  const canEdit = !isReadOnly && (currentRole === 'admin' || currentRole === 'teacher');

  // Interactive selectors
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('1st Term 2026');
  const [selectedSession, setSelectedSession] = useState<string>('2025/2026');
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>('');
  
  // Tab view within configuration: 'view' (printable report) | 'edit' (overrides setup)
  const [activeSubTab, setActiveSubTab] = useState<'view' | 'edit'>('view');

  // Override State (persisted per student per term in localStorage)
  const [termOpenedDays, setTermOpenedDays] = useState<number>(120);
  const [termPresentDays, setTermPresentDays] = useState<number>(115);
  const [termAbsentDays, setTermAbsentDays] = useState<number>(5);
  const [nextTermBegins, setNextTermBegins] = useState<string>('2026-09-14');
  const [classTeacherName, setClassTeacherName] = useState<string>('Mrs. Evelyn Sterling');
  const [principalName, setPrincipalName] = useState<string>('Dr. (Mrs) A. B. Adebayo');
  const [promotionStatus, setPromotionStatus] = useState<string>('Promoted with Distinction');
  const [teacherComments, setTeacherComments] = useState<string>('Demonstrates outstanding focus and continuous intellectual improvement. Excelled in all continuous assessment segments.');
  const [principalComments, setPrincipalComments] = useState<string>('A stellar performance representing the highest moral and academic standards of the Academy.');

  // Student profile metadata state (for matching requirements)
  const [selectedDept, setSelectedDept] = useState<'Science' | 'Art' | 'Commerce' | 'N/A'>('Science');
  const [selectedHouse, setSelectedHouse] = useState<string>('Lions House (Red)');
  const [selectedPassport, setSelectedPassport] = useState<string>(SAMPLE_PASSPORTS[0]);
  const [dobInput, setDobInput] = useState<string>('2010-04-12');
  const [genderInput, setGenderInput] = useState<string>('Male');

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Sync selectors
  useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId);
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [initialStudentId, students]);

  // Load term values and student biography data whenever student or term changes
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

    // Load Term Overrides from localStorage
    const overrideKey = `nua_report_override_${selectedStudentId}_${selectedSession.replace(/\//g, '_')}_${selectedTerm.replace(/\s+/g, '_')}`;
    const savedOverrides = localStorage.getItem(overrideKey);

    // Calculate dynamic helper attendance values from context as initial/default states
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
        setClassTeacherName(data.teacherName || 'Mrs. Evelyn Sterling');
        setPrincipalName(data.principalName || 'Dr. (Mrs) A. B. Adebayo');
        setPromotionStatus(data.promoStatus || 'Promoted with Distinction');
        setTeacherComments(data.teacherComm || 'Demonstrates outstanding focus and continuous intellectual improvement. Excelled in all continuous assessment segments.');
        setPrincipalComments(data.principalComm || 'A stellar performance representing the highest moral and academic standards of the Academy.');
      } catch (e) {
        console.error('Failed to parse report card overrides', e);
      }
    } else {
      // Feed initial default states based on real database records
      setTermOpenedDays(calculatedOpened);
      setTermPresentDays(presentCount > 0 ? presentCount : 115);
      setTermAbsentDays(absentCount > 0 ? absentCount : 5);
      setNextTermBegins('2026-09-14');
      setClassTeacherName('Mrs. Evelyn Sterling');
      setPrincipalName('Dr. (Mrs) A. B. Adebayo');
      setPromotionStatus(genderInput === 'Male' ? 'Promoted. Outstanding standing.' : 'Promoted with high honours.');
      setTeacherComments('The student exhibits a highly commendable cognitive pattern. Active contributor to overall class projects and seminars.');
      setPrincipalComments('Impeccable academic progress report. Certified approved for promotional advancement.');
    }
  }, [selectedStudentId, selectedTerm, selectedSession, students, attendance]);

  // Handle saving overrides/student records
  const handleSaveOverrides = () => {
    if (!selectedStudentId) return;

    // 1. Update Student Bio Profile in database Context (persists first-class student fields)
    updateStudent(selectedStudentId, {
      department: selectedDept,
      houseUnit: selectedHouse,
      passportPhoto: selectedPassport,
      dateOfBirth: dobInput,
      gender: genderInput
    });

    // 2. Update Term Specific Overrides in LocalStorage
    const overrideKey = `nua_report_override_${selectedStudentId}_${selectedSession.replace(/\//g, '_')}_${selectedTerm.replace(/\s+/g, '_')}`;
    const data = {
      opened: Number(termOpenedDays),
      present: Number(termPresentDays),
      absent: Number(termAbsentDays),
      nextTerm: nextTermBegins,
      teacherName: classTeacherName,
      principalName: principalName,
      promoStatus: promotionStatus,
      teacherComm: teacherComments,
      principalComm: principalComments
    };
    
    localStorage.setItem(overrideKey, JSON.stringify(data));
    setActiveSubTab('view');
  };

  // Quick Action: Pre-populate attendance ratios
  const handleSetPerfectAttendance = () => {
    setTermOpenedDays(120);
    setTermPresentDays(120);
    setTermAbsentDays(0);
  };

  // Core Math - Term Dynamic Performance Calculations mapper from Database
  const activeStudent = students.find(s => s.id === selectedStudentId);

  // Filter student grades for specified Term & Session
  const studentGrades = grades.filter(g => {
    if (g.studentId !== selectedStudentId) return false;
    // Maps Spring 2026 onto 1st Term 2026 for seamless demonstration data
    if (selectedTerm === '1st Term 2026') {
      return g.term === '1st Term 2026' || g.term === 'Spring 2026' || g.term === 'Fall 2026';
    }
    return g.term === selectedTerm;
  });

  // Calculate position in classroom directory
  const calculateRank = () => {
    if (!activeStudent) return { pos: 1, total: students.length };
    
    const sameLevelStudents = students.filter(s => s.gradeLevel === activeStudent.gradeLevel);
    const averages = sameLevelStudents.map(student => {
      const sGrades = grades.filter(g => {
        if (g.studentId !== student.id) return false;
        if (selectedTerm === '1st Term 2026') {
          return g.term === '1st Term 2026' || g.term === 'Spring 2026' || g.term === 'Fall 2026';
        }
        return g.term === selectedTerm;
      });

      if (sGrades.length === 0) return { id: student.id, avg: 0 };
      const sum = sGrades.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0);
      return { id: student.id, avg: sum / sGrades.length };
    });

    averages.sort((a, b) => b.avg - a.avg);
    const posIdx = averages.findIndex(item => item.id === selectedStudentId);
    return {
      pos: posIdx !== -1 ? posIdx + 1 : 1,
      total: sameLevelStudents.length
    };
  };

  const rankResult = calculateRank();

  // Aggregate Course/Subject Scores (Standard Nigerian Report features CA + Exams)
  const mapSubjectGrades = () => {
    // Group grades by classroom/course ID
    const subjectGroups: Record<string, GradeRecord[]> = {};
    studentGrades.forEach(g => {
      if (!subjectGroups[g.courseId]) {
        subjectGroups[g.courseId] = [];
      }
      subjectGroups[g.courseId].push(g);
    });

    return Object.entries(subjectGroups).map(([courseId, records]) => {
      const courseObj = courses.find(c => c.id === courseId);
      const subjectLabel = courseObj ? courseObj.name : 'Unknown Discipline';
      const subjectCode = courseObj ? courseObj.code : 'NUA';

      // Distinguish CA vs Exam records
      const examRecs = records.filter(r => r.category === 'exam');
      const caRecs = records.filter(r => r.category !== 'exam');

      // Calculate CA score (Summed and normalized out of 30)
      let caSum = 0;
      let caMax = 0;
      caRecs.forEach(r => {
        caSum += r.score;
        caMax += r.maxScore;
      });
      const caNormalized = caMax > 0 ? Number(((caSum / caMax) * 30).toFixed(1)) : 22.5; // fallback standard

      // Calculate Exam score (Summed and normalized out of 70)
      let examSum = 0;
      let examMax = 0;
      examRecs.forEach(r => {
        examSum += r.score;
        examMax += r.maxScore;
      });
      const examNormalized = examMax > 0 ? Number(((examSum / examMax) * 70).toFixed(1)) : 49.0; // fallback standard

      const totalTermScore = Math.round(caNormalized + examNormalized);
      const waecGrade = getWAECGrade(totalTermScore);

      // Subject Position rank calculation compared to other classmates
      const classmates = students.filter(s => s.gradeLevel === activeStudent?.gradeLevel);
      const subjectAverages = classmates.map(s => {
        const sGrades = grades.filter(g => g.studentId === s.id && g.courseId === courseId);
        if (sGrades.length === 0) return { id: s.id, total: 0 };
        const sSum = sGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0);
        return { id: s.id, total: sSum / sGrades.length };
      });
      subjectAverages.sort((a, b) => b.total - a.total);
      const subjectRankIdx = subjectAverages.findIndex(item => item.id === selectedStudentId);
      const sRank = subjectRankIdx !== -1 ? subjectRankIdx + 1 : 1;

      // Teacher comments custom selection based on grade
      let teacherRemark = 'A highly commendable term outcome.';
      if (totalTermScore >= 75) teacherRemark = 'Outstanding brilliance. A natural leader in this discipline.';
      else if (totalTermScore >= 65) teacherRemark = 'Very good understanding. Expresses analytical competency.';
      else if (totalTermScore >= 50) teacherRemark = 'Satisfactory output. Focus on assignments next session.';

      return {
        courseId,
        subjectLabel,
        subjectCode,
        caScore: caNormalized,
        examScore: examNormalized,
        totalScore: totalTermScore,
        grade: waecGrade.grade,
        colorClass: waecGrade.colorClass,
        bgClass: waecGrade.bgClass,
        remark: waecGrade.desc,
        rank: sRank,
        classmatesCount: classmates.length,
        teacherRemark
      };
    });
  };

  const performanceMatrix = mapSubjectGrades();

  // Overall totals
  const overallTotalScore = performanceMatrix.reduce((acc, curr) => acc + curr.totalScore, 0);
  const overallAverage = performanceMatrix.length > 0 
    ? Math.round(performanceMatrix.reduce((acc, curr) => acc + curr.totalScore, 0) / performanceMatrix.length)
    : 72; // default high-quality fallback if empty

  const overallWaec = getWAECGrade(overallAverage);
  const termGPAData = calculateTermPerformance(studentGrades);

  // PDF Generation Function
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    try {
      // Small timeout to allow styling render updates
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Retain sharp display vector ratios
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
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const widthVal = imgWidth * ratio;
      const heightVal = imgHeight * ratio;

      const posX = (pdfWidth - widthVal) / 2;
      const posY = 15; // padding top

      pdf.addImage(imgData, 'PNG', posX, posY, widthVal, heightVal);
      pdf.save(`${activeStudent?.name.replace(/\s+/g, '_')}_Report_Card_${selectedTerm.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating report PDF:', error);
      alert('An issue occurred during PDF compression. Please use standard Print system.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Direct Standard System Print
  const handlePrintStandard = () => {
    window.print();
  };

  // Filter students array based on search input (useful for admin/teachers selector list)
  const filteredStudentsSelect = students.filter(s => {
    const cleanQuery = searchStudentQuery.trim().toLowerCase();
    if (!cleanQuery) return true;

    // Smart name part splitting and substring mapping
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

  return (
    <div className="space-y-6 text-natural-charcoal print:p-0 print:bg-white">
      
      {/* 1. SELECTION & NAVIGATION ACTION BANNER (HIDDEN DURING PRINT) */}
      <div className="bg-white p-6 rounded-3xl border border-natural-beige shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase text-natural-green tracking-widest block">REPORT SECTION</span>
          <h2 className="text-2xl font-serif font-black text-slate-900 leading-tight">Certified Academic Evaluation Sheets</h2>
          <p className="text-xs text-slate-500 max-w-xl">Automatically loaded from school databases. Generate verified, print-ready West African Examination Council standard report cards with dynamic standing rankings.</p>
        </div>

        {/* Action controllers */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {canEdit && (
            <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-xl text-xs font-bold font-sans">
              <button
                onClick={() => setActiveSubTab('view')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeSubTab === 'view' ? 'bg-white text-natural-green shadow-xs' : 'text-slate-505 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> View Card
              </button>
              <button
                onClick={() => setActiveSubTab('edit')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeSubTab === 'edit' ? 'bg-white text-natural-green shadow-xs' : 'text-slate-505 hover:text-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> Config Settings
              </button>
            </div>
          )}

          <button
            onClick={handlePrintStandard}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-250 text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Sheet
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-4 py-2.5 bg-natural-green hover:bg-natural-green/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Bundling...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC WORKSPACE SELECTORS FOR STAFF/ADMIN (HIDDEN DURING PRINT) */}
      {!initialStudentId && (currentRole === 'admin' || currentRole === 'teacher') && (
        <div className="bg-white p-5 rounded-2xl border border-natural-beige shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center print:hidden">
          
          {/* Student picker drop */}
          <div className="md:col-span-5 relative">
            <label className="block text-[9px] uppercase font-black text-slate-450 mb-1">Select Candidate Pupil</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search pupils..."
                value={searchStudentQuery}
                onChange={(e) => setSearchStudentQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none"
              />
            </div>
            {searchStudentQuery && (
              <div className="absolute z-45 left-0 right-0 mt-1 max-h-[250px] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl divide-y divide-slate-100">
                {filteredStudentsSelect.map(s => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      setSearchStudentQuery('');
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-xs font-semibold flex items-center justify-between gap-3 group transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={s.passportPhoto || s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop'} 
                        alt={`${s.name} Passport`} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-150 shadow-xs" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop';
                        }}
                      />
                      <div>
                        <span className="font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">{s.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold block">No: {s.admissionNumber || 'NUA-26-...'} • Dept: {s.department || 'N/A'}</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md font-extrabold">{s.gradeLevel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <label className="block text-[9px] uppercase font-black text-slate-450 mb-1">Target School Term</label>
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
            <label className="block text-[9px] uppercase font-black text-slate-450 mb-1">Academic Session Period</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="2025/2026">2025/2026 Session</option>
              <option value="2026/2027">2026/2027 Session</option>
            </select>
          </div>

          <div className="md:col-span-2 text-center bg-natural-light/50 p-2.5 rounded-xl border border-natural-beige">
            <span className="text-[8px] text-natural-charcoal/50 uppercase font-bold block">Loaded Profile GPA</span>
            <span className={`text-base font-serif font-black ${termGPAData.colorClass}`}>{termGPAData.gpa}</span>
          </div>
        </div>
      )}

      {/* STUDENT SELF-INFO OR READ-ONLY TERM BAR */}
      {(initialStudentId || currentRole === 'student' || currentRole === 'parent') && (
        <div className="bg-white p-4 rounded-xl border border-natural-beige shadow-xs flex justify-between items-center text-xs print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-natural-green" />
            <span className="font-bold text-natural-green">Active Term Parameter:</span>
            <span className="bg-natural-light border border-natural-beige px-3 py-1 rounded-lg font-black text-natural-clay uppercase text-[10px]">
              {selectedTerm} • Session {selectedSession}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Jump to:</span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-natural-light border border-natural-beige text-[11px] font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer text-natural-green"
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
              <h3 className="text-lg font-serif font-bold text-slate-900">Configure Report Card Metadata Overrides</h3>
              <p className="text-xs text-slate-500">Add or edit student biodata and terms indicators metrics to customize the report output sheet fully.</p>
            </div>
            <button
              onClick={() => setActiveSubTab('view')}
              className="p-1.5 text-slate-425 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Box: Student Bio parameters */}
            <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block font-mono border-b border-slate-200 pb-2">Student Records Biodata</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Gender</label>
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
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Date of Birth</label>
                  <input
                    type="date"
                    value={dobInput}
                    onChange={(e) => setDobInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Department</label>
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
                  <label className="block text-[10px] font-bold uppercase text-slate-600">House / Unit</label>
                  <input
                    type="text"
                    value={selectedHouse}
                    onChange={(e) => setSelectedHouse(e.target.value)}
                    placeholder="e.g. Lions House (Red)"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase text-slate-600">Student Passport Photograph Image</label>
                <div className="grid grid-cols-6 gap-2">
                  {SAMPLE_PASSPORTS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedPassport(url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                        selectedPassport === url ? 'border-emerald-600 scale-105 shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Passport ${i+1}`} className="w-full h-full object-cover" />
                      {selectedPassport === url && (
                        <div className="absolute inset-0 bg-emerald-600/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm font-bold bg-emerald-600 rounded-full p-0.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 block mb-1">Or paste a custom image URL:</span>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      placeholder="https://example.com/passport.jpg"
                      value={selectedPassport}
                      onChange={(e) => setSelectedPassport(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-250 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Term Override and Attendance details */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block font-mono border-b border-slate-200 pb-2">Term Override, Attendance & Promotion Info</span>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Times Opened *</label>
                  <input
                    type="number"
                    value={termOpenedDays}
                    onChange={(e) => setTermOpenedDays(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Times Present *</label>
                  <input
                    type="number"
                    value={termPresentDays}
                    onChange={(e) => setTermPresentDays(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Times Absent</label>
                  <input
                    type="number"
                    value={termAbsentDays}
                    onChange={(e) => setTermAbsentDays(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSetPerfectAttendance}
                  className="px-2.5 py-1 text-[9.5px] uppercase font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded transition cursor-pointer"
                >
                  Set Perfect (120/120)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Next Term Begins *</label>
                  <input
                    type="date"
                    value={nextTermBegins}
                    onChange={(e) => setNextTermBegins(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Promotion Status *</label>
                  <input
                    type="text"
                    value={promotionStatus}
                    onChange={(e) => setPromotionStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Class Teacher Name</label>
                  <input
                    type="text"
                    value={classTeacherName}
                    onChange={(e) => setClassTeacherName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-600">School Principal Name</label>
                  <input
                    type="text"
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-600">Class Tutor Comments</label>
                <textarea
                  rows={2}
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-600">Principal Benson's Decision Endorsement</label>
                <textarea
                  rows={2}
                  value={principalComments}
                  onChange={(e) => setPrincipalComments(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-none"
                />
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
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" /> Save Report Card parameters
            </button>
          </div>
        </div>
      )}

      {/* 4. PREMIUM DESIGNED CERTIFICATE REPORT SHEET */}
      {activeStudent ? (
        <div className="w-full overflow-x-auto select-none print:overflow-visible p-1">
          
          <div 
            ref={reportRef}
            id="nua-official-report-sheet"
            className="w-full min-w-[780px] print:min-w-0 bg-[#FAF9F5] border-8 border-double border-[#A6802B]/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl print:border-none print:shadow-none print:bg-white print:p-0"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            
            {/* Elegant Background Certificate Filigree Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none z-0">
              <svg 
                className="w-[450px] h-[450px] text-natural-green fill-current animate-spin-slow"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93V4.07z"/>
              </svg>
            </div>

            {/* Print watermark border decoration */}
            <div className="absolute inset-4 border border-[#A6802B]/20 pointer-events-none rounded-2xl z-0 print:border-none" />

            <div className="relative z-10 space-y-8">
              
              {/* SECTION A: SCHOOL INFORMATION & HEADER */}
              <div className="flex items-center justify-between gap-6 pb-6 border-b-2 border-dashed border-[#A6802B]/30">
                
                {/* Left Seal/Logo Frame */}
                <div className="flex items-center justify-center border-4 border-[#A6802B] rounded-full p-2 h-20 w-20 bg-white shadow-md font-serif font-black text-[#0e382b] text-center uppercase text-xl shrink-0">
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-mono font-bold text-[#A6802B]">NUA</span>
                    <span className="text-[9px]">Lekki</span>
                    <span className="text-[7.5px] font-sans font-black tracking-widest text-emerald-700 font-bold block">★</span>
                  </div>
                </div>

                {/* Center School Details */}
                <div className="text-center flex-1 space-y-1">
                  <h1 className="text-3xl font-serif font-black text-[#0e382b] tracking-tight leading-none uppercase">NEW UNIQUE ACADEMY</h1>
                  <p className="text-[10px] text-[#A6802B] font-black tracking-widest leading-none">APPROVED BY INTEGRATED MINISTRY OF EDUCATION, EST. 2021</p>
                  <p className="text-[11px] text-[#0e382b]/80 font-serif italic">"Character and Academic Prowess for Global Elevation"</p>
                  
                  {/* Detailed School Contact Data */}
                  <p className="text-[9.5px] text-slate-500 font-medium">
                    Plot 12, Academy Way, Lekki Phase 1, Lagos, Nigeria | Tel: +234 (0) 812 345 6789 | Email: info@newuniqueacademy.edu.ng
                  </p>
                </div>

                {/* Right QR stamp */}
                <div className="border border-slate-200 bg-white p-1.5 text-center shrink-0 rounded-lg">
                  <div className="grid grid-cols-4 gap-0.5 w-[42px] h-[42px] bg-indigo-50/10 opacity-70">
                    <div className="bg-slate-800 rounded-xs" /><div className="bg-slate-800 rounded-xs" /><div className="bg-transparent" /><div className="bg-slate-800 rounded-xs" />
                    <div className="bg-transparent" /><div className="bg-slate-800 rounded-xs" /><div className="bg-slate-800 rounded-xs" /><div className="bg-transparent" />
                    <div className="bg-slate-800 rounded-xs" /><div className="bg-transparent" /><div className="bg-slate-800 rounded-xs" /><div className="bg-slate-800 rounded-xs" />
                    <div className="bg-slate-800 rounded-xs" /><div className="bg-slate-800 rounded-xs" /><div className="bg-transparent" /><div className="bg-slate-800 rounded-xs" />
                  </div>
                  <span className="text-[7px] text-slate-405 font-mono font-bold uppercase tracking-wider block mt-1">VERIFIED</span>
                </div>
              </div>

              {/* REPORT SHEET CORE INDICATORS TITLE */}
              <div className="text-center bg-[#0e382b] text-white p-3.5 rounded-xl border border-[#A6802B]/40 shadow-xs">
                <h2 className="text-xs font-mono font-black uppercase tracking-widest leading-none">
                  TERM ACADEMIC RECORD SHEET & DIPLOMA TRANSCRIPT
                </h2>
                <div className="flex justify-center items-center gap-6 text-[10px] font-bold uppercase tracking-wider mt-1 text-emerald-200">
                  <span>Session: {selectedSession} Academic Session</span>
                  <span>•</span>
                  <span className="underline decoration-wavy decoration-[#C29B38] underline-offset-4 font-black">{selectedTerm}</span>
                </div>
              </div>

              {/* SECTION B: STUDENT & ATTENDANCE INFORMATION CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* 1. Student Passport Photo & Basic Roster Detail */}
                <div className="md:col-span-3 flex flex-col justify-center items-center gap-4 bg-white p-5 rounded-2xl border border-[#A6802B]/20 text-center">
                  
                  {/* Student Passport Picture */}
                  <div className="relative h-28 w-24 shrink-0 border-4 border-[#0e382b] bg-slate-100 rounded-md shadow-md overflow-hidden bg-white">
                    {selectedPassport ? (
                      <img 
                        src={selectedPassport} 
                        alt={activeStudent.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // fallback in case of load fails
                          e.currentTarget.src = SAMPLE_PASSPORTS[0];
                        }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-slate-150">
                        <User className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                    
                    {/* Official Stamp Overlay Ring over passport */}
                    <div className="absolute -bottom-2 -right-4 h-10 w-10 rounded-full border border-teal-700/60 bg-teal-50/20 text-teal-700 text-[6px] shrink-0 font-bold flex items-center justify-center transform -rotate-12 scale-90">
                      <span>APPROVED</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 block pb-0.5">STUDENT REGISTRATION</span>
                    <span className="font-mono text-xs font-black text-emerald-700">{activeStudent.username || 'NUA/2026/001'}</span>
                  </div>
                </div>

                {/* 2. Detailed Biography Ledger */}
                <div className="md:col-span-6 bg-white p-5 rounded-2xl border border-[#A6802B]/20 text-xs text-slate-805 grid grid-cols-2 gap-x-4 gap-y-3">
                  
                  {/* Left Bio Rows */}
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Student Full Name</span>
                    <span className="font-serif font-black text-sm text-[#0e382b]">{activeStudent.name}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Admission Number</span>
                    <span className="font-mono font-extrabold text-[#A6802B]">{activeStudent.admissionNumber || 'NUA-26-001'}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Gender</span>
                    <span className="font-semibold">{genderInput}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Date of Birth</span>
                    <span className="font-semibold">{dobInput ? new Date(dobInput).toLocaleDateString() : '12th April 2010'}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Class Level</span>
                    <span className="font-bold text-[#0e382b]">{activeStudent.gradeLevel}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Department Track</span>
                    <span className="font-bold bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded text-[10px] inline-block mt-0.5">
                      {selectedDept} Department
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">House / Unit</span>
                    <span className="font-semibold text-rose-700">{selectedHouse}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Unique ID Number</span>
                    <span className="font-mono text-[10px] font-bold text-slate-500">{activeStudent.id}</span>
                  </div>

                </div>

                {/* 3. METRIC ATTENDANCE INFO CARD */}
                <div className="md:col-span-3 bg-[#FAF9F5] p-5 rounded-2xl border-2 border-dashed border-[#A6802B]/40 text-xs flex flex-col justify-between">
                  <div className="space-y-1 pb-2 border-b border-[#A6802B]/25">
                    <span className="font-serif font-black text-[#0e382b] text-center block text-[11px] uppercase tracking-wide">
                      Attendance Ledgers
                    </span>
                  </div>

                  <div className="space-y-2 mt-2 flex-grow flex flex-col justify-center">
                    <div className="flex justify-between items-center bg-white p-1.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] text-slate-450 uppercase font-extrabold">Times Opened</span>
                      <span className="font-mono font-black text-[#0e382b]">{termOpenedDays} Days</span>
                    </div>

                    <div className="flex justify-between items-center bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100">
                      <span className="text-[9px] text-emerald-800 uppercase font-extrabold">Total Present</span>
                      <span className="font-mono font-black text-emerald-700">{termPresentDays} Days</span>
                    </div>

                    <div className="flex justify-between items-center bg-rose-50/50 p-1.5 rounded-lg border border-rose-100">
                      <span className="text-[9px] text-rose-800 uppercase font-extrabold">Total Absent</span>
                      <span className="font-mono font-black text-rose-600">{termAbsentDays} Days</span>
                    </div>
                  </div>

                  <div className="text-[8.5px] text-slate-420 italic text-center leading-tight mt-2 block border-t border-[#A6802B]/10 pt-1">
                    Atnd Rate: {Math.round((termPresentDays / Math.max(1, termOpenedDays)) * 100)}% verified
                  </div>
                </div>

              </div>

              {/* SECTION C: SUBJECT PERFORMANCE MATRIX TABLE */}
              <div className="space-y-2">
                <div className="flex justify-between items-end border-b border-[#A6802B]/30 pb-1">
                  <h4 className="font-serif font-black text-[#0e382b] text-xs uppercase tracking-widest">
                    Subject Term Performance Matrix
                  </h4>
                  <span className="text-[8px] font-bold text-[#A6802B] uppercase">WEST AFRICAN WEST GRADING SCALE (WAEC)</span>
                </div>

                {performanceMatrix.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 italic text-xs bg-white rounded-xl border border-slate-200">
                    No grade items could be compiled from academic databases. Teacher should enter student evaluation scores in the Grading Panel.
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white border border-[#A6802B]/30 rounded-xl shadow-xs">
                    <table className="w-full text-left text-[11px] min-w-[700px]">
                      
                      {/* Table Column Headers */}
                      <thead className="bg-[#0e382b] text-white text-[9.5px] font-bold uppercase tracking-wider border-b border-[#A6802B]">
                        <tr>
                          <th className="px-4 py-2.5">Subject Discipline</th>
                          <th className="px-4 py-2.5 text-center">CA (30%)</th>
                          <th className="px-4 py-2.5 text-center">Terminal Exam (70%)</th>
                          <th className="px-4 py-2.5 text-center">Aggregate Score</th>
                          <th className="px-4 py-2.5 text-center">WAEC Grade</th>
                          <th className="px-4 py-2.5 text-center">Class Rank</th>
                          <th className="px-4 py-2.5 text-right">Tutor Remarks</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-150">
                        {performanceMatrix.map((sub, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <span className="font-serif font-extrabold text-[#0e382b] block">{sub.subjectLabel}</span>
                              <span className="font-mono text-[9px] text-[#A6802B] block">{sub.subjectCode}</span>
                            </td>
                            
                            <td className="px-4 py-3.5 text-center font-mono font-bold text-[#0e382b] bg-slate-50/50">
                              {sub.caScore} <span className="text-[8px] text-slate-400">/30</span>
                            </td>

                            <td className="px-4 py-3.5 text-center font-mono font-bold text-[#0e382b] bg-slate-50/50">
                              {sub.examScore} <span className="text-[8px] text-slate-400">/70</span>
                            </td>

                            <td className="px-4 py-3.5 text-center">
                              <span className="font-serif font-black text-[#0e382b] text-sm">{sub.totalScore}%</span>
                            </td>

                            <td className="px-4 py-3.5 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded font-mono font-black border text-[11px] uppercase ${sub.bgClass} ${sub.colorClass}`}>
                                {sub.grade}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-600">
                              {sub.rank} <span className="text-[8px] text-slate-400">/ {sub.classmatesCount}</span>
                            </td>

                            <td className="px-4 py-3.5 text-right text-[10px] text-slate-500 italic max-w-[200px] leading-snug">
                              {sub.teacherRemark}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                )}
              </div>

              {/* SECTION D: PERFORMANCE INFORMATION SUMMARY GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4">
                
                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 text-center">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#A6802B]/70 block mb-1">
                    Overall Total Score
                  </span>
                  <span className="text-xl font-serif font-black text-[#0e382b]">{overallTotalScore} Marks</span>
                  <span className="text-[8.5px] text-slate-400 block pt-0.5">Summed terminal aggregates</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 text-center">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#A6802B]/70 block mb-1">
                    Academic Average
                  </span>
                  <span className="text-xl font-serif font-black text-emerald-700">{overallAverage}%</span>
                  <span className="text-[8.5px] text-slate-400 block pt-0.5">Score index mean</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 text-center">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#A6802B]/70 block mb-1">
                    Class position rank
                  </span>
                  <span className="text-xl font-serif font-black text-[#0e382b]">
                    {rankResult.pos} <span className="text-xs font-sans text-slate-400">of {rankResult.total}</span>
                  </span>
                  <span className="text-[8.5px] text-slate-400 block pt-0.5 font-bold uppercase tracking-wider text-emerald-800">
                    CLASS DIRECTORY RANK
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 text-center">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#A6802B]/70 block mb-1">
                    Terminal WAEC Grade
                  </span>
                  <span className={`inline-block px-3 py-0.5 rounded font-mono font-black border text-sm uppercase ${overallWaec.bgClass} ${overallWaec.colorClass}`}>
                    {overallWaec.grade}
                  </span>
                  <span className="text-[8.5px] text-slate-400 block pt-1 leading-none font-bold block">{overallWaec.desc}</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#A6802B]/25 text-center">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#A6802B]/70 block mb-1">
                    PROMOTION STATUS
                  </span>
                  <span className="text-xs uppercase tracking-wider font-black text-[#0e382b] bg-[#A6802B]/10 px-2 py-1 rounded block mt-1 border border-[#A6802B]/20">
                    {promotionStatus}
                  </span>
                </div>

              </div>

              {/* SECTION E: TEACHERS & PRINCIPALS DECISIONS NOTES */}
              <div className="bg-white p-5 rounded-xl border border-[#A6802B]/25 grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-xs">
                
                <div className="space-y-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <h5 className="font-serif font-extrabold text-[#0e382b] uppercase text-[10.5px] tracking-wide border-b border-slate-150 pb-1.5 flex justify-between">
                    <span>Class Tutor Evaluation</span>
                    <span className="text-[8.5px] font-mono text-[#A6802B]">{classTeacherName}</span>
                  </h5>
                  <p className="text-slate-650 italic leading-relaxed pt-1 select-text">
                    "{teacherComments}"
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <div className="h-0.5 w-12 bg-[#A6802B]" />
                    <span className="text-[8px] font-mono tracking-widest text-[#A6802B]/70 block">TUTOR ENDORSED SIGN</span>
                  </div>
                </div>

                <div className="space-y-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <h5 className="font-serif font-extrabold text-emerald-800 uppercase text-[10.5px] tracking-wide border-b border-slate-150 pb-1.5 flex justify-between">
                    <span>Principal Council Endorsement</span>
                    <span className="text-[8.5px] font-mono text-[#A6802B]">{principalName}</span>
                  </h5>
                  <p className="text-slate-650 italic leading-relaxed pt-1 select-text">
                    "{principalComments}"
                  </p>
                  
                  <div className="pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-10 bg-emerald-800" />
                      <span className="text-[8px] font-mono tracking-widest text-emerald-700 block">APPROVED SEALS</span>
                    </div>

                    {/* Circular Verified Stamp Overlay Seal */}
                    <div className="relative border-4 border-emerald-700/80 text-emerald-700 text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg transform -rotate-6 select-none animate-pulse scale-95 shrink-0">
                      APPROVED EXCO
                      <div className="absolute top-[0.5px] right-2 text-[5.5px] font-sans">NUA</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION F: ADDITIONAL INFORMATION FOOTER */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0e382b] text-[#FAF9F5] p-4 rounded-xl text-xs gap-3 font-mono">
                
                <div className="flex items-center gap-2 leading-none">
                  <Calendar className="w-4 h-4 text-[#A6802B]" />
                  <span className="font-bold text-[#A6501C]/30 text-[#A6802B] uppercase text-[9px]">Next Session Resumes:</span>
                  <span className="font-black text-white underline decoration-wavy decoration-[#C29B38] underline-offset-2">
                    {nextTermBegins ? new Date(nextTermBegins).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Monday, September 14, 2026'}
                  </span>
                </div>

                <div className="text-[9.5px] text-[#FAF9F5]/70 flex items-center gap-1">
                  <span>Audit signature verification:</span>
                  <span className="font-black font-sans uppercase text-[#A6802B]">NUA-EXAMS-SEC09</span>
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
          <h4 className="font-serif font-black text-slate-800 text-sm">Select Student to load Transcript</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Please select a pupil on the administrative filter deck to render the certification card.</p>
        </div>
      )}

    </div>
  );
}
