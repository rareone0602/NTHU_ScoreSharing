function insertPieChart(data, year_sem, course) {
  let pieOptions = {
      title: {
        display: true,
        text: year_sem + ' ' + course.instructor + ' 平均：' + course.average
      },
      radiusBackground: {
        color: '#d1d1d1'
      },
      segmentShowStroke : true,
      animation: {
        onComplete: function () {
          var ctx = this.chart.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach(function (dataset) {
            for (var i = 0; i < dataset.data.length; i++) {
              var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                  total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                  label = model.label,
                  mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                  start_angle = model.startAngle,
                  end_angle = model.endAngle,
                  mid_angle = start_angle + (end_angle - start_angle)/2;
              var x = mid_radius * Math.cos(mid_angle);
              var y = mid_radius * Math.sin(mid_angle);

              ctx.fillStyle = '#fff';
              if (i == 3){ // Darker text color for lighter background
                ctx.fillStyle = '#444';
              }
              var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
              //Don't Display If Legend is hide or value is 0
              if(dataset.data[i] != 0 && Object.values(dataset._meta)[0].data[i].hidden != true) {
                //ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                ctx.fillText(percent, model.x + x, model.y + y + 0);
                ctx.fillText(label, model.x + x, model.y + y + 15);
              }
            }
          });
        }
      }
    };

  let canvas = document.createElement("canvas")
  canvas.className = "swiper-slide";
  let countries = canvas.getContext("2d");
  new Chart(countries, {
    type: 'doughnut',
    data: data,
    options: pieOptions
  });
  return canvas;
}
