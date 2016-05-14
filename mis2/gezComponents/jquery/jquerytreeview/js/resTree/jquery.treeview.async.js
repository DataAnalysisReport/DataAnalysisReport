/*
 * Async Treeview 0.1 - Lazy-loading extension for Treeview
 * 
 * http://bassistance.de/jquery-plugins/jquery-plugin-treeview/
 *
 * Copyright (c) 2007 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

;(function($) {
	var modules=[
		'/mis2/gezComponents/jsUtils/json2.js'	
	];
	rqLoadJS(modules);
var i=0;
function load(settings, root, child, container,settdata) {
	if(i!=0){//初始加载时显示根目录，之后点击三角打开下一层时不用返回根目录了
		settings.ajax.data.includeRootID="false";
	}
	i++;
	function createNode(parent) {
		//var current = $("<li/>").attr("id", this.id || "").html("<span>" + this.text + "</span>").appendTo(parent);
		//span 自己代码里拼写，这里就是li直接带传来的文字
		var current = $("<li/>").attr("id", this.id || "").html(this.text).appendTo(parent);
		if (this.classes) {
			current.children("span").addClass(this.classes);
		}
		if (this.expanded) {
			current.addClass("open");
		}
		if (this.hasChildren || this.children && this.children.length) {
			var branch = $("<ul/>").appendTo(current);
			if (this.hasChildren) {
				current.addClass("hasChildren");
				createNode.call({
					classes: "placeholder",
					text: "&nbsp;",
					children:[]
				}, branch);
			}
			if (this.children && this.children.length) {
				$.each(this.children, createNode, [branch])
			}
		}
	}
	
	//历史查询时的名称长度最长为10，超过10时取10个+...
	function autoSubstring(str){
		if(str.length <= 10){
			return str;	
		}else{
			return str.substring(0,10) + "···";
		}
	}
	var multiSelect=settings.ajax.data.isMultiSelect;
	$.ajax($.extend(true, {
		url: settings.url,
		dataType: "text",
		data: {
			root: root
		},
		success: function(response) {
			//根据数据源和模式过滤数据表
			var nodeData=eval(response);
			var newData=[];
            if(settings.customResFilter && typeof settings.customResFilter != "undefined"){//根据自定义过滤条件，对资源进行过滤
                var customResFilter = settings.customResFilter;
                try{customResFilter = eval('(' + customResFilter + ')');}catch(e){}
                for(var i=0;i<nodeData.length;i++){//遍历返回的树节点json
					var filterResult = true;//过滤标识
					var nodeJson = nodeData[i];
					try{nodeJson = JSON.parse(nodeJson);}catch(e){}
					if(nodeJson["ng"] != "256" && typeof customResFilter == "object"){
						for(var filter in customResFilter){//遍历自定义遍历条件
							if(filter == "resID" && customResFilter[filter]){//根据资源ID进行过滤,多个资源ID用英文逗号隔开
								var resIdArr = customResFilter["resID"].split(",");
								if($.inArray(nodeJson["nid"],resIdArr) == -1){//不符合
									filterResult = false;
								}
							}else if(filter == "resJson"  && customResFilter[filter]){//根据resJson内的属性进行过滤，主要针对数据集、数据表等
								var filterJson = customResFilter["resJson"];
								try{filterJson = JSON.parse(filterJson);}catch(e){}
								if(nodeJson["resJson"] != "null" && typeof filterJson == "object"){
									var resJson = nodeJson["resJson"];
									try{resJson = JSON.parse(resJson);}catch(e){}
									for(var resProp in filterJson){//遍历设置的resJson条件进行过滤
										if(filterJson[resProp] != resJson[resProp]){//不符合
											filterResult = false;
										} 
									}
								}
							}
						}
					}
					if(filterResult){
						newData.push(nodeData[i]);
					}
                }
            }else{
                for(var i=0;i<nodeData.length;i++){
				    if(nodeData[i].ng==10023 && nodeData[i].resJson!=null && nodeData[i].resJson!="" && nodeData[i].resJson!="null"){
					    var dataInfo=JSON.parse(nodeData[i].resJson);
					    if(settings.dataSourceName!="undefined" && settings.dataSourceName!="null" && settings.dataSourceName && settings.dataSourceSchema && settings.dataSourceSchema!="undefined"){//数据源及模式都不为空
						    if(dataInfo.dataSourceName==settings.dataSourceName && dataInfo.modelName==settings.dataSourceSchema){
							    newData.push(nodeData[i]);
						    }else{
							    continue;
						    }	
					    }else if((settings.dataSourceName!="undefined" && settings.dataSourceName) && !(settings.dataSourceSchema && settings.dataSourceSchema!="undefined")){//数据源不为空，模式为空
						    if(dataInfo.dataSourceName==settings.dataSourceName){
							    newData.push(nodeData[i]);
						    }else{
							    continue;
						    }	
					    }else if(!(settings.dataSourceName!="undefined" && settings.dataSourceName) && (settings.dataSourceSchema && settings.dataSourceSchema!="undefined")){//数据为空，模式不为空
						    if(dataInfo.dataSourceSchema==settings.dataSourceSchema){
							    newData.push(nodeData[i]);
						    }else{
							    continue;
						    }	
					    }else{//不验证
						    newData.push(nodeData[i]);
					    }		
				    }else{
					    if(nodeData[i].ng==10023 && nodeData[i].resJson=="null"){
						    continue;
					    }
					    //过滤数据集类型
					    if(nodeData[i].ng==10024 && settings.dataSetType!="undefined" && settings.dataSetType!="null" && settings.dataSetType && nodeData[i].resJson){
						    var dsType=JSON.parse(nodeData[i].resJson).dataSetType;//要显示的数据集类型;
						    var dstArr=settings.dataSetType.split(";");
						    if($.inArray(dsType, dstArr)==-1){
							    continue;
						    }
					    }
					    newData.push(nodeData[i]);
				    }
			    }
            }

			response=JSON.stringify(newData);
			response = eval("(" +response+ ")");
			//接收到后台传来的简化json，然后添加Html代码
			$.each(response,function(i,eveValue){
				if(eveValue.treeType != "db"){
					var clickString = "";
					var favoritNodeHeight = "";
					if(typeof(eveValue.md) != "undefined" && eveValue.md != "" && eveValue.md == "favorit"){
						favoritNodeHeight = "30px";
					}
					var textJsonone = "<span id=\"rqtreespan_"+eveValue.nid+"\" style=\""+favoritNodeHeight+"\" fatherId=\""+eveValue.fid+"\" isLeaf=\""+!this.hasChildren+"\" resType=\""+eveValue.ng+"\" realvalue=\""+eveValue.nid+"\" dispvalue=\""+eveValue.text+"\"";
					if(!eveValue.sec){
						var textJsontwo =  " onclick='singleNodeClick(\""+eveValue.nid+"\",\"rqtreespan_"+eveValue.nid+"\");'";
 			    		textJsonone = textJsonone.concat(textJsontwo);
 			    	}
 			    	var textJsonthree = ">";
 			    	var textJsonfour = "";
					if(eveValue.sec){
						var base64 = new Base64();
						var checkStr = eveValue.nc=="true"?" checked=\"checked\"":"";
						textJsonfour = "<input name=\"treeView\" id=\""+eveValue.nid+"\"  nodeType=\"" +eveValue.ng + "\" nodeName=\"" + base64.encode(eveValue.text) + "\" type=\"checkbox\" \""+checkStr+"\" value=\""+eveValue.nid+"\" "+
									   " onclick='selectAllChildrenChecked(\""+eveValue.nid+"\");' "+
									   ">&nbsp;</input>";
					}
					var className = "folder";
					if(!eveValue.hasChildren){
						className = "resource";
					}
					if(eveValue.nt!=null && eveValue.nt!=""){
						if(eveValue.nt=="1"){
							className = "folder";
						}else if(eveValue.nt=="2"||eveValue.nt=="3"){
							className = "resource";
						}
					}
					if(eveValue.ish == "true"){
						//给节点加上自定义click事件
						if(settings.onclick == undefined || settings.onclick == "" ||settings.onclick == null) {
							clickString = ""
						} else {
							var arr = settings.onclick.split(",");
							var clickMethodName = "";
							for(var i=0;i<arr.length;i++){
								/**
								 * 由于下拉树弹出到了本域顶层，因此需要重新查找树节点的单击方法
								 * 由于目前只发现资源另存为时会出现此问题，故对此处的回调函数进行了判断
								 * 其他地方若有同样的问题可将此处判断去掉即可
								 */
								if(arr[i]=="setValue"  && !$.browser.msie){
									if(getDomainTop(window).document.getElementsByTagName('iframe').length==3){
										clickMethodName += "getDomainTop(window).document.getElementsByTagName('iframe')[2].contentWindow.document.getElementsByTagName('iframe')[1].contentWindow.document.getElementsByTagName('iframe')[2].contentWindow." + arr[i] + "(this);";
									}else{
										clickMethodName += "getDomainTop(window).document.getElementsByTagName('iframe')[1].contentWindow"  //找到contentFrame
                                                +".document.getElementsByTagName('iframe')[1].contentWindow"    //找到resourceExplore
                                                +".document.getElementsByTagName('iframe')[1].contentWindow"    //找到resourceListFram
                                                +".document.getElementsByTagName('iframe')[2].contentWindow." + arr[i] + "(this);";//找到另存为iframe
									}
                                }else{
                                	clickMethodName += arr[i] + "(this);";
                                }
								
							}
							clickString  = "onclick=\""+(multiSelect=="true"?"selectAllChildrenChecked('"+eveValue.nid+"','text');":"") + clickMethodName + "\"";
						}
						//给节点加上自定义dbclick事件
						if(settings.ondblclick == undefined || settings.ondblclick == "" || settings.ondblclick == null){
							ondblclickString = "";
						} else {
							var dblclickarr = settings.ondblclick.split(",");
							var dblclickMethodName = "";
							for(var j=0;j<dblclickarr.length;j++){
								dblclickMethodName += dblclickarr[j]+ "(this);";
							}
							ondblclickString  = "ondblclick=\"" + dblclickMethodName + "\"";
						}
						//给节点加上自定义onmouseover事件
						if(settings.onmouseover == undefined || settings.onmouseover == "" || settings.onmouseover == null){
							onmouseoverString = "";
							
						} else {
							var mouseoverarr = settings.onmouseover.split(",");
							var mouseoverMethodName = "";
							for(var j=0;j<mouseoverarr.length;j++){
								mouseoverMethodName += mouseoverarr[j]+ "(this);";
							}
							onmouseoverString  = "onmouseover=\"" + mouseoverMethodName + "\"";
						}
						//给节点加上自定义onmouseout事件
						if(settings.onmouseout == undefined || settings.onmouseout == "" || settings.onmouseout == null){
							onmouseoutString = "";
							
						} else {
							var mouseoutarr = settings.onmouseout.split(",");
							var mouseoutMethodName = "";
							for(var j=0;j<mouseoutarr.length;j++){
								mouseoutMethodName += mouseoutarr[j]+ "(this);";
							}
							onmouseoutString  = "onmouseout=\"" + mouseoutMethodName + "\"";
						}
						if(eveValue.nt=="3"){
							var iconStr = IconFactory.getIcon("gezico_p_renyuanjuese");
						}else if(eveValue.nt=="2"&&eveValue.ng!=-1){
							var iconStr = IconFactory.getIcon("gezico_p_ziyuanwenjian");
							iconStr = iconStr.replace(/\">/g,'" style="font-size:14px;">')
						}else{
							var iconStr = IconFactory.getIcon("gezico_p_ziyuanzhongxinwenjianjiazhedie");
						}
						var realName="";
						var nodeTitle=eveValue.text;
						//数据集和数据表的title数据源信息显示
						if(eveValue.ng==10023 && eveValue.resJson!="null"){
							if(eveValue.resJson){
								realName=JSON.parse(eveValue.resJson).tableName;
								nodeTitle="数据源："+JSON.parse(eveValue.resJson).dataSourceName+"\n模式："+JSON.parse(eveValue.resJson).modelName+"\n数据表名称："+JSON.parse(eveValue.resJson).tableName;
							}
						}else if(eveValue.ng==10024 && eveValue.resJson!="null"){
							if(eveValue.resJson){
								nodeTitle="数据源："+JSON.parse(eveValue.resJson).dataSourceName+"\n数据集名称："+JSON.parse(eveValue.resJson).dataSetName;
							}
						}
						var textJsonfive = "<span id='folder' module=\""+eveValue.md+"\" resType=\""+eveValue.ng+"\" style=\"display:inline-block;overflow:hidden;\">"+
                                       (eveValue.cid=="resTree" && eveValue.sec && eveValue.ng!=256?"":iconStr+
								   	   "<span style='margin-left:15px'>&nbsp</span>")+"</span>"+
								       "<span style=\"display:inline-block;overflow:hidden;"+(parseInt($.browser.version)<9?"height:23px;":"")+"\">"+
								       "<div style=\"display: inline; vertical-align:bottom;line-height:14px;\">"+
								       "<div style=\"display: inline;\" onclick=\"changeStyle(this);\">"+
									   "<span id=\""+eveValue.nid+"\" style=\"display: inline;cursor:pointer;\" name=\""+eveValue.text+"\" tar=\""+eveValue.na+"\" "+
									   " resType=\""+eveValue.ng+"\" type=\"" +eveValue.ng+"\" openWith=\""+eveValue.nd+"\" url=\""+eveValue.nf+"\" resName=\""+eveValue.text+"\" "+
									   " appontid=\"0\" useTab=\""+eveValue.nb+"\" realName=\""+realName+"\" title=\""+nodeTitle+"\" " + clickString + ondblclickString + onmouseoverString + onmouseoutString +" >"+
								       eveValue.text+
								       "</span>"+
								       "</div>"+
								       "</div>"+
								       "</span>";
					}else{
					
						//给节点加上自定义click事件
						if(settings.onclick == undefined || settings.onclick == "" ||settings.onclick == null) {
							clickString = ""
						} else {
							var arr = settings.onclick.split(",");
							var clickMethodName = "";
							for(var i=0;i<arr.length;i++){
								clickMethodName += arr[i]+ "(this);";
							}
							clickString  = "onclick=\"" + clickMethodName + "\"";
						}
						//给节点加上自定义dbclick事件
						if(settings.ondblclick == undefined || settings.ondblclick == "" || settings.ondblclick == null){
							ondblclickString = "";
						} else {
							var dblclickarr = settings.ondblclick.split(",");
							var dblclickMethodName = "";
							for(var j=0;j<dblclickarr.length;j++){
								dblclickMethodName += dblclickarr[j]+ "(this);";
							}
							ondblclickString  = "ondblclick=\"" + dblclickMethodName + "\"";
						}
						//给节点加上自定义onmouseover事件
						if(settings.onmouseover == undefined || settings.onmouseover == "" || settings.onmouseover == null){
							onmouseoverString = "";
							
						} else {
							var mouseoverarr = settings.onmouseover.split(",");
							var mouseoverMethodName = "";
							for(var j=0;j<mouseoverarr.length;j++){
								mouseoverMethodName += mouseoverarr[j]+ "(this);";
							}
							onmouseoverString  = "onmouseover=\"" + mouseoverMethodName + "\"";
						}
						//给节点加上自定义onmouseout事件
						if(settings.onmouseout == undefined || settings.onmouseout == "" || settings.onmouseout == null){
							onmouseoutString = "";
							
						} else {
							var mouseoutarr = settings.onmouseout.split(",");
							var mouseoutMethodName = "";
							for(var j=0;j<mouseoutarr.length;j++){
								mouseoutMethodName += mouseoutarr[j]+ "(this);";
							}
							onmouseoutString  = "onmouseout=\"" + mouseoutMethodName + "\"";
						}
						if(typeof(eveValue.md) != "undefined" && eveValue.md != "" && eveValue.md == "favorit"){
							var favoritName = autoSubstring(eveValue.text);
							var titleHTML = eveValue.text.length > (favoritName.replace("···","").length) ? "title=\""+eveValue.text+"\"" : "";
							var iconStr = IconFactory.getIcon("gezico_p_ziyuanzhongxinwenjianjiazhedie");
							textJsonfive = "<span id=\"folder\" "+titleHTML+"  module=\""+eveValue.md+"\" resType=\""+eveValue.ng+"\" style=\"display:inline-block;overflow:hidden;\">"+iconStr+
									   "<span style='margin-left:15px'>&nbsp</span></span>"+
									   "<span resType=\""+eveValue.ng+"\" allname=\""+eveValue.text+"\" style=\"display:inline-block;overflow:hidden;\"  " + clickString + ondblclickString + onmouseoverString + onmouseoutString +">"+
									   favoritName+
									   "</span>";
						}else{
							var iconStr = IconFactory.getIcon("gezico_p_ziyuanzhongxinwenjianjiazhedie");
							textJsonfive = "<span id=\"folder\" style=\"display:inline-block;overflow:hidden;\">"+iconStr+
									   "<span style='margin-left:15px'>&nbsp</span></span>"+
									   "<span style=\"display:inline-block;overflow:hidden;"+(multiSelect && parseInt($.browser.version)<9?"height:20px;":"")+"\"  " + clickString + ondblclickString + onmouseoverString + onmouseoutString +">"+
									   eveValue.text+
									   "</span>";
						}
					}
					eveValue.text = textJsonone.concat(textJsonthree,textJsonfour,textJsonfive);
				}
			})
			child.empty();
			$.each(response, createNode, [child]);
	        $(container).treeview({add: child});
	        if(("bindCheckEvent" in window)){
	        	bindCheckEvent();
	        }

	        try{
                var func = eval(settings.reverserFunction);
               setTimeout(new func(), 1000);
	        }catch(e){
	        }
	    }
	}, settings.ajax));
	/*
	$.getJSON(settings.url, {root: root}, function(response) {
		function createNode(parent) {
			var current = $("<li/>").attr("id", this.id || "").html("<span>" + this.text + "</span>").appendTo(parent);
			if (this.classes) {
				current.children("span").addClass(this.classes);
			}
			if (this.expanded) {
				current.addClass("open");
			}
			if (this.hasChildren || this.children && this.children.length) {
				var branch = $("<ul/>").appendTo(current);
				if (this.hasChildren) {
					current.addClass("hasChildren");
					createNode.call({
						classes: "placeholder",
						text: "&nbsp;",
						children:[]
					}, branch);
				}
				if (this.children && this.children.length) {
					$.each(this.children, createNode, [branch])
				}
			}
		}
		child.empty();
		$.each(response, createNode, [child]);
        $(container).treeview({add: child});
    });
    */
}

