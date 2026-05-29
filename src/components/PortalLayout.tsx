import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  Users,
  LogOut,
  Calendar,
  LayoutDashboard,
  ClipboardCheck,
  FileSpreadsheet,
  Award,
  Zap,
  Activity,
  ChevronsUpDown,
  BookOpen,
  CreditCard
} from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function PortalLayout({ children, activeTab, setActiveTab, onLogout }: PortalLayoutProps) {
  const { currentRole, currentUserId, students, teachers, setRole } = useSchool();

  // Automatic logout on inactivity (15 Minutes)
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onLogout();
      }, 15 * 60 * 1000); // 15 Minutes
    };

    const trackedEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    trackedEvents.forEach(name => {
      document.addEventListener(name, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      trackedEvents.forEach(name => {
        document.removeEventListener(name, resetTimer);
      });
    };
  }, [onLogout]);

  // Find info about the current loaded user
  let currentProfileName = 'Administrator';
  let currentProfileSub = 'Main Campus Hub';
  let currentAvatarUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';

  if (currentRole === 'student') {
    const s = students.find((x) => x.id === currentUserId) || students[0];
    if (s) {
      currentProfileName = s.name;
      currentProfileSub = `${s.gradeLevel} Student`;
      currentAvatarUrl = s.avatar || currentAvatarUrl;
    }
  } else if (currentRole === 'parent') {
    const s = students.find((x) => x.id === currentUserId) || students[0];
    if (s) {
      currentProfileName = s.guardianName || 'Robert Alvarez';
      currentProfileSub = `Guardian of ${s.name.split(' ')[0]}`;
      currentAvatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
    }
  } else if (currentRole === 'teacher') {
    const t = teachers.find((x) => x.id === currentUserId) || teachers[0];
    if (t) {
      currentProfileName = t.name;
      currentProfileSub = `${t.department} Instruct`;
      currentAvatarUrl = t.avatar || currentAvatarUrl;
    }
  }

  // Sidebar link categories based on permissions
  const studentNav = [
    { id: 'dash', label: 'Overview', icon: LayoutDashboard },
    { id: 'grades', label: 'My Grades & Analytics', icon: Award },
    { id: 'quiz', label: 'Quiz Center', icon: Zap },
    { id: 'att', label: 'Attendance logs', icon: ClipboardCheck },
    { id: 'tuition', label: 'School Fees Ledger', icon: CreditCard },
    { id: 'cal', label: 'Event Calendar', icon: Calendar },
    { id: 'profile', label: 'Profile & Security', icon: Users }
  ];

  const teacherNav = [
    { id: 'dash', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Assigned Classes', icon: BookOpen },
    { id: 'grades', label: 'Grading Sheets', icon: FileSpreadsheet },
    { id: 'att', label: 'Log Attendance', icon: ClipboardCheck },
    { id: 'quiz', label: 'Configure Quizzes', icon: Zap }
  ];

  const adminNav = [
    { id: 'dash', label: 'Admin Summary', icon: LayoutDashboard },
    { id: 'users', label: 'Student & Staff Roster', icon: Users },
    { id: 'courses', label: 'Manage Classrooms', icon: BookOpen },
    { id: 'events', label: 'Calendar Scheduling', icon: Calendar },
    { id: 'quiz', label: 'CBT & Exam Manager', icon: Zap },
    { id: 'billing', label: 'School Fee Config', icon: CreditCard }
  ];

  const currentNav = (currentRole === 'student' || currentRole === 'parent') ? studentNav : currentRole === 'teacher' ? teacherNav : adminNav;

  return (
    <div className="min-h-screen bg-natural-bg flex flex-col md:flex-row text-natural-charcoal font-sans">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-natural-sidebar text-natural-charcoal flex flex-col shrink-0 border-r border-natural-beige">
        {/* Brand Header */}
        <div className="p-6 h-20 flex items-center justify-between border-b border-natural-beige shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-0.5 bg-white border border-natural-beige rounded-lg shadow-xs shrink-0 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="New Unique Academy Logo" 
                className="w-9 h-9 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-sm font-serif font-black text-natural-charcoal uppercase tracking-wide leading-none">NEW UNIQUE ACADEMY</span>
              <span className="text-[9px] block text-natural-green font-bold tracking-wider leading-none uppercase mt-0.5">School Hub</span>
            </div>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="p-4 bg-natural-light/60 border-b border-natural-beige shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={currentAvatarUrl}
              alt="Avatar Profile"
              className="w-10 h-10 rounded-full border border-natural-beige object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <span className="text-sm font-bold text-natural-charcoal block truncate">{currentProfileName}</span>
              <span className="text-[10px] text-natural-green font-semibold block uppercase tracking-wider truncate">{currentProfileSub}</span>
            </div>
          </div>
        </div>

        {/* Navigation Core Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {currentNav.map((link) => {
            const Icon = link.icon;
            const active = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full text-natural-charcoal/85 hover:bg-natural-beige/60 hover:text-natural-charcoal flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer rounded-xl transition-all ${
                  active ? 'bg-natural-green! text-white shadow-sm' : ''
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${active ? 'scale-110 text-white' : 'text-natural-green'}`} />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Primary Swapper & Log Out */}
        <div className="p-4 bg-natural-sidebar border-t border-natural-beige space-y-3 shrink-0">
          {/* Quick Demo Swapper Widget */}
          <div className="bg-natural-beige/40 border border-natural-beige rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-natural-green uppercase tracking-wider">Demo Sandbox Role</span>
              <div className="w-1.5 h-1.5 rounded-full bg-natural-clay shadow shadow-natural-clay/40 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {/* Swapper triggers */}
              <div className="text-[10px] font-bold text-natural-charcoal flex flex-col gap-1 select-none">
                <span className="text-[8px] text-natural-green/80 pt-1 font-extrabold uppercase">STUDENTS:</span>
                <div className="flex flex-wrap gap-1">
                  {students.slice(0, 2).map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setRole('student', st.id);
                        setActiveTab('dash');
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border text-left cursor-pointer transition-all ${
                        currentRole === 'student' && currentUserId === st.id
                          ? 'bg-natural-green border-natural-green text-white font-bold'
                          : 'bg-natural-light border-natural-beige hover:border-natural-green/40 text-natural-charcoal'
                      }`}
                    >
                      {st.name.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <span className="text-[8px] text-natural-green/80 pt-1 font-extrabold uppercase">PARENTS:</span>
                <div className="flex flex-wrap gap-1 mb-1">
                  <button
                    onClick={() => {
                      setRole('parent', 's_01');
                      setActiveTab('dash');
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-semibold border text-left cursor-pointer transition-all ${
                      currentRole === 'parent'
                        ? 'bg-natural-green border-natural-green text-white font-bold'
                        : 'bg-natural-light border-natural-beige hover:border-natural-green/40 text-[#252525]'
                    }`}
                  >
                    Robert (Julian's Guardian)
                  </button>
                </div>

                <span className="text-[8px] text-natural-green/80 pt-1 font-extrabold uppercase">INSTRUCTORS:</span>
                <div className="flex flex-wrap gap-1">
                  {teachers.slice(0, 2).map((tc) => (
                    <button
                      key={tc.id}
                      onClick={() => {
                        setRole('teacher', tc.id);
                        setActiveTab('dash');
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border text-left cursor-pointer transition-all ${
                        currentRole === 'teacher' && currentUserId === tc.id
                          ? 'bg-natural-green border-natural-green text-white font-bold'
                          : 'bg-natural-light border-natural-beige hover:border-natural-green/40 text-natural-charcoal'
                      }`}
                    >
                      {tc.name.split(' ')[1] || tc.name}
                    </button>
                  ))}
                </div>

                <span className="text-[8px] text-natural-green/80 pt-1 font-extrabold uppercase">ADMINISTRATOR:</span>
                <button
                  onClick={() => {
                    setRole('admin', 'admin');
                    setActiveTab('dash');
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-semibold border text-center cursor-pointer transition-all ${
                    currentRole === 'admin'
                      ? 'bg-natural-clay border-natural-clay text-white font-bold'
                      : 'bg-natural-light border-natural-beige hover:border-natural-green/40 text-natural-charcoal'
                  }`}
                >
                  Universal Admin
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            id="side-logout-button"
            className="w-full text-left text-xs font-bold uppercase tracking-wider text-natural-charcoal hover:bg-natural-beige/40 hover:text-natural-charcoal flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-natural-clay" />
            Logout to Web
          </button>
        </div>
      </aside>

      {/* Main Container Area */}
      <main className="flex-1 flex flex-col min-w-0 font-sans" id="portal-inner-container">
        {/* Top Navbar */}
        <header className="h-20 bg-natural-bg border-b border-natural-beige px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div>
            <span className="text-xs text-natural-green font-bold block uppercase tracking-widest leading-none mb-1">{currentProfileSub} Overview</span>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-natural-charcoal truncate">Welcome Back, {currentProfileName.split(' ')[0]}</h2>
              <span className={`px-2 py-0.5 text-[8.5px] font-bold rounded uppercase tracking-wider ${
                currentRole === 'admin' 
                  ? 'bg-natural-clay/10 text-natural-clay border border-natural-clay/35' 
                  : currentRole === 'teacher' 
                  ? 'bg-natural-green/10 text-natural-green border border-natural-green/35' 
                  : 'bg-natural-clay/15 text-natural-clay border border-natural-clay/35'
              }`}>
                {currentRole} Access
              </span>
            </div>
          </div>

          {/* Quick status counters (Attendance / Events / Active) */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-sans">
            <div className="flex items-center gap-2 bg-natural-light px-3.5 py-1.5 rounded-xl border border-natural-beige text-natural-green font-semibold">
              <Activity className="w-3.5 h-3.5 text-natural-green shrink-0 select-none animate-pulse" />
              <span>All Systems Functional</span>
            </div>
          </div>
        </header>

        {/* Scrollable Children Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-natural-bg">
          {children}
        </div>
      </main>
    </div>
  );
}
