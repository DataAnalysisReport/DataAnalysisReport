
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



/**
 * 参数说明：
 *		contextPath：系统URL
 *		reportId：报表ID
 *		filePath：报表配置文件路径
 *		target：报表区域节点元素
 *		currPage：当前页
 *		perPageCount：每页显示记录数
 *		reportType：报表类型
 *		query：通用查询JSON
 */
var setJson="{}";
var refreshData="yes";
var filterValues = new Array();//记录所有列的过滤字段信息，用于字段过滤
var resType = "";
var flag = "" //用于判断处理多维分析钻取明细时出现的不含左上角及左表头的情况 true:不包含左上角及左表头 false:包含左上角及左表头
var globalGroupStyle =0 ;
var colHeaderTableCellWidth;
var colHeaderTableCellWidth2;
var colHeaderTableUpdateIndex;
var colHeaderRowCount;

var cornerTableCellWidth;
var cornerTableUpdateIndex;
var cornerRowCount;
var saveDataMappingSubSumHeaderLevelJson;//用来保存数据区和小计区对应行的level(key为行数，第一行为0 level为层级，第一列层级为1)
var FastReportViewer = function (contextPath, reportId, reportName, filePath, target, currPage, perPageCount,exportPageCount, query, params, callback,serverPath,frConfig,reportType,reportDefineId,layout) {
	//属性：
	debugger;
	resType= reportType;
  	this.contextPath = contextPath; // 系统URL
  	this.reportId = reportId; // 报表ID
	this.reportName = reportName; // 报表名称
  	this.serverPath = serverPath; // 报表路径
  	this.filePath = filePath; // 报表配置文件路径
  	this.target = target; // 报表区域节点元素
	this.currPage = currPage; // 当前页码
	this.perPageCount = parseInt(perPageCount); // 每页显示记录数 
	this.exportPageCount=parseInt(exportPageCount);//导出每页行数
	this.query = query; // 通用查询JSON串
	this.params = params; // 数据集参数
	this.callback = callback; // 回调函数（数据表格加载完成后执行）
		
	this.reportConfig = null; // 报表信息
	this.reportRowCount = 0; // 报表行数
	this.pageCount = 0; // 总页数
	
	this.cachePageCount = 3; // 缓存数组存放的页数
	this.maxRowCount = this.cachePageCount * perPageCount; // 最大行数
	//this.cache = new CacheData(this.maxRowCount, perPageCount); // 缓存数组
	this.totalData = null; // 总计行数据
	this.cornerData = null; // 总计行数据
	
	this.graphData = null;//统计图数据
	this.reportDefineId = reportDefineId;//报表实体ID
	this.layout = layout; // 统计图布局方式
	
	this.data = null;
	this.colHeaderColWidth = []; // 列表头列宽
	this.cornerColWidth = []; // 左上角列宽
	
	var base64 = new Base64();
	
	var _this = this;
	var $this = $(this);

	var data_width; //数据行宽度
	var colHeader_width; //表头行宽度

	/** 初始化 */
	this.init = function(){
		// 绑定监听事件：
		$this.bind('error', this.errorHandler);//错误处理事件
		$this.bind('pageChanged', this.pageChangedHandler);//页码改变事件
		$this.bind('cacheDataReady', this.cacheDataReadyHandler);//缓存数据就绪事件
		$this.bind('nextPageReady', this.nextPageReadyHandler);//下一页数据就绪事件
		$this.bind('initReportInfoComplete', this.initReportInfoHandler); //初始化报表信息完成事件
		$this.bind('initPageCountComplete', this.initPageCountHandler); //初始化总页数完成事件
		$this.bind('createDataComplete', this.createDataCompleteHandler); //数据表格生成完成
		
		// 1 初始化页面元素：表头table 和 数据区table
		this.initTable();
		
		// 2 初始化页面元素：统计图显示区域
		//this.initGraphDiv();
		//this.initChartDiv();
		
		// 3 初始化报表信息：title, foot, css, ...
		this.initReportInfo();
		
		return this;
	}

	/** 初始化页面表格 */
	this.initTable = function(){
		$('#tableDiv').html('');
		var table_title_div = $('<div id="report_'+this.reportId+'_table_title_div" style="overflow-y:hidden; overflow-x:hidden;">' + '</div>');
		var table_foot_div = $('<div id="report_'+this.reportId+'_table_foot_div" style="overflow-y:hidden; overflow-x:hidden;">' + '</div>');
		var table = $('<table id="report_'+this.reportId+'_table" style="border-collapse:collapse;"></table>');
		table.append(
			'<tr>' +
				'<td style="padding:0;">' + 
					'<div id="report_'+this.reportId+'_table_corner_div" style="overflow-y:hidden; overflow-x:hidden;">' +
					'<table id="report_'+this.reportId+'_table_corner" style="border-collapse:collapse;table-layout:fixed;"></table>' +
					'</div>' +
				'</td>' + 
				'<td style="padding:0;">' + 
					'<div id="report_'+this.reportId+'_table_colHeader_div" style="overflow-y:hidden; overflow-x:hidden;">' +
					'<table id="report_'+this.reportId+'_table_colHeader" style="border-collapse:collapse;"></table>' +
					'</div>' +
				'</td>' + 
			'</tr>' +
			'<tr>' +
				'<td style="padding:0;" valign="top">' + 
					'<div id="report_'+this.reportId+'_table_rowHeader_div" style="overflow:hidden;">' +
					'<table id="report_'+this.reportId+'_table_rowHeader" style="border-collapse:collapse;table-layout:fixed;"></table>' +
					'</div>' +
				'</td>' + 
				'<td style="padding:0;">' + 
					'<div id="report_'+this.reportId+'_table_data_div" style="overflow:hidden;">' +
					'<table id="report_'+this.reportId+'_table_data" style="border-collapse:collapse;table-layout:fixed;"></table>' +
					'</div>' +
				'</td>' +
			'</tr>'
		);
		table_title_div.appendTo($('#tableDiv'));
		table.appendTo($('#tableDiv'));
		table_foot_div.appendTo($('#tableDiv'));

	}
	
	/** 初始化统计图显示区域 */
	this.initGraphDiv = function(){
		$('#graphDiv').html('');
		var div = //'<div id="graphDiv" class="graphDiv" style="text-align: center; width:100%; height:2%;">' +
				  '<div><img id="showGraphBtn" class="hideGraph" src="images/up.png" title="显示统计图" /></div>' + 
				  '<div id="graphContent" style="display:none;height:95%;width:100%;overflow-x:auto;overflow-y:hidden;padding:0;margin:0;">'+
				  '</div>'; 
				  //'</div>';
		$(div).appendTo($('#graphDiv'));
		$("#showGraphBtn").click(function(){
			showGraphBtnClick();
		});
	}
	function showGraphBtnClick(){
		if($("#showGraphBtn").attr('class') == 'hideGraph'){
			//当前是收起状态：
			$("#graphDiv").css('height', '50%');
			$("#tableDiv").css('height', '50%');
			$("#graphContent").show();
			$("#showGraphBtn").attr('src', 'images/down.png');
			$("#showGraphBtn").attr('title', '隐藏统计图');
			$("#showGraphBtn").attr('class', 'showGraph');
			
			_this.addGraphImage();//添加统计图
		}else{
			//当前是展开状态：
			$("#graphContent").hide();
			$("#graphDiv").css('height', '0%');
			$("#tableDiv").css('height', '100%');
			$("#showGraphBtn").attr('src', 'images/up.png');
			$("#showGraphBtn").attr('title', '显示统计图');
			$("#showGraphBtn").attr('class', 'hideGraph');
			$("#graphContent").html("");
			_this.graphData = null
		}
	}
	/** 添加统计图图片 */
	this.addGraphImage = function(width,height){
		if(_this.graphData == null){
			loading();
			//分组报表：
//			prompt("", _this.contextPath + "/showFastReportServlet?action=10" + "resID=" + base64.encode(_this.reportId));
			var url=PathUtils.getRelativeUrl("/showFastReportServlet?action=10");
			if(width){
				url+="&width="+width;
			}
			if(height){
				url+="&height="+height;
			}
			url+=_this.params;
			$.ajax({type:"POST", url:url, async:true, cache:false, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath)}, dataType:"json", 
				success:function (data) {
					closeFile();
					
					_this.getGraphImageSuccessHandler(data,width,height);
				}, error:function () {
					$this.trigger({type:'error', opt:'获取统计图'});
				}}
			);
		}
	}
	
	/** 获取统计图成功 */
	this.getGraphImageSuccessHandler = function(data,w,h){
		
		_this.graphData = data;
		
		if(_this.graphData.state == 200){
			var height = $("#graphContent").height();
			var src='';
			if(_this.contextPath==''){
				src= _this.graphData.path +'?t_i_m_e='+ (new Date().getTime()) ;
			}else{
				src= PathUtils.getRelativeUrl(_this.graphData.path +'?t_i_m_e='+ (new Date().getTime()));
			}
			var image = '<image id="graphImage" height="'+height+'" src="'+src+'" />';
			$("#graphContent").append(image);
			if(w){
				$("#graphImage").width(w);
			}else{
				w = $("#graphImage").width();
			}
			if(h){
				$("#graphImage").height(h);
			}else{
				h = $("#graphImage").height();
			}
			ResizeGraph($("#graphImage"),h,"viewer.graphData=null;viewer.addGraphImage")
		}else if(_this.graphData.state == 404){
			$("#graphContent").append(_this.graphData.message);
		}else if(_this.graphData.state == 500){
			$("#graphContent").append(_this.graphData.message);
		}
	}
	
	/** 初始化页面报表信息 */
	this.initReportInfo = function(){
		loading();
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/mis2/vrsr/json/demo1_action0.json"), async:false, cache:false, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath), "fastReportDir":base64.encode(_this.filePath), "query":base64.encode(_this.query)}, dataType:"json", 
			success:function (data) {
				closeFile();
				if(data.state == 500){
					confirm(data.message);
					return;
				}
				_this.reportConfig = data;
				globalGroupStyle = _this.reportConfig.groupStyle;
				//if(showReportFirst){
					//_this.initToolbar();
					showReport();
				//}
				//初始化订阅按钮事件
				//$("#subreport").click(function(){
				//	subscribeModuleEntry(_this.reportId);
				//});

				//工具
				//$("#showGraph").click(function(){
				//	_this.toolBarShowGraph();//处理统计
				//});
				//触发事件：
				//$this.trigger('initReportInfoComplete');此处隐藏，初始化工具条在展现工具条功能时初始化
			}, error:function (s) {
				$this.trigger({type:'error', opt:'初始化报表信息'});
			}}
		);
	}
	
	/**
	 * 初始化统计图：
	 */
	this.initChartDiv = function(){
		//分组报表：
		var url=PathUtils.getRelativeUrl("/showFastReportServlet?action=10");
		url+=_this.params;
		$.ajax({type:"POST", url:url, async:true, cache:false, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath)}, dataType:"json", 
			success:function (data) {
			
				if(data.state == 200){
					var width=parseInt(data.width);
					var height=parseInt(data.height);
					var graphJson= JSON.stringify(data);
					//var graphPageUrl=$.contextPath+'/mis2/vrsr/show/showGraph.jsp?graphJSON='+base64.encode(graphJson);
					//$("#chartDiv").append("<iframe name='chartFrame' width='"+width+"' height='"+height+"' frameborder='no' scrolling='no' src="+ graphPageUrl +" />");
				//刷新统计图时，判断如果iframe已创建则不再新建
				if ( $("#chartFrame").length == 0 ) { 
					$("#chartDiv").append("<iframe id='chartFrame' name='chartFrame' width='"+width+"' height='"+height+"' frameborder='no' scrolling='no' src='' />");			
				}
					var graphPageUrl = $.contextPath+'/mis2/vrsr/show/showGraph.jsp';
					var param = {"graphJSON":base64.encode(graphJson)};
					postSubmit(graphPageUrl,param,"chartFrame");
				}else if(data.state  == 404){
					alert("当前报表没有统计图，请先设置统计图后再进行查看。");
				}else if(data.state  == 500){
					//alert("获取统计图失败");
				}
			}, error:function () {
				alert("获取统计图失败");
			}}
		);
	}

	function postSubmit(URL, PARAMS,target) {    
		    var temp = document.createElement("form");        
		    temp.action = URL;        
		    temp.method = "post";        
		    temp.style.display = "none";    
		    temp.target = target;   
		    for (var x in PARAMS) {        
		        var opt = document.createElement("textarea");        
		        opt.name = x;        
		        opt.value = PARAMS[x];       
		        temp.appendChild(opt);        
		    }       
		    document.body.appendChild(temp); 
		    temp.submit();        
		    return temp;        
		}     
	
	
	/** 添加统计图图片 */
	this.toolBarShowGraph = function(){
			//分组报表：
//			prompt("", _this.contextPath + "/showFastReportServlet?action=10" + "resID=" + base64.encode(_this.reportId));
		var url=PathUtils.getRelativeUrl("/showFastReportServlet?action=10");
		url+=_this.params;
		$.ajax({type:"POST", url:url, async:true, cache:false, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath)}, dataType:"json", 
			success:function (data) {
				if(data.state == 200){
					var width=parseInt(data.width);
					var height=parseInt(data.height);
					var graphJson= JSON.stringify(data);
					var graphPageUrl=$.contextPath+'/mis2/vrsr/show/showGraph.jsp?graphJSON='+base64.encode(graphJson);
					try{
						getHomeContentWindow1(window).openTab(_this.reportId+'_graph','统计图',graphPageUrl);
					}catch(e){
						showDialog(graphPageUrl, "", "统计图", height+15, width+15);
					}
				}else if(data.state  == 404){
					alert("当前报表没有统计图，请先设置统计图后再进行查看。");
				}else if(data.state  == 500){
					alert("获取统计图失败");
				}
			}, error:function () {
				alert("获取统计图失败");
			}}
		);
	}

	this.initReportConfig = function(){
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/mis2/vrsr/json/demo1_action35.json"), async:false, cache:false, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath),"fastReportDir":base64.encode(_this.filePath)}, dataType:"json", 
			success:function (data) {
				if(data.state == 500){
					confirm(data.message);
					return;
				}
				_this.reportConfig = data;
			}, error:function (s) {
				$this.trigger({type:'error', opt:'初始化报表信息'});
			}}
		);
		
	}
	/** 初始化报表信息完成 */
	this.initReportInfoHandler = function(evt){
		//初始化工具条
		this.initToolbar();
		
		//初始化页数
		this.initPageCount();
	}

	/**
	 * 生成表格完成
	 */
	this.createDataCompleteHandler = function(){
		//设置页数信息：
//		this.initPageCount();
	}
	
	/** 计算总页数 */
	this.initPageCount = function(){
		refreshData = "no";
		//后台获取记录数
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/mis2/vrsr/json/demo1_action1.json"), async:true, cache:false, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath),"refreshData":"no", "fastReportDir":base64.encode(_this.filePath)}, dataType:"json", 
			success:function (data, textStatus) {
				refreshData = "yes";
				if(data.state == 500){
					confirm(data.message);
					return;
				}
			
				_this.reportRowCount = data.reportRowCount;
				_this.pageCount = Math.ceil(_this.reportRowCount / _this.perPageCount);

				if($("#showGraphBtn").attr('class') != 'hideGraph'){
					//showGraphBtnClick();
				}
				this.currPage = Math.min(this.currPage, this.pageCount-1);
				this.currPage = Math.max(0, this.currPage);		
				$("#pageMessage").text(_this.pageCount);
				$("#pageNum").val(_this.currPage+1);
				$("#pageMessage").attr("calTotalPage","true");
			}, error:function () {
				$this.trigger({type:'error', opt:'获取记录数'});
			}}
		);
	}
	
	/** 添加表格数据 */
	this.createTableData = function(){
		var begin = this.currPage * this.perPageCount;
		var length = this.perPageCount;
		//获取数据：
		loading();
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/mis2/vrsr/json/demo1_action3.json"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath),"refresh":""+refreshData,"setJson":base64.encode(setJson), "begin":begin, "length":length,"groupStyle":_this.reportConfig.groupStyle,"statPosition":this.reportConfig.statPosition}, dataType:"json", 
			success:function(data){
				_this.data = data;
				_this.createTableWithData(data);
			},
			error:function(){
				closeFile();
				$this.trigger({type:'error', opt:'获取数据'});
			}
		});
	}
	
	this.createTableWithData = function(data){
		debugger;
		refreshData="yes";
		closeFile();
		if(data.state == 500){
			confirm(data.message);
			return;
		}
			var hidCols=data.inVisibleCols;
			var hiddenFields=data.hiddenFields;
			if(!hidCols)hidCols=_this.reportConfig.inVisibleCols;
			if(!hiddenFields)hiddenFields=_this.reportConfig.hiddenFields;
		_this.initTable();
		//创建表格
		//分别创建四个table以及标题和底栏数据数据：
		var dispValues = data.dispValues;
		var title = data.title;
		var foot = data.foot;
		var cornerData = data.cornerData;
		var rowData = data.rowData;
		var colData = data.colData;
		var tableData = data.data;

		_this.cornerData=cornerData;
		_this.createCornerData(cornerData,dispValues);
		_this.createRowData(rowData);
		_this.createColData(colData,dispValues);
		_this.createData(tableData);
		
		//校验表头和数据宽度
		_this.checkWidth();
		//标题
		_this.createTitleData(title);
		//底栏
		_this.createFootData(foot);
		//设置table大小：
		$("#report_"+_this.reportId+"_table_corner").height($("#report_"+_this.reportId+"_table_corner").height());
		$("#report_"+_this.reportId+"_table_corner").width($("#report_"+_this.reportId+"_table_corner").width());
		$("#report_"+_this.reportId+"_table_colHeader").height($("#report_"+_this.reportId+"_table_colHeader").height());
		$("#report_"+_this.reportId+"_table_colHeader").width($("#report_"+_this.reportId+"_table_colHeader").width());
		$("#report_"+_this.reportId+"_table_rowHeader").height($("#report_"+_this.reportId+"_table_rowHeader").height());
		$("#report_"+_this.reportId+"_table_rowHeader").width($("#report_"+_this.reportId+"_table_rowHeader").width());
		$("#report_"+_this.reportId+"_table_data").height($("#report_"+_this.reportId+"_table_data").height());
		$("#report_"+_this.reportId+"_table_data").width($("#report_"+_this.reportId+"_table_data").width());
		
		//设置字段对齐方式
		//分组字段
		$("#report_"+_this.reportId+"_table_corner").find("td.corner").each(function(key,element){
			var colName = $(element).attr("colName");
			var colId = $(element).attr("colId");
			try{
				var align = data.groupFieldAligns[colName];
				if(align != "" && typeof align != null){
					$("#report_"+_this.reportId+"_table_rowHeader").find("td[colId='" + colId + "']").css("text-align",align)		
				}
			}catch(e){}
		});
		//列表字段
		$("#report_"+_this.reportId+"_table_colHeader").find("td.colHeader").each(function(key,element){
			var colName = $(element).attr("colName");
			var colId = $(element).attr("colId");
			try{
				var align = data.selectFieldAligns[colName];
				if(align != "" && typeof align != null){
					$("#report_"+_this.reportId+"_table_data").find("td[colId='" + colId + "']").css("text-align",align)		
				}
			}catch(e){}
		});
		
		//设置DIV大小：
		var height = 0;
		if($('#tableDiv').attr('clientHeight')){
			if(isFromDBD=='true'){//DBD下高度计算
				//height = $('#tableDiv').attr('clientHeight') - $('#report_' + _this.reportId + '_table_colHeader_div').height();
				height =  $('#report_' + _this.reportId + '_table__data').height();
				$('#tableDiv').css("overflow-y","auto");
			}else{
				height = $('#tableDiv').attr('clientHeight') - $('#report_' + _this.reportId + '_table_colHeader_div').height() -
				$("#report_"+_this.reportId+"_table_title_div").height() - $("#report_"+_this.reportId+"_table_foot_div").height();
			}
		}else{
			if(isFromDBD=='true'){//DBD下高度计算
				//height = $('#tableDiv').height() - $('#report_' + _this.reportId + '_table_colHeader_div').height();
				height =  $('#report_' + _this.reportId + '_table__data').height();
				$('#tableDiv').css("overflow-y","auto");
			}else{
				height = $('#tableDiv').height() - $('#report_' + _this.reportId + '_table_colHeader_div').height() - 
				$("#report_"+_this.reportId+"_table_title_div").height() - $("#report_"+_this.reportId+"_table_foot_div").height();
			}
			
		}
		$('#report_' + _this.reportId + '_table_corner').width($('#report_'+_this.reportId+'_table_rowHeader_div').width());
		if(isFromDBD!='true'){
				if(BrowserType()=="Chrome"||BrowserType()=="Firefox"){ //谷歌修正
				$("#report_"+_this.reportId+"_table_colHeader").width($("#report_"+_this.reportId+"_table_data").width());
				if($('#report_'+_this.reportId+'_table_data').width()>document.body.clientWidth-$('#report_' + _this.reportId + '_table_corner').width()-2){
					$('#report_'+_this.reportId+'_table_data_div').width(document.body.clientWidth-document.body.leftMargin-document.body.rightMargin-$('#report_' + _this.reportId + '_table_corner').width()-4);
					$('#report_' + _this.reportId + '_table_colHeader_div').width($('#report_'+_this.reportId+'_table_data_div').width()-16);
				}else{
					$('#report_'+_this.reportId+'_table_data_div').width(document.body.clientWidth-$('#report_' + _this.reportId + '_table_corner').width()-7);
					$('#report_' + _this.reportId + '_table_colHeader_div').width($('#report_'+_this.reportId+'_table_data_div').attr('clientWidth'));
				}	
			}else{
				$('#report_'+_this.reportId+'_table_data_div').width(document.body.clientWidth-$('#report_' + _this.reportId + '_table_corner').width());
				$('#report_' + _this.reportId + '_table_colHeader_div').width($('#report_'+_this.reportId+'_table_data_div').attr('clientWidth'));
			}
			//$('#report_'+_this.reportId+'_table_data_div').width($('#report_' + _this.reportId + '_table_colHeader_div').width());
			if(parseInt($.browser.version)==11){ //ie11兼容
				$('#report_' + _this.reportId + '_table_corner').height($('#report_' + _this.reportId + '_table_colHeader').height());
				var rowSpan = $('#report_'+_this.reportId+'_table_corner').find('tr').eq(0).find("td").eq(0).attr("rowSpan");
				var tdheight=$('#report_' + _this.reportId + '_table_colHeader').find("td[rowSpan="+rowSpan+"]").eq(0).height();
				$('#report_'+_this.reportId+'_table_corner').find('tr').eq(0).find("td").each(function(index,element){
					$(this).height(tdheight);
				});				    
			}else{
				$('#report_' + _this.reportId + '_table_corner').height($('#report_' + _this.reportId + '_table_colHeader').height());
				
			}
			
			if(BrowserType()=="Firefox"||BrowserType()=="Chrome"){ //修正chrome，ff 高度问题
				if($('#report_'+_this.reportId+'_table_data').width()>document.body.clientWidth-$('#report_' + _this.reportId + '_table_corner').width()-2){
					var dataTableDivNewHeight = parseInt($('#report_'+_this.reportId+'_table_data_div').height())+17;
					
					$('#report_'+_this.reportId+'_table_data_div').height(dataTableDivNewHeight);
				}
			}
		}
		
		$('#report_' + _this.reportId + '_table_corner').height($('#report_' + _this.reportId + '_table_colHeader').height());
		
		$('#report_'+_this.reportId+'_table_data_div').height(height);
		//$('#report_' + _this.reportId + '_table_corner').width($('#report_'+_this.reportId+'_table_rowHeader_div').width());
		$('#report_' + _this.reportId + '_table_rowHeader').width($('#report_'+_this.reportId+'_table_rowHeader_div').width());  //68478:16楼问题修复
		$('#report_'+_this.reportId+'_table_rowHeader_div').height(height);
		$('#report_'+_this.reportId+'_table_rowHeader_div').height($('#report_'+_this.reportId+'_table_data_div').attr('clientHeight'));
		
		
		//设置标题底栏宽度
		if($('#report_'+_this.reportId+'_table_data').width()>$('#report_'+_this.reportId+'_table_data_div').width()){
			$("#report_"+_this.reportId+"_table_title_div span").width(document.body.clientWidth);
			$("#report_"+_this.reportId+"_table_foot_div span").width(document.body.clientWidth);
		}else{
			if(BrowserType()=="Chrome"){ //谷歌修正
				$("#report_"+_this.reportId+"_table_title_div .title").parent().width($("#report_"+_this.reportId+"_table_corner").width()+$("#report_"+_this.reportId+"_table_colHeader").width());
				$("#report_"+_this.reportId+"_table_foot_div .foot").parent().width($("#report_"+_this.reportId+"_table_corner").width()+$("#report_"+_this.reportId+"_table_colHeader").width());
				//$("#report_"+_this.reportId+"_table_title_div span").width($("#report_"+_this.reportId+"_table_corner").width()+$("#report_"+_this.reportId+"_table_colHeader").width()-$("#report_"+_this.reportId+"_table_title_div span").css('padding'));
				//$("#report_"+_this.reportId+"_table_foot_div span").width($("#report_"+_this.reportId+"_table_corner").width()+$("#report_"+_this.reportId+"_table_colHeader").width()-$("#report_"+_this.reportId+"_table_foot_div span").css('padding'));
			}else if(BrowserType()=="Firefox"){
				$("#report_"+_this.reportId+"_table_colHeader").width($("#report_"+_this.reportId+"_table_colHeader").width()+2);
				$("#report_"+_this.reportId+"_table_title_div .title").parent().width($("#report_"+_this.reportId+"_table_corner").width()+1+$("#report_"+_this.reportId+"_table_colHeader").width()+1);
				$("#report_"+_this.reportId+"_table_foot_div .foot").parent().width($("#report_"+_this.reportId+"_table_corner").width()+$("#report_"+_this.reportId+"_table_colHeader").width());
			}else{
				$("#report_"+_this.reportId+"_table_title_div span").width($("#report_"+_this.reportId+"_table_corner").width()+$("#report_"+_this.reportId+"_table_colHeader").width());
				$("#report_"+_this.reportId+"_table_foot_div span").width($("#report_"+_this.reportId+"_table_corner").width()+$("#report_"+_this.reportId+"_table_colHeader").width());
			}
			
		}
		//调整标题、低栏padding
//				$("#report_"+_this.reportId+"_table_title_div span").css('padding',0).css("padding-top",8);
//				$("#report_"+_this.reportId+"_table_foot_div span").css('padding',0).css("padding-top",8);

//				var scrollBarWidth = $('#report_' + _this.reportId + '_table_data_div').width() - $('#report_' + _this.reportId + '_table_data_div').attr('clientWidth');
//				$('#report_'+_this.reportId+'_table_data_div').width($('#report_'+_this.reportId+'_table_data_div').width() + scrollBarWidth);
//				$('#report_'+_this.reportId+'_table_data_div').width(Math.max($('#tableDiv').width(), $('#report_'+_this.reportId+'_table_colHeader_div').width()) - $('#report_'+_this.reportId+'_table_rowHeader_div').width());
		if(isFromDBD=='true'){
			$("#report_"+_this.reportId+"_table_title_div").css("display","none");
			$("#report_"+_this.reportId+"_table_foot_div").css("display","none");
		}
		var tempHeader=changeRowAndCol(cornerData);
		var tempData=changeRowAndCol(rowData);
		var obj={};
		for(var i=0; i<tempHeader.length&&i<tempData.length; i++){
			colNames[i]=tempHeader[i][tempHeader[i].length-1];
			for(var j=0;j<tempData[i].length;j++){;
				if(!obj[j]){
					if(tempData[i][j].indexOf(" 合计")>=0||tempData[i][j].indexOf(" 总计")>=0
					||tempData[i][j].indexOf("单计")>=0||tempData[i][j].indexOf("计数")>=0||tempData[i][j].indexOf("求平均值")>=0
					||tempData[i][j].indexOf("求最小值")>=0||tempData[i][j].indexOf("求最大值")>=0||tempData[i][j].indexOf("求和")>=0
					||tempData[i][j]==""||tempData[i][j]==" "
					){
						obj[j] =true;
					}
				}
			}
			colValues[i]=distinctArray(tempData[i],obj);
		}
		var temp=tempHeader.length;
		tempHeader=changeRowAndCol(colData);
		tempData=changeRowAndCol(tableData);
		for(var i=0; i<tempHeader.length&&i<tempData.length; i++){
			colNames[i+temp]=tempHeader[i][tempHeader[i].length-1];
			colValues[i+temp]=distinctArray(tempData[i],obj);
		}

		// 调用回调函数：
		try{
			if(isFromDBD!="true"&& useQuickButton){//DBD组件内暂时隐藏该功能
				addBtn(_this.reportId);
			}
		}catch(e){}
		_this.initPageCount();
		try{
			for(var j=0;j<hiddenFields.length;j++){
				vrsrHideFields(hiddenFields[j],_this.reportId);
			}
			for(var j=0;j<hidCols.length;j++){
				vrsrHideCol(hidCols[j],_this.reportId);
			}
		}catch(e){//alert("分组字段不能隐藏")
		}
		$('#report_'+_this.reportId+'_table_rowHeader').find('tr').each(function(index,element){
			var trheight=$(element).height();
			$('#report_'+ _this.reportId +'_table_data').find('tr').eq(index).height(trheight);
		});
		
		//$this.trigger('createDataComplete');
		// 设置布局：
		_this.setLayout(_this.layout);
	}
	
	
	
	/**
	 * 设置统计图布局：
	 */
	this.setLayout = function(layout){
		if(typeof(layout) == 'undefined'){
			layout = this.layout;
		}else{
			this.layout = layout;
		}
		// 设置页面布局：
		try{
			layout = parseInt(layout);
		}catch(e){
			
		}
		switch(layout){
			case -1:
				$("#chartLayout").hide();
			case 0: // 只显示表
				$("#tableDiv").css("display", "block");
				$("#tableDiv").css("width", "100%");
				$("#tableDiv").css("height", "100%");
				$("#chartDiv").css("display", "none");
				break;
			
			case 1: // 只显示图
				$("#chartDiv").css("display", "block");
				$("#chartDiv").css("width", "100%");
				$("#chartDiv").css("height", "100%");
				$("#tableDiv").css("display", "none");			
				break;
			
			case 2: // 显示表和图，图在左侧
				$("#chartDiv").css("display", "block");
				$("#chartDiv").css("width", "auto");
				$("#chartDiv").css("height", "100%");
				$("#chartDiv").css("float", "left");
				$("#tableDiv").css("display", "block");
				$("#tableDiv").width($("#reportContent").width() - $("#chartDiv").width());
				$("#tableDiv").css("height", "100%");
				$("#tableDiv").css("float", "right");
				break;
				
			case 3: // 显示表和图，图在右侧
				$("#chartDiv").css("display", "block");
				$("#chartDiv").css("width", "auto");
				$("#chartDiv").css("height", "100%");
				$("#chartDiv").css("float", "right");
				$("#tableDiv").css("display", "block");
				$("#tableDiv").width($("#reportContent").width() - $("#chartDiv").width());
				$("#tableDiv").css("height", "100%");
				$("#tableDiv").css("float", "left");
				break;
				
			case 4: // 显示表和图，图在上侧
				$("#chartDiv").css("display", "block");
				$("#chartDiv").css("width", "100%");
				$("#chartDiv").css("height", "auto");
				$("#chartDiv").css("float", "left");
				$("#tableDiv").css("display", "block");
				$("#tableDiv").css("width", "100%");
				$("#tableDiv").height($("#reportContent").height() - $("#chartDiv").height());
				$("#tableDiv").insertAfter($("#chartDiv"));
				// 设置滚动条：nicescroll-rails nicescroll-rails-vr && nicescroll-rails nicescroll-rails-hr
				$("#ascrail2001").css("top", parseInt($("#ascrail2001").css("top")) + $("#chartDiv").height() + "px");
				$("#ascrail2001-hr").css("top", parseInt($("#ascrail2001-hr").css("top")) + $("#chartDiv").height() + "px");
				break;
				
			case 5: // 显示表和图，图在下侧
				$("#chartDiv").css("display", "block");
				$("#chartDiv").css("width", "100%");
				$("#chartDiv").css("height", "auto");
				$("#tableDiv").css("display", "block");
				$("#tableDiv").css("width", "100%");
				$("#tableDiv").height($("#reportContent").height() - $("#chartDiv").height());
				$("#tableDiv").insertBefore($("#chartDiv"));
				// 设置滚动条：nicescroll-rails nicescroll-rails-vr && nicescroll-rails nicescroll-rails-hr
				$("#ascrail2001").css("top", parseInt($("#ascrail2001").css("top")) - $("#chartDiv").height() + "px");
				$("#ascrail2001-hr").css("top", parseInt($("#ascrail2001-hr").css("top")) - $("#chartDiv").height() + "px");
				break;
		}
		
		var table_title_div_height=0
		if(!$("#report_"+reportID+"_table_title_div").is(':hidden')){
			table_title_div_height=$("#report_"+reportID+"_table_title_div").height();
		}
		var table_foot_div_height=0;
		if(!$("#report_"+reportID+"_table_foot_div").is(':hidden')){
			table_foot_div_height=$("#report_"+reportID+"_table_foot_div").height();
		}
		//设置DIV大小：
		var height = 0;
		if($('#tableDiv').attr('clientHeight')){
			height = $('#tableDiv').attr('clientHeight') - $('#report_' + reportID + '_table_colHeader_div').height() - 
				table_title_div_height- table_foot_div_height;
		}else{
			height = $('#tableDiv').height() - $('#report_' + reportID + '_table_colHeader_div').height() - table_foot_div_height - table_foot_div_height;
		}
		if(BrowserType()!="Firefox"){
			$('#report_'+reportID+'_table_data_div').width($('#report_' + reportID + '_table_colHeader_div').width());
			$('#report_'+reportID+'_table_data_div').height(height);
		}
		$('#report_'+reportID+'_table_rowHeader_div').height(height);
		
		$("#report_"+reportId+"_table_colHeader_div").width($("#tableDiv").width() - $("#report_"+reportId+"_table_corner_div").width());
		$("#report_"+reportId+"_table_data_div").width($("#tableDiv").width() - $("#report_"+reportId+"_table_rowHeader_div").width());
		var tableWidth = $("#report_"+reportID+"_table_corner").width() + Math.min($("#report_"+reportId+"_table_colHeader").width(), $("#report_"+reportId+"_table_colHeader_div").width());
		$("#report_"+reportId+"_table_title_div").width(tableWidth);
		$("#report_"+reportId+"_table_foot_div").width(tableWidth);
		$("#report_"+reportId+"_table_title_div").find("span.title").width(tableWidth);
		$("#report_"+reportId+"_table_foot_div").find("span.foot").width(tableWidth);
		
		if($("#report_"+_this.reportId+"_table_corner").width() > $("#tableDiv").width() || $("#report_"+_this.reportId+"_table_corner").height() > $("#tableDiv").height()){ 
			// 空间不足，提示：
			$("#tableDiv").children().hide();
			$("#tableDiv").css("background-color", "gray");
			alert("没有足够空间显示数据表。请修改布局方式，或增大窗口！", 3);
			return;
		}else{
			$("#tableDiv").css("background-color", "white");
			$("#tableDiv").children().show();
		}
		
		$('#report_'+_this.reportId+'_table_data_div').niceScroll();
		
		//关联滚动条：
		$('#report_'+_this.reportId+'_table_data_div').scroll(function(){
			$('#report_'+_this.reportId+'_table_rowHeader_div').scrollTop($('#report_'+_this.reportId+'_table_data_div').scrollTop());
			$('#report_'+_this.reportId+'_table_colHeader_div').scrollLeft($('#report_'+_this.reportId+'_table_data_div').scrollLeft());
		});
	}
	/**校验修正数据行宽和表头行宽*/	
	this.checkWidth = function(){
		if(data_width>colHeader_width){
			//alert('数据宽'+data_width)	
			$("#report_"+this.reportId+"_table_data").width(colHeader_width);
		}else{
			//alert('表头宽'+colHeader_width);
			$("#report_"+this.reportId+"_table_colHeader").width(data_width);
		}
	}
	/** 创建标题表格数据*/
	this.createTitleData = function(data){
		if(data==null || data==undefined || data.length==0)
			return;
		var table_title_div = $("#report_"+this.reportId+"_table_title_div");
		table_title_div.height(_this.reportConfig.rowHeight);
		
		var clz = 'title';
		$(table_title_div).append('<span title="'+data+'" class="'+clz+'" style="display:block;whiteSpace:nowrap;text-overflow:ellipsis;overflow:hidden; width: 100%; height:100%;"><nobr>' + data +'</nobr></span>');
		//$(tr).appendTo($("#report_"+this.reportId+"_table_title"));
		//添加样式：
//		$("#report_"+this.reportId+"_table_title_div span").css('border', 'solid 1px').height(32);
		$("#report_"+this.reportId+"_table_title_div .title").css(this.reportConfig.css.title);
//		$("#report_"+this.reportId+"_table_title_div span").css('padding',$("#report_"+this.reportId+"_table_title_div .title").height()/2-(this.reportConfig.css.title.fontSize)/2); //使标题文字竖直居中
	
	
	
	}
	/** 创建底栏表格数据*/
	this.createFootData = function(data){
		if(data==null || data==undefined || data.length==0)
			return;
		var table_foot_div = $("#report_"+this.reportId+"_table_foot_div");
		table_foot_div.height(_this.reportConfig.rowHeight);
		
		var clz = 'foot';
		$(table_foot_div).append('<span title="'+data+'"  class="'+clz+'" style="display:block;whiteSpace:nowrap;text-overflow:ellipsis;overflow:hidden; width:100%; height:100%"><nobr>' + data +'</nobr></span>');
		//添加样式：
//		$("#report_"+this.reportId+"_table_foot_div span").css('border', 'solid 1px').height(32);
		$("#report_"+this.reportId+"_table_foot_div .foot").css(this.reportConfig.css.foot);
//		$("#report_"+this.reportId+"_table_foot_div span").css('padding',$("#report_"+this.reportId+"_table_foot_div .foot").height()/2-(this.reportConfig.css.foot.fontSize)/2);  //使底栏文字竖直居中
	}
	/** 创建左上角表格数据 */
	this.createCornerData = function(data,dispValues){
		if(data==null || data==undefined || data.length==0 || data==""){
			flag = true;  //当前报表不包含左表头，flag置为true, 需要后续区分处理
			return;
		}
		for(var i=0; i<data.length; i++){
			var tr = $("<tr></tr>");
			for(var j=0; j<data[i].length; j++){
				var clz = 'corner';
				var value = data[i][j].v;
				var disValue=value;
				var cellWidth = data[i][j].cellWidth;
				if(_this.cornerColWidth[j])
					cellWidth = _this.cornerColWidth[j];
				if(BrowserType()=="Chrome"){
					cellWidth = cellWidth -3;
				}
				try{
				var tempValue=dispValues[value];
				if(typeof(tempValue) != "undefined" && tempValue != null && tempValue != ""){
					disValue=tempValue
				}
				}catch(e){}
				$(tr).append('<td class="'+clz+'" colId="'+j+'" colName="'+value+'" colIndex="'+(j+1)+'" cellWidth="'+cellWidth+'" style="width:'+cellWidth+'px;">' + disValue +'</td>');
				//$(tr).append('<td class="'+clz+'" colId="'+j+'">' + value +'</td>');
			}
			$(tr).appendTo($("#report_"+this.reportId+"_table_corner"));
		}
		//添加样式：
		$("#report_"+this.reportId+"_table_corner td").css({'border': 'solid 1px', 'height': this.reportConfig.rowHeight + 'px'});
		if(typeof(this.reportConfig.css.colHeaderStyle) != "undefined"&&this.reportConfig.css.colHeaderStyle!=""&&this.reportConfig.css.colHeaderStyle!=null){
			$("#report_"+this.reportId+"_table_corner .corner").css(this.reportConfig.css.colHeaderStyle);
		}else{
			$("#report_"+this.reportId+"_table_corner .corner").css(this.reportConfig.css.corner);
		}
		
		//合并单元格：
		$("#report_"+this.reportId+"_table_corner").height($("#report_"+this.reportId+"_table_corner").height());
		_this.mergeCorner();
		//暂时屏蔽corner拖拽  _this.reportConfig.groupFields
		var flagtuozhuaicorner = false;
		$(".corner").each(function(index, td){
			$(this).hover(function(){
				if($(this).find('div[id=tmp]').length==0){
					var minwidth = 25;
					var tmpwidth = $(this).width()-1;
					var tmpheight =$(this).height()-1;
					try{
						$(this).wrapInner("<span id=tmpspan></span>");
						minwidth = $(this).find('span[id=tmpspan]').width()+5;
						$(this).find('span[id=tmpspan]').children().eq(0).unwrap();
					}catch(e){
						minwidth = 25;
					}
					
					//$(this).wrapInner("<div id = tmp style=' width: 165px; height: 35px; text-align: left; vertical-align: middle; display:table-cell;  '></div>");
					$(this).wrapInner("<div id = tmp style=' width: "+tmpwidth+"px; height: "+tmpheight+"px; text-align: "+$(this).css("text-align")+"; vertical-align: "+$(this).css("vertical-align")+"; display:table-cell;  border:1px solid red'></div>");
					//$(this).wrapInner("<div id = tmp style=' "+$(this).attr("style")+" display:table-cell;  '></div>");
					$(this).find('div[id=tmp]').each(function(){
						//$(this).find('div[name=menuButton]').eq(0).clone().insertAfter($(this)); 
						//var width = $(this).attr("colname").length*12; 
						$(this).resizable({
						//alsoResize : "#report_"+this.reportId+"_table_corner",
						autoHide:false, 
						ghost:false,
						minWidth: minwidth,
						handles:'e,s', 
						helper: "ui-resizable-helper",
						resize: function( event, ui ) {
							flagtuozhuaicorner = true;
						},
						stop: function( event, ui ) {
							// 当前拖动的列宽： 
							var td = $(ui.originalElement).parent();
							var tr = $(td).parent("tr");
							var colIndex = $(td).index();
							var rowIndex = $(tr).index();
							
							var rowSpan = $(td).attr("rowSpan");
							if(rowSpan == null || rowSpan == "")
								rowSpan = 1;
							
							for(var row=0; row<rowSpan; row++){
								$("#report_"+_this.reportId+"_table_corner").find("tr").eq(rowIndex + row).find("td").eq(colIndex).attr("cellWidth", ui.size.width);
							}
							
							// 记录单元格宽度：
							_this.cornerColWidth.length = [];
							
							$("#report_"+_this.reportId+"_table_corner tr:last td").each(function(index, td){
								_this.cornerColWidth.push($(td).attr("cellWidth"));
							});	


							// 重新生成表格：
							_this.createTableWithData(_this.data);
							
							flagtuozhuaicorner =false;

							td.find('div[id=tmp]').resizable( "destroy" ); 
							td.find('div[id=tmp]').children().eq(0).unwrap();
							//$(this).siblings('div[name=menuButton]').remove();
						}
						});
					});
				}
			},function(){
			  if($(this).find('div[id=tmp]').length>0 && !flagtuozhuaicorner){
				//$(this).resizable( "destroy" );  
				$(this).find('div[id=tmp]').resizable( "destroy" ); 
				$(this).find('div[id=tmp]').children().eq(0).unwrap();
				/* 
				if($(this).find('div[name=menuButton]').length>0 && !flagtuozhuaicorner){
					//$(this).resizable( "destroy" );  
					//$(this).find('div[name=menuButton]').remove();
					$(this).find('div[name=menuButton]').each(function(index, td){
						if(index!=0){
							$(this).remove();
						}
					});
					//cpflagmousedown=false;
				}
				*/
				//cpflagmousedown=false;
			  }
			  
			  
			  //console.log("cpflagmousedown2:"+cpflagmousedown);
			  //x=0;
			
			});
			
		});
		/*
		$(".corner").resizable({
			//alsoResize : "#report_"+this.reportId+"_table_corner",
			autoHide:false, 
			ghost:false,
			handles:'e,s', 
			helper: "ui-resizable-helper",
			stop: function( event, ui ) {
				// 当前拖动的列宽： 
				var td = ui.originalElement;
				var tr = $(td).parent("tr");
				var colIndex = $(td).index();
				var rowIndex = $(tr).index();
				
				var rowSpan = $(td).attr("rowSpan");
				if(rowSpan == null || rowSpan == "")
					rowSpan = 1;
				
				for(var row=0; row<rowSpan; row++){
					$("#report_"+_this.reportId+"_table_corner").find("tr").eq(rowIndex + row).find("td").eq(colIndex).attr("cellWidth", ui.size.width);
				}
				
				// 记录单元格宽度：
				_this.cornerColWidth.length = [];
				
				$("#report_"+_this.reportId+"_table_corner tr:last td").each(function(index, td){
					_this.cornerColWidth.push($(td).attr("cellWidth"));
				});	
				console.log("cornerColWidth：" + _this.cornerColWidth);

				// 重新生成表格：
				_this.createTableWithData(_this.data);
			}
		});
		//*/
	}
	/** 创建左表头数据 */
	this.createRowData = function(data){
		saveDataMappingSubSumHeaderLevelJson = {};
		var rowDataLen = this.reportConfig.groupFields.length;
		if(data==null || data==undefined || data.length==0 || data==""){
			flag = true;  //当前报表不包含左表头，flag置为true, 需要后续区分处理
			return;
		}
		for(var i=0; i<data.length; i++){
			var tr = $("<tr></tr>");
			var headerData="";
			for(var j=0; j<data[i].length; j++){
				if(data[i]==null||"null"==data[i]){
					var clz = 'rowHeader';
					headerData+=" "
					$(tr).append('<td headerData="'+headerData+'" class="'+clz+'"  style="width:'+100+'px;">'+""+'</td>');
				}else{
					var level = j;
					var value = data[i][j].v;
					var state = data[i][j].s;
					var href = data[i][j].h;
					var hrefParams = data[i][j].hrefParams;//超链接参数
					var hrefTarget = htFormat(data[i][j].ht);//超链接弹出方式
					if(this.reportConfig.groupStyle==6||this.reportConfig.groupStyle==4){
						//分组上合计上/分组下合计下 情况下不显示分组明细值
						if(state==-1){
							var disValue = data[i][j].fv;
						}else{
							var disValue = ""; 
						}
					}else{
						var disValue = data[i][j].fv;
					}

					var cellWidth = data[i][j].cellWidth;
					if(_this.cornerColWidth[j])
						cellWidth = _this.cornerColWidth[j];
					if(typeof(disValue) == "undefined" || disValue == null || disValue == ""){
						disValue = value;
					}
					
					if(href){
						disValue = '<a href="javascript:void(0)" onclick="dataHref(\''+href+'\',\''+hrefTarget+'\',\''+hrefParams+'\')">'+disValue+'</a>';
					}
					
					var clz = 'rowHeader';
					var groupFieldStyles = "";
					if(state == -1){
						clz = 'subSumHeader';
						if(value!=""){
							if(saveDataMappingSubSumHeaderLevelJson[''+i]){
							}else{
								if(/^.*\s求和$/.test(value)||/^.*\s求最小值$/.test(value)||/^.*\求最大值$/.test(value)||
									/^.*\s求平均值$/.test(value)||/^.*\s计数$/.test(value)||/^.*\s单计$/.test(value)){
									saveDataMappingSubSumHeaderLevelJson[''+i] = (level+1);
								}
							}
						}
						//查找本列对应的fieldStatStyles中合计样式
					}else if(state == -2){
						clz = 'sumHeader';
					}else{
						//查找列对应的内容样式
						groupFieldStyles = this.getGroupFieldStyle(value,j,"group");
					}
						
	//				var condition = this.createCondition(data[i], j);
					
					var title = "";
					if(state == 0){
						//折叠状态：提示可展开
						title = "双击展开查看下级数据";
					}else if(state == 1){
						//展开状态：提示可折叠
						title = "双击折叠隐藏该组数据";
					}
					headerData+=value+" ";
					//添加一个分组起始单元格属性
					var defaultRowIndex = data[i][j].defaultRowIndex+"";
					if(typeof(defaultRowIndex) == "undefined" || defaultRowIndex == null || defaultRowIndex == ""){
						defaultRowIndex = "";
					}
					var groupRow = "";
					if(data[i][j].groupRow!=null&&data[i][j].groupRow!=""&&typeof(data[i][j].groupRow) != "undefined"){
						groupRow = data[i][j].groupRow;
					}
					$(tr).append('<td headerData="'+headerData+'" class="'+clz+'" colId="'+j+'" level="'+level+'" v="'+value+'" s="'+state+'" title="'+title+'" style="width:'+cellWidth+'px;" defaultRowIndex="'+defaultRowIndex+'" groupFieldStyles="'+groupFieldStyles+'" groupRow="'+groupRow+'">'+disValue+'</td>');
				}
				
			}
			
			//分组上合计上/分组下合计下 情况下隐藏分组行
			if(this.reportConfig.groupStyle==4||this.reportConfig.groupStyle==6){
				if(trIsGroupRow($(tr))){
					$(tr).css("display","none");
				}
			}
			
			//加一个行号，避免合并单元格时样式偏差
			$(tr).append('<td class="hidden remove" style="display:none">'+i+'</td>');
			
			$(tr).appendTo($("#report_"+this.reportId+"_table_rowHeader"));
		}
		
		//添加样式：
		$("#report_"+this.reportId+"_table_rowHeader td").css({'border': 'solid 1px', 'height': this.reportConfig.rowHeight + 'px'});
//		$("#report_"+this.reportId+"_table_rowHeader td").height(this.reportConfig.rowHeight);
		//$("#report_"+this.reportId+"_table_rowHeader .rowHeader").css(this.reportConfig.css.rowHeader);
		
		//添加分组合计样式，fieldStatStyles>reportConfig.css.subSumHeaderStyle>reportConfig.css.subSumHeader
		
		
		if(typeof(this.reportConfig.css.subSumHeaderStyle) != "undefined"&&this.reportConfig.css.subSumHeaderStyle!=""&&this.reportConfig.css.subSumHeaderStyle!=null){
			$("#report_"+this.reportId+"_table_rowHeader .subSumHeader").css(this.reportConfig.css.subSumHeaderStyle);
		}else{
			$("#report_"+this.reportId+"_table_rowHeader .subSumHeader").css(this.reportConfig.css.subSumHeader);
			//根据层级重新设置小计样式
			for(var z = 0; z<rowDataLen;z++){
				var newAddStyleName = "subSumHeader"+(z+1);
				var newAddStyle = this.reportConfig.css[newAddStyleName];
				if(newAddStyle){
					$("#report_"+this.reportId+"_table_rowHeader .subSumHeader[level='"+z+"']").css(newAddStyle);
				}
			}
		}
		if(typeof(this.reportConfig.css.sumHeaderStyle) != "undefined"&&this.reportConfig.css.sumHeaderStyle!=""&&this.reportConfig.css.sumHeaderStyle!=null){
			$("#report_"+this.reportId+"_table_rowHeader .sumHeader").css(this.reportConfig.css.sumHeaderStyle);
		}else{
			$("#report_"+this.reportId+"_table_rowHeader .sumHeader").css(this.reportConfig.css.sumHeader);
		}
		//合并单元格：
		if(this.reportConfig.groupStyle>=3){
			_this.mergeRowHeaderGroupTop();
		}else{
			_this.mergeRowHeader();
		}
		
		$("#report_"+this.reportId+"_table_rowHeader .rowHeader").each(function(){
			var totalLevel = _this.reportConfig.groupFields.length;
			var newAddRowStyleName = "rowHeader"+(parseInt($(this).attr("level"))+1);
			var newAddRowStyle = _this.reportConfig.css[newAddRowStyleName];
			if(_this.reportConfig.groupStyle<3){
				if($(this).attr("groupFieldStyles")!=null&&$(this).attr("groupFieldStyles")!=""){
					_this.setFieldCssFromCssStr($(this).attr("groupFieldStyles"),this);
			    }else if(typeof(_this.reportConfig.css.detailStyle) != "undefined"&&_this.reportConfig.css.detailStyle!=""&&_this.reportConfig.css.detailStyle!=null){
				    $(this).css(_this.reportConfig.css.detailStyle);
			    }else{
					if(newAddRowStyle){
						$(this).css(newAddRowStyle);
					}else{
						$(this).css(_this.reportConfig.css.rowHeader);
					}
			    }
			}else{
				if($(this).attr("groupRow")=="yes"){
					if($(this).attr("groupFieldStyles")!=null&&$(this).attr("groupFieldStyles")!=""){
						_this.setFieldCssFromCssStr($(this).attr("groupFieldStyles"),this);
			    	}else if(typeof(_this.reportConfig.css.detailStyle) != "undefined"&&_this.reportConfig.css.detailStyle!=""&&_this.reportConfig.css.detailStyle!=null){
				    	$(this).css(_this.reportConfig.css.detailStyle);
			    	}else{
				    	if(newAddRowStyle){
						$(this).css(newAddRowStyle);
					}else{
						$(this).css(_this.reportConfig.css.rowHeader);
					}
			    	}
				}else{
					if(typeof(_this.reportConfig.css.groupEmptyStyle) != "undefined"&&_this.reportConfig.css.groupEmptyStyle!=""&&_this.reportConfig.css.groupEmptyStyle!=null){
						$(this).css(_this.reportConfig.css.groupEmptyStyle);
					}else{
						if(newAddRowStyle){
							$(this).css(newAddRowStyle);
						}else{
							$(this).css(_this.reportConfig.css.rowHeader);
						}
					}
				}
			}
			if($(this).attr("mergedTd")=="yes"){
				$(this).removeAttr("mergedTd");
				$(this).css("text-align","left");
                $(this).css("border-right-width","0px");
			}
		});
		
		//rowHeader 添加双击事件：
		$(".rowHeader").dblclick(function(){
			if($(this).attr('s') == 0) //折叠状态，双击展开
				_this.unfold($(this));
			else if($(this).attr('s') == 1) //展开状态：双击折叠
				_this.fold($(this));
		});
		
		//subSumHeader 添加双击事件：适用于合计行在上方的情况
		if(this.reportConfig.groupStyle==4||this.reportConfig.groupStyle==6){
				$(".subSumHeader").dblclick(function(){
				//if($(this).attr('s') == 0||$(this).attr('s') == "0") //折叠状态，双击展开
				//	_this.unfold($(this));
				//else if($(this).attr('s') == 1||$(this).attr('s') == "1") //展开状态：双击折叠
				//	_this.fold($(this));
				_this.fold($(this));
			});
		}
	
	}
	
	/** 创建上表头数据 */
	this.createColData = function(data,dispValues){
		if(data==null || data==undefined || data.length==0)
			return;
			
		for(var i=0; i<data.length; i++){
			var tr = $("<tr></tr>");
			for(var j=0; j<data[i].length; j++){
				var clz = 'colHeader';
				var value = data[i][j].v;
				var disValue = data[i][j].fv;
				var cellWidth = data[i][j].cellWidth;
				if(_this.colHeaderColWidth[j])
					cellWidth = _this.colHeaderColWidth[j];
				if(typeof(disValue) == "undefined" || disValue == null || disValue == ""){
					disValue = value;
				}
				try{
					var tempValue=dispValues[disValue];
					if(typeof(tempValue) != "undefined" && tempValue != null && tempValue != ""){
						disValue=tempValue
					}
				}catch(e){}
				//$(tr).append('<td class="'+clz+'" colId="'+j+'" v="'+value+'" >'+disValue+'</td>');
				var style="";
				var styles=_this.reportConfig.fieldStyles[_this.reportConfig.selectFields[j]];
				if(typeof(styles)=="undefined"||styles==null||styles.length==0){
					$(tr).append('<td class="'+clz+'" colId="'+j+'" nostyle="yes"  v="'+value+'" colName="'+value+'" colIndex="'+(j+this.cornerData[i].length+1)+'" cellWidth="'+cellWidth+'" style="width:'+cellWidth+'px;font-size:xx-small;">'+disValue+'</td>');
				}else{
					style = styles[0];
					$(tr).append('<td class="'+clz+'" colId="'+j+'" style="'+style+'"  v="'+value+'" colName="'+value+'" colIndex="'+(j+this.cornerData[i].length+1)+'" cellWidth="'+cellWidth+'"  style="width:'+cellWidth+'px;font-size:xx-small;">'+disValue+'</td>');
				}
			}
			$(tr).appendTo($("#report_"+this.reportId+"_table_colHeader"));
		}

		//设置单元格大小
		$("#report_"+this.reportId+"_table_colHeader td").css({'border': 'solid 1px', 'height': this.reportConfig.rowHeight + 'px'});
		if(flag){
			if(typeof(this.reportConfig.css.colHeaderStyle) != "undefined"&&this.reportConfig.css.colHeaderStyle!=""&&this.reportConfig.css.colHeaderStyle!=null){
				$("#report_"+this.reportId+"_table_colHeader .colHeader").css(this.reportConfig.css.colHeaderStyle);
			}else{
				$("#report_"+this.reportId+"_table_colHeader .colHeader").css(this.reportConfig.css.colHeader);
			}
		}
		//合并单元格：
		_this.mergeColHeader();
		//添加样式：
		//$("#report_"+this.reportId+"_table_colHeader").height($("#report_"+this.reportId+"_table_colHeader").height());
		//$("#report_"+this.reportId+"_table_colHeader").width($("#report_"+this.reportId+"_table_colHeader").width());
		$("#report_"+this.reportId+"_table_colHeader .colHeader").each(function(){
			if($(this).attr("nostyle")=="yes"){
				if(typeof(_this.reportConfig.css.colHeaderStyle) != "undefined"&&_this.reportConfig.css.colHeaderStyle!=""&&_this.reportConfig.css.colHeaderStyle!=null){
					$(this).css(_this.reportConfig.css.colHeaderStyle);
				}else{
					$(this).css(_this.reportConfig.css.colHeader);
				}
			}
		})
		colHeader_width = $("#report_"+this.reportId+"_table_colHeader tr").width();
		
		
		//暂时屏蔽colHeader拖拽
		/*
		$(".colHeader").each(function(index, td){
			//_this.colHeaderColWidth.push($(td).attr("cellWidth"));
			var width = $(this).attr("v").length*12;
			$(this).resizable({
			//alsoResize: "#report_"+this.reportId+"_table_colHeader",
			autoHide:false,
			ghost:false, 
			minWidth: width,  
			handles:"e,s", 
			helper: "ui-resizable-helper",
			animate: false, 
			stop: function( event, ui ) {
				// 当前拖动的列宽：
				var td = ui.originalElement;
				var tr = $(td).parent("tr");
				var colIndex = $(td).index();
				var rowIndex = $(tr).index();
				
				var rowSpan = $(td).attr("rowSpan");
				if(rowSpan == null || rowSpan == "")
					rowSpan = 1;
				
				for(var row=0; row<rowSpan; row++){
					$("#report_"+_this.reportId+"_table_colHeader").find("tr").eq(rowIndex + row).find("td").eq(colIndex).attr("cellWidth", ui.size.width);
				}
				
				
				// 记录单元格宽度：
				_this.colHeaderColWidth.length = [];
				
				$("#report_"+_this.reportId+"_table_colHeader tr:last td").each(function(index, td){
					_this.colHeaderColWidth.push($(td).attr("cellWidth"));
					
				});	
				//console.log("colHeaderColWidth：" + _this.colHeaderColWidth);

				// 重新生成表格：
				_this.createTableWithData(_this.data);
			}
			
			});
		});
		*/
		/*
		$(".colHeader").resizable({
			//alsoResize: "#report_"+this.reportId+"_table_colHeader",
			autoHide:false,
			ghost:false, 
			minWidth: 12,  
			handles:"e,s", 
			helper: "ui-resizable-helper",
			animate: false, 
			stop: function( event, ui ) {
				// 当前拖动的列宽：
				var td = ui.originalElement;
				var tr = $(td).parent("tr");
				var colIndex = $(td).index();
				var rowIndex = $(tr).index();
				
				var rowSpan = $(td).attr("rowSpan");
				if(rowSpan == null || rowSpan == "")
					rowSpan = 1;
				
				for(var row=0; row<rowSpan; row++){
					$("#report_"+_this.reportId+"_table_colHeader").find("tr").eq(rowIndex + row).find("td").eq(colIndex).attr("cellWidth", ui.size.width);
				}
				
				
				// 记录单元格宽度：
				_this.colHeaderColWidth.length = [];
				
				$("#report_"+_this.reportId+"_table_colHeader tr:last td").each(function(index, td){
					_this.colHeaderColWidth.push($(td).attr("cellWidth"));
					
				});	
				console.log("colHeaderColWidth：" + _this.colHeaderColWidth);

				// 重新生成表格：
				_this.createTableWithData(_this.data);
			}
			
		});
		//*/
		//$(".colHeader[colspan]").resizable( "destroy" );
		//$(".colHeader[v=产品名称]").resizable( "destroy" ); 
		
		//var cpflagmousedown=false;//是否按下左键
		var flagtuozhuai =false;//是否拖动中
		/*
		$(".colHeader[v=产品名称]").mousedown(function(){
			cpflagmousedown = true;
		});
		
		$(".colHeader[v=产品名称]").mouseup(function(){
			console.log("mouseup");
			cpflagmousedown = false;
			$(this).find('div[id=tmp]').resizable( "destroy" );
			$(this).find('div[id=tmp]').children().eq(0).unwrap();
		});
		*/
		//mouseout鼠标从元素上移开  mouseenter
		//$(".colHeader[v=产品名称]").one("mouseenter",function(){
	$(".colHeader").each(function(index, td){ 
		var selectFieldsarr = _this.reportConfig.selectFields;
		
		if($.inArray($(this).attr("v"), selectFieldsarr)==-1){
			
		}else{
				$(this).hover(function(){
				if($(this).find('div[id=tmp]').length==0){
					//$(this).attr("style")
					$(this).wrapInner("<span id=tmpspan></span>");
					var minwidth = 25;
					var tmpwidth = $(this).width()-1;
					var tmpheight =$(this).height()-1;
					try{
						$(this).wrapInner("<span id=tmpspan></span>");
						minwidth = $(this).find('span[id=tmpspan]').width()+6; 
						$(this).find('span[id=tmpspan]').children().eq(0).unwrap(); 
					}catch(e){
						minwidth = 25;
					}
					$(this).find('span[id=tmpspan]').children().eq(0).unwrap();
				   //$(this).wrapInner("<div id = tmp style=' width: 165px; height: 35px; text-align: left; vertical-align: middle; display:table-cell;  '></div>");
				   $(this).wrapInner("<div id = tmp style=' width: "+tmpwidth+"px; height: "+tmpheight+"px; text-align: "+$(this).css("text-align")+"; vertical-align: "+$(this).css("vertical-align")+"; display:table-cell;  border:1px solid red'></div>");
				   //$(this).wrapInner("<div id = tmp style=' "+$(this).attr("style")+" display:table-cell;  '></div>");
				   $(this).find('div[id=tmp]').each(function(){  
						//$(this).find('div[name=menuButton]').eq(0).clone().insertAfter($(this)); 
						$(this).resizable({
							//alsoResize: "#report_"+this.reportId+"_table_colHeader",
							autoHide:false,
							ghost:false, 
							minWidth: minwidth,  
							handles:"e,s", 
							helper: "ui-resizable-helper",
							animate: false, 
							resize: function( event, ui ) {
								flagtuozhuai = true;
							},
							stop: function( event, ui ) {
								// 当前拖动的列宽：
								var td = $(ui.originalElement).parent();
								var tr = $(td).parent("tr");
								var colIndex = $(td).index();
								var rowIndex = $(tr).index();
								var rowSpan = $(td).attr("rowSpan");
								if(rowSpan == null || rowSpan == "")
									rowSpan = 1;
								
								for(var row=0; row<rowSpan; row++){
									$("#report_"+_this.reportId+"_table_colHeader").find("tr").eq(rowIndex + row).find("td").eq(colIndex).attr("cellWidth", ui.size.width);
								}
								
								
								// 记录单元格宽度：
								_this.colHeaderColWidth.length = [];
								
								$("#report_"+_this.reportId+"_table_colHeader tr:last td").each(function(index, td){
									_this.colHeaderColWidth.push($(td).attr("cellWidth"));
									
								});	

								// 重新生成表格：
								_this.createTableWithData(_this.data);
							
								flagtuozhuai =false;
								td.find('div[id=tmp]').resizable( "destroy" ); 
								td.find('div[id=tmp]').children().eq(0).unwrap();
								//$(this).siblings('div[name=menuButton]').remove();
							}
						});
			   
					});
					//x++;
				}
				
			},function(){
			  if($(this).find('div[id=tmp]').length>0 && !flagtuozhuai){
				//$(this).resizable( "destroy" );  
				$(this).find('div[id=tmp]').resizable( "destroy" ); 
				$(this).find('div[id=tmp]').children().eq(0).unwrap();
				/*
				if($(this).find('div[name=menuButton]').length>0 && !flagtuozhuai){
					//$(this).resizable( "destroy" );  
					//$(this).find('div[name=menuButton]').remove();
					$(this).find('div[name=menuButton]').each(function(index, td){
						if(index!=0){
							$(this).remove();
						}
					});
					//cpflagmousedown=false;
				}
				*/
				//cpflagmousedown=false;
			  }
			  
			  
			  //console.log("cpflagmousedown2:"+cpflagmousedown);
			  //x=0;
			
			});
		}

	});
	/*
	$(".colHeader[colspan]").each(function(index, td){
		$(this).unbind(); 
	});
	$(".colHeader[colspan]").resizable( "destroy" );
	*/
	
		////////////////////////////////////////////////////////
		/*
		$(".colHeader[v=客户名称]").resizable( "destroy" ); 
		var khflagmousedown=false;//是否按下左键
		$(".colHeader[v=客户名称]").mousedown(function(){
			khflagmousedown = true;
		});
		$(".colHeader[v=客户名称]").mouseup(function(){
			khflagmousedown = false;
			$(this).resizable( "destroy" );
		});
		
		//mouseout鼠标从元素上移开

		$(".colHeader[v=客户名称]").hover(function(){
			//if(x==0){
				console.log("鼠标移入");
			   //$(this).wrapInner("<div id = tmp></div>");
			   //$(this).find('div[id=tmp]').each(function(){  
					$(this).resizable({
					//alsoResize: "#report_"+this.reportId+"_table_colHeader",
					autoHide:false,
					ghost:false, 
					minWidth: 12,  
					handles:"e,s", 
					helper: "ui-resizable-helper",
					animate: false, 
						stop: function( event, ui ) {
							// 当前拖动的列宽：
							var td = ui.originalElement;
							var tr = $(td).parent("tr");
							var colIndex = $(td).index();
							var rowIndex = $(tr).index();
							
							var rowSpan = $(td).attr("rowSpan");
							if(rowSpan == null || rowSpan == "")
								rowSpan = 1;
							
							for(var row=0; row<rowSpan; row++){
								$("#report_"+_this.reportId+"_table_colHeader").find("tr").eq(rowIndex + row).find("td").eq(colIndex).attr("cellWidth", ui.size.width);
							}
							
							
							// 记录单元格宽度：
							_this.colHeaderColWidth.length = [];
							
							$("#report_"+_this.reportId+"_table_colHeader tr:last td").each(function(index, td){
								_this.colHeaderColWidth.push($(td).attr("cellWidth"));
								
							});	
							console.log("colHeaderColWidth：" + _this.colHeaderColWidth);

							// 重新生成表格：
							_this.createTableWithData(_this.data);
						
						
						}
					});
           
				//});
				//x++;
			//}
			
        },function(){
          console.log("鼠标移出");
		  if(!khflagmousedown){
			 $(this).resizable( "destroy" );  
		  }
		  
		  //x=0;
		});
	*/	
	}
	
	/** 添加数据 */
	this.createData = function(data){
		var dataStyleJson = {};
		var dataStyleNum = 0;
		for(var styleName in _this.reportConfig.css){
			if(styleName.indexOf("data")!=-1){
				dataStyleJson[styleName] = _this.getCellStyle(_this.reportConfig.css[styleName]);
				dataStyleNum ++;
			}
		}
		var rowDataLen = 0;
		if(data==null || data==undefined || data.length==0)
			return;
		
		//添加样式：
		var data1Style = "";
		var data2Style = "";
		if(typeof(this.reportConfig.css.detailStyle) != "undefined"&&this.reportConfig.css.detailStyle!=""&&this.reportConfig.css.detailStyle!=null){
			data1Style = this.getCustomerStyle(this.reportConfig.css.detailStyle);
			data2Style = this.getCustomerStyle(this.reportConfig.css.detailStyle);
		}else{
//			data1Style = this.getCellStyle(this.reportConfig.css.data1);
//			data2Style = this.getCellStyle(this.reportConfig.css.data2);
		}
		var subSumHeader = "";
		if(typeof(this.reportConfig.css.subSumHeaderStyle) != "undefined"&&this.reportConfig.css.subSumHeaderStyle!=""&&this.reportConfig.css.subSumHeaderStyle!=null){
			subSumHeader = this.getCustomerStyle(this.reportConfig.css.subSumHeaderStyle);
		}else{
			//现在的subSumHeader是按照层级设置的，这里的设置不适用
//			subSumHeader = this.getCellStyle(this.reportConfig.css.subSumHeader);
		}
		
		var sumHeader = "";
		if(typeof(this.reportConfig.css.sumHeaderStyle) != "undefined"&&this.reportConfig.css.sumHeaderStyle!=""&&this.reportConfig.css.sumHeaderStyle!=null){
			sumHeader = this.getCustomerStyle(this.reportConfig.css.sumHeaderStyle);
		}else{
			sumHeader = this.getCellStyle(this.reportConfig.css.sumHeader);
		}
		rowDataLen =  this.reportConfig.groupFields.length;
		for(var i=0; i<data.length; i++){
			//var rowTd = $("#report_"+this.reportId+"_table_rowHeader tr:nth("+i+") td:nth(0)");
			var rowTdClassType = this.getRowClassType(i);
			var tr = $("<tr></tr>");
			for(var j=0; j<data[i].length; j++){
				var value = data[i][j].v;
				var fc = data[i][j].foreColor; // 前景色
				var bc = data[i][j].backColor; // 背景色
				var href = data[i][j].h;//超链接
				var hrefParams = data[i][j].hrefParams;//超链接参数
				var hrefTarget = htFormat(data[i][j].ht);//超链接弹出方式
				var disValue = data[i][j].fv;
				var cellWidth = data[i][j].cellWidth;
				if(_this.colHeaderColWidth[j])
					cellWidth = _this.colHeaderColWidth[j];
				if(typeof(disValue) == "undefined" || disValue == null || disValue == ""){
					disValue = value;
				}
				var disValue_title = disValue;
				//if(BrowserType()=="Firefox"||BrowserType()=="Chrome"){ //如果为火狐或者谷歌，对长字符串采取截取部分显示
				//	if(typeof(disValue) == "string"&&disValue.length>10){
				//		disValue = disValue.substr(0,10);
				//		disValue = disValue+'...';
				//	}
				//}
				var style="";
				var styles=_this.reportConfig.fieldStyles[_this.reportConfig.selectFields[j]];
				var groupFieldStyles = this.getGroupFieldStyle(value,j,"col");
				var dataStyleSerialNumber = (i % dataStyleNum)+1;//取得应该显示的样式的data后面的后缀
				if(flag){	//处理不包含左表头的报表数据区样式
					//if(groupFieldStyles!=""){
					//	style = groupFieldStyles;	
					//}else{
						if(""!=data1Style&&""!=data2Style){
							style = i%2==0 ? data1Style : data2Style;
						}else{
							style = dataStyleJson['data'+dataStyleSerialNumber];
						}
					//}		
									
				}else{
					if(typeof(styles)=="undefined"||styles==null||styles.length==0){
						//if(groupFieldStyles!=""){
						//	style = groupFieldStyles;	
						//}else{
						if(""!=data1Style&&""!=data2Style){
							style = i%2==0 ? data1Style : data2Style;
						}else{
							style = dataStyleJson['data'+dataStyleSerialNumber];
						}
						//}	
						//if($(rowTd).hasClass("subSumHeader"))
						//	style = subSumHeader;
						//if($(rowTd).hasClass("sumHeader"))
						//	style = sumHeader;
						
						if(rowTdClassType =="subSumHeader"){
							if(subSumHeader==""){
								if(saveDataMappingSubSumHeaderLevelJson[''+i]){
									var level = saveDataMappingSubSumHeaderLevelJson[''+i];
									if(this.reportConfig.css["subSumHeader"+level]){
										style = this.getCellStyle(this.reportConfig.css["subSumHeader"+level]);
									}else{
										style = this.getCellStyle(this.reportConfig.css.subSumHeader);
									}
								}
							}
							else{
								style = subSumHeader;
							}
						}
						if(rowTdClassType =="sumHeader")
							style = sumHeader;	
							
					}else{
						//if($(rowTd).hasClass("subSumHeader"))
						//	style = styles[3];
						//else if($(rowTd).hasClass("sumHeader"))
						//	style = styles[4];
							
						if(rowTdClassType =="subSumHeader")
							style = styles[3];
						if(rowTdClassType =="sumHeader")
							style = styles[4];		
						else style = i%2==0 ? styles[1] : styles[2];	
					}
				}
				if(href){
					disValue = '<a href="javascript:void(0)" onclick="dataHref(\''+href+'\',\''+hrefTarget+'\',\''+hrefParams+'\')" >'+disValue+'</a>';
				}
				style = "overflow:hidden;border-width:1px;border-style:solid;" + style; //内容超出单元格长度后，隐藏显示
				var groupRow = "";
				if(data[i][j].groupRow!=null&&data[i][j].groupRow!=""&&typeof(data[i][j].groupRow) != "undefined"){
					groupRow = data[i][j].groupRow;
				}
				var groupFieldStyles = this.getGroupFieldStyle(value,j,"col")
				var td=$('<td colId="'+j+'" style="'+style+'" title="'+disValue_title+'" cellWidth="'+cellWidth+'" groupRow="'+groupRow+'">'+disValue+'</td>');
				if(fc){
					$(td).css("color",fc);
					groupFieldStyles = "";//有预警的前景色，则字段样式为空，使用预警样式
				}
				if(bc){
					$(td).css("background-color",bc);
					groupFieldStyles = "";//有预警的背景色，则字段样式为空，使用预警样式
				}
				//if(!$(rowTd).hasClass("subSumHeader")&&!$(rowTd).hasClass("sumHeader")&&groupFieldStyles!=""){
				//	_this.setFieldCssFromCssStr(groupFieldStyles,td);
				//}
				
				if(rowTdClassType !="subSumHeader"&&rowTdClassType !="sumHeader"&&groupFieldStyles!=""){
					_this.setFieldCssFromCssStr(groupFieldStyles,td);
				}
				$(td).css("width",cellWidth + "px");
				if(BrowserType()=="Chrome"||BrowserType()=="Firefox"){ //火狐和谷歌内容过大时防止单元格被撑大
					$(td).css("over-flow","hidden");
					$(td).css("text-overflow","ellipsis");
					$(td).css("white-space","nowrap");
					$(td).css("word-break","break-all");
				}
				$(tr).append(td);
			}
			
			if(this.reportConfig.groupStyle==4||this.reportConfig.groupStyle==6){
				var rowTableTr = $("#report_"+this.reportId+"_table_rowHeader tr").eq(i);
				if(trIsGroupRow($(rowTableTr))){
					$(tr).css("display","none");
				}
			}
			
			$(tr).appendTo($("#report_"+this.reportId+"_table_data"));
		}
		//
		//合并单元格：
		if(this.reportConfig.groupStyle>=3){
			_this.mergeDataTableGroupRow();
		}
		
//		$("#report_"+this.reportId+"_table_data td").height(this.reportConfig.rowHeight);		
		$("#report_"+this.reportId+"_table_data td").css("height", this.reportConfig.rowHeight + "px");
		data_width = $("#report_"+this.reportId+"_table_data tr").width();
	}
	
	/** 添加单元格样式 */
	this.addCellStyle = function(evt){
		//alert(evt.type);
		//获取下一页数据
		//this.getNextPage(evt);
		
		//添加样式：
		//公用样式：
		$("td").css('border', 'solid 1px').width(this.reportConfig.colWidth).height(this.reportConfig.rowHeight);
		
		//table宽高：
		$("#report_"+this.reportId+"_table_colHeader").height($("#report_"+this.reportId+"_table_colHeader").height());
		$("#report_"+this.reportId+"_table_colHeader").width($("#report_"+this.reportId+"_table_colHeader").width());
		$("#report_"+this.reportId+"_table_rowHeader").height($("#report_"+this.reportId+"_table_rowHeader").height());
		$("#report_"+this.reportId+"_table_rowHeader").width($("#report_"+this.reportId+"_table_rowHeader").width());
		$("#report_"+this.reportId+"_table_data").height($("#report_"+this.reportId+"_table_data").height());
		$("#report_"+this.reportId+"_table_data").width($("#report_"+this.reportId+"_table_data").width());
		//$("#report_"+this.reportId+"_table").width($("#report_"+this.reportId+"_table_corner").width() + $("#report_"+this.reportId+"_table_colHeader").width());
		//配置文件中样式：
		
		//$(".rowHeader").css(this.reportConfig.css.rowHeader);
		$("#report_"+this.reportId+"_table_rowHeader .rowHeader").each(function(){
			if($(this).attr("groupFieldStyles")!=null&&$(this).attr("groupFieldStyles")!=""){
				$(this).css($(this).attr("groupFieldStyles"));
			}else if(typeof(_this.reportConfig.css.detailStyle) != "undefined"&&_this.reportConfig.css.detailStyle!=""&&_this.reportConfig.css.detailStyle!=null){
				$(this).css(_this.reportConfig.css.detailStyle);
			}else{
				$(this).css(_this.reportConfig.css.rowHeader);
			}
		});
		if(typeof(this.reportConfig.css.colHeaderStyle) != "undefined"&&this.reportConfig.css.colHeaderStyle!=""&&this.reportConfig.css.colHeaderStyle!=null){
			$(".colHeader").css(this.reportConfig.css.colHeaderStyle);
		}else{
			$(".colHeader").css(this.reportConfig.css.colHeader);
		}
		
		if(typeof(this.reportConfig.css.detailStyle) != "undefined"&&this.reportConfig.css.detailStyle!=""&&this.reportConfig.css.detailStyle!=null){
			$(".data1").css(this.reportConfig.css.detailStyle);
			$(".data2").css(this.reportConfig.css.detailStyle);
		}else{
			$(".data1").css(this.reportConfig.css.data1);
			$(".data2").css(this.reportConfig.css.data2);
		}
		if(typeof(this.reportConfig.css.subSumHeaderStyle) != "undefined"&&this.reportConfig.css.subSumHeaderStyle!=""&&this.reportConfig.css.subSumHeaderStyle!=null){
			$(".subSumHeader").css(this.reportConfig.css.subSumHeaderStyle);
		}else{
			$(".subSumHeader").css(this.reportConfig.css.subSumHeader);
		}
		if(typeof(this.reportConfig.css.sumHeaderStyle) != "undefined"&&this.reportConfig.css.sumHeaderStyle!=""&&this.reportConfig.css.sumHeaderStyle!=null){
			$(".sumHeader").css(this.reportConfig.css.sumHeaderStyle);
		}else{
			$(".sumHeader").css(this.reportConfig.css.sumHeader);
		}
		//rowHeader 添加双击事件：
		$(".rowHeader").dblclick(function(){
			if($(this).attr('s') == 0) //折叠状态，双击展开
				_this.unfold($(this));
			else if($(this).attr('s') == 1) //展开状态：双击折叠
				_this.fold($(this));
		});
	}
	
	/** 合并左上角单元格 */
	this.mergeCorner = function(){
		//tableId:
		var tableId = "report_"+this.reportId+"_table_corner";
		
		//行数：
		var rowCount = $("#" + tableId + " tr").length;
		//列数：
		var colCount = $("#" + tableId + " tr").eq(0).children().length;
		
		//合并行：
		for(var i=1; i<=colCount; i++){
			mergeRow(tableId, i);
		}
	}
	
	/** 合并列表头单元格 */
	this.mergeColHeader = function(){
		//tableId:
		var tableId = "report_"+this.reportId+"_table_colHeader";
		
		//行数：
		var rowCount = $("#" + tableId + " tr").length;
		//列数：
		var colCount = $("#" + tableId + " tr").eq(0).children().length;
		
		//合并行：
		for(var i=1; i<=colCount; i++){
			mergeRow(tableId, i);
		}
		
		//合并列：
		for(var i=1; i<=rowCount; i++){
			mergeCol(tableId, i, colCount);
		}
	}
	
	/** 合并行表头单元格 */
	this.mergeRowHeader = function(){
		//tableId:
		var tableId = "report_"+this.reportId+"_table_rowHeader";
		//行数：
		var rowCount = $("#" + tableId + " tr").length;
		//列数：
		var colCount = $("#" + tableId + " tr").eq(0).children().length;
		
		//合并行：
		for(var i=1; i<=colCount; i++){
			mergeRow(tableId, i);
		}
		//合并列：
		for(var i=1; i<=rowCount; i++){
			mergeCol(tableId, i, colCount);
		}
	}
	
	this.mergeRowHeaderGroupTop = function(){
		//tableId:
		var tableId = "report_"+this.reportId+"_table_rowHeader";
		//行数：
		var rowCount = $("#" + tableId + " tr").length;
		//列数：
		var colCount = $("#" + tableId + " tr").eq(0).children().length;
		//合并行：
		for(var i=1; i<=colCount; i++){
			mergeRowGroupTop(tableId, i);
		}
		//合并列：
		for(var i=1; i<=rowCount; i++){
			mergeColGroupTop(tableId, i, colCount);
		}
	}
	
	this.mergeDataTableGroupRow = function(){
		//tableId:
		var tableId = "report_"+this.reportId+"_table_data";
		//行数：
		var rowCount = $("#" + tableId + " tr").length;
		//列数：
		var colCount = $("#" + tableId + " tr").eq(0).children().length;
		//合并列：
		for(var i=0; i<=rowCount; i++){
			mergeColGroupRow(tableId, i, colCount,reportId);
		}
	}
	
	
	/** 初始化总页数完成事件 */
	this.initPageCountHandler = function(evt){
		//添加表头数据
//		this.addReportHeader();
	}
	
	/** 报表页面添加表头 */
	this.addReportHeader = function(){
		//后台获取表头数据
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=2"), async:true, cache:false, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath), "fastReportDir":base64.encode(_this.filePath)}, dataType:"json", 
			success:function (data) {
				if(data.state == 500){
					confirm(data.message);
					return;
				}
				_this.totalData = data.totalData;
				_this.createHeader(data.header);
				
				$this.trigger({type:'pageChanged'});
			}, error:function () {
				$this.trigger({type:'error', opt:'获取表头数据'});
			}}
		);
	}
	
	/** 页码改变事件 */
	this.pageChangedHandler = function(evt){
		//alert(evt.type);
		this.currPage = Math.min(this.currPage, this.pageCount-1);
		this.currPage = Math.max(0, this.currPage);
		
		
		$("#pageMessage").text(_this.pageCount);
		$("#pageNum").val(_this.currPage+1);
		
		this.createTableData();
		if(evt=="query"){ //查询时刷新统计图
			this.initChartDiv();
		}

		
//		var begin = this.currPage*this.perPageCount;
//		var length = this.perPageCount;
		
		// 检查缓存数据
//		this.validateCache(begin, length);
	}
	
	/** 检查缓存数据：如果不够，需要到后台补给 */
	this.validateCache = function(begin, length){
		if(this.hasCachePage(begin)){
			//缓存中有数据，直接触发cacheDataReady事件
			$this.trigger({type:'cacheDataReady', begin:begin, length:length});
		}else{
			//缓存中没有数据，到后台获得，并放入到缓存中
			if(begin > this.cache.pointer+this.cache.length() || begin+length<this.cache.pointer-1){
				//清空缓存区
				this.cache.clear();
				this.cache.pointer = begin;
			}
			var flag = begin >= this.cache.pointer+this.cache.length();
			this.getDataFromServer(begin, length, flag, 'cacheDataReady');//从服务器获取数据，并触发缓存就绪事件
		}
	}
	
	/** 缓存数据就绪事件回调函数 */
	this.cacheDataReadyHandler = function(evt){
		var data = this.cache.getData(evt.begin, evt.length);
		this.createData(data, evt.begin);
		
		//如果是最后一页，要添加上总计行		
		if(this.currPage == this.pageCount-1)
			this.addTotalData();
		
		//添加样式：
		var style1 = "";
		var style2 = "";
		if(typeof(this.reportConfig.css.detailStyle) != "undefined"&&this.reportConfig.css.detailStyle!=""&&this.reportConfig.css.detailStyle!=null){
			style1 = _this.getCustomerStyle(this.reportInfo.css.detailStyle);
			style2 = _this.getCustomerStyle(this.reportInfo.css.detailStyle);
		}else{
			style1 = _this.getCellStyle(this.reportInfo.css.data1);
			style2 = _this.getCellStyle(this.reportInfo.css.data2);
		}
		
		var rowHeaderStyle = _this.getCellStyle(this.reportInfo.css.rowHeader);
		var sumHeaderStyle = "";
		if(typeof(this.reportConfig.css.sumHeaderStyle) != "undefined"&&this.reportConfig.css.sumHeaderStyle!=""&&this.reportConfig.css.sumHeaderStyle!=null){
			sumHeaderStyle = _this.getCustomerStyle(this.reportInfo.css.sumHeaderStyle);
		}else{
			sumHeaderStyle = _this.getCellStyle(this.reportInfo.css.sumHeader);
		}
		var colHeaderStyle = "";
		if(typeof(this.reportConfig.css.colHeaderStyle) != "undefined"&&this.reportConfig.css.colHeaderStyle!=""&&this.reportConfig.css.colHeaderStyle!=null){
			colHeaderStyle = _this.getCustomerStyle(this.reportInfo.css.colHeaderStyle);
		}else{
			colHeaderStyle = _this.getCellStyle(this.reportInfo.css.colHeader);
		}
		var subSumHeaderStyle = "";;
		if(typeof(this.reportConfig.css.subSumHeaderStyle) != "undefined"&&this.reportConfig.css.subSumHeaderStyle!=""&&this.reportConfig.css.subSumHeaderStyle!=null){
			subSumHeaderStyle = _this.getCustomerStyle(this.reportInfo.css.subSumHeaderStyle);
		}else{
			subSumHeaderStyle = _this.getCellStyle(this.reportInfo.css.subSumHeader);
		}
		$(".colHeader").attr('style', colHeaderStyle).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$(".rowHeader").attr('style', rowHeaderStyle).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$(".data1").attr('style', style1).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$(".data2").attr('style', style2).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$(".sumHeader").attr('style', sumHeaderStyle).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$(".subSumHeader").attr('style', subSumHeaderStyle).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		
		//rowHeader添加双击事件：
		$('.rowHeader').dblclick(function(){
			if($(this).attr('s') == 0) //折叠状态，双击展开
				_this.unfold($(this));
			else if($(this).attr('s') == 1) //展开状态：双击折叠
				_this.fold($(this));
		});
		
		//合并单元格：
		this.mergeCell("report_"+this.reportId+"_table");
		
		//获得下一页数据：
		$this.trigger({type:'createDataComplete', begin:evt.begin, length:evt.length});
	}
	
	/** 折叠 */
	this.fold = function(td){
//		var condition = $(td).attr('condition');
		var level = parseInt($(td).attr('level'));
		var rowno = ""; //行号
		
		if(this.reportConfig.groupStyle<3){
			rowno = this.currPage * this.perPageCount + $(td).parent().index(); //行号
		}else{
			rowno = this.currPage * this.perPageCount + parseInt($(td).attr("defaultRowIndex")); //行号
		}
		var begin = 0;
		var length = 0;
		
		loading();
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=5"), cache:false, async:true, data:{"begin":0, "length":length, "rowno":rowno,"serverPath":base64.encode(_this.serverPath), "level":level, "resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId)}, dataType:"json", 
			success:function(data){
				//更新表格数据：
				closeFile();
				//初始化表格：
				if(data.state == 500){
					confirm(data.message);
					return;
				}
//				showReport();
				viewer.pageChangedHandler();
				//_this.initTable();
				//_this.initPageCount();
			},
			error:function(){
				$this.trigger({type:'error', opt:'获取数据'});
			}
		});
	}
	
	/** 获得下一页数据 */
	this.getNextPage = function(evt){
		var begin = evt.begin;
		var length = evt.length;
		//如果有下一页，且下一页不在缓存中，则请求后台数据放入缓存中
		if(this.hasNextPage() && !this.hasCachePage(begin+this.perPageCount)){
			//获取下一页数据，并触发事件
			this.getDataFromServer(begin+this.perPageCount, length, true, 'nextPageReady');
		}else{
			$this.trigger({type:'nextPageReady', begin:begin, length:length});
		}
	}
	
	/** 下一页数据就绪 */
	this.nextPageReadyHandler = function(evt){
		//alert(evt.type);
		//获得上一页数据：
		this.getPrePage(evt);
	}
	
	/** 错误处理 */
	this.errorHandler = function(evt){
		alert(evt.opt + "发生错误！");
	}

	/** 展开 */
	this.unfold = function(td){
//		var condition = $(td).attr('condition');
		var level = parseInt($(td).attr('level'));
		var rowno = "";
		if(this.reportConfig.groupStyle<3){
			rowno = this.currPage * this.perPageCount + $(td).parent().index(); //行号
		}else{
			if($(td).attr("defaultRowIndex")&&typeof($(td).attr("defaultRowIndex")) != "undefined"){
				rowno = this.currPage * this.perPageCount + parseInt($(td).attr("defaultRowIndex")); //行号
			}else{
				return;
			}
			
		}
		var begin = 0;
		var length = 0;
		
		loading();
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=4"), cache:false, async:true, data:{"begin":0, "length":length,"serverPath":base64.encode(_this.serverPath), "rowno":rowno, "level":level, "resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId)},dataType:"json", 
			success:function(data){
				//更新表格数据：
				closeFile();
				//初始化表格：
				if(data.state == 500){
					confirm(data.message);
					return;
				}
//				showReport();
				viewer.pageChangedHandler();
				//_this.initPageCount();
				
				//_this.createTableData();
			},
			error:function(){
				$this.trigger({type:'error', opt:'获取数据'});
			}
		});
	}
	
	/** 更新表格数据 */
	this.updateTableData = function(json){
		//用data替换begin~begin+count行（或列）数据：
		var begin = json.begin;
		var count = json.count;
		var rowData = json.rowData;
		var data = json.data;
		
		this.insertRowData(rowData, data, begin, count);
		
		//添加样式：
		$("#report_"+this.reportId+"_table_rowHeader td[new='new']").css('border', 'solid 1px').width(this.reportConfig.colWidth).height(this.reportConfig.rowHeight);
		//$("#report_"+this.reportId+"_table_rowHeader td[new='new'].rowHeader").css(this.reportConfig.css.rowHeader);
		
		$("#report_"+this.reportId+"_table_rowHeader .rowHeader td[new='new']").each(function(){
			if($(this).attr("groupFieldStyles")!=null&&$(this).attr("groupFieldStyles")!=""){
				$(this).css($(this).attr("groupFieldStyles"));
			}else if(typeof(_this.reportConfig.css.detailStyle) != "undefined"&&_this.reportConfig.css.detailStyle!=""&&_this.reportConfig.css.detailStyle!=null){
				$(this).css(_this.reportConfig.css.detailStyle);
			}else{
				$(this).css(_this.reportConfig.css.rowHeader);
			}
		});
		
		if(typeof(this.reportConfig.css.subSumHeaderStyle) != "undefined"&&this.reportConfig.css.subSumHeaderStyle!=""&&this.reportConfig.css.subSumHeaderStyle!=null){
			$("#report_"+this.reportId+"_table_rowHeader td[new='new'].subSumHeader").css(this.reportConfig.css.subSumHeaderStyle);
			$("#report_"+this.reportId+"_table_data td[new='new'].subSumHeader").css(this.reportConfig.css.subSumHeaderStyle);
		}else{
			$("#report_"+this.reportId+"_table_rowHeader td[new='new'].subSumHeader").css(this.reportConfig.css.subSumHeader);
			$("#report_"+this.reportId+"_table_data td[new='new'].subSumHeader").css(this.reportConfig.css.subSumHeader);
		}
		if(typeof(this.reportConfig.css.sumHeaderStyle) != "undefined"&&this.reportConfig.css.sumHeaderStyle!=""&&this.reportConfig.css.sumHeaderStyle!=null){
			$("#report_"+this.reportId+"_table_rowHeader td[new='new'].sumHeader").css(this.reportConfig.css.sumHeaderStyle);
			$("#report_"+this.reportId+"_table_data td[new='new'].sumHeader").css(this.reportConfig.css.sumHeaderStyle);
		}else{
			$("#report_"+this.reportId+"_table_rowHeader td[new='new'].sumHeader").css(this.reportConfig.css.sumHeader);
			$("#report_"+this.reportId+"_table_data td[new='new'].sumHeader").css(this.reportConfig.css.sumHeader);
		}
		$("#report_"+this.reportId+"_table_data td[new='new']").css('border', 'solid 1px').width(this.reportConfig.colWidth).height(this.reportConfig.rowHeight);
		if(typeof(this.reportConfig.css.detailStyle) != "undefined"&&this.reportConfig.css.detailStyle!=""&&this.reportConfig.css.detailStyle!=null){
			$("#report_"+this.reportId+"_table_data td[new='new'].data1").css(this.reportConfig.css.detailStyle);
			$("#report_"+this.reportId+"_table_data td[new='new'].data2").css(this.reportConfig.css.detailStyle);
		}else{
			$("#report_"+this.reportId+"_table_data td[new='new'].data1").css(this.reportConfig.css.data1);
			$("#report_"+this.reportId+"_table_data td[new='new'].data2").css(this.reportConfig.css.data2);
		}
		
		//合并单元格：
		_this.mergeRowHeader();
		//rowHeader 添加双击事件：
		$("#report_"+this.reportId+"_table_rowHeader td[new='new']").dblclick(function(){
			if($(this).attr('s') == 0) //折叠状态，双击展开
				_this.unfold($(this));
			else if($(this).attr('s') == 1) //展开状态：双击折叠
				_this.fold($(this));
		});
		//
		$("#report_"+this.reportId+"_table_rowHeader td[new='new']").removeAttr("new");
	}
	
	/** 插入行维度值、数据行 */
	this.insertRowData = function(rowData, data, begin, count){
		if(rowData==null || rowData==undefined || rowData.length==0)
			return;
		if(data==null || data==undefined || data.length==0)
			return;
		
		//插入新数据：
		var targetDimRow = $("#report_"+this.reportId+"_table_rowHeader tr:nth("+begin+")");
		var targetDataRow = $("#report_"+this.reportId+"_table_data tr:nth("+begin+")");
		for(var i=0; i<rowData.length; i++){
			var dimTr = $("<tr></tr>");
			var clz = 'rowHeader';
			if(rowData[i][0].s == -1)
				clz = 'subSumHeader';
			if(rowData[i][0].s == -2)
				clz = 'sumHeader';
			for(var j=0; j<rowData[i].length; j++){
				var level = j;
				var value = rowData[i][j].v;
				var state = rowData[i][j].s;
				var disValue = value;
//				var condition = this.createCondition(rowData[i], j);				
				
				$(dimTr).append('<td class="'+clz+'" colId="'+j+'" new="new" level="'+level+'" v="'+value+'" s="'+state+'">'+disValue+'</td>');
			}
			$(dimTr).insertBefore(targetDimRow);
			
			var dataTr = $("<tr></tr>");
			if(clz =='rowHeader')
				clz = 'data' + (i%2+1);
			for(var j=0; j<data[i].length; j++){
				var value = data[i][j].v;
				var disValue = value;
				$(dataTr).append('<td  colId="'+j+'" class="'+clz+'" new="new">'+disValue+'</td>');
			}
			$(dataTr).insertBefore(targetDataRow);
			
			begin ++;
		}
		
		//删除begin~begin+count行数据：
		for(var i=0; i<count; i++){
			$("#report_"+this.reportId+"_table_rowHeader tr").eq(begin).remove();
			$("#report_"+this.reportId+"_table_data tr").eq(begin).remove();
		}
	}
	
	/** 添加总计行 */
	this.addTotalData = function(){
		//this.totalData = ['地区总计','','','1000','1000.11'];
		if(this.totalData != null){
			for(var i=0; i<this.totalData.length; i++){
				var tr = $("<tr></tr>");
				for(var j=0; j<this.totalData[i].length; j++){
					var nm = false;
					if(j < this.reportInfo.groupFields.length){
						nm = true;
					}
					$(tr).append("<td  colId='"+j+"' class='sumHeader' nm='"+nm+"'>"+this.totalData[i][j]+"</td>");
				}
				$(tr).appendTo($("#report_"+this.reportId+"_data"));
			}
		}
	}
	
	/** 判断是否存在上一页 */
	this.hasPrePage = function(){
		return this.currPage >= 1;
	}
	
	/** 判断是否存在下一页 */
	this.hasNextPage = function(){
		return this.currPage < this.pageCount-1;
	}
	
	/** 检查缓存中是否有某页数据 */
	this.hasCachePage = function(begin){
		return begin>=this.cache.pointer && begin<this.cache.pointer+this.cache.length();
	}
	
	/** 从后台获取数据 */
	this.getDataFromServer = function(begin, length, flag, trigger){
		loading();
		//alert("后台取数：" + begin + "~" + length + "~" + flag + "~" + trigger);
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/mis2/vrsr/json/demo1_action3.json"), cache:false, async:true, data:{"begin":begin, "length":length,"serverPath":base64.encode(_this.serverPath),"reportDefineId":base64.encode(_this.reportDefineId), "resID":base64.encode(_this.reportId)}, dataType:"json", 
			success:function(data){
				//alert(data.length);
				//alert('1:' + _this.cache.pointer);
				if(flag){
					//追加数据
					_this.cache.push(data);
				}else{
					//前插数据
					_this.cache.unshift(data);
				}
				closeFile();
				//alert(data.length);
				//alert('2:' + _this.cache.pointer);
				if(trigger != null)
					$this.trigger({type:trigger, begin:begin, length:length});
			},
			error:function(){
				$this.trigger({type:'error', opt:'获取数据'});
			}
		});
	}
	
	/** 获得上一页数据 */				
	this.getPrePage = function(evt){
		var begin = evt.begin;
		var length = evt.length;
		//如果有上一页，且上一页不在缓存中，则请求后台数据放入缓存中
		if(this.hasPrePage() && !this.hasCachePage(begin-this.perPageCount)){
			this.getDataFromServer(begin-this.perPageCount, length, false, null);
		}
	}

	/** 创建查询条件 */
	this.createCondition = function(row, j){
		var condition = "";
		for(var k=0; k<=j; k++){
			condition += this.reportConfig.groupFields[k] + "=" + row[k].v;
			if(k < j)
				condition += "&"
		}
		return condition;
	}
	
	/** 初始化工具条 */
	this.initToolbar = function(){
		//分组报表：
		//首页按钮事件
		$('#first').unbind('click');
		$('#first').click(function(){
			if(_this.currPage <= 0)
				return;
			_this.currPage = 0;
			//$('#pageSelecter option:first').attr('selected', 'selected');
			$('#pageNum').val(1);
			$this.trigger('pageChanged');
		});
		//尾页按钮事件
		$('#last').unbind('click');
		$('#last').click(function(){
			if(_this.currPage == _this.pageCount-1)
				return;
			_this.currPage = _this.pageCount-1;
			//$('#pageSelecter option:last').attr('selected', 'selected');
			$('#pageNum').val(_this.pageCount);
			$this.trigger('pageChanged');
		});
		//上一页按钮事件
		$('#previous').unbind('click');
		$('#previous').click(function(){
			if(_this.currPage <= 0)
				return;
			_this.currPage -= 1;
			//$('#pageSelecter option:eq('+_this.currPage+')').attr('selected', 'selected');
			$('#pageNum').val(_this.currPage + 1);
			$this.trigger('pageChanged');
		});
		//下一页按钮事件
		$('#next').unbind('click');
		$('#next').click(function(){
			if(_this.currPage == _this.pageCount-1)
				return;
			_this.currPage += 1;
			//$('#pageSelecter option:eq('+_this.currPage+')').attr('selected', 'selected');
			$('#pageNum').val(_this.currPage + 1);
			$this.trigger('pageChanged');
		});
		//选页事件
		$('#pageSelecter').change(function(){
			_this.currPage = $(this).val();
			$this.trigger('pageChanged');
		});
		$('#pageNum').unbind('blur');
		$('#pageNum').blur(function(){
			var pageNum = parseInt($('#pageNum').val());
			if(pageNum == _this.currPage+1){
				return;
			}
			if(isNaN(pageNum)){
				alert('请输入正确的页数！');
				return;
			}
			if(pageNum <= 0){
				pageNum = 1;
			}
			if(pageNum > _this.pageCount){
				pageNum = _this.pageCount;
			}
			_this.currPage = pageNum - 1;
			$('#pageNum').val(pageNum);
			$this.trigger('pageChanged');
		});
		$('#pageNum').unbind("keypress");
		$('#pageNum').keypress(function(e){
			var event = e || window.event;
			if(event.keyCode == 13){
				$('#pageNum').blur();
			}
		});
		//刷新按钮事件
		$('#refresh').unbind('click');
		$('#refresh').click(function(){
			if(confirm("请确定设置的信息是否已保存！")){
			//清除缓存
			$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=6"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath)}, dataType:"json", 
				success:function(data){
					if(data.error == false){
						window.location.reload(true);
					}else{
						alert('清除缓存失败！');
					}
				},
				error:function(){
					$this.trigger({type:'error', opt:'清除缓存'});
				}
			});
		}
//			_this.perPageCount = parseInt($('#perPageCount').val());
//			_this.pageCount = Math.ceil(_this.reportRowCount / _this.perPageCount);
//			_this.currPage = 0;
//			$('#pageNum').val(_this.currPage + 1);
//			_this.maxRowCount = _this.cachePageCount * _this.perPageCount; // 最大行数
//			_this.cache = new CacheData(_this.maxRowCount, _this.perPageCount); // 缓存数组
//			$this.trigger({type:'pageChanged'});
		});
		//清除缓存按钮事件
		$('#clear').unbind('click');
		$("#clear").click(function(){
			//清空缓存区
			_this.cache.clear();
			_this.cache.pointer = 0;
			
			$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=6"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath)}, dataType:"json", 
				success:function(data){
					if(data.error == false){
						alert('清除缓存完成！');
					}else{
						alert('清除缓存失败！');
					}
				},
				error:function(){
					$this.trigger({type:'error', opt:'获取数据'});
				}
			});
		});

		//导出：
		$('#exportWord').click(function(){
			_this.save('word', false);
		});
		$('#exportExcel').click(function(){
			var isDA=false;//由于数据分析处导出名称特殊，此处做下判断
			var daName="";
			if(typeof isFromDataAnalysis!=undefined && typeof exportDAName!=undefined && isFromDataAnalysis=="true" && exportDAName!=""){
				isDA=true;
				daName=exportDAName;
			}
			var url = PathUtils.getRelativeUrl("/ExportServlet?reportType=4&resID="+base64.encode(isDA?daName:_this.reportId)+ "&reportDefineId="+base64.encode(_this.reportDefineId)+"&fastReportDir="+base64.encode(_this.filePath)+"&refresh=yes&perPageCount="+_this.exportPageCount + "&object=fast&format=excel&remote=false");
			showDialog(PathUtils.getRelativeUrl('/mis2/vrsr/show/excelPageStyle.jsp?url='+base64.encode(url)), "exportExcel","Excel导出格式设置", 180, 280, null, null, null,null);
			//_this.save('excel', false);
		});
		$('#exportPdf').hide();
		$('#exportText').hide();
		$('#exportCsv').hide();
		
		//远程导出：
		$('#remoteWord').click(function(){
			_this.save('word', true);
		});
		$('#remoteExcel').click(function(){
			_this.save('excel', true);
		});
		$('#remotePdf').parent().hide();
		$('#remoteText').parent().hide();
		$('#remoteCsv').parent().hide();
		
		/** 打印 */
		$('#print').click(function(){
			var operationMessage = "打印分组报表'"+_this.reportName+"'";
			var operationJson = "{\"resId\":\""+_this.reportId+"\"}";
			var operationTag = "报表#打印";	
			recordUtils(operationModule,operationMessage,otherId,userId,operationJson,operationTag);
			//计算报表：
			loading();
			$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=9"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath)}, dataType:"json", 
				success:function(data){
					closeFile();
					//var result = data.result;
					//applet打印请求：
					//var appleturl = _this.contextPath + "/reportServlet?action=2&name=" + _this.reportId + "&reportFileName=" + _this.reportId + ".raq&srcType=file&savePrintSetup=no&appletJarName=runqianReport4Applet.jar,dmGraphApplet.jar,appletPatch.jar,flex-messaging-core-2.0.jar&serverPagedPrint=no&mirror=no&reportParamsId=&cachedId=&t_i_m_e="+new Date().getTime();
					var appleturl = PathUtils.getRelativeUrl("/reportServlet?action=2&name=" + _this.reportId + "&reportFileName=" + _this.reportId + "&srcType=defineBean&savePrintSetup=no&appletJarName=mis2/download/runqianReport4Applet.jar,mis2/download/dmGraphApplet.jar&serverPagedPrint=no&mirror=no&reportParamsId=undefined&cachedId=" + data.cacheId + "&t_i_m_e=" + new Date().getTime());
					$("#hiddenFrame").html('<iframe src="'+appleturl+'" height="10" width="30"></iframe>');
				},
				error:function(){
					$this.trigger({type:'error', opt:'获取数据'});
				}
			});
		});
	}
	
	/** 导出：format-导出格式，remote-是否是远程导出 */
	this.save = function(format, remote){
		var isDA=false;//由于数据分析处导出名称特殊，此处做下判断
		var daName="";
		if(typeof isFromDataAnalysis!=undefined && typeof exportDAName!=undefined && isFromDataAnalysis=="true" && exportDAName!=""){
			isDA=true;
			daName=exportDAName;
		}
		// alert(format + ", " + remote);
		var refresh="no";
		if(_this.exportPageCount==_this.perPageCount){
			refresh="yes";
		}
		//分组报表
		if(!remote){
			var operationMessage = "本地导出分组报表'"+_this.reportName+"'为"+format;
			var operationJson = "{\"resId\":\""+_this.reportId+"\"}";
			var operationTag = "报表#导出";	
			recordUtils(operationModule,operationMessage,otherId,userId,operationJson,operationTag);
			//本地导出：
			//var url = PathUtils.getRelativeUrl("/ExportServlet?reportType=4&resID="+base64.encode(isDA?daName:_this.reportId)+ "&reportDefineId="+base64.encode(_this.reportDefineId)+"&fastReportDir="+base64.encode(_this.filePath)+"&refresh=yes&perPageCount="+_this.exportPageCount + "&object=fast&format="+format+ "&remote="+remote + "&time=" + new Date().getTime());
			//$("#hiddenFrame").html('<iframe src="'+url+'" height="0" width="0"></iframe>');
			var graphImage = exportImg();
			var params ={"reportType":"4","resID":base64.encode(isDA?daName:_this.reportId), "reportDefineId":base64.encode(_this.reportDefineId),"fastReportDir":base64.encode(_this.filePath),"&refresh":"yes","perPageCount":_this.exportPageCount,"object":"fast","format":format,"remote":remote,"time":new Date().getTime(),"graphImage":graphImage}
			$("#hiddenFrame").html('<iframe src="" id="saveAsFrame" name="saveAsFrame" height="0" width="0"></iframe>');
			postSubmit(PathUtils.getRelativeUrl("/ExportServlet"),params,"saveAsFrame");
		}else{
			loading();
			//远程导出：
			var graphImage = exportImg();
			$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/ExportServlet?action=8"), cache:false, async:true, data:{"resID":base64.encode(isDA?daName:_this.reportId), "reportDefineId":base64.encode(_this.reportDefineId),"refresh":"yes","perPageCount":_this.exportPageCount, "object":"fast", "format":format, "remote":remote,"graphImage":graphImage}, dataType:"json",
//			$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=8"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId), "perPageCount":_this.perPageCount, "format":format, "remote":remote}, dataType:"json",
				success:function(data){
					closeFile();
					if(data.result == 'success'){
						alert('导出成功！文件路径：' + data.remoteExportDir);
						var operationMessage = "远程导出分组报表'"+_this.reportName+"'为"+format;
						var operationJson = "{\"resId\":\""+_this.reportId+"\",\"文件路径\":\""+data.remoteExportDir+"\"}";
						var operationTag = "报表#导出";	
						recordUtils(operationModule,operationMessage,otherId,userId,operationJson,operationTag);
					}else{
						alert('导出失败！');
					}
				},
				error:function(){
					$this.trigger({type:'error', opt:'获取数据'});
				}
			});
		}
	}
	
	this.postSubmit = function(URL, PARAMS,target) {        
		    var temp = document.createElement("form");        
		    temp.action = URL;        
		    temp.method = "post";        
		    temp.style.display = "none";    
		    temp.target = target;    
		    for (var x in PARAMS) {        
		        var opt = document.createElement("textarea");        
		        opt.name = x;        
		        opt.value = PARAMS[x];       
		        temp.appendChild(opt);        
		    }        
		    document.body.appendChild(temp);        
		    temp.submit();        
		    return temp;        
		}       

	/**
	*调用缓存数据管理类，获得数据，并生成表格，同时设置单元格属性、样式、事件等。
	*/
	this.createHeader = function (data) {
		for(var i=0; i<data.length; i++){
			var tr = $("<tr></tr>");
			for(var j=0; j<data[i].length; j++){
				$(tr).append("<td  colId='"+j+"' class='colHeader' nm='true'>"+data[i][j]+"</td>");
			}
			$(tr).appendTo($("#report_"+this.reportId+"_header"));
		}
	};
	//清除缓存
	this.deleteReportCache = function (data) {
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=6"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"serverPath":base64.encode(_this.serverPath)}, dataType:"json", 
			success:function(data){
			},
			error:function(){
			}
		});
	}

	/** 根据JSON生成样式字符串 TODO 改为后台拼 */
	this.getCellStyle = function(css){
		var r = "";
		for(prop in css){
			var style = prop.replace(/([A-Z])/g, function(c){
				return "-" + c.toLowerCase();
			})
			var value = css[prop];
			r += style + ":" + value + ";";
		}
		return r;
//		var r = "";
//		if(css.borderColor)
//			r += "border:solid 1px " + css.borderColor+";";
//		if(css.fontFamily)
//			r += "font-family:" + css.fontFamily + ";";
//		if(css.fontSize)
//			r += "font-size:" + css.fontSize + ";";
//		if(css.color)
//			r += "color:" + css.color + ";";
//		if(css.fontWeight)
//			r += "font-weight:" + css.fontWeight + ";";
//		if(css.fontStyle)
//			r += "font-style:" + css.fontStyle + ";";
//		if(css.textDecoration)
//			r += "text-decoration:" + css.textDecoration + ";";
//		if(css.textAlign)
//			r += "text-align:" + css.textAlign + ";";
//		if(css.verticalAlign)
//			r += "vertical-align:" + css.verticalAlign + ";";
//		if(css.paddingLeft)
//			r += "padding-left:" + css.paddingLeft + ";";
//		if(css.paddingRight)
//			r += "padding-right:" + css.paddingRight + ";";
//		if(css.paddingTop)
//			r += "padding-top:" + css.paddingTop + ";";
//		if(css.paddingBottom)
//			r += "padding-bottom:" + css.paddingBottom + ";";
//		if(css.backgroundColor)
//			r += "background-color:" + css.backgroundColor + ";";
//		if(css.indent)
//			r += "indent:" + css.indent + ";";
//		return r;
	}
	
	//获取分组字段的内容样式
	this.getGroupFieldStyle = function(value,index,type){
		var groupFieldName = "";
		if(type=="group"){
			groupFieldName = this.reportConfig.groupFields[index];
		}else{
			groupFieldName = this.reportConfig.selectFields[index];
		}
		
		if(groupFieldName==null||groupFieldName=="")
		var cssStr = "";
		for(var o in this.reportConfig.newFieldStyles){  
        	if(o==groupFieldName)cssStr=this.reportConfig.newFieldStyles[o];
      	}
      	cssStr = this.getCustomerStyle(cssStr);
		return cssStr;
	}
	
	this.getCustomerStyle = function(css){
		var r = "";
		for(var o in css){  
        	//r += '"' +o+'":"' + css[o]+'",';
        	r += o+':' + css[o]+';';
      	}
      //r = r.substring(0,r.length-1);
      //	r+="";
      	return r;  
	}
	
	this.setFieldCssFromCssStr = function(cssStr,td){
		var arr1 = cssStr.split(";");
		for(var i=0;i<arr1.length;i++){
			var str1 = arr1[i];
			var arr2 = str1.split(":");
			$(td).css(arr2[0],arr2[1]);
		}
	}
	
	this.getRowClassType = function(index){
		var classType = "";
		var tdSize = ($("#report_"+this.reportId+"_table_rowHeader tr:nth("+index+") td").size());
//		$("#report_"+this.reportId+"_table_rowHeader tr:nth("+index+") td").each(function(i){
//			if(i<parseInt(tdSize-1)){
//				if($(this).hasClass("subSumHeader")){
//					classType = "subSumHeader";
//				}else if($(this).hasClass("sumHeader")){
//					classType = "sumHeader";
//				}else{
//					classType = "data";
//				}
//			}
//		});
		
		var tdArray = $("#report_"+this.reportId+"_table_rowHeader tr:nth("+index+") td");
		for(var i=0;i<parseInt(tdSize-1);i++){
			var td = tdArray[i];
			if($(td).hasClass("subSumHeader")){
				classType = "subSumHeader";
				break;
			}else if($(td).hasClass("sumHeader")){
				classType = "sumHeader";
				break;
			}else{
				classType = "data";
			}
		}
		
		return classType;
	}
	
	this.changeTdRowIndex = function(){
		//this.reportConfig.groupStyle==4||this.reportConfig.groupStyle==6)
		

		var trArray = $("#report_"+this.reportId+"_table_rowHeader tr");
		for(var i=0;i<parseInt(trArray.size());i++){
			var tr = trArray[i];
		}
	}
	
};

