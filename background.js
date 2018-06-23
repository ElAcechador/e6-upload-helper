let manifestMatches = browser.runtime.getManifest().content_scripts.map((e) => e.matches).reduce((a, b) => a.concat(b));

browser.menus.create({
	id: "direct-upload",
	title: "Upload to e621.net",
	type: "normal",
	contexts: ["image"],
	documentUrlPatterns: manifestMatches,
});

browser.runtime.onConnect.addListener(function(port) {
	browser.menus.onClicked.addListener(function(info, tab) {
		if(info.menuItemId === "direct-upload") {
			port.postMessage(info);
		}
	});

	port.onMessage.addListener(function(m) {
		console.log(m);
		actionUpload(m.imgUrl, m.permalink);
	});
});

function actionUpload(imgUrl, imgSourceUrl) {
	var uploadUrl = new URL("https://e621.net/post/upload");

	uploadUrl.searchParams.append("url", imgUrl);
	
	if (imgSourceUrl !== imgUrl) {
		uploadUrl.searchParams.append("source", imgSourceUrl);
	}

	browser.tabs.create({
		"url": uploadUrl.href,
	});
}

// Twitter : temp0.closest(".tweet").getAttribute("data-permalink-path") for source links
// For image URLs, append :orig after the ext

// Tumblr : For source, use the link URL, or convert it into a post URL (replace "image" with "post")

// FA : uses data-fullview-src for the URL to the full-res image (warn about resolution caps?)