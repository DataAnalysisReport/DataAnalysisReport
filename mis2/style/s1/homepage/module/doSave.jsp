<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="com.runqian.mis2.util.DBAccess"%>
<%@ page import="java.sql.ResultSet"%>
<%@ page import="java.sql.SQLException"%>

<html>
  <head>
  </head>
  <body>
    	<%		
    			String Params=session.getAttribute("totalParam").toString();
    			String Graph_Name = request.getParameter("Graph_Name");
    			Graph_Name = new String(Graph_Name.getBytes("ISO-8859-1"));
				DBAccess dba = null;
				ResultSet rs = null;
				try{
					dba = new DBAccess();
					String select_sql = "select * from dashboard where params ='"+ Params+ "'";
					rs = dba.executeQuery(select_sql);
					if(rs.next()){
						throw new SQLException("该记录在数据库中已存在！请重新设置！");
					}
					else{
					String seq=dba.getSeq("dashboard.Graph_ID", 1)[0];
					String sql = "insert into dashboard values("+seq+",'root','" + Graph_Name + "','"+Params+"')";
					dba.startTransaction();
					dba.executeUpdate(sql);
					dba.commit();
					dba.endTransaction();
					//printInfo("参数成功保存到数据库！");
					}
					rs.close();
				}catch(SQLException sqlex){
					sqlex.printStackTrace();
					dba.rollback();
				}finally{
					dba.close();
				}
			//return rows;
    	 %>
  </body>
</html>
