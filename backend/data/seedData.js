export const seedClients = [
  {
    id: "client-1",
    name: "Sarah Jenkins",
    title: "Chief Executive Officer, Horizon AI",
    email: "sarah.jenkins.ceo@gmail.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    company: "Horizon AI",
    provider: "google",
    connectedAccount: "sarah.jenkins.ceo@gmail.com",
    unreadCount: 4,
    delegationRules: [
      "Assistant coordinates all calendar scheduling, travel, logistics, and vendor payments under $15k.",
      "Assistant fields initial conference/press requests and drafts executive declines where appropriate.",
      "Client personally handles M&A inquiries, board governance, direct investor outreach, and VP+ equity negotiations."
    ]
  },
  {
    id: "client-2",
    name: "Alexander Hayes",
    title: "Managing Partner, Sterling & Co. Capital",
    email: "alexander.hayes@sterlingpartners.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    company: "Sterling & Co. Capital",
    provider: "microsoft",
    connectedAccount: "alexander.hayes@sterlingpartners.com",
    unreadCount: 2,
    delegationRules: [
      "Assistant manages LP meeting calendars, flight bookings, and compliance receipt collection.",
      "Client handles investment committee decisions, capital calls, and founder board escalations."
    ]
  }
];

export const seedAccounts = [
  {
    id: "acc-google-1",
    provider: "google",
    providerName: "Google Workspace / Gmail",
    email: "sarah.jenkins.ceo@gmail.com",
    clientId: "client-1",
    clientName: "Sarah Jenkins",
    status: "connected",
    syncedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4 mins ago
    health: "optimal",
    totalMessages: 1420,
    syncedMessages: 1420,
    oauthScopes: ["https://mail.google.com/", "https://www.googleapis.com/auth/calendar.events"]
  },
  {
    id: "acc-msft-1",
    provider: "microsoft",
    providerName: "Microsoft 365 / Outlook",
    email: "alexander.hayes@sterlingpartners.com",
    clientId: "client-2",
    clientName: "Alexander Hayes",
    status: "connected",
    syncedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    health: "optimal",
    totalMessages: 980,
    syncedMessages: 980,
    oauthScopes: ["Mail.ReadWrite", "Calendars.ReadWrite"]
  }
];

