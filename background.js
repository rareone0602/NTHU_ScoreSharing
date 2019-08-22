// background script
'use strict';

const server = 'https://www.nthuscoresharing.ml:5000';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
  let handler = new Handler();
  handler[message.action](message, sender, sendResponse);
  return true;
});

class Handler {

  // useless now
  SendAuthImg() {
    fetch(`${server}/api/v1/captcha`, {
      "method": "POST",
      "body": JSON.stringify({})
    });
  }

  Decaptcha(message, sender, sendResponse) {
    fetch(`${server}/api/v1/decaptcha?pwdstr=${message.authImageSrc}`, {
      "method": "GET"
    })
      .then(response => response.text())
      .then(text => JSON.parse(text))
      .then(text => sendResponse(text));
  }

  SuccessLogin(message, sender, sendResponse) {
    chrome.storage.local.clear(() => {
      chrome.storage.local.set({ ccxpAccount: message.ccxpAccount });
    });

    fetch(`${server}/api/v1/login`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": message.ccxpAccount })
    })
      .then(response => response.text())
      .then(text => JSON.parse(text))
      .then(text => sendResponse(text));
  }

  Auth(message, sender, sendResponse) {
    fetch(`${server}/api/v1/auth`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": message.ccxpAccount })
    })
      .then(response => response.text())
      .then(text => console.log(text));
  }

  async SendScore(message, sender, sendResponse) {
    let scoreList = await GetAllScore(message.ccxpToken);
    fetch(`${server}/api/v1/uploadScore`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": message.ccxpAccount, "datasets": scoreList })
    });
  }

  async SendSelectList(message, sender, sendResponse) {
    setTimeout(async function () {
      let datasets = await GetOrder(message.ccxpToken);
      chrome.storage.local.get(['ccxpAccount'], function (result) {
        fetch(`${server}/api/v1/uploadOrder`, {
          "method": "POST",
          "body": JSON.stringify({ "userID": result.ccxpAccount, "datasets": datasets })
        })
      });
    }, 1500);
  }

  QueryCourseList(message, sender, sendResponse) {
    chrome.storage.local.get(['ccxpAccount'], function (result) {
      fetch(`${server}/api/v1/checkCourseExist`, {
        "method": "POST",
        "body": JSON.stringify({ "userID": result.ccxpAccount, "courseList": message.courseList })
      })
        .then(response => response.text())
        .then(text => JSON.parse(text))
        .then(text => {
          let res = {};
          res.datasets = text.datasets.map(function (item, index) {
            return { courseNumber: message.courseList[index], exist: item };
          });
          sendResponse(res);
        });
    });
  }

  QueryCourse(message, sender, sendResponse) {
    chrome.storage.local.get(['ccxpAccount'], function (result) {
      fetch(`${server}/api/v1/getPastCourse?courseNumber=${message.courseNumber}&userID=${result.ccxpAccount}`)
        .then(response => response.text())
        .then(text => JSON.parse(text))
        .then(text => sendResponse(text));
    });
  }

  QueryOrderList(message, sender, sendResponse) {
    chrome.storage.local.get(['ccxpAccount'], function (result) {
      fetch(`${server}/api/v1/getOrder`, {
        "method": "POST",
        "body": JSON.stringify({ "userID": result.ccxpAccount, "datasets": message.datasets })
      })
        .then(response => response.text())
        .then(text => JSON.parse(text))
        .then(text => {
          console.log(text);
          let res = {};
          res.datasets = text.results.map(function (item, index) {
            return { ...message.datasets[index], ...item };
          });
          sendResponse(res);
        });
    });
  }
}