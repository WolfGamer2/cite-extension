// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const summarizedTextArea = document.getElementById('summarizedText');
  const citationTextArea = document.getElementById('citation');
  const generateButton = document.getElementById('generate');
  const copyButton = document.getElementById('copy');
  const statusText = document.getElementById('status');

  const updateStatus = (message, isError = false) => {
    statusText.textContent = message;
    statusText.style.color = isError ? 'red' : 'green';
  };

  generateButton.addEventListener('click', () => {
    const summarizedText = summarizedTextArea.value.trim();

    if (!summarizedText) {
      updateStatus("Please paste your summarized text.", true);
      return;
    }

    console.log("Sending message to findLocation...");
    
    chrome.runtime.sendMessage({ action: 'findLocation', summarizedText }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
        updateStatus("Error: Could not connect to the extension.", true);
        return;
      }

      if (response && response.citation) {
        citationTextArea.value = response.citation;
        updateStatus("Citation generated successfully!");
      } else if (response && response.error) {
        updateStatus(response.error, true);
      } else {
        updateStatus("Could not locate the text in the article.", true);
      }
    });
  });

  copyButton.addEventListener('click', () => {
    const citation = citationTextArea.value.trim();

    if (citation) {
      navigator.clipboard.writeText(citation).then(() => {
        updateStatus("Citation copied to clipboard!");
      }).catch(() => {
        updateStatus("Failed to copy citation.", true);
      });
    } else {
      updateStatus("No citation to copy.", true);
    }
  });
});