export const initialEmails = [
  {
    id: "thread-101",
    clientId: "client-1",
    subject: "Confidential // Acquisition inquiry from Stripe Corporate Development",
    sender: {
      name: "Claire DuPont",
      email: "c.dupont@stripe.com",
      role: "VP Corporate Development, Stripe",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    recipients: ["sarah.jenkins.ceo@gmail.com"],
    receivedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    classification: "Client to Reply",
    confidence: 0.98,
    priority: "high",
    isImportant: true,
    isUnread: true,
    isArchived: false,
    status: "needs_action",
    waitingOn: "client",
    category: "Strategic / M&A",
    aiRationale: "High-stakes strategic acquisition proposal addressed directly to CEO. Involves confidential IP and valuation discussions exceeding standard assistant delegation authority.",
    summary: "Stripe Corporate Development is formally reaching out under strict confidentiality regarding preliminary interest in acquiring Horizon AI's agentic search infrastructure. Requests a direct 30-min exploratory video call with Sarah next week under mutual NDA.",
    whyClientAttentionNeeded: "Requires executive decision on whether Horizon AI is receptive to acquisition discussions and approval of mutual NDA terms before legal review.",
    actionItems: [
      { id: "act-1", text: "Decide whether to accept preliminary acquisition exploration", done: false, owner: "client" },
      { id: "act-2", text: "Sign or redline Stripe standard bilateral NDA", done: false, owner: "client" },
      { id: "act-3", text: "Direct assistant to coordinate private 30-min video conference", done: false, owner: "assistant" }
    ],
    meetingDetails: {
      extracted: true,
      proposedTimes: ["Next Tuesday 2:00 PM EST", "Next Wednesday 11:00 AM EST"],
      duration: "30 mins",
      type: "Virtual (Confidential Video Room)"
    },
    preparedDraft: {
      hasDraft: true,
      status: "ready_for_review",
      suggestedBy: "AI Assistant",
      tone: "Executive & Diplomatic",
      subject: "Re: Confidential // Acquisition inquiry from Stripe Corporate Development",
      body: "Claire,\n\nThank you for reaching out. We have great respect for Stripe's trajectory in developer platforms.\n\nWhile our primary focus is scaling Horizon AI's independent roadmap, we are open to an introductory conversation to understand Stripe's perspective. Please send your mutual NDA over to my executive assistant (copied here) to execute, and they will coordinate 30 minutes for us next Wednesday afternoon.\n\nBest regards,\nSarah Jenkins\nCEO, Horizon AI"
    },
    messages: [
      {
        id: "msg-101-1",
        senderName: "Claire DuPont",
        senderEmail: "c.dupont@stripe.com",
        sentAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        body: "Hi Sarah,\n\nI hope you're having a productive quarter. I lead Corporate Development at Stripe.\n\nOur executive team has been tracking Horizon AI's agentic workflow infrastructure with keen interest over the past few months. We see remarkable alignment with our upcoming developer intelligence suite.\n\nWe would love to explore whether there is potential for a deeper strategic partnership or outright acquisition of Horizon AI's infrastructure assets. Given the sensitivity of these discussions, we would conduct this strictly under mutual NDA.\n\nCould we arrange a confidential 30-minute introductory call next Tuesday (Oct 29) at 2:00 PM EST or Wednesday at 11:00 AM EST?\n\nWarm regards,\nClaire DuPont\nVP, Corporate Development | Stripe"
      }
    ],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 35).toISOString(), event: "Received email from Claire DuPont" },
      { time: new Date(Date.now() - 1000 * 60 * 34).toISOString(), event: "AI classified as 'Client to Reply' (98% confidence - M&A Inquiry)" },
      { time: new Date(Date.now() - 1000 * 60 * 33).toISOString(), event: "AI generated executive reply draft for client approval" }
    ]
  },
  {
    id: "thread-102",
    clientId: "client-1",
    subject: "Speaker Logistics & AV Requirements: TechCrunch Disrupt Mainstage Keynote",
    sender: {
      name: "Elena Rostova",
      email: "events@techcrunch.com",
      role: "Keynote Director, TechCrunch",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    recipients: ["sarah.jenkins.ceo@gmail.com"],
    receivedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // 1h 15m ago
    classification: "Assistant to Reply",
    confidence: 0.97,
    priority: "medium",
    isImportant: true,
    isUnread: true,
    isArchived: false,
    status: "pending_assistant",
    waitingOn: "assistant",
    category: "Events & Speaking",
    aiRationale: "Standard conference speaker coordination. Involves stage rider specifications, microphone preferences, and green room arrival timings, which fall fully within personal assistant delegation scope.",
    summary: "TechCrunch Disrupt is finalizing mainstage logistics for Sarah's upcoming keynote on Nov 18. Requires confirmation of slide format (16:9 4K), microphone preference (lavalier vs headset), and VIP green room check-in at 9:15 AM.",
    whyClientAttentionNeeded: null,
    actionItems: [
      { id: "act-4", text: "Submit 16:9 keynote deck format and tech rider", done: false, owner: "assistant" },
      { id: "act-5", text: "Confirm wireless lavalier microphone preference", done: false, owner: "assistant" },
      { id: "act-6", text: "Block Sarah's calendar for 9:15 AM Green Room arrival", done: true, owner: "assistant" }
    ],
    meetingDetails: {
      extracted: true,
      eventDate: "Nov 18, 2026",
      callTime: "9:15 AM Green Room Check-in",
      location: "Moscone Center West, Mainstage Room A"
    },
    preparedDraft: {
      hasDraft: true,
      status: "ready_to_send",
      suggestedBy: "AI Assistant",
      tone: "Warm & Professional",
      subject: "Re: Speaker Logistics & AV Requirements: TechCrunch Disrupt Mainstage Keynote",
      body: "Hi Elena,\n\nThanks for coordinating this. On behalf of Sarah Jenkins, here are her stage and AV preferences for the Nov 18 keynote:\n\n1. Presentation format: We will provide 16:9 4K slides via HDMI (MacBook Pro) with a backup USB drive.\n2. Audio: Sarah prefers a discrete wireless lavalier microphone.\n3. Schedule: Confirmed for 9:15 AM VIP Green Room arrival. I have placed this on her executive itinerary.\n\nPlease let me know if you need any additional bio updates or headshots.\n\nBest regards,\nAntigravity Executive Office (on behalf of Sarah Jenkins)"
    },
    messages: [
      {
        id: "msg-102-1",
        senderName: "Elena Rostova",
        senderEmail: "events@techcrunch.com",
        sentAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
        body: "Dear Sarah and team,\n\nWe are thrilled to feature you on the Disrupt Mainstage on November 18th!\n\nTo ensure our production crew has everything dialed in, please confirm the following by Friday:\n- Slide deck aspect ratio (we strongly encourage 16:9, native 4K supported).\n- Microphone preference: Wireless lavalier or dpa headset.\n- Green room arrival time: Please confirm call time of 9:15 AM for stage soundcheck at 9:30 AM.\n\nLooking forward to a fantastic keynote.\n\nBest,\nElena Rostova\nExecutive Production Lead, TechCrunch Events"
      }
    ],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 75).toISOString(), event: "Received email from Elena Rostova" },
      { time: new Date(Date.now() - 1000 * 60 * 74).toISOString(), event: "AI classified as 'Assistant to Reply' (97% confidence - Logistics)" },
      { time: new Date(Date.now() - 1000 * 60 * 70).toISOString(), event: "Calendar block added for Nov 18 9:15 AM" }
    ]
  },
  {
    id: "thread-103",
    clientId: "client-1",
    subject: "URGENT: Q3 Board Resolution & Rescheduling to Oct 28",
    sender: {
      name: "Arthur Pendelton",
      email: "a.pendelton@apexventures.com",
      role: "Lead Independent Director, Horizon AI Board",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    recipients: ["sarah.jenkins.ceo@gmail.com"],
    receivedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // ~1.8h ago
    classification: "Client to Reply",
    confidence: 0.95,
    priority: "high",
    isImportant: true,
    isUnread: true,
    isArchived: false,
    status: "needs_action",
    waitingOn: "client",
    category: "Board & Governance",
    aiRationale: "Direct communication from Lead Board Director requesting statutory approval of Q3 consent resolution and rescheduling formal board meeting. Requires CEO signature and fiduciary decision.",
    summary: "Arthur Pendelton reports a conflict with the scheduled Oct 24 board meeting. Proposes moving to Oct 28 at 10 AM EST to maintain quorum. Attaches unanimous written consent for Series A option pool expansion that requires Sarah's explicit vote.",
    whyClientAttentionNeeded: "Requires personal confirmation of board meeting date and electronic approval of the attached corporate option pool resolution.",
    actionItems: [
      { id: "act-7", text: "Confirm availability for Oct 28 10:00 AM EST Board Meeting", done: false, owner: "client" },
      { id: "act-8", text: "Review and approve Q3 Option Pool expansion resolution", done: false, owner: "client" }
    ],
    meetingDetails: {
      extracted: true,
      eventDate: "Oct 28, 2026",
      proposedTimes: ["10:00 AM - 12:30 PM EST"],
      location: "Virtual Boardroom / Zoom VIP"
    },
    preparedDraft: {
      hasDraft: true,
      status: "ready_for_review",
      suggestedBy: "AI Assistant",
      tone: "Decisive & Formal",
      subject: "Re: URGENT: Q3 Board Resolution & Rescheduling to Oct 28",
      body: "Arthur,\n\nOct 28 at 10:00 AM EST works well for me. I have instructed my assistant to update the calendar invites for all directors.\n\nRegarding the Q3 option pool resolution, I have reviewed the expanded allocation and fully endorse it. My signed digital consent is attached.\n\nLooking forward to our discussion next Monday.\n\nWarmly,\nSarah"
    },
    messages: [
      {
        id: "msg-103-1",
        senderName: "Arthur Pendelton",
        senderEmail: "a.pendelton@apexventures.com",
        sentAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        body: "Sarah,\n\nTwo directors have an unavoidable portfolio emergency on Oct 24, which puts our quorum in jeopardy. Could we shift our Q3 Board Meeting to Monday, Oct 28 from 10:00 AM to 12:30 PM EST?\n\nAdditionally, corporate counsel needs your formal sign-off on the option pool top-up resolution prior to Friday. Please confirm whether Monday works for you and return the signed consent.\n\nBest,\nArthur"
      }
    ],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 110).toISOString(), event: "Received email from Arthur Pendelton" },
      { time: new Date(Date.now() - 1000 * 60 * 109).toISOString(), event: "AI flagged as High Priority (Board Governance)" }
    ]
  },
  {
    id: "thread-104",
    clientId: "client-1",
    subject: "Reschedule our catch-up coffee next week?",
    sender: {
      name: "David K. Ross",
      email: "dross@benchmark.com",
      role: "General Partner, Benchmark",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    recipients: ["sarah.jenkins.ceo@gmail.com"],
    receivedAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(), // ~3h ago
    classification: "Assistant to Reply",
    confidence: 0.99,
    priority: "medium",
    isImportant: false,
    isUnread: false,
    isArchived: false,
    status: "pending_assistant",
    waitingOn: "assistant",
    category: "Scheduling",
    aiRationale: "Sender explicitly asks Sarah's assistant to connect with his assistant (Rachel) to coordinate calendar slots for coffee. Direct assistant-to-assistant delegation.",
    summary: "David Ross has a travel conflict for Tuesday's coffee. He asks Sarah's executive assistant to coordinate with his EA Rachel to reschedule for Thursday afternoon or Friday morning in Palo Alto.",
    whyClientAttentionNeeded: null,
    actionItems: [
      { id: "act-9", text: "Email Rachel (rachel@benchmark.com) with Sarah's Thursday 3:30 PM opening", done: false, owner: "assistant" },
      { id: "act-10", text: "Reserve quiet table at Blue Bottle University Ave", done: false, owner: "assistant" }
    ],
    meetingDetails: {
      extracted: true,
      proposedTimes: ["Thursday Oct 30 afternoon", "Friday Oct 31 morning"],
      location: "Blue Bottle Coffee, University Ave, Palo Alto"
    },
    preparedDraft: {
      hasDraft: true,
      status: "ready_to_send",
      suggestedBy: "AI Assistant",
      tone: "Warm & Efficient",
      subject: "Re: Reschedule our catch-up coffee next week?",
      body: "Hi David,\n\nSarah's executive office here! No problem at all regarding Tuesday.\n\nSarah has a clear window next Thursday, Oct 30 at 3:30 PM, or Friday at 10:30 AM. I will loop in Rachel (rachel@benchmark.com) right away to synchronize their calendars and send an updated invite for Blue Bottle in Palo Alto.\n\nHave a great week!\n\nBest,\nAntigravity Executive Office"
    },
    messages: [
      {
        id: "msg-104-1",
        senderName: "David K. Ross",
        senderEmail: "dross@benchmark.com",
        sentAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
        body: "Hey Sarah,\n\nSomething urgent came up with a portfolio closing on Tuesday morning, so I won't make our coffee. Can your EA connect directly with Rachel (rachel@benchmark.com) on my side to find 45 mins on Thursday afternoon or Friday?\n\nExcited to hear about the new agent release!\n\nDavid"
      }
    ],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 190).toISOString(), event: "Received email from David K. Ross" },
      { time: new Date(Date.now() - 1000 * 60 * 189).toISOString(), event: "AI classified as 'Assistant to Reply' (99% - EA Coordination)" }
    ]
  },
  {
    id: "thread-105",
    clientId: "client-1",
    subject: "Private Dining Confirmation: The French Laundry - Nov 14 (Party of 6)",
    sender: {
      name: "The French Laundry Concierge",
      email: "reservations@thefrenchlaundry.com",
      role: "Private Dining Concierge",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    recipients: ["sarah.jenkins.ceo@gmail.com"],
    receivedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(), // ~5h ago
    classification: "Assistant to Reply",
    confidence: 0.98,
    priority: "low",
    isImportant: false,
    isUnread: false,
    isArchived: false,
    status: "pending_assistant",
    waitingOn: "assistant",
    category: "Hospitality / Travel",
    aiRationale: "Restaurant reservation confirmation requiring dietary preference submission and credit card deposit verification. Typical administrative task.",
    summary: "Reservation confirmed for Sarah's executive dinner at The French Laundry on Nov 14 at 7:30 PM. Requests guest dietary notes and beverage package selection 72 hours in advance.",
    whyClientAttentionNeeded: null,
    actionItems: [
      { id: "act-11", text: "Submit dietary notes (1 Pescatarian, 1 Celiac)", done: false, owner: "assistant" },
      { id: "act-12", text: "Authorize executive corporate card for wine pairing deposit", done: true, owner: "assistant" }
    ],
    messages: [
      {
        id: "msg-105-1",
        senderName: "The French Laundry Concierge",
        senderEmail: "reservations@thefrenchlaundry.com",
        sentAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
        body: "Dear Ms. Jenkins,\n\nWe are pleased to confirm your reservation for a party of six on Saturday, November 14, 2026 at 7:30 PM in our Private Courtyard Salon.\n\nPlease provide any guest allergies or dietary restrictions at your earliest convenience to allow Chef Keller's culinary team to tailor the tasting menu.\n\nWarm regards,\nGuest Services"
      }
    ],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 320).toISOString(), event: "Received confirmation from The French Laundry" },
      { time: new Date(Date.now() - 1000 * 60 * 319).toISOString(), event: "AI routed to Assistant hospitality queue" }
    ]
  },
  {
    id: "thread-106",
    clientId: "client-1",
    subject: "[RESOLVED] US-East-1 AWS CloudWatch Latency Alert",
    sender: {
      name: "AWS System Notifications",
      email: "no-reply@amazon.com",
      role: "Automated Incident Notification",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
    },
    recipients: ["sarah.jenkins.ceo@gmail.com"],
    receivedAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    classification: "No Reply Needed",
    confidence: 0.99,
    priority: "low",
    isImportant: false,
    isUnread: false,
    isArchived: true,
    status: "resolved",
    waitingOn: "none",
    category: "System Alerts",
    aiRationale: "Automated system resolution notification. No human counterparty and no response expected.",
    summary: "AWS confirmed that the transient API throttling issue in us-east-1 has been fully mitigated. All backend cluster services are operating within normal SLA thresholds.",
    whyClientAttentionNeeded: null,
    actionItems: [],
    messages: [
      {
        id: "msg-106-1",
        senderName: "AWS System Notifications",
        senderEmail: "no-reply@amazon.com",
        sentAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
        body: "Incident #88219 has been marked RESOLVED. Latencies have returned to baseline metrics. No further action is necessary."
      }
    ],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 450).toISOString(), event: "Received system alert" },
      { time: new Date(Date.now() - 1000 * 60 * 449).toISOString(), event: "AI classified as 'No Reply Needed' (99% - Automated)" }
    ]
  },
  {
    id: "thread-107",
    clientId: "client-1",
    subject: "Thought about what we talked about at the gala?",
    sender: {
      name: "Julian Sterling",
      email: "j.sterling@sterlingfamilyoffice.com",
      role: "Principal, Sterling Family Office",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    recipients: ["sarah.jenkins.ceo@gmail.com"],
    receivedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    classification: "Review Needed",
    confidence: 0.61,
    priority: "medium",
    isImportant: false,
    isUnread: true,
    isArchived: false,
    status: "needs_triage",
    waitingOn: "assistant",
    category: "Ambiguous / Review",
    aiRationale: "Context is ambiguous. References an informal verbal conversation at a charity gala with no explicit business terms. Could be a confidential co-investment proposal, a personal favor, or casual networking. Flagged for assistant review.",
    summary: "Julian Sterling follows up on an unspecified conversation with Sarah during Saturday's charity gala. Asks when she's available to chat.",
    whyClientAttentionNeeded: "Assistant should verify if Sarah discussed a specific business deal or if this can be handled via routine executive calendar booking.",
    actionItems: [
      { id: "act-13", text: "Assistant check with Sarah or triage Julian's request", done: false, owner: "assistant" }
    ],
    messages: [
      {
        id: "msg-107-1",
        senderName: "Julian Sterling",
        senderEmail: "j.sterling@sterlingfamilyoffice.com",
        sentAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
        body: "Sarah,\n\nGreat running into you by the terrace on Saturday! Hope your week kicked off smoothly.\n\nJust wanted to see if you had a few minutes to reflect on what we chatted about? Let me know when you're back in the city.\n\nBest,\nJulian"
      }
    ],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 500).toISOString(), event: "Received email from Julian Sterling" },
      { time: new Date(Date.now() - 1000 * 60 * 499).toISOString(), event: "AI flagged: Confidence 61% (Ambiguous context -> Review Needed)" }
    ]
  },
  {
    id: "thread-201",
    clientId: "client-2",
    subject: "Investment Committee: Series B Term Sheet sign-off for QuantumScale ($18M round)",
    sender: {
      name: "Victoria Chen",
      email: "v.chen@sterlingpartners.com",
      role: "Partner, Sterling & Co. Capital",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80"
    },
    recipients: ["alexander.hayes@sterlingpartners.com"],
    receivedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    classification: "Client to Reply",
    confidence: 0.99,
    priority: "high",
    isImportant: true,
    isUnread: true,
    isArchived: false,
    status: "needs_action",
    waitingOn: "client",
    category: "Investments & Deals",
    aiRationale: "Partner-level investment decision on $18M lead syndicate. Requires Managing Partner's personal sign-off on valuation cap and liquidation preference before 5:00 PM closing.",
    summary: "Victoria Chen has circulated the final redlined term sheet for QuantumScale's Series B ($18M lead check at $110M pre-money). Founders accepted 1x non-participating preference. Demands Alexander's final vote before executing today.",
    whyClientAttentionNeeded: "Requires Managing Partner's definitive vote to sign and release the binding term sheet to founders by 5 PM.",
    actionItems: [
      { id: "act-14", text: "Approve 1x non-participating liquidation preference clause", done: false, owner: "client" },
      { id: "act-15", text: "Execute digital signature on DocuSign envelope", done: false, owner: "client" }
    ],
    preparedDraft: {
      hasDraft: true,
      status: "ready_for_review",
      suggestedBy: "AI Assistant",
      tone: "Decisive & Direct",
      subject: "Re: Investment Committee: Series B Term Sheet sign-off for QuantumScale ($18M round)",
      body: "Victoria,\n\nI have reviewed the concessions on the liquidation preference and 15% ESOP pool. Excellent negotiation work with the founders.\n\nYou have my full approval to execute the $18M lead term sheet today. Let's wire the earnest deposit upon signature.\n\nAlexander"
    },
    messages: [
      {
        id: "msg-201-1",
        senderName: "Victoria Chen",
        senderEmail: "v.chen@sterlingpartners.com",
        sentAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
        body: "Alexander,\n\nQuantumScale's board has agreed to our terms: $18M lead investment, $110M pre-money valuation, with 1x non-participating liquidation preference and 1 board seat for Sterling.\n\nWe need your Managing Partner signature on the DocuSign by 5:00 PM today to beat Sequoia's competing term sheet. Can you review and give final green light?\n\nVictoria"
      }
    ],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 95).toISOString(), event: "Received IC term sheet from Victoria Chen" },
      { time: new Date(Date.now() - 1000 * 60 * 94).toISOString(), event: "AI classified as 'Client to Reply' (99% - Investment Committee)" }
    ]
  },
  {
    id: "thread-202",
    clientId: "client-2",
    subject: "Private Aviation Itinerary: SFO to Zurich (WEF Davos 2027 Pre-Booking)",
    sender: {
      name: "NetJets Flight Desk",
      email: "dispatch@netjets.com",
      role: "Flight Operations Coordinator",
      avatar: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=150&auto=format&fit=crop&q=80"
    },
    recipients: ["alexander.hayes@sterlingpartners.com"],
    receivedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    classification: "Assistant to Reply",
    confidence: 0.98,
    priority: "medium",
    isImportant: false,
    isUnread: false,
    isArchived: false,
    status: "pending_assistant",
    waitingOn: "assistant",
    category: "Travel & Aviation",
    aiRationale: "Flight itinerary confirmation and passenger manifest documentation. Standard executive assistant travel operation.",
    summary: "NetJets sent the Bombardier Global 7500 tail allocation for Alexander's European trip. Requests passenger passport copies and catering selections.",
    whyClientAttentionNeeded: null,
    actionItems: [
      { id: "act-16", text: "Upload passport renewals for passenger manifest", done: false, owner: "assistant" },
      { id: "act-17", text: "Select onboard dining preferences and ground transport", done: false, owner: "assistant" }
    ],
    messages: [
      {
        id: "msg-202-1",
        senderName: "NetJets Flight Desk",
        senderEmail: "dispatch@netjets.com",
        sentAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        body: "Good afternoon Mr. Hayes,\n\nYour flight reservation for SFO -> ZRH on Jan 18 aboard Bombardier Global 7500 (Tail #N849QS) has been reserved. Please have your EA submit passenger manifest details by Friday.\n\nFlight Operations Desk"
      }
    ],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 240).toISOString(), event: "Received NetJets flight schedule" },
      { time: new Date(Date.now() - 1000 * 60 * 239).toISOString(), event: "AI routed to Assistant travel desk" }
    ]
  }
];

