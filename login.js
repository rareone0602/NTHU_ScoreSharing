// Send authImage and authImageNumber to background script
// if we detect success login, then the last Image will send to server
'use strict'

// Get Auth Image
if (location.pathname == '/ccxp/INQUIRE/' || location.pathname == '/ccxp/INQUIRE/index.php') {

  Decaptcha();

  let loginButton = document.querySelector('.bottom_class');
  loginButton.addEventListener('click', handler);

  function handler() {
    let authNumber = document.querySelector('input[name="passwd2"]').value;
    let authImageSrc = document.querySelector('img[src^="auth_img"]').src;
    chrome.runtime.sendMessage({
      action: "AuthImg",
      authNumber,
      authImageSrc
    });
  }
}

let authMSG = '您是否同意傳送您的 "成績" 及 "選課" 資料至共享資料庫?';

// Get StudentID && ACIXSTORE
if (location.pathname == '/ccxp/INQUIRE/top.php') {
  let params = new URLSearchParams(location.search);
  let ccxpAccount = params.get('account');
  let ccxpToken = params.get('ACIXSTORE');

  chrome.runtime.sendMessage({
    action: "SuccessLogin",
    ccxpAccount,
    ccxpToken
  }, function (data) {
    let isAuth = data.agreeUpload;
    if (isAuth == false && confirm(authMSG)) {
      console.log('new user');
      chrome.runtime.sendMessage({ action: "Auth" });
    }
  });

  fetch('https://www.nthuscoresharing.ml/api/v1/hello');
}

async function Decaptcha() {
  chrome.runtime.sendMessage({
    action: "Decaptcha",
    authImageSrc: document.querySelector('img[src^="auth_img"]').src.match(/\d*-\d*/g).shift()
  }, function (data) {
    console.log(data);
    if (data.decaptcha != 'EXPIRED') {
      document.querySelector('input[name="passwd2"]').value = data.decaptcha;
    }
  });
}