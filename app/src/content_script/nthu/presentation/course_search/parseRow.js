'use strict'
function parseRow(row) {
  const COURSE_ID_REGEX = /\b\d{3}[12]0([A-V][A-Z ]{0,3})(\d{6})\b/;
  let td = row.children;
  let course_id = td[0].textContent.trim();
  return COURSE_ID_REGEX.test(course_id) ? course_id : null;
}
