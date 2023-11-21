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