// ==UserScript==
// @name          GitHub Gist - CodeMirror Resizer
// @description   Makes the CodeMirror editor resizable when creating/editing a gist on GitHub
// @author        Glenn 'devalias' Grant (devalias.net)
// @namespace     https://www.devalias.net/
// @version       1.1
// @match         https://gist.github.com/*
// @grant         none
// ==/UserScript==

// Original ChatGPT Reference: https://chat.openai.com/c/57dbf0da-69b1-436b-b3b0-c8f39c67b99e

(function() {
  'use strict';

  const containerSelector = '#gist-pjax-container > div.container-lg';

  const editorSelector = '.CodeMirror';

  const resizeContainer = (container) => {
    container.style.maxWidth = '90vw';
  }

  const resizeEditor = (editor) => {
    editor.style.resize = 'vertical';
    editor.style.height = '75vh';
  };

  const createAttributeObserver = (target, callback, attribute = 'style') => {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === attribute) {
          const element = mutation.target;
          callback(element);
        }
      }
    });
    observer.observe(target, { attributes: true });
    return observer;
  }

  const initObservers = function() {
    const container = document.querySelector(containerSelector);
    const editor = document.querySelector(editorSelector);

    if (!container || !editor) {
      setTimeout(initObservers, 1000); // retry after 1 second
      return;
    }

    resizeContainer(container);
    resizeEditor(editor);

    const containerObserver = createAttributeObserver(container, resizeContainer, 'style');
    const editorObserver = createAttributeObserver(editor, resizeEditor, 'style');
  };

  initObservers();
})();
