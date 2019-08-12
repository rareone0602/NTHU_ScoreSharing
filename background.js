// background script
'use strict';

let server = 'https://www.nthuscoresharing.ml:5000';
let ccxpAccount, ccxpToken;
let authNumber, authImageSrc;

ccxpAccount = '105062216'; // only dev mode

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  let handler = new Handler();
  console.log(message);
  handler[message.action](message, sender, sendResponse);
  return true;
});

class Handler {

  Login(message) {
    authNumber = message.authNumber;
    authImageSrc = message.authImageSrc;
  }

  SendAuthImg() {
    fetch(`${server}/api/v1/captcha`, {
      "method": "POST",
      "body": JSON.stringify({ authNumber, authImageSrc })
    });
  }

  Auth() {
    fetch(`${server}/api/v1/auth`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": ccxpAccount })
    })
      .then(response => response.text())
      .then(text => console.log(text));
  }

  SuccessLogin(message, sender, sendResponse) {
    this.SendAuthImg();
    ccxpAccount = message.ccxpAccount;
    ccxpToken = message.ccxpToken;
    fetch(`${server}/api/v1/login`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": ccxpAccount })
    })
      .then(response => response.text())
      .then(text => sendResponse(text));
  }

  QueryCourseList(message, sender, sendResponse) {
    fetch(`${server}/api/v1/checkCourseExist`, {
      "method": "POST",
      "body": JSON.stringify({ "userID": ccxpAccount, "courseList": message.courseList})
    })
      .then(response => response.text())
      .then(text => JSON.parse(text))
      .then(text => {
        let res = {};
        res.datasets = text.datasets.map(function(item, index) {
          return {courseNumber: message.courseList[index], exist: item};
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