import React, { useState, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { encryptPassword } from '../utils/security';
import { ShieldAlert, Sparkles, User, Mail, Phone, Lock, Upload, Image as ImageIcon, CheckCircle, ArrowRight, Building } from 'lucide-react';

export default function SetupPortal() {
  const { admins, addAdmin, updateSchoolName, setRole, trackLoginActivity } = useSchool();
  
  const [fullName, setFullName] = useState('');
  const [schoolNameInput, setSchoolNameInput] = useState('New Unique Academy');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file for the profile photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarBase64(reader.result);
        setError('');
      }
    };
    reader.onerror = () => {
      setError('Failed to process image upload.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!fullName || !email || !phone || !username || !password || !confirmPassword) {
      setError('All mandatory credentials and contact fields are strictly required.');
      return;
    }

    if (password.length < 6) {
      setError('Setup Password must reside on at least 6 secure characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('The Password and Confirmation Password do not match.');
      return;
    }

    try {
      // 1. Encrypt first Super Admin password
      const hashedPassword = encryptPassword(password);

      // 2. Assemble Super Admin Object
      const superAdminId = `admin_super_${Date.now()}`;
      
      // Save School Name
      updateSchoolName(schoolNameInput);

      // Save First Super Admin in Local Database (via the Context)
      addAdmin({
        name: fullName,
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: hashedPassword,
        role: 'super_admin',
        permissions: ['full_access', 'user_management', 'finances', 'grades', 'cbt'],
        isActiveAccount: true,
        avatar: avatarBase64 || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        schoolName: schoolNameInput
      });

      // Track Login Activity
      trackLoginActivity(username, 'super_admin', 'SUCCESS', 'First Super Admin initialized & system setup finalized');

      setSuccess(true);
      
      // Redirect to Admin Dashboard
      setTimeout(() => {
        setRole('admin', superAdminId);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'System error during Super Admin register.');
    }
  };

  return (
    <div className="min-h-screen bg-natural-light/50 flex flex-col justify-center items-center p-6" id="setup-portal-root">
      <div className="w-full max-w-2xl bg-white border border-natural-beige rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-natural-clay/5 rounded-bl-full pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-natural-light border border-natural-beige rounded-2xl text-natural-green shadow-xs mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-natural-charcoal">
            Create School Administrator Account
          </h1>
          <p className="text-xs text-natural-charcoal/60 max-w-md mx-auto">
            Welcome to your new modern Academic Command Portal. Please configure the primary Super Admin profile to lock, encrypt, and deploy the application environment securely.
          </p>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in" id="setup-success-panel">
            <div className="w-16 h-16 bg-natural-green/10 text-natural-green rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-natural-charcoal">Super Admin Created!</h3>
              <p className="text-xs text-natural-charcoal/50">Standard environment generated. Transitioning to security terminal...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" id="setup-fields-form">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs font-semibold animate-headShake" id="setup-error-banner">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-natural-green tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Preston Vance"
                    className="w-full text-xs px-4 py-3 bg-natural-light/50 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-natural-green tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolNameInput}
                    onChange={(e) => setSchoolNameInput(e.target.value)}
                    placeholder="e.g. New Unique Academy"
                    className="w-full text-xs px-4 py-3 bg-natural-light/50 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-natural-green tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Super Admin Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pres.vance@academy.org"
                    className="w-full text-xs px-4 py-3 bg-natural-light/50 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-natural-green tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 (803) 111-2222"
                    className="w-full text-xs px-4 py-3 bg-natural-light/50 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                  />
                </div>
              </div>

              {/* Right Column Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-natural-green tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-600" /> Username Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="superadmin"
                    className="w-full text-xs px-4 py-3 bg-natural-light/50 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-natural-green tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-4 py-3 bg-natural-light/50 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-natural-green tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-4 py-3 bg-natural-light/50 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium font-mono"
                  />
                </div>

                {/* Profile Photo Uploader */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-natural-green tracking-wider flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Profile Photo Upload
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex items-center justify-center gap-3 h-[42px] overflow-hidden ${
                      isDragging 
                        ? 'border-natural-green bg-natural-green/5' 
                        : 'border-natural-beige bg-natural-light/50 hover:bg-natural-light'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {avatarBase64 ? (
                      <div className="flex items-center gap-2">
                        <img 
                          src={avatarBase64} 
                          alt="Uploaded avatar" 
                          className="w-7 h-7 object-cover rounded-full border border-natural-beige"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] text-natural-green font-bold">Photo Uploaded Ready</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 text-natural-charcoal/40" />
                        <span className="text-[10px] text-natural-charcoal/50 font-bold uppercase tracking-wider">Drag or Select Image</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4.5 bg-natural-clay hover:bg-natural-clay-hover text-white font-bold text-xs uppercase tracking-widest leading-none shadow-md rounded-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Finalize System Installation & Login <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
