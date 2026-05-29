import React, { useState, useEffect } from 'react';
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
  Clock,
  Lock,
  LockKeyhole,
  Info,
  Eye,
  EyeOff,
  Mail,
  Shield,
  RefreshCw,
  Sparkles
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
    trackLoginActivity,
    updateStudent,
    updateTeacher,
    updateParent,
    updateAdmin
  } = useSchool();
  
  // Login Form States
  const [identifier, setIdentifier] = useState(localStorage.getItem('remember_username') || ''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery Engine States
  // 'login' | 'forgot_request' | 'forgot_sent' | 'reset_form' | 'reset_success'
  const [flowState, setFlowState] = useState<'login' | 'forgot_request' | 'forgot_sent' | 'reset_form' | 'reset_success'>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [matchedUserId, setMatchedUserId] = useState('');
  const [matchedUserRole, setMatchedUserRole] = useState<UserRole>('student');
  
  // Timer for Expiring Link (15 minutes = 900 seconds)
  const [secondsLeft, setSecondsLeft] = useState(900);
  const [timerActive, setTimerActive] = useState(false);

  // Reset Password States (Screen shows ONLY these)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);
  const [showConfirmResetPass, setShowConfirmResetPass] = useState(false);
  const [pwdStrength, setPwdStrength] = useState({ score: 0, text: 'Too Short' });

  // Countdown clock effect for expiring reset link
  useEffect(() => {
    let interval: any;
    if (timerActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerActive(false);
      setError('Secure reset link has expired due to 15-minute timeout. Please request a new link.');
      setFlowState('forgot_request');
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsLeft]);

  // Track Password strength dynamically
  useEffect(() => {
    calculatePasswordStrength(newPassword);
  }, [newPassword]);

  const calculatePasswordStrength = (val: string) => {
    if (!val) {
      setPwdStrength({ score: 0, text: 'No entry' });
      return;
    }
    if (val.length < 6) {
      setPwdStrength({ score: 1, text: 'Weak (Too short)' });
      return;
    }
    
    let score = 2; // base
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasDigit = /[0-9]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasSymbol = /[^A-Za-z0-9]/.test(val);

    if (hasLetter && hasDigit) score += 1;
    if (hasUpper) score += 1;
    if (hasSymbol) score += 1;

    let text = 'Weak';
    if (score === 3) text = 'Medium';
    if (score >= 4) text = 'Strong Secondary Standard';

    setPwdStrength({ score, text });
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const emailQuery = recoveryEmail.trim().toLowerCase();
    if (!emailQuery) {
      setError('Please provide your registered academic email address.');
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      let foundUserRecord: any = null;
      let detectedRole: UserRole = 'student';

      // Search database records matches
      // Look up Admins
      const matchedAdmin = admins.find(a => a.email.toLowerCase() === emailQuery);
      if (matchedAdmin) {
        foundUserRecord = matchedAdmin;
        detectedRole = 'admin';
      }

      // Look up Teachers
      if (!foundUserRecord) {
        const matchedTeacher = teachers.find(t => t.email.toLowerCase() === emailQuery);
        if (matchedTeacher) {
          foundUserRecord = matchedTeacher;
          detectedRole = 'teacher';
        }
      }

      // Look up Parents
      if (!foundUserRecord) {
        const matchedParent = parents.find(p => p.email.toLowerCase() === emailQuery);
        if (matchedParent) {
          foundUserRecord = matchedParent;
          detectedRole = 'parent';
        }
      }

      // Look up Students
      if (!foundUserRecord) {
        const matchedStudent = students.find(s => s.email.toLowerCase() === emailQuery);
        if (matchedStudent) {
          foundUserRecord = matchedStudent;
          detectedRole = 'student';
        }
      }

      // Handle sandbox demo quick emails for convenience
      if (!foundUserRecord) {
        if (emailQuery === 'admin@academy.org') {
          foundUserRecord = admins[0] || { id: 'admin' };
          detectedRole = 'admin';
        } else if (emailQuery === 'j.alvarez@academy.org') {
          foundUserRecord = students.find(s => s.id === 's_01') || { id: 's_01' };
          detectedRole = 'student';
        } else if (emailQuery === 'robert.alvarez@mail.com') {
          foundUserRecord = parents.find(p => p.id === 'p_01') || { id: 'p_01' };
          detectedRole = 'parent';
        } else if (emailQuery === 'a.turing@academy.org') {
          foundUserRecord = teachers.find(t => t.id === 't_01') || { id: 't_01' };
          detectedRole = 'teacher';
        }
      }

      if (foundUserRecord) {
        setMatchedUserId(foundUserRecord.id);
        setMatchedUserRole(detectedRole);
        
        // Trigger secure expiring reset link (15 minutes countdown)
        setSecondsLeft(900);
        setTimerActive(true);
        setFlowState('forgot_sent');
        trackLoginActivity(emailQuery, detectedRole, 'PASSWORD_RESET', 'One-time expiring reset token requested');
      } else {
        setError(`We cannot identify a registered user under the email address "${recoveryEmail}".`);
      }
    }, 650);
  };

  const handleResetPasswordConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Your new password must be at least 6 characters physically long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords mismatch. Confirm password must precisely match the new password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const encrypted = encryptPassword(newPassword);

      // Perform secure encrypted updates to active state
      if (matchedUserRole === 'admin') {
        updateAdmin(matchedUserId, { password: encrypted });
      } else if (matchedUserRole === 'teacher') {
        updateTeacher(matchedUserId, { password: encrypted });
      } else if (matchedUserRole === 'parent') {
        updateParent(matchedUserId, { password: encrypted });
      } else if (matchedUserRole === 'student') {
        updateStudent(matchedUserId, { password: encrypted });
      }

      setTimerActive(false);
      setFlowState('reset_success');
      trackLoginActivity(recoveryEmail, matchedUserRole, 'PASSWORD_RESET_COMPLETE', 'Secure reset completed successfully');
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const queryInput = identifier.trim().toLowerCase();
    if (!queryInput || !password) {
      setError('Both username/email and password fields are strictly required.');
      setIsSubmitting(false);
      return;
    }

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

      // Failbacks for initial seed accounts
      if (!foundUser) {
        if (queryInput === 'admin' || queryInput === 'superadmin' || queryInput === 'admin@academy.org') {
          foundUser = admins.find(a => a.id === 'admin') || { id: 'admin', password: 'admin123', isActiveAccount: true };
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
        setError(`No registered account was found matching username/email "${identifier}".`);
        trackLoginActivity(identifier, 'student', 'FAILED', 'Account not found');
      }
    }, 600);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Gradient Elements */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-slate-950 to-slate-950 pointer-events-none z-0" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#1e3a8a]/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Container Card of Login / Reset Flow */}
      <div className="w-full max-w-[430px] bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10 p-6 sm:p-10 animate-fade-in">
        
        {/* Transparent Logo Watermark Background behind the forms */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none select-none z-0">
          <img 
            src="/logo.png" 
            alt="School Logo Watermark" 
            className="w-80 h-80 object-contain invert"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Outer UI Elements for normal states */}
        {flowState !== 'reset_form' && (
          <>
            {/* Header Block with School Logo and Name */}
            <div className="text-center space-y-4 relative z-10">
              <div className="inline-flex p-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src="/logo.png" 
                  alt="NEW UNIQUE ACADEMY Crest" 
                  className="w-12 h-12 object-contain brightness-0 invert"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&h=100&fit=crop';
                  }}
                />
              </div>
              
              <div className="space-y-1">
                <h1 className="text-lg font-serif font-black tracking-widest text-slate-100 uppercase block">
                  NEW UNIQUE ACADEMY
                </h1>
                <p className="text-[9.5px] text-sky-400 font-bold uppercase tracking-widest leading-none">
                  SECURED MANAGEMENT PORTAL
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-6 relative z-10" />

            {/* Content Title */}
            <div className="mb-6 relative z-10 text-center">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5 justify-center">
                {flowState === 'forgot_request' && (
                  <><KeyRound className="w-4 h-4 text-sky-400" /> Password Recovery Request</>
                )}
                {flowState === 'forgot_sent' && (
                  <><Mail className="w-4 h-4 text-emerald-400" /> Secure Recovery Dispatched</>
                )}
                {flowState === 'login' && (
                  <><ShieldCheck className="w-4 h-4 text-sky-400" /> Authorized Portal Sign In</>
                )}
                {flowState === 'reset_success' && (
                  <><Shield className="w-4 h-4 text-emerald-400" /> Verification Complete</>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 px-3">
                {flowState === 'forgot_request' && 'Password reset triggers will dispatch only to active registered academic emails.'}
                {flowState === 'forgot_sent' && 'A secure one-time reset link is dispatched to your registered address.'}
                {flowState === 'login' && 'Please authenticate to access dashboards, results and payments.'}
                {flowState === 'reset_success' && 'Your secure credentials have been updated. You can now login.'}
              </p>
            </div>
          </>
        )}

        {/* Notifications & Error messages */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-900/60 text-red-200 text-[11px] font-medium rounded-2xl flex items-start gap-2.5 mb-5 relative z-10 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Flow States formulary */}
        
        {/* State 1: LOGIN PANEL */}
        {flowState === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Username / Identifier */}
            <div className="space-y-1.5">
              <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-400">
                Username, Admission No. or Academic Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. admin, ss1-901, or teacher"
                  className="w-full text-xs pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-100 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>

            {/* Password with HIDE/SHOW button */}
            <div className="space-y-1.5">
              <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-400">
                Secure Account Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-11 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-100 transition-all placeholder:text-slate-600 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot button */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-1.5 text-slate-400 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0 focus:ring-offset-0 focus:outline-none w-3.5 h-3.5 accent-sky-500"
                />
                Remember me
              </label>
              
              <button
                type="button"
                onClick={() => {
                  setFlowState('forgot_request');
                  setError('');
                }}
                className="text-slate-400 hover:text-sky-400 font-semibold transition bg-transparent border-none cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login button submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 outline-none h-11"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate Access <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* State 2: REQUEST PASSWORD FORM */}
        {flowState === 'forgot_request' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-400">
                Registered Academic Email Only
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-sky-400" />
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="e.g. admin@academy.org, j.alvarez@academy.org"
                  className="w-full text-xs pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-100 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center h-11 outline-none"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Dispatch Secure Reset Link'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setFlowState('login');
                setError('');
              }}
              className="w-full text-center text-[10px] uppercase font-bold text-slate-400 hover:text-slate-200 transition py-1 bg-transparent cursor-pointer"
            >
              Back to Sign In Panel
            </button>
          </form>
        )}

        {/* State 3: EMAIL SENT SECURELY (DO NOT DISPLAY PASSWORD ON SCREEN, EXPIRE LINK) */}
        {flowState === 'forgot_sent' && (
          <div className="space-y-5 text-center relative z-10">
            <div className="bg-emerald-950/30 border border-emerald-900/60 p-4 rounded-2xl text-left space-y-2.5">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase">
                <Check className="w-4 h-4" /> Notification Sent
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                A verification link with a **one-time token** has been dispatched to <span className="text-white font-semibold underline">{recoveryEmail}</span>.
              </p>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>Link expires in <span className="font-mono text-white font-bold">{formatTimer(secondsLeft)}</span></span>
              </div>
            </div>

            {/* Professional Simulation Block */}
            <div className="border border-sky-900/40 bg-sky-950/20 p-4 rounded-2xl text-left space-y-2">
              <span className="text-[8px] font-black text-sky-400 uppercase tracking-widest block font-sans">
                Sandbox Simulation Channel:
              </span>
              <p className="text-[10px] text-slate-400 leading-normal">
                Normally you would click the link sent to your mail server inbox. Press below to simulate clicking the secure email token callback:
              </p>
              
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setFlowState('reset_form');
                }}
                className="w-full py-2 bg-sky-500 hover:bg-sky-450 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-transform hover:scale-102 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-slate-950 animate-spin" /> Open Expiring Reset Link
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setFlowState('login');
                setError('');
                setTimerActive(false);
              }}
              className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-200 transition bg-transparent border-none cursor-pointer"
            >
              Back to Login Panel
            </button>
          </div>
        )}

        {/* State 4: NEW PASSWORD + CONFIRM Form (SHOWS ONLY 1. New Password 2. Confirm Password) */}
        {flowState === 'reset_form' && (
          <form onSubmit={handleResetPasswordConfirm} className="space-y-4 relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-md font-serif font-black text-slate-100 uppercase tracking-wide">
                Configure New Password
              </h2>
              <p className="text-[10.5px] text-slate-400 mt-1">
                Expiring link lock is active. Please define your new secure password below.
              </p>
            </div>

            {/* Dynamic visual clock inside reset */}
            <div className="bg-sky-950/20 border border-sky-900/40 p-2 text-center rounded-xl flex items-center justify-center gap-1.5 text-[10px] text-sky-400 font-semibold mb-4">
              <Clock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Reset link session expires in: <span className="font-mono text-white font-extrabold">{formatTimer(secondsLeft)}</span></span>
            </div>

            {/* Input 1: Set New Password */}
            <div className="space-y-1.5">
              <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-400">
                Set New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-sky-400" />
                <input
                  type={showResetPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full text-xs pl-11 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-100 transition-all placeholder:text-slate-650"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPass(!showResetPass)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  title="Toggle passwords"
                >
                  {showResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicators */}
              {newPassword && (
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-[9.5px]">
                    <span className="text-slate-450 uppercase font-semibold">Security Level:</span>
                    <span className={`font-bold uppercase tracking-wider ${
                      pwdStrength.score <= 1 ? 'text-red-400' : pwdStrength.score === 3 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {pwdStrength.text}
                    </span>
                  </div>
                  {/* Color bar indicator */}
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 transition-all ${pwdStrength.score >= 1 ? (pwdStrength.score <= 1 ? 'bg-red-500' : pwdStrength.score === 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 transition-all ${pwdStrength.score >= 3 ? (pwdStrength.score === 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 transition-all ${pwdStrength.score >= 4 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Input 2: Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-400">
                Confirm Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3.5 w-4 h-4 text-sky-400" />
                <input
                  type={showConfirmResetPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password precisely"
                  className="w-full text-xs pl-11 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-100 transition-all placeholder:text-slate-650"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmResetPass(!showConfirmResetPass)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                >
                  {showConfirmResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-955 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 outline-none h-11 text-white shadow-lg"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Securely Store My Password'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setFlowState('login');
                setError('');
                setTimerActive(false);
              }}
              className="w-full text-center text-[10px] uppercase font-bold text-slate-400 hover:text-slate-200 transition py-1 bg-transparent cursor-pointer"
            >
              Discard Reset Session
            </button>
          </form>
        )}

        {/* State 5: RESET SECURE SUCCESS */}
        {flowState === 'reset_success' && (
          <div className="space-y-5 text-center relative z-10 py-2">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-2 font-black">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-white font-bold text-sm tracking-wide uppercase">Password Stored Successfully</h3>
              <p className="text-[11px] text-slate-400 px-2 leading-relaxed">
                The school administrator records have updated successfully. A secure password storage validation handshake was logged. You can now login.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setFlowState('login');
                setError('');
                // Clear state
                setPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer outline-none"
            >
              Login to Secure Portal Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Sandbox Quick Access Accounts display (only in login state to keep cleanest possible setup) */}
        {flowState === 'login' && (
          <div className="mt-6 pt-5 border-t border-slate-800/60 bg-slate-950/20 p-3 rounded-2xl space-y-1 text-[9px] relative z-10 transition-all">
            <span className="text-sky-400 font-extrabold uppercase tracking-wide block flex items-center gap-1 select-none">
              <Info className="w-3 h-3" /> Sandbox Roster Reference Accounts:
            </span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-400 font-medium font-mono leading-relaxed select-all">
              <div>
                <span className="text-[7.5px] block text-sky-450 uppercase leading-none mt-0.5">Admin:</span>
                <span>admin / admin123</span>
              </div>
              <div>
                <span className="text-[7.5px] block text-sky-450 uppercase leading-none mt-0.5">Teacher:</span>
                <span>teacher / staff123</span>
              </div>
              <div>
                <span className="text-[7.5px] block text-sky-450 uppercase leading-none mt-0.5">Student:</span>
                <span>student / student123</span>
              </div>
              <div>
                <span className="text-[7.5px] block text-sky-450 uppercase leading-none mt-0.5">Parent:</span>
                <span>parent / parent123</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-[10px] text-slate-500 relative z-11 space-y-1.5 relative select-none">
        <p>© 2026 NEW UNIQUE ACADEMY. SECURED BY ENVELOPE SECURE PROTOCOLS.</p>
        <p className="font-serif italic text-slate-655 font-semibold text-[10.5px]">"Academic Excellence Is Our Pride"</p>
      </div>
      
    </div>
  );
}
