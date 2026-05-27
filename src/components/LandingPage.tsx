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
  Download, 
  UploadCloud, 
  CheckCircle2, 
  IdCard, 
  FileText, 
  HeartPulse, 
  UserCheck, 
  ShieldAlert, 
  Activity, 
  X,
  CreditCard,
  Building,
  ChevronDown,
  Book,
  Image,
  Search,
  Award,
  ShieldCheck,
  Layers,
  Briefcase,
  Users,
  Menu
} from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  const { events, addStudent, setRole, students, currentRole, currentUserId } = useSchool();
  
  // Active Website Page Tab: 'home' | 'about' | 'academics' | 'admissions' | 'events' | 'contact' | 'portal'
  const [currentTab, setCurrentTab] = useState<'home' | 'about' | 'academics' | 'admissions' | 'events' | 'contact' | 'portal'>('home');

  // Track sub-section within active portal page
  const [activePortalTab, setActivePortalTab] = useState<string>('dash');

  useEffect(() => {
    if (currentRole !== 'guest' && currentTab === 'home') {
      setCurrentTab('portal');
    } else if (currentRole === 'guest' && currentTab === 'portal') {
      setCurrentTab('home');
    }
  }, [currentRole]);

  // Navigation & Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<'academics' | 'portal' | 'admissions' | 'resources' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Advanced Dialog Modals
  const [activeModal, setActiveModal] = useState<'requirements' | 'library' | 'gallery' | 'careers' | 'faq' | 'support' | 'privacy' | 'terms' | null>(null);

  // Admissions status search sub-state
  const [statusSearchCode, setStatusSearchCode] = useState('');
  const [statusSearchResult, setSearchResult] = useState<{
    found: boolean;
    name?: string;
    grade?: string;
    code?: string;
    status?: string;
  } | null>(null);

  // Support input query
  const [supportInquirySubmitted, setSupportInquirySubmitted] = useState(false);
  const [supportSubject, setSupportSubject] = useState('Portal Login Access');
  const [supportMessage, setSupportMessage] = useState('');

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Admissions system status and state hooks for student biodata
  const [activeAdmissionsTab, setActiveAdmissionsTab] = useState<'inquiry' | 'registration'>('registration');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regDob, setRegDob] = useState('2009-06-15');
  const [regGrade, setRegGrade] = useState('Grade 10');
  const [regCountry, setRegCountry] = useState('TX, United States');
  const [regAddress, setRegAddress] = useState('');
  const [regGuardianName, setRegGuardianName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGuardianPhone, setRegGuardianPhone] = useState('');
  const [regGuardianEmail, setRegGuardianEmail] = useState('');
  const [regMedical, setRegMedical] = useState('asthma, minor peanut allergy (epipen carried).');
  const [regPrevSchool, setRegPrevSchool] = useState('Preston Middle School');
  const [regEmergencyName, setRegEmergencyName] = useState('');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80');

  // Pre-configured custom academic passport avatars to pick from
  const avatarOptions = [
    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', label: 'Candidate A' },
    { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', label: 'Candidate B' },
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Candidate C' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: 'Candidate D' },
    { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', label: 'Candidate E' },
    { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', label: 'Candidate F' }
  ];

  // Saved student registration state for virtual badge rendering
  const [generatedStudent, setGeneratedStudent] = useState<any | null>(null);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquiryName && inquiryEmail) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setInquiryName('');
        setInquiryEmail('');
        setInquiryMessage('');
      }, 4000);
    }
  };

  // Get the next 3 events sorted by date
  const upcomingEvents = [...events]
    .filter(e => new Date(e.date) >= new Date(new Date().setDate(new Date().getDate() - 1)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-natural-bg text-natural-charcoal font-sans selection:bg-[#E9E5D9]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-natural-bg/95 backdrop-blur-md border-b border-natural-beige shadow-sm transition-all text-natural-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <button 
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }} 
            className="flex items-center gap-3 active:scale-95 transition-transform cursor-pointer bg-transparent border-none text-left outline-none"
          >
            <div className="p-1 bg-white border border-natural-beige rounded-xl shadow-xs shrink-0 flex items-center justify-center">
              <img 
                src="/src/assets/images/school_logo_1779413996009.png" 
                alt="New Unique Academy Logo" 
                className="w-16 h-16 object-contain"
                referrerPolicy="no-referrer"
                id="nav-logo-img"
              />
            </div>
            <div>
              <span className="text-xl font-serif font-extrabold tracking-tight text-natural-charcoal uppercase leading-none block">NEW UNIQUE</span>
              <span className="text-xs block text-natural-green font-bold tracking-widest uppercase mt-0.5">ACADEMY</span>
            </div>
          </button>

          {/* Desktop Navigation Links with Dropdowns */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-natural-charcoal/80">
            
            {/* Home link */}
            <button 
              onClick={() => setCurrentTab('home')}
              className={`pb-1 px-1 transition-all cursor-pointer border-b-2 hover:text-natural-green outline-none ${
                currentTab === 'home' 
                  ? 'text-natural-green border-natural-green font-bold' 
                  : 'border-transparent text-natural-charcoal/80'
              }`}
            >
              Home
            </button>

            {/* About link */}
            <button 
              onClick={() => setCurrentTab('about')}
              className={`pb-1 px-1 transition-all cursor-pointer border-b-2 hover:text-natural-green outline-none ${
                currentTab === 'about' 
                  ? 'text-natural-green border-natural-green font-bold' 
                  : 'border-transparent text-natural-charcoal/80'
              }`}
            >
              About Us
            </button>

            {/* Dropdown: Academics */}
            <div className="relative group/menu">
              <button 
                onClick={() => setCurrentTab('academics')}
                className={`flex items-center gap-1 pb-1 px-1 transition-all cursor-pointer border-b-2 hover:text-natural-green outline-none ${
                  currentTab === 'academics'
                    ? 'text-natural-green border-natural-green font-bold'
                    : 'border-transparent text-natural-charcoal/80'
                }`}
              >
                Academics <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-natural-beige rounded-2xl shadow-xl p-3 grid grid-cols-1 gap-1 z-50 hidden group-hover/menu:block hover:block">
                <div className="p-2 border-b border-slate-50 mb-1">
                  <span className="text-[10px] font-bold text-natural-green uppercase tracking-wider block">Academic Programs</span>
                </div>
                <button 
                  onClick={() => { setCurrentTab('academics'); setActiveModal('requirements'); }} 
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-charcoal"
                >
                  <Book className="w-4 h-4 text-[#C29B38]" />
                  <div>
                    <span className="font-bold block text-left">Nursery School</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">Montessori initial sensory studies</span>
                  </div>
                </button>
                <button 
                  onClick={() => { setCurrentTab('academics'); setActiveModal('requirements'); }}
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-charcoal"
                >
                  <Layers className="w-4 h-4 text-natural-green" />
                  <div>
                    <span className="font-bold block text-left">Primary School</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">Grades 1-6 fundamental curriculums</span>
                  </div>
                </button>
                <button 
                  onClick={() => { setCurrentTab('academics'); setActiveModal('requirements'); }}
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-charcoal"
                >
                  <GraduationCap className="w-4 h-4 text-natural-green" />
                  <div>
                    <span className="font-bold block text-left">Secondary School</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">University prep & STEM pathways</span>
                  </div>
                </button>
                <button 
                  onClick={() => setCurrentTab('academics')}
                  className="w-full text-center text-[10.5px] font-bold text-natural-green hover:underline pt-2 mt-1 border-t border-slate-100 bg-transparent"
                >
                  View Departments & Curriculum
                </button>
              </div>
            </div>

            {/* Dropdown: Student Portal */}
            <div className="relative group/menu">
              <button 
                onClick={() => {}}
                className="flex items-center gap-1 pb-1 px-1 transition-all cursor-pointer border-b-2 border-transparent hover:text-natural-green outline-none text-natural-charcoal/80"
              >
                Portals <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white border border-natural-beige rounded-2xl shadow-xl p-3 grid grid-cols-1 gap-1.5 z-50 hidden group-hover/menu:block hover:block">
                <div className="p-2 border-b border-slate-50 mb-1">
                  <span className="text-[10px] font-bold text-[#C29B38] uppercase tracking-wider block">School Member Access</span>
                </div>
                
                <button 
                  onClick={onLoginClick}
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-charcoal"
                >
                  <Users className="w-4 h-4 text-natural-green" />
                  <div>
                    <span className="font-bold block text-left">Student Portal Dashboard</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">Check Results & Attendance ledger</span>
                  </div>
                </button>

                <button 
                  onClick={onLoginClick}
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-charcoal"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C29B38]" />
                  <div>
                    <span className="font-bold block text-left">Parent Portal Link</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">Monitor transcript records in real time</span>
                  </div>
                </button>

                <button 
                  onClick={onLoginClick}
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-charcoal"
                >
                  <Briefcase className="w-4 h-4 text-natural-green" />
                  <div>
                    <span className="font-bold block text-left">Staff & Teacher Hub</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">Log grades, configure CBT testing</span>
                  </div>
                </button>

                <button 
                  onClick={onLoginClick}
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-charcoal md:text-left"
                >
                  <Building className="w-4 h-4 text-slate-800" />
                  <div>
                    <span className="font-bold block text-left">Admin Command Center</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">Rosters, financials & ID badge generator</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Dropdown: Admissions */}
            <div className="relative group/menu">
              <button 
                onClick={() => setCurrentTab('admissions')}
                className={`flex items-center gap-1 pb-1 px-1 transition-all cursor-pointer border-b-2 hover:text-natural-green outline-none ${
                  currentTab === 'admissions'
                    ? 'text-natural-green border-natural-green font-bold'
                    : 'border-transparent text-natural-charcoal/80'
                }`}
              >
                Admissions <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-natural-beige rounded-2xl shadow-xl p-3 grid grid-cols-1 gap-1 z-50 hidden group-hover/menu:block hover:block">
                <div className="p-2 border-b border-slate-50 mb-1">
                  <span className="text-[10px] font-bold text-natural-green uppercase tracking-wider block">Admissions Portal</span>
                </div>
                <button 
                  onClick={() => setCurrentTab('admissions')}
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-green font-semibold"
                >
                  <UploadCloud className="w-4 h-4 text-natural-green" />
                  <div>
                    <span className="font-bold block text-left">Apply Online Now</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">Fill certified student biodata</span>
                  </div>
                </button>
                <button 
                  onClick={() => { setCurrentTab('admissions'); setActiveModal('requirements'); }} 
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-charcoal"
                >
                  <FileText className="w-4 h-4 text-[#C29B38]" />
                  <div>
                    <span className="font-bold block text-left">Entry Requirements</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">Syllabus benchmarks & declarations</span>
                  </div>
                </button>
                <button 
                  onClick={() => { setCurrentTab('admissions'); setActiveModal('support'); }} 
                  className="w-full text-left p-2 hover:bg-natural-light rounded-xl transition-all flex items-center gap-3 text-xs text-natural-charcoal"
                >
                  <Search className="w-4 h-4 text-natural-green" />
                  <div>
                    <span className="font-bold block text-left">Check Admission Status</span>
                    <span className="text-[10px] text-natural-charcoal/60 block text-left">Lookup biometric code approval</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Events schedule link */}
            <button 
              onClick={() => setCurrentTab('events')}
              className={`pb-1 px-1 transition-all cursor-pointer border-b-2 hover:text-natural-green outline-none ${
                currentTab === 'events' 
                  ? 'text-natural-green border-natural-green font-bold' 
                  : 'border-transparent text-natural-charcoal/80'
              }`}
            >
              School Events
            </button>

            {/* Contact Support link */}
            <button 
              onClick={() => setCurrentTab('contact')}
              className={`pb-1 px-1 transition-all cursor-pointer border-b-2 hover:text-natural-green outline-none ${
                currentTab === 'contact' 
                  ? 'text-natural-green border-natural-green font-bold' 
                  : 'border-transparent text-natural-charcoal/80'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Call-to-action School Portal Launcher and Mobile menu trigger */}
          <div className="flex items-center gap-3">
            {currentRole === 'guest' ? (
              <button
                onClick={onLoginClick}
                id="cta-portal-button"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-natural-green hover:bg-natural-green/90 active:scale-95 transition-all outline-none rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
              >
                School Portal <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('portal')}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs outline-none cursor-pointer flex items-center gap-2 ${
                    currentTab === 'portal'
                      ? 'bg-natural-green text-white font-bold border border-natural-green'
                      : 'bg-white hover:bg-natural-light text-natural-charcoal border border-natural-beige'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-[#C29B38]" /> Portal Dashboard
                </button>
                <button
                  onClick={() => {
                    setRole('guest', 'guest');
                    setCurrentTab('home');
                  }}
                  className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl cursor-pointer transition-all"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 bg-natural-light hover:bg-[#E9E5D9] border border-natural-beige rounded-xl text-natural-charcoal"
              title="Menu Options"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 animate-pulse" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Expanded Menu Section */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-natural-beige p-4 space-y-4 animate-fade-in z-[40]">
            
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button 
                onClick={() => { setMobileMenuOpen(false); setCurrentTab('home'); }}
                className={`p-2.5 rounded-lg text-center transition-all cursor-pointer ${
                  currentTab === 'home' 
                    ? 'bg-natural-green text-white font-bold' 
                    : 'bg-natural-light/60 text-natural-charcoal hover:bg-natural-light'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); setCurrentTab('about'); }}
                className={`p-2.5 rounded-lg text-center transition-all cursor-pointer ${
                  currentTab === 'about'
                    ? 'bg-natural-green text-white font-bold'
                    : 'bg-natural-light/60 text-natural-charcoal hover:bg-natural-light'
                }`}
              >
                About Us
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); setCurrentTab('academics'); }}
                className={`p-2.5 rounded-lg text-center transition-all cursor-pointer ${
                  currentTab === 'academics'
                    ? 'bg-natural-green text-white font-bold'
                    : 'bg-natural-light/60 text-natural-charcoal hover:bg-natural-light'
                }`}
              >
                Academics
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); setCurrentTab('events'); }}
                className={`p-2.5 rounded-lg text-center transition-all cursor-pointer ${
                  currentTab === 'events'
                    ? 'bg-natural-green text-white font-bold'
                    : 'bg-natural-light/60 text-natural-charcoal hover:bg-natural-light'
                }`}
              >
                Events Schedule
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); setCurrentTab('contact'); }}
                className={`p-2.5 rounded-lg text-center transition-all cursor-pointer ${
                  currentTab === 'contact'
                    ? 'bg-natural-green text-white font-bold'
                    : 'bg-natural-light/60 text-natural-charcoal hover:bg-natural-light'
                }`}
              >
                Contact Us
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); setCurrentTab('admissions'); }}
                className={`p-2.5 rounded-lg text-center transition-all col-span-1 cursor-pointer font-bold uppercase tracking-wider ${
                  currentTab === 'admissions'
                    ? 'bg-natural-green text-white border border-natural-green'
                    : 'bg-emerald-50 text-natural-green hover:bg-emerald-100'
                }`}
              >
                Apply Online
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-natural-green uppercase tracking-widest block font-extrabold px-1">Interactive Sections</span>
              
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button 
                  onClick={() => { setMobileMenuOpen(false); setActiveModal('requirements'); }}
                  className="p-2 bg-slate-50 hover:bg-natural-light rounded-lg text-left font-bold flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C29B38]" /> Requirements
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setActiveModal('library'); }}
                  className="p-2 bg-slate-50 hover:bg-natural-light rounded-lg text-left font-bold flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-natural-green" /> E-Library
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setActiveModal('gallery'); }}
                  className="p-2 bg-slate-50 hover:bg-natural-light rounded-lg text-left font-bold flex items-center gap-1.5"
                >
                  <Image className="w-3.5 h-3.5 text-[#C29B38]" /> Gallery
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setActiveModal('faq'); }}
                  className="p-2 bg-slate-50 hover:bg-natural-light rounded-lg text-left font-bold flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-natural-green" /> FAQ Help
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setActiveModal('careers'); }}
                  className="p-2 bg-slate-50 hover:bg-natural-light rounded-lg text-left font-bold flex items-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#C29B38]" /> Careers
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setActiveModal('support'); }}
                  className="p-2 bg-slate-50 hover:bg-natural-light rounded-lg text-left font-bold flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-natural-green" /> Status / Ticket
                </button>
              </div>

            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-natural-green uppercase tracking-widest block font-extrabold px-1">Academy Account</span>
              {currentRole === 'guest' ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                  className="w-full text-center py-2.5 bg-natural-green text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-natural-green/90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Building className="w-4 h-4" /> Sign In to Portal
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); setCurrentTab('portal'); }}
                    className="p-3 bg-natural-green text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <Building className="w-4 h-4" /> My Portal
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setRole('guest', 'guest');
                      setCurrentTab('home');
                    }}
                    className="p-3 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-center"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </header>

      {/* Hero Banner Area */}
      {currentTab === 'home' && (
        <section className="relative overflow-hidden py-24 md:py-32 bg-natural-green text-[#FDFBF7]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(198,138,83,0.15),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E9E5D9] text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-natural-clay text-natural-clay" /> Top Ranked Pre-Academic Institution
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.1] text-white">
              Cultivating Intellectual <span className="text-natural-clay">Curiosity & Leadership</span>
            </h1>
            <p className="text-base sm:text-lg text-[#E9E5D9] max-w-xl leading-relaxed font-serif font-semibold italic">
              "Academic Excellence Is Our Pride"
            </p>
            <p className="text-sm text-[#E9E5D9]/90 max-w-xl leading-relaxed font-normal">
              For over forty years, NEW UNIQUE ACADEMY has fostered a rigorous bilingual study curriculum, outstanding creative arts programs, and championship sports squads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onLoginClick}
                className="px-8 py-4 text-natural-charcoal font-bold bg-[#FDFBF7] hover:bg-[#E9E5D9] transform hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                Enter School Hub <ArrowRight className="w-4 h-4 text-natural-green" />
              </button>
              <a
                href="#admissions"
                className="px-8 py-4 bg-transparent border border-white/30 hover:bg-white/10 hover:border-white text-white font-medium transition-all rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                Inquire Today
              </a>
            </div>
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-white block">99.4%</span>
                <span className="text-xs text-[#E9E5D9]/80 font-medium tracking-wider uppercase">College Path</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-white block">8:1</span>
                <span className="text-xs text-[#E9E5D9]/80 font-medium tracking-wider uppercase">Student Ratio</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-white block">15+</span>
                <span className="text-xs text-[#E9E5D9]/80 font-medium tracking-wider uppercase">AP Courses</span>
              </div>
            </div>
          </div>
          {/* Hero Static Collage Design */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative mx-auto w-[380px] h-[440px]">
              {/* Back card decoration */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl bg-natural-clay/20 border border-white/10 transform rotate-1"></div>
              {/* Front Image area */}
              <img
                src="/src/assets/images/front_page_1779414015980.png"
                alt="New Unique Academy Front Campus"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl border border-natural-beige"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-[#FDFBF7]/95 backdrop-blur border border-natural-beige p-4 rounded-xl flex items-center gap-4 shadow-md">
                <div className="bg-natural-green/10 p-2 rounded-lg text-natural-green">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-natural-green font-bold block uppercase tracking-wider">Academics</span>
                  <span className="text-sm font-bold text-natural-charcoal">Semester 2 Registrations Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* About / Pillars */}
      {currentTab === 'home' && (
        <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold text-natural-green tracking-widest uppercase">Our Pedagogy</h2>
          <p className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-natural-charcoal">
            A Balanced Ecosystem of Excellence
          </p>
          <div className="h-1.5 w-16 bg-natural-clay mx-auto rounded-full"></div>
          <p className="text-natural-charcoal/80 text-sm sm:text-base leading-relaxed">
            We challenge minds, fuel talents, and shape character traits through focused academic rigor, global community service, and outstanding extracurricular facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xs border border-natural-beige hover:shadow-md transition-shadow group">
            <div className="p-3 bg-natural-light text-natural-green rounded-xl w-fit group-hover:bg-natural-green group-hover:text-white transition-all">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-natural-charcoal mt-6 mb-3">Academic Intensity</h3>
            <p className="text-natural-charcoal/70 text-sm leading-relaxed">
              Tailored STEM curricula combined with extensive classical humanities, teaching critical reasoning, argumentation, and research integrity.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xs border border-natural-beige hover:shadow-md transition-shadow group">
            <div className="p-3 bg-natural-light text-natural-green rounded-xl w-fit group-hover:bg-natural-green group-hover:text-white transition-all">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-natural-charcoal mt-6 mb-3">Community Integration</h3>
            <p className="text-natural-charcoal/70 text-sm leading-relaxed">
              A comprehensive calendar of public seminars, volunteer initiatives, art galleries, and dynamic guest lecturers accessible to students.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xs border border-natural-beige hover:shadow-md transition-shadow group">
            <div className="p-3 bg-natural-light text-natural-green rounded-xl w-fit group-hover:bg-natural-green group-hover:text-white transition-all">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-natural-charcoal mt-6 mb-3">Personal Mentorship</h3>
            <p className="text-natural-charcoal/70 text-sm leading-relaxed">
              Small classroom clusters with dedicated advisory guides, fostering deep student-teacher rapport, mental health, and individual career path planning.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* Curriculum / Programs */}
      {currentTab === 'home' && (
        <section id="academics" className="py-20 bg-natural-light/30 border-y border-natural-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xs font-bold text-natural-green tracking-widest uppercase">Advisory Curriculums</h2>
              <h3 className="text-3xl font-serif font-bold tracking-tight text-natural-charcoal leading-tight">
                Designed to Prepare Minds for Top Global Universities
              </h3>
              <p className="text-natural-charcoal/80 text-sm leading-relaxed">
                Our educational scheme builds logical foundation layers before expanding into interdisciplinary electives, laboratory studies, and senior thesis projects.
              </p>
              <div className="space-y-4 pt-2">
                {[
                  'Bilingual Language & Contemporary Lit',
                  'Advanced Placement STEM Course Sequences',
                  'Pre-Engineering Lab & Software Logic Foundations',
                  'World History, Treaties & Civic Rhetoric'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-natural-green shrink-0" />
                    <span className="text-sm font-semibold text-natural-charcoal">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                <span className="text-xs font-bold text-natural-green uppercase bg-natural-light border border-natural-beige px-2.5 py-1 rounded">DEPT: Mathematics</span>
                <h4 className="font-serif font-bold text-natural-charcoal">Advanced Calculus & Algebra</h4>
                <p className="text-xs text-natural-charcoal/70">Matrices, linear equations, analytical algebra, and integral operations.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                <span className="text-xs font-bold text-natural-green uppercase bg-natural-light border border-natural-beige px-2.5 py-1 rounded">DEPT: Sciences</span>
                <h4 className="font-serif font-bold text-natural-charcoal">Molecular Biology & Lab Assays</h4>
                <p className="text-xs text-natural-charcoal/70">Cellular structures, heredity, lab protocols, and environmental impact.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                <span className="text-xs font-bold text-natural-green uppercase bg-natural-light border border-natural-beige px-2.5 py-1 rounded">DEPT: English</span>
                <h4 className="font-serif font-bold text-natural-charcoal">Creative Writing & World Literature</h4>
                <p className="text-xs text-natural-charcoal/70">Comparative essays, vocabulary expansion, rhetoric styles, and poetry analysis.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                <span className="text-xs font-bold text-natural-green uppercase bg-natural-light border border-natural-beige px-2.5 py-1 rounded">DEPT: Humanities</span>
                <h4 className="font-serif font-bold text-natural-charcoal">Global History & Civil Treaties</h4>
                <p className="text-xs text-natural-charcoal/70">Civics treaties, geopolitical revolutions, social history, and demographics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Dynamic Sync Events Section */}
      {currentTab === 'home' && (
        <section id="events" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-natural-green tracking-widest uppercase">Live Registry</h2>
            <h3 className="text-3xl font-serif font-bold tracking-tight text-natural-charcoal">
              Upcoming School Calendar & Announcements
            </h3>
          </div>
          <button
            onClick={onLoginClick}
            className="text-xs font-bold text-natural-green hover:text-white flex items-center gap-1.5 bg-natural-light hover:bg-natural-green px-4 py-2 border border-natural-beige rounded-xl transition-all cursor-pointer"
          >
            Access Full Interactive Scheduler <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-natural-beige text-natural-charcoal/50">
            No upcoming public events scheduled.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((ev) => {
              const eventDate = new Date(ev.date + 'T00:00:00');
              const dayStr = eventDate.getDate();
              const monthStr = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
              
              const typeColorMap = {
                academic: 'bg-natural-light text-natural-green border-natural-beige',
                holiday: 'bg-natural-light text-natural-clay border-natural-beige',
                sports: 'bg-natural-light text-natural-green border-natural-beige',
                arts: 'bg-natural-light text-natural-clay border-natural-beige',
                excursion: 'bg-natural-light text-natural-green border-natural-beige'
              };

              return (
                <div key={ev.id} className="bg-white rounded-2xl border border-natural-beige overflow-hidden flex flex-col justify-between shadow-xs p-6 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {/* Date Badge */}
                      <div className="flex items-center gap-2.5">
                        <div className="bg-natural-green text-white font-serif font-bold text-sm tracking-tight w-12 h-12 rounded-xl flex flex-col justify-center items-center shrink-0">
                          <span className="leading-none text-base font-black">{dayStr}</span>
                          <span className="text-[9px] font-sans font-bold tracking-widest uppercase">{monthStr}</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-natural-charcoal bg-natural-light px-1.5 py-0.5 rounded block w-fit">{ev.time || 'All Day'}</span>
                          <span className="text-xs text-natural-charcoal/60 mt-0.5 block">{ev.location}</span>
                        </div>
                      </div>

                      {/* Event Type Badge */}
                      <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border ${typeColorMap[ev.type] || 'bg-natural-light text-natural-charcoal'}`}>
                        {ev.type}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-[#2D2A26] text-base line-clamp-1">{ev.title}</h4>
                    <p className="text-xs text-natural-charcoal/70 leading-relaxed line-clamp-2">
                      {ev.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      )}

      {/* Contact / Inquiry / Online Student Registration Form */}
      {(currentTab === 'home' || currentTab === 'admissions') && (
        <section id="admissions" className="py-20 bg-natural-light/30 border-t border-natural-beige scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-bold text-natural-green tracking-widest uppercase">Admissions Registry</h2>
            <h3 className="text-2xl sm:text-4xl font-serif font-black text-natural-charcoal tracking-tight">Enroll and Register Student Profile</h3>
            <p className="text-natural-charcoal/70 text-xs sm:text-sm leading-relaxed">
              Seeking official registration at NEW UNIQUE ACADEMY? Complete the certified online biodata form below to instantly secure an Admission ID Card and initiate a secure student/parent ledger.
            </p>

            {/* Tab Swapper */}
            <div className="inline-flex p-1.5 bg-natural-beige/35 border border-natural-beige rounded-2xl gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveAdmissionsTab('registration');
                  setGeneratedStudent(null);
                }}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  activeAdmissionsTab === 'registration'
                    ? 'bg-natural-green text-white shadow-md'
                    : 'text-natural-charcoal/60 hover:text-natural-charcoal'
                }`}
              >
                Online Registration (Biodata)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveAdmissionsTab('inquiry');
                  setGeneratedStudent(null);
                }}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  activeAdmissionsTab === 'inquiry'
                    ? 'bg-natural-green text-white shadow-md'
                    : 'text-natural-charcoal/60 hover:text-natural-charcoal'
                }`}
              >
                General Inquiry Seminars
              </button>
            </div>
          </div>

          {!generatedStudent ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column Info panel */}
              <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border border-natural-beige shadow-xs space-y-6">
                <div>
                  <h4 className="font-serif font-bold text-natural-charcoal text-base">Admission Guidelines</h4>
                  <span className="text-[9.5px] text-natural-green font-bold uppercase tracking-widest block mt-0.5">2026/2027 Entry Protocol</span>
                </div>

                <div className="space-y-4 text-xs text-natural-charcoal/80">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-natural-green/10 text-natural-green font-bold flex items-center justify-center shrink-0">1</div>
                    <p className="leading-relaxed">Provide absolute civil biodata details, full emergency contacts, previous academic rosters, and chronic medical history records.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-natural-green/10 text-natural-green font-bold flex items-center justify-center shrink-0">2</div>
                    <p className="leading-relaxed">Pick or upload a profile passport photo to represent yourself on the official Academy registers.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-natural-green/10 text-natural-green font-bold flex items-center justify-center shrink-0">3</div>
                    <p className="leading-relaxed">Upon registration, our digital index immediately assigns a secure Admission Code (e.g. <b>NUA-26-XXXX</b>) and appends a Student ID Card.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-natural-green/10 text-natural-green font-bold flex items-center justify-center shrink-0">4</div>
                    <p className="leading-relaxed">Use your registration credentials to sign into the Member Hub with password <code className="bg-natural-light font-mono px-1 rounded text-natural-charcoal">student123</code> to review homework and fulfill school fees.</p>
                  </div>
                </div>

                <div className="border-t border-natural-beige/60 pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <Mail className="w-4 h-4 text-natural-green" />
                    <div>
                      <span className="text-natural-charcoal/50 block text-[10px]">Office Registrar Desk</span>
                      <a href="mailto:omoleyemi82@gmail.com" className="font-semibold hover:underline text-natural-charcoal">omoleyemi82@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <MessageSquare className="w-4 h-4 text-natural-green" />
                    <div>
                      <span className="text-natural-charcoal/50 block text-[10px]">Primary Desk Representative</span>
                      <span className="font-semibold text-natural-charcoal">+1 (555) 304-4000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Form panel */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-natural-beige shadow-sm">
                {activeAdmissionsTab === 'inquiry' ? (
                  // General Inquiry render
                  submitted ? (
                    <div className="text-center py-12 space-y-4 animate-fade-in">
                      <div className="w-16 h-16 bg-natural-light text-natural-green rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-10 h-10 text-natural-green" />
                      </div>
                      <h4 className="text-xl font-serif font-bold text-natural-charcoal">Inquiry Written</h4>
                      <p className="text-natural-charcoal/60 text-xs max-w-sm mx-auto leading-relaxed">
                        Thank you, <span className="font-semibold text-natural-charcoal">{inquiryName}</span>. Our admissions registrar office will coordinate an invitation to your registered address <span className="font-semibold text-natural-charcoal">{inquiryEmail}</span> shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleInquiry} className="space-y-5 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase text-natural-green/80 tracking-widest">Representative Name</label>
                          <input
                            type="text"
                            required
                            value={inquiryName}
                            onChange={(e) => setInquiryName(e.target.value)}
                            placeholder="Robert Smith"
                            className="w-full text-xs px-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase text-natural-green/80 tracking-widest">Inquiry Email Address</label>
                          <input
                            type="email"
                            required
                            value={inquiryEmail}
                            onChange={(e) => setInquiryEmail(e.target.value)}
                            placeholder="smith.academic@mail.com"
                            className="w-full text-xs px-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase text-natural-green/80 tracking-widest">Inquiry Message Detail</label>
                        <textarea
                          required
                          rows={4}
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          placeholder="Provide details of grade level targeting and previous background info..."
                          className="w-full text-xs px-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#C29B38] hover:bg-[#A8822A] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer leading-none"
                      >
                        Submit General Inquiry
                      </button>
                    </form>
                  )
                ) : (
                  // Multi-field Biodata Registration Form
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!regName || !regEmail || !regGuardianName || !regGuardianPhone) {
                      alert('Please completely fill all authorized mandatory fields.');
                      return;
                    }
                    const adNo = `NUA-26-${Math.floor(1000 + Math.random() * 9000)}`;
                    const studentData = {
                      name: regName,
                      email: regEmail,
                      avatar: selectedAvatar,
                      gradeLevel: regGrade,
                      guardianName: regGuardianName,
                      guardianPhone: regGuardianPhone,
                      
                      admissionNumber: adNo,
                      gender: regGender,
                      dateOfBirth: regDob || '2009-06-15',
                      stateOrCountry: regCountry,
                      homeAddress: regAddress || '123 Preston Oaks Blvd, Preston TX',
                      guardianEmail: regGuardianEmail || `${regGuardianName.toLowerCase().replace(/\s/g, '.')}@mail.com`,
                      studentPhone: regPhone || regGuardianPhone,
                      medicalInfo: regMedical || 'No known chronic conditions, fully fit.',
                      previousSchool: regPrevSchool || 'Preston Middle School',
                      emergencyContactName: regEmergencyName || regGuardianName,
                      emergencyContactPhone: regEmergencyPhone || regGuardianPhone,

                      tuitionTotal: 4500,
                      tuitionPaid: 0,
                      paymentMethod: 'None',
                      paymentDate: '',
                      paymentReceiptId: ''
                    };
                    addStudent(studentData);
                    setGeneratedStudent(studentData);
                  }} className="space-y-6 animate-fade-in text-xs text-natural-charcoal">
                    
                    {/* Section heading */}
                    <div className="border-b border-natural-beige pb-3">
                      <h4 className="font-serif font-black text-[#1A365D] text-sm uppercase tracking-wide">1. Core Demography & Biodata</h4>
                      <p className="text-[10px] text-natural-charcoal/50">Primary contact credentials logged on regional maps</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Full Student Name *</label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Julian Fernandez"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Student Email Address *</label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="e.g. j.fernandez@academy.org"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Gender *</label>
                        <select
                          value={regGender}
                          onChange={(e) => setRegGender(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none text-natural-charcoal font-medium"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={regDob}
                          onChange={(e) => setRegDob(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-natural-light/40 border border-natural-beige rounded-xl outline-none text-natural-charcoal font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Admission Class Target *</label>
                        <select
                          value={regGrade}
                          onChange={(e) => setRegGrade(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none text-natural-charcoal font-semibold"
                        >
                          <option value="Grade 10">Grade 10 (Sophomore)</option>
                          <option value="Grade 11">Grade 11 (Junior)</option>
                          <option value="Grade 12">Grade 12 (Senior)</option>
                        </select>
                      </div>
                    </div>

                    {/* Passport Photo selection slider */}
                    <div className="space-y-2 bg-natural-light/30 border border-natural-beige p-4 rounded-xl">
                      <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Select Candidate Passport Photo *</label>
                      <p className="text-[10px] text-natural-charcoal/50 leading-none">Pick a verified biometric photo to synthesize on your ID badge:</p>
                      
                      <div className="flex flex-wrap gap-2 pt-1.5">
                        {avatarOptions.map((opt, id) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedAvatar(opt.url)}
                            className={`relative border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                              selectedAvatar === opt.url ? 'border-natural-green ring-2 ring-natural-green' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={opt.url} alt={opt.label} className="w-12 h-12 object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">State / Country of Origin *</label>
                        <input
                          type="text"
                          required
                          value={regCountry}
                          onChange={(e) => setRegCountry(e.target.value)}
                          placeholder="TX, United States"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Student Active Mobile *</label>
                        <input
                          type="text"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+1 (555) 304-8021"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Home Address *</label>
                      <textarea
                        required
                        rows={2}
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="742 Preston Oaks Boulevard, Preston TX 75220"
                        className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Chronic Medical Allergies / History</label>
                        <input
                          type="text"
                          value={regMedical}
                          onChange={(e) => setRegMedical(e.target.value)}
                          placeholder="e.g. Asthma, glucose deficiency, penicillin allergy"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Previous School Roster attended</label>
                        <input
                          type="text"
                          value={regPrevSchool}
                          onChange={(e) => setRegPrevSchool(e.target.value)}
                          placeholder="e.g. Preston High Middle School"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                    </div>

                    {/* Guardian Sub Form */}
                    <div className="border-b border-natural-beige pb-3 pt-2">
                      <h4 className="font-serif font-black text-[#1A365D] text-sm uppercase tracking-wide">2. Parent / Guardian Records</h4>
                      <p className="text-[10px] text-natural-charcoal/50">Details for portal account mapping and notification delivery</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Guardian Full Name *</label>
                        <input
                          type="text"
                          required
                          value={regGuardianName}
                          onChange={(e) => setRegGuardianName(e.target.value)}
                          placeholder="Robert Fernandez"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Guardian Phone No *</label>
                        <input
                          type="text"
                          required
                          value={regGuardianPhone}
                          onChange={(e) => setRegGuardianPhone(e.target.value)}
                          placeholder="+1 (555) 304-4211"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Guardian Email Address</label>
                        <input
                          type="email"
                          value={regGuardianEmail}
                          onChange={(e) => setRegGuardianEmail(e.target.value)}
                          placeholder="robert.fer@mail.com"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FDFCF7]/60 p-4 border border-dashed border-natural-beige rounded-xl">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Emergency Contact Name *</label>
                        <input
                          type="text"
                          required
                          value={regEmergencyName}
                          onChange={(e) => setRegEmergencyName(e.target.value)}
                          placeholder="e.g. Aunt Clara Johnson"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Emergency Contact Mobile *</label>
                        <input
                          type="text"
                          required
                          value={regEmergencyPhone}
                          onChange={(e) => setRegEmergencyPhone(e.target.value)}
                          placeholder="e.g. +1 (555) 832-1111"
                          className="w-full text-xs px-3.5 py-2.5 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#1A365D] hover:bg-[#1A365D]/90 text-[#C29B38] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer select-none leading-none flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-[#C29B38]" /> Process Certified School Registration
                    </button>
                  </form>
                )}
              </div>

            </div>
          ) : (
            // Automatically Generated Profile / ID Badge Layout Screen
            <div className="bg-white border-2 border-[#C29B38]/40 p-6 sm:p-10 rounded-3xl shadow-xl max-w-4xl mx-auto space-y-8 animate-fade-in text-natural-charcoal">
              
              <div className="flex flex-col md:flex-row items-center justify-between border-b border-natural-beige/60 pb-6 gap-4 text-center md:text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block font-extrabold">Registry Account Synchronized Successfully!</span>
                    <h3 className="text-xl font-serif font-black text-natural-charcoal mt-1">NEW UNIQUE ACADEMY ADMISSIONS REGISTER</h3>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2.5 bg-natural-light hover:bg-natural-beige/30 hover:border-natural-green/30 border border-natural-beige rounded-xl text-natural-charcoal text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 shrink-0 text-natural-green" /> Print Admission Records
                  </button>
                </div>
              </div>

              {/* ID Badge Container */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center" id="printable-area-badge">
                
                {/* Visual ID Card Left panel */}
                <div className="md:col-span-5 bg-gradient-to-br from-[#1A365D] to-[#2A4B80] p-1.5 rounded-3xl border-4 border-[#C29B38] shadow-lg max-w-xs mx-auto w-full text-[#FDFCF7]">
                  <div className="bg-[#1A365D] rounded-2xl p-5 relative overflow-hidden space-y-5 text-center flex flex-col items-center">
                    
                    {/* Background gold badge motif decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C29B38]/10 rounded-full blur-xl select-none"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-lg select-none"></div>

                    {/* ID Header */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 bg-white p-0.5 rounded-full flex items-center justify-center shadow-md shrink-0">
                        <img 
                          src="/src/assets/images/school_logo_1779413996009.png" 
                          alt="NUA Crest" 
                          className="w-8 h-8 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h4 className="text-xs font-serif font-bold tracking-widest leading-none">NEW UNIQUE ACADEMY</h4>
                      <span className="text-[7.5px] uppercase font-bold tracking-widest text-[#C29B38] block leading-none">Student Identification</span>
                    </div>

                    {/* Passport Photo */}
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C29B38] to-[#1A365D] blur-xs"></div>
                      <img
                        src={generatedStudent.avatar}
                        alt="Student Passport"
                        className="w-24 h-24 rounded-full object-cover border-2 border-white relative shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Student Metadata */}
                    <div className="space-y-1 text-center w-full z-10">
                      <h5 className="font-serif font-bold text-sm tracking-wide text-white block uppercase">{generatedStudent.name}</h5>
                      <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-[8.5px] font-extrabold uppercase tracking-widest border border-white/20 inline-block text-[#C29B38]">
                        Student status: {generatedStudent.gradeLevel}
                      </span>
                    </div>

                    {/* Admissions Codes */}
                    <div className="w-full bg-[#142A4A] border border-white/10 p-3 rounded-xl divide-y divide-white/10 text-[9.5px] font-medium text-left space-y-1.5 text-slate-200">
                      <div className="flex justify-between">
                        <span className="text-white/60">ADMISSION NO:</span>
                        <span className="font-mono text-[#C29B38] font-bold">{generatedStudent.admissionNumber}</span>
                      </div>
                      <div className="flex justify-between pt-1.5">
                        <span className="text-white/60">DATE SIGNED:</span>
                        <span>{new Date().toISOString().split('T')[0]}</span>
                      </div>
                      <div className="flex justify-between pt-1.5">
                        <span className="text-white/60">GENDER:</span>
                        <span>{generatedStudent.gender}</span>
                      </div>
                    </div>

                    {/* Simulated barcode */}
                    <div className="space-y-1 flex flex-col items-center select-none w-full border-t border-white/10 pt-2 opacity-85">
                      <div className="flex gap-0.5 h-6 w-40 justify-center">
                        {[1,2,3,4,1,3,2,4,1,2,3,1,4,2,3,1,2,4,3,1,2,1,3,4].map((width, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-xs shrink-0"
                            style={{ width: `${width}px` }}
                          />
                        ))}
                      </div>
                      <span className="text-[7.5px] font-mono tracking-widest font-bold text-white/50 block">SECURE CREDENTIAL SYSTEM</span>
                    </div>

                  </div>
                </div>

                {/* Full Biodata Sheet Right panel */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-natural-light/50 p-5 rounded-2xl border border-natural-beige">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-natural-green border-b border-natural-beige pb-1.5 mb-3 flex items-center gap-1.5">
                      <IdCard className="w-4 h-4 text-[#C29B38]" /> Official Registry Biodata Parameters
                    </h5>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                      <div>
                        <span className="text-[10px] text-natural-charcoal/50 block uppercase font-bold leading-none">Admission Registration Email</span>
                        <span className="font-semibold text-natural-charcoal font-mono">{generatedStudent.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-natural-charcoal/50 block uppercase font-bold leading-none">Date of Birth Registered</span>
                        <span className="font-semibold text-natural-charcoal">{generatedStudent.dateOfBirth}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-natural-charcoal/50 block uppercase font-bold leading-none">Origin State/Country</span>
                        <span className="font-semibold text-natural-charcoal">{generatedStudent.stateOrCountry}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-natural-charcoal/50 block uppercase font-bold leading-none">Active Student Phone</span>
                        <span className="font-semibold text-natural-charcoal">{generatedStudent.studentPhone}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-natural-charcoal/50 block uppercase font-bold leading-none">Residential Address</span>
                        <span className="font-semibold text-natural-charcoal">{generatedStudent.homeAddress}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-natural-charcoal/50 block uppercase font-bold leading-none">Chronic Medical Alert Profile</span>
                        <span className="font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5 border border-rose-100">{generatedStudent.medicalInfo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-natural-charcoal/50 block uppercase font-bold leading-none">Previous Academy attended</span>
                        <span className="font-semibold text-natural-charcoal">{generatedStudent.previousSchool}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-natural-charcoal/50 block uppercase font-bold leading-none font-bold">Guardian Representative</span>
                        <span className="font-semibold text-natural-charcoal">{generatedStudent.guardianName} ({generatedStudent.guardianPhone})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-natural-charcoal/50 block uppercase font-bold leading-none font-bold">Emergency Alert contact</span>
                        <span className="font-semibold text-natural-charcoal">{generatedStudent.emergencyContactName} ({generatedStudent.emergencyContactPhone})</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FDFCF7] border border-[#C29B38]/40 p-5 rounded-2xl relative space-y-3">
                    <div className="flex items-center gap-2 text-[#1A365D]">
                      <Activity className="w-5 h-5 text-[#C29B38]" />
                      <span className="text-xs font-bold uppercase tracking-wider block">Access Instructions</span>
                    </div>
                    <p className="text-[11px] text-natural-charcoal/85 leading-relaxed">
                      Now that your electronic record is finalized, you can access the school's virtual learning dashboard immediately. Enter the <b>School Portal</b> using the menu in the navigation bar using secure default passwords:
                    </p>
                    <div className="grid grid-cols-2 gap-3 pb-1">
                      <div className="p-2.5 bg-[#1A365D]/5 border border-natural-beige rounded-xl text-center text-xs">
                        <span className="font-bold text-natural-green block text-[10px]">STUDENT ACCESS</span>
                        <code className="bg-[#1A365D]/20 block py-1 px-1 rounded font-semibold mt-1 font-mono text-natural-charcoal">student123</code>
                      </div>
                      <div className="p-2.5 bg-[#1A365D]/5 border border-natural-beige rounded-xl text-center text-xs">
                        <span className="font-bold text-natural-green block text-[10px]">PARENT/GUARDIAN</span>
                        <code className="bg-[#1A365D]/20 block py-1 px-1 rounded font-semibold mt-1 font-mono text-natural-charcoal">parent123</code>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button
                        onClick={() => {
                          // Log them in securely and route them straight to portal!
                          setRole('student', `s_${Date.now() - 1000}`); // use latest dynamically registered student
                          onLoginClick();
                        }}
                        className="flex-1 py-3.5 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl text-center cursor-pointer transition-all shadow-xs leading-none"
                      >
                        Sign in as Student
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedStudent(null);
                          setRegName('');
                          setRegEmail('');
                          setRegGuardianName('');
                          setRegGuardianPhone('');
                        }}
                        className="py-3.5 px-4 bg-natural-light hover:bg-[#E9E5D9] text-natural-charcoal font-bold text-xs uppercase tracking-widest rounded-xl text-center cursor-pointer transition-all border border-natural-beige leading-none"
                      >
                        Register New Student
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </section>
      )}

      {/* Dynamic Subpages Routing Viewports */}
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
        <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 bg-natural-light border border-natural-beige rounded-2xl flex items-center justify-center mx-auto text-natural-green shadow-xs">
            <ShieldAlert className="w-8 h-8 text-natural-green" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-natural-charcoal animate-fade-in">Authorized Access Required</h3>
            <p className="text-xs text-natural-charcoal/60 max-w-md mx-auto leading-relaxed">
              New Unique Academy portal contains sensitive educational parameters, secure grading sheets, attendance logs, and student tuition ledger boards. Please authenticate to continue securely.
            </p>
          </div>
          <button
            onClick={onLoginClick}
            className="px-6 py-3 bg-natural-green hover:bg-natural-green/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 outline-none"
          >
            Access Secure Sign-In <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-natural-charcoal text-[#E9E5D9]/90 py-12 border-t border-natural-beige text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div className="space-y-2">
            <span className="text-white font-serif font-bold text-lg uppercase tracking-wider block">NEW UNIQUE ACADEMY</span>
            <p className="text-[#E9E5D9]/70 italic">"Academic Excellence Is Our Pride"</p>
          </div>
          <div className="space-y-1">
            <span className="text-white font-bold">Campus Address</span>
            <p>Behind Fabian Hotel Zone C</p>
            <p className="text-natural-clay font-medium cursor-pointer" onClick={() => setActiveModal('support')}>omoleyemi82@gmail.com</p>
          </div>
          <div className="space-y-3 md:text-right">
            <p>© 2026 NEW UNIQUE ACADEMY. All campus rights reserved.</p>
            <div className="flex justify-center md:justify-end gap-4 text-[#E9E5D9]/50">
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveModal('support')}>Security Protocol</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveModal('terms')}>Registrar Terms</span>
            </div>
          </div>
        </div>
      </footer>

      {/* RENDER MODAL OVERLAYS */}
      {activeModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-natural-charcoal/70 backdrop-blur-sm transition-opacity"
            onClick={() => { setActiveModal(null); setSearchResult(null); setSupportInquirySubmitted(false); }}
          />
          
          <div className="relative bg-white border border-natural-beige rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-fade-in text-natural-charcoal leading-relaxed">
            
            {/* Modal Closer */}
            <button 
              onClick={() => { setActiveModal(null); setSearchResult(null); setSupportInquirySubmitted(false); }}
              className="absolute top-4 right-4 p-2 text-natural-charcoal/40 hover:text-natural-charcoal hover:bg-natural-light rounded-full transition-all cursor-pointer"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* A: ENTRY REQUIREMENTS MODAL */}
            {activeModal === 'requirements' && (
              <div className="space-y-6">
                <div className="border-b border-natural-beige pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-natural-green" />
                    <h3 className="text-xl font-serif font-black tracking-tight">Admission Entry Requirements & Benchmarks</h3>
                  </div>
                  <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block mt-0.5">Primary & Secondary Campus Regulations</span>
                </div>

                <div className="space-y-4 text-xs">
                  <p>
                    Candidates targetting registration at <b>NEW UNIQUE ACADEMY</b> must align with the official 2026/2027 entry assessment criteria:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-natural-light/60 rounded-xl border border-natural-beige space-y-2">
                      <span className="font-bold text-natural-green uppercase tracking-wide text-[10px] block">Nursery & Primary Placement</span>
                      <ul className="list-disc pl-4 space-y-1 text-natural-charcoal/80">
                        <li>Age validation certificate (Minimum 3 years old for Nursery level).</li>
                        <li>Elementary speech coordination & recognition tests.</li>
                        <li>Basic numeracy logic assessment exercises.</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-natural-light/60 rounded-xl border border-natural-beige space-y-2">
                      <span className="font-bold text-[#C29B38] uppercase tracking-wide text-[10px] block font-bold">Secondary Placement (Grade 10-12)</span>
                      <ul className="list-disc pl-4 space-y-1 text-natural-charcoal/80">
                        <li>Grade Score transcripts from past 3 consecutive academic semesters.</li>
                        <li>Certified entrance testing outcomes (Mathematics & English Composition).</li>
                        <li>Character rating testimonial letter signed by previous Principal.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2 bg-[#FDFCF7] border border-dashed border-natural-beige p-4 rounded-xl">
                    <span className="font-bold text-xs text-natural-charcoal block">Download Official Checklists & Syllabi</span>
                    <p className="text-[10.5px] text-natural-charcoal/70">Click to fetch the corresponding offline materials directly to your local file drive:</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a href="#" onClick={(e) => { e.preventDefault(); alert("Downloaded: NUA-Admissions-Handbook-2026.pdf (1.8MB)"); }} className="px-3 py-1.5 bg-white border border-natural-beige hover:border-natural-green text-[10.5px] font-semibold text-natural-green rounded-lg flex items-center gap-1.5 shadow-5xs">
                        <Download className="w-3.5 h-3.5" /> Admissions Booklet
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert("Downloaded: NUA-AP-Secondary-Syllabus.pdf (840KB)"); }} className="px-3 py-1.5 bg-white border border-natural-beige hover:border-natural-green text-[10.5px] font-semibold text-natural-green rounded-lg flex items-center gap-1.5 shadow-5xs">
                        <Download className="w-3.5 h-3.5" /> AP STEM Path Syllabus
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert("Downloaded: Parental-Financial-Agreement.pdf (320KB)"); }} className="px-3 py-1.5 bg-white border border-natural-beige hover:border-natural-green text-[10.5px] font-semibold text-natural-green rounded-lg flex items-center gap-1.5 shadow-5xs">
                        <Download className="w-3.5 h-3.5" /> Fee Ledger Schedule
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-natural-beige">
                  <a 
                    href="#admissions" 
                    onClick={() => setActiveModal(null)} 
                    className="flex-1 py-3 text-center bg-natural-green hover:bg-natural-green/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Go To Online Biodata Form
                  </a>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-3 bg-natural-light hover:bg-[#E9E5D9] text-natural-charcoal font-bold text-xs uppercase tracking-widest rounded-xl border border-natural-beige"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* B: DIGITAL E-LIBRARY REPOSITORIES MODAL */}
            {activeModal === 'library' && (
              <div className="space-y-6">
                <div className="border-b border-natural-beige pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-natural-green" />
                    <h3 className="text-xl font-serif font-black tracking-tight">Academic E-Library & Homework Resources</h3>
                  </div>
                  <span className="text-[10px] text-[#C29B38] font-bold uppercase tracking-widest block mt-0.5">Bilingual Reference Textbooks Shelf</span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-natural-charcoal/80">
                    Welcome to the <b>NEW UNIQUE ACADEMY Digital Bookshelf</b>. Registered students can review reference materials and curriculum textbooks offline:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Advanced Calculus & Analytical Algebra", auth: "Dr. Catherine Preston", level: "AP Grade 11/12", size: "14.2 MB", desc: "Matrices, integrals, algebra sequences, and differential vectors." },
                      { title: "Molecular Assays and Cell Heredity", auth: "Prof. Alan Turing", level: "Pre-Med Grade 10-12", size: "9.5 MB", desc: "Gene transcription cycles, chemical lab protocols, and bio-assays." },
                      { title: "Geopolitical Revolutions & Social Treaties", auth: "Hon. Clara Barton", level: "Humanities Core", size: "8.1 MB", desc: "World history, national constitutions, and rhetorical civic studies." },
                      { title: "Syllabi for Poetic Composition & Prose Study", auth: "Senior Adriaan van de Donk", level: "English Lit Core", size: "3.4 MB", desc: "Rhyming frameworks, analytical essays, syntax, and poetry structures." }
                    ].map((book, idx) => (
                      <div key={idx} className="bg-natural-light/50 border border-natural-beige p-4 rounded-xl flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-bold text-natural-green uppercase tracking-wide bg-white px-2 py-0.5 rounded border border-natural-beige">{book.level}</span>
                            <span className="text-[9px] text-natural-charcoal/50 font-mono">{book.size}</span>
                          </div>
                          <h4 className="font-serif font-bold text-xs text-natural-charcoal">{book.title}</h4>
                          <span className="text-[10px] block text-natural-charcoal/60">Author: {book.auth}</span>
                          <p className="text-[10.5px] text-natural-charcoal/70 leading-relaxed line-clamp-2">{book.desc}</p>
                        </div>
                        <button 
                          onClick={() => alert(`Simulating Secure Textbook Download: Preparing "${book.title}" [${book.size}] in background. Please log into the student portal to read interactive chapters.`)}
                          className="w-full py-2 bg-white hover:bg-natural-green hover:text-white border border-natural-beige text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3 h-3" /> Fetch Textbook PDF
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-natural-beige flex justify-between items-center text-xs">
                  <span className="text-[10px] text-natural-charcoal/60">Need paper copies? Visit the Central Library behind Assembly Square.</span>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 bg-natural-light hover:bg-[#E9E5D9] text-natural-charcoal font-bold text-xs uppercase tracking-widest rounded-xl border border-natural-beige"
                  >
                    Close Bookshelf
                  </button>
                </div>
              </div>
            )}

            {/* C: CAMPUS GALLERY MODAL */}
            {activeModal === 'gallery' && (
              <div className="space-y-6">
                <div className="border-b border-natural-beige pb-3">
                  <div className="flex items-center gap-2">
                    <Image className="w-6 h-6 text-[#C29B38]" />
                    <h3 className="text-xl font-serif font-black tracking-tight">NUA Campus Image Archive & moments</h3>
                  </div>
                  <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block mt-0.5">Explore classroom zones, laboratories & championships</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { url: "/src/assets/images/front_page_1779414015980.png", label: "Main Front Campus & Gatehouses" },
                      { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80", label: "State-of-the-Art AP Biology Lab" },
                      { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80", label: "Active Student Consultation Study" },
                      { url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80", label: "Central Library Reading desks" },
                      { url: "https://images.unsplash.com/photo-1516534775068-ba3e84589d90?w=400&auto=format&fit=crop&q=80", label: "IT & CBT Testing workstation room" },
                      { url: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&auto=format&fit=crop&q=80", label: "Primary Montessori play zone" }
                    ].map((img, id) => (
                      <div key={id} className="relative group overflow-hidden rounded-xl border border-natural-beige shadow-6xs cursor-zoom-in" onClick={() => alert(`Enlarge View: "${img.label}"`)}>
                        <img 
                          src={img.url} 
                          alt={img.label} 
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9.5px] text-white font-semibold leading-tight">{img.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-[11px] text-natural-charcoal/60 pt-2">
                    Want to see campus facilities in person? Contact the registrar representative to coordinate a physical tour.
                  </p>
                </div>

                <div className="pt-4 border-t border-natural-beige text-right">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 bg-natural-light hover:bg-[#E9E5D9] text-natural-charcoal font-bold text-xs uppercase tracking-widest rounded-xl border border-natural-beige"
                  >
                    Close Gallery
                  </button>
                </div>
              </div>
            )}

            {/* D: CAREERS & JOBS MODAL */}
            {activeModal === 'careers' && (
              <div className="space-y-6">
                <div className="border-b border-natural-beige pb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-natural-green" />
                    <h3 className="text-xl font-serif font-black tracking-tight">Careers & Faculty Openings</h3>
                  </div>
                  <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block mt-0.5">Become part of the New Unique Academy guidance family</span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-natural-charcoal/80">
                    We invite passionate, dedicated educational professionals to shape the leaders of tomorrow. Explore active positions below:
                  </p>

                  <div className="space-y-3.5">
                    {[
                      { role: "Advanced Placement Calculus & Algebra Teacher", type: "Full-Time (Grade 10-12)", location: "Preston Main Campus", pay: "$58,000 - $72,000/year", requirements: "Master's degree in Mathematics, 3+ years teaching AP sequences, bilingual capability preferred." },
                      { role: "Fine Arts, Painting & Sculpting Instructor", type: "Full-Time (Nursery to Secondary)", location: "Preston Arts Wing", pay: "$48,000 - $55,000/year", requirements: "Bachelor of Fine Arts (BFA) or active visual arts portfolio, background in child development." },
                      { role: "CBT Testing Coordinator & IT Administrator", type: "Contract / Full-Time", location: "Behind Fabian Hotel Zone C", pay: "$4,500 - $5,800/month", requirements: "Bachelor in Computer Science or systems administration, experience building server routers and secure computer terminals." }
                    ].map((job, idx) => (
                      <div key={idx} className="bg-natural-light/50 border border-natural-beige p-5 rounded-2xl space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 border-b border-natural-beige/65 pb-2">
                          <div>
                            <span className="text-[9px] font-bold text-natural-green bg-white px-2 py-0.5 rounded border border-natural-beige mr-2">{job.type}</span>
                            <span className="text-[9.5px] font-mono text-natural-charcoal/50">{job.location}</span>
                          </div>
                          <span className="text-xs font-bold text-natural-green font-mono">{job.pay}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[13px]">{job.role}</h4>
                        <p className="text-xs text-natural-charcoal/70">{job.requirements}</p>
                        <button 
                          onClick={() => alert(`Simulating Application: Please draft an email with application message and your curriculum vitae to omoleyemi82@gmail.com with subject line: "Job Application: ${job.role}".`)}
                          className="px-4 py-2 bg-natural-green hover:bg-[#C29B38] text-white text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-colors"
                        >
                          Submit Online Application Message
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-natural-beige text-right">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 bg-natural-light hover:bg-[#E9E5D9] text-natural-charcoal font-bold text-xs uppercase tracking-widest rounded-xl border border-natural-beige"
                  >
                    Dismiss Openings
                  </button>
                </div>
              </div>
            )}

            {/* E: FAQS MODAL */}
            {activeModal === 'faq' && (
              <div className="space-y-6">
                <div className="border-b border-natural-beige pb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-natural-green" />
                    <h3 className="text-xl font-serif font-black tracking-tight">Academic FAQ & Campus Policies</h3>
                  </div>
                  <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block mt-0.5">Answers regarding tuition, safe bus transits, and portal logistics</span>
                </div>

                <div className="space-y-4 text-xs">
                  <p>
                    Get immediate information regarding standard operational frameworks on school premises:
                  </p>

                  <div className="space-y-3">
                    {[
                      { q: "What is the tuition ledger structure at New Unique Academy?", a: "Secondary school grade fees are set at a baseline of $4,500 per semester. This encompasses structural stem lab assays, full exam grading services, public event passes, and digital e-library accounts. Payments can be submitted directly via Bursar receipts inside the Student Portal." },
                      { q: "Is school bus transport available for students behind Fabian Hotel?", a: "Yes, our certified transit system coordinates daily routes spanning Pretoria Zone A through C, including explicit drop-stops behind Fabian Hotel. Registered parents can inspect maps and log transits directly via advisory portal routes." },
                      { q: "How can I synchronize parent credentials?", a: "Upon student admission registration, parent details are auto-mapped. You can sign into the Parent Portal immediately with password parent123 using the parent email. This enables read-only inspection of homework compositions, attendance averages, and payment invoices." },
                      { q: "Are classrooms climate-controlled and monitored?", a: "Absolutely. All nursery, primary, and secondary lecture theaters are fully climate-controlled, equipped with dynamic web camera streams, and monitored by the universal Administrator portal desk." }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-natural-light/40 border border-natural-beige rounded-xl space-y-1.5">
                        <span className="font-bold text-natural-green text-xs block">Q: {item.q}</span>
                        <p className="text-natural-charcoal/85 leading-relaxed text-[11px]">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-natural-beige text-right">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 bg-natural-light hover:bg-[#E9E5D9] text-natural-charcoal font-bold text-xs uppercase tracking-widest rounded-xl border border-natural-beige"
                  >
                    Dismiss FAQ
                  </button>
                </div>
              </div>
            )}

            {/* F: PRIVACY MODAL */}
            {activeModal === 'privacy' && (
              <div className="space-y-6">
                <div className="border-b border-natural-beige pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-natural-green" />
                    <h3 className="text-xl font-serif font-black tracking-tight">Privacy Policy & Biometric Declarations</h3>
                  </div>
                  <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block mt-0.5">How student records are encrypted across server files</span>
                </div>

                <div className="space-y-4 text-xs">
                  <p>
                    <b>NEW UNIQUE ACADEMY</b> guarantees absolute security mapping:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-natural-charcoal/80">
                    <li><b>Biodata Encryption:</b> Student phone lines, guardian registry emails, and previous school compositions are stored behind modern hashing tables to prevent unauthorized network scans.</li>
                    <li><b>Biometric Security Badge:</b> All passport photographs selected during registration are used strictly to compile the physical student ID logs and local badge templates, never distributed to third party APIs.</li>
                    <li><b>Portal Ledger Security:</b> Financial invoices and transcript scorecards are accessible only by the specific parent/student login keys or certified administrators.</li>
                  </ul>
                  <p className="text-[10px] text-natural-charcoal/50 italic">Last Revised: May 2026. Certified Preston Education Council compliant.</p>
                </div>

                <div className="pt-4 border-t border-natural-beige text-right">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 bg-natural-light hover:bg-[#E9E5D9] text-natural-charcoal font-bold text-xs uppercase tracking-widest rounded-xl border border-natural-beige"
                  >
                    Dismiss Policy
                  </button>
                </div>
              </div>
            )}

            {/* G: TERMS MODAL */}
            {activeModal === 'terms' && (
              <div className="space-y-6">
                <div className="border-b border-natural-beige pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#C29B38]" />
                    <h3 className="text-xl font-serif font-black tracking-tight">Academy Registrar Terms & Conditions</h3>
                  </div>
                  <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block mt-0.5">Code of conduct & tuition liabilities legally signed</span>
                </div>

                <div className="space-y-4 text-xs">
                  <p>
                    By finalizing biometric student profiles or using member portals, guardians agree to these core school regulations:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-natural-charcoal/80">
                    <li><b>Academic Honesty:</b> Students must solve quizzes without unauthorized external materials. Suspicious logs trigger immediate administrative alerts.</li>
                    <li><b>Tuition Ledgers:</b> Term charges are non-refundable after the second study week. Unresolved invoices restrict student card credentials for state exams.</li>
                    <li><b>Premises Behavior:</b> Strict obedience towards guidelines, clean uniform presentations, and respectful civil interactions behind Fabian Hotel Zone C.</li>
                  </ol>
                  <p className="text-[10px] text-natural-charcoal/50 italic">Failure to respect these protocols authorizes the Principal office to suspend student access keys.</p>
                </div>

                <div className="pt-4 border-t border-natural-beige text-right">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 bg-natural-light hover:bg-[#E9E5D9] text-natural-charcoal font-bold text-xs uppercase tracking-widest rounded-xl border border-natural-beige"
                  >
                    I Accept Terms
                  </button>
                </div>
              </div>
            )}

            {/* H: SUPPORT TICKET & STATUS CHECKER MODAL */}
            {activeModal === 'support' && (
              <div className="space-y-6">
                <div className="border-b border-natural-beige pb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-[#C29B38]" />
                    <h3 className="text-xl font-serif font-black tracking-tight">School Help Desk & Registry Status</h3>
                  </div>
                  <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block mt-0.5">Lookup entry approvals or file technical support inquiries</span>
                </div>

                {/* Sub-grid: Dual Panels */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Column: Instant Status Checker (Functional!) */}
                  <div className="md:col-span-5 bg-natural-light/50 p-4 rounded-2xl border border-natural-beige space-y-3.5">
                    <div>
                      <span className="font-bold text-[10px] text-natural-green uppercase tracking-wide block">1. Search Admission Status</span>
                      <p className="text-[10px] text-natural-charcoal/60">Type code to lookup biometric registry validation:</p>
                    </div>

                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="e.g. NUA-26-4012"
                        value={statusSearchCode}
                        onChange={(e) => setStatusSearchCode(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-natural-beige rounded-xl outline-none font-semibold uppercase tracking-wider"
                      />
                      <button 
                        onClick={() => {
                          const codeClean = statusSearchCode.trim().toUpperCase();
                          if (!codeClean) {
                            alert("Please type a valid Admission Code targeting structure.");
                            return;
                          }
                          // Lookup in context
                          const matchInDb = students.find((s: any) => s.admissionNumber?.toUpperCase() === codeClean);
                          if (matchInDb) {
                            setSearchResult({
                              found: true,
                              name: matchInDb.name,
                              grade: matchInDb.gradeLevel,
                              code: matchInDb.admissionNumber,
                              status: "APPROVED & INTEGRATED - Student credentials login ready with default student123! Go load ID card."
                            });
                          } else if (codeClean.includes("4012") || codeClean.includes("JULIAN") || codeClean === "NUA-26-4012") {
                            setSearchResult({
                              found: true,
                              name: "Julian Alvarez",
                              grade: "Grade 10",
                              code: "NUA-26-4012",
                              status: "APPROVED & ACTIVE - Registered student profile found. Select 'Student' role on Portal and use j.alvarez@academy.org."
                            });
                          } else {
                            setSearchResult({
                              found: false,
                              status: `Biometric Code "${codeClean}" is currently in registrar queue review. If you recently registered, please wait 3-5 minutes for file caching or check default demo student accounts.`
                            });
                          }
                        }}
                        className="w-full py-2 bg-natural-green hover:bg-natural-green/90 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all"
                      >
                        Lookup Biometric Database
                      </button>
                    </div>

                    {statusSearchResult && (
                      <div className="p-3 bg-white border border-natural-green/30 rounded-xl space-y-1.5 animate-fade-in text-[10.5px]">
                        {statusSearchResult.found ? (
                          <>
                            <span className="font-extrabold text-emerald-700 block text-[9px] uppercase tracking-widest">● RECORD FOUND</span>
                            <span className="block font-bold">Name: {statusSearchResult.name} ({statusSearchResult.grade})</span>
                            <p className="text-natural-charcoal/70">{statusSearchResult.status}</p>
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-amber-700 block text-[9px] uppercase tracking-widest">● REGISTER PENDING</span>
                            <p className="text-natural-charcoal/70 leading-normal">{statusSearchResult.status}</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Submit Ticket */}
                  <div className="md:col-span-7 space-y-3.5">
                    <div>
                      <span className="font-bold text-[10px] text-[#C29B38] uppercase tracking-wide block">2. Submit Tech Support Ticket</span>
                      <p className="text-[10px] text-natural-charcoal/60">Having issues accessing classrooms or accounting logs?</p>
                    </div>

                    {supportInquirySubmitted ? (
                      <div className="p-6 bg-slate-50 border border-natural-beige rounded-2xl text-center space-y-3.5 animate-fade-in">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h4 className="font-serif font-bold text-xs">Helpdesk Ticket Submitted!</h4>
                        <p className="text-[10.5px] text-natural-charcoal/70 max-w-xs mx-auto">
                          Subject: <b>{supportSubject}</b>. We have queued your request. Support specialist will email omoleyemi82@gmail.com shortly.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); setSupportInquirySubmitted(true); }} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold uppercase text-natural-green/80 tracking-widest">Support Category *</label>
                          <select 
                            value={supportSubject}
                            onChange={(e) => setSupportSubject(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-slate-50 border border-natural-beige rounded-xl"
                          >
                            <option value="Portal Login Access">Portal Login Access ("student123" issues)</option>
                            <option value="Bursar Fees Payment Ledger">Bursar Fees Ledger (Syllabus discrepancies)</option>
                            <option value="ID Badge Photo Alignment">ID Badge Photo alignment</option>
                            <option value="Previous School transcripts upload">Previous school transcripts file upload</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold uppercase text-natural-green/80 tracking-widest">Issue Explanation Message *</label>
                          <textarea 
                            required
                            rows={3}
                            placeholder="Describe what error was shown, including registered student name..."
                            value={supportMessage}
                            onChange={(e) => setSupportMessage(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-slate-50 border border-natural-beige rounded-xl outline-none focus:bg-white focus:border-natural-green text-natural-charcoal font-medium"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2.5 bg-[#C29B38] hover:bg-[#A8822A] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                        >
                          File Verified Support Ticket
                        </button>
                      </form>
                    )}
                  </div>

                </div>

                <div className="pt-4 border-t border-natural-beige text-right">
                  <button 
                    onClick={() => { setActiveModal(null); setSearchResult(null); setSupportInquirySubmitted(false); }}
                    className="px-5 py-2.5 bg-natural-light hover:bg-[#E9E5D9] text-natural-charcoal font-bold text-xs uppercase tracking-widest rounded-xl border border-natural-beige"
                  >
                    Finish & Close Desk
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
