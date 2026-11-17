import {
  mockFetchStatus,
  mockFetchClients,
  mockFetchAccounts,
  mockConnectAccount,
  mockSyncMailboxes,
  mockFetchEmails,
  mockFetchEmailById,
  mockClassifyEmail,
  mockExecuteEmailAction,
  mockGenerateSmartDraft,
  mockSendEmailReply,
  mockSimulateIncomingEmail,
  mockQueryAiCopilot,
  mockFetchAuditLogs
} from './mockStore';

const BASE_URL = '/api';

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Not JSON (likely HTML fallback in static host)');
  }
  return res.json();
}

export async function fetchStatus() {
  try {
    return await safeFetch(`${BASE_URL}/status`);
  } catch (err) {
    return mockFetchStatus();
  }
}

export async function fetchClients() {
  try {
    return await safeFetch(`${BASE_URL}/clients`);
  } catch (err) {
    return mockFetchClients();
  }
}

export async function fetchAccounts() {
  try {
    return await safeFetch(`${BASE_URL}/accounts`);
  } catch (err) {
    return mockFetchAccounts();
  }
}

export async function connectAccount(accountData) {
  try {
    return await safeFetch(`${BASE_URL}/accounts/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData),
    });
  } catch (err) {
    return mockConnectAccount(accountData);
  }
}

export async function syncMailboxes() {
  try {
    return await safeFetch(`${BASE_URL}/accounts/sync`, {
      method: 'POST',
    });
  } catch (err) {
    return mockSyncMailboxes();
  }
}

export async function fetchEmails({ clientId, segment, search, unreadOnly } = {}) {
  try {
    const params = new URLSearchParams();
    if (clientId) params.append('clientId', clientId);
    if (segment) params.append('segment', segment);
    if (search) params.append('search', search);
    if (unreadOnly) params.append('unreadOnly', 'true');

    return await safeFetch(`${BASE_URL}/emails?${params.toString()}`);
  } catch (err) {
    return mockFetchEmails({ clientId, segment, search, unreadOnly });
  }
}

export async function fetchEmailById(id) {
  try {
    return await safeFetch(`${BASE_URL}/emails/${id}`);
  } catch (err) {
    return mockFetchEmailById(id);
  }
}

export async function classifyEmail(id, { classification, reason }) {
  try {
    return await safeFetch(`${BASE_URL}/emails/${id}/classify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classification, reason }),
    });
  } catch (err) {
    return mockClassifyEmail(id, { classification, reason });
  }
}

export async function executeEmailAction(id, { action, note, tone }) {
  try {
    return await safeFetch(`${BASE_URL}/emails/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, note, tone }),
    });
  } catch (err) {
    return mockExecuteEmailAction(id, { action, note, tone });
  }
}

export async function generateSmartDraft(id, { tone, customInstructions }) {
  try {
    return await safeFetch(`${BASE_URL}/emails/${id}/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tone, customInstructions }),
    });
  } catch (err) {
    return mockGenerateSmartDraft(id, { tone, customInstructions });
  }
}

export async function sendEmailReply(id, { body, subject }) {
  try {
    return await safeFetch(`${BASE_URL}/emails/${id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, subject }),
    });
  } catch (err) {
    return mockSendEmailReply(id, { body, subject });
  }
}

export async function simulateIncomingEmail(templateType = 'random') {
  try {
    return await safeFetch(`${BASE_URL}/emails/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateType }),
    });
  } catch (err) {
    return mockSimulateIncomingEmail(templateType);
  }
}

export async function queryAiCopilot({ query, activeEmailId }) {
  try {
    return await safeFetch(`${BASE_URL}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, activeEmailId }),
    });
  } catch (err) {
    return mockQueryAiCopilot(query, activeEmailId);
  }
}

export async function fetchAuditLogs() {
  try {
    return await safeFetch(`${BASE_URL}/logs`);
  } catch (err) {
    return mockFetchAuditLogs();
  }
}
