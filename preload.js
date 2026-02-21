const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  storage: {
    get: (key) => ipcRenderer.invoke('storage:get', key),
    set: (key, data) => ipcRenderer.invoke('storage:set', key, data),
  },
  openai: {
    stream: (agentId, messages, systemPrompt) =>
      ipcRenderer.invoke('openai:stream', { agentId, messages, systemPrompt }),
    summarize: (messages, topic) =>
      ipcRenderer.invoke('openai:summarize', { messages, topic }),
    onChunk: (cb) => ipcRenderer.on('openai:chunk', (_, d) => cb(d)),
    onDone: (cb) => ipcRenderer.on('openai:done', (_, d) => cb(d)),
    onError: (cb) => ipcRenderer.on('openai:error', (_, d) => cb(d)),
    removeAllListeners: () => {
      ipcRenderer.removeAllListeners('openai:chunk');
      ipcRenderer.removeAllListeners('openai:done');
      ipcRenderer.removeAllListeners('openai:error');
    },
  },
  shell: {
    openExternal:  (url)      => ipcRenderer.send('shell:open-external', url),
    showInFinder:  (filePath) => ipcRenderer.send('shell:show-item', filePath),
  },
  standup: {
    exportMd: (data) => ipcRenderer.invoke('standup:export-md', data),
  },
  fileDoc: {
    save: (data) => ipcRenderer.invoke('file:save-doc', data),
  },
  updater: {
    onStatus:   (cb) => ipcRenderer.on('updater:status', (_, d) => cb(d)),
    installNow: ()   => ipcRenderer.send('updater:install-now'),
    check:      ()   => ipcRenderer.invoke('updater:check'),
  },
});
