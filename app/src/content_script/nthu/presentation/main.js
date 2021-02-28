'use strict';

let rows = getAllRows(document);
let courses = rows.map(parseRow).map(s => s.substr(5));
let input = {university: "NTHU", courses};

loadCourses(input).
then(courseInfo => {
  rows.forEach(row => {
    let course_number = parseRow(row).substr(5);
    if (Object.values(courseInfo[course_number]).some(info => info.average)) {
      row.lastElementChild.firstElementChild.style.backgroundColor = 'green';
    }
  });
  insertListenerToDom(courseInfo, document);
});
