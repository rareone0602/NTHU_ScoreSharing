'use strict'

function autoFillCaptcha(response) {
  if (response.decaptcha == 'SPAMMING') {
    alert("[NTHU_ScoreSharing]\n\nDon't attack us, QQ\n(the service will be available after one minute)");
  } else if (response.decaptcha != 'EXPIRED') {
    document.querySelector('input[name="passwd2"]').value = response.decaptcha;
  }
}

if (location.pathname == '/ccxp/INQUIRE/' || location.pathname == '/ccxp/INQUIRE/index.php') {
  let img = document.querySelector('img[src^="auth_img"]');
  let canvas = document.createElement('canvas');
  canvas.width = img.clientWidth;
  canvas.height = img.clientHeight;
  canvas.getContext('2d').drawImage(img, 0, 0);
  let DataURL = canvas.toDataURL('image/PNG');
  console.log("Authentication Image: ", DataURL);

  chrome.runtime.sendMessage({
    action: "Decaptcha",
    DataURL: DataURL.split(',')[1]
  }, function (response) {
    autoFillCaptcha(response);
  });
}