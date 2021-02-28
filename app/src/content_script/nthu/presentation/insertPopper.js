function insertPopper() {
  let popper = document.createElement('div');
  popper.className = "popper";
  popper.style.cssText = "position: absolute;background: #F5F5F5;color: black;width: 600px;height: 300px;border-radius: 20px;box-shadow: 0 0 2px rgba(0,0,0,0.5);padding: 10px;text-align: center;margin-right: 10px;";
  popper.setAttribute("hidden","")
  let popper_arrow = document.createElement('div');
  popper_arrow.className = "popper_arrow";
  popper_arrow.style.cssText = "width: 0;height: 0;border-style: solid;position: absolute;margin: 5px;border-width: 10px 0 10px 10px;border-color: transparent transparent transparent #D3D3D3;right: -10px;top: calc(50% - 15px);margin-left: 0;margin-right: 0;"
  popper.appendChild(popper_arrow);
  return popper;
}
