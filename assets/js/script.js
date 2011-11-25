(function(a){a.log=function(){if(window.console&&window.console.log){console.log.apply(window.console,arguments)}};a.fn.log=function(){a.log(this);return this}})(jQuery);

$(document).ready(function () {
	
	$('.content1').scrollr();
	$('.content2').scrollr();
	$('.content3').scrollr();
	
});