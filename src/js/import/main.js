jQuery(function () { 


  var list = $(".js-wrapper-boxes .box-more");
  var numToShow = 3; //сколько показывать элементов
  var button = $(".more");
  var numInList = list.length;
  list.hide();
  if (numInList > numToShow) {
    button.show();
  }
  list.slice(0, numToShow).show();
  button.click(function() {
    var showing = list.filter(':visible').length;
    list.slice(showing - 1, showing + numToShow).fadeIn();
    var nowShowing = list.filter(':visible').length;
    if (nowShowing >= numInList) {
      button.hide();
    }
  });
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
			// spaceBetween: 30,
			slidesPerView: 3,
			navigation: {
				nextEl: slider.find('.swiper-button-next')[0],
				prevEl: slider.find('.swiper-button-prev')[0]
			},
		});

	})
	var seeAlso
	$('.js-see-also__slider').each(function(){
		var slider=$(this)
		var seeAlso = new Swiper(slider[0], {
			// watchOverflow: true,
			// watchSlidesVisibility: true,
			// watchSlidesProgress: true,
			// preventInteractionOnTransition: true,
			// loop: true,
			spaceBetween: 35,
			slidesPerView: "auto",
			navigation: {
				prevEl: ".see-also__button-prev",
				nextEl: ".see-also__button-next",
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
						slidesPerView: 1,
						watchOverflow: true,
						// autoHeight: true,
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
						// autoHeight: true,
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

	var pluginName = 'simpleAccordion',
	defaults = {
			multiple: false,
			speedOpen: 300,
			speedClose: 150,
			easingOpen: null,
			easingClose: null,
			headClass: 'accordion-header',
			bodyClass: 'accordion-body',
			openClass: 'open',
			defaultOpenClass: 'default-open',
			cbClose: null, //function (e, $this) {},
			cbOpen: null //function (e, $this) {}
	};
	function Accordion(element, options) {
			this.$el = $(element);
			this.options = $.extend({}, defaults, options);
			this._defaults = defaults;
			this._name = pluginName;
			if (typeof this.$el.data('multiple') !== 'undefined') {
					this.options.multiple = this.$el.data('multiple');
					} else {
					this.options.multiple = this._defaults.multiple;
			}
			this.init();
	}
	Accordion.prototype = {
			init: function () {
					var o = this.options,
					$headings = this.$el.children('.' + o.headClass);
					$headings.on('click', {_t:this}, this.headingClick);
					$headings.filter('.' + o.defaultOpenClass).first().click();
			},
			headingClick: function (e) {
					var $this = $(this),
					_t = e.data._t,
					o = _t.options,
					$headings = _t.$el.children('.' + o.headClass),
					$currentOpen = $headings.filter('.' + o.openClass);
					if (!$this.hasClass(o.openClass)) {
							if ($currentOpen.length && o.multiple === false) {
									$currentOpen.removeClass(o.openClass).next('.' + o.bodyClass).slideUp(o.speedClose, o.easingClose, function () {
											if ($.isFunction(o.cbClose)) {
													o.cbClose(e, $currentOpen);
											}
											$this.addClass(o.openClass).next('.' + o.bodyClass).slideDown(o.speedOpen, o.easingOpen, function () {
													if ($.isFunction(o.cbOpen)) {
															o.cbOpen(e, $this);
													}
											});
									});
									} else {
									$this.addClass(o.openClass).next('.' + o.bodyClass).slideDown(o.speedOpen, o.easingOpen, function () {
											$this.removeClass(o.defaultOpenClass);
											if ($.isFunction(o.cbOpen)) {
													o.cbOpen(e, $this);
											}
									});
							}
							} else {
							$this.removeClass(o.openClass).next('.' + o.bodyClass).slideUp(o.speedClose, o.easingClose, function () {
									if ($.isFunction(o.cbClose)) {
											o.cbClose(e, $this);
									}
							});
					}
			}
	};
	$.fn[pluginName] = function (options) {
			return this.each(function () {
					if (!$.data(this, 'plugin_' + pluginName)) {
							$.data(this, 'plugin_' + pluginName,
							new Accordion(this, options));
					}
			});
	};
	
	$('.accordion-group').simpleAccordion({
    
    multiple: false, // возможность открытия одной вкладки или всех
    speedOpen: 300, // скорость открытия вкладки
    speedClose: 150, // скорость закрытия вкладки
    easingOpen: null, // эффект плавности открытия вкладки
    easingClose: null, // эффект плавности закрытия вкладки
    headClass: 'accordion-header', // класс для заголовка вкладки
    bodyClass: 'accordion-body', // класс для тела вкладки
    openClass: 'open',  // класс для открытой вкладки, применяется к accordion-header
    defaultOpenClass: 'default-open', // класс для открытой вкладки по умолчанию
    cbClose: null, // callback-функция при закрытии вкладки - function (e, $this) {},
    cbOpen: null // callback-функция при открытии вкладки - function (e, $this) {}
    
	});

	function modalForm() {
		// event.preventDefault();
		$.fancybox.open({
			src: "#modal-form",
			type: "inline",
			touch: false

		});
		
	}	
	$('.js-btn__modal-form').on('click', function () {
		$.fancybox.close();
		setTimeout(() => {
			modalForm();
			bodyNoScroll();
		}, 500) 

	});
	$(document).on('afterClose.fb', function( e, instance, slide ) {
    bodyYesScroll();
	});	

});

$(window).scroll(function() {
	var height = $(window).scrollTop();
	 /*Если сделали скролл на 100px задаём новый класс для header*/
	if(height > 50){
		$('.section__header').addClass('bg__white');
	} else{
	/*Если меньше 100px удаляем класс для header*/
		$('.section__header').removeClass('bg__white');
	}
});


function MapInit() {

	if ($('.contacts__map').length > 0) {
		const map = new ymaps.Map('js-map', {
			center: [55.672925, 37.625181],
			zoom:13,
			// type: 'yandex#satellite',
			// Карта будет создана без
			// элементов управления.
			controls: []
		});
	myPlacemark2 = new ymaps.Placemark([55.672925, 37.625181],{},{
			iconLayout: 'default#image',
			iconImageHref: '/img/svg/predstvo_act.svg',
			iconImageSize: [30, 36],
			iconImageOffset: [-15, -18]
	});

	// Добавляем метку на карту.
	map.geoObjects.add(myPlacemark2);
	$(".contacts__office").on("click", function () {
			$('.contacts__office').each(function() {
				var office = $(this);
				office.removeClass( "active" )
			});
			$(this).addClass( "active" );
			var coor = $(this).attr('data-coords');
			console.log (coor)
			var a = coor;
			var xy = a.split(',');
			var x = parseFloat(xy[0]);
			var y = parseFloat(xy[1]);


			
			myPlacemark2 = new ymaps.Placemark([x, y],{},{
					iconLayout: 'default#image',
					iconImageHref: '../img/svg/predstvo_act.svg',
					iconImageSize: [26, 26],
					iconImageOffset: [-13, -13]
			});

			// Добавляем метку на карту.
			map.geoObjects.add(myPlacemark2);
			map.setCenter([x, y]);

	}) 
	
	}
	

	
}


let sideBar = document.querySelector(".side-bar");
if (window.innerWidth > 999 && sideBar !== null){
	window.addEventListener('scroll', event => {
		let navigationLinks = document.querySelectorAll('.side-bar__item');
		let fromTop = window.scrollY + 200;
		navigationLinks.forEach(link => {
			let section = document.querySelector(link.hash);
			console
			if (
				section.offsetTop <= fromTop &&
				section.offsetTop + section.offsetHeight > fromTop
			) {
				link.classList.add('active');
				let sectionData = section.getAttribute('data-color');
				let sideBar = document.querySelector(".side-bar")
				sideBar.classList.remove("blue", "white", "gray")
				sideBar.classList.add(sectionData)
			} else {
				link.classList.remove('active');
			}
		});
	});
}


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


let addTime = 500;

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
			$('.side-bar').addClass('active', "blue");
			$('.side-bar__item--start').addClass('active');
		},
		// onReverseComplete: function () {
		// 	$('.side-bar').removeClass('active');
		// 	// $('.side-bar').addClass('active');
		// 	$('.side-bar__item--start').addClass('active');
		// }
	}, "0");
	tl1.fromTo(".animation__bg.animation__bg__1", {
		y: "0%"
	}, {
		// y: -1 * (col3Height - animationSectionHeight),
		y: "-70%",
		duration: 0.6,
		ease: "none",

	}, "<");
	tl1.fromTo(".js-animation__col--3", {
		y: "0%"
	}, {
		// y: -1 * (col3Height - animationSectionHeight),
		y: "-105%",
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