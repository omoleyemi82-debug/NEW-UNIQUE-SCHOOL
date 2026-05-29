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
    <div className="animate-fade-in text-slate-350 space-y-12 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 text-center border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.05),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">Active campus Schedulers</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wider uppercase">School Activities Planner</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Stay coordinated with examinations tables, physical excursions, match sports leagues, and regional public holidays.
          </p>
        </div>
      </section>

      {/* Filters & Scheduler List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        
        {/* Category Filters Switches */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-6">
          {(['all', 'academic', 'holiday', 'sports', 'arts', 'excursion'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Dynamic List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl max-w-lg mx-auto space-y-4">
            <div className="p-3.5 bg-slate-950 text-slate-500 rounded-2xl w-fit mx-auto border border-slate-850">
              <Inbox className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wide">No Schedules Logged</h4>
            <p className="text-xs text-slate-400">There are currently no events registered in the "{selectedFilter}" category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredEvents.map((ev) => {
              const eventDate = new Date(ev.date + 'T00:00:00');
              const dayStr = eventDate.getDate();
              const monthStr = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
              
              const typeColorMap = {
                academic: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                holiday: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                sports: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                arts: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
                excursion: 'bg-sky-500/10 text-sky-450 border-sky-500/20'
              };

              return (
                <div key={ev.id} className="bg-slate-900 rounded-3xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between p-6 space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {/* Date Badge */}
                      <div className="flex items-center gap-3">
                        <div className="bg-sky-500 text-slate-950 font-serif font-bold text-sm tracking-tight w-12 h-12 rounded-2xl flex flex-col justify-center items-center shrink-0">
                          <span className="leading-none text-base font-black text-slate-950">{dayStr}</span>
                          <span className="text-[8px] font-sans font-black tracking-widest uppercase mt-0.5 text-slate-950">{monthStr}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-[10.5px] text-slate-200 uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3 text-sky-400" /> {ev.time || 'All Day'}
                          </h4>
                          <span className="text-[10px] text-slate-400 block mt-1 flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-sky-400" /> {ev.location}
                          </span>
                        </div>
                      </div>

                      {/* Event Type Badge */}
                      <span className={`text-[8px] uppercase font-black tracking-widest px-2.5 py-1 rounded border ${typeColorMap[ev.type] || 'bg-slate-950 text-slate-400'}`}>
                        {ev.type}
                      </span>
                    </div>

                    <h5 className="font-serif font-bold text-white tracking-wide text-sm uppercase leading-snug">{ev.title}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {ev.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-950 pt-4 flex items-center justify-between text-[10.5px] text-slate-500 font-extrabold uppercase font-mono">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-sky-400" /> Calendar Code
                    </span>
                    <span className="text-[10px]">{ev.date}</span>
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