export const simulationPool = [
  {
    type: "client_vip",
    subject: "Sequoia Capital // Strategic Partnership & Board Seat Discussion",
    sender: {
      name: "Roelof Botha",
      email: "roelof@sequoiacap.com",
      role: "Senior Steward, Sequoia Capital",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    },
    body: "Hi Sarah,\n\nFollowing our brief conversation in Sun Valley, our partnership has discussed leading your upcoming Series B financing. We would like to propose a $40M term sheet with direct board participation.\n\nAre you free for dinner at Madera in Menlo Park this Thursday at 7:30 PM to discuss terms personally?\n\nBest,\nRoelof",
    classification: "Client to Reply",
    confidence: 0.99,
    priority: "high",
    isImportant: true,
    aiRationale: "Tier-1 venture capital lead investment proposal ($40M Series B). Requires executive negotiation and personal dinner acceptance from CEO.",
    summary: "Sequoia Capital proposes to lead Horizon AI's $40M Series B financing. Roelof invites Sarah to a private dinner this Thursday at Madera to finalize terms.",
    whyClientAttentionNeeded: "Requires CEO's decision on accepting Series B terms and attending the private investor dinner.",
    suggestedDraft: "Roelof,\n\nThank you for the thoughtful follow-up and Sequoia's strong interest. I would be delighted to meet for dinner this Thursday at Madera at 7:30 PM to discuss the syndicate terms.\n\nI will have my executive assistant coordinate confirmation with your office.\n\nBest,\nSarah"
  },
  {
    type: "assistant_scheduling",
    subject: "Podcast Interview: Lex Fridman Podcast Studio Scheduling (Austin)",
    sender: {
      name: "Lex Fridman Podcast Team",
      email: "booking@lexfridman.com",
      role: "Studio Producer",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    body: "Hello Sarah and team,\n\nLex would love to host Sarah for a 3-hour deep-dive conversation on AI Agents at our downtown Austin studio next month.\n\nWe have slots open on Nov 24 or Nov 25 from 1:00 PM to 4:00 PM CT. Please have your assistant confirm which date aligns best with her travel schedule so we can book the studio.\n\nBest,\nProduction Desk",
    classification: "Assistant to Reply",
    confidence: 0.96,
    priority: "medium",
    isImportant: true,
    aiRationale: "Studio recording scheduling and travel coordination. Falls directly under assistant calendar and travel logistics responsibility.",
    summary: "Lex Fridman Podcast invites Sarah for a 3-hour episode in Austin. Asking assistant to select between Nov 24 and Nov 25.",
    whyClientAttentionNeeded: null,
    suggestedDraft: "Hi Production Team,\n\nOn behalf of Sarah Jenkins, thank you for the invitation! Sarah would be delighted to join Lex in Austin.\n\nNov 24 from 1:00 PM to 4:00 PM CT works smoothly with her Texas travel schedule. I will reserve this block on her master calendar and coordinate studio arrival details with you closer to the date.\n\nBest,\nAntigravity Executive Office"
  },
  {
    type: "no_reply_fyi",
    subject: "Stripe Monthly Payout Statement #PO-883912 ($342,850.00)",
    sender: {
      name: "Stripe Billing",
      email: "statements@stripe.com",
      role: "Automated Payout System",
      avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80"
    },
    body: "Your daily automatic payout of $342,850.00 has been transferred to Silicon Valley Bank (account ending in *4892). Funds are expected to arrive in 1-2 business days. Download full tax receipts and transaction logs in your dashboard.",
    classification: "No Reply Needed",
    confidence: 0.99,
    priority: "low",
    isImportant: false,
    aiRationale: "Automated merchant payout receipt and financial ledger notification. Informational record only, zero response required.",
    summary: "Stripe confirmed automatic transfer of $342,850.00 to company bank account. Funds arrive within 1-2 business days.",
    whyClientAttentionNeeded: null,
    suggestedDraft: null
  }
];
