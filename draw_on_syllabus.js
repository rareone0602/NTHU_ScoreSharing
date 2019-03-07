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

  let query_key = `${course_name}:${prof_names.join(';')}`;
  let course_ids = await (async() => {
    const uri = `https://nthuscoresharing.firebaseio.com/queries/${query_key}.json`;
    const response = await fetch(uri);
    const json = await response.json();
    return json ? Object.keys(json).map(s => s.replace(/\+/g, ' ')) : [];
  })();

  let data = await (async() => {
    const uri = `https://nthuscoresharing.herokuapp.com/query?user_id=${user_id}&query_key=${query_key}`;
    const response = await fetch(uri);
    return response.json();
  })();

  if (data) {
    draw_img([course_name, prof_names, data]);
  }
}
