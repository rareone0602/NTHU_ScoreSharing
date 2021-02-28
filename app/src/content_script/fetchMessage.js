'use strict'
function fetchMessage(action, argument) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: action,
      argument: argument
    }, response => {
      resolve(response);
    });
  });
}
