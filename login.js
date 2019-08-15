'use strict'

// Auto fill authImageNumber
if (location.pathname == '/ccxp/INQUIRE/' || location.pathname == '/ccxp/INQUIRE/index.php') {
  chrome.runtime.sendMessage({
    action: "Decaptcha",
    authImageSrc: document.querySelector('img[src^="auth_img"]').src.match(/\d*-\d*/g).shift()
  }, function (data) {
    console.log(data);
    if (data.decaptcha == 'SPAMMING') {
      alert("[NTHU_ScoreSharing]\n\nDon't attack us, QQ\n(the service will be available after one minute)");
    } else if (data.decaptcha != 'EXPIRED') {
      document.querySelector('input[name="passwd2"]').value = data.decaptcha;
    }
  });
}

// Send StudentID && ACIXSTORE to background script
if (location.pathname == '/ccxp/INQUIRE/top.php') {
  let params = new URLSearchParams(location.search);
  let ccxpAccount = params.get('account');
  let ccxpToken = params.get('ACIXSTORE');
  const authMSG = '[NTHU_ScoreSharing]\n\n您是否同意傳送您的 "成績" 及 "選課" 資料至共享資料庫?';

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
