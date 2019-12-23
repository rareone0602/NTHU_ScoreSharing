'use strict'

function autoFillCaptcha(response) {
  if (response.decaptcha == 'SPAMMING') {
    alert("[NTHU_ScoreSharing]\n\nDon't attack us, QQ\n(the service will be available after one minute)");
  } else if (response.decaptcha != 'EXPIRED') {
    document.querySelector('input[name="passwd2"]').value = response.decaptcha;
  }
}

if (location.pathname == '/ccxp/INQUIRE/') {
  chrome.runtime.sendMessage({
    action: "Decaptcha",
    authImageSrc: document.querySelector('img[src^="auth_img"]').src.match(/\d+-\d+/g)[0]
  }, function (response) {
    autoFillCaptcha(response);
  });
}