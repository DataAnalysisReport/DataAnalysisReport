$(function(){		 
	 var mydiv2 = $("<div></div>");
	 mydiv2.attr("id","ConfirmMessage");
     // mydiv2.attr("title","提醒");
     mydiv2.css({"margin":"0 0 0 0","padding":"0 0 0 0"});
	 mydiv2.css({"backgroundColor":"#FFFFFF"});
     mydiv2.html("<p id='ConfirmMessageBody' style='margin:5px;' ></p>");
	 $("body").append(mydiv2);
});
function createPopDiv(showDialogId) {
	var mydiv = $("<div id=\"showdialog"+showDialogId+"\"></div>");
	mydiv.css({"margin":"0 0 0 0", "padding":"0 0 0 0"});
	mydiv.append("<iframe id=\"dialogframe"+showDialogId+"\" name='dialogframe"+showDialogId+"' frameborder='0'  resizable='no' src=''></iframe>");
	$("body").append(mydiv);
}
function popupOk(){
	alert("ok");
}
/*
 *url:需要显示在弹出层的jsp的url地址
 *divId:给弹出层的div指定id，如果不指定，用null，程序会取showdialog+前下时间来当id
 *title:显示在弹出层标题栏的标题
 *height:弹出层的高度
 *width:弹出层的宽度
 *callback:关闭时的回调函数
 *left,top:弹出层的坐标，位置
 *modal:
 *animation：
 *customclass：自定义的样式的class名字
 *customDivId:只弹出一个div，而不是iframe
 *iframemodal:在弹出时，后面的内容是否为不可用。如果为true，为不可用。否则，为可用。
 *parentIframeId: 在需要用closedialog('iframeid','callback')方法关闭弹出层的时候调用callback时，用window.name,否则，传null
 *isPopupMore: 用来控制弹出层是否只能弹出一个。如果为true,可以连续弹出多个。否则，且divId必须为指定id，在没有关闭当前弹出层时，只能弹出一个。
 *showBtn:是否显示“完成”、“取消”按钮，取值true/false，默认false
 *completeFunc：显示按钮时，“完成”按钮方法
 *cancelFunc：显示按钮时，“取消”按钮方法，不传时默认为关闭弹出层方法
 */
