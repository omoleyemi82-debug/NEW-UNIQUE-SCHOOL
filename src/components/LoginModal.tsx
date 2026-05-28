import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { UserRole } from '../types';
import { verifyPassword, encryptPassword } from '../utils/security';
import { 
  GraduationCap, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  Info, 
  Check, 
  X, 
  Mail, 
  User, 
  HelpCircle, 
  Timer, 
  CheckSquare, 
  Square,
  ArrowRight,
  ShieldAlert
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
  
  const [role, setRoleOption] = useState<UserRole>('student');
  const [loginMethod, setLoginMethod] = useState<'username' | 'email'>('username');
  const [identifier, setIdentifier] = useState(''); // Holds username or email input
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  
  // Forgot Password States
  const [forgotEmailOrUsername, setForgotEmailOrUsername] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Preset demo accounts for quick testing
  const demoAccounts = [
    {
      role: 'student' as UserRole,
      label: 'Student',
      username: 'SS1-901',
      email: 'j.alvarez@academy.org',
      password: 'student123',
      name: 'Julian Alvarez',
      desc: 'Log in with Username'
    },
    {
      role: 'parent' as UserRole,
      label: 'Parent',
      username: 'parent-robert',
      email: 'robert.alvarez@mail.com',
      password: 'parent123',
      name: 'Robert Alvarez',
      desc: 'Log in with Email'
    },
    {
      role: 'teacher' as UserRole,
      label: 'Staff / Teacher',
      username: 'alan.mathematics',
      email: 'a.turing@academy.org',
      password: 'staff123',
      name: 'Prof. Alan Turing',
      desc: 'Log in with Email/Username'
    },
    {
      role: 'admin' as UserRole,
      label: 'Admin',
      username: 'superadmin',
      email: 'admin@academy.org',
      password: 'superadmin_xyz', // fallback demo
      name: 'Universal Admin',
      desc: 'System-wide secure Admin clearance'
    }
  ];

  const handleQuickFill = (acc: typeof demoAccounts[number]) => {
    setRoleOption(acc.role);
    setIdentifier(loginMethod === 'username' ? acc.username : acc.email);
    setPassword(acc.password);
    setError('');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotSuccessMessage('');

    if (!forgotEmailOrUsername) {
      setError('Please provide your Username or Registered Email.');
      return;
    }

    // Attempt to locate user in simulated database
    let foundUser = false;
    let emailAddress = '';

    if (role === 'admin') {
      const matched = admins.find(a => 
        a.username.toLowerCase() === forgotEmailOrUsername.trim().toLowerCase() ||
        a.email.toLowerCase() === forgotEmailOrUsername.trim().toLowerCase()
      );
      if (matched) {
        foundUser = true;
        emailAddress = matched.email;
        // Mock recovery - reset to 'p@ssword123'
        matched.password = encryptPassword('p@ssword123');
      }
    } else if (role === 'teacher') {
      const matched = teachers.find(t => 
        t.username?.toLowerCase() === forgotEmailOrUsername.trim().toLowerCase() ||
        t.email.toLowerCase() === forgotEmailOrUsername.trim().toLowerCase()
      );
      if (matched) {
        foundUser = true;
        emailAddress = matched.email;
        matched.password = encryptPassword('p@ssword123');
      }
    } else if (role === 'parent') {
      const matched = parents.find(p => 
        p.email.toLowerCase() === forgotEmailOrUsername.trim().toLowerCase()
      );
      if (matched) {
        foundUser = true;
        emailAddress = matched.email;
        matched.password = encryptPassword('p@ssword123');
      }
    } else if (role === 'student') {
      const matched = students.find(s => 
        s.username?.toLowerCase() === forgotEmailOrUsername.trim().toLowerCase() ||
        s.email.toLowerCase() === forgotEmailOrUsername.trim().toLowerCase()
      );
      if (matched) {
        foundUser = true;
        emailAddress = matched.email;
        matched.password = encryptPassword('p@ssword123');
      }
    }

    if (foundUser || forgotEmailOrUsername.includes('@') || forgotEmailOrUsername.length > 3) {
      // Simulate successful password dispatch
      const targetMail = emailAddress || forgotEmailOrUsername;
      setForgotSuccessMessage(`Reset credentials successfully generated! An email verification link and a temporary secure key was sent to "${targetMail}". Your temporary reset password is: "p@ssword123"`);
      trackLoginActivity(forgotEmailOrUsername, role, 'PASSWORD_RESET', `Forgot password requested for role ${role}`);
    } else {
      setError(`We could not identify any registered active profile matching "${forgotEmailOrUsername}" for the selected role.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const queryInput = identifier.trim().toLowerCase();
    if (!queryInput || !password) {
      setError('Both identifier and password fields are strictly required.');
      return;
    }

    let success = false;
    let loggedInUserId = '';
    let loggedInRole: UserRole = role;

    // Password matcher: support base64/XOR hash check, or plain backup (for demo accounts)
    const isPasswordValid = (entered: string, dbPass?: string) => {
      if (!dbPass) return false;
      return verifyPassword(entered, dbPass) || entered === dbPass;
    };

    if (role === 'admin') {
      // Search in custom admins list
      const matched = admins.find(a => 
        a.username.toLowerCase() === queryInput || 
        a.email.toLowerCase() === queryInput
      );

      if (matched) {
        if (!matched.isActiveAccount) {
          setError('This Administrator profile has been disabled by a system Super Admin.');
          trackLoginActivity(identifier, 'admin', 'FAILED', 'Disabled account block triggered');
          return;
        }
        if (isPasswordValid(password, matched.password)) {
          success = true;
          loggedInUserId = matched.id;
        } else {
          setError('Incorrect security password specified for this Administrator.');
          trackLoginActivity(identifier, 'admin', 'FAILED', 'Invalid password entered');
        }
      } else if ((queryInput === 'admin@academy.org' || queryInput === 'superadmin') && (password === 'admin123' || password === 'superadmin_xyz')) {
        // Fallback demo admin matching
        success = true;
        loggedInUserId = 'admin';
      } else {
        setError(`No registered Administrator was found matching credentials: "${identifier}".`);
        trackLoginActivity(identifier, 'admin', 'FAILED', 'Account not found');
      }

    } else if (role === 'teacher') {
      const matched = teachers.find(t => 
        t.username?.toLowerCase() === queryInput || 
        t.email.toLowerCase() === queryInput
      );

      if (matched) {
        if (matched.isActiveAccount === false) {
          setError('This Teacher account has been deactivated by school administration.');
          trackLoginActivity(identifier, 'teacher', 'FAILED', 'Disabled teacher block');
          return;
        }
        if (isPasswordValid(password, matched.password) || (password === 'staff123' && matched.email === 'a.turing@academy.org')) {
          success = true;
          loggedInUserId = matched.id;
        } else {
          setError('Incorrect password matched for teacher.');
          trackLoginActivity(identifier, 'teacher', 'FAILED', 'Invalid password');
        }
      } else {
        setError(`No Faculty or Teacher account matches username/email: "${identifier}".`);
        trackLoginActivity(identifier, 'teacher', 'FAILED', 'Account not found');
      }

    } else if (role === 'parent') {
      const matched = parents.find(p => 
        p.email.toLowerCase() === queryInput ||
        p.phone === queryInput
      );

      if (matched) {
        if (matched.isActiveAccount === false) {
          setError('This Parent representative has been disabled by administration.');
          trackLoginActivity(identifier, 'parent', 'FAILED', 'Disabled parent account');
          return;
        }
        if (isPasswordValid(password, matched.password) || (password === 'parent123' && matched.email === 'robert.alvarez@mail.com')) {
          success = true;
          loggedInUserId = matched.id;
        } else {
          setError('Incorrect portal password specified for Parent.');
          trackLoginActivity(identifier, 'parent', 'FAILED', 'Incorrect password');
        }
      } else if (queryInput === 'robert.alvarez@mail.com' && password === 'parent123') {
        success = true;
        loggedInUserId = 'p_01';
      } else {
        setError(`No linked Parent profile matches email: "${identifier}".`);
        trackLoginActivity(identifier, 'parent', 'FAILED', 'Account not found');
      }

    } else if (role === 'student') {
      const matched = students.find(s => 
        s.username?.toLowerCase() === queryInput || 
        s.email.toLowerCase() === queryInput ||
        s.admissionNumber?.toLowerCase() === queryInput
      );

      if (matched) {
        if (matched.isActiveAccount === false) {
          setError('This student login has been temporarily locked by secondary system Admins.');
          trackLoginActivity(identifier, 'student', 'FAILED', 'Disabled student account');
          return;
        }
        if (isPasswordValid(password, matched.password) || (password === 'student123' && matched.id === 's_01')) {
          success = true;
          loggedInUserId = matched.id;
        } else {
          setError('Incorrect password for student identity.');
          trackLoginActivity(identifier, 'student', 'FAILED', 'Incorrect password');
        }
      } else {
        setError(`No registered student registry matches: "${identifier}".`);
        trackLoginActivity(identifier, 'student', 'FAILED', 'Student registry not found');
      }
    }

    if (success) {
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remember_me');
      }

      // Track positive log access
      trackLoginActivity(identifier, loggedInRole, 'SUCCESS', 'Secure authorization confirmed');
      setRole(loggedInRole, loggedInUserId);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto flex items-center justify-center p-4" id="login-modal-overlay">
      {/* Dark overlay backdrop with blur */}
      <div 
        className="absolute inset-0 bg-natural-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Login Dialog Box */}
      <div className="relative bg-natural-bg w-full max-w-4xl rounded-3xl border border-natural-beige shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh] animate-fade-in">
        {/* Close Button top-right */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-natural-charcoal/50 hover:text-natural-charcoal hover:bg-natural-light p-1.5 rounded-full transition-all cursor-pointer z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left column (Form inputs) */}
        <div className="p-8 sm:p-10 md:col-span-7 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-0.5 bg-white border border-natural-beige rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="School Logo" 
                  className="w-10 h-10 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block leading-none">Security Portal</span>
                <h3 className="text-sm font-serif font-black text-natural-charcoal mt-1 leading-none uppercase">{schoolName}</h3>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-natural-charcoal tracking-tight">
                {isForgotMode ? 'Forgot Password Recovery' : 'Sign In to Portal'}
              </h2>
              <p className="text-xs text-natural-charcoal/60 mt-0.5">
                {isForgotMode 
                  ? 'Access safe override password recovery keys. Verification codes will route on contact files.' 
                  : 'Welcome back! Access academic records, grading books, live homework desks, and school fees portals.'
                }
              </p>
            </div>

            {/* Role picker tabs */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest mb-2">Select User Role</label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-natural-light rounded-xl border border-natural-beige">
                {(['student', 'parent', 'teacher', 'admin'] as const).map((r) => {
                  const isActive = role === r;
                  const label = r === 'teacher' ? 'Staff' : r.charAt(0).toUpperCase() + r.slice(1);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRoleOption(r);
                        setError('');
                        setForgotSuccessMessage('');
                        const acc = demoAccounts.find(d => d.role === r);
                        if (acc) {
                          setIdentifier(loginMethod === 'username' ? acc.username : acc.email);
                          setPassword(acc.password);
                        }
                      }}
                      className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-natural-green text-white shadow-xs' 
                          : 'text-natural-charcoal/60 hover:text-natural-charcoal/90 hover:bg-natural-beige/30'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login options choosing tab */}
            {!isForgotMode && (
              <div className="flex gap-4 border-b border-natural-beige/40 pb-3">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('username');
                    const acc = demoAccounts.find(d => d.role === role);
                    if (acc) setIdentifier(acc.username);
                  }}
                  className={`text-[10.5px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all outline-none ${
                    loginMethod === 'username' 
                      ? 'text-natural-green border-b-2 border-natural-green pb-1' 
                      : 'text-natural-charcoal/40 hover:text-natural-charcoal'
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Username Option
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    const acc = demoAccounts.find(d => d.role === role);
                    if (acc) setIdentifier(acc.email);
                  }}
                  className={`text-[10.5px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all outline-none ${
                    loginMethod === 'email' 
                      ? 'text-natural-green border-b-2 border-natural-green pb-1' 
                      : 'text-natural-charcoal/40 hover:text-natural-charcoal'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email Address Option
                </button>
              </div>
            )}

            {isForgotMode ? (
              /* Forgot password layout view */
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-205 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-normal">{error}</span>
                  </div>
                )}
                {forgotSuccessMessage && (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex flex-col gap-1 text-teal-800 text-xs font-semibold leading-relaxed">
                    <span className="text-teal-900 border-b border-teal-200/50 pb-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-teal-600 bg-white rounded-full p-0.5" /> Dispatch verification success!
                    </span>
                    <span>{forgotSuccessMessage}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-natural-green/85 tracking-widest">
                    Enter email or username
                  </label>
                  <div className="relative">
                    <HelpCircle className="absolute left-4 top-3.5 w-4 h-4 text-natural-green/60" />
                    <input
                      type="text"
                      required
                      value={forgotEmailOrUsername}
                      onChange={(e) => setForgotEmailOrUsername(e.target.value)}
                      placeholder="e.g. superadmin or email@academy.org"
                      className="w-full text-xs pl-10 pr-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-natural-clay hover:bg-natural-clay-hover text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Send Recovery Key
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setError('');
                      setForgotSuccessMessage('');
                    }}
                    className="px-4 py-3 border border-natural-beige text-natural-charcoal/70 text-xs uppercase tracking-widest rounded-xl hover:bg-natural-light transition-all font-bold"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              /* Normal Sign-In Form */
              <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs animate-headShake">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span className="font-semibold leading-relaxed">{error}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-natural-green/85 tracking-widest">
                    {loginMethod === 'username' ? 'Username / Code ID *' : 'Registered Email Address *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-natural-green/60 font-semibold select-none text-xs">
                      {loginMethod === 'username' ? '#' : '@'}
                    </span>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setError('');
                      }}
                      placeholder={
                        loginMethod === 'username' 
                          ? (role === 'student' ? 'SS1-901' : role === 'parent' ? 'parent-robert' : role === 'teacher' ? 'alan.mathematics' : 'superadmin')
                          : (role === 'student' ? 'j.alvarez@academy.org' : role === 'parent' ? 'robert.alvarez@mail.com' : role === 'teacher' ? 'a.turing@academy.org' : 'admin@academy.org')
                      }
                      className="w-full text-xs pl-9 pr-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase text-natural-green/85 tracking-widest">Portal Protection Password *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setError('');
                        setForgotSuccessMessage('');
                      }}
                      className="text-[10px] font-bold text-natural-clay hover:text-natural-clay/80"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-3.5 w-4 h-4 text-natural-green/60" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="••••••••"
                      className="w-full text-xs pl-10 pr-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium font-mono"
                    />
                  </div>
                </div>

                {/* Remember Me and timer indicators */}
                <div className="flex justify-between items-center pt-1.5 pb-1">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="flex items-center gap-2 text-natural-charcoal/60 hover:text-natural-charcoal transition-all cursor-pointer text-xs"
                  >
                    {rememberMe ? (
                      <CheckSquare className="w-4 h-4 text-natural-green shrink-0 bg-natural-green/5 rounded" />
                    ) : (
                      <Square className="w-4 h-4 text-natural-charcoal/30 shrink-0" />
                    )}
                    <span className="font-semibold text-xs text-natural-charcoal/70">Remember Me</span>
                  </button>

                  <span className="text-[10px] text-natural-charcoal/40 font-mono font-bold flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" /> 15 MIN RETENTION
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-natural-clay hover:bg-natural-clay-hover text-white font-bold text-xs uppercase tracking-widest leading-none shadow-sm rounded-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Secure Check-In
                </button>
              </form>
            )}
          </div>

          <p className="text-[10px] text-natural-charcoal/40 text-center mt-6 pt-4 border-t border-natural-beige/40">
            Unauthorized portal activity is automatically catalogued and reported in localized regional logs.
          </p>
        </div>

        {/* Right column (Demo accounts helper drawer) */}
        <div className="bg-natural-light/75 border-t md:border-t-0 md:border-l border-natural-beige p-8 md:col-span-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-natural-green">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest block">Simulated Authorization Keys</span>
            </div>

            <p className="text-[11px] text-natural-charcoal/70 leading-relaxed font-semibold">
              Select any pre-configured profile card to automatically pre-populate either form selector:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {demoAccounts.map((acc) => {
                const isCurrentRole = role === acc.role;
                const valueIdent = loginMethod === 'username' ? acc.username : acc.email;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className={`text-left p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                      isCurrentRole 
                        ? 'bg-white border-natural-green ring-1 ring-natural-green shadow-xs' 
                        : 'bg-white/80 hover:bg-white border-natural-beige/70'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider ${
                        acc.role === 'admin' 
                          ? 'bg-natural-clay/20 text-natural-clay' 
                          : acc.role === 'teacher' 
                          ? 'bg-natural-green/20 text-natural-green' 
                          : acc.role === 'parent' 
                          ? 'bg-amber-100/80 text-amber-805'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {acc.label}
                      </span>
                      {isCurrentRole && <Check className="w-3.5 h-3.5 text-natural-green shrink-0 bg-natural-light rounded-full p-0.5" />}
                    </div>

                    <div className="mt-2 text-[10.5px]">
                      <p className="font-serif font-black text-natural-charcoal">{acc.name}</p>
                      <p className="text-[9.5px] font-medium text-natural-charcoal/50">
                        {loginMethod === 'username' ? 'User:' : 'Mail:'} <span className="font-mono text-natural-green font-bold">{valueIdent}</span>
                      </p>
                      <p className="text-[9.5px] font-medium text-natural-charcoal/55">
                        Pass: <span className="font-mono bg-natural-light px-0.5 py-0.2 rounded text-natural-charcoal">{acc.password}</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
