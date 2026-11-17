import React from 'react';
import { 
  Search, 
  Star, 
  Calendar, 
  CheckCircle2, 
  FileEdit,
  X,
  Filter
} from 'lucide-react';
import { playTactileClick } from '../utils/sound';

export default function EmailList({
  emails = [],
  activeEmailId,
  onSelectEmail,
  activeSegment,
  setActiveSegment,
  searchQuery,
  setSearchQuery,
  unreadOnly,
  setUnreadOnly,
  onToggleImportant,
  onToggleUnread,
  onArchiveEmail,
  onClassifyEmail,
  stats
}) {
  const formatRelativeTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  const getClassificationBadge = (classification) => {
    switch (classification) {
      case 'Client to Reply':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-950 border border-amber-200/80">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>Needs Client Decision</span>
          </span>
        );
      case 'Assistant to Reply':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3EDE0] text-[#14120F] border border-[#D9D4CC]">
            <span className="w-2 h-2 rounded-full bg-[#14120F]" />
            <span>Assistant Reply</span>
          </span>
        );
      case 'Review Needed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-950 border border-orange-200/80">
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            <span>Review Flagged</span>
          </span>
        );
      case 'No Reply Needed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F3] text-[#72685B] border border-[#ECE9E4]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>FYI Handled</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl sm:rounded-4xl border border-[#D9D4CC] overflow-hidden shadow-card font-googlesans">
      
      {/* Search & Filter Header (Clean, Spacious, Larger Typography) */}
      <div className="p-6 border-b border-[#ECE9E4] bg-[#FAF8F3]/70 flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#948B7E] absolute left-4.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages, senders, topics..."
            className="w-full pl-12 pr-10 py-3 rounded-full bg-white border border-[#D9D4CC] focus:border-[#14120F] text-sm sm:text-base text-[#14120F] placeholder-[#948B7E] outline-none transition-all shadow-subtle font-googlesans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 text-[#948B7E] hover:text-[#14120F] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Unread Toggle */}
        <button
          onClick={() => {
            playTactileClick();
            setUnreadOnly(!unreadOnly);
          }}
          className={`px-4 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
            unreadOnly
              ? 'btn-dark'
              : 'bg-white border border-[#D9D4CC] text-[#72685B] hover:text-[#14120F]'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Unread</span>
        </button>
      </div>

      {/* Email Stream: Larger Typography, Generous Breathing Room, Uncluttered */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#ECE9E4]">
        {emails.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center h-80 text-[#948B7E] space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F3] border border-[#D9D4CC] flex items-center justify-center text-[#554C41] mb-2">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-lg font-bold text-[#14120F]">Queue Clear</p>
            <p className="text-sm text-[#72685B] max-w-xs leading-relaxed">
              No threads found matching the active criteria.
            </p>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = activeEmailId === email.id;

            return (
              <div
                key={email.id}
                onClick={() => {
                  playTactileClick();
                  onSelectEmail(email.id);
                }}
                className={`p-6 sm:p-7 transition-all duration-150 cursor-pointer relative group space-y-3 ${
                  isSelected
                    ? 'bg-[#F3EDE0]/85 border-l-4 border-l-[#14120F]'
                    : 'hover:bg-[#FAF8F3] border-l-4 border-l-transparent'
                }`}
              >
                {/* Row 1: Sender & Timestamp */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={email.sender.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                      alt={email.sender.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#D9D4CC] shadow-subtle"
                    />
                    <div className="flex items-center gap-2 truncate">
                      <span className={`text-base truncate ${email.isUnread ? 'font-bold text-[#14120F]' : 'font-semibold text-[#28221B]'}`}>
                        {email.sender.name}
                      </span>
                      {email.isImportant && (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                      {email.isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#14120F] shrink-0" />
                      )}
                    </div>
                  </div>

                  <span className="text-xs sm:text-sm text-[#72685B] shrink-0">
                    {formatRelativeTime(email.receivedAt)}
                  </span>
                </div>

                {/* Row 2: Subject Line (Larger, High-Contrast) */}
                <h4 className={`text-base sm:text-[17px] line-clamp-1 leading-snug tracking-tight ${
                  email.isUnread ? 'font-bold text-[#14120F]' : 'font-semibold text-[#28221B]'
                }`}>
                  {email.subject}
                </h4>

                {/* Row 3: Preview Snippet (Larger Font, Relaxed Leading) */}
                <p className="text-sm sm:text-[15px] text-[#554C41] line-clamp-2 leading-relaxed">
                  {email.summary || (email.messages[0]?.body?.slice(0, 140) + '...')}
                </p>

                {/* Row 4: Single Clean Custody Status (No Clutter) */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#ECE9E4]/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getClassificationBadge(email.classification)}

                    {email.preparedDraft?.hasDraft && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-950 border border-emerald-200/80">
                        <FileEdit className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Draft Ready</span>
                      </span>
                    )}

                    {email.meetingDetails?.extracted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F3] text-[#554C41] border border-[#D9D4CC]">
                        <Calendar className="w-3.5 h-3.5 text-[#554C41]" />
                        <span>Meeting</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
