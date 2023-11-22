
$('.product-card__slider').each(function () {
  var galleryThumbs;
  var galleryMain;
  var group = $(this);
  group.find('.gallery-thumbs').each(function () {
      var slider = $(this)
      galleryThumbs = new Swiper(slider[0], {
          slidesPerView: "auto",
          watchOverflow: true,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
          direction: 'horizontal',
          autoHeight: true,
          spaceBetween: 20,
          navigation: {
              nextEl: ".gallery-thumbs-next",
              prevEl: ".gallery-thumbs-prev"
          },
          breakpoints: {
              // when window width is >= 480px
              993: {
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
  var wrap = $(this).closest('.product-card');
  wrap.find('.product-card__color__filter__item').on( 'click', function() {
    var filter = $(this).attr('data-filter');
    $(".product-card__color__filter__item").removeClass("active");
    if(filter==='all'){
        wrap.find('.swiper-slide').css('display', '');
        wrap.find('.color-list__selected__element').css('display', '');
    }
    else{
        wrap.find('.swiper-slide').css('display', 'none');
        wrap.find('.swiper-slide[data-filter="' + filter+'"').css('display', '').addClass("active");
        wrap.find('.color-list__selected__element').css('display', 'none');
        wrap.find('.color-list__selected__element[data-filter="' + filter+'"').css('display', '').addClass("active");
        
        
    }

    // $.not(this).removeClass('news__categories-item--active');
    $( this ).addClass('active' );

    function updateGalleryMain() {
      galleryMain.updateSize();
      galleryMain.updateSlides();
      galleryMain.updateProgress();
      galleryMain.updateSlidesClasses();
      galleryMain.slideTo(0);
      galleryMain.scrollbar.updateSize();
    }
    function updateGalleryThumbs() {
      galleryThumbs.updateSize();
      galleryThumbs.updateSlides();
      galleryThumbs.updateProgress();
      galleryThumbs.updateSlidesClasses();
      galleryThumbs.slideTo(0);
      galleryThumbs.scrollbar.updateSize();
    }
    updateGalleryMain();
    updateGalleryThumbs();

    return false;
  });
  wrap.find('.product-card__color__filter__item').first().trigger("click")


//   galleryThumbs.controller.control = galleryMain;
  galleryMain.controller.control = galleryThumbs;
});
