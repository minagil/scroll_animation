const Slider = (function(){
  const elements = document.querySelectorAll('#main_feature .feature-cgroup .item-track .item');

  let itemContainer = null;
  let itemTrack = null;
  let itemWidth = null;
  let nextBtn = null;
  let prevBtn = null;

  const itemsInfo = {
    offset : 0,
    position : {
      current: 0,
      min : 0,
      max : elements.length - 1
    },
    update: function(value){
      this.position.current = value;
      this.offset = -value;
    }
  }

  function Slider(props){
    this.isSliding = false;
    itemContainer = props.container;
    itemTrack = props.itemTrack;
    itemWidth = props.itemWidth.offsetWidth + 40;

    init();
  }

  function init(){
    setInit();
    createClone();
  }

  function setInit(){
    itemTrack.style.transform = 'translateX(0)';
    const items = Array.from(itemTrack.children).filter(child => {
      return (
        !child.classList.contains('clone')
      )
    });
    itemTrack.style.left = `${itemWidth * items.length * -1}px`;
  }

  function createClone(){
    const nodes = Array.from(itemTrack.children);
    nodes.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.classList.add('clone');
      itemTrack.append(clone);
    });
    nodes.reverse().forEach((node) => {
      const clone = node.cloneNode(true);
      clone.classList.add('clone');
      itemTrack.prepend(clone);
    });
  }

  function slide(){
    itemTrack.style.transition = '1s';
    itemTrack.style.transform = `translateX(${itemsInfo.offset * itemWidth}px)`;
  }

  function nextSlide(){
    
  }

  function updateItemInfo(value){
    itemsInfo.update(value);
    slide();
  }

  Slider.prototype.setEventButton = function(props){
    nextBtn = props.next;
    prevBtn = props.prev;

    nextBtn.addEventListener('click', () => {
      updateItemInfo(itemsInfo.position.current + 1);
    });

    prevBtn.addEventListener('click', () => {
      console.log('prev');
    });
  }

  return Slider;
}());

const slide1 = new Slider({
  container : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .item-container'),
  itemTrack : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .item-track'),
  itemWidth : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .item-track .item'),
});
slide1.setEventButton({
  prev : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .left .btn-group button.prev'),
  next : document.querySelector('#main_feature .feature-cgroup[data-menu="nav1"] .left .btn-group button.next')
});

