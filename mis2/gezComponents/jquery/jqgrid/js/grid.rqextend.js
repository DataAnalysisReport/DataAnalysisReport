function rqGridNormal(){
	this.tableId;
	this.mSelect=true;
	this.colModel = null;
	this.height="100%";
	this.width = 0;
	this.idcol = false;
	this.pager = false;
	this.showTip = true;
	this.repeatitems = false;
	this.isEditable = false;     //标识列表是否为可编辑状态，true为可编辑状态，false为不可编辑状态.
	this.newRowNum = 0;
	this.editParams = {
		"keys":true,
		"oneditfunc" : function(id){
			//编辑前调用
			return true;
		},
		"successfunc" : function(){
			//接收服务器请求后调用
			return true;
		},
		"url" : null,
       	"extraparam" : {},
		"aftersavefunc" : function(){
			//前台保存后调用
			return true;
		},
		"errorfunc": null,
		"afterrestorefunc" : null,
		"restoreAfterError" : true,
		"mtype" : "POST"
	};
	this.editStates=null;
}
/** 使表格可编辑 */
rqGridNormal.prototype.letGridEdit = rqGridedit;
/**	让表格不可编辑	*/
rqGridNormal.prototype.letGridNotEdit = fnletGridNotEdit;
/** 设置样式 */
rqGridNormal.prototype.rqDefaultStyle = rqGridStyle;
/** 列内文字调整 */
rqGridNormal.prototype.jqgridTextResize = JQtextResize;
/** 设置宽度 */
rqGridNormal.prototype.setWidth = JQSetWidth;
/** 删除选中行 */
rqGridNormal.prototype.delCurrRow = delSelectedRow;
/** 批量删除选中的行 */
rqGridNormal.prototype.delSelRows = delAllSelRows;
/** 批量删除选中的行（分批次，性能优化） */
rqGridNormal.prototype.delSelRowsBatch = delAllSelRowsBatch;
/**批量插入数据(分批次，性能优化)*/
rqGridNormal.prototype.addBatchData = addBatch;
/** 删除指定行 */
rqGridNormal.prototype.delRowData = delTargetRow;
rqGridNormal.prototype.delRow = delTargetRow;
/** 生成表格数据 */
rqGridNormal.prototype.create = createGrid;
/** 生成列表顶部工具条区域 */
rqGridNormal.prototype.createToolbar = createToolbar;
/** 隐藏表头 */
rqGridNormal.prototype.rqHeaderHide = fnHideHeader;
/** 让表格最后一个编辑保存 */
rqGridNormal.prototype.selectRow = fnselectRow;
/** 根据ID得到行的数据	*/
rqGridNormal.prototype.rowData = fnrowData;
/** 将最后的选中的编辑状态的行保存	*/
rqGridNormal.prototype.saveLastSel = fnsaveLastSel;
/** 得到当前表格组件所有数据构成的数组	*/
rqGridNormal.prototype.getAllData = fngetAllData;
/** 得到当前表格组件所有数据的rowid构成的数组 */
rqGridNormal.prototype.getAllDataIds = fngetAllDataIds;
/**得到当前表格组件所有被选中数据的rowid构成的数组*/
rqGridNormal.prototype.getSelDataIds = fnSelDataIds;
/** 得到当前表格组件新行的ID	*/
rqGridNormal.prototype.getMaxNextId = fngetMaxNextId;
/** 清除所有数据	*/
rqGridNormal.prototype.destroy = fndestroy;
/** 根据JSON对象，刷新表格	*/
rqGridNormal.prototype.refresh = fnrefresh;
/** 根据rowId，更新此行的数据	*/
rqGridNormal.prototype.updateRowData = fnUpdateRow;
/** 内部使用工具函数,设置行的编辑状态,none,update,insert,delete */
rqGridNormal.prototype.setRowState = fnsetRowState;
/** 内部使用工具函数,获取行的编辑状态,none,update,insert,delete */
rqGridNormal.prototype.getRowState = fngetRowState;
/** 内部使用工具函数,保存行,封装jqgrid的方法，便于做一些代理操作 */
rqGridNormal.prototype.srreal = fnsaveReal;

function fnSelDataIds() {
	var selDataIdsArray  = undefined;
	if($("#"+this.tableId).jqGrid('getGridParam','selarrrow') != "") {
		selDataIdsArray = $("#"+this.tableId).jqGrid('getGridParam','selarrrow');
	}
	return selDataIdsArray;
}

