function draw_img(raw_data) {
  if (document.getElementById("myChart")) document.getElementById("myChart").remove();
  var c = document.createElement("canvas");
  c.id = "myChart";
  c.width = "400";
  c.height = "400";
  document.getElementsByTagName("div")[0].prepend(c);//innerHTML += '<canvas id="myChart" width="300" height="300"></canvas>';

  var ctx = document.getElementById('myChart').getContext("2d");
  var bg_color = ['rgba(54, 162, 235, 0.5)', 'rgba(54, 206, 86, 0.5)', 'rgba(255, 206, 86, 0.5)'];
  var bd_color = ['rgba(54, 162, 235, 1.0)', 'rgba(54, 206, 86, 1.0)', 'rgba(255, 206, 86, 1.0)'];
  var grade = [], num_people = 0;

  for (i in raw_data[2]) {
    var data = raw_data[2][i];
    var new_grade = {
      label: data[0],
      backgroundColor: bg_color[i],
      borderColor: bd_color[i],
      borderWidth: 1,
      data: data[1].slice(0, 11)
    };
    grade.push(new_grade);
    num_people += raw_data[2][i][1][13];
  }

  var defaultLegendClickHandler = Chart.defaults.global.legend.onClick;
  var newLegendClickHandler = function (e, legendItem) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;
    var meta = ci.getDatasetMeta(index);

    // See controller.isDatasetVisible comment
    meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;

    var sum = 0;
    for (i in raw_data[2]) {
      // document.write(ci.getDatasetMeta(i).hidden);
      if (ci.getDatasetMeta(i).hidden == null) {
        sum += raw_data[2][i][1][13];
      }
    }
    ci.options.scales.yAxes[0].ticks.suggestedMax = Math.max(10, sum);
    // We hid a dataset ... rerender the chart
    ci.update();
  };

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E'],
      datasets: grade
    },
    options: {
      legend: {
        onClick: newLegendClickHandler
      },
      title: {
        display: true,
        text: raw_data[0] + '  ' + raw_data[1],
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
      responsive: false
    }
  });
}
