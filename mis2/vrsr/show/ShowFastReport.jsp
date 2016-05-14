<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.runqian.mis2.util.ReadConfInfo"%>
<%@page import="org.json.JSONObject"%>
<%@ page import="com.runqianapp.show.config.ShowConfig"%>
<%@ page import="com.runqianapp.commonquery.utils.JSCommonQueryUtils"%>
<%@ page import="com.runqianapp.show.utils.CommonQueryUtils"%>
<%@ page import="com.runqianapp.show.utils.CommonUtils"%>
<%@ page import="com.runqianapp.common.util.Base64Util"%>
<%@ page import="com.runqian.mis2.access.UserInfo"%>
<%@ page import="java.util.Enumeration"%>
<%@ page import="com.runqianapp.utils.NGRPathUtils"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="com.runqian.mis2.util.DBAccess"%>
<%@ page import="com.runqian.mis2.sysmanage.resmanage.domain.ResInfo"%>
<%@ page import="com.runqian.mis2.sysmanage.resmanage.persistence.ResDao"%>
<%@ page import="org.jdom.Document"%>
<%@ page import="com.runqianapp.show.utils.ParamUtils"%>
<%@ page import="com.runqianapp.show.utils.XMLUtils"%>
<%@ page import="com.runqianapp.show.service.fast.ShowFastReportService"%>

<%@page import="com.runqianapp.schedule.utils.PathUtils"%>
<%@ page import="com.runqianapp.security.entry.sec.Security"%>
<%@page import="com.runqianapp.showReport.utils.PerformanceTestUtil"%>
<%@page import="com.runqianapp.showReport.utils.ShowReportCacheUtils"%>
<%@page import="com.runqianapp.showReport.domain.ShowReport"%>
<%@page import="com.runqianapp.showReport.utils.ShowReportUtils"%>
<%@page import="com.runqianapp.show.domain.ReportConfigManager"%>
<%
	response.setHeader("Pragma","No-Cache");
	response.setHeader("Cache-Control","No-Cache");
	response.setDateHeader("Expires", 0);

	String relativeJspUrlPrefix= PathUtils.getRelativeJspUrl(request,"/");
	String relativeUrlPrefix= PathUtils.getRelativeUrl(request,"");
	String absoluteUrlPrefix= PathUtils.getAbsoluteUrl(request,"/");
	String absoluteJspUrlPrefix=PathUtils.getAbsoluteJspUrl(request,"");
	
	String contextPath = request.getContextPath();
	String secPath = NGRPathUtils.getSWFPath();
	String vrBeanName = request.getParameter("vr_bean");
	ShowReport sr = ShowReportCacheUtils.getShowReport(vrBeanName);
	String reportName = sr.getViewReport().getReportName();
	
	//String showGraphOnly = request.getParameter("showGraphOnly");
	String showGraphOnly = sr.getViewReport().getFastPivot_showGraphOnly();
	
	if("yes".equalsIgnoreCase(showGraphOnly)){
		// 如果是只查看统计图，则跳转到统计图查看页面：
		request.getRequestDispatcher("ShowFastReportGraph.jsp").forward(request, response);
		return;
	}
	UserInfo ui = (UserInfo) session.getAttribute("sys_UserInfo");
	String userId = ui.getUserId();
	String conf_appType = ReadConfInfo.getPropery("conf_appType");
    String platType = "alone";
    if("1".equals(conf_appType)){
        platType = "plat";
    }
	String isFromDBD=request.getParameter("isFromDBD");//是否由DBD调用
	String path = request.getContextPath();
	//String reportId = request.getParameter("reportId");
	String reportId = sr.getReportId();
	String isFromDataAnalysis = request.getParameter("isFromDataAnalysis");//是否来自数据分析
	String exportDAName="";//数据分析导出时的名称
	if("true".equals(isFromDataAnalysis)){
		exportDAName=Base64Util.Base64Decode(request.getParameter("dataAnalysisName")); 
	}
	//String perPageCount = request.getParameter("pageCount");
	String perPageCount = sr.getViewReport().getFastPivot_pageCount();
	String frConfig = sr.getViewReport().getFastPivot_frConfig();
	//String exportPageCount = request.getParameter("exportPageCount");
	String exportPageCount = sr.getViewReport().getFastPivot_exportPageCount();
	//String reportType = request.getParameter("reportType");
	String reportType = sr.getReportType()+"";
	String fromDBD=request.getParameter("from");
	if(perPageCount==null||"".equals(perPageCount)){
		perPageCount="20";
	}
	if(exportPageCount==null||"".equals(exportPageCount)){
		exportPageCount="5000";
	}
	if("alone".equals(platType) && ("dbd".equals(fromDBD)||"true".equals(isFromDBD))){
		reportId = Base64Util.Base64Decode(reportId);
	}
	if(!"alone".equals(platType)&&reportType==null){
		DBAccess dba=null;
		try{
			dba = new DBAccess();
		    ResDao resDao = new ResDao();
			ResInfo resInfo = resDao.getResInfoVO(reportId + "", dba);
			reportType=resInfo.getResType()+"";
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			if(dba!=null) dba.close();
		}
	}
	String filePath = request.getParameter("filePath");
	if(filePath == null || "".equals(filePath.trim())){
		filePath = ShowConfig.getConfigValue("fastReportDir");
	}
	
	//String toolbarLocation = request.getParameter("toolbarLocation");
	String toolbarLocation = sr.getViewReport().getFastPivot_toolbarLocation();
	
	//获得页面参数串：
	String paramStr = "&vr_bean="+vrBeanName+sr.getViewReport().getParams().toString();
