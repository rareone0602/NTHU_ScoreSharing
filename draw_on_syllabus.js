function draw_on_syllabus() {
  let token = document.location.href.match(/ACIXSTORE=[^&]+/)[0];
  let url = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/R/6.3/JH8R63002.php?${token}`;
  fetch(url).then(r => r.text()).then(r => {
    let stu_id = r.match(/Student Number[^0-9]+[0-9]+/)[0].match(/[0-9]+/)[0];
    let t = document.body.innerHTML.match(/tr>\s+<td[^<]+<[^<]+<[^<]+<[^<]+/g);
    let prog_name  = t[1].match(/[^>]+$/)[0].match(/\S+/)[0];
    let prof_name = t[3].match(/>[^>]+$/)[0].match(/[^>(]+/)[0];
    fetch(`https://www.leporidae.ml/get_data?prog_name=${prog_name}&prof_name=${prof_name}&stu_id=${stu_id}`)
      .then(r => r.text())
      .then(r => {
        if (r[0] == '[' && 2 < r.length) {
          let j = JSON.parse(r);
          draw_img(j);
        }
      })
  });
}
