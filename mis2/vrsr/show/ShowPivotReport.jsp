<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.runqian.mis2.util.ReadConfInfo"%>
<%@page import="com.runqianapp.show.config.ShowConfig"%>
<%@page import="com.runqianapp.commonquery.utils.JSCommonQueryUtils"%>
<%@page import="com.runqianapp.show.utils.CommonUtils"%>
<%@page import="com.runqianapp.show.utils.CommonQueryUtils"%>
<%@page import="com.runqianapp.common.util.Base64Util"%>
<%@ page import="com.runqian.mis2.access.UserInfo"%>
<%@page import="java.util.Enumeration"%>
<%@page import="com.runqianapp.schedule.utils.PathUtils"%>
<%@ page import="com.runqianapp.security.entry.sec.Security"%>
<%@page import="com.runqianapp.show.utils.PerformanceTestUtil"%>
<%@page import="com.runqianapp.showReport.utils.ShowReportCacheUtils"%>
<%@page import="com.runqianapp.showReport.domain.ShowReport"%>
<%@page import="com.runqianapp.showReport.utils.ShowReportUtils"%>
<%@page import="com.runqianapp.show.domain.ReportConfigManager"%>
<%@ page import="com.runqianapp.show.utils.ParamUtils"%>
<%@ page import="org.jdom.Document"%>
<%@ taglib uri="/WEB-INF/tld/gez.tld" prefix="gez"%>
<%
	response.setHeader("Pragma","No-Cache");
	response.setHeader("Cache-Control","No-Cache");
	response.setDateHeader("Expires", 0);

	String relativeJspUrlPrefix= PathUtils.getRelativeJspUrl(request,"/");
	String relativeUrlPrefix= PathUtils.getRelativeUrl(request,"");
	String absoluteUrlPrefix= PathUtils.getAbsoluteUrl(request,"/");
	String absoluteJspUrlPrefix=PathUtils.getAbsoluteJspUrl(request,"");
	UserInfo ui = (UserInfo) session.getAttribute("sys_UserInfo");
	String conf_appType = ReadConfInfo.getPropery("conf_appType");
    String platType = "alone";
    if("1".equals(conf_appType)){
        platType = "plat";
    }
    
	String vrBeanName = request.getParameter("vr_bean");
	ShowReport sr = ShowReportCacheUtils.getShowReport(vrBeanName);
	String reportName = sr.getViewReport().getReportName();
	String showGraphOnly = sr.getViewReport().getFastPivot_showGraphOnly();
	String reportId = sr.getReportId();
	String isFromDataAnalysis = request.getParameter("isFromDataAnalysis");//是否来自数据分析
	String exportDAName="";//数据分析导出时的名称
	if("true".equals(isFromDataAnalysis)){
		exportDAName=Base64Util.Base64Decode(request.getParameter("dataAnalysisName"));  
	}
	String serverPath = sr.getViewReport().getServerPath();
	if("yes".equalsIgnoreCase(showGraphOnly)){
		// 如果是只查看统计图，则跳转到统计图查看页面：
		request.getRequestDispatcher("ShowPivotReportGraph.jsp").forward(request, response);
		return;
	}
	
	String isFromDBD=request.getParameter("isFromDBD");//是否由DBD调用
	String path = request.getContextPath();
	//String reportId = request.getParameter("reportId");
	//String showGraphOnly = request.getParameter("showGraphOnly");
	String fromDBD=request.getParameter("from");
	if("alone".equals(platType) && ("dbd".equals(fromDBD)||"true".equals(isFromDBD))){
		reportId = Base64Util.Base64Decode(reportId);
	}
	if(reportId==null||"".equals(reportId)){
		reportId=sr.getBeanName();
	}
	String userId = request.getParameter("userId");
	session.setAttribute("userId", userId);
	
	
	
	String filePath = request.getParameter("filePath");
	if(filePath == null || "".equals(filePath.trim())){
		filePath = ShowConfig.getConfigValue("pivotReportDir");
	}
	String toolbarLocation = request.getParameter("toolbarLocation");
	String paramStr = "&vr_bean="+vrBeanName+sr.getViewReport().getParams().toString();
	if(paramStr.contains("'")) paramStr=paramStr.replaceAll("'", "\\\\'");
	String qryStr=request.getParameter("commonQueryJson");
  String basePath = PathUtils.getAbsoluteJspUrl(request,"/vrsr/show/");
  //订阅按钮加调用模式，生成安全校验信息
  String secInfo = Security.generate(request, null);
  String hiddenReportAfterShow = request.getParameter("hiddenReportAfterShow");	
  String schema=sr.getViewReport().getSchema();
  String reportDefineId=ParamUtils.getParameter(request, "reportDefineId", true);
	if(reportDefineId==null||"".equals(reportDefineId)){//
		//String reportId = ParamUtils.getParameter(request, "resID", true);
		String reportPath = ParamUtils.getParameter(request, "pivotReportDir", true);
		//String serverPath = ParamUtils.getParameter(request, "serverPath", true);
		Document doc = ShowReportUtils.getFastPivotDocument(reportId,reportPath,serverPath);
		reportDefineId=ReportConfigManager.getInstance().cacheReportConfig(doc);
	}
	
	String layout = request.getParameter("layout");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>展现交叉报表<%=reportId%></title>
