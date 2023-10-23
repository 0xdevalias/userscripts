// logAllNonDefaultPropertiesOfWindow.js
// https://github.com/0xdevalias/userscripts/tree/main/devtools-snippets
// Attempts to enumerate all non default properties of the global 'window' object.

(function () {
    // Ref: https://developer.chrome.com/docs/devtools/console/utilities/
    const chromeDevtoolsUtilityMethods = [
      '$_',
      '$0',
      '$1',
      '$2',
      '$3',
      '$4',
      '$',
      '$$',
      '$x',
      'clear',
      'copy',
      'debug',
      'dir',
      'dirxml',
      'inspect',
      'getEventListeners',
      'keys',
      'monitor',
      'monitorEvents',
      'profile',
      'profileEnd',
      'queryObjects',
      'table',
      'undebug',
      'unmonitor',
      'unmonitorEvents',
      'values'
    ];

    // create an iframe and append to body to load a clean window object, then extract it's properties
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const iframePristineWindowProperties = Object.getOwnPropertyNames(iframe.contentWindow);
    document.body.removeChild(iframe);

    const currentWindowProperties = Object.getOwnPropertyNames(window);

    // filter the list against the properties that exist in the clean window
    const windowPropertiesWithoutDefaults = currentWindowProperties.filter((prop) => !iframePristineWindowProperties.includes(prop));
    const windowPropertiesWithoutDefaultsOrDevToolsUtilities = windowPropertiesWithoutDefaults.filter((prop) => !chromeDevtoolsUtilityMethods.includes(prop));

    console.log(windowPropertiesWithoutDefaults);
    console.log(windowPropertiesWithoutDefaultsOrDevToolsUtilities);

    window.__chromeDevtoolsUtilityMethods = chromeDevtoolsUtilityMethods;
    window.__iframePristineWindowProperties = iframePristineWindowProperties;
    window.__currentWindowProperties = currentWindowProperties;
    window.__windowPropertiesWithoutDefaults = windowPropertiesWithoutDefaults;
    window.__windowPropertiesWithoutDefaultsOrDevToolsUtilities = windowPropertiesWithoutDefaultsOrDevToolsUtilities;
}());
