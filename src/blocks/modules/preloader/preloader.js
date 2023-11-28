let preloaderSection = document.querySelector(".preloader__section")
if(preloaderSection.length !== null ) {
	setTimeout(() => {
		preloaderSection.classList.add("puff-out-center")
	}, 3090)
	setTimeout(() => {
		preloaderSection.classList.add("no-active")
	}, 3800)

}