function delAllSelRows() {
	var selIds = this.getSelDataIds();
	if(selIds != undefined) {
		var selIdsLength = selIds.length;
		for(var index = 0; index < selIdsLength; index++) {
			this.delRowData(selIds[0]);
		}
	} else {
		confirm("请先选择要删除的行");
	}
}
function delAllSelRowsBatch(){
	var selIds = this.getSelDataIds();
	if(selIds != undefined) {
		var selIdsLength = selIds.length;
		if(selIdsLength>0){
			var self = this;
			setTimeout(function(){
				delBatchItem(self);	
			},1);
		}
	} else {
		confirm("请先选择要删除的行");
	}
}
function delBatchItem(obj){
	var selIds = obj.getSelDataIds();
	if(selIds&&selIds.length>0){
		obj.delRowData(selIds[0]);
		var self = obj;
		setTimeout(function(){
			delBatchItem(self);	
		},1);
	}
}

function addBatch(rowData) {
	var self = this;	
	addData(self,rowData);
}
function addData(obj,data) {
	var length = data.length;
	if(length > 0) {
		var newrowid = obj.getMaxNextId();
		$("#"+obj.tableId).jqGrid('addRowData',newrowid,data[0]);
		data.splice(0,1);
		var object = obj;
		 setTimeout(function(){
			addData(object,data);
		},1);
	}
}
function fnsaveReal(id){
	var editParams = this.editParams;
	if(id){
		var state = this.getRowState(id);
		$("#"+this.tableId).jqGrid("saveRow",id,editParams);
		if("insert"!==state){
			this.setRowState(id,"update");
		}
	}
}
function fnrefresh(localdata){
	this.destroy();
	//jqGrid("hideCol","orgname")动态隐藏列
	$("#"+this.tableId).jqGrid("setGridParam",{"data":localdata}).trigger("reloadGrid");
	//可多选时添加复选框单击事件
	if(this.mSelect){
		var _this=this;
		if(this.itemChanged!=null){
			$(".cbox").click(function(){
				var data=[];
				data.items=$(".cbox");
				data.current=this;
				_this.itemChanged(data);
			})
		}
	}
}
function fndestroy(){
	$("#"+this.tableId).jqGrid("clearGridData",true);
}
function fngetAllDataIds(){
	return $("#"+this.tableId).jqGrid('getDataIDs');
}
function fngetMaxNextId(){
	var ids = this.getAllDataIds();
	var idMax =0;
	for(var i=0;i<ids.length;i++){
		idMax = Math.max(idMax,ids[i]);
	}
	return (idMax+1);
}
function fngetAllData(){
	var ids = this.getAllDataIds();
	var dataNow = [];
	for(var i=0;i<ids.length;i++){
		var iditem = ids[i];
		var rowdata = $('#'+this.tableId).jqGrid('getRowData',iditem);
		rowdata.jqGridRowId =iditem;        //在得到所有数据数组的时候，增加了 rowid.
		dataNow.push(rowdata);
	}
	return dataNow;
}
function fnletGridNotEdit(){
	this.isEditable = false;   //用来标识列表是否为可编辑状态
	this.saveLastSel();
	$("#"+this.tableId).jqGrid('setGridParam',{"editurl":""});
	$("#"+this.tableId).jqGrid('setGridParam',{"onSelectRow":null});
	this.editStates=null;
}
function fnrowData(id){
	return $("#"+this.tableId).jqGrid('getRowData',id);
}
/** 获取当前选择行的id */
function fnselectRow(){
	return $("#"+this.tableId).jqGrid('getGridParam','selrow');
}
function fnsaveLastSel(){
	//结束最后一个编辑
	var selid = this.selectRow();
	this.srreal(selid);
}
function fnHideHeader(){
	var tid = this.tableId;
	$.each($(".ui-jqgrid-hdiv"),function(key,value){
		if($(value).parent().attr("id").indexOf(tid)!=-1){
			$(value).hide();
		}
	});
	//for qtp
	var cm = this.colModel;
	var ms = this.mSelect;
	var index = "";
	if(ms){
		index = cm[1].index; 
	}else{
		index = cm[0].index;
	}
	$("#"+"jqgh_"+tid+"_"+index).hide();
	$("#"+"jqgh_"+tid+"_"+index).height(0);
}

