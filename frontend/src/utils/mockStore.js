import { seedClients, seedAccounts, initialEmails, simulationPool } from '../data/seedData.js';

// Local In-Memory Fallback State (when running purely static on GitHub Pages / Vercel / Netlify)
let localClients = [...seedClients];
let localAccounts = [...seedAccounts];
let localEmails = [...initialEmails];
let localAuditLogs = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: "AI_CLASSIFICATION",
    details: "Thread #101 automatically classified as 'Client to Reply' (98% confidence - M&A inquiry)"
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    type: "AI_CLASSIFICATION",
    details: "Thread #102 automatically classified as 'Assistant to Reply' (97% confidence - Speaker logistics)"
  }
];

let localSettings = {
  provider: localStorage.getItem('cadence_ai_provider') || 'embedded',
  geminiApiKey: localStorage.getItem('cadence_gemini_key') || '',
  openAiApiKey: localStorage.getItem('cadence_openai_key') || ''
};

export function calculateLocalStats(clientId = null) {
  const filtered = clientId && clientId !== 'all' 
    ? localEmails.filter(e => e.clientId === clientId && !e.isArchived)
    : localEmails.filter(e => !e.isArchived);

  return {
    total: filtered.length,
    unread: filtered.filter(e => e.isUnread).length,
    assistantToReply: filtered.filter(e => e.classification === 'Assistant to Reply' && e.status !== 'resolved').length,
    clientToReply: filtered.filter(e => e.classification === 'Client to Reply' && e.status !== 'resolved').length,
    noReplyNeeded: filtered.filter(e => e.classification === 'No Reply Needed').length,
    reviewNeeded: filtered.filter(e => e.classification === 'Review Needed').length,
    actionRequired: filtered.filter(e => e.status === 'needs_action' || e.status === 'pending_assistant').length,
    waitingForResponse: filtered.filter(e => e.waitingOn && e.waitingOn !== 'none').length,
    important: filtered.filter(e => e.isImportant).length,
    meetingsCount: filtered.filter(e => e.meetingDetails?.extracted).length
  };
}

export function mockFetchStatus() {
  return {
    status: 'online',
    version: '1.0.0',
    systemName: 'Cadence Executive AI Email Engine (Client-Side Mode)',
    uptime: 120,
    activeAccounts: localAccounts.filter(a => a.status === 'connected').length,
    aiProvider: localSettings.provider,
    hasApiKey: !!(localSettings.geminiApiKey || localSettings.openAiApiKey)
  };
}

export function mockFetchSettings() {
  return {
    provider: localSettings.provider,
    hasGeminiKey: !!localSettings.geminiApiKey,
    hasOpenAiKey: !!localSettings.openAiApiKey,
    geminiKeyMasked: localSettings.geminiApiKey ? `${localSettings.geminiApiKey.slice(0, 6)}...${localSettings.geminiApiKey.slice(-4)}` : '',
    openAiKeyMasked: localSettings.openAiApiKey ? `${localSettings.openAiApiKey.slice(0, 6)}...${localSettings.openAiApiKey.slice(-4)}` : '',
  };
}

export function mockSaveSettings({ provider, geminiApiKey, openAiApiKey }) {
  if (provider) {
    localSettings.provider = provider;
    localStorage.setItem('cadence_ai_provider', provider);
  }
  if (geminiApiKey !== undefined) {
    localSettings.geminiApiKey = geminiApiKey.trim();
    localStorage.setItem('cadence_gemini_key', localSettings.geminiApiKey);
  }
  if (openAiApiKey !== undefined) {
    localSettings.openAiApiKey = openAiApiKey.trim();
    localStorage.setItem('cadence_openai_key', localSettings.openAiApiKey);
  }

  localAuditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'SETTINGS_UPDATE',
    details: `AI Settings updated. Active Provider: '${localSettings.provider}', Has Key: ${!!(localSettings.geminiApiKey || localSettings.openAiApiKey)}`
  });

  return mockFetchSettings();
}

