
/**
 *判断浏览器类型方法
 *
 */
function BrowserType(){
	var OsObject = "";
	if(navigator.userAgent.indexOf("MSIE")>0) {
		OsObject = "MSIE";
	}
	if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){
		OsObject = "Firefox";
	}
	if(isSafari=navigator.userAgent.indexOf("Safari")>0&&navigator.userAgent.indexOf("Chrome")<0) {
		OsObject = "Safari";
	}
	if(isCamino=navigator.userAgent.indexOf("Chrome")>0){
		OsObject = "Chrome";
	}
	return OsObject;
}

var fast_hidecol_sumheight;
var fast_hidecol_sumwidth;
var hideColHeaderArray; 
var showMenuTd=null;
var addBtnCell=new Array();//记录要加按钮的单元格
var cloneArr;//克隆单元格的原始信息
var clearHid=false;
$(document).click(function(event){
	if($("#menuDiv")[0]){
		if($(event.target).parents("#menuDiv").length>0|| $(event.target).attr("name")=="menuButton" || $(event.target).parent("div").attr("name")=="menuButton"){
		}else{
			removeMenu();
		}
	}

});

/** 初始化表格，给相应单元格添加按钮，并保存表格的一些原始信息**/
function addBtn(reportId){
	Resizeold(reportId,null,true);
	var sortData=null;
	var url=PathUtils.getRelativeUrl("/mis2/vrsr/json/demo1_action14.json");
	$.ajax({type:"POST", url:url, async:false, cache:false, data:{"resID":base64.encode(reportID),"reportDefineId":base64.encode(reportDefineId)}, dataType:"json", 
		success:function (data) {
			sortData=data;
		}, error:function () {
			alert("获取排序信息失败");
		}}
	);
	var cornerTableId = "report_"+reportId+"_table_corner";
	var colHeaderTableId = "report_"+reportId+"_table_colHeader"
	var cornerTable = $("#"+cornerTableId);
	var colHeaderTable = $("#"+colHeaderTableId);
	var dataTableId = "report_"+reportId+"_table_data";
	var dataTable = $("#"+dataTableId);

	colHeaderTable.attr("oldWidth",colHeaderTable.css("width"));
	dataTable.attr("oldWidth",dataTable.css("width"));

	var btn ="<div class='menuClass' name='menuButton' onclick='showMenu(this)'>" + $(IconFactory.getIcon("gezico_p_xialashuzhankai")).html() + "</div>";
	//给分组字段加按钮
	$(cornerTable.find("tr").get(0)).find("td").each(function(){
		var element=this;
		$.each(sortData.groupFields,function(i, item) {
			//if(item.label==$(element).html()){
			if(item.label==$(element)[0].innerText){
				if(item.data=='升序'){
					$(element).attr("sort","asc");
				}else{
					$(element).attr("sort","desc");
				}
			}
		});
//		$(this).attr("colName",$(this).html());
		$(this).append(btn);
//		$(this).css("position","relative");
//		$(this).children("div").eq(0).css("position", "absolute");
//		$(this).children("div").eq(2).css("z-index", "999");
//		$(this).children("div").eq(0).css("left",$(this).offset().left + $(this).outerWidth() - 10);
//		$(this).children("div").eq(0).css("top",$(this).offset().top + $(this).outerHeight() - 10);
		var menuButton = $(this).children("div[name='menuButton']");
		menuButton.find("i").removeClass("i1").css("color",$(this).css("color"));		
		menuButton.css("top",parseInt($(this).height()) - (parseInt(menuButton.offset().top) - parseInt($(this).offset().top))- 10 - 5);		
		if(window.navigator.userAgent.toLowerCase().indexOf("chrome") != -1){
			//Chrome下允许的字体最小为12px。所以图标使用transform进行缩放，重新设置右位移
			menuButton.css("right","8px");
		}
		menuButton.hide();
		//鼠标移入
		$(this).mouseover(function(){
			$(this).children("div[id=tmp]").children("div[name='menuButton']").show();
		});
		//鼠标移出
		$(this).mouseout(function(){
			if(	$(this).children("div[id=tmp]").children("div[name='menuButton']").attr("hasShow") != "true"){
				$(this).children("div[id=tmp]").children("div[name='menuButton']").hide();
			}
			if(	$(this).children("div[name='menuButton']").attr("hasShow") != "true"){
				$(this).children("div[name='menuButton']").hide();
			}
		});
		
		//下面代码影响横向双箭头
		
//		$(this).children("div").eq(0).css("right","-10px");  
//		if(parseInt($(this).css("height"))>50){ //区分处理复杂表头
//			//$(this).children("div").eq(0).css("top","50px");
//			$(this).children("div").eq(0).css("top",parseInt($(this).height())-10);
//			//$(this).children("div").eq(2).css("bottom","-10px");
//		}else{
//			$(this).children("div").eq(0).css("top","20px"); 
//			//$(this).children("div").eq(2).css("bottom","-10px");
//		}
		
		
		
	});
	
	//给数据列字段加按钮
	addBtnCell = new Array();
	$(colHeaderTable.find("tr").get(0)).find("td").each(function(index){
		addBtnCell[index] = $(this);
	});
	$(colHeaderTable).find("tr").each(function(){
		var tr = $(this)
		$(tr).find("td").each(function(index){
			var element=this;
			$.each(sortData.selectFields,function(i, item) {
				//if(item.label==$(element).html()){
				if(item.label==$(element)[0].innerText){
					if(item.data=='升序'){
						$(element).attr("sort","asc");
					}else{
						$(element).attr("sort","desc");
					}
				}
			});
			if($(this).css("display")!='none'){
				addBtnCell[index] = $(this);
				$(this).attr("oldCellHeight",$(this).css("height"));
				$(this).attr("oldColSpan",$(this).attr("colSpan"));
				$(this).attr("oldCellWidth",$(this).css("width"));
			}else{
				$(this).attr("oldCellHeight",$(this).css("height"));
				$(this).attr("oldColSpan",$(this).attr("colSpan"));
				$(this).attr("oldCellWidth",$(this).css("width"));
				
			}
		}); 
	});
	cloneArr = new Array();
	for(var i=0;i<addBtnCell.length;i++){
		var cell = $(addBtnCell[i]);
		cloneArr[i] = cell.css("height");
//		$(cell).attr("colName",$(cell).html());
		cell.append(btn);
//		cell.css("position","relative")
//		cell.children("div").eq(0).css("position", "absolute");
//		cell.children("div").eq(0).css("left",cell.offset().left + cell.outerWidth() - 10);
//		cell.children("div").eq(0).css("top",cell.offset().top + cell.outerHeight() - 10);
		var menuButton = $(cell).children("div[name='menuButton']");
		menuButton.find("i").removeClass("i1").css("color",cell.css("color"));
		menuButton.css("top",parseInt($(cell).height()) - (parseInt(menuButton.offset().top) - parseInt($(cell).offset().top))- 10 - 5);		
		if(window.navigator.userAgent.toLowerCase().indexOf("chrome") != -1){
			//Chrome下允许的字体最小为12px。所以图标使用transform进行缩放，重新设置右位移	
			menuButton.css("right","8px");
		}
		
		menuButton.hide();
		//鼠标移入
		$(cell).mouseenter(function(){
			$(this).children("div[id=tmp]").children("div[name='menuButton']").show();
		});
		//鼠标移出
		$(cell).mouseleave(function(){
			if(	$(this).children("div[id=tmp]").children("div[name='menuButton']").attr("hasShow") != "true"){
				$(this).children("div[id=tmp]").children("div[name='menuButton']").hide();
			}
			if(	$(this).children("div[name='menuButton']").attr("hasShow") != "true"){
				$(this).children("div[name='menuButton']").hide();
			}
		});
		
//		cell.children("div").eq(0).css("right","-10px");
//		if(parseInt(cloneArr[i])>50){  //区分处理复杂表头
//			//cell.children("div").eq(0).css("top","50px");
//			cell.children("div").eq(0).css("top",parseInt(cloneArr[i])-10);
//			//cell.children("div").eq(2).css("bottom","-10px");
//		}else{
//			cell.children("div").eq(0).css("top","20px");
//			//cell.children("div").eq(2).css("bottom","-10px");
//
//		}
		//cell.children("div").eq(0).css("left",cell.offsetLeft+cell.offsetWidth-10);
		
	}

}
//弹出菜单div
function showMenu(div){
	//var td = $(div).parent("td");
	var td = $(div).parent("div").parent("td")
	var offset = td.offset();
		var newDivX=parseInt(offset.left) + td.outerWidth(true) - 10;
		var newDivY=parseInt(offset.top) + td.outerHeight(true);
		if($.browser.msie&&parseInt($.browser.version)<=8){
			var offset =  $(div).offset();
			newDivX =offset.left;
			var table = $(div).parents("table:last");
			newDivY = $(div).attr("offsetTop")+$(table).attr("offsetTop");
		}
		if(showMenuTd){
			removeMenu();
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
		var height = 0;
		var footheight=$("span[class='foot']").height();
		if(!footheight){
			footheight=0;
		}
		if($('#tableDiv').attr('clientHeight')){
			 height = $('#tableDiv').attr('clientHeight') - newDivY-footheight;
		}else{
			 height = $('#tableDiv').height() - newDivY-footheight;
		}
		createDiv.style.position = "absolute";
		createDiv.style.background = "#F6f6f6";
		//判断弹出层如果超出页面范围，则left属性往左移动保证弹出层能显示在当前屏幕中
		if(parseInt(newDivX)+166>$(document.body).width()){
			newDivX = parseInt(newDivX)-166;
		}
		createDiv.style.left=newDivX;
		createDiv.style.top =newDivY;
		var base64 = new Base64();
		$(createDiv).html("<iframe id='menuIframe' name='menuIframe' width='100%' height='100%'  frameborder='no' border='0' src='customer/setReportCol.jsp?colIndex="+$(div).parent().parent().attr("colindex")+"&colName="+base64.encode($(div).parent().parent().attr("colName"))+"&schema="+schema+"&sort="+$(div).parent().parent().attr("sort")+"&tablePosition="+$(div).parent().parent().attr("tablePosition")+"'></iframe>");
		if($.browser.msie&&parseInt($.browser.version)<=8){
			document.getElementById("tableDiv").appendChild(createDiv);
		}else{
			document.body.appendChild(createDiv);
		}
		//iframe加载完再设置弹出层高度
		var myIFrame = $("#menuIframe");
		var isOnLoad = true;  
		myIFrame.load(function() { 
			isOnLoad = false;// 加载完成 
			try{
				var setContentHeight = $(".setContent",window.frames["menuIframe"].contentWindow.document).height();
			}catch(e){
				var setContentHeight = $(".setContent",window.frames["menuIframe"].document).height();				
			}
			if(height>setContentHeight){
				//+10边框宽度
				if("Chrome"==BrowserType()||"Firefox"==BrowserType()){
					createDiv.style.height = setContentHeight+2;
					createDiv.style.width = 164;//加上滚动条宽度
				}else{
					if($.browser.msie&&parseInt($.browser.version)==8){
						createDiv.style.height = setContentHeight+3;
						createDiv.style.width = 163;//加上滚动条宽度
					}else{
						createDiv.style.height = setContentHeight+7;
						createDiv.style.width = 166;//加上滚动条宽度
					}
				}
				
			}else{
				createDiv.style.height = height;
				createDiv.style.width = 185;//加上滚动条宽度
			}
			
		});
	}else{
		$(div).attr("hasShow",false);
	}
}

