chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Wait until the page is fully loaded
    if (changeInfo.status !== 'complete' || !tab.url) return;

    const domain = new URL(tab.url).hostname.replace(/^www\./, '');

    const response = await fetch(chrome.runtime.getURL('dataset.json'));
    const data = await response.json();

    const match = data[domain];

    if (match) {
        await chrome.action.openPopup();
    }
});