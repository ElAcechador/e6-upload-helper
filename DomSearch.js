let DomSearch = {};

// Those should all be functions
DomSearch.twitterGetPermalink = function(imgDomNode) {
	return new URL(imgDomNode.closest(".tweet").getAttribute("data-permalink-path"), document.URL).toString();
}

undefined;