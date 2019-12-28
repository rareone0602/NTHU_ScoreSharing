'use strict'

chrome.runtime.sendMessage({
  action: "QueryRatingHistory"
}, function (response) {
  console.log(response);
  InsertRating(response);
});

function InsertRating(response) {
  let scoreTable = document.querySelectorAll('table')[1].rows;
  scoreTable[2].cells[8].width = 200;
  scoreTable[2].cells[8].innerHTML = "<b> Rating </b><br> [NTHU_ScoreSharing]";

  for (let i = 3; i < scoreTable.length - 1; i++) {
    let courseNumber = String();
    courseNumber += scoreTable[i].cells[0].innerText;
    courseNumber += scoreTable[i].cells[1].innerText.replace(/\s/g, '');
    courseNumber += scoreTable[i].cells[2].innerHTML.replace(/&nbsp;/g, '');
    let grade = scoreTable[i].cells[5].innerText.replace(/\s$/g, '');
    if (grade.search('Not Submitted') < 0) {
      add_star(scoreTable[i].cells[8], courseNumber, response[courseNumber]);
    }
  }
}

function add_star(td, courseNumber, rating) {
  let star = document.createElement('div');
  star.id = courseNumber;
  td.innerText = '';
  td.appendChild(star);

  $(`[id="${courseNumber}"]`).starRating({
    initialRating: rating ? Object.keys(rating)[0] : 0,
    starSize: 25,
    useFullStars: true,
    hoverColor: '#FDB900',
    ratedColor: '#FDB900',
    disableAfterRate: false,
    starShape: 'rounded',
    callback: function(currentRating, $el){
      chrome.runtime.sendMessage({
        action: "SendRating",
        courseNumber: $el[0].id,
        rate: String(currentRating)
      }, function (response) {
        console.log(response);
      });
    }
  });
} 
