// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const summarizedTextArea = document.getElementById('summarizedText');
    const citationTextArea = document.getElementById('citation');
    const generateButton = document.getElementById('generate');
    const copyButton = document.getElementById('copy');
    const statusText = document.getElementById('status');
  
    
    generateButton.addEventListener('click', () => {
      const summarizedText = summarizedTextArea.value.trim();
  
      if (!summarizedText) {
        statusText.textContent = "Please paste your summarized text.";
        return;
      }
  
      
      chrome.runtime.sendMessage({ action: 'findLocation', summarizedText }, (response) => {
        if (response && response.citation) {
          citationTextArea.value = response.citation; // show citation in the popup
          statusText.textContent = "Citation generated successfully!";
        } else {
          statusText.textContent = "Could not locate the text in the article.";
        }
      });
    });
  
    
    copyButton.addEventListener('click', () => {
      const citation = citationTextArea.value;
      if (citation) {
        navigator.clipboard.writeText(citation).then(() => {
          statusText.textContent = "Citation copied to clipboard!";
        }).catch(() => {
          statusText.textContent = "Failed to copy citation.";
        });
      } else {
        statusText.textContent = "No citation to copy.";
      }
    });
  });