/**
 * Theme JS
 *
 * @copyright 2020 NB Communication Ltd
 *
 */

var theme = {

	init: function() {
		this.blocks();
		this.mapItemHover();
		this.centerIconMacClass();
	},

	blocks: function() {

		$nb.profilerStart("theme.blocks");

		var alignments = ["left", "right", "center"];
		var fileIcons = {
			pdf: ["pdf"],
			word: ["doc", "docx"],
			excel: ["xls", "xlsx"],
			powerpoint: ["ppt", "pptx"],
			archive: ["zip", "tar"]
		};

		$nb.$$("nb-block").forEach(function(block) {

			switch($uk.data(block, "nb-block")) {
				case "content":

					// Apply UIkit table component
					$uk.$$("table", block).forEach(function(el) {
						UIkit.nbTable(el);
					});

					// Inline Images UIkit Lightbox/Scrollspy
					($uk.$$("a[href]", block).filter(function(a) {
						return $uk.attr(a, "href").match(/\.(jpg|jpeg|png|gif|webp)/i)
					})).forEach(function(a) {

						var figure = a.parentNode;
						var caption = $uk.$("figcaption", figure);

						// uk-lightbox
						UIkit.lightbox(figure, {animation: "fade"});
						if(caption) $uk.attr(a, "data-caption", $uk.html(caption));

						// uk-scrollspy
						for(var i = 0; i < alignments.length; i++) {
							var align = alignments[i];
							if($uk.hasClass(figure, "align_" + align)) {
								UIkit.scrollspy(figure, {
									cls: ("uk-animation-slide-" + (align == "center" ? "bottom" : align) + "-small")
								});
							}
						}
					});

					// UIkit File Icons
					for(var key in fileIcons) {
						var value = fileIcons[key];
						for(var i = 0; i < value.length; i++) {
							var links = $uk.$$("a[href$='." + value[i] + "']:not(.nb-file-icon):not(.nb-no-icon)", block);
							if(links.length) {
								links.forEach(function(el) {
									$uk.prepend(el, $nb.ukIcon(key == "pdf" ? "file-pdf" : (key == "archive" ? "album" : "file-text")));
									$uk.addClass(el, "nb-file-icon nb-file-icon-" + key);
								});
							}
						}
					}

					break;
				case "embed":

					$uk.$$("iframe", block).forEach(function(el) {
						$uk.attr(el, "data-uk-responsive", true);
					});

					UIkit.update();

					break;
			}
		});

		$nb.profilerStop("theme.blocks");
	},

	isTouchEnabled: function() { 
		return ( 'ontouchstart' in window ) ||  
			   ( navigator.maxTouchPoints > 0 ) ||  
			   ( navigator.msMaxTouchPoints > 0 ); 
	},

	mapItemHover: function() {
		var mapItem = document.getElementsByClassName("map-item");
		if(this.isTouchEnabled()) {
			for (var i = 0; i < mapItem.length; i++) {
				mapItem[i].addEventListener("touchstart", this.mapTitleShow, false);
	  		}
		} else {
			for (var i = 0; i < mapItem.length; i++) {
				mapItem[i].addEventListener("mouseover", this.mapTitleShow, false);
			  }
			  for (var i = 0; i < mapItem.length; i++) {
				mapItem[i].addEventListener("mouseout", this.mapTitleHide, false);
			  }
		}
	},

	//show and position map titile according to the hovered map item
	mapTitleShow: function() {
		var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
		var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
		var mapTitleEl = document.getElementsByClassName("js-explore-map-title")[0];
		var mapParent = document.getElementsByClassName('explore-inner')[0];
		var mapParentTop = mapParent.getBoundingClientRect().top;
		var mapParentLeft = mapParent.getBoundingClientRect().left;
		var mapItemTop = this.getBoundingClientRect().top;
		var mapItemLeft = this.getBoundingClientRect().left;
		mapTitleEl.innerHTML = '';
		var mapParentBorderWidthVal = window.getComputedStyle(mapParent).getPropertyValue('border-width');
		var mapParentBorderWidth = parseInt(mapParentBorderWidthVal, 10) * 2;
		if(isIE11 || isFirefox) {
			mapParentBorderWidth = 110;
		}

		var mapItemTopPosition = mapItemTop - mapParentTop;
		var mapItemLeftPosition = mapItemLeft - mapParentLeft - mapParentBorderWidth;
		var mapDataTitle = this.getAttribute("data-title");

		mapTitleEl.innerHTML = mapDataTitle;
		mapTitleEl.style.top = mapItemTopPosition + "px";
		mapTitleEl.style.left = mapItemLeftPosition + "px";
		mapTitleEl.style.display = "block";
	},

	//Hide map title when hovering out of map item 
	mapTitleHide: function() {
		var mapTitleEl = document.getElementsByClassName("js-explore-map-title")[0];
		if(mapTitleEl.style.display !== "none" ||
		getComputedStyle(mapTitleEl, null).display !== "none")
		mapTitleEl.style.display = "none";
	},

	//add class to center icons on safari/chrome on mac
	centerIconMacClass: function() {
		var isOSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
		var isiOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);
		var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

		if(document.getElementsByClassName("nb-slideshow")[0] && (isOSX || isiOS || isMac)) {
			var heroButtonParents = document.getElementsByClassName("nb-slideshow")[0].querySelectorAll("li");
			for(var i = 0;i < heroButtonParents.length;i++){
				heroButtonParents[i].querySelectorAll('.uk-button-primary')[0].classList.add("mac");
			}
		}
		if(document.getElementsByClassName("news-share")[0] && (isOSX || isiOS || isMac)) {
			var socialNewsButton = document.getElementsByClassName("news-share")[0].querySelectorAll("li");
			for(var i = 0;i < socialNewsButton.length;i++){
				socialNewsButton[i].querySelectorAll('a')[0].classList.add("mac");
			}
		}
		var socialFooterButtonParents = document.getElementsByClassName("footer-socials")[0].querySelectorAll("li");

		if(isOSX || isiOS || isMac) {
			for(var i = 0;i < socialFooterButtonParents.length;i++){
				socialFooterButtonParents[i].querySelectorAll('a')[0].classList.add("mac");
			}
		}
	}
};

