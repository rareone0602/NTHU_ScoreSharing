function parse_course_nodes(frame) {
  let prog_nodes = [], prof_nodes = [], syll_nodes = [];

  try {
    if (frame == frames.topFrame) { // preselect and real select system
      let nodes = frame.document.body.querySelectorAll('td.word, tr.word');
      let is_pre = frame.document.body.querySelectorAll('td.word').length > 0;
      let n = is_pre ? nodes.length / 11 : nodes.length;
      for (let i = 0; i < n; ++i) {
        prog_nodes.push(
          is_pre ? nodes[i*11 + 1]
                 : nodes[i].querySelectorAll('td')[2]
        );
        prof_nodes.push(
          is_pre ? nodes[i*11 + 5]
                 : nodes[i].querySelectorAll('td')[6]
        );
        syll_nodes.push(
          is_pre ? nodes[i*11 + 10].childNodes[0]
                 : nodes[i].querySelectorAll('td')[13].childNodes[0].childNodes[1]
        );
      }
    } else if (~frame.document.body.innerText.indexOf('課程表總錄')) {
      let nodes = frame.document.body.querySelectorAll('tr.class3 td');
      for (let i = 0; i < nodes.length / 13; ++i) {
        prog_nodes.push(nodes[i*13 + 1]);
        prof_nodes.push(nodes[i*13 + 5]);
        syll_nodes.push(nodes[i*13 + 11].childNodes[0]);
      }
    } else if (~frame.document.body.innerText.indexOf('通識課程總錄')) {
      let nodes = frame.document.body.querySelectorAll('td.word');
      for (let i = 0; i < nodes.length / 11; ++i) {
        prog_nodes.push(nodes[i*11 + 1]);
        prof_nodes.push(nodes[i*11 + 5]);
        syll_nodes.push(nodes[i*11 + 10].nextElementSibling.childNodes[0]);
      }
    } else if (frame.document.body.innerText.match(/英語授課科目|Mandarin Courses/)) {
      let nodes = frame.document.body.querySelectorAll('tr.class3 td');
      for (let i = 0; i < nodes.length / 11; ++i) {
        prog_nodes.push(nodes[i*11 + 1]);
        prof_nodes.push(nodes[i*11 + 5]);
        syll_nodes.push(
          Array.from(
            Array.from(nodes[i*11 + 10].childNodes).slice(-2)[0].childNodes
          ).slice(-2)[0]
        );
      }
    } else { // department
      let nodes = frame.document.body.querySelectorAll('tr[bgcolor="#D8DAEB"] td');
      for (let i = 0; i < nodes.length / 13; ++i) {
        prog_nodes.push(nodes[i*13 + 1]);
        prof_nodes.push(nodes[i*13 + 5]);
        syll_nodes.push(nodes[i*13 + 12].childNodes[0]);
      }
    }
  } catch(err) { return [[], [], []]; }

  let prog_names = prog_nodes.map(n =>
    (n.innerText.match(/[^\sA-z]+/) || [""])[0]
  );
  let prof_namess = prof_nodes.map(n =>
    n.innerText.split(/\s|[A-z]|,|-/).filter(s => 0 < s.length)
  );

  return [prog_names, prof_namess, syll_nodes];
}
