<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="com.runqian.mis2.access.UserInfo"%>
<%@ page import="com.runqian.mis2.util.DBAccess"%>
<%
	UserInfo ui = (UserInfo)session.getAttribute("sys_UserInfo");
	if(ui==null) {
		session.setAttribute("sys_Error","loginOvertime");
		response.sendRedirect(request.getContextPath() + "/mis2/error.jsp");
	}
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>My JSP 'doSaveHomepage.jsp' starting page</title>

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
	try{
	  	String userid = ui.getUserId();
	  	dba = new DBAccess();
	  	String[] frameName=request.getParameterValues("frameName");
	  	String[] frameRow=request.getParameterValues("frameRow");
	  	String[] frameCol=request.getParameterValues("frameCol");
	  	String[] frameWidth=request.getParameterValues("frameWidth");
	  	String[] frameHeight=request.getParameterValues("frameHeight");
		dba.startTransaction();
		int maxWidth=0;
		int maxHeight=0;
		String row=null;
		String col=null;
		if(userid.equalsIgnoreCase("root")){
			for(int i=0;i<frameName.length;i++){
			if(frameWidth[i]!=null&&frameWidth[i].length()>0&&Integer.parseInt(frameWidth[i])>maxWidth){
				maxWidth=Integer.parseInt(frameWidth[i]);
				col=frameCol[i];
			}
			if(frameHeight[i]!=null&&frameHeight[i].length()>0&&Integer.parseInt(frameHeight[i])>maxWidth){
				maxHeight=Integer.parseInt(frameHeight[i]);
				row=frameRow[i];
			} 		
	  	}
	  	if(maxHeight>0){
	  		String sql="update t_syshp set Heigth='"+maxHeight+"'where RowPos='"+row+"'";
	  		dba.executeUpdate(sql);
	  	}
	  	if(maxWidth>0){
	  		String sql="update t_syshp set Width='"+maxWidth+"'where ColPos='"+col+"'";
	  		dba.executeUpdate(sql);
	  	}
		}else{
			for(int i=0;i<frameName.length;i++){
				if(frameWidth[i]!=null&&frameWidth[i].length()>0&&Integer.parseInt(frameWidth[i])>maxWidth){
					maxWidth=Integer.parseInt(frameWidth[i]);
					col=frameCol[i];
				}
				if(frameHeight[i]!=null&&frameHeight[i].length()>0&&Integer.parseInt(frameHeight[i])>maxWidth){
					maxHeight=Integer.parseInt(frameHeight[i]);
					row=frameRow[i];
				} 		
		  	}
		  	if(maxHeight>0){
		  		String sql="update t_personalhp set Heigth='"+maxHeight+"'where User_ID='"+userid+"' and RowPos='"+row+"'";
		  		dba.executeUpdate(sql);
		  	}
		  	if(maxWidth>0){
		  		String sql="update t_personalhp set Width='"+maxWidth+"'where User_ID='"+userid+"' and ColPos='"+col+"'";
		  		dba.executeUpdate(sql);
		  	}
	  	}
	  	dba.commit();
	  	dba.endTransaction();
	  	response.sendRedirect(request.getContextPath()+"/mis2/homepage/rightReports.jsp");
  	}catch(Exception e){
  		dba.rollback();
  	}finally{
  		if(dba!=null) dba.close();
  	}
%>
	</body>
</html>
