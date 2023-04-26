// ==UserScript==
// @name          GitHub Gist - CodeMirror Resizer
// @description   Makes the CodeMirror editor resizable when creating/editing a gist on GitHub
// @author        Glenn 'devalias' Grant (devalias.net)
// @namespace     https://www.devalias.net/
// @version       1.0
// @match         https://gist.github.com/*
// @grant         none
// ==/UserScript==

// Original ChatGPT Reference: https://chat.openai.com/c/57dbf0da-69b1-436b-b3b0-c8f39c67b99e

(function() {
  'use strict';

  const resizeEditor = (editor) => {
    editor.style.resize = 'vertical';
    editor.style.height = '70vh';
    // editor.style.height = 'auto';
    // editor.CodeMirror.refresh();
  };

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const editor = mutation.target;
        resizeEditor(editor);
      }
    }
  });

  const initObserver = function() {
    const editor = document.querySelector('.CodeMirror');
    if (!editor) {
      setTimeout(initObserver, 1000); // retry after 1 second
      return;
    }

    resizeEditor(editor);
    observer.observe(editor, { attributes: true });
  };

  initObserver();
})();
