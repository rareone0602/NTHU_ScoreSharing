// insert chart on syllabus
'use strict'

let params = new URLSearchParams(decodeURI(location.search));
let courseNumber = params.get('c_key'); // note that with space

chrome.runtime.sendMessage({
  action: "QueryCourse",
  courseNumber
}, function (data) {
  // callback
  console.log(data);

  for (let course of data.datasets) {
    if (course.absoluteGrade == null) continue;
    course.teacherChineseName = [];
    for (let i = 0; i < course.teacher.length; i += 2) {
      course.teacherChineseName.push(course.teacher[i]);
    }
    let chart = document.createElement('canvas');
    chart.classList.add('swiper-slide');
    chart.width = "480";
    chart.height = "300";
    if (document.querySelector('.swiper-wrapper') == null) {
      AddSwiper();
    }
    document.querySelector('.swiper-wrapper').prepend(chart);
    drawChart(course);
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

function drawChart(course) {
  const Grade = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'X'];
  let ctx = document.querySelector('canvas').getContext("2d");
  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Grade,
      datasets: [{
        label: '# of People',
        data: Grade.map(item => course.absoluteGrade[item]),
        enrollmentNumber: course.absoluteGrade['N'],
        backgroundColor: Array(Grade.length).fill('rgba(54, 162, 235, 0.4)'),
        borderColor: Array(Grade.length).fill('rgba(54, 162, 235, 1)'),
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      title: {
        display: true,
        text: `${course.courseNumber.replace(/\s/g, '')}  ${course.courseTitle[0]} (${course.teacherChineseName})`,
        fontFamily: 'Microsoft JhengHei',
        fontSize: 13
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: course.absoluteGrade['N'],
            stepSize: 1,
            maxTicksLimit: 10
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          footer: function (tooltipItems, data) {
            let a = tooltipItems[0].yLabel;
            let b = data.datasets[0].enrollmentNumber;
            let pc = (100 * a / b).toFixed(1);
            return `Percentage: ${pc}%`;
          }
        }
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          offset: -4,
          color: '#36A2EB'
        }
      }
    }
  });
}

function AddSwiper() {
  let backPlane = (document.body.innerText.search('session is interrupted!') == -1) ?
    document.querySelectorAll('div')[1] : document.body;
  let swiperContainer = document.createElement('div');
  let swiperWrapper = document.createElement('div');
  let swiperPagination = document.createElement('div');
  let swiperButtonNext = document.createElement('div');
  let swiperButtonPrev = document.createElement('div');

  swiperContainer.classList.add('swiper-container');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperPagination.classList.add('swiper-pagination');
  swiperButtonNext.classList.add('swiper-button-next');
  swiperButtonPrev.classList.add('swiper-button-prev');
  // swiperPagination.classList.add('swiper-pagination-white');
  // swiperButtonPrev.classList.add('swiper-button-white');
  // swiperButtonNext.classList.add('swiper-button-white');

  backPlane.prepend(swiperContainer);
  swiperContainer.append(swiperWrapper);
  swiperContainer.append(swiperPagination);
  swiperContainer.append(swiperButtonNext);
  swiperContainer.append(swiperButtonPrev);
  swiperContainer.style = "width: 500; height: 320; border: 3px solid rgba(54,162,235,0.4); margin: 0 0 15px; padding: 15px 60px; border-radius: 6px;";
}