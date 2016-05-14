<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<html>
  <head>   
	<title>保存统计图</title>
  </head>
  
  <body>
  <%	
  		
  		String params=session.getAttribute("totalParam").toString();
  		//StringBuffer param2 = new StringBuffer (new String(params.getBytes("ISO-8859-1")));
   %>
   <form action="doSave.jsp?params=<%=params %>">   		
  <table align="center" border>
  		<tr><td>用户编号：</td><td>qq</td></tr>
  		<tr><td>统计图名字：</td><td><input type="text" name="Graph_Name"></td></tr>
  		<tr><th colspan=2><input type="submit" value="确定"></th></tr>
  </table>
  </form>
   
    
  </body>
</html>
