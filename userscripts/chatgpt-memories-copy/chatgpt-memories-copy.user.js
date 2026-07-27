// ==UserScript==
// @name         ChatGPT Memories Copy Button
// @namespace    https://www.devalias.net/
// @version      0.4
// @description  Add a "copy" button next to the trash icon for ChatGPT user memories to copy memory text easily.
// @author       Glenn 'devalias' Grant
// @match        https://chatgpt.com/c/*#settings/Personalization*
// @match        https://chat.openai.com/c/*#settings/Personalization*
// @icon         https://cdn.oaistatic.com/assets/favicon-eex17e9e.ico
// ==/UserScript==

(function() {
  'use strict';

  function handleCopyClick(textCell, btn) {
    const text = textCell.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      // Visual feedback by temporarily changing color
      btn.classList.add('text-token-text-secondary');
      setTimeout(() => btn.classList.remove('text-token-text-secondary'), 800);
    });
  }

  function createCopyButton(textCell) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.ariaLabel = 'Copy';
    btn.className = 'text-token-text-tertiary hover:text-token-text-secondary';
    btn.innerHTML = `
      <span class="leading-none">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="icon-sm">
          <path d="M6 2a2 2 0 0 0-2 2v10h2V4h8V2H6zm2 4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8zm0 2h8v10H8V8z"/>
        </svg>
      </span>`;
    btn.addEventListener('click', () => handleCopyClick(textCell, btn)); // explicit btn arg
    return btn;
  }

  function injectCopyButtons() {
    document.querySelectorAll('[data-testid="modal-memories"] table tbody tr').forEach(row => {
      const textCell = row.querySelector('.text-left');
      const actionCell = row.querySelector('.text-right');
      if (!textCell || !actionCell) return;
      if (actionCell.querySelector('button[aria-label="Copy"]')) return; // already added

      const copyBtn = createCopyButton(textCell);

      const trashBtn = actionCell.querySelector('button[aria-label="Remove"]');
      if (trashBtn) {
        actionCell.insertBefore(copyBtn, trashBtn);
      } else {
        // fallback: put it first so it precedes any other future actions
        actionCell.prepend(copyBtn);
      }
    });
  }

  const memoriesModalTbody = document.querySelector('[data-testid="modal-memories"] table tbody');

  if (memoriesModalTbody) {
    const observer = new MutationObserver(mutations => {
      // MutationRecord structure reference:
      // {
      //   type: "childList" | "attributes" | "characterData",
      //   target: Node,                  // node that changed
      //   addedNodes: NodeList,          // newly added children
      //   removedNodes: NodeList,        // removed children
      //   previousSibling: Node | null,
      //   nextSibling: Node | null,
      //   attributeName: string | null,
      //   attributeNamespace: string | null,
      //   oldValue: string | null
      // }

      for (const m of mutations) {
        // NOTE: could also use mutations.find(...) for conciseness, but loop is clearer
        if (
          m.type === "childList" &&
          ([...m.addedNodes, ...m.removedNodes].some(n => n.nodeName === "TR"))
        ) {
          // Debug logging to help refine filtering:
          // console.debug("Relevant mutation:", m);

          injectCopyButtons();
          break; // stop after first relevant
        }
      }
    });

    observer.observe(memoriesModalTbody, { childList: true });
    // ⚠️ If the modal isn't yet present when this script runs,
    // we may need to observe a higher-level container until it appears.
  } else {
    // Fallback: tbody not found at script init.
    // Might need to retry later or observe the modal root itself.
    // console.warn("Memories modal tbody not found; observer not started");
  }

  injectCopyButtons();
})();
