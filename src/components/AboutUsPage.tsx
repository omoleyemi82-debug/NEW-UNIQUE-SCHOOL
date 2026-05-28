import React from 'react';
import { Award, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

export default function AboutUsPage() {
  const milestones = [
    { year: '2016', title: 'School Foundation', desc: 'NEW UNIQUE ACADEMY was established with a focus on core secondary school subjects and quality instruction.' },
    { year: '2019', title: 'Official Accreditation', desc: 'Received state ministry approvals and registered for West African Senior School Certificate Examination subjects.' },
    { year: '2022', title: 'Main Campus Transition', desc: 'Moved teaching activities to our purpose-built campus Behind Fabian Hotel Zone C, improving scientific laboratory access.' },
    { year: '2025', title: 'Administrative Portal Launch', desc: 'Introduced the secure student-teacher-parent portal software to coordinate timetables, attendance registers, and academic result sheets.' }
  ];

  return (
    <div className="animate-fade-in text-natural-charcoal">
      {/* Banner */}
      <section className="bg-natural-green text-[#FDFBF7] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(198,138,83,0.1),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-serif italic text-natural-clay uppercase font-bold tracking-widest block">Behind the Crest</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">Our History & Core Values</h1>
          <p className="text-sm text-[#E9E5D9] max-w-xl mx-auto leading-relaxed">
            Discover our practical milestones, secondary school education philosophy, and commitment to student character.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xs font-bold text-natural-green tracking-widest uppercase">The School Principal's Address</h2>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-natural-charcoal leading-tight">
            "Promoting simple academic integrity and core knowledge standards"
          </h3>
          <div className="h-1 w-12 bg-natural-clay rounded-full"></div>
          <p className="text-sm text-natural-charcoal/80 leading-relaxed">
            Welcome to NEW UNIQUE ACADEMY. Established ten years ago, we have maintained a steady focus on providing clear, balanced, and affordable secondary education. Our classroom formats emphasize active study cycles, neat discipline, and healthy peer interaction.
          </p>
          <p className="text-sm text-natural-charcoal/80 leading-relaxed">
            Through steady student support, clear subject period schedules, and direct parent-teacher communication, we guide candidates to excel in their regional school exit evaluations. We look forward to supporting your child's learning journey.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="shrink-0">
              <span className="font-serif font-extrabold text-sm text-natural-charcoal block">Mrs. Olivia Benson</span>
              <span className="text-[10px] uppercase text-natural-green font-bold tracking-wider">Principal, New Unique Academy</span>
            </div>
          </div>
        </div>

        {/* Vision Box */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-natural-beige shadow-sm space-y-6">
          <h4 className="font-serif font-bold text-natural-charcoal text-lg">Our Strategic Mission</h4>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="shrink-0 p-2 bg-emerald-50 text-natural-green rounded-xl h-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-natural-charcoal block">Character & Duty</span>
                <p className="text-[11px] text-natural-charcoal/70 mt-0.5">Teaching students strict homework responsibility, class attendance, and everyday mutual respect.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 p-2 bg-amber-50 text-[#C29B38] rounded-xl h-fit">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-natural-charcoal block">Secondary Certificate Prep</span>
                <p className="text-[11px] text-[#2C2B29] font-semibold mt-0.5">Focused preparation for state examinations, general science practicals, accounting, and government.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 p-2 bg-rose-50 text-rose-600 rounded-xl h-fit">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-natural-charcoal block">Structured Secondary Divisions</span>
                <p className="text-[11px] text-natural-charcoal/70 mt-0.5">Clear specialization streams in Science courses, Art subjects, or Commerce disciplines.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historic Timeline */}
      <section className="py-16 bg-natural-light/20 border-t border-natural-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h3 className="text-xs font-bold text-natural-green tracking-widest uppercase">The NUA Journey</h3>
            <h4 className="text-2xl font-serif font-bold">10 Years of Steady Growth</h4>
            <p className="text-natural-charcoal/70 text-xs">Our key milestones since opening our doors to local secondary students.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((ms, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-natural-beige shadow-xs space-y-4">
                <span className="text-2xl font-serif font-black text-natural-green">{ms.year}</span>
                <div className="h-0.5 w-8 bg-natural-clay rounded"></div>
                <h5 className="font-serif font-bold text-xs uppercase tracking-wide text-natural-charcoal">{ms.title}</h5>
                <p className="text-xs text-natural-charcoal/75 leading-relaxed">{ms.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
