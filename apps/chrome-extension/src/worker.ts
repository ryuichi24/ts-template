chrome.action.onClicked.addListener((tab) => {
  if (typeof tab.id === "number") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      // files: ["content.js"],
      func: () => {
        alert("Hello from the content script!");
      },
    });
  }
});

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const url = details.url;
    const domain = new URL(url).hostname;
    const requestLog = {
      id: crypto.randomUUID(),
      url,
      domain,
      timestamp: Date.now(),
      type: details.type,
    };

    console.log("Request completed:", requestLog);
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame"],
  },
  [],
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url || !tab.url) {
    return;
  }
  
  const url = tab.url;
  const domain = new URL(url).hostname;
  const requestLog = {
    id: crypto.randomUUID(),
    url,
    domain,
    timestamp: Date.now(),
    headers: {},
    type: "spa_navigation",
  };

  console.log("Request completed:", requestLog);
});

// for development
chrome.commands.onCommand.addListener((command) => {
  if (command === "reload") {
    console.log("Reloading the extension...");
    chrome.runtime.reload();
  }
});

console.log("Worker script loaded");
