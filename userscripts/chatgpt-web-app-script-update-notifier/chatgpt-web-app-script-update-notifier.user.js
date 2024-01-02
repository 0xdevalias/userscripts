// ==UserScript==
// @name          ChatGPT Web App Script Update Notifier
// @description   Checks if the ChatGPT web app scripts have changed, and notifies the user if they have
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/chatgpt-web-app-script-update-notifier/chatgpt-web-app-script-update-notifier.user.js
// @namespace     https://www.devalias.net/
// @version       0.2-alpha
// @match         https://chat.openai.com/*
// @exclude       https://chat.openai.com/auth/login
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_registerMenuCommand
// @grant         GM_setClipboard
// @grant         GM_addValueChangeListener
// @grant         GM_notification
// ==/UserScript==

// TODO: It would be useful if we processed the _buildManifest.js file and extracted all of the script URLs from that as well

// TODO: I think different pages will preload different scripts, which has this notifying more often than it needs to.. (EDIT: Maybe not anymore since I added the Set/merge code)
//   Can we maybe make the logic smarter so it just adds to the stored scripts if there is a new one found?
//   It looks like the main differences seem to be with:
//     https://chat.openai.com/_next/static/chunks/pages/index-b4d7c4fc4ceeb809.js
//     https://chat.openai.com/_next/static/chunks/pages/c/%5BchatId%5D-30b3d2c0863bd449.js
//   Or maybe we can just have it check if the manifest has changed maybe?
//     https://chat.openai.com/_next/static/a3Jc7aP-UMfeR9s4-iLvW/_buildManifest.js
//     https://chat.openai.com/_next/static/a3Jc7aP-UMfeR9s4-iLvW/_ssgManifest.js

// TODO: Can we push the updated script files into a GitHub repo?
//   ChatGPT: https://chat.openai.com/c/c35a0ecc-ecbe-4b62-86be-94122cc0de87
//   https://github.com/isomorphic-git/isomorphic-git

// TODO: Can we then do some processing on the JS callgraph of the code?
//   https://github.com/Persper/js-callgraph
//   https://github.com/scottrogowski/code2flow

// TODO: ChatGPT - Code Deepdive - 20230614: https://docs.google.com/document/d/1oVi4zLWHaq8AUN6HJSYxnotVpztZEZsbT_Cd82wUB20/edit#heading=h.pz5pe0bnth8j

