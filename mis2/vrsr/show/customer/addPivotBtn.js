
/**
 *判断浏览器类型方法
 *
 */
function BrowserType(){
	var OsObject = "";
	if(navigator.userAgent.indexOf("MSIE")>0) {
		OsObject = "MSIE";
	}
	if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){
		OsObject = "Firefox";
	}
	if(isSafari=navigator.userAgent.indexOf("Safari")>0&&navigator.userAgent.indexOf("Chrome")<0) {
		OsObject = "Safari";
	}
	if(isCamino=navigator.userAgent.indexOf("Chrome")>0){
		OsObject = "Chrome";
	}
	return OsObject;
}

var fast_hidecol_sumheight;
var fast_hidecol_sumwidth;
var hideColHeaderArray; 
var showMenuTd=null;
var addBtnCell=new Array();//记录要加按钮的单元格
var cloneArr;//克隆单元格的原始信息
var clearHid=false;
$(document).click(function(event){
	if($("#menuDiv")[0]){
		if($(event.target).parents("#menuDiv").length>0||$(event.target).attr("name")=="menuButton"){
		}else{
			$(showMenuTd).attr("hasShow",false);
			removeMenu();
		}
	}

});

/** 初始化表格，给相应单元格添加按钮，并保存表格的一些原始信息**/
function addBtn(reportId){
	//debugger;
	Resize(reportId,null,true);
	
}
