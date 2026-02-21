// ═══════════════════════════════════════════════════════════════════════
// RiffAI — app.js  v2.0
// ═══════════════════════════════════════════════════════════════════════

// ── REAL BUSINESS FACTS (seeded into every agent on first launch) ─────
const INITIAL_BUSINESS_FACTS = `
COMPANY: DooGoodScoopers
FOUNDED: 2024 by Brandon and Valerie (husband and wife, 12 years together)
WEBSITE: doogoodscoopers.com | PHONE: (909) 366-3744
FACEBOOK: facebook.com/doogoodscoopers

WHAT WE DO: Professional pet waste removal (pooper scooper service) in the Inland Empire, CA.
We clean front/back/side yards, flower beds, dog runs — anywhere dog waste is a problem.

SERVICE PLANS:
- Weekly: 4x per month
- Bi-Weekly: 2x per month
- Monthly: 1x per month
- One-Time Cleanup: available on demand

PRICING:
- Starts at $60/month
- Most clients pay $95–$135/month
- Based on yard size, # of dogs, and frequency

SERVICE AREA: 25+ cities in San Bernardino & Riverside Counties, including:
Rancho Cucamonga, Fontana, Ontario, Riverside, San Bernardino, Chino, Claremont,
Temecula, Upland, Pomona, Norco, Redlands, Highland, Colton, Corona, Murrieta,
Lake Elsinore, Adelanto, Apple Valley, Hesperia, Victorville, Grand Terrace,
Montclair, Chino Hills, and more.

OUR PROCESS:
- Technician sends a 60-minute "on the way" text before arrival
- Customer does NOT need to be home
- Equipment & shoes sanitized with kennel-grade disinfectant between every yard
- Gate photo taken after service so no pets escape
- Waste double-bagged and placed in customer's trash can OR removed in service truck
- All employees are background-checked

REPUTATION: 5-star Google rating. Year-round service (no weather cancellations).

BILLING: 1st of each month, autopay via bank account or credit/debit card.

CURRENT MARKETING WORK IN PROGRESS:
- Schema markup (JSON-LD) live on website
- 12 duplicate city pages being fixed with 301 redirects
- On-page SEO optimized for all 25 city pages (title tags, meta descriptions, H1s)
- Google Business Profile optimization guide created
- CRM platform planned: GoHighLevel for lead automation and follow-up

COMMERCIAL SERVICES: Available for HOAs, apartment complexes, dog parks, and commercial properties.

KEY UNKNOWNS (things to ask Brandon about):
- Current monthly recurring revenue (MRR)
- Number of active customers
- Primary lead sources right now
- Biggest current bottleneck (leads vs. operations vs. retention)
- Whether Valerie is full-time in the business
- Target revenue or customer goals for the year
`.trim();

// ── AGENT COLOR PALETTE (for hire form) ──────────────────────────────
const AGENT_COLORS = [
  { color: '#F59E0B', name: 'Amber'  },
  { color: '#3B82F6', name: 'Blue'   },
  { color: '#10B981', name: 'Green'  },
  { color: '#EF4444', name: 'Red'    },
  { color: '#A78BFA', name: 'Purple' },
  { color: '#F97316', name: 'Orange' },
  { color: '#06B6D4', name: 'Cyan'   },
  { color: '#EC4899', name: 'Pink'   },
];

// ── DEFAULT AGENTS (seeded into storage on first launch) ──────────────
const DEFAULT_AGENTS = {
  alex: {
    id: 'alex', name: 'Alex', title: 'Chief Growth Officer',
    avatar: '💰', color: '#F59E0B', isDefault: true,
    persona: `You are Alex, the Chief Growth Officer at DooGoodScoopers, and you think like Alex Hormozi.
You are obsessed with: offers, customer acquisition cost vs. lifetime value, scaling revenue, and removing friction from the buying process.
Your signature phrases: "the offer is everything," "let's look at the math," "stack more value," "what's the LTV on that?"
You are DIRECT, numbers-first, and skeptical of vague marketing claims. You push for ROI on every idea.
You know your colleagues: Gary handles marketing/brand, Jeff runs operations, Grant owns sales/closing.`,
    focus: 'offers, pricing strategy, lead generation, LTV, CAC, scaling, referral programs',
  },
  gary: {
    id: 'gary', name: 'Gary', title: 'Chief Marketing Officer',
    avatar: '📣', color: '#3B82F6', isDefault: true,
    persona: `You are Gary, the Chief Marketing Officer at DooGoodScoopers, and you think like Gary Vaynerchuk.
You are obsessed with: attention, content, brand authenticity, and organic growth in local markets.
Your signature phrases: "the attention is there," "document don't create," "day trading attention," "brand is the moat."
You believe DooGoodScoopers should be a LOCAL CELEBRITY in every city it serves — the brand people think of before they even Google.
You know your colleagues: Alex handles growth/offers, Jeff runs operations, Grant owns sales/closing.`,
    focus: 'content strategy, social media, local brand, Google reviews, Nextdoor, organic reach, storytelling',
  },
  jeff: {
    id: 'jeff', name: 'Jeff', title: 'Chief Operations Officer',
    avatar: '⚙️', color: '#10B981', isDefault: true,
    persona: `You are Jeff, the Chief Operations Officer at DooGoodScoopers, and you think like Jeff Bezos.
You are obsessed with: customer experience, operational efficiency, scalable systems, and long-term thinking.
Your signature phrases: "work backwards from the customer," "Day 1 mentality," "what does the customer actually want?", "the process IS the product."
You believe a pooper scooper business wins by being the most RELIABLE and PREDICTABLE service in its market — not the cheapest.
You know your colleagues: Alex handles growth/offers, Gary runs marketing, Grant owns sales/closing.`,
    focus: 'service delivery, scheduling systems, retention, customer experience, scalability, quality control',
  },
  grant: {
    id: 'grant', name: 'Grant', title: 'Chief Revenue Officer',
    avatar: '🎯', color: '#EF4444', isDefault: true,
    persona: `You are Grant, the Chief Revenue Officer at DooGoodScoopers, and you think like Grant Cardone.
You are obsessed with: closing deals, 10X thinking, follow-up systems, and never leaving money on the table.
Your signature phrases: "10X the effort," "follow up or die," "always be closing," "average is the enemy."
You push hard on: converting every lead, upselling to higher-frequency plans, commercial contracts, and building a pipeline that never goes cold.
You know your colleagues: Alex handles growth/offers, Gary runs marketing, Jeff runs operations.`,
    focus: 'lead conversion, follow-up sequences, upselling, commercial deals, pricing confidence, pipeline',
  },
};
const DEFAULT_AGENT_ORDER = ['alex', 'gary', 'jeff', 'grant'];

// ── ONBOARDING PERSONA TEMPLATES ──────────────────────────────────────
const PERSONA_TEMPLATES = {
  cgo: (biz) => `You are a Chief Growth Officer at ${biz}. You think like Alex Hormozi — obsessed with offers, customer acquisition cost vs. lifetime value, and scaling revenue predictably. You believe the offer is everything and push the team to remove every point of friction between a lead and becoming a paying customer. You're direct, numbers-first, and skeptical of vague marketing claims. You always ask: what's the ROI, what's the LTV, and how do we 10x this?`,
  cmo: (biz) => `You are a Chief Marketing Officer at ${biz}. You think like Gary Vaynerchuk — obsessed with attention, content, and brand authenticity. You believe ${biz} should be a local celebrity in every market it serves. You push for storytelling, community building, organic reach, and documenting the journey. You challenge any plan that sacrifices long-term brand equity for short-term wins.`,
  coo: (biz) => `You are a Chief Operations Officer at ${biz}. You think like Jeff Bezos — obsessed with customer experience, operational efficiency, and scalable systems. You believe the operation IS the product: how reliably the service is delivered determines whether customers stay. You push for documented SOPs, quality checklists, and metrics for everything. You are skeptical of growth plans that outpace the team's operational capacity.`,
  cro: (biz) => `You are a Chief Revenue Officer at ${biz}. You think like Grant Cardone — obsessed with closing deals, follow-up systems, and never leaving money on the table. No lead should go cold, no conversation should end without a clear next step. You push for pricing confidence, upselling higher-tier plans, commercial partnerships, and a pipeline that never stops moving.`,
  cfo: (biz) => `You are a Chief Financial Officer at ${biz}. You are obsessed with unit economics, cash flow, margins, and making every dollar work harder. You push the team to understand true costs, price for profit not just competition, and build financial models before major decisions. You are skeptical of spending that cannot be tied to a measurable return and always ask: what is the payback period on this?`,
  cto: (biz) => `You are a Chief Technology Officer at ${biz}. You are obsessed with automation, software tools, and using technology to do more with less. You evaluate every manual process as a candidate for automation and every customer touchpoint as an opportunity to improve the experience through tech. You push for CRM systems, scheduling software, and AI tools. You want working solutions, not perfect ones.`,
};

const ONBOARDING_ROLES = [
  { key: 'cgo',    label: 'Chief Growth Officer',     emoji: '💰', color: '#F59E0B' },
  { key: 'cmo',    label: 'Chief Marketing Officer',  emoji: '📣', color: '#3B82F6' },
  { key: 'coo',    label: 'Chief Operations Officer', emoji: '⚙️', color: '#10B981' },
  { key: 'cro',    label: 'Chief Revenue Officer',    emoji: '🎯', color: '#EF4444' },
  { key: 'cfo',    label: 'Chief Financial Officer',  emoji: '📊', color: '#A78BFA' },
  { key: 'cto',    label: 'Chief Technology Officer', emoji: '💻', color: '#06B6D4' },
  { key: 'custom', label: 'Custom Role',              emoji: '🤖', color: '#F97316' },
];

// ── ACTIVE AGENTS (populated from storage on init, then mutated by hire/fire) ─
let AGENTS     = {};
let AGENT_ORDER = [];

// ── STATE ─────────────────────────────────────────────────────────────
const state = {
  view: 'dashboard',
  knowledge: {},
  standupHistory: [],
  currentStandup: null,   // { id, topic, messages, pendingQuestions, startedAt }
  isStreaming: false,
  streamingAgent: null,
  actionItems: [],
  settings: {},
  pendingQuestions: [],   // questions collected this standup
};

// ── SUBSCRIPTION / PLAN SYSTEM ────────────────────────────────────────
const PLAN_LIMITS = {
  free: {
    maxAgents:           1,
    standupsPerDay:      1,
    knowledgeBaseChars:  1000,
  },
  pro: {
    maxAgents:           Infinity,
    standupsPerDay:      Infinity,
    knowledgeBaseChars:  Infinity,
  },
};

const VERCEL_API = 'https://riffai.vercel.app/api';

// Subscription state — loaded from storage on init, refreshed periodically
let subscription = {
  plan:        'free',    // 'free' | 'pro'
  email:       '',
  validatedAt: null,      // ISO date of last successful API check
};

async function loadSubscription() {
  const saved = await window.api.storage.get('subscription');
  if (saved) subscription = { ...subscription, ...saved };
}

async function saveSubscription() {
  await window.api.storage.set('subscription', subscription);
}

