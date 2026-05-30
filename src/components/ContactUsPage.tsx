import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export default function ContactUsPage() {
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('Portal Login Credentials');
  const [ticketCategory, setTicketCategory] = useState('Credentials Setup');
  const [ticketMessage, setTicketMessage] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState<{ id: string; name: string } | null>(null);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketMessage) return;

    // Generate a unique support ID code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const assignedId = `NUA-ST-${randomCode}-2026`;

    setGeneratedTicket({
      id: assignedId,
      name: ticketName
    });

    // Reset Form
    setTicketName('');
    setTicketEmail('');
    setTicketMessage('');
  };

  return (
    <div className="animate-fade-in text-slate-350 space-y-12 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 text-center border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.05),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">Interact & Connect</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wider uppercase">Administrative Support</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Get in touch directly with our admissions registrars or open a secure technical support ticket for rapid response.
          </p>
        </div>
      </section>

      {/* Highlights info panels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* Card 1 */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-start gap-4">
          <div className="p-3 bg-slate-950 text-sky-400 rounded-2xl shrink-0 border border-slate-850">
            <Mail className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block font-mono">Primary Email Desk</span>
            <a href="mailto:omoleyemi82@gmail.com" className="font-serif font-bold text-sm text-white hover:underline truncate block">omoleyemi82@gmail.com</a>
            <span className="text-[10.5px] text-slate-400 block leading-relaxed leading-normal">Submit general inquiries or curriculum pathways questions.</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-start gap-4">
          <div className="p-3 bg-slate-950 text-sky-400 rounded-2xl shrink-0 border border-slate-850">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block font-mono">Physical Coordinates</span>
            <span className="font-serif font-bold text-sm text-white block">Off Ilawe Road, Ado-Ekiti, Ekiti State, Nigeria</span>
            <span className="text-[10.5px] text-slate-400 block leading-relaxed">Visits permitted specifically during school working hours by appointment.</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-start gap-4">
          <div className="p-3 bg-slate-950 text-sky-400 rounded-2xl shrink-0 border border-slate-850">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block font-mono">Active Registry Slot</span>
            <span className="font-serif font-bold text-sm text-white block">Mon - Fri: 8:00 AM - 4:00 PM</span>
            <span className="text-[10.5px] text-slate-400 block leading-relaxed">Closed on national exam breaks and seasonal calendar vacations.</span>
          </div>
        </div>

      </section>

      {/* Form Area */}
      <section className="py-16 bg-slate-950 border-t border-slate-900 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-10 space-y-8 shadow-xl">
            <div className="text-center space-y-2">
              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block font-mono">Support Ticketing</span>
              <h2 className="text-2xl font-serif font-black text-white uppercase tracking-wider">Log Help Desk Ticket</h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">Encountering problems with online student fees payment or portal logins? Create a support envelope.</p>
            </div>

            {generatedTicket ? (
              <div className="bg-slate-950 border border-slate-850 p-8 rounded-2xl text-center space-y-4 animate-fade-in text-slate-300">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-full w-fit mx-auto border border-sky-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h5 className="font-serif font-bold text-white text-base">Support Ticket Logged!</h5>
                <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-white">{generatedTicket.name}</span>. Your ticket has been logged inside our secure registrar database under reference:
                </p>
                <div className="bg-slate-900 py-2.5 px-4 rounded-xl border border-slate-800 inline-block font-mono font-black text-xs text-sky-400 tracking-widest">
                  {generatedTicket.id}
                </div>
                <p className="text-[10.5px] text-slate-500 leading-normal max-w-sm mx-auto">
                  A representative will look up your registered email address within 2 working hours.
                </p>
                <button
                  onClick={() => setGeneratedTicket(null)}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-xl cursor-pointer"
                >
                  Create New Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full text-xs px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-200 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="jane.doe@mail.com"
                      className="w-full text-xs px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-200 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Inquiry Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full text-xs px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-400 font-bold cursor-pointer"
                    >
                      <option value="Credentials Setup">Credentials Setup</option>
                      <option value="Tuition Fees Payment">Tuition Fees Payment</option>
                      <option value="Course Registrations">Course Registrations</option>
                      <option value="Gradebook Error">Gradebook Error</option>
                      <option value="Other Inquiries">Other Inquiries</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Priority Subject *</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Lost registration code"
                      className="w-full text-xs px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-200 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Inquiry Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide full details of technical errors or inquiry guides..."
                    className="w-full text-xs px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-sky-500 text-slate-200 transition-all font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 leading-none h-11"
                >
                  Create Secure Ticket <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </form>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}
