<%@ page language="java" contentType="text/html; charset=UTF-8"%>

<%
	String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0  Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<title>选择目标目录</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta  charset="UTF-8">
		<link rel="stylesheet" type="text/css" href="<%=path %>/mis2/gezComponents/jquery/jqueryui/jqueryuicss/jqueryui.css" />
		<link rel="stylesheet" type="text/css" href="<%=path %>/mis2/gezComponents/popupDiv/css/jquery.popup.css" />
		<link rel="stylesheet" type="text/css" href="<%=path %>/mis2/style/s1/customStyle/customStyle.css" />

		<script src="<%=path %>/mis2/gezComponents/jquery/jquery.js" type="text/javascript"></script>
		<script src="<%=path %>/mis2/gezComponents/jquery/jqueryui/jqueryuijs/jqueryui.js" type="text/javascript"></script>
		<script src="<%=path %>/mis2/gezComponents/popupDiv/showDialog.js" type="text/javascript"></script>

		<script type="text/javascript">
			
			function show(){
				showDialog("inner.jsp", null, "测试", 300, 500, null, null, null, null, null, null,null,null,null,null,null,true,"completeFunc","cancelFunc");
			}

			function completeFunc(){
				confirm("完成");
			}

			function cancelFunc(){
				confirm("取消");
			}

		</script>
	</head>
	<body>
		<button onclick="show()">弹出带完成取消按钮的弹出层</button>
	</body>
</html>