// Checks Stripe via the Vercel API. Runs on launch + when email is entered.
async function validateSubscription(email) {
  if (!email) return;
  try {
    const res  = await fetch(`${VERCEL_API}/validate-subscription?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    subscription.plan        = data.active ? 'pro' : 'free';
    subscription.email       = email;
    subscription.validatedAt = new Date().toISOString();
    await saveSubscription();
    return data;
  } catch (e) {
    console.warn('Subscription check failed (offline?):', e.message);
    return null;
  }
}

// Re-validates once per day in the background
async function maybeRefreshSubscription() {
  if (!subscription.email) return;
  if (!subscription.validatedAt) { await validateSubscription(subscription.email); return; }
  const hoursSince = (Date.now() - new Date(subscription.validatedAt).getTime()) / 36e5;
  if (hoursSince >= 24) await validateSubscription(subscription.email);
}

function isPro()  { return subscription.plan === 'pro'; }
function isFree() { return subscription.plan === 'free'; }
function planLimits() { return PLAN_LIMITS[subscription.plan] || PLAN_LIMITS.free; }

// Opens the Stripe checkout in the browser
async function openUpgradeCheckout() {
  try {
    const res  = await fetch(`${VERCEL_API}/create-checkout`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: subscription.email || '' }),
    });
    const data = await res.json();
    if (data.url) {
      window.api.shell.openExternal(data.url);
    } else {
      showToast('Could not open checkout. Try again.');
    }
  } catch (e) {
    showToast('Could not connect. Check your internet connection.');
  }
}

// Shows the upgrade paywall modal
function showUpgradeModal(reason) {
  const existing = document.getElementById('upgrade-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'upgrade-modal';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box" style="max-width:440px;text-align:center;padding:40px 36px">
      <div style="font-size:48px;margin-bottom:12px">⚡</div>
      <h2 style="margin:0 0 10px;font-size:22px;font-weight:700">Upgrade to Pro</h2>
      <p style="color:var(--text-muted);margin:0 0 24px;line-height:1.6">${reason}</p>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin-bottom:24px;text-align:left">
        <div style="font-weight:700;margin-bottom:12px;font-size:15px">Pro includes:</div>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:14px;color:var(--text-muted)">
          <div>✅ &nbsp;Unlimited AI agents</div>
          <div>✅ &nbsp;Unlimited daily standups</div>
          <div>✅ &nbsp;Unlimited knowledge base</div>
          <div>✅ &nbsp;Priority support</div>
        </div>
      </div>
      <button class="btn btn-primary btn-lg" id="upgrade-cta" style="width:100%;margin-bottom:12px;background:linear-gradient(135deg,#0ea5e9,#7c3aed);border:none">
        Upgrade to Pro — $19/mo
      </button>
      <button class="btn btn-secondary" id="upgrade-dismiss" style="width:100%">Maybe Later</button>
      <p style="font-size:12px;color:var(--text-muted);margin:16px 0 0">
        After subscribing, enter your email in <strong>Settings → Subscription</strong> to unlock Pro.
      </p>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#upgrade-cta').addEventListener('click', () => {
    openUpgradeCheckout();
    overlay.remove();
  });
  overlay.querySelector('#upgrade-dismiss').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// Returns the number of standups already started today (completed or in-progress)
function standupsToday() {
  const today = new Date().toISOString().split('T')[0];
  return state.standupHistory.filter(s => (s.date || '').startsWith(today)).length;
}

// Returns true if this is a new agent (not an edit) and free tier would exceed limit
function wouldExceedAgentLimit() {
  return isFree() && AGENT_ORDER.length >= planLimits().maxAgents;
}

// Returns true if free tier has already had a standup today
function wouldExceedStandupLimit() {
  return isFree() && standupsToday() >= planLimits().standupsPerDay;
}

// Returns true if a knowledge entry text exceeds the free-tier char limit
function wouldExceedKnowledgeLimit(text) {
  return isFree() && text.length > planLimits().knowledgeBaseChars;
}

// Returns the logo's absolute file:// URL by reading the hidden preload img —
// the HTML parser already resolved '../assets/logo.png' to the correct absolute path.
function getLogoSrc() {
  return document.getElementById('riffai-logo-preload')?.src || '';
}

// ── INIT & LOAD ───────────────────────────────────────────────────────
async function init() {
  // Wire titlebar logo using the pre-resolved absolute URL
  const tbLogo = document.getElementById('titlebar-logo-img');
  if (tbLogo) tbLogo.src = getLogoSrc();

  await loadAll();
  await loadSubscription();
  updateUserCard();
  setupNav();
  renderSidebarAgents();
  // First-run onboarding — show before anything else
  if (!state.settings.onboardingComplete) {
    showOnboarding();
    return; // onboarding handles completion and calls navigate()
  }
  await seedKnowledgeIfEmpty();
  navigate(state.view);
  // Refresh subscription status in the background after UI is loaded
  setTimeout(() => maybeRefreshSubscription(), 3000);
}

async function loadAll() {
  state.settings       = (await window.api.storage.get('settings'))       || {};
  state.standupHistory = (await window.api.storage.get('standupHistory')) || [];
  state.actionItems    = (await window.api.storage.get('actionItems'))    || [];

  // Load agents — fall back to defaults only for users who've already completed onboarding
  const agentsCfg = await window.api.storage.get('agents-config');
  if (agentsCfg && agentsCfg.order?.length) {
    AGENTS      = agentsCfg.byId;
    AGENT_ORDER = agentsCfg.order;
  } else if (state.settings.onboardingComplete) {
    // Existing user who somehow lost their agent config — restore defaults
    AGENTS      = { ...DEFAULT_AGENTS };
    AGENT_ORDER = [...DEFAULT_AGENT_ORDER];
    await window.api.storage.set('agents-config', { byId: AGENTS, order: AGENT_ORDER });
  }
  // New user (onboardingComplete = false): AGENTS stays empty; onboarding will populate it

  for (const id of AGENT_ORDER) {
    state.knowledge[id] = (await window.api.storage.get(`knowledge-${id}`)) || { learnings: [], manualNotes: '' };
  }
  // Restore any standup that was in progress when the app last closed
  const saved = await window.api.storage.get('currentStandup');
  if (saved && saved.messages?.length) {
    state.pendingQuestions = saved.pendingQuestions || [];
    const { pendingQuestions: _pq, ...standup } = saved;
    state.currentStandup = { ...standup, recovered: true };
    state.view = 'standup';
  }
}

async function seedKnowledgeIfEmpty() {
  const biz = state.settings.bizName || 'DooGoodScoopers';
  let seeded = false;
  for (const id of AGENT_ORDER) {
    const k = state.knowledge[id];
    if (k.learnings.length === 0 && !k.manualNotes) {
      k.learnings.push({
        id: `l_seed_${id}`,
        date: new Date().toISOString().split('T')[0],
        source: 'system',
        content: buildBusinessBriefing(),
        label: `Initial Business Briefing — ${biz}`,
      });
      await window.api.storage.set(`knowledge-${id}`, k);
      seeded = true;
    }
  }
  if (seeded) console.log(`[RiffAI] Agents seeded with business knowledge for ${biz}`);
}

async function saveKnowledge(agentId) {
  await window.api.storage.set(`knowledge-${agentId}`, state.knowledge[agentId]);
}

// Updates the sidebar user card from settings
function updateUserCard() {
  const nameEl = document.querySelector('.user-name');
  const roleEl = document.querySelector('.user-role');
  if (nameEl) nameEl.textContent = state.settings.ownerName  || 'You';
  if (roleEl) roleEl.textContent = state.settings.ownerTitle || 'CEO & Founder';
}

// Builds the business briefing from onboarding/settings data, falling back to the legacy facts
function buildBusinessBriefing() {
  const s = state.settings;
  if (!s.bizName && !s.bizDescription) return INITIAL_BUSINESS_FACTS; // legacy fallback
  let b = `COMPANY: ${s.bizName || 'Our Company'}\n`;
  b += `OWNER: ${s.ownerName || 'The Owner'}, ${s.ownerTitle || 'CEO'}\n`;
  if (s.bizWebsite)  b += `WEBSITE: ${s.bizWebsite}\n`;
  if (s.bizPhone)    b += `PHONE: ${s.bizPhone}\n`;
  if (s.bizIndustry) b += `INDUSTRY: ${s.bizIndustry}\n`;
  b += `\nABOUT THE BUSINESS:\n${s.bizDescription || 'No description provided yet.'}`;
  return b.trim();
}

// Updates the business briefing entry in every agent's knowledge base when settings change
async function updateBusinessBriefingInKnowledge() {
  const briefing = buildBusinessBriefing();
  const biz      = state.settings.bizName || 'Our Company';
  const today    = new Date().toISOString().split('T')[0];
  for (const id of AGENT_ORDER) {
    const k = state.knowledge[id];
    if (!k) continue;
    const idx = k.learnings.findIndex(l => l.source === 'system' || l.id === `l_seed_${id}`);
    if (idx !== -1) {
      k.learnings[idx].content = briefing;
      k.learnings[idx].label   = `Business Briefing — ${biz}`;
    } else {
      k.learnings.unshift({
        id:      `l_seed_${id}`,
        date:    today,
        source:  'system',
        content: briefing,
        label:   `Business Briefing — ${biz}`,
      });
    }
    await saveKnowledge(id);
  }
}

// Escapes a string for safe use in an HTML attribute value
function escAttr(s) { return String(s || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Returns the owner's display name for use in prompts and UI
function ownerName() { return state.settings.ownerName || 'Brandon'; }
function bizName()   { return state.settings.bizName   || 'DooGoodScoopers'; }
async function saveStandupHistory() { await window.api.storage.set('standupHistory', state.standupHistory); }
async function saveActionItems()    { await window.api.storage.set('actionItems', state.actionItems); }
async function saveAgents()         { await window.api.storage.set('agents-config', { byId: AGENTS, order: AGENT_ORDER }); }

// Re-renders the AGENTS section of the sidebar from the live AGENTS/AGENT_ORDER
function renderSidebarAgents() {
  const container = document.getElementById('nav-agents');
  if (!container) return;
  container.innerHTML = '';
  AGENT_ORDER.forEach(id => {
    const a = AGENTS[id];
    if (!a) return;
    const shortRole = a.title.split(' ').pop();   // last word of title, e.g. "Officer" → skip, use role word
    const label = a.title.replace(/chief\s+/i, '').replace(/\s+officer$/i, '').trim(); // "Growth"
    const btn = el('button', 'nav-item');
    btn.dataset.view = `knowledge-${id}`;
    btn.innerHTML = `<span class="nav-agent-dot" style="background:${a.color}"></span>${a.name} · ${label}`;
    btn.addEventListener('click', () => navigate(`knowledge-${id}`));
    container.appendChild(btn);
  });
}

// Persists the live standup + questions so nothing is lost on app close
async function saveCurrentStandup() {
  if (!state.currentStandup) return;
  await window.api.storage.set('currentStandup', {
    ...state.currentStandup,
    pendingQuestions: state.pendingQuestions,
  });
}

// Wipes the in-progress standup from both memory and disk
async function clearCurrentStandup() {
  state.currentStandup   = null;
  state.pendingQuestions = [];
  await window.api.storage.set('currentStandup', null);
}

// ── NAVIGATION ────────────────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.view));
  });
}

function navigate(view) {
  state.view = view;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  const content = document.getElementById('content');
  content.innerHTML = '';
  if (view === 'dashboard')                    content.appendChild(renderDashboard());
  else if (view === 'standup')                 content.appendChild(renderStandupRoom());
  else if (view === 'archive')                 content.appendChild(renderArchive());
  else if (view === 'workspace')               content.appendChild(renderWorkspace());
  else if (view.startsWith('standup-detail-')) content.appendChild(renderStandupDetail(view.replace('standup-detail-', '')));
  else if (view === 'orgchart')                content.appendChild(renderOrgChart());
  else if (view === 'settings')                content.appendChild(renderSettings());
  else if (view.startsWith('knowledge-'))      content.appendChild(renderKnowledge(view.replace('knowledge-', '')));
}

// ── UTILS ─────────────────────────────────────────────────────────────
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
function fmt(d)     { if (!d) return ''; return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }); }
function fmtTime(d) { if (!d) return ''; return new Date(d).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' }); }
function escHtml(t) {
  const owner = ownerName();
  const qTag  = `QUESTION FOR ${owner.toUpperCase()}`;
  return String(t)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/→\s*([\w]+)'s Move:/g, '<span class="action-tag">→ $1\'s Move:</span>')
    .replace(new RegExp(`\\[${qTag.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}:\\s*(.+?)\\]`, 'gi'), (_, q) =>
      `<div class="inline-question">❓ <strong>Question for ${owner}:</strong> ${q.trim()}</div>`
    );
}

// ── SYSTEM PROMPT BUILDER ─────────────────────────────────────────────
function buildSystemPrompt(agentId, isObserver = false) {
  const agent   = AGENTS[agentId];
  const k       = state.knowledge[agentId] || { learnings: [], manualNotes: '' };
  const recents = state.standupHistory.slice(-6)
    .map(s => `• [${s.date}] "${s.topic}" — ${s.summary || 'No summary.'}`)
    .join('\n') || 'No prior standups yet.';

  const knowledgeItems = k.learnings.slice(-40)
    .map(l => `[${l.date}] ${l.content}`)
    .join('\n') || 'None yet.';

  const owner = ownerName();
  const biz   = bizName();
  const customContext = state.settings.bizContext
    ? `\nADDITIONAL CONTEXT FROM ${owner.toUpperCase()}:\n${state.settings.bizContext}\n`
    : '';

  return `${agent.persona}

## WHAT YOU KNOW ABOUT THE BUSINESS
${knowledgeItems}
${k.manualNotes ? `\nNotes from ${owner}: ${k.manualNotes}` : ''}
${customContext}
## RECENT STANDUP HISTORY
${recents}

## STRICT MEETING RULES — follow every one or you've failed:
1. You are in a LIVE boardroom meeting. React to what was JUST SAID — don't launch into a disconnected speech.
2. Keep responses SHORT: 2-3 punchy paragraphs max. No walls of text.
3. Address your colleagues BY NAME when building on or challenging their points.
4. If you need information from ${owner} that you don't know and it's CRITICAL to your recommendation, ask ONE question formatted EXACTLY as: [QUESTION FOR ${owner.toUpperCase()}: your specific question?]
5. Only ask a question if the answer materially changes your recommendation. Don't ask for the sake of asking.
6. End EVERY response with exactly this line: → ${agent.name}'s Move: [one specific, executable next step for ${biz}]
7. NEVER give generic business advice. Every single sentence must apply specifically to ${biz}'s real situation.
8. If you disagree with a colleague, say so clearly and explain why. Great ideas come from debate.
9. When ${owner} speaks, treat their words as the owner's direction — respond to them directly first.
10. DOCUMENT DRAFTING: When asked to write a standalone document — script, email draft, proposal, report, checklist, SOP, plan, or template — produce it using this EXACT format on its own line:
[DOCUMENT:Type:Descriptive Title Here]
Full document content (markdown is fine).
[/DOCUMENT]
Valid types: Script, Email, Report, Proposal, Checklist, SOP, Template, Plan. The document saves automatically as a file the moment you produce it. After the block, write one sentence summarizing what you drafted, then your → Move line as usual. Only use this for real, complete, standalone documents — not bullet points or conversational notes.${isObserver ? `

## ⚠️ OBSERVER MODE — OVERRIDE:
${owner} did NOT address you in their last message — they directed it to other team members. You are listening in. Only speak up if you have a CRITICALLY important point the group absolutely needs right now. If you have nothing essential to add, respond with ONLY this exact text and nothing else:
[PASS]
No explanation, no filler, no sign-off. Just [PASS].` : ''}`;
}

// ── QUESTION EXTRACTION ───────────────────────────────────────────────
function extractQuestions(content, agentId) {
  const owner = ownerName();
  const tag   = `QUESTION FOR ${owner.toUpperCase()}`;
  const re    = new RegExp(`\\[${tag.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}:\\s*(.+?)\\]`, 'gi');
  const found = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    found.push({
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      agentId,
      agentName: AGENTS[agentId].name,
      agentAvatar: AGENTS[agentId].avatar,
      agentColor: AGENTS[agentId].color,
      question: m[1].trim(),
      answered: false,
      answer: '',
      timestamp: new Date().toISOString(),
    });
  }
  return found;
}

function renderQuestionsPanel() {
  const panel = document.getElementById('questions-panel');
  if (!panel) return;

  const qs = state.pendingQuestions;
  if (qs.length === 0) {
    panel.innerHTML = `
      <div class="qpanel-title">💬 Questions for You</div>
      <div class="qpanel-empty">Your agents will ask questions here when they need your input to give better advice.</div>`;
    return;
  }

  panel.innerHTML = `<div class="qpanel-title">💬 Questions for You <span class="qcount">${qs.filter(q => !q.answered).length}</span></div>`;
  qs.forEach(q => {
    const div = el('div', `qitem${q.answered ? ' answered' : ''}`);
    div.innerHTML = `
      <div class="qitem-header">
        <span style="color:${q.agentColor}">${q.agentAvatar} ${q.agentName}</span>
        ${q.answered ? '<span class="qbadge-done">✓ Answered</span>' : '<span class="qbadge-open">Needs answer</span>'}
      </div>
      <div class="qitem-text">${q.question}</div>
      ${q.answered ? `<div class="qitem-answer">Your answer: ${q.answer}</div>` : ''}`;
    panel.appendChild(div);
  });
}

// ── DOCUMENT HANDLING ─────────────────────────────────────────────────
// Maps document type to a display emoji
function docTypeIcon(type) {
  const m = { Script:'📜', Email:'✉️', Report:'📊', Proposal:'📋', Checklist:'☑️', SOP:'🔧', Template:'📄', Plan:'🗺️' };
  return m[type] || '📄';
}

// Parse [DOCUMENT:Type:Title]content[/DOCUMENT] blocks out of an agent message
function extractDocuments(content, agentId, agent) {
  const pattern = /\[DOCUMENT:([^:\]]+):([^\]]+)\]([\s\S]*?)\[\/DOCUMENT\]/g;
  const docs = [];
  let m;
  while ((m = pattern.exec(content)) !== null) {
    docs.push({
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type:      m[1].trim(),
      title:     m[2].trim(),
      content:   m[3].trim(),
      agentId,
      agentName:  agent?.name  || '?',
      agentColor: agent?.color || 'var(--border2)',
    });
  }
  return docs;
}

// Remove document blocks from a string so chat bubbles show clean conversation text
function stripDocumentTags(content) {
  return content.replace(/\[DOCUMENT:[^\]]+\][\s\S]*?\[\/DOCUMENT\]/g, '').trim();
}

// Renders a document chip that appears below an agent's bubble in the chat
function renderDocumentCard(doc) {
  const card = el('div', 'doc-card');
  card.style.borderLeftColor = doc.agentColor || 'var(--border2)';
  card.innerHTML = `
    <div class="doc-card-icon">${docTypeIcon(doc.type)}</div>
    <div class="doc-card-body">
      <div class="doc-card-type">${doc.type}</div>
      <div class="doc-card-title">${doc.title}</div>
      <div class="doc-card-filename">${doc.filename || (doc.error ? '⚠️ Save failed' : '⏳ Saving…')}</div>
    </div>
    <div class="doc-card-actions">
      ${doc.savedPath ? `<button class="btn btn-secondary btn-sm doc-card-btn">📂 Finder</button>` : ''}
    </div>`;
  if (doc.savedPath) {
    card.querySelector('.doc-card-btn').addEventListener('click', () => window.api.shell.showInFinder(doc.savedPath));
  }
  return card;
}

// ── @MENTION PARSING ──────────────────────────────────────────────────
// Scans Brandon's message for @Name patterns and returns matched agent IDs.
// Only agents who are participants in the current standup can be mentioned.
// e.g. "@Grant and @Gary, let's go" → ['grant', 'gary']  (order = participants)
function parseAgentMentions(content) {
  const participants = state.currentStandup?.participantIds || AGENT_ORDER;
  const pattern = /@(\w+)/g;
  const matched = [];
  let m;
  while ((m = pattern.exec(content)) !== null) {
    const mention = m[1].toLowerCase();
    for (const id of participants) {          // only search within participants
      const agent = AGENTS[id];
      if (agent && agent.name.toLowerCase() === mention && !matched.includes(id)) {
        matched.push(id);
        break;
      }
    }
  }
  return matched;
}

// ═══════════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════════

// ── DASHBOARD ─────────────────────────────────────────────────────────
function renderDashboard() {
  const wrap = el('div', 'view');
  const totalLearnings = AGENT_ORDER.reduce((s, id) => s + (state.knowledge[id]?.learnings?.length || 0), 0);
  const pending = state.actionItems.filter(a => !a.done).length;

  wrap.innerHTML = `
    <div class="view-header">
      <div class="view-title">Executive Dashboard</div>
      <div class="view-sub">${bizName()} AI Command Center · ${ownerName()}</div>
    </div>
    <div class="grid-4 mb-6">
      <div class="stat-card">
        <div class="stat-label">Standups Completed</div>
        <div class="stat-value">${state.standupHistory.length}</div>
        <div class="stat-sub">All time</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Agent Knowledge</div>
        <div class="stat-value">${totalLearnings}</div>
        <div class="stat-sub">Items across 4 agents</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Open Actions</div>
        <div class="stat-value" style="color:${pending>0?'var(--yellow)':'var(--green)'}">${pending}</div>
        <div class="stat-sub">${state.actionItems.length} total generated</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Last Standup</div>
        <div class="stat-value" style="font-size:15px;padding-top:6px">${state.standupHistory.length ? fmt(state.standupHistory.slice(-1)[0].date) : '—'}</div>
        <div class="stat-sub">${state.standupHistory.length ? state.standupHistory.slice(-1)[0].topic : 'None yet'}</div>
      </div>
    </div>
    <div style="margin-bottom:24px">
      <button class="btn btn-primary btn-lg" id="dash-new-standup">🎯 Start New Standup</button>
    </div>
    <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:20px">
      <div>
        <div class="dash-section-title">Recent Standups</div>
        <div id="dash-history"></div>
      </div>
      <div>
        <div class="dash-section-title">Open Action Items</div>
        <div id="dash-actions"></div>
      </div>
    </div>
    <div class="dash-section-title" style="margin-top:24px">Your AI Executive Team</div>
    <div class="grid-4" id="dash-agents"></div>`;

  wrap.querySelector('#dash-new-standup').addEventListener('click', () => {
    if (wouldExceedStandupLimit()) {
      showUpgradeModal(`Free plan allows 1 standup per day. Upgrade to Pro for unlimited daily standups.`);
      return;
    }
    navigate('standup');
  });

  const histEl = wrap.querySelector('#dash-history');
  if (!state.standupHistory.length) {
    histEl.innerHTML = `<div class="empty-state"><div class="es-icon">🎙️</div><div class="es-text">No standups yet — start your first one!<br><br>Your agents have been briefed on ${bizName()} and are ready.</div></div>`;
  } else {
    [...state.standupHistory].reverse().slice(0, 5).forEach(s => {
      const item = el('div', 'standup-history-item');
      item.title = 'Click to view full transcript';
      item.innerHTML = `
        <div class="standup-date">${fmt(s.date)}</div>
        <div style="flex:1">
          <div class="standup-topic">${s.topic}</div>
          <div class="standup-summary">${s.summary || 'No summary.'}</div>
        </div>
        <div style="font-size:11px;color:var(--text3);flex-shrink:0;margin-left:8px">${s.messages?.length||0} msgs</div>`;
      item.addEventListener('click', () => navigate(`standup-detail-${s.id}`));
      histEl.appendChild(item);
    });
  }

  const actEl = wrap.querySelector('#dash-actions');
  const openItems = state.actionItems.filter(a => !a.done).slice(-8).reverse();
  if (!openItems.length) {
    actEl.innerHTML = '<div class="empty-state"><div class="es-icon">✅</div><div class="es-text">All caught up! Action items from standups appear here.</div></div>';
  } else {
    openItems.forEach(a => {
      const idx = state.actionItems.indexOf(a);
      const item = el('div', 'action-item');
      item.innerHTML = `<div class="action-check" data-idx="${idx}"></div><div class="action-text">${a.text}</div>`;
      item.querySelector('.action-check').addEventListener('click', async () => {
        state.actionItems[idx].done = true;
        await saveActionItems();
        navigate('dashboard');
      });
      actEl.appendChild(item);
    });
  }

  const agEl = wrap.querySelector('#dash-agents');
  AGENT_ORDER.forEach(id => {
    const a = AGENTS[id];
    const k = state.knowledge[id];
    const card = el('div', 'card card-sm');
    card.style.cssText = `border-top:3px solid ${a.color};cursor:pointer`;
    card.innerHTML = `
      <div style="font-size:24px;margin-bottom:6px">${a.avatar}</div>
      <div style="font-weight:800;font-size:13px">${a.name}</div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:8px">${a.title}</div>
      <div style="font-size:11px;color:var(--text3)">${k?.learnings?.length || 0} knowledge items</div>`;
    card.addEventListener('click', () => navigate(`knowledge-${id}`));
    agEl.appendChild(card);
  });

  return wrap;
}

// ── STANDUP ROOM ───────────────────────────────────────────────────────
function renderStandupRoom() {
  const wrap = el('div', '');
  wrap.id = 'standup-view';
  const inProgress = !!state.currentStandup;

  // Mutable selection set — defaults to all agents, or current participants if resuming
  const selectedIds = new Set(
    inProgress ? (state.currentStandup.participantIds || AGENT_ORDER) : AGENT_ORDER
  );

  // Pill row agents — only participants when live
  const pillIds = inProgress ? (state.currentStandup.participantIds || AGENT_ORDER) : [];

  wrap.innerHTML = `
    <div class="standup-topbar">
      <input class="input standup-topic-input" id="standup-topic"
        placeholder="What does this standup cover? Be specific. (e.g. 'How do we get to 100 customers by Q3?')"
        ${inProgress ? 'disabled' : ''}
        value="${state.currentStandup?.topic || ''}" />
      <div id="standup-controls">
        ${!inProgress
          ? `<button class="btn btn-primary" id="btn-start">▶ Start Standup</button>`
          : `<div class="standup-status"><div class="pulse"></div><span>Live</span></div>`
        }
      </div>
    </div>

    <div class="standup-agents-bar" id="agents-bar">
      ${inProgress
        ? pillIds.map(id => {
            const a = AGENTS[id]; if (!a) return '';
            return `<div class="agent-pill" id="pill-${id}" style="--agent-color:${a.color}">
              <span>${a.avatar}</span><span>${a.name}</span>
            </div>`;
          }).join('') + `<div class="agent-pill" id="pill-brandon" style="--agent-color:var(--brandon)">
            <span>👑</span><span>You</span>
          </div>`
        : `<div class="agent-select-area" id="agent-select-area">
             <span class="agent-select-label">Participants</span>
           </div>`
      }
    </div>

    <div style="display:flex;flex:1;overflow:hidden;min-height:0">
      <div class="chat-area" id="chat-area">
        ${!inProgress ? `
          <div class="empty-state" style="margin:auto">
            <div class="es-icon">🎙️</div>
            <div class="es-text">
              <strong>Your agents are briefed on ${bizName()} and ready to go.</strong><br><br>
              Enter a specific topic above — the more specific, the better the discussion.<br><br>
              <em>Examples:<br>
              "How do we reach 100 recurring customers?"<br>
              "Should we expand to Rialto and Eastvale this quarter?"<br>
              "Our Google Business Profile needs more reviews — what's the play?"</em>
            </div>
          </div>` : ''}
      </div>
      <div id="questions-panel" class="questions-panel"></div>
    </div>

    <div id="input-bar-area">
      ${inProgress ? `
        <div class="standup-input-area" id="user-input-area">
          <div id="mention-dropdown" class="mention-dropdown" style="display:none"></div>
          <div class="standup-input-bar">
            <div id="user-msg" contenteditable="true" class="textarea msg-input-ce"
              data-placeholder="Interject, answer a question, or @mention an agent… (Enter to send, Shift+Enter for newline)"></div>
            <button class="btn btn-primary" id="btn-send" ${state.isStreaming ? 'disabled' : ''}>Send</button>
          </div>
        </div>
        <div class="standup-end-bar">
          <button class="btn btn-secondary btn-sm" id="btn-end">End &amp; Save Standup</button>
        </div>` : ''}
    </div>`;

  // Populate agent selection cards (pre-standup only)
  if (!inProgress) {
    const selectArea = wrap.querySelector('#agent-select-area');
    AGENT_ORDER.forEach(id => {
      const a = AGENTS[id];
      if (!a) return;
      const shortRole = a.title.replace(/chief\s+/i, '').replace(/\s+officer$/i, '').trim();
      const card = el('div', 'agent-select-card selected'); // all selected by default
      card.dataset.agentId = id;
      card.style.setProperty('--agent-color', a.color);
      card.innerHTML = `
        <span class="asc-check">✓</span>
        <span class="asc-avatar">${a.avatar}</span>
        <span class="asc-name">${a.name}</span>
        <span class="asc-role">${shortRole}</span>`;
      card.addEventListener('click', () => {
        if (selectedIds.has(id)) {
          if (selectedIds.size <= 1) { showToast('At least one agent must participate.'); return; }
          selectedIds.delete(id);
          card.classList.remove('selected');
        } else {
          selectedIds.add(id);
          card.classList.add('selected');
        }
      });
      selectArea.appendChild(card);
    });
  }

  // Replay messages
  if (inProgress) {
    const chat = wrap.querySelector('#chat-area');

    // Show recovery notice if standup was restored from a previous session
    if (state.currentStandup.recovered) {
      const notice = el('div', 'recovery-notice');
      notice.innerHTML = `
        <span>⚡ Standup recovered from your last session — you can pick up right where you left off.</span>
        <button class="btn btn-secondary btn-sm" id="btn-dismiss-recovery">Dismiss</button>`;
      notice.querySelector('#btn-dismiss-recovery').addEventListener('click', () => {
        notice.remove();
        delete state.currentStandup.recovered;
      });
      chat.appendChild(notice);
    }

    state.currentStandup.messages.forEach(m => chat.appendChild(buildMessageEl(m)));
    scrollChat(chat);
    renderQuestionsPanel();
  }

  const btnStart = wrap.querySelector('#btn-start');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      const topic = wrap.querySelector('#standup-topic').value.trim();
      if (!topic) { showToast('Enter a standup topic first.'); return; }
      if (!state.settings.openaiApiKey) { showToast('Add your OpenAI API key in Settings first.'); return; }
      if (selectedIds.size === 0) { showToast('Select at least one agent to participate.'); return; }
      startStandup(topic, [...selectedIds]);
    });
  }

  const btnSend = wrap.querySelector('#btn-send');
  const userMsg = wrap.querySelector('#user-msg');
  if (btnSend && userMsg) {
    btnSend.addEventListener('click', sendUserMessage);
    const mentionDropdown = wrap.querySelector('#mention-dropdown');
    setupMentionAutocomplete(userMsg, mentionDropdown); // handles Enter-to-send and @ dropdown
  }

  const btnEnd = wrap.querySelector('#btn-end');
  if (btnEnd) btnEnd.addEventListener('click', endStandup);

  return wrap;
}

function buildMessageEl(msg) {
  const isUser = msg.agentId === 'brandon';
  const agent  = isUser
    ? { name: 'Brandon', avatar: '👑', color: '#A78BFA', title: 'CEO & Founder' }
    : (AGENTS[msg.agentId] || { name: msg.agentName || '?', avatar: '🤖', color: '#636E7B', title: 'Former Agent' });
  const msgEl  = el('div', `message${isUser ? ' user-message' : ''}`);
  msgEl.innerHTML = `
    <div class="msg-avatar" style="background:${agent.color}22;border-color:${agent.color}44">${agent.avatar}</div>
    <div class="msg-body">
      <div class="msg-header">
        <span style="color:${agent.color}">${agent.name}</span>
        <span class="badge" style="background:${agent.color}22;color:${agent.color}">${agent.title}</span>
        <span class="msg-time">${fmtTime(msg.timestamp)}</span>
      </div>
      <div class="msg-bubble" id="bubble-${msg.id}">${escHtml(msg.content)}</div>
    </div>`;
  // Append document cards for any files attached to this message (live and archived)
  if (msg.files?.length) {
    const msgBody = msgEl.querySelector('.msg-body');
    msg.files.forEach(doc => msgBody.appendChild(renderDocumentCard(doc)));
  }
  return msgEl;
}

function scrollChat(el) { if (el) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50); }

function autoResize(t) {
  t.addEventListener('input', () => { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px'; });
}

function getChat() { return document.getElementById('chat-area'); }

// ── STANDUP LOGIC ─────────────────────────────────────────────────────
async function startStandup(topic, participantIds = [...AGENT_ORDER]) {
  state.currentStandup = {
    id: `standup_${Date.now()}`,
    topic,
    date: new Date().toISOString(),
    messages: [],
    files: [],
    participantIds,   // which agents are in this meeting
    actionItems: [],
    summary: '',
  };
  state.pendingQuestions = [];
  navigate('standup');

  // Opening context message (not from an agent, just sets the stage)
  appendSystemNote(`📋 Standup started: "${topic}"`);

  await runAgentRound();
}

function appendSystemNote(text) {
  const chat = getChat();
  if (!chat) return;
  const note = el('div', '');
  note.style.cssText = 'text-align:center;font-size:11px;color:var(--text3);padding:4px 0 8px;';
  note.textContent = text;
  chat.appendChild(note);
}

async function runAgentRound(targetIds = null) {
  // Only agents who were invited to this standup can speak
  const participants = state.currentStandup?.participantIds || AGENT_ORDER;
  const hasMentions  = targetIds && targetIds.length > 0;

  if (!hasMentions) {
    // Normal round — every participant responds in roster order
    for (const agentId of participants) {
      if (!state.currentStandup) break;
      await runAgentTurn(agentId);
      if (!state.currentStandup) break;
    }
  } else {
    // @mention round — ONLY the mentioned agents respond; everyone else is silent
    const directAgents = participants.filter(id => targetIds.includes(id));
    for (const agentId of directAgents) {
      if (!state.currentStandup) break;
      await runAgentTurn(agentId, false);
      if (!state.currentStandup) break;
    }
  }
}

async function runAgentTurn(agentId, isObserver = false) {
  if (!state.currentStandup) return;
  state.isStreaming    = true;
  state.streamingAgent = agentId;

  const agent = AGENTS[agentId];

  // Activate pill — dim for observers so Brandon can see who was directly addressed
  document.querySelectorAll('.agent-pill').forEach(p => p.classList.remove('active', 'observing'));
  const pill = document.getElementById(`pill-${agentId}`);
  if (pill) pill.classList.add(isObserver ? 'observing' : 'active');

  // Build the transcript for this agent (safe fallback for fired agents in history)
  const systemPrompt = buildSystemPrompt(agentId, isObserver);
  const transcript = state.currentStandup.messages
    .map(m => {
      const name = m.agentId === 'brandon'
        ? `Brandon (CEO)`
        : `${(AGENTS[m.agentId]?.name || m.agentName || '?')} (${(AGENTS[m.agentId]?.title || 'Former Agent')})`;
      return `${name}:\n${m.content}`;
    })
    .join('\n\n---\n\n');

  const userContent = transcript
    ? `STANDUP TOPIC: "${state.currentStandup.topic}"\n\n${transcript}\n\n---\n\nIt's your turn, ${agent.name}. Respond to the conversation above.`
    : `STANDUP TOPIC: "${state.currentStandup.topic}"\n\nYou are first to speak. Kick off the discussion — be specific about ${bizName()} and ask the most important question you need answered.`;

  const messages = [{ role: 'user', content: userContent }];

  // Show typing indicator — use observer styling when not directly addressed
  const chat = getChat();
  const typingEl = el('div', isObserver ? 'message message-observer' : 'message');
  typingEl.id = 'typing-indicator';
  typingEl.innerHTML = `
    <div class="msg-avatar" style="background:${agent.color}22;border-color:${agent.color}44">${agent.avatar}</div>
    <div class="msg-body">
      <div class="msg-header"><span style="color:${agent.color}">${agent.name}</span></div>
      <div class="typing-indicator">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
    </div>`;
  if (chat) { chat.appendChild(typingEl); scrollChat(chat); }

  const msgId  = `msg_${Date.now()}_${agentId}`;
  const msgObj = { id: msgId, agentId, agentName: agent.name, content: '', timestamp: new Date().toISOString() };
  let accumulated = '';

  window.api.openai.removeAllListeners();

  return new Promise(resolve => {
    window.api.openai.onChunk(({ agentId: aid, content }) => {
      if (aid !== agentId) return;
      accumulated += content;

      const typing = document.getElementById('typing-indicator');
      if (typing) {
        typing.id = '';
        typing.className = 'message'; // promote from observer styling once content flows
        typing.querySelector('.msg-body').innerHTML = `
          <div class="msg-header">
            <span style="color:${agent.color}">${agent.name}</span>
            <span class="badge" style="background:${agent.color}22;color:${agent.color}">${agent.title}</span>
            <span class="msg-time">${fmtTime(msgObj.timestamp)}</span>
          </div>
          <div class="msg-bubble" id="bubble-${msgId}"></div>`;
      }
      const bubble = document.getElementById(`bubble-${msgId}`);
      if (bubble) bubble.innerHTML = escHtml(accumulated) + '<span class="msg-cursor"></span>';
      scrollChat(getChat());
    });

    window.api.openai.onDone(async ({ agentId: aid }) => {
      if (aid !== agentId) return;

      // If observer chose to pass, silently remove indicator and skip transcript entry
      if (isObserver && /^\[PASS\]\s*\.?$/i.test(accumulated.trim())) {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
        if (pill) pill.classList.remove('active', 'observing');
        state.isStreaming    = false;
        state.streamingAgent = null;
        const sendBtn = document.getElementById('btn-send');
        if (sendBtn) sendBtn.disabled = false;
        resolve();
        return;
      }

      // ── Document extraction ────────────────────────────────────────────
      const docs = extractDocuments(accumulated, agentId, agent);
      let displayContent = docs.length ? stripDocumentTags(accumulated).trim() : accumulated;
      // If agent produced a doc but zero other text, add a quiet note
      if (!displayContent && docs.length) displayContent = `*(${docs.length} document${docs.length > 1 ? 's' : ''} drafted — see below)*`;

      const bubble = document.getElementById(`bubble-${msgId}`);
      if (bubble) bubble.innerHTML = escHtml(displayContent);

      msgObj.content = displayContent;

      // Save each document to disk and attach to message + standup
      if (docs.length) {
        if (!state.currentStandup.files) state.currentStandup.files = [];
        const savedFiles = [];
        for (const doc of docs) {
          const result = await window.api.fileDoc.save({
            content:   doc.content,
            title:     doc.title,
            type:      doc.type,
            standupId: state.currentStandup.id,
            date:      state.currentStandup.date,
          });
          const fileObj = {
            ...doc,
            standupId: state.currentStandup.id,
            date:      state.currentStandup.date.split('T')[0],
            ...(result.success
              ? { savedPath: result.path, filename: result.filename }
              : { error: result.error }),
          };
          savedFiles.push(fileObj);
          state.currentStandup.files.push(fileObj);
        }
        msgObj.files = savedFiles;
        // Render doc cards under the message bubble
        const msgBody = bubble?.closest('.msg-body');
        if (msgBody) savedFiles.forEach(doc => msgBody.appendChild(renderDocumentCard(doc)));
      }

      state.currentStandup.messages.push(msgObj);

      // Extract and collect questions (use stripped displayContent, not raw)
      const qs = extractQuestions(displayContent, agentId);
      qs.forEach(q => state.pendingQuestions.push(q));
      if (qs.length) renderQuestionsPanel();

      // Persist immediately so a crash/close never loses this message
      await saveCurrentStandup();

      if (pill) pill.classList.remove('active', 'observing');
      state.isStreaming    = false;
      state.streamingAgent = null;

      const sendBtn = document.getElementById('btn-send');
      if (sendBtn) sendBtn.disabled = false;

      resolve();
    });

    window.api.openai.onError(({ agentId: aid, error }) => {
      if (aid !== agentId) return;
      const typing = document.getElementById('typing-indicator');
      if (typing) typing.remove();
      // Only show error messages for directly-addressed agents
      if (!isObserver) {
        const errEl = el('div', 'message');
        errEl.innerHTML = `<div class="msg-bubble" style="border-color:var(--red);color:var(--red)">⚠️ ${error}</div>`;
        if (chat) chat.appendChild(errEl);
      }
      state.isStreaming = false;
      resolve();
    });

    window.api.openai.stream(agentId, messages, systemPrompt);
  });
}

// ── CONTENTEDITABLE INPUT HELPERS ─────────────────────────────────────

// Extract plain text from a contenteditable div, converting mention chips → @Name
function getCEText(el) {
  let text = '';
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    } else if (node.nodeName === 'BR') {
      text += '\n';
    } else if (node.classList?.contains('mention-chip') && node.dataset.agentId) {
      const a = AGENTS[node.dataset.agentId];
      text += a ? `@${a.name}` : node.textContent;
    } else if (node.nodeName === 'DIV' || node.nodeName === 'P') {
      // Browsers wrap newlines in block elements inside contenteditable
      text += '\n' + getCEText(node);
    } else {
      text += node.textContent;
    }
  }
  return text;
}

