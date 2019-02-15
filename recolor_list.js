function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function recolor_list() {
  let token = document.location.href.match(/ACIXSTORE=[^&]+/)[0];
  let is_pre = 1;
  let nodes = window.frames.topFrame.document.body.querySelectorAll('td.word');
  while (!nodes) sleep(1000);
  if (nodes.length == 0) {
    nodes = window.frames.topFrame.document.body.querySelectorAll('tr.word');
    is_pre = 0;
  }
  let stu_id = null;
  if (is_pre) {
    stu_id = window.frames.topFrame.document.body.innerHTML
      .match(/Student ID, Name[^0-9]+[0-9]+/)[0]
      .match(/[0-9]+$/)[0];
  } else {
    stu_id = window.frames.topFrame.document.body
      .querySelectorAll('td.class2')[0].innerHTML.match(/\d+/)[0];
  }
  let n = is_pre ? nodes.length / 11 : nodes.length;
  let prof_names = [];
  let prog_names = [];
  let syll_nodes = [];
  for (let i = 0; i < n; ++i) {
    if (is_pre) {
      if (!nodes[i * 11 + 1].innerText) continue;
      prog_names.push(nodes[i * 11 + 1].innerText.match(/[^<\s]+/)[0]);
      if (!nodes[i * 11 + 5].innerText) continue;
      prof_names.push(nodes[i * 11 + 5].innerText.match(/[^;&\s]*$/)[0]);
      syll_nodes.push(nodes[i * 11 + 10]);
    } else {
      if (!nodes[i].querySelectorAll('td')[2].innerText) continue;
      prog_names.push(nodes[i].querySelectorAll('td')[2].innerText.match(/[^<\s]+/)[0]);
      if (!nodes[i].querySelectorAll('td')[6].innerText) continue;
      prof_names.push(nodes[i].querySelectorAll('td')[6].innerText.match(/^\S+/)[0]);
      syll_nodes.push(nodes[i].querySelectorAll('td')[13]);
    }
  }
  for (let i = 0; i < n; ++i) {
    let uri = `https://www.leporidae.ml/get_data?prog_name=${prog_names[i]}&prof_name=${prof_names[i]}&stu_id=${stu_id}`;
    fetch(encodeURI(uri)).then(r => r.text()).then(r => {
      if (r[0] == '[' && 2 < r.length) {
        if (is_pre) {
          syll_nodes[i].childNodes[0].style.backgroundColor = "green";
        } else {
          syll_nodes[i].childNodes[0].childNodes[1].style.backgroundColor = "green";
        }
      }
    });
  }
}
