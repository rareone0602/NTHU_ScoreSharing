function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
window.onload = async function() {
  if (document.location.href.match(/select_entry.php\?ACIXSTORE/)) send_data();
  if (document.location.href.match(/Syllabus\/.*c_key=/)) draw_on_syllabus();
  if (window.frames.topFrame) { // course system
    let cache = {};
    while (true) {
      try { recolor_list(cache); }
      catch(err) {}
      await sleep(2000);
    }
  }
};
