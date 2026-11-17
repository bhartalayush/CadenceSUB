import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  ChevronRight
} from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/sound';

export default function OnboardingModal({
  isOpen,
  onClose,
  accounts = [],
  onConnectAccount
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState('select_provider'); // 'select_provider' | 'oauth_auth' | 'syncing' | 'complete'
  const [selectedProvider, setSelectedProvider] = useState('google');
  const [customEmail, setCustomEmail] = useState('');
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatusText, setSyncStatusText] = useState('Initiating OAuth Handshake...');

  const handleStartOAuth = (provider) => {
    setSelectedProvider(provider);
    setCustomEmail(provider === 'google' ? 'executive.sarah@horizonai.com' : 'a.hayes@sterlingpartners.com');
    setStep('oauth_auth');
    playTactileClick();
  };

  const handleAuthorizeOAuth = async () => {
    setStep('syncing');
    setSyncProgress(15);
    setSyncStatusText('Exchanging OAuth2 authorization code for refresh tokens...');

    setTimeout(() => {
      setSyncProgress(45);
      setSyncStatusText('Retrieving message threads & metadata via Graph API...');
    }, 700);

    setTimeout(() => {
      setSyncProgress(80);
      setSyncStatusText('Running AI triage & classification models...');
    }, 1400);

    setTimeout(async () => {
      setSyncProgress(100);
      setSyncStatusText('Mailbox synchronized successfully!');
      playSuccessChime();
      await onConnectAccount({
        provider: selectedProvider,
        email: customEmail || (selectedProvider === 'google' ? 'executive.sarah@horizonai.com' : 'a.hayes@sterlingpartners.com'),
        clientName: 'Executive Account'
      });
      setStep('complete');
    }, 2100);
  };

  const handleFinish = () => {
    playTactileClick();
    onClose();
    setStep('select_provider');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bark-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white border border-bark-100 shadow-elevated overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-bark-400 hover:text-bark-700 hover:bg-cream-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step 1: Select Provider */}
        {step === 'select_provider' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-800 border border-sage-200">
                  Mailbox Connection
                </span>
              </div>
              <h2 className="text-xl font-display font-semibold text-bark-900 tracking-tight">
                Connect Executive Email Account
              </h2>
              <p className="text-xs text-bark-500 mt-1 leading-relaxed">
                Connect your client's email securely. Cadence AI monitors incoming threads in real-time, triaging responsibilities between assistant and client.
              </p>
            </div>

            {/* Provider Options */}
            <div className="space-y-3">
              <button
                onClick={() => handleStartOAuth('google')}
                className="w-full p-4 rounded-2xl bg-cream-50 hover:bg-cream-100 border border-bark-100 hover:border-sage-300 transition-all flex items-center justify-between group active-press text-left shadow-card"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-bark-100 flex items-center justify-center shadow-pill">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.57 0 2.98.54 4.09 1.6l3.07-3.07C17.29 1.8 14.82 1 12 1 7.42 1 3.51 3.61 1.66 7.42l3.77 2.92C6.32 7.43 8.92 5 12 5z"/>
                      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.72 2.89c2.18-2.01 3.7-4.97 3.7-8.71z"/>
                      <path fill="#FBBC05" d="M5.43 14.66c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.66 7.42C.6 9.53 0 11.9 0 14.4c0 2.5.6 4.87 1.66 6.98l3.77-2.92z"/>
                      <path fill="#34A853" d="M12 23c3.24 0 5.96-1.08 7.95-2.93l-3.72-2.89c-1.08.72-2.46 1.15-4.23 1.15-3.08 0-5.68-2.43-6.57-5.34L1.66 15.9C3.51 19.71 7.42 22.32 12 22.32z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-bark-900 group-hover:text-sage-700 transition-colors">
                      Google Workspace / Gmail
                    </h4>
                    <p className="text-xs text-bark-400">OAuth 2.0 with restricted read & send scopes</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-bark-400 group-hover:text-bark-900 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => handleStartOAuth('microsoft')}
                className="w-full p-4 rounded-2xl bg-cream-50 hover:bg-cream-100 border border-bark-100 hover:border-sage-300 transition-all flex items-center justify-between group active-press text-left shadow-card"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-bark-100 flex items-center justify-center shadow-pill">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                      <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                      <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-bark-900 group-hover:text-sage-700 transition-colors">
                      Microsoft 365 / Outlook
                    </h4>
                    <p className="text-xs text-bark-400">Microsoft Graph API for enterprise exchange</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-bark-400 group-hover:text-bark-900 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Currently Connected Accounts Summary */}
            <div className="pt-2 border-t border-bark-100">
              <div className="text-[11px] font-mono uppercase tracking-wider text-bark-400 mb-2">
                Connected Mailboxes ({accounts.length})
              </div>
              <div className="space-y-1.5">
                {accounts.map(acc => (
                  <div key={acc.id} className="p-2.5 rounded-xl bg-cream-50 border border-bark-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-bark-800 font-medium">{acc.email}</span>
                      <span className="text-[10px] text-bark-400 font-mono">({acc.providerName})</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 font-medium">Synced</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Simulated OAuth Consent Screen */}
        {step === 'oauth_auth' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sage-50 border border-sage-200 mx-auto flex items-center justify-center text-sage-600 shadow-pill">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-display font-semibold text-bark-900">
                Authorize Cadence AI
              </h2>
              <p className="text-xs text-bark-500">
                Cadence AI is requesting permission to access your {selectedProvider === 'google' ? 'Google Workspace' : 'Microsoft 365'} account:
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-cream-100 border border-bark-200 text-xs text-bark-800 font-mono">
                {customEmail}
              </div>
            </div>

            {/* Scopes breakdown */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-bark-100 space-y-2.5 text-xs">
              <div className="font-semibold text-bark-900">Requested Permissions:</div>
              <div className="flex items-start gap-2 text-bark-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Read, analyze, and categorize incoming email threads</span>
              </div>
              <div className="flex items-start gap-2 text-bark-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Synchronize calendar schedules and appointment invites</span>
              </div>
              <div className="flex items-start gap-2 text-bark-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Draft and send replies approved by executive or assistant</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('select_provider')}
                className="flex-1 py-2.5 rounded-full bg-cream-100 border border-bark-200 text-xs text-bark-600 hover:text-bark-900 shadow-pill"
              >
                Cancel
              </button>
              <button
                onClick={handleAuthorizeOAuth}
                className="flex-1 py-2.5 rounded-full btn-dark font-medium text-xs shadow-pill active-press"
              >
                Allow & Connect
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Mailbox Syncing Progress */}
        {step === 'syncing' && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-sage-50 border border-sage-200 flex items-center justify-center text-sage-600 mx-auto shadow-pill">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-display font-semibold text-bark-900 mb-1">
                Synchronizing Mailbox
              </h3>
              <p className="text-xs text-bark-400 font-mono">
                {syncStatusText}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden border border-bark-100">
              <div 
                className="bg-sage-600 h-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 'complete' && (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-pill">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-display font-semibold text-bark-900 mb-1">
                Account Successfully Linked
              </h3>
              <p className="text-xs text-bark-500 max-w-sm mx-auto leading-relaxed">
                The inbox is now live and synchronized. The AI engine is actively classifying incoming threads into Assistant, Client, and FYI queues.
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-full btn-dark font-medium text-xs shadow-pill active-press transition-all"
            >
              Enter Executive Inbox
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
