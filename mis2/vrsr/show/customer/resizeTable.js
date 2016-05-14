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

var colHeaderTableCellWidth;
var colHeaderTableUpdateIndex;
var colHeaderRowCount;
//table:需要添加拖动大小功能的表格对象，callback：回调函数，在拖动完成松开鼠标左键时调用，如果回调函数为空，则不会调用
function Resize(reportId,callback,type){

	var headrows=0;
	init(reportId,"corner");
	init(reportId,"colHeader");
	init(reportId,"rowHeader");
	initColHeaderWidthArray(reportId);
	//init(reportId,"data"); //53123:限制数据区的拖动
	function getTableID(reportId,pos){
		return "report_"+reportId+"_table_"+pos;
	}
	function init(reportId,pos){
		$("#"+getTableID(reportId,pos)).mousemove(function(event){mouseMoveCursor(event)});
		$("#"+getTableID(reportId,pos)).children().children("tr").each(function(){
			var x=0;
			$(this).children("td").each(function(){
				var dis=$(this).css("display");
				if(dis!="none"){
					if(BrowserType()=="Firefox"){
						$(this).css("position","relative");
						$(this).css("background-clip","padding-box");					
					}					
					$(this).attr("tablePosition",pos);
					$(this).attr("xIndex",$(this).index());
					$(this).addClass("resizetd");
					var colSpan=$(this).attr("colSpan");
					if(!colSpan) colSpan=1;
					x+=colSpan;
				}
			});
		})
	}


	var obj=null;
	var theobject = null; 
	var objcursor = null; 
	var tableX = null;
	var tableY = null;
	this.tableEndX = null;
	this.tableEndY = null;
	this.reportId = reportId;
	getAbsPoint(reportId);
	function resizeObject() {
		this.el    = null;
		this.dir   = "";
		this.grabx = null;
		this.graby = null;
		this.width = null;
		this.height = null;
		this.mouseup = null;
		this.mousemove = null;
		this.rowIndex=0;
		this.colIndex=0;
	}
	//拖曳开始
	var doDown=function(event) {
		//console.log("拖曳开始 ");
		event = event? event: window.event
		var temp = event.srcElement ? event.srcElement:event.target; 
		var el = getReal(temp, "className", "resizetd");
		dir=temp.style.cursor;
		theobject = new resizeObject();
		
		if (el == null) {
			return;
		}else{
			objcursor=el.style.cursor;
			var rowSpan=$(el).attr("rowSpan");
			var colSpan=$(el).attr("colSpan");
			if(!rowSpan) rowSpan=1;
			if(!colSpan) colSpan=1;
			theobject.rowIndex=el.parentNode.rowIndex+rowSpan-1;
			//theobject.colIndex=parseInt($(el).attr("xIndex"))+colSpan-1;
			theobject.colIndex=parseInt($(el).attr("xIndex"));
			theobject.rowSpan = rowSpan;
			theobject.colSpan = colSpan;
			var b = true;
			for(var r=0;r<$(el).parent().parent().children().size();r++){
				for(var m=0;m<$(el).parent().parent().children().eq(r).children().size();m++){
					var cell = $(el).parent().parent().children().eq(r).children().eq(m);
					var cellIndex=m+$(cell).attr("colSpan")-1;
					if(m<=theobject.colIndex&&cellIndex>=theobject.colIndex&&$(cell).attr("colSpan")>1){
						b = false;
						break;
					}
				}
			}
			theobject.noMergerCol = b;
			
			var x = event.offsetX || event.layerX;
			var y = event.offsetY || event.layerY;
			if(y<4){
				if(el.parentNode.rowIndex-1>=0)
					theobject.rowIndex=el.parentNode.rowIndex-1;
			}
			if(x<4){
				if($(el).attr("xIndex")>0)
					theobject.colIndex=$(el).attr("xIndex")-1;
			}
			theobject.width = $(el).parent().parent().parent().children().css("width");
			theobject.width2 = $(el).parent().parent().parent().css("width");
			//theobject.width2 =$(el).parent().parent().parent().children().eq(0).children().eq(theobject.colIndex*2).css("width");
			theobject.height =$(el).parent().parent().children().eq(theobject.rowIndex).css("height");
		}
		
		theobject.el = el;
		theobject.dir = dir;
		if($(el).attr("head")=="yes"){
			theobject.el.row=theobject.rowIndex-1;
		}else{
			theobject.el.row=theobject.rowIndex+headrows-1;
		}
		theobject.el.col=theobject.colIndex;
			
		theobject.grabx = event.clientX;
		theobject.graby = event.clientY;
		theobject.width = el.offsetWidth;
		theobject.height = el.offsetHeight;
		theobject.mouseup = document.onmouseup;
		theobject.mousemove = document.onmousemove;
	    
		event.returnValue = false;
		event.cancelBubble = true;
		document.onmouseup = doUp;
		document.onmousemove = doMove;
	}
	//拖曳结束
	function doUp(event){
		//console.log("拖曳结束 ");
		obj=null;
		if (theobject != null) {
			if(callback!="" && callback!="undefined"){
				var reportName=$(theobject.el).parent().parent().parent().attr("id");
				var ttt=dir.split("-");;
				if(ttt.length>1){
					var pos=$(theobject.el).attr("tablePosition");
					if (ttt[0].indexOf("s") != -1) {
						theobject.height=$(theobject.el).parent().parent().children().eq(theobject.rowIndex).css("height");
						if(pos=="data"||pos=="rowHeader"){
							$("#"+getTableID(reportId,"data")).children().children("tr").each(function(){
								$(this).css("height",theobject.height);
							});
							$("#"+getTableID(reportId,"rowHeader")).children().children("tr").each(function(){
								$(this).css("height",theobject.height);
							});
						}
					}
					
					//if (ttt[0].indexOf("e") != -1) {
					//	    updateColHeaderCellWidth();
					//}	
					updateColHeaderCellWidth();
					getColHeaderTableCellWidth();
					 for(var i=0;i<colHeaderTableUpdateIndex.length;i++){
								var upIndex = colHeaderTableUpdateIndex[i];
								$("#"+getTableID(reportId,"data")).children().children("tr").each(function(){
									$(this).children("td").eq(upIndex).css("width",colHeaderTableCellWidth[upIndex]+ "px");
									$(this).children("td").eq(upIndex).css("text-align","center");
								});
							}
							
							$("#"+getTableID(reportId,"data")).css("width",$("#"+getTableID(reportId,"colHeader")).width())
					if(!(theobject.colSpan==1&&theobject.rowSpan==colHeaderRowCount)){
							if (ttt[0].indexOf("e") != -1) {
						   	
							//updateColHeaderTableCellWidth();
						   
		
							//$("#"+getTableID(reportId,pos)).css("width",tableWidth+"px");
							//获取document.body下除去左表头后的宽度，然后判断拖拽后是否超出此宽度，如果超出将div宽度设为与table同宽
							//var table_data_width = $(document.body).width()-$("#report_"+reportId+"_table_corner_div").width();
							//if(pos=="data"||pos=="colHeader"){
							//	if(tableWidth>table_data_width){
							//		tableWidth = tableWidth+18; //此处处理是为了让div比table多出竖向滚动条的宽度
							//		$("#"+getTableID(reportId,pos)).parent().css("width",tableWidth+"px");
							//	}
							//}
						
						}
					}
				
				}
			}
			document.onmouseup   = theobject.mouseup;
			document.onmousemove = theobject.mousemove;

			if(schema=='design'){//设计界面模式
				var index=$(theobject.el).attr("colindex");
				var width=parseInt(theobject.finalWidth);
				if(!isNaN(width)){
					try{
						parent.parent.setColWidth(index,width);
					}catch(e){}
				}
			}

			theobject.el.style.cursor = objcursor;
			objcursor=null;
			theobject = null;
			getAbsPoint(reportId);
			try{
				colWidthType = "resize";//设置列宽属性来源，变量位于fastReportViewer_toolbar.js
			}catch(e){}
		}
		//updateColHeaderTableCellWidth();
		//initColHeaderWidthArray(reportId);
		//保证存在横向滚动时候显示出来
		viewer.setLayout();
		
	}
	//拖曳过程中宽高的实时变化
	function doMove(event) {
		event = event? event: window.event
		var str, xMin, yMin;
		xMin = 0; 
		yMin = 0; 

	 	var temp;
		if(theobject != null) {
			var ttt=dir.split("-");
			if(ttt.length>1){
				var pos=$(theobject.el).attr("tablePosition");
				if (ttt[0].indexOf("e") != -1) {
					temp= Math.max(xMin, parseInt(theobject.width) + event.clientX - theobject.grabx);
					var temp2= Math.max(xMin, parseInt(theobject.width2) + event.clientX - theobject.grabx);
					if(pos=="data"||pos=="colHeader"){
						setWidth("colHeader",temp,temp2);
						if(theobject.colSpan==1&&theobject.rowSpan==colHeaderRowCount){
							setWidth("data",temp,temp2);
						}
						
						
					}else{
						setWidth("corner",temp,temp2)
						setWidth("rowHeader",temp,temp2)
					}
					theobject.finalWidth=temp;
				}
				if (ttt[0].indexOf("s") != -1) {
					temp=Math.max(yMin, parseInt(theobject.height) + event.clientY - theobject.graby);
					if(pos=="data"||pos=="rowHeader"){
						setHeight("data",temp,theobject.rowIndex)
						setHeight("rowHeader",temp,theobject.rowIndex)
					}else{  //这两行代码因table-layout:fixed;属性不能正常拖拽，为防止错位，先进行注释
						//setHeight("corner",temp,theobject.rowIndex)  
						//setHeight("colHeader",temp,theobject.rowIndex)
					}
					theobject.finalHeight=temp;
				}
			}
			event.returnValue = false;
			event.cancelBubble = true;
		} 
	}
	//鼠标移动时的指针样式
	function mouseMoveCursor(event) {
		var dir = "";
		event = event? event: window.event
		var temp = event.srcElement ? event.srcElement:event.target; 
		el = getReal(temp, "className", "resizetd");
			
		if(el!=null){
			var x = event.offsetX || event.layerX;
			var y = event.offsetY || event.layerY;
			if ((y<4||y > el.offsetHeight-4)&&type) dir += "s";
			if (x<4||x > el.offsetWidth-4) dir += "e";
			if(y<4){if(el.parentNode.rowIndex-1<=0)dir="";}
			if(x<4){if(el.cellIndex<=0)dir="";}
		}
		if (dir == ""){
			if((this.tableEndX<event.clientX)&&(event.clientX-4<this.tableEndX))dir+="e";
			if((this.tableEndY<event.clientY)&&(event.clientY-4<this.tableEndY)&&type)dir+="s";
		}
		if (dir == ""){
			dir="auto";
			$(temp).unbind("mousedown",doDown);
			$(temp).attr("if_doDown_mouse","no");
		}else{
			dir =dir+ "-resize";
			if($(temp).attr("if_doDown_mouse")=="yes"){
			}else{
				$(temp).bind("mousedown",doDown);
				$(temp).attr("if_doDown_mouse","yes");
			}
		}
		//if(el!=null){
		//	el.style.cursor = dir;
		//}else{
			temp.style.cursor=dir;
		//}
	}
	//确定对象是否可拖曳
	function getReal(el, type, value) {
		temp = el;
			while ((temp != null)  &&  (temp.tagName != "BODY")) {
				if($(temp).toggleClass(value)&&(temp.tagName  == "TD")){
					//debugger;
					//如果是td，需要再判断一下是否还有上一级的td，且上一级td的colspan>2,如果有这个td就不能拖动
					if($(temp).attr("tablePosition")=="colHeader"){
						if($("#"+getTableID(reportId,"colHeader")).children().children("tr").size()>1){
							var trObj = $(temp).parent();
							if($(trObj).index()>0){
							
							}
						}
					}
					
					el = temp;
					return el;
				}else{
					el=null;
				}
				temp = temp.parentNode;
			}
		return el;
	}
	//确定对象是否可拖曳
	function getNow(el) {
		temp = el;
		while ((temp != null)) {
			el = temp;
			return el;
		}
		return el;
	}
	function getAbsPoint(reportId)  
	{  
		var e=$("#"+getTableID(reportId,"data"))[0];
	    var   x=e.offsetLeft,y=e.offsetTop,w=e.offsetWidth,h=e.offsetHeight;
	    while(e=e.offsetParent)
	    {
	       x   +=   e.offsetLeft;  
	       y   +=   e.offsetTop;
	    }
	    tableX=x;
	    tableY=y;
	    x=x+w;
	    y=y+h;
	    this.tableEndX=x;
	    this.tableEndY=y;
	}
	function setWidth(pos,tdWidth,tableWidth){
	/**
		if(pos=="colHeader"){
            //上表头，只改当前单元格宽度
            $(theobject).width(tdWidth);
            $(theobject).css("text-align","center");		
		}
	**/	
		//宽度增量	
		var grabWidth = tableWidth - $("#"+getTableID(reportId,pos)).width();
	
		$("#"+getTableID(reportId,pos)).children().children("tr").each(function(index){
			if(pos=="colHeader"){
				if(theobject.noMergerCol){
					$(this).children("td").eq(theobject.colIndex).css("width",tdWidth+ "px");
				    $(this).children("td").eq(theobject.colIndex).css("text-align","center");
				}else{
					if(index>theobject.rowIndex){
						/**
						$(this).children("td").each(function(index1){
							//var tempWidth =  event.clientX - theobject.grabx;
							var tempWidth =  parseInt(tdWidth)-parseInt(theobject.width);
							var colSpan=$(this).attr("colSpan");
				            if(!colSpan) colSpan=1;
				            var cellIndex=index1+colSpan-1;
							if((index1<=theobject.colIndex&&cellIndex>=theobject.colIndex)&&colSpan>1){
								//$(this).width($(this).get(0).clientWidth+tempWidth/2);
							}
							
							else{
								$(this).children("td").eq(theobject.colIndex).css("width",tdWidth+ "px");
				                $(this).children("td").eq(theobject.colIndex).css("text-align","center");
							}
							
						});
						**/	
						var grabColIndex = parseInt(theobject.colIndex)+parseInt(theobject.colSpan)-1;
						var newCellWidth = parseInt($(this).children("td").eq(grabColIndex).width())+grabWidth;
						$(this).children("td").eq(grabColIndex).css("width",newCellWidth+ "px");
				        $(this).children("td").eq(grabColIndex).css("text-align","center");
					}else{
						$(this).children("td").eq(theobject.colIndex).css("width",tdWidth+ "px");
				        $(this).children("td").eq(theobject.colIndex).css("text-align","center");
					}
				}
				
		    }else{
		        $(this).children("td").eq(theobject.colIndex).css("width",tdWidth+ "px");
			    $(this).children("td").eq(theobject.colIndex).css("text-align","center");
		    }
		    
		    //if(pos=="data" && $("#report_"+reportId+"_table_corner").find("img").length>0){
			//	$(this).parent().parent().parent().css("width","");//交叉表用 "report_"+reportId+"_table_"+pos;
		    //}
		    
		    
		});
		
		
		$("#"+getTableID(reportId,pos)).css("width",tableWidth+"px");
		//获取document.body下除去左表头后的宽度，然后判断拖拽后是否超出此宽度，如果超出将div宽度设为与table同宽
		var table_data_width = $(document.body).width()-$("#report_"+reportId+"_table_corner_div").width();
		if(pos=="data"||pos=="colHeader"){
			if(tableWidth>table_data_width){
				tableWidth = tableWidth+18; //此处处理是为了让div比table多出竖向滚动条的宽度
				$("#"+getTableID(reportId,pos)).parent().css("width",tableWidth+"px");
			}
		}else{
			$("#"+getTableID(reportId,pos)).parent().css("width",tableWidth+"px");
			//以下处理是为了让竖向滚动条始终保持在屏幕最右端
			$("#"+getTableID(reportId,"data")).parent().css("width",$(document.body).width()-tableWidth+"px");
			$("#"+getTableID(reportId,"colHeader")).parent().css("width",$(document.body).width()-tableWidth+"px");
		}
		//调整标题和底栏宽度
		$("#report_"+reportId+"_table_title_div span").width($("#report_"+reportId+"_table_corner_div").width()+$("#report_"+reportId+"_table_colHeader").width());
		$("#report_"+reportId+"_table_foot_div span").width($("#report_"+reportId+"_table_corner_div").width()+$("#report_"+reportId+"_table_colHeader").width());
		//if($("#report_"+reportId+"_table_title_div span").width()>$(document.body).width()||$("#report_"+reportId+"_table_foot_div span").width()>$(document.body).width()){
			$("#report_"+reportId+"_table_title_div span").parent().width($("#report_"+reportId+"_table_corner_div").width()+$("#report_"+reportId+"_table_colHeader").width());
			$("#report_"+reportId+"_table_foot_div span").parent().width($("#report_"+reportId+"_table_corner_div").width()+$("#report_"+reportId+"_table_colHeader").width());
		//}
	}
	function setHeight(pos,trHeight,rowIndex){
		$("#"+getTableID(reportId,pos)).children().children("tr").eq(rowIndex).css("height",trHeight+ "px");
	}
	
	//初始化colHeader表中每一列的宽度，记录到array中
	function initColHeaderWidthArray(reportId){
		colHeaderRowCount = $("#"+getTableID(reportId,"colHeader")).children().children("tr").size();
	  	colHeaderTableCellWidth = new Array();
		$("#"+getTableID(reportId,"colHeader")).children().children("tr").each(function(index1){
			$(this).children("td").each(function(index2){
				if(index1==$("#"+getTableID(reportId,"colHeader")).children().children("tr").size()-1){
					colHeaderTableCellWidth[index2] = $(this).width();
				}
			});
		});
	}

	//更新列宽度array
	function updateColHeaderCellWidth(){
		colHeaderTableUpdateIndex = new Array();
		$("#"+getTableID(reportId,"colHeader")).children().children("tr").each(function(index1){
			$(this).children("td").each(function(index2){
				if($(this).attr("colSpan")==1&&$(this).attr("rowSpan")==colHeaderRowCount){
					var width = $(this).get(0).clientWidth-2;
					//colHeaderTableCellWidth[index2] = width;
					//colHeaderTableUpdateIndex.push(index2);
					$(this).width(width);
				}else{
					if(index1==$("#"+getTableID(reportId,"colHeader")).children().children("tr").size()-1){
						if(!hasUpdateCellWidth(colHeaderTableUpdateIndex,index2)){
							var width = $(this).get(0).clientWidth-2;
							//colHeaderTableUpdateIndex.push(index2);
							//colHeaderTableCellWidth[index2] = width;
							$(this).width(width);
						}
					}
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
	

	//拖拽结束后重新设置一遍列宽
	function getColHeaderTableCellWidth(){
		colHeaderTableUpdateIndex = new Array();
		$("#"+getTableID(reportId,"colHeader")).children().children("tr").each(function(index1){
			$(this).children("td").each(function(index2){
				if($(this).attr("colSpan")==1&&$(this).attr("rowSpan")==colHeaderRowCount){
					var width = $(this).width();
					colHeaderTableCellWidth[index2] = width;
					colHeaderTableUpdateIndex.push(index2);
				}else{
					if(index1==$("#"+getTableID(reportId,"colHeader")).children().children("tr").size()-1){
						if(!hasUpdateCellWidth(colHeaderTableUpdateIndex,index2)){
							var width = $(this).width();
							colHeaderTableCellWidth[index2] = width;
							colHeaderTableUpdateIndex.push(index2);
						}
					}
				}
				
			});
		});
	}
	
	function isTdHasFatherTr(td){
	
	}
	
}
function Resizeold(reportId,callback,type){
	init(reportId,"corner");
	init(reportId,"colHeader");
	init(reportId,"rowHeader");
	//init(reportId,"data"); //53123:限制数据区的拖动
	function getTableID(reportId,pos){
		return "report_"+reportId+"_table_"+pos;
	}
	function init(reportId,pos){
		$("#"+getTableID(reportId,pos)).children().children("tr").each(function(){
			$(this).children("td").each(function(){
				var dis=$(this).css("display");
				if(dis!="none"){					
					$(this).attr("tablePosition",pos);
				}
			});
		})
	}
}	