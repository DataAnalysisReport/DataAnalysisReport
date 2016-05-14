<%@ page language="java" contentType="text/html; charset=gbk" errorPage="../error.jsp"%>
<%@ taglib uri="/WEB-INF/runqianReport4.tld" prefix="report" %>
<%
	String paramFile = "/homepage/module/dashbraod_param.raq";
%>
<html>
<head><title>动态统计图的例子</title>
<script language="javascript">
	function getSeryType(){
		var radios = document.getElementsByName("seryType");
		var seryNameType = "";
		for(var i=0;i<radios.length;i++)
			if(radios[i].checked) seryNameType = radios[i].value;
		return seryNameType;
	}

	function selectSeryType(){
		var type = getSeryType();
		if(type=="exp"){
			document.getElementById("seryNameValue").parentElement.parentElement.style.display = "none";
			document.getElementById("seryViewName1").parentElement.parentElement.style.display = "";
		}
		else if(type=="value"){
			document.getElementById("seryNameValue").parentElement.parentElement.style.display = "";
			document.getElementById("seryViewName1").parentElement.parentElement.style.display = "none";
		}
	}

	// 提交查询
	function _submit_(frm){
		var category = document.createElement("INPUT");
		category.type = "HIDDEN";
		category.name = "categoryExp";
		//category.value = "=分组;"+frm.catViewName.value+";"+frm.catColName.value+";false";
		category.value = "="+frm.catViewWay.value+";"+frm.catViewName.value+";"+frm.catColName.value+";false";
		frm.appendChild(category);

		var seryName = document.createElement("INPUT");
		seryName.type = "HIDDEN";
		seryName.name = "seryNameExp";
		if(getSeryType()=="exp")
			//seryName.value = "=分组;"+frm.seryViewName1.value+";"+frm.seryColName1.value+";false";
			seryName.value = "="+frm.seryViewWay.value+";"+frm.seryViewName1.value+";"+frm.seryColName1.value+";false";
		else
			seryName.value = "\""+frm.seryNameValue.value+"\"";
		frm.appendChild(seryName);

		var seryValue = document.createElement("INPUT");
		seryValue.type = "HIDDEN";
		seryValue.name = "seryValueExp";
		//seryValue.value = "=求和;"+frm.seryViewName2.value+";"+frm.seryColName2.value;
		seryValue.value = "="+frm.seryValueWay.value+";"+frm.seryViewName2.value+";"+frm.seryColName2.value;
		frm.appendChild(seryValue);
		
		frm.action = "dashbroad.jsp";
		_submit(frm);
		
	}
</script>
</head>
<body>
<center>

<%--<%
	DBAccess dba = new DBAccess();
	ResultSet rs = null;
	String Graph_Name = null;
	String sql = "select Graph_Name from dashboard;";
	dba.startTransaction();
	rs = dba.executeQuery(sql);	
	while(rs.next()){
	Graph_Name = rs.getString("Graph_Name");
	dba.commit();
	dba.endTransaction();
	}
	%>--%>

	<report:param name="param1"
			paramFileName="<%=paramFile %>"
			needSubmit="no"
		/>

<script language="javascript">
	document.getElementById("seryNameValue").style.cssText = "";
	document.getElementById("seryNameValue").size = 39;
	selectSeryType();
	
	function show_help1(){
		var url = 'catViewExplain.html';
		window.open(url,"_blank","width=600,height=200");
	}
	function show_help2(){
		var url = 'seryNameType.html';
		window.open(url,"_blank","width=600,height=200");
	} 
	function show_help3(){
		var url = 'seryName.html';
		window.open(url,"_blank","width=600,height=200");
	}
	function show_help4(){
		var url = 'seryNameView.html';
		window.open(url,"_blank","width=600,height=200");
	}
	function show_help5(){
		var url = 'seryValueView.html';
		window.open(url,"_blank","width=600,height=200");
	}
</script>
<input type="button" value="查询" onclick="_submit_(param1)" style="cursor: hand;">

<hr>
</center>

</body>
</html>
