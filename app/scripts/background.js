'use strict';

chrome.runtime.onInstalled.addListener(function() {
  console.log('installed');
});

console.log('I am running.');