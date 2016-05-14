<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="com.runqian.mis2.util.DBAccess"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>个人首页</title>    
	<style>	.resizeDivClass{width:1;left:expression(this.parentElement.offsetWidth);}</style>
	
	<link href="<%=path%>/mis2/homepage/2.css" rel="stylesheet" type="text/css">	
<script type="text/javascript" language="javascript">
function f_frameStyleResize(targObj){
  var targWin=targObj.parent.document.all[targObj.name];
  if(targWin!=null){
    var HeightValue=targObj.document.body.scrollHeight;
    targWin.style.pixelHeight=HeightValue;
  }
}
function f_iframeResize(){
  f_frameStyleResize(self);
}
window.onload=f_iframeResize;
</script>
  </head>
<script type="text/javascript">
	var tmpElement=null;
	var dragElement=null;
	var refElement=null;
	var dragActive=0;
	var etd=null;		
function Move(eventId){
	alert(document.all(eventId).parentNode);

	if(dragActive==1){
		if(etd==eventId){
			dragElement.parentNode.style.filter="alpha(opacity=100)";
			dragActive=0;
			return;
		}		
		refElement=document.all(eventId);
		refElement.parentNode.insertBefore(tmpElement);		
		dragElement.parentNode.insertBefore(refElement);
		
		var t2=tmpElement.parentNode.getElementsByTagName("input")[1].value
		var t3=tmpElement.parentNode.getElementsByTagName("input")[2].value
		var t4=tmpElement.parentNode.getElementsByTagName("input")[3].value
		var t5=tmpElement.parentNode.getElementsByTagName("input")[4].value
			
		tmpElement.parentNode.getElementsByTagName("input")[1].value=refElement.parentNode.getElementsByTagName("input")[1].value;
		tmpElement.parentNode.getElementsByTagName("input")[2].value=refElement.parentNode.getElementsByTagName("input")[2].value;
		tmpElement.parentNode.getElementsByTagName("input")[3].value=refElement.parentNode.getElementsByTagName("input")[3].value;
		tmpElement.parentNode.getElementsByTagName("input")[4].value=refElement.parentNode.getElementsByTagName("input")[4].value;
						
		refElement.parentNode.getElementsByTagName("input")[1].value=t2;
		refElement.parentNode.getElementsByTagName("input")[2].value=t3;
		refElement.parentNode.getElementsByTagName("input")[3].value=t4;
		refElement.parentNode.getElementsByTagName("input")[4].value=t5;
		
		dragElement.removeNode(true);
		refElement.parentNode.style.filter="alpha(opacity=100)";
		dragActive=0;
		
		save();
		
		return;
	}
	dragActive=1;
	etd=eventId;	
	dragElement=document.all(eventId);
	tmpElement=dragElement.cloneNode(true);
	dragElement.parentNode.style.filter="alpha(opacity=60)";		
}
var nextTdW;
var oldWidth;
function MouseDownToResize(obj){
	obj.mouseDownX=event.clientX;
	obj.pareneTdW=obj.parentElement.offsetWidth;
	oldWidth=obj.parentElement.width;
	nextTdW=obj.parentElement.nextSibling.offsetWidth;
	obj.pareneTableW=theObjTable.offsetWidth;
	obj.setCapture();
}
function MouseMoveToResize(obj){
    if(!obj.mouseDownX) return false;
    var newWidth=obj.pareneTdW*1+event.clientX*1-obj.mouseDownX;
    var change=newWidth-oldWidth;
    if(newWidth>0){
		obj.parentElement.style.width = newWidth;
		//obj.parentElement.nextSibling.width=nextTdW-change;		
		obj.parentNode.getElementsByTagName("input")[3].value=newWidth;
	}
}
function MouseUpToResize(obj){
	obj.releaseCapture();
	obj.mouseDownX=0;
	savewh();
}


