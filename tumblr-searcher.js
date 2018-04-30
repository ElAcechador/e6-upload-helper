let port = browser.runtime.connect();

port.onMessage.addListener(function(menuEvent) {
	let permalink = getPermalink(menuEvent);
	let imgUrl = findBestVersion(menuEvent);

	port.postMessage({
		permalink: permalink,
		imgUrl: imgUrl,
	});
});


function getPermalink(menuEvent) {
	// TODO
	return menuEvent.pageUrl;
}

function findBestVersion(menuEvent) {
	var urlObj = new URL(menuEvent.srcUrl);

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