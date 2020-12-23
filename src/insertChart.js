'use strict'

let params = new URLSearchParams(decodeURI(location.search));
let courseNumber = params.get('c_key');

if (location.pathname == '/ccxp/INQUIRE/JH/8/8.3/8.3.3/JH83302.php') {
  chrome.runtime.sendMessage({
    action: "QueryCourseScore",
    courseNumber
  }, function (response) {
    console.log(response);
    let hr = document.createElement('hr');
    hr.style.cssText ="border: 0;height: 2px;background: #333;background-image: linear-gradient(to right, #ccc, #333, #ccc);"
    document.querySelector('div').append(hr);
    let text = document.createElement('div');
    let textNode = document.createTextNode("以下內容由NTHU_ScoreSharing提供");
    text.style.cssText = "font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;color: #666;font-size: 16px; font-weight: bold;text-align: center;margin: 30px;";
    text.appendChild(textNode);
    document.querySelector('div').append(text);


    for (let course of response.datasets) {
      if (course.courseNumber == courseNumber) {
        let chart = document.createElement('canvas');
        chart.width = "640";
        chart.height = "480";

        // old api format
        course.countGrade['unknown'] = course.enrollmentNumber - course.countGrade['N'];

        delete course.countGrade['N'];
        delete course.countGrade['U'];
        draw_DoughnutChart(chart, course.countGrade);
      //  document.querySelector('div').append(chart);

        let text = document.createElement('div');
        let textNode = document.createTextNode("此圖根據使用者資料統計，非完全上課人數");
        text.style.cssText = "font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;color: #666;font-size: 16px; font-weight: bold;";
        text.appendChild(textNode);
        document.querySelector('div').append(chart);
        document.querySelector('div').append(text);
      }
    }
  });
}

if (location.pathname == '/ccxp/COURSE/JH/common/Syllabus/1.php' || location.pathname == '/ccxp/INQUIRE/JH/common/Syllabus/1.php') {
  let iscreateSwiper = false;

  chrome.runtime.sendMessage({
    action: "QueryCourseScore",
    courseNumber
  }, function (response) {
    console.log(response);

    for (let course of response.datasets) {
      if (course.enrollmentNumber == null) {
        continue;
      }
      if (!iscreateSwiper) {
        createSwiper();
        iscreateSwiper = true;
      }
      let chart = document.createElement('canvas');
      chart.width = "480";
      chart.height = "300";
      chart.classList.add('swiper-slide');
      document.querySelector('.swiper-wrapper').prepend(chart);
      // old api format
      course.teacherChineseName = [];
      for (let i = 0; i < course.teacher.length; i += 2) {
        course.teacherChineseName.push(course.teacher[i]);
      }
      if (course.absoluteGrade == null) {
        draw_BarChart_Rela(chart, course)
      } else {
        draw_BarChart(chart, course);
      }
    }

    let swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 60,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      keyboard: {
        enabled: true,
      }
    });

  });
}
