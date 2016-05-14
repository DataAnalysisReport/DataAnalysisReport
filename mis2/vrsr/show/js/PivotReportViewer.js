/**
 *判断浏览器类型方法
 *
 */
function BrowserType() {
	var OsObject = "";
	if (navigator.userAgent.indexOf("MSIE") > 0) {
		OsObject = "MSIE";
	}
	if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
		OsObject = "Firefox";
	}
	if (isSafari = navigator.userAgent.indexOf("Safari") > 0 && navigator.userAgent.indexOf("Chrome") < 0) {
		OsObject = "Safari";
	}
	if (isCamino = navigator.userAgent.indexOf("Chrome") > 0) {
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
var PivotReportViewer = function(contextPath, reportId, reportName, filePath, target, currPage, perPageCount, query, params, serverPath, reportDefineId, layout) {
	//属性：
	this.contextPath = contextPath; // 系统URL
	this.reportId = reportId; // 报表ID
	this.reportName = reportName; // 报表名称
	this.serverPath = serverPath; // 报表路径
	this.filePath = filePath; // 报表配置文件路径
	this.target = target; // 报表区域节点元素
	this.currPage = currPage; // 当前页码
	this.perPageCount = parseInt(perPageCount); // 每页显示记录数 
	this.query = query; // 通用查询JSON串
	this.params = params; // 数据集参数
	this.reportConfig = null; // 报表信息
	this.perPageRowCount = 0; //每页显示行数（指的是数据区）
	this.perPageColCount = 0; //每页显示列数（指的是数据区）
	this.cachePageCount = 3; // 缓存数组存放的页数
	this.graphData = null; //统计图数据
	this.verticalScrollTop = 0; // 垂直滚动条位置 
	this.horizontalScrollLeft = 0; // 水平滚动条位置
	//报表实体ID
	this.reportDefineId = reportDefineId;
	
	this.layout = layout; // 统计图布局
	
	var base64 = new Base64();

	var _this = this;
	var $this = $(this);

	/** 初始化 */
	this.init = function() {
		// 绑定监听事件：
		$this.bind('error', this.errorHandler); //错误处理事件
		$this.bind('pageChanged', this.pageChangedHandler); //页码改变事件
		$this.bind('cacheDataReady', this.cacheDataReadyHandler); //缓存数据就绪事件
		$this.bind('nextPageReady', this.nextPageReadyHandler); //下一页数据就绪事件
		$this.bind('initReportInfoComplete', this.initReportInfoHandler); //初始化报表信息完成事件
		$this.bind('initPageCountComplete', this.initPageCountHandler); //初始化总页数完成事件
		$this.bind('createDataComplete', this.createDataCompleteHandler); //数据表格生成完成
		// 1 初始化页面元素：表头table 和 数据区table
		this.initTable();

		// 2 初始化页面元素：统计图显示区域
		//this.initGraphDiv();
		var initFlag = true;
		this.initChartDiv(initFlag);
		
		//4.初始化完成调用
		pivot_success_status();
		return this;
	}
	
	/**
	 * 初始化统计图：
	 */
	this.initChartDiv = function(initFlag){
		$("#chartDiv").html("");
		var url = PathUtils.getRelativeUrl("/showPivotReportServlet?action=11");
		url += _this.params;
		//交叉报表：
		$.ajax({
			type: "POST",
			url: url,
			async: true,
			cache: false,
			data: {
				"resID": base64.encode(_this.reportId),
				"reportDefineId": base64.encode(_this.reportDefineId),
				"serverPath": base64.encode(_this.serverPath),
				"pivotReportDir": base64.encode(_this.filePath)
			},
			dataType: "json",
			success: function(data) {
				if (data.state == 200) {
					var width=parseInt(data.width);
					var height=parseInt(data.height);
					var graphJson= JSON.stringify(data);
					//var graphPageUrl=$.contextPath+'/mis2/vrsr/show/showGraph.jsp?graphJSON='+base64.encode(graphJson);
					//$("#chartDiv").append("<iframe name='chartFrame' width='"+width+"' height='"+height+"' frameborder='no' src="+ graphPageUrl +" scrolling='no' />");
					$("#chartDiv").append("<iframe id ='chartFrame' name='chartFrame' width='"+width+"' height='"+height+"' frameborder='no' scrolling='no' src='' />");
					var graphPageUrl = $.contextPath+'/mis2/vrsr/show/showGraph.jsp';
					var param = {"graphJSON":base64.encode(graphJson)};
					postSubmit(graphPageUrl,param,"chartFrame");
				} else if (data.state == 404) {
					alert("当前报表没有统计图，请先设置统计图后再进行查看。");
				} else if (data.state == 500) {
					alert("获取统计图失败");
				}
				
				
				_this.setLayout(_this.layout);
				if(initFlag==true){
				// 3 初始化报表信息：title, foot, css, ...
				_this.initReportInfo();
				}
			},
			error: function() {
				alert("获取统计图失败");
				if(initFlag==true){
				// 3 初始化报表信息：title, foot, css, ...
				_this.initReportInfo();
				}
			}
		});
	
	}

	

	/** 初始化页面表格 */
	this.initTable = function() {
		$('#tableDiv').html('');
		var table_title_div = $('<div id="report_' + this.reportId + '_table_title_div" style="overflow-y:hidden;overflow-x:hidden;">' + '</div>');
		var table_foot_div = $('<div id="report_' + this.reportId + '_table_foot_div" style="overflow-y:hidden;overflow-x:hidden;">' + '</div>');
		var table = $('<table id="report_' + this.reportId + '_table" style="border-collapse:collapse;"></table>');
		table.append(
				'<tr>' + 
				'<td style="padding:0;">' + 
				'<div id="report_' + this.reportId + '_table_corner_div" style="overflow-y:hidden; overflow-x:hidden; border:solid 0px;">' + 
				'<table id="report_' + this.reportId + '_table_corner" style="border-collapse:collapse;"></table>' + 
				'</div>' + 
				'</td>' + 
				'<td alivn="left" style="padding:0;">' + 
				'<div id="report_' + this.reportId + '_table_colHeader_div" style="overflow:hidden; border:solid 0px;">' + 
				'<div id="report_' + this.reportId + '_table_colHeader_scroll_div" style="height:100%;">' + 
				'<table id="report_' + this.reportId + '_table_colHeader" style="border-collapse:collapse;"></table>' + 
				'</div>' + 
				'</div>' + 
				'</td>' + 
				'</tr>' + 
				'<tr>' + 
				'<td valign="top" style="padding:0;">' + 
				'<div id="report_' + this.reportId + '_table_rowHeader_div" style="overflow:hidden; border:solid 0px;">' + 
				'<div id="report_' + this.reportId + '_table_rowHeader_scroll_div" style="width:100%;">' + 
				'<table id="report_' + this.reportId + '_table_rowHeader" style="border-collapse:collapse;"></table>' + 
				'</div>' + 
				'</div>' + 
				'</td>' + 
				'<td style="padding:0;">' + 
				'<div id="report_' + this.reportId + '_table_data_div" style="overflow:hidden; border:solid 0px;">' + 
				'<div id="report_' + this.reportId + '_table_data_scroll_div">' + 
				'<table id="report_' + this.reportId + '_table_data" style="border-collapse:collapse;"></table>' + 
				'</div>' + 
				'</div>' + 
				'</td>' + 
				'</tr>'
		);
		table_title_div.appendTo($('#tableDiv'));
		table.appendTo($('#tableDiv'));
		table_foot_div.appendTo($('#tableDiv'));
		//滚动条事件：
		$('#report_' + this.reportId + '_table_data_div').scroll(function() {
			debugger;
			if($('#report_' + _this.reportId + '_table_data_div').scrollTop() == _this.verticalScrollTop && $('#report_' + _this.reportId + '_table_data_div').scrollLeft() == _this.horizontalScrollLeft){
				return;
			}
			
			_this.verticalScrollTop = $('#report_' + _this.reportId + '_table_data_div').scrollTop();
			_this.horizontalScrollLeft = $('#report_' + _this.reportId + '_table_data_div').scrollLeft();
			$('#report_' + _this.reportId + '_table_rowHeader_div').scrollTop(_this.verticalScrollTop);
			$('#report_' + _this.reportId + '_table_colHeader_div').scrollLeft(_this.horizontalScrollLeft);
			
			$.doTimeout("scrollStop", 1000,
				function() {
					$.doTimeout("scrollStop");
					if (_this.verticalScrollTop == $('#report_' + _this.reportId + '_table_data_div').scrollTop() && _this.horizontalScrollLeft == $('#report_' + _this.reportId + '_table_data_div').scrollLeft()) {
						//触发换页事件：
						$this.trigger('pageChanged');
					} else {
						_this.verticalScrollTop = $('#report_' + _this.reportId + '_table_data_div').scrollTop();
						_this.horizontalScrollLeft = $('#report_' + _this.reportId + '_table_data_div').scrollLeft();
					}
				}
			);
		});
	}

	/**
	 * 清空表格内容
	 */
	this.clearTable = function() {
		$('#report_' + _this.reportId + '_table_title_div').html('');
		$('#report_' + _this.reportId + '_table_corner').html('');
		$('#report_' + _this.reportId + '_table_colHeader').html('');
		$('#report_' + _this.reportId + '_table_rowHeader').html('');
		$('#report_' + _this.reportId + '_table_data').html('');
		$('#report_' + _this.reportId + '_table_foot_div').html('');
	}

	/** 初始化统计图显示区域 */
	this.initGraphDiv = function() {
		$('#graphDiv').html('');
		var div = //'<div id="graphDiv" class="graphDiv" style="text-align: center; width:100%; height:2%;">' +
		'<div><img id="showGraphBtn" class="hideGraph" src="images/up.png" title="显示统计图" /></div>' + '<div id="graphContent" style="display:none;height:95%;width:100%;overflow-x:auto;overflow-y:hidden;padding:0;margin:0;">' + '</div>';
		//'</div>';
		$(div).appendTo($('#graphDiv'));
		$("#showGraphBtn").click(function() {
			showGraphBtnClick();
		});
	}
	function showGraphBtnClick() {
		if ($("#showGraphBtn").attr('class') == 'hideGraph') {
			//当前是收起状态：
			$("#graphDiv").css('height', '50%');
			$("#tableDiv").css('height', '50%');
			$("#graphContent").show();
			$("#showGraphBtn").attr('src', 'images/down.png');
			$("#showGraphBtn").attr('title', '隐藏统计图');
			$("#showGraphBtn").attr('class', 'showGraph');

			_this.addGraphImage(); //添加统计图
		} else {
			//当前是展开状态：
			$("#graphContent").hide();
			$("#graphDiv").css('height', '3%');
			$("#tableDiv").css('height', '97%');
			$("#showGraphBtn").attr('src', 'images/up.png');
			$("#showGraphBtn").attr('title', '显示统计图');
			$("#showGraphBtn").attr('class', 'hideGraph');
			$("#graphContent").html("");
			_this.graphData = null
		}
	}

	/** 添加统计图图片 */
	this.addGraphImage = function(width, height) {
		if (_this.graphData == null) {
			loading();
			var url = PathUtils.getRelativeUrl("/showPivotReportServlet?action=11");
			if (width) {
				url += "&width=" + width;
			}
			if (height) {
				url += "&height=" + height;
			}
			url += _this.params;
			//交叉报表：
			$.ajax({
				type: "POST",
				url: url,
				async: true,
				cache: false,
				data: {
					"resID": base64.encode(_this.reportId),
					"reportDefineId": base64.encode(_this.reportDefineId),
					"serverPath": base64.encode(_this.serverPath),
					"pivotReportDir": base64.encode(_this.filePath)
				},
				dataType: "json",
				success: function(data) {
					closeFile();
					_this.getGraphImageSuccessHandler(data, width, height);
				},
				error: function() {
					$this.trigger({
						type: 'error',
						opt: '获取统计图'
					});
				}
			});
		}
	}
	/** 添加统计图图片 */
	this.toolBarShowGraph = function() {
		var url = PathUtils.getRelativeUrl("/showPivotReportServlet?action=11");
		url += _this.params;
		//交叉报表：
		$.ajax({
			type: "POST",
			url: url,
			async: true,
			cache: false,
			data: {
				"resID": base64.encode(_this.reportId),
				"reportDefineId": base64.encode(_this.reportDefineId),
				"serverPath": base64.encode(_this.serverPath),
				"pivotReportDir": base64.encode(_this.filePath)
			},
			dataType: "json",
			success: function(data) {
				if (data.state == 200) {
					var width = parseInt(data.width);
					var height = parseInt(data.height);
					var graphJson = JSON.stringify(data);
					var graphPageUrl = $.contextPath + '/mis2/vrsr/show/showGraph.jsp?graphJSON=' + base64.encode(graphJson);
					try {
						getHomeContentWindow1(window).openTab(_this.reportId + '_graph', '统计图', graphPageUrl);
					} catch(e) {
						showDialog(graphPageUrl, "", "统计图", height + 15, width + 15);
					}
				} else if (data.state == 404) {
					alert("当前报表没有统计图，请先设置统计图后再进行查看。");
				} else if (data.state == 500) {
					alert("获取统计图失败");
				}
			},
			error: function() {
				alert("获取统计图失败");
			}
		});
	}

	/** 获取统计图成功 */
	this.getGraphImageSuccessHandler = function(data, w, h) {
		_this.graphData = data;
		if (_this.graphData.state == 200) {
			var height = $("#graphContent").height();
			var src = '';
			if (_this.contextPath == '') {
				src = _this.graphData.path + '?t_i_m_e=' + (new Date().getTime());
			} else {
				src = PathUtils.getRelativeUrl(_this.graphData.path + '?t_i_m_e=' + (new Date().getTime()));
			}
			var image = '<image id="graphImage" height="' + height + '" src="' + src + '" />';
			$("#graphContent").append(image);
			if (w) {
				$("#graphImage").width(w);
			} else {
				w = $("#graphImage").width();
			}
			if (h) {
				$("#graphImage").height(h);
			} else {
				h = $("#graphImage").height();
			}
			ResizeGraph($("#graphImage"), h, "viewer.graphData=null;viewer.addGraphImage");
		} else if (_this.graphData.state == 404) {
			$("#graphContent").append(_this.graphData.message);
		} else if (_this.graphData.state == 500) {
			$("#graphContent").append(_this.graphData.message);
		}
	}

	/** 初始化页面报表信息 */
	this.initReportInfo = function() {
		loading();
		$.ajax({
			type: "POST",
			url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=0" + _this.params),
			cache: false,
			data: {
				"resID": base64.encode(_this.reportId),
				"reportDefineId": base64.encode(_this.reportDefineId),
				"serverPath": base64.encode(_this.serverPath),
				"pivotReportDir": base64.encode(_this.filePath),
				"query": base64.encode(_this.query)
			},
			dataType: "json",
			success: function(data) {
				closeFile();
				if (data.state == 500) {
					confirm(data.message);
					return;
				}
				_this.reportConfig = data;
				//触发事件：
				$this.trigger('initReportInfoComplete');
			},
			error: function(s) {
				$this.trigger({
					type: 'error',
					opt: '初始化报表信息'
				});
			}
		});
	}

	/** 初始化报表信息完成 */
	this.initReportInfoHandler = function(evt) {
		//初始化工具条
		this.initToolbar();

		//初始化页数
		this.initPageCount();
	}

	/** 计算总页数 */
	this.initPageCount = function() {
		//后台获取记录数
		$.ajax({
			type: "POST",
			url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=1"),
			async: true,
			cache: false,
			data: {
				"resID": base64.encode(_this.reportId),
				"reportDefineId": base64.encode(_this.reportDefineId),
				"serverPath": base64.encode(_this.serverPath),
				"pivotReportDir": base64.encode(_this.filePath)
			},
			dataType: "json",
			success: function(data) {
				if (data.state == 500) {
					confirm(data.message);
					return;
				}
				var result = JSON.stringify(data);
				if (result.indexOf("tooLarge") != -1) {
					confirm("数据量过大,已超过阈值,请缩小数据范围!");
					return;
				}
				
				_this.setTableDivSize(data);

				if ($("#showGraphBtn").attr('class') != 'hideGraph') {
					//showGraphBtnClick();
				}
				$this.trigger('pageChanged');
			},
			error: function() {
				$this.trigger({
					type: 'error',
					opt: '获取记录数'
				});
			}
		});
	}

	/**
	 * 设置4个DIV大小
	 */
	this.setTableDivSize = function(size) {

		var rowDimCount = this.reportConfig.rowDims.length;
		if (this.reportConfig.statCount > 1) {
			//多测度
			rowDimCount += 1;
		}
		var colDimCount = this.reportConfig.colDims.length;
		var cellHeight = this.reportConfig.rowHeight;
		var cellWidth = this.reportConfig.colWidth;
		var reportRowCount = size.reportRowCount * this.reportConfig.statCount;
		var reportColCount = size.reportColCount;

		// 左上角DIV大小为 列维度个数 * 行维度个数
		$("#report_" + this.reportId + "_table_corner_div").height(colDimCount * cellHeight);
		$("#report_" + this.reportId + "_table_corner_div").width(rowDimCount * cellWidth);

		var height = 0;
		var width = 0;

		//if($('#tableDiv').attr('clientHeight') && $('#tableDiv').attr('clientWidth')){
		//	height = $('#tableDiv').attr('clientHeight') - $('#report_' + _this.reportId + '_table_corner_div').height();
		//	width = $('#tableDiv').attr('clientWidth') - $('#report_' + _this.reportId + '_table_corner_div').width();
		//}else{
		//	height = $('#tableDiv').height() - $('#report_' + _this.reportId + '_table_corner_div').height();
		//	width = $('#tableDiv').width() - $('#report_' + _this.reportId + '_table_corner_div').width();
		//}
		// 右上角DIV大小为 colDimCount * 剩余宽度
		//$("#report_"+this.reportId+"_table_colHeader_div").height(colDimCount * cellHeight);
		//$("#report_"+this.reportId+"_table_colHeader_div").width(width);
		// 左下角DIV大小为 剩余高度 * rowDimCount
		//$("#report_"+this.reportId+"_table_rowHeader_div").height(height);
		//$("#report_"+this.reportId+"_table_rowHeader_div").width(rowDimCount * cellWidth);
		// 右下角DIV大小为剩余空间
		//$('#report_'+_this.reportId+'_table_data_div').width(width);
		//$('#report_'+_this.reportId+'_table_data_div').height(height);
		//设置scroll_div大小,使对应DIV出现滚动条
		//$('#report_'+_this.reportId+'_table_data_scroll_div').height(reportRowCount * cellHeight);
		//$('#report_'+_this.reportId+'_table_data_scroll_div').width(reportColCount * cellWidth);
		//- 2*cellHeight为减去标题和底栏高度和边框的宽度
		if (isFromDBD != 'true') { //DBD下高度计算
			if ($('#tableDiv').attr('clientHeight') && $('#tableDiv').attr('clientWidth')) {
				height = $('#tableDiv').attr('clientHeight') - $('#report_' + _this.reportId + '_table_corner_div').height() - 2 * cellHeight - 4;
				width = $('#tableDiv').attr('clientWidth') - $('#report_' + _this.reportId + '_table_corner_div').width();
			} else {
				height = $('#tableDiv').height() - $('#report_' + _this.reportId + '_table_corner_div').height() - 2 * cellHeight - 4;
				width = $('#tableDiv').width() - $('#report_' + _this.reportId + '_table_corner_div').width();
			}

			// 右上角DIV大小为 colDimCount * 剩余宽度
			$("#report_" + this.reportId + "_table_colHeader_div").height(colDimCount * cellHeight);
			$("#report_" + this.reportId + "_table_colHeader_div").width(width);
			// 左下角DIV大小为 剩余高度 * rowDimCount 
			$("#report_" + this.reportId + "_table_rowHeader_div").height(Math.floor(height / cellHeight) * cellHeight);
			$("#report_" + this.reportId + "_table_rowHeader_div").width(rowDimCount * cellWidth);
			// 右下角DIV大小为剩余空间
			$('#report_' + _this.reportId + '_table_data_div').width(width);
			$('#report_' + _this.reportId + '_table_data_div').height(Math.floor(height / cellHeight) * cellHeight);
			//设置scroll_div大小,使对应DIV出现滚动条
			$('#report_' + _this.reportId + '_table_data_scroll_div').height(reportRowCount * cellHeight);
			$('#report_' + _this.reportId + '_table_data_scroll_div').width(reportColCount * cellWidth);
		} else {
			if ($('#tableDiv').attr('clientHeight') && $('#tableDiv').attr('clientWidth')) {
				height = $('#tableDiv').attr('clientHeight') - $('#report_' + _this.reportId + '_table_corner_div').height();
				width = $('#tableDiv').attr('clientWidth') - $('#report_' + _this.reportId + '_table_corner_div').width();
			} else {
				height = $('#tableDiv').height() - $('#report_' + _this.reportId + '_table_corner_div').height();
				width = $('#tableDiv').width() - $('#report_' + _this.reportId + '_table_corner_div').width();
			}

			// 右上角DIV大小为 colDimCount * 剩余宽度
			$("#report_" + this.reportId + "_table_colHeader_div").height(colDimCount * cellHeight);
			$("#report_" + this.reportId + "_table_colHeader_div").width(reportColCount * cellWidth);
			// 左下角DIV大小为 剩余高度 * rowDimCount 
			$("#report_" + this.reportId + "_table_rowHeader_div").height(reportRowCount * cellHeight);
			$("#report_" + this.reportId + "_table_rowHeader_div").width(rowDimCount * cellWidth);
			// 右下角DIV大小为剩余空间
			$('#report_' + _this.reportId + '_table_data_div').width(reportColCount * cellWidth);
			$('#report_' + _this.reportId + '_table_data_div').height(reportRowCount * cellHeight);
			//设置scroll_div大小,使对应DIV出现滚动条
			$('#report_' + _this.reportId + '_table_data_scroll_div').height(reportRowCount * cellHeight);
			$('#report_' + _this.reportId + '_table_data_scroll_div').width(reportColCount * cellWidth);

			$("#tableDiv").css("overflow", "auto")
		}

		//针对不同浏览器类型对div进行修正
		if (BrowserType() == "Chrome") {
			//if(reportColCount * cellWidth>width){			
			//	$('#report_'+_this.reportId+'_table_colHeader_scroll_div').width(reportColCount * cellWidth+20);
			//}else{				
			$('#report_' + _this.reportId + '_table_colHeader_scroll_div').width(reportColCount * cellWidth);
			//}
			if (reportRowCount * cellHeight > height) {
				$('#report_' + _this.reportId + '_table_rowHeader_scroll_div').height(reportRowCount * cellHeight + 20);
			} else {
				$('#report_' + _this.reportId + '_table_rowHeader_scroll_div').height(reportRowCount * cellHeight);
			}
		} else if (BrowserType() == "Firefox") {
			$('#report_' + _this.reportId + '_table_rowHeader_scroll_div').height(reportRowCount * cellHeight + 25);
			$('#report_' + _this.reportId + '_table_colHeader_scroll_div').width(reportColCount * cellWidth + 50);
		} else {
			$('#report_' + _this.reportId + '_table_rowHeader_scroll_div').height(reportRowCount * cellHeight + 20);
			$('#report_' + _this.reportId + '_table_colHeader_scroll_div').width(reportColCount * cellWidth);
		}

		if ($('#report_' + _this.reportId + '_table_data_div').attr('clientWidth')) {
			$('#report_' + _this.reportId + '_table_colHeader_div').width($('#report_' + _this.reportId + '_table_data_div').attr('clientWidth'));
			$('#report_' + _this.reportId + '_table_rowHeader_div').height($('#report_' + _this.reportId + '_table_data_div').attr('clientHeight'));
		} else {
			$('#report_' + _this.reportId + '_table_colHeader_div').width($('#report_' + _this.reportId + '_table_data_div').width());
			$('#report_' + _this.reportId + '_table_rowHeader_div').height($('#report_' + _this.reportId + '_table_data_div').height());
		}

		//if(BrowserType()=="Chrome"){
//		if (reportColCount * cellWidth > width) {
//			$("#report_" + this.reportId + "_table_colHeader_div").width(width - 16);
//		}
		//}
		if (isFromDBD == "true") {
			$("#report_" + this.reportId + "_table_colHeader").height($("#report_" + this.reportId + "_table_colHeader_div").height());
			$("#report_" + this.reportId + "_table_colHeader_div").css("width", "100%");
		}

		//设置每页显示数据量：(以数据区大小来计算)
		this.perPageRowCount = Math.floor($('#report_' + _this.reportId + '_table_data_div').height() / cellHeight);
		this.perPageColCount = Math.floor($('#report_' + _this.reportId + '_table_data_div').width() / cellWidth);

		var intNum = parseInt($('#report_' + _this.reportId + '_table_data_div').width() / cellWidth);
		var tmpNum = $('#report_' + _this.reportId + '_table_data_div').width() / cellWidth - intNum;
		if (tmpNum * cellWidth < 17) {
			this.perPageColCount--;
		}

		// 设置滚动条位置：
		if (Math.ceil(this.verticalScrollTop / cellHeight) > reportRowCount - this.perPageRowCount) {
			this.verticalScrollTop -= (Math.ceil(this.verticalScrollTop / cellHeight) - (reportRowCount - this.perPageRowCount)) * cellHeight;
		}
		if (Math.ceil(this.horizontalScrollLeft / cellWidth) > reportColCount - this.perPageColCount) {
			this.horizontalScrollLeft -= (Math.ceil(this.horizontalScrollLeft / cellWidth) - (reportColCount - this.perPageColCount)) * cellWidth;
		}

		if (this.verticalScrollTop > reportRowCount * cellHeight || this.verticalScrollTop < 0) {
			this.verticalScrollTop = 0;
		}
		if (this.horizontalScrollLeft > reportColCount * cellWidth || this.horizontalScrollLeft < 0) {
			this.horizontalScrollLeft = 0;
		}
	}

	/** 页码改变事件 */
	this.pageChangedHandler = function(evt) {
		this.createTableData();
		$('#report_' + this.reportId + '_table_data').css('margin-top', this.verticalScrollTop);
		$('#report_' + this.reportId + '_table_data_scroll_div').css('overflow', 'hidden');
		$('#report_' + this.reportId + '_table_data').css('margin-left', this.horizontalScrollLeft);
		$('#report_' + this.reportId + '_table_rowHeader').css('margin-top', this.verticalScrollTop);
		$('#report_' + this.reportId + '_table_rowHeader_scroll_div').css('overflow', 'hidden');
		$('#report_' + this.reportId + '_table_colHeader').css('margin-left', this.horizontalScrollLeft);
		var initFlag = false;
		this.initChartDiv(initFlag);
	}

	/** 添加表格数据 */
	this.createTableData = function() {
		var rowBegin = Math.ceil(Math.ceil(this.verticalScrollTop / this.reportConfig.rowHeight) / this.reportConfig.statCount);
		var colBegin = Math.ceil(this.horizontalScrollLeft / this.reportConfig.colWidth);
		var rowLength = Math.floor(this.perPageRowCount / this.reportConfig.statCount);
		var colLength = this.perPageColCount;
		
//		confirm(rowBegin + "," + colBegin + "," + rowLength + "," + colLength);
		if(rowLength < _this.reportConfig.rowDims.length || colLength < _this.reportConfig.colDims.length){
			// 空间不足，提示：
			$("#tableDiv").children().hide();
			$("#tableDiv").css("background-color", "gray");
			alert("没有足够空间显示数据表。请修改布局方式，或增大窗口！", 3);
			return;
		}
		
		$("#tableDiv").children().show();
		$("#tableDiv").css("background-color", "white");

		//获取数据：
		loading();
		$.ajax({
			type: "POST",
			url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=4"),
			cache: false,
			async: true,
			data: {
				"resID": base64.encode(_this.reportId),
				"reportDefineId": base64.encode(_this.reportDefineId),
				"serverPath": base64.encode(_this.serverPath),
				"rowBegin": rowBegin,
				"colBegin": colBegin,
				"rowLength": rowLength,
				"colLength": colLength
			},
			dataType: "json",
			success: function(data) {
				closeFile();
				if (data.state == 500) {
					confirm(data.message);
					return;
				}
				_this.clearTable();
				//创建表格
				//分别创建四个table以及标题和底栏数据数据：
				var title = data.title;
				var foot = data.foot;
				var cornerData = data.cornerData;
				var rowData = data.rowData;
				var colData = data.colData;
				var tableData = data.data;

				_this.createCornerData(cornerData);
				_this.createRowData(rowData);
				_this.createColData(colData);
				_this.createData(tableData);
				if (isFromDBD != 'true') { //DBD下高度计算
					//标题
					_this.createTitleData(title);
					//底栏
					_this.createFootData(foot);
				}
				//设置table大小：
				$("#report_" + _this.reportId + "_table_corner").height($("#report_" + _this.reportId + "_table_corner_div").height());
				//$("#report_"+_this.reportId+"_table_corner").width($("#report_"+_this.reportId+"_table_corner_div").width());
				$("#report_" + _this.reportId + "_table_corner td").height($("#report_" + _this.reportId + "_table_corner_div").height());
				$("#report_" + _this.reportId + "_table_corner td").width($("#report_" + _this.reportId + "_table_corner_div").width());
				//$("#report_"+_this.reportId+"_table_colHeader").height($("#report_"+_this.reportId+"_table_colHeader").height());
				if (BrowserType() != "Chrome" && BrowserType() != "Firefox") { //新版火狐、谷歌浏览器不能执行下列语句
					//$("#report_"+_this.reportId+"_table_colHeader").width($("#report_"+_this.reportId+"_table_data").width());
					//$("#report_"+_this.reportId+"_table_rowHeader").height($("#report_"+_this.reportId+"_table_rowHeader").height());
					//$("#report_"+_this.reportId+"_table_rowHeader").width($("#report_"+_this.reportId+"_table_rowHeader").width());
					//$("#report_"+_this.reportId+"_table_data").height($("#report_"+_this.reportId+"_table_data").height());
					//$("#report_"+_this.reportId+"_table_data").width($("#report_"+_this.reportId+"_table_data").width());
				}
//				$("#report_" + _this.reportId + "_table_rowHeader").width($("#report_" + _this.reportId + "_table_corner td").width());
//				$("#report_" + _this.reportId + "_table_colHeader").height($("#report_" + _this.reportId + "_table_corner td").height());
				
				//字段对齐方式设置
				//行维度字段
				var rowDimAligns = data.rowDimAligns;
				var rowDims = _this.reportConfig.rowDims;
				for(var i=0;i<rowDims.length;i++){
					var dimAlign = rowDimAligns[rowDims[i]];
					if(dimAlign != "" && typeof dimAlign != "undefined"){
						//设置rowHeader的第i列对齐方式
						$("#report_"+_this.reportId+"_table_rowHeader").find("tr").each(function(){
							$(this).find("td").eq(i).css("text-align",dimAlign);
						});
					}	
				}
				//列维度字段
				var colDimAligns = data.colDimAligns;
				var colDims = _this.reportConfig.colDims;
				for(var i=0;i<colDims.length;i++){
					var dimAlign = colDimAligns[colDims[i]];
					if(dimAlign != "" && typeof dimAlign != "undefined"){
						//设置colHeader的第i行对齐方式
						$("#report_"+_this.reportId+"_table_colHeader").find("tr").eq(i).find("td").css("text-align",dimAlign);
					}
				}
				//汇总字段
				var statsDimAligns = data.statsDimAligns;
				var statFields = _this.reportConfig.statFields;
				if(statFields.length == 1){//只有一个汇总字段
					var dimAlign = statsDimAligns[statFields[0]];
					if(dimAlign != "" && typeof dimAlign != "undefined"){
						$("#report_"+_this.reportId+"_table_data").find("td").css("text-align",dimAlign);
					}
				}else{//两个及两个以上汇总字段
					for(var i=0;i<statFields.length;i++){
						var dimAlign = statsDimAligns[statFields[i]];
						if(dimAlign != "" && typeof dimAlign != "undefined"){
							$("#report_"+_this.reportId+"_table_rowHeader").find("tr").each(function(key,element){
								if($(this).find("td:last[v='" + statFields[i] + "']").length > 0){
									$("#report_"+_this.reportId+"_table_data").find("tr").eq(key).find("td").css("text-align",dimAlign);
								}
							});
						}
					}
				}
				
				var titleAndFootWidth = $("#report_" + _this.reportId + "_table_corner_div").width() + Math.min($("#report_" + _this.reportId + "_table_colHeader_scroll_div").width(), $("#report_" + _this.reportId + "_table_colHeader_div").width());
				$("#report_"+_this.reportId+"_table_title_div").width(titleAndFootWidth);
				$("#report_"+_this.reportId+"_table_foot_div").width(titleAndFootWidth);
				
				//调整底栏与数据区之间的空隙
				$("#report_" + _this.reportId + "_table_rowHeader_div").height($('#report_' + _this.reportId + '_table_data').height());
				$('#report_' + _this.reportId + '_table_data_div').height($('#report_' + _this.reportId + '_table_data').height());
				
				// 设置滚动条：
				$('#report_'+ _this.reportId +'_table_data_div').niceScroll();
				
				$('#report_' + _this.reportId + '_table_data_div').scrollTop(_this.verticalScrollTop);
				$('#report_' + _this.reportId + '_table_data_div').scrollLeft(_this.horizontalScrollLeft);
				$('#report_' + _this.reportId + '_table_rowHeader_div').scrollTop(_this.verticalScrollTop);
				$('#report_' + _this.reportId + '_table_colHeader_div').scrollLeft(_this.horizontalScrollLeft);
			},
			error: function() {
				closeFile();
				$this.trigger({
					type: 'error',
					opt: '获取数据'
				});
			}
		});
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
//		debugger
		// 设置页面布局：
		try{
			layout = parseInt(layout);
		}catch(e){
			
		}
		switch(layout){
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
				$("#tableDiv").css("display", "block");
				$("#tableDiv").css("width", "100%");
				$("#tableDiv").height($("#reportContent").height() - $("#chartDiv").height());
				$("#tableDiv").insertAfter($("#chartDiv"));
				break;
				
			case 5: // 显示表和图，图在下侧
				$("#chartDiv").css("display", "block");
				$("#chartDiv").css("width", "100%");
				$("#chartDiv").css("height", "auto");
				$("#tableDiv").css("display", "block");
				$("#tableDiv").css("width", "100%");
				$("#tableDiv").height($("#reportContent").height() - $("#chartDiv").height());
				$("#tableDiv").insertBefore($("#chartDiv"));
				break;
		}
		
//		$("#report_"+reportId+"_table_colHeader_div").width($("#tableDiv").width() - $("#report_"+reportId+"_table_corner_div").width());
//		$("#report_"+reportId+"_table_data_div").width($("#tableDiv").width() - $("#report_"+reportId+"_table_rowHeader_div").width());
//		var tableWidth = $("#report_"+reportID+"_table_corner").width() + Math.min($("#report_"+reportId+"_table_colHeader").width(), $("#report_"+reportId+"_table_colHeader_div").width());
//		$("#report_"+reportId+"_table_title_div").find("span.title").width(tableWidth);
//		$("#report_"+reportId+"_table_foot_div").find("span.foot").width(tableWidth);
		
		var toolbarHeight = $('.fast_pivot_toolbar').height();
		if($('.fast_pivot_toolbar').is(':hidden'))
			toolbarHeight = 0;
		
		//快速查询面板：
		var fastSearchDivHeight = $('#fastSearchDiv').height();
		if(fastSearchDivHeight == undefined)
			fastSearchDivHeight = 0;
		//通用查询面板：
		var commQryDivHeight = $('#commQryDiv').height();
		if(commQryDivHeight == undefined)
			commQryDivHeight = 0;
		if($('#commQryDiv').is(':hidden'))
			commQryDivHeight = 0;
		//下拉箭头：
		var commonQryToggleHeight = $('#commonQryToggle').height();
		if(commonQryToggleHeight == undefined)
			commonQryToggleHeight = 0;
		
		var graphDivHeight= 0; // $("#graphDiv").height();
		$('#reportContent').height($('body').height() - commQryDivHeight - fastSearchDivHeight - toolbarHeight - commonQryToggleHeight-graphDivHeight);

		var headerHeight=$("#report_"+reportID+"_table_colHeader_div").height();
		if(!headerHeight){
			headerHeight=0;
		}
//		$("#report_"+reportID+"_table_data_div").css("height", $('#reportContent').height()-headerHeight-5);
	}

	/** 创建左上角表头单元格 */
	this.createCornerData = function(data) {
		if (data == null || data == undefined || data.length == 0) return;

		for (var i = 0; i < data.length; i++) {
			var tr = $("<tr></tr>");
			for (var j = 0; j < data[i].length; j++) {
				var clz = 'corner';
				var value = '<image width="100%" height="100%" src="' + data[i][j].v + '?t_i_m_e=' + new Date().getTime() + '"></image>';
				$(tr).append('<td class="' + clz + '">' + value + '</td>');
			}
			$(tr).appendTo($("#report_" + this.reportId + "_table_corner"));
		}
		//添加样式：
		$("#report_" + this.reportId + "_table_corner td").css('border', 'solid 1px').width(this.reportConfig.colWidth).height(this.reportConfig.rowHeight);
		$("#report_" + this.reportId + "_table_corner .corner").css(this.reportConfig.css.corner);
		//合并单元格：
//		$("#report_" + this.reportId + "_table_corner").width($("#report_" + this.reportId + "_table_corner").width());
//		$("#report_" + this.reportId + "_table_corner").height($("#report_" + this.reportId + "_table_corner").height());

		_this.mergeCorner();
	}
	/** 创建标题表格数据*/
	this.createTitleData = function(data) {
		if (data == null || data == undefined || data.length == 0) return;
		var table_title_div = $("#report_" + this.reportId + "_table_title_div");
		table_title_div.height(_this.reportConfig.rowHeight);
		var clz = 'title';
		$(table_title_div).append('<span title="' + data + '" class="' + clz + '" style="display:block;white-space:nowrap;text-overflow:ellipsis;overflow:hidden; width: 100%; height:100%;"><nobr>' + data + '</nobr></span>');
		
//		$("#report_" + this.reportId + "_table_title_div span").height(spanHeight);
		$("#report_" + this.reportId + "_table_title_div .title").css(this.reportConfig.css.title);
//		$("#report_" + _this.reportId + "_table_title_div span").css("line-height", $("#report_" + _this.reportId + "_table_title_div span").height() + "px"); //span中标题居中
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
	/** 合并左上角单元格 */
	this.mergeCorner = function() {
		//tableId:
		var tableId = "report_" + this.reportId + "_table_corner";

		//行数：
		var rowCount = $("#" + tableId + " tr").length;
		//列数：
		var colCount = $("#" + tableId + " tr").eq(0).children().length;

		//合并行：
		for (var i = 1; i <= colCount; i++) {
			mergeRow(tableId, i);
		}
		//合并列：
		for (var i = 1; i <= rowCount; i++) {
			mergeCol(tableId, i, colCount);
		}
	}

	/** 创建行维度值单元格 */
	this.createRowData = function(data) {
		if (data == null || data == undefined || data.length == 0) return;
		for (var i = 0; i < data.length; i++) {
			var tr = $("<tr></tr>");
			for (var j = 0; j < data[i].length; j++) {
				var level = j;
				var value = data[i][j].v;
				var state = data[i][j].s;
				var disValue = data[i][j].fv;
				var href = data[i][j].h;
				var hrefParams = data[i][j].hrefParams; //超链接参数
				var hrefTarget = htFormat(data[i][j].ht); //超链接弹出方式
				if (typeof(disValue) == "undefined" || disValue == null || disValue == "") {
					disValue = value;
				}

				if (typeof(data[i][j].h) != "undefined") {
					disValue = '<a style="color:#008AE0;" href="javascript:void(0)" onclick="dataHref(\'' + href + '\',\'' + hrefTarget + '\',\'' + hrefParams + '\')" >' + disValue + '</a>';
				}
				var clz = 'rowHeader';
				if (state == -1) {
					clz = 'subSumHeader';
				}
				if (state == -2) 
					clz = 'sumHeader';
				//				var condition = this.createRowCondition(data[i], j);
				
				// 如果左边格子是合计、总计，则当前格子也设置为合计、总计：
				if(j > 0 && $(tr).children().eq(j - 1).hasClass("subSumHeader"))
					clz = 'subSumHeader';
				if(j > 0 && $(tr).children().eq(j - 1).hasClass("sumHeader"))
					clz = 'sumHeader';
				
				$(tr).append('<td class="' + clz + '" level="' + level + '" v="' + value + '" s="' + state + '">' + disValue + '</td>');
			}

			$(tr).appendTo($("#report_" + this.reportId + "_table_rowHeader"));
		}

		//添加样式：
		$("#report_" + this.reportId + "_table_rowHeader td").css('border', 'solid 1px').width(this.reportConfig.colWidth).height(this.reportConfig.rowHeight);
		$("#report_" + this.reportId + "_table_rowHeader .rowHeader").css(this.reportConfig.css.rowHeader);
		$("#report_" + this.reportId + "_table_rowHeader .subSumHeader").css(this.reportConfig.css.subSumHeader);
		$("#report_" + this.reportId + "_table_rowHeader .sumHeader").css(this.reportConfig.css.sumHeader);
		//合并单元格：
		_this.mergeRowHeader();
		//rowHeader 添加双击事件：
		$(".rowHeader").dblclick(function() {
			if ($(this).index() < _this.reportConfig.rowDims.length - 1) {
				if ($(this).attr("colSpan") > 1 || data[0].length < _this.reportConfig.rowDims.length) {
					_this.unfold($(this));
				} else if (_this.reportConfig.statFields.length > 1 && data[0].length <= _this.reportConfig.rowDims.length) { //处理多测度的情况
					_this.unfold($(this));
				} else {
					_this.fold($(this));
				}
			}
		});
	}

	/** 合并行表头单元格 */
	this.mergeRowHeader = function() {
		//tableId:
		var tableId = "report_" + this.reportId + "_table_rowHeader";
		//行数：
		var rowCount = $("#" + tableId + " tr").length;
		//列数：
		var colCount = $("#" + tableId + " tr").eq(0).children().length;

		//合并行：
		for (var i = 1; i <= colCount; i++) {
			mergeRowHeaderRow(tableId, i);
		}
		//合并列：
		for (var i = 1; i <= rowCount; i++) {
			mergeRowHeaderCol(tableId, i, colCount);
		}
	}

	/** 创建列维度值单元格 */
	this.createColData = function(data) {
		if (data == null || data == undefined || data.length == 0) return;
		for (var i = 0; i < data.length; i++) {
			var tr = $("<tr></tr>");
			var level = i;
			for (var j = 0; j < data[i].length; j++) {
				var clz = 'colHeader';
				var value = data[i][j].v;
				var state = data[i][j].s;
				var disValue = data[i][j].fv;
				var href = data[i][j].h; //超链接
				var hrefTarget = htFormat(data[i][j].ht); //超链接弹出方式
				var hrefParams = data[i][j].hrefParams; //超链接参数
				if (typeof(disValue) == "undefined" || disValue == null || disValue == "") {
					disValue = value;
				}

				if (typeof(data[i][j].h) != 'undefined') {
					disValue = '<a href="javascript:void(0)" onclick="dataHref(\'' + href + '\',\'' + hrefTarget + '\',\'' + hrefParams + '\',\'' + this.reportId + '\')" >' + disValue + '</a>';
				}
				if (state == -1) {
					clz = 'subSumHeader';
				}
				if (state == -2) clz = 'sumHeader';
				//				var condition = this.createColCondition(data[j], i);
				$(tr).append('<td class="' + clz + '" new="new" level="' + level + '" v="' + value + '" s="' + state + '">' + disValue + '</td>');
			}
			$(tr).appendTo($("#report_" + this.reportId + "_table_colHeader"));
		}
		$("#report_" + this.reportId + "_table_data td").css("word-break", "break-all").css("word-wrap", "break-word"); //处理内容过长引起的单元格错位	
		//设置单元格大小
		if (BrowserType() != "Firefox") {
			$("#report_" + this.reportId + "_table_colHeader td").css('border', 'solid 1px').width(this.reportConfig.colWidth).height(this.reportConfig.rowHeight);
		} else {
			var tds = $("#report_" + this.reportId + "_table_colHeader td");
			var padding = $(tds[0]).css("padding-left");
			var d_value = (parseInt(padding) + 1) * 2; //1为border的值
			$("#report_" + this.reportId + "_table_colHeader td").css('border', 'solid 1px').width(this.reportConfig.colWidth - d_value).height(this.reportConfig.rowHeight);
		}
		//添加样式：
		$("#report_" + this.reportId + "_table_colHeader .colHeader").css(this.reportConfig.css.colHeader);
		$("#report_" + this.reportId + "_table_colHeader .subSumHeader").css(this.reportConfig.css.subSumHeader);
		$("#report_" + this.reportId + "_table_colHeader .sumHeader").css(this.reportConfig.css.sumHeader);
		//合并单元格：
		_this.mergeColHeader();
		//添加事件：
		$(".colHeader").dblclick(function() {
			if ($(this).parent().index() < _this.reportConfig.colDims.length - 1) {
				if ($(this).attr("rowSpan") > 1 || data.length < _this.reportConfig.colDims.length) {
					_this.unfold($(this));
				} else {
					_this.fold($(this));
				}
			}
		});
	}

	/** 合并列表头单元格 */
	this.mergeColHeader = function() {
		//tableId:
		var tableId = "report_" + this.reportId + "_table_colHeader";

		//行数：
		var rowCount = $("#" + tableId + " tr").length;
		//列数：
		var colCount = $("#" + tableId + " tr").eq(0).children().length;

		//合并行：
		for (var i = 1; i <= colCount; i++) {
			mergeColHeaderRow(tableId, i);
		}

		//合并列：
		for (var i = 1; i <= rowCount; i++) {
			mergeColHeaderCol(tableId, i, colCount);
		}
	}

	/** 创建数据区单元格 */
	this.createData = function(data) {
		if (data == null || data == undefined || data.length == 0) return;

		//添加样式：
		var data1Style = this.getCellStyle(this.reportConfig.css.data1);
		var data2Style = this.getCellStyle(this.reportConfig.css.data2);
		var subSumHeader = this.getCellStyle(this.reportConfig.css.subSumHeader);
		var sumHeader = this.getCellStyle(this.reportConfig.css.sumHeader);

//		var rowHeaderSize = $("#report_" + this.reportId + "_table_rowHeader tr:nth(" + i + ")").children("td").size() - 1;
		for (var i = 0; i < data.length; i++) {
//			var rowTd = $("#report_" + this.reportId + "_table_rowHeader tr:nth(" + i + ") td:nth(0)");
			var rowTd = $("#report_" + this.reportId + "_table_rowHeader tr:nth(" + i + ") td[s='-1']");
			if(rowTd.length <= 0){
				rowTd = $("#report_" + this.reportId + "_table_rowHeader tr:nth(" + i + ") td[s='-2']");
			}
			var fieldName = _this.reportConfig.statFields[i % _this.reportConfig.statFields.length];
			var tr = $("<tr></tr>");
			for (var j = 0; j < data[i].length; j++) {
//				var colTd = $("#report_" + this.reportId + "_table_colHeader tr:nth(0) td:nth(" + j + ")");
				var colTd = null;
				for(var k=0; k<$("#report_" + this.reportId + "_table_colHeader tr").length; k++){
					colTd = $("#report_" + this.reportId + "_table_colHeader tr:nth("+ k +") td:nth(" + j + ")");
					if(colTd.attr("s") == "-1" || colTd.attr("s") == "-2")
						break;
				}
				var value = data[i][j].v;
				var fc = data[i][j].c; // 前景色
				var bc = data[i][j].bc; // 背景色
				var href = data[i][j].h; //超链接
				var hrefParams = data[i][j].hrefParams; //超链接参数
				var hrefTarget = htFormat(data[i][j].ht); //超链接弹出方式
				var disValue = data[i][j].fv;

				if (typeof(value) == "undefined" || value == null || value == "null") {
					value = "";
				}

				if (typeof(disValue) == "undefined" || disValue == null || disValue == "") {
					disValue = value;
				}
				var disValue_title = disValue;
				//				var styles=_this.reportConfig.fieldStyles[fieldName];
				//				if(typeof(styles)=="undefined"||styles==null||styles.length==0){
				style = i % 2 == 0 ? data1Style: data2Style;
				if ($(rowTd).hasClass("subSumHeader")) style = subSumHeader;
				if ($(rowTd).hasClass("sumHeader")) style = sumHeader;
				if ($(colTd).hasClass("subSumHeader") && style!=sumHeader) style = subSumHeader;
				if ($(colTd).hasClass("sumHeader")) style = sumHeader;
				

				//				}else{
				//					if($(rowTd).hasClass("subSumHeader"))
				//						style = styles[2];
				//					else if($(rowTd).hasClass("sumHeader"))
				//						style = styles[3];
				//					else style = i%2==0 ? styles[0] : styles[1];
				//				}
				//debugger;
				
				//onclick="dataHref(\'' + href + '\',\'' + hrefTarget + '\',\'' + hrefParams + '\',\'' + this.reportId + '\')"
				if (href=="drill" && value != "") {
					//disValue = '<a style="color:#008AE0;" href="javascript:void(0)"   >' + disValue + '</a>'; 
					//drill  
					//console.log("reportDefineId:"+base64.encode(_this.reportDefineId)+"&href:"+href+"&hrefTarget:"+hrefTarget+"&hrefParams:"+hrefParams+"&reportId:"+this.reportId);
					disValue = '<a style="color:#008AE0;" href="javascript:void(0)"  onclick="dataHref(\'' + href + '\',\'' + hrefTarget + '\',\'' + hrefParams + '\',\'' + this.reportId + '\')" >' + disValue + '</a>';
					//disValue = '<a style="color:#008AE0;" href="dataHref.jsp?hrefParams='+hrefParams+'&reportId='+this.reportId+'&hrefTarget='+hrefTarget+'&href='+href+'&reportDefineId='+base64.encode(_this.reportDefineId)+'  "   >' + disValue + '</a>';
				}else if (href=="nodrill" && value != "") {
					
				}else if (href && value != "") {
					disValue = '<a style="color:#008AE0;" href="javascript:void(0)"  onclick="dataHref(\'' + href + '\',\'' + hrefTarget + '\',\'' + hrefParams + '\',\'' + this.reportId + '\')" >' + disValue + '</a>';
				}
				style = ";overflow:hidden;border:solid 1px;" + style; //内容超出单元格长度后，隐藏显示
				var td = $('<td style="' + style + '" title="' + disValue_title + '">' + disValue + '</td>');
				if (fc) {
					$(td).css("color", fc);
					$(td).find("a").each(function(index, element) {
						$(element).css("color", fc);
					});
				}
				if (bc) {
					$(td).css("background-color", bc);
				}

				$(tr).append(td);
			}
			$(tr).appendTo($("#report_" + this.reportId + "_table_data"));
		}
		$("#report_" + this.reportId + "_table_data td").css("word-break", "break-all").css("word-wrap", "break-word"); //处理单元格中内容过长引起的错位
		if (BrowserType() != "Firefox") { //火狐修正
			$("#report_" + this.reportId + "_table_data td").width(this.reportConfig.colWidth).height(this.reportConfig.rowHeight);
		} else {
			var tds = $("#report_" + this.reportId + "_table_data td");
			var padding = $(tds[0]).css("padding-left");
			var d_value = (parseInt(padding) + 1) * 2; //1为border的值
			$("#report_" + this.reportId + "_table_data td").width(this.reportConfig.colWidth - d_value).height(this.reportConfig.rowHeight);
		}
	}

	/** 折叠 */
	this.fold = function(td) {
		var clz = $(td).attr('class'); //维度类型：rowHeader或colHeader
		//		var condition = $(td).attr('condition');//维度条件
		var level = parseInt($(td).attr('level')); //维度级别
		//		confirm($(td).attr("colSpan"))
		var dimValue = $(td).attr('v');
		var no = 0;
		if (clz == 'rowHeader') no = Math.ceil(this.verticalScrollTop / this.reportConfig.rowHeight) + this.getNo($(td)); //行号或列号
		else if (clz == 'colHeader') no = Math.ceil(this.horizontalScrollLeft / this.reportConfig.colWidth) + this.getNo($(td)); //行号或列号
		loading();
		$.ajax({
			type: "POST",
			url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=6"),
			cache: false,
			async: true,
			data: {
				"level": level,
				"resID": base64.encode(_this.reportId),
				"reportDefineId": base64.encode(_this.reportDefineId),
				"serverPath": base64.encode(_this.serverPath),
				"clz": clz,
				"dimValue": dimValue
			},
			dataType: "json",
			success: function(data) {
				closeFile();
				if (data.state == 500) {
					confirm(data.message);
					return;
				}
				//更新表格数据：
				//				_this.initTable();
				_this.initPageCount();
			},
			error: function() {
				$this.trigger({
					type: 'error',
					opt: '获取数据'
				});
			}
		});
	}

	/** 数据表格生成完成 */
	this.createDataCompleteHandler = function(evt) {
		//添加样式：
		//公用样式：
		$("td[new='new'].corner, td[new='new'].rowHeader, td[new='new'].colHeader, td[new='new'].data1, td[new='new'].data2, td[new='new'].subSumHeader, td[new='new'].sumHeader").css('border', 'solid 1px').width(this.reportConfig.colWidth).height(this.reportConfig.rowHeight);
		//配置文件中样式：
		$("td[new='new'].corner").css(this.reportConfig.css.corner);
		$("td[new='new'].rowHeader").css(this.reportConfig.css.rowHeader);
		$("td[new='new'].colHeader").css(this.reportConfig.css.colHeader);
		$("td[new='new'].data1").css(this.reportConfig.css.data1);
		$("td[new='new'].data2").css(this.reportConfig.css.data2);
		$("td[new='new'].subSumHeader").css(this.reportConfig.css.subSumHeader);
		$("td[new='new'].sumHeader").css(this.reportConfig.css.sumHeader);

		//rowHeader colHeader 添加双击事件：
		$("td[new='new'].rowHeader, td[new='new'].colHeader").dblclick(function() {
			if ($(this).attr('s') == 0) //折叠状态，双击展开
			_this.unfold($(this));
			else if ($(this).attr('s') == 1) //展开状态：双击折叠
			_this.fold($(this));
		});

		$("td[new='new']").attr("new", "");

		//在处理完报表样式后为交叉表头画斜线
		this.line(table_corner.offsetLeft, table_corner.offsetTop, table_corner.offsetWidth, table_corner.offsetHeight, cornerType);
	}

	/** 错误处理 */
	this.errorHandler = function(evt) {
		alert(evt.opt + "发生错误！");
	}

	/** 展开 */
	this.unfold = function(td) {
		var clz = $(td).attr('class'); //维度类型：rowHeader或colHeader
		//		var condition = $(td).attr('condition');//维度条件
		var level = parseInt($(td).attr('level')); //维度级别
		var dimValue = $(td).attr('v');
		var no = 0;
		if (clz == 'rowHeader') no = Math.ceil(this.verticalScrollTop / this.reportConfig.rowHeight) + this.getNo($(td)); //行号或列号
		else if (clz == 'colHeader') no = Math.ceil(this.horizontalScrollLeft / this.reportConfig.colWidth) + this.getNo($(td)); //行号或列号
		//		confirm(clz + ":" + level + "," + no + "," + condition);
		loading();
		$.ajax({
			type: "POST",
			url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=5"),
			cache: false,
			async: true,
			data: {
				"resID": base64.encode(_this.reportId),
				"reportDefineId": base64.encode(_this.reportDefineId),
				"serverPath": base64.encode(_this.serverPath),
				"clz": clz,
				"level": level,
				"dimValue": dimValue
			},
			dataType: "json",
			success: function(data) {
				closeFile();
				if (data.state == 500) {
					confirm(data.message);
					return;
				}
				//更新表格数据：
				_this.initPageCount();
			},
			error: function() {
				$this.trigger({
					type: 'error',
					opt: '获取数据'
				});
			}
		});
	}

	/** 获得行号或列号 */
	this.getNo = function(td) {
		if ($(td).hasClass('rowHeader')) {
			//行维度值，获得行索引：
			return $(td).parent().index();
		} else if ($(td).hasClass('colHeader')) {
			//列维度值，获得列索引：
			return $(td).index();
		} else {
			return 0;
		}
	}

	/** 更新表格数据 */
	this.updateTableData = function(json) {
		//用data替换begin~begin+count行（或列）数据：
		var begin = json.begin;
		var count = json.count;
		var rowData = json.rowData;
		var colData = json.colData;
		var data = json.data;

		this.insertRowData(rowData, data, begin, count);
		this.insertColData(colData, data, begin, count);

		// 调用回调函数：
		$this.trigger('createDataComplete');
	}

	/** 插入行维度值、数据行 */
	this.insertRowData = function(rowData, data, begin, count) {
		if (rowData == null || rowData == undefined || rowData.length == 0) return;
		if (data == null || data == undefined || data.length == 0) return;

		//插入新数据：
		var targetDimRow = $("#report_" + this.reportId + "_table_rowHeader tr:nth(" + begin + ")");
		var targetDataRow = $("#report_" + this.reportId + "_table_data tr:nth(" + begin + ")");
		for (var i = 0; i < rowData.length; i++) {
			var dimTr = $("<tr></tr>");
			for (var j = 0; j < rowData[i].length; j++) {
				var clz = 'rowHeader';
				var level = j;
				var value = rowData[i][j].v;
				var state = rowData[i][j].s;
				var disValue = value;

				$(dimTr).append('<td class="' + clz + '" new="new" level="' + level + '" v="' + value + '" s="' + state + '">' + disValue + '</td>');
			}
			$(dimTr).insertBefore(targetDimRow);

			var dataTr = $("<tr></tr>");
			for (var j = 0; j < data[i].length; j++) {
				var clz = 'data' + (i % 2 + 1);
				var value = data[i][j].v;
				var disValue = value;
				$(dataTr).append('<td class="' + clz + '" new="new">' + disValue + '</td>');
			}
			$(dataTr).insertBefore(targetDataRow);

			begin++;
		}

		//删除begin~begin+count行数据：
		for (var i = 0; i < count; i++) {
			$("#report_" + this.reportId + "_table_rowHeader tr").eq(begin).remove();
			$("#report_" + this.reportId + "_table_data tr").eq(begin).remove();
		}

		// TODO 合并单元格
	}

	/** 插入列维度值、数据列 */
	this.insertColData = function(colData, data, begin, count) {
		if (colData == null || colData == undefined || colData.length == 0) return;
		if (data == null || data == undefined || data.length == 0) return;

		//插入新数据：
		for (var i = 0; i < colData[0].length; i++) {
			var targetDimCol = $("#report_" + this.reportId + "_table_colHeader tr:nth(" + i + ") td:nth(" + begin + ")");
			var clz = 'colHeader';
			var level = i;
			for (var j = 0; j < colData.length; j++) {
				var value = colData[j][i].v;
				var state = colData[j][i].s;
				var disValue = value;
				var area = colData[j][i].a;
				$('<td class="' + clz + '" new="new" level="' + level + '" v="' + value + '" s="' + state + '">' + disValue + '</td>').insertBefore(targetDimCol);
			}
			//删除begin~begin+count列数据：
			for (var c = 0; c < count; c++) {
				$("#report_" + this.reportId + "_table_colHeader tr:nth(" + i + ") td:nth(" + (begin + colData.length) + ")").remove();
			}
		}

		for (var i = 0; i < data.length; i++) {
			var targetDataCol = $("#report_" + this.reportId + "_table_data tr:nth(" + i + ") td:nth(" + begin + ")");
			var clz = 'data' + (i % 2 + 1);
			for (var j = 0; j < data[i].length; j++) {
				var value = data[i][j].v;
				var disValue = value;
				$('<td class="' + clz + '" new="new">' + disValue + '</td>').insertBefore(targetDataCol);
			}
			//删除begin~begin+count列数据：
			for (var c = 0; c < count; c++) {
				$("#report_" + this.reportId + "_table_data tr:nth(" + i + ") td:nth(" + (begin + data[0].length) + ")").remove();
			}
		}

		// TODO 合并单元格
	}

	/** 创建行维度查询条件 */
	this.createRowCondition = function(row, level) {
		var condition = "";
		for (var k = 0; k <= level; k++) {
			condition += this.reportConfig.rowDims[k] + "=" + row[k].v;
			if (k < level) condition += "&"
		}
		return condition;
	}

	/** 创建列维度查询条件 */
	this.createColCondition = function(row, level) {
		var condition = "";
		for (var k = 0; k <= level; k++) {
			condition += this.reportConfig.colDims[k] + "=" + row[k].v;
			if (k < level) condition += "&"
		}
		return condition;
	}

	/** 初始化工具条 */
	this.initToolbar = function() {
		//交叉报表：
		$('#pageOperators').hide();
		//$("#clear").hide();
		//清除缓存按钮事件
		$("#clear").click(function() {
			$.ajax({
				type: "POST",
				url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=7"),
				cache: false,
				async: true,
				data: {
					"resID": base64.encode(_this.reportId),
					"reportDefineId": base64.encode(_this.reportDefineId),
					"serverPath": base64.encode(_this.serverPath)
				},
				dataType: "json",
				success: function(data) {
					if (data.error == false) {
						alert('清除缓存完成！');
					} else {
						alert('清除缓存失败！');
					}
				},
				error: function() {
					$this.trigger({
						type: 'error',
						opt: '获取数据'
					});
				}
			});
		});

		//导出：
		$('#exportWord').unbind("click");
		$('#exportWord').click(function() {
			_this.save('word', false);
		});
		$('#exportExcel').unbind("click");
		$('#exportExcel').click(function() {
			var isDA = false; //由于数据分析处导出名称特殊，此处做下判断
			var daName = "";
			var imageSrcId = base64.encode(_this.reportId); //由于交叉分析中图片名如果使用报表名找不到图片，所以这里使用reportId
			if (typeof isFromDataAnalysis != undefined && typeof exportDAName != undefined && isFromDataAnalysis == "true" && exportDAName != "") {
				isDA = true;
				daName = exportDAName;
			}
			var url = PathUtils.getRelativeUrl("/ExportServlet?action=8&resID=" + base64.encode(isDA ? daName: _this.reportId) + "&reportDefineId=" + base64.encode(_this.reportDefineId) + "&perPageCount=" + _this.perPageCount + "&object=pivot&format=excel&remote=false&imageSrcId=" + imageSrcId);
			showDialog(PathUtils.getRelativeUrl('/mis2/vrsr/show/excelPageStyle.jsp?url=' + base64.encode(url)), "exportExcel", "Excel导出格式设置", 180, 280, null, null, null, null);
			//_this.save('excel', false);
		});
		$('#exportPdf').unbind("click");
		$('#exportPdf').click(function() {
			_this.save('pdf', false);
		});
		$('#exportText').unbind("click");
		$('#exportText').click(function() {
			_this.save('text', false);
		});
		$('#remoteWord').unbind("click");
		$('#exportCsv').click(function() {
			_this.save('csv', false);
		});

		//远程导出：
		$('#remoteWord').unbind("click");
		$('#remoteWord').click(function() {
			_this.save('word', true);
		});
		$('#remoteExcel').unbind("click");
		$('#remoteExcel').click(function() {
			_this.save('excel', true);
		});
		$('#remotePdf').unbind("click");
		$('#remotePdf').click(function() {
			_this.save('pdf', true);
		});
		$('#remoteText').unbind("click");
		$('#remoteText').click(function() {
			_this.save('text', true);
		});
		$('#remoteCsv').unbind("click");
		$('#remoteCsv').click(function() {
			_this.save('csv', true);
		});
		$('#print').unbind("click");
		/** 打印 */
		$('#print').click(function() {
			var operationMessage = "打印交叉报表'" + _this.reportName + "'";
			var operationJson = "{\"resId\":\"" + _this.reportId + "\"}";
			var operationTag = "报表#打印";
			recordUtils(operationModule, operationMessage, otherId, userId, operationJson, operationTag);
			//计算报表：
			loading();
			$.ajax({
				type: "POST",
				url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=10"),
				cache: false,
				async: true,
				data: {
					"resID": base64.encode(_this.reportId),
					"reportDefineId": base64.encode(_this.reportDefineId),
					"serverPath": base64.encode(_this.serverPath)
				},
				dataType: "json",
				success: function(data) {
					closeFile();
					var appleturl = PathUtils.getRelativeUrl("/reportServlet?action=2&name=" + _this.reportId + "&reportFileName=" + _this.reportId + "&srcType=defineBean&savePrintSetup=no&appletJarName=mis2/download/runqianReport4Applet.jar,mis2/download/dmGraphApplet.jar&serverPagedPrint=no&mirror=no&reportParamsId=undefined&cachedId=" + data.cacheId + "&t_i_m_e=" + new Date().getTime());
					$("#hiddenFrame").html('<iframe src="' + appleturl + '" height="10" width="30"></iframe>');
				},
				error: function() {
					$this.trigger({
						type: 'error',
						opt: '获取数据'
					});
				}
			});
		});

		//刷新按钮事件
		$('#refresh').click(function() {
			//清除缓存
			$.ajax({
				type: "POST",
				url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=7"),
				cache: false,
				async: true,
				data: {
					"resID": base64.encode(_this.reportId),
					"reportDefineId": base64.encode(_this.reportDefineId),
					"serverPath": base64.encode(_this.serverPath)
				},
				dataType: "json",
				success: function(data) {
					if (data.error == false) {
						window.location.reload(true);
					} else {
						alert('清除缓存失败！');
					}
				},
				error: function() {
					$this.trigger({
						type: 'error',
						opt: '清除缓存'
					});
				}
			});
		});

		$("#subreport").click(function() {
			subscribeModuleEntry(_this.reportId);
			//window.open(PathUtils.getRelativeUrl("/mis2/eds_subscribe/sub_create.jsp?resID="+ _this.reportId));
		});

		$("#showGraph").click(function() {
			_this.toolBarShowGraph(); //处理统计
		});

		$("#basicSet").click(function() {
			var  wid = 410;
			var  height = 200;
			var url=PathUtils.getRelativeJspUrl("/fastReport/analysis/crossWholeSet.jsp?analysisLayout=fast&reportDefineId="+reportDefineId+"&resType=14&fromWhere=showPivotReport");
			showDialog(url,"groupWhole","整体设置",height,wid,null, null, null, null, null, null,null,true,null,false);
		});
		$("#printSet").click(function() {
			var swfNameAndPath = "fastReport/analysis/swf/SetPrintInfo.swf";
			var url=PathUtils.getAbsoluteJspUrl("fastReport/analysis/testPopUp.jsp?appName="+swfNameAndPath+"&reportDefineId="+reportDefineId+"&resType=14&dataAnalyseId=");
			// var wid = 472; //+16为弹出层中作了居中处理后，导致的右侧缺失，所以补充16像素
			var wid = 456;
			var height = 320;
			showDialog(url,"swfWindow","打印设置",height,wid,null, null, null, null, null, null,null,true,null,false);
		});
	}

	/** 导出：format-导出格式，remote-是否是远程导出 */
	this.save = function(format, remote) {
		var isDA = false; //由于数据分析处导出名称特殊，此处做下判断
		var daName = "";
		var imageSrcId = base64.encode(_this.reportId); //由于交叉分析中图片名如果使用报表名找不到图片，所以这里使用reportId
		if (typeof isFromDataAnalysis != undefined && typeof exportDAName != undefined && isFromDataAnalysis == "true" && exportDAName != "") {
			isDA = true;
			daName = exportDAName;
		}
		//alert(format + ", " + remote);
		//交叉报表
		if (!remote) {
			var operationMessage = "本地导出交叉报表'" + _this.reportName + "'为" + format;
			var operationJson = "{\"resId\":\"" + _this.reportId + "\"}";
			var operationTag = "报表#导出";
			recordUtils(operationModule, operationMessage, otherId, userId, operationJson, operationTag);
			//本地导出：
			//var url = PathUtils.getRelativeUrl("/ExportServlet?action=8&resID=" + base64.encode(isDA ? daName: _this.reportId) + "&reportDefineId=" + base64.encode(_this.reportDefineId) + "&perPageCount=" + _this.perPageCount + "&object=pivot&format=" + format + "&remote=" + remote + "&imageSrcId=" + imageSrcId);
			//$("#hiddenFrame").html('<iframe src="' + url + '" height="0" width="0"></iframe>');
			var graphImage = exportImg();
			var params ={"action":"8","resID": base64.encode(isDA ? daName: _this.reportId),"reportDefineId":base64.encode(_this.reportDefineId),"perPageCount":_this.perPageCount,"object":"pivot","format":format,"remote":remote,"imageSrcId":imageSrcId,"time":new Date().getTime(),"graphImage":graphImage};
			$("#hiddenFrame").html('<iframe src="" id="saveAsFrame" name="saveAsFrame" height="0" width="0"></iframe>');
			postSubmit(PathUtils.getRelativeUrl("/ExportServlet"),params,"saveAsFrame");
		} else {
			loading();
			//远程导出：
			//$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showPivotReportServlet?action=9"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId), "perPageCount":_this.perPageCount, "format":format, "remote":remote}, dataType:"json", 
			var graphImage = exportImg();
			$.ajax({
				type: "POST",
				url: PathUtils.getRelativeUrl("/ExportServlet?action=9"),
				cache: false,
				async: true,
				data: {
					"resID": base64.encode(isDA ? daName: _this.reportId),
					"reportDefineId": base64.encode(_this.reportDefineId),
					"perPageCount": _this.perPageCount,
					"object": "pivot",
					"format": format,
					"remote": remote,
					"graphImage":graphImage
				},
				dataType: "json",
				success: function(data) {
					closeFile();
					if (data.result == 'success') {
						alert('导出成功！文件路径：' + data.remoteExportDir);
						var operationMessage = "远程导出交叉报表'" + _this.reportName + "'为" + format;
						var operationJson = "{\"resId\":\"" + _this.reportId + "\",\"文件路径\":\"" + data.remoteExportDir + "\"}";
						var operationTag = "报表#导出";
						recordUtils(operationModule, operationMessage, otherId, userId, operationJson, operationTag);
					} else {
						alert('导出失败！');
					}
				},
				error: function() {
					$this.trigger({
						type: 'error',
						opt: '获取数据'
					});
				}
			});
		}
	}

	/** 根据JSON生成样式字符串 TODO 改为后台拼 */
	this.getCellStyle = function(css) {
//		var r = "width:" + this.reportConfig.colWidth + ";" + "height:" + this.reportConfig.rowHeight + ";";
//
//		if (css.fontFamily) r += "font-family:" + css.fontFamily + ";";
//		if (css.fontSize) r += "font-size:" + css.fontSize + ";";
//		if (css.color) r += "color:" + css.color + ";";
//		if (css.fontWeight) r += "font-weight:" + css.fontWeight + ";";
//		if (css.fontStyle) r += "font-style:" + css.fontStyle + ";";
//		if (css.textDecoration) r += "text-decoration:" + css.textDecoration + ";";
//		if (css.textAlign) r += "text-align:" + css.textAlign + ";";
//		if (css.verticalAlign) r += "vertical-align:" + css.verticalAlign + ";";
//		if (css.paddingLeft) r += "padding-left:" + css.paddingLeft + ";";
//		if (css.paddingRight) r += "padding-right:" + css.paddingRight + ";";
//		if (css.paddingTop) r += "padding-top:" + css.paddingTop + ";";
//		if (css.paddingBottom) r += "padding-bottom:" + css.paddingBottom + ";";
//		if (css.backgroundColor) r += "background-color:" + css.backgroundColor + ";";
//		if (css.borderColor) r += "border: solid 1px " + css.borderColor + ";";
//		if (css.indent) r += "indent:" + css.indent + ";";
//		return r;
		
		var r = "";
		for(prop in css){
			var style = prop.replace(/([A-Z])/g, function(c){
				return "-" + c.toLowerCase();
			})
			var value = css[prop];
			r += style + ":" + value + ";";
		}
		return r;
	}
	//清除缓存
	this.deleteReportCache = function(data) {
		$.ajax({
			type: "POST",
			url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=7"),
			cache: false,
			async: true,
			data: {
				"resID": base64.encode(_this.reportId),
				"reportDefineId": base64.encode(_this.reportDefineId),
				"serverPath": base64.encode(_this.serverPath)
			},
			dataType: "json",
			success: function(data) {},
			error: function() {}
		});
	}

	/** 为表头画斜线*/
	this.line = function(x, y, w, h, type) {
		//修改表头样式
		$("#colDims").css({
			"border-bottom": "0px solid",
			"border-left": "0px solid",
			"valign": "right"
		});
		$("#rowDims").css({
			"border-top": "0px solid",
			"border-right": "0px solid",
			"valign": "left"
		});
		$("#stats").css({
			"border-left": "0px solid",
			"border-top": "0px solid",
			"valign": "right"
		});
		$("#empt").css("border", "0px solid");
		//斜线所在DIV，使其悬浮在表头
		var lineDiv = $('<div style="position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;heigth:' + h + 'px"></div>');
		if (type == 1) {
			lineDiv.append('<v:line strokecolor="black" strokeweight="1px" from="' + x + ',' + y + '" to="' + (x + w) + 'px,' + (y + h) + 'px" ></v:line> ');
		} else {
			lineDiv.append('<v:line strokecolor="black" strokeweight="1px" from="' + x + ',' + y + '" to="' + (x + w / 2) + 'px,' + (y + h) + 'px" ></v:line> ' + '<v:line strokecolor="black" strokeweight="1px" from="' + x + '","' + y + '" to="' + (x + w) + 'px,' + (y + h / 2) + 'px"></v:line>');
		}
		lineDiv.appendTo($('#tableDiv'));
	}

};
/**
* 展现界面的字段排序
*/
function sortSet(){
	var ajax = new AjaxUtil();
	var url = PathUtils
			.getRelativeUrl("/showPivotReportServlet?action=13&resID="
					+ base64.encode(this.reportID)+"&reportDefineId="+base64.encode(this.reportDefineId));
	 ajax.sendAjax(url,"",function(data){
         if(data.state != "500"){
			//获得字段设置信息
			var fieldInfo = data.fieldInfo;
			if(fieldInfo =="" ) return ;
			var base64=new Base64();
			fieldInfo = base64.encode(fieldInfo);
			var swfNameAndPath;
			var wid = 436; //+16为弹出层中作了居中处理后，导致的右侧缺失，所以补充16像素
			var height = 391;
			swfNameAndPath = "fastReport/analysis/swf/PivotSetSortPriority.swf";
			var url=PathUtils.getAbsoluteJspUrl("fastReport/analysis/testPopUp.jsp?appName="+swfNameAndPath+"&params="+fieldInfo+"&reportDefineId="+reportDefineId+"&resType=14&dataAnalyseId=''");
			showDialog(url,"swfWindow","排序设置",height,wid,null, null, null, true, null, null,null,true,null,false);
		 }
     },function(a,b,e){
         alert(e);
     });
}
/**
* 点击关闭flex回调此函数
*/
function closeSwfWindow(backParams){
	var base64 = new Base64();
	var replaceStr = JSON.parse(base64.decode(backParams));
			if(replaceStr['sortInfo']){
				var ajax = new AjaxUtil();
				var url = PathUtils
					.getRelativeUrl("/showPivotReportServlet?action=14&resID="
					+ base64.encode(this.reportID)+"&reportDefineId="+base64.encode(this.reportDefineId)+"&sortInfo="+backParams);
				ajax.sendAjax(url,"",function(data){
					if(data.state != "500"){
					}
				},function(a,b,e){
					alert(e);
				});
			}
	closeDialog("swfWindow");
}

/** 交叉报表合并行 */
function mergeRow(tableId, colno) {
	var firstTd = "";
	var currentTd = "";
	var spanNum = 0;
	$("#" + tableId + " tr td:nth-child(" + colno + ")").each(function(i) {
		if (i == 0) {
			firstTd = this;
			spanNum = 1;
		} else {
			currentTd = this;
			if ($.trim($(currentTd).text()) == '' || $(firstTd).attr('level') == $(currentTd).attr('level') && $(firstTd).text() == $(currentTd).text()) {
				spanNum++;
				var height = 0;
				if ($(firstTd).attr('offsetHeight')) {
					height = $(firstTd).attr('offsetHeight') + $(currentTd).attr('offsetHeight');
				} else {
					height = $(firstTd).height() + parseInt($(firstTd).css("border-bottom-width")) + $(currentTd).height() + parseInt($(currentTd).css("border-top-width"));
				}
				$(firstTd).height(height); //.height($(firstTd).height() + $(currentTd).height());//
				$(currentTd).hide(); //remove();
				$(firstTd).attr("rowSpan", spanNum);
			} else {
				firstTd = this;
				spanNum = 1;
			}
		}
	});
}

/**
 * 纵向合并行维度
 * @param tableId
 * @param colno
 */
function mergeRowHeaderRow(tableId, colno) {
	var firstTd = "";
	var currentTd = "";
	var spanNum = 0;
	$("#" + tableId + " tr td:nth-child(" + colno + ")").each(function(i) {
		if (i == 0) {
			firstTd = this;
			spanNum = 1;
		} else {
			currentTd = this;
			if ($(firstTd).text() == $(currentTd).text()) {
				spanNum++;
				var height = 0;
				if ($(firstTd).attr('offsetHeight')) {
					height = $(firstTd).attr('offsetHeight') + $(currentTd).attr('offsetHeight');
				} else {
					height = $(firstTd).height() + parseInt($(firstTd).css("border-bottom-width")) + $(currentTd).height() + parseInt($(currentTd).css("border-top-width"));
				}
				$(firstTd).height(height); //.height($(firstTd).height() + $(currentTd).height());//
				$(currentTd).hide(); //remove();
				$(firstTd).attr("rowSpan", spanNum);
			} else {
				firstTd = this;
				spanNum = 1;
			}
		}
	});
}

/**
 * 纵向合并列维度
 * @param tableId
 * @param colno
 */
function mergeColHeaderRow(tableId, colno) {
	var firstTd = "";
	var currentTd = "";
	var spanNum = 0;
	$("#" + tableId + " tr td:nth-child(" + colno + ")").each(function(i) {
		if (i == 0) {
			firstTd = this;
			spanNum = 1;
		} else {
			currentTd = this;
			if ($.trim($(currentTd).text()) == '') {
				spanNum++;
				var height = $(firstTd).attr('offsetHeight') + $(currentTd).attr('offsetHeight');
				$(firstTd).height(height); //.height($(firstTd).height() + $(currentTd).height());//
				$(currentTd).hide(); //remove();
				$(firstTd).attr("rowSpan", spanNum);
			} else {
				firstTd = this;
				spanNum = 1;
			}
		}
	});
}

/** 交叉报表列合并 */
function mergeCol(tableId, rownum, maxcolnum) {
	if (maxcolnum == void 0) maxcolnum = 0;
	var firstTd = "";
	var currentTd = "";
	var spanNum = 0;
	$("#" + tableId + " tr:nth-child(" + rownum + ")").each(function(i) {
		$(this).children().each(function(i) {
			if (i == 0) {
				firstTd = this;
				spanNum = 1;
			} else if ((maxcolnum > 0) && (i > maxcolnum)) {
				return "";
			} else {
				currentTd = this;
				if ($.trim($(currentTd).text()) == '' || $(firstTd).attr('level') == $(currentTd).attr('level') && $(firstTd).text() == $(currentTd).text()) {
					spanNum++;
					var width = 0;
					if ($(firstTd).attr('offsetWidth')) {
						width = $(firstTd).attr('offsetWidth') + $(currentTd).attr('offsetWidth');
					} else {
						width = $(firstTd).width() + parseInt($(firstTd).css("border-right-width")) + $(currentTd).width() + parseInt($(currentTd).css("border-left-width"));
					}
					$(firstTd).width(width);
					$(firstTd).attr("colSpan", spanNum);
					$(currentTd).hide(); //remove(); 
				} else {
					firstTd = this;
					spanNum = 1;
				}
			}
		});
	});
}

/**
 * 横向合并行维度值
 * @param tableId
 * @param rownum
 * @param maxcolnum
 */
function mergeRowHeaderCol(tableId, rownum, maxcolnum) {
	if (maxcolnum == void 0) maxcolnum = 0;
	var firstTd = "";
	var currentTd = "";
	var spanNum = 0;
	$("#" + tableId + " tr:nth-child(" + rownum + ")").each(function(i) {
		$(this).children().each(function(i) {
			if (i == 0) {
				firstTd = this;
				spanNum = 1;
			} else if ((maxcolnum > 0) && (i > maxcolnum)) {
				return "";
			} else {
				currentTd = this;
				if ($.trim($(currentTd).text()) == '') {
					spanNum++;
					var width = 0;
					if ($(firstTd).attr('offsetWidth')) {
						width = $(firstTd).attr('offsetWidth') + $(currentTd).attr('offsetWidth');
					} else {
						width = $(firstTd).width() + parseInt($(firstTd).css("border-right-width")) + $(currentTd).width() + parseInt($(currentTd).css("border-left-width"));
					}
					$(firstTd).width(width);
					$(firstTd).attr("colSpan", spanNum);
					$(currentTd).hide(); //remove(); 
				} else {
					firstTd = this;
					spanNum = 1;
				}
			}
		});
	});
}

/**
 * 横向合并列维度值
 * @param tableId
 * @param rownum
 * @param maxcolnum
 */
function mergeColHeaderCol(tableId, rownum, maxcolnum) {
	if (maxcolnum == void 0) maxcolnum = 0;
	var firstTd = "";
	var currentTd = "";
	var spanNum = 0;
	$("#" + tableId + " tr:nth-child(" + rownum + ")").each(function(i) {
		$(this).children().each(function(i) {
			if (i == 0) {
				firstTd = this;
				spanNum = 1;
			} else if ((maxcolnum > 0) && (i > maxcolnum)) {
				return "";
			} else {
				currentTd = this;
				if ($(currentTd).text() == $(firstTd).text()) {
					spanNum++;
					$(firstTd).width($(firstTd).attr('offsetWidth') + $(currentTd).attr('offsetWidth'));
					$(firstTd).attr("colSpan", spanNum);
					$(currentTd).hide(); //remove(); 
				} else {
					firstTd = this;
					spanNum = 1;
				}
			}
		});
	});
}

//处理表头数据(两行两列table)和画斜线
function drawCorner(o, textArr) {
	$(o).html('');
	var x = $(o).attr('clientTop');
	var y = $(o).attr('clientLeft');
	var w = $(o).width();
	var h = $(o).height();
	//	confirm(x + "," + y + "," + w + "," + h);
	var table = $('<table  style="border:0px solid;border-collapse: collapse" width="' + w + 'px" height="' + h + 'px" cellpadding="0" cellspacing="0" ></table>');
	var tr1 = $('<tr style="border:0px solid"></tr>');
	var tr2 = $('<tr style="border:0px solid"></tr>');
	var td0, td1, td2, td3, line1, line2;
	if (textArr.length == 2) {
		//第一行
		td0 = $('<td style="border:0px solid"></td>');
		td1 = $('<td style="border:0px solid;font-size:10px" valign="top" align=right>' + textArr[1] + '</td>');
		//第二行
		td2 = $('<td style="border:0px solid;font-size:10px" valign="bottom" align=left>' + textArr[0] + '</td>');
		td3 = $('<td style="border:0px solid;"></td>');

		line1 = $('<v:line strokecolor="black" strokeweight="1px" style="position:absolute;left=' + x + 'px;top=' + y + 'px;" to="' + w + ',' + h + '" ></v:line> ');
	} else if (textArr.length == 3) {
		//第一行
		td0 = $('<td style="border:0px solid"></td>');
		td1 = $('<td style="border:0px solid;font-size:10px" valign="top" align=right>' + textArr[1] + '</td>');
		//第二行
		td2 = $('<td style="border:0px solid;font-size:10px" valign="bottom" align=left>' + textArr[0] + '</td>');
		td3 = $('<td style="border:0px solid;font-size:10px" valign="bottom"  align=right>' + textArr[2] + '</td>');

		line1 = $('<v:line strokecolor="black" strokeweight="1px" style="position:absolute;left=' + x + 'px;top=' + y + 'px;" to="' + (w * 0.6) + ',' + h + '" ></v:line> ');
		line2 = $('<v:line strokecolor="black" strokeweight="1px" style="position:absolute;left=' + x + 'px;top=' + y + 'px;" to="' + w + ',' + (h * 0.6) + '" ></v:line> ');
	}

	tr1.append(td0);
	tr1.append(td1);
	tr2.append(td2);
	tr2.append(td3);
	table.append(tr1);
	table.append(tr2);
	table.appendTo(o);
	line1.appendTo(o);
	if (line2) line2.appendTo(o);
}

/** 
处理超链接弹出方式
0=_self;1=_blank;2=_top
 */
function htFormat(ht) {
	if (ht == "0") {
		return "_self";
	}
	if (ht == "1") {
		return "_blank";
	}
	if (ht == "2") {
		return "_top";
	}
	//return "_blank";
	return ht;
}

//获取钻取报表xml并保存，返回schemaId，跳转到sr页面
function saveDrillXml(hrefParams, reportId) {
	var hrefForm = document.createElement("form");
	document.body.appendChild(hrefForm);
	hrefForm.method = "POST";
	var genXmlParam = "";
	var paramObj = eval("(" + base64.decode(hrefParams) + ")");
	for (var c in paramObj) { //遍历
		genXmlParam = genXmlParam + c + ":" + paramObj[c] + ";"
	}
	$.ajax({
		type: "POST",
		url: PathUtils.getRelativeUrl("/showPivotReportServlet?action=12"),
		async: true,
		cache: false,
		data: {
			"resID": base64.encode(reportId),
			"reportDefineId": base64.encode(_this.reportDefineId),
			"hrefParam": base64.encode(genXmlParam)
		},
		dataType: "json",
		success: function(data) {
			//confirm(data);
			addInput(hrefForm, "schemaId", data);
			hrefForm.action = "../showReport1.jsp";
			hrefForm.target = "_blank";
			hrefForm.submit();
			$(hrefForm).remove();
		},
		error: function() {
			confirm("钻取报表失败");
		}
	});
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

function saveToExcel(url, excelFormat) {
	var graphImage = exportImg();
	var params ={"excelFormat":excelFormat,"time":new Date().getTime(),"graphImage":graphImage};
	$("#hiddenFrame").html('<iframe src="" id="saveAsFrame" name="saveAsFrame" height="0" width="0"></iframe>');
	postSubmit( base64.decode(url),params,"saveAsFrame");

	//url = base64.decode(url) + "&excelFormat=" + excelFormat + "&time=" + new Date().getTime();
	//$("#hiddenFrame").html('<iframe src="' + url + '" height="0" width="0"></iframe>');
}

/**
 * 寻找homeContent对应的窗口对象
 */
function getHomeContentWindow1(win) {
	if (win.location.href.indexOf("homeContent.jsp") != -1 || win == top) {
		return win;
	} else if (typeof(moduleName) != "undefined" && moduleName == "favorit") {
		return window.parent.frames[1];
	} else {
		return getHomeContentWindow(win.parent);
	}
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