function showDialog(url, divId, title, height, width, callback, left, top, modal, animation, customclass,customDivId,iframemodal,parentIframeId,isPopupMore,draggable,showBtn,completeFunc,cancelFunc) {
	if( typeof(draggable)=="undefined" || draggable==null){
		draggable=true;
	}
	if(!divId){
		divId = new Date().getTime().toString().substring(7);
	}
	if (title == undefined) {
		title = "tips";
	}
	if (height == undefined) {
		height = 500;
	}else{
		height = parseInt(height);
	}
	if (width == undefined) {
		width = 800;
	}else{
		width = parseInt(width);
	}
	if (left == undefined) {
		left = "center";
	}
	if (top == undefined) {
		top = "center";
	}
	if (animation == undefined) {
		animation = null;//'slide'
	}
	if (modal == undefined) {
		modal = false;
	}
	if(iframemodal == true) {
		createIframe(divId);
	}
	if(parentIframeId != undefined) {
		dialogIframeIdArray = new Array();                         //全局变量，用来存放需要回调操作的iframe的id
		dialogIframeIdArray.push(parentIframeId);                        
	}
	if(customDivId == undefined  || customDivId == "" || customDivId == "null" || customDivId == null) {
		if(isPopupMore == true) {                                 //允许弹出多个页面
			popdialog(url, divId, title, height, width, callback, left, top, modal, animation,draggable,showBtn,completeFunc,cancelFunc);	
		} else {
			
			if(("dialogIframeURLArray" in window) == false) {
				dialogIframeURLArray = new Array();
			}
			if(dialogIframeURLArray.length == 0) {
				popdialog(url, divId, title, height, width, callback, left, top, modal, animation,draggable,showBtn,completeFunc,cancelFunc);
				dialogIframeURLArray.push("dialogframe"+ divId + ":" + url);
			} else if(dialogIframeURLArray.length > 0){
				var sum = 0;
				for(var i = 0; i < dialogIframeURLArray.length; i++) {
					if(dialogIframeURLArray[i].indexOf(url) == -1) {
						sum++;
					}
				}
				if(sum == dialogIframeURLArray.length) {
					popdialog(url, divId, title, height, width, callback, left, top, modal, animation,draggable,showBtn,completeFunc,cancelFunc);
					dialogIframeURLArray.push("dialogframe"+ divId + ":" + url);
				}
			}
		}		
		//$($("#showdialog" + divId)[0].parentNode).css("backgroundColor","#FFFFFF");	
		if(customclass != undefined) {
			$($("#showdialog" + divId)[0].parentNode).addClass(customclass);
		}
		
		return divId;		
	} else {
		$("#" + customDivId).css("backgroundColor","#FFFFFF");
		$("#" + customDivId).dialog({
			autoOpen:true, 
			modal:modal, 
			title:title, 
			height:height, 
			width:width, 
			resizable:false, 
			position:[left, top], 
			show:animation,
			draggable:draggable
			
		});
		$($("#" + customDivId)[0].parentNode).css("backgroundColor","#FaFFFF");
		return customDivId;
	}
}
function popdialog(url, divId, title, height, width, callback, left, top, modal, animation,draggable,showBtn,completeFunc,cancelFunc) {
	if( typeof(draggable)=="undefined" || draggable==null){
		draggable=true;
	}
	createPopDiv(divId);
	var requestMethod = "get";
	var index1 = url.indexOf("?");
	var urlpre = url;
	urlpre = url.substring(0,index1);
	var paramstr = url.substring(index1+1);
	if(paramstr.length>=1024){
		requestMethod = "post";
	}
	var index2 = paramstr.indexOf("#");
	if(index2!=-1){
		paramstr = paramstr.substring(0,index2);
	}
	
	$("#dialogframe"+divId).width(width);
	$("#dialogframe"+divId).height(height);
	if((showBtn+"")=="true"){
		$("#showdialog" + divId).dialog({
			autoOpen:true, 
			modal:modal, 
			title:title, 
			width:width, 
			resizable:false, 
			position:[left, top], 
			bgiframe:true, 
			show:animation,
			draggable:draggable,
		     close:function(){
		     	$("#dialogframe"+divId).attr("src","");
		     	$("#dialogframe"+divId).remove();
		     	$("#showdialog"+divId).empty();
		  		$("#showdialog"+divId).dialog("destroy");
		     	if($("#showdialog"+divId).length>0){
					$("#showdialog"+divId).remove();
					deleteIframe(divId);//删除遮罩iframe

					if(callback){
						try{
							eval(callback+"()");		
						}catch(e){
						
						}
						$("#showdialog"+divId).hide();;
					}
					if(("dialogIframeURLArray" in window) == true && dialogIframeURLArray.length > 0 ) {
						for(var j = 0; j < dialogIframeURLArray.length; j++) {
							var index = dialogIframeURLArray[j].indexOf(url);
							if( index != -1) {
								dialogIframeURLArray.splice(j,(j+1));
							}
						}
					}
			}
			if(window.navigator.userAgent.toLowerCase().indexOf("firefox") > 0) {
				delete window.frames["dialogframe" + divId];
			}
	     } ,
			buttons:{'完成':function(){ 
							    //触发完成方法 
								eval('$("#dialogframe"+divId)[0].contentWindow.'+completeFunc+'()');
							}, 
					 '取消':function(){ 
						 		if(cancelFunc){//触发取消方法
						 			eval('$("#dialogframe"+divId)[0].contentWindow.'+cancelFunc+'()');
						 		}else{
						 			//默认为关闭当前Dialog 
									$(this).dialog("close"); 
						 		}
						    } 
			}});
	}else{
		$("#showdialog" + divId).dialog({
			autoOpen:true, 
			modal:modal, 
			title:title, 
			width:width, 
			resizable:false, 
			position:[left, top], 
			bgiframe:true, 
			show:animation,
			draggable:draggable,
		     close:function(){
		     	$("#dialogframe"+divId).attr("src","");
		     	$("#dialogframe"+divId).remove();
		     	$("#showdialog"+divId).empty();
		  		$("#showdialog"+divId).dialog("destroy");
		     	if($("#showdialog"+divId).length>0){
					$("#showdialog"+divId).remove();
					deleteIframe(divId);//删除遮罩iframe

					if(callback){
						try{
							eval(callback+"()");		
						}catch(e){
						
						}
						$("#showdialog"+divId).hide();;
					}
					if(("dialogIframeURLArray" in window) == true && dialogIframeURLArray.length > 0 ) {
						for(var j = 0; j < dialogIframeURLArray.length; j++) {
							var index = dialogIframeURLArray[j].indexOf(url);
							if( index != -1) {
								dialogIframeURLArray.splice(j,(j+1));
							}
						}
					}
			}
			if(window.navigator.userAgent.toLowerCase().indexOf("firefox") > 0) {
				delete window.frames["dialogframe" + divId];
			}
	     } ,
			buttons:{}});
	}
	
	//调整弹出层样式
	if((showBtn+"")=="true"){
		$(".ui-dialog-buttonpane").height(40).css({"background":"#eee","border-top":"1px solid #ccc"});
		$(".ui-dialog-buttonpane").find("button").height(26).css({"border":"1px solid #ccc","padding-left":"0.5em","padding-right":"0.5em","line-height":"26px","margin-top":"5px"});
		$(".ui-dialog-buttonpane").find("button").find("span").css("padding","0px 1em")
		$(".ui-dialog-titlebar .ui-dialog-title").css("margin-left","10px");
		$("#dialogframe"+divId).width($("#dialogframe"+divId).width()-20);
		$(".ui-dialog-content").css("padding","10px");
		if($(".ui-dialog-content").height()<$("#dialogframe"+divId).height()){
			$(".ui-dialog-content").css("padding-right","0px");
		}
	}

	if(navigator.userAgent.toLowerCase().match(/chrome/) != null && $("#showdialog"+divId).height()>height){
		$("#showdialog"+divId).css("height","auto");
		$("#dialogframe"+divId).css("margin-bottom","-3px");
	}

	if($.browser.msie){
		$(".ui-dialog-titlebar").css("padding-left","0px").css("padding-right","0px");
		$(".ui-icon-closethick").css("margin-right","3px")
	}

	if(requestMethod=="get"){
		$("#dialogframe"+divId).attr("src", url);
	}else{
		var paramForm = $("<form action='' method='post' target='dialogframe"+divId+"'></form>");
		if(index1!=-1){
			var parammap = paramstr.split("&");
			var paramcount = parammap.length;
			for(var i=0;i<paramcount;i++){
				var paramitem = parammap[i];
				var paramitemmap = paramitem.split("=");
				if(paramitemmap[0]&&paramitemmap[1]){
					var inputobj = $("<input type='text' name='"+paramitemmap[0]+"' value='"+paramitemmap[1]+"' />");
					$(paramForm).append(inputobj);
				}
			}
		}
		$(paramForm).attr("action",urlpre);
		$(document.body).append(paramForm);
		$(paramForm).submit();
		$(paramForm).remove();
	}

}
var domainTop = window;
function alertWithCallBack(msg,alertType,callback,type,w,h,x,y){
    //var alerttip = $("<div id='AlertMessage' class='RQAlertMessage'><span id='alertclosespan' class='alertclosespanCls'></span><span style='display:inline-block;width:150px;height:20px;'>提示</span><div id='alertcontent'></div></div>");
	if($("#AlertMessage",domainTop.document).length>0){
		try{domainTop.clearTimeout(ss);}catch(e){}
	   	$("#AlertMessage",domainTop.document).remove();
	}
	//if(ss != null && ss != "undefined" && typeof ss != "undefined"){
	    //clearTimeout(ss);
	//}
	// var alerttip = $("<div id='AlertMessage' class='RQAlertMessage'><span id='alertTypeSpan' class='alertTypeSpan'></span><span id='alertclosespan' class='alertclosespanCls'></span><div id='alertcontent'></div></div>");
	$("body",domainTop.document).append("<div id='AlertMessage' class='RQAlertMessage'><span id='alertTypeSpan' class='alertTypeSpan'></span><span id='alertclosespan' class='alertclosespanCls'></span><div id='alertcontent'></div></div>");
	
	if(msg=="" || msg==null){
	    return;
	}
	if(alertType==undefined){
		if(msg.indexOf("成功")!=-1 || msg.indexOf("succ")!=-1 || msg.indexOf("yes")!=-1){
		    alertType = 2;
		}else if(msg.indexOf("失败")!=-1 || msg.indexOf("出错")!=-1 || msg.indexOf("error")!=-1 || msg.indexOf("no")!=-1 || msg.indexOf("不能为空")!=-1){
		    alertType = 3;
		}else{
			alertType = 1;
		}
	    
	}
	if(type==undefined){
		type = -1;
	}
	if(w==undefined){
		w = 166;
	}
	if(h==undefined){
	}
	if(x==undefined){
		x = 'center';
	}
	if(y==undefined){
		y = 'top';
	}
	if(w){
		//$("#AlertMessage").width(w);
	}
	if(h){
		//$("#AlertMessage").height(h);
	}
	if(alertType == 1){
	   $("#AlertMessage",domainTop.document).addClass("alertTips");
	   $("#alertTypeSpan",domainTop.document).addClass("alertTipsSpan");
	   $("#alertcontent",domainTop.document).css("background-color","#4D94FF");
	}else if(alertType == 2){
	   $("#AlertMessage",domainTop.document).addClass("alertSucc");
	   $("#alertTypeSpan",domainTop.document).addClass("alertSuccSpan");
	   $("#alertcontent",domainTop.document).css("background-color","#1FAD38");
	}else if(alertType == 3){
	   $("#AlertMessage",domainTop.document).addClass("alertWarn");
	   $("#alertTypeSpan",domainTop.document).addClass("alertWarnSpan");
	   $("#alertcontent",domainTop.document).css("background-color","#DD3A2D");
	}else if(alertType == 4){//手动关闭alert提示框
	   $("#AlertMessage",domainTop.document).addClass("alertTips");
	   $("#alertTypeSpan",domainTop.document).addClass("alertTipsSpan");
	   $("#alertcontent",domainTop.document).css("background-color","#4D94FF")
	}
	$("#alertcontent",domainTop.document).css("word-wrap","break-word");
	alertEvent(msg,alertType);
	if(callback){
		callback();
	}
	//重新计算tab页面最大化有滚动条滚动时的弹出位置
	$('#AlertMessage').css('top',$(window).scrollTop());
	switch(type){
		case 0:window.location.reload();break;
		case 1:window.parent.location.reload();break;
		case 2:window.parent.parent.location.reload();break;
		case 3:window.parent.parent.parent.location.reload();break;
		default:break;
	}
}
function isOpen(){
	var b =$('#showDialog').dialog("isOpen");
	return b;
}

