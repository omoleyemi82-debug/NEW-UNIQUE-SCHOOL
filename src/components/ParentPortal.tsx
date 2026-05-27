import React, { useState, useEffect } from 'react';
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
  Lock,
  Mail,
  Bell,
  User,
  RefreshCw,
  Check,
  ExternalLink,
  QrCode,
  Users,
  UploadCloud,
  Trash2,
  FileText
} from 'lucide-react';
import { getWAECGrade, calculateTermPerformance } from '../utils/gradeUtils';

export default function ParentPortal({ activeTab: initialActiveTab }: { activeTab: string }) {
  const { 
    currentUserId, 
    students, 
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
    addPaymentRecord,
    notifications,
    markNotificationAsRead,
    messages,
    addNotification
  } = useSchool();

  // Find the active parent in database
  const activeParent = parents?.find(p => p.id === currentUserId) || parents?.[0] || {
    id: 'p_01',
    name: 'Robert Alvarez',
    email: 'robert.alvarez@mail.com',
    phone: '+1 (555) 123-4567',
    studentIds: ['s_01'],
    address: '742 Evergreen Terrace, Lagos',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isActiveAccount: true
  };

  // Switch between linked students
  const linkedStudents = students.filter(s => activeParent.studentIds.includes(s.id));
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    linkedStudents[0]?.id || 's_01'
  );

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Tab internal page alignment
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Sync external sidebar navigation selection to parent portal tabs
  useEffect(() => {
    if (initialActiveTab === 'dash') setActiveTab('overview');
    else if (initialActiveTab === 'grades') setActiveTab('results');
    else if (initialActiveTab === 'att') setActiveTab('attendance');
    else if (initialActiveTab === 'tuition') setActiveTab('payments');
    else if (initialActiveTab === 'cal') setActiveTab('announcements');
    else if (initialActiveTab === 'profile') setActiveTab('messages');
  }, [initialActiveTab]);

  // Billing state declarations
  const [payCurrency, setPayCurrency] = useState<'USD' | 'NGN'>('NGN');
  const conversionRate = 1500; // 1 USD = 1,500 NGN
  const [simulatedCountry, setSimulatedCountry] = useState<string>('United States');
  const [checkoutStep, setCheckoutStep] = useState<number>(1);

  // Active Category to pay
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [payMethod, setPayMethod] = useState<string>('card');
  const [payAmountInput, setPayAmountInput] = useState<string>('');

  // Sandbox card states
  const [cardNumber, setCardNumber] = useState('4488 9201 3241 8802');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCVV, setCardCVV] = useState('384');

  // Bank transfer simulation states
  const [wireCountdown, setWireCountdown] = useState(1800); // 30 minutes
  const [wireGenerating, setWireGenerating] = useState(false);
  const [wireGenerated, setWireGenerated] = useState(false);
  const [hasVerifiedWire, setHasVerifiedWire] = useState(false);

  // Paystack modal trigger
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [paystackStep, setPaystackStep] = useState<'details' | 'pin' | 'otp' | 'success'>('details');
  const [paystackPin, setPaystackPin] = useState('1234');
  const [paystackOtp, setPaystackOtp] = useState('5588');
  const [paystackMessage, setPaystackMessage] = useState('');

  // Receipt visual block popup
  const [receiptPopupObj, setReceiptPopupObj] = useState<any | null>(null);

  // States for uploading bank transaction confirms
  const [receiptImgFile, setReceiptImgFile] = useState<string | null>(null);
  const [receiptImgName, setReceiptImgName] = useState<string>('');

  // Countdown timer for wire transfers
  useEffect(() => {
    if (wireGenerated && wireCountdown > 0) {
      const timer = setInterval(() => {
        setWireCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [wireGenerated, wireCountdown]);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Derive billing values for selection student
  const applicableCategories = paymentCategories.filter(
    cat => cat.appliesToClass === 'All' || cat.appliesToClass === activeStudent.gradeLevel
  );

  const studentRecords = paymentRecords.filter(rec => rec.studentId === activeStudent.id);

  // Itemized tracking of balances
  const billingItems = applicableCategories.map(cat => {
    const recordsForCat = studentRecords.filter(r => r.categoryId === cat.id);
    const paid = recordsForCat.reduce((sum, r) => sum + r.amountPaid, 0);
    const balance = Math.max(0, cat.amount - paid);
    return {
      category: cat,
      paid,
      balance,
      status: balance <= 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid'
    };
  });

  const aggregateBilled = applicableCategories.reduce((sum, c) => sum + c.amount, 0);
  const aggregatePaid = studentRecords.reduce((sum, r) => sum + r.amountPaid, 0);
  const aggregateBalance = Math.max(0, aggregateBilled - aggregatePaid);

  // Select first unpaid/partial fee as dynamic default option when entering tab
  useEffect(() => {
    const unpaid = billingItems.find(item => item.balance > 0);
    if (unpaid) {
      setSelectedCategory(unpaid.category);
      setPayAmountInput(String(unpaid.balance));
    } else if (applicableCategories[0]) {
      setSelectedCategory(applicableCategories[0]);
      setPayAmountInput(String(applicableCategories[0].amount));
    }
  }, [selectedStudentId]);

  // Adjust amount input when category or currency changes
  useEffect(() => {
    if (selectedCategory) {
      const item = billingItems.find(bi => bi.category.id === selectedCategory.id);
      const balanceVal = item ? item.balance : selectedCategory.amount;
      if (payCurrency === 'NGN') {
        setPayAmountInput(String(balanceVal * conversionRate));
      } else {
        setPayAmountInput(String(balanceVal));
      }
    }
  }, [selectedCategory, payCurrency]);

  // Handle payments autorun
  const triggerGenericGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Please select a fee category to pay.");
      return;
    }

    const num = parseFloat(payAmountInput);
    if (isNaN(num) || num <= 0) {
      alert('Please state a valid affirmative fee amount.');
      return;
    }

    const valueUSD = payCurrency === 'NGN' ? num / conversionRate : num;
    const item = billingItems.find(bi => bi.category.id === selectedCategory.id);
    const activeBalanceUSD = item ? item.balance : selectedCategory.amount;

    if (valueUSD > (activeBalanceUSD + 0.01)) {
      alert(`The authorized payment of $${valueUSD.toFixed(1)} exceeds outstanding category balance of $${activeBalanceUSD}`);
      return;
    }

    // Process different gateways
    if (payMethod === 'Card') {
      setIsPaystackOpen(true);
      setPaystackStep('details');
      setPaystackMessage('');
    } else {
      setWireGenerating(true);
      setTimeout(() => {
        setWireGenerating(false);
        setWireGenerated(true);
        setWireCountdown(1800); // 30 minutes
      }, 1200);
    }
  };

  const verifyBankTransfer = () => {
    setWireGenerated(false);
    handleDirectSettle('Bank Transfer');
  };

  const handlePaystackSettle = () => {
    if (!selectedCategory) return;
    const num = parseFloat(payAmountInput);
    const valueUSD = payCurrency === 'NGN' ? num / conversionRate : num;
    const reference = `TXN-CARD-${Math.floor(100000 + Math.random() * 900000)}`;
    const recNo = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    addPaymentRecord({
      studentId: activeStudent.id,
      parentId: activeParent.id,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      amountPaid: valueUSD,
      date: new Date().toISOString().split('T')[0],
      method: 'Card payments (Visa, Mastercard, Verve)',
      referenceId: reference,
      receiptNo: recNo,
      currency: payCurrency
    });

    addNotification({
      studentId: activeStudent.id,
      parentId: activeParent.id,
      title: 'School Payment Fulfilled',
      message: `Successfully cleared ${selectedCategory.name} layer. Reference ID: ${reference}. Printed bursar indices updated.`,
      date: new Date().toISOString().split('T')[0],
      type: 'payment_success',
      isRead: false
    });

    const mockReceipt = {
      receiptNo: recNo,
      referenceId: reference,
      date: new Date().toISOString().split('T')[0],
      category: selectedCategory.name,
      amtUSD: valueUSD,
      studentName: activeStudent.name,
      studentClass: activeStudent.gradeLevel,
      studentAdm: activeStudent.admissionNumber || 'NUA-26-8812',
      currency: payCurrency,
      method: 'Card payments (Visa, Mastercard, Verve)'
    };

    setReceiptPopupObj(mockReceipt);
    setIsPaystackOpen(false);
    
    alert('Payment Fulfilled successfully! Your receipt has been dynamically generated below.');
  };

  const handleDirectSettle = (methodId: string) => {
    if (!selectedCategory) return;
    const num = parseFloat(payAmountInput);
    const valueUSD = payCurrency === 'NGN' ? num / conversionRate : num;
    
    const pmConfig = paymentMethods?.find(pm => pm.id === methodId);
    const pmName = pmConfig ? pmConfig.name : `${methodId.toUpperCase()} Checkout System`;

    const reference = `TXN-${methodId.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const recNo = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    addPaymentRecord({
      studentId: activeStudent.id,
      parentId: activeParent.id,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      amountPaid: valueUSD,
      date: new Date().toISOString().split('T')[0],
      method: pmName,
      referenceId: reference,
      receiptNo: recNo,
      currency: payCurrency
    });

    addNotification({
      studentId: activeStudent.id,
      parentId: activeParent.id,
      title: `${selectedCategory.name} Settlement Successful`,
      message: `A settlement of $${valueUSD.toFixed(1)} via ${pmName} has been fully cleared for ${activeStudent.name}. Log target reference: ${reference}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'payment_success',
      isRead: false
    });

    const mockReceipt = {
      receiptNo: recNo,
      referenceId: reference,
      date: new Date().toISOString().split('T')[0],
      category: selectedCategory.name,
      amtUSD: valueUSD,
      studentName: activeStudent.name,
      studentClass: activeStudent.gradeLevel,
      studentAdm: activeStudent.admissionNumber || 'NUA-26-8812',
      currency: payCurrency,
      method: pmName
    };

    setReceiptPopupObj(mockReceipt);
    setWireGenerated(false);
    setHasVerifiedWire(true);

    alert(`Thank you! Your payment of $${valueUSD.toFixed(1)} via ${pmName} has been processing successfully. A certified receipt has been generated below.`);
  };

  // Student specific transcripts & metadata
  const studentGrades = grades.filter(g => g.studentId === activeStudent.id);
  const studentAttendanceList = attendance.filter(a => a.studentId === activeStudent.id);
  const studentSubmissions = submissions.filter(s => s.studentId === activeStudent.id);

  // Term selection state for Report Sheet
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const filteredGrades = studentGrades.filter(g => {
    if (selectedTerm === 'all') return true;
    if (selectedTerm === '1st Term 2026') return g.term === '1st Term 2026' || g.term === 'Spring 2026';
    return g.term === selectedTerm;
  });

  const termData = calculateTermPerformance(filteredGrades);

  // Math for GPA
  const calculateGPA = () => {
    if (studentGrades.length === 0) return '4.00';
    let totalPoints = 0;
    studentGrades.forEach(g => {
      const percentage = (g.score / g.maxScore) * 105;
      if (percentage >= 90) totalPoints += 5.0;
      else if (percentage >= 80) totalPoints += 4.0;
      else if (percentage >= 70) totalPoints += 3.0;
      else if (percentage >= 60) totalPoints += 2.0;
      else totalPoints += 0;
    });
    return (totalPoints / studentGrades.length).toFixed(2);
  };

  // Math for attendance
  const totalAttended = studentAttendanceList.length;
  const presentCount = studentAttendanceList.filter(a => a.status === 'present').length;
  const lateCount = studentAttendanceList.filter(a => a.status === 'late').length;
  const attendanceRate = totalAttended > 0 ? (((presentCount + lateCount * 0.7) / totalAttended) * 100).toFixed(0) : '100';

  // Notifications filtering
  const parentNotifications = notifications.filter(n => n.parentId === activeParent.id);
  const parentMessages = messages.filter(m => m.parentId === activeParent.id);

  return (
    <div className="space-y-8 max-w-7xl mx-auto" id="parent-portal-root">
      
      {/* Visual Alert Badge notifying Parent is signed in */}
      <div className="bg-white border-2 border-natural-clay/40 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fade-in print:hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-natural-clay/10 text-natural-clay rounded-xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-natural-charcoal uppercase tracking-widest">Active Guardian Command Console</h4>
            <div className="text-lg font-serif font-black text-natural-charcoal mt-1">Robert Alvarez Accounts Portal</div>
            <p className="text-[11px] text-natural-charcoal/65 mt-1">Sponsor of the following Pupils. Click on any child avatar below to immediately bind and pivot live scholastic analytics.</p>
          </div>
        </div>

        {/* Child Selector Widget */}
        <div className="flex flex-wrap items-center gap-3 bg-natural-light p-2 border border-natural-beige rounded-2xl">
          <span className="text-[9.5px] font-black text-natural-charcoal/50 uppercase tracking-widest pl-2">Select pupil:</span>
          {linkedStudents.map(student => {
            const isSelected = student.id === selectedStudentId;
            return (
              <button
                key={student.id}
                id={`child-toggle-${student.id}`}
                onClick={() => {
                  setSelectedStudentId(student.id);
                  // Clear pending states
                  setWireGenerated(false);
                  setReceiptPopupObj(null);
                }}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border ${
                  isSelected 
                    ? 'bg-natural-green border-natural-green text-white shadow-md font-black' 
                    : 'bg-white border-natural-beige hover:border-natural-green text-natural-charcoal'
                }`}
              >
                <img 
                  src={student.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"} 
                  alt={student.name} 
                  className="w-5 h-5 rounded-full object-cover border border-natural-beige shrink-0" 
                  referrerPolicy="no-referrer"
                />
                <span>{student.name.split(' ')[0]} ({student.gradeLevel})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Internal Ribbon Nav Menu bar */}
      <div className="bg-white border border-natural-beige p-1 rounded-2xl flex flex-wrap gap-1 print:hidden shadow-xs">
        {[
          { id: 'overview', label: 'Dashboard summary', icon: BarChart3 },
          { id: 'results', label: 'Transcripts & Results', icon: Award },
          { id: 'attendance', label: 'Attendance logs', icon: ClipboardCheck },
          { id: 'payments', label: 'Fees & Payment system', icon: CreditCard },
          { id: 'announcements', label: 'Events & News', icon: Calendar },
          { id: 'messages', label: 'School Letters', icon: Mail }
        ].map(tb => {
          const isSelected = activeTab === tb.id;
          const Icon = tb.icon;
          return (
            <button
              key={tb.id}
              id={`tab-btn-${tb.id}`}
              onClick={() => setActiveTab(tb.id)}
              className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isSelected 
                  ? 'bg-[#1A365D] text-white shadow-sm font-black' 
                  : 'text-natural-charcoal/70 hover:text-natural-charcoal hover:bg-natural-light'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#1A365D]'}`} />
              <span className="hidden lg:inline">{tb.label}</span>
              <span className="lg:hidden">{tb.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER DETAILED VIEW PORTS */}
      
      {/* SECTION A: OVERVIEW / DASHBOARD SUMMARY */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in" id="parent-overview-viewport">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-natural-green/85 font-bold uppercase tracking-wider block">Student Cumulative GPA</span>
                <span className="text-3xl font-serif font-black text-natural-charcoal tracking-tight">{calculateGPA()}</span>
              </div>
              <div className="p-3 bg-natural-light text-natural-green border border-natural-beige rounded-xl">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-natural-green/85 font-bold uppercase tracking-wider block">Child Class Attendance</span>
                <span className="text-3xl font-black text-natural-clay tracking-tight">{attendanceRate}%</span>
              </div>
              <div className="p-3 bg-natural-light text-natural-clay border border-natural-beige rounded-xl">
                <ClipboardCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-natural-green/85 font-bold uppercase tracking-wider block font-bold">Outstanding Category Fees</span>
                <span className="text-3xl font-serif font-black text-rose-600 tracking-tight">
                  {payCurrency === 'NGN' ? `₦${(aggregateBalance * conversionRate).toLocaleString()}` : `$${aggregateBalance}`}
                </span>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-natural-green/85 font-bold uppercase tracking-wider block">Completed Quizzes</span>
                <span className="text-3xl font-black text-natural-clay tracking-tight">{studentSubmissions.length}</span>
              </div>
              <div className="p-3 bg-natural-light text-natural-clay border border-natural-beige rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Student Profile & Course Schedule list */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-natural-beige shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-3 text-center md:text-left space-y-3">
                  <img
                    src={activeStudent.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"}
                    alt={activeStudent.name}
                    className="w-24 h-24 rounded-full mx-auto md:mx-0 object-cover border-2 border-natural-green shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded-lg">Validated Pupil</span>
                </div>
                
                <div className="md:col-span-9 space-y-3 font-sans">
                  <div className="space-y-1">
                    <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest">{activeStudent.gradeLevel} pupil profile</span>
                    <h3 className="text-xl font-serif font-black text-natural-charcoal">{activeStudent.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#A6802B] font-bold uppercase text-[9px] block">Admission Index</span>
                      <span className="font-mono font-bold">{activeStudent.admissionNumber || 'NUA/2026/001'}</span>
                    </div>
                    <div>
                      <span className="text-[#A6802B] font-bold uppercase text-[9px] block">Portal Username Code</span>
                      <span className="font-mono font-bold text-natural-green">{activeStudent.username || 'nua_student'}</span>
                    </div>
                    <div>
                      <span className="text-[#A6802B] font-bold uppercase text-[9px] block">Linked Guardian</span>
                      <span className="font-bold">{activeStudent.guardianName} ({activeStudent.guardianPhone})</span>
                    </div>
                    <div>
                      <span className="text-[#A6802B] font-bold uppercase text-[9px] block">Registered Email</span>
                      <span className="font-bold lowercase">{activeStudent.email}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Course schedule list */}
              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                <h4 className="font-serif font-black text-sm text-natural-charcoal">Child Class Schedule & Teachers</h4>
                <div className="divide-y divide-natural-beige/30 text-xs">
                  {courses.map(course => {
                    const lessonsGrades = studentGrades.filter(g => g.courseId === course.id);
                    const avgScore = lessonsGrades.length > 0 
                      ? Math.round((lessonsGrades.reduce((sum, current) => sum + (current.score / current.maxScore), 0) / lessonsGrades.length) * 100)
                      : null;

                    return (
                      <div key={course.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-natural-green font-bold text-[10.5px] font-mono">{course.code}</span>
                            <span className="font-serif font-bold text-[#2D2A26] pr-2">{course.name}</span>
                          </div>
                          <p className="text-natural-charcoal/65 mt-1">{course.schedule.days.join(', ')} • {course.schedule.time} • ({course.room})</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-semibold text-natural-charcoal/50">Current average:</span>
                          {avgScore !== null ? (
                            <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg ${
                              avgScore >= 85 ? 'bg-emerald-50 text-emerald-800' : avgScore >= 70 ? 'bg-amber-50 text-amber-800' : 'bg-slate-50 text-slate-800'
                            }`}>
                              {avgScore}%
                            </span>
                          ) : (
                            <span className="italic text-natural-charcoal/30">Not graded</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Sidebar quick components (recent messages & notifications) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* School Alerts Box */}
              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                <h4 className="font-serif font-bold text-natural-charcoal text-sm flex items-center justify-between border-b pb-2 border-natural-beige/35">
                  <span>Recent School Alerts</span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider block">Live alerts</span>
                </h4>
                
                <div className="space-y-3.5 max-h-[250px] overflow-y-auto">
                  {parentNotifications.length === 0 ? (
                    <p className="text-xs text-natural-charcoal/40 italic">No persistent system alerts registered.</p>
                  ) : (
                    parentNotifications.slice(0, 3).map(notif => {
                      const typeIcons = {
                        result: Award,
                        payment_reminder: AlertCircle,
                        payment_success: CheckCircle2,
                        due_date: Clock,
                        announcement: Calendar
                      };
                      const IconComponent = typeIcons[notif.type] || Info;

                      return (
                        <div key={notif.id} className="p-3 bg-natural-light/60 border border-natural-beige/40 rounded-xl flex gap-2.5 items-start">
                          <IconComponent className="w-4 h-4 text-natural-green shrink-0 mt-0.5" />
                          <div className="space-y-1 text-[11px] leading-relaxed">
                            <span className="font-bold text-natural-charcoal block leading-none">{notif.title}</span>
                            <p className="text-natural-charcoal/70">{notif.message}</p>
                            <span className="block text-[8.5px] text-natural-charcoal/40 font-mono">{notif.date}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bursar Info block */}
              <div className="bg-[#FAF9F5] border border-dashed border-[#C29B38] p-6 rounded-2xl space-y-3">
                <Building className="w-5 h-5 text-[#C29B38]" />
                <span className="font-serif font-black text-xs text-natural-charcoal block">Academic Bursar Wire Memo</span>
                <p className="text-[11px] leading-relaxed text-natural-charcoal/80">
                  New Unique Academy accommodates terminal billing. To register secure options, please authorize directly inside the "Payments tab". Receipts are instantly logged.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* SECTION B: TRANSCRIPTS & ACADEMIC SHEETS */}
      {activeTab === 'results' && (
        <div className="space-y-8 animate-fade-in" id="parent-results-viewport">
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

          {/* Transcript Certificate Sheet */}
          <div className="bg-[#FAF9F5] border-4 border-double border-natural-beige rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden print:border-none print:shadow-none print:bg-white print:p-0">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-0">
              <img 
                src="/src/assets/images/school_logo_1779413996009.png" 
                alt="Watermark Logo" 
                className="w-96 h-96 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Print trigger button overlay */}
            <div className="absolute top-6 right-6 flex items-center gap-2 print:hidden z-10">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-all flex items-center gap-2 outline-none"
              >
                <Printer className="w-4 h-4" /> Print Transcript Record
              </button>
            </div>

            {/* Certificate border frame */}
            <div className="relative z-10 border border-natural-beige/60 p-4 sm:p-6 rounded-2xl space-y-8 print:p-0 print:border-none">
              
              {/* School badge headers */}
              <div className="text-center pb-6 border-b border-natural-beige/50 space-y-2">
                <div className="flex justify-center mb-3">
                  <img 
                    src="/src/assets/images/school_logo_1779413996009.png" 
                    alt="NUA Logo" 
                    className="w-16 h-16 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-natural-green tracking-tight">NEW UNIQUE ACADEMY</h1>
                <p className="text-[10px] text-natural-charcoal/50 font-bold uppercase tracking-widest leading-none">REGISTRATION NO: RC.9942084 | MINISTRY OF EDUCATION APPROVED</p>
                <p className="font-serif italic text-xs text-natural-clay font-semibold">"Character and Academic Prowess for Global Elevation"</p>
              </div>

              {/* Pupil Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-natural-charcoal bg-natural-light/60 p-4 rounded-xl border border-natural-beige/30">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Student Pupil Name</span>
                  <span className="font-serif font-black text-natural-charcoal">{activeStudent.name}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Portal Username / ID</span>
                  <span className="font-mono font-bold text-natural-green">{activeStudent.username || 'NUA/2026/01'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Admission Number</span>
                  <span className="font-mono font-bold text-natural-clay">{activeStudent.admissionNumber || 'NUA-26-001'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Class Level</span>
                  <span className="font-bold text-natural-charcoal">{activeStudent.gradeLevel}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Active Term Track</span>
                  <span className="font-bold text-natural-green">{selectedTerm === 'all' ? 'All Terms Cumulative Ledger' : selectedTerm}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Gender Group</span>
                  <span className="font-bold text-natural-charcoal">{activeStudent.gender || 'Male'}</span>
                </div>
                <div className="space-y-0.5 col-span-2">
                  <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Guardian Endorsement Sponsor</span>
                  <span className="font-bold text-natural-clay">{activeStudent.guardianName} ({activeStudent.guardianPhone})</span>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="space-y-2">
                <h4 className="font-serif font-black text-[#1A365D] text-sm pb-1 border-b border-natural-beige/30 flex items-center justify-between">
                  <span>Subject Performance Matrix</span>
                  <span className="text-[9.5px] font-sans font-bold text-natural-clay uppercase tracking-wider">WAEC West African Grading Standard</span>
                </h4>

                {filteredGrades.length === 0 ? (
                  <div className="p-8 text-center text-natural-charcoal/40 italic text-xs bg-white rounded-xl border border-natural-beige">
                    No academic records compiled for this term block. Feel free to contact specific subject tutors.
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white border border-natural-beige rounded-xl shadow-xs">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead className="bg-[#FAF9F5] text-[10px] font-bold text-natural-green uppercase tracking-wider border-b border-natural-beige">
                        <tr>
                          <th className="px-5 py-3">Subject Discipline</th>
                          <th className="px-5 py-3">Evaluated Item / Category</th>
                          <th className="px-5 py-3 text-center">Score Ratio</th>
                          <th className="px-5 py-3 text-center">Percentage</th>
                          <th className="px-5 py-3 text-center">WAEC Code</th>
                          <th className="px-5 py-3 text-right">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-natural-beige/25">
                        {filteredGrades.map(g => {
                          const percentage = Math.round((g.score / g.maxScore) * 100);
                          const waec = getWAECGrade(percentage);
                          const cn = courses.find(c => c.id === g.courseId);

                          return (
                            <tr key={g.id} className="hover:bg-natural-light/10 font-sans">
                              <td className="px-5 py-3.5">
                                <span className="font-serif font-extrabold text-natural-charcoal block">{cn ? cn.name : g.courseId}</span>
                                <span className="text-[9px] text-[#A6802B] font-bold block">{cn ? cn.code : ''}</span>
                              </td>
                              <td className="px-5 py-3.5 text-natural-charcoal/70 font-medium">
                                <span>{g.title}</span>
                                <span className="block text-[8px] uppercase font-bold text-natural-green opacity-70">{g.category}</span>
                              </td>
                              <td className="px-5 py-3.5 text-center font-mono font-bold text-natural-charcoal">
                                {g.score} / {g.maxScore}
                              </td>
                              <td className="px-5 py-3.5 text-center font-serif font-black text-natural-charcoal text-sm">
                                {percentage}%
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

              {/* Summary blocks */}
              {filteredGrades.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-sans">
                  <div className="bg-white p-4 rounded-xl border border-natural-beige/60 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Cumulative Score Average</span>
                    <p className="text-2xl font-serif font-black text-natural-charcoal leading-none">
                      {Math.round(filteredGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / filteredGrades.length)}%
                    </p>
                    <span className="text-[10px] text-natural-clay font-bold block">Scale average percentage</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-natural-beige/60 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Term GPA Vector (5.0 Scale)</span>
                    <p className={`text-2xl font-serif font-black leading-none ${termData.colorClass}`}>
                      {termData.gpa}
                    </p>
                    <span className="text-[10px] text-natural-charcoal/60 font-bold block uppercase tracking-wide">{termData.standing}</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-natural-beige/60 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-natural-charcoal/40 block">Class Standing Placement</span>
                    <p className="text-2xl font-serif font-black text-[#1A365D] leading-none">
                      2 <span className="text-xs font-sans text-natural-charcoal/40 font-bold">of {students.length} Pupils</span>
                    </p>
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wider">● FIRST TIER STANDING</span>
                  </div>
                </div>
              )}

              {/* Endorsements remarks */}
              {filteredGrades.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-natural-beige/40 grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed text-xs">
                  <div className="md:col-span-6 space-y-1">
                    <h5 className="font-serif font-black text-natural-green">Class Tutor Endorsement</h5>
                    <p className="text-natural-charcoal/85 italic pt-1 leading-normal">
                      "Julian Alvarez demonstrates a profound, disciplined logic in testing worksheets. Submissions are detailed and punctual. Recommended for higher AP science Tracks."
                    </p>
                    <div className="pt-4 flex items-center gap-2">
                      <div className="h-0.5 w-12 bg-natural-beige" />
                      <span className="text-[9.5px] font-bold text-natural-charcoal/40 uppercase tracking-widest">Class Tutor Signature</span>
                    </div>
                  </div>
                  <div className="md:col-span-6 space-y-1 md:border-l md:border-natural-beige/30 md:pl-6 animate-pulse">
                    <h5 className="font-serif font-black text-natural-clay">Principal Benson's Cabinet decision</h5>
                    <p className="text-natural-charcoal/85 font-medium leading-normal pt-1">
                      {termData.comment} Formative assessments represent verified RC.9942084 compliance indices.
                    </p>
                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-0.5 w-12 bg-natural-clay" />
                        <span className="text-[9.5px] font-bold text-natural-clay/70 uppercase tracking-widest">Principal Benson</span>
                      </div>
                      <div className="relative border-4 border-emerald-700 text-emerald-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transform rotate-[-3deg] opacity-80 select-none font-sans">
                        BOARD CERTIFIED
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* SECTION C: ATTENDANCE LOGS */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-fade-in" id="parent-attendance-viewport">
          <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-black text-natural-charcoal">Child Class Attendance Profile</h3>
              <p className="text-natural-charcoal/70 text-xs">Day-by-day classroom log sheets recorded by assigned instructors.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-natural-charcoal bg-natural-light p-3 rounded-xl border">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">TOTAL DAYS REPORTED</span>
                <span className="text-slate-700 font-mono text-sm font-black">{totalAttended} days</span>
              </div>
              <div className="border-l border-slate-300 pl-4">
                <span className="text-emerald-500 block text-[9px] uppercase font-bold">PRESENT RATIO</span>
                <span className="text-emerald-700 font-mono text-sm font-black">{presentCount} days</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-natural-beige shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] text-[10px] font-bold text-natural-green uppercase tracking-wider border-b">
                  <tr>
                    <th className="px-6 py-4">Calendar Date</th>
                    <th className="px-6 py-4">Assigned Course</th>
                    <th className="px-6 py-4">Status Index</th>
                    <th className="px-6 py-4">Instructor Comment Guidelines</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-natural-beige/20 text-xs text-natural-charcoal/90">
                  {studentAttendanceList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-natural-charcoal/40 italic">No attendance records registered. Mark classroom ledgers in Faculty Dashboard.</td>
                    </tr>
                  ) : (
                    studentAttendanceList.map(item => {
                      const cn = courses.find(c => c.id === item.courseId);
                      const statusStyles = {
                        present: 'bg-emerald-50 text-emerald-800 border-emerald-100',
                        absent: 'bg-rose-50 text-rose-800 border-rose-100',
                        late: 'bg-amber-50 text-amber-800 border-amber-100',
                        excused: 'bg-blue-50 text-blue-800 border-blue-105'
                      };

                      return (
                        <tr key={item.id} className="hover:bg-natural-light/10 font-sans">
                          <td className="px-6 py-4 font-mono font-bold">{item.date}</td>
                          <td className="px-6 py-4">
                            <span className="font-serif font-black block">{cn ? cn.name : item.courseId}</span>
                            <span className="text-[9px] text-slate-400 font-semibold">{cn ? cn.code : ''}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[9.5px] font-bold rounded-lg border uppercase ${statusStyles[item.status]}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-natural-charcoal/70 italic">
                            {item.notes || 'No attendance remarks appended.'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION D: FEES & PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fade-in" id="parent-payments-viewport">
          
          {/* Billing Header */}
          <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-natural-clay font-bold uppercase tracking-wider block">PRESTON BURSAR BOARD</span>
              <h3 className="text-xl font-serif font-black text-natural-charcoal">Fulfill Outstanding Invoices</h3>
              <p className="text-natural-charcoal/75 text-xs">Verify dynamic itemized fees per category, inspect automated virtual accounts, and download certified receipts.</p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 bg-natural-light p-1 border border-natural-beige rounded-xl select-none shrink-0 self-start">
              <button
                type="button"
                onClick={() => setPayCurrency('NGN')}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  payCurrency === 'NGN' ? 'bg-[#1A365D] text-white shadow-xs' : 'text-natural-charcoal/60 hover:text-natural-charcoal'
                }`}
              >
                NGN (₦)
              </button>
              <button
                type="button"
                onClick={() => setPayCurrency('USD')}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  payCurrency === 'USD' ? 'bg-[#1A365D] text-white shadow-xs' : 'text-natural-charcoal/60 hover:text-natural-charcoal'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>

          {/* Fee Itemization cards list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {billingItems.map(item => {
              const displayAmt = payCurrency === 'NGN' ? item.category.amount * conversionRate : item.category.amount;
              const displayPaid = payCurrency === 'NGN' ? item.paid * conversionRate : item.paid;
              const displayBal = payCurrency === 'NGN' ? item.balance * conversionRate : item.balance;

              return (
                <div 
                  key={item.category.id} 
                  className={`bg-white border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all ${
                    item.status === 'paid' ? 'border-emerald-250 bg-emerald-50/10' : 'border-natural-beige'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border ${
                        item.category.isCompulsory ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {item.category.isCompulsory ? 'Compulsory' : 'Optional'}
                      </span>
                      <span className={`text-[9.5px] font-extrabold rounded-full px-2 py-0.5 uppercase tracking-wide tracking-wider ${
                        item.status === 'paid' ? 'bg-emerald-50 text-emerald-800' : item.status === 'partial' ? 'bg-amber-55 text-amber-800' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-black text-natural-charcoal">{item.category.name}</h4>
                      <p className="text-[11px] text-natural-charcoal/65 mt-1 leading-relaxed">{item.category.description}</p>
                    </div>

                    <div className="pt-3 border-t border-natural-beige/40 text-xs grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Billed</span>
                        <span className="font-bold block text-natural-charcoal">
                          {payCurrency === 'NGN' ? `₦${displayAmt.toLocaleString()}` : `$${displayAmt}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Paid</span>
                        <span className="font-bold block text-emerald-600">
                          {payCurrency === 'NGN' ? `₦${displayPaid.toLocaleString()}` : `$${displayPaid}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Balance</span>
                        <span className="font-black block text-rose-600">
                          {payCurrency === 'NGN' ? `₦${displayBal.toLocaleString()}` : `$${displayBal}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.balance > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(item.category);
                        if (payCurrency === 'NGN') {
                          setPayAmountInput(String(item.balance * conversionRate));
                        } else {
                          setPayAmountInput(String(item.balance));
                        }
                        // scroll to pay section
                        document.getElementById('checkout-target-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2 bg-natural-light border hover:bg-[#E9E5D9] text-[#1A365D] font-bold uppercase tracking-wider text-[10.5px] rounded-lg transition-all cursor-pointer leading-none"
                    >
                      Process Fee
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Fulfill Outstanding balance check out block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-start" id="checkout-target-section">
            
            {/* Payment Stepper Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-natural-beige shadow-xs space-y-6">
              
              {/* Stepper Header */}
              <div className="border-b pb-4 border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-serif font-bold text-natural-charcoal text-sm">Tuition & Levies Settlement Escrow</h4>
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Step {checkoutStep} of 5</span>
                </div>
                
                {/* Visual Step Nodes */}
                <div className="flex items-center justify-between gap-1 text-[9px] font-mono tracking-tight font-extrabold text-slate-400 select-none">
                  <div className={`flex items-center gap-1 ${checkoutStep >= 1 ? 'text-indigo-600 font-black' : ''}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8.5px] border ${checkoutStep > 1 ? 'bg-[#3AC5A7] border-none text-white' : checkoutStep === 1 ? 'bg-indigo-605 border-indigo-600 text-indigo-600 border-2' : 'bg-slate-50'}`}>
                      {checkoutStep > 1 ? '✓' : '1'}
                    </span>
                    <span className="hidden sm:inline">Pupil</span>
                  </div>
                  <div className="h-[1px] bg-slate-205 flex-1 mx-1"></div>
                  <div className={`flex items-center gap-1 ${checkoutStep >= 2 ? 'text-indigo-600 font-black' : ''}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8.5px] border ${checkoutStep > 2 ? 'bg-[#3AC5A7] border-none text-white' : checkoutStep === 2 ? 'bg-indigo-605 border-indigo-600 text-indigo-600 border-2' : 'bg-slate-50'}`}>
                      {checkoutStep > 2 ? '✓' : '2'}
                    </span>
                    <span className="hidden sm:inline">Category</span>
                  </div>
                  <div className="h-[1px] bg-slate-205 flex-1 mx-1"></div>
                  <div className={`flex items-center gap-1 ${checkoutStep >= 3 ? 'text-indigo-600 font-black' : ''}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8.5px] border ${checkoutStep > 3 ? 'bg-[#3AC5A7] border-none text-white' : checkoutStep === 3 ? 'bg-indigo-605 border-indigo-600 text-indigo-600 border-2' : 'bg-slate-50'}`}>
                      {checkoutStep > 3 ? '✓' : '3'}
                    </span>
                    <span className="hidden sm:inline">Breakdown</span>
                  </div>
                  <div className="h-[1px] bg-slate-205 flex-1 mx-1"></div>
                  <div className={`flex items-center gap-1 ${checkoutStep >= 4 ? 'text-indigo-600 font-black' : ''}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8.5px] border ${checkoutStep > 4 ? 'bg-[#3AC5A7] border-none text-white' : checkoutStep === 4 ? 'bg-indigo-605 border-indigo-600 text-indigo-600 border-2' : 'bg-slate-50'}`}>
                      {checkoutStep > 4 ? '✓' : '4'}
                    </span>
                    <span className="hidden sm:inline">Method</span>
                  </div>
                  <div className="h-[1px] bg-slate-205 flex-1 mx-1"></div>
                  <div className={`flex items-center gap-1 ${checkoutStep >= 5 ? 'text-indigo-600 font-black' : ''}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8.5px] border ${checkoutStep === 5 ? 'bg-indigo-605 border-indigo-600 text-indigo-600 border-2' : 'bg-slate-50'}`}>
                      5
                    </span>
                    <span className="hidden sm:inline">Verify</span>
                  </div>
                </div>
              </div>

              {/* STEP 1: PUPIL SELECTION */}
              {checkoutStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h5 className="font-bold text-natural-charcoal text-xs">Select Linked Pupil</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Choose the particular student registered under your parenthood registry index.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {linkedStudents.map((stud) => (
                      <button
                        key={stud.id}
                        type="button"
                        onClick={() => {
                          setSelectedStudentId(stud.id);
                          setCheckoutStep(2);
                        }}
                        className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          selectedStudentId === stud.id
                            ? 'bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-600/10'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-10 h-10 bg-slate-100 flex items-center justify-center font-bold text-slate-700 rounded-full font-serif">
                          {stud.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-[#1A365D] block text-xs">{stud.name}</span>
                          <span className="font-mono text-[9px] text-[#A6802B] block uppercase tracking-wider">{stud.admissionNumber || 'ADM-88341'}</span>
                          <span className="p-0.5 px-1.5 bg-slate-150 text-slate-550 border rounded text-[8.5px] uppercase font-bold font-mono w-fit block">{stud.gradeLevel}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(2)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-wider rounded-xl cursor-pointer shadow-xs"
                    >
                      Classroom Selected → Proceed
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: FEE CATEGORY SELECTION */}
              {checkoutStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h5 className="font-bold text-natural-charcoal text-xs">Select Fee Category Block</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Displaying outstanding fee categories matching level {activeStudent.gradeLevel}</p>
                  </div>

                  <div className="space-y-3">
                    {billingItems.length === 0 ? (
                      <p className="text-xs italic text-slate-400">No active dues lists published for student's classroom grade level.</p>
                    ) : (
                      billingItems.map((bi) => (
                        <button
                          key={bi.category.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(bi.category);
                            if (payCurrency === 'NGN') {
                              setPayAmountInput(String(bi.balance * conversionRate));
                            } else {
                              setPayAmountInput(String(bi.balance));
                            }
                            setCheckoutStep(3);
                          }}
                          className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                            selectedCategory?.id === bi.category.id
                              ? 'bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-600/10'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="font-bold text-natural-charcoal block text-xs">{bi.category.name}</span>
                            <span className="text-[10px] text-slate-450 block font-medium">Standard Category Billed Amount: {payCurrency === 'NGN' ? `₦${(bi.category.amount * conversionRate).toLocaleString()}` : `$${bi.category.amount}`}</span>
                          </div>
                          <div className="text-right">
                            {bi.balance <= 0 ? (
                              <span className="p-1 px-2 bg-emerald-100 text-emerald-800 rounded font-bold text-[9px] uppercase">Paid Full</span>
                            ) : (
                              <div className="space-y-1 leading-none">
                                <span className="font-serif font-black text-[#1A365D] text-xs">
                                  {payCurrency === 'NGN' ? `₦${(bi.balance * conversionRate).toLocaleString()}` : `$${bi.balance}`}
                                </span>
                                <span className="text-[8.5px] text-[#A6802B] font-bold block">OUTSTANDING Balance</span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="px-4 py-2 bg-slate-100 text-slate-650 font-bold uppercase text-[10px] rounded-xl"
                    >
                      ← Back
                    </button>
                    {selectedCategory && (
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(3)}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-wider rounded-xl cursor-pointer"
                      >
                        Breakdown Summary →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: FINANCIAL BREAKDOWN ANALYSIS */}
              {checkoutStep === 3 && selectedCategory && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h5 className="font-bold text-natural-charcoal text-xs">Verify Settlement Valuation Dues</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">A complete financial check before issuing payment authorization.</p>
                  </div>

                  {/* Receipt slip breakdown style */}
                  <div className="bg-[#FAF9F5] p-5 border border-natural-beige/70 rounded-2xl text-xs space-y-3 font-sans relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full transform translate-x-8 -translate-y-8 select-none pointer-events-none" />
                    
                    <div className="pb-2 border-b border-dashed border-slate-205">
                      <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest leading-none">PRIMARY REGISTRAR DEBIT SLIP</span>
                      <h4 className="font-serif font-black text-[#1A365D] text-[13px] mt-1">Preston International Bursar Ledger</h4>
                    </div>

                    <div className="space-y-2 text-[11px] text-natural-charcoal/80 leading-relaxed font-sans">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Linked Pupils Registered:</span>
                        <span className="font-bold text-slate-805">{activeStudent.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Academic Grade / Classroom:</span>
                        <span className="font-semibold text-slate-805">{activeStudent.gradeLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Billed Invoice Charge:</span>
                        <span className="font-semibold text-slate-805">
                          {payCurrency === 'NGN' ? `₦${(selectedCategory.amount * conversionRate).toLocaleString()}.00` : `$${selectedCategory.amount.toLocaleString()}.00`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Approved Settlement Payment:</span>
                        <span className="font-semibold text-emerald-700">
                          {(() => {
                            const match = billingItems.find(bi => bi.category.id === selectedCategory.id);
                            const paidUSD = match ? match.paid : 0;
                            return payCurrency === 'NGN' ? `₦${(paidUSD * conversionRate).toLocaleString()}.00` : `$${paidUSD.toLocaleString()}.00`;
                          })()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-dashed border-slate-205 flex justify-between items-center bg-slate-900 rounded-xl p-3 text-white mt-1">
                      <div>
                        <span className="text-[8.5px] text-[#C29B38] font-bold block uppercase tracking-wide">Outstanding Balance Due</span>
                        <span className="text-[10px] text-slate-400 block font-medium">(Net value required for complete clearance)</span>
                      </div>
                      <span className="font-mono font-black text-rose-400 text-sm">
                        {(() => {
                          const match = billingItems.find(bi => bi.category.id === selectedCategory.id);
                          const balanceUSD = match ? match.balance : selectedCategory.amount;
                          return payCurrency === 'NGN' ? `₦${(balanceUSD * conversionRate).toLocaleString()}.00` : `$${balanceUSD.toLocaleString()}.00`;
                        })()}
                      </span>
                    </div>

                    {/* Currency selection switch */}
                    <div className="pt-3 border-t border-natural-beige/40 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-bold">Select Billing Currency Preference:</span>
                      <div className="flex gap-1.5 p-0.5 bg-slate-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setPayCurrency('NGN');
                            const match = billingItems.find(bi => bi.category.id === selectedCategory.id);
                            const bal = match ? match.balance : selectedCategory.amount;
                            setPayAmountInput(String(bal * conversionRate));
                          }}
                          className={`p-1 px-3.5 text-[9.5px] rounded-md font-bold transition-all ${payCurrency === 'NGN' ? 'bg-white text-indigo-705 shadow-2xs font-black' : 'text-slate-500'}`}
                        >
                          NGN (₦)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPayCurrency('USD');
                            const match = billingItems.find(bi => bi.category.id === selectedCategory.id);
                            const bal = match ? match.balance : selectedCategory.amount;
                            setPayAmountInput(String(bal));
                          }}
                          className={`p-1 px-3.5 text-[9.5px] rounded-md font-bold transition-all ${payCurrency === 'USD' ? 'bg-white text-indigo-705 shadow-2xs font-black' : 'text-slate-500'}`}
                        >
                          USD ($)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Custom Tender Amount */}
                  <div className="space-y-1.5 font-sans">
                    <label className="block text-[9px] font-bold uppercase text-slate-450 tracking-wider">Tender Custom Settlement Amount ({payCurrency === 'NGN' ? '₦' : '$'}) *</label>
                    <input
                      type="number"
                      required
                      value={payAmountInput}
                      onChange={(e) => setPayAmountInput(e.target.value)}
                      className="w-full px-4 py-2.5 border rounded-xl font-mono text-sm font-bold bg-slate-50 text-[#1A365D] outline-none focus:bg-white"
                      placeholder="0.00"
                    />
                    <p className="text-[10px] text-slate-400 italic">Preston support modular payments. You may adjust this value for installment payments or deposit allocations.</p>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(2)}
                      className="px-4 py-2 bg-slate-100 text-slate-650 font-bold uppercase text-[10px] rounded-xl"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const numericAmt = parseFloat(payAmountInput);
                        if (isNaN(numericAmt) || numericAmt <= 0) {
                          alert("Error: Please provide a valid settlement value to proceed.");
                          return;
                        }
                        setCheckoutStep(4);
                      }}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-wider rounded-xl cursor-pointer"
                    >
                      Next: Choose Method →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CHOOSE METHOD & BANK ACCOUNTS DISPLAY */}
              {checkoutStep === 4 && selectedCategory && (
                <div className="space-y-5 animate-fadeIn font-sans">
                  <div>
                    <h5 className="font-bold text-natural-charcoal text-xs">Payment Method & Bank Destination</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">Transmit wire/ledger allocations directly to any verified bank registry below.</p>
                  </div>

                  {/* STATIC SCHOOL PAYMENT BANK ACCOUNTS - REQUIRED BY THE USER */}
                  <div className="bg-[#FAF9F5] p-5 border border-dashed border-[#C29B38] rounded-2xl text-xs space-y-4 font-sans text-natural-charcoal animate-fadeIn">
                    <div className="flex items-center gap-1.5 border-b pb-2 border-slate-205">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      <span className="text-[10.5px] font-black text-slate-750 uppercase tracking-widest font-mono">🏫 Direct School Bank Allocation Accounts:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Zenith Bank */}
                      <div className="bg-white p-3.5 border border-natural-beige rounded-xl space-y-2">
                        <span className="text-[8px] font-mono tracking-wider font-extrabold uppercase text-[#C29B38] bg-amber-50 rounded px-1.5 py-0.5 inline-block">ACCOUNT OPTION 1</span>
                        <div className="space-y-1">
                          <p className="text-[9.5px] text-slate-400 uppercase font-bold tracking-tight">BANK DEPOSITARY</p>
                          <span className="font-serif font-black text-xs text-slate-905">ZENITH BANK</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9.5px] text-slate-400 uppercase font-bold tracking-tight">ACCOUNT NUMBER</p>
                          <span className="font-mono font-extrabold text-[#1A365D] block text-sm select-all">2083753057</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9.5px] text-slate-400 uppercase font-bold tracking-tight">BENEFICIARY HOLDER</p>
                          <span className="font-semibold text-slate-705 block text-[10.5px]">ADELANKE OMOLEYE</span>
                        </div>
                      </div>

                      {/* PalmPay */}
                      <div className="bg-white p-3.5 border border-natural-beige rounded-xl space-y-2">
                        <span className="text-[8px] font-mono tracking-wider font-extrabold uppercase text-[#C29B38] bg-amber-50 rounded px-1.5 py-0.5 inline-block">ACCOUNT OPTION 2</span>
                        <div className="space-y-1">
                          <p className="text-[9.5px] text-slate-400 uppercase font-bold tracking-tight">BANK DEPOSITARY</p>
                          <span className="font-serif font-black text-xs text-slate-905">PALMPAY</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9.5px] text-slate-400 uppercase font-bold tracking-tight">ACCOUNT NUMBER</p>
                          <span className="font-mono font-extrabold text-[#1A365D] block text-sm select-all">8032296504</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9.5px] text-slate-400 uppercase font-bold tracking-tight">BENEFICIARY HOLDER</p>
                          <span className="font-semibold text-slate-705 block text-[10.5px]">OMOLEYE ADELANKE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Choose Gateway Interface */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setPayMethod('Card')}
                      className={`p-4 rounded-xl border text-center font-bold tracking-wider leading-none flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        payMethod === 'Card'
                          ? 'bg-slate-900 border-slate-900 text-[#C29B38] ring-2 ring-indigo-600/10'
                          : 'bg-white border-slate-205 text-slate-505 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-[10px] uppercase font-bold">ATM Card (Paystack Co-Branded)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayMethod('Bank Transfer')}
                      className={`p-4 rounded-xl border text-center font-bold tracking-wider leading-none flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        payMethod === 'Bank Transfer'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                          : 'bg-white border-slate-205 text-slate-505 hover:bg-slate-50'
                      }`}
                    >
                      <Building className="w-5 h-5" />
                      <span className="text-[10px] uppercase font-bold">Direct Bank transfer Allocation</span>
                    </button>
                  </div>

                  {payMethod === 'Card' ? (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl text-slate-200 border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[9.5px] font-black text-[#09A5DB] tracking-widest uppercase">CO-BRANDED DEBIT PROCESSOR</span>
                        <CreditCard className="w-6 h-4 text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[8px] text-slate-400 uppercase font-mono">Tender Card Code Code</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono w-full focus:border-[#09A5DB] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="block text-[8px] text-slate-400 uppercase font-mono">Expiry Code</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono w-full focus:border-[#09A5DB] outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[8px] text-slate-400 uppercase font-mono">CVV Check</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono w-full focus:border-[#09A5DB] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 border border-dashed border-emerald-350 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-emerald-800 block">Bank Wire Instructions:</span>
                      <p className="text-emerald-700/85 text-[10.5px] leading-relaxed">
                        Please initiate a standard NGN bank transfer / cash deposit into Zenith Bank (2083753057) or PalmPay (8032296504) for the tender amount of <strong className="font-extrabold">{payCurrency === 'NGN' ? `₦${Number(payAmountInput).toLocaleString()}` : `$${Number(payAmountInput).toLocaleString()}`}</strong> specified. Make sure to retrieve your reference ID or payment receipt screenshot before proceeding to the next step.
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(3)}
                      className="px-4 py-2 bg-slate-100 text-slate-650 font-bold uppercase text-[10px] rounded-xl"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(5)}
                      className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-black uppercase text-[10px] tracking-wider rounded-xl cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                    >
                      Next: Upload Receipt Screenshot <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: DRAG-AND-DROP FILE UPLOAD & REF GENERATOR */}
              {checkoutStep === 5 && selectedCategory && (
                <div className="space-y-4 animate-fadeIn font-sans">
                  <div>
                    <h5 className="font-bold text-natural-charcoal text-xs">Upload Payment Settlement Receipt</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Please provide an image, screenshot or PDF document of the payment transaction invoice for admin verification audit.</p>
                  </div>

                  {/* DRAG AND DROP UPLOADER CONTAINER - RESPONSIVE TO GUIDELINES */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-indigo-600', 'bg-indigo-50/20');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-indigo-600', 'bg-indigo-50/20');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-indigo-600', 'bg-[#FAF9F5]');
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
                        if (!allowedTypes.includes(file.type)) {
                          alert('Error: Only JPG, JPEG, PNG, or PDF files are supported!');
                          return;
                        }
                        setReceiptImgName(file.name);
                        const reader = new FileReader();
                        reader.onload = (loadedEvent) => {
                          setReceiptImgFile(loadedEvent.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => document.getElementById('bursar-receipt-input-ref')?.click()}
                    className="border-2 border-dashed border-natural-beige/70 bg-[#FAF9F5] p-6 rounded-2xl text-center space-y-3 cursor-pointer hover:border-indigo-650/40 hover:bg-white transition-all duration-300"
                  >
                    <input
                      id="bursar-receipt-input-ref"
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
                          if (!allowedTypes.includes(file.type)) {
                            alert('Error: Only JPG, JPEG, PNG, or PDF files are supported!');
                            return;
                          }
                          setReceiptImgName(file.name);
                          const reader = new FileReader();
                          reader.onload = (loadedEvent) => {
                            setReceiptImgFile(loadedEvent.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs text-natural-charcoal font-black">Drag & Drop transaction confirmation receipt here</p>
                      <p className="text-[10px] text-slate-405 font-medium">Supported Formats: JPG, JPEG, PNG, or PDF (Max Size 5MB)</p>
                    </div>
                    <span className="p-1 px-3.5 bg-white text-slate-600 font-bold border border-slate-205 rounded-xl uppercase text-[9px] inline-block tracking-wider">
                      Or select item from device
                    </span>
                  </div>

                  {/* Thumbnail Preview rendering */}
                  {receiptImgFile && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between gap-4 animate-fadeIn font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center text-slate-400">
                          {receiptImgFile.startsWith('data:application/pdf') ? (
                            <FileText className="w-6 h-6 text-red-600" />
                          ) : (
                            <img src={receiptImgFile} alt="Preview thumbnail" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="space-y-0.5 truncate max-w-[180px]">
                          <span className="font-extrabold text-slate-750 block truncate">{receiptImgName || 'Confirmation Attachment'}</span>
                          <span className="text-[9px] uppercase font-bold text-indigo-700 block bg-indigo-50 px-1 py-0.5 rounded w-fit leading-none">Attachment loaded</span>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptImgFile(null);
                          setReceiptImgName('');
                        }}
                        className="p-1.5 hover:bg-rose-50 rounded text-rose-550 cursor-pointer"
                        title="Delete screenshot attachment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {!receiptImgFile && (
                    <div className="p-3 bg-rose-50 text-rose-800 text-[10px] font-bold rounded-lg border border-rose-150 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-550 shrink-0" />
                      <span>Warning: A receipt upload screenshot is MANDATORY to compile verification logs.</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(4)}
                      className="px-4 py-2 bg-slate-100 text-slate-650 font-bold uppercase text-[10px] rounded-xl font-mono"
                    >
                      ← Back
                    </button>
                    {receiptImgFile && (
                      <button
                        type="button"
                        onClick={() => {
                          const reference = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
                          const recNo = `REC-${Math.floor(10000 + Math.random() * 90000)}`;
                          const tenderValUSD = parseFloat(payAmountInput) / (payCurrency === 'NGN' ? conversionRate : 1);

                          addPaymentRecord({
                            studentId: activeStudent.id,
                            parentId: activeParent.id,
                            categoryId: selectedCategory.id,
                            categoryName: selectedCategory.name,
                            amountPaid: tenderValUSD,
                            date: new Date().toISOString().split('T')[0],
                            method: payMethod === 'Card' ? 'Card' : 'Bank Transfer',
                            referenceId: reference,
                            receiptNo: recNo,
                            currency: payCurrency,
                            status: 'Pending Verification',
                            receiptImage: receiptImgFile,
                            adminComment: ''
                          });

                          addNotification({
                            studentId: activeStudent.id,
                            parentId: activeParent.id,
                            title: `Payment Settlement Request Received`,
                            message: `Your payment of ${payCurrency === 'NGN' ? '₦' : '$'}${Number(payAmountInput).toLocaleString()} has been queued for verification with Transaction ID: ${reference}. Net credit updates will reflect once approved.`,
                            date: new Date().toISOString().split('T')[0]
                          });

                          alert(`Verification requested successfully! Transaction ID: ${reference}. Awaiting Admin Verification review approval.`);
                          
                          // Reset uploader and head back to pupil step
                          setReceiptImgFile(null);
                          setReceiptImgName('');
                          setPayAmountInput('');
                          setCheckoutStep(1);
                        }}
                        className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold uppercase text-[11px] tracking-wider rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-1.5 border-none"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Submit To Admin for Verification
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Payment History and List of Invoiced receipts */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#FAF9F5] p-6 rounded-3xl border border-natural-beige shadow-xs space-y-4 font-sans">
                <h4 className="font-serif font-black text-xs text-natural-charcoal flex items-center justify-between border-b pb-2 border-natural-beige/40">
                  <span>Past Transactions & Receipts</span>
                  <Printer className="w-4 h-4 text-slate-400" />
                </h4>

                <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                  {studentRecords.length === 0 ? (
                    <p className="text-xs text-natural-charcoal/40 italic">No past visual receipt documents compiled.</p>
                  ) : (
                    studentRecords.map(rec => {
                      const statusVal = rec.status || 'Approved'; // default legacy fallback to Approved
                      
                      return (
                        <div 
                          key={rec.id} 
                          className="bg-white p-4 rounded-2xl border border-natural-beige hover:border-slate-300 transition-all space-y-2.5 shadow-2xs"
                        >
                          <div className="flex items-start justify-between text-xs font-sans">
                            <div className="space-y-1">
                              <span className="font-black text-natural-charcoal block text-[12.5px] leading-tight">{rec.categoryName}</span>
                              <span className="font-mono text-[9px] text-[#A6802B] block">Doc Reference: {rec.receiptNo}</span>
                              <p className="text-[10px] text-slate-400">Date: {rec.date} • {rec.method}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-serif font-black text-[#1A365D] block text-[13px] leading-tight">
                                {rec.currency === 'NGN' ? `₦${(rec.amountPaid * conversionRate).toLocaleString()}` : `$${rec.amountPaid}`}
                              </span>
                              
                              {/* Status Badge Custom Styling */}
                              {statusVal === 'Approved' && (
                                <span className="p-0.5 px-1.5 bg-emerald-100 text-emerald-800 rounded text-[8px] font-bold uppercase block w-fit ml-auto mt-1 tracking-wider leading-none">
                                  ✓ Approved
                                </span>
                              )}
                              {statusVal === 'Pending Verification' && (
                                <span className="p-0.5 px-1.5 bg-amber-100 text-amber-800 rounded text-[8px] font-bold uppercase block w-fit ml-auto mt-1 tracking-wider outline-dashed outline-amber-300 animate-pulse leading-none">
                                  ⏳ Pending Verification
                                </span>
                              )}
                              {statusVal === 'Rejected' && (
                                <span className="p-0.5 px-1.5 bg-red-100 text-red-800 rounded text-[8px] font-bold uppercase block w-fit ml-auto mt-1 tracking-wider leading-none">
                                  ✕ Rejected
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rejection comment display block */}
                          {statusVal === 'Rejected' && rec.adminComment && (
                            <div className="bg-red-50 text-[10px] font-medium text-red-700/85 p-2 px-2.5 rounded-lg border border-red-150 truncate leading-relaxed">
                              <strong>Administrator Comment:</strong> "{rec.adminComment}"
                            </div>
                          )}

                          {/* Action options */}
                          <div className="pt-2 border-t border-slate-100 flex justify-end gap-1 font-mono">
                            {statusVal === 'Approved' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const rcObj = {
                                    receiptNo: rec.receiptNo,
                                    referenceId: rec.referenceId,
                                    date: rec.date,
                                    category: rec.categoryName,
                                    amtUSD: rec.amountPaid,
                                    studentName: activeStudent.name,
                                    studentClass: activeStudent.gradeLevel,
                                    studentAdm: activeStudent.admissionNumber || 'NUA-26-8812',
                                    currency: rec.currency,
                                    method: rec.method === 'Card' ? 'Paystack Checkout System' : 'Escrow Bank Wire Transfer'
                                  };
                                  setReceiptPopupObj(rcObj);
                                }}
                                className="text-[9.5px] font-bold text-natural-green flex items-center gap-1 hover:underline ml-auto cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5 text-natural-green shrink-0" /> Open Certified Receipt
                              </button>
                            ) : statusVal === 'Pending Verification' ? (
                              <span className="text-[8.5px] font-black text-slate-400 uppercase italic">
                                Receipt details hidden until verified
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(paymentCategories.find(c => c.id === rec.categoryId) || paymentCategories[0]);
                                  setPayAmountInput(String(rec.amountPaid * (payCurrency === 'NGN' ? conversionRate : 1)));
                                  setCheckoutStep(3);
                                  document.getElementById('checkout-target-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-[9px] font-bold text-slate-650 hover:underline cursor-pointer"
                              >
                                Adjust Settlement & Pay Again
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* SECTION E: ANNOUNCEMENTS / CALENDAR */}
      {activeTab === 'announcements' && (
        <div className="space-y-6 animate-fade-in" id="parent-announcements-viewport">
          <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs">
            <h3 className="text-lg font-serif font-bold text-natural-charcoal mb-1">NEW UNIQUE ACADEMY Announcements Calendar</h3>
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
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border ${typeColorStyle[ev.type] || 'bg-slate-100'}`}>
                        {ev.type}
                      </span>
                      <span className="text-[10px] text-natural-green/85 font-bold font-mono">{ev.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-natural-charcoal">{ev.title}</h4>
                    <p className="text-xs text-natural-charcoal/70 leading-relaxed">{ev.description}</p>
                  </div>

                  <div className="pt-4 border-t border-natural-beige/50 font-semibold text-natural-green/80 text-[11px] grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-wider">Timing</span>
                      <span className="text-natural-charcoal font-bold block">{ev.time || 'All Day'}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-wider">Location</span>
                      <span className="text-natural-charcoal font-bold block truncate">{ev.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION F: SCHOOL LETTERS / MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-6 animate-fade-in" id="parent-messages-viewport">
          <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex justify-between items-center">
            <div>
              <h3 className="text-lg font-serif font-bold text-natural-charcoal mb-1">Direct School Correspondence List</h3>
              <p className="text-natural-charcoal/70 text-xs mt-0.5">Formal feedback letters and advice issued by Principle Benson and active tutors.</p>
            </div>
            <Mail className="w-6 h-6 text-natural-clay" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parentMessages.map(msg => (
              <div key={msg.id} className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-3 relative">
                <div className="flex items-center gap-3 border-b pb-2 border-natural-beige/35 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-natural-light border border-natural-beige flex items-center justify-center text-[#1A365D] font-bold text-xs uppercase tracking-wide">
                      {msg.sender.split(' ')[0][0]}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">{msg.sender}</span>
                      <span className="block text-[8px] text-slate-400 uppercase tracking-wide font-semibold">FACULTY STAFF CHAIR</span>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-450">{msg.date}</span>
                </div>
                <p className="text-xs leading-relaxed text-natural-charcoal/80 pt-1">"{msg.text}"</p>
                
                {/* Visual signature overlay stamp */}
                <span className="absolute bottom-4 right-6 text-[8px] text-[#A6802B] font-serif uppercase tracking-widest font-black opacity-30 select-none">NEW UNIQUE OFFICE ENVELOPE</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER MODAL PAYSTACK SECURE GATEWAY CHECKOUT OVERLAY */}
      {isPaystackOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-[500] p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col font-sans">
            
            {/* Paystack Header */}
            <div className="bg-[#09A5DB] text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#09A5DB] font-bold text-sm">P</div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider leading-none">Paystack Checkout</h4>
                  <span className="text-[9px] text-white/80 tracking-wide font-medium">Secured by Paystack API Gateway</span>
                </div>
              </div>
              <button 
                onClick={() => setIsPaystackOpen(false)}
                className="text-white hover:text-slate-200 text-xs font-bold bg-white/15 px-2.5 py-1 rounded-lg border-none"
              >
                Cancel
              </button>
            </div>

            {/* Amount descriptor */}
            <div className="bg-slate-50 border-b border-slate-150/40 p-4 text-center select-none shrink-0">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-widest">AUTHORIZED INVOICE VALUE</span>
              <span className="text-2xl font-black text-slate-850 font-mono">
                {payCurrency === 'NGN' ? `₦${parseFloat(payAmountInput).toLocaleString()}.00` : `$${parseFloat(payAmountInput).toLocaleString()}.00`}
              </span>
              <span className="text-[9.5px] bg-sky-50 text-[#09A5DB] px-3 py-0.5 rounded-full font-bold inline-block mx-auto mt-1 uppercase">
                {activeStudent.email}
              </span>
            </div>

            {/* Paystack content box */}
            <div className="p-6 flex-1 min-h-[220px] flex flex-col justify-between overflow-y-auto">
              {paystackMessage && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 px-3 py-2 rounded-xl text-[10px] font-semibold mb-3 select-none">
                  {paystackMessage}
                </div>
              )}

              {paystackStep === 'details' && (
                <div className="space-y-4 flex-1">
                  <p className="text-[11px] text-slate-500 leading-normal">
                    This is a secure sandboxed session simulating a co-branded card transaction. Provide credentials below:
                  </p>
                  <div className="space-y-3.5 text-xs text-left">
                    <div className="space-y-1">
                      <label className="block text-[8.5px] font-bold text-slate-400 uppercase">Debit Card Code *</label>
                      <input 
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4488 9201 3241 8802"
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono focus:bg-white focus:border-[#09A5DB]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[8.5px] font-bold text-slate-400 uppercase">ExpiryDate *</label>
                        <input 
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="11/29"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-center focus:bg-white focus:border-[#09A5DB]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[8.5px] font-bold text-slate-400 uppercase">CVV Check *</label>
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
                    className="w-full py-3 bg-[#3AC5A7] hover:bg-[#3AC5A7]/95 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md mt-4 cursor-pointer"
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
                  <p className="text-[10.5px] text-slate-400 leading-normal max-w-xs mx-auto">Provide your confidential card PIN to authorize this escrow account transfer.</p>

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
                        setPaystackMessage('Enter a valid 4 digit card security PIN.');
                        return;
                      }
                      setPaystackMessage('');
                      setPaystackStep('otp');
                    }}
                    className="w-full py-3 bg-[#3AC5A7] hover:bg-[#3AC5A7]/95 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md mt-2 cursor-pointer"
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
                    Fill bypass sandbox OTP index <span className="font-bold text-emerald-600">5588</span> to finalize transaction.
                  </p>

                  <div className="flex justify-center gap-3 py-2">
                    <input 
                      type="text"
                      required
                      maxLength={4}
                      value={paystackOtp}
                      onChange={(e) => setPaystackOtp(e.target.value)}
                      placeholder="OTP"
                      className="w-28 text-center text-md font-bold font-mono border border-slate-300 px-3 py-2 rounded-xl focus:border-[#09A5DB] bg-slate-50"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (paystackOtp !== '5588') {
                        setPaystackMessage('The specified verification OTP code has expired or is incorrect. Try: 5588');
                        return;
                      }
                      setPaystackMessage('');
                      handlePaystackSettle();
                    }}
                    className="w-full py-3 bg-[#3AC5A7] hover:bg-[#3AC5A7]/95 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Authorize One-Time Token
                  </button>
                </div>
              )}

            </div>

            {/* Secured Badge footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[9px] text-[#3AC5A7] font-black uppercase select-none tracking-widest shrink-0">
              <Shield className="w-4 h-4 text-[#3AC5A7]" /> SECURED BY PAYSTACK CENTRAL API
            </div>

          </div>
        </div>
      )}

      {/* SECTION H: BEAUTIFUL DYNAMIC POPUP RENDER RECEIPT */}
      {receiptPopupObj && (
        <div className="fixed inset-0 bg-[#2D2A26]/85 backdrop-blur-xs flex items-center justify-center z-[600] p-4 text-natural-charcoal font-sans animate-fade-in">
          <div className="bg-[#FAF9F5] border-4 border-double border-[#C29B38] w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            
            {/* Watermark logo under block */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-0">
              <img 
                src="/src/assets/images/school_logo_1779413996009.png" 
                alt="Emblem watermark" 
                className="w-40 h-40 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Closer top right */}
            <button 
              onClick={() => setReceiptPopupObj(null)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 bg-white shadow-xs p-1.5 rounded-full border border-slate-150 cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="relative z-10 space-y-4">
              <div className="text-center pb-4 border-b border-dashed border-natural-beige/85 space-y-1">
                <div className="w-12 h-12 bg-white p-0.5 rounded-full flex items-center justify-center border border-natural-beige mx-auto mb-1.5 shadow-xs">
                  <img 
                    src="/src/assets/images/school_logo_1779413996009.png" 
                    alt="NUA emblem" 
                    className="w-10 h-10 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h5 className="font-serif font-extrabold tracking-wide text-xs">NEW UNIQUE ACADEMY</h5>
                <span className="text-[8px] text-natural-green font-bold uppercase tracking-widest block leading-none">Bursar Payment Receipt</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center bg-slate-100/60 p-2.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase">RECEIPT NO</span>
                    <span className="font-mono font-bold tracking-tight">{receiptPopupObj.receiptNo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-slate-400 block uppercase">TRANSACTION DATE</span>
                    <span className="font-bold font-mono">{receiptPopupObj.date}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11.5px] leading-relaxed">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student Registered:</span>
                    <span className="font-serif font-black">{receiptPopupObj.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class Block:</span>
                    <span className="font-bold">{receiptPopupObj.studentClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Admission Reference:</span>
                    <span className="font-mono font-semibold">{receiptPopupObj.studentAdm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Method Authorized:</span>
                    <span className="font-bold">{receiptPopupObj.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reference ID:</span>
                    <span className="font-mono text-[10px] truncate max-w-[180px] font-bold">{receiptPopupObj.referenceId}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-400">Status Clearance:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100 uppercase text-[9.5px]">Settle Clear Authorized</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-natural-beige/65 space-y-1.5">
                  <div className="flex justify-between items-center bg-slate-900 text-[#C29B38] p-3 rounded-xl font-sans mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FAF9F5]/70">Amount Paid:</span>
                    <span className="font-mono font-extrabold text-[#C29B38] text-base leading-none">
                      {receiptPopupObj.currency === 'NGN' 
                        ? `₦${(receiptPopupObj.amtUSD * conversionRate).toLocaleString()}.00` 
                        : `$${receiptPopupObj.amtUSD.toLocaleString()}.00`}
                    </span>
                  </div>
                </div>

                {/* QR Symbol and Principal stamp */}
                <div className="pt-4 flex items-center justify-between border-t border-natural-beige/35 font-sans">
                  <div className="flex items-center gap-2 select-none">
                    <QrCode className="w-10 h-10 text-slate-700 p-0.5 border" />
                    <span className="text-[7.5px] leading-tight text-slate-400 block max-w-[130px] uppercase">Scan QR code reference to verify status rc.9942084 on NUA server archives.</span>
                  </div>
                  
                  {/* Visual principal stamp seal */}
                  <div className="relative border-4 border-emerald-700 text-emerald-700 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded transform rotate-[-4deg] opacity-80 select-none scale-90 w-fit leading-tight font-mono">
                    APPROVED BURSAR SEC
                    <div className="absolute top-[1.5px] right-2 text-[5px]">NUA</div>
                  </div>
                </div>

              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 p-2.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#C29B38]" /> Print Receipt Info
                </button>
                <button
                  onClick={() => setReceiptPopupObj(null)}
                  className="p-2.5 px-4 bg-white border border-slate-205 hover:bg-slate-100 text-slate-700 rounded-xl font-bold uppercase tracking-wide cursor-pointer text-[10.5px]"
                >
                  Dismiss Receipt
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
