async function recolor_list(cache) {
  let nodes  = window.frames.topFrame.document.body.querySelectorAll('td.word, tr.word');
  let is_pre = window.frames.topFrame.document.body.querySelectorAll('td.word').length > 0;
  let n = is_pre ? nodes.length / 11 : nodes.length;
  let prof_namess = [], prog_names = [], syll_nodes = [];
  for (let i = 0; i < n; ++i) {
    let prog_node = is_pre ? nodes[i*11 + 1] : nodes[i].querySelectorAll('td')[2];
    let prof_node = is_pre ? nodes[i*11 + 5] : nodes[i].querySelectorAll('td')[6];
    let syll_node = is_pre ? nodes[i*11 + 10].childNodes[0]
      : nodes[i].querySelectorAll('td')[13].childNodes[0].childNodes[1];
    prog_names.push((prog_node.innerText.match(/\S+/) || [""])[0]);
    prof_namess.push(prof_node.innerText.split(/\s|[A-z]|,|-/).filter(s => 0 < s.length));
    syll_nodes.push(syll_node);
  }
  for (let i = 0; i < n; ++i) {
    if (prog_names[i].length == 0 || prof_namess[i].length == 0) continue;
    let param = prog_names[i] + ':' + prof_namess[i].sort().join(';');
    let uri = `https://nthuscoresharing.firebaseio.com/queries/${param}.json`;
    if (param in cache) {
      if (cache[param]) syll_nodes[i].style.backgroundColor = "green";
    } else {
      fetch(uri).then(r => r.text()).then(r => {
        if (JSON.parse(r)) {
          cache[param] = true;
          syll_nodes[i].style.backgroundColor = "green";
        } else {
          cache[param] = false;
        }
      });
    }
  }
}
