import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import TriageStats from './components/TriageStats';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import ClientView from './components/ClientView';
import OnboardingModal from './components/OnboardingModal';
import ApiKeyModal from './components/ApiKeyModal';
import AiCopilotDrawer from './components/AiCopilotDrawer';
import CommandPalette from './components/CommandPalette';
import AuditLogDrawer from './components/AuditLogDrawer';
import { 
  fetchStatus, 
  fetchClients, 
  fetchAccounts, 
  fetchEmails, 
  fetchEmailById, 
  classifyEmail, 
  executeEmailAction, 
  generateSmartDraft, 
  sendEmailReply, 
  simulateIncomingEmail, 
  queryAiCopilot, 
  connectAccount, 
  syncMailboxes, 
  fetchAuditLogs 
} from './utils/api';
import { toggleSound, isSoundEnabled, playSuccessChime, playTactileClick, playDelegateSwoosh } from './utils/sound';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation & Perspective
  const [viewMode, setViewMode] = useState('assistant'); // 'assistant' | 'client'
  const [selectedClientId, setSelectedClientId] = useState('client-1');
  const [activeSegment, setActiveSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [activeEmailId, setActiveEmailId] = useState(null);

  // Data Store
  const [clients, setClients] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  // Modals & Drawers
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial Load
  useEffect(() => {
    loadAllData();
  }, [selectedClientId, activeSegment, searchQuery, unreadOnly]);

  const loadAllData = async () => {
    try {
      const [clientsRes, accountsRes, emailsRes, logsRes] = await Promise.all([
        fetchClients(),
        fetchAccounts(),
        fetchEmails({
          clientId: selectedClientId,
          segment: activeSegment,
          search: searchQuery,
          unreadOnly
        }),
        fetchAuditLogs()
      ]);

      setClients(clientsRes.clients || []);
      setAccounts(accountsRes.accounts || []);
      setEmails(emailsRes.emails || []);
      setStats(emailsRes.stats || null);
      setAuditLogs(logsRes.logs || []);

      // Set initial active email if none selected
      if (!activeEmailId && emailsRes.emails?.length > 0) {
        setActiveEmailId(emailsRes.emails[0].id);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleSelectEmail = (id) => {
    setActiveEmailId(id);
  };

  const handleClassifyEmail = async (id, newClassification) => {
    try {
      await classifyEmail(id, { classification: newClassification });
      showToast(`Reclassified: Assigned to "${newClassification}". AI updated preference model.`, 'success');
      loadAllData();
    } catch (err) {
      showToast('Failed to update classification.', 'error');
    }
  };

  const handleToggleImportant = async (id) => {
    try {
      await executeEmailAction(id, { action: 'toggle_important' });
      loadAllData();
    } catch (err) {}
  };

  const handleToggleUnread = async (id) => {
    try {
      await executeEmailAction(id, { action: 'toggle_unread' });
      loadAllData();
    } catch (err) {}
  };

  const handleArchiveEmail = async (id) => {
    try {
      await executeEmailAction(id, { action: 'archive' });
      showToast('Conversation archived.', 'info');
      loadAllData();
    } catch (err) {}
  };

  const handleGenerateDraft = async (id, params) => {
    try {
      const res = await generateSmartDraft(id, params);
      showToast('New AI draft reply generated.', 'success');
      loadAllData();
      return res;
    } catch (err) {
      showToast('Failed to generate draft.', 'error');
    }
  };

  const handleSendReply = async (id, { body, subject }) => {
    try {
      await sendEmailReply(id, { body, subject });
      showToast('Reply dispatched successfully! Thread marked resolved.', 'success');
      loadAllData();
    } catch (err) {
      showToast('Failed to send reply.', 'error');
    }
  };

  // Client Actions
  const handleDelegateToAssistant = async (id, note) => {
    try {
      await executeEmailAction(id, { action: 'delegate_to_assistant', note });
      showToast(`Delegated to assistant: "${note}"`, 'success');
      loadAllData();
    } catch (err) {}
  };

  const handleApproveDraft = async (id) => {
    try {
      await executeEmailAction(id, { action: 'approve_draft' });
      showToast('Approved! Executive reply dispatched automatically.', 'success');
      loadAllData();
    } catch (err) {}
  };

  const handleMarkHandled = async (id) => {
    try {
      await executeEmailAction(id, { action: 'mark_handled' });
      showToast('Marked as handled and archived.', 'success');
      loadAllData();
    } catch (err) {}
  };

  // Simulate Incoming Email
  const handleSimulateEmail = async (type) => {
    setIsSimulating(true);
    try {
      const res = await simulateIncomingEmail(type);
      playSuccessChime();
      showToast(`New email received from ${res.email.sender.name}: AI classified as "${res.email.classification}"`, 'success');
      await loadAllData();
      setActiveEmailId(res.email.id);
    } catch (err) {
      showToast('Failed to simulate email.', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  // Manual Sync
  const handleSyncMailboxes = async () => {
    setIsSyncing(true);
    try {
      await syncMailboxes();
      playSuccessChime();
      showToast('Bi-directional mailbox sync completed across all accounts.', 'success');
      await loadAllData();
    } catch (err) {
      showToast('Mailbox sync failed.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Account Connect
  const handleConnectAccount = async (accountData) => {
    try {
      await connectAccount(accountData);
      showToast(`Connected ${accountData.email} successfully!`, 'success');
      await loadAllData();
    } catch (err) {}
  };

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundActive(next);
  };

  const activeEmail = emails.find(e => e.id === activeEmailId) || emails[0] || null;
  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  return (
    <div className="min-h-screen bg-cream-100 text-bark-900 flex flex-col font-sans">
      
      {/* Top Application Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        clients={clients}
        selectedClientId={selectedClientId}
        setSelectedClientId={setSelectedClientId}
        accounts={accounts}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onSyncMailboxes={handleSyncMailboxes}
        isSyncing={isSyncing}
        onSimulateEmail={handleSimulateEmail}
        isSimulating={isSimulating}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        unreadCount={stats?.unread || 0}
        clientAttentionCount={stats?.clientToReply || 0}
      />

      {/* VIEW 1: ASSISTANT COMMAND CENTER */}
      {viewMode === 'assistant' && (
        <div className="w-full flex flex-col">
          {/* Full-Screen Edge-to-Edge Hero Stage */}
          <HeroBanner
            viewMode={viewMode}
            setViewMode={setViewMode}
            onSimulateEmail={handleSimulateEmail}
            stats={stats}
          />

          {/* Full-Width Operations Workspace */}
          <main id="operations-workspace" className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 py-12 sm:py-16 flex flex-col gap-10">
            {/* Custody Metrics Ribbon */}
            <TriageStats
              stats={stats}
              activeSegment={activeSegment}
              setActiveSegment={setActiveSegment}
            />

            {/* Split Inbox View: Left List (40%), Right Detail (60%) */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 min-h-[850px]">
              
              {/* Left Column: Email List */}
              <div className={`lg:col-span-5 h-[850px] ${activeEmailId && 'hidden lg:block'}`}>
                <EmailList
                  emails={emails}
                  activeEmailId={activeEmailId}
                  onSelectEmail={handleSelectEmail}
                  activeSegment={activeSegment}
                  setActiveSegment={setActiveSegment}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  unreadOnly={unreadOnly}
                  setUnreadOnly={setUnreadOnly}
                  onToggleImportant={handleToggleImportant}
                  onToggleUnread={handleToggleUnread}
                  onArchiveEmail={handleArchiveEmail}
                  onClassifyEmail={handleClassifyEmail}
                  stats={stats}
                />
              </div>

              {/* Right Column: Email Conversation & Detail View */}
              <div className={`lg:col-span-7 h-[850px] ${!activeEmailId && 'hidden lg:block'}`}>
                <EmailDetail
                  email={activeEmail}
                  onCloseMobile={() => setActiveEmailId(null)}
                  onToggleImportant={handleToggleImportant}
                  onToggleUnread={handleToggleUnread}
                  onArchiveEmail={handleArchiveEmail}
                  onClassifyEmail={handleClassifyEmail}
                  onGenerateDraft={handleGenerateDraft}
                  onSendReply={handleSendReply}
                  onDelegateToAssistant={handleDelegateToAssistant}
                  onApproveDraft={handleApproveDraft}
                  onMarkHandled={handleMarkHandled}
                />
              </div>

            </div>
          </main>
        </div>
      )}

      {/* VIEW 2: MINIMALISTIC CLIENT VIP PORTAL */}
      {viewMode === 'client' && (
        <main className="w-full flex-1">
          <ClientView
            client={currentClient}
            emails={emails}
            onDelegateToAssistant={handleDelegateToAssistant}
            onApproveDraft={handleApproveDraft}
            onMarkHandled={handleMarkHandled}
            onBackToAssistant={() => setViewMode('assistant')}
          />
        </main>
      )}

      {/* Floating Copilot Button */}
      <button
        onClick={() => {
          playTactileClick();
          setIsCopilotOpen(true);
        }}
        className="fixed bottom-8 right-8 z-30 flex items-center gap-3 px-6 py-3.5 rounded-full btn-dark font-cambria font-bold text-sm shadow-elevated active-press transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-[#F5EEDB]" />
        <span>Ask AI Copilot</span>
        <span className="hidden sm:inline text-xs font-cambria px-2.5 py-0.5 rounded-full bg-white/20 text-white">
          Cmd+K
        </span>
      </button>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 animate-slide-up flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-bark-200 text-xs text-bark-800 shadow-elevated">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <OnboardingModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        accounts={accounts}
        onConnectAccount={handleConnectAccount}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaved={(provider) => {
          showToast(`Active AI engine switched to ${provider.toUpperCase()}`, 'success');
        }}
      />

      <AiCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeEmailId={activeEmailId}
        onSelectEmail={(id) => {
          setActiveEmailId(id);
          setIsCopilotOpen(false);
        }}
        onFilterSegment={(seg) => {
          setActiveSegment(seg);
          setIsCopilotOpen(false);
        }}
        onSwitchPerspective={(persp) => {
          setViewMode(persp);
          setIsCopilotOpen(false);
        }}
        queryAi={queryAiCopilot}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setViewMode={setViewMode}
        setActiveSegment={setActiveSegment}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onSyncMailboxes={handleSyncMailboxes}
        onSimulateEmail={handleSimulateEmail}
        onToggleSound={handleToggleSound}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      <AuditLogDrawer
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
        logs={auditLogs}
      />

    </div>
  );
}
