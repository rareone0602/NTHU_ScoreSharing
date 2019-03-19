async function recolor_list(prog_names, prof_namess, syll_nodes, cache) {
  for (let i = 0; i < prog_names.length; ++i) {
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
