let aosElements = Array.from(document.querySelectorAll('.aos'));

window.addEventListener('scroll', throttle(scanElement, 500));

function scanElement(e){
  console.count(e);
  aosElements.forEach(element => {
    if(isVisible(element)){
      element.classList.add('active');
    }else{
      element.classList.remove('active');
    }
  });
}

function isVisible(element){
  const elementDiv = element.getBoundingClientRect();
  let distanceFromTop = -300;
  return elementDiv.top - window.innerHeight < distanceFromTop ? true : false;
}

function throttle(fn, delay){
  let lastCall = 0;
  return function(arguments){
    console.log(arguments)
    let context = this;
    let current = new Date().getTime();
    if(current - lastCall < delay){
      return;
    }
    lastCall = current;
    return fn.apply(context, arguments)
  }
}