export function mockFetchClients() {
  const enriched = localClients.map(client => ({
    ...client,
    stats: calculateLocalStats(client.id)
  }));
  return { clients: enriched };
}

export function mockFetchAccounts() {
  return { accounts: localAccounts };
}

export function mockConnectAccount(accountData = {}) {
  const { provider, email, clientName } = accountData;
  const newAccount = {
    id: `acc-${Date.now()}`,
    provider: provider || 'google',
    providerName: provider === 'google' ? 'Google Workspace / Gmail' : 'Microsoft 365 / Outlook',
    email: email || `executive.${Date.now().toString().slice(-4)}@example.com`,
    clientId: 'client-1',
    clientName: clientName || 'Sarah Jenkins',
    status: 'connected',
    syncedAt: new Date().toISOString(),
    health: 'optimal',
    totalMessages: 450,
    syncedMessages: 450,
    oauthScopes: provider === 'google' ? ['mail.google.com', 'calendar.events'] : ['Mail.ReadWrite', 'Calendars.ReadWrite']
  };

  localAccounts.push(newAccount);
  localAuditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'ACCOUNT_CONNECTED',
    details: `Connected new ${newAccount.providerName} account for ${newAccount.email}`
  });

  return { success: true, account: newAccount };
}

export function mockSyncMailboxes() {
  const now = new Date().toISOString();
  localAccounts = localAccounts.map(acc => ({
    ...acc,
    syncedAt: now,
    health: 'optimal'
  }));

  localAuditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: now,
    type: 'MAILBOX_SYNC',
    details: 'Completed bi-directional synchronization across all connected accounts.'
  });

  return { success: true, syncedAt: now };
}

export function mockFetchEmails({ clientId, segment, search, unreadOnly } = {}) {
  let result = [...localEmails];

  if (clientId && clientId !== 'all') {
    result = result.filter(e => e.clientId === clientId);
  }

  if (segment) {
    switch (segment) {
      case 'assistant_reply':
        result = result.filter(e => e.classification === 'Assistant to Reply' && !e.isArchived);
        break;
      case 'client_reply':
        result = result.filter(e => e.classification === 'Client to Reply' && !e.isArchived);
        break;
      case 'no_reply':
        result = result.filter(e => e.classification === 'No Reply Needed');
        break;
      case 'review_needed':
        result = result.filter(e => e.classification === 'Review Needed' && !e.isArchived);
        break;
      case 'action_required':
        result = result.filter(e => (e.status === 'needs_action' || e.status === 'pending_assistant') && !e.isArchived);
        break;
      case 'waiting_response':
        result = result.filter(e => e.waitingOn && e.waitingOn !== 'none' && !e.isArchived);
        break;
      case 'meetings':
        result = result.filter(e => e.meetingDetails?.extracted && !e.isArchived);
        break;
      case 'important':
        result = result.filter(e => e.isImportant && !e.isArchived);
        break;
      case 'archived':
        result = result.filter(e => e.isArchived);
        break;
      case 'all':
      default:
        result = result.filter(e => !e.isArchived);
        break;
    }
  }

  if (unreadOnly) {
    result = result.filter(e => e.isUnread);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(e =>
      e.subject.toLowerCase().includes(q) ||
      e.sender.name.toLowerCase().includes(q) ||
      e.sender.email.toLowerCase().includes(q) ||
      (e.summary && e.summary.toLowerCase().includes(q)) ||
      (e.aiRationale && e.aiRationale.toLowerCase().includes(q))
    );
  }

  result.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
  const stats = calculateLocalStats(clientId);

  return {
    emails: result,
    stats,
    totalCount: result.length
  };
}

export function mockFetchEmailById(id) {
  const email = localEmails.find(e => e.id === id);
  if (!email) throw new Error('Thread not found');
  return { email };
}

