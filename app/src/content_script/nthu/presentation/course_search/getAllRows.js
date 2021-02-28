'use strict'
function getAllRows(doc) {
  return [...doc.querySelectorAll('tr.class3')].filter((val, idx) => idx % 2 == 0);
}
