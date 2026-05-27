import React from 'react';
import { BookOpen, Book, ChevronRight, GraduationCap, Layers } from 'lucide-react';

export default function AcademicsPage({ onSearchClick }: { onSearchClick?: () => void }) {
  const departments = [
    { name: 'Mathematics', head: 'Mr. David Vance (M.Sc.)', courses: 'General Arithmetic, Algebra, Advanced AP Calculus BC, Matrices' },
    { name: 'Sciences', head: 'Dr. Sarah Jenkins (Ph.D.)', courses: 'General Science, Molecular Biology, Biochemistry, Physics' },
    { name: 'Language & English Literature', head: 'Mrs. Emily Cole (M.A.)', courses: 'Creative Writing, Poetry, Debating, World Literature' },
    { name: 'Humanities & Civics', head: 'Mr. Richard Thorne (M.A.)', courses: 'World History, Social Civil Treaties, Demographics, Rhetoric' }
  ];

  const books = [
    { title: 'The Principles of Genetics (8th Ed)', author: 'Sarah Jenkins', type: 'Biology' },
    { title: 'Matrices & Vector Algebra Foundations', author: 'David Vance', type: 'Mathematics' },
    { title: 'A Short History of African & World Treaties', author: 'Richard Thorne', type: 'Civics' },
    { title: 'Classical Rhetoric & Argumentation Guide', author: 'Emily Cole', type: 'Literature' }
  ];

  return (
    <div className="animate-fade-in text-natural-charcoal">
      {/* Banner */}
      <section className="bg-natural-green text-[#FDFBF7] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(198,138,83,0.1),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-serif italic text-natural-clay uppercase font-bold tracking-widest block">Academic Pathways</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">Our Rigorous Departmental Curriculum</h1>
          <p className="text-sm text-[#E9E5D9] max-w-xl mx-auto leading-relaxed">
            Nurturing young minds through fundamental literacy layers, logical frameworks, and scientific experimentation.
          </p>
        </div>
      </section>

      {/* Pathways sections Nursery, Primary, Secondary */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold text-natural-green tracking-widest uppercase">Academic Divisions</h2>
          <h3 className="text-2xl font-serif font-bold text-natural-charcoal">The Framework of Student Growth</h3>
          <p className="text-xs text-natural-charcoal/70">A smooth and robust pedagogical continuum spanning from early sensory training to university entrance prerequisites.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Nursery School CARD */}
          <div className="bg-white rounded-3xl p-8 border border-natural-beige shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 text-[#C29B38] rounded-2xl w-fit">
                <Book className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-bold text-natural-charcoal">Nursery School</h4>
              <span className="text-[10px] uppercase tracking-widest text-[#C29B38] bg-amber-50 px-2 py-0.5 rounded font-black inline-block">Ages 2 - 5 Early Years</span>
              <p className="text-xs text-natural-charcoal/75 leading-relaxed">
                Applying the classic Montessori approach. Fosters fundamental sensory cognition, fine/gross motor skills development, initial numbers, and bilingual vocabulary games.
              </p>
            </div>
            <ul className="text-xs text-natural-charcoal/80 space-y-2 border-t border-natural-beige pt-4">
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#C29B38]" /> Play-based sensory rooms</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#C29B38]" /> Fine motor coordination drills</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#C29B38]" /> Basic phonemes & language arts</li>
            </ul>
          </div>

          {/* Primary School CARD */}
          <div className="bg-white rounded-3xl p-8 border border-natural-beige shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 text-natural-green rounded-xl w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-bold text-natural-charcoal">Primary School</h4>
              <span className="text-[10px] uppercase tracking-widest text-natural-green bg-emerald-50 px-2 py-0.5 rounded font-black inline-block">Grades 1 - 6 Elementary</span>
              <p className="text-xs text-natural-charcoal/75 leading-relaxed">
                Establishing the intellectual pillars. Students master core math equations, grammatical critiques, world geography basics, critical reasoning, and team athletic trials.
              </p>
            </div>
            <ul className="text-xs text-natural-charcoal/80 space-y-2 border-t border-natural-beige pt-4">
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-natural-green" /> Spelling bee & rhetoric guides</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-natural-green" /> Multiplicative arithmetic foundation</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-natural-green" /> Interactive logic classes</li>
            </ul>
          </div>

          {/* Secondary School CARD */}
          <div className="bg-white rounded-3xl p-8 border border-natural-beige shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl w-fit">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-bold text-natural-charcoal">Secondary School</h4>
              <span className="text-[10px] uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-black inline-block">Grades 7 - 12 Prep</span>
              <p className="text-xs text-natural-charcoal/75 leading-relaxed">
                Rigorous college preps. Highlights include Advanced Placement (AP) science labs, computer logic algorithms, civil debate leagues, and world history thesis publications.
              </p>
            </div>
            <ul className="text-xs text-natural-charcoal/80 space-y-2 border-t border-natural-beige pt-4">
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-600" /> AP STEM coursework series</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-600" /> Pre-engineering design lab assays</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-600" /> Scholarship & SAT prep guidance</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Departments Lists */}
      <section className="py-16 bg-natural-light/20 border-t border-b border-natural-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-natural-green tracking-widest uppercase">The Registrar Faculty Group</h3>
            <h4 className="text-2xl font-serif font-extrabold text-natural-charcoal mt-1">Our Core Academic Departments</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-natural-charcoal">{dept.name}</span>
                  <span className="text-[10px] bg-natural-light px-2 py-0.5 rounded text-natural-green font-semibold">Head: {dept.head}</span>
                </div>
                <div className="h-[1px] w-full bg-slate-100"></div>
                <p className="text-xs text-natural-charcoal/80 leading-relaxed font-semibold">Syllabus Highlights:</p>
                <p className="text-xs text-natural-charcoal/65 leading-relaxed">{dept.courses}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern E-Library books section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <h3 className="text-xs font-bold text-natural-green tracking-widest uppercase">E-Library Resources</h3>
            <h4 className="text-2xl font-serif font-extrabold text-natural-charcoal mt-1">Recommended Scholarly Books Shelf</h4>
            <p className="text-xs text-natural-charcoal/60">Digital copies of these syllabus essentials are downloadable inside the student secure portal.</p>
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