/** 合并行 */
function mergeRow(tableId, colno){
	var firstTd = "";
    var currentTd = "";
    var spanNum = 0;
	$("#" + tableId + " tr td:nth-child("+colno+")").each(function(i){
		if(colno==1){//设置合并单元格的tr的高度，以免合并单元格后分组字段与数据字段错位
					$(this).parent().height($(this).get(0).offsetHeight);
		}
        if(i==0){
            firstTd = this;
            spanNum = 1;
        }else{
            currentTd = this;
			var a=$(firstTd).attr("headerData");
			var b=$(currentTd).attr("headerData");
			var flag=false;
			if(!a&&!b){
				flag=($(firstTd).text() == $(currentTd).text());
			}else{
				flag=(a==b);
			}
        	if(flag){
        		spanNum++;
        		var height = 0;
        		if($(firstTd).get(0).offsetHeight){
        			if (document.compatMode == "BackCompat") {  //quirks模式调整
						height = $(firstTd).height() + parseInt($(firstTd).css("border-bottom-width")) + $(currentTd).height() + parseInt($(currentTd).css("border-top-width"));
					}else{
        				height = $(firstTd).get(0).offsetHeight + $(currentTd).get(0).offsetHeight;
					}
        		}else{
        			height = $(firstTd).height() + parseInt($(firstTd).css("border-bottom-width")) + $(currentTd).height() + parseInt($(currentTd).css("border-top-width"));
        		}
//        		var height = $(firstTd).height() + $(currentTd).height();
        		$(firstTd).height(height);
				//合并时firstTd和currentTd至少有一个state属性值为1，为防止合并后该属性丢失，故两单元格state属性均置为1
				if(globalGroupStyle!=0){
					if($(currentTd).attr("s")==1||$(firstTd).attr("s")==1){
						$(currentTd).attr("s",1);
						$(firstTd).attr("s",1);
						$(currentTd).attr("class","rowHeader");
						$(firstTd).attr("class","rowHeader");
					}
				}
				
        		$(currentTd).hide();//remove();
        		$(firstTd).attr("rowSpan",spanNum);
        	}else{
        		
        		firstTd = this;
        		spanNum = 1;
        	}
        }
    }); 
}

