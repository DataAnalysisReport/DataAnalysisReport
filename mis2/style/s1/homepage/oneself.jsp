<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="java.lang.Object" %>
<%@ page import="java.lang.String" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="com.runqian.mis2.util.DBAccess"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<meta http-equiv="Content-Type" content="text/html; charset=gbk" />
	<title>首页</title>
	<LINK href="js/desktop.css" type=text/css  media=screen rel=stylesheet>
	<script language="javascript" src="js/desktop.js"></script>
  </head>
  <%
  		int i = 1,j = 1;
  		String userid = session.getAttribute("sys_UserID").toString();
  		DBAccess dba = null;
  		String sql = "";
  		ResultSet rs = null;
  		sql = "select * from T_PersonalHP where User_ID='"+userid+"'";
  		try{
  			dba=new DBAccess();
  			rs = dba.executeQueryCanScroll(sql); 
  %>
  <body topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
		<%    
  			while(rs.next()){
  				int col = rs.getInt("ColPos");
  				if(col == 2){
  					j = 2;
  					break;
  				}
  			}
  			rs.beforeFirst();
  			if(j == 2){
	  			while(rs.next()){
	  				int FrameID = rs.getInt("FrameID");
	  				int Width = rs.getInt("Width");
	  				int Heigth = rs.getInt("Heigth");
	  				int ResID = rs.getInt("Res_ID");
	  				if(i % 2 == 1){
	  		%>
	  		<tr>
				<td height="<%=Heigth%>" width="<%=Width%>">
					<div class="subMode" style="margin-bottom:5px;"  id="move1">
					<table>
					<tr><td style="cursor:move;"onMouseDown="readyDrag('move1');" class="Desktop_right_bar_bg"><SPAN CLASS="Desktop_title">最新上传文件</SPAN></td></tr>
					</table>
					<iframe src="<%=request.getContextPath()%>/function?sys_fid=<%=ResID%>&sys_pritype=1" id="<%=FrameID%>" name="<%=FrameID%>" height="100%" width="100%" frameborder="0" scrolling="auto"></iframe>
					</div>
				</td>
			<%		}
					else{
			%>	<td height="<%=Heigth%>" width="<%=Width%>">
				<div id="sub"><div>sub</div>
					<iframe src="<%=request.getContextPath()%>/function?sys_fid=<%=ResID%>&sys_pritype=1" id="<%=FrameID%>" name="<%=FrameID%>" height="100%" width="100%" frameborder="0" scrolling="auto"></iframe>
				</div>
				</td>
			</tr>
			<% 
					}
				i++;
				}
			}
			if(j == 1){
				while(rs.next()){
		  			int FrameID = rs.getInt("FrameID");
		  			int Width = rs.getInt("Width");
		  			int Heigth = rs.getInt("Heigth");
		  			int ResID = rs.getInt("Res_ID");
		  		%>
		  		<tr>
					<td height="<%=Heigth%>" width="<%=Width%>">
					<div id="sub"><div>sub</div>
						<iframe src="<%=request.getContextPath()%>/function?sys_fid=<%=ResID%>&sys_pritype=1" id="<%=FrameID%>" name="<%=FrameID%>" height="100%" width="100%" frameborder="0" scrolling="auto"></iframe>
					</div>
					</td>
				</tr>
				<% 
					}
			}
			}catch(Exception e){
				e.printStackTrace();
				response.sendRedirect(request.getContextPath()+"mis2/error.jsp");
			}finally{
				if(dba!=null){
					dba.close();
				}
			}
		%>
	</table>
  </body>
  
</html>