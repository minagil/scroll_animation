const Slider = (function(){
  let isSliding = false;
  let progressBar = null;

  function Slider(){
    this.idx = 0;
    this.autoSlide = null;

    progressBar = document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .right .progress-bar .bar');

    // this.setAutoSlide();

    return function(){
      this.setEventButton();
    }

  }
  
  Slider.prototype.nextSlide = function() {
    this.slideItem();
  }

  Slider.prototype.prevSlide = function() {
    this.slideItem();
  }

  Slider.prototype.setEventButton = function(props){
    const prevBtn = props.prev;
    const nextBtn = props.next;

    nextBtn.addEventListener('click', () => {
      this.clearAutoSlide();
      this.nextSlide();
      setTimeout(() => {
        this.setAutoSlide();
      }, 1000);
    });

    prevBtn.addEventListener('click', () => {
      this.clearAutoSlide();
      this.prevSlide();
      setTimeout(() => {
        this.setAutoSlide();
      });
    });
  }

  Slider.prototype.setAutoSlide = function(){
    this.autoSlide = setInterval(() => {
      this.idx++;
      this.slideItem();
    },2500);
  }
  
  Slider.prototype.clearAutoSlide = function(){
    clearInterval(this.autoSlide);
  }

  Slider.prototype.renderProgressBar = function(ratio){
    progressBar.style.width = `${ratio*100}%`;
  }

  return Slider;

}());

const MainBannerSlide = (function(){
  let itemTrack = null;
  let itemWidth = null;
  let item = null;

  function MainBannerSlide(props){
    itemTrack = props.itemTrack;
    itemWidth = props.itemWidth.offsetWidth + 40;
    item = itemTrack.children;

    this.setInit();
    this.createCloneNode();
    
    Slider.apply(this, arguments);

  }

  MainBannerSlide.prototype = Object.create(Slider.prototype);
  MainBannerSlide.prototype.constructor = MainBannerSlide;

  MainBannerSlide.prototype.setInit = function(){
    itemTrack.style.transform = `translateX(0)`;
    const items = Array.from(itemTrack.children).filter(child => {
      return !child.classList.contains('clone');
    });
    itemTrack.style.left = `${itemWidth * items.length * -1}px`;
  }

  MainBannerSlide.prototype.createCloneNode = function() {
    const nodes = Array.from(itemTrack.children);
    nodes.forEach(node => {
      const clone = node.cloneNode(true);
      clone.classList.add('clone');
      itemTrack.append(clone);
    });
    nodes.reverse().forEach(node => {
      const clone = node.cloneNode(true);
      clone.classList.add('clone');
      itemTrack.prepend(clone);
    });
  }

  MainBannerSlide.prototype.slideItem = function(){
    // if(isSliding){
    //   return;
    // }
    // isSliding = true;
    // setTimeout(() => { isSliding = false; }, 1000);

    itemTrack.style.transition = '1s';
    itemTrack.style.transform = `translateX(${itemWidth * this.idx * -1}px)`;

    const orgLength = item.length / 3;

    if(orgLength <= this.idx) {
      this.idx = 0;
    }

    if(this.idx <= -3) {
      this.idx = 2;
    }

    this.renderProgressBar(this.idx / orgLength);
  }


  return MainBannerSlide;
}());

const mainBannerSlide = new MainBannerSlide({
  container : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .item-container'),
  itemTrack : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .item-track'),
  itemWidth : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .item-track .item'),
});

mainBannerSlide.setEventButton({
  prev : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .left .btn-group button.prev'),
  next : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .left .btn-group button.next')
});

