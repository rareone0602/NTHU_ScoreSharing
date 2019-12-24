'use strict'

const authMSG = '[NTHU_ScoreSharing]\n\n您是否同意傳送您的資料至 NTHU_ScoreSharing?';

if (location.pathname == '/ccxp/INQUIRE/top.php') {
  let params = new URLSearchParams(location.search);
  let ccxpAccount = params.get('account');
  let ccxpToken = params.get('ACIXSTORE');

  chrome.runtime.sendMessage({
    action: "SuccessLogin",
    ccxpAccount
  }, function (response) {
    let isAuth = response.agreeUpload;
    if (isAuth || confirm(authMSG)) {
      if (isAuth == false) {
        chrome.runtime.sendMessage({ action: "Auth", ccxpAccount });
      }
      chrome.runtime.sendMessage({ action: "SendScore", ccxpAccount, ccxpToken });
    }
  });

}