/** 分组报表列合并 */
function mergeCol(tableId ,rownum, maxcolnum){
    if(maxcolnum == void 0)
    	maxcolnum = 0;
    var firstTd = "";
    var currentTd = "";
    var spanNum = 0;
    $("#" + tableId + " tr:nth-child(" + rownum + ")").each(function(i){
        $(this).children().each(function(i){
            if(i==0){
                firstTd = this;
                spanNum = 1;
            }else if((maxcolnum>0)&&(i>maxcolnum)){
                return "";
            }else{
	            currentTd = this;
                if($.trim($(currentTd).text())==''){
                    spanNum++;
					if(BrowserType()=="Chrome"||BrowserType()=="Firefox"){ //对火狐和谷歌进行修正
						var width = $(firstTd).width() + $(currentTd).width();
//						var width = $(currentTd).width()*spanNum;										
					}else{
						var width = 0;
						if($(firstTd).get(0).offsetWidth){
                    		width = $(firstTd).get(0).offsetWidth + $(currentTd).get(0).offsetWidth;
						}else{
                    		width = $(firstTd).width() + parseInt($(firstTd).css("border-right-width")) + $(currentTd).width() + parseInt($(currentTd).css("border-left-width"));
						}
					}
                    $(firstTd).width(width);
					//合并时firstTd和currentTd至少有一个state属性值为1，为防止合并后该属性丢失，故两单元格state属性均置为1
					if(globalGroupStyle!=0){
						if($(currentTd).attr("s")==1||$(firstTd).attr("s")==1){
						    $(currentTd).attr("s",1);
						    $(firstTd).attr("s",1);
					    }
					}
					
                    $(firstTd).attr("colSpan",spanNum);
                    $(currentTd).hide();//remove(); 
                }else{
                    firstTd = this;
                    spanNum = 1;
                }
            }
        });
    });
}

