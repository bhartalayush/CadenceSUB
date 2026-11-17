# Cadence Executive — AI-Powered Email Operating System for Personal Assistants & Clients

> **AI Full-Stack Engineer Intern Task Submission**  
> A modern, intelligent email management dashboard and executive portal built with the MERN paradigm (React, Express, Node.js, and in-memory persistence mirroring MongoDB models).

---

## 🎯 Executive Overview & Problem Solved

Personal assistants managing high-profile executives (CEOs, managing partners, founders) face a recurring bottleneck: **identifying who is responsible for responding to an incoming email**.
- Often, a client reads an email on their phone without indicating whether they intend to handle it personally or expect their assistant to handle it.
- Traditional inboxes force assistants to read hundreds of threads just to discover who owns the ball.
- Conversely, executives are either bombarded with operational noise or left out of critical, high-stakes decisions.

**Cadence Executive** solves this with a **Dual-Persona Architecture** powered by contextual AI classification:
1. **Assistant Command Center**: A comprehensive triage and execution hub for personal assistants, complete with AI responsibility classifications, rationale transparency, action item extraction, calendar synchronization, and a Smart Draft Studio.
2. **Minimalist Client VIP Portal**: A distraction-free executive portal designed exclusively for the client (CEO/Partner) that surfaces **only** emails requiring their personal decision, with one-click delegation and draft approval.

---

## 💎 Key Features & Capabilities

### 1. Onboarding & Mailbox Connection Engine
- **Multi-Provider Support**: Connects Google Workspace / Gmail and Microsoft 365 / Outlook.
- **Simulated OAuth 2.0 Handshake**: Demonstrates actual enterprise permission scopes (`Mail.ReadWrite`, `Calendars.ReadWrite`, restricted email access).
- **Live Sync Engine**: Animated multi-stage synchronization (OAuth code exchange, metadata ingestion, AI triage, status indicators).
- **Multi-Client Portfolio**: Instantly toggle between multiple executive accounts (e.g., *Sarah Jenkins, CEO of Horizon AI* vs. *Alexander Hayes, Managing Partner at Sterling & Co.*).

### 2. Automatic Email Classification & Reply Responsibility (Core Requirement)
Every incoming thread is analyzed against executive delegation boundaries, sender authority, and commercial stakes:
- **Assistant to Reply**: Scheduling, calendar coordination, vendor true-ups under threshold, keynote tech riders, travel manifests.
- **Client to Reply**: $40M term sheets, confidential M&A feelers (e.g. Stripe Corp Dev), board quorum conflicts, C-suite equity counter-offers.
- **No Reply Needed**: Resolved AWS status alerts, Stripe wire transfer statements, automated newsletters.
- **Review Needed / Flagged**: Low-confidence or ambiguous social conversations flagged for assistant review.
- **Explainable AI (XAI)**: Every thread displays an exact **AI Rationale** (e.g. *"High strategic impact: acquisition proposal addressed directly to CEO. Exceeds standard assistant delegation authority"*), a confidence percentage, and a **1-Click Manual Override** with an instant machine learning feedback loop.

