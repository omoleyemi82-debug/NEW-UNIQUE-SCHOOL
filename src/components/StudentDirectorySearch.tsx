import React, { useState, useEffect, useRef } from 'react';
import { Student, Course } from '../types';
import { 
  Search, User, Award, School, Sparkles, SlidersHorizontal, 
  Trash2, Pencil, Eye, ShieldAlert, Check, X, Building, BookOpen, Clock 
} from 'lucide-react';

interface StudentDirectorySearchProps {
  students: Student[];
  courses: Course[];
  onInspect: (studentId: string) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  selectedStudentId?: string | null;
}

export default function StudentDirectorySearch({
  students,
  courses,
  onInspect,
  onEdit,
  onDelete,
  selectedStudentId
}: StudentDirectorySearchProps) {
  // Query state
  const [searchQuery, setSearchQuery] = useState('');
  // Filter states
  const [filterClass, setFilterClass] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'suspended'
  const [filterGender, setFilterGender] = useState('all'); // 'all', 'Male', 'Female'

  // Suggestion visual popover active state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions popover on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Split student's name into names block & search query segments to perform matching
  const matchStudentName = (studentName: string, query: string) => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return true;

    const nameParts = studentName.toLowerCase().split(/\s+/);
    const queryParts = cleanQuery.split(/\s+/);

    // 1. Check if ANY query word matches or is a prefix/substring of any single part in the name
    // e.g. "Ade" matches "Adebayo" or "Adeniyi" or "Adelakun"
    // Also "Ade Adeniran" matches "Adebayo Adeniran"
    return queryParts.every(qPart => 
      nameParts.some(nPart => nPart.includes(qPart))
    );
  };

  // Main Filter Algorithm
  const getFilteredStudents = () => {
    return students.filter(student => {
      // Search matching (by Name parts, admission number, email, or registry ID)
      const queryClean = searchQuery.trim().toLowerCase();
      const stNameClean = student.name.toLowerCase();
      const stEmailClean = student.email.toLowerCase();
      const stIdClean = student.id.toLowerCase();
      const stAdmClean = (student.admissionNumber || '').toLowerCase();
      const stUserClean = (student.username || '').toLowerCase();

      let isMatchedBySearch = true;
      if (queryClean) {
        // High accuracy name matching
        const matchesName = matchStudentName(student.name, searchQuery);
        
        // Passport or meta lookups
        const matchesEmail = stEmailClean.includes(queryClean);
        const matchesId = stIdClean.includes(queryClean);
        const matchesAdm = stAdmClean.includes(queryClean);
        const matchesUsername = stUserClean.includes(queryClean);

        isMatchedBySearch = matchesName || matchesEmail || matchesId || matchesAdm || matchesUsername;
      }

      // Class matches
      const isMatchedByClass = filterClass === 'all' || student.gradeLevel === filterClass;

      // Department matches
      const isMatchedByDept = filterDepartment === 'all' || 
        (student.department && student.department.toLowerCase() === filterDepartment.toLowerCase());

      // Status matches
      const isAcctActive = student.isActiveAccount !== false;
      const isMatchedByStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && isAcctActive) ||
        (filterStatus === 'suspended' && !isAcctActive);

      // Gender matches
      const isMatchedByGender = filterGender === 'all' || 
        (student.gender && student.gender.toLowerCase() === filterGender.toLowerCase());

      return isMatchedBySearch && isMatchedByClass && isMatchedByDept && isMatchedByStatus && isMatchedByGender;
    });
  };

  const filteredStudents = getFilteredStudents();

  // Highlight character search matches in result preview
  const highlightMatch = (text: string, search: string) => {
    if (!search || !search.trim()) return <span>{text}</span>;
    const cleanSearch = search.trim().toLowerCase();
    const regex = new RegExp(`(${cleanSearch.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === cleanSearch ? (
            <span key={index} className="bg-amber-100 text-amber-900 font-extrabold px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Extract unique grade level classes currently represented in database students records
  const getRepresentedClasses = () => {
    const set = new Set(students.map(s => s.gradeLevel));
    return Array.from(set).sort();
  };

  const activeClasses = getRepresentedClasses();

  return (
    <div className="space-y-4 font-sans text-slate-800" ref={dropdownRef}>
      
      {/* SEARCH AND INTERACTIVE AUTO-SUGGESTION CONTROLLER */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search first, middle, surname, admission no, or class placement..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full text-xs pl-9 pr-10 py-3 bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none shadow-xs transition-all placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-3 p-1 rounded-full hover:bg-slate-100 text-slate-425 hover:text-slate-600 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* QUICK SUMMARY BADGE INDICES */}
          <div className="shrink-0 flex items-center justify-between px-4 py-2.5 bg-indigo-50/50 rounded-2xl border border-indigo-100/40 text-[10px] font-bold text-indigo-700 select-none uppercase tracking-wide">
            <span>Result Pool: {filteredStudents.length} of {students.length} Pupils</span>
          </div>
        </div>

        {/* Dynamic Suggester Dropdown - Instant Match while typing */}
        {showSuggestions && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 divide-y divide-slate-150 overflow-hidden max-h-[300px] overflow-y-auto animate-fade-in">
            <div className="px-3.5 py-1.5 bg-slate-50 text-[9px] font-black text-indigo-600/70 uppercase tracking-widest flex justify-between items-center">
              <span>Dynamic Suggestion Matches</span>
              <span className="font-mono text-[8px] transform scale-90">Auto-Filtered</span>
            </div>
            {filteredStudents.slice(0, 5).map((student) => {
              const isActive = student.isActiveAccount !== false;
              return (
                <div
                  key={student.id}
                  onClick={() => {
                    setSearchQuery(student.name);
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-3 hover:bg-indigo-50/50 cursor-pointer flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    {/* Student Passport Photo Preview in Suggestions */}
                    <div className="relative">
                      <img
                        src={student.passportPhoto || student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop'}
                        alt="Preview passport"
                        className="w-8 h-8 rounded-full object-cover border border-slate-150 transition group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop';
                        }}
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                        isActive ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {highlightMatch(student.name, searchQuery)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                        {student.admissionNumber || 'No Admission No.'} • <span className="text-indigo-650">{student.gradeLevel}</span> • Dept: <span className="font-bold text-slate-650">{student.department || 'N/A'}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Link within suggestion */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspect(student.id);
                        setShowSuggestions(false);
                      }}
                      className="p-1 hover:bg-white rounded-lg text-emerald-600"
                      title="Inspect Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(student);
                        setShowSuggestions(false);
                      }}
                      className="p-1 hover:bg-white rounded-lg text-indigo-600"
                      title="Edit Profile"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredStudents.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400 italic">
                No students match "{searchQuery}"
              </div>
            )}
            {filteredStudents.length > 5 && (
              <div className="px-4 py-2 bg-slate-50 font-serif italic text-[10px] text-slate-400 text-center">
                + {filteredStudents.length - 5} more matches. Keep typing to narrow down...
              </div>
            )}
          </div>
        )}
      </div>

      {/* FILTER DRAWER / CONTROLLER RACK */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Class Level */}
        <div>
          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grade Class</label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Classes</option>
            {activeClasses.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* Department placement */}
        <div>
          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Department</label>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="science">Sciences</option>
            <option value="art">Arts & Lit</option>
            <option value="commerce">Commerce</option>
            <option value="n/a">N/A (Junior Classes)</option>
          </select>
        </div>

        {/* Gender category */}
        <div>
          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gender Group</label>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* System account active status */}
        <div>
          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Registry</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Enrollees</option>
            <option value="active">Active Accounts</option>
            <option value="suspended">Suspended Accounts</option>
          </select>
        </div>
      </div>

      {/* QUICK STATUS TAG BAR */}
      {(filterClass !== 'all' || filterDepartment !== 'all' || filterStatus !== 'all' || filterGender !== 'all' || searchQuery) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-md">
              "{searchQuery}"
              <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setSearchQuery('')} />
            </span>
          )}
          {filterClass !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-md">
              Class: {filterClass}
              <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setFilterClass('all')} />
            </span>
          )}
          {filterDepartment !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-md animate-fade-in">
              Dept: {filterDepartment}
              <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setFilterDepartment('all')} />
            </span>
          )}
          {filterGender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-md animate-fade-in">
              Gender: {filterGender}
              <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setFilterGender('all')} />
            </span>
          )}
          {filterStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-md animate-fade-in">
              Status: {filterStatus}
              <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setFilterStatus('all')} />
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterClass('all');
              setFilterDepartment('all');
              setFilterStatus('all');
              setFilterGender('all');
            }}
            className="text-[9px] text-[#A6802B] hover:text-[#5c4613] font-bold hover:underline ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* RESULT DIRECTORY - MOBILE RESPONSIVE CARDS vs DESKTOP LISTS VIEWGRID */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 text-slate-400 p-8 rounded-2xl flex flex-col justify-center items-center text-center space-y-2">
          <ShieldAlert className="w-10 h-10 text-[#A6802B]/60" />
          <h5 className="font-serif font-bold text-slate-800 text-sm">No Enrolled Target Found</h5>
          <p className="text-[11px] max-w-sm">No student matching your specific queries represents any records. Try adjusting input keywords or filters above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          
          {/* 1. DESKTOP VIEW - HIGHLY DENSE PROFESSIONAL METADATA TABLE SHEET (md:block hidden) */}
          <div className="hidden md:block bg-white border border-slate-200/85 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-705 border-collapse">
              <thead className="bg-slate-50/70 text-[9.5px] font-black text-slate-450 uppercase tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Student Passport / Bio</th>
                  <th className="px-4 py-3">Admission Number</th>
                  <th className="px-4 py-3">Academic Placement</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Guardian Sponsor</th>
                  <th className="px-4 py-3 text-right">Directory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredStudents.map((st) => {
                  const isActive = st.isActiveAccount !== false;
                  return (
                    <tr 
                      key={st.id}
                      className={`hover:bg-slate-50/50 transition-colors ${
                        selectedStudentId === st.id ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {/* Name & Photo Passport */}
                      <td className="px-4 py-3 flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={st.passportPhoto || st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'}
                            alt={`${st.name} Passport`}
                            className="w-10 h-10 rounded-full object-cover border border-slate-150 shadow-xs"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop';
                            }}
                          />
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                            isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{st.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block">{st.email}</span>
                        </div>
                      </td>

                      {/* Admission Code */}
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-slate-800 text-[11px] bg-slate-100/80 border border-slate-200/50 px-2 py-1 rounded-lg">
                          {st.admissionNumber || 'NUA-26-001'}
                        </span>
                      </td>

                      {/* Grade Class */}
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-[#1A365D] block">{st.gradeLevel}</span>
                          <span className="text-[9px] text-slate-400 font-bold block">Joined: {st.joinedDate}</span>
                        </div>
                      </td>

                      {/* Department Block */}
                      <td className="px-4 py-3 text-[10.5px]">
                        <span className={`px-2.5 py-1 rounded-full font-extrabold text-[9.5px] uppercase tracking-wider ${
                          st.department === 'Science' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          st.department === 'Art' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          st.department === 'Commerce' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                          'bg-slate-50 border border-slate-150 text-slate-500'
                        }`}>
                          {st.department || 'N/A'}
                        </span>
                      </td>

                      {/* Guardian name and phone */}
                      <td className="px-4 py-3">
                        <div className="text-[11px] text-slate-700 font-semibold">
                          <span>{st.guardianName}</span>
                          <span className="block text-[9.5px] font-mono text-slate-400 tracking-tight mt-0.5">{st.guardianPhone}</span>
                        </div>
                      </td>

                      {/* Table actions column */}
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onInspect(st.id)}
                            className="p-2 hover:bg-slate-100 text-indigo-700 hover:text-indigo-900 rounded-xl transition"
                            title="Inspect Database Log Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(st)}
                            className="p-2 hover:bg-slate-100 text-teal-600 hover:text-teal-850 rounded-xl transition"
                            title="Edit Student Profile Data"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(st.id)}
                            className="p-2 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-xl transition"
                            title="Expel Student File"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 2. MOBILE VIEW - GORGEOUS GRID CARD VIEW WITH LARGE TAP TARGETS (md:hidden block) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredStudents.map((st) => {
              const isActive = st.isActiveAccount !== false;
              return (
                <div 
                  key={st.id}
                  className={`bg-white border p-4 rounded-2xl shadow-xs space-y-3.5 transition flex flex-col justify-between ${
                    selectedStudentId === st.id ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200'
                  }`}
                >
                  {/* Top: Passport Photo and main details */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={st.passportPhoto || st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'}
                        alt={`${st.name} Passport`}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-150"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop';
                        }}
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                        isActive ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                    </div>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-slate-905 text-sm truncate">{st.name}</span>
                        {!isActive && (
                          <span className="text-[7px] uppercase font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1 rounded">Suspended</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold select-none">
                        <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase font-bold">{st.gradeLevel}</span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">{st.department || 'General'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body details metadata row */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/55 p-2.5 rounded-xl border border-slate-150 text-[10px] leading-relaxed">
                    <div>
                      <span className="text-slate-400 uppercase font-bold block mb-0.5">Admin No.</span>
                      <span className="font-mono font-bold text-slate-800">{st.admissionNumber || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-bold block mb-0.5">Guardian Sponsor</span>
                      <span className="font-bold text-slate-800 tracking-tight block truncate">{st.guardianName}</span>
                    </div>
                  </div>

                  {/* Actions bar at bottom with safe 44px tap target height profiles */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onInspect(st.id)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 rounded-xl text-[10.5px] uppercase flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect
                    </button>
                    <button
                      onClick={() => onEdit(st)}
                      className="flex-1 py-2 bg-[#1A365D] text-white hover:bg-[#152e50] font-bold rounded-xl text-[10.5px] uppercase flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(st.id)}
                      className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center cursor-pointer transition"
                      title="Expel Student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
