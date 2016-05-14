<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="com.runqian.mis2.util.DBAccess"%>
<%@ page import="java.sql.ResultSet"%>
<%@ page import="java.sql.SQLException"%>

<html>
  <head>
	<title>查看详细参数</title>
  </head>
  
  <body>
    <%	String graphID = request.getParameter("graphId");
    	String sql ="select Params from dashboard where Graph_ID='"+graphID+"'";
    	DBAccess dba=null;
    	try{
    	dba = new DBAccess();
    	ResultSet rs = dba.executeQuery(sql); 
    	String catViewName = null;
    	String seryViewName1 = null;
    	String seryViewName2 = null;
	    	while(rs.next()){
	    		String Param = rs.getString("Params");
	    		Param = Param.replaceAll("=","");
	    		Param.replaceAll(";false","");
	    		String[] Param2 = Param.split("&");
	    		String[] Param3 = Param2[0].split(";");
	    		catViewName = Param3[1];
	    		String catColName = Param3[2];
	    		String catViewWay = Param3[0];
	    		String[] Param4 = Param2[1].split(";");
	    		seryViewName1 = Param4[1];
	    		String seryColName1 = Param4[2];
	    		String seryViewWay = Param4[0];
	    		String[] Param5 = Param2[2].split(";");
	    		seryViewName2 = Param5[1];
	    		String seryColName2 = Param5[2];
	    		String seryValueWay = Param5[0];
	    		%>
	    	<table align="center" cellspacing="0" border="1" >
	    		<tr><td>分类视图名：</td><td><%=catViewName %></td>
	    			<td>字段名：</td><td><%=catColName %></td>
	    			<td>方式：</td><td><%=catViewWay %></td>
	    			</tr>
	    		<tr><td>系列名称视图名:</td><td><%=seryViewName1 %></td>
	    			<td>字段名：</td><td><%=seryColName1 %></td>
	    			<td>方式：</td><td><%=seryViewWay %></td>
	    			</tr>
	    		<tr><td>系列值视图名：</td><td><%=seryViewName2 %></td>
	    			<td>字段名：</td><td><%=seryColName2 %></td>
	    			<td>方式:</td><td><%=seryValueWay %></td>
	    			</tr>
	    	</table>
	  <%}
  	}catch(SQLException sqlex){
  		sqlex.printStackTrace();
  	}finally{
  		if(dba!=null)dba.close(); 
  	}
  %>
  
  </body>
</html>
