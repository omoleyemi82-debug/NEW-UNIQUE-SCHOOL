import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Quiz, QuizQuestion, Course, Subject, Student, QuizSubmission } from '../types';
import { 
  Zap, Clock, FileText, Upload, Plus, Trash2, Edit, Save, 
  ArrowLeft, Download, Search, AlertCircle, Sparkles, CheckCircle, 
  CheckCircle2, Play, Calendar, Settings, Lock, RefreshCw, X, 
  ChevronRight, Check, BarChart2, Briefcase, FileSpreadsheet, Eye, ClipboardCopy
} from 'lucide-react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

interface CBTQuizManagementProps {
  onBackToDashboard?: () => void;
}

export default function CBTQuizManagement({ onBackToDashboard }: CBTQuizManagementProps) {
  const { 
    quizzes, 
    courses, 
    subjects, 
    addQuiz, 
    updateQuiz, 
    deleteQuiz,
    toggleQuizActive,
    students,
    submissions,
    currentRole
  } = useSchool();

  // Active sub-screen: 'list' (dashboard) | 'create' | 'results'
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'results'>('list');
  const [selectedQuizIdForResults, setSelectedQuizIdForResults] = useState<string | null>(null);

  // --- Search / Filters for Quizzes (Dashboard) ---
  const [searchQuizQuery, setSearchQuizQuery] = useState('');
  const [filterClassQuery, setFilterClassQuery] = useState('All Classes');

  // --- Create/Edit Quiz State ---
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  
  // Quiz parameters
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [quizTimer, setQuizTimer] = useState(30);
  const [passMark, setPassMark] = useState(50);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Logic toggles
  const [isAutoGrading, setIsAutoGrading] = useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [randomizeOptions, setRandomizeOptions] = useState(false);
  const [showImmediateResults, setShowImmediateResults] = useState(true);
  const [allowRetakes, setAllowRetakes] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Active Questions Draft Array
  const [questionsDraft, setQuestionsDraft] = useState<QuizQuestion[]>([]);
  const [searchQuestionTerm, setSearchQuestionTerm] = useState('');
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [rawPasteText, setRawPasteText] = useState('');
  const [isPasteModeOpen, setIsPasteModeOpen] = useState(false);
  const [importLogs, setImportLogs] = useState<{ success: number; errors: string[] } | null>(null);

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Auto-Save Tracker ---
  // Save draft state to localStorage whenever draft variables change
  useEffect(() => {
    if (activeTab === 'create') {
      const draftObj = {
        editingQuizId,
        quizTitle,
        quizDesc,
        selectedClassId,
        selectedSubjectId,
        quizTimer,
        passMark,
        startDate,
        endDate,
        isAutoGrading,
        randomizeQuestions,
        randomizeOptions,
        showImmediateResults,
        allowRetakes,
        isDraft,
        questionsDraft
      };
      localStorage.setItem('nua_cbt_active_draft', JSON.stringify(draftObj));
      const timeStr = new Date().toLocaleTimeString();
      setAutoSaveMsg(`Auto-saved draft at ${timeStr}`);
    }
  }, [
    activeTab, editingQuizId, quizTitle, quizDesc, selectedClassId, selectedSubjectId, 
    quizTimer, passMark, startDate, endDate, isAutoGrading, randomizeQuestions, 
    randomizeOptions, showImmediateResults, allowRetakes, isDraft, questionsDraft
  ]);

  // Load active draft on mount if available
  useEffect(() => {
    const savedDraft = localStorage.getItem('nua_cbt_active_draft');
    if (savedDraft) {
      try {
        const d = JSON.parse(savedDraft);
        // We will keep it but let the user decide or load automatically if they click "Restore Draft"
      } catch (e) {
        console.error('Error parsing quiz draft', e);
      }
    }
    
    // Set default class & subject if available
    if (courses.length > 0 && !selectedClassId) {
      setSelectedClassId(courses[0].id);
    }
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [courses, subjects]);

  const handleRestoreDraft = () => {
    const savedDraft = localStorage.getItem('nua_cbt_active_draft');
    if (savedDraft) {
      try {
        const d = JSON.parse(savedDraft);
        setEditingQuizId(d.editingQuizId || null);
        setQuizTitle(d.quizTitle || '');
        setQuizDesc(d.quizDesc || '');
        setSelectedClassId(d.selectedClassId || courses[0]?.id || '');
        setSelectedSubjectId(d.selectedSubjectId || subjects[0]?.id || '');
        setQuizTimer(d.quizTimer !== undefined ? d.quizTimer : 30);
        setPassMark(d.passMark !== undefined ? d.passMark : 50);
        setStartDate(d.startDate || '');
        setEndDate(d.endDate || '');
        setIsAutoGrading(d.isAutoGrading !== undefined ? d.isAutoGrading : true);
        setRandomizeQuestions(d.randomizeQuestions || false);
        setRandomizeOptions(d.randomizeOptions || false);
        setShowImmediateResults(d.showImmediateResults !== undefined ? d.showImmediateResults : true);
        setAllowRetakes(d.allowRetakes || false);
        setIsDraft(d.isDraft || false);
        setQuestionsDraft(d.questionsDraft || []);
        setAutoSaveMsg('Draft restored from local cache successfully!');
      } catch (e) {
        console.error('Error recovering draft', e);
      }
    }
  };

  const clearCurrentDraftForm = () => {
    setEditingQuizId(null);
    setQuizTitle('');
    setQuizDesc('');
    setSelectedClassId(courses[0]?.id || '');
    setSelectedSubjectId(subjects[0]?.id || '');
    setQuizTimer(30);
    setPassMark(50);
    setStartDate('');
    setEndDate('');
    setIsAutoGrading(true);
    setRandomizeQuestions(false);
    setRandomizeOptions(false);
    setShowImmediateResults(true);
    setAllowRetakes(false);
    setIsDraft(false);
    setQuestionsDraft([]);
    localStorage.removeItem('nua_cbt_active_draft');
  };

  // --- SMART DETECTOR FOR CORRECT ANSWER INDEX ---
  const detectCorrectOptionIndex = (correctVal: string, options: string[]): number => {
    const cleanCorrect = correctVal?.trim().toLowerCase() || '';
    if (!cleanCorrect) return 0;

    // Check letter match
    if (cleanCorrect === 'a' || cleanCorrect === 'option a' || cleanCorrect === 'opt a') return 0;
    if (cleanCorrect === 'b' || cleanCorrect === 'option b' || cleanCorrect === 'opt b') return 1;
    if (cleanCorrect === 'c' || cleanCorrect === 'option c' || cleanCorrect === 'opt c') return 2;
    if (cleanCorrect === 'd' || cleanCorrect === 'option d' || cleanCorrect === 'opt d') return 3;

    // Check numbers directly
    if (cleanCorrect === '1' && options[0]?.toLowerCase() !== '1') return 0;
    if (cleanCorrect === '2' && options[1]?.toLowerCase() !== '2') return 1;
    if (cleanCorrect === '3' && options[2]?.toLowerCase() !== '3') return 2;
    if (cleanCorrect === '4' && options[3]?.toLowerCase() !== '4') return 3;

    if (cleanCorrect === '0') return 0;

    // Direct String Match
    const strMatchIdx = options.findIndex(opt => opt?.trim().toLowerCase() === cleanCorrect);
    if (strMatchIdx !== -1) return strMatchIdx;

    // Fuzzy Match
    const fuzzyMatchIdx = options.findIndex(opt => opt && (cleanCorrect.includes(opt.trim().toLowerCase()) || opt.trim().toLowerCase().includes(cleanCorrect)));
    if (fuzzyMatchIdx !== -1) return fuzzyMatchIdx;

    return 0; // fallback default
  };

  // --- AUTOMATIC FILE PARSERS ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImportFile(file);
  };

  const processImportFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const workbook = XLSX.read(bstr, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const rRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
          
          parseSheetGrid(rRows);
        } catch (err: any) {
          setImportLogs({ success: 0, errors: [`Excel conversion failed: ${err.message}`] });
        }
      };
      reader.readAsBinaryString(file);
    } 
    else if (extension === 'docx') {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const arrayBuffer = evt.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value;
          parseWordRawText(text);
        } catch (err: any) {
          setImportLogs({ success: 0, errors: [`Word .docx conversion failed: ${err.message}`] });
        }
      };
      reader.readAsArrayBuffer(file);
    } 
    else {
      setImportLogs({ success: 0, errors: ['Unsupported document extension. Please upload .xlsx, .xls, .csv, or .docx'] });
    }
  };

  // Parses Grid structure (Question | Option A | Option B | Option C | Option D | Correct Answer)
  const parseSheetGrid = (grid: any[][]) => {
    if (!grid || grid.length === 0) {
      setImportLogs({ success: 0, errors: ['Selected worksheet is empty.'] });
      return;
    }

    const errors: string[] = [];
    const newQuestions: QuizQuestion[] = [];
    
    // We auto-detect if the first row is a header title row
    let startIndex = 0;
    const firstRowValues = grid[0].map(v => String(v || '').toLowerCase().trim());
    const isHeader = firstRowValues.some(v => 
      v.includes('question') || v.includes('option') || v.includes('correct') || v.includes('answer')
    );

    if (isHeader) {
      startIndex = 1;
    }

    grid.slice(startIndex).forEach((row, rIdx) => {
      if (!row || row.length === 0 || !row[0]) return; // empty row skipped

      const questionText = String(row[0] || '').trim();
      const optA = String(row[1] || 'Placeholder A').trim();
      const optB = String(row[2] || 'Placeholder B').trim();
      const optC = String(row[3] || 'Placeholder C').trim();
      const optD = String(row[4] || 'Placeholder D').trim();
      const correctVal = String(row[5] || '').trim();

      if (!questionText) {
        errors.push(`Row ${rIdx + startIndex + 1}: Skipped due to vacant Question field.`);
        return;
      }

      const options = [optA, optB, optC, optD];
      const correctOptionIndex = detectCorrectOptionIndex(correctVal, options);

      newQuestions.push({
        id: `quest_bulk_${Date.now()}_${rIdx}_${Math.random()}`,
        questionText,
        options,
        correctOptionIndex,
        explanation: String(row[6] || '').trim() || undefined
      });
    });

    if (newQuestions.length > 0) {
      setQuestionsDraft(prev => [...prev, ...newQuestions]);
      setImportLogs({ success: newQuestions.length, errors });
    } else {
      setImportLogs({ success: 0, errors: [...errors, 'No valid questions could be extracted. Check document layout columns.'] });
    }
  };

  // Parses raw plain text from Word files / Pasted content using standard regex list detection
  const parseWordRawText = (text: string) => {
    if (!text || !text.trim()) {
      setImportLogs({ success: 0, errors: ['Word document contains zero plain text content.'] });
      return;
    }

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const errors: string[] = [];
    const parsedQuestions: QuizQuestion[] = [];

    let currentQuestion: Partial<QuizQuestion> & { options: string[], correctVal?: string } = {
      options: []
    };

    const flushCurrent = () => {
      if (currentQuestion.questionText && currentQuestion.options.length >= 2) {
        // Ensure strictly 4 options exist
        while (currentQuestion.options.length < 4) {
          currentQuestion.options.push(`Placeholder Option ${String.fromCharCode(65 + currentQuestion.options.length)}`);
        }
        // slice down to 4
        currentQuestion.options = currentQuestion.options.slice(0, 4);

        const correctIdx = detectCorrectOptionIndex(currentQuestion.correctVal || '', currentQuestion.options);
        
        parsedQuestions.push({
          id: `quest_word_${Date.now()}_${parsedQuestions.length}_${Math.random()}`,
          questionText: currentQuestion.questionText,
          options: currentQuestion.options,
          correctOptionIndex: correctIdx,
          explanation: currentQuestion.explanation
        });
      }
      currentQuestion = { options: [] };
    };

    lines.forEach((line) => {
      // Direct question indicators
      const qMatch = line.match(/^(?:Question|\d+)\s*[:.)-]\s*(.*)$/i);
      const optMatch = line.match(/^(?:Option\s*)?[A-D]\s*[:.)-]\s*(.*)$/i);
      const ansMatch = line.match(/^(?:Answer|Correct Answer|Correct)\s*[:.)-]\s*(.*)$/i);
      const expMatch = line.match(/^(?:Explanation|Exp)\s*[:.)-]\s*(.*)$/i);

      if (qMatch) {
        flushCurrent();
        currentQuestion.questionText = qMatch[1].trim();
      } 
      else if (optMatch) {
        currentQuestion.options.push(optMatch[1].trim());
      }
      else if (ansMatch) {
        currentQuestion.correctVal = ansMatch[1].trim();
      }
      else if (expMatch) {
        currentQuestion.explanation = expMatch[1].trim();
      }
      else {
        // If it starts with a number or seems like a freestanding question line and no current question is open
        if (!currentQuestion.questionText && line.length > 10 && !line.startsWith('A)') && !line.startsWith('B)') && !line.startsWith('C)') && !line.startsWith('D)')) {
          currentQuestion.questionText = line;
        } else if (currentQuestion.questionText) {
          // Freestanding line inside open question - could be options if they match formatting, or explanations
          const inlineOptions = line.match(/^([A-D])\s*[:.)-]\s*(.*)$/i);
          if (inlineOptions) {
            currentQuestion.options.push(inlineOptions[2].trim());
          }
        }
      }
    });

    flushCurrent(); // flush final item

    if (parsedQuestions.length > 0) {
      setQuestionsDraft(prev => [...prev, ...parsedQuestions]);
      setImportLogs({ success: parsedQuestions.length, errors });
    } else {
      // Fallback: try TSV parsing in case it's pasted grid data in paragraphs
      parseTSVData(text);
    }
  };

  // Real-time TSV copy-paste parser (Google Sheets and Excel Clipboard)
  const parseTSVData = (text: string) => {
    const rows = text.split('\n').map(r => r.split('\t'));
    const cleanGrid = rows.map(r => r.map(c => c.trim())).filter(r => r.length > 0 && r[0].length > 0);
    
    if (cleanGrid.length > 0) {
      parseSheetGrid(cleanGrid);
    } else {
      setImportLogs({ success: 0, errors: ['Could not detect structured questions in Word file plain text. Formatting must include numbering or standard options indicators like A), B), C), D)'] });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImportFile(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!rawPasteText || !rawPasteText.trim()) return;
    parseWordRawText(rawPasteText);
    setRawPasteText('');
    setIsPasteModeOpen(false);
  };

  // --- MANUAL EDIT QUESTIONS ---
  const handleAddQuestionManual = () => {
    const newQ: QuizQuestion = {
      id: `quest_manual_${Date.now()}_${Math.random()}`,
      questionText: 'New CBT Question Title',
      options: ['Option A Text', 'Option B Text', 'Option C Text', 'Option D Text'],
      correctOptionIndex: 0,
      explanation: ''
    };
    setQuestionsDraft(prev => [...prev, newQ]);
  };

  const handleRemoveDraftQuestion = (id: string) => {
    setQuestionsDraft(prev => prev.filter(q => q.id !== id));
  };

  const handleUpdateDraftQuestionText = (id: string, text: string) => {
    setQuestionsDraft(prev => prev.map(q => q.id === id ? { ...q, questionText: text } : q));
  };

  const handleUpdateDraftQuestionOption = (qId: string, oIdx: number, val: string) => {
    setQuestionsDraft(prev => prev.map(q => {
      if (q.id === qId) {
        const copyOpts = [...q.options];
        copyOpts[oIdx] = val;
        return { ...q, options: copyOpts };
      }
      return q;
    }));
  };

  const handleSelectCorrectOptionIndex = (qId: string, idx: number) => {
    setQuestionsDraft(prev => prev.map(q => q.id === qId ? { ...q, correctOptionIndex: idx } : q));
  };

  const handleUpdateDraftQuestionExplanation = (qId: string, val: string) => {
    setQuestionsDraft(prev => prev.map(q => q.id === qId ? { ...q, explanation: val } : q));
  };

  // --- PUBLISH OR SAVE QUIZ WRAPPER ---
  const handleSaveQuizToDB = () => {
    if (!quizTitle.trim()) {
      alert('Quiz Title is required.');
      return;
    }

    if (questionsDraft.length === 0) {
      alert('You must add or import at least one question block.');
      return;
    }

    const quizData = {
      courseId: selectedClassId,
      title: quizTitle,
      description: quizDesc,
      timeLimitMinutes: Number(quizTimer),
      dueDate: endDate || startDate || new Date().toISOString().split('T')[0],
      isActive: !isDraft,
      questions: questionsDraft,
      
      // Extended extended variables mapped dynamically
      subjectId: selectedSubjectId,
      startDate: startDate,
      endDate: endDate,
      passMark: Number(passMark),
      isAutoGrading,
      randomizeQuestions,
      randomizeOptions,
      showImmediateResults,
      allowRetakes,
      isDraft
    };

    if (editingQuizId) {
      // Editing Mode
      updateQuiz(editingQuizId, quizData);
    } else {
      // Adding Mode
      addQuiz(quizData);
    }

    // Clean Workspace
    clearCurrentDraftForm();
    localStorage.removeItem('nua_cbt_active_draft');
    setActiveTab('list');
  };

  const handleEditQuizClick = (qz: any) => {
    setEditingQuizId(qz.id);
    setQuizTitle(qz.title || '');
    setQuizDesc(qz.description || '');
    setSelectedClassId(qz.courseId || courses[0]?.id || '');
    setSelectedSubjectId(qz.subjectId || subjects[0]?.id || '');
    setQuizTimer(qz.timeLimitMinutes || 30);
    setPassMark(qz.passMark || 50);
    setStartDate(qz.startDate || '');
    setEndDate(qz.endDate || '');
    setIsAutoGrading(qz.isAutoGrading !== false);
    setRandomizeQuestions(qz.randomizeQuestions || false);
    setRandomizeOptions(qz.randomizeOptions || false);
    setShowImmediateResults(qz.showImmediateResults !== false);
    setAllowRetakes(qz.allowRetakes || false);
    setIsDraft(qz.isActive === false || qz.isDraft);
    setQuestionsDraft(qz.questions || []);
    
    setActiveTab('create');
  };

  // --- DOWNLOAD RESULT SHEET (CLIENT CSV GENERATION) ---
  const downloadResultsCSV = (qz: Quiz) => {
    const quizSubmissions = submissions.filter(s => s.quizId === qz.id);
    const passLimit = (qz as any).passMark || 50;

    let csvContent = "data:text/csv;charset=utf-8,";
    // CSV Headers
    csvContent += "Student Name,Admission Number,Class Level,Score Achieved,Max Score,Percentage,Pass Status,Submitted At\r\n";

    quizSubmissions.forEach(sub => {
      const studentObj = students.find(s => s.id === sub.studentId);
      const studentName = studentObj ? studentObj.name : 'Unknown Pupil';
      const adminNo = studentObj?.admissionNumber || studentObj?.id || 'N/A';
      const gradeLevel = studentObj?.gradeLevel || 'N/A';
      
      const percent = Math.round((sub.score / sub.maxScore) * 100);
      const passed = percent >= passLimit ? 'PASSED' : 'FAILED';
      const dateStr = sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'N/A';

      const row = `"${studentName}","${adminNo}","${gradeLevel}",${sub.score},${sub.maxScore},${percent}%,${passed},"${dateStr}"`;
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${qz.title.replace(/\s+/g, '_')}_Result_Sheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper resolvers
  const getCourseCode = (cId: string) => {
    const crs = courses.find(c => c.id === cId);
    return crs ? crs.code : 'SS';
  };

  const getSubjectName = (sId: string) => {
    const sb = subjects.find(s => s.id === sId);
    return sb ? sb.name : 'N/A';
  };

  // Filter quizzes by search term
  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuizQuery.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchQuizQuery.toLowerCase());
    const courseCode = getCourseCode(q.courseId);
    const matchesClass = filterClassQuery === 'All Classes' || courseCode === filterClassQuery;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in text-natural-charcoal">
      
      {/* Banner / Tab bar Header */}
      <div className="bg-white p-6 rounded-3xl border border-natural-beige shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-natural-green uppercase tracking-widest block font-mono">CBT Center</span>
          <h2 className="text-2xl font-serif font-black text-slate-900 mt-1">Computer Based Testing & Quiz Console</h2>
          <p className="text-xs text-slate-500 mt-0.5">Automate and construct rigorous examinations dynamically using Excel, CSV, or text import files.</p>
        </div>

        {/* Action Triggers */}
        <div className="flex gap-2">
          {activeTab !== 'list' && (
            <button
              onClick={() => {
                clearCurrentDraftForm();
                setActiveTab('list');
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-850 hover:bg-slate-50 bg-white border border-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Cancel/Back
            </button>
          )}

          {activeTab === 'list' && (
            <>
              <button
                onClick={() => {
                  clearCurrentDraftForm();
                  setActiveTab('create');
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-natural-green hover:bg-natural-green/90 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Design New CBT
              </button>
              
              {localStorage.getItem('nua_cbt_active_draft') && (
                <button
                  onClick={handleRestoreDraft}
                  className="px-3.5 py-2 text-xs font-bold uppercase bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl border border-amber-250 transition cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Restore Saved Draft
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- Tab 1: DASHBOARD / LIST --- */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          
          {/* Controls Strip */}
          <div className="bg-white p-4 rounded-2xl border border-natural-beige shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search exams by title or guidelines..."
                value={searchQuizQuery}
                onChange={(e) => setSearchQuizQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs outline-none font-medium"
              />
            </div>
            
            <select
              value={filterClassQuery}
              onChange={(e) => setFilterClassQuery(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none"
            >
              <option value="All Classes">All Classes</option>
              {Array.from(new Set(courses.map(c => c.code))).map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          {/* Quizzes Grid */}
          {filteredQuizzes.length === 0 ? (
            <div className="p-16 text-center bg-white border border-natural-beige rounded-3xl space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-serif font-bold text-slate-800 text-sm">No CBT Exams Registered</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Upload spreadsheet spreadsheets, CSV directories, or configure custom multiple-choice test periods above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((qz) => {
                const subCount = submissions.filter(s => s.quizId === qz.id).length;
                const crs = courses.find(c => c.id === qz.courseId);
                const isDraftStatus = qz.isActive === false || (qz as any).isDraft;
                
                return (
                  <div key={qz.id} className="bg-white rounded-3xl border border-natural-beige overflow-hidden shadow-xs hover:border-natural-green/40 transition flex flex-col justify-between">
                    <div className="p-6 space-y-4">
                      
                      {/* Meta Pills */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {crs ? crs.code : 'Class'} ({getSubjectName((qz as any).subjectId)})
                        </span>
                        
                        {isDraftStatus ? (
                          <span className="text-[10px] uppercase font-black tracking-widest bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                            Draft Mode
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
                            Published
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif font-extrabold text-slate-900 text-base leading-snug">{qz.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{qz.description}</p>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-2xl border border-slate-150">
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-bold block">Questions</span>
                          <span className="text-xs font-bold text-slate-800">{qz.questions.length} Qs</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-bold block">Duration</span>
                          <span className="text-xs font-bold text-slate-800">{qz.timeLimitMinutes} Mins</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-bold block">Pass Mark</span>
                          <span className="text-xs font-bold text-emerald-600">{(qz as any).passMark || 50}%</span>
                        </div>
                      </div>

                      {/* Extra Settings Indicators */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(qz as any).isAutoGrading !== false && (
                          <span className="text-[8px] uppercase font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">Auto-Grade</span>
                        )}
                        {(qz as any).randomizeQuestions && (
                          <span className="text-[8px] uppercase font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">Rand Qs</span>
                        )}
                        {(qz as any).randomizeOptions && (
                          <span className="text-[8px] uppercase font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">Rand Opts</span>
                        )}
                        {(qz as any).allowRetakes && (
                          <span className="text-[8px] uppercase font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">Retakes Ok</span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Utility controls */}
                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditQuizClick(qz)}
                          className="p-2 hover:bg-slate-200 rounded-xl text-slate-600 transition cursor-pointer"
                          title="Edit Quiz Configuration & Questions"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuiz(qz.id)}
                          className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition cursor-pointer"
                          title="Delete CBT Quiz"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleQuizActive(qz.id)}
                          className={`px-2 py-1 text-[9px] uppercase font-bold tracking-wider rounded-lg border transition cursor-pointer ${
                            qz.isActive ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {qz.isActive ? 'Go Draft' : 'Activate'}
                        </button>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedQuizIdForResults(qz.id);
                            setActiveTab('results');
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                          title="Inspect student results & downloadable spreadsheets"
                        >
                          <BarChart2 className="w-3.5 h-3.5" /> Reports ({subCount})
                        </button>
                        
                        {subCount > 0 && (
                          <button
                            onClick={() => downloadResultsCSV(qz)}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition cursor-pointer"
                            title="Download student marks csv"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- Tab 2: CREATE / EDIT CBT SCREEN --- */}
      {activeTab === 'create' && (
        <div className="space-y-8">
          
          {/* Main configuration settings box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-natural-beige shadow-xs space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">{editingQuizId ? 'Edit Exam CBT Profile & Parameters' : 'Establish CBT / Quiz parameters'}</h3>
                <p className="text-xs text-slate-400 font-medium">Design the subject class, time window constraints, grading models, and student view variables.</p>
              </div>
              <div className="text-right text-[10px] text-slate-400 italic">
                {autoSaveMsg && <span className="bg-slate-100 px-2 py-1 rounded text-[8.5px] font-mono">{autoSaveMsg}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Settings inputs Column */}
              <div className="md:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-600">Quiz title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Linear Algebra exam"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:border-indigo-500 outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase text-slate-600">Specialty Class</label>
                      <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase text-slate-600">Exam Subject</label>
                      <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      >
                        {subjects.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-600">Descriptive rules / guidelines for candidates</label>
                  <textarea
                    rows={2}
                    placeholder="Enter instructions. e.g. There are 20 questions in general physics. Once you launch the quiz, the timer starts running. Ensure you submit before duration checks elapse."
                    value={quizDesc}
                    onChange={(e) => setQuizDesc(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-600">Timer (Duration - minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="480"
                      value={quizTimer}
                      onChange={(e) => setQuizTimer(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-600">Pass Mark (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={passMark}
                      onChange={(e) => setPassMark(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-natural-green"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-600">Status Type</label>
                    <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setIsDraft(false)}
                        className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                          !isDraft ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-850'
                        }`}
                      >
                        Publish
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDraft(true)}
                        className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                          isDraft ? 'bg-slate-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-850'
                        }`}
                      >
                        Draft
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-600">Start date-time (optional)</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-600">End date-time (optional)</label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Right switches Column (Advanced CBT configurations) */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">CBT Advanced Directives</span>
                <div className="h-[1px] bg-slate-200 w-full mb-2"></div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Automatic grading</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-[150px]">Score and log grades immediately for students</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isAutoGrading}
                        onChange={(e) => setIsAutoGrading(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-slate-800 block">Randomize questions</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-[150px]">Shuffle questions order for different students</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={randomizeQuestions}
                        onChange={(e) => setRandomizeQuestions(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-slate-800 block">Randomize options</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-[150px]">Shuffle multiple choices order per question</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={randomizeOptions}
                        onChange={(e) => setRandomizeOptions(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-slate-800 block">Immediate review</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-[150px]">Allow learners to review question papers immediately post submission</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showImmediateResults}
                        onChange={(e) => setShowImmediateResults(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-slate-800 block">Allow retakes</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-[150px]">Allow student retries on the same paper</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={allowRetakes}
                        onChange={(e) => setAllowRetakes(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* DRAG & DROP MULTI-FORMAT UPLOADER & COPY PASTER SHEET */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left box: Native Document drag and drop uploader */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`bg-white p-6 sm:p-8 rounded-3xl border-2 border-dashed flex flex-col justify-center items-center text-center transition shadow-xs cursor-pointer ${
                dragActive ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-300 hover:border-slate-450'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                multiple={false}
                accept=".xlsx, .xls, .csv, .docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="p-4 bg-slate-100 rounded-full text-indigo-700 shrink-0">
                <Upload className="w-8 h-8" />
              </div>
              
              <h4 className="font-serif font-black text-slate-850 mt-4 text-sm">Bulk Upload up to 500 Questions</h4>
              <p className="text-xs text-slate-450 mt-1.5 max-w-sm">
                Drag & drop or Click to browse your local files. Support excel spreadsheets <span className="font-bold">(.xlsx)</span>, generic CSV <span className="font-bold">(.csv)</span>, Google sheets, or word <span className="font-bold">(.docx)</span> formats.
              </p>

              <div className="flex gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#1A365D] hover:bg-[#11243D] text-white text-[10.5px] font-extrabold uppercase rounded-lg transition"
                >
                  Browse File
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasteModeOpen(!isPasteModeOpen)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10.5px] font-extrabold uppercase rounded-lg transition"
                >
                  Copy-Paste Box
                </button>
              </div>

              <div className="text-[10px] text-slate-450 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-150 text-left font-mono">
                <span className="font-bold block">Expected Excel/CSV Columns:</span>
                Row structure: Question | Option A | Option B | Option C | Option D | Correct Answer
              </div>

            </div>

            {/* Right logs & paste console */}
            <div className="bg-white p-6 rounded-3xl border border-natural-beige flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">Import Logs & Direct Actions</span>
                <div className="h-[1px] bg-slate-100 w-full mt-2.5 mb-4"></div>

                {isPasteModeOpen ? (
                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-500">Paste questions text here directly (tsv/list formatting)</label>
                    <textarea
                      rows={5}
                      value={rawPasteText}
                      onChange={(e) => setRawPasteText(e.target.value)}
                      placeholder="e.g. 1. What is gravity?&#10;A) An option&#10;B) Attractive force&#10;C) Chemical&#10;D) Sound&#10;Answer: B"
                      className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsPasteModeOpen(false)}
                        className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePasteSubmit}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase rounded"
                      >
                        Convert Paste
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {importLogs ? (
                      <div className="space-y-3 p-4 rounded-xl border bg-slate-50 border-slate-200 animate-fade-in text-xs">
                        <div className="flex items-center justify-between font-bold text-green-700 border-b border-slate-200 pb-2">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            Conversion Completed!
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            {importLogs.success} Questions Extracted
                          </span>
                        </div>
                        
                        {importLogs.errors.length > 0 && (
                          <div className="space-y-1.5 text-xs">
                            <span className="font-bold text-rose-600 block">Parsing Warnings / Errors:</span>
                            <div className="max-h-[100px] overflow-y-auto space-y-1 text-[11px] text-slate-505 font-mono">
                              {importLogs.errors.slice(0, 10).map((err, id) => (
                                <p key={id}>• {err}</p>
                              ))}
                              {importLogs.errors.length > 10 && <p className="italic font-bold">And {importLogs.errors.length - 10} more errors...</p>}
                            </div>
                          </div>
                        )}
                        <p className="text-[11px] text-slate-400">Review questions below. Each question can be edited, checked, and saved before publishing.</p>
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-xs max-w-sm">No new document uploads converted in this session yet.</p>
                    )}

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-550 block">Quick Sandbox Templates:</span>
                      <div className="grid grid-cols-2 gap-2 text-[10.5px] text-slate-650">
                        <button
                          onClick={() => {
                            setQuestionsDraft([
                              {
                                id: 'demo1',
                                questionText: 'Evaluate the limit as x approaches Infinity of (3x^2 + 2x) / (5x^2 - x)',
                                options: ['3/5', 'Infinity', '0', '2/5'],
                                correctOptionIndex: 0,
                                explanation: 'Divide everything by maximum degree x^2. The limits of other components approach 0, leaving 3/5.'
                              },
                              {
                                id: 'demo2',
                                questionText: 'If f(x) = x^3 - 3x^2 + 2x, find the value of f\'(2)',
                                options: ['2', '0', '3', '6'],
                                correctOptionIndex: 0,
                                explanation: 'Differentiating f\'(x) = 3x^2 - 6x + 2. Substituting x=2 yields 3(4) - 6(2) + 2 = 12 - 12 + 2 = 2.'
                              }
                            ]);
                            setImportLogs({ success: 2, errors: [] });
                          }}
                          className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-left font-sans transition flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-600" /> Insert Science (Math) Quiz
                        </button>
                        <button
                          onClick={() => {
                            setQuestionsDraft([
                              {
                                id: 'lit_demo_1',
                                questionText: 'In Shakespeare\'s Macbeth, who kills Lady Macbeth?',
                                options: ['Macduff', 'Macbeth', 'She commits suicide', 'Banquo\'s ghost'],
                                correctOptionIndex: 2,
                                explanation: 'Lady Macbeth is reported to have taken her own life due to deep chemical guilt and sleepwalking bouts.'
                              },
                              {
                                id: 'lit_demo_2',
                                questionText: 'What is the central literary motif in Emily Bronte\'s Wuthering Heights?',
                                options: ['Unrequited affection and revenge cycle', 'Mercantile industry expansion', 'Colonial explorations', 'Linguistic syntax validation'],
                                correctOptionIndex: 0,
                                explanation: 'The novel focuses deeply on Heathcliff\'s destructive obsession and multi-generational revenge path.'
                              }
                            ]);
                            setImportLogs({ success: 2, errors: [] });
                          }}
                          className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-left font-sans transition flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-[#C29B38]" /> Insert Art (Literature) Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action trigger footer */}
              <div className="border-t border-slate-100 pt-4 mt-6 flex gap-2 justify-end">
                <button
                  onClick={clearCurrentDraftForm}
                  className="px-4 py-2 hover:bg-slate-100 rounded-xl text-slate-500 font-bold text-xs uppercase transition cursor-pointer"
                >
                  Clear Draft
                </button>
                <button
                  onClick={handleSaveQuizToDB}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1"
                >
                  <Save className="w-4 h-4" /> Publish Exam Paper
                </button>
              </div>

            </div>

          </div>

          {/* DRAFT QUESTIONS LIST & WORK BENCH */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-natural-beige shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Question Editor & Workbench ({questionsDraft.length} Questions)</h3>
                <p className="text-xs text-slate-400 font-medium">Browse, filter, edit, or append inline explanations to parsed CBT items directly.</p>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search workbook..."
                    value={searchQuestionTerm}
                    onChange={(e) => setSearchQuestionTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-slate-250 bg-slate-50 text-slate-700 text-xs rounded-lg outline-none max-w-[200px]"
                  />
                </div>

                <button
                  onClick={handleAddQuestionManual}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Question
                </button>
              </div>
            </div>

            {/* Questions Grid/List mapping */}
            {questionsDraft.length === 0 ? (
              <p className="text-center py-10 text-slate-400 italic text-xs">No questions loaded in this draft spreadsheet. Import worksheets or append above.</p>
            ) : (
              <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
                {questionsDraft
                  .filter(q => q.questionText.toLowerCase().includes(searchQuestionTerm.toLowerCase()))
                  .map((q, qIdx) => (
                    <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-205 space-y-4 shadow-3xs relative group animate-fade-in">
                      
                      {/* Banner header inside question */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-black">Question #{qIdx + 1}</span>
                        <button
                          onClick={() => handleRemoveDraftQuestion(q.id)}
                          className="opacity-60 hover:opacity-100 text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer transition"
                          title="Delete question from worksheet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Question Text Prompt */}
                      <div className="space-y-1">
                        <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider font-mono">Question Text Prompt</label>
                        <input
                          type="text"
                          required
                          value={q.questionText}
                          onChange={(e) => handleUpdateDraftQuestionText(q.id, e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none text-slate-800 font-bold"
                        />
                      </div>

                      {/* 4 Choices Form */}
                      <div className="space-y-2">
                        <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider font-mono">Options Configuration</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = q.correctOptionIndex === oIdx;
                            return (
                              <div key={oIdx} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSelectCorrectOptionIndex(q.id, oIdx)}
                                  className={`w-8 h-8 rounded-xl border flex justify-center items-center text-xs' font-bold shrink-0 cursor-pointer ${
                                    isCorrect ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white border-slate-200 hover:bg-slate-100'
                                  }`}
                                  title="Mark as correct choice"
                                >
                                  {isCorrect ? '✓' : String.fromCharCode(65 + oIdx)}
                                </button>
                                <input
                                  type="text"
                                  required
                                  value={opt}
                                  onChange={(e) => handleUpdateDraftQuestionOption(q.id, oIdx, e.target.value)}
                                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none font-medium"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation Form / Custom memo */}
                      <div className="space-y-1 pt-1">
                        <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider font-mono">Optional explanation logic/justifications</label>
                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={(e) => handleUpdateDraftQuestionExplanation(q.id, e.target.value)}
                          placeholder="e.g. Gravity constant defaults to 9.8m/s."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-slate-550"
                        />
                      </div>

                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- Tab 3: RESULTS / GRADES DIRECTORY TABLE --- */}
      {activeTab === 'results' && selectedQuizIdForResults && (
        (() => {
          const selectedQuiz = quizzes.find(q => q.id === selectedQuizIdForResults);
          if (!selectedQuiz) return <p className="text-xs p-4 bg-white rounded">Active CBT Exam not found.</p>;

          const quizSubmissions = submissions.filter(s => s.quizId === selectedQuizIdForResults);
          const passLimit = (selectedQuiz as any).passMark || 50;

          return (
            <div className="space-y-6">
              
              {/* Score analytics info overview banner */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-natural-beige shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A365D] bg-indigo-50 px-2 py-0.5 rounded leading-none font-mono">
                    {selectedQuiz.title} Summary
                  </span>
                  <h3 className="text-xl font-serif font-black text-slate-900 mt-1">Class Assessment Result Index</h3>
                  <p className="text-xs text-slate-405">Review individual student timings, correct questions percent, and export full reports below.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => downloadResultsCSV(selectedQuiz)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm leading-none"
                  >
                    <Download className="w-4 h-4" /> Download Result Sheet
                  </button>
                  <button
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2 border border-slate-205 text-slate-600 hover:bg-slate-50 bg-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                  >
                    Back to Exams
                  </button>
                </div>
              </div>

              {/* High level metrics panels */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Exam Roster Count</span>
                  <span className="text-2xl font-serif font-black text-slate-900 block leading-none">{quizSubmissions.length} Pupils</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Average Percentage</span>
                  <span className="text-2xl font-serif font-black text-indigo-700 block leading-none">
                    {quizSubmissions.length > 0 
                      ? `${Math.round(quizSubmissions.reduce((sum, current) => sum + (current.score / current.maxScore), 0) / quizSubmissions.length * 100)}%`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Highest Mark</span>
                  <span className="text-2xl font-serif font-black text-emerald-700 block leading-none">
                    {quizSubmissions.length > 0 
                      ? `${Math.max(...quizSubmissions.map(s => s.score))} / ${selectedQuiz.questions.length}`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Pass Rates Ratio</span>
                  <span className="text-2xl font-serif font-black text-emerald-750 block leading-none">
                    {quizSubmissions.length > 0 
                      ? `${Math.round((quizSubmissions.filter(s => Math.round((s.score / s.maxScore) * 100) >= passLimit).length / quizSubmissions.length) * 100)}%`
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>

              {/* Submissions directory table */}
              <div className="bg-white rounded-3xl border border-natural-beige overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-750 font-mono">Candidate Scores Sheet</span>
                </div>

                {quizSubmissions.length === 0 ? (
                  <p className="p-12 text-center text-slate-400 italic text-xs font-medium">No candidates have completed this testing period yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                      <thead className="text-[10px] font-black uppercase text-slate-400 tracking-wider bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 font-mono">Student Name</th>
                          <th className="px-6 py-4 font-mono">Admission No</th>
                          <th className="px-6 py-4 font-mono text-center">Timing Completed</th>
                          <th className="px-6 py-4 font-mono text-center">Score Ratio</th>
                          <th className="px-6 py-4 font-mono text-center">Percentage</th>
                          <th className="px-6 py-4 font-mono text-center">Grade Verdict</th>
                          <th className="px-6 py-4 font-mono">Submission date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {quizSubmissions.map((sub) => {
                          const studentObj = students.find(s => s.id === sub.studentId);
                          const studentName = studentObj ? studentObj.name : 'Unknown Pupil';
                          const adminNo = studentObj?.admissionNumber || studentObj?.id || 'N/A';
                          
                          const percent = Math.round((sub.score / sub.maxScore) * 100);
                          const passed = percent >= passLimit;

                          return (
                            <div key={sub.id} style={{ display: 'table-row' }}>
                              <td className="px-6 py-4 font-bold text-slate-900 select-all">{studentName}</td>
                              <td className="px-6 py-4 font-mono text-slate-500">{adminNo}</td>
                              <td className="px-6 py-4 text-center text-slate-500 font-mono">{selectedQuiz.timeLimitMinutes}m limit</td>
                              <td className="px-6 py-4 text-center font-bold font-serif text-slate-800">{sub.score} / {sub.maxScore}</td>
                              <td className="px-6 py-4 text-center font-bold text-indigo-700">{percent}%</td>
                              <td className="px-6 py-4 text-center">
                                {passed ? (
                                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-black text-[9.5px]">
                                    PASSED
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-full font-black text-[9.5px]">
                                    FAILED
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-slate-400 font-mono">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}</td>
                            </div>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          );
        })()
      )}

    </div>
  );
}
