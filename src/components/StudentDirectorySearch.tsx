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

  // Close suggestions popover on clicking text outside
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

    // Split candidate name parts: Adebayo, Benson, Adeniyi etc. This supports searching by parts of names
    const nameParts = studentName.toLowerCase().split(/\s+/);
    const queryParts = cleanQuery.split(/\s+/);

    // Typing " Ade" matches "Adebayo" or "Adeniyi" or "Adelakun"
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
        const matchesName = matchStudentName(student.name, searchQuery) || stNameClean.includes(queryClean);
        
        // Passport or meta lookups
        const matchesEmail = stEmailClean.includes(queryClean);
        const matchesId = stIdClean.includes(queryClean);
        const matchesAdm = stAdmClean.includes(queryClean);
        const matchesUsername = stUserClean.includes(queryClean);
        const matchesClass = (student.gradeLevel || '').toLowerCase().includes(queryClean);
        const matchesDept = (student.department || '').toLowerCase().includes(queryClean);

        isMatchedBySearch = matchesName || matchesEmail || matchesId || matchesAdm || matchesUsername || matchesClass || matchesDept;
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
            <span key={index} className="bg-sky-500/20 text-sky-400 font-extrabold px-1 rounded">
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
    <div className="space-y-4 font-sans text-slate-300" ref={dropdownRef}>
      
      {/* SEARCH AND INTERACTIVE AUTO-SUGGESTION CONTROLLER */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search first, middle, surname, admission number or class..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full text-xs pl-10 pr-10 py-3 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-2xl outline-none shadow-md transition-all placeholder:text-slate-500 text-slate-100 font-semibold"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-3 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* QUICK SUMMARY INDEX */}
          <div className="shrink-0 flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-[10px] font-black text-sky-400 select-none uppercase tracking-widest">
            <span>Result Pool: {filteredStudents.length} of {students.length} Pupils</span>
          </div>
        </div>

        {/* Dynamic Suggester Dropdown - Instant Match while typing */}
        {showSuggestions && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl z-50 divide-y divide-slate-950 overflow-hidden max-h-[300px] overflow-y-auto animate-fade-in">
            <div className="px-4 py-2 bg-slate-950 text-[9px] font-black text-sky-400 uppercase tracking-widest flex justify-between items-center border-b border-slate-900">
              <span>Dynamic Suggestions Match</span>
              <span className="font-mono text-[8px] tracking-wide text-slate-500">Live Filters Active</span>
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
                  className="px-4 py-3 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    {/* Student Passport Photo Preview in Suggestions */}
                    <div className="relative">
                      <img
                        src={student.passportPhoto || student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop'}
                        alt="Preview passport"
                        className="w-9 h-9 rounded-xl object-cover border border-slate-800 transition group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop';
                        }}
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                        isActive ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-105 block">
                        {highlightMatch(student.name, searchQuery)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                        {student.admissionNumber || 'No Adm.'} • <span className="text-sky-400 font-bold">{student.gradeLevel}</span> • Division: <span className="text-slate-300 font-bold">{student.department || 'N/A'}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Link within suggestion */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspect(student.id);
                        setShowSuggestions(false);
                      }}
                      className="p-1.5 hover:bg-slate-950 border border-transparent hover:border-slate-800 rounded-lg text-emerald-400"
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
                      className="p-1.5 hover:bg-slate-950 border border-transparent hover:border-slate-800 rounded-lg text-sky-400"
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
              <div className="px-4 py-2 bg-slate-950/80 font-mono text-[9px] text-slate-500 text-center border-t border-slate-950">
                + {filteredStudents.length - 5} more records. Limit auto-suggestions.
              </div>
            )}
          </div>
        )}
      </div>

      {/* FILTER DRAWER / CONTROLLER RACK */}
      <div className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Class Level */}
        <div>
          <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Grade Class</label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full text-xs px-2.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-300 font-bold cursor-pointer"
          >
            <option value="all">All Classes</option>
            {activeClasses.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* Department placement */}
        <div>
          <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Department</label>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full text-xs px-2.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-300 font-bold cursor-pointer"
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
          <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Gender Group</label>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="w-full text-xs px-2.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-300 font-bold cursor-pointer"
          >
            <option value="all">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* System account active status */}
        <div>
          <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status Registry</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs px-2.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-300 font-bold cursor-pointer"
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
          <span className="text-[9px] font-bold text-slate-500 uppercase mr-1">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 text-sky-400 font-bold text-[10px] rounded-lg">
              "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </span>
          )}
          {filterClass !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 text-sky-400 font-bold text-[10px] rounded-lg">
              Class: {filterClass}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterClass('all')} />
            </span>
          )}
          {filterDepartment !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 text-sky-400 font-bold text-[10px] rounded-lg animate-fade-in">
              Dept: {filterDepartment}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterDepartment('all')} />
            </span>
          )}
          {filterGender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 text-sky-400 font-bold text-[10px] rounded-lg animate-fade-in">
              Gender: {filterGender}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterGender('all')} />
            </span>
          )}
          {filterStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 text-sky-400 font-bold text-[10px] rounded-lg animate-fade-in">
              Status: {filterStatus}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterStatus('all')} />
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
            className="text-[9.5px] text-sky-400 hover:text-sky-300 font-bold hover:underline ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* RESULT DIRECTORY - MOBILE RESPONSIVE CARDS vs DESKTOP LISTS VIEWGRID */}
      {filteredStudents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800/80 text-slate-400 p-8 rounded-3xl flex flex-col justify-center items-center text-center space-y-2">
          <ShieldAlert className="w-10 h-10 text-sky-400/40" />
          <h5 className="font-serif font-bold text-white text-sm">No Enrolled Target Found</h5>
          <p className="text-[11px] max-w-sm">No student matching your specific queries was found. Adjust search parameters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          
          {/* 1. DESKTOP VIEW - HIGHLY DENSE PROFESSIONAL METADATA TABLE SHEET (md:block hidden) */}
          <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead className="bg-[#060b18] text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-950">
                <tr>
                  <th className="px-4 py-3">Student Passport / Bio</th>
                  <th className="px-4 py-3">Admission Number</th>
                  <th className="px-5 py-3">Academic Placement</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Guardian Sponsor</th>
                  <th className="px-4 py-3 text-right">Directory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950 font-sans">
                {filteredStudents.map((st) => {
                  const isActive = st.isActiveAccount !== false;
                  return (
                    <tr 
                      key={st.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        selectedStudentId === st.id ? 'bg-slate-800/65' : ''
                      }`}
                    >
                      {/* Name & Photo Passport */}
                      <td className="px-4 py-3.5 flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={st.passportPhoto || st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'}
                            alt={`${st.name} Passport`}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop';
                            }}
                          />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                            isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 block">{st.name}</span>
                          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">{st.email}</span>
                        </div>
                      </td>

                      {/* Admission Code */}
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-sky-400 text-[10px] bg-slate-950 border border-slate-800/80 px-2.5 py-1 rounded-lg tracking-widest uppercase">
                          {st.admissionNumber || 'NUA-26-001'}
                        </span>
                      </td>

                      {/* Grade Class */}
                      <td className="px-5 py-3">
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-slate-205 block uppercase tracking-wider">{st.gradeLevel}</span>
                          <span className="text-[9px] text-slate-500 font-bold block">Joined: {st.joinedDate}</span>
                        </div>
                      </td>

                      {/* Department Block */}
                      <td className="px-4 py-3 text-[10.5px]">
                        <span className={`px-2.5 py-1 rounded-md font-extrabold text-[9px] uppercase tracking-wider border ${
                          st.department === 'Science' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          st.department === 'Art' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          st.department === 'Commerce' ? 'bg-sky-500/10 text-sky-450 border-sky-500/20' :
                          'bg-slate-950 border border-slate-850 text-slate-500'
                        }`}>
                          {st.department || 'N/A'}
                        </span>
                      </td>

                      {/* Guardian name and phone */}
                      <td className="px-4 py-3">
                        <div className="text-[11px] text-slate-350">
                          <span className="font-bold block">{st.guardianName}</span>
                          <span className="block text-[9.5px] font-mono text-slate-500 tracking-tight mt-0.5">{st.guardianPhone}</span>
                        </div>
                      </td>

                      {/* Table actions column */}
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onInspect(st.id)}
                            className="p-2 hover:bg-slate-950 border border-transparent hover:border-slate-800 text-emerald-400 rounded-xl transition"
                            title="Inspect Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(st)}
                            className="p-2 hover:bg-slate-950 border border-transparent hover:border-slate-800 text-sky-400 rounded-xl transition"
                            title="Edit Student File"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(st.id)}
                            className="p-2 hover:bg-red-950/40 border border-transparent hover:border-red-900/30 text-rose-400 rounded-xl transition"
                            title="Expel Student"
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
                  className={`bg-slate-900 border p-4 rounded-3xl shadow-md space-y-3.5 transition flex flex-col justify-between ${
                    selectedStudentId === st.id ? 'border-sky-500/40' : 'border-slate-800'
                  }`}
                >
                  {/* Top: Passport Photo and main details */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={st.passportPhoto || st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'}
                        alt={`${st.name} Passport`}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-800"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop';
                        }}
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                        isActive ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                    </div>

                    <div className="space-y-0.5 flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-white text-xs uppercase tracking-wide truncate">{st.name}</span>
                        {!isActive && (
                          <span className="text-[7px] uppercase font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded leading-none">Suspended</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold select-none pt-0.5">
                        <span className="bg-sky-500/10 text-sky-400 font-extrabold px-1.5 py-0.5 rounded text-[8.5px] uppercase border border-sky-500/20 leading-none">{st.gradeLevel}</span>
                        <span>•</span>
                        <span className="bg-slate-950 text-slate-350 px-1.5 py-0.5 rounded border border-slate-800 leading-none">{st.department || 'General'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body details metadata row */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-[10px] leading-relaxed text-left">
                    <div>
                      <span className="text-slate-500 uppercase font-black text-[8px] tracking-wider block mb-0.5">Admin No.</span>
                      <span className="font-mono font-bold text-sky-400 tracking-wider">{st.admissionNumber || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase font-black text-[8px] tracking-wider block mb-0.5">Guardian Sponsor</span>
                      <span className="font-bold text-slate-200 tracking-tight block truncate">{st.guardianName}</span>
                    </div>
                  </div>

                  {/* Actions bar at bottom with safe 44px tap target height profiles */}
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => onInspect(st.id)}
                      className="flex-1 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-850 font-bold text-slate-300 rounded-xl text-[10.5px] uppercase flex items-center justify-center gap-1 cursor-pointer transition h-11"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect
                    </button>
                    <button
                      onClick={() => onEdit(st)}
                      className="flex-1 py-2.5 bg-sky-600 text-white hover:bg-sky-500 font-bold rounded-xl text-[10.5px] uppercase flex items-center justify-center gap-1 cursor-pointer transition h-11"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(st.id)}
                      className="py-2.5 px-3 bg-red-950/20 border border-red-900/30 text-rose-400 rounded-xl flex items-center justify-center cursor-pointer transition h-11"
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
