# 🎙️ RiffAI

Your personal AI team standup suite for DooGoodScoopers. Run standups with AI agents — Alex (Growth), Gary (Marketing), Jeff (Operations), and Grant (Revenue) — all modeled after the most successful business minds.

---

## Prerequisites

You need **Node.js** installed. Check by running in Terminal:
```
node --version
```
If not installed, download from: https://nodejs.org (get the LTS version)

---

## Setup (One Time)

1. Move the `RiffAI` folder to wherever you want it (e.g. your Desktop or Documents)

2. Open **Terminal** and navigate to the folder:
```
cd ~/Desktop/RiffAI
```

3. Install dependencies:
```
npm install
```

4. Launch the app:
```
npm start
```

5. Go to **Settings** (bottom-left sidebar) and paste in your **OpenAI API key**.
   - Get one at: https://platform.openai.com/api-keys
   - You'll need a paid account — GPT-4o usage costs ~$0.01–0.05 per standup

---

## Running the App After Setup

Every time you want to open it:
```
cd ~/Desktop/RiffAI
npm start
```

---

## Build as a macOS App

To install RiffAI as a proper Mac app, double-click **`BUILD-MAC.command`** from Finder. It will build a `RiffAI.dmg` in the `dist/` folder — open the DMG and drag RiffAI into your Applications folder.

---

## Features

### 🎯 Standup Room
- Enter a topic, hit **Start Standup**
- All agents respond in sequence, streaming live
- **@mention** a specific agent to direct your message to them only (e.g. `@Gary`)
- **Interject anytime** — type your message and hit Send
- Hit **End & Save Standup** when done — auto-generates a summary + action items

### ⚡ Dashboard
- See all past standups, pending action items, and agent stats
- Check off action items as you complete them

### 🏢 Organization Chart
- Visual hierarchy with you (Brandon) at the top
- Agents can report to other agents — set this when hiring or editing
- Click any agent card to view their knowledge

### 🧠 Agent Knowledge
- Each agent accumulates knowledge from every standup automatically
- Manually add notes directly to any agent's knowledge base
- Knowledge is loaded into every agent's context at the start of each standup

### 📁 Files
- Documents drafted by agents (scripts, emails, SOPs, etc.) are saved here
- All files also exported to `~/Documents/RiffAI Standups/files/`

### ⚙️ Settings
- Swap between GPT-4o, GPT-4 Turbo, and GPT-4o Mini
- Add custom business context appended to all agents
- Clear data if needed

---

## Your Agents

| Agent | Role | Modeled After |
|-------|------|---------------|
| 💰 Alex | Chief Growth Officer | Alex Hormozi |
| 📣 Gary | Chief Marketing Officer | Gary Vaynerchuk |
| ⚙️ Jeff | Chief Operations Officer | Jeff Bezos |
| 🎯 Grant | Chief Revenue Officer | Grant Cardone |

---

## Data Storage

All your standup history, action items, and agent knowledge are stored locally on your Mac at:
```
~/Library/Application Support/riffai/riffai-data/
```
Nothing is sent anywhere except the OpenAI API for generating responses.

---

## Cost Estimate

Using GPT-4o:
- ~1,000–3,000 tokens per standup (~$0.01–0.05)
- At 5 standups/week: ~$1–2/month in API costs

---

Built for Brandon — DooGoodScoopers CEO 🎙️