function getTopWindow(callback){
	this.alertMsg = function(){
		domainTop = getDomainTop(window);
		if(domainTop != window){
			var file00 = {name:getContextPath() + "/mis2/style/s1/customStyle/customStyle.css",type:"css"};
			var file01 = {name:getContextPath() + "/mis2/gezComponents/popupDiv/css/jquery.popup.css",type:"css"};
			var file02 = {name:getContextPath() + "/mis2/gezComponents/jquery/jquery.js",type:"js"};
			var file03 = {name:getContextPath() + "/mis2/gezComponents/jquery/jqueryui/jqueryuijs/jqueryui.js",type:"js"};
			var file04 = {name:getContextPath() + "/mis2/gezComponents/popupDiv/showDialog.js",type:"js"};
			var file05 = {name:getContextPath() + "/mis2/gezComponents/jsUtils/rqEditStyleUtils.js",type:"js"};
			
			var loadFileArray = new Array(file00,file01,file02,file03,file04,file05);
			try{removeJsCssFile(domainTop,loadFileArray);}catch(e){}
			domainTop["loadFileArray"] = loadFileArray;
			loadJsCssFile(domainTop,loadFileArray,callback);
		}else{
			if(typeof callback == "function"){
				try{callback();}catch(e){}
			}
		}
	}
	
}

