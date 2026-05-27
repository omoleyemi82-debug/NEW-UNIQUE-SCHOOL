import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Pencil, Trash2, Lock, CheckCircle2 } from 'lucide-react';

export default function ClassroomSubjectManager() {
  const {
    teachers,
    courses,
    subjects,
    teacherAssignments,
    students,
    sessions,
    terms,
    addCourse,
    updateCourse,
    deleteCourse,
    updateStudent,
    addAcademicSession,
    deleteAcademicSession,
    addTerm,
    deleteTerm,
    addSubject,
    updateSubject,
    deleteSubject,
    addTeacherAssignment,
    removeTeacherAssignment,
    assignSubjectsToClass
  } = useSchool();

  // Sub-tabs for Classrooms & Subjects Management
  const [coursesSubTab, setCoursesSubTab] = useState<'classrooms' | 'subjects' | 'assignments'>('classrooms');

  // Classroom Form state
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseTeacherId, setCourseTeacherId] = useState(() => teachers[0]?.id || '');
  const [courseRoom, setCourseRoom] = useState('Room 101');
  const [courseCapacity, setCourseCapacity] = useState(30);
  const [courseLevel, setCourseLevel] = useState('Primary 1');
  const [courseIsActive, setCourseIsActive] = useState(true);
  const [courseDescription, setCourseDescription] = useState('');
  const [courseSuccess, setCourseSuccess] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Subject Form State
  const [subFormName, setSubFormName] = useState('');
  const [subFormCode, setSubFormCode] = useState('');
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // Teacher Assignment State
  const [assFormTeacherId, setAssFormTeacherId] = useState('');
  const [assFormClassId, setAssFormClassId] = useState('');
  const [assFormSubjectId, setAssFormSubjectId] = useState('');

  // Settings Card Inputs
  const [newSessionInput, setNewSessionInput] = useState('');
  const [newTermInput, setNewTermInput] = useState('');

  const handleRegisterCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !courseCode) return;

    // Prevent duplicate classroom names
    const normalizedName = courseName.trim().toLowerCase();
    const isDuplicate = courses.some(
      (c) => c.name.toLowerCase() === normalizedName && c.id !== editingCourseId
    );
    if (isDuplicate) {
      alert('Error: A classroom with this exact name already exists. Please choose a unique name.');
      return;
    }

    if (isEditingCourse && editingCourseId) {
      updateCourse(editingCourseId, {
        name: courseName,
        code: courseCode.toUpperCase(),
        teacherId: courseTeacherId,
        room: courseRoom,
        capacity: courseCapacity,
        level: courseLevel,
        isActive: courseIsActive,
        description: courseDescription
      });
      setIsEditingCourse(false);
      setEditingCourseId(null);
    } else {
      addCourse({
        name: courseName,
        code: courseCode.toUpperCase(),
        teacherId: courseTeacherId,
        room: courseRoom,
        capacity: courseCapacity,
        level: courseLevel,
        isActive: courseIsActive,
        description: courseDescription,
        studentIds: [],
        subjectIds: [],
        schedule: {
          days: ['Monday', 'Wednesday'],
          time: '09:00 AM - 10:30 AM'
        }
      });
    }

    setCourseName('');
    setCourseCode('');
    setCourseCapacity(30);
    setCourseLevel('Primary 1');
    setCourseIsActive(true);
    setCourseDescription('');
    setCourseSuccess(true);
    setTimeout(() => setCourseSuccess(false), 3000);
  };

  const handleRegisterSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subFormName || !subFormCode) return;

    if (isEditingSubject && editingSubjectId) {
      updateSubject(editingSubjectId, {
        name: subFormName,
        code: subFormCode.toUpperCase()
      });
      setIsEditingSubject(false);
      setEditingSubjectId(null);
    } else {
      addSubject({
        name: subFormName,
        code: subFormCode.toUpperCase()
      });
    }
    setSubFormName('');
    setSubFormCode('');
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assFormTeacherId || !assFormClassId || !assFormSubjectId) {
      alert('Please select a teacher, classroom, and subject.');
      return;
    }

    const selectedClassObj = courses.find((c) => c.id === assFormClassId);
    if (!selectedClassObj) {
      alert('Classroom does not exist!');
      return;
    }

    // Add teacher assignment
    addTeacherAssignment({
      teacherId: assFormTeacherId,
      classroomId: assFormClassId,
      subjectId: assFormSubjectId
    });

    // Reset fields
    setAssFormTeacherId('');
    setAssFormClassId('');
    setAssFormSubjectId('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      {/* Sub-tabs header block */}
      <div className="lg:col-span-12 flex flex-wrap border-b border-slate-200 bg-slate-50/50 p-2 rounded-xl gap-2 font-sans select-none">
        <button
          type="button"
          onClick={() => setCoursesSubTab('classrooms')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
            coursesSubTab === 'classrooms'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          Classrooms Directory
        </button>
        <button
          type="button"
          onClick={() => setCoursesSubTab('subjects')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
            coursesSubTab === 'subjects'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          Subject Catalog
        </button>
        <button
          type="button"
          onClick={() => setCoursesSubTab('assignments')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
            coursesSubTab === 'assignments'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          Teacher Assignments
        </button>
      </div>

      {/* TAB CONTENT: CLASSROOMS */}
      {coursesSubTab === 'classrooms' && (
        <>
          {/* Create classroom Course Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-905 text-sm">
                  {isEditingCourse ? 'Edit Classroom Details' : 'Add New Classroom'}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Manually construct active classroom models
                </p>
              </div>

              <form onSubmit={handleRegisterCourse} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Classroom Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Primary 1A, JSS1A, SS1 Science"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Classroom Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PRI-1A, JSS-1A"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Capacity Limit *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="150"
                      value={courseCapacity}
                      onChange={(e) => setCourseCapacity(parseInt(e.target.value) || 30)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Class Level *</label>
                    <select
                      required
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      <option value="Primary 1">Primary 1</option>
                      <option value="Primary 2">Primary 2</option>
                      <option value="Primary 3">Primary 3</option>
                      <option value="Primary 4">Primary 4</option>
                      <option value="Primary 5">Primary 5</option>
                      <option value="Junior Secondary 1">JSS 1</option>
                      <option value="Junior Secondary 2">JSS 2</option>
                      <option value="Junior Secondary 3">JSS 3</option>
                      <option value="Senior Secondary 1">SS 1</option>
                      <option value="Senior Secondary 2">SS 2</option>
                      <option value="Senior Secondary 3">SS 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Room Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Room G2"
                      value={courseRoom}
                      onChange={(e) => setCourseRoom(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Classroom Form Teacher</label>
                  <select
                    value={courseTeacherId}
                    onChange={(e) => setCourseTeacherId(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">-- No Form Teacher --</option>
                    {teachers.map((teach) => (
                      <option key={teach.id} value={teach.id}>
                        {teach.name} ({teach.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Description (optional)</label>
                  <textarea
                    placeholder="Provide short descriptive details about classroom seating, syllabus paths or physical properties..."
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    rows={2}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Classroom Status</span>
                    <span className="text-[11px] font-semibold text-slate-705">
                      {courseIsActive ? 'Active (Open for Seating)' : 'Inactive (Assignment Blocked)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCourseIsActive(!courseIsActive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      courseIsActive ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        courseIsActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer shadow-xs transition-colors animate-fade-in"
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingCourse(false);
                      setEditingCourseId(null);
                      setCourseName('');
                      setCourseCode('');
                      setCourseRoom('Room 101');
                      setCourseCapacity(30);
                      setCourseLevel('Primary 1');
                      setCourseIsActive(true);
                      setCourseDescription('');
                    }}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>

            {courseSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl text-xs flex items-center gap-2 mt-4">
                <CheckCircle2 className="w-4 h-4" /> Classroom catalog successfully updated.
              </div>
            )}
          </div>

          {/* List of core classrooms defined */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-extrabold text-slate-905 text-sm">Active Classroom Roster ({courses.length})</h4>
                <p className="text-[10px] text-slate-400 font-medium">Create and adjust classrooms, capacities, active states</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 pr-1 max-h-[640px] overflow-y-auto space-y-3">
              {courses.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-8">
                  No classrooms created. Use the form on the left to manually type classroom blocks.
                </p>
              ) : (
                courses.map((cl) => {
                  const instr = teachers.find((tc) => tc.id === cl.teacherId);
                  const currentStudentCount = cl.studentIds ? cl.studentIds.length : 0;
                  const capacityLimit = cl.capacity || 30;
                  const percentCap = Math.min(100, Math.round((currentStudentCount / capacityLimit) * 100));

                  return (
                    <div key={cl.id} className="py-4 hover:bg-slate-50/50 rounded-xl transition px-3 border border-slate-100">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] uppercase font-black text-indigo-150 bg-indigo-50 px-2.5 py-0.5 rounded w-fit text-indigo-700 font-mono">
                              {cl.code}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">{cl.level}</span>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                cl.isActive
                                  ? 'bg-emerald-50 text-emerald-750 border border-emerald-100'
                                  : 'bg-slate-150 text-slate-500'
                              }`}
                            >
                              {cl.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-slate-900 text-sm">{cl.name}</h5>
                          <p className="text-xs text-slate-550 font-medium">
                            Form Teacher:{' '}
                            <span className="font-semibold text-slate-850">{instr ? instr.name : 'Unassigned'}</span>
                          </p>
                          {cl.description && (
                            <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed max-w-sm mt-1">
                              {cl.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 font-sans">
                          <div className="text-right font-medium text-xs text-slate-450">
                            <span className="block text-slate-850 font-extrabold">{cl.room}</span>
                            <span className="text-[10.5px] block mt-0.5 text-indigo-700 font-bold">Total Students: {currentStudentCount} / {capacityLimit}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingCourse(true);
                                setEditingCourseId(cl.id);
                                setCourseName(cl.name);
                                setCourseCode(cl.code);
                                setCourseTeacherId(cl.teacherId || '');
                                setCourseRoom(cl.room);
                                setCourseCapacity(cl.capacity || 30);
                                setCourseLevel(cl.level || 'Primary 1');
                                setCourseIsActive(cl.isActive !== undefined ? cl.isActive : true);
                                setCourseDescription(cl.description || '');
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-205 rounded text-indigo-650 hover:text-indigo-850 cursor-pointer transition-colors"
                              title="Edit Classroom Details"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteCourse(cl.id)}
                              className="p-1.5 hover:bg-rose-50 rounded text-rose-550 hover:text-rose-700 cursor-pointer transition-colors"
                              title="Delete Classroom"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Seating progress bar */}
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-full transition-all duration-300 ${
                            percentCap >= 100 ? 'bg-rose-500' : percentCap >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentCap}%` }}
                        />
                      </div>

                      {/* Expandable and Subject panel */}
                      <div className="mt-3.5 bg-slate-50 border border-slate-150/40 p-4 rounded-xl space-y-3 text-xs">
                        <div className="flex flex-col md:flex-row justify-between border-b pb-2 gap-2">
                          <div>
                            <h6 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                              Class Subjects ({cl.subjectIds ? cl.subjectIds.length : 0})
                            </h6>
                            <p className="text-[10px] text-slate-400">Checked subjects are taught in this classroom</p>
                          </div>
                        </div>

                        {/* Subject checklist */}
                        <div className="bg-white p-3 border border-slate-200 rounded-xl space-y-2">
                          {subjects.length === 0 ? (
                            <p className="text-[10px] text-slate-400 italic">
                              No subjects exist. Create some under Subject Catalog first.
                            </p>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {subjects.map((sub) => {
                                const isAssigned = cl.subjectIds && cl.subjectIds.includes(sub.id);
                                return (
                                  <label
                                    key={sub.id}
                                    className="flex items-center gap-1.5 p-1 bg-slate-50 rounded hover:bg-slate-100 cursor-pointer select-none border border-slate-200/50"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={!!isAssigned}
                                      onChange={() => {
                                        const currentSubjectIds = cl.subjectIds || [];
                                        const nextList = isAssigned
                                          ? currentSubjectIds.filter((id) => id !== sub.id)
                                          : [...currentSubjectIds, sub.id];
                                        assignSubjectsToClass(cl.id, nextList);
                                      }}
                                      className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                                    />
                                    <span className="text-[10.5px] font-semibold text-slate-700 truncate" title={sub.name}>
                                      {sub.name}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Current Students lists */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block font-mono">
                            Pupil Registry in this Classroom:
                          </span>
                          {!cl.studentIds || cl.studentIds.length === 0 ? (
                            <p className="text-[10px] text-slate-400 italic">
                              No students allocated to this classroom seating list.
                            </p>
                          ) : (
                            <div className="flex gap-1.5 flex-wrap">
                              {cl.studentIds.map((stId) => {
                                const pst = students.find((s) => s.id === stId);
                                if (!pst) return null;
                                return (
                                  <span
                                    key={stId}
                                    className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-650"
                                  >
                                    {pst.name}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedList = cl.studentIds.filter((id) => id !== stId);
                                        updateCourse(cl.id, { studentIds: updatedList });
                                      }}
                                      className="text-rose-500 hover:text-rose-700 font-extrabold cursor-pointer text-xs ml-1"
                                    >
                                      &times;
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Manual seating mapping */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50">
                          <select
                            id={`manualEnrollSelect_${cl.id}`}
                            disabled={percentCap >= 100}
                            className="bg-white border text-[11px] border-slate-200 rounded p-1.5 outline-none font-semibold flex-1 rounded-lg"
                          >
                            <option value="">-- Choose Pupil to Enroll --</option>
                            {students
                              .filter((st) => {
                                const alreadyIn = cl.studentIds && cl.studentIds.includes(st.id);
                                return !alreadyIn;
                              })
                              .map((st) => (
                                <option key={st.id} value={st.id}>
                                  {st.name} ({st.gradeLevel || 'No Class'})
                                </option>
                              ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const selectEl = document.getElementById(`manualEnrollSelect_${cl.id}`) as HTMLSelectElement;
                              const pupilId = selectEl?.value;
                              if (!pupilId) {
                                alert('Please select a student first.');
                                return;
                              }
                              if (currentStudentCount >= capacityLimit) {
                                alert('Failed: Seating limit strictly reached!');
                                return;
                              }
                              const currentList = cl.studentIds || [];
                              updateCourse(cl.id, {
                                studentIds: [...currentList, pupilId]
                              });
                              // Also keep pupil matched class key
                              updateStudent(pupilId, { gradeLevel: cl.id });
                              selectEl.value = '';
                            }}
                            disabled={percentCap >= 100}
                            className="bg-indigo-600 hover:bg-indigo-700 font-black text-[10px] uppercase text-white tracking-wider px-3.5 py-2 rounded-lg cursor-pointer disabled:bg-slate-305"
                          >
                            {percentCap >= 100 ? 'FULL' : 'Enroll'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* TAB CONTENT: SUBJECT CATALOG */}
      {coursesSubTab === 'subjects' && (
        <>
          {/* Create Subject Form */}
          <div className="lg:col-span-12 xl:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-905 text-sm">
                {isEditingSubject ? 'Edit Subject Details' : 'Create Scholastic Subject'}
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Register new subjects in catalog database
              </p>
            </div>

            <form onSubmit={handleRegisterSubject} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics, Basic Science, Computer Studies"
                  value={subFormName}
                  onChange={(e) => setSubFormName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Subject Code / ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MTH-101, ENG-202"
                  value={subFormCode}
                  onChange={(e) => setSubFormCode(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer"
                >
                  {isEditingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
                {isEditingSubject && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingSubject(false);
                      setEditingSubjectId(null);
                      setSubFormName('');
                      setSubFormCode('');
                    }}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-205 text-slate-700 font-bold uppercase text-xs tracking-wider rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Subject list */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-905 text-sm">Scholastic Subject Directory</h4>
              <p className="text-[10px] text-slate-400 font-medium">Subjects and current classroom couplings</p>
            </div>

            <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto space-y-2.5">
              {subjects.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No subjects created. Build some using the panel on the left.
                </p>
              ) : (
                subjects.map((sub) => {
                  const linkedClasses = courses.filter((c) => c.subjectIds && c.subjectIds.includes(sub.id));
                  return (
                    <div
                      key={sub.id}
                      className="py-3 px-3 hover:bg-slate-50 rounded-xl transition border border-slate-100 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                            {sub.code}
                          </span>
                          <h5 className="font-extrabold text-slate-900 text-sm">{sub.name}</h5>
                        </div>
                        <p className="text-[10px] text-slate-450 font-medium mt-1">
                          {linkedClasses.length === 0
                            ? 'Not assigned to any classrooms'
                            : `Assigned classes: ${linkedClasses.map((cl) => cl.name).join(', ')}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingSubject(true);
                            setEditingSubjectId(sub.id);
                            setSubFormName(sub.name);
                            setSubFormCode(sub.code);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSubject(sub.id)}
                          className="p-1.5 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* TAB CONTENT: TEACHER ASSIGNMENTS */}
      {coursesSubTab === 'assignments' && (
        <>
          {/* Assignment Creator Panel */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-905 text-sm">Assign Educator Tasks</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Link teachers with core subjects inside specific classes
              </p>
            </div>

            {courses.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-amber-800">Classrooms Required</p>
                <p className="text-amber-700">
                  Classrooms must exist before teacher, subject, or student assignments can be performed. Please create classrooms first.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Select Classroom (Must Exist First) *
                  </label>
                  <select
                    required
                    value={assFormClassId}
                    onChange={(e) => {
                      setAssFormClassId(e.target.value);
                      setAssFormSubjectId('');
                    }}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">-- Choose Classroom --</option>
                    {courses.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.name} ({cl.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-mono text-indigo-700">
                    Select Subject (From Classroom Core List) *
                  </label>
                  <select
                    required
                    disabled={!assFormClassId}
                    value={assFormSubjectId}
                    onChange={(e) => setAssFormSubjectId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Choose Assigned Subject --</option>
                    {(() => {
                      const chosenClass = courses.find((c) => c.id === assFormClassId);
                      if (!chosenClass || !chosenClass.subjectIds || chosenClass.subjectIds.length === 0) {
                        return null;
                      }
                      return chosenClass.subjectIds.map((sid) => {
                        const subObj = subjects.find((s) => s.id === sid);
                        if (!subObj) return null;
                        return (
                          <option key={subObj.id} value={subObj.id}>
                            {subObj.name} ({subObj.code})
                          </option>
                        );
                      });
                    })()}
                  </select>
                  {assFormClassId && (() => {
                    const chosenClass = courses.find((c) => c.id === assFormClassId);
                    const count = chosenClass?.subjectIds?.length || 0;
                    if (count === 0) {
                      return (
                        <p className="text-[10px] text-rose-500 mt-1">
                          This class currently has no subjects assigned to it. Assign some in Classrooms Directory tab first.
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-mono text-indigo-700">
                    Select Educator / Faculty Instructor *
                  </label>
                  <select
                    required
                    value={assFormTeacherId}
                    onChange={(e) => setAssFormTeacherId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">-- Choose Instructor --</option>
                    {teachers.map((teach) => (
                      <option key={teach.id} value={teach.id}>
                        {teach.name} ({teach.department})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!assFormClassId || !assFormSubjectId || !assFormTeacherId}
                  className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer"
                >
                  Create Assignment
                </button>
              </form>
            )}
          </div>

          {/* Assignments list */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-905 text-sm">Active Educator Task Registry ({teacherAssignments.length})</h4>
              <p className="text-[10px] text-slate-400 font-medium">Relationships defining Teacher → Subject → Classroom mappings</p>
            </div>

            <div className="divide-y divide-slate-100 pr-1 max-h-[580px] overflow-y-auto space-y-3">
              {teacherAssignments.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-8">
                  No educator task mappings assigned yet. Set parameters on the left.
                </p>
              ) : (
                teacherAssignments.map((ta) => {
                  const teachObj = teachers.find((t) => t.id === ta.teacherId);
                  const classObj = courses.find((c) => c.id === ta.classroomId);
                  const subObj = subjects.find((s) => s.id === ta.subjectId);

                  if (!teachObj || !classObj || !subObj) return null;

                  return (
                    <div
                      key={ta.id}
                      className="py-3 px-3 hover:bg-slate-50 rounded-xl transition border border-slate-100 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <h5 className="font-extrabold text-slate-900 text-sm">{teachObj.name}</h5>
                        <div className="flex flex-wrap items-center gap-1 text-[10.5px] font-medium text-slate-500">
                          <span>Teaches</span>
                          <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[9.5px] uppercase">
                            {subObj.code} {subObj.name}
                          </span>
                          <span>in</span>
                          <span className="font-bold text-slate-850 underline">{classObj.name}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeTeacherAssignment(ta.id)}
                        className="p-1.5 hover:bg-rose-50 rounded text-rose-550 hover:text-rose-700 cursor-pointer"
                        title="De-assign Educator"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* SESSIONS & TERMS CARD BLOCK */}
      <div className="lg:col-span-12 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 font-sans">
        {/* Academic Sessions Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h4 className="font-extrabold text-slate-905 text-sm">Create Academic Sessions</h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Set global catalog segments
            </span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newSessionInput.trim()) return;
              addAcademicSession(newSessionInput.trim());
              setNewSessionInput('');
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              required
              placeholder="e.g. 2026/2027 Session"
              value={newSessionInput}
              onChange={(e) => setNewSessionInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Create
            </button>
          </form>
          <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
            {sessions &&
              sessions.map((sess) => (
                <div
                  key={sess}
                  className="flex items-center justify-between text-xs p-2 bg-slate-50 border border-slate-100 rounded-lg"
                >
                  <span className="font-semibold text-slate-800">{sess}</span>
                  <button
                    type="button"
                    onClick={() => deleteAcademicSession(sess)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Academic Terms Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h4 className="font-extrabold text-slate-905 text-sm">Create Academic Terms</h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Define report segments
            </span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTermInput.trim()) return;
              addTerm(newTermInput.trim());
              setNewTermInput('');
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              required
              placeholder="e.g. Autumn Term 2026"
              value={newTermInput}
              onChange={(e) => setNewTermInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Create
            </button>
          </form>
          <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
            {terms &&
              terms.map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-between text-xs p-2 bg-slate-50 border border-slate-100 rounded-lg"
                >
                  <span className="font-semibold text-slate-800">{t}</span>
                  <button
                    type="button"
                    onClick={() => deleteTerm(t)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
