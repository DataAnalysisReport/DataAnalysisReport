<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="com.runqian.mis2.util.*"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>个人首页列表</title>
    
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">
    
    <script type="text/javascript">
		function returnMenu(){
			parent.location = "<%=basePath%>/mis2/bottom.jsp" ;
		}
	</script>
	<link href="<%=request.getContextPath()%>/mis2/style/<%=ReadConfInfo.getPropery("conf_style")%>/style.css"
			rel="stylesheet" type="text/css">
  </head>

	<body>
		<div id="dtree">
			<%
		//String layout = (String)session.getAttribute("layout") ;
  	    String layout =ReadConfInfo.getPropery("conf_frameMenuLayout") ;
		if(layout==null || "".equals(layout)){
			layout = "0" ;
		}
		if("1".equals(layout)){
	%>
			<div class="dtreeLine">
				个人首页
			</div>
			<div class="dtreeContent">
			<input type="button" value="返回主菜单" name="返回主菜单" onClick="returnMenu()">
				<%
  		}
  	%>
				<%
    	 String userid = session.getAttribute("sys_UserID").toString();
 
 		 DBAccess dba = null;
 		 ResultSet rs = null;
 		 String sql = "" ;
		 try{
		 	dba = new DBAccess();
		 	
		 	sql = "select r.Res_Name,p.User_ID,p.FrameID,p.RowPos,p.ColPos,p.Width,p.Heigth,p.Res_ID,p.RowPos*10+ColPos as Pos from t_personalhp p,t_res r where p.User_ID='"+userid+"' and p.Res_ID=r.Res_ID order by Pos";
			if(userid.equalsIgnoreCase("root")){
				sql="select r.Res_ID,r.Res_Name,p.FrameID,p.RowPos,p.ColPos,p.Width,p.Heigth,p.Res_ID,p.RowPos*10+ColPos as Pos from t_syshp p,t_res r where p.Res_ID=r.Res_ID order by Pos";
			}
		 	rs=dba.executeQuery(sql);
		 	while(rs.next()){
		 		String resName=rs.getString("Res_Name");
				int resID = rs.getInt("Res_ID");
	%>
				<li class="DTreeNode">
							<img src="/reportmis/mis2/style/<%=ReadConfInfo.getPropery("conf_style")%>/amend-list.gif">
					<a
						href="<%=request.getContextPath()%>/function?sys_fid=<%=resID%>&sys_pritype=1&sys_mode=T_PersonalHP"
						target="right"><%=resName%></a>
				</li>
				<%
		 	}
		 }catch(Exception e){
 		
		 }finally{
		 	if(dba!=null){
		 		dba.close();
		 	}
		 } 
	%>
			</div>
		</div>
	</body>
</html>
