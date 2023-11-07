
$( ".header__menu__item" ).mouseenter(function () {
  let headerMenuItem = $(this);
  let headerMenuList = headerMenuItem.children( '.header__menu__list' )
  headerMenuList.addClass('active')
});
$( ".header__menu__item" ).mouseleave(function () {
  let headerMenuItem = $(this);
  let headerMenuList = headerMenuItem.children( '.header__menu__list' )
  headerMenuList.removeClass('active')
});


let overlayBg = document.querySelector(".mob-menu--overlay");
let mobMenu = document.querySelector(".mob-menu__section");
let humb = document.querySelector(".hamburger");

var hamburger = $(".hamburger");
hamburger.on("click", function(e) {
  hamburger.toggleClass("is-active");
});
var search = $(".header__other__search");
search.click( function(e) {
  $(this).children(".header__other__search__input").addClass("active"); 

});
$(document).mouseup(function (e){ 
  var search = $(".header__other__search");
  if (!search.is(e.target) 
      && search.has(e.target).length === 0) { 
        search.children(".header__other__search__input").removeClass("active"); 
  }
});

overlayBg.addEventListener("click", function () {
  mobMenu.classList.remove("active");
  humb.classList.remove("is-active");
  bodyYesScroll()
});
humb.addEventListener("click", function () {
  let kye = mobMenu.classList.contains("active");
  if (kye == false) {
    mobMenu.classList.add("active");
    bodyNoScroll()
  }else {
    mobMenu.classList.remove("active");
    bodyYesScroll()
  }
});