//	Enumeration enu = request.getParameterNames();
//	while(enu.hasMoreElements()){
//		String name = (String) enu.nextElement();
//		if(name.equals("reportId") || name.equals("t_i_m_e") || name.equals("userId") || name.equals("filePath") || name.equals("resID")|| name.equals("frConfig")|| name.equals("from")|| name.equals("contextPath"))
//			continue;
//		String value = request.getParameter(name);
//		paramStr += "&" + name + "=" + value;
//	}
	String urlParams="";
	if(paramStr.length()>0){
		if(paramStr.contains("'")) paramStr=paramStr.replaceAll("'", "\\\\'");
		urlParams=paramStr.substring(1);
	}
	if(reportId==null||"".equals(reportId)){
		reportId=sr.getBeanName();
	}
	//获得通用查询JSON内容：
	//String fileName = CommonUtils.getAbsolutePath(request, filePath) + "/" + reportId + ".xml";
	//TODO getcommQry
	String commQry = sr.getQueryForm().getCommQry();
	String basePath = PathUtils.getAbsoluteJspUrl(request,"/vrsr/show/");
	
	//String params = request.getParameter("params"); // 参数JSON串，要赋值给通用查询
	String params = sr.getViewReport().getFastPivot_params();
	//String COMMON_QUERY_BUTTON_USE_DEFAULT = request.getParameter("COMMON_QUERY_BUTTON_USE_DEFAULT"); // 通用查询是否使用默认按钮
	String COMMON_QUERY_BUTTON_USE_DEFAULT = "false"; // 分组报表用“展现”按钮替换查询按钮
	JSONObject json = null;
	if(params != null && params.length() > 0){
		try{
			params = Base64Util.Base64Decode(params);
			json = new JSONObject(params);
		}catch(Exception e){
			json = new JSONObject();
			e.printStackTrace();
		}
	}else{
		json = new JSONObject();
	}
	//json.put("COMMON_QUERY_BUTTON_USE_DEFAULT", COMMON_QUERY_BUTTON_USE_DEFAULT);
	params = Base64Util.Base64Encode(json.toString());
	//String qryStr=request.getParameter("commonQueryJson");
	String qryStr= sr.getViewReport().getFastPivot_commonQueryJson();
	// 隐藏通用查询面板参数：
	String COMMON_QUERY_PANEL_SHOW = request.getParameter("COMMON_QUERY_PANEL_SHOW");
	//订阅按钮加调用模式，生成安全校验信息
	String secInfo = Security.generate(request, null);
  	String schema=sr.getViewReport().getSchema();
	String serverPath = sr.getViewReport().getServerPath();
	String reportDefineId=request.getParameter("reportDefineId");
	if(reportDefineId==null||"".equals(reportDefineId)){//
		//String reportId = ParamUtils.getParameter(request, "resID", true);
		String reportPath = ParamUtils.getParameter(request, "fastReportDir", true);
		//String serverPath = ParamUtils.getParameter(request, "serverPath", true);
		Document doc = ShowReportUtils.getFastPivotDocument(reportId,reportPath,serverPath);
		reportDefineId=ReportConfigManager.getInstance().cacheReportConfig(doc);
	}
	
	// 统计图布局方式：
	String layout = request.getParameter("layout");
	
	
	JSONObject requestJSON=new JSONObject();
    Enumeration reqParamNames = request.getParameterNames();  
    while (reqParamNames.hasMoreElements()) {  
		String paramName = (String) reqParamNames.nextElement();  
		String[] paramValues = request.getParameterValues(paramName);  
		if (paramValues.length == 1) {  
			String paramValue = paramValues[0];  
			if (paramValue.length() != 0) {  
				try{
					requestJSON.put(paramName, paramValue);  
				}catch(Exception e){
					
				}
			}  
		}  
    }  
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>展现分组报表<%=reportId %></title>
<!-- 		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" > -->
		<base href="<%=basePath%>"></base>
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/custom/vrsr/vr_ui.css") %>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/style/s1/customStyle/customStyle.css") %>">
		
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/css/reportContent.css") %>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/customer/addFastBtn.css") %>">
		
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/css/jquery-ui-1.8.4.custom.css") %>">
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
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/recordUtils.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/js/FastReportViewer.js")%>"></script>
		
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/Base64.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/js/CacheData.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/js/resizeGraph.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/customer/resizeTable.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/customer/addFastBtn.js")%>"></script>

		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/loadingTips/js/loadingtip.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/AjaxUtil.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/popupDiv/showDialog.js") %>" ></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/swfobject.js") %>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/PathUtils.js") %>"></script>
		
		<script src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery-toolbar/js/rqtoolbar.js") %>" type="text/javascript" ></script> 
