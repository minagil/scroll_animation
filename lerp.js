let aosElements = document.querySelectorAll(".aos");
// console.log(aosElements)

window.addEventListener("scroll", scanElements);

function scanElements(){
  aosElements.forEach(function(element){
    if(isVisable(element)){
      element.classList.add("active");
    }else{
      element.classList.remove("active");
    }
  });
}

function isVisable(element){
  const elementDiv = element.getBoundingClientRect();
  let distanceFromTop = -300;
  return elementDiv.top - window.innerHeight < distanceFromTop ? true : false;
}