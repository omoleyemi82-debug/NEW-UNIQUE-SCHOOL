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
import { useSchool } from '../context/SchoolContext';
import { 
  BookOpen, 
  Calendar, 
  HelpCircle, 
  GraduationCap, 
  ChevronRight, 
  CheckCircle, 
  MessageSquare, 
  ArrowRight, 
  Star, 
  Mail,
  Printer, 
  CheckCircle2, 
  IdCard, 
  FileText, 
  ShieldAlert, 
  X,
  Building,
  ChevronDown,
  Image,
  Search,
  Award,
  ShieldCheck,
  Layers,
  Briefcase,
  Users,
  Menu,
  Phone,
  MapPin
} from 'lucide-react';

export default function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  const { 
    events, 
    teachers, 
    setRole, 
    students, 
    currentRole, 
    currentUserId,
    schoolName,
    notifications
  } = useSchool();
  
  // Active Tab: 'home' | 'about' | 'academics' | 'events' | 'contact' | 'portal'
  const [currentTab, setCurrentTab] = useState<'home' | 'about' | 'academics' | 'events' | 'contact' | 'portal'>(
    currentRole !== 'guest' ? 'portal' : 'home'
  );

  // Active subtab inside member portal
  const [activePortalTab, setActivePortalTab] = useState<string>('dash');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState<'requirements' | 'gallery' | 'faq' | 'support' | null>(null);

  // Local state for contact query
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    if (currentRole !== 'guest' && currentTab === 'home') {
      setCurrentTab('portal');
    } else if (currentRole === 'guest' && currentTab === 'portal') {
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
      >
        {currentRole === 'student' && <StudentPortal activeTab={activePortalTab} />}
        {currentRole === 'parent' && <ParentPortal activeTab={activePortalTab} />}
        {currentRole === 'teacher' && <StaffPortal activeTab={activePortalTab} />}
        {currentRole === 'admin' && <AdminPortal activeTab={activePortalTab} />}
      </PortalLayout>
    );
  }

  return (
    <div className="min-h-screen bg-natural-bg text-natural-charcoal font-sans selection:bg-[#E9E5D9]">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-natural-bg/95 backdrop-blur-md border-b border-natural-beige shadow-xs text-natural-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <button 
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }} 
            className="flex items-center gap-3 active:scale-95 transition-transform bg-transparent border-none text-left cursor-pointer outline-none"
          >
            <div className="p-1.5 bg-[#1A365D] rounded-xl shrink-0 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="School Crest" 
                className="w-10 h-10 object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-base font-serif font-black tracking-tight text-[#1A365D] uppercase block leading-none">{schoolName}</span>
              <span className="text-[9px] block text-[#C29B38] font-bold tracking-widest uppercase mt-1 leading-none">Secondary School Portal</span>
            </div>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer ${
                currentTab === 'home' 
                  ? 'text-[#1A365D] border-[#1A365D]' 
                  : 'border-transparent hover:text-[#1A365D]'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentTab('about')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer ${
                currentTab === 'about' ? 'text-[#1A365D] border-[#1A365D]' : 'border-transparent hover:text-[#1A365D]'
              }`}
            >
              About Us
            </button>
            <button 
              onClick={() => setCurrentTab('academics')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer ${
                currentTab === 'academics' ? 'text-[#1A365D] border-[#1A365D]' : 'border-transparent hover:text-[#1A365D]'
              }`}
            >
              Academics
            </button>
            <button 
              onClick={() => setCurrentTab('events')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer ${
                currentTab === 'events' ? 'text-[#1A365D] border-[#1A365D]' : 'border-transparent hover:text-[#1A365D]'
              }`}
            >
              School Calender
            </button>
            <button 
              onClick={() => setCurrentTab('contact')}
              className={`pb-1 px-1 transition-all border-b-2 cursor-pointer ${
                currentTab === 'contact' ? 'text-[#1A365D] border-[#1A365D]' : 'border-transparent hover:text-[#1A365D]'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Auth Trigger */}
          <div className="flex items-center gap-3">
            {currentRole === 'guest' ? (
              <button
                onClick={onLoginClick}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#1A365D] hover:bg-[#1A365D]/90 active:scale-95 transition-all rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                id="header-login-btn"
              >
                <ShieldCheck className="w-4 h-4 text-[#C29B38]" /> Log In
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('portal')}
                  className="px-4 py-2.5 bg-[#E9E5D9] hover:bg-[#DDD2BC] text-[#1A365D] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Building className="w-3.5 h-3.5" /> Portal Dashboard
                </button>
                <button
                  onClick={() => {
                    setRole('guest', 'guest');
                    setCurrentTab('home');
                  }}
                  className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Hamburger helper toggles */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-slate-100/80 rounded-xl text-[#1A365D] border border-slate-200"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 p-4 bg-[#FDFCF7] grid grid-cols-2 gap-2 animate-fade-in">
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('home'); }}
              className="p-3 rounded-xl hover:bg-slate-100/90 hover:text-[#1A365D] text-xs font-bold text-slate-705 uppercase text-center cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('about'); }}
              className="p-3 rounded-xl hover:bg-slate-100/90 hover:text-[#1A365D] text-xs font-bold text-slate-705 uppercase text-center cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('academics'); }}
              className="p-3 rounded-xl hover:bg-slate-100/90 hover:text-[#1A365D] text-xs font-bold text-slate-705 uppercase text-center cursor-pointer"
            >
              Academics
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('events'); }}
              className="p-3 rounded-xl hover:bg-slate-100/90 hover:text-[#1A365D] text-xs font-bold text-slate-705 uppercase text-center cursor-pointer"
            >
              Calendar
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentTab('contact'); }}
              className="p-3 rounded-xl hover:bg-slate-100/90 hover:text-[#1A365D] text-xs font-bold text-slate-705 uppercase text-center cursor-pointer"
            >
              Contact
            </button>
            {currentRole === 'guest' ? (
              <button 
                onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                className="p-3 bg-[#1A365D] text-white rounded-xl text-xs font-bold uppercase text-center col-span-2 cursor-pointer"
              >
                Log In
              </button>
            ) : (
              <button 
                onClick={() => { setMobileMenuOpen(false); setCurrentTab('portal'); }}
                className="p-3 bg-[#E9E5D9] text-[#1A365D] rounded-xl text-xs font-bold uppercase text-center col-span-2 cursor-pointer"
              >
                My Portal
              </button>
            )}
          </div>
        )}
      </header>

      {/* Hero Block */}
      {currentTab === 'home' && (
        <section className="relative overflow-hidden py-20 lg:py-28 bg-[#1A365D] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(194,155,56,0.12),transparent)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E9E5D9] text-[10px] font-bold uppercase tracking-widest leading-none">
                <Star className="w-3.5 h-3.5 fill-[#C29B38] text-[#C29B38]" /> Accredited Secondary Institution
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.1] text-white">
                Academic Excellence Is <span className="text-[#C29B38]">Our Pride</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
                NEW UNIQUE ACADEMY offers a realistic and modern secondary learning experience. Supported by three core streams—Science, Art, and Commerce—we focus on real discipline, state-accredited examinations, and clear subject period schedules.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onLoginClick}
                  className="px-6 py-3.5 bg-[#C29B38] hover:bg-[#A88029] text-[#1A365D] font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                >
                  <ShieldCheck className="w-4 h-4" /> Enter Staff/Student Hub
                </button>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="px-6 py-3.5 bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer leading-none"
                >
                  Learn About NUA
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative mx-auto w-[360px] h-[400px]">
                <div className="absolute -top-3 -left-3 w-full h-full rounded-2xl bg-[#C29B38]/15 border border-white/5 transform rotate-2"></div>
                <img
                  src="/front_page.png"
                  alt="NUA Campus Field"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl border border-slate-750"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Simple Home About Us Segment */}
      {currentTab === 'home' && (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-[10px] text-[#C29B38] uppercase font-bold tracking-widest block leading-none">Who We Are</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A365D] tracking-tight">Our 10-Year Dedicated Secondary History</h2>
              <div className="h-1 w-12 bg-[#C29B38] rounded-full"></div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Founded in 2016, New Unique Academy was built with a simple goal: providing realistic secondary training to local young students. There are no exaggerated statistics or uncertified frameworks here. 
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                We believe in straightforward, solid classroom subjects, and actual learning benchmarks to prepare students for national exit exams and future work fields.
              </p>
              <button 
                onClick={() => setCurrentTab('about')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 underline transition-all bg-transparent cursor-pointer"
              >
                Read our full milestones <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="p-2.5 bg-[#1A365D]/5 text-[#1A365D] rounded-xl w-fit">
                  <Layers className="w-5 h-5 text-[#C29B38]" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1A365D] mt-4">Science Specialty</h4>
                <p className="text-[11px] text-slate-500 mt-1">Chemistry, Biology, Physics, and analytical mathematics.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="p-2.5 bg-[#1A365D]/5 text-[#1A365D] rounded-xl w-fit">
                  <BookOpen className="w-5 h-5 text-[#C29B38]" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1A365D] mt-4">Art Specialty</h4>
                <p className="text-[11px] text-slate-500 mt-1">Literature, Government, Civic Duty, and Language studies.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="p-2.5 bg-[#1A365D]/5 text-[#1A365D] rounded-xl w-fit">
                  <GraduationCap className="w-5 h-5 text-[#C29B38]" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1A365D] mt-4">Commerce Specialty</h4>
                <p className="text-[11px] text-slate-500 mt-1">Bookkeeping, General Economics, and Office Practice.</p>
              </div>
              <div className="p-5 bg-[#C29B38]/5 rounded-2xl border border-[#C29B38]/20 flex flex-col justify-between">
                <div className="p-2.5 bg-[#C29B38]/10 text-[#C29B38] rounded-xl w-fit">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1A365D] mt-4">Active Roster</h4>
                <p className="text-[11px] text-slate-500 mt-1">Admin-managed teacher databases, results, and calendars.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Real Registered Teachers Sourced from Context Grid */}
      {currentTab === 'home' && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] text-[#C29B38] uppercase font-bold tracking-widest block leading-none">Registered Instructors</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A365D]">Meet Our Real Campus Teachers</h2>
            <p className="text-xs text-slate-500">Every single teacher displaying below is directly registered and managed from the secure admin dashboard control panel.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-[#E9E5D9] p-5 flex items-start gap-4 shadow-5xs hover:shadow-xs transition-shadow">
                <img 
                  src={t.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120'} 
                  alt={t.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide leading-tight">{t.name}</h4>
                  <span className="text-[9.5px] font-bold text-[#C29B38] uppercase bg-[#C29B38]/10 px-1.5 py-0.5 rounded inline-block">
                    {t.department}
                  </span>
                  <p className="text-[10.5px] text-slate-500 leading-snug line-clamp-3 italic pt-1">
                    "{t.bio || 'Qualified campus instructor dedicated to delivering practical subject study guidelines.'}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Real Registered Dynamic Events List Sourced from Context Grid */}
      {currentTab === 'home' && (
        <section className="py-16 bg-[#FDFCF7] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
              <div>
                <span className="text-[10px] text-[#C29B38] uppercase font-bold tracking-widest block leading-none">School Calendars</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A365D] mt-1">Calendar Schedules & Announcements</h2>
                <p className="text-xs text-slate-500 mt-1">Admin-uploaded timetable notifications and calendar dates.</p>
              </div>
              <button
                onClick={onLoginClick}
                className="text-xs font-bold text-[#1A365D] bg-[#E9E5D9] hover:bg-[#DDD2BC] px-4 py-2 rounded-xl transition-all cursor-pointer leading-none border border-[#DDD2BC]"
              >
                Log In to Full Planner
              </button>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No active calendar events loaded from the Admin panel roster.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingEvents.map((ev) => {
                  const eventDate = new Date(ev.date + 'T00:00:00');
                  const dayStr = eventDate.getDate();
                  const monthStr = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
                  
                  return (
                    <div key={ev.id} className="bg-white rounded-2xl border border-[#E9E5D9] p-6 flex flex-col justify-between space-y-4 shadow-5xs">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#1A365D] text-white font-bold text-sm w-12 h-12 rounded-xl flex flex-col justify-center items-center">
                              <span className="leading-none text-[#C29B38] font-serif font-extrabold">{dayStr}</span>
                              <span className="text-[8px] tracking-wider uppercase">{monthStr}</span>
                            </div>
                            <div>
                              <span className="text-[10.5px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded leading-none block w-fit">{ev.time || 'All Day'}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 block leading-none">{ev.location}</span>
                            </div>
                          </div>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 text-[#1A365D] bg-[#E9E5D9] rounded-md">
                            {ev.type}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide">{ev.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
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
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-[#C29B38] uppercase font-bold tracking-widest block leading-none">Campus Snaps</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A365D]">Look Inside New Unique Academy</h2>
            <p className="text-xs text-slate-500">A glimpse of our classrooms, science practical sessions, and sports facilities.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { url: "/front_page.png", label: "Front Entrance & Campus" },
              { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80", label: "Biology Chemistry Lab Workstation" },
              { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80", label: "Subject Period Classroom Class" },
              { url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80", label: "Library Reference Desks" }
            ].map((img, id) => (
              <div key={id} className="relative group overflow-hidden rounded-xl border border-slate-200 cursor-pointer shadow-6xs" onClick={() => setActiveModal('gallery')}>
                <img 
                  src={img.url} 
                  alt={img.label} 
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A365D]/90 via-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9.5px] text-white font-bold leading-tight">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Simple Home Contact Details Segment */}
      {currentTab === 'home' && (
        <section className="py-16 bg-[#1A365D] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[10px] text-[#C29B38] uppercase font-bold tracking-widest block leading-none">Campus Contacts</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">Reach Out To the Administration Registrar</h2>
              <p className="text-xs text-slate-200 leading-relaxed">
                If you have administrative questions regarding student files, tuition Bursar receipts, or timetable assignments, please reach us directly.
              </p>
              
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#C29B38]" />
                  <div>
                    <span className="text-[10px] text-slate-350 block uppercase tracking-wide">Campus Address</span>
                    <span className="text-xs font-bold font-serif">Behind Fabian Hotel Zone C</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#C29B38]" />
                  <div>
                    <span className="text-[10px] text-slate-350 block uppercase tracking-wide">Inquiry Email</span>
                    <a href="mailto:omoleyemi82@gmail.com" className="text-xs font-bold leading-none hover:underline text-[#C29B38]">omoleyemi82@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#C29B38]" />
                  <div>
                    <span className="text-[10px] text-slate-350 block uppercase tracking-wide">Office Line</span>
                    <span className="text-xs font-bold leading-none">+1 (555) 304-4000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 text-natural-charcoal shadow-lg">
              <h4 className="font-serif font-bold text-[#1A365D] text-base mb-1">Local campus query</h4>
              <p className="text-[11px] text-slate-500 mb-4">Send a direct advisory query to our duty desk officer.</p>

              {contactSubmitted ? (
                <div className="p-10 text-center space-y-3 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#1A365D]">Message Logged</h5>
                  <p className="text-[10.5px] text-slate-500">Thank you. The registrar duty officer will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. John Robert"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#1A365D] focus:bg-white text-slate-800 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Your Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. robert@mail.com"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#1A365D] focus:bg-white text-slate-800 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Your Message</label>
                    <textarea
                      required
                      rows={3}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Enter subject details..."
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#1A365D] focus:bg-white text-slate-800 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer leading-none"
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
      {currentTab === 'academics' && <AcademicsPage />}
      {currentTab === 'events' && <EventsPage />}
      {currentTab === 'contact' && <ContactUsPage />}

      {currentTab === 'portal' && currentRole !== 'guest' && (
        <PortalLayout
          activeTab={activePortalTab}
          setActiveTab={setActivePortalTab}
          onLogout={() => {
            setRole('guest', 'guest');
            setCurrentTab('home');
          }}
        >
          {currentRole === 'student' && <StudentPortal activeTab={activePortalTab} />}
          {currentRole === 'parent' && <ParentPortal activeTab={activePortalTab} />}
          {currentRole === 'teacher' && <StaffPortal activeTab={activePortalTab} />}
          {currentRole === 'admin' && <AdminPortal activeTab={activePortalTab} />}
        </PortalLayout>
      )}

      {currentTab === 'portal' && currentRole === 'guest' && (
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-[#1A365D]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#1A365D]">Portal Authentication Required</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              New Unique Academy portal contains confidential grades, attendance counters, parent/student ledger folders, and timetables. Authenticate to proceed.
            </p>
          </div>
          <button
            onClick={onLoginClick}
            className="px-6 py-3 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5 outline-none font-mono"
          >
            Access Login <ArrowRight className="w-4 h-4 text-[#C29B38]" />
          </button>
        </div>
      )}

      {/* Footer view */}
      <footer className="bg-slate-900 text-slate-350 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div className="space-y-2">
            <span className="text-white font-serif font-black text-lg block uppercase tracking-wide">{schoolName}</span>
            <p className="text-slate-400 italic">"Academic Excellence Is Our Pride"</p>
          </div>
          <div className="space-y-1">
            <span className="text-white font-bold block">Campus Address</span>
            <p>Behind Fabian Hotel Zone C</p>
            <p className="text-[#C29B38] font-bold">omoleyemi82@gmail.com</p>
          </div>
          <div className="space-y-3 md:text-right">
            <p>© 2026 {schoolName}. All rights reserved.</p>
            <div className="flex justify-center md:justify-end gap-4 text-slate-500 font-bold">
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveModal('faq')}>FAQ Guidelines</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => onLoginClick()}>Bursar Rules</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Overlay Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setActiveModal(null)} />
          
          <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-fade-in text-natural-charcoal leading-relaxed">
            
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'gallery' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-[#1A365D]">
                    <Image className="w-6 h-6 text-[#C29B38]" />
                    <h3 className="text-lg font-serif font-black uppercase tracking-wide">Campus Image Archive</h3>
                  </div>
                  <span className="text-[10px] text-[#C29B38] font-bold uppercase tracking-wider block mt-1">Classrooms, labs, and recreation snapping moments</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { url: "/front_page.png", label: "Campus Main Gatehouse & Fields" },
                    { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80", label: "Biology Chemistry Practical Lab" },
                    { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80", label: "Senior Secondary Lesson Work" },
                    { url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80", label: "Academic Resources Desk" }
                  ].map((img, id) => (
                    <div key={id} className="relative rounded-xl overflow-hidden border border-slate-250">
                      <img src={img.url} alt={img.label} className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                      <div className="bg-slate-950 p-2 text-center text-[10px] text-white font-bold">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'faq' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-[#1A365D]">
                    <HelpCircle className="w-6 h-6 text-[#C29B38]" />
                    <h3 className="text-lg font-serif font-black uppercase tracking-wide">Frequently Asked Questions</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Primary details regarding fees, transport, and registers</span>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-[#1A365D] block mb-1">Q: How can I register student accounts?</span>
                    <p className="text-[11px]">All student, parent, and teacher portal profiles are strictly registered by the School Administrator. There is no public registration panel.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-[#1A365D] block mb-1">Q: Where is the campus located?</span>
                    <p className="text-[11px]">Our standard secondary campus is situated Behind Fabian Hotel Zone C. Bus pick-stops log transits across Pretoria zones.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-[#1A365D] block mb-1">Q: What streams are available?</span>
                    <p className="text-[11px]">We support three academic departments: Science, Art, and Commerce. Students specialize in one of these paths starting SS1.</p>
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