function alert(msg,alertType,type,w,h,x,y){
	var domainTop = new getTopWindow(function(){
		alertWithCallBack(msg,alertType,null,type,w,h,x,y);
	});
	domainTop.alertMsg();
}
function showErrorMsg(msg,type,w,h,x,y) {
	//getTopWindow(function(){
		alertWithCallBack(msg,'3',null,type,w,h,x,y);
	//});
}
function alertClose(msg,type,w,h,x,y) {
	//getTopWindow(function(){
		alertWithCallBack(msg,null,type,w,h,x,y); 
	//});
}
var mDialogCallback;
function confirmUi(msg, callback,w,h) {
	if(w==undefined){
		w = 320;
	}
	if(h==undefined){
		h = 150;
	}
	mDialogCallback = callback;
	$("#ConfirmMessage").dialog({
		autoOpen: false,
		width: w,
		height:h,
		buttons: {
		"确认": function() {
			$(this).dialog('close');
			mDialogCallback(true);
			return true;
		},
		"取消": function() {
			$(this).dialog('close');
			mDialogCallback(false);
			return true;
		}
		} 
	});

	/* 修改confirmUi弹出层工具条样式，与平台风格一致 */
	$("div[aria-labelledby=ui-dialog-title-ConfirmMessage]").css("height",$("div[aria-labelledby=ui-dialog-title-ConfirmMessage]").height()-12);
	$(".ui-dialog-buttonpane").css("height","35px");
	$(".ui-dialog-buttonset").css("height","35px");
	$(".ui-dialog-buttonset").find("button").css("height","26px");
	$(".ui-dialog-buttonset").find("button").css("margin-top","5px");
	
	$('div #ConfirmMessage #ConfirmMessageBody').html('<span class="confirmUiFlag"></span>');
	$('div #ConfirmMessage #ConfirmMessageBody').append('<span id="uiMsg" style="display:inline-block;line-height:22px;padding-top:5px;width:'+(w-100)+'px;position:absolute;right:10px;font-size:15px;font-style:宋体">'+msg+'</span>');
	$("div #ConfirmMessage").dialog('open');
    
	var uiMsgHeight = $("#uiMsg").height();
	if($('.ui-dialog-content').length>1){
		$('.ui-dialog-content').eq(0).remove();
	}
	// confirm($('.ui-dialog-content').length+" ; "+h)
	$("#uiMsg").css("top",($('div #ConfirmMessage').height()-uiMsgHeight-10)/2);
	$(".confirmUiFlag").css("margin-top",($('div #ConfirmMessage').height()-60-10)/2-5);

};
/**
 *frameId为弹出层的iframe的id,
 *callback为被操作的iframe里的方法,此方法必须是唯一的具方法名必须大于８位。
 */
