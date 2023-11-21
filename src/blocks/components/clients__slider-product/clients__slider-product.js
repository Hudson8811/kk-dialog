var clientsSlider
$('.js-clients__slider-product').each(function(){
	var slider=$(this)
	var clientsSlider = new Swiper(slider[0], {
		// watchOverflow: true,
		// watchSlidesVisibility: true,
		// watchSlidesProgress: true,
		// preventInteractionOnTransition: true,
		// loop: true,
		spaceBetween: 34,
		slidesPerView: 2.5,
		navigation: {
			nextEl: slider.find('.swiper-button-next')[0],
			prevEl: slider.find('.swiper-button-prev')[0]
		},
	});

})