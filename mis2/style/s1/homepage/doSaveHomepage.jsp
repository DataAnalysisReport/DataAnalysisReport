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
	  	if(userid.equalsIgnoreCase("root")){
	  		for(int i=0;i<frameName.length;i++){
		  		String sql="update t_syshp set RowPos='"+frameRow[i]+"',ColPos='"+frameCol[i]+"' where FrameID='"+frameName[i]+"'";
		  		dba.executeUpdate(sql);
		  	}
	  	}else{
		  	for(int i=0;i<frameName.length;i++){
		  		String sql="update t_personalhp set RowPos='"+frameRow[i]+"',ColPos='"+frameCol[i]+"' where FrameID='"+frameName[i]+"'";
		  		dba.executeUpdate(sql);
		  	}
	  	}
		dba.commit();
		dba.endTransaction();
		response.sendRedirect(request.getContextPath()+"/mis2/homepage/rightReports.jsp");
	}catch(Exception e){
		e.printStackTrace();
		dba.rollback();
	}finally{
		if(dba!=null) dba.close();
	}
%>
</body>
</html>