function closeDialog(frameId,callback) {
	deleteIframe(frameId.replace("dialogframe",""));//删除遮罩iframe
	$("#" + frameId).attr("src","");
	$("#" + frameId).remove();
	var showDialogId = frameId.replace("dialogframe","showdialog");
	if(showDialogId.indexOf("showdialog")==-1){
		showDialogId = "showdialog"+showDialogId;
	}
	$("#"+showDialogId).empty();
	$("#"+showDialogId).dialog("destroy");
	if($("#"+showDialogId).length>0){
		//弹出层中弹出alert提示后，执行次方法ie下会删不掉弹出层的标题条，此处增加一条删除语句
		if($("#"+showDialogId).parent().attr("aria-labelledby")==("ui-dialog-title-"+showDialogId)){
			$("#"+showDialogId).parent().remove();
		}
		$("#"+showDialogId).remove();
	}
	if(("dialogIframeURLArray" in window) == true && dialogIframeURLArray.length > 0 ) {
		for(var k = 0; k < dialogIframeURLArray.length; k++) {
			var index = dialogIframeURLArray[k].indexOf(frameId);
			if( index != -1) {
				dialogIframeURLArray.splice(k,(k+1));
			}
		}
	}
	if(callback) {
		if(callback.length >= 8) {
			//window.frames[customIframeId].eval(callback + "('"+data+"')");这句代码留做备用
			for(var i = 0; i <= window.frames.length; i++) {
				//if(window.frames[i].hasOwnProperty(callback)) {
				if(callback in window.frames[i]) {
					for( var l =0; l < dialogIframeIdArray.length; l++) {
						if(dialogIframeIdArray[l] == window.frames[i].name) {
							window.frames[i].eval(callback + "()");
							dialogIframeIdArray.splice(l,(l+1));
							return;
						}
					}
				} 
				if(window.frames[i].frames.length > 0) {
					search(window.frames[i],callback);
				}
			}
		} else {
			confirm("Method(callback) name cannot be less than 8");
		}
	}
	if(window.navigator.userAgent.toLowerCase().indexOf("firefox") > 0) {
		delete window.frames[frameId];
	}
}
/**
 *obj为当下的window对象
 *callback为closeDialog()方法传放的回调函数
 */
