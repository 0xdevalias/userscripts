# Glenn 'devalias' Grant's userscripts

My user scripts to add functionality to various sites around the web (that were too small for me to bother turning into a full-fledged Chrome extension).

## Userscripts

- [Amazon Prime Gaming Highlighter](./userscripts/amazon-prime-gaming-highlighter/) ([Install](https://github.com/0xdevalias/userscripts/raw/main/userscripts/amazon-prime-gaming-highlighter/amazon-prime-gaming-highlighter.user.js))
- [ChatGPT Web App Script Update Notifier](./userscripts/chatgpt-web-app-script-update-notifier/) ([Install](https://github.com/0xdevalias/userscripts/raw/main/userscripts/chatgpt-web-app-script-update-notifier/chatgpt-web-app-script-update-notifier.user.js))
- [Copy GitHub Repo Summary](./userscripts/copy-github-repo-summary/) ([Install](https://github.com/0xdevalias/userscripts/raw/main/userscripts/copy-github-repo-summary/copy-github-repo-summary.user.js))
- [Freshdesk Make 'Redactor Editor' Resizeable](./userscripts/freshdesk-make-redactor-editor-resizeable/) ([Install](https://github.com/0xdevalias/userscripts/raw/main/userscripts/freshdesk-make-redactor-editor-resizeable/freshdesk-make-redactor-editor-resizeable.user.js))
- [GitHub Gist - CodeMirror Resizer](./userscripts/github-gist-codemirror-resizer/) ([Install](https://github.com/0xdevalias/userscripts/raw/main/userscripts/github-gist-codemirror-resizer/github-gist-codemirror-resizer.user.js))
- [GitHub Notifications - Arrow key navigation](./userscripts/github-notifications-arrow-key-navigation/) ([Install](https://github.com/0xdevalias/userscripts/raw/main/userscripts/github-notifications-arrow-key-navigation/github-notifications-arrow-key-navigation.user.js))
- [Google developer sites - Ensure ?authuser= by default](./userscripts/google-developer-sites-ensure-authuser/) ([Install](https://github.com/0xdevalias/userscripts/raw/main/userscripts/google-developer-sites-ensure-authuser/google-developer-sites-ensure-authuser.user.js))
- [Nourishd Meal Highlighter](./userscripts/nourishd-meal-highlighter/) ([Install](https://github.com/0xdevalias/userscripts/raw/main/userscripts/nourishd-meal-highlighter/nourishd-meal-highlighter.user.js))
- [YouTube Speed Override](./userscripts/youtube-speed-override/) ([Install](https://github.com/0xdevalias/userscripts/raw/main/userscripts/youtube-speed-override/youtube-speed-override.user.js))

### How to use

Personally I used [Violentmonkey](https://violentmonkey.github.io/) in Chrome:

- [Violentmonkey](https://violentmonkey.github.io/) ([Install](https://violentmonkey.github.io/get-it/), [Chrome](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=en), [Source](https://github.com/violentmonkey/violentmonkey))
  - [Creating a userscript](https://violentmonkey.github.io/guide/creating-a-userscript/)
  - [`GM_*` APIs](https://violentmonkey.github.io/api/gm/)

But since Violentmonkey haven't updated from MV2 to MV3 (at least as of 2025-08-24):

- [Issue #1934: \[Feature\] Manifest V3 for Chrome](https://github.com/violentmonkey/violentmonkey/issues/1934)
- [Issue #2284: New Chrome version doesn't support it](https://github.com/violentmonkey/violentmonkey/issues/2284)
- [Commit `196814a`](https://github.com/violentmonkey/violentmonkey.github.io/commit/196814ab3cef929b14d3770e8a76d71dd385c4a1#diff-0305aa01e394ff1946b149dd8f794580cfaef6c4c08bc1532b497b3d94813b8cR31-R34)
  - > WARNING:
    >
    > This extension is **no longer supported on Chrome** due to its Manifest V2 architecture. While a Manifest V3 rewrite might be considered in the future, it is not planned for the foreseeable future due to the considerable effort involved and the potential for losing existing features.
    > 
    > As an alternative, consider using [Brave](https://brave.com/) browser which is also open source, where you can install it from the Chrome Web Store.

I was forced to move back to Tampermonkey (which is not open source):

- [Tampermonkey](https://www.tampermonkey.net/) ([Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en))

That said, TamperMonkey has support for some more experimental features/API's that Violentmonley doesn't/won't support (eg. [`GM_webRequest(rules, listener)`](https://www.tampermonkey.net/documentation.php?locale=en#api:GM_webRequest), [`GM_cookie.*`](https://www.tampermonkey.net/documentation.php?locale=en#api:GM_cookie.list), etc; Ref: [violentmonkey#583](https://github.com/violentmonkey/violentmonkey/issues/583), [tampermonkey#397](https://github.com/Tampermonkey/tampermonkey/issues/397))

But if you use a different browser, or have different preferences, the following more comprehensive guide was extracted from the [bvolpato/awesome-userscripts README](https://github.com/bvolpato/awesome-userscripts#how-to-use):

> To use user scripts you need to first install a user script manager. Here are managers for various browsers:
> 
> - [Greasemonkey](http://www.greasespot.net/) - Firefox
>   - Supports GM 4 userscripts.
> - [Greasemonkey for Pale Moon](https://github.com/janekptacijarabaci/greasemonkey/releases) - Pale Moon
>   - Supports GM 3 userscripts.
> - [Firemonkey](https://addons.mozilla.org/firefox/addon/firemonkey/) - Firefox
>   - Supports GM 4 userscripts and some GM 3 userscripts.
> - [Tampermonkey](https://tampermonkey.net/) - Chrome, Microsoft Edge, Safari, Opera, Firefox (also with support for mobile Dolphin Browser and UC Browser)
>   - Supports both GM 3 and GM 4 userscripts.
> - [USI](https://addons.mozilla.org/firefox/addon/userunified-script-injector/) - Firefox
>   - Supports some GM 3 userscripts.
> - [Violentmonkey](https://violentmonkey.github.io/) - Chrome, Firefox, Maxthon, Opera
>   - Supports both GM 3 and GM 4 userscripts.
> 
> The most popular userscript managers are Greasemonkey, Tampermonkey, and Violentmonkey.

## Devtools Snippets

Chrome DevTools allows you to save small snippets of JS code [that can be easily run](https://developer.chrome.com/docs/devtools/javascript/snippets/#run) on pages using `Command + P`, typing a `!`, then selecting the snippet you want to run:

- https://developer.chrome.com/docs/devtools/javascript/snippets/

While I won't list them all here individually, you can find my devtools userscripts (or those I've collected from others), in:

- [./devtools-snippets/](./devtools-snippets/)

## See Also

### Other things by me

- https://www.devalias.net/ ([source](https://github.com/0xdevalias/devalias.net))
  - My Blog
- https://github.com/0xdevalias ([profile source](https://github.com/0xdevalias/0xdevalias))
  - My GitHub Profile
  - [My Repos](https://github.com/0xdevalias?tab=repositories)
    - [`chrome-*` (Chrome Extension) repos](https://github.com/0xdevalias?tab=repositories&q=chrome-&type=&language=&sort=)
    - [`poc-*` (Proof of Concept) repos](https://github.com/0xdevalias?tab=repositories&q=poc-&type=&language=&sort=)
- https://github.com/0xdevalias/dotfiles
  - > devalias does dotfiles
- https://github.com/0xdevalias/chrome-NewWindowWithTabsToRight ([Announcement Blog](https://www.devalias.net/dev/chrome-extensions/new-window-with-tabs-to-right/), [Chrome Webstore](https://chrome.google.com/webstore/detail/new-window-with-tabs-to-r/ldahcfljppchbfgdokomobmfdfplaman))
  - > Create a new window from the tabs to the right of the currently selected tab.
- https://github.com/0xdevalias/userscripts (this repo!)
  - > My user scripts to add functionality to various sites around the web (that were too small for me to bother turning into a full-fledged Chrome extension)
- https://github.com/0xdevalias/awesome-gmail-filters
  - > Awesome list of Gmail filters and related resources
- My [Homebrew](https://brew.sh/) Contributions
  - [Homebrew/homebrew-core PRs](https://github.com/Homebrew/homebrew-core/pulls?q=is%3Apr+author%3A0xdevalias)
  - [Homebrew/homebrew-cask PRs](https://github.com/Homebrew/homebrew-cask/pulls?q=is%3Apr+author%3A0xdevalias)
  - [Homebrew/homebrew-cask-versions PRs](https://github.com/Homebrew/homebrew-cask-versions/pulls?q=is%3Apr+author%3A0xdevalias)
  - etc
- Probably a lot more around the net that I haven't thought to link to here.. hope you find something cool/useful out there!

### Other's Userscripts / similar sorts of customisations

#### Userscripts

A non-exhaustive list of userscripts created by others/from other repos/etc:

- https://github.com/bvolpato/awesome-userscripts
  - > A curated list of Awesome Userscripts
- https://github.com/Mottie/GitHub-userscripts
  - > Userscripts to add functionality to GitHub
- https://bitbucket.org/mottie/bitbucket-userscripts
  - > Userscripts to add functionality to Bitbucket
- https://gitlab.com/Mottie/GitLab-userscripts
  - > Userscripts to add functionality to GitLab
- https://github.com/Mottie/Misc-userscripts
  - > Userscripts to add functionality to miscellaneous sites
- https://github.com/jerone/UserScripts
  - > This repo contains a few of my UserScripts that I've build since 2007.

#### Devtools Snippets

A non-exhaustive list of JS devtools snippets created by others/from other repos/etc:

- https://github.com/bgrins/devtools-snippets
  - > A collection of helpful snippets to use inside of browser devtools
  - https://bgrins.github.io/devtools-snippets/

#### Chrome Extensions

Pretty much my go-to Chrome extension for making GitHub way more usable:

- https://github.com/refined-github/refined-github ([Chrome](https://chrome.google.com/webstore/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/refined-github-/), [Safari](https://apps.apple.com/app/id1519867270))
  - > Browser extension that simplifies the GitHub interface and adds useful features

Also a super useful Chrome extension for GitHub Notifications:

- https://github.com/tanmayrajani/notifications-preview-github ([Chrome](https://chrome.google.com/webstore/detail/notifications-preview-for/kgilejfahkjidpaclkepbdoeioeohfmj), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/notifications-preview-github/))
  - > Browser Extension: preview GitHub notifications with same page pop-overs
