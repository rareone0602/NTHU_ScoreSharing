'use strict';
chrome.runtime.onInstalled.addListener(function(install) {
  if (install.reason == "install") {
    chrome.tabs.create({
      "url": "https://sites.google.com/view/mins-policy/home"
    }, function(tab) {
      window.alert("當您使用我們的服務，即表示您同意本條款，因此請務必詳閱本條款內容。")
    });
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  handler[message.action](message, sender, sendResponse);
  return true;
});