/** 分组报表分组列在上时列合并 */
function mergeColGroupTop(tableId ,rownum, maxcolnum){
    if(maxcolnum == void 0)
    	maxcolnum = 0;
    var firstTd = "";
    var currentTd = "";
    var spanNum = 0;
    $("#" + tableId + " tr:nth-child(" + rownum + ")").each(function(i){
        $(this).children().each(function(i){
            if(i==0){
                firstTd = this;
                spanNum = 1;
            }else if((maxcolnum>0)&&(i>maxcolnum)){
                return "";
            }else{
	            currentTd = this;
	             if($(currentTd).attr("groupRow")=="yes"){
	                    $(currentTd).css("text-align","left");
	                    $(currentTd).css("border-right-width","0px");
	                    $(currentTd).attr("mergedTd","yes");
	                 }
	                 if($(firstTd).attr("groupRow")=="yes"){
	                    $(firstTd).css("text-align","left");
	                    $(firstTd).css("border-right-width","0px");
	                    $(firstTd).attr("mergedTd","yes");
	                 }
                if($.trim($(currentTd).text())==''){
                    spanNum++;
					if(BrowserType()=="Chrome"||BrowserType()=="Firefox"){ //对火狐和谷歌进行修正
						var width = $(firstTd).width() + $(currentTd).width();
//						var width = $(currentTd).width()*spanNum;										
					}else{
						var width = 0;
						if($(firstTd).get(0).offsetWidth){
                    		width = $(firstTd).get(0).offsetWidth + $(currentTd).get(0).offsetWidth;
						}else{
                    		width = $(firstTd).width() + parseInt($(firstTd).css("border-right-width")) + $(currentTd).width() + parseInt($(currentTd).css("border-left-width"));
						}
					}
                    $(firstTd).width(width);
					//合并时firstTd和currentTd至少有一个state属性值为1，为防止合并后该属性丢失，故两单元格state属性均置为1
					if($(currentTd).attr("s")==1||$(firstTd).attr("s")==1){
						$(currentTd).attr("s",1);
						$(firstTd).attr("s",1);
					}
                    $(firstTd).attr("colSpan",spanNum);
                    if($(firstTd).attr("s")==1){
                    	$(firstTd).css("text-align","left");
                    	$(firstTd).css("border-right-width","0px");
                    	$(firstTd).attr("mergedTd","yes");
                    }
                    $(currentTd).hide();//remove(); 
                }else{
                    firstTd = this;
                    spanNum = 1;
                }
            }
        });
    });
}

