$(function(){$("#nav span").attr("title",$("#navigator span").text());if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){var b=213;var a=$(window).width()-b-15;var c=a/14;$("#nav span").attr("title",$("#nav span").text());$("#nav span").wordLimit(c)}});