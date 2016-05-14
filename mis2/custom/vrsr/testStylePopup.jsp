<%@ page language="java" contentType="text/html; charset=gbk"
	errorPage="../error.jsp"%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"    
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">     
<%@page import="com.runqianapp.utils.NGRPathUtils"%>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.runqian.report4.usermodel.Context"%>
<%@page import="com.runqianapp.schedule.utils.PathUtils"%>
<%@ page import="com.runqianapp.license.LicenseUtils"%>
<% 
	String path1 = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path1+"/";
%>
<html>
<head>
<base href="<%=basePath%>"></base>
<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery/jquery.js") %>"></script>

 <script type="text/javascript">
	function showStyleFrame(){
		var resId=$("#resid").val();
		var url=showStyleSampleReport(resId);
		$("#test").attr("src",url);
	}
	//展现样表
	function showStyleSampleReport(currentReportId){
		var viewReportListener="com.runqianapp.view.listener.StyleSetListener";
		var jsFiles="mis2/custom/vrsr/js/setStylePopup.js";
		var showPageCallBack="regeditStyleCallback";
		var toolbarLocation="none";
		var url=$.contextPath+"/mis2/vrsr/showReport1.jsp?resID="+currentReportId+"&viewReportListener="+viewReportListener+"&jsFiles="+jsFiles+"&showPageCallBack="+showPageCallBack+"&toolbarLocation="+toolbarLocation;
		return url;
	}
 </script>
</head>
<body>
	资源ID:<input type="text" id="resid"/> <input type="button" value="展现" onclick="showStyleFrame()"/>
	<iframe id="test" width="100%" height="100%">
		
	</iframe>
</body>
</html>
