'use strict'

let table = document.querySelector('.sortable');
let columnCount = table.rows[0].cells.length;
table.rows[0].insertCell(columnCount);
table.rows[0].cells[columnCount].align = 'center';
table.rows[0].cells[columnCount].innerText = '待亂數人數志願序';

let datasets = Array();
let data = {};
for (let i = 1; i < table.rows.length; i++) {
  table.rows[i].insertCell(columnCount);
  table.rows[i].cells[columnCount].align = 'center';
  datasets.push({ "courseNumber": table.rows[i].cells[0].firstChild.innerHTML });
}
chrome.runtime.sendMessage({
  action: 'QueryOrderList',
  datasets
}, function (rawdata) {
  for (let course of rawdata.datasets) {
    data[course.courseNumber] = {};
    data[course.courseNumber].available = course.available;
    data[course.courseNumber].result = course.result;
  }
  console.log(data);

  for (let i = 1; i < table.rows.length; i++) {
    let courseNumber = table.rows[i].cells[0].firstChild.innerHTML;
    if (data[courseNumber].available) {
      let div = document.createElement('div');
      div.classList.add('tooltip');
      div.innerText = 'detail';
      table.rows[i].cells[columnCount].append(div);

      let canvas = document.createElement('canvas');
      canvas.classList.add('tooltiptext');
      canvas.id = courseNumber;
      canvas.height = 300;
      canvas.width = 600;
      div.append(canvas);

      div.addEventListener("mouseover", function () { createChart(courseNumber); });
      div.addEventListener("mouseout", function () { RemoveChart(courseNumber); });
    }
  }
});


// ============= chart ================
let myChart;

function createChart(courseNumber) {
  var ctx = document.getElementById(courseNumber).getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data[courseNumber].result),
      datasets: [{
        label: '# of People',
        data: Object.values(data[courseNumber].result)
      }]
    },
    options: {
      responsive: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 1,
            maxTicksLimit: 10
          }
        }]
      }
    }
  });
}

function RemoveChart(index) {
  myChart.destroy();
}
