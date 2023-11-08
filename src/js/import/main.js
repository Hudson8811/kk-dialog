jQuery(function () { 


	function bodyNoScroll() {
		let bodyBodymotionless = document.querySelector('body')
		bodyBodymotionless.classList.add("Bodymotionless")
		
	}
	function bodyYesScroll() {
		let bodyBodymotionless = document.querySelector('body')
		bodyBodymotionless.classList.remove("Bodymotionless")	
	}
	
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


	var startSlider
	$('.js-start__slider').each(function(){
		var slider=$(this)
		var startSlider = new Swiper(slider[0], {
			// watchOverflow: true,
			// watchSlidesVisibility: true,
			// watchSlidesProgress: true,
			// preventInteractionOnTransition: true,
			spaceBetween: 10,
			loop: true,
			slidesPerView: 1,
			navigation: {
				nextEl: slider.find('.swiper-button-next')[0],
				prevEl: slider.find('.swiper-button-prev')[0]
			},
			pagination: {
				el: slider.find('.swiper-pagination')[0],
				type: 'bullets',
				clickable: true
			},
			autoplay: {
				delay: 2000,
				// reverseDirection: true,
				disableOnInteraction: false,
			},	
				breakpoints: {
					// when window width is >= 480px
					992: {
							spaceBetween: 0
					},
			}
		});

	})
	var clientsSlider
	$('.js-clients__slider').each(function(){
		var slider=$(this)
		var clientsSlider = new Swiper(slider[0], {
			// watchOverflow: true,
			// watchSlidesVisibility: true,
			// watchSlidesProgress: true,
			// preventInteractionOnTransition: true,
			// loop: true,
			slidesPerView: 3,
			navigation: {
				nextEl: slider.find('.swiper-button-next')[0],
				prevEl: slider.find('.swiper-button-prev')[0]
			},
		});

	})


	$('.industry__slider--all').each(function () {
		var industryOne;
		var industryTwo;
		var group = $(this);
		group.find('.js-industry--one__slider').each(function () {
				var slider = $(this)
				industryOne = new Swiper(slider[0], {
						centeredSlides: true,
						centeredSlidesBounds: true,
						slidesPerView: 1,
						watchOverflow: true,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
						// direction: 'horizontal',
						direction: 'vertical',
						centeredSlides: false,
						centeredSlidesBounds: false,
						// loop: true,
						spaceBetween: 10,
						navigation: {
								nextEl: ".gallery-thumbs-next",
								prevEl: ".gallery-thumbs-prev"
						},
				})
		});
	
		group.find('.js-industry--two__slider').each(function () {
				var slider = $(this)
				function addZero(num){
					return (num > 9) ? num : '0' + num;
				}
				industryTwo = new Swiper(slider[0], {
						watchOverflow: true,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
						preventInteractionOnTransition: true,
						slidesPerView: 1,
						// thumbs: {
						// 		swiper: industryOne
						// },
						navigation: {
							nextEl: slider.find('.swiper-button-next')[0],
							prevEl: slider.find('.swiper-button-prev')[0]
						},
						pagination: {
							el: ".swiper-pagination__industry__slider--two",
							type: 'fraction',
							formatFractionCurrent: addZero,
        			formatFractionTotal: addZero,
							clickable: false
						},
						// breakpoints: {
						//     // when window width is >= 480px
						//     992: {
						//         slidesPerView: 2.2,
						//         spaceBetween: 30
						//     },
						// }
				})
			//   galleryMain.controller.control = galleryThumbs;
		});
	
	  industryOne.controller.control = industryTwo;
		industryTwo.controller.control = industryOne;
	});



});

window.addEventListener('scroll', event => {
  let navigationLinks = document.querySelectorAll('.side-bar__item');
  let fromTop = window.scrollY + 180;
  navigationLinks.forEach(link => {
    let section = document.querySelector(link.hash);
    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      link.classList.add('active');
			let sectionData = section.getAttribute('data-color');
			let sideBar = document.querySelector(".side-bar")
			console.log(sideBar)
			console.log(sectionData)
			sideBar.classList.remove("blue", "white", "gray")
			sideBar.classList.add(sectionData)
    } else {
      link.classList.remove('active');
    }
  });
});
// window.addEventListener('scroll', event => {
//   let navigationLinks = document.querySelectorAll('.section');
//   let fromTop = window.scrollY + 180;
//   navigationLinks.forEach(link => {
//     let sectionData = link.getAttribute('data-color');
// 		console.log(sectionData)
//     // if (
//     //   section.offsetTop <= fromTop &&
//     //   section.offsetTop + section.offsetHeight > fromTop
//     // ) {
//     //   link.classList.add('active');
//     // } else {
//     //   link.classList.remove('active');
//     // }
//   });
// });


