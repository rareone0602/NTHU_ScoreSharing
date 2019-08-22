'use strict'

let ccxpToken = document.querySelector('[name=ACIXSTORE]').value;
let buttons = document.querySelectorAll('[name=Submit5]');
for (let btn of buttons) {
  btn.addEventListener("click", () => {
    console.log('update select');
    chrome.runtime.sendMessage({ action: "SendSelectList", ccxpToken });
  });
}