(function () {
  // Function to retrieve the last saved script URLs
  function getLastScriptData() {
    const lastData = GM_getValue("lastScriptData", []);
    return Array.isArray(lastData) ? lastData : [];
  }

  // Function to save the current script URLs
  function saveScriptData(scriptData) {
    GM_setValue("lastScriptData", scriptData);
  }

  function copySavedScriptURLsToClipboard() {
    const lastData = getLastScriptData();
    const lastUrls = lastData.map((entry) => entry.url);

    if (!Array.isArray(lastUrls) || lastUrls.length === 0) {
      GM_notification({
        title: "No saved ChatGPT script URLs to copy to clipboard",
        text: "There were no saved ChatGPT script URLs to be copied to the clipboard",
        timeout: 5000,
      });

      return;
    }

    GM_setClipboard(lastUrls.join("\n"), "text/plain");

    GM_notification({
      title: "ChatGPT script URLs copied to clipboard",
      text: "The saved ChatGPT script URLs were copied to the clipboard",
      timeout: 5000,
    });
  }

  function copySavedScriptDataToClipboard() {
    const lastData = getLastScriptData();

    if (!Array.isArray(lastData) || lastData.length === 0) {
      GM_notification({
        title: "No saved ChatGPT script data to copy to clipboard",
        text: "There was no saved ChatGPT script data to be copied to the clipboard",
        timeout: 5000,
      });

      return;
    }

    const dataStr = JSON.stringify(lastData, null, 2);
    GM_setClipboard(dataStr, "text/plain");

    GM_notification({
      title: "ChatGPT script data copied to clipboard",
      text: "The saved ChatGPT script data were copied to the clipboard",
      timeout: 5000,
    });
  }

  function clearSavedScriptData() {
    GM_deleteValue("lastScriptData");

    GM_notification({
      title: "Saved ChatGPT script data cleared",
      text: "The saved ChatGPT script data was cleared from storage",
      timeout: 5000,
    });
  }

  function mergeAndSortScriptData(dataChunks) {
    // Prepare a Map where keys are URLs and values are their dates
    const dataMap = new Map();

    // Function to add data to the Map. If the URL already exists, it checks and keeps the oldest date.
    const addToMap = ({ url, date }) => {
      const existingDate = dataMap.get(url);

      // If the URL does not exist in the map or the new date is older than the existing one, add/replace the data
      if (!existingDate || new Date(date) < new Date(existingDate)) {
        dataMap.set(url, date);
      }
    };

    // Add all entries from the provided data chunks to the Map
    for (const chunk of dataChunks) {
      chunk.forEach(addToMap);
    }

    // Convert the Map back to an array and sort it first by date (oldest first), then by URL alphabetically,
    // while keeping URLs containing _ssgManifest.js or _buildManifest.js after all others.
    const sortedData = Array.from(dataMap, ([url, date]) => ({
      url,
      date,
    })).sort((a, b) => {
      const dateComparison = new Date(a.date) - new Date(b.date);

      // If the dates are equal, compare URLs
      if (dateComparison === 0) {
        const aIsSpecial =
          a.url.includes("_ssgManifest.js") ||
          a.url.includes("_buildManifest.js");
        const bIsSpecial =
          b.url.includes("_ssgManifest.js") ||
          b.url.includes("_buildManifest.js");

        if (aIsSpecial && !bIsSpecial) {
          return 1; // a should come after b
        } else if (!aIsSpecial && bIsSpecial) {
          return -1; // a should come before b
        } else {
          return a.url.localeCompare(b.url);
        }
      }

      return dateComparison;
    });

    return sortedData;
  }

  function cleanExistingSavedData() {
    // Retrieve the last saved script data
    const lastScriptData = getLastScriptData();

    // Deduplicate and sort the existing data
    const cleanedScriptData = mergeAndSortScriptData([lastScriptData]);

    // Save the cleaned data
    saveScriptData(cleanedScriptData);

    // Send notification
    GM_notification({
      title: "Saved ChatGPT script data cleaned",
      text: "The saved ChatGPT script data was deduplicated and sorted successfully.",
      timeout: 5000,
    });
  }

  GM_registerMenuCommand(
    "Copy ChatGPT script URLs to clipboard",
    copySavedScriptURLsToClipboard,
  );

  GM_registerMenuCommand(
    "Copy ChatGPT script data to clipboard",
    copySavedScriptDataToClipboard,
  );

  GM_registerMenuCommand("Clear saved script data", clearSavedScriptData);

  GM_registerMenuCommand(
    "Clean (deduplicate/sort) saved script data",
    cleanExistingSavedData,
  );

  // Listen for changes to the saved script URLs
  // TODO: i'm not sure if this is actually working properly at the moment..
  GM_addValueChangeListener(
    "lastScriptURLs",
    (name, oldValue, newValue, remote) => {
      // Ignore changes from remote scripts
      if (remote) return;

      // Compare the new script URLs with the previous saved ones
      const updatedURLs = newValue.filter((url) => !oldValue.includes(url));

      // If there are updated URLs, send a notification
      if (updatedURLs.length > 0) {
        console.log("SHOW URLS CHANGED NOTIFICATION 2");
        GM_notification({
          title: "Script URL Update",
          text: `The following script URLs have been updated:\n${updatedURLs.join(
            "\n",
          )}`,
          timeout: 5000,
        });
      }
    },
  );

  // Extract all script URLs from the head of the page and decode them
  const scriptURLs = Array.from(
    document.head.getElementsByTagName("script"),
    (element) => decodeURIComponent(element.src),
  ).filter(
    (url) =>
      url !== "" &&
      (url.startsWith("https://chat.openai.com/") ||
        url.startsWith("https://cdn.oaistatic.com/")),
  );

  // console.log('scriptURLs', scriptURLs);

  // Retrieve the last saved script data
  const lastScriptData = getLastScriptData();

  // Create a Set of the last saved URLs
  const lastScriptURLs = new Set(lastScriptData.map((entry) => entry.url));

  // Find the changed URLs (new URLs that are not in the last saved URLs)
  const changedURLs = scriptURLs.filter((url) => !lastScriptURLs.has(url));

  // Prepare new script data for changed URLs only
  const newScriptData = changedURLs.map((url) => ({
    url,
    date: new Date().toISOString(),
  }));

  // Merge the last saved URLs with the new script URLs and sort
  const mergedData = mergeAndSortScriptData([lastScriptData, newScriptData]);

  // Save the merged data
  saveScriptData(mergedData);

  // Notify the user if there are changed URLs
  if (changedURLs.length > 0) {
    console.log("SHOW URLS CHANGED NOTIFICATION 1");
    GM_notification({
      title: "Script URL Change",
      text: `The following script URLs have changed:\n${changedURLs.join(
        "\n",
      )}`,
      timeout: 5000,
    });
  }
})();