/** 分组报表分组列在上时行合并 */
function mergeRowGroupTop(tableId, colno){
   var firstTd = "";
    var currentTd = "";
    var spanNum = 0;
	$("#" + tableId + " tr td:nth-child("+colno+")").each(function(i){
		if(colno==1){//设置合并单元格的tr的高度，以免合并单元格后分组字段与数据字段错位
					$(this).parent().height($(this).get(0).offsetHeight);
		}
        if(i==0){
            firstTd = this;
            spanNum = 1;
        }else{
            currentTd = this;
			var a=$(firstTd).attr("headerData");
			var b=$(currentTd).attr("headerData");
			var flag=false;
			if(!a&&!b){
				flag=($(firstTd).text() == $(currentTd).text());
			}else{
				flag=(a==b);
			}
        	if(flag){
        		
				//合并时firstTd和currentTd至少有一个state属性值为1，为防止合并后该属性丢失，故两单元格state属性均置为1
				if($(currentTd).attr("s")==1||$(firstTd).attr("s")==1){
					$(currentTd).attr("s",1);
					$(firstTd).attr("s",1);
				}
        	}else{
        		firstTd = this;
        		spanNum = 1;
        	}
        }
    }); 
}

/** 分组报表分组列在上时列合并 */
function mergeColGroupRow(tableId ,rownum, maxcolnum,reportName){
    if(maxcolnum == void 0)
    	maxcolnum = 0;
    var firstTd = "";
    var currentTd = "";
    var spanNum = 0;
    $("#" + tableId + " tr:nth-child(" + rownum + ")").each(function(i){
        $(this).children().each(function(i){
            if(i==0){
                firstTd = this;
                spanNum = 1;
                if($(firstTd).attr("groupRow")=='yes'){
                	$(firstTd).css("border-left-width","0px");
                	var rowTd;
                	$("#report_"+reportName+"_table_rowHeader tr:nth("+(rownum-1)+") td").each(function(){
                		if($(this).attr("groupRow")=="yes")rowTd = $(this);
                	});
                    $(firstTd).css("background-color",$(rowTd).css("background-color"));
                    $(firstTd).css("border-top-width",$(rowTd).css("border-top-width"));
                    $(firstTd).css("border-bottom-width",$(rowTd).css("border-bottom-width"));
                    $(firstTd).css("border-right-width",$(rowTd).css("border-left-width"));
                                 
                    $(firstTd).css("border-top-color",$(rowTd).css("border-top-color"));
                    $(firstTd).css("border-bottom-color",$(rowTd).css("border-bottom-color"));
                    $(firstTd).css("border-right-color",$(rowTd).css("border-left-color"));
                    
                    $(firstTd).css("border-top-style",$(rowTd).css("border-top-style"));
                    $(firstTd).css("border-bottom-style",$(rowTd).css("border-bottom-style"));
                    $(firstTd).css("border-right-style",$(rowTd).css("border-left-style"));
                }
            }else if((maxcolnum>0)&&(i>maxcolnum)){
                return "";
            }else{
	            currentTd = this;
                if($(currentTd).attr("groupRow")=='yes'){
                    spanNum++;
					if(BrowserType()=="Chrome"||BrowserType()=="Firefox"){ //对火狐和谷歌进行修正
						var width = $(firstTd).width() + $(currentTd).width();
//						var width = $(currentTd).width()*spanNum;										
					}else{
						var width = 0;
						if($(firstTd).get(0).offsetWidth){
                    		width = $(firstTd).get(0).offsetWidth + $(currentTd).get(0).offsetWidth;
						}else{
                    		width = $(firstTd).width() + parseInt($(firstTd).css("border-right-width")) + $(currentTd).width() + parseInt($(currentTd).css("border-left-width"));
						}
					}
                    $(firstTd).width(width);
					//合并时firstTd和currentTd至少有一个state属性值为1，为防止合并后该属性丢失，故两单元格state属性均置为1
					if($(currentTd).attr("s")==1||$(firstTd).attr("s")==1){
						$(currentTd).attr("s",1);
						$(firstTd).attr("s",1);
					}
					
                    $(firstTd).attr("colSpan",spanNum);
                    $(firstTd).css("border-left-width","0px");
                   var rowTd;
                	$("#report_"+reportName+"_table_rowHeader tr:nth("+(rownum-1)+") td").each(function(){
                		if($(this).attr("groupRow")=="yes")rowTd = $(this);
                	});
                    $(firstTd).css("background-color",$(rowTd).css("background-color"));
                    
                    $(firstTd).css("border-top-width",$(rowTd).css("border-top-width"));
                    $(firstTd).css("border-bottom-width",$(rowTd).css("border-bottom-width"));
                    $(firstTd).css("border-right-width",$(rowTd).css("border-left-width"));
                    
                    $(firstTd).css("border-top-color",$(rowTd).css("border-top-color"));
                    $(firstTd).css("border-bottom-color",$(rowTd).css("border-bottom-color"));
                    $(firstTd).css("border-right-color",$(rowTd).css("border-left-color"));
                    
                    $(firstTd).css("border-top-style",$(rowTd).css("border-top-style"));
                    $(firstTd).css("border-bottom-style",$(rowTd).css("border-bottom-style"));
                    $(firstTd).css("border-right-style",$(rowTd).css("border-left-style"));
                    
                    if($(firstTd).attr("s")==1){
                    	$(firstTd).css("text-align","left");
                    }
                    $(currentTd).hide();//remove(); 
                }else{
                    firstTd = this;
                    spanNum = 1;
                }
            }
        });
    });
}