function search(obj,callback) {
	for(var j = 0; j < obj.frames.length; j++) {
			//if(obj.frames[j].hasOwnProperty(callback)) {
			if(callback in obj.frames[j] ) {
				for( var k =0; k <= dialogIframeIdArray.length; k++) {
					if(dialogIframeIdArray[k] == obj.frames[j].name) {
						obj.frames[j].eval(callback + "()");
						dialogIframeIdArray.splice(k,(k+1));
						return; 
					}
				}
				
			} 
			if(obj.frames[j].frames.length  > 0) {
				search(obj.frames[j],callback);
			}
			
		}
}
var ss;
function alertEvent(content,alertType){
		//获取窗口高度
		 var winHeight = 0;
         if (window.innerHeight){
         	 winHeight = window.innerHeight;
         } else if ((document.body) && (document.body.clientHeight)) {
         	 winHeight = document.body.clientHeight;
         }
         //通过深入Document内部对body进行检测，获取窗口大小
         if (document.documentElement  && document.documentElement.clientHeight &&
                                              document.documentElement.clientWidth)
         {
             winHeight = document.documentElement.clientHeight;
         }	 
               
	    var _scrollTop = $(window).scrollTop();
		var _scrollLeft = $(domainTop).scrollLeft();
        $("#alertcontent",domainTop.document).empty();
		$("#alertcontent",domainTop.document).append(content);
        //$("#AlertMessage",domainTop.document).show();
        var divHeight = $("#AlertMessage",domainTop.document).height();
		var divWidth = $("#AlertMessage",domainTop.document).width()+80;
        //$("#AlertMessage",domainTop.document).hide();
		if(alertType == 3){
		    $("#AlertMessage",domainTop.document).css("top",($(domainTop).height() + _scrollTop - divHeight)/2);
		}else{
		    $("#AlertMessage",domainTop.document).css("top","0px");
		}
		$("#AlertMessage",domainTop.document).css("right",($(domainTop).width() + _scrollLeft - divWidth)/2);
		
		$("#alertTypeSpan",domainTop.document).height(divHeight+1);
		$("#alertclosespan",domainTop.document).height(divHeight);
        
		$("#alertclosespan",domainTop.document).click(function(){
			domainTop.alertHide('slow');
		});
        if(alertType != 4){//不设置定时关闭alert提示框，进行手动关闭
		    $("#AlertMessage",domainTop.document).show(1,domainTop.setTimeClose);
		    $("#AlertMessage",domainTop.document).mouseenter( function(){
				domainTop.clearTimeout(ss);
			});
		    $("#AlertMessage",domainTop.document).mouseleave(function(){
				domainTop.setTimeClose();								  
			});
		}else{
		    $("#AlertMessage",domainTop.document).show(1,null);
	
		}
} 
function setTimeClose(){
	try{
		ss=setTimeout(function(){
			domainTop.alertHide('slow');
		},3000);
	}catch(e){}	
}
function alertHide(speed)
{	
	try{domainTop.clearTimeout(ss);}catch(e){}
	if(typeof speed != "undefined"){
		$("#AlertMessage",domainTop.document).hide(speed);
	}else{
		$("#AlertMessage",domainTop.document).hide();
	}
	
	if(domainTop["loadFileArray"] != ""){
	    removeJsCssFile(domainTop,domainTop["loadFileArray"]);
		domainTop["loadFileArray"] = "";
	}
}
//给弹出层后面加一个遮罩iframe
function createIframe(divId) {
	var width = $(window).width();
	var height = $(window).height();
	var myIframe =  $("<IFRAME frameBorder=0 scrolling=no src=\"\" frameborder=\"1\" name=board id=\"frameboard"+divId+"\" width=\""+width+"px\" height=\""+height+"px\" style=\"display:none;position:absolute;background-color:transparent;left:0; top:0;display:block;opacity: 0.5;filter: Alpha(opacity=50);-moz-opacity: 0.5;\"></IFRAME>");
	if($("#frameboard"+divId).length==0){//防止生成多个相同id的遮罩--目前是在复杂报表自动保存时出现的
		$("body").append(myIframe);
	}
}

function createDialogIframe(divId){
	var width = $(window).width();
	var height = $(window).height();
	var myIframe =  $("<IFRAME frameBorder=0 scrolling=no src=\"\" frameborder=\"1\" name=board id=\"frameboard"+divId+"\" width=\""+width+"px\" height=\""+height+"px\" style=\"display:none;position:absolute;background-color:transparent;left:0; top:0;display:block;opacity: 0.5;filter: Alpha(opacity=50);-moz-opacity: 0.5;\"></IFRAME>");
	$("body").append(myIframe);
}

//删除弹出层后面加一个遮罩iframe
function deleteIframe(divId) {
	if($("#frameboard"+divId).attr("id") == "frameboard"+divId) {
		$("#frameboard"+divId).remove();
	}
}