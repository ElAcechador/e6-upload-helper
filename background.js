browser.menus.create({
	id: "direct-upload",
	title: "Upload to e621.net",
	type: "normal",
	contexts: ["image"],
});

browser.menus.onClicked.addListener(function(info) {
	if(info.menuItemId === "direct-upload") {
		var domNodeCode = "document.querySelector('img[src=" + JSON.stringify(info.srcUrl) + "]')";

		initDomSearch(info.frameId).then(() => {
			return browser.tabs.executeScript({
				frameId: info.frameId,
				code: `DomSearch.twitterGetPermalink(${domNodeCode})`,
			})
		}).then((result) => console.log(result));
		// Maybe do something with info.linkUrl?
		//actionUpload(info.srcUrl, info.pageUrl);
	}
});

function initDomSearch(frameId) {
	return browser.tabs.executeScript({
		frameId: frameId,
		code: 'typeof DomSearch === "function"',
	}).then(function(result) {
		// Result for each frame, there's only one
		if (result[0]) return Promise.resolve();
		
		return browser.tabs.executeScript({
			frameId: frameId,
			file: "/DomSearch.js",
		})
	})
}

function actionUpload(imgUrl, imgSourceUrl) {
	var uploadUrl = "https://e621.net/post/upload?"
	var params = new URLSearchParams();

	imgUrl = findBetterImageVersion(imgUrl);

	params.append("url", imgUrl);
	
	if (imgSourceUrl !== imgUrl) {
		params.append("source", imgSourceUrl);
	}

	browser.tabs.create({
		"url": uploadUrl + params.toString(),
	});
}

function findBetterImageVersion(imgUrl) {
	// See : https://e621.net/wiki/show/howto:sites_and_sources

	var urlObj = new URL(imgUrl);

	if (/(\d+\.media|data)\.tumblr\.com/.test(urlObj.host)) {
		var [, rawHash, fileName] = urlObj.pathname.split("/");

		var regexMatch = /(tumblr(?:_inline)?)_([^\W_]+(?:_r\d+)?)_(\d+|raw)\.([a-z]+)/.exec(fileName);
		
		if (regexMatch !== null) {
			var [, prefix, bucket, res, ext] = regexMatch;
			res = "raw";
	
			fileName = prefix + "_" + bucket + "_" + res + "." + ext;
	
			urlObj.pathname = "/" + rawHash + "/" + fileName;
			urlObj.host = "data.tumblr.com";
			urlObj.protocol = "http:";
		}
	}

	return urlObj.toString();
}

// Twitter : temp0.closest(".tweet").getAttribute("data-permalink-path") for source links
// For image URLs, append :orig after the ext

// Tumblr : For source, use the link URL, or convert it into a post URL (replace "image" with "post")

// FA : uses data-fullview-src for the URL to the full-res image (warn about resolution caps?)