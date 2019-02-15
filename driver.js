function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = async function() {
  if (document.location.href.match(/select_entry.php\?ACIXSTORE/)) {
    send_data();
  } else if (document.location.href.match(/c_key=[^&]/)) {
    draw_on_syllabus();
  } else if (window.frames.topFrame) {
    while (true) {
      try {
        let is_pre = 0 < window.frames.topFrame.document.body.querySelectorAll('td.word').length;
        let t = is_pre ? window.frames.topFrame.document.querySelectorAll('td.word')[0].textContent
                       : window.frames.topFrame.document.querySelectorAll('tr.word')[0].textContent;
        recolor_list();
        while (true) {
          let idle = 1;
          let tw = is_pre ? window.frames.topFrame.document.querySelectorAll('td.word')
                          : window.frames.topFrame.document.querySelectorAll('tr.word');
          if (tw && tw[0]) {
            let u = tw[0].textContent;
            if (u != t) {
              idle = 0;
              t = u;
              await sleep(1000);
            }
          } else {
            t = null;
          }
          if (!idle &&
              tw &&
              tw[0].textContent == t) {
            recolor_list();
          }
          await sleep(3500);
        }
      } catch(err) {
        await sleep(3500);
        continue;
      }
    }
  }
}
