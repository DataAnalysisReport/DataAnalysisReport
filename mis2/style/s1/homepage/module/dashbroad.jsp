<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="com.runqian.mis2.util.SemanticsReportGenerator"%>
<%@ page import="com.runqian.report4.cache.CacheManager"%>
<%@page import="com.runqianapp.schedule.utils.PathUtils"%>
<%@ taglib uri="/WEB-INF/runqianReport4.tld" prefix="report" %>

<%
	request.setCharacterEncoding("GBK");
	String graphID = request.getParameter("graphID");
	//String Params = ReportUtils.getReportParamValue(request,"categoryExp");
	String category = request.getParameter("categoryExp");
	String seryName = request.getParameter("seryNameExp");
	String seryValue = request.getParameter("seryValueExp");
	String templateFile = PathUtils.getAppPhyPath()+"/mis2/homepage/module/linechart.raq";
	String totalParam = category + "&" + seryName +"&" + seryValue;
	session.setAttribute("totalParam",totalParam);
	//String totalParam2 = saveTotalParam(totalParam);
	Exception exp = null;
	try{
		SemanticsReportGenerator srg = new SemanticsReportGenerator(templateFile,category,seryName,seryValue);
		srg.generate();
		String savePath = PathUtils.getAppPhyPath()+"/mis2/homepage/module/linechart_result.raq";
		srg.saveToFile(savePath);
		
		request.setAttribute("report_define",srg.getReportDefine());
		CacheManager cm = CacheManager.getInstance();
		cm.deleteReportEntry("report_define");
		
	}
	catch(Exception e){
		exp = e;
	}
%>
<html>
<head><title>Dashbraod</title></head>
<script type="text/javascript">
function seeDashBoard(){
	var url = "seeDashBoard.jsp?graphId=<%=graphID%>";
	window.open(url,"_blank");
}
function saveDashBoard(){
	var url = "saveDashBoard.jsp";
	window.open(url,"_blank");
}
</script>
<body><center>
<%if(exp==null){%>
<report:html name="report1"
	srcType="defineBean"
	beanName="report_define"
/>
<%if(graphID == null){ %>

<input type="Button" value="保存" onclick="saveDashBoard()">

<%} else{%>
<input type="Button" value="查看参数" onclick="seeDashBoard()">
<%}} else {%>
	<div style="color: #ff0000; font-size: 14px">错误：<%=exp.getMessage()%></div>
<%}%>
</center></body>
</html>