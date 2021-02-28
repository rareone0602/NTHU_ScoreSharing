'use strict'
const host = 'https://mighty-woodland-62500.herokuapp.com';
let handler = {
  loadCourses(message, sender, sendResponse) {
    fetch(`${host}/api/v2/course/show` ,{
      method: 'POST',
      headers:  {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(message.argument)
    }).
    then(response => response.status == 200 ? response.json() : {fail: true}).
    then(sendResponse);
  },
  fetchTranscript(message, sender, sendResponse) {
    let argument = message.argument;
    if (argument.university == "NTHU") {
      loadNthuTranscript(argument).
      then(fetchEnrollments).
      then(sendResponse);
    }
  },
  decaptcha(message, sender, sendResponse) {
    fetch(`${host}/decaptcha/recognize?auth_img=${encodeURIComponent(message.argument)}` ,{
      method: 'GET',
      headers:  {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }).
    then(response => response.status == 200 ? response.json() : {fail: true}).
    then(sendResponse);
  }
};
