jQuery(function ($) {
	var $picture = $("#headline figure.overlay-picture picture");
	var $images = $picture.find("img");

	var active = 0;
	var num = $images.length;
	setInterval(function () {
		$($images[active]).removeClass("active");
		active++;
		if (active >= num) active = 0;
		$($images[active]).addClass("active");
	}, 7000);
});