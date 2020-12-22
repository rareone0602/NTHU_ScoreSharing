window.onload = function() {
  // 在這撰寫javascript程式碼

  
   let link= document.querySelector('#link1');  
    link.addEventListener('click', function (event) {
 chrome.tabs.create({active: true, url: 'https://sites.google.com/view/mins-policy/home'});
     return false;
});
    link= document.querySelector('#link2');  
    link.addEventListener('click', function (event) {
 chrome.tabs.create({active: true, url: 'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/'});
     return false;
});
    let Syllabus= document.querySelector('.Syllabus');
    let img= document.querySelector('.instructions img');  
    Syllabus.addEventListener('click', function (event) {
      Syllabus.style.visibility= "hidden";
      img.style.visibility= "visible";
      Syllabus.style.zIndex = 0;
      img.style.zIndex=1;
});
      
    img.addEventListener('click', function (event) {
      Syllabus.style.visibility= "visible";
      img.style.visibility= "hidden";
      Syllabus.style.zIndex = 1;
      img.style.zIndex=0;
});
  };
    

//{url: $(this).attr('https://google.com')}