export function mockClassifyEmail(id, { classification, reason }) {
  const index = localEmails.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Thread not found');

  const previous = localEmails[index].classification;
  localEmails[index].classification = classification;
  localEmails[index].confidence = 1.0;
  localEmails[index].aiRationale = reason || `Manually re-assigned by Assistant from '${previous}' to '${classification}'.`;

  if (classification === 'Client to Reply') {
    localEmails[index].waitingOn = 'client';
  } else if (classification === 'Assistant to Reply') {
    localEmails[index].waitingOn = 'assistant';
    localEmails[index].status = 'pending_assistant';
  } else if (classification === 'No Reply Needed') {
    localEmails[index].waitingOn = 'none';
  }

  localEmails[index].timeline.unshift({
    time: new Date().toISOString(),
    event: `Manual override: Classification changed to '${classification}'`
  });

  return { success: true, email: localEmails[index], previous, current: classification };
}

export function mockExecuteEmailAction(id, { action, note, tone }) {
  const index = localEmails.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Thread not found');

  const item = localEmails[index];
  const now = new Date().toISOString();

  switch (action) {
    case 'delegate_to_assistant':
      item.classification = 'Assistant to Reply';
      item.status = 'pending_assistant';
      item.waitingOn = 'assistant';
      item.delegationNote = note || 'Client requested assistant take over handling.';
      item.timeline.unshift({
        time: now,
        event: `Client delegated to Assistant: "${item.delegationNote}"`
      });
      break;

    case 'approve_draft':
      if (item.preparedDraft) {
        item.preparedDraft.status = 'approved_and_sent';
        item.status = 'resolved';
        item.waitingOn = 'none';
        item.isUnread = false;
        item.timeline.unshift({
          time: now,
          event: 'Client approved AI/Assistant draft. Email sent successfully.'
        });
        item.messages.push({
          id: `msg-${Date.now()}`,
          senderName: 'Sarah Jenkins (via Cadence Executive)',
          senderEmail: 'sarah.jenkins.ceo@gmail.com',
          sentAt: now,
          body: item.preparedDraft.body
        });
      }
      break;

    case 'mark_handled':
      item.status = 'resolved';
      item.waitingOn = 'none';
      item.isUnread = false;
      item.timeline.unshift({
        time: now,
        event: 'Marked as handled and resolved.'
      });
      break;

    case 'toggle_important':
      item.isImportant = !item.isImportant;
      break;

    case 'toggle_unread':
      item.isUnread = !item.isUnread;
      break;

    case 'archive':
      item.isArchived = true;
      break;

    case 'unarchive':
      item.isArchived = false;
      break;
  }

  return { success: true, email: item };
}

export function mockGenerateSmartDraft(id, { tone = 'Executive & Concise', customInstructions = '' }) {
  const item = localEmails.find(e => e.id === id);
  if (!item) throw new Error('Thread not found');

  const senderFirstName = item.sender.name.split(' ')[0] || 'there';
  let body = '';

  if (tone.includes('Executive') || tone.includes('Decisive')) {
    body = `${senderFirstName},\n\nThank you for the note. I have reviewed the details regarding ${item.subject}.\n\nWe are aligned to proceed under the discussed framework. My executive office will coordinate the formal documentation and calendar next steps.\n\nBest regards,\nSarah Jenkins\nCEO, Horizon AI`;
  } else if (tone.includes('Warm') || tone.includes('Professional')) {
    body = `Hi ${senderFirstName},\n\nThanks so much for reaching out! Great to hear from you.\n\nRegarding ${item.subject}, this sounds wonderful. I'd love to make this happen. My assistant will reach out directly to sync schedules and take care of the logistics.\n\nWarmly,\nSarah`;
  } else if (tone.includes('Decline') || tone.includes('Polite')) {
    body = `Dear ${senderFirstName},\n\nThank you for considering Horizon AI for ${item.subject}.\n\nWhile this is a compelling opportunity, our team is currently hyper-focused on our upcoming core platform release, so we are unable to participate at this time. Wishing you great success with the initiative.\n\nSincerely,\nSarah Jenkins`;
  } else {
    body = `Hi ${senderFirstName},\n\nFollowing up regarding ${item.subject}. Please let us know if the proposed terms are confirmed so we can finalize on our end.\n\nBest,\nExecutive Office`;
  }

  if (customInstructions) {
    body += `\n\n[Note: Adjusted for directive: "${customInstructions}"]`;
  }

  item.preparedDraft = {
    hasDraft: true,
    status: 'ready_for_review',
    suggestedBy: 'AI Copilot',
    tone,
    subject: item.subject.startsWith('Re:') ? item.subject : `Re: ${item.subject}`,
    body
  };

  item.timeline.unshift({
    time: new Date().toISOString(),
    event: `Generated new AI draft reply with tone: '${tone}'`
  });

  return { success: true, draft: item.preparedDraft };
}

