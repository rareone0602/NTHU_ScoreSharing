'use strict';

chrome.runtime.onInstalled.addListener(function(install) {
    //code for installation
    chrome.tabs.create({
        "url": "https://sites.google.com/view/mins-policy/home"
    }, function(tab) {
      window.alert("當您使用我們的服務，即表示您同意本條款，因此請務必詳閱本條款內容。")
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
  let handler = new Handler();
  handler[message.action](message, sender, sendResponse);
  return true;
});

const server = 'http://119.14.151.252:1124';

class Handler {

  Decaptcha(message, sender, sendResponse) {
    fetch(`${server}/api/v1/decaptcha`, {
      "method": "POST",
      "body": JSON.stringify({ "pwdstr": message.DataURL })
    })
      .then(response => response.json())
      .then(json => sendResponse(json));
  }

  SuccessLogin(message, sender, sendResponse) {
    chrome.storage.local.remove("ccxpAccount",() => {
      console.log("remove succuessful");
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
    let  sha256 = async(str) => {
      return await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str)).then(buf => {
         return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
      });
    }

    let PostScoreAndStorage = (result) => {
      chrome.storage.local.set(result);
      fetch(`${server}/api/v1/uploadScore`, {
        "method": "POST",
        "body": JSON.stringify({ "userID": message.ccxpAccount, datasets })
      }).then(response => response.json()).then(json => console.log(json));
    };

    let datasets = await getScore(message.ccxpToken);
    let json_hash = await sha256(JSON.stringify(datasets) );
    //Data format ==> result = {"logined_account" :{"account": "hash","aaa": "1234"}};
    chrome.storage.local.get(["logined_account"], function (result) {
      if (JSON.stringify(result) == "{}" ) {
        result = {"logined_account": { [message.ccxpAccount]: json_hash }}
        PostScoreAndStorage(result);
        console.log("空",result);
      }else if (result["logined_account"][message.ccxpAccount] == undefined){
        result["logined_account"][message.ccxpAccount] = json_hash;
        PostScoreAndStorage(result);
        console.log("新增用戶",result);
      }else if (result["logined_account"][message.ccxpAccount] != json_hash) {
        result["logined_account"][message.ccxpAccount] = json_hash;
        PostScoreAndStorage(result);
        console.log("有變",result);
      }
    });
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

  SendRating(message, sender, sendResponse) {
    chrome.storage.local.get(['ccxpAccount'], function (result) {
      fetch(`${server}/api/v1/rate`, {
        "method": "POST",
        "body": JSON.stringify({ "userID": result.ccxpAccount, "courseNumber": message.courseNumber, "rate": message.rate })
      })
        .then(response => response.text())
        .then(json => sendResponse(json));
    });
  }

  QueryRatingHistory(message, sender, sendResponse) {
    chrome.storage.local.get(['ccxpAccount'], function (result) {
      fetch(`${server}/api/v1/checkRate`, {
        "method": "POST",
        "body": JSON.stringify({ "userID": result.ccxpAccount })
      })
        .then(response => response.json())
        .then(json => sendResponse(json));
    });
  }

}
