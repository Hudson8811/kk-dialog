let preloaderSection = document.querySelector(".preloader__section")
if(preloaderSection !== null ) {
	setTimeout(() => {
		preloaderSection.classList.add("puff-out-center")
	}, 1590)
	setTimeout(() => {
		preloaderSection.classList.add("no-active")
	}, 2300)

}