### 3. Minimalist Client-Facing VIP Portal
- Displays **only** unresolved `Client to Reply` items in an executive briefing format.
- **Executive Decision Cards**:
  - 2-sentence executive summary.
  - Clear **"Why your response is needed"** callout.
  - **1-Click Actions**:
    - `[Delegate to Assistant]` with instant quick-presets (*"Please politely decline"*, *"Schedule 30 mins next week"*, *"Request pitch deck"*) or custom notes.
    - `[Review & Approve Prepared Reply]` (allows the client to inspect the assistant's prepared draft and dispatch it with one click).
    - `[Mark Handled]`.
- **Bidirectional Real-Time Sync**: Actions taken by the client instantly reflect in the assistant dashboard with an audit trail.

### 4. Smart Draft Studio & Tone Composer
- AI prepares executive replies tailored to the sender and context.
- **Tone Presets**: *Executive & Decisive*, *Warm & Professional*, *Polite Decline*, *Coordination*.
- Custom prompt refinement field (*"Mention Sarah is in New York on Tuesday"*).
- **Two Workflow Paths**:
  - *Send Direct as Assistant* (resolves thread and logs to message timeline).
  - *Queue for Client Approval* (routes draft into the Client VIP Portal for 1-click executive sign-off).

### 5. Interactive AI Copilot & Query Engine
- Accessible via the floating trigger or **Cmd+K / Ctrl+K**.
- Handles all specification queries:
  - *"Show me emails that need my attention"*
  - *"Which emails require the client's attention?"*
  - *"What am I waiting for a response on?"*
  - *"Summarize this conversation"*
  - *"Why has this email been assigned to the client?"*
  - *"Draft a reply to this conversation"*
- Interactive response cards with direct deep-linking into emails and instant filter switching.

### 6. Live Incoming Email Simulator
- Includes an instant simulation bar in the header:
  - **👑 Strategic / M&A Inflow**: Injects a $40M Series B lead term sheet from Roelof Botha (Sequoia Capital) with live AI classification as *Client to Reply*.
  - **🎙️ Podcast Keynote Booking**: Injects a studio recording invitation from the Lex Fridman Podcast with live AI classification as *Assistant to Reply*.
  - **📄 Wire Transfer Statement**: Injects an automated daily payout notification from Stripe with live AI classification as *No Reply Needed*.

### 7. Bespoke High-Taste UI/UX Details
- **Palette**: Warm Cream (`#FAF8F3`), Dignified Charcoal (`#14120F`), Sand and Paper borders, with Frosted Glass accents (`backdrop-blur-xl`).
- **Typography**: Monumental display poster typography (*Unbounded* / *Panchang*) on the hero cover paired with *Google Sans* globally for an executive, clutter-free reading experience.
- **Floating Glass Navigation**: Rounded frosted glass capsule (`glass-floating-dark` / `glass-floating-light`) with dynamic scroll awareness floating seamlessly above the hero stage.
- **Auditory Tactile Feedback**: Built-in Web Audio API synthesizer for subtle clicks, archive swooshes, and celebratory chimes (toggleable).
- **Command Palette (`Cmd+K`)**: Instant keyboard navigation across all views, filters, and actions.
- **AI Model & API Keys Hub**: Seamless modal to switch between Google Gemini (Gemini 1.5 Pro), OpenAI (GPT-4o), and the Embedded Offline Engine, with live in-app key updates or `.env` configuration.
- **Activity & AI Audit Log**: Full audit trail of every classification and delegation event.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance SPA with TailwindCSS |
| **Icons & SFX** | Lucide React, Web Audio API, Canvas Confetti | Tactile micro-interactions and audio feedback |
| **Backend** | Node.js, Express.js | RESTful API, AI heuristics engine, CORS, Morgan |
| **Data Architecture** | In-Memory / File-Persisted MERN Models | Mirrors MongoDB Schemas (`Email`, `Thread`, `Account`, `Client`, `AuditLog`) |

---

## 🚀 Getting Started & Running Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch

1. **Install Dependencies**:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. **Run Backend Server**:
```bash
# From the backend directory
npm start
# Server starts on http://localhost:5000
```

3. **Run Frontend Dev Server**:
```bash
# From the frontend directory
npm run dev
# Frontend starts on http://localhost:5173
```

4. **Open in Browser**:
Visit **`http://localhost:5173`**

5. **Configure AI Provider / API Keys (Optional)**:
- **Zero-config default**: Cadence comes with an offline autonomous executive inference engine out-of-the-box (no API key required).
- **To use real LLMs (Google Gemini / OpenAI)**:
  - Click the **API Key** button in the top floating navbar to paste your key in-app, or
  - Copy `backend/.env.example` to `backend/.env` and add:
    ```env
    AI_PROVIDER=gemini
    GEMINI_API_KEY=your_key_here
    # or OPENAI_API_KEY=your_key_here
    ```

---

## 🧪 Step-by-Step Evaluator Walkthrough

1. **Assistant Command Center**:
   - Inspect the top **Triage Stats Ribbon** (Inbox Volume, Assistant Queue, Client Decisions, Waiting, Extracted Meetings, No Reply Needed).
   - Click any card (e.g. *Client Decisions*) to filter the email list instantly.
   - Select an email (e.g. *Claire DuPont - Acquisition inquiry from Stripe*).
   - Review the **AI Classification Intelligence** card, confidence percentage, and exact rationale.
   - Review the **Executive TL;DR**, **Extracted Next Steps checklist**, and **Extracted Calendar block**.

2. **Smart Draft Studio**:
   - Scroll down to the **Smart Reply Studio**.
   - Switch tones between *Executive & Decisive* and *Polite Decline*.
   - Click **"Queue for Client Approval"** or **"Send Reply Now"**.

3. **Switch to Client VIP Portal**:
   - Click **"Client VIP Portal"** in the top navigation.
   - Notice how the entire operational clutter vanishes, replaced by a clean, executive decision view.
   - Click **"Review & Approve Prepared Reply"** on the Stripe thread and click **"1-Click Approve & Send"** to witness the confetti feedback.
   - Or click **"Delegate to Assistant"** and pick a preset directive like *"Please politely decline"*.

4. **Test Live Email Simulation**:
   - In the top header, click **"Simulate Incoming Email"** -> **"👑 Strategic / M&A Inflow"**.
   - Watch the new thread arrive in real-time, get classified as *Client to Reply*, trigger a toast notification, and update the metrics ribbon.

5. **Test AI Copilot**:
   - Click **"Ask AI Copilot"** in the bottom-right corner (or press `Cmd+K`).
   - Click the prompt chip: *"Why has this email been assigned to the client?"* or *"Show me emails that need my attention"*.
   - Watch the Copilot explain the rationale and provide deep-link cards directly into the inbox.

---

## 📝 Assignment Alignment Checklist

- [x] **Onboarding and email connection experience**: Completed (Gmail & Outlook simulated OAuth flow with real scopes and sync animations).
- [x] **Main assistant email dashboard**: Completed (Triage stats, priority ribbon, multi-client switcher, search & filters).
- [x] **Email organization and segmentation**: Completed (8 segments, search, status filters).
- [x] **Automatic AI-based reply responsibility classification**: Completed (Assistant, Client, No Reply, Review Needed with rationale and manual overrides).
- [x] **Minimalistic client-facing dashboard**: Completed (VIP briefing cards, 1-click delegation, draft approvals, and bidirectional sync).
- [x] **Email conversation and details view**: Completed (Split pane, message bubbles, action checklists, calendar extraction).
- [x] **AI-powered summaries and email assistance**: Completed (Executive TL;DR, Copilot with natural language queries).
- [x] **Email reply drafting and review experience**: Completed (Tone selector, editable draft, queue for client approval).
- [x] **Responsive and professionally designed UI/UX**: Completed (Obsidian executive theme, Web Audio API sound effects, command palette, mobile support).
