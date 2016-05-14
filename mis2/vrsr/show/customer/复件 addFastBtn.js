var fast_hidecol_sumheight;
var fast_hidecol_sumwidth;
var hideColHeaderArray;
var showMenuTd=null;

$(document).click(function(event){
	if($("#menuDiv")[0]){
		if($(event.target).parents("#menuDiv").length>0||$(event.target).attr("name")=="menuButton"){
		}else{
			$(showMenuTd).attr("hasShow",false);
			removeMenu();
		}
	}
});
function addBtn(reportId){
	var cornerTableId = "report_"+reportId+"_table_corner";
	var colHeaderTableId = "report_"+reportId+"_table_colHeader"
	var cornerTable = $("#"+cornerTableId);
	var colHeaderTable = $("#"+colHeaderTableId);
	var btn ="<div class='menuClass' name='menuButton' onclick='showMenu(this)'></div>";
	//给分组字段加按钮
	$(cornerTable.find("tr").get(0)).find("td").each(function(){
		$(this).attr("colName",$(this).html());
		$(this).append(btn);
		$(this).children("div").eq(0).css("position", "absolute");
		$(this).children("div").eq(0).css("left",$(this).offsetLeft+$(this).offsetWidth-10);
	});
	
	//给数据列字段加按钮
	var addBtnCell = new Array();
	$(colHeaderTable.find("tr").get(0)).find("td").each(function(index){
		addBtnCell[index] = $(this);
	});
	$(colHeaderTable).find("tr").each(function(){
		var tr = $(this)
		$(tr).find("td").each(function(index){
			if($(this).css("display")!='none'){
				addBtnCell[index] = $(this);
			}
		});
	});
	for(var i=0;i<addBtnCell.length;i++){
		var cell = $(addBtnCell[i]);
		$(cell).attr("colName",$(cell).html());
		cell.append(btn);
		cell.children("div").eq(0).css("position", "absolute");
		cell.children("div").eq(0).css("left",cell.offsetLeft+cell.offsetWidth-10);
	}

}
//弹出菜单div
function showMenu(div){
	var newDivX = $(div).attr("offsetLeft");
	var newDivY = $(div).attr("offsetTop")+20;
	
	
		if(showMenuTd){
			$("#menuDiv").remove();
		}
		showMenuTd=this;
		if(!$(div).attr("hasShow")){
			$(div).attr("hasShow",false);
		}
	if($(div).attr("hasShow")=="false"){
		$(div).attr("hasShow",true);
		var createDiv=document.createElement("div");
		createDiv.id="menuDiv";
		createDiv.style.width = 200;
	    createDiv.style.height = 400;
		createDiv.style.position = "absolute";
		createDiv.style.background = "#F6f6f6";
	
	    createDiv.style.left=newDivX;
	    createDiv.style.top =newDivY;
		var base64 = new Base64();
	    $(createDiv).html("<iframe id='menuIframe' width='100%' height='100%' src='customer/setReportCol.jsp?colName="+base64.encode($(div).parent().attr("colName"))+"'></iframe>");
		document.getElementById("tableDiv").appendChild(createDiv);
	}else{
		$(div).attr("hasShow",false);
	}
}

function removeMenu(){
		showMenuTd=null;
	$("#menuDiv").remove();
}
function test(div){
	var v = $(div).parent().attr("v");
	hideCol(v,12066);
}

