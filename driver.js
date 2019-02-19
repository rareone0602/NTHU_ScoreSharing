function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
window.onload = async function() {
  if (document.location.href.match(/select_entry.php\?ACIXSTORE/)) send_data();
  if (document.location.href.match(/Syllabus\/.*c_key=/)) draw_on_syllabus();
  if (window.frames.topFrame) { // course system
    let last_t = null;
    while (true) {
      try {
        recolor_list(false).then(t => {
          if (last_t != t) { // detect change then recolor
            recolor_list();
            last_t = t;
          }
        });
      } catch(err) {}
      await sleep(2000);
    }
  }
};
