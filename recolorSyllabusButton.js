// context script on Tentative Course Selection System and offical system(url??)
// recolor syllabus button
'use strict';

// this page is Tentative Course Selection System
if (location.pathname == '/ccxp/COURSE/JH/7/7.6/7.6.1/JH761004.php') {
  let courseTable = document.querySelector('#T1').rows;
  let courseList = Array();
  let buttonList = {};

  for (let i = 1; i < courseTable.length; i++) {
    let course = courseTable[i];
    let courseNumber = course.cells[1].innerHTML;
    courseList.push(courseNumber);
    buttonList[courseNumber] = course.cells[11].firstChild;
  }

  chrome.runtime.sendMessage({
    action: 'QueryCourseList',
    courseList
  }, function (data) {
    // callback
    console.log(data);
    for (let course of data.datasets) {
      if (course.exist) {
        buttonList[course.courseNumber].style.backgroundColor = 'green';
      }
    }
  });
}

// TODO: 
if (location.pathname == '???') {

}