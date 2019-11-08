$(document).ready(function(){
    const $scrollButton = $(".scroll-button");
    const overlay = $(".overlay");
    var browserName = navigator.userAgent;

	if (browserName.search(/Firefox/) > 0 || browserName.search(/YaBrowser/) > 0 || browserName.search(/OPR/) > 0) {
		overlay.addClass("overlay_arrow-tr");
	}
	else if (browserName.search(/Edge/) > 0) {
		overlay.addClass("overlay_arrow-b");
		$(".overlay__title").html("После загрузки нажмите \"Выполнить\"");
	}	
	else if (browserName.search(/Chrome/) > 0 || browserName.search(/Safari/) > 0) {
		overlay.addClass("overlay_arrow-bl");
	}

    overlay.on("click", function(){
        $(this).hide();
    })

	$scrollButton.on("click", function() {
        const $body = $('html, body');

        $body.animate({
            scrollTop: $body.scrollTop() + $(window).height(),
        }, 500);
    });
});


function showOverlay() {
    $(".overlay").show();
}