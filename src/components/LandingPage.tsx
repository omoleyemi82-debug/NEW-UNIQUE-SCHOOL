import React, { useState, useEffect } from 'react';
import AboutUsPage from './AboutUsPage';
import AcademicsPage from './AcademicsPage';
import EventsPage from './EventsPage';
import ContactUsPage from './ContactUsPage';
import PortalLayout from './PortalLayout';
import StudentPortal from './StudentPortal';
import StaffPortal from './StaffPortal';
import AdminPortal from './AdminPortal';
import ParentPortal from './ParentPortal';
import ProfilePage from './ProfilePage';
import { useSchool } from '../context/SchoolContext';
import { 
  BookOpen, 
  Calendar, 
  HelpCircle, 
  GraduationCap, 
  ChevronRight, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Mail,
  CheckCircle2, 
  ShieldAlert, 
  X,
  Building,
  Image,
  Search,
  Award,
  ShieldCheck,
  Layers,
  Users,
  Menu,
  Phone,
  MapPin,
  Bell,
  Sparkles,
  Info,
  Clock,
  Unlock,
  Key
} from 'lucide-react';

export default function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  const { 
    events, 
    teachers, 
    setRole, 
    students, 
    parents,
    admins,
    currentRole, 
    currentUserId,
    schoolName,
    notifications
  } = useSchool();
  
  // Active Tab: 'home' | 'about' | 'events' | 'gallery' | 'contact' | 'portal' | 'profile'
  const [currentTab, setCurrentTab] = useState<'home' | 'about' | 'events' | 'gallery' | 'contact' | 'portal' | 'profile'>(
    'home'
  );

  // Active subtab inside member portal
  const [activePortalTab, setActivePortalTab] = useState<string>('dash');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState<'requirements' | 'gallery' | 'faq' | 'support' | null>(null);

  // Local state for contact inquiry
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    if (currentRole === 'guest' && currentTab === 'portal') {
      setCurrentTab('home');
    }
  }, [currentRole]);

  // Feed next 3 events sorted by date
  const upcomingEvents = [...events]
    .filter(e => new Date(e.date) >= new Date(new Date().setDate(new Date().getDate() - 1)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactName('');
        setContactEmail('');
        setContactMsg('');
      }, 3500);
    }
  };

  if (currentTab === 'portal' && currentRole !== 'guest') {
    return (
      <PortalLayout
        activeTab={activePortalTab}
        setActiveTab={setActivePortalTab}
        onLogout={() => {
          setRole('guest', 'guest');
          setCurrentTab('home');
        }}
        onBackToWebsite={() => {
          setCurrentTab('home');
        }}
      >
        {currentRole === 'student' && <StudentPortal activeTab={activePortalTab} />}
        {currentRole === 'parent' && <ParentPortal activeTab={activePortalTab} />}
        {currentRole === 'teacher' && <StaffPortal activeTab={activePortalTab} />}
        {currentRole === 'admin' && <AdminPortal activeTab={activePortalTab} />}
      </PortalLayout>
    );
  }

  // Admin announcement / news fallback if list of announcements is thin
  const demoAnnouncements = [
    {
      id: 'news_1',
      title: 'First-Term Regional Exit Syllabus Review Complete',
      message: 'Staff and students can log in to view the syllabus updates for science practical models on their respective streams dashboard.',
      date: '2026-05-15'
    },
    {
      id: 'news_2',
      title: 'Academy Multi-purpose Science Exhibition Date Set',
      message: 'All secondary science students are required to register their practical layout drafts by Friday. Senior instructors will verify guidelines.',
      date: '2026-05-10'
    }
  ];

  const adminNewsList = notifications.length > 0 ? notifications.slice(0, 3) : demoAnnouncements;

  return (
    <div className="min-h-screen bg-neutral-bg text-[#f1f5f9] font-sans selection:bg-sky-500/20 antialiased relative landing-page-wrapper">
      
      {/* Absolute faint background watermark for the landing view */}
      <div className="absolute top-20 right-0 left-0 bottom-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] opacity-[0.015] flex items-center justify-center">
          <img src="/logo.png" className="w-[600px] h-[600px] object-contain invert" alt="Watermark logo" referrerPolicy="no-referrer" />
        </div>
      </div>

      {/* Modern, calm, professional sticky header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E9EF] shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <button 
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }} 
            className="flex items-center gap-3 active:scale-95 transition-transform bg-transparent border-none text-left cursor-pointer outline-none group"
            id="header-brand-logo"
          >
            <div className="p-2 bg-[#F5F7FA] border border-[#E6E9EF] rounded-xl shrink-0 flex items-center justify-center group-hover:border-[#1E4D8F]/40 transition-colors">
              <img 
                src="/logo.png" 
                alt="School Crest Logo" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-base font-sans font-black tracking-widest text-[#0B1F3B] uppercase block leading-none">NEW UNIQUE ACADEMY</span>
              <span className="text-[9px] block text-[#1E4D8F] font-black tracking-widest uppercase mt-1 leading-none">Secured Secondary Institution</span>
            </div>
          </button>

          {/* New Navigation Menu Items */}
          <nav className="hidden xl:flex items-center gap-5 text-[11px] font-bold uppercase tracking-widest text-[#AAB4C0]">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer outline-none bg-transparent ${
                currentTab === 'home' 
                  ? 'text-[#1E4D8F] border-[#1E4D8F]' 
                  : 'border-transparent text-[#616D7E] hover:text-[#1E4D8F]'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentTab('about')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer outline-none bg-transparent ${
                currentTab === 'about' ? 'text-[#1E4D8F] border-[#1E4D8F]' : 'border-transparent text-[#616D7E] hover:text-[#1E4D8F]'
              }`}
            >
              About School
            </button>
            <button 
              onClick={() => setCurrentTab('events')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer outline-none bg-transparent ${
                currentTab === 'events' ? 'text-[#1E4D8F] border-[#1E4D8F]' : 'border-transparent text-[#616D7E] hover:text-[#1E4D8F]'
              }`}
            >
              Events & News
            </button>
            <button 
              onClick={() => setCurrentTab('gallery')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer outline-none bg-transparent ${
                currentTab === 'gallery' ? 'text-[#1E4D8F] border-[#1E4D8F]' : 'border-transparent text-[#616D7E] hover:text-[#1E4D8F]'
              }`}
            >
              Gallery
            </button>
            <button 
              onClick={() => setCurrentTab('contact')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer outline-none bg-transparent ${
                currentTab === 'contact' ? 'text-[#1E4D8F] border-[#1E4D8F]' : 'border-transparent text-[#616D7E] hover:text-[#1E4D8F]'
              }`}
            >
              Contact Us
            </button>
            
            {/* My Dashboard Navigation option */}
            <button 
              onClick={() => setCurrentTab('portal')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer outline-none bg-transparent ${
                currentTab === 'portal' ? 'text-[#1E4D8F] border-[#1E4D8F]' : 'border-transparent text-[#616D7E] hover:text-[#1E4D8F]'
              }`}
            >
              My Dashboard
            </button>
            
            {/* Profile page option */}
            <button 
              onClick={() => setCurrentTab('profile')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer outline-none bg-transparent ${
                currentTab === 'profile' ? 'text-[#1E4D8F] border-[#1E4D8F]' : 'border-transparent text-[#616D7E] hover:text-[#1E4D8F]'
              }`}
            >
              Profile
            </button>

            {/* Logout button */}
            <button 
              onClick={() => {
                setRole('guest', 'guest');
                setCurrentTab('home');
              }}
              className="pb-1 px-1 transition-all border-b-2 border-transparent text-[#E74C3C] hover:text-[#C0392B] cursor-pointer outline-none bg-transparent"
            >
              Logout
            </button>
          </nav>

          {/* Quick Dashboard Action Shortcut Button (Fallback or Guest) */}
          <div className="flex items-center gap-2.5">
            {currentRole === 'guest' ? (
              <button
                onClick={onLoginClick}
                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[#0B1F3B] bg-white border border-[#E6E9EF] hover:border-[#1E4D8F]/30 active:scale-95 transition-all rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                id="header-login-btn"
              >
                <ShieldCheck className="w-4 h-4 text-[#1E4D8F]" /> Portal Login
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('portal')}
                  className="px-4 py-2 bg-gradient-to-r from-sky-600 to-[#1E4D8F] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 border border-sky-450/15"
                >
                  <Unlock className="w-3 text-white" /> Open Portal
                </button>
              </div>
            )}

            {/* Hamburger Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 bg-[#F5F7FA] rounded-xl text-[#1E4D8F] border border-[#E6E9EF]"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#E6E9EF] p-4 bg-white grid grid-cols-2 gap-2 animate-fade-in relative z-50">
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('home'); }}
              className={`p-3 rounded-xl text-xs font-bold uppercase text-center cursor-pointer ${
                currentTab === 'home' ? 'bg-[#1E4D8FA3]/10 text-[#1E4D8F]' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('about'); }}
              className={`p-3 rounded-xl text-xs font-bold uppercase text-center cursor-pointer ${
                currentTab === 'about' ? 'bg-[#1E4D8FA3]/10 text-[#1E4D8F]' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              About School
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('events'); }}
              className={`p-3 rounded-xl text-xs font-bold uppercase text-center cursor-pointer ${
                currentTab === 'events' ? 'bg-[#1E4D8FA3]/10 text-[#1E4D8F]' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              Events & News
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('gallery'); }}
              className={`p-3 rounded-xl text-xs font-bold uppercase text-center cursor-pointer ${
                currentTab === 'gallery' ? 'bg-[#1E4D8FA3]/10 text-[#1E4D8F]' : 'hover:bg-slate-55 text-slate-600'
              }`}
            >
              Gallery
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('contact'); }}
              className={`p-3 rounded-xl text-xs font-bold uppercase text-center cursor-pointer ${
                currentTab === 'contact' ? 'bg-[#1E4D8FA3]/10 text-[#1E4D8F]' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              Contact Us
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('portal'); }}
              className={`p-3 rounded-xl text-xs font-bold uppercase text-center cursor-pointer ${
                currentTab === 'portal' ? 'bg-[#1E4D8FA3]/10 text-[#1E4D8F]' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              My Dashboard
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('profile'); }}
              className={`p-3 rounded-xl text-xs font-bold uppercase text-center cursor-pointer col-span-2 ${
                currentTab === 'profile' ? 'bg-[#1E4D8FA3]/10 text-[#1E4D8F]' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              My Profile
            </button>
            <button 
              onClick={() => { 
                setMobileMenuOpen(false); 
                setRole('guest', 'guest');
                setCurrentTab('home');
              }}
              className="p-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs uppercase col-span-2 text-center cursor-pointer"
            >
              Logout Securely
            </button>
          </div>
        )}
      </header>

      {/* Hero Block (Calm visual dark blue design) */}
      {currentTab === 'home' && (
        <section className="relative overflow-hidden py-16 lg:py-24 hero-gradient-box border-b border-[#163056]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(77,163,255,0.08),transparent)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1F3B]/60 border border-[#1E4D8F]/30 text-[#4DA3FF] text-[10px] font-bold uppercase tracking-widest leading-none">
                <Star className="w-3.5 h-3.5 fill-[#F1C40F] text-[#F1C40F]" /> State Approved Secondary School
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black tracking-tight leading-[1.1] text-white">
                Academic Excellence Is <span className="text-[#4DA3FF]">Our Pride</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
                NEW UNIQUE ACADEMY offers a realistic secondary learning experience. Governed by core discipline, state-accredited examinations, and clear subject schedules inside Science, Art, and Commerce specialization divisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onLoginClick}
                  className="px-6 py-3.5 bg-[#F1C40F] hover:bg-[#D4AF37] text-[#0B1F3B] font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0B1F3B]" /> Access Management Portal
                </button>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="px-6 py-3.5 bg-[#0B1F3B]/80 border border-[#E6E9EF]/30 hover:border-[#4DA3FF] text-white font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer leading-none"
                >
                  Explore About School
                </button>
              </div>
            </div>

            {/* Campus Front Representation */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative mx-auto w-[360px] h-[360px]">
                <div className="absolute -top-3 -left-3 w-full h-full rounded-3xl bg-[#4DA3FF]/10 border border-[#4DA3FF]/10 transform rotate-2"></div>
                <img
                  src="/front_page.png"
                  alt="NEW UNIQUE ACADEMY Campus Workstations"
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl border border-[#1E4D8F]/35"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400';
                  }}
                />
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 
        MEMBER BULLETIN CONSOLE BOARD 
        Redirects users after successful login with custom role-specific content
      */}
      {currentTab === 'home' && currentRole !== 'guest' && (
        <section className="py-12 bg-[#F5F7FA] border-y border-[#E6E9EF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-[#E6E9EF] rounded-3xl p-6 sm:p-8 shadow-sm text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                
                {/* User Greeting Block */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={
                        currentRole === 'student' 
                          ? (students.find(s => s.id === currentUserId)?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100')
                          : currentRole === 'teacher'
                          ? (teachers.find(t => t.id === currentUserId)?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100')
                          : currentRole === 'parent'
                          ? (parents?.find(p => p.id === currentUserId)?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100')
                          : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100'
                      } 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-2xl object-cover border border-[#1E4D8F]/25 shadow-sm"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-[#1E4D8F] text-white rounded-lg border border-white">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#1E4D8F] block mb-0.5">Logged In Portal Account</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B1F3B]">
                      Welcome back, {
                        currentRole === 'student' 
                          ? (students.find(s => s.id === currentUserId)?.name?.split(' ')[0] || 'Academic')
                          : currentRole === 'teacher'
                          ? (teachers.find(t => t.id === currentUserId)?.name?.split(' ')[0] || 'Educator')
                          : currentRole === 'parent'
                          ? (parents?.find(p => p.id === currentUserId)?.name?.split(' ')[0] || 'Guardian')
                          : 'System Admin'
                      }!
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xl mt-1 leading-normal">
                      {currentRole === 'student' && "Prepare for upcoming CBT testing modules, check Continuous Assessment grades, or download reports."}
                      {currentRole === 'teacher' && "Manage test scores, assignments, record physical attendance, and submit theory exams."}
                      {currentRole === 'parent' && "Track your child's terminal academic progress, behavior logs, and clear pending school invoices."}
                      {currentRole === 'admin' && "Compile global term indexes, assign class teachers, and authorize results for publications."}
                    </p>
                  </div>
                </div>

                {/* Open Dashboard Button */}
                <button
                  onClick={() => setCurrentTab('portal')}
                  className="px-6 py-4 bg-gradient-to-r from-sky-600 to-[#1E4D8F] hover:from-sky-500 hover:to-[#1E4D8F]/95 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer border border-sky-400/25 shrink-0 self-stretch md:self-auto justify-center hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Unlock className="w-4 h-4 text-white" /> Open My Dashboard Portal
                </button>

              </div>

              <div className="h-px bg-slate-150 my-6" />

              {/* Quick Metrics grid by role */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {currentRole === 'student' && (() => {
                  const sRec = students.find(s => s.id === currentUserId);
                  return (
                    <>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Grade Stream</span>
                        <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{sRec?.gradeLevel || 'Senior Secondary'}</span>
                      </div>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Class Specialization</span>
                        <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{sRec?.department || 'General'}</span>
                      </div>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">School Fees Status</span>
                        <span className={`text-xs font-bold mt-1 block truncate ${sRec?.feesCleared ? 'text-emerald-600' : 'text-[#E74C3C]'}`}>
                          {sRec?.feesCleared ? 'Fully Paid' : 'Outstanding Settle'}
                        </span>
                      </div>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Roster Rank Progress</span>
                        <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{sRec?.positionInClass ? `Rank Position: #${sRec.positionInClass}` : 'Awaiting Computation'}</span>
                      </div>
                    </>
                  );
                })()}

                {currentRole === 'teacher' && (() => {
                  const tRec = teachers.find(t => t.id === currentUserId);
                  return (
                    <>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Faculty Specialty</span>
                        <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{tRec?.specialty || 'General Science'}</span>
                      </div>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Qualifications</span>
                        <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{tRec?.qualification || 'B.Sc Physics'}</span>
                      </div>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Assigned Classes</span>
                        <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{tRec?.classes?.join(', ') || 'Senior Streams'}</span>
                      </div>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Faculty Seniority</span>
                        <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{tRec?.yearsOfExperience || 3} Years Active</span>
                      </div>
                    </>
                  );
                })()}

                {currentRole === 'parent' && (() => {
                  const pRec = parents?.find(p => p.id === currentUserId);
                  const sRec = students.find(s => s.guardianPhone === pRec?.phone) || students[0];
                  return (
                    <>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Registered Ward Student</span>
                        <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{sRec?.name || 'Julian Alvarez'}</span>
                      </div>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Ward Stream Class</span>
                        <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{sRec?.gradeLevel || 'SS1'}</span>
                      </div>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Academic Standing</span>
                        <span className="text-xs font-bold text-emerald-600 mt-1 block truncate">74.2% Class Average</span>
                      </div>
                      <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Invoice Deficit balance</span>
                        <span className={`text-xs font-bold mt-1 block truncate ${sRec?.feesCleared ? 'text-emerald-600' : 'text-[#E74C3B]'}`}>
                          {sRec?.feesCleared ? '₦0.00 (Cleared)' : '₦45,000.00'}
                        </span>
                      </div>
                    </>
                  );
                })()}

                {currentRole === 'admin' && (
                  <>
                    <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Active Student Licenses</span>
                      <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{students.length} Accounts</span>
                    </div>
                    <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Certified Core Instructors</span>
                      <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{teachers.length} Faculty Members</span>
                    </div>
                    <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Term Specializations</span>
                      <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">18 Core Curriculums</span>
                    </div>
                    <div className="p-4 bg-[#F5F7FA] border border-[#E6E9EF] rounded-2xl">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Approval Registers</span>
                      <span className="text-xs font-bold text-[#0B1F3B] mt-1 block truncate">{notifications.length || 2} Updates Live</span>
                    </div>
                  </>
                )}

              </div>
              
              <div className="mt-5 flex justify-end gap-3 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Database Verified Session</span>
                <span>•</span>
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="hover:text-[#1E4D8F] font-bold underline bg-transparent border-none cursor-pointer p-0"
                >
                  Manage Security Profile Settings & Password →
                </button>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Simple Home About Us Segment */}
      {currentTab === 'home' && (
        <section className="py-16 bg-slate-900/40 border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
            <div className="space-y-5">
              <span className="text-[10px] text-sky-400 uppercase font-bold tracking-widest block leading-none">Who We Are</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">Our 10-Year Dedicated Secondary History</h2>
              <div className="h-1 w-12 bg-sky-500 rounded-full"></div>
              <p className="text-xs text-slate-350 leading-relaxed">
                Founded in 2016, NEW UNIQUE ACADEMY was built with a clear, straightforward goal: providing strict academic preparation, classroom structure, and practical subject study models for young secondary students.
              </p>
              <p className="text-xs text-slate-350 leading-relaxed">
                We believe in straightforward classroom lessons, certified instructor lists, and actual learning benchmarks to prepare students for national exit exams.
              </p>
              <button 
                onClick={() => setCurrentTab('about')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 underline transition-all bg-transparent border-none cursor-pointer p-0"
              >
                Read our full history & pillars <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillars Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl w-fit">
                  <Layers className="w-5 h-5 text-sky-450" />
                </div>
                <h4 className="font-serif font-bold text-sm text-white mt-4">Science Specialty</h4>
                <p className="text-[11px] text-slate-400 mt-1">Structured Chemistry, Physics, Biology, and mathematical analysis.</p>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl w-fit">
                  <BookOpen className="w-5 h-5 text-sky-450" />
                </div>
                <h4 className="font-serif font-bold text-sm text-white mt-4">Art Specialty</h4>
                <p className="text-[11px] text-slate-400 mt-1">Literature-in-English, Government, History, and civic responsibilities.</p>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl w-fit">
                  <GraduationCap className="w-5 h-5 text-sky-450" />
                </div>
                <h4 className="font-serif font-bold text-sm text-white mt-4">Commerce Specialty</h4>
                <p className="text-[11px] text-slate-400 mt-1">Bookkeeping accounts, general economic analysis, and business practice.</p>
              </div>
              <div className="p-5 bg-sky-500/[0.04] border border-sky-500/20 rounded-2xl flex flex-col justify-between">
                <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl w-fit">
                  <Users className="w-5 h-5 text-sky-400" />
                </div>
                <h4 className="font-serif font-bold text-sm text-white mt-4">Secure Management</h4>
                <p className="text-[11px] text-slate-400 mt-1">Admin-guided records databases, course schedules, and payment ledger files.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LATEST NEWS BOARD - STRICTLY ANNOUNCEMENTS REGISTERED BY ADMINISTRATOR */}
      {currentTab === 'home' && (
        <section className="py-16 bg-slate-950 border-b border-slate-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_50%,rgba(14,165,233,0.03),transparent)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10 text-left">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-900 pb-5">
              <div>
                <span className="text-[10px] text-sky-400 uppercase font-bold tracking-widest block leading-none">News & Notices</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-white mt-2">Latest News from Admin Dashboard</h2>
                <p className="text-xs text-slate-400 mt-1">Official announcements and notices published directly by the School Administration.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-sky-400 text-xs px-3 py-1.5 rounded-xl">
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                <span className="font-semibold">Live Bulletin Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminNewsList.map((news: any, index: number) => (
                <div key={news.id || index} className="p-6 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl space-y-4 shadow-sm transition-all group flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-500 flex items-center gap-1 font-bold">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        {news.date || new Date().toISOString().split('T')[0]}
                      </span>
                      <span className="bg-sky-500/10 text-sky-400 font-extrabold uppercase px-2 py-0.5 rounded border border-sky-500/20 text-[9px] tracking-wider">
                        Official Notice
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-100 uppercase tracking-wide group-hover:text-white transition-colors">
                      {news.title || news.heading}
                    </h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-normal">
                      {news.message || news.text || news.description}
                    </p>
                  </div>
                  
                  {/* Subtle decorative signature watermark inside the card */}
                  <div className="pt-4 border-t border-slate-950 flex items-center justify-between mt-2">
                    <span className="text-[8.5px] italic text-sky-500/60 font-semibold">Verified Envelope Authentication</span>
                    <img src="/logo.png" className="w-5 h-5 opacity-[0.2] invert" alt="Crest stamp" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REAL REGISTERED TEACHERS ONLY (SOURCED FROM CONTEXT) */}
      {currentTab === 'home' && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] text-sky-400 uppercase font-bold tracking-widest block leading-none">Registered Instructors</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">Meet Our Real Secondary Staff</h2>
            <p className="text-xs text-slate-400 mt-1">Actual subject directors registered and administered inside the school portal roster database.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <div key={t.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 flex items-start gap-4 hover:border-slate-700 transition duration-300">
                <img 
                  src={t.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120'} 
                  alt={t.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-800 ring-2 ring-sky-500/10"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120';
                  }}
                />
                <div className="space-y-1 bg-slate-900 flex-1 min-w-0">
                  <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider truncate leading-tight">{t.name}</h4>
                  <span className="text-[8px] font-black text-sky-400 uppercase bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 inline-block tracking-widest">
                    {t.department} Division
                  </span>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic pt-1">
                    "{t.bio || 'Qualified campus instructor dedicated to delivering practical subject study guidelines.'}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Events Lists (SOURCED FROM CONTEXT) */}
      {currentTab === 'home' && (
        <section className="py-16 bg-slate-950 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
              <div>
                <span className="text-[10px] text-sky-400 uppercase font-bold tracking-widest block leading-none">Activities & Events</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-white mt-1">Calendar & Academic Schedules</h2>
                <p className="text-xs text-slate-400 mt-1">Administered timetable notifications, exams, and sporting events.</p>
              </div>
              <button
                onClick={onLoginClick}
                className="text-xs font-bold text-sky-400 bg-slate-900 hover:bg-slate-850 border border-slate-800 px-4 py-2 rounded-xl transition-all cursor-pointer leading-none"
              >
                Log In as Member to Full Planner
              </button>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-xs">
                No active calendar events are currently configured in the active semester database.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingEvents.map((ev) => {
                  const eventDate = new Date(ev.date + 'T00:00:00');
                  const dayStr = eventDate.getDate();
                  const monthStr = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
                  
                  return (
                    <div key={ev.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-sm">
                      <div className="space-y-3 text-left">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-sky-500 text-slate-950 font-black text-sm w-12 h-12 rounded-2xl flex flex-col justify-center items-center">
                              <span className="leading-none text-slate-950 font-serif font-black">{dayStr}</span>
                              <span className="text-[8px] tracking-widest uppercase leading-none mt-0.5">{monthStr}</span>
                            </div>
                            <div className="text-left leading-none">
                              <span className="text-[9px] font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded leading-none block border border-slate-800/60 w-fit">{ev.time || 'All Day'}</span>
                              <span className="text-[9px] text-slate-500 mt-1 block leading-none tracking-wide">{ev.location}</span>
                            </div>
                          </div>
                          <span className="text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-md">
                            {ev.type}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-widest leading-normal">{ev.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                          {ev.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Clean Gallery Segment */}
      {currentTab === 'home' && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-sky-400 uppercase font-bold tracking-widest block leading-none">Pristine Gallery</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">Look Inside Our Campus</h2>
            <p className="text-xs text-slate-400">Authentic photographic frames representing classrooms, laboratories, and library resources.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { url: "/front_page.png", label: "Front Gate Entrance" },
              { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80", label: "Biology Chemistry Practical Lab" },
              { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80", label: "Senior Classroom Lesson" },
              { url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80", label: "School Resource Reference Desks" }
            ].map((img, id) => (
              <div key={id} className="relative group overflow-hidden rounded-2xl border border-slate-800 cursor-pointer shadow-md" onClick={() => setActiveModal('gallery')}>
                <img 
                  src={img.url} 
                  alt={img.label} 
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] text-white font-bold leading-tight uppercase tracking-wider">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Simple Home Contact Details Segment */}
      {currentTab === 'home' && (
        <section className="py-16 bg-slate-950 text-[#f1f5f9] border-t border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
            <div className="space-y-6">
              <span className="text-[10px] text-sky-400 uppercase font-bold tracking-widest block leading-none">Registrar Office Contacts</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">Reach Out To the Administration Registrar</h2>
              <p className="text-xs text-slate-350 leading-relaxed">
                If you have administrative questions regarding student roster files, tuition bursar details, or course schedules, please reach us directly.
              </p>
              
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-sky-400" />
                  <div>
                    <span className="text-[8.5px] text-slate-500 block uppercase tracking-wide">Campus Address</span>
                    <span className="text-xs font-bold text-slate-200">Off Ilawe Road, Ado-Ekiti, Ekiti State, Nigeria</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-sky-400" />
                  <div>
                    <span className="text-[8.5px] text-slate-500 block uppercase tracking-wide">Inquiry Email</span>
                    <a href="mailto:omoleyemi82@gmail.com" className="text-xs font-bold leading-none hover:underline text-sky-400">omoleyemi82@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-sky-400" />
                  <div>
                    <span className="text-[8.5px] text-slate-500 block uppercase tracking-wide">Administrative Office Line</span>
                    <span className="text-xs font-bold leading-none text-slate-200">+1 (555) 304-4000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-left relative overflow-hidden shadow-lg">
              <h4 className="font-serif font-bold text-white text-base mb-1">Direct School Inquiry</h4>
              <p className="text-[11px] text-slate-400 mb-4">Send a secure advisory query to the duty registrar desk.</p>

              {contactSubmitted ? (
                <div className="p-10 text-center space-y-3 animate-fade-in bg-slate-950/40 rounded-2xl border border-slate-900">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h5 className="font-bold text-xs uppercase tracking-wider text-white">Message Logged</h5>
                  <p className="text-[10.5px] text-slate-450 leading-relaxed">Thank you. The Academy registrar desk of duty will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. John Robert"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-200 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Your Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. robert@mail.com"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-200 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Message Details</label>
                    <textarea
                      required
                      rows={3}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Enter subject details..."
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-200 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer leading-none h-11 shadow-md shadow-sky-600/10"
                  >
                    Send Query
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      )}

      {/* Dynamic Subpages Routing */}
      {currentTab === 'about' && <AboutUsPage />}
      {currentTab === 'events' && <EventsPage />}
      {currentTab === 'gallery' && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left animate-fade-in">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] text-[#1E4D8F] uppercase font-black tracking-widest block font-mono">NEW UNIQUE ACADEMY FACILITY FRAME</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0B1F3B] uppercase tracking-wide">Campus Photographic Archive</h2>
            <p className="text-xs text-slate-400">Authentic highlights representing classrooms, chemistry laboratories, sporting grounds, and computer reference decks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { url: "/front_page.png", label: "School Front Entrance Field", caption: "Safe security-patrolled access coordinates with physical administrative structures." },
              { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80", label: "Biology Chemistry Practical Lab", caption: "High-grade reagents, chemical storage systems, testing cylinders, and microscope rigs." },
              { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80", label: "Senior Secondary Lesson Work", caption: "Comfortable spacious seating modules, modern blackboards, and student writing stations." },
              { url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80", label: "Resource Library Desks", caption: "Comprehensive curriculum books, research texts, literature novels, and quiet reading desks." },
              { url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80", label: "Secondary Computing Station", caption: "Digital processing terminals, programming syllabus sheets, and internet testing grids." },
              { url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80", label: "Sports Field & Recreation", caption: "Healthy competitive arenas, track races, inter-house sports sportsmanship, and football units." }
            ].map((img, id) => (
              <div key={id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">
                <div className="relative overflow-hidden h-52">
                  <img 
                    src={img.url} 
                    alt={img.label} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent flex items-end p-4">
                    <span className="text-white text-xs font-black uppercase tracking-wider">{img.label}</span>
                  </div>
                </div>
                <div className="p-5 text-left bg-white">
                  <p className="text-[11px] text-slate-550 leading-normal">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {currentTab === 'contact' && <ContactUsPage />}
      {currentTab === 'profile' && <ProfilePage />}

      {currentTab === 'portal' && currentRole === 'guest' && (
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-sky-400 border border-slate-800 shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-base font-bold text-white uppercase tracking-wide">Portal Authentication Required</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              NEW UNIQUE ACADEMY portal contains secure grades, attendance registers, parent ledger directories, and CBT quiz centers. Authentication is strictly required.
            </p>
          </div>
          <button
            onClick={onLoginClick}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-[#090f1f] text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            Access Login <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      )}

      {/* Dynamic Watermark Stamp & Footer view */}
      <footer className="bg-[#060b18] text-slate-400 py-12 border-t border-slate-900 text-xs mt-auto relative z-10 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <img src="/logo.png" className="w-7 h-7 object-contain brightness-0 invert" alt="Crest logo" />
              </div>
              <span className="text-slate-100 font-serif font-black text-base block uppercase tracking-wider leading-none">NEW UNIQUE ACADEMY</span>
            </div>
            <p className="text-slate-400 italic">"Academic Excellence Is Our Pride"</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-slate-100 font-extrabold block uppercase tracking-widest text-[9.5px]">Campus General Registrar</span>
            <p className="text-slate-350">Off Ilawe Road, Ado-Ekiti, Ekiti State, Nigeria</p>
            <p className="text-sky-400 font-bold">omoleyemi82@gmail.com</p>
          </div>
          <div className="space-y-3.5 md:text-right">
            <p>© 2026 NEW UNIQUE ACADEMY. All rights reserved.</p>
            <div className="flex justify-center md:justify-end gap-4 text-[10.5px] text-slate-500 font-extrabold uppercase tracking-wider">
              <span className="hover:text-sky-400 cursor-pointer transition-colors" onClick={() => setActiveModal('faq')}>Student FAQ</span>
              <span className="hover:text-sky-400 cursor-pointer transition-colors" onClick={() => onLoginClick()}>Bursar Rules</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Overlay Modals (Calm, sleek, matching dark/slate frames) */}
      {activeModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setActiveModal(null)} />
          
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-fade-in text-slate-300 leading-relaxed text-left">
            
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-all cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'gallery' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-white">
                    <Image className="w-6 h-6 text-sky-400" />
                    <h3 className="text-md font-serif font-black uppercase tracking-widest">Campus Gallery Archive</h3>
                  </div>
                  <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest block mt-1.5">Inside look at biology labs, classes, and facilities</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { url: "/front_page.png", label: "Campus Main Gatehouse & Fields" },
                    { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80", label: "Biology Chemistry Practical Lab" },
                    { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80", label: "Senior Secondary Lesson Work" },
                    { url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80", label: "Academic Resources Desk" }
                  ].map((img, id) => (
                    <div key={id} className="relative rounded-2xl overflow-hidden border border-slate-800">
                      <img src={img.url} alt={img.label} className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                      <div className="bg-slate-950 p-2 text-center text-[9.5px] text-slate-300 font-bold uppercase tracking-wider border-t border-slate-800">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'faq' && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-white">
                    <HelpCircle className="w-6 h-6 text-sky-400" />
                    <h3 className="text-md font-serif font-black uppercase tracking-widest">Frequently Asked Questions</h3>
                  </div>
                  <span className="text-[10px] text-sky-400 block mt-1 uppercase tracking-wide font-bold">Guidelines regarding admission and portal systems</span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-300">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <span className="font-extrabold text-white block mb-1 uppercase tracking-wide text-[10px]">Q: How can I register student accounts?</span>
                    <p className="text-[10.5px] text-slate-400">All student, parent, and teacher portal profiles are strictly registered by the School Administrator. Public registration forms do not exist on the live platform to guarantee credentials security.</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <span className="font-extrabold text-white block mb-1 uppercase tracking-wide text-[10px]">Q: Where is the campus located?</span>
                    <p className="text-[10.5px] text-slate-400">Our physical secondary school campus is situated Off Ilawe Road, Ado-Ekiti, Ekiti State, Nigeria. High-grade science laboratory stations, Christian fellowship centers, and academic libraries are configured locally.</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <span className="font-extrabold text-white block mb-1 uppercase tracking-wide text-[10px]">Q: What streams are available?</span>
                    <p className="text-[10.5px] text-slate-400">We support three academic departments: Science, Art, and Commerce. Specializations are assigned by subject instructors upon candidate review.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
