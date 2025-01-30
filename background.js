// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findLocation') {
    // Forward the message to content script (assuming the content script is already running)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => document.body.innerText
        },
        (results) => {
          if (results && results[0]) {
            const articleText = results[0].result;
            const { summarizedText } = request;
            const startIndex = articleText.indexOf(summarizedText);

            if (startIndex === -1) {
              sendResponse({ error: "Summarized text not found in the article." });
              return;
            }

            const articleLength = articleText.length;
            const percentage = ((startIndex / articleLength) * 100).toFixed(2);
            sendResponse({
              citation: `Found at approximately ${percentage}% of the article: "${summarizedText}"`
            });
          }
        }
      );
    });
  }
  return true;  // Keep the message channel open for async response
});