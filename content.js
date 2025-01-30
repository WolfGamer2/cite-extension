chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findLocation') {
    const { summarizedText } = request;

    // Get the full text of the article and normalize it
    const articleText = document.body.innerText || document.documentElement.innerText;
    const normalizedArticleText = articleText.trim().toLowerCase().replace(/\s+/g, ' ');

    // Normalize the summarized text and split it into sentences
    const summarizedTextNormalized = summarizedText.trim().toLowerCase().replace(/\s+/g, ' ');
    const summarizedSentences = summarizedTextNormalized.split('.').map(sentence => sentence.trim()).filter(sentence => sentence.length > 0);

    let matchStartIndex = -1;
    let matchEndIndex = -1;

    // Loop through each summarized sentence and find its location in the article
    for (let i = 0; i < summarizedSentences.length; i++) {
      const sentence = summarizedSentences[i];

      // Check if the sentence exists in the article
      const index = normalizedArticleText.indexOf(sentence);
      if (index !== -1) {
        if (matchStartIndex === -1) {
          matchStartIndex = index; // Record the first match index
        }
        matchEndIndex = index + sentence.length; // Record the last match index
      }
    }

    // If we found matches, return an approximate range
    if (matchStartIndex !== -1 && matchEndIndex !== -1) {
      const matchRange = normalizedArticleText.slice(matchStartIndex, matchEndIndex);
      sendResponse({
        citation: `Found the summarized text in the article from approximately ${matchStartIndex} to ${matchEndIndex} characters.`
      });
    } else {
      sendResponse({
        error: "Summarized text not found in the article."
      });
    }
  }
  return true; // Keep the message channel open for async response
});