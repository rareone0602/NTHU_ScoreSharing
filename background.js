// background script
'use strict';

const server = 'https://www.nthuscoresharing.ml:5000';
let ccxpAccount, ccxpToken;

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
      "body": JSON.stringify({ })
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

  Auth() {
    fetch(`${server}/api/v1/auth`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": ccxpAccount })
    })
      .then(response => response.text())
      .then(text => JSON.parse(text))
      .then(text => {
        if (text.authSuccess) {
          this.SendScore();
        }
        console.log(text);
      });
  }

  SuccessLogin(message, sender, sendResponse) {
    ccxpAccount = message.ccxpAccount;
    ccxpToken = message.ccxpToken;
    fetch(`${server}/api/v1/login`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": ccxpAccount })
    })
      .then(response => response.text())
      .then(text => JSON.parse(text))
      .then(text => {
        if (text.agreeUpload) {
          this.SendScore();
        }
        return text;
      })
      .then(text => sendResponse(text));
  }

  async SendScore() {
    let scoreList = await GetAllScore();
    fetch(`${server}/api/v1/uploadScore`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": ccxpAccount, "datasets": scoreList })
    });
  }

  QueryCourseList(message, sender, sendResponse) {
    fetch(`${server}/api/v1/checkCourseExist`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": ccxpAccount, "courseList": message.courseList })
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
  }

  QueryCourse(message, sender, sendResponse) {
    fetch(`${server}/api/v1/getPastCourse?courseNumber=${message.courseNumber}&userID=${ccxpAccount}`)
      .then(response => response.text())
      .then(text => JSON.parse(text))
      .then(text => sendResponse(text));
  }
}