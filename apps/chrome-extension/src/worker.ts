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

chrome.commands.onCommand.addListener((command) => {
  if (command === "reload") {
    console.log("Reloading the extension...");
    chrome.runtime.reload();
  }
});

console.log("Worker script loaded");