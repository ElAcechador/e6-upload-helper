let DomSearch = {};

// Those should all be functions
DomSearch.twitterGetPermalink = function(imgDomNode) {
	return imgDomNode.closest(".tweet").getAttribute("data-permalink-path");
}

undefined;