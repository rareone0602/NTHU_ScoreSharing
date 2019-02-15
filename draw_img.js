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
  var grade = [];

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
  }

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E'],
      datasets: grade
    },
    options: {
      title: {
        display: true,
        text: raw_data[0] + '  ' + raw_data[1]
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
            suggestedMax: raw_data[2][0][1][13],
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