function createGrid(tableId,req,params,colnames,colModels,tableheight,itemChanged){
	//给对象赋值
	//展现
	//样式
	var self = this;
	self.tableId = tableId;
	if(tableheight != undefined ) {
		self.height = tableheight;
	}
	self.colModel = colModels;

	//设置表格复选框点击事件
	this.itemChanged=itemChanged;

	//求需要参数的值
	var datatype = "json";
	var localdata = [];
	var dataurl = "";
	if($.type(req)=="string"){
		datatype = "json";
		dataurl = req;
	}else if($.type(req)=="array"){
		datatype = "local";
		localdata = req;
	}
	var autowidth = false;
	var gridwidth = self.width;
	if(!gridwidth){
		autowidth = true;
		gridwidth="100%";
	}
	var gridheight = this.height;
	if(!gridheight){
		gridheight = "auto";
	}
	var isShowTip = this.showTip;
	var gridmulti = this.mSelect;
	var callback = this.jqGridCallBack;
	var rowNum = 10000;
	if(this.pager){
		if(this.newRowNum == 0){
			rowNum = 10;
		}else{
			rowNum = this.newRowNum;
		}
	}
	var showidcol = this.idcol;
	
	var istreeGrid = this.gridtype==="tree"?true:false;
	var isGroupGrid = this.gridtype==="group"?true:false;
	var pager = this.pager;
	if(!istreeGrid){
		if(pager){
			var pagerId = tableId+"_pager";
			pager = '#'+pagerId;
			var pagerDiv = $("<div id='"+pagerId+"'></div>");
			pagerDiv.insertAfter($('#'+tableId));
		}
	}
	var loadonce = true;
	if(istreeGrid&&datatype==="json"){
		loadonce = false;
	}
	var LoadErrorMethod = null;
	if(this.showLoadError) {
		LoadErrorMethod = eval(this.showLoadError);
	}
	var treeCol = this.treeCol;
	var groupCol = this.groupField;
	var jsonRepeat = this.repeatitems;
	$('#'+tableId).jqGrid({
			datatype: datatype,//数据类型
			treedatatype: datatype,
			data:localdata,//datatype==local时
			//datastr:xx,//datatype==xmlstring jsonstring时
			url:dataurl,//展现列表时的查询请求地址
            loadtext:'正在加载...',//当数据还没加载完或数据格式不正确时显示
            emptyrecords:'没有数据',//当空记录时显示
            height:gridheight,//高度
            //footerrow:true,表格的下面，pager的上面添加一行
            forceFit:false,//拖动列宽时，保持总列宽的和不变，不会出现横向滚动条。比如当前列多了30px，那么右侧的列，就会少30px
            //shrinkToFit:true/false,//如果设置true，则每列的宽度会按照当初设置的比例，然后按照表格的宽度进行缩放。如果为false，则走用户设置的数值
            align:"center",
            mtype:"post",
            postData:params,
            autowidth: autowidth,//宽度是否自动autowidth: true
            width:gridwidth,
            colNames:eval(colnames),//['标签ID','标签名称','分组','操作']
            colModel:eval(colModels),//
            multiselect:gridmulti,//是否可以行多选
            multiselectWidth:25,
            altRows:true,//true 有条纹的表格 ui-priority-secondary
            gridview:(!istreeGrid),//能提高加载速度，尤其是loadonce=true时。但是这个设置为true，则treeGrid, subGrid, or afterInsertRow event都不能使用
            pager:pager,//分页工具栏
            recordtext:'({0}-{1})/{2}条',
            pgtext:'{0}/{1}页',
            pgbuttons:true,
            pagerpos:'left',//设定分页位置
            viewrecords:true,
            recordpos:'right',
            rowNum:rowNum,
            sortable:true,
            loadonce: loadonce, //如果为true，则一次加载所有数据。加载后，datatype被置为local，以后的操作都只针对本地数据
	        caption: "",//设置为空，则不显示标题行
	        //hiddengrid:true/false,//如果为true，开始时列表不读取数据。点击了按钮才读取。
	        //hidegrid:true/false,//一个控制列表是否显示的按钮，在右上角
	        //hoverrows:true/false,//如果设置为false则鼠标划过行的样式就没有了
	        //inlineData:{},//当使用inlineedit的时候，传给后台的参数
	        //multikey:"shiftKey/altKey/ctrlKey",//必须点哪个组合键后，才能多选.只有为多选状态时才可用
	        //multiboxonly:true/false,//只有点击复选框，才会进行改变复选框。一般情况下，点击行就可以多选
	        rownumbers:showidcol,//设置为true，则会多出一列，rn，作为id列，从1开始
	        rownumWidth:30,//ID列的宽度
	        //scroll:boolean or integer,//设置为true则表格的分页失效。动态拖动纵向滚动条时，才去继续加载数据，放置页面好用过多内存
	        
	        //tree begin
	        treeGrid:istreeGrid,
	        treeGridModel: 'adjacency',
	        ExpandColumn: treeCol,
	        grouping:isGroupGrid,
           	groupingView:{
           		groupField:[groupCol],
           		groupColumnShow:[false],
				groupDataSorted : true,
				groupSummary : [false],
				groupText: ['<b>{0}</b>']
           	},
            jsonReader:{   
            	repeatitems : jsonRepeat
        	}, 
            gridComplete:fnGridComp,
			//列宽拖动事件
			resizeStop:fnResizeStop,
			loadError:LoadErrorMethod
	});
	$(".ui-jqgrid-bdiv").css("overflow-x","hidden");
	function fnGridComp(){
		/* 开始时，就改变字符，影响效率，resize时再改变 */
        //if($.autoSubstring){
       	if(false){
           //遍历数据，修改文字与宽度适应
           var ms = $("#"+tableId).jqGrid("getGridParam","multiselect");
           var acm = $("#"+tableId).jqGrid("getGridParam","colModel");
           $.each($("#"+tableId+" tr"),function(key,value){
           		$.each($(value).children(),function(keyc,valuec){
           			self.jqgridTextResize(valuec,acm[keyc]);
           		});
           });
        }
		 /**
        	给列表增加样式
        */
        self.rqDefaultStyle();
		if(!isShowTip){  	
			$("#" + tableId + " td" ).removeAttr("title");
		}
			//$("#" + tableId + " td[aria-describedby='groupTable_seqid']" ).removeAttr("title");
			//$("#" + tableId + " td[aria-describedby='groupTable_resid']" ).removeAttr("title");
		if(callback) {
			eval(callback + "()");
		}
	}
	function fnResizeStop(newwidth,index){
		if($.autoSubstring){
			$.each($("#"+tableId+" tr"),function(key,value){
				var valuec = $(value).children()[index];
				self.jqgridTextResize(valuec,newwidth);
            });
        }
	}
	function loadError(xhr,st,err){
		try{
			err = err.replace("Invalid JSON:","");
			eval(err);
		}catch(e){
			window.alert("此目录为空目录");
			/*
			if(err == "SyntaxError: 无效字符") {
				window.alert("此目录为空目录");
			} else {
				window.alert(err);
			}
			*/
		}
	}
}
function fnsetRowState(rowid,state){
	if(this.editStates){
		var nowRow = this.rowData(rowid);
		var idcol = this.editStates.cols.idcol;
		if(nowRow){
			var nowId = nowRow[idcol];
			if(nowId){
				this.editStates.rows[nowId] = state;
			}
		}
	}
}
function fngetRowState(rowid){
	var result = null;
	if(this.editStates){
		var nowRow = this.rowData(rowid);
		var idcol = this.editStates.cols.idcol;
		var nowId = nowRow.idcol;
		result = this.editStates.rows.nowId;
	}
	return result;
}
function delTargetRow(id){
	this.srreal(id);
	this.setRowState(id,"delete");
	if(this.gridtype==="tree"){
		var idp = this.getNodeParent(id);
		var tc = this.treeCol;
		$("#"+this.tableId).jqGrid("delTreeNode",id);
		//对父节点的影响
		var childarr = this.getNodeChildren(idp);
		if(childarr.length==0){
			this.setNodeIsLeaf(idp,true);
		}
	}else{
		$("#"+this.tableId).jqGrid('delRowData',id);
	}
}
function delSelectedRow(){
	var id = $("#"+this.tableId).jqGrid('getGridParam','selrow');
	if (id) { 
		this.delRowData(id);
	} else { 
		top.alert("删除前请选择数据");
	}
}
function JQSetWidth(width){
	$("#"+this.tableId).jqGrid('setGridWidth',width);
}
function rqGridStyle(){
	var tableId = this.tableId;
	//增加默认样式jqGrid
	$("#" + tableId + " td" ).css("border-top-width","1px").css("border-top-color","#E9E9E9").css("border-top-style","solid");   //让表格只显示上边框
	$("#" + tableId + " tr:lt(2) td" ).css("border-top-style","none");                                                           //让表格前两行不显示上边框
	$("#" + tableId + " td" ).css("border-bottom-style","none");																 //覆盖原有下边框样式
	$("#" + tableId + " tr:last td" ).css("border-bottom-width","1px").css("border-bottom-color","#E9E9E9").css("border-bottom-style","solid");  //让最后一行显示下边框
	$("#" + tableId + " tr:gt(0)" ).css("height","30px");

	//和用户自定义样式customclass;
	var customClass = $("#" + tableId).attr("customclass"); 
	if(customClass!= undefined) {
		$($("#"+tableId)[0].parentNode.parentNode.parentNode).addClass(customClass);
		if(self.gridtype==="tree"){
			$($("#"+tableId)[0].parentNode.parentNode.parentNode.parentNode).addClass(customClass);
		}else if(self.gridtype==="group"){
			$($("#"+tableId)[0].parentNode.parentNode.parentNode).addClass("groupTableDiv").addClass(customClass);
		}
	}
	//修改表头的样式。
	var table = $($("#" + $("#" + tableId)[0].parentNode.parentNode.parentNode.id + " table")[0]); 
	if(self.gridtype==="tree"){
		table = $("#" + $($("#" + tableId)[0].parentNode.parentNode.parentNode.parentNode).attr("id")+ " table:first");
		//修改树形列表横向分隔线
		$("#" + tableId ).addClass("rq-ui-treeGrid-table");
		$("#" + tableId + " tbody").addClass("rq-ui-treeGrid-tbody");
		$($("#" + tableId)[0].parentNode.parentNode.parentNode.parentNode).addClass("rq-ui-treeGrid-fatherDiv");
	}else if(self.gridtype==="group"){
		$("#"+ tableId ).addClass("groupTable");
	}else{
		$("#"+tableId).addClass("jqGrid");
		$($("#"+tableId)[0].parentNode.parentNode.parentNode).addClass("jqGridDiv");
	}
	table.addClass("JqGridTable");
    $(".JqGridTable th").addClass("JqGridTh");
	$(".JqGridTable th:first").css("border-left","0px none ");	
    /*
	$(".JqGridTable th").css("border-top","1px solid #A6C9E2");
	$(".JqGridTable th").css("border-bottom","1px solid #A6C9E2");
	$(".JqGridTable th").css("border-right","1px solid #A6C9E2");
	
	*/
	//从第二行开始，让表格的高度为24px；
}
function JQtextResize(tdObj,newwidth){
	var achild = $(tdObj).children('a');
	var alen = achild.length; 
	if(alen>0){
		if(alen==1){
			var aObj = achild[0];
			var currText = $(aObj).text();
			if(currText&&currText!=""){
				var resultText = $.autoSubstring($(tdObj).attr("title"),newwidth);
				if(resultText!=currText){
					$(aObj).text(resultText);
				}
			}
		}
	}else{
		var currText = $(tdObj).text();
		if(currText&&currText!=""){
			var resultText = $.autoSubstring($(tdObj).attr("title"),newwidth);
			if(resultText!=currText){
				$(tdObj).text(resultText);
			}
		}
	}
}
function rqGridedit(editurl){
	this.isEditable = true;    //设置列表为可编辑状态
	var tablenow = this.tableId;
	if(typeof editurl==="string"){
		$("#"+tablenow).jqGrid('setGridParam',{"editurl":editurl});
	}else{
		$("#"+tablenow).jqGrid('setGridParam',{"editurl":"clientArray"});
		//内存中保存一个列元数据，列ID和修改状态标识符的结构
		//{"cols":{"idcol":""},"rows":{"1":"none/update/insert/delete"}}
		this.editStates = {};
		var cols = {};
		var rows = {};
		this.editStates.cols = cols;
		this.editStates.rows = rows;
		var cm = this.colModel;
		$.each(cm,function(key,value){
			if(value.isid){
				cols["idcol"] = value.name;
				return false;
			}
		});
		var dataarr = this.getAllData();
		$.each(dataarr,function(key,value){
			var nowidvalue = value[cols["idcol"]];
			rows[nowidvalue] = "none";
		});
	}
	var lastsel2;
	var tablerowclicked = false;
	var editParams = this.editParams;
	var self = this;
	$("#"+tablenow).jqGrid('setGridParam',{"onSelectRow":function(id){
		if(id && id!==lastsel2){
		    self.srreal(lastsel2);
		    $(this).jqGrid("editRow",id,editParams);
			lastsel2=id;
		}
	}});
	//editRow 编辑 saveRow 保存 restoreRow 还原 addRow 添加 inlineNav
	$("#"+tablenow).bind("click",function(){
		tablerowclicked = true;
	});
	$("html").bind("click",function(){
		if(!tablerowclicked){
			self.srreal(lastsel2);
		}
		tablerowclicked = false;
	});
}
function fnUpdateRow(rowId,data){
	$("#"+this.tableId).jqGrid('setRowData',rowId,data);
}
function createToolbar(tableId){
	var toolbarDiv = document.createElement("div");
    $(toolbarDiv).insertBefore("#gbox_"+tableId+" .ui-jqgrid-hdiv");
	$(toolbarDiv).addClass("ui-userdata").attr("id", "t_" + tableId);
}