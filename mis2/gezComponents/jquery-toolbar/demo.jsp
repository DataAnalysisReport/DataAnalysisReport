<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.runqianapp.schedule.utils.PathUtils"%>
<%@ taglib uri="/WEB-INF/tld/gez.tld"  prefix="gez" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">  
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta  charset="UTF-8">
		<title>新按钮示例</title>
		<gez:style compCss="gezComponents/formstyle/css/form.css"></gez:style>		
		
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jquery/jquery.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/formstyle/js/form.js")%>"></script>
		<script type="text/javascript" src="<%=PathUtils.getRelativeJspUrl(request,"/gezComponents/jsUtils/IconFactory.js")%>"></script>
		
		<script type="text/javascript">
			$(function(){
				$("#btn").gezToggleButton('selectedFun','unSelectedFun',true);
			})
			function selectedFun(){
				confirm('selectedFun')
			}
			function unSelectedFun(){
				confirm('unSelectedFun')
			}
		</script>
		<style type="text/css">
			button{margin-left:30px;}
		</style>
	</head>
	<body>
		<div id="test" style="margin-left:300px;margin-top:100px;">
			<input type="button" value="标准按钮" class="gezBasicButton">
			<button class="gezBasicButton" id="btn">选中效果按钮</button>
			<button class="gezBrighterButton">高亮按钮</button>
		</div>
	</body>
</html>

 
