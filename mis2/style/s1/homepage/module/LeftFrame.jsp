<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="com.runqian.mis2.util.DBAccess"%>
<%@ page import="java.sql.ResultSet"%>
<%@ page import="java.sql.SQLException"%>
<html>
 <body>
    <%
   		ResultSet rs = null;
   		DBAccess dba = null;
    	try{
    	dba = new DBAccess();
    	String sql = "select * from dashboard;";
    	rs = dba.executeQuery(sql);
    	
    	%>
    	
    	<% while(rs.next()){
    			String Graph_Name = rs.getString("Graph_Name");
    			String graphID = rs.getString("Graph_ID");
    			String Params = rs.getString("Params");
    			String[] param = Params.split("&");
    			String param1 = "categoryExp=" + param[0];
    			String param2 = "seryNameExp=" + param[1];
    			String param3 = "seryValueExp=" + param[2];
    			String param4 = param1 + "&" + param2 +"&" + param3;
    		 %>
    <h2><a href="dashbroad.jsp?<%=param4 %>&graphID=<%=graphID %>" target="right-bottom"><%=Graph_Name %></a></h2>
    
    	<%
    	}    	
    	}catch(SQLException sqlex){
    		sqlex.getMessage();
    	}finally{
    		if(dba!=null){
    			dba.close();
    		}
    	}
    	 %>
 </body>
</html>
