var refresh = true;
var colWidthType = "resize";//列宽属性来源，如果是基本设置则basic，拖动则resize,first 表示第一次展现，使用xml中colWidth值即可
function changeContainer(width, height, tag) {
	var cont = document.getElementById("container");
	var swfObj = document.getElementById("TestJS");
	swfObj.width = width;
	swfObj.height = height;
	if (width == 700) {
		// 移动居中
		cont.style.top = 40;
		cont.style.left = 165;
	} else {
		// 移动回原位
		cont.style.top = 5;
		cont.style.left = 165;
	}
	if (refresh) {
		if (tag == "submit") {
			refreshData = "no";
			viewer.initPageCount();
		}
	} else
		refresh = true;
}

function popUpSetWindow(menuName) {
	try{
		var fc = document.getElementById("TestJS");
		fc.callMenu(menuName);
	}catch(e){
	}
}
/**
* 展现界面的字段排序
*/
function sortSet(){
	var ajax = new AjaxUtil();
	var url = PathUtils
			.getRelativeUrl("/showFastReportServlet?action=36&resID="
					+ base64.encode(reportID)+"&reportDefineId="+base64.encode(reportDefineId));
	 ajax.sendAjax(url,"",function(data){
         if(data.state != "500"){
			//获得字段设置信息
			var fieldInfo = data.fieldInfo;
			if(fieldInfo =="" ) return ;
			var base64=new Base64();
			fieldInfo = base64.encode(fieldInfo);
			var swfNameAndPath;
			var wid = 472; //+16为弹出层中作了居中处理后，导致的右侧缺失，所以补充16像素
			var height = 391;
			swfNameAndPath = "fastReport/analysis/swf/GroupSetSortPriority.swf";
			var url=PathUtils.getAbsoluteJspUrl("fastReport/analysis/testPopUp.jsp?appName="+swfNameAndPath+"&params="+fieldInfo+"&reportDefineId="+reportDefineId+"&resType=12&dataAnalyseId=''");
			showDialog(url,"swfWindow","排序设置",height,wid,null, null, null, true, null, null,null,true,null,false);
		 }
     },function(a,b,e){
         alert(e);
     });
}
/**
* 点击关闭flex回调此函数，然后判断是否是排序设置，是排序设置发送ajax请求，更新排序方式
*/
function closeSwfWindow(backParams){
			var base64 = new Base64();
			var replaceStr = JSON.parse(base64.decode(backParams));
			if(replaceStr['sortInfo']){
				var ajax = new AjaxUtil();
				var url = PathUtils
					.getRelativeUrl("/showFastReportServlet?action=37&resID="
					+ base64.encode(reportID)+"&reportDefineId="+base64.encode(reportDefineId)+"&sortInfo="+backParams);
				ajax.sendAjax(url,"",function(data){
					if(data.state != "500"){
					}
				},function(a,b,e){
					alert(e);
				});
			}
			closeDialog("swfWindow");
		}
function showBasicSetDialog(){
	var wid = 510;
	var height = 240;
	var url=PathUtils.getRelativeJspUrl("/fastReport/analysis/groupWholeSet.jsp?analysisLayout=fast&reportDefineId="+reportDefineId+"&resType=12&fromWhere=showFastReport");
	showDialog(url,"groupWhole","整体设置",height,wid,null, null, null, null, null, null,null,true,null,false);
}

// 条件过滤，字段设置调用方法 names格式为 (条件过滤)setFilter+"-_-"+字段名字 (字段设置)setDetail+"-_-"+字段名字
function popUpSetFiledWindow(names,tablePosition) {
	try{
		if(names.indexOf("setDetail-_-") == 0){//字段设置
			setFieldDetail(names,tablePosition);
		}else{//条件过滤 
			var fc = document.getElementById("TestJS");
			fc.callField(names);
		}
	}catch(e){
	}
}

function isPopWarning() {
	confirm("已打开设置窗口！");
}

function copyReport(report_url, _ngr_name) {
	var base64 = new Base64();
	creatXMLHTTPRequest();
	var checkString = PathUtils
			.getRelativeUrl("mis2/reportcenter/copyReport.jsp?report_url="
					+ report_url + "&ngr_name=" + base64.encode(_ngr_name)
					+ "&resType=" + resType + "&resNameShort="
					+ base64.encode(_ngr_name));
	xmlHttp.onreadystatechange = afterCopyReport;
	xmlHttp.open("GET", checkString, true);
	xmlHttp.send(null);
}
function afterCopyReport() {
}

