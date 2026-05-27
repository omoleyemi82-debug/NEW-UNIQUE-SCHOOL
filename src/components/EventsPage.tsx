import React, { useState } from 'react';
import { Calendar, Inbox, ChevronRight, Clock, MapPin, Tag } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { EventType } from '../types';

export default function EventsPage() {
  const { events } = useSchool();
  const [selectedFilter, setSelectedFilter] = useState<EventType | 'all'>('all');

  // Filter events
  const filteredEvents = events.filter(ev => {
    if (selectedFilter === 'all') return true;
    return ev.type === selectedFilter;
  });

  return (
    <div className="animate-fade-in text-natural-charcoal">
      {/* Banner */}
      <section className="bg-natural-green text-[#FDFBF7] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(198,138,83,0.1),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-serif italic text-natural-clay uppercase font-bold tracking-widest block font-extrabold">Active Campus Calendars</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">Events Planner & National Holidays</h1>
          <p className="text-sm text-[#E9E5D9] max-w-xl mx-auto leading-relaxed">
            Stay aligned with our physical excursions, sports leagues schedules, examinations calendars, and campus festivals.
          </p>
        </div>
      </section>

      {/* Filters & Scheduler List */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Category Filters Switches */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-natural-beige pb-6">
          {(['all', 'academic', 'holiday', 'sports', 'arts', 'excursion'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-natural-green text-white shadow-md'
                  : 'bg-natural-light/60 hover:bg-[#E9E5D9] text-natural-charcoal/80 border border-natural-beige'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Dynamic List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white border border-natural-beige rounded-3xl max-w-lg mx-auto space-y-4">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-fit mx-auto">
              <Inbox className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-natural-charcoal">No Events Listed</h4>
            <p className="text-xs text-natural-charcoal/60">There are currently no events registered in the "{selectedFilter}" category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const eventDate = new Date(ev.date + 'T00:00:00');
              const dayStr = eventDate.getDate();
              const monthStr = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
              
              const typeColorMap = {
                academic: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                holiday: 'bg-amber-50 text-amber-700 border-amber-100',
                sports: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                arts: 'bg-rose-50 text-rose-700 border-rose-100',
                excursion: 'bg-blue-50 text-blue-700 border-blue-100'
              };

              return (
                <div key={ev.id} className="bg-white rounded-3xl border border-natural-beige overflow-hidden hover:shadow-xs transition-shadow flex flex-col justify-between p-6 space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {/* Date Badge */}
                      <div className="flex items-center gap-2.5">
                        <div className="bg-natural-green text-white font-serif font-bold text-sm tracking-tight w-12 h-12 rounded-2xl flex flex-col justify-center items-center shrink-0">
                          <span className="leading-none text-base font-black">{dayStr}</span>
                          <span className="text-[9px] font-sans font-bold tracking-widest uppercase">{monthStr}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-natural-charcoal font-sans flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#C29B38]" /> {ev.time || 'All Day'}
                          </h4>
                          <span className="text-[10px] text-natural-charcoal/60 block mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-natural-green" /> {ev.location}
                          </span>
                        </div>
                      </div>

                      {/* Event Type Badge */}
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border ${typeColorMap[ev.type] || 'bg-slate-50 text-slate-700'}`}>
                        {ev.type}
                      </span>
                    </div>

                    <h5 className="font-serif font-extrabold text-natural-charcoal tracking-wide text-base leading-snug">{ev.title}</h5>
                    <p className="text-xs text-natural-charcoal/70 leading-relaxed font-normal">
                      {ev.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-natural-charcoal/50">
                    <span className="flex items-center gap-1 uppercase tracking-wider font-bold">
                      <Tag className="w-3.5 h-3.5 text-[#C29B38]" /> Calendar Log
                    </span>
                    <span className="font-mono text-xs">{ev.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
