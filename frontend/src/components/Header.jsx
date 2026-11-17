import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Layers,
  CheckCircle2, 
  Menu, 
  X,
  Plus,
  KeyRound
} from 'lucide-react';
import { playTactileClick } from '../utils/sound';

export default function Header({
  viewMode,
  setViewMode,
  clients = [],
  selectedClientId,
  setSelectedClientId,
  accounts = [],
  onOpenConnectModal,
  onOpenApiKeyModal,
  isSyncing,
  clientAttentionCount = 0
}) {
  const [showClientMenu, setShowClientMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectedClient = clients.find(c => c.id === selectedClientId) || null;
  const isOverHero = viewMode === 'assistant' && !isScrolled;

  return (
    <header className={`fixed top-4 sm:top-6 inset-x-4 sm:inset-x-8 lg:inset-x-14 xl:inset-x-20 z-50 rounded-full transition-all duration-300 ${
      isOverHero ? 'glass-floating-dark text-[#FAF8F3]' : 'glass-floating-light text-[#14120F]'
    }`}>
      <div className="w-full px-5 sm:px-8 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-6 sm:gap-10">
          <button 
            onClick={() => setViewMode('assistant')} 
            className="flex items-center gap-3 group text-left transition-opacity hover:opacity-85 cursor-pointer"
          >
            <span className={`font-poster font-black text-2xl sm:text-3xl tracking-tighter uppercase ${
              isOverHero ? 'text-[#FAF8F3]' : 'text-[#14120F]'
            }`}>
              cadence
            </span>
            <span className={`text-xs font-googlesans uppercase tracking-widest px-3 py-0.5 rounded-full ${
              isOverHero 
                ? 'bg-white/10 text-[#E5D7B7] border border-white/20' 
                : 'bg-[#F3EDE0] text-[#72685B] border border-[#D9D4CC]'
            }`}>
              executive
            </span>
          </button>

          {/* Navigation Pills */}
          <nav className={`hidden md:flex items-center gap-1.5 p-1.5 rounded-full ${
            isOverHero
              ? 'bg-black/35 backdrop-blur-md border border-white/15'
              : 'bg-[#14120F]/[0.05] border border-[#14120F]/[0.08]'
          }`}>
            <button
              onClick={() => { playTactileClick(); setViewMode('assistant'); }}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-googlesans transition-all cursor-pointer ${
                viewMode === 'assistant'
                  ? 'bg-white text-[#14120F] shadow-sm font-bold'
                  : isOverHero 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-[#72685B] hover:text-[#14120F] hover:bg-white/50'
              }`}
            >
              Assistant Workspace
            </button>
            <button
              onClick={() => { playTactileClick(); setViewMode('client'); }}
              className={`relative px-5 py-2 rounded-full text-xs sm:text-sm font-googlesans transition-all flex items-center gap-2.5 cursor-pointer ${
                viewMode === 'client'
                  ? 'bg-white text-[#14120F] shadow-sm font-bold'
                  : isOverHero 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-[#72685B] hover:text-[#14120F] hover:bg-white/50'
              }`}
            >
              <span>Client Portal</span>
              {clientAttentionCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-googlesans font-bold ${
                  isOverHero ? 'bg-white text-[#14120F]' : 'bg-[#14120F] text-white'
                }`}>
                  {clientAttentionCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Center: Client Portfolio Switcher */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setShowClientMenu(!showClientMenu)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all active-press cursor-pointer ${
              isOverHero
                ? 'bg-white/10 hover:bg-white/20 text-[#FAF8F3] border border-white/20 shadow-subtle'
                : 'bg-white/80 hover:bg-white text-[#14120F] border border-[#D9D4CC] shadow-subtle'
            }`}
          >
            {selectedClient?.avatar ? (
              <img src={selectedClient.avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0 border border-white/20" />
            ) : (
              <Layers className={`w-4 h-4 ${isOverHero ? 'text-white/70' : 'text-[#948B7E]'}`} />
            )}
            <span className="font-googlesans font-bold">
              {selectedClient ? selectedClient.name : 'All Client Accounts'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 ${isOverHero ? 'text-white/70' : 'text-[#948B7E]'}`} />
          </button>

          {showClientMenu && (
            <div 
              className="absolute top-full mt-3 w-80 rounded-3xl glass-dropdown p-3 z-50 animate-fade-in text-[#14120F]"
              onMouseLeave={() => setShowClientMenu(false)}
            >
              <div className="px-4 py-2 text-xs uppercase tracking-wider text-[#948B7E] border-b border-[#14120F]/[0.08] mb-2 font-googlesans">
                Managed Executive Portfolios
              </div>
              <button
                onClick={() => { setSelectedClientId('all'); setShowClientMenu(false); playTactileClick(); }}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                  selectedClientId === 'all' ? 'bg-[#FAF8F3] text-[#14120F] font-bold' : 'text-[#72685B] hover:bg-[#FAF8F3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[#554C41]" />
                  <span className="font-googlesans">Consolidated Inboxes</span>
                </div>
                {selectedClientId === 'all' && <CheckCircle2 className="w-4 h-4 text-[#14120F]" />}
              </button>

              {clients.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedClientId(c.id); setShowClientMenu(false); playTactileClick(); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-between transition-colors mt-1 cursor-pointer ${
                    selectedClientId === c.id ? 'bg-[#FAF8F3] text-[#14120F] font-bold' : 'text-[#72685B] hover:bg-[#FAF8F3]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#D9D4CC]" />
                    <div>
                      <div className="font-googlesans font-bold text-[#14120F]">{c.name}</div>
                      <div className="text-xs text-[#948B7E] font-googlesans">{c.company}</div>
                    </div>
                  </div>
                  {selectedClientId === c.id && <CheckCircle2 className="w-4 h-4 text-[#14120F]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Clean, Essential Actions */}
        <div className="flex items-center gap-4">
          
          {/* Subtle Sync Status */}
          <div className={`hidden sm:flex items-center gap-2 text-xs font-googlesans pr-1 ${
            isOverHero ? 'text-[#C7D0BC]' : 'text-[#72685B]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isSyncing ? 'Syncing...' : 'Connected'}</span>
          </div>

          {/* AI Settings / API Key Button */}
          <button
            onClick={() => { playTactileClick(); onOpenApiKeyModal?.(); }}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-googlesans font-semibold transition-all flex items-center gap-2 active-press cursor-pointer shadow-sm ${
              isOverHero
                ? 'bg-white/15 hover:bg-white/25 text-[#FAF8F3] border border-white/25'
                : 'bg-white hover:bg-[#FAF8F3] text-[#14120F] border border-[#D9D4CC]'
            }`}
            title="Configure AI Provider & API Keys"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">API Key</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => { playTactileClick(); onOpenConnectModal(); }}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-googlesans font-bold transition-all flex items-center gap-2 active-press cursor-pointer shadow-sm ${
              isOverHero
                ? 'bg-white hover:bg-[#F3EDE0] text-[#14120F]'
                : 'btn-dark text-[#FAF8F3]'
            }`}
          >
            <span>Connect</span>
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-full ${
              isOverHero 
                ? 'bg-white/10 text-white border border-white/20' 
                : 'bg-white text-[#28221B] border border-[#D9D4CC]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#14120F]/[0.08] glass-dropdown px-6 py-5 flex flex-col gap-3 animate-fade-in font-googlesans text-[#14120F] rounded-b-3xl">
          <button
            onClick={() => { setViewMode('assistant'); setMobileMenuOpen(false); }}
            className={`px-5 py-3 rounded-2xl text-sm text-left ${viewMode === 'assistant' ? 'bg-[#FAF8F3] font-bold text-[#14120F]' : 'text-[#72685B]'}`}
          >
            Assistant Workspace
          </button>
          <button
            onClick={() => { setViewMode('client'); setMobileMenuOpen(false); }}
            className={`px-5 py-3 rounded-2xl text-sm text-left flex items-center justify-between ${viewMode === 'client' ? 'bg-[#FAF8F3] font-bold text-[#14120F]' : 'text-[#72685B]'}`}
          >
            <span>Client Portal</span>
            {clientAttentionCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-[#14120F] text-white font-googlesans">{clientAttentionCount}</span>
            )}
          </button>
          <button
            onClick={() => { onOpenApiKeyModal?.(); setMobileMenuOpen(false); }}
            className="px-5 py-3 rounded-2xl text-sm text-left flex items-center gap-2.5 text-[#14120F] hover:bg-[#FAF8F3]"
          >
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>AI Settings & API Keys</span>
          </button>
        </div>
      )}
    </header>
  );
}
