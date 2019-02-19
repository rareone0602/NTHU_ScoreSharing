function htmlDecode(input) {
  let doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

function send_data() {
  let token = document.location.href.match(/ACIXSTORE=[^&]+/)[0];
  let ccxp_url = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/R/6.3/JH8R63002.php?${token}`;
  fetch(ccxp_url)
    .then(r => r.arrayBuffer())
    .then(r => { let d = new TextDecoder("big5"); return d.decode(r); })
    .then(r => {
      let stu_id = r.match(/\d{8,}/)[0];
      let uri = `https://www.leporidae.ml/validate?stu_id=${stu_id}`;
      fetch(uri).then(g => g.text()).then(g => {
        if (g == "true") return; // validated
        if (!window.confirm("您即將傳送您上過的課程的成績分布至雲端資料庫，您是否同意這個操作？")) {
          return alert("您取消了傳送成績分佈的操作，將無法閱覽雲端資料庫中的歷年成績分布表。");
        }
        let prog_ids = r.match(/form1.get_ckey.value="[^"]+/g).map(u => u.substr(22));
        let syll_urls = r.match(/common\/Syllabus[^"]+/g)
          .filter(u => prog_ids.includes(u.match(/c_key=[^&]+/)[0].substr(6)))
          .map(u => `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/${u}`);
        for (let i = 0; i < prog_ids.length; ++i) {
          fetch(syll_urls[i])
            .then(r => r.arrayBuffer())
            .then(r => { let d = new TextDecoder("big5"); return htmlDecode(d.decode(r)); })
            .then(r => {
              let prof_name = r.match(/Instructor\s+\S+/)[0].match(/[^\s\(]+\(/)[0].slice(0, -1);
              let prog_name = r.match(/Course Title\s+\S+/)[0].split(/\s/).slice(-1)[0];
              let uri = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/8.3/8.3.3/JH83302.php?${token}&c_key=${prog_ids[i]}`;
              fetch(uri)
                .then(r => r.text())
                .then(r => {
                  let nums = r.match(/td>&nbsp;<br|td>\d+\.?\d+%<br>\D+\d+/g)
                    .map(t => t.match(/\d+$/))
                    .map(n => n ? parseInt(n[0]) : 0);
                  if (nums[12] == 0) { // All scores are sent
                    let obj = {
                      prog_id: prog_ids[i],
                      prog_name: prog_name,
                      prof_name: prof_name,
                      stu_id: stu_id,
                      nums: nums
                    };
                    fetch('https://www.leporidae.ml/send_data', {
                      method: 'POST',
                      body: JSON.stringify(obj)
                    });
                  }
                });
            })
        }
      });
    });
}
