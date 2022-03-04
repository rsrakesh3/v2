'use strict';

chrome.browserAction.onClicked.addListener(() => {
  chrome.storage.local.get({
    mode: 'window'
  }, prefs => {
    if (prefs.mode === 'tab') {
      chrome.tabs.create({
        url: 'data/window/index.html?mode=tab'
      });
    }
    else {
      chrome.storage.local.get({
        'window.width': 400,
        'window.height': 600,
        'window.left': screen.availLeft + Math.round((screen.availWidth - 400) / 2),
        'window.top': screen.availTop + Math.round((screen.availHeight - 600) / 2)
      }, prefs => {
        chrome.windows.create({
          url: chrome.extension.getURL('data/window/index.html?mode=window'),
          width: prefs['window.width'],
          height: prefs['window.height'],
          left: prefs['window.left'],
          top: prefs['window.top'],
          type: 'popup'
        });
      });
    }
  });
});

const startup = () => chrome.storage.local.get({
  mode: 'popup'
}, prefs => {
  chrome.contextMenus.create({
    title: 'Open in Popup',
    id: 'popup',
    contexts: ['browser_action'],
    type: 'radio',
    checked: prefs.mode === 'popup'
  });
  chrome.browserAction.setPopup({
    popup: prefs.mode === 'popup' ? 'data/window/index.html?mode=popup' : ''
  });
});
chrome.runtime.onInstalled.addListener(startup);
chrome.runtime.onStartup.addListener(startup);

chrome.contextMenus.onClicked.addListener(info => chrome.storage.local.set({
  mode: info.menuItemId
}));

chrome.storage.onChanged.addListener(prefs => {
  if (prefs.mode) {
    chrome.browserAction.setPopup({
      popup: prefs.mode.newValue === 'popup' ? 'data/window/index.html?mode=popup' : ''
    });
  }
});


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const product = request.productData;
        chrome.tabs.executeScript(null,{
          code: 'var product = "'+product+'";'
        }, function(){
          chrome.tabs.executeScript(null, {file:'script.js'});
        });
      return true;
    });
  }
);