/** 
处理超链接弹出方式
0=_self;1=_blank;2=_top
 */
function htFormat(ht){
	if(ht=="0"){
		return "_self";
	}
	if(ht=="1"){
		return "_blank";
	}
	if(ht=="2"){
		return "_top";
	}
	//return "_blank";
	return ht;
}

var colNames=new Array();
var colValues=new Array();
function distinctArray(arr,obj2){
	var obj={},temp=[];
	for(var i=0;i<arr.length;i++){
		if(!obj[arr[i]]&&!obj2[i]){
			temp.push(arr[i]);
			obj[arr[i]] =true;
		}
	}
	return temp;
}
function changeRowAndCol(data){
	var result=new Array();
	for(var i=0; i<data.length; i++){
		for(var j=0; j<data[data.length-1].length; j++){
			if(i==0){
				result[j]=new Array();
			}
			result[j][i] = data[i][j].v;
		}
	}
	return result;
}
function getColData(col){
	var result=new Object();
	for(var i=0; i<colNames.length; i++){
		if(colNames[i]==col){
			result.dataNum=colValues[i].length;
			if(result.dataNum<10){
				result.data=colValues[i];
			}else{
				result.data=new Array();
			}
			break;
		}
	}
	return result;
}

/** 获取echarts统计图图片*/
	function exportImg(){
		var img = null;
		try{
			img = document.getElementById("chartFrame").contentWindow.exportImg();
		}catch(e){
			
		}
		return img;
	}



	function saveToExcel(url,excelFormat){
			var graphImage = exportImg();
			var params ={"excelFormat":excelFormat,"time":new Date().getTime(),"graphImage":graphImage};
			$("#hiddenFrame").html('<iframe src="" id="saveAsFrame" name="saveAsFrame" height="0" width="0"></iframe>');
			postSubmit( base64.decode(url),params,"saveAsFrame");
	}

	function postSubmit(URL, PARAMS,target) {    
		    var temp = document.createElement("form");        
		    temp.action = URL;        
		    temp.method = "post";        
		    temp.style.display = "none";    
		    temp.target = target;   
		    for (var x in PARAMS) {        
		        var opt = document.createElement("textarea");        
		        opt.name = x;        
		        opt.value = PARAMS[x];       
		        temp.appendChild(opt);        
		    }       
		    document.body.appendChild(temp); 
		    temp.submit();        
		    return temp;        
		}     