function MouseDown(obj){
	obj.mouseDownY=event.clientY;
	obj.pareneTdH=obj.parentElement.offsetHeight;
	obj.pareneTableH=theObjTable.offsetHeight;
	obj.setCapture();
}
function MouseMove(obj){
    if(!obj.mouseDownY) return false;
    var newHeight=obj.pareneTdH*1+event.clientY*1-obj.mouseDownY;
    if(newHeight>0){
		obj.parentElement.style.height = newHeight;
		obj.parentNode.parentNode.getElementsByTagName("input")[4].value=newHeight;
	}
}
function MouseUp(obj){
	obj.releaseCapture();
	obj.mouseDownY=0;
	savewh();
}
function save(){
	document.homepageForm.action="<%=path%>/mis2/homepage/doSaveHomepage.jsp";
	document.homepageForm.submit();
}
function savewh(){
	document.homepageForm.action="<%=path%>/mis2/homepage/doSave.jsp";
	document.homepageForm.submit();
}
function del(eventId){
	document.homepageForm.action="<%=path%>/mis2/homepage/doDel.jsp?FrameID="+eventId;
	document.homepageForm.submit();
}
function Close(eventId){
	obj=document.all(eventId);
	if (confirm("确认关闭此报表")) {
		obj.removeNode(true);
		del(eventId);
	}	
}
</script>  
  <body>
  <form name="homepageForm"id="homepageForm"action=""method="post">
 <%
 String userid = session.getAttribute("sys_UserID").toString();
 DBAccess dba = null;
 ResultSet rs = null;
 String sql = "select * from t_personalhp where User_ID='"+userid+"'";
 try{
 dba = new DBAccess();
 rs = dba.executeQueryCanScroll(sql);
 int totalCols=1;
 int totalRows=1;
 while(rs.next()){
 	if(rs.getInt("ColPos")>totalCols)totalCols=rs.getInt("ColPos");
 	if(rs.getInt("RowPos")>totalRows)totalRows=rs.getInt("RowPos");
 }
 rs.beforeFirst();
 int maxWidth[]=new int[totalCols];
 int maxHeigth[]=new int[totalRows];
 while(rs.next()){
 	if(rs.getInt("Width")>maxWidth[rs.getInt("ColPos")-1])maxWidth[rs.getInt("ColPos")-1]=rs.getInt("Width");
 	if(rs.getInt("Heigth")>maxHeigth[rs.getInt("RowPos")-1])maxHeigth[rs.getInt("RowPos")-1]=rs.getInt("Heigth");
 }
 if(rs!=null) rs.close();
 %>
 <table width="100%" height="100%" border="0"id="theObjTable"STYLE="table-layout:fixed;">
 <%
 for(int row=1;row<=totalRows;row++){%>
 <tr>
 <% 	
 	for(int col=1;col<=totalCols;col++){
 		sql = "select * from t_personalhp p,t_res r where p.User_ID='"+userid+"' and p.RowPos='"+row+"' and p.ColPos= '"+col+"' and p.Res_ID=r.Res_ID";
 		rs = dba.executeQuery(sql);
 		if(rs.next()){
 			int frameID = rs.getInt("FrameID");
	  		int resID = rs.getInt("Res_ID");
	  		int width=rs.getInt("Width");
	  		int Height=rs.getInt("Heigth");
	  		String resName=rs.getString("Res_Name");
 		%> 		    
 		<td valign="top"width="<%=rs.getString("Width")%>">
 		<%if(col<totalCols&&row==1){%>
 		<font class="resizeDivClass" onmousedown="MouseDownToResize(this);" onmousemove="MouseMoveToResize(this);" onmouseup="MouseUpToResize(this);"></font>
		<%} %>
 		<input type="hidden" id="frameName"name="frameName"value="<%=frameID%>"/>
 		<input type="hidden" id="frameRow"name="frameRow"value="<%=row %>"/>
 		<input type="hidden" id="frameCol"name="frameCol"value="<%=col %>"/>
 		<input type="hidden" id="frameWidth"name="frameWidth"value=""/>
 		<input type="hidden" id="frameHeight"name="frameHeight"value=""/> 
 		<div id="<%=frameID%>">  		
 		<div id="roundbox" class="roundbox">		
			<div class="roundboxTitleForm">
				<div style="cursor:move;"onMouseDown="Move('<%=frameID%>');"class="roundbox-title"><%=resName%></div>
				<div class="roundboxDelete"onMouseDown="Close('<%=frameID%>');"></div>			
			</div>						
			<div class="roundboxContent" style="height:<%=rs.getString("Heigth")%>">
			<iframe src="mis2/homepage/test.htm" width="<%=rs.getString("Width")%>"height="<%=rs.getString("Heigth")%>"marginWidth="0" marginHeight="0"  frameborder="0" scrolling="auto"></iframe>
			</div>			
		</div>
		<%if(row<=totalRows){%>
		<div style="height:1;cursor:n-resize;vertical-align:bottom"onmousedown="MouseDown(this);" onmousemove="MouseMove(this);" onmouseup="MouseUp(this);">---</div>
 		<%}%>
 		</div>	 				
 		</td>
 		<%}else{%>
 		<td valign="top">
 		<%if(col<totalCols&&row==1){%> 		
 		<font class="resizeDivClass" onmousedown="MouseDownToResize(this);" onmousemove="MouseMoveToResize(this);" onmouseup="MouseUpToResize(this);"></font>		
 		<%} %>
 		<input type="hidden" id="frameName"name="frameName"value="<%=String.valueOf(row)+String.valueOf(col)%>"/>
 		<input type="hidden" id="frameRow"name="frameRow"value="<%=row %>"/>
 		<input type="hidden" id="frameCol"name="frameCol"value="<%=col %>"/>
 		<input type="hidden" id="framWidth"name="frameWidth"value=""/>
 		<input type="hidden" id="frameHeight"name="frameHeight"value=""/> 
 		<div id="<%=String.valueOf(row)+String.valueOf(col)%>">
 		<div id="roundbox" class="roundbox">		
			<div class="roundboxTitleForm">
				<div class="roundboxTitle"style="cursor:move;"onMouseDown="Move('<%=String.valueOf(row)+String.valueOf(col)%>')">未定义</div>
				<div class="roundboxDelete"></div>			
			</div>						
			<div class="roundboxContent">
			<iframe src="mis2/homepage/test.htm"  width="100%" height="80%"frameborder="0" scrolling="auto"></iframe>
			</div>			
		</div>
		<%if(row<=totalRows){%>
		<div style="cursor:n-resize;vertical-align:bottom"onmousedown="MouseDown(this);" onmousemove="MouseMove(this);" onmouseup="MouseUp(this);">---</div>
 		<%} %>
 		</div>		 		
 		</td>
 		<%}
 		
 	}%>
</tr>	
<%}
}catch(Exception e){
	e.printStackTrace();
	response.sendRedirect(request.getContextPath()+"/mis2/error.jsp");
}finally{
	if(dba!=null) {
		dba.close();	
	}
}
%>
 </table>
 </form>
 </body>
</html>
