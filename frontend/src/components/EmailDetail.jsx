import React, { useState } from 'react';
import { 
  Star, 
  Archive, 
  Mail, 
  MailOpen, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Tag, 
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { playTactileClick, playSuccessChime, playDelegateSwoosh } from '../utils/sound';

export default function EmailDetail({
  email,
  onCloseMobile,
  onToggleImportant,
  onToggleUnread,
  onArchiveEmail,
  onClassifyEmail,
  onGenerateDraft,
  onSendReply,
  onDelegateToAssistant,
  onApproveDraft,
  onMarkHandled
}) {
  if (!email) {
    return (
      <div className="h-full rounded-3xl sm:rounded-4xl border border-[#D9D4CC] bg-white p-12 sm:p-20 flex flex-col items-center justify-center text-center text-[#948B7E] shadow-card font-googlesans">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F3] border border-[#D9D4CC] flex items-center justify-center text-[#554C41] mb-5 shadow-subtle">
          <Mail className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-[#14120F] mb-2 font-googlesans">Select a Conversation</h3>
        <p className="text-sm text-[#72685B] max-w-sm leading-relaxed font-googlesans">
          Choose an incoming thread to review executive triage, correspondence, and prepared responses.
        </p>
      </div>
    );
  }

  const [selectedTone, setSelectedTone] = useState(email.preparedDraft?.tone || 'Executive & Decisive');
  const [draftBody, setDraftBody] = useState(email.preparedDraft?.body || '');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [actionItems, setActionItems] = useState(email.actionItems || []);
  const [showOverrideMenu, setShowOverrideMenu] = useState(false);
  const [showEarlierMessages, setShowEarlierMessages] = useState(false);
  const [showRefinePrompt, setShowRefinePrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  React.useEffect(() => {
    setDraftBody(email.preparedDraft?.body || '');
    setActionItems(email.actionItems || []);
    setSelectedTone(email.preparedDraft?.tone || 'Executive & Decisive');
    setShowEarlierMessages(false);
  }, [email.id, email.preparedDraft]);

  const handleToggleAction = (actId) => {
    playTactileClick();
    setActionItems(prev => prev.map(a => a.id === actId ? { ...a, done: !a.done } : a));
  };

  const handleGenerateNewDraft = async (tone) => {
    setSelectedTone(tone);
    setIsGeneratingDraft(true);
    playTactileClick();
    try {
      const res = await onGenerateDraft(email.id, { tone, customInstructions: customPrompt });
      if (res?.draft?.body) {
        setDraftBody(res.draft.body);
      }
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleCopyDraft = () => {
    if (!draftBody) return;
    navigator.clipboard.writeText(draftBody);
    setCopiedDraft(true);
    playTactileClick();
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleSendDraft = () => {
    playSuccessChime();
    onSendReply(email.id, { body: draftBody, subject: email.subject });
  };

  const formatFullDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  const latestMessage = email.messages && email.messages.length > 0
    ? email.messages[email.messages.length - 1]
    : { body: 'No message body.', senderName: email.sender.name, sentAt: email.receivedAt };

  const earlierMessages = email.messages && email.messages.length > 1
    ? email.messages.slice(0, email.messages.length - 1)
    : [];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl sm:rounded-4xl border border-[#D9D4CC] overflow-hidden shadow-card font-googlesans">
      
      {/* Top Header: Clean, Spacious, Functional */}
      <div className="px-8 py-6 border-b border-[#ECE9E4] bg-[#FAF8F3]/70 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-full text-[#72685B] hover:text-[#14120F] hover:bg-[#F3EDE0] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Custody Indicator */}
          <div className="relative">
            <button
              onClick={() => setShowOverrideMenu(!showOverrideMenu)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#D9D4CC] hover:border-[#72685B] text-xs font-semibold text-[#14120F] shadow-subtle transition-all cursor-pointer font-googlesans"
            >
              <Tag className="w-3.5 h-3.5 text-[#554C41]" />
              <span>Custody:</span>
              <strong className="text-[#14120F]">{email.classification}</strong>
            </button>

            {showOverrideMenu && (
              <div 
                className="absolute left-0 mt-3 w-68 rounded-2xl bg-white border border-[#D9D4CC] shadow-elevated p-2 z-40 animate-fade-in font-googlesans"
                onMouseLeave={() => setShowOverrideMenu(false)}
              >
                <button
                  onClick={() => {
                    playTactileClick();
                    onClassifyEmail(email.id, 'Assistant to Reply');
                    setShowOverrideMenu(false);
                  }}
                  className="w-full text-left p-3 rounded-xl text-xs text-[#14120F] hover:bg-[#FAF8F3] flex items-center gap-2.5 font-googlesans"
                >
                  <ShieldCheck className="w-4 h-4 text-[#554C41]" />
                  <span>Assistant to Reply</span>
                </button>
                <button
                  onClick={() => {
                    playTactileClick();
                    onClassifyEmail(email.id, 'Client to Reply');
                    setShowOverrideMenu(false);
                  }}
                  className="w-full text-left p-3 rounded-xl text-xs text-amber-900 hover:bg-amber-50 flex items-center gap-2.5 font-googlesans mt-0.5"
                >
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <span>Client to Reply</span>
                </button>
                <button
                  onClick={() => {
                    playTactileClick();
                    onClassifyEmail(email.id, 'No Reply Needed');
                    setShowOverrideMenu(false);
                  }}
                  className="w-full text-left p-3 rounded-xl text-xs text-[#72685B] hover:bg-[#FAF8F3] flex items-center gap-2.5 font-googlesans mt-0.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No Reply Needed</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTactileClick();
              onToggleImportant(email.id);
            }}
            className="p-2.5 rounded-full bg-white border border-[#D9D4CC] hover:border-amber-400 text-[#72685B] hover:text-amber-500 shadow-subtle transition-colors cursor-pointer"
            title="Star"
          >
            <Star className={`w-4 h-4 ${email.isImportant ? 'text-amber-500 fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => {
              playTactileClick();
              onToggleUnread(email.id);
            }}
            className="p-2.5 rounded-full bg-white border border-[#D9D4CC] hover:border-[#72685B] text-[#72685B] hover:text-[#14120F] shadow-subtle transition-colors cursor-pointer"
            title="Mark unread"
          >
            {email.isUnread ? <Mail className="w-4 h-4 text-[#14120F]" /> : <MailOpen className="w-4 h-4 text-[#72685B]" />}
          </button>

          <button
            onClick={() => {
              playDelegateSwoosh();
              onArchiveEmail(email.id);
            }}
            className="p-2.5 rounded-full bg-white border border-[#D9D4CC] hover:border-[#72685B] text-[#72685B] hover:text-[#14120F] shadow-subtle transition-colors cursor-pointer"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reading & Action Canvas */}
      <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-8 font-googlesans">
        
        {/* Subject & Sender Header */}
        <div className="space-y-4 pb-6 border-b border-[#ECE9E4]">
          <h2 className="text-xl sm:text-2xl font-bold text-[#14120F] tracking-tight leading-snug">
            {email.subject}
          </h2>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={email.sender.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt={email.sender.name}
                className="w-11 h-11 rounded-full object-cover shrink-0 border border-[#D9D4CC] shadow-subtle"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#14120F]">{email.sender.name}</span>
                  <span className="text-xs text-[#72685B]">&lt;{email.sender.email}&gt;</span>
                </div>
                <div className="text-xs text-[#72685B] mt-0.5">
                  {email.sender.role} &bull; to <span className="text-[#14120F] font-medium">{email.recipients?.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-[#72685B] whitespace-nowrap">
                {formatFullDate(email.receivedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Clean, Non-intrusive AI Brief Banner (Streamlined, No Clutter) */}
        <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#D9D4CC] space-y-3 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#554C41]" />
              <span className="text-xs font-bold text-[#14120F] uppercase tracking-wider">
                Autonomous Executive Summary
              </span>
            </div>
            <span className="text-xs text-[#72685B]">
              AI Confidence: <strong className="text-[#14120F]">{Math.round((email.confidence || 0.95) * 100)}%</strong>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#28221B] leading-relaxed">
            {email.summary || email.aiRationale}
          </p>

          {email.whyClientAttentionNeeded && (
            <div className="pt-2 border-t border-[#ECE9E4] flex items-center gap-2 text-xs text-amber-950 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{email.whyClientAttentionNeeded}</span>
            </div>
          )}

          {/* Action items inline chips if any */}
          {actionItems.length > 0 && (
            <div className="pt-2 border-t border-[#ECE9E4] flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[#72685B] font-semibold">Action items:</span>
              {actionItems.map(act => (
                <button
                  key={act.id}
                  onClick={() => handleToggleAction(act.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                    act.done ? 'bg-white line-through text-[#948B7E] border border-[#ECE9E4]' : 'bg-white text-[#14120F] border border-[#D9D4CC] font-medium'
                  }`}
                >
                  <Check className={`w-3 h-3 ${act.done ? 'text-emerald-600' : 'text-[#948B7E]'}`} />
                  <span>{act.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Meeting chip if any */}
          {email.meetingDetails?.extracted && (
            <div className="pt-2 border-t border-[#ECE9E4] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#554C41]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{email.meetingDetails.proposedTimes?.join(' or ') || email.meetingDetails.eventDate || 'Meeting itinerary extracted'}</span>
              </div>
              <button
                onClick={() => {
                  playSuccessChime();
                  alert(`Synchronized with calendar: "${email.subject}"`);
                }}
                className="px-3 py-1 rounded-full bg-white border border-[#D9D4CC] hover:border-[#14120F] text-[#14120F] font-semibold text-xs transition-colors cursor-pointer"
              >
                Sync Calendar
              </button>
            </div>
          )}
        </div>

        {/* Collapsible Earlier Messages (Eliminates the giant message wall) */}
        {earlierMessages.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setShowEarlierMessages(!showEarlierMessages)}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#D9D4CC] hover:border-[#72685B] bg-[#FAF8F3]/50 text-xs font-semibold text-[#72685B] hover:text-[#14120F] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{showEarlierMessages ? 'Hide earlier messages' : `Show ${earlierMessages.length} earlier message${earlierMessages.length > 1 ? 's' : ''} in thread`}</span>
              {showEarlierMessages ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showEarlierMessages && (
              <div className="space-y-4 animate-fade-in pl-4 border-l-2 border-[#ECE9E4]">
                {earlierMessages.map((msg, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-[#FAF8F3]/80 border border-[#ECE9E4] space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-[#72685B]">
                      <span className="font-bold text-[#14120F]">{msg.senderName}</span>
                      <span>{formatFullDate(msg.sentAt)}</span>
                    </div>
                    <div className="text-sm sm:text-base text-[#28221B] whitespace-pre-wrap leading-relaxed">
                      {msg.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Latest Active Message: Clean, Direct Reading (Increased font size by 20%) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs text-[#72685B] font-medium pb-2 border-b border-[#ECE9E4]">
            <span className="font-bold text-[#14120F]">Latest Message from {latestMessage.senderName}</span>
            <span>{formatFullDate(latestMessage.sentAt)}</span>
          </div>
          <div className="text-base sm:text-lg lg:text-[19px] text-[#14120F] whitespace-pre-wrap leading-relaxed font-googlesans py-2">
            {latestMessage.body}
          </div>
        </div>

        {/* Native Smart Reply Card (Compact, Directly at Hand) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F3] border border-[#D9D4CC] shadow-card space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#14120F]">
                Prepared Response
              </span>
              <span className="text-xs text-[#72685B]">&bull; {selectedTone}</span>
            </div>

            {/* Tone Selector Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                'Executive & Decisive',
                'Warm & Professional',
                'Polite Decline'
              ].map((tone) => (
                <button
                  key={tone}
                  onClick={() => handleGenerateNewDraft(tone)}
                  disabled={isGeneratingDraft}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedTone === tone
                      ? 'btn-dark shadow-sm'
                      : 'bg-white border border-[#D9D4CC] text-[#72685B] hover:text-[#14120F]'
                  }`}
                >
                  {tone}
                </button>
              ))}
              <button
                onClick={() => setShowRefinePrompt(!showRefinePrompt)}
                className="text-xs text-[#72685B] hover:text-[#14120F] underline ml-1 cursor-pointer"
              >
                {showRefinePrompt ? 'Close prompt' : 'Custom directive'}
              </button>
            </div>
          </div>

          {/* Custom prompt if open */}
          {showRefinePrompt && (
            <div className="flex items-center gap-2 animate-fade-in">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Give AI custom guidance (e.g. 'Ask for presentation deck first')..."
                className="flex-1 px-4 py-2.5 rounded-full bg-white border border-[#D9D4CC] text-xs text-[#14120F] outline-none focus:border-[#14120F] font-googlesans"
              />
              <button
                onClick={() => handleGenerateNewDraft(selectedTone)}
                disabled={isGeneratingDraft}
                className="px-5 py-2.5 rounded-full bg-[#14120F] text-white text-xs font-semibold cursor-pointer active-press"
              >
                {isGeneratingDraft ? 'Regenerating...' : 'Apply'}
              </button>
            </div>
          )}

          {/* Draft Body Textarea (Increased by 20%) */}
          <div className="relative">
            <textarea
              rows={6}
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              className="w-full p-5 rounded-2xl bg-white border border-[#D9D4CC] focus:border-[#72685B] text-sm sm:text-base lg:text-[17px] text-[#14120F] leading-relaxed outline-none resize-none shadow-subtle font-googlesans"
            />
            <button
              onClick={handleCopyDraft}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF8F3] hover:bg-[#F3EDE0] text-[#72685B] hover:text-[#14120F] transition-colors shadow-subtle cursor-pointer"
              title="Copy response"
            >
              {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
            <span className="text-xs text-[#72685B]">
              Ready for executive dispatch
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playTactileClick();
                  onClassifyEmail(email.id, 'Client to Reply');
                  alert('Thread dispatched to Client VIP Portal for review.');
                }}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF8F3] border border-[#D9D4CC] text-[#14120F] text-xs font-semibold flex items-center gap-2 active-press transition-colors shadow-subtle cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Forward to Principal</span>
              </button>

              <button
                onClick={handleSendDraft}
                className="px-6 py-2.5 rounded-full btn-dark text-xs font-semibold flex items-center gap-2 active-press transition-colors shadow-subtle cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reply</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