export function mockSendEmailReply(id, { body, subject }) {
  const item = localEmails.find(e => e.id === id);
  if (!item) throw new Error('Thread not found');

  const now = new Date().toISOString();
  item.messages.push({
    id: `msg-${Date.now()}`,
    senderName: 'Antigravity Executive Office',
    senderEmail: 'sarah.jenkins.ceo@gmail.com',
    sentAt: now,
    body: body || (item.preparedDraft ? item.preparedDraft.body : 'Reply sent.')
  });

  item.status = 'resolved';
  item.waitingOn = 'none';
  if (item.preparedDraft) {
    item.preparedDraft.status = 'approved_and_sent';
  }

  item.timeline.unshift({
    time: now,
    event: 'Assistant sent reply to recipient. Thread marked resolved.'
  });

  return { success: true, email: item };
}

export function mockSimulateIncomingEmail(templateType = 'random') {
  let template;
  if (templateType === 'random') {
    template = simulationPool[Math.floor(Math.random() * simulationPool.length)];
  } else {
    template = simulationPool.find(t => t.type === templateType) || simulationPool[0];
  }

  const newId = `thread-sim-${Date.now()}`;
  const now = new Date().toISOString();

  const newEmail = {
    id: newId,
    clientId: 'client-1',
    subject: template.subject,
    sender: template.sender,
    recipients: ['sarah.jenkins.ceo@gmail.com'],
    receivedAt: now,
    classification: template.classification,
    confidence: template.confidence,
    priority: template.priority,
    isImportant: template.isImportant,
    isUnread: true,
    isArchived: false,
    status: template.classification === 'Client to Reply' ? 'needs_action' : (template.classification === 'Assistant to Reply' ? 'pending_assistant' : 'resolved'),
    waitingOn: template.classification === 'Client to Reply' ? 'client' : (template.classification === 'Assistant to Reply' ? 'assistant' : 'none'),
    category: template.classification === 'Client to Reply' ? 'VIP / Strategic' : (template.classification === 'Assistant to Reply' ? 'Scheduling' : 'Financial Statement'),
    aiRationale: template.aiRationale,
    summary: template.summary,
    whyClientAttentionNeeded: template.whyClientAttentionNeeded,
    actionItems: template.classification !== 'No Reply Needed' ? [
      { id: `act-${Date.now()}-1`, text: 'Review incoming details and execute next action', done: false, owner: template.classification === 'Client to Reply' ? 'client' : 'assistant' }
    ] : [],
    meetingDetails: template.suggestedDraft && template.suggestedDraft.includes('dinner') ? {
      extracted: true,
      proposedTimes: ['Thursday 7:30 PM'],
      location: 'Madera, Menlo Park'
    } : null,
    preparedDraft: template.suggestedDraft ? {
      hasDraft: true,
      status: 'ready_for_review',
      suggestedBy: 'AI Copilot Engine',
      tone: 'Executive & Decisive',
      subject: `Re: ${template.subject}`,
      body: template.suggestedDraft
    } : null,
    messages: [
      {
        id: `msg-${Date.now()}-1`,
        senderName: template.sender.name,
        senderEmail: template.sender.email,
        sentAt: now,
        body: template.body
      }
    ],
    timeline: [
      { time: now, event: `Live simulated arrival from ${template.sender.name}` },
      { time: now, event: `AI classified as '${template.classification}' (${Math.round(template.confidence * 100)}% confidence)` }
    ]
  };

  localEmails.unshift(newEmail);
  return { success: true, email: newEmail };
}