// Attach @mention autocomplete to a contenteditable element.
// Also owns Enter-to-send so the standalone keydown handler is not needed.
function setupMentionAutocomplete(inputEl, dropdown) {
  // dropdown is passed directly from wrap.querySelector so it works even before
  // the element is appended to the live document.
  if (!dropdown) return;

  // ── helpers ───────────────────────────────────────────────────────────

  // Returns { query, atIndex, node } describing the @word right before the cursor,
  // or null if the cursor isn't inside one.
  function getMentionAtCursor() {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return null;
    const range = sel.getRangeAt(0);
    if (!range.collapsed) return null;
    const container = range.startContainer;
    if (container.nodeType !== Node.TEXT_NODE) return null;
    const textBefore = container.textContent.slice(0, range.startOffset);
    const m = textBefore.match(/@(\w*)$/);
    if (!m) return null;
    return { query: m[1].toLowerCase(), atIndex: range.startOffset - m[0].length, node: container };
  }

  function hideDropdown() {
    dropdown.style.display = 'none';
  }

  function showDropdown(mentionInfo) {
    const participants = state.currentStandup?.participantIds || AGENT_ORDER;
    const filtered = participants
      .map(id => AGENTS[id])
      .filter(a => a && a.name.toLowerCase().startsWith(mentionInfo.query));
    if (!filtered.length) { hideDropdown(); return; }

    dropdown.innerHTML = '';
    filtered.forEach((a, i) => {
      const item = document.createElement('div');
      item.className = 'mention-dropdown-item' + (i === 0 ? ' active' : '');
      item.dataset.agentId = a.id;
      item.innerHTML = `
        <span class="mdi-avatar" style="background:${a.color}22;color:${a.color}">${a.avatar}</span>
        <span class="mdi-body">
          <strong class="mdi-name" style="color:${a.color}">@${a.name}</strong>
          <span class="mdi-role">${a.title}</span>
        </span>`;
      item.addEventListener('mousedown', e => {
        e.preventDefault(); // keep focus on inputEl
        const fresh = getMentionAtCursor();
        if (fresh) insertMentionPill(a.id, fresh);
      });
      dropdown.appendChild(item);
    });
    dropdown.style.display = 'block';
  }

  function insertMentionPill(agentId, mentionInfo) {
    const agent = AGENTS[agentId];
    if (!agent || !mentionInfo) return;
    const { node, atIndex, query } = mentionInfo;

    // Select the @query text and delete it
    const range = document.createRange();
    range.setStart(node, atIndex);
    range.setEnd(node, Math.min(atIndex + 1 + query.length, node.textContent.length));
    range.deleteContents();

    // Build the styled chip (contentEditable=false makes it an atomic unit)
    const chip = document.createElement('span');
    chip.className = 'mention-chip';
    chip.dataset.agentId = agentId;
    chip.contentEditable = 'false';
    chip.textContent = `@${agent.name}`;
    chip.style.color = agent.color;
    range.insertNode(chip);

    // Put a regular space after the chip and move the caret there
    const space = document.createTextNode('\u00a0');
    chip.after(space);
    const newRange = document.createRange();
    newRange.setStart(space, 1);
    newRange.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(newRange);

    hideDropdown();
  }

  // ── event listeners ───────────────────────────────────────────────────

  inputEl.addEventListener('input', () => {
    const m = getMentionAtCursor();
    if (m) showDropdown(m); else hideDropdown();
  });

  // Close dropdown when input loses focus (delay so mousedown on item fires first)
  inputEl.addEventListener('blur', () => setTimeout(hideDropdown, 150));

  inputEl.addEventListener('keydown', e => {
    const isOpen = dropdown.style.display !== 'none';
    const items  = isOpen ? [...dropdown.querySelectorAll('.mention-dropdown-item')] : [];
    const active = isOpen ? dropdown.querySelector('.mention-dropdown-item.active') : null;
    const activeIdx = active ? items.indexOf(active) : 0;

    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[(activeIdx + 1) % items.length];
        active?.classList.remove('active');
        next?.classList.add('active');
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[(activeIdx - 1 + items.length) % items.length];
        active?.classList.remove('active');
        prev?.classList.add('active');
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const agentId = active?.dataset.agentId;
        const m = getMentionAtCursor();
        if (agentId && m) insertMentionPill(agentId, m);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        hideDropdown();
        return;
      }
    }

    // Normal Enter = send (only when dropdown is closed)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage();
    }
  });
}

