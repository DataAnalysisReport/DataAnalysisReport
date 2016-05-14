function loading(){
	loadingBack();
	loadingImg();
}
/**
 *2011.11.30
 *加载图片，生成加载等待效果
 */
$(document).ready(function(){
	$.rqloading = function(customclass){
		   //加载前调用的函数
		   loadingBack(customclass);
		   loadingImg();
	};	
})	
/**
 *加载背景
 */
function loadingBack(customclass){
	$("body").css("overflow","hidden");
	var div = $("<div></div>");
   	$(div).attr("id","black_screen");
   	$(div).css("width", window.screen.width + "px");
   	$(div).css("height",window.screen.height + "px");
   	$(div).css("position","absolute");
   	$(div).css("top","0px");
   	$(div).css("left","0px");
   	$(div).css("z-index","0");
   	setOpacity(div[0], 70);
   	$(div).css("background-color","#f2f2f2");
   	if(customclass !=undefined) {
   		 $(div).addClass(customclass);
   	}
   
   	$("body").append(div);
}

/**
 *加载图片
 */
function loadingImg(){
	var con =$("<div></div>");
	$(con).attr("id","img_container");
   	$(con).css("padding","10px");
   	$(con).css("padding-top","0px");
   	$(con).css("position","absolute");
	$(con).css("background-color","transparent");
   	$(con).css("top",document.documentElement.scrollTop + 100 + "px");
   	$(con).css("left",(document.documentElement.offsetWidth - 300) / 2 + "px");
   	var prepath = window.location.pathname;
   	var index = prepath.indexOf("/",1);
   	prepath = prepath.substring(0,index);
   	if(prepath == '/mis2' || prepath=='/eds'){
   		 prepath = '';
   	}
   	$(con).html("<div align='center' style='padding:40px; width:200px; height:120px'><br><font style='font-size:12px;'>正在处理，请稍候...</font><br/><img src='"+prepath+"/mis2/gezComponents/loadingTips/css/images/loading.gif' vspace=10></div>");
 		$("body").append(con);
}

function setOpacity(e, n) {
   	var n = parseFloat(n);
   	if (n && (n > 100) || !n)
       	n = 100;
   	if (n && (n < 0))
       	n = 0;
  	 	if (navigator.userAgent.indexOf("MSIE")>0) {
       	e.style.filter = "alpha(opacity=" + n + ")";
   	}
   	else {
       	e.style.opacity = n / 100;
   	}
}
//加载后			 
function closeload() {
  //   $("#img_container").remove();
  // $("#black_screen").remove();  
  //由于remove方法会导致输入框无法获取焦点,所以暂时改为隐藏div

//	$("body").css("overflow","");
if(document.getElementById("loading_img"))
	document.getElementById("loading_img").src="null";
   $("#img_container").css("z-index","-1000");
   $("#img_container").hide();
   $("#img_container").attr("id","back");
    $("#black_screen").css("z-index","-1001");
    $("#black_screen").css("height","0px");
     $("#black_screen").css("width","0px");
    $("#black_screen").attr("id","backa"); 

                              
}
/**
 *加载后，删除背景和图片
 */		 
function closeFile() {
	$("body").css("overflow","");
	$("#black_screen").remove(); 
    	$("#img_container").remove();
}			
function   mini()   
  {   
    closeload(); 
  } 