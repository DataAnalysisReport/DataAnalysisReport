<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<html>
  <head>   
	<title>����ͳ��ͼ</title>
  </head>
  
  <body>
  <%	
  		
  		String params=session.getAttribute("totalParam").toString();
  		//StringBuffer param2 = new StringBuffer (new String(params.getBytes("ISO-8859-1")));
   %>
   <form action="doSave.jsp?params=<%=params %>">   		
  <table align="center" border>
  		<tr><td>�û���ţ�</td><td>qq</td></tr>
  		<tr><td>ͳ��ͼ���֣�</td><td><input type="text" name="Graph_Name"></td></tr>
  		<tr><th colspan=2><input type="submit" value="ȷ��"></th></tr>
  </table>
  </form>
   
    
  </body>
</html>