async function sendUserMessage() {
  if (state.isStreaming || !state.currentStandup) return;
  const inputEl = document.getElementById('user-msg');
  if (!inputEl) return;
  const content = getCEText(inputEl).trim();
  if (!content) return;

  inputEl.innerHTML = '';
  inputEl.focus();

  const msgObj = {
    id: `msg_${Date.now()}_brandon`,
    agentId: 'brandon',
    agentName: 'Brandon',
    content,
    timestamp: new Date().toISOString(),
  };
  state.currentStandup.messages.push(msgObj);

  // Mark any pending questions as answered by this message
  const unanswered = state.pendingQuestions.filter(q => !q.answered);
  if (unanswered.length) {
    // Heuristic: if Brandon sent a message, the oldest unanswered question is "answered"
    // and we save the answer to all agents' knowledge
    unanswered.forEach(q => {
      q.answered = true;
      q.answer   = content;
    });
    // Save this info to all agents as new knowledge
    for (const id of AGENT_ORDER) {
      const questionsText = unanswered
        .map(q => `Q (${q.agentName} asked): "${q.question}" — Brandon answered: "${content}"`)
        .join('\n');
      state.knowledge[id].learnings.push({
        id: `l_qa_${Date.now()}_${id}`,
        date: new Date().toISOString().split('T')[0],
        source: 'qa',
        content: questionsText,
        label: 'Brandon answered a direct question',
      });
      await saveKnowledge(id);
    }
    renderQuestionsPanel();
  }

  // Persist message + question answers before the agent round starts
  await saveCurrentStandup();

  // Activate Brandon pill briefly
  document.querySelectorAll('.agent-pill').forEach(p => p.classList.remove('active'));
  const pill = document.getElementById('pill-brandon');
  if (pill) { pill.classList.add('active'); setTimeout(() => pill.classList.remove('active'), 800); }

  const chat = getChat();
  if (chat) { chat.appendChild(buildMessageEl(msgObj)); scrollChat(chat); }

  const sendBtn = document.getElementById('btn-send');
  if (sendBtn) sendBtn.disabled = true;

  // Parse @agent mentions so we can route to specific team members
  const mentionedIds = parseAgentMentions(content);
  if (mentionedIds.length > 0) {
    const names = mentionedIds.map(id => `@${AGENTS[id].name}`).join(' & ');
    appendSystemNote(`📍 Directed to ${names}`);
  }
  await runAgentRound(mentionedIds.length > 0 ? mentionedIds : null);

  if (sendBtn) sendBtn.disabled = false;
}

async function endStandup() {
  if (!state.currentStandup) return;
  if (state.isStreaming) { showToast('Wait for the current agent to finish first.'); return; }
  if (!state.currentStandup.messages.length) { state.currentStandup = null; navigate('standup'); return; }

  const endBar = document.querySelector('.standup-end-bar');
  if (endBar) endBar.innerHTML = '<span style="color:var(--text2);font-size:12px;padding:8px">⏳ Generating summary…</span>';

  const { topic, messages, id, date, files: standupFiles = [] } = state.currentStandup;
  const result    = await window.api.openai.summarize(messages, topic);
  const summary   = result?.summary   || 'Summary unavailable.';
  const newActions = result?.actionItems || [];

  const standup = { id, topic, date: date.split('T')[0], fullDate: date, messages, files: standupFiles, summary, actionItems: newActions };
  state.standupHistory.push(standup);
  await saveStandupHistory();

  newActions.forEach(text => state.actionItems.push({ text, done: false, standupId: id, date: date.split('T')[0] }));
  await saveActionItems();

  // Save standup summary + any Q&A answers to each agent's knowledge
  for (const id2 of AGENT_ORDER) {
    const k = state.knowledge[id2];

    // Save the standup summary
    k.learnings.push({
      id: `l_standup_${Date.now()}_${id2}`,
      date: date.split('T')[0],
      source: 'standup',
      standupId: id,
      content: `Standup "${topic}": ${summary}`,
      label: `Standup summary — ${date.split('T')[0]}`,
    });

    // Save any action items
    if (newActions.length) {
      k.learnings.push({
        id: `l_actions_${Date.now()}_${id2}`,
        date: date.split('T')[0],
        source: 'standup',
        standupId: id,
        content: `Action items from "${topic}": ${newActions.join(' | ')}`,
        label: 'Action items',
      });
    }

    await saveKnowledge(id2);
  }

  await clearCurrentStandup();   // wipes memory + disk so the completed standup isn't recovered on relaunch

  // Auto-export standup to ~/Documents/RiffAI Standups/
  const exportResult = await window.api.standup.exportMd(standup);

  showSummaryModal(topic, summary, newActions, exportResult, standupFiles);
}

