import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { seedClients, seedAccounts, initialEmails, simulationPool } from './data/seedData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Storage & API Key Settings
let apiSettings = {
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  provider: process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? 'gemini' : process.env.OPENAI_API_KEY ? 'openai' : 'embedded')
};

let clients = [...seedClients];
let accounts = [...seedAccounts];
let emails = [...initialEmails];
let auditLogs = [
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

// Helper: Calculate Metrics
function calculateStats(clientId = null) {
  const filtered = clientId && clientId !== 'all' 
    ? emails.filter(e => e.clientId === clientId && !e.isArchived)
    : emails.filter(e => !e.isArchived);

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

// Routes

// 1. Health & Overview
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    systemName: 'Cadence Executive AI Email Engine',
    uptime: process.uptime(),
    activeAccounts: accounts.filter(a => a.status === 'connected').length,
    aiProvider: apiSettings.provider,
    hasApiKey: !!(apiSettings.geminiApiKey || apiSettings.openAiApiKey)
  });
});

// Settings: AI API Keys
app.get('/api/settings', (req, res) => {
  res.json({
    provider: apiSettings.provider,
    hasGeminiKey: !!apiSettings.geminiApiKey,
    hasOpenAiKey: !!apiSettings.openAiApiKey,
    geminiKeyMasked: apiSettings.geminiApiKey ? `${apiSettings.geminiApiKey.slice(0, 6)}...${apiSettings.geminiApiKey.slice(-4)}` : '',
    openAiKeyMasked: apiSettings.openAiApiKey ? `${apiSettings.openAiApiKey.slice(0, 6)}...${apiSettings.openAiApiKey.slice(-4)}` : '',
  });
});

app.post('/api/settings', (req, res) => {
  const { provider, geminiApiKey, openAiApiKey } = req.body;
  if (provider) apiSettings.provider = provider;
  if (geminiApiKey !== undefined) apiSettings.geminiApiKey = geminiApiKey.trim();
  if (openAiApiKey !== undefined) apiSettings.openAiApiKey = openAiApiKey.trim();

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'SETTINGS_UPDATE',
    details: `AI Settings updated. Active Provider: '${apiSettings.provider}', Has Key: ${!!(apiSettings.geminiApiKey || apiSettings.openAiApiKey)}`
  });

  res.json({
    success: true,
    provider: apiSettings.provider,
    hasGeminiKey: !!apiSettings.geminiApiKey,
    hasOpenAiKey: !!apiSettings.openAiApiKey,
  });
});

// 2. Clients
app.get('/api/clients', (req, res) => {
  const enriched = clients.map(client => {
    const stats = calculateStats(client.id);
    return {
      ...client,
      stats
    };
  });
  res.json({ clients: enriched });
});

// 3. Accounts
app.get('/api/accounts', (req, res) => {
  res.json({ accounts });
});

app.post('/api/accounts/connect', (req, res) => {
  const { provider, email, clientName } = req.body;
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

  accounts.push(newAccount);
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'ACCOUNT_CONNECTED',
    details: `Connected new ${newAccount.providerName} account for ${newAccount.email}`
  });

  res.json({ success: true, account: newAccount });
});

app.post('/api/accounts/sync', (req, res) => {
  const now = new Date().toISOString();
  accounts = accounts.map(acc => ({
    ...acc,
    syncedAt: now,
    health: 'optimal'
  }));

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: now,
    type: 'MAILBOX_SYNC',
    details: 'Completed bi-directional synchronization across all connected accounts.'
  });

  res.json({ success: true, syncedAt: now });
});

// 4. Emails List
app.get('/api/emails', (req, res) => {
  const { clientId, segment, search, unreadOnly } = req.query;

  let result = [...emails];

  // Client filter
  if (clientId && clientId !== 'all') {
    result = result.filter(e => e.clientId === clientId);
  }

  // Segment filter
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

  // Unread filter
  if (unreadOnly === 'true') {
    result = result.filter(e => e.isUnread);
  }

  // Text search
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

  // Sort: newest first
  result.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));

  const stats = calculateStats(clientId);

  res.json({
    emails: result,
    stats,
    totalCount: result.length
  });
});

