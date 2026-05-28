import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Course, AttendanceStatus, GradeCategory, Student } from '../types';
import CBTQuizManagement from './CBTQuizManagement';
import ReportSheet from './ReportSheet';
import {
  FileSpreadsheet,
  ClipboardCheck,
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  LayoutDashboard,
  Save,
  UserCheck,
  Lock,
  Pencil,
  BookOpen
} from 'lucide-react';

export default function StaffPortal({ activeTab }: { activeTab: string }) {
  const {
    currentUserId,
    courses,
    students,
    grades,
    attendance,
    quizzes,
    submissions,
    teachers,
    subjects,
    teacherAssignments,
    addGrade,
    updateGrade,
    deleteGrade,
    submitAttendance,
    addQuiz,
    toggleQuizActive
  } = useSchool();

  // Find courses assigned to this teacher (either as Form Teacher or via Teacher Assignments, making it possible for a teacher to teach multiple classes)
  const teacherCourses = courses.filter((c) =>
    c.teacherId === currentUserId ||
    (teacherAssignments && teacherAssignments.some((ta) => ta.teacherId === currentUserId && ta.classroomId === c.id))
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    return teacherCourses[0]?.id || '';
  });

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || teacherCourses[0];

  // Attendance Mark State
  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: AttendanceStatus; notes: string }>>({});

  // Initialize attendance records if they already exist for today
  React.useEffect(() => {
    if (!selectedCourseId) return;
    const existing = attendance.filter((a) => a.courseId === selectedCourseId && a.date === attendanceDate);
    const initialRecords: Record<string, { status: AttendanceStatus; notes: string }> = {};
    
    students.forEach((s) => {
      const rec = existing.find((r) => r.studentId === s.id);
      initialRecords[s.id] = {
        status: rec ? rec.status : 'present',
        notes: rec ? rec.notes || '' : ''
      };
    });
    setAttendanceRecords(initialRecords);
  }, [selectedCourseId, attendanceDate, attendance, students]);

  // Attendance change trigger
  const handleAttendanceStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleAttendanceNotes = (studentId: string, notes: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes }
    }));
  };

  const [attDoneMsg, setAttDoneMsg] = useState(false);
  const handleSaveAttendance = () => {
    if (!selectedCourseId) return;
    const submissionArray = students.map((s) => ({
      studentId: s.id,
      status: attendanceRecords[s.id]?.status || 'present',
      notes: attendanceRecords[s.id]?.notes || ''
    }));

    submitAttendance(selectedCourseId, attendanceDate, submissionArray);
    setAttDoneMsg(true);
    setTimeout(() => setAttDoneMsg(false), 3000);
  };

  // Grade Sheets Entry State
  const [newGradeTitle, setNewGradeTitle] = useState('');
  const [newGradeScore, setNewGradeScore] = useState(100);
  const [newGradeCategory, setNewGradeCategory] = useState<GradeCategory>('homework');
  const [newGradeStudentId, setNewGradeStudentId] = useState<string>(() => students[0]?.id || '');
  const [gradeSheetSuccess, setGradeSheetSuccess] = useState(false);
  const [teacherSelectedStudent, setTeacherSelectedStudent] = useState<string>(() => students[0]?.id || '');

  const handleAddGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !newGradeTitle || !newGradeStudentId) return;

    addGrade({
      studentId: newGradeStudentId,
      courseId: selectedCourseId,
      title: newGradeTitle,
      score: Number(newGradeScore),
      maxScore: 100,
      date: new Date().toISOString().split('T')[0],
      category: newGradeCategory,
      term: 'Spring 2026'
    });

    setNewGradeTitle('');
    setGradeSheetSuccess(true);
    setTimeout(() => setGradeSheetSuccess(false), 3000);
  };

  // Quiz Creator State
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizTimeLimit, setQuizTimeLimit] = useState(10);
  const [quizDueDate, setQuizDueDate] = useState('2026-05-30');
  const [quizQuestions, setQuizQuestions] = useState<{ questionText: string; options: string[]; correctOptionIndex: number; explanation: string }[]>([
    { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }
  ]);
  const [quizCreatedMsg, setQuizCreatedMsg] = useState(false);

  const handleAddQuestionToQuizDraft = () => {
    setQuizQuestions((prev) => [
      ...prev,
      { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }
    ]);
  };

  const handleRemoveQuestionFromQuizDraft = (index: number) => {
    setQuizQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateQuizQuestionText = (index: number, text: string) => {
    setQuizQuestions((prev) =>
      prev.map((q, idx) => (idx === index ? { ...q, questionText: text } : q))
    );
  };

  const handleUpdateQuizQuestionExplanation = (index: number, text: string) => {
    setQuizQuestions((prev) =>
      prev.map((q, idx) => (idx === index ? { ...q, explanation: text } : q))
    );
  };

  const handleUpdateQuizQuestionOption = (qIdx: number, optIdx: number, text: string) => {
    setQuizQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx === qIdx) {
          const newOpts = [...q.options];
          newOpts[optIdx] = text;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const handleSelectCorrectOption = (qIdx: number, optIdx: number) => {
    setQuizQuestions((prev) =>
      prev.map((q, idx) => (idx === qIdx ? { ...q, correctOptionIndex: optIdx } : q))
    );
  };

  const handlePublishQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !quizTitle) return;

    // Validate that questions are filled
    const validQuestions = quizQuestions.filter((q) => q.questionText.trim() !== '');
    if (validQuestions.length === 0) return;

    // Map questions with IDs
    const formattedQuestions = validQuestions.map((q, idx) => ({
      id: `quest_${Date.now()}_${idx}`,
      questionText: q.questionText,
      options: q.options.map(opt => opt || 'Option placeholder'),
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation || undefined
    }));

    addQuiz({
      courseId: selectedCourseId,
      title: quizTitle,
      description: quizDesc,
      timeLimitMinutes: Number(quizTimeLimit),
      dueDate: quizDueDate,
      isActive: true,
      questions: formattedQuestions
    });

    // Reset fields
    setQuizTitle('');
    setQuizDesc('');
    setQuizTimeLimit(10);
    setQuizQuestions([{ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }]);
    setQuizCreatedMsg(true);
    setTimeout(() => setQuizCreatedMsg(false), 3000);
  };

  // Derived Course Stats
  const courseGrades = grades.filter((g) => g.courseId === selectedCourseId);
  const courseSubmissions = submissions.filter((s) => {
    const qz = quizzes.find((q) => q.id === s.quizId);
    return qz && qz.courseId === selectedCourseId;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 0. Course Selector Strip */}
      <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-[10px] font-bold text-natural-green uppercase tracking-widest leading-none">Instructor workspace</h3>
          <h2 className="text-xl font-serif font-bold text-natural-charcoal mt-1.5">
            {activeCourse ? `${activeCourse.code} - ${activeCourse.name}` : 'Select Classroom'}
          </h2>
        </div>

        <div>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-4 py-2.5 bg-natural-light border border-natural-beige text-xs font-semibold rounded-xl text-natural-charcoal outline-none focus:border-natural-green/60 transition-all font-sans"
          >
            {teacherCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!activeCourse ? (
        <div className="p-12 text-center bg-white border border-natural-beige rounded-2xl text-natural-charcoal/50 italic text-xs">
          No courses are assigned to this faculty profile right now.
        </div>
      ) : (
        <>
          {/* 1. FACULTY OVERVIEW TAB */}
          {activeTab === 'dash' && (
            <>
              {/* Analytics strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-natural-green/80 font-bold uppercase tracking-wider block font-sans">Enrolled Students</span>
                    <span className="text-3xl font-serif font-black text-natural-charcoal tracking-tight">{students.length}</span>
                  </div>
                  <div className="p-3 bg-natural-light text-natural-green border border-natural-beige rounded-xl">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-natural-green/80 font-bold uppercase tracking-wider block font-sans">Grade Records Filed</span>
                    <span className="text-3xl font-serif font-black text-natural-green tracking-tight">{courseGrades.length}</span>
                  </div>
                  <div className="p-3 bg-natural-light text-natural-green border border-natural-beige rounded-xl">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-natural-green/80 font-bold uppercase tracking-wider block font-sans">Average Class Grade</span>
                    <span className="text-3xl font-serif font-black text-natural-clay tracking-tight">
                      {courseGrades.length > 0
                        ? `${Math.round((courseGrades.reduce((sum, current) => sum + (current.score / current.maxScore), 0) / courseGrades.length) * 100)}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 bg-natural-light text-natural-clay border border-natural-beige rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Course syllabus metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                  <h4 className="font-serif font-bold text-natural-charcoal text-sm">Class Syllabus Details</h4>
                  <p className="text-xs text-natural-charcoal/80 leading-relaxed font-medium">
                    {activeCourse.syllabus || 'No official catalog guidelines filled. Go to Classroom management to submit details.'}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-natural-beige/60 font-medium text-natural-charcoal/70">
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-natural-green font-bold">Class Room Location</span>
                      <span className="text-natural-charcoal font-bold">{activeCourse.room}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-natural-green font-bold">Scheduled Schedule</span>
                      <span className="text-natural-charcoal font-bold">{activeCourse.schedule.days.join(', ')} • {activeCourse.schedule.time}</span>
                    </div>
                  </div>
                </div>

                {/* Submissions tracking */}
                <div className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                  <h4 className="font-serif font-bold text-natural-charcoal text-sm">Submitted Exam Activity</h4>
                  {courseSubmissions.length === 0 ? (
                    <p className="text-xs text-natural-charcoal/50 italic">No exams have been completed for this classroom directory yet.</p>
                  ) : (
                    <div className="space-y-3.5 max-h-[160px] overflow-y-auto">
                      {courseSubmissions.slice(-3).map((sub) => {
                        const stud = students.find((s) => s.id === sub.studentId);
                        const qz = quizzes.find((q) => q.id === sub.quizId);
                        return (
                          <div key={sub.id} className="flex items-center justify-between text-xs bg-natural-light/40 p-3 rounded-xl border border-natural-beige">
                            <div>
                              <p className="font-serif font-bold text-natural-charcoal">{stud ? stud.name : 'Unknown student'}</p>
                              <p className="text-[10px] text-natural-green font-bold uppercase">{qz ? qz.title : 'Quiz file'}</p>
                            </div>
                            <span className="font-serif font-bold text-natural-charcoal bg-white border border-natural-beige px-2.5 py-1 rounded">Score: {sub.score} / {sub.maxScore}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* MANAGE CLASSROOMS TAB (TEACHER PORTAL) */}
          {activeTab === 'courses' && (
            <div className="space-y-6 md:space-y-8 font-sans">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-fade-in animate-duration-300">
                <div>
                  <h4 className="font-extrabold text-slate-905 text-sm">Your Assigned Classes ({teacherCourses.length})</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    View active classrooms and subjects assigned to your department by Administration
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {teacherCourses.length === 0 ? (
                    <div className="md:col-span-2 p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No classrooms currently assigned.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Please reach out to the administrator to assign subjects and classrooms to your account.</p>
                    </div>
                  ) : (
                    teacherCourses.map((cl) => {
                      const isFormTeacher = cl.teacherId === currentUserId;
                      const enrolledCount = cl.studentIds ? cl.studentIds.length : 0;
                      
                      // Find subjects this specific teacher teaches in this classroom
                      const teachesInThisClass = teacherAssignments 
                        ? teacherAssignments.filter((ta) => ta.teacherId === currentUserId && ta.classroomId === cl.id)
                        : [];

                      return (
                        <div key={cl.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200 p-5 rounded-xl transition duration-300 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] uppercase font-black text-indigo-700 bg-indigo-50 px-2 rounded-md font-mono">
                                {cl.code}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">{cl.level}</span>
                              {isFormTeacher && (
                                <span className="text-[9px] uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 rounded-md">
                                  ● Form Teacher
                                </span>
                              )}
                            </div>
                            <h5 className="font-extrabold text-slate-900 text-sm">{cl.name}</h5>
                            <div className="text-[11px] text-slate-550 space-y-1">
                              <p>
                                <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider font-mono">Room Location:</span>
                                <span className="font-semibold text-slate-800">{cl.room || 'No Room Assigned'}</span>
                              </p>
                            </div>
                          </div>

                          {/* Subjects Section */}
                          <div className="bg-white p-3 border border-slate-150 rounded-xl space-y-1.5 shadow-2xs">
                            <span className="font-bold text-slate-400 text-[9px] uppercase tracking-widest block font-mono">Your Subjects:</span>
                            {teachesInThisClass.length === 0 ? (
                              <p className="text-[10px] text-slate-400 italic">None. Assigned as Form Teacher only.</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {teachesInThisClass.map((ta) => {
                                  const sub = subjects.find((s) => s.id === ta.subjectId);
                                  return sub ? (
                                    <span key={ta.id} className="text-[10px] font-bold text-indigo-700 bg-indigo-50/60 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                                      {sub.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>

                          {/* Pupils count and check */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-450 uppercase tracking-wider font-mono">
                              <span>Pupil Registry:</span>
                              <span className="text-slate-700">{enrolledCount} Pupils</span>
                            </div>
                            {!cl.studentIds || cl.studentIds.length === 0 ? (
                              <p className="text-[10px] text-slate-400 italic pl-1">No students registered in this classroom.</p>
                            ) : (
                              <div className="flex gap-1 flex-wrap max-h-[80px] overflow-y-auto pr-1">
                                {cl.studentIds.map((stId) => {
                                  const sDetail = students.find((s) => s.id === stId);
                                  return sDetail ? (
                                    <span key={stId} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600">
                                      {sDetail.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. GRADING SHEET MANAGER */}
          {activeTab === 'grades' && (
            <div className="space-y-8">
              {/* Insert Grade Column */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="font-extrabold text-slate-900 text-sm mb-4">Input Grade Assessment Data</h4>
                <form onSubmit={handleAddGradeSubmission} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Select Student</label>
                    <select
                      value={newGradeStudentId}
                      onChange={(e) => setNewGradeStudentId(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:border-teal-500 outline-none"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.gradeLevel})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Assessment Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chapter 1 Quiz"
                      value={newGradeTitle}
                      onChange={(e) => setNewGradeTitle(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:border-teal-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Grade score</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newGradeScore}
                        onChange={(e) => setNewGradeScore(Number(e.target.value))}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Category</label>
                      <select
                        value={newGradeCategory}
                        onChange={(e) => setNewGradeCategory(e.target.value as GradeCategory)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:border-teal-500 outline-none"
                      >
                        <option value="homework">Homework</option>
                        <option value="quiz">Quiz</option>
                        <option value="exam">Exam</option>
                        <option value="project">Project</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 h-[38px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/10"
                    >
                      <Plus className="w-4 h-4" /> Save Record
                    </button>
                  </div>
                </form>

                {gradeSheetSuccess && (
                  <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-150 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Academic Grade metrics successfully appended.
                  </div>
                )}
              </div>

              {/* Classroom Grade database sheets */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">Grading Excel Sheet Matrix</span>
                </div>

                {courseGrades.length === 0 ? (
                  <p className="p-8 text-center text-xs text-slate-400 italic">No grading elements defined. Input records using the dashboard form builder above.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-650 min-w-[650px]">
                      <thead className="text-[10px] font-black uppercase text-slate-400 tracking-wider bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Assignment Description</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Marked Scores</th>
                          <th className="px-6 py-4 text-center">Score Grade</th>
                          <th className="px-6 py-4 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {courseGrades.map((g) => {
                          const matchingStudent = students.find((s) => s.id === g.studentId);
                          const percentage = Math.round((g.score / g.maxScore) * 100);

                          return (
                            <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-900">
                                {matchingStudent ? matchingStudent.name : 'Unknown User'}
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 block">{g.title}</span>
                                <span className="text-[10px] text-slate-400 block">Logged: {g.date}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700">
                                  {g.category}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="number"
                                  min="0"
                                  max={g.maxScore}
                                  value={g.score}
                                  onChange={(e) => updateGrade(g.id, Number(e.target.value))}
                                  className="w-16 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-xs font-bold font-sans"
                                />
                                <span className="text-slate-400 font-bold ml-1">/ {g.maxScore}</span>
                              </td>
                              <td className="px-6 py-4 text-center font-black">
                                <span className={`px-2 py-1 rounded ${percentage >= 90 ? 'text-emerald-700 bg-emerald-50' : percentage >= 80 ? 'text-blue-705 bg-blue-50' : 'text-slate-700 bg-slate-150'}`}>
                                  {percentage}%
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => deleteGrade(g.id)}
                                  className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-700 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Comprehensive Student Report Cards Panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">Student Report Sheets & Endorsements</h4>
                  <p className="text-xs text-slate-500">Select any student below to view, download, or edit their terminal report sheet, grades, principal/tutor comments, and WAEC grading parameters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-sans">Student Target Record</label>
                    <select
                      value={teacherSelectedStudent}
                      onChange={(e) => setTeacherSelectedStudent(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:border-teal-500 outline-none font-bold text-slate-800"
                    >
                      {students.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.gradeLevel})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {teacherSelectedStudent && (
                  <div className="border border-slate-200 rounded-3xl overflow-hidden p-0 bg-slate-50">
                    <ReportSheet initialStudentId={teacherSelectedStudent} isReadOnly={false} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. LOG ATTENDANCE TAB */}
          {activeTab === 'att' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="font-extrabold text-slate-905 text-sm">Log Attendance Checklist</h4>
                  <p className="text-xs text-slate-400 font-medium">Log attendance for classroom sessions. Entries show instantly inside student portals.</p>
                </div>
                <div>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl"
                  />
                </div>
              </div>

              {/* Attendance Table Checklist */}
              <div className="bg-white border border-slate-250 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Date Target: <span className="text-slate-800">{attendanceDate}</span>
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {students.map((stud) => {
                    const record = attendanceRecords[stud.id] || { status: 'present', notes: '' };

                    return (
                      <div key={stud.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={stud.avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full border border-slate-205 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-extrabold text-slate-905 block text-sm">{stud.name}</span>
                            <span className="text-[10px] text-slate-405 font-bold uppercase block">{stud.gradeLevel}</span>
                          </div>
                        </div>

                        {/* Attendance State Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                          {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((statusValue) => {
                            const active = record.status === statusValue;
                            const colors = {
                              present: active ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600',
                              absent: active ? 'bg-rose-600 text-white border-rose-500 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600',
                              late: active ? 'bg-amber-500 text-white border-amber-450 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600',
                              excused: active ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600'
                            };

                            return (
                              <button
                                key={statusValue}
                                type="button"
                                onClick={() => handleAttendanceStatus(stud.id, statusValue)}
                                className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer ${colors[statusValue]}`}
                              >
                                {statusValue}
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom status logs advice */}
                        <div className="w-full sm:w-48">
                          <input
                            type="text"
                            placeholder="Add memo/notes..."
                            value={record.notes}
                            onChange={(e) => handleAttendanceNotes(stud.id, e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 bg-slate-55 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={handleSaveAttendance}
                    className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider shadow-md rounded-xl cursor-pointer"
                  >
                    Commit Attendance Sheets
                  </button>

                  {attDoneMsg && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-2 border border-emerald-200 rounded-xl">
                      ✓ Class attendance ledger updated successfully.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. CONFIGURE QUIZZES TAB */}
          {activeTab === 'quiz' && (
            <CBTQuizManagement />
          )}
        </>
      )}
    </div>
  );
}
