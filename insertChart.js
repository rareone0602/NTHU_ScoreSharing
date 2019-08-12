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
    let pageDiv = document.querySelectorAll('div')[1];
    let chart = document.createElement('canvas');
    chart.width = "480";
    chart.height = "300";
    chart.style = "border: 3px solid rgba(54,162,235,0.4); margin: 0 0 15px; padding: 15px 21px; border-radius: 6px;"
    pageDiv.prepend(chart);
    drawChart(course);
  }
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
        enrollmentNumber: course.enrollmentNumber,
        backgroundColor: Array(Grade.length).fill('rgba(54, 162, 235, 0.4)'),
        borderColor: Array(Grade.length).fill('rgba(54, 162, 235, 1)'),
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      title: {
        display: true,
        text: `${course.courseNumber.replace(/\s/g, '')}  ${course.courseTitle[0]} (${course.teacher})`,
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
          footer: function(tooltipItems, data) {
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