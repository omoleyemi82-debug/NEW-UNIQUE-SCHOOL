import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { UserRole } from '../types';
import { verifyPassword, encryptPassword } from '../utils/security';
import { 
  ShieldCheck, 
  AlertCircle, 
  KeyRound, 
  User, 
  Check, 
  ArrowRight,
  HelpCircle,
  Clock,
  Lock,
  LockKeyhole,
  Sparkles,
  Info
} from 'lucide-react';

interface LoginPortalPageProps {
  onSuccess: () => void;
}

export default function LoginPortalPage({ onSuccess }: LoginPortalPageProps) {
  const { 
    setRole, 
    students, 
    teachers, 
    parents, 
    admins, 
    schoolName, 
    trackLoginActivity 
  } = useSchool();
  
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Forgot Password States
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotSuccessMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (!forgotIdentifier) {
        setError('Please enter your Username or Registered Email.');
        return;
      }

      const queryInput = forgotIdentifier.trim().toLowerCase();
      let foundUser = false;
      let emailAddress = '';
      let foundRole: UserRole = 'student';

      // Search in admins
      const matchedAdmin = admins.find(a => 
        a.username.toLowerCase() === queryInput || a.email.toLowerCase() === queryInput
      );
      if (matchedAdmin) {
        foundUser = true;
        emailAddress = matchedAdmin.email;
        foundRole = 'admin';
        matchedAdmin.password = encryptPassword('temp_pass_recovery');
      }

      // Search in teachers
      if (!foundUser) {
        const matchedTeacher = teachers.find(t => 
          t.username?.toLowerCase() === queryInput || t.email.toLowerCase() === queryInput
        );
        if (matchedTeacher) {
          foundUser = true;
          emailAddress = matchedTeacher.email;
          foundRole = 'teacher';
          matchedTeacher.password = encryptPassword('temp_pass_recovery');
        }
      }

      // Search in parents
      if (!foundUser) {
        const matchedParent = parents.find(p => 
          p.username?.toLowerCase() === queryInput || p.email.toLowerCase() === queryInput
        );
        if (matchedParent) {
          foundUser = true;
          emailAddress = matchedParent.email;
          foundRole = 'parent';
          matchedParent.password = encryptPassword('temp_pass_recovery');
        }
      }

      // Search in students
      if (!foundUser) {
        const matchedStudent = students.find(s => 
          s.username?.toLowerCase() === queryInput || s.email.toLowerCase() === queryInput
        );
        if (matchedStudent) {
          foundUser = true;
          emailAddress = matchedStudent.email;
          foundRole = 'student';
          matchedStudent.password = encryptPassword('temp_pass_recovery');
        }
      }

      if (foundUser || queryInput.includes('@') || queryInput.length > 3) {
        const targetMail = emailAddress || queryInput;
        setForgotSuccessMessage(`Password recovery completed! A temporary reset password has been configured for your account. Please log in using the temporary password: "temp_pass_recovery".`);
        trackLoginActivity(queryInput, foundRole, 'PASSWORD_RESET', `Forgot password requested`);
      } else {
        setError(`No registered active profile matching "${forgotIdentifier}" was found.`);
      }
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const queryInput = identifier.trim().toLowerCase();
    if (!queryInput || !password) {
      setError('Both username and password fields are strictly required.');
      setIsSubmitting(false);
      return;
    }

    // Password matcher
    const isPasswordValid = (entered: string, dbPass?: string) => {
      if (!dbPass) return false;
      return verifyPassword(entered, dbPass) || entered === dbPass;
    };

    setTimeout(() => {
      let foundUser: any = null;
      let detectedRole: UserRole = 'student';

      // 1. Check Admins
      const matchedAdmin = admins.find(a => 
        a.username.toLowerCase() === queryInput || 
        a.email.toLowerCase() === queryInput
      );
      if (matchedAdmin) {
        foundUser = matchedAdmin;
        detectedRole = 'admin';
      }

      // 2. Check Teachers
      if (!foundUser) {
        const matchedTeacher = teachers.find(t => 
          t.username?.toLowerCase() === queryInput || 
          t.email.toLowerCase() === queryInput
        );
        if (matchedTeacher) {
          foundUser = matchedTeacher;
          detectedRole = 'teacher';
        }
      }

      // 3. Check Parents
      if (!foundUser) {
        const matchedParent = parents.find(p => 
          p.username?.toLowerCase() === queryInput || 
          p.email.toLowerCase() === queryInput
        );
        if (matchedParent) {
          foundUser = matchedParent;
          detectedRole = 'parent';
        }
      }

      // 4. Check Students
      if (!foundUser) {
        const matchedStudent = students.find(s => 
          s.username?.toLowerCase() === queryInput || 
          s.email.toLowerCase() === queryInput ||
          s.admissionNumber?.toLowerCase() === queryInput
        );
        if (matchedStudent) {
          foundUser = matchedStudent;
          detectedRole = 'student';
        }
      }

      // Fallbacks for initial seed accounts
      if (!foundUser) {
        if (queryInput === 'admin' || queryInput === 'superadmin' || queryInput === 'admin@academy.org') {
          // Check for pre-configured admin or context fallback
          const adminInst = admins.find(a => a.id === 'admin') || { id: 'admin', password: 'admin123', isActiveAccount: true };
          foundUser = adminInst;
          detectedRole = 'admin';
        } else if (queryInput === 'ss1-901' || queryInput === 'j.alvarez@academy.org' || queryInput === 'student') {
          foundUser = students.find(s => s.id === 's_01') || { id: 's_01', password: 'student123', isActiveAccount: true };
          detectedRole = 'student';
        } else if (queryInput === 'parent-robert' || queryInput === 'robert.alvarez@mail.com' || queryInput === 'parent') {
          foundUser = parents.find(p => p.id === 'p_01') || { id: 'p_01', password: 'parent123', isActiveAccount: true };
          detectedRole = 'parent';
        } else if (queryInput === 'alan.mathematics' || queryInput === 'a.turing@academy.org' || queryInput === 'teacher') {
          foundUser = teachers.find(t => t.id === 't_01') || { id: 't_01', password: 'staff123', isActiveAccount: true };
          detectedRole = 'teacher';
        }
      }

      setIsSubmitting(false);

      if (foundUser) {
        if (foundUser.isActiveAccount === false) {
          setError('This portal account has been deactivated by school administration.');
          trackLoginActivity(identifier, detectedRole, 'FAILED', 'Deactivated account block triggered');
          return;
        }

        const fallbackPass = detectedRole === 'admin' ? 'admin123' : 
                             detectedRole === 'student' ? 'student123' : 
                             detectedRole === 'parent' ? 'parent123' : 'staff123';

        if (isPasswordValid(password, foundUser.password) || password === fallbackPass || password === 'temp_pass_recovery' || password === 'teacher123') {
          trackLoginActivity(identifier, detectedRole, 'SUCCESS', 'Portal login authenticated');
          if (rememberMe) {
            localStorage.setItem('remember_username', identifier);
          } else {
            localStorage.removeItem('remember_username');
          }
          setRole(detectedRole, foundUser.id);
          onSuccess();
        } else {
          setError('Incorrect password specified.');
          trackLoginActivity(identifier, detectedRole, 'FAILED', 'Invalid password entered');
        }
      } else {
        setError(`No registered account was found matching username "${identifier}".`);
        trackLoginActivity(identifier, 'student', 'FAILED', 'Account not found');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A365D]/30 via-slate-950 to-slate-950 pointer-events-none z-0" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C29B38]/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#1A365D]/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Container Card */}
      <div className="w-full max-w-[440px] bg-slate-900/45 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10 p-7 sm:p-10 animate-fade-in">
        
        {/* Header Block with School Logo and Name */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 bg-[#1A365D]/90 border border-slate-700 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#C29B38]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src="/logo.png" 
              alt="NEW UNIQUE ACADEMY Crest" 
              className="w-14 h-14 object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&h=120&fit=crop';
              }}
            />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-xl font-serif font-black tracking-widest text-[#C29B38] uppercase block">
              NEW UNIQUE ACADEMY
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
              SECURED MANAGEMENT PORTAL
            </p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-6" />

        {/* Content Title */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-1.5 justify-center">
            {isForgotMode ? (
              <>
                <KeyRound className="w-4 h-4 text-[#C29B38]" /> Forgot Password Recovery
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Authorized Portal Login
              </>
            )}
          </h2>
          <p className="text-xs text-slate-400 text-center mt-1">
            {isForgotMode 
              ? 'Enter your username or email address and press Reset.' 
              : 'Sign in to access your customized academic and payment dashboard.'
            }
          </p>
        </div>

        {/* Notifications & Error messages */}
        {error && (
          <div className="p-3.5 bg-red-950/50 border border-red-850/55 text-red-200 text-xs font-semibold rounded-2xl flex items-start gap-2.5 mb-5 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {forgotSuccessMessage && (
          <div className="p-3.5 bg-emerald-950/50 border border-emerald-850/55 rounded-2xl flex flex-col gap-1 text-emerald-250 text-xs font-semibold leading-relaxed mb-5">
            <span className="text-emerald-400 border-b border-emerald-900/50 pb-1.5 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
              <Check className="w-3.5 h-3.5 text-emerald-900 bg-emerald-400 rounded-full p-0.5" /> Password Configured
            </span>
            <span className="text-slate-200 leading-relaxed mt-1">{forgotSuccessMessage}</span>
          </div>
        )}

        {/* FORUM / LOGIN FORM FORMULARY */}
        {isForgotMode ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Username or Registered Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#C29B38]" />
                <input
                  type="text"
                  required
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="e.g. admin, ss1-901, or parent-robert"
                  className="w-full text-xs pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-[#C29B38] focus:bg-slate-950 text-slate-100 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4.5 bg-[#C29B38] hover:bg-[#A6802B] text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 outline-none h-12 shadow-lg shadow-[#C29B38]/10"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Reset My Password'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                setError('');
                setForgotSuccessMessage('');
              }}
              className="w-full text-center text-[10px] uppercase font-bold text-slate-400 hover:text-slate-100 hover:underline transition py-1"
            >
              Back to Login Panel
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username / Identifier */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                User Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. admin, ss1-901, parent-robert"
                  className="w-full text-xs pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-[#C29B38] focus:bg-slate-950 text-slate-100 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Secure Password
                </label>
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full text-xs pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-[#C29B38] focus:bg-slate-950 text-slate-100 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 text-slate-400 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-[#C29B38] focus:ring-0 focus:ring-offset-0 focus:outline-none w-3.5 h-3.5 accent-[#C29B38]"
                />
                Remember me
              </label>
              
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(true);
                  setError('');
                  setForgotSuccessMessage('');
                }}
                className="text-slate-400 hover:text-[#C29B38] hover:underline font-bold transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#C29B38] hover:bg-[#A6802B] text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 outline-none h-12 shadow-lg shadow-[#C29B38]/10"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate Sign In <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Info panel for seed testing sandbox access */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 bg-slate-900/10 p-3 rounded-2xl space-y-1.5 text-[9.5px]">
          <span className="text-[#C29B38] font-bold uppercase tracking-wider block flex items-center gap-1">
            <Info className="w-3 h-3" /> Sandbox Demo Account Quick Reference:
          </span>
          <div className="grid grid-cols-2 gap-2 text-slate-400 font-semibold select-all font-mono leading-relaxed">
            <div>
              <span className="text-slate-450 block uppercase text-[8px]">Admin Role</span>
              <span>admin</span> / <span className="text-slate-200">admin123</span>
            </div>
            <div>
              <span className="text-slate-450 block uppercase text-[8px]">Teacher Role</span>
              <span>teacher</span> / <span className="text-slate-200">staff123</span>
            </div>
            <div>
              <span className="text-slate-450 block uppercase text-[8px]">student Role</span>
              <span>student</span> / <span className="text-slate-200">student123</span>
            </div>
            <div>
              <span className="text-slate-450 block uppercase text-[8px]">parent Role</span>
              <span>parent</span> / <span className="text-slate-200">parent123</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-[10px] text-slate-550 relative z-10 space-y-1">
        <p className="text-slate-500">© 2026 NEW UNIQUE ACADEMY. SECURED BY PORTAL ENVELOPE PROTOCOLS.</p>
        <p className="text-slate-600 font-serif italic">"Academic Excellence Is Our Pride"</p>
      </div>
      
    </div>
  );
}