var proxied = $.fn.treeview;
$.fn.treeview = function(settings) {
	if (!settings.url) {
		return proxied.apply(this, arguments);
	}
	var container = this;
	var settfn = settings.onclick;
	
	if (!container.children().size()){
		if(settings.root==null || settings.root==""){
			load(settings, "source", this, container,settfn);
		}else{
			load(settings, settings.root, this, container,settfn);
		}
	}
	var userToggle = settings.toggle;
	return proxied.call(this, $.extend({}, settings, {
		collapsed: true,
		toggle: function() {
			var $this = $(this);
			if(typeof(settings.ajax.data.treeviewclass) != "undefined" && (settings.ajax.data.treeviewclass == "commomQueryAsyncTreeView" || settings.ajax.data.treeviewclass == "onceLoadAsyncTree")){
			  // findParentsValue方法移至rqtree.js
				var parentsValue = findParentsValue($(this), "");
				var base64 = new Base64();
				parentsValue != "" ? (settings.ajax.data.parentsValue = base64.encode(parentsValue)) : (settings.ajax.data.parentsValue = "");
				
				//下拉树父节点唯一标志
				var parentsNodeIndex = findParentsNodeIndex($(this), "");//$(this).find("span").eq(0).attr("parentNodeIndex")
				settings.ajax.data.parentsNodeIndex = typeof(parentsNodeIndex) == "undefined" ? "" : parentsNodeIndex;
				var rootValue = $(this).find("span").eq(0).attr("realvalue");
				settings.ajax.data.rootValue = base64.encode(rootValue);
			}
			
			if ($this.hasClass("hasChildren")) {
				var childList = $this.removeClass("hasChildren").find("ul");
				// load(settings, this.id, childList, container,settfn);
				/*此处由于编辑风格处获取真实值会出现jQuery无法解析的特殊字符，故此将id值变成了唯一标志
				 *为兼容之前的通用树，将id的获取方法有this.id改为拼接currNodeLevel+"_"+$(this).find("span").eq(0).attr("realvalue")
				 */
				var currNodeLevel=this.id.split("_")[0];
				load(settings, currNodeLevel+"_"+$(this).find("span").eq(0).attr("realvalue"), childList, container,settfn);
			}
			if (userToggle) {
				userToggle.apply(this, arguments);
			}
		}
	}));
	
	/**
	 * 递归查找节点父节点的唯一值
	 */
	function findParentsNodeIndex(obj, parentsNodeIndex){
		//var parentTitle = obj.children().eq(1);
		var parentTitle = obj.children().eq(0).attr("class") == "treeNodebgDiv" ?  obj.children().eq(2) : obj.children().eq(1);
		if(parentTitle && parentTitle[0].nodeName.toUpperCase() == "SPAN" && typeof(parentTitle.attr("treeNodeIndex")) != "undefined"){
			parentsNodeIndex = parentTitle.attr("treeNodeIndex") + parentsNodeIndex;
			return findParentsNodeIndex(obj.parent().parent(), parentsNodeIndex);
		}else{
			return parentsNodeIndex;
		}
	}
};

})(jQuery);