$uk.ready(function() {
	theme.init();
});

/**
 * jsonRender
 *
 * @param {Array} items
 * @return {string}
 *
 */
function renderItems(items) {

	$nb.profilerStart("theme.renderItems");

	var classes = ["uk-grid-match", "uk-child-width-1-2@s"];
	var sizes = $nb.ukWidths(classes);
	var config = $uk.isPlainObject(this.config) ? this.config : {};
	var metas = ["date_pub", "dates", "location"];
	var clsTag = "uk-label uk-label-primary uk-margin-small-right";

	var out = "";
	for(var i = 0; i < items.length; i++) {

		var item = items[i];

		// Title
		var title = $nb.wrap(
			$nb.wrap(item.title, {href: item.url, class: "uk-link-reset"}, "a"),
			{class: ["uk-card-title", "uk-margin-remove-bottom"]},
			"h3"
		);

		// Image
		var image = item.getImage ? $nb.img(item.getImage, {
			alt: item.title,
			sizes: (sizes.length ? sizes.join(", ") : false),
		}, {
			ukImg: {target: "!* +*"}
		}) : "";

		// Meta
		var meta = "";
		for(var n = 0; n < metas.length; n++) {
			var v = item[metas[n]];
			if(v) meta += $nb.wrap(v, "uk-text-meta")
		}

		// Tags
		var tags = "";
		if(config.showTemplate && item.template) {
			tags += $nb.wrap($uk.ucfirst(item.template), clsTag);
		}
		if($uk.isArray(item.tags)) {
			item.tags.forEach(function(tag) {
				tags += $nb.wrap(tag.title, clsTag);
			});
		}

		// Summary
		var summary = (item.getSummary ? $nb.wrap(item.getSummary, "p") : "");

		// CTA
		var cta = $nb.wrap((config.cta ? config.cta : $nb.ukIcon("more")), {
			href: item.url,
			class: ["uk-button", "uk-button-text"]
		}, "a");

		out += $nb.wrap(
			$nb.wrap(
				(image ? $nb.wrap($nb.wrap(image, {href: item.url}, "a"), "uk-card-media-top") : "") +
				$nb.wrap(title + meta + tags, "uk-card-header") +
				(summary ? $nb.wrap(summary, "uk-card-body") : "") +
				$nb.wrap(cta, "uk-card-footer"),
				"uk-card uk-card-default"
			),
			"div"
		);
	}

	out = $nb.wrap(out, {
		class: classes,
		dataUkGrid: true,
		dataUkScrollspy: {
			target: "> div",
			cls: "uk-animation-slide-bottom-small",
			delay: NB.options.duration,
		}
	}, "div");

	$nb.profilerStop("theme.renderItems");

	return out;
}