<!-- 		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" > -->
		<base href="<%=basePath%>"></base>
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/style/s1/customStyle/customStyle.css") %>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery/jqueryui/jqueryuicss/jqueryui.css") %>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/popupDiv/css/jquery.popup.css") %>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/custom/vrsr/vr_ui.css") %>">
		<style type="text/css">
			html {
				width: 100%; 
				height: 100%;
			}
			body {
				width: 100%; 
				height: 100%;
			}
		</style>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery/jquery.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery/jqueryui/jqueryuijs/jqueryui.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/recordUtils.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/popupDiv/showDialog.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/js/jquery_dotimeout.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/js/PivotReportViewer.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/Base64.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/loadingTips/js/loadingtip.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/PathUtils.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/security/js/ModuleEntry.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/js/resizeGraph.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/js/vr_linkForm.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/custom/vrsr/vr_ui.js")%>"></script>
		<script language="javascript" charset="UTF-8" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/json2.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/AjaxUtil.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/js/jquery.nicescroll.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/reportcenter/saveAndLoad/js/saveAndLoadDialog.js")%>"></script>
		
		<script type="text/javascript">
			var userId = "<%=userId%>";
			var operationModule = "SRFP";
			var otherId = "";
			var relativeJspUrlPrefix= "<%=relativeJspUrlPrefix%>";
			var relativeUrlPrefix= "<%=relativeUrlPrefix%>";
			var absoluteUrlPrefix= "<%=absoluteUrlPrefix%>";
			var absoluteJspUrlPrefix= "<%=absoluteJspUrlPrefix%>";
			var base64 = new Base64();
			var qryStr= '';
			var isFromDBD="<%=isFromDBD%>";
			var viewer =null;
			var reportID = '<%=reportId%>';
			var reportName = '<%=reportName%>';
			var exportDAName='<%=exportDAName%>';
			var isFromDataAnalysis='<%=isFromDataAnalysis%>';
			var filePath = '<%=filePath%>';
			var autoDisplay = <%=sr.getQueryForm().getAutoDisplay() %>;
			var serverPath = '<%=serverPath%>';
			var schema = '<%=schema%>';
			var reportDefineId = '<%=reportDefineId%>';
			<%if(qryStr!=null&&!"".equals(qryStr)){
				%>
				//qryStr=eval("("+base64.decode("<%=qryStr%>")+")");
				qryStr=base64.decode("<%=qryStr%>");
				<%
			}%>
			
			$(function(){

				var operationMessage = "展现交叉报表'"+reportName+"'";
				var operationJson = "{\"resId\":\""+reportID+"\"}";
				var operationTag = "报表#展现";	
				recordUtils(operationModule,operationMessage,otherId,userId,operationJson,operationTag);
				if("<%=sr.getQueryForm().isHasCommQry() %>" == 'true'){
					//query(qryStr);
				}else{
					viewer= new PivotReportViewer("<%=path%>", "<%=reportId%>", "<%=reportName%>", "<%=filePath%>", $("body"), 0, 20, '', '<%=paramStr%>',serverPath,"<%=reportDefineId%>", "<%=layout%>").init();
					viewer.setLayout();
				}

			});
			
			/** 设置报表显示区域高度 */
			function autoSetReportHeight(){
				if("<%=toolbarLocation%>" == "none"){
					//不显示工具条
					$('.fast_pivot_toolbar').hide();
				}
				
				var toolbarHeight = $('.fast_pivot_toolbar').height();
				if($('.fast_pivot_toolbar').is(':hidden'))
					toolbarHeight = 0;
				
				//快速查询面板：
				var fastSearchDivHeight = $('#fastSearchDiv').height();
				if(fastSearchDivHeight == undefined)
					fastSearchDivHeight = 0;
				//通用查询面板：
				var commQryDivHeight = $('#commQryDiv').height();
				if(commQryDivHeight == undefined)
					commQryDivHeight = 0;
				if($('#commQryDiv').is(':hidden'))
					commQryDivHeight = 0;
				//下拉箭头：
				var commonQryToggleHeight = $('#commonQryToggle').height();
				if(commonQryToggleHeight == undefined)
					commonQryToggleHeight = 0;
				
				var graphDivHeight= 0; // $("#graphDiv").height();
				$('#reportContent').height($('body').height() - commQryDivHeight - fastSearchDivHeight - toolbarHeight - commonQryToggleHeight-graphDivHeight);

				var headerHeight=$("#report_"+reportID+"_table_colHeader_div").height();
				if(!headerHeight){
					headerHeight=0;
				}
				$("#report_"+reportID+"_table_data_div").css("height", $('#reportContent').height()-headerHeight-5);
				if(schema=='design'){
					//隐藏其他按钮
					//showReport_click();
					hiddenButton();
				}
				viewer.setLayout();
				viewer.initPageCount();
				<%PerformanceTestUtil.logTotalInfo();%>;
			}
			function hiddenButton(){
				$("#subreport").css("display","none");
				$("#remoteExportOperators").css("display","none");
				$("#refresh").css("display","none");
				$("#graphDiv").css("display","none");
 			}
			/**执行通用查询的方法*/
			function doCommonQuery(queryJson, queryType) {
				window.parent.setFrameHeightAfterQry();
				if(typeof(queryJson) != "undefined" && "" != queryJson && "fastQuery" == queryType){
				  query(queryJson);
				}else{
				  parent.query2.submit2(false, function(json){
				    query(parent.query2.obj2str(json));
				  });
				}
				$("#reportContent").css("display","block");
		//});
			}
			function query(json){
				var operationMessage = "查询交叉报表'"+reportName+"'";
				var operationJson = "{\"resId\":\""+reportID+"\",\"query_params\":\""+json+"\"}";
				var operationTag = "报表#查询";	
				recordUtils(operationModule,operationMessage,otherId,userId,operationJson,operationTag);
				$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showPivotReportServlet?action=2"), cache:false, async:true, data:{"resID":"<%=Base64Util.Base64Encode(reportId)%>","serverPath":"<%=Base64Util.Base64Encode(serverPath)%>"}, dataType:"json", 
					success:function(data){
						viewer = new PivotReportViewer("<%=path%>", "<%=reportId%>","<%=reportName%>", "<%=filePath%>", $("body"), 0, 20, json, '',serverPath,reportDefineId).init();
					}
				});
			}

			function setDivSize(){
				if($("#reportContent").length <= 0){
					//元素不存在
					return;
				}
				autoSetReportHeight();
			}
			

			function pivot_success_status(){
				parent.vr_success_status();
			}
	window.onunload = function(){
		viewer.deleteReportCache();
	};
	window.onbeforeunload = function(){
		viewer.deleteReportCache();
	};
