async function recolor_list(prog_names, prof_namess, syll_nodes, cache) {
  let queries = [];
  for (let i = 0; i < prog_names.length; ++i) {
    let param = prog_names[i] + ':' + prof_namess[i].sort().join(';');
    if (param in cache) {
      if (cache[param]) syll_nodes[i].style.backgroundColor = "green";
    } else {
      queries.push(param);
    }
  }
  if (queries.length) {
    fetch(
      host() + '/v2/exist', {
        method: 'POST',
        body: JSON.stringify({ queries: queries })
      }
    ).then(r => r.json()).then(r => {
      for (let i = 0; i < queries.length; ++i) cache[queries[i]] = r[i];
    });
  }
}
