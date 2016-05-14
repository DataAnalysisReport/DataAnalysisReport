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
var ReportViewer = function (contextPath, reportId, filePath, target, currPage, perPageCount, reportType, query, params, callback) {
  		//属性：
  	this.contextPath = contextPath; // 系统URL
  	this.reportId = reportId; // 报表ID
  	this.filePath = filePath; // 报表配置文件路径
  	this.target = target; // 报表区域节点元素
	this.currPage = currPage; // 当前页码
	this.perPageCount = parseInt(perPageCount); // 每页显示记录数 
	this.reportType = reportType; // 报表类型
	this.query = query; // 通用查询JSON串
	this.params = params; // 数据集参数
	this.callback = callback; // 回调函数（数据表格加载完成后执行）
		
	this.reportInfo = null; // 报表信息
	this.reportRowCount = 0; // 报表行数
	this.pageCount = 0; // 总页数
	
	this.cachePageCount = 3; // 缓存数组存放的页数
	this.maxRowCount = this.cachePageCount * perPageCount; // 最大行数
	this.cache = new CacheData(this.maxRowCount, perPageCount); // 缓存数组
	this.totalData = null; // 总计行数据
	
	this.graphData = null;//统计图数据
	
	var base64 = new Base64();
	
	var _this = this;
	var $this = $(this);
	
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
		this.initGraphDiv();
		
		// 3 初始化报表信息：title, foot, css, ...
		this.initReportInfo();
		
		return this;
	}

	/** 初始化页面表格 */
	this.initTable = function(){
		$('#tableDiv').html('');
		if(this.reportType == 'fast'){
			//var div = $('<div id="tableDiv" style="overflow:auto; width:100%; height:87%; text-align:center;"></div>');
			var table = $('<table id="report_'+this.reportId+'_table" style="border-collapse:collapse"></table>');
			var thead = $('<thead id="report_'+this.reportId+'_header"></thead>');
			var tbody = $('<tbody id="report_'+this.reportId+'_data"></tbody>');
			
			thead.appendTo(table);
			tbody.appendTo(table);
			//table.appendTo(div);
			table.appendTo($('#tableDiv'));
			//div.appendTo(this.target);
		}else if(this.reportType == 'pivot'){
			//var div = $('<div id="tableDiv" style="overflow:auto; width:100%; height:88%; text-align:center;"></div>');
			var table = $('<table id="report_'+this.reportId+'_table" style="border-collapse:collapse"></table>');
			
			//table.appendTo(div);
			table.appendTo($('#tableDiv'));
			//div.appendTo(this.target);
		}
	}
	
	/** 初始化统计图显示区域 */
	this.initGraphDiv = function(){
		$('#graphDiv').html('');
		var div = //'<div id="graphDiv" class="graphDiv" style="text-align: center; width:100%; height:2%;">' +
				  '<div><img id="showGraphBtn" class="hideGraph" src="images/up.png" title="显示统计图" /></div>' + 
				  '<div id="graphContent" style="display:none;height:95%;width:100%;padding:0;margin:0;">'+
				  '</div>'; 
				  //'</div>';
		$(div).appendTo($('#graphDiv'));
		$("#showGraphBtn").click(function(){
			if($(this).attr('class') == 'hideGraph'){
				//当前是收起状态：
				$("#graphDiv").css('height', '50%');
				$("#tableDiv").css('height', '50%');
				$("#graphContent").show();
				$(this).attr('src', 'images/down.png');
				$(this).attr('title', '隐藏统计图');
				$(this).attr('class', 'showGraph');
				
				_this.addGraphImage();//添加统计图
			}else{
				//当前是展开状态：
				$("#graphContent").hide();
				$("#graphDiv").css('height', '3%');
				$("#tableDiv").css('height', '97%');
				$(this).attr('src', 'images/up.png');
				$(this).attr('title', '显示统计图');
				$(this).attr('class', 'hideGraph');
			}
		});
	}
	
	/** 添加统计图图片 */
	this.addGraphImage = function(){
		if(_this.graphData == null){
			//loading();
			if(_this.reportType == 'fast'){
				//分组报表：
				$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=10"), async:true, cache:false, data:{"resID":base64.encode(_this.reportId), "fastReportDir":base64.encode(_this.filePath)}, dataType:"json", 
					success:function (data) {
						_this.getGraphImageSuccessHandler(data);
						//closeFile();
					}, error:function () {
						$this.trigger({type:'error', opt:'获取统计图'});
					}}
				);
			}else if(_this.reportType == 'pivot'){
				//交叉报表：
				$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showPivotReportServlet?action=10"), async:true, cache:false, data:{"resID":base64.encode(_this.reportId), "pivotReportDir":base64.encode(_this.filePath)}, dataType:"json", 
					success:function (data) {
						_this.getGraphImageSuccessHandler(data);
						//closeFile();
					}, error:function () {
						$this.trigger({type:'error', opt:'获取统计图'});
					}}
				);
			}
		}
	}
	
	/** 获取统计图成功 */
	this.getGraphImageSuccessHandler = function(data){
		_this.graphData = data;
		if(_this.graphData.state == 200){
			var height = $("#graphContent").height();
			var image = '<image height="'+height+'" src="'+PathUtils.getRelativeUrl(  _this.graphData.path +'?t_i_m_e='+ (new Date().getTime())) +'" />';
			$("#graphContent").append(image);
		}else if(_this.graphData.state == 404){
			$("#graphContent").append(_this.graphData.message);
		}else if(_this.graphData.state == 500){
			confirm(_this.graphData.message);
		}
	}
	
	/** 初始化页面报表信息 */
	this.initReportInfo = function(){
		if(this.reportType == "fast"){
			//prompt("", _this.contextPath + "/showFastReportServlet?action=0&resID=" + base64.encode(_this.reportId) + "&fastReportDir=" + base64.encode(_this.filePath) + "&query=" + base64.encode(_this.query));
			$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=0" + _this.params), async:true, cache:false, data:{"resID":base64.encode(_this.reportId), "fastReportDir":base64.encode(_this.filePath), "query":base64.encode(_this.query)}, dataType:"json", 
				success:function (data) {
					if(data.state == 500){
						confirm(data.message);
						return;
					}
				
					_this.reportInfo = data;
					
					//触发事件：
					$this.trigger('initReportInfoComplete');
				}, error:function (s) {
					$this.trigger({type:'error', opt:'初始化报表信息'});
				}}
			);
		}else if(this.reportType == 'pivot'){
			loading();
			$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showPivotReportServlet?action=0" + _this.params), cache:false, data:{"resID":base64.encode(_this.reportId), "pivotReportDir":base64.encode(_this.filePath), "query":base64.encode(_this.query)}, dataType:"json", 
				success:function (data) {
					_this.reportInfo = data;
					closeFile();
					//触发事件：
					$this.trigger('initReportInfoComplete');
				},error:function () {
					closeFile();
					$this.trigger({type:'error', opt:'初始化报表信息'});
				}}
			);
		}
	}
	
	/** 初始化报表信息完成 */
	this.initReportInfoHandler = function(evt){
		//alert(evt.type);
		//初始化工具条
		this.initToolbar();
		
		if(this.reportType == 'fast'){
			//初始化页数
			this.initPageCount();
		}else if(this.reportType == 'pivot'){
			//获取数据
			loading();
			$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showPivotReportServlet?action=1"), cache:false, data:{"resID":base64.encode(_this.reportId), "pivotReportDir":base64.encode(_this.filePath)}, dataType:"json", 
				success:function (data) {
					if(data.state == 500){
						confirm(data.message);
						return;
					}
					_this.createTable(data);
					closeFile();
					// 调用回调函数：
					$this.trigger('createDataComplete');
				},error:function () {
					closeFile();
					$this.trigger({type:'error', opt:'计算报表'});
				}}
			);
		}
	}
	
	/** 创建交叉报表table */
	this.createTable = function (data) {
		var width = data.width;
		var height = data.height;
		var data = data.data;
		for(var i=0; i<height; i++){
			var tr = $('<tr></tr>');
			for(var j=0; j<width; j++){
				var tdv = data[i*width+j].v;
				if(typeof(data[i*width+j].h)!="undefined"){
					tdv = "<a href='"+data[i*width+j].h+"' target='_blank'>"+tdv+"</a>";
				}
				if(typeof(data[i*width+j].fc)!="undefined"){
					tdv = "<font color='"+data[i*width+j].fc+"'>"+tdv+"</font>";
				}
				if(typeof(data[i*width+j].bc)!="undefined"){
					tdv = "<div style='background:"+data[i*width+j].bc+";height:100%'>"+tdv+"</div>";
				}
				if(data[i*width+j].a == 0){
					tdv = '<img src="'+_this.contextPath + '/reportServlet?action=9&graphId='+tdv+'" />';
				}
				$('<td title="'+data[i*width+j].tt+'" d="'+(i%2+1)+'" a="'+data[i*width+j].a+'" t="'+data[i*width+j].t+'" nm="'+(data[i*width+j].a!=3)+'">'+tdv+'</td>').appendTo(tr);
			}
			$(tr).appendTo($("#report_"+this.reportId+"_table"));
		}
		$("#report_"+this.reportId+"_table").width(width * this.reportInfo.colWidth);
		$("#report_"+this.reportId+"_table").height(height * this.reportInfo.rowHeight);
		
		//添加样式：
		var cornerStyle = _this.getCellStyle(this.reportInfo.css.corner);
		var style1 = _this.getCellStyle(this.reportInfo.css.data1);
		var style2 = _this.getCellStyle(this.reportInfo.css.data2);
		var rowHeaderStyle = _this.getCellStyle(this.reportInfo.css.rowHeader);
		var sumHeaderStyle = _this.getCellStyle(this.reportInfo.css.sumHeader);
		var colHeaderStyle = _this.getCellStyle(this.reportInfo.css.colHeader);
		var subSumHeaderStyle = _this.getCellStyle(this.reportInfo.css.subSumHeader);

		$("#report_"+this.reportId+"_table [a=0]").attr('style', cornerStyle).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$("#report_"+this.reportId+"_table [a=1]").attr('style', colHeaderStyle).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$("#report_"+this.reportId+"_table [a=2]").attr('style', rowHeaderStyle).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$("#report_"+this.reportId+"_table [a=3][d=1]").attr('style', style1).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$("#report_"+this.reportId+"_table [a=3][d=2]").attr('style', style2).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$("#report_"+this.reportId+"_table [t=2]").attr('style', subSumHeaderStyle).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		$("#report_"+this.reportId+"_table [t=3]").attr('style', sumHeaderStyle).width(this.reportInfo.colWidth).height(this.reportInfo.rowHeight);
		
		//合并单元格：
		this.mergeCell("report_"+this.reportId+"_table");
		
		return this;
	};
	
	/** 计算总页数 */
	this.initPageCount = function(){
		//后台获取记录数
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=1"), async:true, cache:false, data:{"resID":base64.encode(_this.reportId), "fastReportDir":base64.encode(_this.filePath)}, dataType:"json", 
			success:function (data, textStatus) {
				if(data.state == 500){
					confirm(data.message);
					return;
				}
			
				_this.reportRowCount = data.reportRowCount;
				_this.pageCount = Math.ceil(_this.reportRowCount / _this.perPageCount);
				/*
				var optionStr = "";
				for(var i=0; i<_this.pageCount; i++){
					optionStr += "<option value='"+i+"'>"+(i+1)+"</option>";
				}
				$("#pageSelecter").html(optionStr);
				*/
				$this.trigger('initPageCountComplete');
			}, error:function () {
				$this.trigger({type:'error', opt:'获取记录数'});
			}}
		);
	}
	
	/** 初始化总页数完成事件 */
	this.initPageCountHandler = function(evt){
		//alert(evt.type);
		
		//添加表头数据
		this.addReportHeader();
	}
	
	/** 报表页面添加表头 */
	this.addReportHeader = function(){
		//后台获取表头数据
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=2"), async:true, cache:false, data:{"resID":base64.encode(_this.reportId), "fastReportDir":base64.encode(_this.filePath)}, dataType:"json", 
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
		
		var begin = this.currPage*this.perPageCount;
		var length = this.perPageCount;
		
		// 检查缓存数据
		this.validateCache(begin, length);
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
		//alert(evt.type);
		//alert(evt.begin + "," + evt.length);
		var data = this.cache.getData(evt.begin, evt.length);
		this.createData(data, evt.begin);
		
		//如果是最后一页，要添加上总计行		
		if(this.currPage == this.pageCount-1)
			this.addTotalData();
		
		//添加样式：
		var style1 = _this.getCellStyle(this.reportInfo.css.data1);
		var style2 = _this.getCellStyle(this.reportInfo.css.data2);
		var rowHeaderStyle = _this.getCellStyle(this.reportInfo.css.rowHeader);
		var sumHeaderStyle = _this.getCellStyle(this.reportInfo.css.sumHeader);
		var colHeaderStyle = _this.getCellStyle(this.reportInfo.css.colHeader);
		var subSumHeaderStyle = _this.getCellStyle(this.reportInfo.css.subSumHeader);
		
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
		var condition = $(td).attr('condition');
		var level = parseInt($(td).attr('level'));
		var rowno = parseInt($(td).parent().attr('rowno'));
		var cacheNo = rowno - this.cache.pointer;//在缓存中行号
		var length = this.cache.maxRowCount - cacheNo;//获取数据的长度
		var state = $(td).attr('s');//单元格状态
		//alert(condition + "," + level + "," + rowno + "," + cacheNo);
		loading();
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=5"), cache:false, async:true, data:{"rowno":rowno, "level":level, "resID":base64.encode(_this.reportId)}, dataType:"json", 
			success:function(data){
				var cacheLen = _this.cache.length();
				var begin = parseInt(data.begin);
				var length = parseInt(data.length);
				
				//移除缓存数据：
				_this.cache.remove(begin-_this.cache.pointer, length);
				//数据插入到缓存中：
				_this.cache.insert(data.data, begin-_this.cache.pointer);
				
				// length行变为1行
				_this.reportRowCount = _this.reportRowCount - length + 1;
				_this.currPage = Math.floor(begin / _this.perPageCount);//新的当前页
				
				var pageCount = _this.pageCount;//当前的总页数
				_this.pageCount = Math.ceil(_this.reportRowCount / _this.perPageCount);//新的总页数
				
				//for(var i=pageCount-1; i>=_this.pageCount; i--){
					//$("#pageSelecter option").eq(i).remove();
				//}
				//$("#pageSelecter option").eq(_this.currPage).attr('selected', 'selected');
				
				$("#pageNum").val(_this.currPage + 1);
				closeFile();
				
				// 数据实际减少量：
				var delta = cacheLen - _this.cache.length();
				//alert(_this.cache.pointer+_this.cache.length() + "," + delta + "," + _this.currPage);
				// 补充数据:
				_this.getDataFromServer(_this.cache.pointer+_this.cache.length(), delta, true, 'pageChanged');//从服务器获取数据，并触发缓存就绪事件
			},
			error:function(){
				$this.trigger({type:'error', opt:'获取数据'});
			}
		});
	}
	
	/** 数据表格生成完成 */
	this.createDataCompleteHandler = function(evt){
		//alert(evt.type);
		if(_this.reportType == 'fast'){
			//获取下一页数据
			this.getNextPage(evt);
		}
		
		//调用回调函数
		if(_this.callback != null && _this.callback != undefined && _this.callback != ''){
			eval(_this.callback);
			//setReportContentHeight();
		}
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
		var condition = $(td).attr('condition');
		var level = parseInt($(td).attr('level')) + 1;
		var rowno = parseInt($(td).parent().attr('rowno'));
		var cacheNo = rowno - this.cache.pointer;//在缓存中行号
		var length = this.cache.maxRowCount - cacheNo;//获取数据的长度
		var state = $(td).attr('s');//单元格状态
		//alert(condition + "," + level + "," + rowno + "," + cacheNo);
		loading();
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=4"), cache:false, async:true, data:{"begin":0, "length":length, "rowno":rowno, "level":level, "state":state, "condition":base64.encode(condition), "resID":base64.encode(_this.reportId)}, dataType:"json", 
			success:function(data){
				//移除该行：
				_this.cache.remove(cacheNo);
				//数据插入到缓存中：
				_this.cache.insert(data.data, cacheNo);
				_this.reportRowCount += data.length - 1;
				var pageCount = _this.pageCount;//当前的总页数
				_this.pageCount = Math.ceil(_this.reportRowCount / _this.perPageCount);//新的总页数
				
				/*
				for(var i=pageCount; i<_this.pageCount; i++){
					$("<option value='"+i+"'>"+(i+1)+"</option>").appendTo($("#pageSelecter"));
				}
				*/
				
				closeFile();
				
				$this.trigger({type:'pageChanged'});
			},
			error:function(){
				$this.trigger({type:'error', opt:'获取数据'});
			}
		});
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
					$(tr).append("<td class='sumHeader' nm='"+nm+"'>"+this.totalData[i][j]+"</td>");
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
		$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=3"), cache:false, async:true, data:{"begin":begin, "length":length, "condition":"", "resID":base64.encode(_this.reportId)}, dataType:"json", 
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

	/** 添加数据 */
	this.createData = function(data, rowno){
		$("#report_"+this.reportId+"_data").html('');
		for(var i=0; i<data.length; i++){
			var tr = $("<tr rowno='"+(rowno++)+"'></tr>");
			for(var j=0; j<data[i].length; j++){
				var clz = 'data'+(i%2+1);
				var nm = false;
				var condition = '';
				var level = 0;
				var value = data[i][j].v;
				var state = data[i][j].s;
				var disValue = value;
				if(j < this.reportInfo.groupFields.length){
					clz = 'rowHeader';
					nm = true;
					condition = this.createCondition(data[i], j);
					level = j;
				}
				if(state == -1)
					clz = 'subSumHeader';
				if(typeof(data[i][j].h)!="undefined"){
					disValue = "<a href='"+data[i][j].h+"' target='_blank'>"+value+"</a>";
				}
				if(typeof(data[i][j].backColor)!="undefined"){
					disValue = "<div style='background:"+data[i][j].backColor+";height:100%'>"+disValue+"</div>";
				}
				if(typeof(data[i][j].foreColor)!="undefined"){
					disValue = "<font color='"+data[i][j].foreColor+"'>"+disValue+"</font>";
				}
				$(tr).append('<td condition="'+condition+'" level="'+level+'" class="'+clz+'" nm="'+nm+'" v="'+value+'" s="'+state+'">'+disValue+'</td>');
				
				//$(tr).append("<td condition='"+condition+"' level='"+level+"' style="bgcolor" class='"+clz+"' nm='"+nm+"' v='"+value+"' s='"+state+"'>"<div style='background:red;height:100%'>+value+</div>"</td>");
			}
			
			$(tr).appendTo($("#report_"+this.reportId+"_data"));
		}
	}
	
	/** 创建查询条件 */
	this.createCondition = function(row, j){
		var condition = "";
		for(var k=0; k<=j; k++){
			condition += this.reportInfo.groupFields[k] + "=" + row[k].v;
			if(k < j)
				condition += "&"
		}
		return condition;
	}
	
	/** 初始化工具条 */
	this.initToolbar = function(){
		if(this.reportType == 'fast'){
			//分组报表：
			//首页按钮事件
			$('#first').click(function(){
				if(_this.currPage <= 0)
					return;
				_this.currPage = 0;
				//$('#pageSelecter option:first').attr('selected', 'selected');
				$('#pageNum').val(1);
				$this.trigger('pageChanged');
			});
			//尾页按钮事件
			$('#last').click(function(){
				if(_this.currPage == _this.pageCount-1)
					return;
				_this.currPage = _this.pageCount-1;
				//$('#pageSelecter option:last').attr('selected', 'selected');
				$('#pageNum').val(_this.pageCount);
				$this.trigger('pageChanged');
			});
			//上一页按钮事件
			$('#previous').click(function(){
				if(_this.currPage <= 0)
					return;
				_this.currPage -= 1;
				//$('#pageSelecter option:eq('+_this.currPage+')').attr('selected', 'selected');
				$('#pageNum').val(_this.currPage + 1);
				$this.trigger('pageChanged');
			});
			//下一页按钮事件
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
			$('#pageGo').click(function(){
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
			//刷新按钮事件
			$('#refresh').click(function(){
				_this.perPageCount = parseInt($('#perPageCount').val());
				_this.pageCount = Math.ceil(_this.reportRowCount / _this.perPageCount);
				_this.currPage = 0;
				/*
				$("#pageSelecter option").remove();
				for(var i=0; i<_this.pageCount; i++){
					$("<option value='"+i+"'>"+(i+1)+"</option>").appendTo($("#pageSelecter"));
				}
				*/
				$('#pageNum').val(_this.currPage + 1);
				_this.maxRowCount = _this.cachePageCount * _this.perPageCount; // 最大行数
				_this.cache = new CacheData(_this.maxRowCount, _this.perPageCount); // 缓存数组
				$this.trigger({type:'pageChanged'});
			});
			//清除缓存按钮事件
			$("#clear").click(function(){
				//清空缓存区
				_this.cache.clear();
				_this.cache.pointer = 0;
				
				$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=6"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId)}, dataType:"json", 
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
				_this.save('excel', false);
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
		}else if(this.reportType == 'pivot'){
			//交叉报表：
			$('#pageOperators').hide();
			//$("#clear").hide();
			
			//清除缓存按钮事件
			$("#clear").click(function(){
				$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showPivotReportServlet?action=2"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId)}, dataType:"json", 
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
				_this.save('excel', false);
			});
			$('#exportPdf').click(function(){
				_this.save('pdf', false);
			});
			$('#exportText').click(function(){
				_this.save('text', false);
			});
			$('#exportCsv').click(function(){
				_this.save('csv', false);
			});
			
			//远程导出：
			$('#remoteWord').click(function(){
				_this.save('word', true);
			});
			$('#remoteExcel').click(function(){
				_this.save('excel', true);
			});
			$('#remotePdf').click(function(){
				_this.save('pdf', true);
			});
			$('#remoteText').click(function(){
				_this.save('text', true);
			});
			$('#remoteCsv').click(function(){
				_this.save('csv', true);
			});
		}
		
		/** 打印 */
		$('#print').click(function(){
			if(_this.reportType == 'fast'){
				//计算报表：
				loading();
				$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=9"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId)}, dataType:"json", 
					success:function(data){
						closeFile();
						//var result = data.result;
						//applet打印请求：
						//var appleturl = _this.contextPath + "/reportServlet?action=2&name=" + _this.reportId + "&reportFileName=" + _this.reportId + ".raq&srcType=file&savePrintSetup=no&appletJarName=runqianReport4Applet.jar,dmGraphApplet.jar,appletPatch.jar,flex-messaging-core-2.0.jar&serverPagedPrint=no&mirror=no&reportParamsId=&cachedId=&t_i_m_e="+new Date().getTime();
						var appleturl = PathUtils.getRelativeUrl("/reportServlet?action=2&name=" + _this.reportId + "&reportFileName=" + _this.reportId + "&srcType=defineBean&savePrintSetup=no&appletJarName=mis2/download/runqianReport4Applet.jar,mis2/download/dmGraphApplet.jar&serverPagedPrint=no&mirror=no&reportParamsId=undefined&cachedId=" + data.cacheId + "&t_i_m_e=" + new Date().getTime());
						//prompt("", appleturl);
						//$("#print_frame").attr("src", appleturl);
						$("#hiddenFrame").html('<iframe src="'+appleturl+'" height="10" width="30"></iframe>');
					},
					error:function(){
						$this.trigger({type:'error', opt:'获取数据'});
					}
				});
			}else if(_this.reportType == 'pivot'){
				$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showPivotReportServlet?action=5"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId)}, dataType:"json", 
					success:function(data){
						var cacheId = data.cacheId;
						var gez_htmlid = 'report1';
						var gez_isDirectPrint = 'false';//不预览,直接打印
						var gez_isDirectPreview = 'false';//不查看,直接预览
						var gez_isPopUp = true;//在新窗口展示报表
						var gez_barLocation = 'top';//工具条位置
						var gez_fontPromt = 'true';//弹出字体提示框
						var gez_cacheId = cacheId;
						var gez_pathRoot = '/mis2/';
						runqianFlashPrint(contextPath, gez_htmlid, reportId, gez_isDirectPrint, gez_isDirectPreview, gez_isPopUp, gez_barLocation, gez_fontPromt, gez_cacheId, gez_pathRoot);
					},
					error:function(){
						$this.trigger({type:'error', opt:'获取数据'});
					}
				});
			}
		});
		
	}
	
	/** 导出：format-导出格式，remote-是否是远程导出 */
	this.save = function(format, remote){
		//alert(format + ", " + remote);
		if(this.reportType == 'fast'){
			//分组报表
			if(!remote){
				//本地导出：
				var url = PathUtils.getRelativeUrl("/showFastReportServlet?action=7&resID="+base64.encode(_this.reportId)+ "&perPageCount="+_this.perPageCount + "&format="+format+ "&remote="+remote + "&time=" + new Date().getTime());
				//var url = "http://www.baidu.com";
				$("#hiddenFrame").html('<iframe src="'+url+'" height="0" width="0"></iframe>');
				//$("#saveAs_frame").attr("src", url);
			}else{
				loading();
				//远程导出：
				$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showFastReportServlet?action=8"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId), "perPageCount":_this.perPageCount, "format":format, "remote":remote}, dataType:"json", 
					success:function(data){
						closeFile();
						if(data.result == 'success'){
							alert('导出成功！文件路径：' + data.remoteExportDir);
						}else{
							alert('导出失败！');
						}
					},
					error:function(){
						$this.trigger({type:'error', opt:'获取数据'});
					}
				});
			}
		}else if(this.reportType == 'pivot'){
			//交叉报表
			if(!remote){
				//本地导出：
				//$("#saveAs_frame").attr("src", _this.contextPath + "/showPivotReportServlet?action=3&resID="+base64.encode(_this.reportId)+ "&perPageCount="+_this.perPageCount + "&format="+format+ "&remote="+remote);
				var url = PathUtils.getRelativeUrl("/showPivotReportServlet?action=3&resID="+base64.encode(_this.reportId)+ "&perPageCount="+_this.perPageCount + "&format="+format+ "&remote="+remote);
				$("#hiddenFrame").html('<iframe src="'+url+'" height="0" width="0"></iframe>');
			}else{
				loading();
				//远程导出：
				$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showPivotReportServlet?action=4"), cache:false, async:true, data:{"resID":base64.encode(_this.reportId), "perPageCount":_this.perPageCount, "format":format, "remote":remote}, dataType:"json", 
					success:function(data){
						closeFile();
						if(data.result == 'success'){
							alert('导出成功！文件路径：' + data.remoteExportDir);
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
	}
	
	/**
	*调用缓存数据管理类，获得数据，并生成表格，同时设置单元格属性、样式、事件等。
	*/
	this.createHeader = function (data) {
		for(var i=0; i<data.length; i++){
			var tr = $("<tr></tr>");
			for(var j=0; j<data[i].length; j++){
				$(tr).append("<td class='colHeader' nm='true'>"+data[i][j]+"</td>");
			}
			$(tr).appendTo($("#report_"+this.reportId+"_header"));
		}
	};
	
	/** 根据JSON生成样式字符串 TODO 改为后台拼 */
	this.getCellStyle = function(css){
		var r = "";
		if(css.fontFamily)
			r += "font-family:" + css.fontFamily + ";";
		if(css.fontSize)
			r += "font-size:" + css.fontSize + ";";
		if(css.color)
			r += "color:" + css.color + ";";
		if(css.fontWeight)
			r += "font-weight:" + css.fontWeight + ";";
		if(css.fontStyle)
			r += "font-style:" + css.fontStyle + ";";
		if(css.textDecoration)
			r += "text-decoration:" + css.textDecoration + ";";
		if(css.textAlign)
			r += "text-align:" + css.textAlign + ";";
		if(css.verticalAlign)
			r += "vertical-align:" + css.verticalAlign + ";";
		if(css.paddingLeft)
			r += "padding-left:" + css.paddingLeft + ";";
		if(css.paddingRight)
			r += "padding-right:" + css.paddingRight + ";";
		if(css.paddingTop)
			r += "padding-top:" + css.paddingTop + ";";
		if(css.paddingBottom)
			r += "padding-bottom:" + css.paddingBottom + ";";
		if(css.backgroundColor)
			r += "background-color:" + css.backgroundColor + ";";
		if(css.borderColor)
			r += "border: solid 1px "+css.borderColor+";";
		if(css.indent)
			r += "indent:" + css.indent + ";";
		return r;
	}
	
	/** 合并单元格 */
	this.mergeCell = function(tableId){
		//行数：
		var rowCount = $("#"+tableId+" tr").length;
		//列数：
		var colCount = $("#"+tableId+" tr").eq(0).children().length;
		
		if(this.reportType == "fast"){
			//合并行：
			for(var i=1; i<=colCount; i++){
				mergeFastReportRow(tableId, i);
			}
			
			//合并列：
			for(var i=1; i<=rowCount; i++){
				mergeFastReportCol(tableId, i, colCount);
			}
		}else if(this.reportType == "pivot"){
			//合并行：
			for(var i=1; i<=colCount; i++){
				mergePivotReportRow(tableId, i);
			}
			
			//合并列：
			for(var i=1; i<=rowCount; i++){
				mergePivotReportCol(tableId, i, colCount);
			}
		}
	}
	
};

/** 分组报表行合并 */
function mergeFastReportRow(tableId, colNum){
    var firstTd = "";
    var currentTd = "";
    var spanNum = 0;
	$("#" + tableId + " tr td:nth-child("+colNum+")").each(function(i){
        if(i==0){
            firstTd = this;
            spanNum = 1;
        }else{
            currentTd = this;
        	if($(currentTd).attr('nm') == 'true'){
	            if($(firstTd).text() == $(currentTd).text()){
	                spanNum++;
	                $(currentTd).hide();//remove();
	                $(firstTd).attr("rowSpan",spanNum);
	            }else{
	                firstTd = this;
	                spanNum = 1;
	            }
        	}
        }
    }); 
}

/** 分组报表列合并 */
function mergeFastReportCol(tableId ,rownum, maxcolnum){
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
            	if($(currentTd).attr('nm') == 'true'){
	                if($.trim($(currentTd).text())==''){
	                    spanNum++;
	                    $(currentTd).hide();//remove(); 
	                    $(firstTd).attr("colSpan",spanNum);
	                }else{
	                    firstTd = this;
	                    spanNum = 1;
	                }
	            }
            }
        });
    });
}

