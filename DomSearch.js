let DomSearch = {};

// Those should all be functions
DomSearch.twitterGetPermalink = function(imgDomNode) {
	return imgDomNode.closest(".tweet").getAttribute("data-permalink-path");
}

// Last line needs to be non-structured clonable data anyway
Object.getOwnPropertyNames(DomSearch);