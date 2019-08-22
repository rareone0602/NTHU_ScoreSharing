'use strict'

async function GetOrder(ccxpToken) {
  let doc = await GetLog(ccxpToken);
  let courseList = doc.querySelectorAll('table')[1].rows;
  let datasets = Array();
  for (let i = 1; i < courseList.length; i++) {
    let courseNumber = courseList[i].cells[0].innerText;
    let coursePriority = courseList[i].cells[8].innerText;
    let courseStatus = courseList[i].cells[9].innerText;
    datasets.push({ courseNumber, coursePriority, courseStatus });
  }
  console.log(datasets);
  return datasets;
}

async function GetLog(ccxpToken) {
  let response = await fetch("https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.2/7.2.9/JH729002.php", {
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
    },
    "body": `ACIXSTORE=${ccxpToken}`,
    "method": "POST"
  });
  let buffer = await response.arrayBuffer();
  let decoder = new TextDecoder("big5");
  let text = decoder.decode(buffer);
  let parser = new DOMParser();
  return parser.parseFromString(text, "text/html");
}