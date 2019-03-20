function htmlDecode(input) {
  let doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

async function send_data() {
  let token = document.location.href.match(/ACIXSTORE=[^&]+/)[0];

  let score_body = await (async() => {
    let uri = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/R/6.3/JH8R63002.php?${token}`;
    let response = await fetch(uri);
    let buffer = await response.arrayBuffer();
    let decoder = new TextDecoder("big5");
    return decoder.decode(buffer);
  })();

  let user_id = score_body.match(/Student Number\D+\d+/)[0].match(/\d+$/)[0];

  let auth = await (async() => {
    let uri = host() + `/validate?user_id=${user_id}`;
    let response = await fetch(uri);
    return response.json();
  })();

  if (auth) return;

  if (!window.confirm("您即將傳送您上過的課程的成績分布至雲端資料庫，您是否同意這個操作？")) {
    return alert("您取消了傳送成績分佈的操作，將無法閱覽雲端資料庫中的歷年成績分布表。");
  } // TODO: permanent permission

  let course_ids = score_body.match(/form1.get_ckey.value="[^"]+/g)
    .map(u => u.substr(22));
  let syll_urls = score_body.match(/common\/Syllabus[^"]+/g)
    .filter(u => course_ids.includes(u.match(/c_key=[^&]+/)[0].substr(6)))
    .map(u => `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/${u}`);

  let data = (await (async() =>
    await Promise.all(
      syll_urls.map(async uri => {
        let response = await fetch(uri);
        let buffer = await response.arrayBuffer();
        let decoder = new TextDecoder("big5");
        let text = htmlDecode(decoder.decode(buffer));
        let course_id = text.match(/Number.{15}/)[0].substr(-15);
        let prof_names = text.match(/Instructor\s+[^\n]+/)[0]
          .split(/[\s()A-z-,]/)
          .filter(s => s.length);
        let course_name = text.match(/Course Title\s+\S+/)[0]
          .split(/\s/)
          .slice(-1)[0];
        let score = await (async() => {
          let uri = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/8.3/8.3.3/JH83302.php?${token}&c_key=${course_id}`;
          let response = await fetch(uri);
          let text = await response.text();
          let nums = text.match(/td>&nbsp;<br|td>\d+\.?\d+%<br>\D+\d+/g)
            .map(s => parseInt((s.match(/\d+$/) || "0")[0]));
          return nums;
        })();
        return score[12] ? null : {
          course_id: course_id,
          course_name: course_name,
          prof_names: prof_names,
          score: score
        };
      })
    )
  )()).filter(n => n);

  fetch(host() + '/post_data', {
    method: 'POST',
    body: JSON.stringify({ user_id: user_id, courses: data })
  });
}
