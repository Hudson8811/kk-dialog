let catalogBarContainerSelector = document.querySelector("#catalog-bar__container-selector")
if(catalogBarContainerSelector != null && document.documentElement.clientWidth > 992) {
		var sidebar = new StickySidebar('#catalog-bar', {
			containerSelector: '#catalog-bar__container-selector',
			innerWrapperSelector: '.sidebar__inner',
			topSpacing: 110,
			containerSelector: false,
			resizeSensor: true,
			minWidth: 0
		});
	
}