import React, { useState, useEffect } from 'react';
import { 
  X, 
  KeyRound, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/sound';
import { mockFetchSettings, mockSaveSettings } from '../utils/mockStore';

export default function ApiKeyModal({
  isOpen,
  onClose,
  onSaved,
}) {
  if (!isOpen) return null;

  const [provider, setProvider] = useState('gemini'); // 'gemini' | 'openai' | 'embedded'
  const [geminiKey, setGeminiKey] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    // Fetch current settings from backend (or fallback to mock settings)
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data.provider) setProvider(data.provider);
        if (data.geminiKeyMasked) setGeminiKey(data.geminiKeyMasked);
        if (data.openAiKeyMasked) setOpenAiKey(data.openAiKeyMasked);
      })
      .catch(() => {
        const fallback = mockFetchSettings();
        if (fallback.provider) setProvider(fallback.provider);
        if (fallback.geminiKeyMasked) setGeminiKey(fallback.geminiKeyMasked);
        if (fallback.openAiKeyMasked) setOpenAiKey(fallback.openAiKeyMasked);
      });
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    playTactileClick();

    try {
      const payload = { provider };
      if (!geminiKey.includes('...')) payload.geminiApiKey = geminiKey;
      if (!openAiKey.includes('...')) payload.openAiApiKey = openAiKey;

      let saved = false;
      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) saved = true;
      } catch (e) {
        // Fallback for static hosting
      }

      if (!saved) {
        mockSaveSettings(payload);
      }

      playSuccessChime();
      onSaved?.(provider);
      setStatusMessage({ type: 'success', text: 'API configuration saved successfully!' });
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1200);
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error saving settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyEnvSnippet = () => {
    const snippet = `GEMINI_API_KEY=${geminiKey && !geminiKey.includes('...') ? geminiKey : 'your_key_here'}\nOPENAI_API_KEY=${openAiKey && !openAiKey.includes('...') ? openAiKey : 'your_key_here'}`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    playTactileClick();
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in font-googlesans">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl sm:rounded-4xl border border-[#D9D4CC] shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-[#ECE9E4] bg-[#FAF8F3]/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#14120F] text-[#FAF8F3] shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#14120F]">AI Model & API Keys</h2>
              <p className="text-xs text-[#72685B] mt-0.5">
                Connect your real AI provider or use the built-in executive engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-[#948B7E] hover:text-[#14120F] hover:bg-[#F3EDE0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Provider Selection Tabs */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#14120F] uppercase tracking-wider block">
              Choose AI Intelligence Provider
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'gemini', label: 'Google Gemini', sub: 'Gemini 1.5 Pro' },
                { id: 'openai', label: 'OpenAI', sub: 'GPT-4o' },
                { id: 'embedded', label: 'Offline Engine', sub: 'No API Key Needed' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    playTactileClick();
                    setProvider(p.id);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    provider === p.id
                      ? 'border-[#14120F] bg-[#14120F] text-white shadow-sm'
                      : 'border-[#D9D4CC] bg-[#FAF8F3] text-[#14120F] hover:border-[#948B7E]'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold">{p.label}</div>
                  <div className={`text-[11px] mt-0.5 ${provider === p.id ? 'text-white/80' : 'text-[#72685B]'}`}>
                    {p.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Key Input Section */}
          {provider === 'gemini' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14120F]">
                  Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#554C41] hover:text-[#14120F] flex items-center gap-1 underline"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Paste your AIzaSy... key here"
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[#FAF8F3] border border-[#D9D4CC] text-sm text-[#14120F] placeholder-[#948B7E] outline-none focus:border-[#14120F] transition-all font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 p-1.5 text-[#948B7E] hover:text-[#14120F]"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#72685B]">
                Powers executive triage reasoning, draft responses, and natural language copilot.
              </p>
            </div>
          )}

          {provider === 'openai' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14120F]">
                  OpenAI API Key
                </label>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#554C41] hover:text-[#14120F] flex items-center gap-1 underline"
                >
                  <span>Get Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  placeholder="Paste your sk-... key here"
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[#FAF8F3] border border-[#D9D4CC] text-sm text-[#14120F] placeholder-[#948B7E] outline-none focus:border-[#14120F] transition-all font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 p-1.5 text-[#948B7E] hover:text-[#14120F]"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#72685B]">
                Uses GPT-4o to analyze context and write executive correspondence.
              </p>
            </div>
          )}

          {provider === 'embedded' && (
            <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#D9D4CC] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-[#28221B] leading-relaxed">
                <strong className="block font-bold text-[#14120F] mb-0.5">Embedded Autonomous Engine Active</strong>
                Cadence uses local executive heuristic classification rules, instant draft generation, and contextual parsing with zero external API dependencies.
              </div>
            </div>
          )}

          {/* Alternative: .env Configuration Note */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#ECE9E4] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#14120F]">Alternative: Configure via backend/.env</span>
              <button
                onClick={handleCopyEnvSnippet}
                className="flex items-center gap-1 text-[#72685B] hover:text-[#14120F] cursor-pointer"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'Copied' : 'Copy format'}</span>
              </button>
            </div>
            <div className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-[#D9D4CC] text-[#554C41]">
              GEMINI_API_KEY=your_key_here<br />
              OPENAI_API_KEY=your_key_here
            </div>
          </div>

          {/* Status Alert */}
          {statusMessage && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 sm:p-8 border-t border-[#ECE9E4] bg-[#FAF8F3]/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white border border-[#D9D4CC] text-xs font-semibold text-[#72685B] hover:text-[#14120F] cursor-pointer shadow-subtle"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-7 py-3 rounded-full btn-dark text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm active-press"
          >
            <Sparkles className="w-4 h-4 text-[#F5EEDB]" />
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
