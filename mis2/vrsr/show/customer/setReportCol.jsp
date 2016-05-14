<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.runqianapp.common.util.Base64Util"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String colName =Base64Util.Base64Decode(request.getParameter("colName"));
if(colName.indexOf("<")!=-1){ //对应任务53990，火狐带通用查询下出错，先在此进行判断修正
	colName = colName.substring(0,colName.indexOf("<"));
}
String tablePosition=request.getParameter("tablePosition");
String colIndex =request.getParameter("colIndex");
String sort =request.getParameter("sort");
String schema=request.getParameter("schema");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>"></base>
    
    <title>设置报表展现的列</title>
    
	    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link href="<%=path%>/mis2/vrsr/show/customer/css/setReportCol.css" rel="stylesheet" type="text/css"> 
    <script src="<%=path%>/mis2/gezComponents/jquery/jquery.js" type="text/javascript"></script>
    <script src="<%=path%>/mis2/gezComponents/jquery-toolbar/js/rqtoolbar.js" type="text/javascript" ></script> 
	<script src="<%=path%>/mis2/vrsr/show/customer/js/setReportCol.js" type="text/javascript" ></script>
	<link href="<%=path%>/mis2/gezComponents/tabs/css/themes/base/jquery.ui.all.css" rel="stylesheet" type="text/css">

	
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/commonQuery/jsCommonQuery/configJs/func.js"></script>
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/commonQuery/jsCommonQuery/configJs/QueryPanel.js"></script>
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/commonQuery/jsCommonQuery/configJs/configPanel.js"></script>
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/custom/commonquery/js/customEditStyle.js"></script>
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/custom/commonquery/js/customCQ.js"></script>
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/gezComponents/jquery/jqueryui/jqueryuijs/jqueryui.js"></script>
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/gezComponents/form/js/jquery.ui.core.js"></script>
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/gezComponents/jquery-toolbar/ui/jquery.ui.widget.js"></script>
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/gezComponents/formstyle/js/form.js"></script>
	<script language="javascript" charset="UTF-8" src="<%=path%>/mis2/gezComponents/datetime/js/rqdatetimeadvance.js"></script>
	<link rel="stylesheet" type="text/css" href="<%=path%>/mis2/custom/commonquery/css/customEditStyle.css">
	<link rel="stylesheet" type="text/css" href="<%=path%>/mis2/gezComponents/jquery/jqueryui/jqueryuicss/jqueryui.css">
	<link rel="stylesheet" type="text/css" href="<%=path%>/mis2/gezComponents/jquery/jquerytreeview/css/resTree/jquery.treeview.css">
	<link rel="stylesheet" type="text/css" href="<%=path%>/mis2/gezComponents/jquery-toolbar/css/jquery.toolbar.css">
	<link rel="stylesheet" type="text/css" href="<%=path%>/mis2/gezComponents/jquery-toolbar/css/jquery.ui.theme.css">
	<link rel="stylesheet" type="text/css" href="<%=path%>/mis2/gezComponents/formstyle/css/form.css">
	<link rel="stylesheet" type="text/css" href="<%=path%>/mis2/commonQuery/jsCommonQuery/configCss/queryPanel.css">

	<script>
	    var appPath = "<%=path %>";
	    var colName = "<%=colName %>";
		var colIndex = <%=colIndex %>;
		var sortMode = "<%=sort %>";//排序方式，auto-默认方式，desc-降序，asc-升序
		var schema = "<%=schema %>";
		var isVisible = "true";//是否隐藏该列，true-显示列，false-隐藏列
		$(function(){
			$("#btn_clearCheck").button();
			$("#btn_otherOption").button();
			$("#btn_submit").button();
			$("#btn_reset").button();
			selectSortMode(sortMode);
		});
	</script>
  </head>
  <body>
    <div class="setContent">
         <div id="sortMode" class="setContentDiv" style="overflow:auto">
			 <script type="text/javascript">
				if(schema=="design"&&sortMode=="undefined"){
					$("#sortMode").removeClass("setContentDiv");
				}
			 </script>
             <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:3px;">
				 <%if(("asc").equals(sort)||("desc").equals(sort)){ %>				 
                 <tr onclick="selectSortMode('asc');">
                    <td width="30px" align="center"><img src="<%=path %>/mis2/vrsr/show/images/sortpriority.png"></img></td>
                    <td width="24px" id="ascMode"></td>
                    <td><span>升序</span></td>
                 </tr>
                 <tr onclick="selectSortMode('desc');">
                    <td align="center"><img src="<%=path%>/mis2/vrsr/show/images/sortpriority2.png"></img></td>
                    <td id="descMode"></td>
                    <td><span>降序</span></td>
                 </tr>
				<%}%>

				  <%if(schema==null||!schema.equals("design")){
				 %>
	
                 <%if(!"corner".equals(tablePosition)){ %>
	<!--//暂时去除隐藏本列
                 <tr onclick="isColVisible();">
                    <td width="30px" align="center"><img src="<%=path %>/mis2/vrsr/show/images/hideCol.jpg"></img></td>
                    <td width="24px" id="hideCol"></td>
                    <td><span>隐藏本列</span></td>
                 </tr>
				 -->
                 <%}%>
				  <%}%>
             </table>
         </div>
         <div id="filterMode" class="setContentDiv">
             <ul id="filterDatas">
                 <li>
                    <input type="checkbox" id="selall" onclick="selAll();" checked="true"></input><span>全选</span>
                 </li>
             </ul>
             <div id="filterBtns">
                 <button class="sr_button" id="btn_clearCheck" onclick="disAll();">清除选中项</button>
                 <!-- <button onclick="parent.refresh=false;parent.popUpSetWindow('filterSet')">条件筛选</button> -->
                 <%if(schema==null||!schema.equals("design")){
				 %>
				 <div id="otherSetContent" class="setContentDiv">
		         </div>

         		<button class="sr_button"  id="btn_otherOption" onclick="parent.refresh=false;parent.popUpSetFiledWindow('setDetail-_-'+colName,'<%= tablePosition%>')"><img src="<%=path %>/mis2/vrsr/show/images/basicset.png"></img>其他设置</button>
				 <%
				 }%>
		         
             </div>
         </div>
         <div id="toolbar" style="margin:5px 3px;">
             <button class="sr_button" onclick="set();" id="btn_submit">确定</button>
             <button class="sr_button" onclick="parent.removeMenu();" style="margin-left:30px;" id="btn_reset">取消</button>
         </div>
    </div>
  </body>
</html>