gsap.registerPlugin(ScrollTrigger);
// gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(ScrollToPlugin);

let tl = gsap.timeline({
	onComplete: function (){
			$('body').addClass('active');
			$('.loader').addClass('hide');
	}
});


var initMode = null;


let addTime = 850;

let st1, st2, st3;
let tl1 = gsap.timeline({});
let tl2 = gsap.timeline({});
let tl3 = gsap.timeline({});

let s3Width, b1Width, b2Width, b3Width, b4Width;
let animationSectionHeight, siteMainHeight;


let urlParams = new URLSearchParams(window.location.search);
let yValue = urlParams.get('y');


function initAnimation(){
	siteMainHeight = $('.site-main').innerHeight();
	animationSectionHeight =  $('.animation__section').innerHeight();
	col2Height =  $('.js-animation__col--2').innerHeight();
	col3Height =  $('.js-animation__col--3').innerHeight();

	s3Width =  $('.section3').innerWidth();

	

	


	if (window.innerWidth > 992){
			if (initMode != 'desk'){
					window.scrollTo({
							top: 0,
							behavior: "instant"
					});
					initMode = 'desk';
					reInit();
					initScrollAnimationDesktop();
			}
	} else if(window.innerWidth > 0){
			if (initMode != 'tablet'){
					if (initMode != null){
							window.scrollTo({
									top: 0,
									behavior: "instant"
							});
					}
					initMode = 'tablet';
					reInit();
					initScrollAnimationTablet();
			}

			$('body').addClass('active');
	}
}

initAnimation();
// checkYearValue();

var dwidth = $(window).width();
$(window).on('resize',function (){
	var wwidth = $(window).width();
	if(dwidth!==wwidth){

			initAnimation();
	}
});

function reInit(){
	if (typeof st1 !== "undefined") st1.kill();
	if (typeof st2 !== "undefined") st2.kill();
	if (typeof st3 !== "undefined") st3.kill();
	tl.clear();
	tl1.clear();
	tl2.clear();
	tl3.clear();
	gsap.set(".loader__center, .loader__back, .section1__house, .section1 .header, .sidebar, .section1__title," +
			".scroll-page, .fullPageOverlay", {clearProps:"all"});
	/*window.scrollTo({
			top: 0,
			behavior: "instant"
	});*/
	$('body').removeClass('active');
	$('.loader').removeClass('hide');
	$('.sidebar__global, .sidebar__burger, .sidebar__menu').removeClass('active');
}

function initScrollAnimationDesktop(){
	tl1.fromTo(".js-animation__col--2", {
		y: "0%"
	}, {
		y: -1 * (col2Height - animationSectionHeight),
		duration: 0.6,
		ease: "none",
		onStart: function () {
			// $('.side-bar').removeClass('active');
			$('.side-bar').addClass('active');
			$('.side-bar__item--start').addClass('active');
		},
		onReverseComplete: function () {
			$('.side-bar').removeClass('active');
			// $('.side-bar').addClass('active');
			$('.side-bar__item--start').addClass('active');
		}
	}, "0");
	tl1.fromTo(".js-animation__col--3", {
		y: "0%"
	}, {
		// y: -1 * (col3Height - animationSectionHeight),
		y: "-100%",
		duration: 0.5,
		ease: "none",

	}, "<");

	ScrollTrigger.clearScrollMemory('manual') ;

	st1 = ScrollTrigger.create({
			// trigger: ".site-main",
			trigger: ".animation__section",
			pin: true,
			start: "top top",
			end: () =>   "+="+addTime+"%",
			scrub: 0, //2.5
			animation: tl1,
	});


}
function initScrollAnimationTablet(){

}

function initScrollAnimationMobile(){

}