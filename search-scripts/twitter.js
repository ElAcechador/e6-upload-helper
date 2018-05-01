let port = browser.runtime.connect();

port.onMessage.addListener(function(menuEvent) {
	// Script is injected in all frames, check if we're in the right one
	if(menuEvent.frameUrl !== document.URL) return;

	let permalink = getPermalink(menuEvent);
	let imgUrl = findBestVersion(menuEvent);

	port.postMessage({
		permalink: permalink,
		imgUrl: imgUrl,
	});
});

function getPermalink(menuEvent) {
	let imgDomNode = document.querySelector(`img[src="${CSS.escape(menuEvent.srcUrl)}"]`)

	return new URL(imgDomNode.closest(".tweet").getAttribute("data-permalink-path"), document.URL).toString();
}

function findBestVersion(menuEvent) {
	// TODO
	return menuEvent.srcUrl;
}