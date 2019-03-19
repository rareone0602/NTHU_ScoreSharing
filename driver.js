function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
window.onload = async function() {
  if (document.location.href.match(/select_entry.php\?ACIXSTORE/)) send_data();
  if (document.location.href.match(/Syllabus\/.*c_key=/)) draw_on_syllabus();
  let cache = {};
  while (true) {
    if (frames.topFrame || frames.main || frames[2]) {
      let [prog_names, prof_namess, syll_nodes] =
        parse_course_nodes(frames.topFrame || frames.main || frames[2]);
      try { recolor_list(prog_names, prof_namess, syll_nodes, cache); }
      catch(err) {}
    }
    await sleep(2000);
  }
};