function setFuncResult(menuName, result) {
	confirm("功能名称：" + menuName + "\n结果：" + result);
}

/** 获取参数数据集配置 */
function getRqDataSets() {
	return "null";
}

function encode(str) {
	var base64 = new Base64();
	if(str.indexOf("colWidthNS")!=-1){
		colWidthType = "basic";
	}
	return base64.encode(str);
}

function decode(str) {
	var base64 = new Base64();
	var result = base64.decode(str);
	return result;
}

function submitAll() {
	TestJS.submit();
}

function callbackFun() {
	thisMovie("TestJS").RaqStr();
}

function thisMovie(movieName) {
	if (navigator.appName.indexOf("Microsoft") != -1) {
		return window[movieName];
	} else {
		return document[movieName];
	}
}

function fileUpdate() {
	var base64 = new Base64();
	var ajax = new AjaxUtil();
	var url = PathUtils
			.getRelativeUrl("/showFastReportServlet?action=23&resID="
					+ base64.encode(reportID)+"&reportDefineId="+base64.encode(reportDefineId));
	ajax.sendAjax(url, "", back, errorFun);
}

function back(data) {
	if (data.result == "success") {
		parent.alert("更新文件成功！");
	} else {
		parent.alert("更新文件失败！");
	}
}

function hideCol() {
	var base64 = new Base64();
	var ajax = new AjaxUtil();
	var url = PathUtils
			.getRelativeUrl("/showFastReportServlet?action=25&resID="
					+ base64.encode(reportID) + "&fieldName="
					+ base64.encode("上级")+"&reportDefineId="+base64.encode(reportDefineId));
	ajax.sendAjax(url, "", back1, errorFun);
}

function back1(data) {
	if (data.result == "success") {
		parent.alert("隐藏列设置成功!");
	} else {
		parent.alert("隐藏列设置失败!");
	}
}

function cancelHideCol() {
	var base64 = new Base64();
	var ajax = new AjaxUtil();
	var url = PathUtils
			.getRelativeUrl("/showFastReportServlet?action=24&resID="
					+ base64.encode(reportID)+"&reportDefineId="+base64.encode(reportDefineId));
	ajax.sendAjax(url, "", back2, errorFun);
}

function back2(data) {
	if (data.result == "success") {
		parent.alert("取消隐藏列设置成功!");
	} else {
		parent.alert("取消隐藏列设置失败!");
	}
}

function showCommonQueryDesign() {
	var base64 = new Base64();
	var padding_left = (document.body.clientWidth - 670) / 2;
	var padding_top = (document.body.clientHeight - 300) / 2;
	var url = PathUtils
			.getRelativeUrl("/mis2/vrsr/show/commonQueryDesign.jsp?reportID="
					+ base64.encode(reportID));
	showDialog(url, null, "查询过滤设置", '550', '930', null, null, null, null, null,
			null, null, true);
}

/**
 * 发送失败函数
 */
function errorFun(XMLHttpRequest, textStatus, errorThrown) {
	alert("发送失败");
}
function saveReportDoc() {
	var resID = viewer.reportId; // 资源ID
	var reportDefineId = viewer.reportDefineId; // 实体ID
	var path = PathUtils
			.getRelativeUrl("/mis2/vrsr/show/saveFastReportDialog.jsp?resID="
					+ resID+"&reportDefineId="+reportDefineId);
	showDialog(path, "SaveFastReportDialog", "保存报表", 120, 320, null, null,
			null, null, null, null, null, true, null, null, true);
}

