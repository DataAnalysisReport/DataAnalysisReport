$(function(){var a=$("#helpDivMsg");$(".helpButton0").mouseover(function(c){loadHelpContentById(1,"helpDivMsg");$(this).addClass("helpButtonOver0");a.css("left",c.pageX);a.css("top",c.pageY);if((parseInt(a.css("left"))+parseInt(a.css("width")))>(parseInt($(this).parent().css("width"))+$(this).parent().offset().left)){var b=(parseInt(a.css("left"))+parseInt(a.css("width")))-(parseInt($(this).parent().css("width"))+$(this).parent().offset().left);a.css("left",parseInt(a.css("left"))-b-10)}if((parseInt(a.css("top"))+parseInt(a.css("height")))>(parseInt($(this).parent().css("height"))+$(this).parent().offset().top)){var b=(parseInt(a.css("top"))+parseInt(a.css("height")))-(parseInt($(this).parent().css("height"))+$(this).parent().offset().top);a.css("top",parseInt(a.css("top"))-b-10)}a.css("display","block")}).mouseout(function(){$(this).removeClass("helpButtonOver");a.css("display","none")});$(".helpButton1").mouseover(function(){$(this).addClass("helpButtonOver1")}).mouseout(function(){$(this).removeClass("helpButtonOver1")}).click(function(){loadHelpContentById(2,"AlertMessage");alert("ss")})});