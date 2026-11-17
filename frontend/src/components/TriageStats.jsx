import React from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Inbox
} from 'lucide-react';
import { playTactileClick } from '../utils/sound';

export default function TriageStats({
  stats,
  activeSegment,
  setActiveSegment
}) {
  if (!stats) return null;

  const quickFilters = [
    { id: 'all', label: 'All Active', count: stats.total, icon: Inbox },
    { id: 'assistant_reply', label: 'Assistant to Reply', count: stats.assistantToReply, icon: ShieldAlert },
    { id: 'client_reply', label: 'Client Decision', count: stats.clientToReply, icon: UserCheck },
    { id: 'meetings', label: 'Calendar Locks', count: stats.meetingsCount, icon: Calendar },
    { id: 'no_reply', label: 'FYI & Handled', count: stats.noReplyNeeded, icon: CheckCircle2 }
  ];

  return (
    <div className="w-full flex items-center justify-between gap-4 flex-wrap pb-2 font-googlesans">
      {/* Sleek Minimalist Executive Metric Pills (Zero Fluff, Instant Filter) */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {quickFilters.map((item) => {
          const Icon = item.icon;
          const isActive = activeSegment === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                playTactileClick();
                setActiveSegment(item.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all active-press cursor-pointer ${
                isActive
                  ? 'btn-dark shadow-sm'
                  : 'bg-white hover:bg-[#FAF8F3] border border-[#D9D4CC] text-[#72685B] hover:text-[#14120F]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-[#FAF8F3] text-[#14120F]'
              }`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-[#72685B] hidden sm:block">
        Autonomous triage active &bull; Sovereign office custody
      </div>
    </div>
  );
}
