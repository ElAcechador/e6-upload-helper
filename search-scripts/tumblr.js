let port = browser.runtime.connect();

port.onMessage.addListener(function(menuEvent) {
	// Script is injected in all frames, check if we're in the right one
	if(menuEvent.frameUrl && menuEvent.frameUrl !== document.URL) return;

	let permalink = getPermalink(menuEvent);
	let imgUrl = findBestVersion(menuEvent);

	port.postMessage({
		permalink: permalink,
		imgUrl: imgUrl,
	});
});


function getPermalink(menuEvent) {
	// For image permalinks
	var urlObj = new URL(menuEvent.pageUrl);
	let imagePermalinkMatch = /^\/image\/(\d+)(?:\/.*)?$/.exec(urlObj.pathname)
	if(imagePermalinkMatch !== null) {
		urlObj.pathname = `/post/${imagePermalinkMatch[1]}`
		return urlObj.href;
	}

	let imgDomNode = document.querySelector(`img[src="${CSS.escape(menuEvent.srcUrl)}"]`)
	if (!imgDomNode) return undefined;

	// For most lists
	let dataPinUrl = imgDomNode.attributes['data-pin-url'];
	if (dataPinUrl) return dataPinUrl.value;

	// When data-pin-url isn't there, usually this is an image permalink
	return imgDomNode.closest("a").href;
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