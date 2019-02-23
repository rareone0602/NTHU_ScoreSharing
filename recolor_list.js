async function recolor_list(cache, recolor = true) {
  let token  = document.location.href.match(/ACIXSTORE=[^&]+/)[0];
  let nodes  = window.frames.topFrame.document.body.querySelectorAll('td.word, tr.word');
  let is_pre = window.frames.topFrame.document.body.querySelectorAll('td.word').length > 0;
  let stu_id = window.frames.topFrame.document.querySelector('tr td.class2').innerText
    .match(/\d{8,}/)[0];
  let n = is_pre ? nodes.length / 11 : nodes.length;
  let prof_names = [], prog_names = [], syll_nodes = [];
  for (let i = 0; i < n; ++i) {
    let prog_node = is_pre ? nodes[i*11 + 1] : nodes[i].querySelectorAll('td')[2];
    let prof_node = is_pre ? nodes[i*11 + 5] : nodes[i].querySelectorAll('td')[6];
    let syll_node = is_pre ? nodes[i*11 + 10].childNodes[0]
                           : nodes[i].querySelectorAll('td')[13].childNodes[0].childNodes[1];
    prog_names.push((prog_node.innerText.match(/\S+/) || [""])[0]);
    prof_names.push((prof_node.innerText.match(/\S+/) || [""])[0]);
    syll_nodes.push(syll_node);
  }
  if (!recolor) return prog_names[0]; // if !recolor then return hash of the content, (lazy)
  for (let i = 0; i < n; ++i) {
    if (prog_names[i].length == 0 || prof_names[i].length == 0) continue;
    let uri = "https://www.leporidae.ml/get_data";
    uri += `?prog_name=${prog_names[i]}`;
    uri += `&prof_name=${prof_names[i]}`;
    uri += `&stu_id=${stu_id}`;
    if (uri in cache) {
      if (cache[uri]) {
        syll_nodes[i].style.backgroundColor = "green";
      }
    } else {
      fetch(encodeURI(uri)).then(r => r.text()).then(r => {
        if (r[0] == '[' && 2 < r.length) { // non-empty array -> valid response
          cache[uri] = true;
          syll_nodes[i].style.backgroundColor = "green";
        } else {
          cache[uri] = false;
        }
      });
    }
  }
}