/**
 * 寻找homeContent对应的窗口对象
 */
function getHomeContentWindow1(win){
	if(win.location.href.indexOf("homeContent.jsp") != -1 || win==top){
		return win;
	}else if(typeof(moduleName) != "undefined" && moduleName == "favorit"){
		return window.parent.frames[1];	
	}else{
		return getHomeContentWindow(win.parent);
	}
}

function trIsGroupRow(tr){
	var b = false;
	$(tr).eq(0).children().each(function(){
		if($(this).attr("groupRow")=="yes"&&($(this).attr("s")=="1"||$(this).attr("s")==1)){
			b = true;
			return b;
		}
	});
	return b;
}
//拖拽结束后重新设置一遍列宽
function getColHeaderTableCellWidth(reportId,ui){
	//var changecolid = ui.helper.attr("colid");
	var changecolid = ui.originalElement.attr("colid")
	var changecolwidth = ui.size.width;
	
	colHeaderTableUpdateIndex = new Array();
	$("#"+getTableID(reportId,"colHeader")).children().children("tr").each(function(index1){
		$(this).children("td").each(function(index2){
			if($(this).attr("colSpan")==1&&$(this).attr("rowSpan")==colHeaderRowCount){
				var width = $(this).width();
				//colHeaderTableCellWidth[index2] = width;
				colHeaderTableUpdateIndex.push(index2);
			}else{
				if(index1==$("#"+getTableID(reportId,"colHeader")).children().children("tr").size()-1){
					if(!hasUpdateCellWidth(colHeaderTableUpdateIndex,index2)){
						var width = $(this).width();
						//colHeaderTableCellWidth[index2] = width;
						colHeaderTableUpdateIndex.push(index2);
					}
				}
			}
			
		});
	});
	//修改colHeaderTableCellWidth中的值
	colHeaderTableCellWidth[changecolid] = changecolwidth;
	
}