/** 交叉报表行合并 */
function mergePivotReportRow(tableId, colNum){
    var firstTd = "";
    var currentTd = "";
    var spanNum = 0;
	$("#" + tableId + " tr td:nth-child("+colNum+")").each(function(i){
        if(i==0){
            firstTd = this;
            spanNum = 1;
        }else{
            currentTd = this;
            if($(currentTd).attr("nm") == "true"){
	            if(($.trim($(currentTd).text()) == "" && $(firstTd).attr("title") != $(currentTd).attr("title")) || ($(firstTd).text() == $(currentTd).text() && $(firstTd).attr("title") == $(currentTd).attr("title"))){
	            	//$(_w_table_currenttd).attr("nm", "false");
	                spanNum++;
	                $(currentTd).hide(); //remove();
	                $(firstTd).attr("rowSpan",spanNum);
	            }else{
	                firstTd = this;
	                spanNum = 1;
	            }
            }
        }
    }); 
}

/** 交叉报表列合并 */
function mergePivotReportCol(tableId ,rownum, maxcolnum){
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
                if($(currentTd).attr("nm") == "true"){
	               	if(($.trim($(currentTd).text()) == "" && $(firstTd).attr("title") != $(currentTd).attr("title")) || ($(firstTd).text() == $(currentTd).text() && $(firstTd).attr("title") == $(currentTd).attr("title"))){
	                	//$(_w_table_currenttd).attr("nm", "false");
	                    spanNum++;
	                    $(currentTd).hide(); //remove();
	                    $(firstTd).attr("colSpan",spanNum);
	                }else{
	                    firstTd = this;
	                    spanNum = 1;
	                }
                }
            }
        });
    });
}

