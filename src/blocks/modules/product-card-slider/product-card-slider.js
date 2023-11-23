
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
  function startGalleryMain() {
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
  }
  startGalleryMain()

  
  var wrap = $(this).closest('.product-card');
  var galleryMainStorage = $(".gallery-main__storage .swiper-slide")
  var galleryThumbsStorage = $(".gallery-thumbs__storage .swiper-slide")
  wrap.find('.product-card__color__filter__item').on( 'click', function() {
    var filter = $(this).attr('data-filter');
    function filterMainStorage() {
      let finishGalleryMainStorage = galleryMainStorage.filter(function() {
         return $(this).attr('data-filter') == filter;
      })
      galleryMain.removeAllSlides();
      galleryMain.appendSlide(finishGalleryMainStorage);
      startGalleryMain()
      
    }
    function filterThumbsStorage() {
      let finishgalleryThumbsStorage = galleryThumbsStorage.filter(function() {
         return $(this).attr('data-filter') == filter;
      })
      galleryThumbs.removeAllSlides();
      galleryThumbs.appendSlide(finishgalleryThumbsStorage);
      startGalleryMain()
    }
    filterMainStorage()
    filterThumbsStorage()

    $(".product-card__color__filter__item").removeClass("active");
    $( this ).addClass('active' );
    return false;
  });


  wrap.find('.product-card__color__filter__item').first().trigger("click")


//   galleryThumbs.controller.control = galleryMain;
  galleryMain.controller.control = galleryThumbs;
});
