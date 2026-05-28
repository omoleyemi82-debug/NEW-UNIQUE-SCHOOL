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
    { title: 'Essential Mathematics for Secondary Schools', author: 'David Vance', type: 'Science/Commerce' },
    { title: 'Adventures in Literature-in-English', author: 'Richard Thorne', type: 'Art' },
    { title: 'Fundamentals of Financial Accounting', author: 'David Vance', type: 'Commerce' }
  ];

  return (
    <div className="animate-fade-in text-natural-charcoal">
      {/* Banner */}
      <section className="bg-natural-green text-[#FDFBF7] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(198,138,83,0.1),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-serif italic text-natural-clay uppercase font-bold tracking-widest block">Academic Pathways</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">Our Rigorous Secondary School Curriculum</h1>
          <p className="text-sm text-[#E9E5D9] max-w-xl mx-auto leading-relaxed">
            Nurturing young minds through clean academic layers, structured subject periods, and real science experiments.
          </p>
        </div>
      </section>

      {/* Pathways sections Science, Art, Commerce */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold text-natural-green tracking-widest uppercase">Academic Divisions</h2>
          <h3 className="text-2xl font-serif font-bold text-natural-charcoal">The Framework of Student Growth</h3>
          <p className="text-xs text-natural-charcoal/70">A well-structured academic program guiding students through Junior Secondary and Senior Secondary specialties.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Science CARD */}
          <div className="bg-white rounded-3xl p-8 border border-natural-beige shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-bold text-natural-charcoal">Science Division</h4>
              <span className="text-[10px] uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-black inline-block">SS1 - SS3 Classes</span>
              <p className="text-xs text-natural-charcoal/75 leading-relaxed">
                Prepares students planning for future careers in engineering, medical sciences, analytics, and software logic. Includes fully equipped practical physics, chemistry, and biology lab modules.
              </p>
            </div>
            <ul className="text-xs text-natural-charcoal/80 space-y-2 border-t border-natural-beige pt-4">
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-600" /> Hands-on biology lab sessions</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-600" /> Practical physics calculations</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-600" /> Chemistry molecular experiments</li>
            </ul>
          </div>

          {/* Art CARD */}
          <div className="bg-white rounded-3xl p-8 border border-natural-beige shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 text-[#C29B38] rounded-xl w-fit">
                <Book className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-bold text-natural-charcoal">Art Division</h4>
              <span className="text-[10px] uppercase tracking-widest text-[#C29B38] bg-amber-50 px-2 py-0.5 rounded font-black inline-block">SS1 - SS3 Classes</span>
              <p className="text-xs text-natural-charcoal/75 leading-relaxed">
                Nurtures critical thinking, rhetoric expression, civic rights, history, and linguistic excellence. Students delve deeply into world literature, governance protocols, and fine arts portfolios.
              </p>
            </div>
            <ul className="text-xs text-natural-charcoal/80 space-y-2 border-t border-natural-beige pt-4">
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#C29B38]" /> Debating & civic logic forums</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#C29B38]" /> Fine arts painting & composition</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#C29B38]" /> Comparative history essays</li>
            </ul>
          </div>

          {/* Commerce CARD */}
          <div className="bg-white rounded-3xl p-8 border border-natural-beige shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 text-natural-green rounded-xl w-fit">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-bold text-natural-charcoal">Commerce Division</h4>
              <span className="text-[10px] uppercase tracking-widest text-natural-green bg-emerald-50 px-2 py-0.5 rounded font-black inline-block">SS1 - SS3 Classes</span>
              <p className="text-xs text-natural-charcoal/75 leading-relaxed">
                Designed for future professionals in accounting, business management, economics, and logistics. Fosters robust analytical practices, business ledger recording, and commerce strategies.
              </p>
            </div>
            <ul className="text-xs text-natural-charcoal/80 space-y-2 border-t border-natural-beige pt-4">
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-natural-green" /> Business financial book bookkeeping</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-natural-green" /> Economic theories & charts</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-natural-green" /> Office practice workflows</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Departments Lists */}
      <section className="py-16 bg-natural-light/20 border-t border-b border-natural-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-natural-green tracking-widest uppercase">The School Faculty</h3>
            <h4 className="text-2xl font-serif font-extrabold text-natural-charcoal mt-1">Our Core Academic Departments</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center justify-between">
                  <span className="text-sm font-serif font-bold text-natural-charcoal">{dept.name}</span>
                  <span className="text-[10px] bg-natural-light px-2 py-0.5 rounded text-natural-green font-semibold w-fit leading-none">Head: {dept.head}</span>
                </div>
                <div className="h-[1px] w-full bg-slate-100"></div>
                <p className="text-xs text-natural-charcoal/85 leading-relaxed font-bold">Subjects Covered:</p>
                <p className="text-xs text-natural-charcoal/65 leading-relaxed">{dept.courses}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference Library */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <h3 className="text-xs font-bold text-natural-green tracking-widest uppercase">Recommended Materials</h3>
            <h4 className="text-2xl font-serif font-extrabold text-natural-charcoal mt-1">Recommended Syllabus Books</h4>
            <p className="text-xs text-natural-charcoal/60">Registered students can view/download textbook references on their dashboard.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((bk, idx) => (
            <div key={idx} className="bg-[#FDFBF7] p-6 rounded-2xl border border-natural-beige hover:border-natural-green/30 transition-all flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="p-2.5 bg-natural-light text-natural-green rounded-xl w-fit">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-natural-green/80 bg-emerald-50 px-1.5 py-0.5 rounded tracking-wider">{bk.type}</span>
                  <h5 className="font-serif font-extrabold text-xs text-slate-800 tracking-wide mt-2 leading-snug">{bk.title}</h5>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between text-[11px] text-natural-charcoal/60">
                <span>By {bk.author}</span>
                <span className="font-bold text-natural-green">Portal Catalog</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
