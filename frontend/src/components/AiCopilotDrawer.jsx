import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/sound';

export default function AiCopilotDrawer({
  isOpen,
  onClose,
  activeEmailId,
  onSelectEmail,
  onFilterSegment,
  onSwitchPerspective,
  queryAi
}) {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your Executive AI Copilot. Ask me anything about your inboxes, pending client decisions, or draft replies.",
      suggestedActions: []
    }
  ]);

  const presetQueries = [
    "Show me emails that need my attention",
    "Which emails require the client's attention?",
    "What am I waiting for a response on?",
    "Summarize this conversation",
    "Why has this email been assigned to the client?",
    "Draft a reply to this conversation"
  ];

  const handleSend = async (queryText) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    playTactileClick();
    const userMsg = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await queryAi({ query: q, activeEmailId });
      playSuccessChime();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          matchedEmails: res.matchedEmails,
          suggestedActions: res.suggestedActions
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I had trouble evaluating that query. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    playTactileClick();
    if (action.action === 'filter_assistant') {
      onFilterSegment('assistant_reply');
    } else if (action.action === 'filter_waiting') {
      onFilterSegment('waiting_response');
    } else if (action.action === 'switch_client_view') {
      onSwitchPerspective('client');
    } else if (action.emailId) {
      onSelectEmail(action.emailId);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-bark-100 shadow-elevated flex flex-col animate-slide-up">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-bark-100 bg-cream-50/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 shadow-pill">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-bark-900 tracking-wide uppercase font-mono">
              Cadence Copilot
            </h3>
            <p className="text-[10px] text-bark-400 font-mono">Autonomous Natural Language Assistant</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-bark-400 hover:text-bark-700 hover:bg-cream-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Chips */}
      <div className="p-4 border-b border-bark-100 bg-cream-50/30">
        <div className="text-[10px] font-mono uppercase tracking-wider text-bark-400 mb-2.5">
          Suggested Prompts
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {presetQueries.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pq)}
              disabled={loading}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white border border-bark-200 hover:border-sage-400 text-bark-700 hover:text-bark-900 transition-all text-left shadow-pill active-press"
            >
              {pq}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`space-y-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
              m.role === 'user'
                ? 'bg-sage-100 text-bark-900 border border-sage-200 shadow-pill'
                : 'bg-cream-50 text-bark-800 border border-bark-100 shadow-pill'
            }`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>

            {/* Matched Emails Cards */}
            {m.matchedEmails && m.matchedEmails.length > 0 && (
              <div className="space-y-1.5 pt-1 text-left">
                {m.matchedEmails.map(em => (
                  <div
                    key={em.id}
                    onClick={() => {
                      playTactileClick();
                      onSelectEmail(em.id);
                    }}
                    className="p-2.5 rounded-xl bg-white border border-bark-200 hover:border-sage-400 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-pill"
                  >
                    <div className="truncate mr-2">
                      <div className="font-semibold text-bark-900 truncate">{em.subject}</div>
                      <div className="text-[10px] text-bark-400 font-mono">
                        {em.sender.name} &bull; {em.classification}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* Suggested Action Buttons */}
            {m.suggestedActions && m.suggestedActions.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-left">
                {m.suggestedActions.map((act, actIdx) => (
                  <button
                    key={actIdx}
                    onClick={() => handleActionClick(act)}
                    className="px-3 py-1 rounded-full bg-white border border-sage-300 text-[11px] font-medium text-sage-800 hover:bg-sage-50 transition-all flex items-center gap-1 active-press shadow-pill"
                  >
                    <span>{act.label}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-bark-400">
            <Sparkles className="w-4 h-4 animate-spin text-sage-600" />
            <span>Analyzing inbox and executive directives...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-bark-100 bg-cream-50/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about inboxes, summaries, or drafts..."
            className="flex-1 px-3.5 py-2 rounded-full bg-white border border-bark-200 text-xs text-bark-900 placeholder-bark-400 outline-none focus:border-sage-500 shadow-pill"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-full btn-dark disabled:opacity-40 transition-colors shadow-pill"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