function showSummaryModal(topic, summary, actions, exportResult, files = []) {
  const overlay = el('div', 'modal-overlay');
  const exportHtml = exportResult?.success
    ? `<div class="export-banner export-ok">
        📁 Archived to <strong>${exportResult.filename}</strong>
        <button class="btn btn-secondary btn-sm" id="m-finder" style="margin-left:auto">Open in Finder</button>
       </div>`
    : `<div class="export-banner export-fail">⚠️ Auto-archive failed: ${exportResult?.error || 'Unknown error'}</div>`;

  overlay.innerHTML = `
    <div class="modal">
      <h3>✅ Standup Saved</h3>
      <div style="font-size:13px;color:var(--text2);margin-bottom:10px">
        Topic: <strong style="color:var(--text)">${topic}</strong>
      </div>
      <p>${summary}</p>
      ${actions.length ? `
        <div class="label" style="margin-bottom:8px">Action Items Generated</div>
        <ul>${actions.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
      ${files.length ? `
        <div class="label" style="margin-bottom:8px;margin-top:14px">📁 Documents Created (${files.length})</div>
        <div class="modal-files">
          ${files.map((f, i) => `
            <div class="modal-file-item">
              <span class="modal-file-icon">${docTypeIcon(f.type)}</span>
              <div class="modal-file-info">
                <span class="modal-file-title">${f.title}</span>
                <span class="modal-file-meta">${f.type}${f.filename ? ' · ' + f.filename : ''}</span>
              </div>
              ${f.savedPath ? `<button class="btn btn-secondary btn-sm modal-file-finder" data-idx="${i}">📂</button>` : ''}
            </div>`).join('')}
        </div>` : ''}
      <div style="margin-top:14px;padding:10px;background:var(--bg3);border-radius:6px;font-size:12px;color:var(--text2)">
        🧠 All agents have been updated with this standup's insights and will remember it in future sessions.
      </div>
      ${exportHtml}
      <div class="modal-actions">
        <button class="btn btn-secondary" id="m-files" ${!files.length ? 'style="display:none"' : ''}>View Files</button>
        <button class="btn btn-secondary" id="m-archive">View Archive</button>
        <button class="btn btn-secondary" id="m-dash">Dashboard</button>
        <button class="btn btn-primary" id="m-new">New Standup</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#m-files').addEventListener('click', () => { overlay.remove(); navigate('workspace'); });
  overlay.querySelector('#m-archive').addEventListener('click', () => { overlay.remove(); navigate('archive'); });
  overlay.querySelector('#m-dash').addEventListener('click', () => { overlay.remove(); navigate('dashboard'); });
  overlay.querySelector('#m-new').addEventListener('click', () => {
    overlay.remove();
    if (wouldExceedStandupLimit()) {
      showUpgradeModal(`Free plan allows 1 standup per day. Upgrade to Pro for unlimited daily standups.`);
      return;
    }
    navigate('standup');
  });
  if (exportResult?.success) {
    overlay.querySelector('#m-finder').addEventListener('click', () => window.api.shell.showInFinder(exportResult.path));
  }
  // Wire "Show in Finder" buttons for each doc
  overlay.querySelectorAll('.modal-file-finder').forEach(btn => {
    const idx = parseInt(btn.dataset.idx);
    if (files[idx]?.savedPath) btn.addEventListener('click', () => window.api.shell.showInFinder(files[idx].savedPath));
  });
}

// ── ARCHIVE ───────────────────────────────────────────────────────────
function renderArchive() {
  const wrap = el('div', 'view');
  const sorted = [...state.standupHistory].reverse();

  wrap.innerHTML = `
    <div class="view-header">
      <div class="view-title">Standup Archive</div>
      <div class="view-sub">${sorted.length} standup${sorted.length !== 1 ? 's' : ''} on record — click any to view the full transcript</div>
    </div>`;

  if (!sorted.length) {
    const empty = el('div', 'empty-state');
    empty.innerHTML = `<div class="es-icon">🗂️</div><div class="es-text">No standups archived yet.<br>Complete your first standup and it will appear here.</div>`;
    wrap.appendChild(empty);
    return wrap;
  }

  const list = el('div', 'archive-list');
  sorted.forEach(s => {
    const agents = [...new Set((s.messages || []).map(m => m.agentId).filter(id => id !== 'brandon'))];
    const avatars = agents.map(id => AGENTS[id]?.avatar || '').join(' ');
    const msgCount    = s.messages?.length || 0;
    const actionCount = s.actionItems?.length || 0;
    const fileCount   = s.files?.length || 0;
    const qTag = `QUESTION FOR ${ownerName().toUpperCase()}:`;
    const hasQuestions = (s.messages || []).some(m => m.content?.includes(qTag));

    const card = el('div', 'archive-card');
    card.innerHTML = `
      <div class="archive-card-date">${fmt(s.date)}</div>
      <div class="archive-card-body">
        <div class="archive-card-topic">${s.topic}</div>
        <div class="archive-card-summary">${s.summary || 'No summary available.'}</div>
        <div class="archive-card-meta">
          <span>${avatars} 👑</span>
          <span>·</span>
          <span>${msgCount} message${msgCount !== 1 ? 's' : ''}</span>
          ${actionCount ? `<span>·</span><span>${actionCount} action${actionCount !== 1 ? 's' : ''}</span>` : ''}
          ${fileCount ? `<span>·</span><span style="color:var(--primary)">📄 ${fileCount} file${fileCount !== 1 ? 's' : ''}</span>` : ''}
          ${hasQuestions ? `<span>·</span><span style="color:var(--yellow)">❓ Q&amp;A</span>` : ''}
        </div>
      </div>
      <div class="archive-card-arrow">›</div>`;
    card.addEventListener('click', () => navigate(`standup-detail-${s.id}`));
    list.appendChild(card);
  });

  wrap.appendChild(list);
  return wrap;
}

// ── STANDUP DETAIL ────────────────────────────────────────────────────
function renderStandupDetail(standupId) {
  const standup = state.standupHistory.find(s => s.id === standupId);

  if (!standup) {
    const wrap = el('div', 'view');
    wrap.innerHTML = `<div class="empty-state"><div class="es-icon">🔍</div><div class="es-text">Standup not found.</div></div>`;
    return wrap;
  }

  const wrap = el('div', '');
  wrap.id = 'detail-view';

  const dt = new Date(standup.fullDate || standup.date);
  const dateLabel = dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeLabel = standup.fullDate ? dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

  wrap.innerHTML = `
    <div class="detail-topbar">
      <button class="btn btn-secondary btn-sm" id="btn-back-archive">← Archive</button>
      <div class="detail-topbar-info">
        <div class="detail-topbar-topic">${standup.topic}</div>
        <div class="detail-topbar-meta">${dateLabel}${timeLabel ? ' · ' + timeLabel : ''} · ${standup.messages?.length || 0} messages</div>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-export-md">Export .md</button>
    </div>

    <div class="detail-body">
      <div class="detail-chat" id="detail-chat"></div>

      <div class="detail-sidebar">
        ${standup.summary ? `
          <div class="detail-section-title">Summary</div>
          <div class="detail-summary-card">${standup.summary}</div>` : ''}

        ${standup.actionItems?.length ? `
          <div class="detail-section-title" style="margin-top:18px">Action Items (${standup.actionItems.length})</div>
          <div class="detail-actions-list">
            ${standup.actionItems.map(a => `<div class="detail-action-item">☐ ${a}</div>`).join('')}
          </div>` : ''}

        ${standup.files?.length ? `
          <div class="detail-section-title" style="margin-top:18px">Files (${standup.files.length})</div>
          <div id="detail-files-list"></div>` : ''}

        <div class="detail-section-title" style="margin-top:18px">Participants</div>
        <div class="detail-agents-list">
          <div class="detail-agent-chip" style="border-color:var(--brandon)">👑 Brandon — CEO</div>
          ${[...new Set((standup.messages||[]).map(m=>m.agentId).filter(id=>id!=='brandon'))].map(id => {
            const a = AGENTS[id] || { name: standup.messages.find(m=>m.agentId===id)?.agentName||id, avatar:'🤖', color:'#636E7B', title:'Former Agent' };
            return `<div class="detail-agent-chip" style="border-color:${a.color}">${a.avatar} ${a.name} — ${a.title}</div>`;
          }).join('')}
        </div>
      </div>
    </div>`;

  // Populate transcript
  const chat = wrap.querySelector('#detail-chat');
  if (!standup.messages?.length) {
    chat.innerHTML = '<div class="empty-state"><div class="es-icon">💬</div><div class="es-text">No messages recorded for this standup.</div></div>';
  } else {
    standup.messages.forEach(m => chat.appendChild(buildMessageEl(m)));
  }

  // Populate detail files list
  const filesList = wrap.querySelector('#detail-files-list');
  if (filesList && standup.files?.length) {
    standup.files.forEach(f => {
      const row = el('div', 'detail-file-row');
      row.innerHTML = `
        <span class="detail-file-icon">${docTypeIcon(f.type)}</span>
        <div class="detail-file-info">
          <div class="detail-file-title">${f.title}</div>
          <div class="detail-file-meta">${f.type}${f.agentName ? ' · ' + f.agentName : ''}</div>
        </div>
        ${f.savedPath ? `<button class="btn btn-secondary btn-sm detail-file-btn">📂</button>` : ''}`;
      if (f.savedPath) {
        row.querySelector('.detail-file-btn').addEventListener('click', () => window.api.shell.showInFinder(f.savedPath));
      }
      filesList.appendChild(row);
    });
  }

  wrap.querySelector('#btn-back-archive').addEventListener('click', () => navigate('archive'));
  wrap.querySelector('#btn-export-md').addEventListener('click', async () => {
    const btn = wrap.querySelector('#btn-export-md');
    btn.disabled = true;
    btn.textContent = 'Exporting…';
    const result = await window.api.standup.exportMd(standup);
    if (result.success) {
      showToast(`Exported: ${result.filename}`);
      btn.textContent = 'Open in Finder';
      btn.disabled = false;
      btn.addEventListener('click', () => window.api.shell.showInFinder(result.path), { once: true });
    } else {
      showToast(`Export failed: ${result.error}`);
      btn.textContent = 'Export .md';
      btn.disabled = false;
    }
  });

  return wrap;
}

// ── WORKSPACE / FILES ─────────────────────────────────────────────────
function renderWorkspace() {
  const wrap = el('div', 'view');

  // Collect all files from completed standups + current in-progress standup
  const allFiles = [];
  [...state.standupHistory].reverse().forEach(s => {
    (s.files || []).forEach(f => allFiles.push({ ...f, standupTopic: s.topic }));
  });
  if (state.currentStandup?.files?.length) {
    state.currentStandup.files.forEach(f =>
      allFiles.push({ ...f, standupTopic: `${state.currentStandup.topic} (In Progress)` })
    );
  }

  const totalStandups = state.standupHistory.length + (state.currentStandup ? 1 : 0);
  wrap.innerHTML = `
    <div class="view-header">
      <div class="view-title">Files</div>
      <div class="view-sub">${allFiles.length} document${allFiles.length !== 1 ? 's' : ''} created across ${totalStandups} standup${totalStandups !== 1 ? 's' : ''} — all saved to ~/Documents/RiffAI Standups/files/</div>
    </div>`;

  if (!allFiles.length) {
    const empty = el('div', 'empty-state');
    empty.innerHTML = `
      <div class="es-icon">📁</div>
      <div class="es-text">
        <strong>No documents yet.</strong><br><br>
        Ask your agents to draft scripts, emails, proposals, reports, or any standalone document.
        They'll appear here instantly and be saved to your Mac automatically.<br><br>
        <em>Try: "@Grant, draft a follow-up script for leads who didn't respond"</em>
      </div>`;
    wrap.appendChild(empty);
    return wrap;
  }

  const grid = el('div', 'workspace-grid');
  allFiles.forEach(f => {
    const card = el('div', 'workspace-file-card');
    card.style.borderTop = `3px solid ${f.agentColor || 'var(--border2)'}`;
    card.innerHTML = `
      <div class="workspace-file-header">
        <span class="workspace-file-icon">${docTypeIcon(f.type)}</span>
        <span class="workspace-file-type">${f.type}</span>
      </div>
      <div class="workspace-file-title">${f.title}</div>
      <div class="workspace-file-meta">
        <span style="color:${f.agentColor || 'var(--text2)'}">${f.agentName || '?'}</span>
        <span>·</span>
        <span>${f.date || ''}</span>
      </div>
      <div class="workspace-file-standup" title="${f.standupTopic}">${f.standupTopic}</div>
      <div style="margin-top:10px">
        ${f.savedPath
          ? `<button class="btn btn-secondary btn-sm workspace-file-btn">📂 Show in Finder</button>`
          : `<span style="font-size:11px;color:var(--text3)">⚠️ Not saved to disk</span>`}
      </div>`;
    if (f.savedPath) {
      card.querySelector('.workspace-file-btn').addEventListener('click', () => window.api.shell.showInFinder(f.savedPath));
    }
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
  return wrap;
}

// ── ORG CHART ─────────────────────────────────────────────────────────
function renderOrgChart() {
  const wrap = el('div', 'view');

  // ── Header ──────────────────────────────────────────────────────────
  const headerDiv = el('div', 'view-header');
  headerDiv.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px';
  headerDiv.innerHTML = `
    <div>
      <div class="view-title">Organization Chart</div>
      <div class="view-sub">${bizName()} AI Executive Team</div>
    </div>`;
  const hireBtn = el('button', 'btn btn-primary', '👔 Hire Agent');
  hireBtn.addEventListener('click', () => {
    if (wouldExceedAgentLimit()) {
      showUpgradeModal(`Free plan includes 1 AI agent. Upgrade to Pro to build your full executive team with unlimited agents.`);
      return;
    }
    showHireAgentModal();
  });
  headerDiv.appendChild(hireBtn);
  wrap.appendChild(headerDiv);

  const chart = el('div', 'org-chart');
  const treeRoot = el('div', '');
  treeRoot.style.cssText = 'display:flex;flex-direction:column;align-items:center';

  // ── CEO card (static HTML, no event handlers — CSP-safe) ────────────
  const ceoCard = el('div', 'org-ceo');
  ceoCard.innerHTML = `
    <div style="font-size:32px;margin-bottom:8px">👑</div>
    <div style="font-size:16px;font-weight:900">${ownerName()}</div>
    <div style="font-size:12px;color:var(--text2);margin-top:3px">${state.settings.ownerTitle || 'CEO & Founder'}</div>
    <div style="margin-top:8px"><span class="badge badge-purple">${bizName()}</span></div>`;
  treeRoot.appendChild(ceoCard);

  // ── Recursive hierarchy builder ─────────────────────────────────────
  // Builds a DOM subtree for all agents whose reportsTo === parentId.
  // parentId === 'brandon'  →  agents with no reportsTo (direct CEO reports).
  function buildOrgLevelDOM(parentId, visited) {
    visited = visited || new Set();
    const children = AGENT_ORDER.filter(id => {
      if (visited.has(id)) return false;
      const a = AGENTS[id];
      if (!a) return false;
      const rt = a.reportsTo || '';
      return parentId === 'brandon' ? (!rt || rt === 'brandon') : rt === parentId;
    });
    if (!children.length) return null;
    children.forEach(id => visited.add(id));

    const levelWrap = el('div', '');
    levelWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;width:100%';

    // Vertical line dropping from the parent card
    const vertLine = el('div', '');
    vertLine.style.cssText = 'width:2px;height:28px;background:var(--border2)';
    levelWrap.appendChild(vertLine);

    // Horizontal bar across siblings (first level only, for visual clarity)
    if (parentId === 'brandon' && children.length > 1) {
      const connW = `calc(${children.length} * 180px + ${Math.max(0, children.length - 1)} * 16px)`;
      const hBar = el('div', '');
      hBar.style.cssText = `height:2px;width:${connW};background:var(--border2);max-width:90vw`;
      levelWrap.appendChild(hBar);
    }

    // Row containing each child column
    const row = el('div', '');
    row.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;justify-content:center';

    children.forEach(id => {
      const a = AGENTS[id];
      const k = state.knowledge[id];

      const col = el('div', '');
      col.style.cssText = 'display:flex;flex-direction:column;align-items:center';

      // Short vertical line from horizontal bar (or parent) down to card
      const colLine = el('div', '');
      colLine.style.cssText = 'width:2px;height:28px;background:var(--border2)';
      col.appendChild(colLine);

      // ── Agent card — DOM-built to avoid CSP-blocked inline onclick ──
      const card = el('div', 'org-agent-card');
      card.style.borderTop = `3px solid ${a.color}`;
      card.addEventListener('click', () => navigate(`knowledge-${id}`));

      card.appendChild(el('div', 'org-avatar', a.avatar));
      card.appendChild(el('div', 'org-name', a.name));
      card.appendChild(el('div', 'org-title', a.title));
      card.appendChild(el('div', 'org-stats', `${k?.learnings?.length || 0} knowledge items`));
      card.appendChild(el('div', 'org-model', 'GPT-4o · Always learning'));

      const actions = el('div', 'org-agent-actions');
      const editBtn = el('button', 'btn btn-secondary btn-sm', '✏️ Edit');
      editBtn.addEventListener('click', e => { e.stopPropagation(); showHireAgentModal(id); });
      const fireBtn = el('button', 'btn btn-sm org-fire-btn', '🔥 Fire');
      fireBtn.addEventListener('click', e => { e.stopPropagation(); showFireAgentModal(id); });
      actions.appendChild(editBtn);
      actions.appendChild(fireBtn);
      card.appendChild(actions);
      col.appendChild(card);

      // Recursively append sub-level (agents who report to this agent)
      const subLevel = buildOrgLevelDOM(id, visited);
      if (subLevel) col.appendChild(subLevel);

      row.appendChild(col);
    });

    levelWrap.appendChild(row);
    return levelWrap;
  }

  const firstLevel = buildOrgLevelDOM('brandon');
  if (firstLevel) treeRoot.appendChild(firstLevel);

  chart.appendChild(treeRoot);
  wrap.appendChild(chart);

  // ── Detail / focus cards ────────────────────────────────────────────
  const grid = el('div', 'grid-4');
  grid.style.marginTop = '28px';
  AGENT_ORDER.forEach(id => {
    const a = AGENTS[id];
    if (!a) return;
    const card = el('div', 'card card-sm');
    card.style.borderLeft = `4px solid ${a.color}`;
    const managerLabel = a.reportsTo && AGENTS[a.reportsTo]
      ? ` · Reports to ${AGENTS[a.reportsTo].name}`
      : ' · Direct to Brandon';
    card.innerHTML = `
      <div style="font-size:13px;font-weight:800;margin-bottom:6px">${a.avatar} ${a.name} · ${a.title}</div>
      <div style="font-size:11px;color:var(--text2);line-height:1.7">Focus: ${a.focus || '—'}</div>
      <div style="font-size:10px;color:var(--text3);margin-top:4px">${managerLabel}</div>`;
    grid.appendChild(card);
  });
  wrap.appendChild(grid);

  return wrap;
}

// ── KNOWLEDGE ─────────────────────────────────────────────────────────
function renderKnowledge(agentId) {
  const agent = AGENTS[agentId];
  const k     = state.knowledge[agentId] || { learnings: [], manualNotes: '' };
  const wrap  = el('div', '');

  wrap.innerHTML = `
    <div class="knowledge-header" style="border-top:3px solid ${agent.color}">
      <div class="knowledge-avatar">${agent.avatar}</div>
      <div class="knowledge-meta" style="flex:1">
        <h2 style="color:${agent.color}">${agent.name} — ${agent.title}</h2>
        <p>${k.learnings.length} knowledge items &nbsp;·&nbsp; Grows every standup automatically</p>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0">
        <button class="btn btn-secondary btn-sm" id="btn-edit-agent">✏️ Edit Agent</button>
        <button class="btn btn-sm org-fire-btn" id="btn-fire-agent">🔥 Fire Agent</button>
      </div>
    </div>
    <div class="view" style="padding-top:20px">
      <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:20px">

        <div>
          <div class="dash-section-title">Add Knowledge Manually</div>
          <div class="card">
            <label class="label" for="manual-note">Give ${agent.name} new information directly</label>
            <textarea class="textarea" id="manual-note" rows="5"
              placeholder="e.g. 'Brandon told me we currently have 23 active customers. Biggest bottleneck is getting leads, not servicing them.'">${k.manualNotes || ''}</textarea>
            <div style="margin-top:10px;display:flex;gap:8px;justify-content:flex-end">
              <button class="btn btn-primary btn-sm" id="btn-save-note">Save to ${agent.name}'s Knowledge</button>
            </div>
          </div>

          <div class="dash-section-title" style="margin-top:20px">Agent Persona</div>
          <div class="card card-sm" style="border-left:4px solid ${agent.color}">
            <div style="font-size:11px;color:var(--text2);line-height:1.8;white-space:pre-wrap">${agent.persona.replace(/`/g, '')}</div>
          </div>
        </div>

        <div>
          <div class="dash-section-title" style="display:flex;align-items:center;justify-content:space-between">
            Knowledge Base (${k.learnings.length} items)
            <span style="font-size:11px;color:var(--text3);font-weight:400">Most recent first</span>
          </div>
          <div id="knowledge-list" style="max-height:500px;overflow-y:auto"></div>
        </div>
      </div>
    </div>`;

  const kList = wrap.querySelector('#knowledge-list');
  if (!k.learnings.length) {
    kList.innerHTML = '<div class="empty-state"><div class="es-icon">🧠</div><div class="es-text">No additional knowledge yet.<br>Agents start with a business briefing from doogoodscoopers.com.</div></div>';
  } else {
    [...k.learnings].reverse().forEach(item => {
      const div = el('div', 'knowledge-item');
      div.innerHTML = `
        <div style="font-size:12px;line-height:1.65;white-space:pre-wrap">${item.content}</div>
        <div class="ki-meta">
          <span class="ki-source ${item.source}">${item.label || item.source}</span>
          &nbsp;${item.date}
        </div>`;
      kList.appendChild(div);
    });
  }

  wrap.querySelector('#btn-save-note').addEventListener('click', async () => {
    const note = wrap.querySelector('#manual-note').value.trim();
    if (!note) return;
    if (wouldExceedKnowledgeLimit(note)) {
      showUpgradeModal(`Free plan limits knowledge base entries to ${planLimits().knowledgeBaseChars.toLocaleString()} characters. Upgrade to Pro for unlimited knowledge.`);
      return;
    }
    k.manualNotes = note;
    k.learnings.push({
      id: `l_manual_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      source: 'manual',
      content: note,
      label: 'Manual note from Brandon',
    });
    await saveKnowledge(agentId);
    showToast(`Saved to ${agent.name}'s knowledge.`);
    navigate(`knowledge-${agentId}`);
  });

  wrap.querySelector('#btn-edit-agent').addEventListener('click', () => showHireAgentModal(agentId));
  wrap.querySelector('#btn-fire-agent').addEventListener('click', () => showFireAgentModal(agentId));

  return wrap;
}

