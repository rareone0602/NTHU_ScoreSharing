"use strict";
const ccxpServer = "https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE";
function loadNthuTranscript(args) {
  return fetch(`${ccxpServer}/JH/8/R/6.3/JH8R63002.php?ACIXSTORE=${args.token}`).
  then(response => response.text()).
  then(dom => {
    let json = parseNthuTranscriptToJson((new DOMParser()).parseFromString(dom, 'text/html'));
    let courses = Object.keys(json);
    return Promise.all(courses.map(c =>
      fetch(`${ccxpServer}/JH/8/8.3/8.3.3/JH83302.php?ACIXSTORE=${args.token}&c_key=${c}`).
      then(response => response.text()).
      then(dom => [c, {...json[c], ...parseNthuDistributionToJson((new DOMParser()).parseFromString(dom, 'text/html'))}])
    )).then(pairs => Object.fromEntries(pairs));
  }).
  then(courses => {return {university: "NTHU", student: args.account, courses}});
}
