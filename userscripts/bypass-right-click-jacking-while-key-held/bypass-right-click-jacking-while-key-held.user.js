// ==UserScript==
// @name          Bypass Right-Click Jacking (While Key Held)
// @description   Bypass right-click jacking to restore the native browser context menu. While holding a modifier key (default: Alt), right-click to temporarily override site scripts that hijack the menu.
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/bypass-right-click-jacking-while-key-held/bypass-right-click-jacking-while-key-held.user.js
// @updateURL     https://github.com/0xdevalias/userscripts/raw/main/userscripts/bypass-right-click-jacking-while-key-held/bypass-right-click-jacking-while-key-held.user.js
// @namespace     https://www.devalias.net/
// @version       0.1
// @match         *://*/*
// @grant         none
// ==/UserScript==

(function () {
  'use strict';

  // Change this to e.g. 'Meta', 'Shift', or 'Control' if you prefer
  const modifierKeyName = 'Alt';

  // Capture-phase listener: intercepts contextmenu events early.
  //
  // IMPORTANT: we do *not* call preventDefault() here — only stop page handlers,
  // so the browser’s native context menu remains free to open when the key is held.
  function captureContext(e) {
    // Only intervene if the chosen modifier key is being held down at the moment of right-click
    if (!e.getModifierState(modifierKeyName)) return;

    // Block other listeners bound at the same target and phase
    e.stopImmediatePropagation();

    // Stop the event from bubbling up to parent elements
    e.stopPropagation();
  }

  // Install listener in capture phase.
  // The capture phase runs before bubbling, so we intercept the event
  // before site scripts can cancel or hijack it. This ensures our handler
  // has priority to allow the native browser menu when the key is held.
  document.addEventListener('contextmenu', captureContext, true);
})();
