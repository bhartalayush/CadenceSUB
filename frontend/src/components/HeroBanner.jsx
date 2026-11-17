import React from 'react';
import { Play, ArrowDown } from 'lucide-react';
import { playTactileClick } from '../utils/sound';

export default function HeroBanner({
  viewMode,
  setViewMode,
  onSimulateEmail,
  stats
}) {
  const scrollToWorkspace = () => {
    const el = document.getElementById('operations-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between bg-[#0A0C09] text-[#FAF8F3] overflow-hidden font-googlesans">
      
      {/* Full-Screen Real Photography Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=2600&q=90"
          alt="Vintage Film Projector with Volumetric Light Beam"
          className="w-full h-full object-cover object-[75%_center] filter brightness-[0.70] contrast-[1.12]"
        />
        {/* Cinematic Scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C09]/95 via-[#0A0C09]/75 to-transparent w-full lg:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C09] via-transparent to-[#0A0C09]/50" />
      </div>

      {/* Top Spacer for Floating Navbar */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 pt-32 sm:pt-36 flex items-center justify-between text-xs sm:text-sm text-[#D8CFB9]/80 font-medium">
        <span>Autonomous Executive Inbox Custody</span>
        <span className="hidden sm:inline">Zero Response Backlog &bull; Continuous Triage</span>
      </div>

      {/* Center Stage: Monumental Poster Typography */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-8 lg:py-12 max-w-5xl space-y-7">
        
        {/* Constructivist Poster Title */}
        <h1 className="font-poster font-black text-5xl sm:text-7xl lg:text-8xl xl:text-9xl tracking-tighter uppercase leading-[0.92] text-[#FAF8F3]">
          CADENCE<br />
          <span className="text-[#F5EEDB]">TRIAGE</span><br />
          OPERATIONS<br />
          <span className="text-xl sm:text-3xl lg:text-4xl text-[#D8CFB9] tracking-normal block mt-3 font-normal capitalize">
            Since 2026
          </span>
        </h1>

        {/* Editorial Subtitle in Google Sans */}
        <p className="text-base sm:text-lg lg:text-xl text-[#C7D0BC] leading-relaxed max-w-xl font-normal">
          Autonomous intelligence determining reply custody: Assistant, Client Principal, or Zero Action required. Eliminating inbox chaos for high-stakes executive offices.
        </p>

        {/* Action Controls (Clean, Sleek, No Fluff) */}
        <div className="pt-2 flex items-center gap-3.5 sm:gap-5 flex-wrap">
          <button
            onClick={scrollToWorkspace}
            className="px-7 sm:px-9 py-3.5 rounded-full bg-white hover:bg-[#F3EDE0] text-[#14120F] text-sm font-bold shadow-card transition-all active-press flex items-center gap-2.5 cursor-pointer"
          >
            <span>Open Inbox Queue</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => { playTactileClick(); onSimulateEmail('client_vip'); }}
            className="px-6 sm:px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-[#FAF8F3] text-sm font-semibold shadow-card transition-all active-press flex items-center gap-2.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate VIP Inbound</span>
          </button>
        </div>

      </div>

      {/* Bottom Bar: Quiet, Sleek Navigation Prompt */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-8 flex items-center justify-between text-xs text-[#A8B29C] border-t border-white/10">
        <div className="flex items-center gap-6">
          <span>{stats?.total || 0} active matters</span>
          <span>&bull;</span>
          <span>{stats?.clientToReply || 0} principal decisions required</span>
        </div>

        <button
          onClick={scrollToWorkspace}
          className="flex items-center gap-2 text-[#FAF8F3] hover:text-white transition-colors cursor-pointer group"
        >
          <span>Scroll to triage workspace</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>

    </section>
  );
}
