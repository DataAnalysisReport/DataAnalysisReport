var DataViewer=function(b,d,c,a,e){this.contextPath=b;this.reportId=d;this.filePath=c;this.reportType=a;this.target=e;this.cacheDataManager=null;this.rowCount=0;this.colCount=0;this.tableData=[];this.k;var f=this;this.foldState=[];this.init=function(){var g="";if(this.reportType=="fast"){g+='<div id="reportContent" style="height: '+this.height+"; width: "+this.width+'; overflow: hidden; border: solid 0px;">';g+='<div id="reportTitle" style="height: 30; width: '+this.width+'; overflow: hidden; border: solid 0px; float: left;"></div>';g+='<div id="reportDiv" style="overflow-x: scroll; overflow-y:hidden; width: '+(this.width-15)+"; height: "+(this.height-60)+'; float: left;">';g+='<table id="reportTable" border="0" height="" style="border-collapse:collapse;table-layout:fixed;">';g+="</table>";g+="</div>";g+='<div id="scrollDiv"  style="height:100%; width: 15px; float: right; overflow: hidden; position:absolute; top:30; right:0;">';g+='<div id="scrollHeight" style="height: 100%; width: 15px;"></div>';g+="</div>";g+='<div id="reportFoot" style="height: 30; width: '+this.width+'; overflow: hidden; border: solid 0px; float: left;"></div>';g+="</div>"}else{if(this.reportType=="pivot"){g+='<div id="reportContent" style="height: '+this.height+"; width: "+this.width+'; overflow: hidden; border: solid 0px;">';g+='<div id="reportTitle" style="height: 30; width: '+this.width+'; overflow: hidden; border: solid 0px;"></div>';g+='<div style="overflow-x: scroll; overflow-y:scroll; width: '+(this.width)+"; height: "+(this.height-60)+'; float: left;">';g+='<table id="reportTable" border="0" style="border-collapse:collapse;table-layout:fixed;">';g+="</table>";g+="</div>";g+='<div id="reportFoot" style="height: 30; width: '+this.width+'; overflow: hidden; border: solid 0px;"></div>';g+="</div>"}}$(this.target).append($(g));window.onunload=this.destroy;return this};this.getPageCount=function(h){var g=1037;return Math.ceil(g/h)};this.addReportHeader=function(){$('<table id="report_10010_header" style="font-size:12px;"><tr><td>货主国家</td><td>货主地区</td><td>货主城市</td><td>运货商ID</td><td>运货费</td></tr></table>').appendTo(this.target);return this};this.addReportData=function(g){alert("pageNum:"+g)};this.destroy=function(){f.cacheDataManager.clearCache()};this.show=function(){this.cacheDataManager=new CacheDataManager(this);if(this.reportType=="fast"){var h=this.cacheDataManager.calcReport();if(h==true){h=this.cacheDataManager.getReportInfo();if(h==true){this.rowCount=parseInt((this.height-60-15)/this.cacheDataManager.rowHeight);this.colCount=this.cacheDataManager.width;this.cacheDataManager.deltaSize=this.rowCount*this.cacheDataManager.delta;$(e).css("overflow","hidden");this.setScrollHeight();jsScroll("scrollDiv",15,null,this);var g=this.getScrollPosition();h=this.getTableData(g,this.rowCount);this.createTable(h).createTitle().createFoot()}else{alert("获取报表信息出错！")}}else{alert("计算报表出错！")}}else{if(this.reportType=="pivot"){this.cacheDataManager.calcReport()}else{alert("不支持的报表类型："+this.reportType)}}return this};this.setScrollHeight=function(){$("#scrollDiv").height(this.height-75);document.getElementById("scrollHeight").style.height=Math.max(this.cacheDataManager.reportHeight*this.cacheDataManager.rowHeight,$("#scrollDiv").height())};this.getScrollPosition=function(){return Math.ceil($("#scrollDiv")[0].scrollTop/$("#scrollHeight").height()*this.cacheDataManager.realReportHeight)};this.setWidth=function(g){this.width=g};this.setHeight=function(g){this.height=g};this.getHScrollMaxValue=function(){};this.getVScrollMaxValue=function(){};this.createTable=function(k){var n="";var h=0;var g=0;var m=this.cacheDataManager.css;for(var l=0;l<k.length;l++){h++;if(l%this.colCount==0){if(k[l].rs==0){}n+="<tr>";g++}var p=k[l].fv!=void 0?k[l].fv:k[l].v;if(k[l].h!=void 0){p="<a href='"+k[l].h+"' target='_blank'>"+p+"</a>"}var j="";if(k[l].a=="0"){if(this.reportType=="fast"){j=this.getCellStyle(m.colHeader)}else{if(this.reportType=="pivot"){j=this.getCellStyle(m.corner)}}}else{if(k[l].a=="1"){j=this.getCellStyle(m.colHeader)}else{if(k[l].a=="2"){j=this.getCellStyle(m.rowHeader)}else{if(k[l].a=="3"){if(k[l].no%2==0){j=this.getCellStyle(m.data1)}else{j=this.getCellStyle(m.data2)}}}}}if(k[l].t=="2"){j=this.getCellStyle(m.subSumHeader)}else{if(k[l].t=="3"){j=this.getCellStyle(m.sumHeader)}}if(k[l].bc!=void 0){j+="background-color:"+k[l].bc+";"}if(k[l].c!=void 0){j+="color:"+k[l].c+";"}var o=false;if((k[l].a=="2"&&k[l].t=="1"||k[l].a=="0")&&this.reportType=="fast"&&this.cacheDataManager.groupStyle==1){o=true}var q=true;if(k[l].a=="3"||(this.cacheDataManager.groupStyle==2&&(k[l].a=="2"||k[l].a=="3"))){q=false}n+="<td candblclick='"+o+"' a='"+k[l].a+"' colNum='"+h+"' rb='"+k[l].rb+"' rc='"+k[l].rc+"' s='"+k[l].s+"' dl='"+k[l].dl+"' nm='"+q+"' style='"+j+"' title='"+k[l].tt+"'no='"+k[l].no+"' vi='"+k[l].vi+"'><nobr>"+p+"</nobr></td>";if(l%this.colCount==(this.colCount-1)){h=0;n+="</tr>"}}$("#reportTable").html(n);$("#reportTable td[candblclick='true']").css("cursor","pointer");this.setColWidth();this.setRowHeight();this.mergeCell("reportTable");this.setHeader("reportTable");this.addDoubleClickEvent("reportTable");return this};this.getCellStyle=function(g){var h="";h+="font-family:"+g.fontFamily+";";h+="font-size:"+g.fontSize+";";h+="color:"+g.color+";";h+="font-weight:"+g.fontWeight+";";h+="font-style:"+g.fontStyle+";";h+="text-decoration:"+g.textDecoration+";";h+="text-align:"+g.textAlign+";";h+="vertical-align:"+g.verticalAlign+";";h+="padding-left:"+g.paddingLeft+";";h+="padding-right:"+g.paddingRight+";";h+="padding-top:"+g.paddingTop+";";h+="padding-bottom:"+g.paddingBottom+";";h+="background-color:"+g.backgroundColor+";";h+="border: solid 1px "+g.borderColor+";";h+="indent:"+g.indent+";";return h};this.createTitle=function(){var g=this.cacheDataManager.title;if(this.cacheDataManager.recodePosition=="top"){g+="（记录数："+this.cacheDataManager.recodeCount+"）"}$("#reportTitle").html(g);$("#reportTitle").css(this.cacheDataManager.css.title);return this};this.createFoot=function(){var g=this.cacheDataManager.foot;if(this.cacheDataManager.recodePosition=="bottom"){g+="（记录数："+this.cacheDataManager.recodeCount+"）"}$("#reportFoot").html(g);$("#reportFoot").css(this.cacheDataManager.css.foot);return this};this.setColWidth=function(){if(this.reportType=="fast"){var h=this.cacheDataManager.colWidth.split(",");var k=$("#reportTable tr:last").children("td");var g=0;for(var j=0;j<k.length;j++){var m=($.trim(h[j])==""||h[j]<1)?99:h[j];$(k[j]).width(m);g+=parseInt(m)}$("#reportTable").width(g)}else{if(this.reportType=="pivot"){var l=$.trim(this.cacheDataManager.colWidth)==""?99:$.trim(this.cacheDataManager.colWidth);var k=$("#reportTable tr:last").children("td");var g=0;for(var j=0;j<k.length;j++){$(k[j]).width(l);g+=parseInt(l)}$("#reportTable").width(g)}}};this.setRowHeight=function(){if(this.reportType=="fast"){$("#reportTable td").height(this.cacheDataManager.rowHeight)}else{if(this.reportType=="pivot"){$("#reportTable td").height(this.cacheDataManager.rowHeight)}}};this.addUpDownBtn=function(){$(this.target).append($('<div id="downBtn" onmouseout="mouseOut(this)" onmouseover="mouseOver(this)" onclick="downClick(this)" style="height:15px;  width: 15px; position:absolute; right:0px;bottom:25px;background-image: url('+b+'/mis2/vrsr/show/images/down.jpg);"></div>'));$(this.target).append($('<div id="upBtn" onmouseout="mouseOut(this)" onmouseover="mouseOver(this)" onclick="upClick(this)" style="height:15px; width: 15px; position:absolute; right:0px;top:85px;background-image: url('+b+'/mis2/vrsr/show/images/up.jpg);"></div>'))};this.mergeCell=function(k){var g=$("#"+k+" tr").length;var j=$("#"+k+" tr").eq(0).children().length;if(this.reportType=="fast"){for(var h=1;h<=j;h++){mergeFastReportRow(k,h)}for(var h=1;h<=g;h++){mergeFastReportCol(k,h,j)}}else{if(this.reportType=="pivot"){for(var h=1;h<=j;h++){mergePivotReportRow(k,h)}for(var h=1;h<=g;h++){mergePivotReportCol(k,h,j)}}}};this.setHeader=function(g){if(this.reportType=="pivot"){$("#"+g+" tr:first td:first").html('<img src="http://localhost:8086/ShowFastPivot/reportServlet?action=9&graphId='+this.cacheDataManager.headerId+'"/>')}};this.addDoubleClickEvent=function(g){if(this.reportType=="fast"){$("#"+g+" td[candblclick=true]").dblclick(function(){if(this.a==2){foldorunfold(this,f)}else{if(this.a==0){foldorunfoldAll(this,f)}}})}};this.getDistinctData=function(j,k){var m=this.cacheDataManager.getData(j,k);for(var h=0;h<m.length/this.colCount;h++){var g=this.tableData.slice(this.tableData.length-this.colCount,this.tableData.length);var l=m.slice(h*this.colCount,(h+1)*this.colCount);if(this.equals(g,l)){}else{this.tableData=this.tableData.concat(l);k--}j++}if(j>=this.cacheDataManager.reportHeight){k=0}if(k==0){return}else{this.getDistinctData(j,k)}};this.equals=function(j,k){if(j==null||j.length<k.length){return false}var h=0;for(var g=0;g<k.length;g++){if(k[g].v==j[g].v){h++}else{break}}return h==k.length};this.getTableData=function(g,h){return this.cacheDataManager.getDataFromServer(g,h)}};function toString(c){var a="";for(var b=0;b<c.length;b++){a+=c[b].v;if(b<c.length-1){a+=","}}return a}function mergeFastReportRow(e,b){var d="";var a="";var c=0;$("#"+e+" tr td:nth-child("+b+")").each(function(f){if(f==0){d=this;c=1}else{a=this;if($(a).attr("nm")=="true"){if($(d).text()==$(a).text()&&$(d).attr("dl")==$(a).attr("dl")&&$.trim($(a).text())!=""){c++;$(a).hide();$(d).attr("rowSpan",c)}else{d=this;c=1}}}})}function mergeFastReportCol(f,c,b){if(b==void 0){b=0}var e="";var a="";var d=0;$("#"+f+" tr:nth-child("+c+")").each(function(g){$(this).children().each(function(h){if(h==0){e=this;d=1}else{if((b>0)&&(h>b)){return""}else{a=this;if($(a).attr("nm")=="true"){if($(e).text()==$(a).text()&&$(e).attr("title")==$(a).attr("title")||$.trim($(a).text())==""){d++;$(a).hide();$(e).attr("colSpan",d)}else{e=this;d=1}}}}})})}function mergePivotReportRow(e,b){var d="";var a="";var c=0;$("#"+e+" tr td:nth-child("+b+")").each(function(f){if(f==0){d=this;c=1}else{a=this;if($(a).attr("nm")=="true"){if(($.trim($(a).text())==""&&$(d).attr("title")!=$(a).attr("title"))||($(d).text()==$(a).text()&&$(d).attr("title")==$(a).attr("title"))){c++;$(a).hide();$(d).attr("rowSpan",c)}else{d=this;c=1}}}})}function mergePivotReportCol(f,c,b){if(b==void 0){b=0}var e="";var a="";var d=0;$("#"+f+" tr:nth-child("+c+")").each(function(g){$(this).children().each(function(h){if(h==0){e=this;d=1}else{if((b>0)&&(h>b)){return""}else{a=this;if($(a).attr("nm")=="true"){if(($.trim($(a).text())==""&&$(e).attr("title")!=$(a).attr("title"))||($(e).text()==$(a).text()&&$(e).attr("title")==$(a).attr("title"))){d++;$(a).hide();$(e).attr("colSpan",d)}else{e=this;d=1}}}}})})}function foldorunfold(e,a){var c=$(e).attr("s");if(c==0){a.cacheDataManager.unfold(e)}else{if(c==1){a.cacheDataManager.fold(e)}}var b=a.getScrollPosition();var d=a.getTableData(b,a.rowCount);a.createTable(d)}function foldorunfoldAll(e,a){var c=$(e).attr("s");if(c==0){a.cacheDataManager.unfoldAll(e)}else{if(c==1){a.cacheDataManager.foldAll(e)}}var b=a.getScrollPosition();var d=a.getTableData(b,a.rowCount);a.createTable(a.tableData)}function mouseOver(a){a.style.backgroundColor="red"}function upClick(a){}function mouseOut(a){$(a).css("backgroundColor","white")}function downClick(a){}function Fadein(){$("#scrollBar").show()}function Fadeout(){$("#scrollBar").hide()}function foldClick(c,b){var a=parseInt(c.colNum)-1;if(b.foldState[a]==0){b.foldState[a]=1}else{b.foldState[a]=0}};