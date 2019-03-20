async function draw_on_syllabus() {
  let user_id = await (async () => {
    const token = document.location.href.match(/ACIXSTORE=[^&]+/)[0];
    const uri = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/R/6.3/JH8R63002.php?${token}`;
    const response = await fetch(uri);
    const text = await response.text();
    return text.match(/Student Number\D+\d+/)[0].match(/\d+$/)[0];
  })();
  let course_name = document.body.querySelectorAll('.class3')[3].innerText;
  let prof_names = Array.from(
    document.body.querySelectorAll('.class3')[5].childNodes
  ).filter((a, i) => ~i&1).map(t => t.data.match(/[^\s(]+/)[0]).sort();
  if (course_name.length == 0 || prof_names.length == 0) return;
  let query_key = `${course_name}:${prof_names.join('%3B')}`;

  let data = await (async() => {
    const uri = host() + `/query?user_id=${user_id}&query_key=${query_key}`;
    const response = await fetch(uri);
    const text = await response.text();
    try { return JSON.parse(text); }
    catch(err) { return null; }
  })();

  if (data && data.length) draw_img([course_name, prof_names, data]);
}
