'use strict'
let img = document.querySelector('img[src^="auth_img"]');
let canvas = document.createElement('canvas');
canvas.width = img.clientWidth;
canvas.height = img.clientHeight;
canvas.getContext('2d').drawImage(img, 0, 0);
let DataURL = canvas.toDataURL('image/PNG');
fetchMessage("decaptcha", DataURL.split(',')[1]).
then(response => document.querySelector('input[name="passwd2"]').value = response.decaptcha)
