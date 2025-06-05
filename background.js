chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "setVolume") {
    chrome.scripting.executeScript({
      target: { tabId: msg.tabId },
      func: (volume) => {
        const mediaElements = document.querySelectorAll('video, audio');
        mediaElements.forEach(el => el.volume = volume);
      },
      args: [msg.volume]
    });
  }
});
