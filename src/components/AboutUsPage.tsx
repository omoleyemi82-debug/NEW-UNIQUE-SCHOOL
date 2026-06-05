import React from 'react';
import { Award, ShieldCheck, HeartPulse, Star, Compass, Target, BookOpen } from 'lucide-react';

export default function AboutUsPage() {
  const milestones = [
    { year: '2015', title: 'School Foundation', desc: 'NEW UNIQUE ACADEMY was established as a premier Christian secondary school dedicated to high moral values, academic integrity, and sound preparation for higher education.' },
    { year: '2019', title: 'Official Accreditation', desc: 'Received state ministry approvals for both Junior and Senior School Certifications across Science, Art, and Commerce streams.' },
    { year: '2022', title: 'Main Campus Transition', desc: 'Moved teaching activities to our purpose-built permanent campus at 1, Zone C, Fiyinfolu Estate, Off Ilawe Road, Ado-Ekiti, Ekiti State, Nigeria, upgrading science laboratories and computing stations.' },
    { year: '2025', title: 'Administrative Portal Launch', desc: 'Introduced the secure digital portal software to synchronize lesson plans, results processing, attendance registers, and parent-teacher handshakes.' }
  ];

  return (
    <div className="animate-fade-in text-slate-300 space-y-12 pb-16">
      
      {/* Banner segment */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 text-center border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.05),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">Behind the Crest</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wider uppercase text-white">Our History & Core Values</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Founded ten years ago, discover our practical secondary milestones, school goals, and disciplined specialized streams.
          </p>
        </div>
      </section>

      {/* Main Narrative - 11 years story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold text-sky-450 uppercase tracking-widest">Office of the Proprietors</span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
            "Academic Excellence Is Our Pride" &mdash; Rooted in Scripture and Moral Integrity
          </h3>
          <div className="h-1 w-12 bg-sky-500 rounded-full"></div>
          
          <div className="space-y-4 text-xs sm:text-sm text-slate-350 leading-relaxed">
            <p>
              Welcome to NEW UNIQUE ACADEMY. Established in 2015, our Christian secondary institution has spent approximately 11 years nurturing intellectual ability, strict personal discipline, high moral values, and thorough preparation for collegiate and higher academic callings.
            </p>
            <p>
              Under the supportive leadership and vision of the Proprietor & Proprietress, Mr. & Mrs. Adelanke, the academy continues to produce exemplary citizens. We guide candidates to excel in WAEC, NECO, and other certifications through specialized streams in Science, Art, and Commerce.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="shrink-0">
              <span className="font-serif font-bold text-sm text-slate-200 block">Mr. & Mrs. Adelanke</span>
              <span className="text-[10px] uppercase text-sky-450 font-bold tracking-widest font-mono">School Proprietor & Proprietress</span>
            </div>
          </div>
        </div>

        {/* Vision & Goals Card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/[0.02] rounded-full blur-2xl pointer-events-none select-none" />
          <h4 className="font-serif font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} /> Our Strategic Goals
          </h4>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-slate-950">
              <div className="shrink-0 p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="bg-slate-900">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-200 block">Mission & Character</span>
                <p className="text-[11px] text-slate-450 mt-1 font-normal">Teaching students strict homework responsibility, daily attendance habits, and everyday integrity.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start pb-4 border-b border-slate-950">
              <div className="shrink-0 p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
                <Target className="w-4 h-4" />
              </div>
              <div className="bg-slate-900">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-200 block">Vision of Exit Preparation</span>
                <p className="text-[11px] text-slate-450 mt-1 font-normal">Sustained practical tutoring for national certificates, science experiments, bookkeeping accounts, and literacy.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="shrink-0 p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="bg-slate-900">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-200 block">Dedicated Specializations</span>
                <p className="text-[11px] text-slate-450 mt-1 font-normal">Offering specialized streams in Science practical blocks, Art humanities, and Commerce bookkeeping disciplines.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historic Timeline (10 Years of Steady Growth) */}
      <section className="py-16 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block font-mono">The NUA Milestone Roadmap</span>
            <h4 className="text-2xl sm:text-3xl font-serif font-black text-white uppercase tracking-wide">10 Years of Steady Growth</h4>
            <div className="h-0.5 w-12 bg-sky-500 mx-auto mt-4 rounded-full" />
            <p className="text-slate-400 text-xs mt-2">A decade of providing practical and disciplined education to young secondary candidates.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((ms, idx) => (
              <div key={idx} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4 hover:border-slate-700 transition">
                <span className="text-2xl font-serif font-black text-sky-400 block">{ms.year}</span>
                <div className="h-0.5 w-8 bg-sky-500 rounded"></div>
                <h5 className="font-serif font-extrabold text-xs uppercase tracking-wider text-slate-200">{ms.title}</h5>
                <p className="text-[11.5px] text-slate-400 leading-relaxed">{ms.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
