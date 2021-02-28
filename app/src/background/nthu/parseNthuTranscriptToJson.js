'use strict'
function parseNthuTranscriptToJson(doc) {
  const COURSE_ID_REGEX = /\b\d{3}[12]0([A-V][A-Z ]{0,3})(\d{6})\b/;
  const SCORE_REGEX = /\b(A+|A|A-|B+|B|B-|C+|C|C-|D|E|X|withdraw)\b/;
  let courses = {};
  for (let tr of [...doc.body.querySelectorAll('table')[1].rows].slice(3, -1)) {
    try {
      let row = tr.cells;
      let year_sem = row[0].textContent.trim() + row[1].textContent.trim();
      let course_number = row[2].textContent.trim();
      let course_id = year_sem + course_number;
      let score = row[5].textContent.trim().replace('E', 'F').replace('二退', 'withdraw');
      let [rank, total_enrollment] = (row[7].textContent.trim().match(/(\d+)\/(\d+)/)||[]).slice(1, 3);

      if (COURSE_ID_REGEX.test(course_id) && SCORE_REGEX.test(score)) {
        courses[year_sem + course_number] = {
          score, total_enrollment, rank
        };
      }
    } catch (e) {}
  }
  return courses;
}
