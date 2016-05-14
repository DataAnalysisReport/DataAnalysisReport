<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="com.runqian.mis2.util.DBAccess"%>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>个人首页</title>    
<style>.resizeDivClass{display:hidden;}</style>

<script language=javascript>
var tmpElement=null;
var dragElement=null;
var refElement=null;
var dragActive=0;	
function Move(eventId){	
	if(dragActive==1){
		if(etd==eventId){
			dragElement.parentNode.style.filter="alpha(opacity=100)";
			dragActive=0;
			return;
		}		
		refElement=document.all(eventId);
		refElement.parentNode.insertBefore(tmpElement,refElement);		
		dragElement.parentNode.insertBefore(refElement,dragElement);
		
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
		
		return;
	}
	dragActive=1;
	etd=eventId;	
	dragElement=document.all(eventId);
	tmpElement=dragElement.cloneNode(true);
	dragElement.parentNode.style.filter="alpha(opacity=60)";		
}
function MouseDownToResize(obj){
obj.mouseDownX=event.clientX;
obj.pareneTdW=obj.parentElement.offsetWidth;
obj.pareneTableW=theObjTable.offsetWidth;
obj.setCapture();
}
function MouseMoveToResize(obj){
     if(!obj.mouseDownX) return false;
     var newWidth=obj.pareneTdW*1+event.clientX*1-obj.mouseDownX;
     if(newWidth>0)
     {
obj.parentElement.style.width = newWidth;
theObjTable.style.width=obj.pareneTableW*1+event.clientX*1-obj.mouseDownX;
obj.parentNode.getElementsByTagName("input")[3].value=newWidth;
}
}
function MouseUpToResize(obj){
obj.releaseCapture();
obj.mouseDownX=0;
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
     if(newHeight>0)
     {
obj.parentElement.style.height = newHeight;
theObjTable.style.height=obj.pareneTableH*1+event.clientY*1-obj.mouseDownY;
obj.parentNode.parentNode.getElementsByTagName("input")[4].value=newHeight;
}
}
function MouseUp(obj){
obj.releaseCapture();
obj.mouseDownY=0;
}
function Close(eventId){
	obj=document.all(eventId);
	if (confirm("确认关闭此报表")) {
		obj.removeNode(true);
	}	
}
</script>

	<link href="mis2/homepage/homepage.css" rel="stylesheet" type="text/css">
	<link href="homepage.css" rel="stylesheet" type="text/css">	

  </head>  
  <body>
  <form name="homepageForm"id="homepageForm"action=""method="post">
 <table cellspacing="2"width="100%" height="100%" border="0"id="theObjTable"STYLE="table-layout:fixed;">
 <%
 DBAccess dba = null;
 ResultSet rs = null;
 try{
 dba = new DBAccess();
 int w1=0;
 rs=dba.executeQuery("select * from t_personalhp p where p.User_ID='root'");
 while(rs.next()){
 	if(rs.getInt("ColPos")==1)w1=rs.getInt("Width");
 }
 rs.close();
 if(w1==0)w1=500;
  
 String sql = "select *,p.RowPos*10+ColPos as Pos from t_syshp p,t_res r where p.Res_ID=r.Res_ID order by Pos";
 rs=dba.executeQuery(sql);
 
 if(rs.next()){
 
 int cRow=1;
 int cCol=1;
 int i=0;
 while(true){ 		
 	int Pos=rs.getInt("Pos");
 	String resName=rs.getString("Res_Name");
 	int frameID = rs.getInt("FrameID");
	int resID = rs.getInt("Res_ID");
	int width=rs.getInt("Width");
	int height=rs.getInt("Heigth");
 	int Col=Pos%10;
 	int Row=(Pos-Col)/10;
 	if(cRow==Row&&cCol==Col){ 		
%>
		<%if(cCol==1){%><tr><%}%>
		<td valign="top"<%if(cCol==1){%>width="<%=width%>"<%}%>height="<%=height %>">
		<%if(cCol==1){%><font onmouseout="this.style.filter='alpha(opacity=0)';"onmouseover="this.style.filter='alpha(opacity=100)';"class="resizeDivClass" onmousedown="MouseDownToResize(this);" onmousemove="MouseMoveToResize(this);" onmouseup="MouseUpToResize(this);"></font><%}%>
		<input type="hidden" id="frameName"name="frameName"value="<%=frameID%>"/>
 		<input type="hidden" id="frameRow"name="frameRow"value="<%=cRow %>"/>
 		<input type="hidden" id="frameCol"name="frameCol"value="<%=cCol %>"/>
 		<input type="hidden" id="frameWidth"name="frameWidth"value=""/>
 		<input type="hidden" id="frameHeight"name="frameHeight"value=""/> 
		<div id="<%=String.valueOf(cRow)+String.valueOf(cCol) %>">
		<input type="hidden" id="resID" name="resID"value="<%=resID %>"/>
		<input type="hidden" id="fName"name="fName"value="<%=frameID%>"/> 
		<div id="roundbox" class="roundbox">
			<div class="roundboxTitleForm">
				<div style="cursor:move;"onMouseDown="Move('<%=String.valueOf(cRow)+String.valueOf(cCol) %>');"class="roundbox-title"><%=resName%></div>
				<div class="roundboxDelete"onMouseDown="Close('<%=String.valueOf(cRow)+String.valueOf(cCol) %>');"></div>			
			</div>						
			<div style="height:<%=height-40%>"class="roundboxContent"<%if(cCol==1){%>style="margin-left:0px;height:<%=height-40%>"<%}%>>
			<iframe src="<%=request.getContextPath()%>/function?sys_fid=<%=resID%>&sys_pritype=1&sys_mode=T_PersonalHP" <%if(cCol==1){%>width="<%=width-50%>"<%}else{%>width="95%" <%}%>height="80%"marginWidth="0" marginHeight="0"  frameborder="0" scrolling="auto"></iframe>
			</div>			
		</div>
		</div>
		<div onmouseout="this.style.filter='alpha(opacity=0)';"onmouseover="this.style.filter='alpha(opacity=100)';"style="filter:alpha(opacity=0);height:1;cursor:n-resize;"onmousedown="MouseDown(this);" onmousemove="MouseMove(this);" onmouseup="MouseUp(this);"><hr style="color:red"size="2"></div>
		</td>
		<%if(cCol==2){%></tr><%}%>
<% 	 		
 		if(cCol==1)cCol=2;
 		else {cRow++;cCol=1;}
 		if(!rs.next())break; 		
 	}else{
%>
		<%if(cCol==1){%><tr><%}%>
		<td valign="top"<%if(cCol==1){%>width="<%=w1%>"<%}%>>
		<%if(cCol==1){%><font onmouseout="this.style.filter='alpha(opacity=0)';"onmouseover="this.style.filter='alpha(opacity=100)';"class="resizeDivClass" onmousedown="MouseDownToResize(this);" onmousemove="MouseMoveToResize(this);" onmouseup="MouseUpToResize(this);"></font><%}%>
		<input type="hidden" id="frameName"name="frameName"value="<%=String.valueOf(cRow)+String.valueOf(cCol)%>"/>
 		<input type="hidden" id="frameRow"name="frameRow"value="<%=cRow %>"/>
 		<input type="hidden" id="frameCol"name="frameCol"value="<%=cCol %>"/>
 		<input type="hidden" id="framWidth"name="frameWidth"value=""/>
 		<input type="hidden" id="frameHeight"name="frameHeight"value=""/> 
		<div id="<%=String.valueOf(cRow)+String.valueOf(cCol) %>">
		<div id="roundbox" class="roundbox">
			<div class="roundboxTitleForm">
				<div class="roundboxTitle"style="cursor:move;"onMouseDown="Move('<%=String.valueOf(cRow)+String.valueOf(cCol)%>')">未定义</div>
				<div class="roundboxDelete"></div>
			</div>			
		<div style="height:100%"class="roundboxContent">
			
		</div>		
		</div>
		</div>
		<div onmouseout="this.style.filter='alpha(opacity=0)';"onmouseover="this.style.filter='alpha(opacity=100)';"style="filter:alpha(opacity=0);height:1;cursor:n-resize;"onmousedown="MouseDown(this);" onmousemove="MouseMove(this);" onmouseup="MouseUp(this);"><hr style="color:red"size="2"></div>
		</td>
		<%if(cCol==2){%></tr><%}%>
<%
 		if(cCol==1)cCol=2;
 		else {cRow++;cCol=1;} 
 	}
 }
 if(!rs.next()&&cCol==2){
 %>
 <td valign="top"<%if(cCol==1){%>width="<%=w1%>"<%}%>>
		<font onmouseout="this.style.filter='alpha(opacity=0)';"onmouseover="this.style.filter='alpha(opacity=100)';"class="resizeDivClass" onmousedown="MouseDownToResize(this);" onmousemove="MouseMoveToResize(this);" onmouseup="MouseUpToResize(this);"></font>
		<input type="hidden" id="frameName"name="frameName"value="<%=String.valueOf(cRow)+String.valueOf(cCol)%>"/>
 		<input type="hidden" id="frameRow"name="frameRow"value="<%=cRow %>"/>
 		<input type="hidden" id="frameCol"name="frameCol"value="<%=cCol %>"/>
 		<input type="hidden" id="framWidth"name="frameWidth"value=""/>
 		<input type="hidden" id="frameHeight"name="frameHeight"value=""/> 
		<div id="<%=String.valueOf(cRow)+String.valueOf(cCol) %>">
		<div id="roundbox" class="roundbox">		
			<div class="roundboxTitleForm">
				<div class="roundboxTitle"style="cursor:move;"onMouseDown="Move('<%=String.valueOf(cRow)+String.valueOf(cCol)%>')">未定义</div>
				<div class="roundboxDelete"></div>			
			</div>
		<div style="height:100%"class="roundboxContent">
			
			</div>			
		</div>
		</div>
		<div onmouseout="this.style.filter='alpha(opacity=0)';"onmouseover="this.style.filter='alpha(opacity=100)';"style="filter:alpha(opacity=0);height:1;cursor:n-resize;position:absolute;bottom:0"onmousedown="MouseDown(this);" onmousemove="MouseMove(this);" onmouseup="MouseUp(this);"><hr style="color:red"size="2"></div>
		</td>

 <%
 }
 %>
<%

}else{
%>
管理员个人首页还未定制!
<%}
}catch(Exception e){
%>
管理员个人首页还未定制!
<%
}finally{
	if(dba!=null){
		dba.close();
	}
}
%>
 </table>
 </form>
 </body>
</html>