//订阅相关
function subscribeModuleEntry(resId){
	var operationMessage = "订阅交叉报表'"+reportName+"'";
	var operationJson = "{\"resId\":\""+reportID+"\"}";
	var operationTag = "报表#订阅";	
	recordUtils(operationModule,operationMessage,otherId,userId,operationJson,operationTag);
	//判断是通用查询还是自定义过滤
	if($('#showReport').attr("onclick")=="showReport()"){
		//confirm(base64.decode(commonQueryJson));
		//var url = "<%=PathUtils.getRelativeJspUrl(request,"/eds_subscribe/getParamFormPage.jsp") %>";
		//url = url+"?resID="+resId+"&type=commonQuery";
		//$("#commonQueryJson").attr("value",commonQueryJson);
		//window.open(url,"_blank");
		//document.getElementById("qryForm").action = url;
		//document.getElementById("qryForm").submit();
		var params = {resID : resId};
		new ModuleEntry("mfg_orderTaskSet", params, "<%=secInfo%>", "_blank").enter();
	}else if(typeof(window.parent.query2) != 'undefined'){
		var jsonFilter = parent.query2.submit2();//获取给报表使用通用查询串
		var conditions = parent.query2.getOutConditions();
		jsonFilter = replaceAll("\'","\\'",jsonFilter);
		jsonFilter = replaceAll("\"","'",jsonFilter);
		var subscribeQueryStr = base64.encode(jsonFilter + "~~,~~" + base64.encode(conditions));
		var params = {resID : resId,SRCommonQueryStr:subscribeQueryStr};
		new ModuleEntry("mfg_orderTaskSet", params, "<%=secInfo%>", "_blank").enter();
	}else{
		var subscribeQueryStr = "";
		var noQuery = "yes";
		var params = {resID : resId,SRCommonQueryStr:subscribeQueryStr,hasQuery:noQuery};
		new ModuleEntry("mfg_orderTaskSet", params, "<%=secInfo%>", "_blank").enter();
	}

	
}

