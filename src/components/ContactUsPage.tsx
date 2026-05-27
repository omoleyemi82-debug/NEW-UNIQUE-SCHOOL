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
    <div className="animate-fade-in text-natural-charcoal">
      {/* Banner */}
      <section className="bg-natural-green text-[#FDFBF7] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(198,138,83,0.1),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <span className="text-xs font-serif italic text-natural-clay uppercase font-bold tracking-widest block font-extrabold">Interact & Connect</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">Technical Support Desks & Contacts</h1>
          <p className="text-sm text-[#E9E5D9] max-w-xl mx-auto leading-relaxed">
            Get in touch directly with our admissions registrars or open a technical ticket for swift response.
          </p>
        </div>
      </section>

      {/* Highlights info panels */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-3xl border border-natural-beige shadow-xs flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-natural-green rounded-2xl shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-natural-charcoal/50 tracking-widest block">Primary Email Desk</span>
            <a href="mailto:omoleyemi82@gmail.com" className="font-serif font-bold text-sm text-natural-charcoal hover:underline mt-1 block">omoleyemi82@gmail.com</a>
            <span className="text-[10px] text-natural-charcoal/60 mt-1 block leading-relaxed">Submit enrollment queries or curriculum inquiries directly.</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-3xl border border-natural-beige shadow-xs flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-[#C29B38] rounded-2xl shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-natural-charcoal/50 tracking-widest block font-extrabold">Physical Campus Coordinates</span>
            <span className="font-serif font-bold text-sm text-natural-charcoal block mt-1">Behind Fabian Hotel Zone C</span>
            <span className="text-[10px] text-natural-charcoal/60 mt-0.5 block">Preston, Texas Sector 2</span>
            <span className="text-[10px] text-natural-charcoal/60 mt-1 block leading-relaxed">Visits permitted by appointment only on working slots.</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-3xl border border-natural-beige shadow-xs flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-natural-charcoal/50 tracking-widest block font-extrabold">Active Desk Hours</span>
            <span className="font-serif font-bold text-sm text-natural-charcoal block mt-1">Mon - Fri: 8:00 AM - 4:00 PM</span>
            <span className="text-[10px] text-natural-charcoal/60 mt-1 block leading-relaxed">Closed on national holidays and seasonal vacations.</span>
          </div>
        </div>

      </section>

      {/* Form Area */}
      <section className="py-16 bg-natural-light/20 border-t border-natural-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl border border-natural-beige shadow-sm p-6 sm:p-10 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-xs font-bold text-natural-green tracking-widest uppercase">Support Ticketing</h3>
              <h4 className="text-2xl font-serif font-bold text-natural-charcoal">Submit Help Desk Inquiry Ticket</h4>
              <p className="text-xs text-natural-charcoal/70">Encountering problems with online student fees payment or login credentials? Open a technical ticket.</p>
            </div>

            {generatedTicket ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4 animate-fade-in">
                <div className="p-3 bg-white text-emerald-600 rounded-full w-fit mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h5 className="font-serif font-extrabold text-natural-charcoal text-lg">Support Ticket Logged!</h5>
                <p className="text-xs text-natural-charcoal/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-natural-charcoal">{generatedTicket.name}</span>. Your ticket has been logged inside our secure administrator registry desk under priority ticket ID code:
                </p>
                <div className="bg-white py-2.5 px-4 rounded-xl border border-natural-beige inline-block font-mono font-black text-xs text-emerald-700 tracking-wider">
                  {generatedTicket.id}
                </div>
                <p className="text-[11px] text-natural-charcoal/60 leading-normal">
                  A representative will look up your registered email address within 2 hours. Keep a copy of your ticket code.
                </p>
                <button
                  onClick={() => setGeneratedTicket(null)}
                  className="px-5 py-2.5 bg-natural-green hover:bg-natural-green/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Create Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full text-xs px-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="jane.doe@mail.com"
                      className="w-full text-xs px-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Support Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full text-xs px-3 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium cursor-pointer"
                    >
                      <option value="Credentials Setup">Credentials Setup</option>
                      <option value="Tuition Fees Payment">Tuition Fees Payment</option>
                      <option value="Course Registrations">Course Registrations</option>
                      <option value="Gradebook Error">Gradebook Error</option>
                      <option value="Other Inquiries">Other Inquiries</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Priority Subject *</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Accessing result checker"
                      className="w-full text-xs px-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase text-natural-green/80 tracking-widest">Inquiry Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide detailed description of errors or inquiries..."
                    className="w-full text-xs px-4 py-3 bg-natural-light/40 border border-natural-beige rounded-xl outline-none focus:border-natural-green focus:bg-white transition-all text-natural-charcoal font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Confirm & Create Secure Ticket <ChevronRight className="w-4 h-4 text-[#C29B38]" />
                </button>
              </form>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}
