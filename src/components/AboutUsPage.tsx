import React from 'react';
import { Award, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

export default function AboutUsPage() {
  const milestones = [
    { year: '1982', title: 'Foundation', desc: 'NEW UNIQUE ACADEMY was established by Reverend Benson with 3 classrooms.' },
    { year: '1999', title: 'National Recognition', desc: 'Received State Board accreditation of honor with academic distinction.' },
    { year: '2012', title: 'Modern Campus Launch', desc: 'Transitioned to our custom built state-of-the-art facility Behind Fabian Hotel Zone C.' },
    { year: '2020', title: 'Digital Era Integration', desc: 'Boasted dual-language courses, interactive modern CBT testing, and parent trackers.' }
  ];

  return (
    <div className="animate-fade-in text-natural-charcoal">
      {/* Banner */}
      <section className="bg-natural-green text-[#FDFBF7] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(198,138,83,0.1),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-serif italic text-natural-clay uppercase font-bold tracking-widest block">Behind the Crest</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">Our Premium Founding & Philosophy</h1>
          <p className="text-sm text-[#E9E5D9] max-w-xl mx-auto leading-relaxed">
            Discover the legacy, values, and leadership principles that drive educational distinction at NEW UNIQUE ACADEMY.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xs font-bold text-natural-green tracking-widest uppercase">The Principal's Welcome Address</h2>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-natural-charcoal leading-tight">
            "We teach our students how to think critically and lead with honor"
          </h3>
          <div className="h-1 w-12 bg-natural-clay rounded-full"></div>
          <p className="text-sm text-natural-charcoal/80 leading-relaxed">
            Welcome to NEW UNIQUE ACADEMY. For over forty years, we have remained committed to providing a transformative educational experience. Our school is a community of deep academic inquiry, where bilingual curriculums and high moral character go hand in hand.
          </p>
          <p className="text-sm text-natural-charcoal/80 leading-relaxed">
            Through personalized student mentoring, dedicated faculty guides, and peer advisory boards, our scholars graduate prepared for top regional and global universities. We are delighted to partner with you in your child's developmental path.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="shrink-0">
              <span className="font-serif font-extrabold text-sm text-natural-charcoal block">Dr. Olivia Benson</span>
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
                <span className="font-bold text-xs text-natural-charcoal block">Character & Honor</span>
                <p className="text-[11px] text-natural-charcoal/70 mt-0.5">Fostering strict moral accountability, transparency, mutual respect, and academic honesty.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 p-2 bg-amber-50 text-[#C29B38] rounded-xl h-fit">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-natural-charcoal block">University Preparatory Focus</span>
                <p className="text-[11px] text-natural-charcoal/70 mt-0.5">Rigorous coursework, AP preparation, digital skills laboratory, and scientific project portfolios.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 p-2 bg-rose-50 text-rose-600 rounded-xl h-fit">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-natural-charcoal block">Bilingual & Classical Humanities</span>
                <p className="text-[11px] text-natural-charcoal/70 mt-0.5">Promoting robust expression, world languages and geopolitical civilization background.</p>
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
            <h4 className="text-2xl font-serif font-bold">Milestones of Academic Pride</h4>
            <p className="text-natural-charcoal/70 text-xs">How we grew into a beacon of intellectual curiosity over the decades.</p>
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
