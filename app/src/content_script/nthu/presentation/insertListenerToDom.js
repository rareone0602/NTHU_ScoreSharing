function insertListenerToDom(courseInfo, dom) {
  function menuOpenCloseErgoTimer(delay, actionFunction) {
    clearTimeout(this.delayTimer || 0);
    this.delayTimer = setTimeout(actionFunction, delay);
  }

  let popper = insertPopper();
  dom.body.appendChild(popper);
  let popperInstance = {};

  for (let row of getAllRows(dom)) {
    var target = row.lastElementChild;
    target.addEventListener("mouseenter", (mouseEvent) => {
      let yearsem_course_id = parseRow(mouseEvent.target.parentNode);
      let year_sem = yearsem_course_id.substr(0, 5);
      let course_id = yearsem_course_id.substr(5);
      let filtered_yearsem_info = Object.entries(courseInfo[course_id]).
        filter(key_value => key_value[1].average).sort().reverse();
      if (filtered_yearsem_info.length == 0) return;
      menuOpenCloseErgoTimer(0, () => {

        popper.querySelectorAll('.swiper-container').forEach(e => e.parentNode.removeChild(e));
        popper.removeAttribute("hidden");

        let swiperContainer = dom.createElement('div'),
            swiperWrapper = dom.createElement('div'),
            swiperPagination = dom.createElement('div'),
            swiperButtonNext = dom.createElement('button'),
            swiperButtonPrev = dom.createElement('button');

        swiperContainer.className = "swiper-container";
        swiperWrapper.className = "swiper-wrapper";
        swiperPagination.className = "swiper-pagination";
        swiperButtonNext.className = "swiper-button-next";
        swiperButtonPrev.className = "swiper-button-prev";
        swiperButtonNext.style.cssText += "border: 0;background-color: transparent;";
        swiperButtonPrev.style.cssText += "border: 0;background-color: transparent;";

        for (let [year_sem, info] of filtered_yearsem_info) {
          let distribution = Object.entries(info.distribution).filter(arr => arr[1]).sort();
          let data = {
            datasets: [{
              data: distribution.map(arr => arr[1]),
              backgroundColor: distribution.map(arr => {
                return {
                  "A+": 'rgba(54, 162, 235, 0.8)',
                  "A" : 'rgba(54, 162, 235, 0.5)',
                  "A-": 'rgba(54, 162, 235, 0.3)',
                  "B+": 'rgba(75, 192, 192, 0.8)',
                  "B" : 'rgba(75, 192, 192, 0.5)',
                  "B-": 'rgba(75, 192, 192, 0.3)',
                  "C+": 'rgba(255, 206, 86, 0.8)',
                  "C" : 'rgba(255, 206, 86, 0.5)',
                  "C-": 'rgba(255, 206, 86, 0.3)',
                  "D" : 'rgba(255, 99, 132, 0.8)',
                  "F" : 'rgba(255, 99, 132, 0.5)',
                  "X" : 'rgba(255, 99, 132, 0.3)',
                  "unknown": 'rgba(0, 0, 0, 0.2)',
              }[arr[0]]}),
              borderWidth: 0,
            }],
            labels: distribution.map(arr => arr[0])
          };
          swiperWrapper.appendChild(insertPieChart(data, year_sem, info));
        }

        swiperContainer.appendChild(swiperWrapper);
        swiperContainer.appendChild(swiperPagination);
        swiperContainer.appendChild(swiperButtonNext);
        swiperContainer.appendChild(swiperButtonPrev);
        popper.appendChild(swiperContainer);

        new Swiper('.swiper-container', {
          spaceBetween: 30,
          centeredSlides: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        });

        popperInstance = Popper.createPopper(mouseEvent.target, dom.querySelector(".popper"), {
          placement: 'left',
          modifiers: [{
            name: 'offset',
            options: {
              offset: [0, 20],
            },
          }],
        });
      });
    });
    target.addEventListener("mouseleave", (mouseEvent) => {
      menuOpenCloseErgoTimer (300, () => {
        popper.setAttribute("hidden", "");
        popper.querySelectorAll('.swiper-container').forEach(e => e.parentNode.removeChild(e));
      });
    });
    target.addEventListener("mousemove", (mouseEvent) => {
      try {
        if (typeof(eval(popperInstance.update())) == "function") {
          popperInstance.update();
          return true;
        }
      } catch(e) {}
    });
  }
  popper.addEventListener("mouseenter", (mouseEvent) => {
    menuOpenCloseErgoTimer(0, () => {
      popper.removeAttribute("hidden");
    });
  });
  popper.addEventListener("mouseleave", (mouseEvent) => {
    menuOpenCloseErgoTimer(300, () => {
      popper.setAttribute("hidden", "");
      mouseEvent.target.querySelectorAll('.swiper-container').forEach(e => e.parentNode.removeChild(e));
    });
  });
}
