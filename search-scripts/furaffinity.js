let port = browser.runtime.connect();

port.onMessage.addListener(function(menuEvent) {
	// Script is injected in all frames, check if we're in the right one
	if(menuEvent.frameUrl && menuEvent.frameUrl !== document.URL) return;

    let imgDomNode = getDomNodeForSrcUrl(menuEvent.srcUrl);
    if (imgDomNode.id !== "submissionImg") {
        alert("Please upload from the submission's main page.")
        return;
    };

	let permalink = getPermalink(menuEvent);
    let imgUrl = findBestVersion(menuEvent);

	port.postMessage({
		permalink: permalink,
		imgUrl: imgUrl,
	});
});

function getPermalink(menuEvent) {
	return menuEvent.pageUrl;
}

function findBestVersion(menuEvent) {
    let imgDomNode = document.getElementById("submissionImg");
    let pageUrl = new URL(menuEvent.pageUrl);

    let imgUrl = new URL(pageUrl.protocol + imgDomNode.dataset.fullviewSrc);

	return imgUrl.href;
}

function getDomNodeForSrcUrl(srcUrl) {
    // The URLs don't include the protocol and CSS-matching means we have to respect that format.
    // FIXME: I can totally see that break for no reason.
    let urlObj = new URL(srcUrl);
    let fixedUrl = "//" + urlObj.host + urlObj.pathname;
    return document.querySelector(`img[src="${CSS.escape(fixedUrl)}"]`)
}