// 5. Single Email Thread
app.get('/api/emails/:id', (req, res) => {
  const email = emails.find(e => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: 'Thread not found' });
  }
  res.json({ email });
});

// 6. Manual AI Classification Override
app.patch('/api/emails/:id/classify', (req, res) => {
  const { classification, reason } = req.body;
  const index = emails.findIndex(e => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  const previous = emails[index].classification;
  emails[index].classification = classification;
  emails[index].confidence = 1.0; // User confirmed
  emails[index].aiRationale = reason || `Manually re-assigned by Assistant from '${previous}' to '${classification}'. System updated user preference weights.`;
  
  if (classification === 'Client to Reply') {
    emails[index].waitingOn = 'client';
    emails[index].whyClientAttentionNeeded = emails[index].whyClientAttentionNeeded || 'Assistant requested personal executive review.';
  } else if (classification === 'Assistant to Reply') {
    emails[index].waitingOn = 'assistant';
    emails[index].status = 'pending_assistant';
  } else if (classification === 'No Reply Needed') {
    emails[index].waitingOn = 'none';
  }

  emails[index].timeline.unshift({
    time: new Date().toISOString(),
    event: `Manual override: Classification changed to '${classification}'`
  });

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'CLASSIFICATION_OVERRIDE',
    details: `Thread #${req.params.id} reclassified: ${previous} -> ${classification}`
  });

  res.json({ success: true, email: emails[index], previous, current: classification });
});

// 7. Client & Assistant Actions
app.post('/api/emails/:id/action', (req, res) => {
  const { action, note, tone } = req.body;
  const index = emails.findIndex(e => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  const item = emails[index];
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
          event: 'Client approved AI/Assistant draft. Email sent successfully to recipient.'
        });
        // Add sent message to messages thread
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
      item.timeline.unshift({
        time: now,
        event: 'Archived from active view.'
      });
      break;

    case 'unarchive':
      item.isArchived = false;
      break;

    default:
      return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  res.json({ success: true, email: item });
});

// 8. Generate Smart Draft
app.post('/api/emails/:id/draft', (req, res) => {
  const { tone = 'Executive & Concise', customInstructions = '' } = req.body;
  const item = emails.find(e => e.id === req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  let body = '';
  const senderFirstName = item.sender.name.split(' ')[0] || 'there';

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

  res.json({ success: true, draft: item.preparedDraft });
});

// 9. Send Draft
app.post('/api/emails/:id/send', (req, res) => {
  const { body, subject } = req.body;
  const item = emails.find(e => e.id === req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Thread not found' });
  }

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

  res.json({ success: true, email: item });
});

// 10. Simulate Live Incoming Email
app.post('/api/emails/simulate', (req, res) => {
  const { templateType = 'random' } = req.body;

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

  emails.unshift(newEmail);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: now,
    type: 'LIVE_SIMULATION',
    details: `Simulated incoming message '${newEmail.subject}' classified as '${newEmail.classification}'`
  });

  res.json({ success: true, email: newEmail });
});

