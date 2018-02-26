browser.menus.create({
	id: "direct-upload",
	title: "Upload to e621.net",
	type: "normal",
	contexts: ["image"],
});

browser.menus.onClicked.addListener(function(info) {
	if(info.menuItemId === "direct-upload") {
		// Maybe do something with info.linkUrl?
		actionUpload(info.srcUrl, info.pageUrl);
	}
});

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