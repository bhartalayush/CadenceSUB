import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldCheck, 
  UserCheck, 
  RefreshCw, 
  Sparkles, 
  PlusCircle, 
  Calendar, 
  Volume2
} from 'lucide-react';
import { playTactileClick } from '../utils/sound';

export default function CommandPalette({
  isOpen,
  onClose,
  setViewMode,
  setActiveSegment,
  onOpenConnectModal,
  onSyncMailboxes,
  onSimulateEmail,
  onToggleSound,
  onOpenCopilot
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'view_assistant',
      label: 'Switch to Assistant Command Center',
      category: 'Perspectives',
      icon: ShieldCheck,
      color: 'text-sage-600',
      action: () => { setViewMode('assistant'); onClose(); }
    },
    {
      id: 'view_client',
      label: 'Switch to Client VIP Portal',
      category: 'Perspectives',
      icon: UserCheck,
      color: 'text-amber-600',
      action: () => { setViewMode('client'); onClose(); }
    },
    {
      id: 'seg_client',
      label: 'Filter: Client Decisions Required',
      category: 'Triage Filters',
      icon: UserCheck,
      color: 'text-amber-600',
      action: () => { setActiveSegment('client_reply'); setViewMode('assistant'); onClose(); }
    },
    {
      id: 'seg_assistant',
      label: 'Filter: Assistant to Reply Queue',
      category: 'Triage Filters',
      icon: ShieldCheck,
      color: 'text-sage-600',
      action: () => { setActiveSegment('assistant_reply'); setViewMode('assistant'); onClose(); }
    },
    {
      id: 'seg_meetings',
      label: 'Filter: Extracted Meetings & Dates',
      category: 'Triage Filters',
      icon: Calendar,
      color: 'text-purple-600',
      action: () => { setActiveSegment('meetings'); setViewMode('assistant'); onClose(); }
    },
    {
      id: 'copilot',
      label: 'Open AI Copilot & Query Assistant',
      category: 'AI Assistant',
      icon: Sparkles,
      color: 'text-sage-600',
      action: () => { onOpenCopilot(); onClose(); }
    },
    {
      id: 'simulate_vip',
      label: 'Simulate Incoming VIP Email (Sequoia Series B)',
      category: 'Simulation',
      icon: Sparkles,
      color: 'text-amber-600',
      action: () => { onSimulateEmail('client_vip'); onClose(); }
    },
    {
      id: 'simulate_podcast',
      label: 'Simulate Scheduling Request (Lex Fridman Podcast)',
      category: 'Simulation',
      icon: Sparkles,
      color: 'text-sage-600',
      action: () => { onSimulateEmail('assistant_scheduling'); onClose(); }
    },
    {
      id: 'sync',
      label: 'Trigger Bi-directional Mailbox Sync',
      category: 'Accounts',
      icon: RefreshCw,
      color: 'text-emerald-600',
      action: () => { onSyncMailboxes(); onClose(); }
    },
    {
      id: 'connect',
      label: 'Connect New Gmail or Outlook Account',
      category: 'Accounts',
      icon: PlusCircle,
      color: 'text-bark-500',
      action: () => { onOpenConnectModal(); onClose(); }
    },
    {
      id: 'sound',
      label: 'Toggle Audio Feedback',
      category: 'Preferences',
      icon: Volume2,
      color: 'text-bark-500',
      action: () => { onToggleSound(); onClose(); }
    }
  ];

  const filtered = query.trim()
    ? actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()))
    : actions;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-bark-900/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-3xl bg-white border border-bark-100 shadow-elevated overflow-hidden p-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-2.5 px-3 py-2 border-b border-bark-100">
          <Search className="w-4 h-4 text-bark-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, switches, and shortcuts..."
            className="w-full bg-transparent text-sm text-bark-900 placeholder-bark-400 outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 rounded-full bg-cream-100 text-[10px] font-mono text-bark-500 border border-bark-200">
            ESC
          </kbd>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto py-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-bark-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playTactileClick();
                    item.action();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-2xl hover:bg-cream-100 flex items-center justify-between text-xs transition-colors group active-press"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-bark-800 group-hover:text-bark-900 font-medium transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-bark-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
