import React from 'react';
import { BookOpen, Book, ChevronRight, GraduationCap, Layers } from 'lucide-react';

export default function AcademicsPage({ onSearchClick }: { onSearchClick?: () => void }) {
  const departments = [
    { name: 'Science Department', head: 'Mrs. Emily Cole (B.Sc., Ed.)', courses: 'General Biology, Chemistry, Physics, Mathematics, Geography, Agricultural Science, Computer Studies' },
    { name: 'Art Department', head: 'Mr. Richard Thorne (B.A.)', courses: 'Literature-in-English, Government, History, Visual Fine Arts, Civic Education, Language Studies' },
    { name: 'Commerce Department', head: 'Mr. David Vance (B.Sc., Economics)', courses: 'Financial Accounting, Commerce, Economics, Business Studies, Office Practice, Commerce Lab Activities' }
  ];

  const books = [
    { title: 'New School Biology for Senior Secondary', author: 'Emily Cole', type: 'Science' },
    { title: 'Essential Mathematics for Senior Students', author: 'David Vance', type: 'Science/Commerce' },
    { title: 'Adventures in Literature-in-English', author: 'Richard Thorne', type: 'Art' },
    { title: 'Fundamentals of Financial Accounting', author: 'David Vance', type: 'Commerce' }
  ];

  return (
    <div className="animate-fade-in text-slate-350 space-y-12 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 text-center border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.05),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">Academic Pathways</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wider uppercase">Our Secondary School Curriculum</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Structuring learning excellence through certified subject courses, clean laboratory guidelines, and practical examinations.
          </p>
        </div>
      </section>

      {/* Pathways sections Science, Art, Commerce */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block font-mono">Academic Divisions</span>
          <h3 className="text-2xl sm:text-3xl font-serif font-black text-white uppercase tracking-wider">The Framework of Student Growth</h3>
          <p className="text-xs text-slate-400">A clear specialization curriculum spanning the classical three departments of senior studies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Science CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-4">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-white uppercase tracking-wider">Science Division</h4>
              <span className="text-[8px] tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded font-extrabold uppercase inline-block border border-sky-500/20">
                SS1 - SS3 Classes
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Prepares students planning for future careers in engineering, medical sciences, chemistry, and software logic. Includes fully equipped practical physics, chemistry, and biology lab workstation hours.
              </p>
            </div>
            <ul className="text-xs text-slate-400 space-y-2.5 border-t border-slate-950 pt-5 mt-6 font-medium">
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-450" /> Hands-on chemistry laboratory metrics</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-450" /> Practical biology specimen analysis</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-450" /> Mathematics exit-level qualifications</li>
            </ul>
          </div>

          {/* Art CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-4">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl w-fit">
                <Book className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-white uppercase tracking-wider">Art Division</h4>
              <span className="text-[8px] tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded font-extrabold uppercase inline-block border border-sky-500/20">
                SS1 - SS3 Classes
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Nurtures critical communication, rhetorical grammar, civic rights, history, and literature-in-English. Art division focus encourages creative essays, governmental workflows, and linguistic skills.
              </p>
            </div>
            <ul className="text-xs text-slate-400 space-y-2.5 border-t border-slate-950 pt-5 mt-6 font-medium">
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-450" /> Structured literature essays</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-450" /> Civic responsibility duties</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-450" /> Language study exams prep</li>
            </ul>
          </div>

          {/* Commerce CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-4">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl w-fit">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-white uppercase tracking-wider">Commerce Division</h4>
              <span className="text-[8px] tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded font-extrabold uppercase inline-block border border-sky-500/20">
                SS1 - SS3 Classes
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Designed for students interested in business bookkeeping, economic principles, audit trails, and logistics. Cultivates robust ledger posting habits to excel on exit board accounts.
              </p>
            </div>
            <ul className="text-xs text-slate-400 space-y-2.5 border-t border-slate-950 pt-5 mt-6 font-medium">
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-450" /> Double-entry financial bookkeeping</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-450" /> Key economic graphs & charts</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-450" /> Practical offices administration studies</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Departments Lists */}
      <section className="py-16 bg-slate-950 border-t border-b border-slate-900 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-[10px] text-sky-400 uppercase font-bold tracking-widest block font-mono">The Faculty Chambers</span>
            <h4 className="text-2xl font-serif font-black text-white uppercase tracking-wider">Our Core Academic Departments</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept, idx) => (
              <div key={idx} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-sm">
                <div className="flex flex-col gap-2 justify-between">
                  <span className="text-xs uppercase tracking-wider font-extrabold font-serif text-white">{dept.name}</span>
                  <span className="text-[9px] font-bold bg-slate-950 border border-slate-800 text-sky-400 px-2 py-1 rounded w-fit uppercase font-mono">Head: {dept.head}</span>
                </div>
                <div className="h-[1px] w-full bg-slate-950"></div>
                <div className="space-y-1">
                  <p className="text-[9.5px] uppercase tracking-wider text-slate-500 font-extrabold font-mono">Subjects Taught:</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{dept.courses}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference Library */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        <div className="space-y-2">
          <span className="text-[10px] text-sky-400 uppercase font-bold tracking-widest block font-mono">Recommended Monographs</span>
          <h4 className="text-2xl sm:text-3xl font-serif font-black text-white uppercase tracking-wider">Syllabus Textbooks</h4>
          <p className="text-xs text-slate-400">All student folders can access registered bibliography titles on demand.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((bk, idx) => (
            <div key={idx} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-2.5 bg-slate-950 text-sky-400 rounded-xl w-fit border border-slate-800">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 tracking-wider">
                    {bk.type} Division
                  </span>
                  <h5 className="font-serif font-bold text-xs text-slate-200 tracking-wide mt-3.5 leading-snug">{bk.title}</h5>
                </div>
              </div>
              <div className="border-t border-slate-950 pt-4 mt-6 flex items-center justify-between text-[10.5px] text-slate-400">
                <span>By {bk.author}</span>
                <span className="font-semibold text-sky-400">Registered Roster</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
