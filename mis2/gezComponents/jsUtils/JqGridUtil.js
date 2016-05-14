//(function(){
//	var modules=[
//		'/mis2/gezComponents/jsUtils/IconFactory.js'	
//	];
//	rqLoadJS(modules);
//})(); 
var IconFactory = {
	icons : {
		/** inject icons **/
	},
	getIcon : function(name) {
		return IconFactory.icons[name];
	}
}

function JqGridUtil(){
	rqGridNormal.call(this);
	this.gridtype="normal";

		$.fn.rqCheckBox=function(settings){
			settings = extendSettings(settings,$(this));
			createCheckBoxInput(settings);
		}
		
		//全局的settings变量，在最后点击空白处下拉选项div消失时使用
		var checkSettings="";
		var timer="";
		//创复选组件
		function createCheckBoxInput(settings){
			//获取复选框容器
			var checkContainer = $("table[aria-labelledby=gbox_"+settings.tableId+"] thead tr th #checkDiv"+settings.tableId);
			checkContainer.attr("class","checkContainer");
			checkContainer.css("line-height","22px");
			checkContainer.width(settings.divObj.width());
			
			var positiondiv = getAbsolutePosition($("table[aria-labelledby=gbox_"+settings.tableId+"] thead tr th #checkDiv"+settings.tableId).get()[0], window);
			var itemsDiv="<div id='items"+settings.tableId+"' class='itemsDiv' style='display:none;position:absolute;width:130px;background:white;border:1px solid #CCCCCC;top:"+(settings.divObj.height()+6)+"px;left:0px;'></div>";
			checkContainer.parent().parent().parent().parent().parent().parent().parent().parent().append(itemsDiv);
			
			//设置复选按钮图片
			var checkImg = $("<img id='rqCheckImg"+settings.tableId+"' class='rqCheckImg'></img>");
			checkImg.attr("src",settings.imageFolder+"unselected.png");
			checkImg.width("16px");
			checkImg.height("16px");
			var checkSpan = $("<span id='' class='rqCheckSpan' style='display:block;'></span>");
			
			checkSpan.css("margin-left","5px");
			checkSpan.css("margin-top","5px");
			checkSpan.css("float","left");
							
			checkSpan.width(checkImg.width());
			checkSpan.height(checkImg.height());
			checkSpan.append(checkImg);
			checkContainer.append(checkSpan);
			
			//设置下拉图片
			var dropDownImg = $("<span id='rqDropDownImg"+settings.tableId+"' class='rqDropDownImg"+settings.tableId+"' style='margin-top:7px;'>"+IconFactory.getIcon("gezico_p_ziyuanzhongxinxialaanniu") +"<span>&nbsp</span></span>");
			dropDownImg.width("20px");
			dropDownImg.height("25px");
			dropDownImg.children(".icon_div").children(".i1").attr("style","font-size:10px;cursor:pointer;");
			var dropDownSpan = $("<span id='' class='rqDropDownSpan' style='display:block;'></span>");
			
			dropDownSpan.width(dropDownImg.width());
			dropDownSpan.height(dropDownImg.height());
			dropDownSpan.css("float","right")
							
			dropDownSpan.width(dropDownImg.width());
			dropDownSpan.height(dropDownImg.height());
			dropDownSpan.append(dropDownImg);
			checkContainer.append(dropDownSpan);

			$(checkSpan).click(function(){
				$("#items"+settings.tableId).hide();
				if(checkImg.attr("src").search("unselected.png")!=-1){
					checkImg.attr("src",settings.imageFolder+"selected.png");
					checkAll(settings.selector);
				}else{
					checkImg.attr("src",settings.imageFolder+"unselected.png");
					notCheckAll(settings.selector);
				}
			})
			
			//当复现框时判断是否全部选中，全部选中时全选按钮变为全选状态，否则为非全选状态
			timer=setInterval(checkBoxClick,1000);

			/*点击搜索*/
			$(dropDownSpan).click(
				function(){
					showAllItem(settings);
				}
			);
			
		}

		//当复现框时判断是否全部选中，全部选中时全选按钮变为全选状态，否则为非全选状态
		function checkBoxClick(){
			if($(checkSettings.selector).length>0){
				$(checkSettings.selector).bind("click",function(){
				if($(checkSettings.selector+":checked").length==$(checkSettings.selector).length){					
					$("img#rqCheckImg"+checkSettings.tableId).attr("src",checkSettings.imageFolder+"selected.png");
				}else{
					$("img#rqCheckImg"+checkSettings.tableId).attr("src",checkSettings.imageFolder+"unselected.png");
				}
			})
				clearInterval(timer);	
			}
			
		}

		/**
		 * 全选
		 */
		function checkAll(className){
			$(className).each(function(){
				if($(checkSettings.selector+":checked").length!=$(checkSettings.selector).length){
					if(!$(this).attr("checked")){
						$(this).trigger("click");
					}
				}
				$(this).attr("checked",true);
				$("img#rqCheckImg"+checkSettings.tableId).attr("src",checkSettings.imageFolder+"selected.png");
				
			})
		}

		/**
		 * 全不选
		 */
		function notCheckAll(className){
			$(className).each(function(){
				$("img#rqCheckImg"+checkSettings.tableId).attr("src",checkSettings.imageFolder+"unselected.png");
				if($(this).attr("checked")){
					$(this).trigger("click");
				}
				$(this).attr("checked",false);
			})
		}

		/**
		 * 反选
		 */
		function checkOther(className){
			$(className).each(function(){
				$(this).trigger("click");
				$(this).attr("checked")?$(this).attr("checked",false):$(this).attr("checked",true);
				if($(checkSettings.selector+":checked").length==$(checkSettings.selector).length){
					$("img#rqCheckImg"+checkSettings.tableId).attr("src",checkSettings.imageFolder+"selected.png");
				}else{
					$("img#rqCheckImg"+checkSettings.tableId).attr("src",checkSettings.imageFolder+"unselected.png");
				}
			})
		}
		
		/**
		 * 点击下拉三角显示所有选项
		 */
		function showAllItem(settings){
			var items=getItems(settings);
			var itemFuncs=getItemFuncs(settings);
			var itemsList=$("#items"+settings.tableId);
			var moreItems=eval(settings.checkboxSelectItems);
			itemsList.html("");
			for(var i=0;i<items.length;i++){
				var itemDiv=$("<div class='itemDiv"+settings.tableId+"' style='display:inline-block;width:130px;height:25px;line-height:25px;text-indent:30px;font-family:Verdana;font-size:12px;cursor:pointer;'>"+items[i]+"</div>");				
				(function(func){
					itemDiv.hover(
						function(){
							$(this).css('background','#EBF3FB')
						},
						function(){
							$(this).css('background','white')
						}	
					)
					itemDiv.click(function(){
						eval("("+func+")");						
						itemsList.hide();
					})}
					
				)(itemFuncs[i])

				itemsList.append(itemDiv);
			}
			itemsList.height(items.length*25)
			itemsList.show();
		}

		/**
		 * 获取下拉选项
		 */
		function getItems(settings){
			var items=new Array();
			items.push("全选");
			var moreItems=eval(settings.checkboxSelectItems);
			if(moreItems!=null && moreItems!=""){
				if(moreItems.length>0){
					for(var i=0;i<moreItems.length;i++){
						items.push(moreItems[i].name);
					}
				}
			}
			
			items.push("全不选");
			items.push("反选");
			return items;			
		}

		/**
		 * 获取下拉选项点击时的方法
		 */
		function getItemFuncs(settings){
			var itemFuncs=new Array();
			var className=settings.selector;
			itemFuncs.push("checkAll('"+className+"')");
			var moreItems=eval(settings.checkboxSelectItems);
			if(moreItems!=null && moreItems!=""){
				if(moreItems.length>0){
					for(var i=0;i<moreItems.length;i++){
						itemFuncs.push(moreItems[i].fun+"('"+moreItems[i].value+"')");
					}
				}
			}
			itemFuncs.push("notCheckAll('"+className+"')");
			itemFuncs.push("checkOther('"+className+"')");
			return itemFuncs;			
		}
		
		/**
		 * 获取源输入框的ID的统一方法
		 */
		function getSrcId(settings){
			return settings.divObj.attr('id');
		}
		
		/**
		 * 初始化配置参数
		 * 将传入的覆盖到默认的对象上，
		 */
		function extendSettings(settings,containerobj){
			containerobj.css({"width":"50px","height":"25px","background":"#F3F3F3","min-width":"50px"})
			//由于ie6不兼容min-width，此处用js做一下兼容处理
			if(containerobj.width()<50 && $.browser.version=="6.0"){
				containerobj.css("width","64px");
			}
			
			var defaultSettings = {
				"apppath":"rqLib",
				"divObj":containerobj,				
				"imageFolder":"",
				"selector":"",
				"checkboxSelectItems":""
			};
			settings = $.extend(true,defaultSettings,settings);
			if(settings.imageFolder==null||settings.imageFolder==""){
				if(settings.apppath!=null&&settings.apppath!=""){
					settings.imageFolder = settings.apppath+"/mis2/gezComponents/checkBox/css/images/";
				}else{
					settings.imageFolder = "";
				}
			}
			checkSettings=settings;
			return settings; 
		}

		/**
		 * 点击下拉列表以外的地方，则下拉列表关闭
		 */
		$(document).click(function(event){ 
			var inCheckDiv=null;
			if(checkSettings.divObj!=null){
				var checkDiv = $("#"+checkSettings.divObj.attr("id"));
				minX = checkDiv.offset().left;
				minY = checkDiv.offset().top;
				maxX = minX+checkDiv.width();
				maxY = minY+checkDiv.height();
				inCheckDiv = ((event.pageX>=minX&&event.pageX<=maxX)&&(event.pageY>=minY&&event.pageY<=maxY));
			}
			event = event || window.event;
			if($("#items"+checkSettings.tableId).is(":visible") && !inCheckDiv){
			    if (!$(event.srcElement).is("#items"+checkSettings.tableId)) { 
				    $("#items"+checkSettings.tableId).hide();
				}
			}
		})

	/**
	 * 添加一条数据
	 */
	this.addRowData = function(id,datarow){
		/*
		var addRowParams = {
			"rowID":,"newrowid",
			"initdata":datarow,
			"position":"last",
			"useDefValues":false,
    		"useFormatter":false
    		//"addRowParams":{"extraparam":{}}
		};
		*/
		var newrowid = this.getMaxNextId();
		$("#"+this.tableId).jqGrid('addRowData',newrowid,datarow);
		this.setRowState(newrowid,"insert");
	};
	/**
	 *在指定行插入数据
	 */
	 this.addIndexRowData = function(index,datarow) {
	 	$("#"+this.tableId).jqGrid('addRowData',this.getMaxNextId(),datarow,"after",index);
	 }
	/**
	 *在第一行插入数据
	 */
	this.addFristRowData = function(datarow) {
	 	$("#"+this.tableId).jqGrid('addRowData',this.getMaxNextId(),datarow,"before",1);
	 }
	/**
	 * 更新一条数据
	 */
	this.updateRowData = function(id,datarow){
		$("#"+this.tableId).jqGrid('setRowData',id,datarow);
	};
	this.dataUp = function(){
		var id = $("#"+this.tableId).jqGrid('getGridParam','selrow');
		if (id) {
			var tr = $("#"+id);
			if(tr.length>0){
				var prevtr = tr.prev("tr");
				if(prevtr.length>0){
					prevtr.insertAfter(tr);
				}
			}	
		}
	};
	this.dataDown = function(){
		var id = $("#"+this.tableId).jqGrid('getGridParam','selrow');
		if (id) { 
			var tr = $("#"+id);
			if(tr.length>0){
				var nexttr = tr.next("tr");
				if(nexttr.length>0){
					nexttr.insertBefore(tr);
				}
			}	
		}
	};
	this.insertData = function(data){
		var id = $("#"+this.tableId).jqGrid('getGridParam','selrow');
		if (id) { 
			$("#"+this.tableId).jqGrid('addRowData',this.getMaxNextId(),data,"after",id);
		} else { 
			this.addBatchData(data);
		}
	};
	/**
	 * 得到当前表格组件所有选取数据的rowid构成的数组
	 * @name getMultiSelData
	 * @methodOf JqGroupGridUtil
	 * @return 
	 */
	this.getMultiSelIDs = function(){
		return $("#"+this.tableId).jqGrid('getGridParam','selarrrow');
	};
	/**
	 * 得到当前表格组件所有选取数据构成的数组
	 * @name getMultiSelData
	 * @methodOf JqGroupGridUtil
	 * @return 
	 */
	this.getMultiSelData = function(){
		var ids = $("#"+this.tableId).jqGrid('getGridParam','selarrrow');
		var dataNow = [];
		for(var i=0;i<ids.length;i++){
   			dataNow.push($('#'+this.tableId).jqGrid('getRowData',ids[i]));
   		}
   		return dataNow;
	};
	/**
	 * 得到某一单元格的值
	 * @name getCellData
	 * @methodOf JqGroupGridUtil
	 * @param rowid 行号，从0开始
	 * @param icol 列号，从0开始
	 * @return 
	 */
	this.getCellData = function(rowid,icol){
		return $("#"+this.tableId).jqGrid('getCell',parseInt(rowid)+1,icol)
	};
	/**
	 * 得到当前表格组件所有数据构成的数组
	 * @name setCellData
	 * @methodOf JqGroupGridUtil
	 * @return 
	 */
	this.setCellData = function(rowid,icol,data){
		return $("#"+this.tableId).jqGrid('setCell',parseInt(rowid)+1,icol,data);
	};
	var jqtimer="";
	/**
	*tableId 表格ID
	req 请求数据的地址
	data 参数
	allColNames 所有字段名称
	allColModel 字段定义信息
	*/
	this.getGridData = function(tableId,req,data,allColNames,allColModel,customHeight,selector,checkboxSelectItems,itemChanged){
		this.create(tableId,req,data,allColNames,allColModel,customHeight,itemChanged);
		var settings={};
		if(this.mSelect){
			if(selector==null || selector==""){
				selector=".cbox";
			}
			settings.tableId=tableId;
			settings.selector=selector;
			settings.checkboxSelectItems=checkboxSelectItems;
			settings.imageFolder=$.contextPath+"/mis2/gezComponents/checkBox/css/images/";
			settings = extendSettings(settings,$("table[aria-labelledby=gbox_"+tableId+"] thead tr th #checkDiv"+tableId));
			createCheckBoxInput(settings);
			
			$("#"+tableId+"_cb").css("width","53px");
			if($.browser.msie){
				$("#"+tableId+" tbody .jqgfirstrow td").eq(0).css("width","51px");
			}else{
				$("#"+tableId+" tbody .jqgfirstrow td").eq(0).css("width","53px");	
			}
			$("#jqgh_"+tableId+"_cb").css("height","25px");
		}
	};

   /**
	*tableId 表格ID
	*/
	this.createGridToolbar = function(tableId){
		this.createToolbar(tableId);
	};

	//add by:liuyimin 2013-11-20
	//add begin
	var settings;
	this.setConfig = function(){
		settings = arguments[0];
		if(settings.datatype == "url"){
			settings.datatype = "json";
		}
	};
	
	this.show = function(){
		if(arguments.length == 0){
			if(settings == undefined){
				alert("首先调用setConfig(settings)方法!");
				return;
			}
		}else if(arguments.length == 1){
			this.setConfig(arguments[0]);
		}
		this.create(settings.htmlElement.id,settings.source,settings.params,settings.colNames,settings.colModel,settings.tableheight);
	};
	//add end
}
JqGridUtil.prototype=new rqGridNormal();
			
/**
 * 获取当前应用名称
 * @returns
 */
function getContextPath() {
	  var contextPath = document.location.pathname;
	  var index = contextPath.substr(1).indexOf("/");
	  contextPath = contextPath.substr(0, index + 1);
	  return contextPath;
}