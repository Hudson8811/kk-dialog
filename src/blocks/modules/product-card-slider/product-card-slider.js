
$('.product-card__slider').each(function () {
  var galleryThumbs;
  var galleryMain;
  var group = $(this);
  group.find('.gallery-thumbs').each(function () {
      var slider = $(this)
      galleryThumbs = new Swiper(slider[0], {
          centeredSlides: true,
          centeredSlidesBounds: true,
          slidesPerView: 3,
          watchOverflow: true,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
          direction: 'horizontal',
          centeredSlides: false,
          centeredSlidesBounds: false,
          autoHeight: true,
          spaceBetween: 20,
          navigation: {
              nextEl: ".gallery-thumbs-next",
              prevEl: ".gallery-thumbs-prev"
          },
          breakpoints: {
              // when window width is >= 480px
              992: {
                  direction: 'vertical',
                  spaceBetween: 20,
              },
          }
      })
  });

  group.find('.gallery-main').each(function () {
      var slider = $(this)
      galleryMain = new Swiper(slider[0], {
          watchOverflow: true,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
          preventInteractionOnTransition: true,
          slidesPerView: 1,
          autoHeight: true,
          thumbs: {
              swiper: galleryThumbs
          },
          navigation: {
              nextEl: ".gallery-main-next",
              prevEl: ".gallery-main-prev"
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

//   galleryThumbs.controller.control = galleryMain;
  galleryMain.controller.control = galleryThumbs;
});
