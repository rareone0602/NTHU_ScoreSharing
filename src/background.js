'use strict';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
  let handler = new Handler();
  handler[message.action](message, sender, sendResponse);
  return true;
});

const server = 'https://www.nthuscoresharing.ml';

class Handler {

  Decaptcha(message, sender, sendResponse) {
    fetch(`${server}/api/v1/decaptcha?pwdstr=${message.authImageSrc}`, {
      "method": "GET"
    })
      .then(response => response.json())
      .then(json => sendResponse(json));
  }

  SuccessLogin(message, sender, sendResponse) {
    chrome.storage.local.clear(() => {
      chrome.storage.local.set({ ccxpAccount: message.ccxpAccount });
    });

    fetch(`${server}/api/v1/login`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": message.ccxpAccount })
    })
      .then(response => response.json())
      .then(json => sendResponse(json));
  }

  Auth(message, sender, sendResponse) {
    fetch(`${server}/api/v1/auth`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": message.ccxpAccount })
    })
      .then(response => response.json())
      .then(json => console.log(json));
  }

  async SendScore(message, sender, sendResponse) {
    let datasets = await getScore(message.ccxpToken);
    console.log(datasets);
    fetch(`${server}/api/v1/uploadScore`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": message.ccxpAccount, datasets })
    })
      .then(response => response.json())
      .then(json => console.log(json));
  }

  QueryPastCourseExist(message, sender, sendResponse) {
    chrome.storage.local.get(['ccxpAccount'], function (result) {
      fetch(`${server}/api/v1/checkCourseExist`, {
        "method": "POST",
        "body": JSON.stringify({ "userID": result.ccxpAccount, "courseList": message.courseList })
      })
        .then(response => response.json())
        .then(json => {
          let result = {};
          result.datasets = json.datasets.map(function (item, index) {
            return { courseNumber: message.courseList[index], exist: item };
          });
          sendResponse(result);
        });
    });
  }

  QueryCourseScore(message, sender, sendResponse) {
    chrome.storage.local.get(['ccxpAccount'], function (result) {
      fetch(`${server}/api/v1/getPastCourse?courseNumber=${message.courseNumber}&userID=${result.ccxpAccount}`)
        .then(response => response.json())
        .then(json => sendResponse(json));
    });
  }
  
}