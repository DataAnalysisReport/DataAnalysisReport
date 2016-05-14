<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="java.sql.ResultSet"%>
<%@ page import="com.runqian.mis2.util.DBAccess"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>添加个人首页资源</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

	</head>

	<body>
		<%
			DBAccess dba = null;
			try {
				String sysFid = request.getParameter("sysFid");
				String col = request.getParameter("Col");
				String userid = session.getAttribute("sys_UserID").toString();
				dba = new DBAccess();
				if (userid.equalsIgnoreCase("root")) {
					String[] hpsep = dba.getSeq("T_syshp.FrameID", 1);
					ResultSet rs = null;
					String sql = "select p.RowPos*10+ColPos as Pos from t_syshp p,t_res r where p.Res_ID=r.Res_ID and p.ColPos='"
					+ col + "' order by Pos";
					rs = dba.executeQuery(sql);
					if (!rs.next()) {
				sql = "insert into t_syshp (FrameID,RowPos,ColPos,Width,Heigth,Res_ID,Org_ID)values('"
						+ hpsep[0]
						+ "','"
						+ 1
						+ "','"
						+ col
						+ "','"
						+ 400 + "','" + 300 + "','" + sysFid + "',0)";
				dba.startTransaction();
				dba.executeUpdate(sql);
				dba.commit();
				dba.endTransaction();
				response.sendRedirect(request.getContextPath()+"/mis2/operateSuccess.jsp");
				return ;
					}
					rs.beforeFirst();
					int rowPos = 1;
					while (rs.next()) {
				int Pos = rs.getInt("Pos");
				int Row = (Pos - Integer.parseInt(col)) / 10;
				if (Row != rowPos) {
					sql = "insert into t_syshp (FrameID,RowPos,ColPos,Width,Heigth,Res_ID,Org_ID)values('"
					+ hpsep[0]
					+ "','"
					+ rowPos
					+ "','"
					+ col
					+ "','"
					+ 400
					+ "','"
					+ 300
					+ "','"
					+ sysFid + "',0)";
					dba.startTransaction();
					dba.executeUpdate(sql);
					dba.commit();
					dba.endTransaction();
					response.sendRedirect("../operateSuccess.jsp");
					break;
				}
				rowPos++;
					}
					if (!rs.next()) {
				sql = "insert into t_syshp (FrameID,RowPos,ColPos,Width,Heigth,Res_ID,Org_ID)values('"
						+ hpsep[0]
						+ "','"
						+ rowPos
						+ "','"
						+ col
						+ "','"
						+ 800
						+ "','"
						+ 300
						+ "','"
						+ sysFid
						+ "',0)";
				dba.startTransaction();
				dba.executeUpdate(sql);
				dba.commit();
				dba.endTransaction();
				response.sendRedirect("../operateSuccess.jsp");
					}
				} else {
					String[] hpsep = dba.getSeq("T_personalhp.FrameID", 1);
					ResultSet rs = null;
					String sql = "select p.RowPos*10+ColPos as Pos from t_personalhp p,t_res r where p.User_ID='"
					+ userid
					+ "' and p.Res_ID=r.Res_ID and p.ColPos='"
					+ col + "' order by Pos";
					rs = dba.executeQuery(sql);
					if (!rs.next()) {
				sql = "insert into t_personalhp (User_ID,FrameID,RowPos,ColPos,Width,Heigth,Res_ID)values('"
						+ userid
						+ "','"
						+ hpsep[0]
						+ "','"
						+ 1
						+ "','"
						+ col
						+ "','"
						+ 400
						+ "','"
						+ 300
						+ "','"
						+ sysFid + "')";
				dba.startTransaction();
				dba.executeUpdate(sql);
				dba.commit();
				dba.endTransaction();
				response.sendRedirect("../operateSuccess.jsp");
				return ;
					}
					rs.beforeFirst();
					int rowPos = 1;
					while (rs.next()) {
				int Pos = rs.getInt("Pos");
				int Row = (Pos - Integer.parseInt(col)) / 10;
				if (Row != rowPos) {
					sql = "insert into t_personalhp (User_ID,FrameID,RowPos,ColPos,Width,Heigth,Res_ID)values('"
					+ userid
					+ "','"
					+ hpsep[0]
					+ "','"
					+ rowPos
					+ "','"
					+ col
					+ "','"
					+ 400
					+ "','" + 300 + "','" + sysFid + "')";
					dba.startTransaction();
					dba.executeUpdate(sql);
					dba.commit();
					dba.endTransaction();
					response.sendRedirect("../operateSuccess.jsp");
					break;
				}
				rowPos++;
					}
					if (!rs.next()) {
				sql = "insert into t_personalhp (User_ID,FrameID,RowPos,ColPos,Width,Heigth,Res_ID)values('"
						+ userid
						+ "','"
						+ hpsep[0]
						+ "','"
						+ rowPos
						+ "','"
						+ col
						+ "','"
						+ 800
						+ "','"
						+ 300
						+ "','" + sysFid + "')";
				dba.startTransaction();
				dba.executeUpdate(sql);
				dba.commit();
				dba.endTransaction();
				response.sendRedirect("../operateSuccess.jsp");
					}
				}
			} catch (Exception e) {
				dba.rollback();
			} finally {
				if(dba!=null) dba.close();
			}
		%>
	</body>
</html>
