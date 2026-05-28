import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Award, 
  Zap, 
  ClipboardCheck, 
  Calendar, 
  BookOpen, 
  Clock, 
  BarChart3, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Sparkles, 
  AlertCircle,
  CreditCard,
  Building,
  Printer,
  Download,
  DollarSign,
  GraduationCap,
  Smartphone,
  Shield,
  Lock
} from 'lucide-react';
import { getWAECGrade, calculateTermPerformance } from '../utils/gradeUtils';

export default function StudentPortal({ activeTab, isParentView = false }: { activeTab: string; isParentView?: boolean }) {
  const { currentUserId, students, courses, grades, attendance, quizzes, submissions, addQuizSubmission, events, payTuition, updateStudent } = useSchool();

  // Tuition & payments local screen states
  const [payAmountInput, setPayAmountInput] = useState('1500');
  const [payMethodSelect, setPayMethodSelect] = useState<'Card' | 'Bank Transfer'>('Card');
  
  // Card input states
  const [cardNumber, setCardNumber] = useState('4488 9201 3241 8802');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCVV, setCardCVV] = useState('384');
  
  // Bank transfer state
  const [bankSelected, setBankSelected] = useState('Preston United Trust Bank');

  // Receipt & loading control states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [generatedReceiptObj, setGeneratedReceiptObj] = useState<any | null>(null);

  // Nigerian Paystack integration states
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [payCurrency, setPayCurrency] = useState<'USD' | 'NGN'>('NGN');
  const [paystackStep, setPaystackStep] = useState<'details' | 'pin' | 'otp' | 'success' | 'failure'>('details');
  const [paystackPin, setPaystackPin] = useState('1234');
  const [paystackOtp, setPaystackOtp] = useState('5588');
  const [paystackMessage, setPaystackMessage] = useState('');
  const conversionRate = 1500; // 1 USD = 1,500 NGN

  // Term selection state for WAEC/NECO Report Sheet
  const [selectedTerm, setSelectedTerm] = useState<string>('all');

  // PVC student ID card view popup state
  const [isIDBadgeOpen, setIsIDBadgeOpen] = useState(false);

  // Profile & Contact coordinator edit states
  const [isEditProfileMode, setIsEditProfileMode] = useState(false);
  const [editGuardianPhone, setEditGuardianPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMedicalNotes, setEditMedicalNotes] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState('');
  
  // Security advanced indicators
  const [isTwoStepAuthEnabled, setIsTwoStepAuthEnabled] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  
  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Active quiz state
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ score: number; maxScore: number } | null>(null);

  // Student details derived
  const studentGrades = grades.filter((g) => g.studentId === currentUserId);
  const studentAttendance = attendance.filter((a) => a.studentId === currentUserId);
  const studentSubmissions = submissions.filter((s) => s.studentId === currentUserId);

  // Calculate GPA (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0)
  const calculateGPA = () => {
    if (studentGrades.length === 0) return '4.00';
    let totalPoints = 0;
    studentGrades.forEach((g) => {
      const percentage = (g.score / g.maxScore) * 105; // Weighted scores up to 100
      if (percentage >= 90) totalPoints += 4.0;
      else if (percentage >= 80) totalPoints += 3.0;
      else if (percentage >= 70) totalPoints += 2.0;
      else if (percentage >= 60) totalPoints += 1.0;
    });
    return (totalPoints / studentGrades.length).toFixed(2);
  };

  // Attendance stats
  const totalAttended = studentAttendance.length;
  const presentCount = studentAttendance.filter((a) => a.status === 'present').length;
  const lateCount = studentAttendance.filter((a) => a.status === 'late').length;
  const attendanceRate = totalAttended > 0 ? (((presentCount + lateCount * 0.7) / totalAttended) * 100).toFixed(0) : '100';

  // GPA & Standing
  const gpa = parseFloat(calculateGPA());
  let academicStanding = 'Excellent';
  let standingBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (gpa < 3.0) {
    academicStanding = 'Good Standing';
    standingBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }
  if (gpa < 2.0) {
    academicStanding = 'Academic Check';
    standingBg = 'bg-amber-55 text-amber-700 border-amber-200';
  }

  // Next event
  const nextEvent = [...events]
    .filter(e => new Date(e.date) >= new Date(new Date().setDate(new Date().getDate() - 1)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Helper: map Course Id to name
  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : courseId;
  };

  // Helper: map Course Id to code
  const getCourseCode = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.code : '';
  };

  // Quiz launcher
  const launchQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Quiz submission
  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = (quizObj: any) => {
    let score = 0;
    quizObj.questions.forEach((q: any) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        score++;
      }
    });

    addQuizSubmission({
      quizId: quizObj.id,
      studentId: currentUserId,
      answers: selectedAnswers,
      score,
      maxScore: quizObj.questions.length,
      submittedAt: new Date().toISOString()
    });

    setQuizScore({ score, maxScore: quizObj.questions.length });
    setQuizSubmitted(true);
  };

  // Render Grade Progression Plot
  const renderGradeLineChart = () => {
    if (studentGrades.length < 2) {
      return (
        <div className="h-48 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col justify-center items-center text-slate-400 p-4">
          <BarChart3 className="w-8 h-8 opacity-40 mb-2" />
          <p className="text-xs font-semibold">Multiple exam entries required to sketch progression vectors.</p>
        </div>
      );
    }

    // Sort grades chronologically
    const sortedGrades = [...studentGrades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const width = 600;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Convert scores to percentages for consistency
    const points = sortedGrades.map((g, i) => {
      const percentage = (g.score / g.maxScore) * 100;
      const x = paddingLeft + (i / (sortedGrades.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - (percentage / 100) * chartHeight;
      return { x, y, percentage, title: g.title, date: g.date };
    });

    let pathD = '';
    points.forEach((p, i) => {
      if (i === 0) pathD += `M ${p.x} ${p.y}`;
      else pathD += ` L ${p.x} ${p.y}`;
    });

    return (
      <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
        <div>
          <h4 className="font-serif font-bold text-natural-charcoal text-sm">Chronological Progress Trend</h4>
          <span className="text-[10px] text-natural-green font-bold uppercase tracking-wider block">Fluctuations of homework, quizzes, and exams over calendar terms</span>
        </div>
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] text-natural-green/70 overflow-visible">
            {/* Grid Lines */}
            <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="#F1EFE9" strokeWidth="1" />
            <line x1={paddingLeft} y1={paddingTop + chartHeight / 2} x2={width - paddingRight} y2={paddingTop + chartHeight / 2} stroke="#F1EFE9" strokeWidth="1" />
            <line x1={paddingLeft} y1={paddingTop + chartHeight} x2={width - paddingRight} y2={paddingTop + chartHeight} stroke="#D9D1C0" strokeWidth="1.5" />
            
            {/* Y Axis Indicators */}
            <text x={paddingLeft - 8} y={paddingTop + 4} textAnchor="end" className="text-[9px] font-bold fill-natural-green">100%</text>
            <text x={paddingLeft - 8} y={paddingTop + chartHeight / 2 + 3} textAnchor="end" className="text-[9px] font-bold fill-natural-green">50%</text>
            <text x={paddingLeft - 8} y={paddingTop + chartHeight + 3} textAnchor="end" className="text-[9px] font-bold fill-natural-green">0%</text>

            {/* SVG Path Curve */}
            <path d={pathD} fill="none" stroke="#C68A53" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Plot Nodes & Tooltips */}
            {points.map((p, i) => (
              <g key={i} className="group cursor-help">
                <circle cx={p.x} cy={p.y} r="5" className="fill-[#5A634A] stroke-white stroke-2 hover:r-7 transition-all" />
                
                {/* Custom hover tooltip */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <rect x={p.x - 70} y={p.y - 45} width="140" height="36" rx="6" fill="#2D2A26" />
                  <text x={p.x} y={p.y - 32} textAnchor="middle" fill="#ffffff" className="text-[8px] font-bold">{p.title}</text>
                  <text x={p.x} y={p.y - 20} textAnchor="middle" fill="#C68A53" className="text-[8px] font-black">{p.percentage.toFixed(0)}% ({p.date})</text>
                </g>

                {/* X Axis Date Stamps */}
                <text x={p.x} y={paddingTop + chartHeight + 16} textAnchor="middle" className="text-[8px] font-bold fill-natural-green">
                  {p.date.split('-')[1]}/{p.date.split('-')[2]}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {isParentView && (
        <div className="bg-white border-2 border-natural-clay/40 p-4 rounded-2xl flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-natural-clay/15 text-natural-clay rounded-xl">
            <Info className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-natural-charcoal uppercase tracking-widest">Parent Portal Active Mode</h4>
            <p className="text-[11px] text-natural-charcoal/80 mt-1">You are securely signed in as a parent/guardian. All gradebooks, syllabus definitions, calendars, and attendance trackers on view represent real-time student registration files.</p>
          </div>
        </div>
      )}
      {/* 1. OVERVIEW SCREEN */}
      {activeTab === 'dash' && (
        <>
          {/* Statistical Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-natural-green/85 font-bold uppercase tracking-wider block">Cumulative GPA</span>
                <span className="text-3xl font-serif font-black text-natural-charcoal tracking-tight">{calculateGPA()}</span>
              </div>
              <div className="p-3 bg-natural-light text-natural-green border border-natural-beige rounded-xl">
                <Award className="w-6 h-6" id="gpa-award-icon" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-natural-green/85 font-bold uppercase tracking-wider block">Attendance Rate</span>
                <span className="text-3xl font-black text-natural-clay tracking-tight">{attendanceRate}%</span>
              </div>
              <div className="p-3 bg-natural-light text-natural-clay border border-natural-beige rounded-xl">
                <ClipboardCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-natural-green/85 font-bold uppercase tracking-wider block">Assigned Classes</span>
                <span className="text-3xl font-serif font-black text-[#5A634A] tracking-tight">{courses.length}</span>
              </div>
              <div className="p-3 bg-natural-light text-natural-green border border-natural-beige rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-natural-green/85 font-bold uppercase tracking-wider block">Quizzes Cleared</span>
                <span className="text-3xl font-black text-natural-clay tracking-tight">{studentSubmissions.length}</span>
              </div>
              <div className="p-3 bg-natural-light text-natural-clay border border-natural-beige rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Progress Card */}
            <div className="lg:col-span-2 space-y-6">
              {renderGradeLineChart()}

              {/* Course Checklist */}
              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                <h4 className="font-serif font-bold text-natural-charcoal text-sm">Classroom & Schedule Overview</h4>
                <div className="divide-y divide-natural-beige/40">
                  {courses.map((cls) => {
                    const clsGrades = studentGrades.filter((g) => g.courseId === cls.id);
                    const avgScore = clsGrades.length > 0 
                      ? Math.round((clsGrades.reduce((sum, current) => sum + (current.score / current.maxScore), 0) / clsGrades.length) * 100)
                      : null;

                    return (
                      <div key={cls.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-natural-green/70">{cls.code}</span>
                            <span className="font-serif font-bold text-natural-charcoal">{cls.name}</span>
                          </div>
                          <p className="text-xs text-natural-charcoal/70 font-medium">{cls.schedule.days.join(', ')} • {cls.schedule.time} • ({cls.room})</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-natural-charcoal/60">Current Average:</span>
                          {avgScore !== null ? (
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${avgScore >= 90 ? 'bg-[#5A634A]/10 text-natural-green' : avgScore >= 80 ? 'bg-[#FDFBF7] text-natural-clay border border-natural-beige' : 'bg-[#E9E5D9]/50 text-natural-charcoal'}`}>
                              {avgScore}%
                            </span>
                          ) : (
                            <span className="text-xs text-natural-charcoal/40 italic">No entries</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar quick information */}
            <div className="space-y-6">
              {/* Dynamic Standing */}
              <div className={`p-6 rounded-2xl border shadow-xs space-y-3 ${
                gpa >= 3.0 ? 'bg-[#5A634A]/10 text-natural-green border-natural-beige' : 'bg-natural-light/60 text-natural-clay border-natural-beige'
              }`}>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <h4 className="font-serif font-bold text-sm tracking-wide uppercase">Academic Evaluation</h4>
                </div>
                <p className="text-2xl font-serif font-black">{academicStanding}</p>
                <p className="text-xs leading-relaxed opacity-90 font-medium">
                  Calculated based on Spring term reports. GPA currently registers at <span className="font-black">{gpa}</span>. Keep submitting projects and exercises!
                </p>
              </div>

              {/* Next Event Board */}
              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-natural-charcoal text-sm">Next Calendar Event</h4>
                  <Calendar className="w-4 h-4 text-natural-green/70" />
                </div>
                {nextEvent ? (
                  <div className="space-y-3">
                    <div className="inline-block px-2 py-0.5 rounded bg-natural-light border border-natural-beige text-[10px] font-bold text-natural-green uppercase tracking-wider">{nextEvent.type}</div>
                    <p className="font-serif font-bold text-natural-charcoal text-sm">{nextEvent.title}</p>
                    <div className="text-xs text-natural-charcoal/70 font-medium space-y-1">
                      <p>Date: {nextEvent.date}</p>
                      <p>Time: {nextEvent.time || 'All Day'}</p>
                      <p>Room: {nextEvent.location}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-natural-charcoal/40 italic">No upcoming events scheduled.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
  {/* 2. GRADES SCREEN */}
      {activeTab === 'grades' && (() => {
        // Map Spring 2026 grades onto 1st Term so report card is pre-populated
        const filteredGrades = studentGrades.filter(g => {
          if (selectedTerm === 'all') return true;
          if (selectedTerm === '1st Term 2026') return g.term === '1st Term 2026' || g.term === 'Spring 2026';
          return g.term === selectedTerm;
        });

        const termData = calculateTermPerformance(filteredGrades);
        
        // Calculate class placement position based on term averages of all students
        const calculateClassPlacement = (termVal: string) => {
          const studentAverages = students.map(s => {
            const sGrades = grades.filter(g => g.studentId === s.id && (termVal === 'all' || (termVal === '1st Term 2026' ? (g.term === '1st Term 2026' || g.term === 'Spring 2026') : g.term === termVal)));
            if (sGrades.length === 0) return { id: s.id, avg: 0 };
            const totalPerc = sGrades.reduce((sum, curr) => sum + (curr.score / curr.maxScore) * 100, 0);
            return { id: s.id, avg: totalPerc / sGrades.length };
          });
          // Sort descending
          studentAverages.sort((a, b) => b.avg - a.avg);
          const idx = studentAverages.findIndex(item => item.id === currentUserId);
          return idx !== -1 ? idx + 1 : 1;
        };

        const classPos = calculateClassPlacement(selectedTerm);
        const myProfile = students.find(s => s.id === currentUserId) || students[0];

        // Format term name
        const termLabel = selectedTerm === 'all' ? 'All Terms General Ledger' : selectedTerm;

        // Trigger print handler
        const handlePrintReport = () => {
          window.print();
        };

        return (
          <div className="space-y-8 print:p-0 print:bg-white print:m-0 font-sans">
            {/* Action Bar */}
            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-black text-natural-green">Nigeria WAEC/NECO Academic Report Portal</h3>
                <p className="text-natural-charcoal/70 text-xs mt-0.5">Filter grades by active Nigerian terms and view or print certified Academic Report Sheets with dynamic Class Standing and GPAs.</p>
              </div>

              {/* Term Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-[10px] font-bold text-natural-green uppercase tracking-wider">Select Term Track:</label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="bg-natural-light border border-natural-beige rounded-xl text-xs px-3 py-2 font-bold text-natural-green outline-none min-w-[150px]"
                >
                  <option value="all">General Cumulative Ledger</option>
                  <option value="1st Term 2026">First Term (Advent Term 2026)</option>
                  <option value="2nd Term 2026">Second Term (Lent Term 2026)</option>
                  <option value="3rd Term 2026">Third Term (Trinity Term 2026)</option>
                </select>
              </div>
            </div>

            {/* Standard Grades plot */}
            {selectedTerm === 'all' && (
              <div className="print:hidden">
                {renderGradeLineChart()}
              </div>
            )}

            {/* Comprehensive WAEC/NECO Report Sheet */}
            <div className="bg-[#FAF9F5] border-4 border-double border-natural-beige rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden print:border-none print:shadow-none print:bg-white print:p-0">
              
              {/* Premium Watermark Stamp */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-0">
                <img 
                  src="/logo.png" 
                  alt="Watermark Logo" 
                  className="w-96 h-96 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Print button overlay */}
              <div className="absolute top-6 right-6 flex items-center gap-2 print:hidden z-10">
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2 bg-natural-green hover:bg-[#152e50] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print Report Card
                </button>
              </div>

              {/* Certificate Inner Border */}
              <div className="relative z-10 border border-natural-beige/60 p-4 sm:p-6 rounded-2xl space-y-8 print:p-0 print:border-none">
                
                {/* School Header */}
                <div className="text-center pb-6 border-b border-natural-beige/50 space-y-2">
                  <div className="flex justify-center mb-3">
                    <img 
                      src="/logo.png" 
                      alt="NUA Logo" 
                      className="w-16 h-16 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-natural-green tracking-tight">NEW UNIQUE ACADEMY</h1>
                  <p className="text-[10px] text-natural-charcoal/50 font-bold uppercase tracking-widest leading-none">REGISTRATION NO: RC.9942084 | MINISTRY OF EDUCATION APPROVED</p>
                  <p className="font-serif italic text-xs text-natural-clay font-semibold">"Character and Academic Prowess for Global Elevation"</p>
                </div>

                {/* Pupil Credentials Overview Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-natural-charcoal bg-natural-light/60 p-4 rounded-xl border border-natural-beige/30">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Student Pupil Name</span>
                    <span className="font-serif font-black text-natural-charcoal">{myProfile.name}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Portal Username / ID</span>
                    <span className="font-mono font-bold text-natural-green">{myProfile.username || 'NUA/2026/001'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Admission Number</span>
                    <span className="font-mono font-bold text-natural-clay">{myProfile.admissionNumber || 'NUA-26-001'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Class Level</span>
                    <span className="font-bold text-natural-charcoal">{myProfile.gradeLevel}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Term / Semester</span>
                    <span className="font-bold text-natural-green">{termLabel}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Gender Group</span>
                    <span className="font-bold text-natural-charcoal">{myProfile.gender || 'Female'}</span>
                  </div>
                  <div className="space-y-0.5 col-span-2">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Guardian Endorsement Sponsor</span>
                    <span className="font-bold text-natural-clay">{myProfile.guardianName} ({myProfile.guardianPhone})</span>
                  </div>
                </div>

                {/* WAEC/NECO Academic Performance Table */}
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-natural-green text-sm pb-1 border-b border-natural-beige/30 flex items-center justify-between">
                    <span>Subject Performance Matrix</span>
                    <span className="text-[9.5px] font-sans font-bold text-natural-clay uppercase tracking-wider">WAEC West African Grading Standard</span>
                  </h4>

                  {filteredGrades.length === 0 ? (
                    <div className="p-8 text-center text-natural-charcoal/40 italic text-xs bg-white rounded-xl border border-natural-beige">
                      No subject grade files enrolled for this specific term. Add assignments under the staff portal.
                    </div>
                  ) : (
                    <div className="overflow-x-auto bg-white border border-natural-beige rounded-xl shadow-xs">
                      <table className="w-full text-left text-xs min-w-[500px]">
                        <thead className="bg-natural-light/80 text-[10px] font-bold text-natural-green uppercase tracking-wider border-b border-natural-beige">
                          <tr>
                            <th className="px-5 py-3">Subject Discipline</th>
                            <th className="px-5 py-3">Evaluated Item / Title</th>
                            <th className="px-5 py-3 text-center">Score Ratio</th>
                            <th className="px-5 py-3 text-center">Percentage</th>
                            <th className="px-5 py-3 text-center">WAEC Code</th>
                            <th className="px-5 py-3 text-right">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-natural-beige/25">
                          {filteredGrades.map((g) => {
                            const perc = Math.round((g.score / g.maxScore) * 100);
                            const waec = getWAECGrade(perc);

                            return (
                              <tr key={g.id} className="hover:bg-natural-light/10 font-sans">
                                <td className="px-5 py-3.5">
                                  <span className="font-serif font-extrabold text-natural-charcoal block">{getCourseName(g.courseId)}</span>
                                  <span className="text-[9px] text-[#A6802B] font-bold block">{getCourseCode(g.courseId)}</span>
                                </td>
                                <td className="px-5 py-3.5 text-natural-charcoal/70 font-medium">
                                  <span>{g.title}</span>
                                  <span className="block text-[8px] uppercase font-bold text-natural-green opacity-70">{g.category}</span>
                                </td>
                                <td className="px-5 py-3.5 text-center font-mono font-bold text-natural-charcoal">
                                  {g.score} / {g.maxScore}
                                </td>
                                <td className="px-5 py-3.5 text-center font-serif font-black text-natural-charcoal text-sm">
                                  {perc}%
                                </td>
                                <td className="px-5 py-3.5 text-center">
                                  <span className={`px-2 py-0.5 rounded font-mono font-black text-xs ${waec.bgClass} ${waec.colorClass} border uppercase`}>
                                    {waec.grade}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-right font-bold text-[10px] uppercase tracking-wider text-natural-charcoal/60">
                                  <span className={waec.colorClass}>{waec.desc}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Term Metrics & Academic Standing Block */}
                {filteredGrades.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-sans">
                    
                    <div className="bg-white p-4 rounded-xl border border-natural-beige/60 space-y-1 block sm:col-span-1">
                      <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Cumulative Score Average</span>
                      <p className="text-2xl font-serif font-black text-natural-charcoal leading-none">
                        {Math.round(filteredGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / filteredGrades.length)}%
                      </p>
                      <span className="text-[10px] text-natural-clay font-bold block">Scale average percentage</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-natural-beige/60 space-y-1 block sm:col-span-1">
                      <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Term GPA Vector (5.0 Scale)</span>
                      <p className={`text-2xl font-serif font-black leading-none ${termData.colorClass}`}>
                        {termData.gpa}
                      </p>
                      <span className="text-[10px] text-natural-charcoal/60 font-bold block uppercase tracking-wide">{termData.standing}</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-natural-beige/60 space-y-1 block sm:col-span-1">
                      <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Class Standing Placement</span>
                      <p className="text-2xl font-serif font-black text-natural-green leading-none">
                        {classPos} <span className="text-xs font-sans text-natural-charcoal/40 font-bold">of {students.length} Pupils</span>
                      </p>
                      <span className="text-[10px] text-emerald-700 font-black block uppercase tracking-wider animate-pulse">● PROMOTIONAL TIER</span>
                    </div>

                  </div>
                )}

                {/* Teacher comments desk */}
                {filteredGrades.length > 0 && (
                  <div className="bg-white p-5 rounded-xl border border-natural-beige/40 grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed text-xs">
                    <div className="md:col-span-6 space-y-1">
                      <h5 className="font-serif font-black text-natural-green">Class Tutor Endorsement</h5>
                      <p className="text-natural-charcoal/85 italic pt-1 leading-normal">
                        "The student has completed coursework with solid execution. Demonstration of class principles is adequate. Continual study over the holidays is recommended."
                      </p>
                      <div className="pt-4 flex items-center gap-2">
                        <div className="h-0.5 w-12 bg-natural-beige" />
                        <span className="text-[9.5px] font-bold text-natural-charcoal/40 uppercase tracking-widest">Class Tutor Signature block</span>
                      </div>
                    </div>
                    <div className="md:col-span-6 space-y-1 md:border-l md:border-natural-beige/30 md:pl-6">
                      <h5 className="font-serif font-black text-natural-clay">Principal Benson's Decision Comments</h5>
                      <p className="text-natural-charcoal/85 font-medium leading-normal pt-1">
                        {termData.comment} Formative feedback represents verified Ministry parameters.
                      </p>
                      <div className="pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-0.5 w-12 bg-natural-clay" />
                          <span className="text-[9.5px] font-bold text-natural-clay/70 uppercase tracking-widest">Principal Benson</span>
                        </div>
                        {/* Custom Green Stamp Seal */}
                        <div className="relative border-4 border-emerald-700 text-emerald-700 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transform rotate-[-4deg] opacity-80 select-none scale-90">
                          APPROVED BOARD CERT
                          <div className="absolute top-[1px] right-2 text-[6px] shrink-0 font-sans">NUA</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interactive help block */}
                <div className="p-4 bg-natural-light/40 rounded-xl border border-natural-beige/30 flex items-start gap-3 text-xs text-natural-charcoal/60 leading-relaxed print:hidden">
                  <Info className="w-4 h-4 text-natural-clay shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-natural-green">Report Authentication Key Verification</span>
                    <span>This printable sheet generates dynamic coordinates based on live score indices. Printing supports clean pagination layout to output raw report documents directly.</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. QUIZ SCREEN */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs">
            <h3 className="text-lg font-serif font-bold text-natural-charcoal mb-1">Dynamic Quiz Center</h3>
            <p className="text-natural-charcoal/70 text-xs mt-0.5">Review active exams set by your class instructors or complete assigned quizzes to instantly score and append grade metrics.</p>
          </div>

          {activeQuizId ? (
            // Quiz Playback Sandbox
            (() => {
              const activeQuiz = quizzes.find((q) => q.id === activeQuizId);
              if (!activeQuiz) return <p>Quiz not found.</p>;

              const isSubmitted = studentSubmissions.some((s) => s.quizId === activeQuizId) || quizSubmitted;
              const savedSubmission = studentSubmissions.find((s) => s.quizId === activeQuizId);

              return (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  {/* Header */}
                  <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-teal-400 block">{getCourseName(activeQuiz.courseId)}</span>
                      <h4 className="text-lg font-black">{activeQuiz.title}</h4>
                    </div>
                    <button
                      onClick={() => setActiveQuizId(null)}
                      className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Exit Console
                    </button>
                  </div>

                  {/* Playback Content */}
                  <div className="p-6 space-y-8">
                    {/* If Already Submitted / Completed, render review */}
                    {isSubmitted ? (
                      <div className="space-y-6">
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between animate-fade-in">
                          <div className="flex items-center gap-4">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            <div>
                              <h5 className="font-extrabold text-slate-900">Quiz Completed</h5>
                              <p className="text-xs text-slate-500">Your grades were tracked and loaded metrics to cumulative progress charts.</p>
                            </div>
                          </div>
                          <div className="text-center bg-white px-5 py-3 rounded-xl border border-slate-200">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Core Score</span>
                            <span className="text-2xl font-black text-slate-900">
                              {savedSubmission ? savedSubmission.score : quizScore?.score} / {savedSubmission ? savedSubmission.maxScore : quizScore?.maxScore}
                            </span>
                          </div>
                        </div>

                        {/* Question Key explanation list */}
                        <div className="space-y-6">
                          <h5 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2">Questions Review Key</h5>
                          {activeQuiz.questions.map((q, idx) => {
                            const studentAns = savedSubmission ? savedSubmission.answers[q.id] : selectedAnswers[q.id];
                            const isCorrect = studentAns === q.correctOptionIndex;

                            return (
                              <div key={q.id} className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/20 border-rose-100'}`}>
                                <div className="flex items-start gap-3">
                                  {isCorrect ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                  )}
                                  <div className="space-y-2">
                                    <p className="font-bold text-slate-900 text-sm">{idx + 1}. {q.questionText}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                      {q.options.map((opt, optIdx) => {
                                        const isSelected = optIdx === studentAns;
                                        const isCorrectOpt = optIdx === q.correctOptionIndex;

                                        return (
                                          <div
                                            key={optIdx}
                                            className={`p-2 rounded-lg border ${
                                              isCorrectOpt
                                                ? 'bg-emerald-50 border-emerald-250 text-emerald-800 font-bold'
                                                : isSelected
                                                ? 'bg-rose-50 border-rose-250 text-rose-800 font-bold'
                                                : 'bg-white border-slate-200 text-slate-600'
                                            }`}
                                          >
                                            {opt} {isCorrectOpt && "✓ (Correct Answer)"} {isSelected && !isCorrectOpt && "✗ (Your Choice)"}
                                          </div>
                                        );
                                      })}
                                    </div>
                                    {q.explanation && (
                                      <div className="text-xs text-slate-500 mt-2 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                                        <span className="font-bold text-slate-700">Explanation:</span> {q.explanation}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* Active taking quiz layout */
                      <div className="space-y-8">
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-amber-800 text-xs">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 animate-spin text-amber-600" />
                            <span className="font-semibold">Ongoing Interactive Quiz. Answers will automatically submit upon completion.</span>
                          </div>
                          <span className="font-black bg-amber-100 px-2 py-1 rounded">Time Limit: {activeQuiz.timeLimitMinutes}m</span>
                        </div>

                        {activeQuiz.questions.map((q, qIdx) => (
                          <div key={q.id} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
                            <h5 className="font-extrabold text-slate-900 text-sm">{qIdx + 1}. {q.questionText}</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {q.options.map((opt, oIdx) => {
                                const checked = selectedAnswers[q.id] === oIdx;
                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    onClick={() => handleQuizAnswer(q.id, oIdx)}
                                    className={`p-3.5 text-left text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                                      checked
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-xs'
                                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => submitQuiz(activeQuiz)}
                          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 font-bold text-white text-xs uppercase tracking-wider shadow-md rounded-xl cursor-pointer select-none"
                        >
                          Submit Quiz and Score Immediately
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((qz) => {
                const submission = studentSubmissions.find((s) => s.quizId === qz.id);
                return (
                  <div key={qz.id} className="bg-white rounded-2xl border border-natural-beige overflow-hidden shadow-xs flex flex-col justify-between">
                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#5A634A] block">{getCourseCode(qz.courseId)}</span>
                        {submission ? (
                          <span className="px-2.5 py-1 bg-natural-light border border-natural-beige text-natural-green rounded-xl text-[10px] font-bold uppercase tracking-wider">Submitted</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-natural-light border border-natural-beige text-natural-clay rounded-xl text-[10px] font-bold uppercase tracking-wider animate-pulse">Pending</span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-natural-charcoal text-base">{qz.title}</h4>
                      <p className="text-xs text-natural-charcoal/70 leading-relaxed line-clamp-2">{qz.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-natural-green/70 font-semibold pt-2">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {qz.timeLimitMinutes} Mins</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {qz.questions.length} Questions</span>
                      </div>
                    </div>

                    <div className="p-4 bg-natural-light/40 border-t border-natural-beige flex items-center justify-between">
                      {submission ? (
                        <div className="text-xs text-natural-charcoal/80">
                          Score achieved: <span className="font-serif font-bold text-natural-charcoal">{submission.score} / {submission.maxScore}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-natural-clay">Due Date: {qz.dueDate}</span>
                      )}

                      {isParentView ? (
                        <button
                          disabled
                          className="text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 bg-natural-light border border-natural-beige text-natural-charcoal/40 cursor-not-allowed"
                        >
                          {submission ? 'Exam Submitted (View)' : 'Launch Locked'}
                        </button>
                      ) : (
                        <button
                          onClick={() => launchQuiz(qz.id)}
                          className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                            submission 
                              ? 'bg-natural-light border border-natural-beige text-natural-charcoal hover:bg-white' 
                              : 'bg-natural-green text-white hover:bg-natural-green/90'
                          }`}
                        >
                          {submission ? 'Review Questions' : 'Launch Exam'} <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. ATTENDANCE SCREEN */}
      {activeTab === 'att' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 mb-1">My Attendance History</h3>
            <p className="text-slate-500 text-xs mt-0.5">Below is the complete rolling attendance metrics catalog registered by school instructors for this student profile.</p>
          </div>

          {/* Core Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Present Records</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{presentCount}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Late Arrivals</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">{lateCount}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Excused Gaps</span>
              <span className="text-2xl font-black text-indigo-600 mt-1 block">
                {studentAttendance.filter((a) => a.status === 'excused').length}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Unexcused Absences</span>
              <span className="text-2xl font-black text-rose-600 mt-1 block">
                {studentAttendance.filter((a) => a.status === 'absent').length}
              </span>
            </div>
          </div>

          {/* Simple Grid log of Attendance status */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">Attendance Logs Catalog</span>
            </div>

            {studentAttendance.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400 italic">No attendance records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-650 min-w-[500px]">
                  <thead className="text-[10px] font-black uppercase text-slate-400 tracking-wider bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Session Date</th>
                      <th className="px-6 py-4">Subject Course</th>
                      <th className="px-6 py-4">Marked Status</th>
                      <th className="px-6 py-4">Advisory Teacher Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentAttendance.map((rec) => {
                      const badgeMap = {
                        present: 'bg-emerald-50 text-emerald-800 border-emerald-100',
                        late: 'bg-amber-50 text-amber-800 border-amber-100',
                        absent: 'bg-rose-50 text-rose-800 border-rose-100',
                        excused: 'bg-indigo-50 text-indigo-800 border-indigo-100'
                      };
                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{rec.date}</td>
                          <td className="px-6 py-4 flex flex-col justify-center">
                            <span className="font-bold text-slate-800">{getCourseCode(rec.courseId)}</span>
                            <span className="text-[9px] text-slate-400">{getCourseName(rec.courseId)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border ${badgeMap[rec.status] || 'bg-slate-50 text-slate-750'}`}>
                              {rec.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-500 italic">
                            {rec.notes || <span className="text-slate-350">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4.5 TUITION & SCHOOL FEES LEDGER SCREEN */}
      {activeTab === 'tuition' && (() => {
        // Resolve student model safely
        const targetStudent = students.find((s) => s.id === currentUserId) || students[0];
        if (!targetStudent) {
          return (
            <div className="bg-white p-8 rounded-2xl border border-natural-beige text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-natural-clay mx-auto" />
              <p className="text-xs text-natural-charcoal">No student profile mapped to this session identity. Register online to begin tracking fees.</p>
            </div>
          );
        }

        const billingTotal = targetStudent.tuitionTotal || 4500;
        const billingPaid = targetStudent.tuitionPaid || 0;
        const billingBalance = Math.max(0, billingTotal - billingPaid);

        // Convert values based on active currency selector
        const formatMoney = (usdVal: number) => {
          if (payCurrency === 'NGN') {
            const nairaAmt = usdVal * conversionRate;
            return `₦${nairaAmt.toLocaleString()}`;
          }
          return `$${usdVal.toLocaleString()}`;
        };

        const handleFinanceSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (payMethodSelect !== 'Card') {
            // Manual bank transfer reference
            const num = parseFloat(payAmountInput);
            if (isNaN(num) || num <= 0) {
              alert('Please enter a valid amount.');
              return;
            }
            const tenderUSD = payCurrency === 'NGN' ? num / conversionRate : num;
            if (tenderUSD > billingBalance) {
              alert(`The specified value exceeds your remaining balance.`);
              return;
            }
            setIsProcessingPayment(true);
            setTimeout(() => {
              payTuition(targetStudent.id, tenderUSD, payMethodSelect);
              setIsProcessingPayment(false);
              setPaymentDone(true);

              setGeneratedReceiptObj({
                receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
                date: new Date().toISOString().split('T')[0],
                transactedUSD: tenderUSD,
                totalPaidResultUSD: Math.min(billingTotal, billingPaid + tenderUSD),
                remainingResultUSD: Math.max(0, billingBalance - tenderUSD),
                method: 'Bank Transfer References',
                studentCode: targetStudent.admissionNumber || 'NUA-26-8812',
                studentName: targetStudent.name,
                guardian: targetStudent.guardianName || 'Parent Representative',
                currency: payCurrency
              });
            }, 1500);
            return;
          }

          const num = parseFloat(payAmountInput);
          if (isNaN(num) || num <= 0) {
            alert('Please select a valid payment number.');
            return;
          }
          const tenderUSD = payCurrency === 'NGN' ? num / conversionRate : num;
          if (tenderUSD > billingBalance) {
            alert(`The specified value exceeds your remaining balance.`);
            return;
          }

          // Launch Simulated Paystack Gateway
          setIsPaystackOpen(true);
          setPaystackStep('details');
          setPaystackMessage('');
        };

        const executePaystackSuccess = () => {
          const num = parseFloat(payAmountInput);
          const numUSD = payCurrency === 'NGN' ? num / conversionRate : num;
          payTuition(targetStudent.id, numUSD, payMethodSelect);
          setPaymentDone(true);
          
          setGeneratedReceiptObj({
            receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toISOString().split('T')[0],
            transactedUSD: numUSD,
            totalPaidResultUSD: Math.min(billingTotal, billingPaid + numUSD),
            remainingResultUSD: Math.max(0, billingBalance - numUSD),
            method: 'Paystack Secure Checkout',
            studentCode: targetStudent.admissionNumber || 'NUA-26-8812',
            studentName: targetStudent.name,
            guardian: targetStudent.guardianName || 'Parent Representative',
            currency: payCurrency
          });
          setIsPaystackOpen(false);
        };

        return (
          <div className="space-y-6">
            
            {/* Introductory Header */}
            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-[#C29B38] font-bold uppercase tracking-widest block mb-0.5 animate-pulse">Financial Desk Portal</span>
                <h3 className="text-lg font-serif font-black text-natural-charcoal">Secure Student Ledger Roster</h3>
                <p className="text-natural-charcoal/70 text-xs leading-relaxed">Review active semester bills, check historical receipts, and clear school fees securely in compliance with the Preston Bursar Board guidelines.</p>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-2 bg-natural-light p-1 border border-natural-beige rounded-xl select-none shrink-0 self-start">
                <button
                  type="button"
                  onClick={() => {
                    setPayCurrency('NGN');
                    // Recalculate default input in Naira
                    setPayAmountInput(String(Math.min(billingBalance, 1500) * conversionRate));
                  }}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    payCurrency === 'NGN' ? 'bg-[#C29B38] text-white shadow-xs' : 'text-natural-charcoal/60 hover:text-natural-charcoal'
                  }`}
                >
                  NGN (₦)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPayCurrency('USD');
                    setPayAmountInput(String(Math.min(billingBalance, 1500)));
                  }}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    payCurrency === 'USD' ? 'bg-[#C29B38] text-white shadow-xs' : 'text-natural-charcoal/60 hover:text-natural-charcoal'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Balances Board */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#FDFCF7] p-6 rounded-2xl border border-[#C29B38] border-opacity-35 shadow-xs flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[9.5px] text-[#C29B38] block font-bold uppercase tracking-wider">Total Season Tuition</span>
                  <span className="text-2xl font-serif font-black text-natural-charcoal">{formatMoney(billingTotal)}</span>
                </div>
                <div className="p-2.5 bg-white text-[#4E505F] rounded-lg border border-slate-200">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex justify-between items-center border-l-4 border-l-[#5A634A]">
                <div className="space-y-0.5">
                  <span className="text-[9.5px] text-natural-green/80 block font-bold uppercase tracking-wider">Total Certified Paid</span>
                  <span className="text-2xl font-serif font-black text-natural-green">{formatMoney(billingPaid)}</span>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex justify-between items-center border-l-4 border-l-rose-600">
                <div className="space-y-0.5">
                  <span className="text-[9.5px] text-rose-500 block font-bold uppercase tracking-wider">Current Tuition Balance</span>
                  <span className="text-2xl font-serif font-black text-rose-600">{formatMoney(billingBalance)}</span>
                </div>
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-105">
                  <Info className="w-5 h-5 animate-pulse text-rose-600" />
                </div>
              </div>
            </div>

            {/* Lower Sandbox Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Payment Processing Left Panel */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-natural-beige shadow-xs relative">
                
                {billingBalance <= 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-natural-charcoal">Account Completely Paid!</h4>
                    <p className="text-natural-charcoal/60 text-xs max-w-sm mx-auto">All tuition ledgers are fully cleared for the 2026 academic term. Review listed receipt records below for compliance logs.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFinanceSubmit} className="space-y-6">
                    <div>
                      <h4 className="font-serif font-bold text-natural-charcoal text-sm">Fulfill Tuition Payments</h4>
                      <p className="text-[10px] text-natural-charcoal/50">Authorize online transactions to reduce open balances immediately.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-natural-green/85">Payment Tender Amnt ($) *</label>
                        <input
                          type="number"
                          required
                          value={payAmountInput}
                          onChange={(e) => setPayAmountInput(e.target.value)}
                          placeholder="1500"
                          max={billingBalance}
                          min="1"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green font-bold text-natural-charcoal text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-natural-green/85">Payment Protocol Select *</label>
                        <select
                          value={payMethodSelect}
                          onChange={(e) => setPayMethodSelect(e.target.value as any)}
                          className="w-full text-xs px-3 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none text-natural-charcoal font-semibold"
                        >
                          <option value="Card">Authorize Visa/Mastercard (Secure)</option>
                          <option value="Bank Transfer">Authorize Bank Transfer (Manual/Wire)</option>
                        </select>
                      </div>
                    </div>

                    {payMethodSelect === 'Card' ? (
                      /* Sleek Card Layout */
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 p-5 rounded-2xl text-slate-100 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[9px] uppercase tracking-widest text-[#C29B38] font-bold">VISA DEBIT PROCESSOR</span>
                          <CreditCard className="w-6 h-4 text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[8px] tracking-widest text-slate-400 uppercase">Tender Card Code</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="bg-slate-950/40 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[8px] tracking-widest text-slate-400 uppercase">Expiry code</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="bg-slate-950/40 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono w-full"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[8px] tracking-widest text-slate-400 uppercase">Cvv check</label>
                            <input
                              type="text"
                              value={cardCVV}
                              onChange={(e) => setCardCVV(e.target.value)}
                              className="bg-slate-955/40 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Preston Wire transfer address info */
                      <div className="bg-[#FDFCF7] border border-dashed border-[#C29B38] p-5 rounded-2xl text-xs text-natural-charcoal space-y-3">
                        <div className="flex items-center gap-1.5 text-natural-green">
                          <Building className="w-4 h-4 text-[#C29B38]" />
                          <span className="font-bold uppercase tracking-wider block text-[10px]">Preston Escrow Bank Records</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[11px] leading-tight text-natural-charcoal/85">
                          <div>
                            <span className="text-[8.5px] text-natural-charcoal/45 block uppercase font-bold">ESCROW BANK NAME</span>
                            <span className="font-bold">Preston United Trust Bank</span>
                          </div>
                          <div>
                            <span className="text-[8.5px] text-natural-charcoal/45 block uppercase font-bold">ACCOUNT CODE</span>
                            <span className="font-mono font-bold">4488-0091-232</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[8.5px] text-natural-charcoal/45 block uppercase font-bold">TRANSFER REFERENCES MEMO *</span>
                            <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded font-mono truncate block mt-0.5">
                              {targetStudent.admissionNumber || 'NUA-26-8812'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full py-3.5 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" /> Authorizing Financial Handshake...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" /> Authorize Secure Payment Verification
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Receipt / Download Right Panel */}
              <div className="lg:col-span-5 space-y-6">
                
                {generatedReceiptObj ? (
                  /* Graphic receipt mock layout */
                  <div className="bg-[#FDFCF7] border-2 border-[#C29B38] p-6 rounded-3xl space-y-5 shadow-lg relative animate-fade-in text-natural-charcoal">
                    <div className="text-center pb-4 border-b border-dashed border-natural-beige/85">
                      <div className="w-12 h-12 bg-white p-0.5 rounded-full flex items-center justify-center border border-natural-beige mx-auto mb-1.5 shadow-xs">
                        <img 
                          src="/logo.png" 
                          alt="NUA Logo" 
                          className="w-10 h-10 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h5 className="font-serif font-extrabold tracking-wide text-xs">NEW UNIQUE ACADEMY</h5>
                      <span className="text-[8px] text-natural-green font-bold uppercase tracking-widest block leading-none">Bursar Payment Receipt</span>
                    </div>

                    <div className="space-y-3.5 text-xs text-natural-charcoal/90">
                      <div className="flex justify-between items-center bg-slate-100/50 p-2.5 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-[8px] text-natural-charcoal/45 block uppercase">RECEIPT IDENTIFIER</span>
                          <span className="font-mono font-bold tracking-tight">{generatedReceiptObj.receiptNo}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-natural-charcoal/45 block uppercase">DATE REGISTERED</span>
                          <span className="font-bold">{generatedReceiptObj.date}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-natural-charcoal/50">Student Registered:</span>
                          <span className="font-bold">{generatedReceiptObj.studentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-natural-charcoal/50">Admission Reference:</span>
                          <span className="font-mono font-bold">{generatedReceiptObj.studentCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-natural-charcoal/50">Method:</span>
                          <span className="font-bold">{generatedReceiptObj.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-natural-charcoal/50">Status:</span>
                          <span className="font-black text-emerald-600 bg-emerald-50 px-1.5 rounded uppercase text-[9px]">Settle: Authorized</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-natural-beige/60 space-y-1.5">
                        <div className="flex justify-between font-medium">
                          <span>Amount Tendered:</span>
                          <span className="font-bold text-natural-charcoal">
                            {generatedReceiptObj.currency === 'NGN' 
                              ? `₦${(generatedReceiptObj.transactedUSD * conversionRate).toLocaleString()}.00` 
                              : `$${(generatedReceiptObj.transactedUSD || 0).toLocaleString()}.00`}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Outstanding Balance:</span>
                          <span className="font-bold text-rose-600">
                            {generatedReceiptObj.currency === 'NGN' 
                              ? `₦${(generatedReceiptObj.remainingResultUSD * conversionRate).toLocaleString()}.00` 
                              : `$${(generatedReceiptObj.remainingResultUSD || 0).toLocaleString()}.00`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1A365D] text-[#C29B38] rounded-xl p-3 text-center text-[10px] font-bold uppercase tracking-widest transition-opacity leading-none">
                      Thank you for your enrollment.
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 p-2 bg-natural-light border border-natural-beige hover:bg-[#E9E5D9] transition-colors rounded-xl text-[10.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                      >
                        <Printer className="w-4 h-4 text-natural-green" /> Print PDF receipt
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedReceiptObj(null);
                        }}
                        className="px-3.5 py-2 bg-natural-light border border-natural-beige rounded-xl text-natural-charcoal hover:bg-[#E9E5D9] font-bold uppercase tracking-wide cursor-pointer text-[10.5px] leading-none"
                      >
                        Clear
                      </button>
                    </div>

                  </div>
                ) : (
                  /* Standard information box prior to payment */
                  <div className="bg-[#FDFCF7] border border-natural-beige p-6 rounded-3xl space-y-4">
                    <h5 className="font-serif font-black text-xs text-natural-charcoal">Preston Bursar Notice</h5>
                    <p className="text-[11px] text-natural-charcoal/80 leading-relaxed">
                      Transactions transacted online will instantly update the remaining tuition indicators on teacher registries. Ensure card numbers are checked safely. For payment inquiries call our Desk representatives.
                    </p>
                    <div className="p-3.5 bg-white border border-natural-beige rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between text-natural-charcoal/50">
                        <span>Office Hours:</span>
                        <span className="font-medium">Mon - Fri 08:00 to 16:30</span>
                      </div>
                      <div className="flex justify-between text-natural-charcoal/50">
                        <span>Physical Zone:</span>
                        <span className="font-medium">Behind Fabian Hotel Zone C</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* 7. SECURE PAYSTACK SIMULATED GATEWAY OVERLAY DIALOG */}
            {isPaystackOpen && (() => {
              const studentObj = students.find((s) => s.id === currentUserId) || students[0];
              const tenderUSD = parseFloat(payCurrency === 'NGN' ? String(parseFloat(payAmountInput) / conversionRate) : payAmountInput) || 0;
              const nairaValue = tenderUSD * conversionRate;

              return (
                <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
                  <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
                    
                    {/* Paystack Header */}
                    <div className="bg-[#09A5DB] text-white p-5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#09A5DB] font-bold text-sm">
                          P
                        </div>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-wider leading-none">Paystack Checkout</h4>
                          <span className="text-[9px] text-white/80 tracking-wide font-medium">Secured by Paystack API Gateway</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsPaystackOpen(false)}
                        className="text-white hover:text-slate-200 text-xs font-bold bg-white/10 px-2.5 py-1 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Amount bar */}
                    <div className="bg-slate-50 border-b border-slate-100 p-4 text-center">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest">Authorized Amount to Fulfill</span>
                      <span className="text-2xl font-black text-slate-800 font-mono">
                        {payCurrency === 'NGN' ? `₦${nairaValue.toLocaleString()}.00` : `$${tenderUSD.toLocaleString()}.00`}
                      </span>
                      <span className="text-[9px] bg-sky-50 text-[#09A5DB] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block mx-auto w-fit mt-1 border border-sky-100/50">
                        {studentObj.email}
                      </span>
                    </div>

                    {/* Main Steps Content */}
                    <div className="p-6 flex-1 min-h-[200px] flex flex-col justify-between">
                      
                      {/* Error Banner */}
                      {paystackMessage && (
                        <div className="bg-rose-50 border border-rose-105 text-rose-700 px-3 py-2 rounded-xl text-[10px] font-semibold mb-3 select-none flex items-center gap-1 leading-normal">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {paystackMessage}
                        </div>
                      )}

                      {paystackStep === 'details' && (
                        <div className="space-y-4 flex-1">
                          <p className="text-[11px] text-slate-500 leading-normal">
                            Provide your debit card details below. This is a secure sandboxed session simulated for Preston West Africa billing.
                          </p>
                          <div className="space-y-3 text-xs w-full text-left">
                            <div className="space-y-1">
                              <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Debit Card Code *</label>
                              <input 
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="4000 1234 5678 9010"
                                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono focus:bg-white focus:border-[#09A5DB]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider font-sans">Expiry *</label>
                                <input 
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="12/29"
                                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-center focus:bg-white focus:border-[#09A5DB]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">CVV Code *</label>
                                <input 
                                  type="password"
                                  value={cardCVV}
                                  maxLength={3}
                                  onChange={(e) => setCardCVV(e.target.value)}
                                  placeholder="***"
                                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-center focus:bg-white focus:border-[#09A5DB]"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setPaystackStep('pin')}
                            className="w-full py-3 bg-[#3AC5A7] hover:bg-[#3AC5A7]/90 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md mt-4 cursor-pointer"
                          >
                            Authenticate Card
                          </button>
                        </div>
                      )}

                      {paystackStep === 'pin' && (
                        <div className="space-y-4 flex-1 text-center">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500">
                            <Lock className="w-5 h-5" />
                          </div>
                          <h5 className="font-serif font-black text-xs text-slate-700">Enter Your 4-Digit Secure PIN</h5>
                          <p className="text-[10.5px] text-slate-400 leading-normal max-w-xs mx-auto">
                            Provide your confidential card PIN to authenticate this session with your banking provider.
                          </p>

                          <div className="flex justify-center gap-3 py-2">
                            <input 
                              type="password"
                              required
                              maxLength={4}
                              value={paystackPin}
                              onChange={(e) => setPaystackPin(e.target.value)}
                              placeholder="PIN"
                              className="w-24 text-center tracking-[1em] text-lg font-black font-mono border border-slate-300 px-3 py-2 rounded-xl focus:border-[#09A5DB] bg-slate-50"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (paystackPin.trim().length !== 4) {
                                setPaystackMessage('A secure 4-digit bank PIN code is required to settle accounts.');
                                return;
                              }
                              setPaystackMessage('');
                              setPaystackStep('otp');
                            }}
                            className="w-full py-3 bg-[#3AC5A7] hover:bg-[#3AC5A7]/90 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer mt-2"
                          >
                            Verify secure PIN
                          </button>
                        </div>
                      )}

                      {paystackStep === 'otp' && (
                        <div className="space-y-4 flex-1 text-center">
                          <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center mx-auto text-[#09A5DB]">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <h5 className="font-serif font-black text-xs text-slate-700">Enter Bank One-Time OTP Code</h5>
                          <p className="text-[10.5px] text-slate-400 leading-normal max-w-xs mx-auto">
                            A visual code has been sent. Fill index <span className="font-bold text-emerald-600">5588</span> to bypass sandbox check.
                          </p>

                          <div className="flex justify-center gap-3 py-2">
                            <input 
                              type="text"
                              required
                              maxLength={4}
                              value={paystackOtp}
                              onChange={(e) => setPaystackOtp(e.target.value)}
                              placeholder="OTP Code"
                              className="w-28 text-center text-md font-bold font-mono border border-slate-300 px-3 py-2 rounded-xl focus:border-[#09A5DB] bg-slate-50"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (paystackOtp !== '5588') {
                                setPaystackMessage('The specified verification OTP code has expired or is incorrect.');
                                return;
                              }
                              setPaystackMessage('');
                              executePaystackSuccess();
                            }}
                            className="w-full py-3 bg-[#3AC5A7] hover:bg-[#3AC5A7]/90 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                          >
                            Authorize One-Time Token
                          </button>
                        </div>
                      )}

                    </div>

                    {/* Security Badge Footer */}
                    <div className="bg-slate-50 p-3.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[9.5px] text-slate-400 font-bold uppercase select-none tracking-widest leading-none">
                      <Shield className="w-4 h-4 text-emerald-500" /> SECURED BY PAYSTACK CENTRAL
                    </div>

                  </div>
                </div>
              );
            })()}

          </div>
        );
      })()}

      {/* 5. CALENDAR SCREEN */}
      {activeTab === 'cal' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs">
            <h3 className="text-lg font-serif font-bold text-natural-charcoal mb-1">NEW UNIQUE ACADEMY Calendar</h3>
            <p className="text-natural-charcoal/70 text-xs mt-0.5">Interactive event listings. Coordinate classes, check national holidays, track scheduled sports challenges, and view arts events.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {events.map((ev) => {
              const typeColorStyle = {
                academic: 'bg-natural-light text-natural-green border-natural-beige/60',
                holiday: 'bg-natural-light text-natural-clay border-natural-beige/60',
                sports: 'bg-natural-light text-natural-green border-natural-beige/60',
                arts: 'bg-natural-light text-natural-clay border-natural-beige/60',
                excursion: 'bg-natural-light text-natural-green border-natural-beige/60'
              };

              return (
                <div key={ev.id} className="bg-white border border-natural-beige rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border ${typeColorStyle[ev.type] || 'bg-natural-light border-natural-beige text-natural-charcoal'}`}>
                        {ev.type}
                      </span>
                      <span className="text-[10px] text-natural-green/80 font-semibold">{ev.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-natural-charcoal">{ev.title}</h4>
                    <p className="text-xs text-natural-charcoal/70 leading-relaxed">{ev.description}</p>
                  </div>

                  <div className="pt-4 border-t border-natural-beige/50 font-semibold text-natural-green/80 text-[11px] grid grid-cols-2 gap-1.5">
                    <div>
                      <span className="block text-[8px] text-natural-charcoal/50 uppercase tracking-widest">Timing</span>
                      <span className="text-natural-charcoal font-bold block">{ev.time || 'All Day'}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-natural-charcoal/50 uppercase tracking-widest">Location</span>
                      <span className="text-natural-charcoal font-bold block truncate">{ev.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. PROFILE & SECURITY SCREEN */}
      {activeTab === 'profile' && (() => {
        const targetStudent = students.find((s) => s.id === currentUserId) || students[0];
        if (!targetStudent) {
          return (
            <div className="bg-white p-8 rounded-2xl border border-natural-beige text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-natural-clay mx-auto" />
              <p className="text-xs text-natural-charcoal">No student profile found for this session.</p>
            </div>
          );
        }

        const handlePasswordChangeSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setPwdError('');
          setPwdSuccess('');

          const originalPassword = targetStudent.password || 'student123';
          if (oldPassword !== originalPassword) {
            setPwdError('The original password you specified does not match your current record.');
            return;
          }
          if (newPassword.trim().length < 6) {
            setPwdError('Your new secure password must contain at least 6 characters.');
            return;
          }
          if (newPassword !== confirmPassword) {
            setPwdError('The new password confirmation does not match.');
            return;
          }

          // Trigger context update
          updateStudent(targetStudent.id, { password: newPassword });
          setPwdSuccess('Your portal password has been updated. Access credentials resolved successfully!');
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        };

        const handleProfileUpdateSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          
          updateStudent(targetStudent.id, {
            email: editEmail || targetStudent.email,
            guardianPhone: editGuardianPhone || targetStudent.guardianPhone,
            gender: editGender || targetStudent.gender || 'Female',
            guardianName: editMedicalNotes ? editMedicalNotes : targetStudent.guardianName
          });
          
          alert('Bio-data coordinates updated successfully in the school register!');
          setIsEditProfileMode(false);
        };

        const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowed.includes(file.type)) {
              alert('Error: Please choose a valid image format (JPG, PNG).');
              return;
            }
            const reader = new FileReader();
            reader.onload = (loaded) => {
              const resBase64 = loaded.target?.result as string;
              updateStudent(targetStudent.id, { avatar: resBase64, hasBadgeWithPhoto: resBase64 });
              alert('New biometric profile photo successfully applied! This updates your digital badge and PVC Student ID card.');
            };
            reader.readAsDataURL(file);
          }
        };

        // Initialize edit states if empty
        if (!editEmail && targetStudent.email) {
          setEditEmail(targetStudent.email);
          setEditGuardianPhone(targetStudent.guardianPhone || '');
          setEditMedicalNotes('');
        }

        return (
          <div className="space-y-6 animate-fade-in text-natural-charcoal font-sans" id="student-profile-main-viewport">
            {/* Header banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-natural-beige shadow-2xs">
              <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block mb-0.5 font-mono">My Profile Dashboard</span>
              <h3 className="text-xl font-serif font-black text-slate-850">Personal Bio-Data & Security Matrix</h3>
              <p className="text-slate-500 text-xs mt-1">Review authenticated student registry records, manage digital PVC credentials, and secure access channels.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* PRIMARY DETAILS VIEW OR EDIT FORM: LEFT PANEL */}
              <div className="lg:col-span-7 bg-white border border-natural-beige rounded-3xl p-6 sm:p-8 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative group w-16 h-16 rounded-full bg-slate-50 border border-slate-250 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      <img 
                        src={targetStudent.avatar || targetStudent.hasBadgeWithPhoto || "/logo.png"} 
                        alt="Active Bio Avatar" 
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                      <label 
                        className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] text-white font-bold uppercase cursor-pointer text-center select-none"
                        htmlFor="profile-badge-file-uploader"
                      >
                        Change Photo
                      </label>
                      <input 
                        type="file" 
                        id="profile-badge-file-uploader" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoUpload}
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-slate-800 text-md">{targetStudent.name}</h4>
                      <span className="text-[10px] text-indigo-700 font-extrabold uppercase bg-indigo-50 px-2 py-0.5 rounded font-mono block w-fit">{targetStudent.gradeLevel} Section</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditProfileMode(!isEditProfileMode)}
                    className="p-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-bold uppercase rounded-xl transition cursor-pointer"
                  >
                    {isEditProfileMode ? '✕ Cancel Edit' : '✐ Edit Demographics'}
                  </button>
                </div>

                {isEditProfileMode ? (
                  <form onSubmit={handleProfileUpdateSubmit} className="space-y-4 text-xs">
                    <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Modify Allowed Biological Parameters</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-slate-405 uppercase font-mono">Assigned Student Email address *</label>
                        <input
                          type="email"
                          required
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full p-2.5 border border-slate-205 rounded-xl font-medium outline-none text-[#1A365D]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-slate-405 uppercase font-mono">Guardian Mobile Phone *</label>
                        <input
                          type="text"
                          required
                          value={editGuardianPhone}
                          onChange={(e) => setEditGuardianPhone(e.target.value)}
                          className="w-full p-2.5 border border-slate-205 rounded-xl font-medium outline-none text-[#1A365D]"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-[9px] font-bold text-slate-405 uppercase font-mono">Biodata Medical Indicators / Alerts (Allergies, Group, etc)</label>
                        <input
                          type="text"
                          value={editMedicalNotes}
                          onChange={(e) => setEditMedicalNotes(e.target.value)}
                          placeholder="e.g. Asthma history, Penicillin allergy, Blood Group O+"
                          className="w-full p-2.5 border border-slate-205 rounded-xl font-medium outline-none text-[#1A365D]"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-[10px] font-medium leading-relaxed border border-dashed border-amber-250">
                      🔒 <strong>Audit Information:</strong> Key parameters such as Admission Numbers, Class Placements, and Birthdate schedules are system controlled and strictly locked to prevent unauthorized identity tampering.
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setIsEditProfileMode(false)}
                        className="px-4 py-2 hover:bg-slate-100 rounded-xl text-slate-500 font-bold"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="p-2 px-5 bg-indigo-650 hover:bg-indigo-750 text-white font-black uppercase text-[10.5px] rounded-xl cursor-pointer bg-[#1A365D]"
                      >
                        SAVE CHANGES
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-[#FAF9F5] transition animate-fade-in">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Portal Username</span>
                      <span className="font-extrabold text-[#1A365D] block text-sm select-all tracking-wider font-mono">{targetStudent.username || 'Unassigned'}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-[#FAF9F5] transition animate-fade-in animate-delay-100">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Admission Index</span>
                      <span className="font-extrabold text-[#1A365D] block text-sm select-all tracking-wider font-mono">{targetStudent.admissionNumber || 'NUA-26-8812'}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Registered email coordinates</span>
                      <p className="font-extrabold text-slate-750">{targetStudent.email}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Guardian Primary Contact</span>
                      <p className="font-extrabold text-slate-750">{targetStudent.guardianPhone || 'Not Configured'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Registered Gender</span>
                      <p className="font-bold text-slate-750 uppercase">{targetStudent.gender || 'Female'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Enrollment Date Ledger</span>
                      <p className="font-semibold text-slate-705 font-mono">{targetStudent.joinedDate || '2026-05-01'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Sovereign Origin Region</span>
                      <p className="font-semibold text-slate-705">{targetStudent.stateOrCountry || 'Lagos State, Nigeria'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Demographics Biological DOB</span>
                      <p className="font-semibold text-slate-705 font-mono">{targetStudent.dateOfBirth || '2009-06-12'}</p>
                    </div>

                    <div className="sm:col-span-2 pt-4 border-t border-dashed border-slate-200 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 block uppercase font-mono font-black">Authorized Guardian Representative</span>
                        <p className="font-bold text-[#1A365D] text-sm">{targetStudent.guardianName || 'Representative Parent'}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsIDBadgeOpen(true)}
                        className="px-4 py-2 bg-[#14233C] hover:bg-[#C29B38] border-none text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                      >
                        <GraduationCap className="w-4 h-4 text-[#C29B38]" /> View Certified PVC ID Card
                      </button>
                    </div>
                  </div>
                )}
                
              </div>

              {/* SECURITY PROFILE COORDINATES & PASSWORD ACCESS: RIGHT PANEL */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Panel 1: Security Change Password form */}
                <div className="bg-white border border-natural-beige rounded-3xl p-6 sm:p-8 space-y-4">
                  <h4 className="font-serif font-black text-slate-855 text-sm flex items-center gap-1.5 border-b pb-2 border-slate-100 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Portal Key Credentials
                  </h4>

                  <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs font-sans">
                    {pwdError && (
                      <div className="p-3 bg-rose-50 text-rose-805 border border-rose-150 rounded-xl leading-relaxed flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" /> {pwdError}
                      </div>
                    )}
                    {pwdSuccess && (
                      <div className="p-3 bg-emerald-50 text-emerald-805 border border-emerald-150 rounded-xl leading-relaxed flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {pwdSuccess}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] uppercase font-bold text-slate-450 tracking-wider font-mono">Current Secure Password *</label>
                      <input 
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Type current key (e.g. student123)"
                        className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-205 rounded-xl outline-none focus:border-indigo-650 text-slate-705 font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] uppercase font-bold text-slate-450 tracking-wider font-mono">New custom access password *</label>
                      <input 
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-205 rounded-xl outline-none focus:border-indigo-650 text-slate-705 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] uppercase font-bold text-slate-450 tracking-wider font-mono">Repeat confirm custom password *</label>
                      <input 
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new secure code"
                        className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-205 rounded-xl outline-none focus:border-indigo-650 text-slate-705 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#14233C] hover:bg-slate-900 text-white font-black uppercase text-[10px] tracking-wider rounded-xl cursor-pointer shadow-xs border-none"
                    >
                      Apply New Portal Password
                    </button>
                  </form>
                </div>

                {/* Panel 2: Two-Factor, Verification & Simulated logins */}
                <div className="bg-[#FAF9F5] border border-dashed border-[#C29B38]/60 rounded-3xl p-6 sm:p-7 space-y-4">
                  <div className="space-y-1">
                    <h5 className="font-serif font-black text-[#1A365D] text-xs uppercase tracking-wide">Dynamic MFA & Verification Status</h5>
                    <p className="text-[9.5px] text-slate-405 font-bold uppercase tracking-wider">Configure optional second factor challenge validations</p>
                  </div>

                  <div className="space-y-3 text-xs font-sans">
                    {/* MFA Switcher Toggle */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-natural-beige/60">
                      <div>
                        <span className="font-black text-slate-805 block text-[10.5px]">Two-Factor Authorization (MFA)</span>
                        <span className="text-[9px] text-slate-400 block leading-tight">Requests secondary OTP on portal verification logins</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsTwoStepAuthEnabled(!isTwoStepAuthEnabled);
                          alert(isTwoStepAuthEnabled ? 'Multi-factor login challenges DISABLED' : 'Multi-factor login challenges ENABLED. Safeguarding session authentication directories.');
                        }}
                        className={`w-11 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${isTwoStepAuthEnabled ? 'bg-indigo-650' : 'bg-slate-200'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-250 ${isTwoStepAuthEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Verification Badges Section */}
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-2xl border border-natural-beige/60 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-755 block text-[10.5px]">Email Verification Roster</span>
                          <span className="text-[9px] text-slate-400 block">Verified credentials establish portal trust limits</span>
                        </div>
                        {isEmailVerified ? (
                          <span className="p-1 px-2.5 bg-emerald-100 text-emerald-850 font-bold block rounded-md tracking-wider text-[8px] uppercase">✓ Verified</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsEmailVerified(true);
                              alert('Simulated Email Verification OTP transmitted! Student account confirmed as VERIFIED.');
                            }}
                            className="p-1 px-2 bg-indigo-50 border border-indigo-250 text-indigo-750 text-[8.5px] hover:bg-indigo-100 rounded-md font-bold uppercase cursor-pointer text-slate-750"
                          >
                            Verify Email
                          </button>
                        )}
                      </div>

                      <div className="p-3 bg-white rounded-2xl border border-natural-beige/60 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-755 block text-[10.5px]">Mobile SMS Verification Status</span>
                          <span className="text-[9px] text-slate-400 block">Required for dispatching critical emergency alerts</span>
                        </div>
                        {isPhoneVerified ? (
                          <span className="p-1 px-2.5 bg-emerald-100 text-emerald-850 font-bold block rounded-md tracking-wider text-[8px] uppercase">✓ Confirmed</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsPhoneVerified(true);
                              alert('Simulated SMS confirmation token received! Guardian phone network successfully audited.');
                            }}
                            className="p-1 px-2 bg-indigo-50 border border-indigo-250 text-indigo-750 text-[8.5px] hover:bg-indigo-100 rounded-md font-bold uppercase cursor-pointer text-slate-755"
                          >
                            Link Mobile
                          </button>
                        )}
                      </div>
                    </div>

                    {/* simulated account login history logs */}
                    <div className="pt-3 border-t border-natural-beige/40">
                      <span className="text-[8.5px] uppercase font-bold text-slate-400 block mb-2 font-mono">Recent Logins Audit History</span>
                      <div className="space-y-2 font-mono text-[9px]">
                        <div className="bg-white p-2.5 rounded-xl border border-natural-beige/40 flex justify-between items-center text-slate-600">
                          <span className="font-bold block text-[10px]">Lagos, NG (Chrome/Win)</span>
                          <span className="font-bold text-emerald-600">Live Session ●</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-natural-beige/40 flex justify-between items-center text-slate-400">
                          <span className="block text-[9.5px]">Ikeja, NG (Safari/iOS)</span>
                          <span>May 26, 08:31</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* 6.5 PVC ID BADGE POPUP OVERLAY */}
            {isIDBadgeOpen && (() => {
              const [idCurriculum, setIdCurriculum] = useState('wassce_science');
              
              const curriculumLabelMap: Record<string, string> = {
                wassce_science: 'WASSCE - Science Track Grade A',
                wassce_commercial: 'WASSCE - Business & Commercial Track',
                wassce_arts: 'WASSCE - Arts & Humanities Division',
                neco_standard: 'NECO - National Standard Syllabus'
              };

              return (
                <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in text-natural-charcoal select-none">
                  <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-natural-beige flex flex-col max-h-[90vh]">
                    
                    {/* Header bar */}
                    <div className="bg-[#1A365D] text-[#C29B38] p-5 flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#C29B38]" />
                        <div>
                          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">Preston PVC ID Card Desk</h4>
                          <span className="text-[9px] text-slate-300 block">Registered West African Biometric Identity</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsIDBadgeOpen(false)}
                        className="text-white hover:text-slate-200 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    {/* Scrollable Container */}
                    <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center bg-natural-light/30">
                      <div className="max-w-md mx-auto">
                        <p className="text-[11px] text-natural-charcoal/60 leading-relaxed">
                          Your physical plastic PVC smartbadge is encoded with active RFID coils for campus gates. Select your exact syllabus track to preview the reverse credentials before requesting a reprint.
                        </p>
                      </div>

                      {/* Curriculum Selector and Print Utilities */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto bg-white p-4 rounded-2xl border border-natural-beige text-left">
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold text-natural-green uppercase tracking-wider">WAEC / Curriculum Track Selection *</label>
                          <select 
                            value={idCurriculum}
                            onChange={(e) => setIdCurriculum(e.target.value)}
                            className="w-full text-xs px-2.5 py-2 bg-natural-light border border-natural-beige rounded-xl outline-none font-semibold text-natural-charcoal"
                          >
                            <option value="wassce_science">WAEC WASSCE (Science Track)</option>
                            <option value="wassce_commercial">WAEC WASSCE (Commercial Track)</option>
                            <option value="wassce_arts">WAEC WASSCE (Arts Track)</option>
                            <option value="neco_standard">NECO Standard National Syllabus</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => window.print()}
                            className="w-full py-2 bg-natural-green hover:bg-[#C29B38] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Printer className="w-4 h-4 text-white" /> Print Pocket PVC Badge
                          </button>
                        </div>
                      </div>

                      {/* Side-by-Side Dual-sided PVC Card */}
                      <div className="flex flex-col md:flex-row gap-6 justify-center items-center py-4 print:p-0">
                        
                        {/* FRONT SIDE CARD */}
                        <div className="w-80 h-48 bg-gradient-to-br from-[#1A365D] via-[#224472] to-[#122b51] rounded-2xl border border-slate-700 p-4 flex flex-col justify-between text-white shadow-xl relative overflow-hidden shrink-0">
                          {/* Holographic accent layer */}
                          <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
                          
                          {/* Header banner */}
                          <div className="flex justify-between items-start border-b border-white/10 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <img 
                                src="/logo.png" 
                                alt="Preston Logo" 
                                className="w-6 h-6 object-contain bg-white rounded-full p-0.5"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h5 className="text-[8px] font-black tracking-widest text-[#C29B38] uppercase leading-none">Preston College</h5>
                                <span className="text-[6.5px] text-white/50 block tracking-tight"> Lagos State Zone</span>
                              </div>
                            </div>
                            <span className="text-[7px] bg-[#C29B38] px-1.5 py-0.5 rounded text-[#1A365D] font-black uppercase tracking-wider">STUDENT PASS</span>
                          </div>

                          {/* Body details */}
                          <div className="flex gap-3 my-2 items-center flex-1">
                            {/* Photo avatar */}
                            <div className="w-16 h-20 bg-slate-100 rounded-lg border border-white/20 overflow-hidden relative shadow-md shrink-0 p-0.5">
                              <img 
                                src={targetStudent.hasBadgeWithPhoto || "/logo.png"} 
                                alt="ID Passport Photo" 
                                className="w-full h-full object-cover rounded-md"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            {/* Metadata */}
                            <div className="space-y-1.5 text-left text-white/90">
                              <div>
                                <span className="text-[5.5px] text-slate-350 block uppercase leading-none">Full Name</span>
                                <span className="text-xs font-bold leading-none block font-serif tracking-wide text-white">{targetStudent.name}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-left">
                                <div>
                                  <span className="text-[5.5px] text-slate-350 block uppercase leading-none">Admiss. Num</span>
                                  <span className="text-[9.5px] font-bold font-mono text-[#C29B38] leading-none block">{targetStudent.admissionNumber || 'NUA-26-8812'}</span>
                                </div>
                                <div>
                                  <span className="text-[5.5px] text-slate-350 block uppercase leading-none">Roster Class</span>
                                  <span className="text-[9.5px] font-bold leading-none block text-white">{targetStudent.gradeLevel}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Chip and barcode */}
                          <div className="flex justify-between items-center border-t border-white/10 pt-1.5 mt-auto leading-none">
                            {/* Simulated RFID Smart Gold Chip */}
                            <div className="w-7 h-5 bg-gradient-to-br from-[#E9C46A] to-[#F4A261] rounded border border-[#E76F51] flex flex-col justify-between p-1 shadow-inner relative overflow-hidden-none shrink-0">
                              <div className="w-full h-[1px] bg-[#E76F51]/50" />
                              <div className="w-full h-[1px] bg-[#E76F51]/50" />
                              <div className="w-full h-[1px] bg-[#E76F51]/50" />
                            </div>

                            <span className="text-[6.5px] text-white/40 tracking-widest uppercase font-bold">RFID 13.56MHz ENCODED</span>

                            {/* Barcode line mock */}
                            <div className="h-5 flex items-end gap-[1.5px] bg-slate-950/25 px-1.5 rounded p-0.5">
                              <div className="w-[1.5px] h-3.5 bg-white/70" />
                              <div className="w-[1px] h-3.5 bg-white/70" />
                              <div className="w-[2.5px] h-3.5 bg-white/70" />
                              <div className="w-[1px] h-3.5 bg-white/70" />
                              <div className="w-[1.5px] h-3.5 bg-white/70" />
                              <div className="w-[2px] h-3.5 bg-white/70" />
                              <div className="w-[1px] h-3.5 bg-white/70" />
                            </div>
                          </div>
                        </div>

                        {/* BACK SIDE CARD */}
                        <div className="w-80 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border border-slate-300 p-4 flex flex-col justify-between text-neutral-charcoal shadow-xl relative overflow-hidden shrink-0">
                          {/* Signature line check */}
                          <div className="space-y-2 text-left">
                            <div className="h-3.5 bg-slate-900 border-none rounded -mx-4 -mt-4 opacity-90" />
                            
                            <div className="space-y-1 mt-1.5">
                              <span className="text-[6px] text-natural-charcoal/40 block uppercase font-bold">Authorized Syllabus Curriculum</span>
                              <span className="text-[9.5px] font-bold font-serif text-[#1A365D] bg-white border border-slate-300 rounded px-1.5 py-0.5 block leading-tight">
                                {curriculumLabelMap[idCurriculum]}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-1.5">
                              <div>
                                <span className="text-[5.5px] text-natural-charcoal/40 block uppercase font-bold">Hologram Key Reference</span>
                                <span className="text-[7.5px] bg-[#C29B38]/10 text-[#C29B38] px-1.5 py-0.5 rounded font-mono font-bold block mt-0.5">
                                  KEY-PASS-2026-NUA
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[5.5px] text-natural-charcoal/40 block uppercase font-bold font-sans">Verification Index</span>
                                <span className="text-[8px] font-bold block mt-0.5 text-natural-green">Preston-WA-Active</span>
                              </div>
                            </div>
                          </div>

                          {/* Legal and Disclaimer notes */}
                          <p className="text-[5px] text-natural-charcoal/50 leading-relaxed text-left border-t border-slate-300 pt-1.5 mt-auto">
                            This card is the property of NEW UNIQUE ACADEMY, Lagos, Nigeria. Found cards must be contextually returned to the Registrar. Biometric readers log location data at school entries.
                          </p>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}

          </div>
        );
      })()}


    </div>
  );
}
