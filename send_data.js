function htmlDecode(input) {
  let doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

function send_data() {
  let token = document.location.href.match(/ACIXSTORE=[^&]+/)[0];
  let url = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/R/6.3/JH8R63002.php?${token}`;
  fetch(url)
    .then(r => r.arrayBuffer())
    .then(r => { let d = new TextDecoder("big5"); return d.decode(r); })
    .then(r => {
      let stu_id = r.match(/Student Number[^0-9]+[0-9]+/)[0].match(/[0-9]+/)[0];
      fetch(`https://www.leporidae.ml/get_data?prog_name=%E8%A8%88%E7%AE%97%E6%A9%9F%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88%E4%BA%8C&prof_name=%E6%9D%8E%E5%93%B2%E6%A6%AE&stu_id=${stu_id}`)
        .then(g => g.text())
        .then(g => {
          if (g == "Unauthorized student ID") {
            let perm = prompt("You are about to send score distributions to our server, are you sure?\nPlease type the two letters \"OK\" without additional characters to confirm:");
            if (perm != "OK") {
              alert(`We did not send your data because you entered "${perm}"`);
              return;
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
                      let prof_name = r.match(/Instructor\s+[\S]+/)[0].match(/[^\s\(]+\(/)[0].slice(0, -1);
                      let prog_name = r.match(/Course Title\s+[\S]+/)[0].split(/\s/).slice(-1)[0];
                      let dist_url = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/8.3/8.3.3/JH83302.php?${token}&c_key=${prog_ids[i]}`;
                      fetch(dist_url)
                        .then(r => r.text())
                        .then(r => {
                          let nums = r.match(/td>&nbsp;<br|td>[0-9]+\.?[0-9]+%<br>[^0-9]+[0-9]+/g)
                            .map(t => t.match(/[0-9]+$/))
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
          }
        });
    });
}
