function draw_img(raw_data) {
  if (document.getElementById("myChart")) document.getElementById("myChart").remove();
  var c = document.createElement("canvas");
  c.id = "myChart";
  c.width = "400";
  c.height = "400";
  document.getElementsByTagName("div")[0].prepend(c);

  var ctx = document.getElementById('myChart').getContext("2d");
  var bg_color = ['rgba(54, 162, 255, 0.7)', 'rgba(54, 206, 86, 0.7)', 'rgba(255, 206, 86, 0.7)'];
  var bd_color = ['rgba(54, 162, 255, 1.0)', 'rgba(54, 206, 86, 1.0)', 'rgba(255, 206, 86, 1.0)'];

  // fucture data type
  var courses = [];
  for (i in raw_data[2]) {
    var course = {
      course_name: raw_data[0],
      course_teacher: raw_data[1], // TODO: more than one teacher
      course_number: raw_data[2][i][0],
      registered_numbers: raw_data[2][i][1][13],
      grade_distribution: raw_data[2][i][1].slice(0, 11)
    };
    courses.push(course);
  }
  
  var graph_data = [];
  var num_people = 0;

  for (i in courses) {
    var data = {
      label: courses[i].course_number,
      backgroundColor: bg_color[i],
      borderColor: bd_color[i],
      borderWidth: 1,
      data: courses[i].grade_distribution,
      hidden: false
    };
    num_people += courses[i].registered_numbers;
    graph_data.push(data);
  }

  var newLegendClickHandler = function (e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;
    var meta = ci.getDatasetMeta(index);

    meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;

    if (meta.hidden) {
      num_people -= courses[index].registered_numbers;
    } else {
      num_people += courses[index].registered_numbers;
    }
    ci.options.scales.yAxes[0].ticks.suggestedMax = Math.max(10, num_people);
    ci.update();
  };

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E'],
      datasets: graph_data
    },
    options: {
      responsive: false,
      title: {
        display: true,
        text: raw_data[0] + ' -- ' + raw_data[1]
      },
      tooltips: {
        mode: 'index',
        intersect: true,
        callbacks: {
          footer: function(tooltipItems, data) {
            var sum = 0;
            tooltipItems.forEach(function(tooltipItem) {
              sum += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            });
            return '百分比: ' + (sum / num_people * 100).toFixed(1) + ' %';
          },
        },
        footerFontStyle: 'normal'
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            display: true,
            suggestedMin: 0,
            suggestedMax: num_people,
            callback: function (value) {
              return value + '人';
            }
          }
        }]
      },
      legend: {
        onClick: newLegendClickHandler
      },
    }
  });
}
