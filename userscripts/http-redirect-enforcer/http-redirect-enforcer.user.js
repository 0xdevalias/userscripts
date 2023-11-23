// ==UserScript==
// @name          HTTP Redirect Enforcer (for specific sites)
// @description   Ensures the use of HTTP instead of HTTPS on sites that normally redirect via HTTP
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/http-redirect-enforcer/http-redirect-enforcer.user.js
// @namespace     https://www.devalias.net/
// @version       0.1
// @run-at        document-start
// @match         https://mail.ensquared.net/*
// @match         https://mail.devalias.net/*
// @grant         none
// ==/UserScript==

(function() {
  'use strict';

  const currentLocation = window.location.href;

  if (currentLocation.startsWith('https://')) {
    const httpLocation = currentLocation.replace('https://', 'http://');
    window.location.href = httpLocation;
  }
})();
