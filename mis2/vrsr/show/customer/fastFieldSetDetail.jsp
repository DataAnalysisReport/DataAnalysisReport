<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.runqianapp.schedule.utils.FormUtil"%>
<%@page import="com.runqianapp.schedule.utils.RequestUtil"%>
<%@page import="com.runqianapp.schedule.utils.PathUtils"%>
<%@page import="com.runqianapp.common.util.Base64Util"%>
<%@page import="com.runqianapp.common.log.GEZLoggerManager"%>
<%@ taglib uri="/WEB-INF/tld/gez.tld" prefix="gez"%>

<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String absoluteUrlPrefix = PathUtils.getAbsoluteUrl(request,"/");
    String absoluteJspUrlPrefix=PathUtils.getAbsoluteJspUrl(request,"");
	String relativeJspUrlPrefix = PathUtils.getRelativeJspUrl(request,"/");
	String relativeUrlPrefix = PathUtils.getRelativeUrl(request,"");
	String fieldName = request.getParameter("fieldName");
	String reportDefineId = request.getParameter("reportDefineId");
	String resID = request.getParameter("resID");
	String fieldInfo = Base64Util.Base64Decode(request.getParameter("fieldInfo"));
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0  Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
   <head>
       <base href="<%=absoluteUrlPrefix%>">
       <title>字段设置页面</title> 
       <meta http-equiv="pragma" content="no-cache">
       <meta http-equiv="cache-control" content="no-cache">
       <meta http-equiv="expires" content="0">
       <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
       <meta http-equiv="description" content="This is my page">

       <gez:style compCss="gezComponents/jquery/jqueryui/jqueryuicss/jqueryui.css,gezComponents/popupDiv/css/jquery.popup.css,gezComponents/jquery-toolbar/css/jquery.toolbar.css"></gez:style>
       <script type="text/javascript"	src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery/jquery.js")%>"></script>
       <script type="text/javascript"	src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery/jqueryui/jqueryuijs/jqueryui.js")%>"></script>
       <script type="text/javascript"	src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/Base64.js")%>"></script>
	   <script type="text/javascript"	src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/AjaxUtil.js")%>"></script>
	   <script type="text/javascript"	src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/PathUtils.js")%>"></script>
	   <script type="text/javascript"	src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/json2.js")%>"></script>
       <script type="text/javascript"	src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery-toolbar/js/rqtoolbar.js")%>"></script>
	   <script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/popupDiv/showDialog.js") %>"></script>
	   <script type="text/javascript" src="<%=PathUtils.getAbsoluteJspUrl(request,"swfobject.js")%>"></script>	
	   <script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/fastReport/analysis/js/loadStyleFormatSwf.js")%>"></script>
       <script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/vrsr/show/customer/js/fastFieldSetDetail.js")%>"></script>	
       <style type="text/css">
	       html,body {padding:0px;overflow:hidden;}
		   #fastFieldSet{background:#FFFFFF}
       </style>
       <script type="text/javascript">
           var basePath = "<%=absoluteUrlPrefix%>";
           var absoluteUrlPrefix = '<%=absoluteUrlPrefix%>';
           var absoluteJspUrlPrefix = '<%=absoluteJspUrlPrefix%>';
		  var relativeUrlPrefix = '<%=relativeUrlPrefix%>';
		  var relativeJspUrlPrefix = '<%=relativeJspUrlPrefix%>';
		  var fieldName = '<%=fieldName%>';
		  var reportDefineId = '<%=reportDefineId%>';
		  var resID = '<%=resID%>';
		  var fieldInfo = <%=fieldInfo%>;
       </script>
   </head>
   <body style="width:100%;overflow:hidden;margin:0px;padding:0px;">
   	
   	<div id="container" style="position: absolute;top: 0px;left: 0px;z-Index:2;">
			<div id="flashContentStyle" style='width:0px;height:0px;'>
 			</div>
		</div>
       <div class="wrap">
	       <iframe name="fastFieldSet" id="fastFieldSet" height="100%" width="100%" frameborder="0" scrolling="no" src=""></iframe>
	   </div>
       <div id="fieldSetBtns" class="filterButtons" align="right" style="width :100%;">				
           <button onclick="successCallback ();" style="margin-top:3px;">确定</button>
           <button onclick="closePop();"> 取消</button>
       </div>
   </body>
</html>
