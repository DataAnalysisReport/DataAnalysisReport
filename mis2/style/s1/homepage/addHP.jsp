<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@page import="com.runqian.mis2.util.ReadConfInfo"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>������ҳ��Դ���</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">

		<link rel="stylesheet" type="text/css"
			href="<%=request.getContextPath()%>/mis2/style/<%=ReadConfInfo.getPropery("conf_style")%>/style.css">
		<link rel="stylesheet" type="text/css"
			href="<%=request.getContextPath() %>/mis2/style/<%=ReadConfInfo.getPropery("conf_style")%>/style.css">


	</head>

	<body>

		<%
	String sysFid=request.getParameter("sys_fid");  
%>
		<div class="popUpForm">
			<div class="popUpitle">
				������ҳ��Դ���
			</div>
			<div class="popUpContent">
				<form action="doAddHP.jsp" method="post" name="hpform">
					<table>
						<tr>
							<td>
								�������
							</td>
							<td>
								��һ��
								<input type="radio" name="Col" value="1" checked="checked">
							</td>
							<td>
								�ڶ���
								<input type="radio" name="Col" value="2">
								<input type="hidden" name="sysFid" value="<%=sysFid%>">
							</td>
						</tr>
					</table>
				</form>
			</div>
			<div id="popUpButton">
				<input type="button" value="ȡ��" onclick="window.close();">
				<input type="button" value="ȷ��"
					onclick="javascript:hpform.submit();">
			</div>
		</div>
	</body>
</html>
