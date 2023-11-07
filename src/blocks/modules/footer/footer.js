document.addEventListener("DOMContentLoaded", () => {
$(window).scroll(function() {
	var $height = $(window).height()
		if ($(this).scrollTop() > $height) {
				$('.footer__button--up').css({
						bottom: '48px'
				});
				} else {
				$('.footer__button--up').css({
						bottom: '-100px'
				});
		}
});
$('.footer__button--up').on('click',function() {
		$('html, body').animate({
				scrollTop: 0
		}, 50);
		return false;
});
});