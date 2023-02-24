// ==UserScript==
// @name          Google developer sites - Ensure ?authuser= by default
// @description   Ensure that ?authuser=1/etc is used on Google developer sites by default
// @namespace     https://www.devalias.net/
// @match         *://developers.google.com/*
// @match         *://cloud.google.com/*
// @match         *://console.cloud.google.com/*
// @grant         none
// @version       1.0
// @author        Glenn 'devalias' Grant (devalias.net)
// ==/UserScript==

// TODO: refactor this to use a config object/similar that allows us to match more complex things, and direct them to the appropriate authuser

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('authuser')) {
  const isPioneera = window.location.href.includes('pioneera');

  if (isPioneera) {
    searchParams.set('authuser', 2)
  } else {
    searchParams.set('authuser', 1)
  }

  window.location.search = searchParams
}
