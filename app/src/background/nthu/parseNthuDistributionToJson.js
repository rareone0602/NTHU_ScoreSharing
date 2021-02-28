'use strict'
function parseNthuDistributionToJson(doc) {
  try {
    let row = doc.querySelector('table').querySelector('[cellspacing]').querySelectorAll('tr')[1].cells;
    let ret = {};
    ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F", "X", "U", "total_enrollment"].forEach((val, i) => {
      try {
        ret[val] = row[i + 1].textContent.match(/\((\d+)/)[1];
      } catch(e) {}
    });
    return ret;
  } catch (e) {
    return {};
  }
}