// ── SETTINGS ─────────────────────────────────────────────────────────
function renderSettings() {
  const wrap = el('div', 'view');
  const s = state.settings;
  wrap.innerHTML = `
    <div class="view-header">
      <div class="view-title">Settings</div>
      <div class="view-sub">Configure your RiffAI workspace</div>
    </div>
    <div class="settings-section">

      <div class="card mb-6">
        <div style="font-size:15px;font-weight:800;margin-bottom:16px">👤 Your Profile</div>
        <div class="settings-row">
          <label class="label" for="s-owner-name">Your name</label>
          <input type="text" class="input" id="s-owner-name" placeholder="e.g. Brandon" value="${escAttr(s.ownerName)}" maxlength="40" />
        </div>
        <div class="settings-row">
          <label class="label" for="s-owner-title">Your title</label>
          <input type="text" class="input" id="s-owner-title" placeholder="e.g. CEO & Founder" value="${escAttr(s.ownerTitle)}" maxlength="60" />
        </div>
      </div>

      <div class="card mb-6">
        <div style="font-size:15px;font-weight:800;margin-bottom:16px">🏢 Your Business</div>
        <div class="settings-row">
          <label class="label" for="s-biz-name">Business name</label>
          <input type="text" class="input" id="s-biz-name" placeholder="e.g. Sunshine Cleaning Co." value="${escAttr(s.bizName)}" maxlength="80" />
        </div>
        <div class="settings-row">
          <label class="label" for="s-biz-industry">Industry</label>
          <input type="text" class="input" id="s-biz-industry" placeholder="e.g. Pet Services, Home Services, Retail…" value="${escAttr(s.bizIndustry)}" maxlength="60" />
        </div>
        <div class="settings-row">
          <label class="label" for="s-biz-website">Website</label>
          <input type="text" class="input" id="s-biz-website" placeholder="yoursite.com" value="${escAttr(s.bizWebsite)}" />
        </div>
        <div class="settings-row">
          <label class="label" for="s-biz-phone">Phone</label>
          <input type="text" class="input" id="s-biz-phone" placeholder="(555) 000-0000" value="${escAttr(s.bizPhone)}" />
        </div>
        <div class="settings-row">
          <label class="label" for="s-biz-desc">Business description</label>
          <textarea class="textarea" id="s-biz-desc" rows="5"
            placeholder="Describe what your business does, who it serves, pricing, service area, etc. Your agents use this as their core briefing.">${escAttr(s.bizDescription)}</textarea>
        </div>
      </div>

      <div class="card mb-6">
        <div style="font-size:15px;font-weight:800;margin-bottom:16px">🔑 OpenAI API</div>
        <div class="settings-row">
          <label class="label" for="api-key">OpenAI API Key</label>
          <input type="password" class="input" id="api-key" placeholder="sk-…" value="${s.openaiApiKey || ''}" />
          <div style="font-size:11px;color:var(--text3);margin-top:5px">
            Get your key at <a href="#" id="link-openai" style="color:var(--primary)">platform.openai.com/api-keys</a>
          </div>
        </div>
        <div class="settings-row">
          <label class="label" for="model-select">Model</label>
          <select class="input" id="model-select">
            <option value="gpt-4o"       ${(s.model||'gpt-4o')==='gpt-4o'?'selected':''}>GPT-4o (Recommended — fast, smart, best value)</option>
            <option value="gpt-4-turbo"  ${s.model==='gpt-4-turbo'?'selected':''}>GPT-4 Turbo (More thorough reasoning)</option>
            <option value="gpt-4o-mini"  ${s.model==='gpt-4o-mini'?'selected':''}>GPT-4o Mini (Fastest, cheapest)</option>
          </select>
        </div>
      </div>

      <div class="card mb-6">
        <div style="font-size:15px;font-weight:800;margin-bottom:16px">👤 Business Context</div>
        <div class="settings-row">
          <label class="label" for="biz-context">Extra context appended to every agent's briefing</label>
          <textarea class="textarea" id="biz-context" rows="5"
            placeholder="e.g. 'We currently have 23 customers. MRR is $2,400. Our biggest bottleneck is converting leads from the website.'">${s.bizContext || ''}</textarea>
          <div style="font-size:11px;color:var(--text3);margin-top:5px">This is the fastest way to give all 4 agents new information at once.</div>
        </div>
      </div>

      <div class="card mb-6">
        <div style="font-size:15px;font-weight:800;margin-bottom:16px">⚡ Subscription</div>
        ${isPro() ? `
          <div style="display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,rgba(14,165,233,0.15),rgba(124,58,237,0.15));border:1px solid rgba(14,165,233,0.3);border-radius:10px;padding:14px 16px;margin-bottom:12px">
            <div style="font-size:28px">⚡</div>
            <div>
              <div style="font-weight:700;font-size:14px">RiffAI Pro — Active</div>
              <div style="font-size:12px;color:var(--text-muted)">${subscription.email} · Unlimited agents, standups, and knowledge</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-manage-sub">Manage Subscription</button>
        ` : `
          <div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px;margin-bottom:16px">
            <div style="font-size:28px">🆓</div>
            <div>
              <div style="font-weight:700;font-size:14px">Free Plan</div>
              <div style="font-size:12px;color:var(--text-muted)">1 agent · 1 standup/day · 1,000 char knowledge limit</div>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Already subscribed? Enter your email to activate Pro</label>
            <div style="display:flex;gap:8px">
              <input type="email" id="sub-email" class="form-input" placeholder="your@email.com" value="${subscription.email || ''}" style="flex:1">
              <button class="btn btn-secondary btn-sm" id="btn-activate-pro" style="white-space:nowrap">Activate Pro</button>
            </div>
          </div>
          <button class="btn btn-primary" id="btn-upgrade-cta" style="background:linear-gradient(135deg,#0ea5e9,#7c3aed);border:none;width:100%">
            ⚡ Upgrade to Pro — $19/mo
          </button>
        `}
      </div>

      <div class="card mb-6">
        <div style="font-size:15px;font-weight:800;margin-bottom:12px">🗑️ Data</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px">Reset all standup history and agent knowledge. Agents will be re-seeded from doogoodscoopers.com on next launch.</div>
        <button class="btn btn-danger btn-sm" id="btn-clear">Clear All Data</button>
      </div>

      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button class="btn btn-secondary" id="btn-cancel">Cancel</button>
        <button class="btn btn-primary" id="btn-save">Save Settings</button>
      </div>
    </div>`;

  wrap.querySelector('#link-openai').addEventListener('click', e => { e.preventDefault(); window.api.shell.openExternal('https://platform.openai.com/api-keys'); });
  wrap.querySelector('#btn-save').addEventListener('click', async () => {
    state.settings.ownerName     = wrap.querySelector('#s-owner-name').value.trim();
    state.settings.ownerTitle    = wrap.querySelector('#s-owner-title').value.trim();
    state.settings.bizName       = wrap.querySelector('#s-biz-name').value.trim();
    state.settings.bizIndustry   = wrap.querySelector('#s-biz-industry').value.trim();
    state.settings.bizWebsite    = wrap.querySelector('#s-biz-website').value.trim();
    state.settings.bizPhone      = wrap.querySelector('#s-biz-phone').value.trim();
    state.settings.bizDescription = wrap.querySelector('#s-biz-desc').value.trim();
    state.settings.openaiApiKey  = wrap.querySelector('#api-key').value.trim();
    state.settings.model         = wrap.querySelector('#model-select').value;
    state.settings.bizContext    = wrap.querySelector('#biz-context').value.trim();
    await window.api.storage.set('settings', state.settings);
    updateUserCard();
    await updateBusinessBriefingInKnowledge();
    showToast('Settings saved!');
  });
  wrap.querySelector('#btn-cancel').addEventListener('click', () => navigate('dashboard'));

  // Subscription buttons
  if (isPro()) {
    wrap.querySelector('#btn-manage-sub')?.addEventListener('click', () => {
      window.api.shell.openExternal('https://billing.stripe.com/p/login/');
    });
  } else {
    wrap.querySelector('#btn-upgrade-cta')?.addEventListener('click', () => openUpgradeCheckout());
    wrap.querySelector('#btn-activate-pro')?.addEventListener('click', async () => {
      const email = wrap.querySelector('#sub-email')?.value.trim();
      if (!email) { showToast('Enter your email first.'); return; }
      showToast('Checking subscription…');
      const result = await validateSubscription(email);
      if (result?.active) {
        showToast('✅ Pro activated! Enjoy unlimited access.');
        navigate('settings');
      } else if (result) {
        showToast('No active Pro subscription found for that email.');
      } else {
        showToast('Could not connect. Check your internet.');
      }
    });
  }
  wrap.querySelector('#btn-clear').addEventListener('click', async () => {
    if (!confirm('Clear all data and restart setup? This removes all standups, agent knowledge, and your team. You\'ll go through the setup wizard again.')) return;
    // Wipe standup history, action items, and all agent knowledge
    state.standupHistory = []; state.actionItems = [];
    for (const id of AGENT_ORDER) {
      state.knowledge[id] = { learnings: [], manualNotes: '' };
      await saveKnowledge(id);
    }
    // Wipe agents and reset onboarding flag so setup wizard runs again
    AGENTS      = {};
    AGENT_ORDER = [];
    await saveAgents();
    await saveStandupHistory();
    await saveActionItems();
    state.settings.onboardingComplete = false;
    await window.api.storage.set('settings', state.settings);
    await clearCurrentStandup();
    // Re-run onboarding
    renderSidebarAgents();
    document.getElementById('content').innerHTML = '';
    showOnboarding();
  });
  return wrap;
}

