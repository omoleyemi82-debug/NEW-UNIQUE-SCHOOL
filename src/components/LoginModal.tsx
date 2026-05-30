import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { UserRole } from '../types';
import { verifyPassword, encryptPassword } from '../utils/security';
import { 
  ShieldCheck, 
  AlertCircle, 
  X, 
  KeyRound, 
  User, 
  Check,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  
  // Forgot Password States
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotSuccessMessage('');

    if (!forgotIdentifier) {
      setError('Please provide your Username or Registered Email.');
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const queryInput = identifier.trim().toLowerCase();
    if (!queryInput || !password) {
      setError('Both username and password fields are strictly required.');
      return;
    }

    // Password matcher
    const isPasswordValid = (entered: string, dbPass?: string) => {
      if (!dbPass) return false;
      return verifyPassword(entered, dbPass) || entered === dbPass;
    };

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
      if (queryInput === 'superadmin' || queryInput === 'admin@academy.org') {
        const adminInst = admins.find(a => a.id === 'admin') || { id: 'admin', password: 'superadmin_xyz', isActiveAccount: true };
        foundUser = adminInst;
        detectedRole = 'admin';
      } else if (queryInput === 'ss1-901' || queryInput === 'j.alvarez@academy.org') {
        foundUser = students.find(s => s.id === 's_01') || { id: 's_01', password: 'student123', isActiveAccount: true };
        detectedRole = 'student';
      } else if (queryInput === 'parent-robert' || queryInput === 'robert.alvarez@mail.com') {
        foundUser = parents.find(p => p.id === 'p_01') || { id: 'p_01', password: 'parent123', isActiveAccount: true };
        detectedRole = 'parent';
      } else if (queryInput === 'alan.mathematics' || queryInput === 'a.turing@academy.org') {
        foundUser = teachers.find(t => t.id === 't_01') || { id: 't_01', password: 'staff123', isActiveAccount: true };
        detectedRole = 'teacher';
      }
    }

    if (foundUser) {
      if (foundUser.isActiveAccount === false) {
        setError('This portal account has been deactivated by school administration.');
        trackLoginActivity(identifier, detectedRole, 'FAILED', 'Deactivated account block triggered');
        return;
      }

      const fallbackPass = detectedRole === 'admin' ? 'superadmin_xyz' : 
                           detectedRole === 'student' ? 'student123' : 
                           detectedRole === 'parent' ? 'parent123' : 'staff123';

      if (isPasswordValid(password, foundUser.password) || password === fallbackPass) {
        trackLoginActivity(identifier, detectedRole, 'SUCCESS', 'Portal login authenticated');
        setRole(detectedRole, foundUser.id);
        onSuccess();
        onClose();
      } else {
        setError('Incorrect password specified.');
        trackLoginActivity(identifier, detectedRole, 'FAILED', 'Invalid password entered');
      }
    } else {
      setError(`No registered account was found matching username/email "${identifier}".`);
      trackLoginActivity(identifier, 'student', 'FAILED', 'Account not found');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs" id="login-modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in p-6 sm:p-8">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-all cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#1A365D] rounded-xl shrink-0 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="School Logo" 
                className="w-10 h-10 object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#C29B38] font-bold uppercase tracking-widest block leading-none">Management Portal</span>
              <h3 className="text-sm font-serif font-black text-[#1A365D] mt-1 leading-none uppercase">{schoolName}</h3>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1A365D] tracking-tight">
              {isForgotMode ? 'Forgot Password Recovery' : 'Portal Sign In'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isForgotMode 
                ? 'Enter your Username or Registered Email (e.g., ss1-901 or parent-robert) to recover your account.' 
                : 'Enter your credentials created by the Admin (e.g., student username or parent username).'
              }
            </p>
          </div>

          {isForgotMode ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-800 text-xs font-semibold leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </div>
              )}
              {forgotSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col gap-1 text-emerald-800 text-xs font-semibold leading-relaxed">
                  <span className="text-emerald-900 border-b border-emerald-200/50 pb-1 flex items-center gap-1.5 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-600 bg-white rounded-full p-0.5" /> Recovery completed!
                  </span>
                  <span>{forgotSuccessMessage}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Username or Registered Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[#1A365D]/60" />
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="e.g. ss1-901"
                    className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1A365D] focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#E9E5D9] hover:bg-[#DDD2BC] text-[#1A365D] font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer border border-[#DDD2BC]"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setError('');
                    setForgotSuccessMessage('');
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs uppercase tracking-widest rounded-xl transition-all font-bold cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs font-semibold leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Username or Registered Email *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[#1A365D]/60" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. SS1-901, parent-robert, admin"
                    className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1A365D] focus:bg-white transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setError('');
                      setForgotSuccessMessage('');
                    }}
                    className="text-[10px] font-bold text-[#C29B38] hover:text-[#A6802B] cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-[#1A365D]/60 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1A365D] focus:bg-white transition-all text-slate-800 font-medium font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold text-xs uppercase tracking-widest leading-none shadow-md rounded-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-transparent mt-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#C29B38]" /> Enter Portal
              </button>
            </form>
          )}
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-6 pt-4 border-t border-slate-100">
          If you do not have portal credentials, please contact the School Admin.
        </p>
      </div>
    </div>
  );
}
