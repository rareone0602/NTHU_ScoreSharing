'use strict'

function draw_DoughnutChart(canvas, dist) {
  const bgColor = {
    "A+": 'rgba(54, 162, 235, 0.6)',
    "A" : 'rgba(54, 162, 235, 0.6)',
    "A-": 'rgba(54, 162, 235, 0.6)',
    "B+": 'rgba(75, 192, 192, 0.6)',
    "B" : 'rgba(75, 192, 192, 0.6)',
    "B-": 'rgba(75, 192, 192, 0.6)',
    "C+": 'rgba(255, 206, 86, 0.6)',
    "C" : 'rgba(255, 206, 86, 0.6)',
    "C-": 'rgba(255, 206, 86, 0.6)',
    "D" : 'rgba(255, 99, 132, 0.6)',
    "E" : 'rgba(255, 99, 132, 0.6)',
    "X" : 'rgba(255, 99, 132, 0.6)',
    "unknown": 'rgba(0, 0, 0, 0.2)',
  };

  let ctx = canvas.getContext("2d");
  let myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: Object.values(dist),
        backgroundColor: Object.values(bgColor),
      }],
      labels: Object.keys(bgColor)
    },
    options: {
      responsive: false,
      legend: {
        display: false
      },
      plugins: {
        labels: {
          render: 'label',
          position: 'outside',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          fontSize: 16,
        },
        datalabels: false,
      }
    }
  });
}

function draw_BarChart(canvas, course) {
  const Grade = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'X'];
  let ctx = canvas.getContext("2d");
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
        },
        labels: false
      }
    }
  });
}

function draw_BarChart_Rela(canvas, course) {
  const Grade = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'X'];
  let ctx = canvas.getContext("2d");
  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Grade,
      datasets: [{
        label: '# of People',
        data: Grade.map(item => course.relativeGrade[item]),
        enrollmentNumber: course.enrollmentNumber,
        backgroundColor: Array(Grade.length).fill('rgba(255, 99, 132, 0.3)'),
        borderColor: Array(Grade.length).fill('rgba(255, 99, 132, 1)'),
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      title: {
        display: true,
        text: `${course.courseNumber.replace(/\s/g, '')}  ${course.courseTitle[0]} (${course.teacherChineseName}) [相對成績]`,
        fontFamily: 'Microsoft JhengHei',
        fontSize: 13
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: course.enrollmentNumber,
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
          color: '#E74C3C'
        },
        labels: false
      }
    }
  });
}

function createSwiper() {
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