function hideCol(v,reportId){
	var colHeaderTableId = "report_"+reportId+"_table_colHeader";
	var colHeaderTable = $("#"+colHeaderTableId);
	var cell = colHeaderTable.find("td[v="+v+"]").get(0);
	var nodeIndex = parseInt($(cell).attr("nodeIndex")); 
	var cellIndex = parseInt($(cell).attr("nodeIndex"))-1;
	var sizset = parseInt($(cell).parent().attr("sizset"));
	fast_hidecol_sumwidth = $(cell).css("width").substring(0,$(cell).css("width").length-2);

	var addBtnCell = new Array();
	var cloneArr = new Array();
	$(colHeaderTable.find("tr").get(0)).find("td").each(function(index){
		addBtnCell[index] = $(this);
	});
	$(colHeaderTable).find("tr").each(function(){
		var tr = $(this)
		$(tr).find("td").each(function(index){
			if($(this).css("display")!='none'){
				addBtnCell[index] = $(this);
			}
		});
	});
	for(var i=0;i<addBtnCell.length;i++){
		cloneArr[i] = $(addBtnCell[i]).css("height");
	}

	//隐藏colheaderTable中的单元格
	hideColHeaderArray = new Array();
	hideColHeaderArray.push($(cell));
	
	//处理父级节点的colSpan
	var miniColSpan = 1;
	deleteFatherColSpan(colHeaderTable,miniColSpan,sizset-1,nodeIndex);
	fast_hidecol_sumheight = 0;
	
	for(var j=0;j<hideColHeaderArray.length;j++){
		var cell = hideColHeaderArray[j];
		var cellHeight = $(cell).css("height").substring(0,$(cell).css("height").length-2);
		fast_hidecol_sumheight = fast_hidecol_sumheight+parseInt(cellHeight);
	}
	for(var i=0;i<hideColHeaderArray.length;i++){
		var cell = hideColHeaderArray[i];
		$(cell).attr("vr_hide_cell","true");
		$(cell).hide();
	}
	//处理字段在首行的的td的高度
	
	for(var i=0;i<addBtnCell.length;i++){
		var cell = $(addBtnCell[i]);
		if(cell.parent().attr("sizset")==0){
			var oldCellHeight = cloneArr[i];
			var cellHeight = oldCellHeight.substring(0,oldCellHeight.length-2);
			var newHeight = parseInt(cellHeight)-parseInt(fast_hidecol_sumheight);
			cell.css("height",newHeight+"px");
		}
	}

	//隐藏table_data中的单元格
	var dataTableId = "report_"+reportId+"_table_data";
	var dataTable = $("#"+dataTableId);
	var newTableWidth =  parseInt( $(dataTable).css("width").substring(0,$(dataTable).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
	$(dataTable).css("width",newTableWidth+"px");
	dataTable.find("td[cellIndex="+cellIndex+"]").each(function(){
		$(this).attr("vr_hide_cell","true");
		$(this).hide();
	});	
}



function deleteFatherColSpan(colHeaderTable,miniColSpan,sizset,nodeIndex){
	var tr = $(colHeaderTable).find("tr[sizset="+sizset+"]").get(0);
	$(tr).children().each(function(){
		var fatherTdNodeIndex = parseInt($(this).attr("nodeIndex"))+parseInt($(this).attr("colSpan"))-1;
		if(parseInt($(this).attr("nodeIndex"))<=nodeIndex&&nodeIndex<=fatherTdNodeIndex){
			if(parseInt($(this).attr("nodeIndex"))==nodeIndex&&$(this).css("display")!="none"&&$(this).attr("colSpan")==miniColSpan){
				hideColHeaderArray.push($(this));
				//$(this).hide();	
			}else{
				var newColSpan = parseInt($(this).attr("colSpan"))-parseInt(miniColSpan);
				$(this).attr("colSpan",newColSpan);	
			}
			if(sizset>0){
				deleteFatherColSpan(colHeaderTable,miniColSpan,sizset-1,nodeIndex);
			}
			if(sizset==0&&$(this).css("display")!="none"){
				//$(this).attr("fatherTd","ture");
				//var totalWidth = $(this).attr("oldWidth")+parseInt(fast_hidecol_sumwidth);
				//$(this).attr("oldWidth",totalWidth);
				var newWidth = parseInt( $(this).css("width").substring(0,$(this).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
				$(this).css("width",newWidth+"px");
				var newTableWidth =  parseInt( $(colHeaderTable).css("width").substring(0,$(colHeaderTable).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
				$(colHeaderTable).css("width",newTableWidth+"px");
			}
		}
	});
}
//展现隐藏列
function showCol(reportId){
	var colHeaderTableId = "report_"+reportId+"_table_colHeader";
	var colHeaderTable = $("#"+colHeaderTableId);
	colHeaderTable.find("td[vr_hide_cell=true]").each(function(){
		$(this).show();
	});
}
function set(json){
	setJson="{colName:\""+json.colName+"\",sort:\""+json.sort+"\",filterData:[";
	var temp=json.filterData;
	if(temp.length>0){
		setJson+=temp[0];
	}
	for(var i=1;i<temp.length;i++){
		setJson+=","+temp[i];
	}
	setJson+="]}";
	if(json.visible=="false"){
		hideCol(json.colName,viewer.reportId);
	}
	refreshData="no";
	viewer.initPageCount();
	removeMenu();
}