<%-- 		<link href="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/tabs/css/themes/base/jquery.ui.all.css")%>" rel="stylesheet" type="text/css"> --%>

		<script language="javascript" charset="UTF-8" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery/jqueryui/jqueryuijs/jqueryui.js")%>"></script>
		<script language="javascript" charset="UTF-8" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/form/js/jquery.ui.core.js")%>"></script>
		<script language="javascript" charset="UTF-8" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery-toolbar/ui/jquery.ui.widget.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/security/js/ModuleEntry.js") %>"></script>	
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery/jqueryui/jqueryuicss/jqueryui.css")%>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery-toolbar/css/jquery.toolbar.css")%>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery-toolbar/css/jquery.ui.theme.css")%>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/formstyle/css/form.css")%>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/popupDiv/css/jquery.popup.css") %>" />		
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/commonQuery/jsCommonQuery/configCss/queryPanel.css")%>">
		<link rel="stylesheet" type="text/css" href="<%=PathUtils.getRelativeJspUrl(request,"/style/s1/customStyle/customStyle.css") %>">
		
		 <style>
			.ui-resizable-helper { border: 2px dotted #00F; }
		</style>
		
		<script language="javascript" charset="UTF-8" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/json2.js")%>"></script>
		<script language="javascript" charset="UTF-8" src="<%=PathUtils.getRelativeJspUrl(request,"/reportcenter/saveAndLoad/js/saveAndLoadDialog.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/js/vr_linkForm.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/custom/vrsr/vr_ui.js")%>"></script>
			
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/js/jquery.nicescroll.js")%>"></script>
		
		
		<script type="text/javascript">
			var userId = "<%=userId%>";
			var operationModule = "SRFP";
			var otherId = "";
			var relativeJspUrlPrefix= "<%=relativeJspUrlPrefix%>";
			var relativeUrlPrefix= "<%=relativeUrlPrefix%>";
			var absoluteUrlPrefix= "<%=absoluteUrlPrefix%>";
			var absoluteJspUrlPrefix= "<%=absoluteJspUrlPrefix%>";
			var flag=false;
			var isFromDBD="<%=isFromDBD%>";
			var contextPath = '<%=contextPath%>';
			var reportID = '<%=reportId%>';
			var reportName = '<%=reportName%>';
			var exportDAName='<%=exportDAName%>';
			var isFromDataAnalysis='<%=isFromDataAnalysis%>';
			var filePath = '<%=filePath%>';
			var urlParams = '<%=urlParams%>';
			var base64 = new Base64();
			var notShowReport = true;//是否未展现报表，用于判断是否展现导出分页等工具条按钮
			var qryStr='';
			var version = $.browser.version;
			var schema = '<%=schema%>';
			var serverPath = '<%=serverPath%>';
			var autoDisplay = <%=sr.getQueryForm().getAutoDisplay() %>;
			var useQuickButton = true;
			var frConfig = '<%=frConfig%>';
			var reportDefineId = '<%=reportDefineId%>';
			
			var reqJSONStr='<%=requestJSON.toString()%>';
			var requestJSON=JSON.parse(reqJSONStr);
			<%if(qryStr!=null&&!"".equals(qryStr)){
				%>
				//qryStr=eval("("+base64.decode("<%=qryStr%>")+")");
				qryStr=base64.decode("<%=qryStr%>");
				<%
			}%>
			
			/** 展现报表 */
			function showReport(){
				try{
					if(parent.document.getElementById("TestJS2")){
						getCommonQueryJson();
						return false;
					}
				}catch(e){}
				//显示数据区
				//if("<%=toolbarLocation%>" == "none"||autoDisplay == 0||(autoDisplay == 2&& <%=sr.getQueryForm().isHasCommQry() %>)){ //增加对主题分析的展现控制
					viewer.pageChangedHandler();
				//}
			}
			var showReportFirst=false;
			// 获得数据：
			var viewer;
			<%if("10011".equals(reportType)){ %>
			//showReportFirst=true;
			useQuickButton=false;
			<%}%> 
			// 设置reportContent高度：
			$(window).load(function() {
				viewer = new FastReportViewer("<%=path%>", "<%=reportId%>", "<%=reportName%>", "<%=filePath%>", $("body"), 0, <%=perPageCount%>, <%=exportPageCount%>, '', '<%=paramStr%>', '',serverPath,frConfig,"<%=reportType%>",reportDefineId, "<%=layout%>").init();
				if("<%=COMMON_QUERY_PANEL_SHOW%>" == "false" && !$('#commQryDiv').is(':hidden')){
					hideCommonQueryPanel();
				}
				//if((autoDisplay == 0&&!<%=sr.getQueryForm().isHasCommQry() %>)||(autoDisplay == 2&& <%=sr.getQueryForm().isHasCommQry() %>)){
					showReport_click();
				//}
				parent.setFrameHeight("top");
				autoSetReportHeight();
			});
			
			/** 设置报表显示区域高度 */
			function autoSetReportHeight(){
				
				if("<%=toolbarLocation%>" == "none"){
					//不显示工具条
					$('.fast_pivot_toolbar').hide();
					if(isFromDBD=='true'){
						$("#report_<%=reportId%>_table_title_div").css("display","none");
						$("#report_<%=reportId%>_table_foot_div").css("display","none");
					}
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
				/*if($.browser.msie&&parseInt(version)<10){
					$('#reportContent').height($('body').height() - commQryDivHeight - fastSearchDivHeight - toolbarHeight - commonQryToggleHeight-15); // 
				}else{*/
					$('#reportContent').height($('body').height() - commQryDivHeight - fastSearchDivHeight - toolbarHeight - commonQryToggleHeight);
				/*}*/

				var table_title_div_height=0
				if(!$("#report_"+reportID+"_table_title_div").is(':hidden')){
					table_title_div_height=$("#report_"+reportID+"_table_title_div").height();
				}
				var table_foot_div_height=0;
				if(!$("#report_"+reportID+"_table_foot_div").is(':hidden')){
					table_foot_div_height=$("#report_"+reportID+"_table_foot_div").height();
				}
				//设置DIV大小：
				var height = 0;
				if($('#tableDiv').attr('clientHeight')){
					height = $('#tableDiv').attr('clientHeight') - $('#report_' + reportID + '_table_colHeader_div').height() - 
						table_title_div_height- table_foot_div_height;
				}else{
					height = $('#tableDiv').height() - $('#report_' + reportID + '_table_colHeader_div').height() - 
						table_foot_div_height - table_foot_div_height;
				}
				if(BrowserType()!="Firefox"){
					$('#report_'+reportID+'_table_data_div').width($('#report_' + reportID + '_table_colHeader_div').width());
					$('#report_'+reportID+'_table_data_div').height(height);
				}
				$('#report_'+reportID+'_table_rowHeader_div').height(height);
				if(schema=='design'){
					//隐藏其他按钮
					//showReport_click();
					hiddenButton();
				}
				
				viewer.setLayout();
			}
			
			function hiddenButton(){
				$("#commonOperators").css("display","none");
				$("#showCol").css("display","none");
				$("#subreport").css("display","none");
				$("#remoteExportOperators").css("display","none");
				$("#refresh").css("display","none");
				$("#graphDiv").css("display","none");
				
 			}
			
			function setDivSize(){
				if($("#reportContent").length <= 0){
					//元素不存在
					return;
				}
				$("#reportContent").css("width", "100%");
				if($.browser.msie&&parseInt(version)<10){
					$("#reportContent").css("height", $("body").height()-15);
				}else{
					$("#reportContent").css("height", $("body").height());
				}
				$("#reportContent").width(document.body.clientWidth);
				//autoSetReportHeight();
			}
		</script>
		<style>
			a:link { color: #CC3399; text-decoration: underline;}  //覆盖style.css中的超链接样式
		</style>
		
	</head>

	<body>
		<%if(!"true".equals(isFromDBD)){ %>
			<!-- 工具条： -->
			<%if("10011".equals(reportType)){ %>
			<jsp:include page="toolbar_zhuti.jsp"></jsp:include>
			<%}else{%>
			<jsp:include page="toolbar.jsp"></jsp:include>
			<%} %>
		<%} %>
		<div id="reportContent">
			<!-- 数据： -->
			<div id="tableDiv" style="text-align:left;height:100%"></div>
			
			<!-- 统计图： -->
			<div id="chartDiv" style="text-align:left;height:100%"></div>
		</div>
		
		<div id="container" style="position: absolute;top: 55px;left: 165px;z-Index:2;">
			<div id="flashContent" style='width:0px;height:0px;'>
			</div>
			<div id="commQrySet2" style='width:0px;height:0px;'>
			</div>
		</div>
		
		<script type="text/javascript">
	
		function loadSWF(){
			if(isFromDBD=='true'){
				return;
			}
		    //载入SWF
			var swfVersionStr = "10";
			var xiSwfUrlStr = "<%=PathUtils.getAbsoluteJspUrl(request,"playerProductInstall.swf")%>";
			var flashvars = {server:"<%=absoluteJspUrlPrefix%>",fileType:"2",dicId:"10000"
						,resName:"YWJjZA,,",FastRID:"<%=reportId%>",reportDefineId:"<%=reportDefineId%>",mainDatasetType:"sql"
						,usemodel:"integrat",flag:"2",reportPath:"<%=PathUtils.getAbsoluteJspUrl(request,"reportcenter/res/fastReport/jsbb/reportFiles/")%>"
						,swfPath:"<%=NGRPathUtils.getSWFPath().substring(1)%>"
						,absoluteUrlPrefix:"<%=absoluteUrlPrefix%>",relativeUrlPrefix:"<%=relativeUrlPrefix%>"
						,absoluteJspUrlPrefix:"<%=absoluteJspUrlPrefix%>",relativeJspUrlPrefix:"<%=relativeJspUrlPrefix%>"};
			var params = {};
			params.quality = "high";
			params.bgcolor = "#ffffff";
			params.allowscriptaccess = "sameDomain";
			params.allowfullscreen = "true";
			params.units = "pixels";
			params.loop = "false";
			params.wmode = "window";
			//params.wmode = "Opaque";
			var attributes = {};
			attributes.id = "TestJS";
			attributes.name = "flex";
			attributes.align = "middle";
//			var swfWidth = document.body.clientWidth;
//			var swfHeight = document.body.clientHeight;
			// 旧版FastReportPanel  新版产品UI： FastReportProFlex  新版中体彩UI： FastReportZtcFlex
			swfobject.embedSWF( "<%=absoluteJspUrlPrefix%>vrsr/show/FastReportViewFlex.swf", "flashContent","0","0", swfVersionStr, xiSwfUrlStr,flashvars, params, attributes);
			swfobject.createCSS("#flashContent", "display:block;");
		}
		
		//展现页面通用查询swf加载
		function loadCommonSWF(){
			if(isFromDBD=='true'){//DBD不加载该SWF
				return;
			}
		    //载入SWF
			var swfVersionStr = "10";
			var xiSwfUrlStr = "<%=PathUtils.getAbsoluteJspUrl(request,"playerProductInstall.swf")%>";
			var flashvars = {server:"<%=absoluteUrlPrefix%>",swfPath:"<%=NGRPathUtils.getSWFPath().substring(1)%>",user:"TestJS2"
							,absoluteUrlPrefix:"<%=absoluteUrlPrefix%>",relativeUrlPrefix:"<%=relativeUrlPrefix%>"
							,absoluteJspUrlPrefix:"<%=absoluteJspUrlPrefix%>",relativeJspUrlPrefix:"<%=relativeJspUrlPrefix%>",reportDefineId:"<%=reportDefineId%>"};
			var params = {};
			params.quality = "high";
			params.bgcolor = "#ffffff";
			params.allowscriptaccess = "sameDomain";
			params.allowfullscreen = "true";
			params.units = "pixels";
			params.loop = "false";
			params.wmode = "Opaque";
			//params.wmode = "Opaque";
			var attributes = {};
			attributes.id = "TestJS2";
			attributes.name = "flex";
			attributes.align = "middle";
			try{
					parent.swfobject.embedSWF( "<%=absoluteJspUrlPrefix%>vrsr/show/ShowPageFilter.swf", "commQrySet2","100%","100%", swfVersionStr, xiSwfUrlStr,flashvars, params, attributes);
					parent.swfobject.createCSS("#commQrySet2", "display:block;");
			}catch(e){
				alert("加载通用查询设计页面出错");
			}
		}


		<%if(!"10011".equals(reportType)){ %>
		loadSWF();
		loadCommonSWF();
		<%}%>
		/** 通用查询Json */
		var commonQueryJson="";
		try{
			commonQueryJson='<%=commQry.replace("'","\"")%>';
		}catch(e){
		}

	// 查询按钮事件：
	$('#showReport').click(function(){
		showReport_click();
	});

	/**请求初始化数据*/
	function initJson(){
		var fc = parent.document.getElementById("TestJS2");
		fc.sendCommonJson(base64.encode(base64.decode(commonQueryJson)+"-_-"+"1"));//初始化json数据  -_-后面的0 or 1含义   0是初始化数据是xml数据表格式 1是通用查询json格式 （非0/1(比如2)时为隐藏模式-调用假数据提供试操作）
		
	}
	/**执行通用查询的方法*/
	function query(json) {
		var operationMessage = "查询分组报表'"+"<%=reportName%>"+"'";
		var operationJson = "{\"resId\":\""+"<%=reportId%>"+"\",\"query_params\":\""+json+"\"}";
		var operationTag = "报表#查询";	
		recordUtils(this.operationModule,operationMessage,this.otherId,this.userId,operationJson,operationTag);
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=34"), cache:false, async:true, data:{"resID":"<%=Base64Util.Base64Encode(reportId)%>","reportDefineId":"<%=Base64Util.Base64Encode(reportDefineId)%>","serverPath":"<%=Base64Util.Base64Encode(serverPath)%>","query":base64.encode(json)}, dataType:"json", 
			success:function(data){
					//refreshData = "no";
				viewer.pageChangedHandler("query");//请求数据
				try{
					parent.vr_success_status();
				}catch(e){
				}
			}
		});
		
	}
	
	function showReport_click(queryJson, queryType){
		var operationMessage = "展现分组报表'"+"<%=reportName%>"+"'";
		var operationJson = "{\"resId\":\""+"<%=reportId%>"+"\"}";
		var operationTag = "报表#展现";	
		recordUtils(this.operationModule,operationMessage,this.otherId,this.userId,operationJson,operationTag);
		if (typeof validate != 'undefined' && validate instanceof Function) {  
			var flag = validate();
			if(flag == 'false'){
				  return false;
			}
		}
		viewer.initReportConfig();
		//显示导出和分页按钮
		viewer.currPage = 0;//每次展现时，展现页从第一页开始
		refreshData="no";
		if(notShowReport){//初始化工具条，显示导出、分页等按钮
			$("#exportOperators").css("display","");
			$("#remoteExportOperators").css("display","");
			$("#pageOperators").css("display","");
			viewer.initToolbar();
			notShowReport=false;
		}
		if($('#showReport').attr("onclickfunction")=="showReport()"){
				showReport();
		}else{
			try{
			  if(typeof(queryJson) != "undefined" && "" != queryJson){
			    query(queryJson);
			    return false;
			  }
				if(parent.query2&&qryStr==''){
					parent.query2.submit2(false, function(json){
						json=parent.query2.obj2str(json);
						query(json);
					},"btnClick", false);
					return false;
				}else if(qryStr!=''){
					query(qryStr);
					return false;
				}else{
					viewer.pageChangedHandler();
				}
			}catch(e){
				viewer.pageChangedHandler();
			}
		}
	}
