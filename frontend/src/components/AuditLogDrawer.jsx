import React from 'react';
import { Activity, X, Tag, Sparkles, RefreshCw } from 'lucide-react';

export default function AuditLogDrawer({
  isOpen,
  onClose,
  logs = []
}) {
  if (!isOpen) return null;

  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'AI_CLASSIFICATION':
      case 'LIVE_SIMULATION':
        return <Sparkles className="w-3.5 h-3.5 text-sage-600" />;
      case 'CLASSIFICATION_OVERRIDE':
        return <Tag className="w-3.5 h-3.5 text-amber-600" />;
      case 'ACCOUNT_CONNECTED':
      case 'MAILBOX_SYNC':
        return <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-bark-400" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white border-l border-bark-100 shadow-elevated flex flex-col animate-slide-up">
      <div className="p-4 border-b border-bark-100 bg-cream-50/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sage-600" />
          <div>
            <h3 className="text-xs font-semibold text-bark-900 tracking-wide uppercase font-mono">
              Activity & AI Audit Log
            </h3>
            <p className="text-[10px] text-bark-400 font-mono">Traceability for all classification events</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-bark-400 hover:text-bark-700 hover:bg-cream-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-xs text-bark-400">
            No activity logs recorded yet.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-cream-50/70 border border-bark-100 space-y-1 text-xs shadow-pill"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-bark-500">
                  {getLogIcon(log.type)}
                  <span className="font-semibold">{log.type}</span>
                </div>
                <span className="text-[10px] font-mono text-bark-400">
                  {formatTime(log.timestamp)}
                </span>
              </div>
              <p className="text-bark-700 leading-relaxed font-sans">
                {log.details}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