function replaceAll(s1,s2,s3){
	return s3.replace(new RegExp(s1,"gm"),s2);   
}

	
			
		</script>
		
	</head>

	<body>

		<!-- 工具条： -->
		<jsp:include page="toolbar_pivot.jsp"></jsp:include>
		
		<div id="reportContent" style="border: solid 0px; overflow: hidden; width: 100%; text-align:center;<%if("yes".equals(hiddenReportAfterShow)) {%> display:none;<%} %>">
			<!-- 数据： -->
			<div id="tableDiv" style="border: solid 0px; overflow:hidden; width:100%; height:100%; text-align:left;"></div>
			
			<!-- 统计图： -->
			<div id="chartDiv" style="text-align:left;height:100%"></div>
		</div>
		
		<%
			String tmp = request.getParameter("cssFiles");
			if (tmp != null) {
				String[] cssFiles = tmp.split(";");
				for (int i = 0; i < cssFiles.length; i++) {
					if (cssFiles[i] != null && !"".equals(cssFiles[i])) {
					%>
					<link type="text/css"
						href="<%=PathUtils.getAbsoluteJspUrl(request,cssFiles[i]) %>"
						rel="stylesheet" ></link>
					<%
					}
				}
			}
			tmp = request.getParameter("jsFiles");
			if (tmp != null) { 
				String[] jsFiles = tmp.split(";");
				for (int i = 0; i < jsFiles.length; i++) {
					if (jsFiles[i] != null && !"".equals(jsFiles[i])) {
		%>
		<script type="text/javascript"
			src="<%=PathUtils.getAbsoluteUrl(request,jsFiles[i]) %>" charset="UTF-8"></script>
		<%
					}
				}
			}
		%>
	</body>

</html>
