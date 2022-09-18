var UIAnimation = function(props){
  //필드
  var __target = document.querySelector(props['target']);
  console.log(__target)
  var winScrollTop;
  var sectionOfffsetTop;
  var sectionHeight;
  var sectionOffsetBottom;
  var checkInSection = false;
  var fastIn;

  // var startFunction = props['option'];
  // var isFunction = typeof(startFunction) === 'function' ? true : false;

  function init(){
    
    setScroll();
    setInSection();
  }
  
  function setProperty(){
    fastIn = window.innerHeight / 2;
    winScrollTop = window.pageYOffset;
    sectionOfffsetTop = __target.getBoundingClientRect().top + winScrollTop - fastIn;
    sectionHeight = __target.offsetHeight;
    sectionOffsetBottom = sectionOfffsetTop + sectionHeight + fastIn;
    
  }

  function setInSection(){
    setProperty();

    if(winScrollTop >= sectionOfffsetTop && winScrollTop <= sectionOffsetBottom) {
      if(!checkInSection) {
        checkInSection = true;
        __target.classList.add("active")
        // startFunction();
    }
    }
  }

  function setScroll(){
    window.addEventListener('scroll', function(){
      setInSection();
    }, false);
  }

  init();
}

//구현(실체)클래스
var ScrollAnimation = function(element){
  var result = new UIAnimation({
    "target" : element
  });
}


//실행클래스
var result1 = new ScrollAnimation(".sec01");
var result2 = new ScrollAnimation(".section_product .prd_mask");

// ScrollAnimation(".sec01", function(){
	// 	document.querySelector('.sec01').classList.add('active');
	// });
	
	// ScrollAnimation('.section_product .prd_mask', function(){
	// 	document.querySelector('.section_product .prd_mask').classList.add('active');
	// });