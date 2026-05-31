import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Clock, 
  Lock, 
  CheckCircle2, 
  X, 
  Building, 
  Briefcase, 
  GraduationCap, 
  Users, 
  FileText,
  Save,
  Key
} from 'lucide-react';
import { encryptPassword } from '../utils/security';

export default function ProfilePage() {
  const { 
    currentRole, 
    currentUserId, 
    students, 
    teachers, 
    parents, 
    admins,
    updateStudent,
    updateTeacher,
    updateParent,
    updateAdmin
  } = useSchool();

  // Find user based on active credentials
  let userRecord: any = null;
  let userName = '';
  let userEmail = '';
  let userAvatar = '';
  let userBio = '';
  let userJoinedDate = '';

  if (currentRole === 'student') {
    userRecord = students.find(s => s.id === currentUserId) || students[0];
    if (userRecord) {
      userName = userRecord.name;
      userEmail = userRecord.email;
      userAvatar = userRecord.avatar || '';
      userBio = `Student of ${userRecord.gradeLevel} in ${userRecord.department || 'General'} Department`;
      userJoinedDate = userRecord.joinedDate || '2025-09-01';
    }
  } else if (currentRole === 'teacher') {
    userRecord = teachers.find(t => t.id === currentUserId) || teachers[0];
    if (userRecord) {
      userName = userRecord.name;
      userEmail = userRecord.email;
      userAvatar = userRecord.avatar || '';
      userBio = userRecord.bio || 'Qualified Academic Faculty Member';
      userJoinedDate = userRecord.joinedDate || '2024-05-15';
    }
  } else if (currentRole === 'parent') {
    userRecord = parents.find(p => p.id === currentUserId) || parents[0];
    if (userRecord) {
      userName = userRecord.name;
      userEmail = userRecord.email;
      userAvatar = userRecord.avatar || '';
      userBio = 'Authorized School Parent/Guardian';
      userJoinedDate = '2025-01-10';
    }
  } else if (currentRole === 'admin') {
    userRecord = admins.find(a => a.id === currentUserId) || admins[0];
    if (userRecord) {
      userName = userRecord.name;
      userEmail = userRecord.email;
      userAvatar = userRecord.avatar || '';
      userBio = 'School System Administrator';
      userJoinedDate = '2024-01-01';
    }
  }

  // Preset avatars for easy customization
  const presetAvatars = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  ];

  // Forms states
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [avatar, setAvatar] = useState(userAvatar || presetAvatars[0]);
  const [phone, setPhone] = useState(userRecord?.phone || userRecord?.studentPhone || userRecord?.guardianPhone || '');
  const [address, setAddress] = useState(userRecord?.homeAddress || userRecord?.address || '');
  const [bio, setBio] = useState(userBio);
  const [gender, setGender] = useState(userRecord?.gender || 'N/A');
  const [dob, setDob] = useState(userRecord?.dateOfBirth || '');
  const [stateOfOrigin, setStateOfOrigin] = useState(userRecord?.state || '');
  const [lga, setLga] = useState(userRecord?.lga || '');

  // Teacher specific fields
  const [qualification, setQualification] = useState(userRecord?.qualification || '');
  const [yearsOfExp, setYearsOfExp] = useState(userRecord?.yearsOfExperience || 0);

  // Student specific fields
  const [guardianName, setGuardianName] = useState(userRecord?.guardianName || '');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status banners
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'password' | 'settings'>('profile');

  if (!userRecord) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center text-slate-400">
        Profile data could not be parsed. Log out and try signing in again.
      </div>
    );
  }

  // Handle Profile Update
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload: any = {
        name,
        email,
        avatar
      };

      if (currentRole === 'student') {
        payload.studentPhone = phone;
        payload.homeAddress = address;
        payload.gender = gender;
        payload.dateOfBirth = dob;
        payload.state = stateOfOrigin;
        payload.lga = lga;
        updateStudent(currentUserId, payload);
      } else if (currentRole === 'teacher') {
        payload.phone = phone;
        payload.address = address;
        payload.bio = bio;
        payload.gender = gender;
        payload.dateOfBirth = dob;
        payload.state = stateOfOrigin;
        payload.lga = lga;
        payload.qualification = qualification;
        payload.yearsOfExperience = Number(yearsOfExp);
        updateTeacher(currentUserId, payload);
      } else if (currentRole === 'parent') {
        payload.phone = phone;
        payload.address = address;
        payload.state = stateOfOrigin;
        payload.lga = lga;
        updateParent(currentUserId, payload);
      } else if (currentRole === 'admin') {
        payload.phone = phone;
        updateAdmin(currentUserId, payload);
      }

      setSuccessMsg('Your security profile biodata has been successfully persisted in the school database!');
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err: any) {
      setErrorMsg('Failed to update credentials database: ' + err.message);
    }
  };

  // Handle Secure Password Update
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!newPassword || !confirmPassword) {
      setErrorMsg('All password change fields are strictly required.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Your password confirmation does not match the new password.');
      return;
    }

    const encrypted = encryptPassword(newPassword);

    try {
      if (currentRole === 'student') {
        updateStudent(currentUserId, { password: encrypted });
      } else if (currentRole === 'teacher') {
        updateTeacher(currentUserId, { password: encrypted });
      } else if (currentRole === 'parent') {
        updateParent(currentUserId, { password: encrypted });
      } else if (currentRole === 'admin') {
        updateAdmin(currentUserId, { password: encrypted });
      }

      setSuccessMsg('Your secure portal login credentials have been updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err: any) {
      setErrorMsg('Failed to alter security credential records: ' + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-left animate-fade-in text-[#0B1F3B]">
      
      {/* Visual Header Grid */}
      <div className="bg-gradient-to-r from-sky-900 to-[#1E4D8F] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(56,189,248,0.12),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img 
              src={avatar || presetAvatars[0]} 
              alt={name} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = presetAvatars[0];
              }}
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-xl sm:text-2xl font-serif font-black">{name}</h1>
                <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-white/10 text-sky-300 border border-white/10 rounded-md">
                  {currentRole} Access
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-normal max-w-md">{bio}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-300 pt-1 font-mono justify-center sm:justify-start">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-sky-400" /> Joined {userJoinedDate}</span>
                <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-sky-400" /> Primary Campus Ado-Ekiti</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-2xl flex items-start gap-3 mb-6 animate-fade-in shadow-xs leading-normal">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs font-semibold rounded-2xl flex items-start gap-3 mb-6 animate-fade-in shadow-xs leading-normal">
          <X className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2 lg:col-span-1">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-colors ${
              activeSubTab === 'profile' 
                ? 'bg-[#1E4D8F] text-white shadow-md' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm'
            }`}
          >
            <User className="w-4 h-4" /> Personal Profile
          </button>
          
          <button
            onClick={() => setActiveSubTab('password')}
            className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-colors ${
              activeSubTab === 'password' 
                ? 'bg-[#1E4D8F] text-white shadow-md' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm'
            }`}
          >
            <Lock className="w-4 h-4" /> Security Settings
          </button>
        </div>

        {/* Dynamic Detail Card */}
        <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          
          {/* TAB 1: EDIT PROFILE BIODATA */}
          {activeSubTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div>
                <h2 className="text-base font-serif font-bold text-[#0B1F3B] uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1E4D8F]" /> Academic Record & Personal Biodata
                </h2>
                <p className="text-[11px] text-slate-450 mt-1">Revise your physical home coordinates, phone numbers, state credentials below.</p>
              </div>

              {/* Avatar Selector Presets */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">Choose Profile Costume Avatar Preset</label>
                <div className="flex flex-wrap gap-3">
                  {presetAvatars.map((avUrl, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setAvatar(avUrl)}
                      className={`relative rounded-xl overflow-hidden border-2 w-12 h-12 transition-all p-0 cursor-pointer ${
                        avatar === avUrl ? 'border-[#1E4D8F] scale-105 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={avUrl} alt={`Preset ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {avatar === avUrl && (
                        <div className="absolute inset-0 bg-sky-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white fill-[#1E4D8F]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full name (readonly except admins) */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Full Roster Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                    placeholder="e.g. Adebayo Robert"
                  />
                </div>

                {/* Email (readonly except admins) */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Official Portal Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                    placeholder="e.g. adebayo@academy.org"
                  />
                </div>

                {/* Mobile Line */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Contact Telephone Line</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                    placeholder="e.g. +234 810 555 4910"
                  />
                </div>

                {/* Biodata Coordinates - Gender */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Gender Identity</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Decline to State</option>
                  </select>
                </div>

                {/* Birth Coordinates */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                  />
                </div>

                {/* State of Origin */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">State of Origin</label>
                  <input
                    type="text"
                    value={stateOfOrigin}
                    onChange={(e) => setStateOfOrigin(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                    placeholder="e.g. Ekiti State"
                  />
                </div>

                {/* LGA */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Local Govt Area (LGA)</label>
                  <input
                    type="text"
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                    placeholder="e.g. Ado-Ekiti LGA"
                  />
                </div>

                {/* Teacher specific qualification */}
                {currentRole === 'teacher' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Teaching Credential Qualification</label>
                      <input
                        type="text"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                        placeholder="e.g. B.Sc, B.Ed Mathematics"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Years of Teaching Experience</label>
                      <input
                        type="number"
                        value={yearsOfExp}
                        onChange={(e) => setYearsOfExp(Number(e.target.value))}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                        min={0}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Bio block for Staff/Teacher */}
              {currentRole === 'teacher' && (
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Personal Staff Biography</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                    placeholder="Tell us about your secondary academic philosophy..."
                  />
                </div>
              )}

              {/* Home Coordinates Address */}
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Contact Home Address Location</label>
                <input
                  type="text"
                  required={currentRole !== 'admin'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                  placeholder="Street Coordinate, Ado-Ekiti"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1E4D8F] hover:bg-[#1E4D8F]/95 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4 text-white" /> Save Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURE PASSWORD CHANGE */}
          {activeSubTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <h2 className="text-base font-serif font-bold text-[#0B1F3B] uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#1E4D8F]" /> Portal security encryption Change
                </h2>
                <p className="text-[11px] text-slate-450 mt-1">Alter your active password key block. Must contain at least 6 characters physically.</p>
              </div>

              <div className="space-y-4 max-w-md">
                
                {/* New password input */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">New Password Key</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                    placeholder="Enter new 6+ characters pass"
                  />
                  {newPassword.length > 0 && newPassword.length < 6 && (
                    <span className="text-[10px] text-red-500 font-semibold block">Password must be at least 6 characters in length.</span>
                  )}
                </div>

                {/* Confirm password input */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Confirm New Password Key</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#1E4D8F]/20 rounded-xl outline-none focus:border-[#1E4D8F] text-slate-800 transition-all font-medium"
                    placeholder="Repeat new password key"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <span className="text-[10px] text-red-500 font-semibold block">The confirmation password does not match the new password.</span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1e3a8a] text-white hover:bg-slate-900 border border-transparent shadow shadow-slate-900/10 text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer"
                  >
                    Set New Password encryption
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
