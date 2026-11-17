import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ChevronRight, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTactileClick, playSuccessChime, playDelegateSwoosh } from '../utils/sound';

export default function ClientView({
  client,
  emails = [],
  onDelegateToAssistant,
  onApproveDraft,
  onMarkHandled,
  onBackToAssistant
}) {
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [delegatingId, setDelegatingId] = useState(null);
  const [delegationNote, setDelegationNote] = useState('');
  const [previewingDraftId, setPreviewingDraftId] = useState(null);

  const clientEmails = emails.filter(e => 
    e.classification === 'Client to Reply' && 
    !e.isArchived && 
    e.status !== 'resolved'
  );

  const handleDelegateSubmit = (emailId, presetText = null) => {
    const note = presetText || delegationNote || 'Client requested assistant take over handling.';
    playDelegateSwoosh();
    onDelegateToAssistant(emailId, note);
    setDelegatingId(null);
    setDelegationNote('');
  };

  const handleApprove = (emailId) => {
    playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 }
    });
    onApproveDraft(emailId);
    setPreviewingDraftId(null);
  };

  const handleHandled = (emailId) => {
    playSuccessChime();
    onMarkHandled(emailId);
  };

  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="w-full px-6 sm:px-12 lg:px-20 py-16 space-y-14 animate-fade-in font-googlesans">
      
      {/* Executive Welcome Header: Full Width, Dignified, Uncluttered */}
      <div className="border-b border-[#D9D4CC] pb-12 flex items-start justify-between gap-8 flex-wrap">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-3.5">
            <span className="text-xs font-googlesans uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#F3EDE0] text-[#14120F] border border-[#D9D4CC] font-bold">
              VIP Briefing Mode
            </span>
            <span className="text-sm font-googlesans text-[#72685B]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-googlesans font-bold text-[#14120F] tracking-tight leading-tight">
            Executive Briefing &bull; {client?.name?.split(' ')[0] || 'Executive'}
          </h1>
          <p className="text-lg text-[#554C41] leading-relaxed font-googlesans">
            {clientEmails.length === 0
              ? 'Zero pending matters requiring your personal signature or direction. Your executive assistant maintains active custody.'
              : `You have ${clientEmails.length} high-priority matters requiring your personal decision or sign-off.`}
          </p>
        </div>

        <button
          onClick={() => {
            playTactileClick();
            onBackToAssistant();
          }}
          className="flex items-center gap-3 px-7 py-3.5 rounded-full btn-outline text-sm font-googlesans font-bold shadow-subtle active-press cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#554C41]" />
          <span>Return to Assistant Workspace</span>
        </button>
      </div>

      {/* Zero State */}
      {clientEmails.length === 0 ? (
        <div className="p-20 sm:p-28 rounded-3xl sm:rounded-4xl bg-white border border-[#D9D4CC] text-center flex flex-col items-center justify-center space-y-5 shadow-card">
          <div className="w-20 h-20 rounded-full bg-[#FAF8F3] border border-[#D9D4CC] flex items-center justify-center text-[#554C41] mb-2 shadow-subtle">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-googlesans font-bold text-[#14120F]">All Decisions Clear</h3>
          <p className="text-base text-[#72685B] max-w-lg leading-relaxed font-googlesans">
            All strategic communications, board requests, and corporate investments are settled. Your executive office is managing the active stream.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {clientEmails.map((email) => {
            const isExpanded = expandedThreadId === email.id;
            const isDelegating = delegatingId === email.id;
            const isPreviewing = previewingDraftId === email.id;
            const hasDraft = email.preparedDraft?.hasDraft;

            return (
              <div
                key={email.id}
                className="rounded-3xl sm:rounded-4xl bg-white border border-[#D9D4CC] shadow-card overflow-hidden transition-all duration-300 hover:shadow-elevated"
              >
                {/* Executive Card Header: Wide, Airy, Decluttered */}
                <div className="p-8 sm:p-14 space-y-8">
                  
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={email.sender.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt={email.sender.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#D9D4CC] shadow-subtle"
                      />
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-googlesans font-bold text-[#14120F]">{email.sender.name}</h3>
                          <span className="text-xs uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-50 text-amber-950 border border-amber-200 font-bold">
                            Requires Your Decision
                          </span>
                        </div>
                        <p className="text-sm text-[#72685B] mt-1 font-googlesans">
                          {email.sender.role || email.sender.email} &bull; {formatTime(email.receivedAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playTactileClick();
                        setExpandedThreadId(isExpanded ? null : email.id);
                      }}
                      className="text-sm text-[#72685B] hover:text-[#14120F] flex items-center gap-2 font-googlesans transition-colors pt-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Thread' : 'Read Full Thread'}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Subject Line */}
                  <h2 className="text-2xl sm:text-4xl font-googlesans font-bold text-[#14120F] tracking-tight leading-snug">
                    {email.subject}
                  </h2>

                  {/* Executive Brief */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#FAF8F3] border border-[#ECE9E4] text-base sm:text-lg lg:text-[19px] text-[#28221B] leading-relaxed font-googlesans space-y-2">
                    <span className="font-bold text-[#14120F] block">Executive Summary:</span>
                    <p className="leading-relaxed">{email.summary}</p>
                  </div>

                  {/* Why Client Attention is Needed */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-amber-50/70 border border-amber-200 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-1" />
                    <div className="text-sm sm:text-base text-amber-950 font-googlesans">
                      <strong className="font-bold block text-amber-900 mb-1">Why Your Decision is Required:</strong>
                      <span className="leading-relaxed">{email.whyClientAttentionNeeded || email.aiRationale}</span>
                    </div>
                  </div>

                  {/* Action Bar for Executive (Dignified, No Neons) */}
                  <div className="pt-8 flex items-center justify-between gap-6 flex-wrap border-t border-[#ECE9E4]">
                    <div className="flex items-center gap-4 flex-wrap">
                      
                      {/* 1. Delegate to Assistant */}
                      <button
                        onClick={() => {
                          playTactileClick();
                          setDelegatingId(isDelegating ? null : email.id);
                        }}
                        className="px-7 py-3.5 rounded-full btn-outline text-sm font-googlesans font-bold text-[#14120F] flex items-center gap-2.5 active-press shadow-subtle cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#554C41]" />
                        <span>Delegate to Assistant</span>
                      </button>

                      {/* 2. Approve Prepared Draft */}
                      {hasDraft && (
                        <button
                          onClick={() => {
                            playTactileClick();
                            setPreviewingDraftId(isPreviewing ? null : email.id);
                          }}
                          className="px-7 py-3.5 rounded-full btn-dark text-sm font-googlesans font-bold flex items-center gap-2.5 active-press shadow-subtle cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-[#FAF8F3]" />
                          <span>Review & Approve Prepared Reply</span>
                        </button>
                      )}
                    </div>

                    {/* 3. Mark Handled */}
                    <button
                      onClick={() => handleHandled(email.id)}
                      className="px-7 py-3.5 rounded-full bg-[#F3EDE0] hover:bg-[#EAE1D0] border border-[#D9D4CC] text-sm font-googlesans font-bold text-[#14120F] flex items-center gap-2.5 active-press transition-colors shadow-subtle cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Matter Handled</span>
                    </button>
                  </div>

                  {/* Delegation Drawer */}
                  {isDelegating && (
                    <div className="mt-8 p-8 sm:p-10 rounded-3xl bg-[#FAF8F3] border border-[#D9D4CC] space-y-6 animate-fade-in shadow-card font-googlesans">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#14120F] flex items-center gap-2.5 font-googlesans uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-[#554C41]" />
                          <span>Delegate to Executive Office</span>
                        </span>
                        <button
                          onClick={() => setDelegatingId(null)}
                          className="text-[#948B7E] hover:text-[#14120F] p-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm text-[#72685B]">
                        Select a standard instruction or supply custom guidance for your assistant:
                      </p>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-3.5 flex-wrap">
                        {[
                          'Please politely decline',
                          'Schedule 30 mins next week',
                          'Request detailed presentation deck',
                          'Forward to corporate counsel'
                        ].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => handleDelegateSubmit(email.id, preset)}
                            className="px-6 py-3 rounded-full bg-white hover:bg-[#F3EDE0] border border-[#D9D4CC] text-sm text-[#14120F] active-press transition-colors shadow-subtle font-googlesans font-semibold cursor-pointer"
                          >
                            &ldquo;{preset}&rdquo;
                          </button>
                        ))}
                      </div>

                      {/* Custom note */}
                      <div className="flex items-center gap-4 pt-2">
                        <input
                          type="text"
                          value={delegationNote}
                          onChange={(e) => setDelegationNote(e.target.value)}
                          placeholder="Or type custom instructions for your assistant..."
                          className="flex-1 px-6 py-3.5 rounded-full bg-white border border-[#D9D4CC] text-sm text-[#14120F] placeholder-[#948B7E] outline-none focus:border-[#72685B] shadow-subtle font-googlesans"
                        />
                        <button
                          onClick={() => handleDelegateSubmit(email.id)}
                          className="px-8 py-3.5 rounded-full btn-dark font-googlesans font-bold text-sm active-press transition-colors shadow-subtle cursor-pointer"
                        >
                          Delegate
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Draft Inspection Drawer */}
                  {isPreviewing && hasDraft && (
                    <div className="mt-8 p-8 sm:p-10 rounded-3xl bg-[#FAF8F3] border border-[#D9D4CC] space-y-6 animate-fade-in shadow-card font-googlesans">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#14120F] flex items-center gap-2.5 font-googlesans uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-[#554C41]" />
                          <span>Prepared Executive Reply</span>
                        </span>
                        <button
                          onClick={() => setPreviewingDraftId(null)}
                          className="text-[#948B7E] hover:text-[#14120F] p-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#D9D4CC] text-sm sm:text-base text-[#14120F] whitespace-pre-wrap leading-relaxed shadow-subtle font-googlesans">
                        {email.preparedDraft.body}
                      </div>

                      <div className="flex items-center justify-between pt-3 flex-wrap gap-4">
                        <span className="text-sm text-[#72685B] font-googlesans">
                          Tone: <strong className="text-[#14120F] font-bold">{email.preparedDraft.tone}</strong>
                        </span>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setPreviewingDraftId(null)}
                            className="px-6 py-3 rounded-full bg-white border border-[#D9D4CC] text-sm text-[#72685B] hover:text-[#14120F] shadow-subtle font-googlesans cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleApprove(email.id)}
                            className="px-8 py-3.5 rounded-full btn-dark font-googlesans font-bold text-sm flex items-center gap-2.5 active-press shadow-subtle cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                            <span>1-Click Approve & Send</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Collapsible Thread Messages */}
                  {isExpanded && (
                    <div className="mt-8 pt-8 border-t border-[#ECE9E4] space-y-5 animate-fade-in font-googlesans">
                      <span className="text-xs uppercase tracking-wider text-[#72685B] font-bold">
                        Full Conversation Thread
                      </span>
                      {email.messages.map((m, idx) => (
                        <div key={idx} className="p-7 sm:p-8 rounded-3xl bg-[#FAF8F3] border border-[#ECE9E4] text-sm space-y-3">
                          <div className="flex items-center justify-between font-bold text-[#14120F]">
                            <span>{m.senderName}</span>
                            <span className="text-xs text-[#72685B]">{formatTime(m.sentAt)}</span>
                          </div>
                          <div className="text-base sm:text-lg text-[#28221B] whitespace-pre-wrap leading-relaxed font-googlesans">
                            {m.body}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
