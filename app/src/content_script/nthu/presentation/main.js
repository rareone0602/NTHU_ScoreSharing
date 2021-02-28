'use strict';

let rows = getAllRows(document);
let courses = rows.map(parseRow).filter(s=>s).map(s => s.substr(5));
let input = {university: "NTHU", courses};

loadCourses(input).
then(courseInfo => {
  rows.forEach(row => {
    try {
      let course_number = parseRow(row).substr(5);
      if (Object.values(courseInfo[course_number]).some(info => info.average)) {
        row.lastElementChild.querySelector('[type="button"]').style.backgroundColor = 'green';
      }
    } catch(e) {}
  });
  insertListenerToDom(courseInfo, document);
});
