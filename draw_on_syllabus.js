function draw_on_syllabus() {
  let token = document.location.href.match(/ACIXSTORE=[^&]+/)[0];
  let ccxp_uri = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/R/6.3/JH8R63002.php?${token}`;
  fetch(ccxp_uri).then(r => r.text()).then(r => { // just to get student id...
    let stu_id = r.match(/\d{8,}/)[0];
    let prog_name = document.body.querySelectorAll('.class3')[3].innerText;
    let prof_name = (document.body.querySelectorAll('.class3')[5].innerText.match(/[^\s(]+/) ||
      [''])[0]; // no alias, could be empty
    if (prog_name.length && prof_name.length) {
      let uri = "https://www.leporidae.ml/get_data";
      uri += `?prog_name=${prog_name}`;
      uri += `&prof_name=${prof_name}`;
      uri += `&stu_id=${stu_id}`;
      fetch(uri).then(r => r.text()).then(r => {
        if (r[0] == '[' && 2 < r.length) { // non-empty array -> valid response
          draw_img(JSON.parse(r));
        }
      })
    }
  });
}
