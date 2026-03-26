const dpDescriptions = {
  DP1: "Only the opt-in option is present on the initial cookie dialog.",
  DP2: "Accept button more prominent than reject",
  DP3: "Dialog obstructs most of the window.",
  DP4: "Dialog text is difficult to read/comprehend.",
  DP5: "Reject option obstructed or hidden",
  DP6: "Ambiguous close button is present on the dialog.Options pre-selected by default",
  DP7: "Multiple distinct cookie dialogs present on a page.",
  DP8: "At least one preference slider is enabled by default.",
  DP9: "Clicking the close button leads to more ID- like cookies being set.",
  DP10: "More clicks to Opt-out than Opt-in or Opt-out option is not visible.",
  DP11: "Clicking the Opt-out button leads to more ID- like cookies being set.",
  DP12: "Poorly labelled preference sliders.",
  DP13: "The standard meaning of the Opt-in and Opt-out buttons is inverted.",
  DP14: "Opt-out button is named to guilt the user for selecting it",
  DP15: "When the user clicks the Opt-out button they are asked to confirm their choice"
};

async function init() {
  // Get current tab's domain
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const domain = new URL(tab.url).hostname.replace(/^www\./, "");
  const content = document.getElementById("content");

  // Load the JSON
  const response = await fetch(chrome.runtime.getURL("dataset.json"));
  const data = await response.json();

  if (data.type === "NO_DATA") {
    content.innerHTML = `<p class="no-data">This site is not in the dataset.</p>`;
    return;
  }

  // look for matching data for URL in dataset
  const match = data[domain];

  // display severity and clicks
  document.getElementById("severity").textContent =
    `severity: ${match.severity}`;
  document.getElementById("clicks").textContent =
    match.clicks_to_reject ?? "N/A";

  // get DPs from dataset
    const patternKeys = Object.keys(match.patterns).filter(k => match.patterns[k]);

  if (match) {
    // document.getElementById('result').innerText = JSON.stringify(match, null, 2);
    if (patternKeys.length === 0) {
      content.innerHTML = `<p class="clean">No dark patterns detected on this site.</p>`;
      return;
    }
    // count how many DPs
    document.getElementById("count").textContent =
      `${patternKeys.length} dark pattern${patternKeys.length !== 1 ? "s" : ""} found`;
    //format DP info
    const patternsHtml = patternKeys
      .map(
        (dp) => `
            <div class="pattern-card">
                <h2>${dp}</h2>
                <p>${dpDescriptions[dp] ?? "No description available."}</p>
            </div>
        `,
      )
      .join("");

    // content.innerHTML = `
    //         <div class="patterns-list">${patternsHtml}</div>
    //     `;
      document.getElementById('patterns').innerHTML = patternsHtml;
  } else {
    document.getElementById("content").innerText =
      "No data found for this domain.";
  }
}

init();
