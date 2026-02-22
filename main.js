const { app, BrowserWindow, ipcMain, shell, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai').default;
const { autoUpdater } = require('electron-updater');

let mainWindow;

// ── STORAGE ───────────────────────────────────────────────────────────
const dataDir = path.join(app.getPath('userData'), 'riffai-data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function storageGet(key) {
  const file = path.join(dataDir, `${key}.json`);
  if (!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { return null; }
}

function storageSet(key, data) {
  const file = path.join(dataDir, `${key}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  return true;
}

// ── WINDOW ────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    backgroundColor: '#0D1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Remove default menu on Mac for cleaner look
  Menu.setApplicationMenu(null);
}

// ── AUTO-UPDATER ───────────────────────────────────────────────────────
autoUpdater.autoDownload = true;        // silently download in background
autoUpdater.autoInstallOnAppQuit = true; // install when user quits naturally

autoUpdater.on('checking-for-update', () => {
  sendUpdateStatus({ status: 'checking' });
});

autoUpdater.on('update-available', (info) => {
  sendUpdateStatus({ status: 'available', version: info.version });
});

autoUpdater.on('update-not-available', () => {
  sendUpdateStatus({ status: 'not-available' });
});

autoUpdater.on('download-progress', (progress) => {
  sendUpdateStatus({ status: 'downloading', percent: Math.round(progress.percent) });
});

autoUpdater.on('update-downloaded', (info) => {
  // Notify renderer so it can hide the download progress banner
  sendUpdateStatus({ status: 'downloaded', version: info.version });

  // Show a native OS dialog — guaranteed to appear regardless of renderer state
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Ready',
    message: `RiffAI ${info.version} is ready to install`,
    detail: 'A new version has been downloaded. Restart now to apply the update, or do it later when you quit.',
    buttons: ['Restart Now', 'Later'],
    defaultId: 0,
    cancelId: 1,
  }).then(({ response }) => {
    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (err) => {
  // Don't surface update errors to users in production — just log them
  console.error('Auto-update error:', err.message);
});

function sendUpdateStatus(data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:status', data);
  }
}

// IPC: renderer can trigger install-and-restart
ipcMain.on('updater:install-now', () => {
  autoUpdater.quitAndInstall();
});

// IPC: renderer can manually check for updates
ipcMain.handle('updater:check', () => {
  autoUpdater.checkForUpdates();
});

app.whenReady().then(() => {
  createWindow();

  // Check for updates 5 seconds after launch (give window time to load),
  // then every 4 hours automatically
  if (app.isPackaged) {
    setTimeout(() => autoUpdater.checkForUpdates(), 5000);
    setInterval(() => autoUpdater.checkForUpdates(), 4 * 60 * 60 * 1000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC: STORAGE ──────────────────────────────────────────────────────
ipcMain.handle('storage:get', (_, key) => storageGet(key));
ipcMain.handle('storage:set', (_, key, data) => storageSet(key, data));

// ── IPC: SHELL ────────────────────────────────────────────────────────
ipcMain.on('shell:open-external', (_, url) => shell.openExternal(url));
ipcMain.on('shell:show-item', (_, filePath) => shell.showItemInFolder(filePath));

// ── IPC: STANDUP FILE EXPORT ──────────────────────────────────────────
ipcMain.handle('standup:export-md', async (_, standup) => {
  try {
    const docsDir = path.join(app.getPath('documents'), 'RiffAI Standups');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

    const dt = new Date(standup.fullDate || standup.date);
    const dateStr = dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const datePart = dt.toISOString().split('T')[0];
    const safeTitle = standup.topic.replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
    const filename  = `${datePart}_${safeTitle}.md`;
    const filepath  = path.join(docsDir, filename);

    const agentMap = {
      alex:    { name: 'Alex',    title: 'Chief Growth Officer',     avatar: '💰' },
      gary:    { name: 'Gary',    title: 'Chief Marketing Officer',  avatar: '📣' },
      jeff:    { name: 'Jeff',    title: 'Chief Operations Officer', avatar: '⚙️' },
      grant:   { name: 'Grant',   title: 'Chief Revenue Officer',    avatar: '🎯' },
      brandon: { name: 'Brandon', title: 'CEO & Founder',            avatar: '👑' },
    };

    let md = `# DooGoodScoopers AI Standup\n\n`;
    md += `**Topic:** ${standup.topic}\n`;
    md += `**Date:** ${dateStr} at ${timeStr}\n`;
    md += `**Messages:** ${standup.messages?.length || 0} &nbsp;·&nbsp; **Actions Generated:** ${standup.actionItems?.length || 0}\n\n`;
    md += `---\n\n`;

    if (standup.summary) {
      md += `## Summary\n\n${standup.summary}\n\n`;
    }

    if (standup.actionItems?.length) {
      md += `## Action Items\n\n`;
      standup.actionItems.forEach(item => { md += `- [ ] ${item}\n`; });
      md += `\n`;
    }

    md += `---\n\n## Full Transcript\n\n`;
    (standup.messages || []).forEach(msg => {
      const a    = agentMap[msg.agentId] || { name: msg.agentName || 'Unknown', title: '', avatar: '🤖' };
      const time = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : '';
      md += `### ${a.avatar} ${a.name} — ${a.title}${time ? `  ·  ${time}` : ''}\n\n`;
      md += `${msg.content}\n\n`;
      md += `---\n\n`;
    });

    md += `*Generated by RiffAI · doogoodscoopers.com*\n`;
    fs.writeFileSync(filepath, md, 'utf8');
    return { success: true, path: filepath, filename, docsDir };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ── IPC: DOCUMENT FILE SAVE ───────────────────────────────────────────
ipcMain.handle('file:save-doc', async (_, { content, title, type, standupId, date }) => {
  try {
    const filesDir = path.join(app.getPath('documents'), 'RiffAI Standups', 'files');
    if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir, { recursive: true });

    const dateStr  = (date || new Date().toISOString()).split('T')[0];
    const slug     = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
    const filename = `${dateStr}_${slug}.md`;
    const filepath = path.join(filesDir, filename);

    const md = `# ${title}\n\n**Type:** ${type}  \n**Date:** ${dateStr}  \n**Standup ID:** ${standupId || '—'}\n\n---\n\n${content}\n\n---\n*Generated by RiffAI · doogoodscoopers.com*\n`;
    fs.writeFileSync(filepath, md, 'utf8');
    return { success: true, path: filepath, filename, filesDir };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ── IPC: OPENAI STREAMING ─────────────────────────────────────────────
ipcMain.handle('openai:stream', async (event, { messages, systemPrompt, agentId }) => {
  const settings = storageGet('settings') || {};
  const apiKey = settings.openaiApiKey;

  if (!apiKey) {
    event.sender.send('openai:error', { agentId, error: 'No API key set. Go to Settings to add your OpenAI API key.' });
    return;
  }

  const openai = new OpenAI({ apiKey });

  try {
    const stream = await openai.chat.completions.create({
      model: settings.model || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
      max_tokens: 2500,
      temperature: 0.85,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        event.sender.send('openai:chunk', { agentId, content });
      }
    }
    event.sender.send('openai:done', { agentId });

  } catch (err) {
    event.sender.send('openai:error', { agentId, error: err.message });
  }
});

// ── IPC: SUMMARY GENERATION ───────────────────────────────────────────
ipcMain.handle('openai:summarize', async (event, { messages, topic }) => {
  const settings = storageGet('settings') || {};
  const apiKey = settings.openaiApiKey;
  if (!apiKey) return { summary: 'No API key set.', actionItems: [] };

  const openai = new OpenAI({ apiKey });

  const prompt = `You are summarizing a business standup meeting for DooGoodScoopers, a pet waste removal company in the Inland Empire, CA.

Topic: ${topic}

Meeting transcript:
${messages.map(m => `${m.agentName}: ${m.content}`).join('\n\n')}

Please provide:
1. A concise summary (2-3 sentences) of the key decisions and insights from this standup.
2. A list of specific, actionable next steps (bullet points, max 6 items).

Format your response as JSON: { "summary": "...", "actionItems": ["...", "..."] }`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 600,
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (e) {
    return { summary: 'Summary could not be generated.', actionItems: [] };
  }
});