// 11. AI Copilot Natural Language Query
app.post('/api/ai/query', (req, res) => {
  const { query, activeEmailId } = req.body;
  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const q = query.toLowerCase().trim();
  let answer = "";
  let matchedEmails = [];
  let suggestedActions = [];

  // Match: "Show me emails that need my attention" / "need attention"
  if (q.includes('need') && (q.includes('attention') || q.includes('my attention') || q.includes('assistant'))) {
    const list = emails.filter(e => e.classification === 'Assistant to Reply' && !e.isArchived && e.status !== 'resolved');
    matchedEmails = list;
    answer = `Found ${list.length} emails requiring the Assistant's active attention. These involve scheduling coordinations, logistics, and vendor follow-ups.`;
    suggestedActions = [
      { label: "Filter to Assistant Queue", action: "filter_assistant" },
      { label: "Review TechCrunch Keynote Deck", emailId: "thread-102" }
    ];
  }
  // Match: "Which emails require the client's attention?" / "client attention"
  else if (q.includes('client') && (q.includes('attention') || q.includes('require') || q.includes('reply'))) {
    const list = emails.filter(e => e.classification === 'Client to Reply' && !e.isArchived && e.status !== 'resolved');
    matchedEmails = list;
    answer = `There are ${list.length} high-stakes conversations requiring the Client's personal attention:
• Stripe Acquisition proposal (High strategic impact)
• Q3 Board resolution & rescheduling (Arthur Pendelton)
• Series B Term Sheet sign-off (Victoria Chen)`;
    suggestedActions = [
      { label: "Open Client VIP View", action: "switch_client_view" },
      { label: "View Stripe M&A Inquiry", emailId: "thread-101" }
    ];
  }
  // Match: "What am I waiting for a response on?" / "waiting"
  else if (q.includes('waiting') || q.includes('pending')) {
    const waiting = emails.filter(e => e.waitingOn && e.waitingOn !== 'none' && !e.isArchived);
    matchedEmails = waiting;
    answer = `You are currently tracking ${waiting.length} pending items:\n• ${waiting.filter(e => e.waitingOn === 'client').length} awaiting Client decisions\n• ${waiting.filter(e => e.waitingOn === 'assistant').length} awaiting Assistant response coordination`;
    suggestedActions = [
      { label: "Show Pending Threads", action: "filter_waiting" }
    ];
  }
  // Match: "Summarize this conversation" / "summarize"
  else if (q.includes('summarize') || q.includes('summary')) {
    const target = activeEmailId ? emails.find(e => e.id === activeEmailId) : emails[0];
    if (target) {
      matchedEmails = [target];
      answer = `Executive Summary for "${target.subject}":\n\n${target.summary}\n\n• Classification: ${target.classification} (${Math.round(target.confidence * 100)}% confidence)\n• Action Needed: ${target.whyClientAttentionNeeded || target.aiRationale}`;
    } else {
      answer = "Please select an email thread from the inbox to generate a conversation summary.";
    }
  }
  // Match: "Why has this email been assigned to the client?" / "why"
  else if (q.includes('why') && (q.includes('assigned') || q.includes('client') || q.includes('classification'))) {
    const target = activeEmailId ? emails.find(e => e.id === activeEmailId) : emails.find(e => e.classification === 'Client to Reply');
    if (target) {
      matchedEmails = [target];
      answer = `Classification Rationale for "${target.subject}":\n\n"${target.aiRationale}"\n\nBecause this involves fiduciary governance, strategic acquisition valuation, or personal decision-making, our delegation policy prohibits assistant sign-off.`;
    } else {
      answer = "The AI assigns emails based on executive delegation boundaries, sender hierarchy, and whether financial/legal commitments exceed delegated limits.";
    }
  }
  // Match: "Draft a reply" / "draft"
  else if (q.includes('draft') || q.includes('reply')) {
    const target = activeEmailId ? emails.find(e => e.id === activeEmailId) : emails[0];
    if (target) {
      matchedEmails = [target];
      answer = `I have formulated a draft reply for "${target.subject}". You can review, refine tone, or queue it for the client in the composer.`;
      suggestedActions = [
        { label: "Open Draft Composer", action: "open_composer", emailId: target.id }
      ];
    } else {
      answer = "Select an email to draft an executive reply.";
    }
  }
  // Fallback: Smart semantic search
  else {
    const matches = emails.filter(e => 
      e.subject.toLowerCase().includes(q) ||
      e.sender.name.toLowerCase().includes(q) ||
      (e.summary && e.summary.toLowerCase().includes(q))
    );
    matchedEmails = matches.slice(0, 3);
    answer = matches.length > 0
      ? `Found ${matches.length} conversations matching "${query}".`
      : `I reviewed your inbox for "${query}". No direct matches found. Try asking about pending client decisions, scheduling logistics, or summarizing selected threads.`;
  }

  res.json({
    query,
    answer,
    matchedEmails,
    suggestedActions
  });
});

// 12. Audit Logs
app.get('/api/logs', (req, res) => {
  res.json({ logs: auditLogs });
});

app.listen(PORT, () => {
  console.log(`[Cadence Executive Backend] Running on http://localhost:${PORT}`);
});