// ── HIRE AGENT MODAL ──────────────────────────────────────────────────
function showHireAgentModal(existingAgentId = null) {
  const isEdit    = !!existingAgentId;
  const existing  = isEdit ? AGENTS[existingAgentId] : null;
  const selColor  = { value: existing?.color || AGENT_COLORS[0].color };

  const overlay = el('div', 'modal-overlay');
  overlay.innerHTML = `
    <div class="modal modal-hire">
      <div class="hire-modal-header">
        <h3>${isEdit ? `✏️ Edit ${existing.name}` : '👔 Hire New Agent'}</h3>
        <button class="hire-close-btn" id="hire-close">✕</button>
      </div>

      <div class="hire-form">
        <div class="hire-row-2">
          <div class="settings-row">
            <label class="label" for="hire-name">Name</label>
            <input type="text" class="input" id="hire-name" placeholder="e.g. Sarah" maxlength="24" value="${existing?.name || ''}" />
          </div>
          <div class="settings-row">
            <label class="label" for="hire-title">Title / Role</label>
            <input type="text" class="input" id="hire-title" placeholder="e.g. Chief Technology Officer" value="${existing?.title || ''}" />
          </div>
        </div>

        <div class="hire-row-2">
          <div class="settings-row">
            <label class="label" for="hire-avatar">Avatar <span style="font-weight:400;color:var(--text3)">(emoji)</span></label>
            <input type="text" class="input hire-avatar-input" id="hire-avatar" placeholder="🤖" maxlength="2" value="${existing?.avatar || ''}" />
          </div>
          <div class="settings-row" style="flex:1">
            <label class="label">Color</label>
            <div class="hire-colors" id="hire-colors">
              ${AGENT_COLORS.map(c => `
                <div class="hire-color-swatch${c.color === selColor.value ? ' selected' : ''}"
                     data-color="${c.color}" style="background:${c.color}" title="${c.name}"></div>`).join('')}
            </div>
          </div>
        </div>

        <div class="settings-row">
          <label class="label" for="hire-persona">Persona &amp; Mindset</label>
          <textarea class="textarea" id="hire-persona" rows="8"
            placeholder="Describe how this agent thinks, their philosophy, signature phrases, and communication style. Be specific — this is their system prompt.&#10;&#10;Example: You are Sarah, the Chief Technology Officer at DooGoodScoopers. You think like a Silicon Valley engineer and are obsessed with automation, scalability, and using tech to solve problems. You push for systems over manual effort and always ask: can we automate this?">${existing?.persona || ''}</textarea>
        </div>

        <div class="settings-row">
          <label class="label" for="hire-focus">Focus Areas <span style="font-weight:400;color:var(--text3)">(comma-separated)</span></label>
          <input type="text" class="input" id="hire-focus"
            placeholder="e.g. automation, software tools, website optimization, tech stack"
            value="${existing?.focus || ''}" />
        </div>

        <div class="settings-row">
          <label class="label" for="hire-reports-to">Reports to</label>
          <select class="input" id="hire-reports-to">
            <option value="">Brandon (CEO &amp; Founder) — Direct report</option>
            ${AGENT_ORDER.filter(aid => aid !== existingAgentId).map(aid => {
              const a = AGENTS[aid];
              if (!a) return '';
              return `<option value="${aid}" ${existing?.reportsTo === aid ? 'selected' : ''}>${a.name} — ${a.title}</option>`;
            }).join('')}
          </select>
        </div>
      </div>

      <div class="modal-actions" style="margin-top:20px">
        <button class="btn btn-secondary" id="hire-cancel">Cancel</button>
        <button class="btn btn-primary" id="hire-save">
          ${isEdit ? '💾 Save Changes' : '👔 Hire Agent'}
        </button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // Color swatch picker
  overlay.querySelector('#hire-colors').addEventListener('click', e => {
    const sw = e.target.closest('.hire-color-swatch');
    if (!sw) return;
    selColor.value = sw.dataset.color;
    overlay.querySelectorAll('.hire-color-swatch').forEach(s => s.classList.toggle('selected', s === sw));
  });

  overlay.querySelector('#hire-close').addEventListener('click',  () => overlay.remove());
  overlay.querySelector('#hire-cancel').addEventListener('click', () => overlay.remove());

  overlay.querySelector('#hire-save').addEventListener('click', async () => {
    const name    = overlay.querySelector('#hire-name').value.trim();
    const title   = overlay.querySelector('#hire-title').value.trim();
    const avatar  = overlay.querySelector('#hire-avatar').value.trim() || '🤖';
    const persona = overlay.querySelector('#hire-persona').value.trim();
    const focus     = overlay.querySelector('#hire-focus').value.trim();
    const reportsTo = overlay.querySelector('#hire-reports-to')?.value || null;
    const color     = selColor.value;

    if (!name)    { showToast('Name is required.'); return; }
    if (!title)   { showToast('Title is required.'); return; }
    if (!persona || persona.length < 30) { showToast('Write a more detailed persona (at least a sentence or two).'); return; }

    if (isEdit) {
      AGENTS[existingAgentId] = { ...AGENTS[existingAgentId], name, title, avatar, color, persona, focus, reportsTo: reportsTo || null };
      await saveAgents();
      renderSidebarAgents();
      overlay.remove();
      showToast(`${name} updated.`);
      navigate(`knowledge-${existingAgentId}`);
    } else {
      // Plan limit check
      if (wouldExceedAgentLimit()) {
        overlay.remove();
        showUpgradeModal(`Free plan includes 1 AI agent. Upgrade to Pro to build your full executive team with unlimited agents.`);
        return;
      }
      const base = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
      const id   = base + '_' + Date.now().toString(36).slice(-4);
      AGENTS[id] = { id, name, title, avatar, color, isDefault: false, persona, focus, reportsTo: reportsTo || null };
      AGENT_ORDER.push(id);
      // Seed their knowledge with the business briefing
      state.knowledge[id] = {
        learnings: [{
          id: `l_seed_${id}`,
          date: new Date().toISOString().split('T')[0],
          source: 'system',
          content: buildBusinessBriefing(),
          label: `Initial Business Briefing — ${bizName()}`,
        }],
        manualNotes: '',
      };
      await saveKnowledge(id);
      await saveAgents();
      renderSidebarAgents();
      overlay.remove();
      showToast(`${name} has been hired and briefed on ${bizName()}!`);
      navigate(`knowledge-${id}`);
    }
  });
}

// ── ONBOARDING ─────────────────────────────────────────────────────────
function showOnboarding() {
  const TOTAL = 6;
  const ob = {
    step: 1,
    ownerName: state.settings.ownerName  || '',
    ownerTitle: state.settings.ownerTitle || 'CEO & Founder',
    bizName: state.settings.bizName        || '',
    bizIndustry: state.settings.bizIndustry || '',
    bizDescription: state.settings.bizDescription || '',
    bizWebsite: state.settings.bizWebsite  || '',
    bizPhone: state.settings.bizPhone      || '',
    apiKey: state.settings.openaiApiKey    || '',
    model: state.settings.model            || 'gpt-4o',
    agents: [],
  };

  const overlay = el('div', 'ob-overlay');
  document.body.appendChild(overlay);

  // ── Step renderers ──────────────────────────────────────────────────
  function renderStep1(body) {
    // Use the pre-resolved absolute src from the hidden preload img in index.html
    const logoWrap = el('div', 'ob-logo-wrap');
    const logo = el('img', 'ob-logo');
    logo.alt = 'RiffAI';
    logo.src = getLogoSrc();
    logoWrap.appendChild(logo);
    body.appendChild(logoWrap);
    body.appendChild(el('h1', 'ob-heading', 'Welcome to RiffAI'));
    body.appendChild(el('p', 'ob-sub', 'Your AI-powered executive team — ready to show up to every standup and help you grow your business.'));
    body.appendChild(el('p', 'ob-sub', 'This 2-minute setup personalizes your workspace so your team knows your business inside and out.'));
    const btn = el('button', 'ob-btn-start', "Let's get started →");
    btn.addEventListener('click', () => { ob.step = 2; render(); });
    body.appendChild(btn);
  }

  function renderStep2(body) {
    body.appendChild(el('h2', 'ob-heading', 'Tell us about yourself'));
    body.appendChild(el('p', 'ob-sub', 'Your agents will address you by name in every meeting.'));
    const form = el('div', 'ob-form');
    form.innerHTML = `
      <div class="ob-field">
        <label class="ob-label">Your name</label>
        <input type="text" class="ob-input" id="ob-owner-name" placeholder="e.g. Brandon" value="${escAttr(ob.ownerName)}" maxlength="40" autofocus />
      </div>
      <div class="ob-field">
        <label class="ob-label">Your title</label>
        <input type="text" class="ob-input" id="ob-owner-title" placeholder="e.g. CEO & Founder" value="${escAttr(ob.ownerTitle)}" maxlength="60" />
      </div>`;
    body.appendChild(form);
  }

  function renderStep3(body) {
    const INDUSTRIES = ['Pet Services','Home Services','Landscaping','Cleaning Services','Retail','Restaurant / Food','Health & Wellness','Real Estate','Construction','E-Commerce','Professional Services','Consulting','Technology','Other'];
    body.appendChild(el('h2', 'ob-heading', 'About your business'));
    body.appendChild(el('p', 'ob-sub', 'This becomes your agents\' core knowledge — the more detail you provide, the better their advice.'));
    const form = el('div', 'ob-form');
    form.innerHTML = `
      <div class="ob-field">
        <label class="ob-label">Business name</label>
        <input type="text" class="ob-input" id="ob-biz-name" placeholder="e.g. Sunshine Cleaning Co." value="${escAttr(ob.bizName)}" maxlength="80" autofocus />
      </div>
      <div class="ob-field">
        <label class="ob-label">Industry</label>
        <select class="ob-input" id="ob-biz-industry">
          <option value="">Select an industry…</option>
          ${INDUSTRIES.map(i => `<option value="${i}"${ob.bizIndustry===i?' selected':''}>${i}</option>`).join('')}
        </select>
      </div>
      <div class="ob-field">
        <label class="ob-label">What does your business do?
          <span class="ob-hint"> — be specific: services, pricing, target customers, location</span>
        </label>
        <textarea class="ob-textarea" id="ob-biz-desc" rows="6"
          placeholder="e.g. We provide weekly lawn care for residential homes in Austin, TX. Packages start at $120/month. Our ideal customer is a homeowner aged 35–60 who doesn't want to deal with yard maintenance.">${escAttr(ob.bizDescription)}</textarea>
      </div>
      <div class="ob-row-2">
        <div class="ob-field">
          <label class="ob-label">Website <span class="ob-hint">(optional)</span></label>
          <input type="text" class="ob-input" id="ob-biz-website" placeholder="yoursite.com" value="${escAttr(ob.bizWebsite)}" />
        </div>
        <div class="ob-field">
          <label class="ob-label">Phone <span class="ob-hint">(optional)</span></label>
          <input type="text" class="ob-input" id="ob-biz-phone" placeholder="(555) 000-0000" value="${escAttr(ob.bizPhone)}" />
        </div>
      </div>`;
    body.appendChild(form);
  }

  function renderStep4(body) {
    body.appendChild(el('h2', 'ob-heading', 'Connect OpenAI'));
    body.appendChild(el('p', 'ob-sub', 'RiffAI uses GPT to power your AI team. You\'ll need an API key — takes about 2 minutes to get one if you don\'t have it yet.'));
    const form = el('div', 'ob-form');
    form.innerHTML = `
      <div class="ob-field">
        <label class="ob-label">OpenAI API Key</label>
        <input type="password" class="ob-input" id="ob-api-key" placeholder="sk-…" value="${escAttr(ob.apiKey)}" autofocus />
        <div class="ob-field-hint">
          <a href="#" id="ob-link-openai" class="ob-link">Get a free key at platform.openai.com/api-keys →</a>
        </div>
      </div>
      <div class="ob-field">
        <label class="ob-label">Model</label>
        <select class="ob-input" id="ob-model">
          <option value="gpt-4o"      ${ob.model==='gpt-4o'     ?'selected':''}>GPT-4o — Recommended (fast, smart, best value)</option>
          <option value="gpt-4-turbo" ${ob.model==='gpt-4-turbo'?'selected':''}>GPT-4 Turbo — More thorough reasoning</option>
          <option value="gpt-4o-mini" ${ob.model==='gpt-4o-mini'?'selected':''}>GPT-4o Mini — Fastest, lowest cost</option>
        </select>
      </div>
      <div class="ob-info-box">
        💡 Your API key is stored locally on your Mac only — never shared with RiffAI servers. You pay OpenAI directly. A typical standup costs under $0.10.
      </div>`;
    body.appendChild(form);
    body.querySelector('#ob-link-openai').addEventListener('click', e => {
      e.preventDefault();
      window.api.shell.openExternal('https://platform.openai.com/api-keys');
    });
  }

  function renderStep5(body) {
    body.appendChild(el('h2', 'ob-heading', 'Build your team'));
    body.appendChild(el('p', 'ob-sub', 'Hire your AI executives. Each brings a unique perspective to every standup. You can always adjust your team later.'));

    const listWrap = el('div', 'ob-agent-list');
    body.appendChild(listWrap);

    function refreshList() {
      listWrap.innerHTML = '';
      if (!ob.agents.length) {
        listWrap.innerHTML = '<div class="ob-agent-empty">No agents hired yet — add at least one below.</div>';
        return;
      }
      ob.agents.forEach((a, i) => {
        const card = el('div', 'ob-agent-card');
        const rmBtn = el('button', 'ob-agent-remove', '✕');
        rmBtn.addEventListener('click', () => { ob.agents.splice(i, 1); refreshList(); });
        const avatar = el('span', 'ob-agent-avatar');
        avatar.textContent = a.emoji;
        avatar.style.cssText = `background:${a.color}20;border-color:${a.color}`;
        const info = el('div', 'ob-agent-info');
        info.innerHTML = `<div class="ob-agent-name">${escAttr(a.name)}</div><div class="ob-agent-role">${escAttr(a.title)}</div>`;
        card.appendChild(avatar);
        card.appendChild(info);
        card.appendChild(rmBtn);
        listWrap.appendChild(card);
      });
    }
    refreshList();

    // Preset chips
    const presetRow = el('div', 'ob-preset-row');
    const presetLabel = el('div', 'ob-preset-label', 'Quick add:');
    presetRow.appendChild(presetLabel);
    ONBOARDING_ROLES.forEach(role => {
      const chip = el('button', 'ob-preset-chip');
      chip.textContent = `${role.emoji} ${role.label.replace('Chief ','').replace(' Officer','')}`;
      chip.addEventListener('click', () => openForm(role));
      presetRow.appendChild(chip);
    });
    body.appendChild(presetRow);

    // Add-agent form (hidden until a chip is clicked)
    const formWrap = el('div', 'ob-add-form-wrap');
    formWrap.style.display = 'none';
    body.appendChild(formWrap);

    function openForm(role) {
      const biz     = ob.bizName || 'your business';
      const persona = (role.key !== 'custom' && PERSONA_TEMPLATES[role.key])
        ? PERSONA_TEMPLATES[role.key](biz)
        : '';
      let selColor = role.color;

      formWrap.style.display = 'block';
      formWrap.innerHTML = `
        <div class="ob-add-form">
          <div class="ob-add-form-header">
            <span class="ob-add-form-title">${role.emoji} ${role.label}</span>
            <button class="ob-add-form-close" id="ob-af-x">✕</button>
          </div>
          <div class="ob-row-2">
            <div class="ob-field">
              <label class="ob-label">First name</label>
              <input type="text" class="ob-input" id="ob-af-name" placeholder="e.g. Alex" maxlength="24" autofocus />
            </div>
            <div class="ob-field">
              <label class="ob-label">Title</label>
              <input type="text" class="ob-input" id="ob-af-title" value="${escAttr(role.key !== 'custom' ? role.label : '')}" placeholder="e.g. Chief Marketing Officer" />
            </div>
          </div>
          <div class="ob-row-2">
            <div class="ob-field">
              <label class="ob-label">Avatar (emoji)</label>
              <input type="text" class="ob-input ob-avatar-input" id="ob-af-avatar" value="${role.emoji}" maxlength="2" />
            </div>
            <div class="ob-field">
              <label class="ob-label">Color</label>
              <div class="ob-color-row" id="ob-af-colors">
                ${AGENT_COLORS.map(c => `<div class="ob-color-swatch${c.color===role.color?' selected':''}" data-color="${c.color}" style="background:${c.color}" title="${c.name}"></div>`).join('')}
              </div>
            </div>
          </div>
          <div class="ob-field">
            <label class="ob-label">Persona &amp; Mindset</label>
            <textarea class="ob-textarea" id="ob-af-persona" rows="5"
              placeholder="Describe how this agent thinks, their philosophy, and communication style.">${escAttr(persona)}</textarea>
          </div>
          <div class="ob-field">
            <label class="ob-label">Focus Areas <span class="ob-hint">(comma-separated)</span></label>
            <input type="text" class="ob-input" id="ob-af-focus" placeholder="e.g. content strategy, social media, brand awareness" />
          </div>
          <button class="ob-btn-add-agent" id="ob-af-save">+ Add to Team</button>
        </div>`;

      formWrap.querySelectorAll('.ob-color-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
          selColor = sw.dataset.color;
          formWrap.querySelectorAll('.ob-color-swatch').forEach(s => s.classList.toggle('selected', s === sw));
        });
      });
      formWrap.querySelector('#ob-af-x').addEventListener('click', () => { formWrap.style.display = 'none'; });
      formWrap.querySelector('#ob-af-save').addEventListener('click', () => {
        const name    = formWrap.querySelector('#ob-af-name').value.trim();
        const title   = formWrap.querySelector('#ob-af-title').value.trim();
        const emoji   = formWrap.querySelector('#ob-af-avatar').value.trim() || role.emoji;
        const persona = formWrap.querySelector('#ob-af-persona').value.trim();
        const focus   = formWrap.querySelector('#ob-af-focus').value.trim();
        if (!name)    { showToast('Please enter a name.'); return; }
        if (!title)   { showToast('Please enter a title.'); return; }
        if (!persona || persona.length < 20) { showToast('Please write a short persona description.'); return; }
        const base = name.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,12);
        const id   = base + '_' + Date.now().toString(36).slice(-4);
        ob.agents.push({ id, name, title, emoji, color: selColor, persona, focus });
        formWrap.style.display = 'none';
        refreshList();
      });
      setTimeout(() => formWrap.scrollIntoView({ behavior:'smooth', block:'nearest' }), 50);
    }
  }

  function renderStep6(body) {
    body.appendChild(el('div', 'ob-complete-icon', '✅'));
    body.appendChild(el('h2', 'ob-heading', `You're all set, ${escAttr(ob.ownerName || 'there')}!`));
    body.appendChild(el('p', 'ob-sub', 'Your RiffAI workspace is ready. Your team has been briefed on your business and is waiting in the boardroom.'));
    const summary = el('div', 'ob-summary');
    const rows = [
      ['Business',  ob.bizName || '—'],
      ['Owner',     `${ob.ownerName} · ${ob.ownerTitle}`],
      ['Team',      ob.agents.map(a => a.name).join(', ') || '—'],
      ['Model',     ob.model],
    ];
    rows.forEach(([label, val]) => {
      const row = el('div', 'ob-summary-row');
      row.innerHTML = `<span class="ob-summary-label">${label}</span><span class="ob-summary-val">${escAttr(val)}</span>`;
      summary.appendChild(row);
    });
    body.appendChild(summary);
    body.appendChild(el('p', 'ob-hint-text', 'You can edit any of this later in Settings and the Organization view.'));
    const enterBtn = el('button', 'ob-btn-enter', '🎙️ Enter the Boardroom');
    enterBtn.addEventListener('click', () => finishOnboarding());
    body.appendChild(enterBtn);
  }

  // ── Read helpers ────────────────────────────────────────────────────
  function readStep2() {
    ob.ownerName  = overlay.querySelector('#ob-owner-name')?.value.trim()  || ob.ownerName;
    ob.ownerTitle = overlay.querySelector('#ob-owner-title')?.value.trim() || ob.ownerTitle;
  }
  function readStep3() {
    ob.bizName        = overlay.querySelector('#ob-biz-name')?.value.trim()    || ob.bizName;
    ob.bizIndustry    = overlay.querySelector('#ob-biz-industry')?.value       || ob.bizIndustry;
    ob.bizDescription = overlay.querySelector('#ob-biz-desc')?.value.trim()    || ob.bizDescription;
    ob.bizWebsite     = overlay.querySelector('#ob-biz-website')?.value.trim() || ob.bizWebsite;
    ob.bizPhone       = overlay.querySelector('#ob-biz-phone')?.value.trim()   || ob.bizPhone;
  }
  function readStep4() {
    ob.apiKey = overlay.querySelector('#ob-api-key')?.value.trim() || ob.apiKey;
    ob.model  = overlay.querySelector('#ob-model')?.value          || ob.model;
  }

  // ── Advance (validate + go to next step) ───────────────────────────
  function advance() {
    if (ob.step === 2) {
      readStep2();
      if (!ob.ownerName) { showToast('Please enter your name.'); return; }
    }
    if (ob.step === 3) {
      readStep3();
      if (!ob.bizName) { showToast('Please enter your business name.'); return; }
      if (!ob.bizDescription || ob.bizDescription.length < 20) {
        showToast('Please describe your business — a few sentences is enough.'); return;
      }
    }
    if (ob.step === 4) {
      readStep4();
      if (!ob.apiKey || !ob.apiKey.startsWith('sk-')) {
        showToast('Please enter a valid OpenAI API key (starts with sk-).'); return;
      }
    }
    if (ob.step === 5) {
      if (!ob.agents.length) { showToast('Hire at least one agent to continue.'); return; }
    }
    ob.step++;
    render();
  }

  // ── Finish — persist everything and launch the app ──────────────────
  async function finishOnboarding() {
    state.settings.ownerName        = ob.ownerName;
    state.settings.ownerTitle       = ob.ownerTitle;
    state.settings.bizName          = ob.bizName;
    state.settings.bizIndustry      = ob.bizIndustry;
    state.settings.bizDescription   = ob.bizDescription;
    state.settings.bizWebsite       = ob.bizWebsite;
    state.settings.bizPhone         = ob.bizPhone;
    state.settings.openaiApiKey     = ob.apiKey;
    state.settings.model            = ob.model;
    state.settings.onboardingComplete = true;
    await window.api.storage.set('settings', state.settings);

    const briefing = buildBusinessBriefing();
    const today    = new Date().toISOString().split('T')[0];

    // Wipe any previously loaded agents (e.g. legacy defaults) so only
    // the onboarding team is saved — no duplicates.
    AGENTS      = {};
    AGENT_ORDER = [];

    for (const a of ob.agents) {
      AGENTS[a.id] = {
        id: a.id, name: a.name, title: a.title,
        avatar: a.emoji, color: a.color,
        isDefault: false, persona: a.persona, focus: a.focus, reportsTo: null,
      };
      AGENT_ORDER.push(a.id);
      state.knowledge[a.id] = {
        learnings: [{ id:`l_seed_${a.id}`, date:today, source:'system', content:briefing, label:`Initial Business Briefing — ${ob.bizName}` }],
        manualNotes: '',
      };
      await window.api.storage.set(`knowledge-${a.id}`, state.knowledge[a.id]);
    }
    await saveAgents();
    updateUserCard();
    renderSidebarAgents();
    overlay.remove();
    navigate('dashboard');
  }

  // ── Main render loop ────────────────────────────────────────────────
  function render() {
    overlay.innerHTML = '';
    const container = el('div', 'ob-container');
    overlay.appendChild(container);

    const prog = el('div', 'ob-progress');
    const bar  = el('div', 'ob-progress-bar');
    bar.style.width = Math.round((ob.step / TOTAL) * 100) + '%';
    prog.appendChild(bar);
    container.appendChild(prog);

    if (ob.step > 1 && ob.step < TOTAL) {
      container.appendChild(el('div', 'ob-step-indicator', `Step ${ob.step} of ${TOTAL - 1}`));
    }

    const body = el('div', 'ob-body');
    container.appendChild(body);

    if      (ob.step === 1) renderStep1(body);
    else if (ob.step === 2) renderStep2(body);
    else if (ob.step === 3) renderStep3(body);
    else if (ob.step === 4) renderStep4(body);
    else if (ob.step === 5) renderStep5(body);
    else if (ob.step === 6) renderStep6(body);

    if (ob.step > 1 && ob.step < 6) {
      const nav  = el('div', 'ob-nav');
      const back = el('button', 'ob-btn-back', '← Back');
      back.addEventListener('click', () => { ob.step--; render(); });
      const next = el('button', 'ob-btn-next', ob.step === 5 ? 'Finish Setup →' : 'Continue →');
      next.addEventListener('click', () => advance());
      nav.appendChild(back);
      nav.appendChild(next);
      container.appendChild(nav);
    }
  }

  render();
}

