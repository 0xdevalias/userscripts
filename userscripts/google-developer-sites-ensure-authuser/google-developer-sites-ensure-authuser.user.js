// ==UserScript==
// @name          Google developer sites - Ensure ?authuser= by default
// @description   Ensure that ?authuser=1/etc is used on Google developer sites by default
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/google-developer-sites-ensure-authuser/google-developer-sites-ensure-authuser.user.js
// @namespace     https://www.devalias.net/
// @version       1.0.1
// @match         *://developers.google.com/*
// @match         *://cloud.google.com/*
// @match         *://console.cloud.google.com/*
// @grant         none
// ==/UserScript==

// TODO: refactor this to use a config object/similar that allows us to match more complex things, and direct them to the appropriate authuser

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('authuser')) {
  // const isFoo = window.location.href.includes('foo');

  // if (isFoo) {
  //   searchParams.set('authuser', 2)
  // } else {
  searchParams.set('authuser', 1)
  // }

  window.location.search = searchParams
}
