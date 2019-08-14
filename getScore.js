'use struct'
  
async function GetAllScore() {

  let doc = await GetHTMLDoc(`https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/R/6.3/JH8R63002.php?ACIXSTORE=${ccxpToken}`);
  let scoreList = await parseGradeAnnouncementPage(doc);

  for (let i = 0; i < scoreList.length; i++) {
    let c_key = scoreList[i].courseNumber;
    let doc = await GetHTMLDoc(`https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/8.3/8.3.3/JH83302.php?ACIXSTORE=${ccxpToken}&c_key=${c_key}`);
    let scoreDist = await parseGradeDistributionPage(doc);
    scoreList[i].absoluteGrade = scoreDist;
  }
  console.log(scoreList);
  return scoreList;
}

async function parseGradeAnnouncementPage(doc) {
  let scoreList = Array();
  let scoreTable = doc.querySelectorAll('table')[1].rows;
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
    scoreList.push( {courseNumber, grade, relativeGrade} );
  }
  return scoreList;
}

async function parseGradeDistributionPage(doc) {
  const Label = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'X', 'U', 'N'];
  if (doc.querySelectorAll('p')[1].innerText == '本科單科成績不公開') return null;
  let textList = doc.querySelectorAll('table')[1].rows[1].cells;
  let scoreDist = {};
  for (let i = 1; i < textList.length; i++) {
    let count = textList[i].innerHTML.split('<br>')[1].match(/\d+/g);
    if (count == null) {
      count = 0;
    } else {
      count = Number(count[0]);
    }
    scoreDist[Label[i - 1]] = count;
  }
  return scoreDist;
}

async function GetHTMLDoc(uri) {
  let response = await fetch(uri);
  let buffer = await response.arrayBuffer();
  let decoder = new TextDecoder("big5");
  let text = decoder.decode(buffer);
  let parser = new DOMParser();
  return parser.parseFromString(text, "text/html");
}