// ── FIRE AGENT MODAL ───────────────────────────────────────────────────
function showFireAgentModal(agentId) {
  const agent = AGENTS[agentId];
  if (!agent) return;
  if (AGENT_ORDER.length <= 1) {
    showToast('You need at least one agent. Hire a replacement first.');
    return;
  }

  const overlay = el('div', 'modal-overlay');
  overlay.innerHTML = `
    <div class="modal" style="max-width:420px">
      <h3 style="color:var(--red)">🔥 Fire ${agent.name}?</h3>
      <p>This will permanently remove <strong style="color:var(--text)">${agent.name}</strong> (${agent.title}) and delete all of their knowledge. They won't participate in future standups.</p>
      <p style="font-size:12px;color:var(--text3);margin-top:-8px">You can always hire a new agent with the same persona later.</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="fire-cancel">Keep Them</button>
        <button class="btn btn-danger" id="fire-confirm">🔥 Fire ${agent.name}</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  overlay.querySelector('#fire-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#fire-confirm').addEventListener('click', async () => {
    const name = agent.name;
    delete AGENTS[agentId];
    AGENT_ORDER = AGENT_ORDER.filter(id => id !== agentId);
    state.knowledge[agentId] = { learnings: [], manualNotes: '' };
    await saveKnowledge(agentId);
    await saveAgents();
    renderSidebarAgents();
    overlay.remove();
    showToast(`${name} has been let go.`);
    navigate('orgchart');
  });
}

// ── TOAST ──────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = el('div', '');
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--bg3);border:1px solid var(--border2);border-radius:8px;padding:10px 18px;font-size:13px;color:var(--text);z-index:999;animation:fadeIn .2s ease;box-shadow:0 4px 20px rgba(0,0,0,.4)';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// ── AUTO-UPDATE UI ────────────────────────────────────────────────────
(function setupAutoUpdater() {
  if (!window.api?.updater) return; // not running in Electron (dev browser preview)

  // Inject the update banner into the DOM once
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.style.cssText = [
    'display:none',
    'position:fixed',
    'bottom:20px',
    'right:20px',
    'z-index:9999',
    'background:linear-gradient(135deg,#0ea5e9,#7c3aed)',
    'color:#fff',
    'padding:14px 20px',
    'border-radius:12px',
    'box-shadow:0 8px 32px rgba(0,0,0,0.5)',
    'font-family:inherit',
    'font-size:14px',
    'max-width:320px',
    'line-height:1.4',
  ].join(';');
  banner.innerHTML = `
    <div style="font-weight:700;margin-bottom:4px" id="update-title">Checking for updates…</div>
    <div id="update-body" style="opacity:0.85;font-size:13px"></div>
    <div style="margin-top:10px;display:flex;gap:8px" id="update-actions"></div>
  `;
  document.body.appendChild(banner);

  const title   = banner.querySelector('#update-title');
  const body    = banner.querySelector('#update-body');
  const actions = banner.querySelector('#update-actions');

  function showBanner(titleText, bodyText, btns = []) {
    title.textContent = titleText;
    body.textContent  = bodyText;
    actions.innerHTML = '';
    btns.forEach(({ label, primary, onClick }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.cssText = [
        'border:none',
        'border-radius:7px',
        'padding:6px 14px',
        'font-size:13px',
        'font-weight:600',
        'cursor:pointer',
        primary ? 'background:#fff;color:#0ea5e9' : 'background:rgba(255,255,255,0.15);color:#fff',
      ].join(';');
      btn.addEventListener('click', onClick);
      actions.appendChild(btn);
    });
    banner.style.display = 'block';
  }

  function hideBanner() { banner.style.display = 'none'; }

  window.api.updater.onStatus((data) => {
    switch (data.status) {
      case 'available':
        showBanner(
          '🚀 Update available',
          `Version ${data.version} is downloading in the background.`,
          [{ label: 'Dismiss', primary: false, onClick: hideBanner }]
        );
        setTimeout(hideBanner, 5000); // auto-hide after 5s
        break;

      case 'downloading':
        showBanner(
          '⬇️ Downloading update…',
          `${data.percent}% complete — it will install when you next quit.`,
          []
        );
        break;

      case 'downloaded':
        showBanner(
          '✅ Update ready to install',
          `Version ${data.version} is ready. Restart RiffAI to apply it.`,
          [
            { label: 'Restart Now', primary: true,  onClick: () => window.api.updater.installNow() },
            { label: 'Later',       primary: false, onClick: hideBanner },
          ]
        );
        break;

      default:
        break; // 'checking' and 'not-available' — stay silent
    }
  });
})();

// ── BOOT ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
