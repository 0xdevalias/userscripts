// ==UserScript==
// @name          Copy GitHub Repo Summary
// @description   Copy a quick summary of the current GitHub repo, formatted as a markdown list item.
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/copy-github-repo-summary/copy-github-repo-summary.user.js
// @icon          https://www.google.com/s2/favicons?sz=64&domain=github.com
// @namespace     https://www.devalias.net/
// @version       0.1.1
// @match         https://github.com/*/*
// @run-at        document-start
// @grant         GM_registerMenuCommand
// @grant         GM_setClipboard
// ==/UserScript==

(function () {
  'use strict';

  function getGitHubRepoInfo() {
    const repoUrl = window.location.href;
    const documentTitle = document.title;

    const repoReadme =
      document.querySelector("article.markdown-body");

    const readmeTitle =
      repoReadme?.querySelector("h1")?.textContent.trim() ?? null;

    let firstParagraph = null;
    for (const p of repoReadme?.querySelectorAll("p") ?? []) {
      const text = p.textContent.trim();
      if (text && text.length > 20) {
        firstParagraph = text;
        break;
      }
    }

    const aboutHeading = [...document.querySelectorAll(".Layout-sidebar h2")]
      .find(h2 => h2.textContent.trim().toLowerCase() === "about");

    const aboutP =
      aboutHeading?.nextElementSibling?.tagName === "P"
        ? aboutHeading.nextElementSibling
        : null;

    const aboutDescription = aboutP?.textContent.trim() ?? null;

    const markdownSummary = [
      `- ${repoUrl}`,
      `  - > ${readmeTitle ?? ""}`,
      `  - > ${aboutDescription ?? ""}`,
      `  - > ${firstParagraph ?? ""}`,
    ].join("\n").trim();

    return {
      repoUrl,
      documentTitle,
      readmeTitle,
      firstParagraph,
      aboutDescription,
      markdownSummary,
    };
  }

  function copySummary() {
    const { markdownSummary } = getGitHubRepoInfo();
    GM_setClipboard(markdownSummary, { type: "text", mimetype: "text/plain" });
  }

  GM_registerMenuCommand("Copy GitHub repo summary", copySummary);
})();
