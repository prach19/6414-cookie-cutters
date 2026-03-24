const dpDescriptions = {
    DP1: 'No reject button present',
    DP2: 'Accept button more prominent than reject',
    DP3: 'Visual misdirection in button design',
    DP4: 'High number of clicks to reject',
    DP5: 'Reject option obstructed or hidden',
    DP6: 'Options pre-selected by default',
    DP7: 'Misleading button text',
    DP8: 'Forced action to continue',
    DP9: 'Confirmshaming language used',
    DP10: 'Tracking continues after opt-out',
    DP11: 'Interface interferes with rejection',
    DP12: 'Hidden costs or consequences',
};

async function init() {
    // Get current tab's domain
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const domain = new URL(tab.url).hostname.replace(/^www\./, '');

    // Load the JSON
    const response = await fetch(chrome.runtime.getURL('dataset.json'));
    const data = await response.json();

    // Direct key lookup
    const match = data[domain];

    if (match) {
        document.getElementById('result').innerText = JSON.stringify(match, null, 2);
    } else {
        document.getElementById('result').innerText = 'No data found for this domain.';
    }
}

init();