document.getElementById('downloadBtn').addEventListener('click', () => {
  console.log("Download button clicked in popup.js");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Querying active tab.");
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError.message);
      } else {
        console.log("content.js injection requested.");
      }
    });
  });
});
