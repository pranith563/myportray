(function(d){var h=[];d.loadImages=function(a,e){"string"==typeof a&&(a=[a]);for(var f=a.length,g=0,b=0;b<f;b++){var c=document.createElement("img");c.onload=function(){g++;g==f&&d.isFunction(e)&&e()};c.src=a[b];h.push(c)}}})(window.jQuery);
$.fn.hasAttr = function(name) { var attr = $(this).attr(name); return typeof attr !== typeof undefined && attr !== false; };


$(document).ready(function() {
r=function(){dpi=window.devicePixelRatio;var a='data-src'; if($('.js').hasAttr('src')) { a='src'; } $('.js').attr(a, (dpi>1) ? 'images/placeholder-200.png?c544a411392187c5c4a20ec0d7b647372ad09c33' : 'images/placeholder-100.png?7828ba6c624bf2d8c2295efdc0d0d88b49861a32');
$('.js2').attr('src', (dpi>1) ? 'images/images-44.png?7d9bdb76b593e780d4bb62a339e971001f3efaf0' : 'images/images-22.png?69c6dc170fdd4714dd33ab7796fb338e19976823');
var a='data-src'; if($('.js3').hasAttr('src')) { a='src'; } $('.js3').attr(a, (dpi>1) ? 'images/location-44.jpeg?7f33c40f99db0fa5a721adc262f775622f0f8abf' : 'images/location-22.jpeg?c430864f4efd69f7e2f7e061f686b51d2a9f8899');
$('.js4').attr('src', (dpi>1) ? 'images/dob-40.png?fd4ff91a5a9014802474c63534103ee1ee7638cb' : 'images/dob-20.png?dfd989dd5775c5a05f3493102aa81da39a9ad3a2');};
if(!window.HTMLPictureElement){r();}
(function(){$('a[href^="#"]:not(.allowConsent,.noConsent,.denyConsent,.removeConsent)').each(function(){$(this).click(function(){var t=this.hash.length>1?$('[name="'+this.hash.slice(1)+'"]').offset().top:0;return $("html, body").animate({scrollTop:t},400),!1})})})();
initMenu($('#m1')[0]);
initMenu($('#m2')[0]);
$('.js').unveil(50);
$('.js5 source').unveil(50);
$('.js3').unveil(50);
$('.js6 source').unveil(50);

});