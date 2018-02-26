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

	params.append("url", imgUrl);
	
	if (imgSourceUrl !== imgUrl) {
		params.append("source", imgSourceUrl);
	}

	browser.tabs.create({
		"url": uploadUrl + params.toString(),
	});
}