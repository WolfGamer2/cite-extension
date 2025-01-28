chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'findLocation') {
      const summarizedText = request.summarizedText.trim();
      const articleText = document.body.textContent.trim(); 
  
      console.log("Original Article Text:", articleText); 
      console.log("Summarized Text:", summarizedText); 
  
      
      const normalizedArticleText = normalizeText(articleText);
      const normalizedSummarizedText = normalizeText(summarizedText);
  
      console.log("Normalized Article Text:", normalizedArticleText); 
      console.log("Normalized Summarized Text:", normalizedSummarizedText); 
  
      
      const startIndex = normalizedArticleText.indexOf(normalizedSummarizedText);
      if (startIndex === -1) {
        console.log("Could not find the summarized text.");
        sendResponse({ citation: null });
        return;
      }
  
      // percentile cherker
      const words = normalizedArticleText.split(/\s+/); 
      const totalWords = words.length;
      const wordPosition = normalizedArticleText.substring(0, startIndex).split(/\s+/).length;
      const percentile = ((wordPosition / totalWords) * 100).toFixed(2);
  
      // citation
      const citation = `“${summarizedText}” - Retrieved from ${window.location.href}, accessed on ${new Date().toLocaleDateString()}, ~${percentile}% of the article.`;
      console.log("Generated Citation:", citation); 
      sendResponse({ citation });
    }
  });
  
  
  function normalizeText(text) {
    return text
      .toLowerCase() 
      .replace(/\s+/g, ' ') 
      .replace(/[^\w\s]/g, ''); 
  }