//拖拽结束后重新设置一遍列宽
function getColHeaderTableCellWidth2(reportId,ui){
	//var changecolid = ui.helper.attr("colid");
	var changecolid = ui.originalElement.attr("colid")
	var changecolwidth = ui.size.width;
	
	colHeaderTableUpdateIndex = new Array();
	$("#"+getTableID(reportId,"colHeader")).children().children("tr").each(function(index1){
		$(this).children("td").each(function(index2){
			if($(this).attr("colSpan")==1&&$(this).attr("rowSpan")==colHeaderRowCount){
				var width = $(this).width();
				//colHeaderTableCellWidth[index2] = width;
				colHeaderTableUpdateIndex.push(index2);
			}else{
				if(index1==$("#"+getTableID(reportId,"colHeader")).children().children("tr").size()-1){
					if(!hasUpdateCellWidth(colHeaderTableUpdateIndex,index2)){
						var width = $(this).width();
						//colHeaderTableCellWidth[index2] = width;
						colHeaderTableUpdateIndex.push(index2);
					}
				}
			}
			
		});
	});
	//修改colHeaderTableCellWidth中的值
	colHeaderTableCellWidth2[changecolid] = changecolwidth;
	
}


//拖拽结束后重新设置一遍Corner列宽
function getCornerTableCellWidth(reportId){
	
	cornerTableUpdateIndex = new Array();
	$("#"+getTableID(reportId,"corner")).children().children("tr").each(function(index1){
		$(this).children("td").each(function(index2){
			if($(this).attr("colSpan")==1&&$(this).attr("rowSpan")==cornerRowCount){
				var width = $(this).width();
				cornerTableCellWidth[index2] = width;
				cornerTableUpdateIndex.push(index2);
			}else{
				if(index1==$("#"+getTableID(reportId,"corner")).children().children("tr").size()-1){
					if(!hasUpdateCellWidth(cornerTableUpdateIndex,index2)){
						var width = $(this).width();
						cornerTableCellWidth[index2] = width;
						cornerTableUpdateIndex.push(index2);
					}
				}
			}
			
		});
	});
}
function getTableID(reportId,pos){
	return "report_"+reportId+"_table_"+pos;
}
//更新列宽度array
function updateColHeaderCellWidth(reportId,ui){
	var changecolid = ui.helper.attr("colid");
	var changecolwidth = ui.size.width;
	
	colHeaderTableUpdateIndex = new Array();
	$("#"+getTableID(reportId,"colHeader")).children().children("tr").each(function(index1){
		$(this).children("td").each(function(index2){
			if($(this).attr("colSpan")==1&&$(this).attr("rowSpan")==colHeaderRowCount){
				var width = $(this).get(0).clientWidth-2;
				//colHeaderTableCellWidth[index2] = width;
				colHeaderTableUpdateIndex.push(index2);
				$(this).width(width);
			}else{
				if(index1==$("#"+getTableID(reportId,"colHeader")).children().children("tr").size()-1){
					if(!hasUpdateCellWidth(colHeaderTableUpdateIndex,index2)){
						var width = $(this).get(0).clientWidth-2;
						colHeaderTableUpdateIndex.push(index2);
						//colHeaderTableCellWidth[index2] = width;
						$(this).width(width);
					}
				}
			}
			
		});
	});

}

//初始化colHeader表中每一列的宽度，记录到array中
function initColHeaderWidthArray(reportId){
	//判断colHeaderTableCellWidth  是否undefined
	if(typeof(colHeaderTableCellWidth) == "undefined" || colHeaderTableCellWidth==""){
		colHeaderRowCount = $("#"+getTableID(reportId,"colHeader")).children().children("tr").size();
		colHeaderTableCellWidth = new Array();
		$("#"+getTableID(reportId,"colHeader")).children().children("tr").each(function(index1){
			$(this).children("td").each(function(index2){
				if(index1==$("#"+getTableID(reportId,"colHeader")).children().children("tr").size()-1){
					colHeaderTableCellWidth[index2] = $(this).outerWidth(true);
				}
			});
		});
	}
	
	if(typeof(colHeaderTableCellWidth2) == "undefined" || colHeaderTableCellWidth2==""){
		colHeaderRowCount = $("#"+getTableID(reportId,"colHeader")).children().children("tr").size();
		colHeaderTableCellWidth2 = new Array();
		$("#"+getTableID(reportId,"colHeader")).children().children("tr").each(function(index1){
			$(this).children("td").each(function(index2){
				if(index1==$("#"+getTableID(reportId,"colHeader")).children().children("tr").size()-1){
					colHeaderTableCellWidth2[index2] = parseInt( $(this).css("width"));
					
				}
			});
		});
	}
	
}



//更新corner宽度array
function updateCornerCellWidth(reportId){
	cornerTableUpdateIndex = new Array();
	$("#"+getTableID(reportId,"corner")).children().children("tr").each(function(index1){
		$(this).children("td").each(function(index2){
			if($(this).attr("colSpan")==1&&$(this).attr("rowSpan")==cornerRowCount){
				var width = $(this).get(0).clientWidth-2;
				//cornerTableCellWidth[index2] = width;
				//cornerTableUpdateIndex.push(index2);
				$(this).width(width);
			}else{
				if(index1==$("#"+getTableID(reportId,"corner")).children().children("tr").size()-1){
					if(!hasUpdateCellWidth(cornerTableUpdateIndex,index2)){
						var width = $(this).get(0).clientWidth-2;
						//cornerTableUpdateIndex.push(index2);
						//cornerTableCellWidth[index2] = width;
						$(this).width(width);
					}
				}
			}
			
		});
	});
}

//初始化corner表中每一列的宽度，记录到array中
function initCornerWidthArray(reportId){
	cornerRowCount = $("#"+getTableID(reportId,"corner")).children().children("tr").size();
	cornerTableCellWidth = new Array();
	$("#"+getTableID(reportId,"corner")).children().children("tr").each(function(index1){
		$(this).children("td").each(function(index2){
			if(index1==$("#"+getTableID(reportId,"corner")).children().children("tr").size()-1){
				cornerTableCellWidth[index2] = $(this).width();
			}
		});
	});
}
function hasUpdateCellWidth(array,index){
		var b = false;
		for(var i=0;i<array.length;i++){
			var upIndex = array[i];
			if(upIndex==index)b=true;
		}
		return b;
}
function isLastcorner(corner){
	
	
}
