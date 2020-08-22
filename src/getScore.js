'use strict'

const ccxpServer = 'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE';

async function getScore(ccxpToken) {
  let ranking = await getRanking(ccxpToken);
  let courseGrade = await getCourseGrade(ccxpToken);
  let courseGradeDistribution = await getCourseGradeDistribution(ccxpToken, courseGrade);
  return { ranking, courseGrade, courseGradeDistribution };
}

async function getRanking(ccxpToken) {
  let doc = await getHTMLDoc(`${ccxpServer}/JH/8/R/6.3/JH8R63002.php?ACIXSTORE=${ccxpToken}`);
  let rankingTable = doc.body.querySelectorAll('table')[4].rows;
  let ranking = [];
  for (let i = 2; i < rankingTable.length; i++) {
    let Semester = rankingTable[i].cells[0].innerText + rankingTable[i].cells[1].innerText;
    let GPA = rankingTable[i].cells[2].innerText;
    let ClassRanking = rankingTable[i].cells[9].innerText;
    let DepartmentRanking = rankingTable[i].cells[10].innerText;
    let Comments = rankingTable[i].cells[13].innerText;
    ranking.push({ Semester, GPA, ClassRanking, DepartmentRanking, Comments });
  }
  return ranking;
}

async function getCourseGrade(ccxpToken) {
  let doc = await getHTMLDoc(`${ccxpServer}/JH/8/R/6.3/JH8R63002.php?ACIXSTORE=${ccxpToken}`);
  let scoreTable = doc.querySelectorAll('table')[1].rows;
  let courseGrade = [];
  for (let i = 3; i < scoreTable.length - 1; i++) {
    let grade = scoreTable[i].cells[5].innerText.replace(/\s$/g, '');
    let courseNumber = String();
    courseNumber += scoreTable[i].cells[0].innerText;
    courseNumber += scoreTable[i].cells[1].innerText.replace(/\s/g, '');
    courseNumber += scoreTable[i].cells[2].innerHTML.replace(/&nbsp;/g, '');
    let relativeGrade = scoreTable[i].cells[7].innerHTML.match(/\d*\/\d*/g);
    if (relativeGrade) {
      relativeGrade = relativeGrade.shift();
    }
    courseGrade.push({ courseNumber, grade, relativeGrade });
  }
  return courseGrade;
}

async function getCourseGradeDistribution(ccxpToken, courseGrade) {
  let courseGradeDistribution = [];
  for (let course of courseGrade) {
    let c_key = course.courseNumber;
    let doc = await getHTMLDoc(`${ccxpServer}/JH/8/8.3/8.3.3/JH83302.php?ACIXSTORE=${ccxpToken}&c_key=${c_key}`);
    let dist = await parseGradeDistributionPage(doc);
    courseGradeDistribution.push({ courseNumber: c_key, dist });
  }
  return courseGradeDistribution;
}

async function parseGradeDistributionPage(doc) {
  if (doc.body.innerText.search('disclose') >= 0) {
    return null;
    // 不公開啦 QQ
  }
  let numberTable = doc.body.querySelector('[border="1"]');
  let dist = {};
  for (let i = 1; i < numberTable.rows[0].cells.length; i++) {
    let key = numberTable.rows[0].cells[i].innerText.replace(/[\n\s+\d~]/g, '');
    let value = 0;
    try {
      value = Number(numberTable.rows[1].cells[i].innerText.split('\n')[1].match(/\d+/g)[0]);
    } catch (err) {
      value = 0;
    }
    dist[key] = value;
  }
  return dist;
}

async function getHTMLDoc(uri) {
  let response = await fetch(uri);
  let buffer = await response.arrayBuffer();
  let decoder = new TextDecoder("big5");
  let text = decoder.decode(buffer);
  let parser = new DOMParser();
  return parser.parseFromString(text, "text/html");
}