function test(div){
	var v = $(div).parent().attr("v");
	hideCol(v,12066);
}

function vrsrHideCol(v,reportId){
	var colHeaderTableId = "report_"+reportId+"_table_colHeader";
	var colHeaderTable = $("#"+colHeaderTableId);
	var cell = colHeaderTable.find("td[v="+v+"]").get(0);
	var nodeIndex = parseInt($(cell).attr("nodeIndex")); 
	var colId = parseInt($(cell).attr("colId"));
	var sizset = $(cell).parent().attr("sizset");
	fast_hidecol_sumwidth = $(cell).css("width").substring(0,$(cell).css("width").length-2);	
	var miniColSpan = 1;
	//父级节点的colSpan谷歌单独处理
	if("Chrome"==BrowserType()||"Firefox"==BrowserType()){	
		var tr = $(colHeaderTable).find("tr").get(0);
		$(tr).children().each(function(){
				if(parseInt($(this).attr("colId"))==colId){
					if($(this).css("display")=="none"||$(this).attr("oldColSpan")!=undefined){
						//处理父级节点的colSpan
						deleteFatherColSpanForGoogle(colHeaderTable,miniColSpan,colId);
						sizset=1;
					}
				}	
		});
	}

	//隐藏colheaderTable中的单元格
	hideColHeaderArray = new Array();
	hideColHeaderArray.push($(cell));
	
	//处理父级节点的colSpan
	if(sizset>0){
		if("Chrome"!=BrowserType()&&"Firefox"!=BrowserType()){
			deleteFatherColSpan(colHeaderTable,miniColSpan,sizset-1,nodeIndex);
		}		
	}else{
		var newWidth = parseInt( $(cell).css("width").substring(0,$(cell).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
		$(this).css("width",newWidth+"px");
		var newTableWidth =  parseInt( $(colHeaderTable).css("width").substring(0,$(colHeaderTable).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
		$(colHeaderTable).css("width",newTableWidth+"px");
	}
	
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
	dataTable.find("td[colId="+colId+"]").each(function(){
		$(this).attr("vr_hide_cell","true");
		$(this).hide();
	});	
	//处理title，foot 宽度
	var table_title_span = $("#report_"+reportId+"_table_title_div span");
	var table_foot_span = $("#report_"+reportId+"_table_foot_div span");
	var newTitlefootDivWidth ;
	if(BrowserType()=="Chrome"||BrowserType()=="Firefox"){
		newTitlefootDivWidth = parseInt( $(table_title_span).width())-parseInt(fast_hidecol_sumwidth);
	}else{
		newTitlefootDivWidth = parseInt( $(table_title_span).get(0).clientWidth)-parseInt(fast_hidecol_sumwidth);
	}
	$(table_title_span).css("width",newTitlefootDivWidth+"px");
	$(table_foot_span).css("width",newTitlefootDivWidth+"px");
}
function vrsrHideFields(v,reportId){
	var colHeaderTableId = "report_"+reportId+"_table_colHeader";
	var colHeaderTable = $("#"+colHeaderTableId);
	var cell = colHeaderTable.find("td[v="+v+"]").get(0);
	var nodeIndex = parseInt($(cell).attr("nodeIndex")); 

	var colId = parseInt($(cell).attr("colId"));
	var sizset = parseInt($(cell).parent().attr("sizset"));
	fast_hidecol_sumwidth = $(cell).css("width").substring(0,$(cell).css("width").length-2);

	//隐藏colheaderTable中的单元格
	hideColHeaderArray = new Array();
	hideColHeaderArray.push($(cell));
	
	//处理父级节点的colSpan
	var miniColSpan = 1;
	if(sizset>0){
		deleteFatherColSpan(colHeaderTable,miniColSpan,sizset-1,nodeIndex);
	}else{
		var newWidth = parseInt( $(cell).css("width").substring(0,$(cell).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
		$(this).css("width",newWidth+"px");
		var newTableWidth =  parseInt( $(colHeaderTable).css("width").substring(0,$(colHeaderTable).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
		$(colHeaderTable).css("width",newTableWidth+"px");
	}
	
	fast_hidecol_sumheight = 0;
	
	for(var j=0;j<hideColHeaderArray.length;j++){
		var cell = hideColHeaderArray[j];
		var cellHeight = $(cell).css("height").substring(0,$(cell).css("height").length-2);
		fast_hidecol_sumheight = fast_hidecol_sumheight+parseInt(cellHeight);
	}
	for(var i=0;i<hideColHeaderArray.length;i++){
		var cell = hideColHeaderArray[i];
		$(cell).attr("vr_hide_field","true");
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
	dataTable.find("td[colId="+colId+"]").each(function(){
		$(this).attr("vr_hide_field","true");
		$(this).hide();
	});	
	
	//处理title，foot 宽度
	var table_title_span = $("#report_"+reportId+"_table_title_div span");
	var table_foot_span = $("#report_"+reportId+"_table_foot_div span");
	var newTitlefootDivWidth = parseInt( $(table_title_span).get(0).clientWidth)-parseInt(fast_hidecol_sumwidth);
	$(table_title_span).css("width",newTitlefootDivWidth+"px");
	$(table_foot_span).css("width",newTitlefootDivWidth+"px");
}
function deleteFatherColSpanForGoogle(colHeaderTable,miniColSpan,colId){
	var newTableWidth =  parseInt( $(colHeaderTable).css("width").substring(0,$(colHeaderTable).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
	if("Firefox"==BrowserType()){newTableWidth = newTableWidth+1;}
	$(colHeaderTable).css("width",newTableWidth+"px");
	var tr = $(colHeaderTable).find("tr").get(0);
	$(tr).children().each(function(){
		var fatherTdNodeIndex = parseInt($(this).attr("colId"))+parseInt($(this).attr("oldColSpan"))-1;
		if(parseInt($(this).attr("colId"))<=colId&&colId<=fatherTdNodeIndex){
			if(parseInt($(this).attr("colId"))==colId&&$(this).css("display")!="none"&&$(this).attr("colSpan")==miniColSpan){
				//hideColHeaderArray.push($(this));
				//$(this).hide();	
			}else{
				var newColSpan = parseInt($(this).attr("colSpan"))-parseInt(miniColSpan);
				$(this).attr("colSpan",newColSpan);	
				if($(this).css("display")!="none"&&$(this).attr("colSpan")==0){
					$(this).hide();	
				}
			}
			if($(this).css("display")!="none"){
				var newWidth = parseInt( $(this).css("width").substring(0,$(this).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
				$(this).css("width",newWidth+"px");
			}
		}
	});
}

//处理父级单元格的colSpan和宽度
function deleteFatherColSpan(colHeaderTable,miniColSpan,sizset,nodeIndex){
	var newTableWidth =  parseInt( $(colHeaderTable).css("width").substring(0,$(colHeaderTable).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
	$(colHeaderTable).css("width",newTableWidth+"px");
	var tr = $(colHeaderTable).find("tr[sizset="+sizset+"]").get(0);
	$(tr).children().each(function(){
		var fatherTdNodeIndex = parseInt($(this).attr("nodeIndex"))+parseInt($(this).attr("oldColSpan"))-1;
		if(parseInt($(this).attr("nodeIndex"))<=nodeIndex&&nodeIndex<=fatherTdNodeIndex){
			if(parseInt($(this).attr("nodeIndex"))==nodeIndex&&$(this).css("display")!="none"&&$(this).attr("colSpan")==miniColSpan){
				hideColHeaderArray.push($(this));
				//$(this).hide();	
			}else{
				var newColSpan = parseInt($(this).attr("colSpan"))-parseInt(miniColSpan);
				$(this).attr("colSpan",newColSpan);	
				if($(this).css("display")!="none"&&$(this).attr("colSpan")==0){
					$(this).hide();	
				}
			}
			if(sizset>0){
				deleteFatherColSpan(colHeaderTable,miniColSpan,sizset-1,nodeIndex);
			}
			if(sizset==0&&$(this).css("display")!="none"){
				var newWidth = parseInt( $(this).css("width").substring(0,$(this).css("width").length-2))-parseInt(fast_hidecol_sumwidth);
				$(this).css("width",newWidth+"px");
			}
		}
	});
}
var cancleJson = new Object(); //用于获取原set方法Json参数值
//展现隐藏列
function showCol(reportId){
	cancleSet(cancleJson);
	if(!reportId){
		reportId=viewer.reportId;
	}
	clearHid=true;
	var colHeaderTableDivId = "report_"+reportId+"_table_colHeader_div";
	var colHeaderTableDiv = $("#"+colHeaderTableDivId);
	var colHeaderTableId = "report_"+reportId+"_table_colHeader";
	var colHeaderTable = $("#"+colHeaderTableId);
	var dataTableId = "report_"+reportId+"_table_data";
	var dataTable = $("#"+dataTableId);
	colHeaderTable.find("td[vr_hide_cell=true]").each(function(){
		$(this).show();
	});
	dataTable.find("td[vr_hide_cell=true]").each(function(){
		$(this).show();
	});
	//colHeaderTable.find("td").each(function(){
		//$(this).css("width",$(this).attr("oldCellWidth"));
		//$(this).css("height",$(this).attr("oldCellHeight"));
		//$(this).attr("colSpan",$(this).attr("oldColSpan"));
	//});
	if("Chrome"==BrowserType()){			
		//colHeaderTable.css("width",colHeaderTableDiv.width());
		//dataTable.css("width",colHeaderTableDiv.width());	
	}else{
		colHeaderTable.css("width",colHeaderTable.attr("oldWidth"));
		dataTable.css("width",dataTable.attr("oldWidth"));
	}
}
function removeMenu(){
	$("div[name='menuButton']").attr("hasShow",false).hide();
	showMenuTd=null;
	$("#menuDiv").remove();
}
function set(json){
	cancleJson = json;  //获取json参数，供cancleSet方法调用
	var colIndex=json.colIndex;
	var hideCol=false;
	var base64 = new Base64();
	if(json.visible=="false"||json.visible==false){
		hideCol=true;
		viewer.reportConfig.hiddenFields[viewer.reportConfig.hiddenFields.length]=json.colName;
	}
	if(clearHid){
		viewer.reportConfig.hiddenFields=new Array();
	}
	setJson="{colName:\""+base64.encode(json.colName)+"\",clearHid:\""+clearHid+"\",inVisible:\""+hideCol+"\",sort:\""+json.sort+"\",filterData:[";
	clearHid=false;
	if(schema=='design'){//设计界面模式
		try{
			var filterData=json.filterData.toString();
			if(filterData==""){
				filterData="NODATA";
			}
			parent.parent.setFieldFilter(colIndex,filterData);
		}catch(e){
		}
		try{
			var sortMode=json.sort.toString();
			parent.parent.setFiledOrder(colIndex,sortMode);
		}catch(e){
		}
	}
	/*var colJson = getColData(json.colName);
	var dataNum = colJson.dataNum;
	var filterData = colJson.data;

	if(dataNum < 10){
			var temp=json.filterData;
		var b=false;
    	for(var i=0;i<dataNum;i++){
    		var bool=true;
			for(var j=0;j<temp.length;j++){
				if(temp[j]!=filterData[i]){
					bool=false;
					break;
				}
			}
			if(bool){
				b=true;
				setJson+=filterData[i]+",";
			}
		}
    	if(b){
			setJson=setJson.substring(0,setJson.length-1);
		}
	}*/
	
	var dataNum = json.filterData.length;
	var filterData = json.filterData;
	if(dataNum < 10&&dataNum>0){
		for(var i=0;i<dataNum;i++){
			setJson+="\""+base64.encode(filterData[i])+"\",";
		}
		setJson=setJson.substring(0,setJson.length-1);	
	}
	setJson+="]}";
	refreshData="no";
	removeMenu();
	//viewer.initPageCount();
	viewer.pageChangedHandler();
}

function cancleSet(json){
	var colIndex=json.colIndex;
	var hideCol=false;
	var base64 = new Base64();
	setJson="{colName:\""+base64.encode(json.colName)+"\",clearHid:\""+true+"\",inVisible:\""+false+"\",sort:\""+json.sort+"\",filterData:[";	
	var dataNum = json.filterData.length;
	var filterData = json.filterData;
	if(dataNum < 10&&dataNum>0){
		for(var i=0;i<dataNum;i++){
			setJson+="\""+base64.encode(filterData[i])+"\",";
		}
		setJson=setJson.substring(0,setJson.length-1);	
	}
	setJson+="]}";
	refreshData="no";
	removeMenu();
	viewer.pageChangedHandler();
}

//字段设置
function  setFieldDetail(names,tablePosition){
	var fieldName = names.substr(names.indexOf("-_-")+3);
	var base64 = new Base64();
	var action = 28;//列表字段为28，分组字段为30
	if(tablePosition == "corner"){
		action = 30;
	}
	$.ajax({
		url:PathUtils.getRelativeUrl("showFastReportServlet"),
		data:{"action":action,"fieldName":base64.encode(fieldName),"reportDefineId":base64.encode(reportDefineId),"resID":base64.encode(reportID),"time":new Date().getTime()},
		cache:false,
		success:function(data){
			try{data = eval('(' + data + ')');}catch(e){}
			if(typeof data == "object"){
				var fieldInfo = formatFieldInfo(data);
				if(action == 30){//分组字段
					var width = 400;
					var height = 240;
				}else{//列表字段
					var width = 480;
					var height = 320;
				}
				var url=PathUtils.getAbsoluteJspUrl("vrsr/show/customer/fastFieldSetDetail.jsp?fieldName=" + base64.encode(fieldName) + "&reportDefineId="+base64.encode(reportDefineId)+"&resID="+base64.encode(reportID)+"&fieldInfo="+base64.encode(fieldInfo));
				showDialog(url,"fastReportField",fieldName,height,width,null, null, null , null, null, null,null,true,null,false,true);
			}
		},
		error:function(){
			alert("获取字段信息请求失败！");
		}
	});
}

//格式化字段信息
function formatFieldInfo(data){
	var fieldInfo = {};
	for(var key in data){
		if(key == "title"){
			fieldInfo["dispValue"] = data[key][0];
		}else{
			fieldInfo[key] = data[key][0];
		}
	}
	
	fieldInfo = JSON.stringify(fieldInfo);
	return fieldInfo;
}

//高级设置
function WarningPropertiesSet(params){
	var swfNameAndPath = "fastReport/analysis/swf/WarningPropertiesAnalyse.swf";
	var url=PathUtils.getAbsoluteJspUrl("fastReport/analysis/testPopUp.jsp?appName="+swfNameAndPath+"&params="+params);
	var wid =850;
	var height = 450;
	showDialog(url,"swfWindow","预警属性设置",height,wid,null, null, null, true, null, null,null,true,null,false);
}

//预警设置确定
function warningProBack(params){
	//var result = decode(params);
	var result = params;
	if(typeof window.frames["dialogframefastReportField"] != "undefined"){
		window.frames["dialogframefastReportField"].setBackValue("alarmString",result);
	}
	closeDialog("swfWindow");	
}
//预警设置窗口关闭
function closeSwfWindow(backParams){
	closeDialog("swfWindow");
}
//显示格式设置-其它格式回调
function contentStyleBack(from,result){
	if(typeof window.frames["dialogframefastReportField"] != "undefined"){
		window.frames["dialogframefastReportField"].contentStyleBack(from,result);
	}
	closeDialog("swfWindowContentStyleMore");
}
//显示格式设置-其它格式弹窗关闭
function closeContentSWF(){
	closeDialog("swfWindowContentStyleMore");
}





