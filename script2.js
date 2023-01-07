
UIAnimation = function(props){

  let instanceVar = {
    target : props['target'],
    transYAniSections : props['target'].querySelectorAll('.trans-y-ani'),
  }

  this.options = Object.assign({}, instanceVar, props);

  window.addEventListener('load', () => {
    this.smoothScroll();
  });
  window.addEventListener('resize', () => {
    this.smoothScroll();
  });
  window.addEventListener('scroll', () => {
    this.throttle(this.smoothScroll, 1000)
  })
}
UIAnimation.prototype.smoothScroll = function(){}
UIAnimation.prototype.isVisibleSection = function(){}
UIAnimation.prototype.throttle = function(fn, delay){
  let lastCall = 0;
  let current = new Date().getTime();
  if(current - lastCall < delay){
    return;
  }
  lastCall = current;
  
  return fn.apply(this, arguments);
  
}

TranslateYAni = function(){}
TranslateYAni.prototype = new UIAnimation({
  'target' : document.querySelector('[data-module="transAnimation"]'),
});
TranslateYAni.prototype.constructor = TranslateYAni;
TranslateYAni.prototype.smoothScroll = function(){
  Array.prototype.forEach.call(this.options.transYAniSections, (element) =>{
    if(this.isVisibleSection(element)){
      element.classList.add('is-trans-y-ani');
      return true;
    }
    
  });
  
}
TranslateYAni.prototype.isVisibleSection = function(element){
  const elementDiv = element.getBoundingClientRect();
  let distanceFromTop = -100;
  return elementDiv.top - window.innerHeight < distanceFromTop ? true : false;
}

var animation = new TranslateYAni();