// 更新报表XML：
function updateReport() {
		var resID = viewer.reportId; // 资源ID

	// url, divId, title, height, width, callback, left, top, modal, animation,
	// customclass,customDivId,iframemodal,parentIframeId,isPopupMore,draggable
	//从页面中获取行高，列宽（数组），用来保存拖动后的样式
	var rowHeight = $("#report_"+resID+"_table_rowHeader").children().children().eq(0).height();
	if(rowHeight==0){
		rowHeight = $("#report_"+resID+"_table_colHeader").children().children().eq(0).height();
	}
	var colWidthStr = "";
	if(colWidthType=="resize"){//使用拖动后的列宽
		colWidthStr += "{";
		$("#report_"+resID+"_table_corner").children().children().eq(0).children().each(function(){//分组字段宽度
			colWidthStr +="'"+$(this).text()+"':'"+$(this).width()+"',";
		});
		$("#report_"+resID+"_table_colHeader").children().children().last().children().each(function(){//列表字段宽度
			colWidthStr +="'"+$(this).text()+"':'"+$(this).width()+"',";
		});
		colWidthStr = colWidthStr.substring(0,colWidthStr.length-1);
		colWidthStr += "}";
	}else{//使用基本设置中的列宽
		colWidthStr = "basic" ;
	}

	

	$.ajax({
		type : "POST",
		url : PathUtils.getRelativeUrl("/showFastReportServlet?action=33"),
		async : true,
		cache : false,
		data : {
			"resID" : base64.encode(reportID),
			"reportDefineId" : base64.encode(reportDefineId),
			"serverPath" : base64.encode(serverPath),
			"fastReportDir" : base64.encode(filePath),
			"rowHeight" : rowHeight,
			"colWidthStr" : base64.encode(colWidthStr)
		},
		dataType : "json",
		success : function(data) {
			if(data.status == 'success'){
				alert("保存成功！");
				viewer.reportConfig.rowHeight = rowHeight;
			}else{
				alert(data.message);
			}
		},
		error : function(e) {
			alert(JSON.stringify(e));
		}
	});
}

// 报表另存为：
function saveAsReport(gradePath) {
	var filePath = '/mis2/reportcenter/res/fastReport/jsbb/reportFiles';
	showSaveDialog('另存为', 'ResAndFile', null, 'saveDialogCallback4SaveAs', true, 12, '', '', gradePath, '', filePath, 'xml');
}

// 保存窗口回调函数：
function saveDialogCallback4SaveAs(data){
	data.order = 10;
	data.resID = base64.encode(reportID); 
	data.reportDefineId = base64.encode(reportDefineId); 
	data.serverPath = base64.encode(serverPath);
	data.fastReportDir = base64.encode(filePath);
	data.operation = 'save_as';
	$.ajax({
		type : "POST",
		url : PathUtils.getRelativeUrl("/showFastReportServlet?action=33"),
		async : true,
		cache : false,
		data : data,
		dataType : "json",
		success : function(data) {
			if(data.status == 'success'){
				alert("保存成功！");
			}else{
				alert(data.message);
			}
		},
		error : function(e) {
			alert(JSON.stringify(e));
		}
	});
}

//客户自定义工具栏图标的处理
$(function(){
	//加载打印图标
	try{
	   var buttonStr=vr_ui_toolbar_print_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#print").html("");
			$("#print").append($(buttonStr));
	   }
	}catch(e){
	}
	//加载导出excel
	try{
	   var buttonStr=vr_ui_toolbar_export_excel_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#exportWord").html("");
			$("#exportWord").append($(buttonStr));
	   }
	}catch(e){
	}

	//加载导出word
	try{
	   var buttonStr=vr_ui_toolbar_export_word_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#exportExcel").html("");
			$("#exportExcel").append($(buttonStr));
	   }
	}catch(e){
	}

	//加载刷新
	try{
	   var buttonStr=vr_ui_toolbar_refresh_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#refresh").html("");
			$("#refresh").append($(buttonStr));
	   }
	}catch(e){
	}

	//加载订阅
	try{
	   var buttonStr=vr_ui_toolbar_subscribe_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#subreport").html("");
			$("#subreport").append($(buttonStr));
	   }
	}catch(e){
	}

	//加载远程导出按钮
	try{
	   var buttonStr=vr_ui_toolbar_remote_export_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#li_remoteExport").html("");
			$("#li_remoteExport").append($(buttonStr));
	   }
	}catch(e){
	}
					
	try{
	   var buttonStr=vr_ui_toolbar_filterSet1_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#filterSet1").html("");
			$("#filterSet1").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_filterSet2_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#filterSet2").html("");
			$("#filterSet2").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_fleldSet_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#fleldSet").html("");
			$("#fleldSet").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_sortSet_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#sortSet").html("");
			$("#sortSet").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_printSet_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#printSet").html("");
			$("#printSet").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_basicSet_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#basicSet").html("");
			$("#basicSet").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_showReport_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#showReport").html("");
			$("#showReport").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_showCol_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#showCol").html("");
			$("#showCol").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_prePage_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#previous").html("");
			$("#previous").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_nextPage_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#next").html("");
			$("#next").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_firstPage_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#first").html("");
			$("#first").append($(buttonStr));
	   }
	}catch(e){
	}

	try{
	   var buttonStr=vr_ui_toolbar_lastPage_icon();
	   if(buttonStr!=null&&typeof(buttonStr) != "undefined"){	
			$("#last").html("");
			$("#last").append($(buttonStr));
	   }
	}catch(e){
	}

});
