'use strict'
function getAllRows(doc) {
  return [...doc.querySelector('#T1').rows].filter((v, idx) => idx != 0);
}
