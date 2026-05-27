import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { UserRole } from '../types';
import { GraduationCap, ShieldCheck, KeyRound, AlertCircle, Info, Check, UserCircle2, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { setRole, students, teachers, parents } = useSchool();
  const [role, setRoleOption] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Preset demo accounts for quick testing
  const demoAccounts = [
    {
      role: 'student' as UserRole,
      label: 'Student',
      email: 'NUA/2026/001',
      password: 'student123',
      name: 'Julian Alvarez',
      desc: 'Log in with formatted username: NUA/2026/001'
    },
    {
      role: 'parent' as UserRole,
      label: 'Parent',
      email: 'robert.alvarez@mail.com',
      password: 'parent123',
      name: 'Robert Alvarez',
      desc: "Monitor Julian's transcripts in read-only portal"
    },
    {
      role: 'teacher' as UserRole,
      label: 'Staff / Teacher',
      email: 'a.turing@academy.org',
      password: 'staff123',
      name: 'Prof. Alan Turing',
      desc: 'Enter grade spreadsheets, configure quizzes'
    },
    {
      role: 'admin' as UserRole,
      label: 'Admin',
      email: 'admin@academy.org',
      password: 'admin123',
      name: 'Universal Admin',
      desc: 'Manage student roster, schedule events'
    }
  ];

  const handleQuickFill = (acc: typeof demoAccounts[number]) => {
    setRoleOption(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Both credentials fields are strictly required.');
      return;
    }

    let success = false;
    let loggedInUserId = '';

    if (role === 'admin') {
      if (password === 'admin123') {
        success = true;
        loggedInUserId = 'admin';
      } else {
        setError('Incorrect password for Administrator profile. Try: admin123');
      }
    } else if (role === 'teacher') {
      if (password === 'staff123') {
        const matched = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
        loggedInUserId = matched ? matched.id : (teachers[0]?.id || 't_01');
        success = true;
      } else {
        setError('Incorrect password for Faculty/Staff. Try: staff123');
      }
    } else if (role === 'parent') {
      const matchInDb = parents?.find(p => p.email.toLowerCase() === email.trim().toLowerCase());
      if (matchInDb) {
        if (!matchInDb.isActiveAccount) {
          setError('This parent account has been deactivated by school administration.');
          return;
        }
        if (password === (matchInDb.password || 'parent123')) {
          loggedInUserId = matchInDb.id;
          success = true;
        } else {
          setError(`Incorrect password specified for Parent Account. Try: ${matchInDb.password || 'parent123'}`);
        }
      } else if (email.trim().toLowerCase() === 'robert.alvarez@mail.com' && password === 'parent123') {
        loggedInUserId = 'p_01'; // Fallback robert alvarez parent ID
        success = true;
      } else {
        setError(`No registered Parent account was found matching email "${email}".`);
      }
    } else if (role === 'student') {
      const matchInDb = students.find(s => 
        (s.username?.toLowerCase() === email.trim().toLowerCase()) ||
        (s.email.toLowerCase() === email.trim().toLowerCase())
      );
      if (matchInDb) {
        const expectedPassword = matchInDb.password || 'student123';
        if (password === expectedPassword) {
          loggedInUserId = matchInDb.id;
          success = true;
        } else {
          setError(`Incorrect password for Student profile "${matchInDb.username}".`);
        }
      } else {
        setError(`No registered student was found matching username "${email}".`);
      }
    }

    if (success) {
      setRole(role, loggedInUserId);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto flex items-center justify-center p-4">
      {/* Dark overlay backdrop with blur */}
      <div 
        className="absolute inset-0 bg-natural-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Login Dialog Box */}
      <div className="relative bg-natural-bg w-full max-w-4xl rounded-3xl border border-natural-beige shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh]">
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
                  src="/src/assets/images/school_logo_1779413996009.png" 
                  alt="NUA Logo" 
                  className="w-10 h-10 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-[10px] text-natural-green font-bold uppercase tracking-widest block leading-none">Security Portal</span>
                <h3 className="text-lg font-serif font-bold text-natural-charcoal mt-0.5 leading-none">NEW UNIQUE ACADEMY</h3>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-natural-charcoal tracking-tight">Sign In to Dashboard</h2>
              <p className="text-xs text-natural-charcoal/60 mt-0.5">Academic records, student attendance, class calendars, online tests, and grading ledgers access.</p>
            </div>

            {/* Role picker tabs */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest mb-2">Role Cluster Category</label>
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
                        // Pre-fill fields for a representative account to make it super smooth
                        const acc = demoAccounts.find(d => d.role === r);
                        if (acc) {
                          setEmail(acc.email);
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-250 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs animate-headShake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="font-semibold leading-relaxed">{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-natural-green/85 tracking-widest">
                  {role === 'student' ? 'Student Username / Code' : 'Authorized Email Address'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-natural-green/60 font-semibold select-none text-xs">
                    {role === 'student' ? '#' : '@'}
                  </span>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder={
                      role === 'student' ? 'NUA/2026/001' :
                      role === 'parent' ? 'robert.alvarez@mail.com' :
                      role === 'teacher' ? 'a.turing@academy.org' : 'admin@academy.org'
                    }
                    className="w-full text-xs pl-9 pr-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-natural-green/85 tracking-widest">Portal Protection Password</label>
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

              <button
                type="submit"
                className="w-full py-3 bg-natural-clay hover:bg-natural-clay-hover text-white font-bold text-xs uppercase tracking-widest leading-none shadow-xs rounded-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Sign In securely
              </button>
            </form>
          </div>

          <p className="text-[10px] text-natural-charcoal/40 text-center mt-6 pt-4 border-t border-natural-beige/40">
            Unauthorized activity is logged and handled by regional security guidelines.
          </p>
        </div>

        {/* Right column (Demo accounts helper drawer) */}
        <div className="bg-natural-light/75 border-t md:border-t-0 md:border-l border-natural-beige p-8 md:col-span-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-natural-green">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest block">Authorization Sandbox Quick-Fill</span>
            </div>

            <p className="text-[11px] text-natural-charcoal/70 leading-relaxed font-semibold">
              To test the distinct dashboards requested for parents, students, and staffs, select any profile below to pre-populate credential files instantly:
            </p>

            <div className="space-y-3">
              {demoAccounts.map((acc) => {
                const isCurrentRole = role === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                      isCurrentRole 
                        ? 'bg-white border-natural-green ring-1 ring-natural-green shadow-xs' 
                        : 'bg-white/80 hover:bg-white border-natural-beige/70'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`px-2 py-0.5 text-[8.5px] font-bold rounded uppercase tracking-wider ${
                        acc.role === 'admin' 
                          ? 'bg-natural-clay/20 text-natural-clay' 
                          : acc.role === 'teacher' 
                          ? 'bg-natural-green/20 text-natural-green' 
                          : acc.role === 'parent' 
                          ? 'bg-amber-100/80 text-amber-800'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {acc.label}
                      </span>
                      {isCurrentRole && <Check className="w-3.5 h-3.5 text-natural-green shrink-0 bg-natural-light rounded-full p-0.5" />}
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <p className="font-serif font-black text-natural-charcoal text-xs">{acc.name}</p>
                      <p className="text-[10px] text-natural-green font-bold">Pass: <span className="font-mono bg-natural-light px-1 rounded text-natural-charcoal">{acc.password}</span></p>
                      <p className="text-[10px] text-natural-charcoal/50 leading-tight pt-1">{acc.desc}</p>
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