/**执行通用查询的方法*/
	function doCommonQuery(json,queryType) {
		if(!json || json == null)
			return;
		showReport_click(json,queryType);
	}

/**
*测试-获得通用查询数据
*/
function showCommonSet(){

	//显示通用查询的div
	$("#panel", window.parent.document).css("display","none");
	//$("#commonQryToggle").show();
	//将展现报表onclick方法设为showReport()
	$("#showReport").attr("onclickfunction","showReport()");
	//隐藏自定义过滤按钮显示普通查询按钮
	$("#filterSet1").css("display","");
	$("#filterSet2").css("display","none");
	$("#commQryDiv2", window.parent.document).css("display","block");
	//$("#commQryDiv2").css("height","20%");
	var fc = parent.document.getElementById("TestJS2");
	$(fc,window.parent.document).attr("height","140px");
	$("#commQryDiv2",window.parent.document).css("height","140px");
	$("#headerBottom",window.parent.document).css("display","block");

}

function rebackJson(json){
	if(json!=null)
		commonQueryJson = json;//flex中已base64加密处理
		
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl ("/showFastReportServlet?action=27"), async:true, cache:false, data:{"resID":base64.encode(reportID),"reportDefineId":base64.encode("<%=reportDefineId%>"),"jsonStr":commonQueryJson}, dataType:"json", 
				success:function (data) {
					//refreshData = "no";
					viewer.pageChangedHandler();
					
				}, error:function () {
					confirm("保存通用查询失败！");
				}
		});
}