export function mockQueryAiCopilot(query, activeEmailId) {
  const q = (query || '').toLowerCase().trim();
  let answer = "";
  let matchedEmails = [];
  let suggestedActions = [];

  if (q.includes('need') && (q.includes('attention') || q.includes('my attention') || q.includes('assistant'))) {
    const list = localEmails.filter(e => e.classification === 'Assistant to Reply' && !e.isArchived && e.status !== 'resolved');
    matchedEmails = list;
    answer = `Found ${list.length} emails requiring the Assistant's active attention (scheduling coordinations, logistics, vendor follow-ups).`;
    suggestedActions = [
      { label: "Filter to Assistant Queue", action: "filter_assistant" },
      { label: "Review TechCrunch Keynote Deck", emailId: "thread-102" }
    ];
  } else if (q.includes('client') && (q.includes('attention') || q.includes('require') || q.includes('reply'))) {
    const list = localEmails.filter(e => e.classification === 'Client to Reply' && !e.isArchived && e.status !== 'resolved');
    matchedEmails = list;
    answer = `There are ${list.length} high-stakes conversations requiring the Client's personal attention:\n• Stripe Acquisition proposal\n• Q3 Board resolution & rescheduling\n• Series B Term Sheet sign-off`;
    suggestedActions = [
      { label: "Open Client VIP View", action: "switch_client_view" },
      { label: "View Stripe M&A Inquiry", emailId: "thread-101" }
    ];
  } else if (q.includes('waiting') || q.includes('pending')) {
    const waiting = localEmails.filter(e => e.waitingOn && e.waitingOn !== 'none' && !e.isArchived);
    matchedEmails = waiting;
    answer = `Tracking ${waiting.length} pending items:\n• ${waiting.filter(e => e.waitingOn === 'client').length} awaiting Client decisions\n• ${waiting.filter(e => e.waitingOn === 'assistant').length} awaiting Assistant response coordination`;
    suggestedActions = [{ label: "Show Pending Threads", action: "filter_waiting" }];
  } else if (q.includes('summarize') || q.includes('summary')) {
    const target = activeEmailId ? localEmails.find(e => e.id === activeEmailId) : localEmails[0];
    if (target) {
      matchedEmails = [target];
      answer = `Executive Summary for "${target.subject}":\n\n${target.summary}\n\n• Classification: ${target.classification} (${Math.round(target.confidence * 100)}% confidence)\n• Action Needed: ${target.whyClientAttentionNeeded || target.aiRationale}`;
    } else {
      answer = "Please select an email thread from the inbox to generate a conversation summary.";
    }
  } else {
    const matches = localEmails.filter(e => 
      e.subject.toLowerCase().includes(q) ||
      e.sender.name.toLowerCase().includes(q) ||
      (e.summary && e.summary.toLowerCase().includes(q))
    );
    matchedEmails = matches.slice(0, 3);
    answer = matches.length > 0
      ? `Found ${matches.length} conversations matching "${query}".`
      : `I reviewed your inbox for "${query}". No direct matches found. Try asking about pending client decisions or scheduling logistics.`;
  }

  return { query, answer, matchedEmails, suggestedActions };
}

export function mockFetchAuditLogs() {
  return { logs: localAuditLogs };
}
