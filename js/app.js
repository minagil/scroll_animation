const scrollDOM = {
  topScrollBody : document.querySelector('#scroll_sectionTop'),
}
const ScrollWrap = function(){
  let winScrollTop = null;
  const isMobile = false;
  
  
  function scrollFunc(){
    setProperty();
    contentIn();
  }

  function setProperty(){
    winScrollTop = window.pageYOffset;
  }

  function contentIn(){
    if(scrollDOM.topScrollBody){
      const phone = document.querySelector('.body_container main section.top .phone_wrap');
      const videoTarget = document.querySelector('.body_container main section.top .phone_wrap video');
      const {bottom, width} = phone.getBoundingClientRect();
      const isFullSize = bottom < window.innerHeight;
      const isTop = ((winScrollTop - 141) / (scrollDOM.topScrollBody.clientHeight - 141)) * 100;
  
      if(isMobile){
  
      }else{
        if(isTop > 0 && isTop <= 100){
          console.log('sss')
        }
      }
    }
  }

  window.addEventListener('scroll', (e) => {
    scrollFunc();
  });
}

const mainAni = new ScrollWrap();

/* slider */
const Slider = function(props){
  this.idx = 0;
  this.isSliding = false;
  this.track = props.itemTrack;
  this.itemWidth = props.itemWidth.offsetWidth + 40;
  this.children = this.track.children;
  this.options = {
    autoSpeed: 2500,
  }
  this.customEvent = {
    prev : new CustomEvent('slideLeft'),
    next : new CustomEvent('slideRight'),
  }
  this.autoSlide = null;
  this.progressBar = null;

  this.initStyle();
  // this.slide();
  this.createClones();
  // this.setAutoSlide();
}
Slider.prototype.initStyle = function(){
  this.track.style.transform = 'translateX(0px)';
  const lists = Array.from(this.track.children);
  const items = Array.from(this.track.children).filter(child => {
    return (
      !child.classList.contains('clone')
    )
  });
  this.track.style.left = `${this.itemWidth * items.length * -1}px`;
  // lists.forEach((list) => {
  //   list.setAttribute('tabindex','0')
  // })
  console.log(lists)
}
Slider.prototype.createClones = function(){
  const nodes = Array.from(this.track.children);
  nodes.forEach(node => {
    const clone = node.cloneNode(true);
    clone.classList.add('clone');
    clone.setAttribute('tabindex','-1');
    this.track.append(clone);
  });

  nodes.reverse().forEach(node => {
    const clone = node.cloneNode(true);
    clone.classList.add('clone');
    clone.setAttribute('tabindex','-1');
    this.track.prepend(clone);
  });
}
Slider.prototype.slide = function(){
  if(this.isSliding){
    return;
  }
  this.isSliding = true;
  setTimeout(() => { this.isSliding = false; }, 1000);

  this.track.style.transition = '1s';
  this.track.style.transform = `translateX(${this.itemWidth * this.idx * -1}px)`;

  const orgLen = this.children.length / 3;
  
  // console.log(orgLen)

  if(orgLen <= this.idx) {
    this.idx = 0;
  }

  this.track.addEventListener('transitionend', ()=> {
    this.track.style.transition = '0s';
    this.track.style.transform = `translateX(${this.itemWidth * this.idx * -1}px)`;
    console.log(this.track.style.transform)
  });

  this.renderProgressBar(this.idx / orgLen);
}
Slider.prototype.prevSlide = function(){
  this.idx--;
  this.slide();
}
Slider.prototype.nextSlide = function(){
  this.idx++;
  this.slide();
}
Slider.prototype.setAutoSlide = function(){
  this.autoSlide = setInterval(() => {
    this.idx++;
    this.slide();
  },this.options.autoSpeed);
}
Slider.prototype.cleartAutoSlide = function(){
  clearInterval(this.autoSlide);
}
Slider.prototype.setEventListener = function(props){
  const prevBtn = props.prev;
  const nextBtn = props.next;

  prevBtn.addEventListener('click', () => {
    this.cleartAutoSlide();
    this.prevSlide();
    // setTimeout(() => {
    //   this.setAutoSlide();
    // },1000);
  });

  nextBtn.addEventListener('click', () => {
    this.cleartAutoSlide();
    this.nextSlide();
    // setTimeout(() => {
    //   this.setAutoSlide();
    // },1000);
  });
  
  prevBtn.addEventListener('slideLeft', this.prevSlide.bind(this));
  nextBtn.addEventListener('slideRight', this.nextSlide.bind(this));

  document.addEventListener('keydown', (e) => {
    e = e || window.event;
    if(e.keyCode === 37){
      prevBtn.dispatchEvent(this.customEvent.prev);
    }else if(e.keyCode === 39){
      nextBtn.dispatchEvent(this.customEvent.next);
    }
  }, false);
}
Slider.prototype.renderProgressBar = function(ratio){
  this.progressBar = document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .right .progress-bar .bar');
  this.progressBar.style.width = `${ratio*100}%`;
}

const slide1 = new Slider({
  container : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .item-container'),
  itemTrack : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .item-track'),
  itemWidth : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .item-track .item'),
});
slide1.setEventListener({
  prev : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .left .btn-group button.prev'),
  next : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .left .btn-group button.next')
});