/**返回获得的通用查询数据*/
function getCommonQueryJson(){
	var fc = parent.document.getElementById("TestJS2");
	fc.getCommonJson();
}
/**  隐藏普通查询按钮显示自定义过滤按钮  */
function hiddenQuery(){
	//隐藏通用查询div
	if(parent.document.getElementById("panel") == null){
		$("#headerBottom",window.parent.document).hide();
	}else{
		$("#panel", window.parent.document).css("display","block");
	}
	$("#filterSet1").css("display","none");
	$("#filterSet2").css("display","");
	$("#commQryDiv2",window.parent.document).css("display","none");
	$("#showReport").removeAttr("onclickfunction");
}

//订阅相关
function subscribeModuleEntry(resId){
	var operationMessage = "订阅分组报表'"+"<%=reportName%>"+"'";
	var operationJson = "{\"resId\":\""+"<%=reportId%>"+"\"}";
	var operationTag = "报表#订阅";	
	recordUtils(this.operationModule,operationMessage,this.otherId,this.userId,operationJson,operationTag);
	//判断是通用查询还是自定义过滤
	if($('#showReport').attr("onclickfunction")=="showReport()"){
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

	window.onunload = function(){
		viewer.deleteReportCache();
	};
	window.onbeforeunload = function(){
		viewer.deleteReportCache();
	};
	
	</script>
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

