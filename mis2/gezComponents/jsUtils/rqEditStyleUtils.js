//当前编辑风格未重置前在当前窗口的top,当滚动条滚动使编辑风格超出此区域时将其隐藏
var curWinElementTop = 0;
//当前编辑风格所在窗口的外边界
var curWinMarginTop = 0;
//当前风格的配置项
var curStyleSetings = {};

/** 自动计算弹出层的位置
 *@popElement 弹出层的对象
 *@absElement 位置固定的元素
 */
function autoPosition(popElement, absElement, settings){
	  curWinElementTop = parseInt($(popElement).css("top"));
	  getCurWinMarginTop(absElement);
	  var domainTop = getDomainTop(window);
	  curStyleSetings = settings;
	  if(typeof(curStyleSetings) != "undefined"){
	  	curStyleSetings.curWindow = domainTop;
	  }
	  var objName = $('#ui-datepicker-div').find(".ui-datepicker-prev").attr("onclick");
	  try{
	  	  if(typeof(objName)!='undefined'){
	  	  	  objName = objName.substring(0,objName.indexOf(".datepicker"));
	  	  	  domainTop.window[objName] = window[objName];
	  	  }
	  }catch(e){}  
	  if(domainTop.document.domain != window.document.domain){
	  	  return;
	  }
	  
	  setElementPosition(popElement, absElement, domainTop, settings);
	  if($.browser.version!=6.0 && $.browser.version!=7.0){
		//填报中的如果已有日历的div则将其删除
		if($('#ui-datepicker-div',domainTop.document).length > 0 && $('#ui-datepicker-div',domainTop.document).text() == ''){
			domainTop.$('#ui-datepicker-div').remove();
		}
		
		if($("body",domainTop.document).length > 0){
			$("body",domainTop.document).append(popElement);
		}else{
			$("html",domainTop.document).append(popElement);
		}
		//顶层页面有下拉日历并且弹出层有下拉日历时，会有两个日历div
		if($(".ui-datepicker",domainTop.document).length > 1){
			$(".ui-datepicker",domainTop.document).each(function(index,element){
				if(index < ($(".ui-datepicker",domainTop.document).length - 1)){
					$(element).remove();
				}
			});
		}
	  }
	 
	  
	 
	  return domainTop;
}

// 当前编辑风格所在窗口的外边界
function getCurWinMarginTop(absElement){
	var absElementHeight = $(absElement).outerHeight();//获取absElement元素高度
	var absPosition = getAbsolutePosition(absElement,window);  
	var absTop = absPosition.top;//获取absElement元素绝对y坐标
	//输入框绝对top+高度-当前窗口元素的top就是当前窗口外边界
	curWinMarginTop = absTop + absElementHeight - curWinElementTop;
}

//设置元素的位置
function setElementPosition(popElement, absElement, domainTop, settings, scrollFlag){
	  var windowHeight = $(domainTop).height();//获取当前窗口可视区域高度 
	  var windowWidth = $(domainTop).width();//获取当前窗口
	  
	  var absElementHeight = $(absElement).height()+1;//获取absElement元素高度  +1是为了让弹出框上边线刚好与元素下边线重合
	  var absElementWidth = $(absElement)[0].offsetWidth;//获取absElement元素宽度  由  .width()换位 [0].offsetWidth,这里是为了考虑上输入框边框以及内填充
	  settings.absElementHeight = absElementHeight;
	  settings.absElementWidth = absElementWidth;
	  //此处去下拉框在当前窗口的positon,因为在Close方法中鼠标事件的坐标获取的只是当前窗口的（暂时方案）
	  settings.absPosition = $(absElement).offset();
	  
      var absPosition = getAbsolutePosition(absElement,window);  
	  var absLeft = absPosition.left;//获取absElement元素绝对x坐标
	  var absTop = absPosition.top;//获取absElement元素绝对y坐标
	  var absRight = windowWidth - absElementWidth - absLeft;//元素右侧的像素大小
	  var absBottom = windowHeight - absElementHeight - absTop;//元素下侧的像素
	  
	  var popHeight = parseInt($(popElement[popElement.length-1]).height());//popElement的高度
	  var popWidth = parseInt($(popElement[popElement.length-1]).width());//popElement的宽度
	  	  
	  var popTop = parseInt($(popElement).css("top"));//popElement的top
	  var popLeft = parseInt($(popElement).css("left"));//popElement的left
	  
	  var firstHeight = $(popElement).data("firstHeight");
	  var newHeight = popHeight;
	  if(typeof(firstHeight) != 'undefined'){
	  	  //newHeight = parseInt(firstHeight);
	  }else{
	  	  //$(popElement).data("firstHeight",popHeight);
	  }
	  $(popElement).css({"overflow-y":""});//重置滚动条
	  scrollFlag = typeof(scrollFlag) != "undefined" ? scrollFlag : false;
	  if(absBottom < newHeight && absTop > newHeight){//如果absElement元素下方高度小于popElement高度，并且上方高度大于popElement高度
	  	  var newTop = absTop - popHeight;
	  	  // 滚动未超出时才重置，如果不是滚动时则直接重置
	  	  if(!scrollFlag){
	  	  	$(popElement).css({top: newTop + "px",left:absLeft + "px",height:newHeight + "px"});//此时left与输入框保持一致
	  	  }else if(notBeyondCurWin(newTop) && scrollFlag){
	  	  	$(popElement).css({top: newTop + "px",left:absLeft + "px",height:newHeight + "px"});//此时left与输入框保持一致
	  	  }
	  }else if(absBottom < newHeight && absTop < newHeight){//如果absElement元素上方和下方高度均小于popElement高度
	  	  var newTop = 0;
	  	  var newLeft = absLeft + absElementWidth;;
	  	  if(windowHeight <= newHeight){//如果窗口高度小于弹出框高度
	  	      newHeight = windowHeight;
	  	      $(popElement).css({"overflow-y":"scroll"});//此时弹出框给纵向滚动
	  	  }else{
	  	  	  newTop = (windowHeight - newHeight)/2;
	  	  	  if(absTop <= newTop){//absElement的top小于newTop时，使用absElement的top
	  	  	      newTop = absTop;
	  	  	  }
	  	  }
	  	  // 滚动未超出时才重置，如果不是滚动时则直接重置
	  	  if(!scrollFlag){
	  	  	$(popElement).css({top:newTop + "px",left:newLeft + "px",height:newHeight + "px"});
	  	  }else if(notBeyondCurWin(newTop) && scrollFlag){
	  	  	$(popElement).css({top:newTop + "px",left:newLeft + "px",height:newHeight + "px"});
	  	  }
	  }else{
	  	  var newTop = absTop + absElementHeight;
	  	  // 滚动未超出时才重置，如果不是滚动时则直接重置
	  	  if(!scrollFlag){
		  	  // 输入框右侧宽度+输入框宽度小于弹出层宽度时，右侧放不下，所以此时将弹出层放到左侧
		  	  if((absRight+absElementWidth) < popWidth){
		  	  	$(popElement).css({top:newTop + "px",left:(absLeft + absElementWidth - popWidth)  + "px",height:newHeight + "px"});//此时left与输入框保持一致
		  	  }else{
		  	  	$(popElement).css({top:newTop + "px",left:absLeft + "px",height:newHeight + "px"});//此时left与输入框保持一致
		  	  }
	  	  }else if(notBeyondCurWin(newTop) && scrollFlag){
		  	  // 输入框右侧宽度+输入框宽度小于弹出层宽度时，右侧放不下，所以此时将弹出层放到左侧
		  	  if((absRight+absElementWidth) < popWidth){
		  	  	$(popElement).css({top:newTop + "px",left:(absLeft + absElementWidth - popWidth)  + "px",height:newHeight + "px"});//此时left与输入框保持一致
		  	  }else{
		  	  	$(popElement).css({top:newTop + "px",left:absLeft + "px",height:newHeight + "px"});//此时left与输入框保持一致
		  	  }
	  	  }
	  }
	  $(popElement).css("z-index","9999");
}

//判断是否超出当前窗口，当滚动条滚动使编辑风格超出此区域时将其隐藏
function notBeyondCurWin(popTop){
	  if(popTop != curWinElementTop && (popTop - curWinMarginTop) <= 0){
	  	//popElement.hide();
	  	var style = typeof(curStyleSetings) != "undefined" && typeof(curStyleSetings.editStyleComponentClass) != "undefined" ? curStyleSetings.editStyleComponentClass : "";
	  	//$("#topLeft").append(style);
	  	// 不同编辑风格调用该风格的关闭方法，某些特殊的直接hide(下拉日历本身就是隐藏，故也按特殊处理)
	  	if(style=="com$runqianapp$gezComponents$editStyle$ListComponent"){//下拉列表和下拉数据集
	  		var curElementId = curStyleSetings.inputObj.attr("id");
	  		$("#"+curElementId).destroyDropDown(curStyleSetings);
	  		//curStyleSetings.txtid不等空表示通用查询 这时候选择图标不删除
	  		typeof(curStyleSetings.txtid) != "undefined" && curStyleSetings.txtid != "" ? "" : $('#'+curElementId).destroySelect();
	  	}else if(style=="com$runqianapp$gezComponents$editStyle$TreeComponent"){//下拉树
	  		domainTop.closeRqTreeDialog();
	  	}else{
	  		//下拉日历单独处理
	  		var styleElement = typeof(curStyleSetings) != "undefined" && typeof(curStyleSetings.datepicker) != "undefined" ? curStyleSetings.datepicker : null;
	  		if(styleElement != null){
	  			styleElement._hideDatepicker();
	  		}else{
	  			if(typeof popElement!="undefined" && popElement!=null && popElement!='undefined'){
	  				popElement.hide();
	  			}
	  		}
	  	}
	  	return false;
	  }
	  return true;
}

/**
  * 获取鼠标相对于顶层窗口的绝对位置
  */
function getMouseAbsolutePosition(event,win){
	evt = event || win.event;
	
	//鼠标目标元素
	var targetElement = evt.target || evt.srcElement;
	//鼠标目标元素绝对位置
	var absTargetPosition = getAbsolutePosition(targetElement,win);
	//鼠标目标元素当前窗口绝对位置
	var targetPostion = $(targetElement,win.document).offset();
	//鼠标所在窗口的位置
	var mX = parseInt(evt.pageX || evt.clientX);
	var mY = parseInt(evt.pageY || evt.clientY);	
	//鼠标相对于顶层窗口的绝对位置
	mX = parseInt(absTargetPosition.left) - parseInt(targetPostion.left) + mX;
    mY = parseInt(absTargetPosition.top) - parseInt(targetPostion.top) + mY;
	
	return {"mX":mX,"mY":mY};
}

/**
 * 获取目标元素在整个页面中的绝对位置
 * @param item 要获取的页面
 * @param win 元素所在窗口对象
 * @param st scrollTop
 * @param sl scrollLeft
 */
function getAbsolutePosition(item, win,st, sl) {
	if(!st){
		st=0;
	}
	if(!sl){
	    sl = 0;    
	}
	// 拿到目标元素在当前窗口的位置
	var off = $(item).offset();
	var l = off.left;
	var t = off.top;
	//如果页面有frameset，则left和top的计算都要加3px
	if($("frameset",win.document).length > 0){
	    l += 3;
	    t += 3;
	}
	// 对于非顶级窗口
	// 获取当前窗口所属的frame/iframe，在父窗口的位置，并累加
	// 一直递归到顶级窗口为止
	
	/** 处理跨域情况下js调用报错问题 **/
	var _top = win.top;
	try{_top = CommonUtils.RQTop();}catch(e){_top = win.top}
	/** end **/
	
	if(win != _top) {
		//if(win.location.href.indexOf('LoginServlet')<0){
		try{
			var frm = win.frameElement;
			if(frm == null) {
				// 找不到
				// 理论上不会走到这里
				// 前人写的不对，在firfox走到这里了。。处理有误.此处屏蔽l=0和t=0 by ltf
				//l = 0;
				//t = 0;
			} else {
				//执行严格的跨域检查,端口不同即视为跨域，只有同域才计算位置
				if(win.location.port == win.parent.location.port){
					// 获取frame/iframe在父窗口的位置
					st=$("body",win.document).scrollTop();
					if(st==0){
						st=$(item,win.document).parents().find("div").scrollTop();
					}
					if(st==0){
						st=win.document.documentElement.scrollTop;
					}
					
					sl=$("body",win.document).scrollLeft();
					if(sl==0){
						sl=$(item,win.document).parents().find("div").scrollLeft();
					}
					if(sl==0){
						sl=win.document.documentElement.scrollLeft;
					}
					
					/*当前窗口的高度小于scrollHeight并且有scroll的标志说明当前窗口有滚动条，否则就没有滚动条
					 *$(item).offset()在获取top
					 *窗口有滚动条时，top始终不变，此时计算元素到窗口顶端的实时距离需要减去scrollTop
					 *窗口没有滚动条，而滚动条只存在于div中时，offset的top就是计算的元素到窗口顶端的实时距离，故此时不用去减scrollTop（st）,此时将st=0
					 * add by litengfei
					 */
					if((win.frameElement.scrolling != "no" || win.document.body.style.overflow=="auto" || win.document.body.style.overflow=="scroll") && $(win).height()<win.document.body.scrollHeight){
					  //do nothing
					}else{
					  st = 0;
					}
					
					if((win.frameElement.scrolling != "no" || win.document.body.style.overflow=="auto" || win.document.body.style.overflow=="scroll") && $(win).width()<win.document.body.scrollWidth){
					  //do nothing
					}else{
					  sl = 0;
					}
					
					if($.browser.version == 6.0 || $.browser.version == 7.0){
						l = l - sl;
						t = t - st;
					}else{
						var off = getAbsolutePosition(frm, win.parent, st, sl);
						// 位置累加
						l += off.left - sl;
						t += off.top - st;
					}
				}
			}
		}catch(e){
			//confirm(e)
		}
	}

	// 返回结果
	return {
		"left": l,
		"top": t
	};
}

/**
 * 获取当前应用名称
 * @returns
 */
function getContextPath() {
	 return $.contextPath;
}

/**
 * 动态增加js或者css文件
 *fileArray 数据结构：[{name:"/a.css",type:"css"},{name:"/a.js",type:js"}];
 以下为调用示例
	var loadFileArray = new Array();
	var file1 = {name:settings.apppath+"/mis2/gezComponents/jquery/jquerytreeview/css/resTree/jquery.treeview.css",type:"css"};
	var file2 = {name:settings.apppath+"/mis2/gezComponents/geTree/js/rqtree.js",type:"js"};
	loadFileArray.push(file1);
	loadFileArray.push(file2);
	loadJsCssFile(_window,loadFileArray);
 */
function loadJsCssFile(curWindow, fileArray, callback) {
	var loadFileArr = new Array();
	curWindow = typeof (curWindow) == 'undefined' ? window : curWindow;
	for ( var i in fileArray) {
		var file = fileArray[i];
		var filename = file.name;
		var filetype = file.type;
		if (filetype == "js") {
			var fileref = curWindow.document.createElement('script');
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", filename);
		} else if (filetype == "css") {
			var fileref = curWindow.document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}
		fileref.setAttribute("loadType", "add");//loadType属性，用于remove该节点时使用
		if (typeof fileref != "undefined") {
			if(filename){
				if(!suspectsIsExsit(curWindow,filename,filetype)){
					loadFileArr.push(fileref);
				}
			}
		}
	}
	if(loadFileArr.length == 0){//需要引入的文件都已经存在顶层窗口，则直接回调
		if(typeof callback ==="function"){
			try{callback();}catch(e){}
		}
	}else{
		for(var i=0;i<loadFileArr.length;i++){
			var fileref = loadFileArr[i];
			//最后一个文件被引入后执行回调
			if(i == (loadFileArr.length - 1)){
				if(fileref.readyState){
					fileref.onreadystatechange=function(){
						if(fileref.readyState=="loaded"||fileref.readyState=="complete"){
							fileref.onreadystatechange = null;
							if(typeof callback ==="function"){
								try{callback();}catch(e){}
							}
						}
					};
				}else{
					fileref.onload=function(){
						if(typeof callback ==="function"){
							try{callback();}catch(e){}
						}
					};
				}
			}
			curWindow.document.getElementsByTagName("head")[0].appendChild(fileref);
		}
	}
	
}

/**
 *动态删除js或者cssw文件
 */
function removeJsCssFile(curWindow, fileArray) {
	curWindow = typeof (curWindow) == 'undefined' ? window : curWindow;
	for ( var j in fileArray) {
		var file = fileArray[j];
		var filename = file.name;
		var filetype = file.type;
		//列表回调函数中带有alert弹窗时。由于关闭下拉列表删除样式问题，导致alert弹窗内容显示不出来。所以只删除js文件
		var allsuspects = curWindow.document.getElementsByTagName("script");
		for ( var i = allsuspects.length; i >= 0; i--) {
			if (allsuspects[i] && allsuspects[i].getAttribute("src") != null && allsuspects[i].getAttribute("src").indexOf(filename) != -1) {
				if (allsuspects[i].getAttribute("loadType") == "add") {//是使用loadJsCssFile增加的才能够删除
					allsuspects[i].parentNode.removeChild(allsuspects[i]);
				}
			}
		}
		/*
		var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
		var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
		var allsuspects = curWindow.document.getElementsByTagName(targetelement);
		for ( var i = allsuspects.length; i >= 0; i--) {
			if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
				if (allsuspects[i].getAttribute("loadType") == "add") {//是使用loadJsCssFile增加的才能够删除
					allsuspects[i].parentNode.removeChild(allsuspects[i]);
				}
			}
		}
		*/
	}
}

/**
 * 判断文件是否存在，存在返回true，否则返回false
 */
function suspectsIsExsit(curWindow,filename,filetype){
	if(filename.toLowerCase().indexOf("jquery.js") != -1){
		if(jQuery == "undefined" || typeof jQuery == "undefined"){//未加载jQuery.js
			return false;
		}else{//已加载
			return true;
		}
	}else{
		var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
		var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
		var allsuspects = curWindow.document.getElementsByTagName(targetelement);
		for ( var i = allsuspects.length; i >= 0; i--) {
			if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
				if (allsuspects[i].getAttribute("src") == filename || allsuspects[i].getAttribute("href") == filename) {//是使用loadJsCssFile增加的才能够删除
					  return true;
				}
			}
		}
		return false;	
	}
		
}

/**
 * 给窗口绑定滚动滚动条时，下拉组件面板跟随滚动
 */
function bindScrollFunc(divObj, inputObj, domainTop, win){
	try {
		$(win).bind("scroll",{"divObj":divObj,"inputObj":inputObj,"domainTop":domainTop},scrollFunc);
		//当前窗口为frame时，给frame框架的父元素也进行绑定
		if(win.frameElement != null){
			$(win.frameElement).parents().each(function(){
				$(this).bind("scroll",{"divObj":divObj,"inputObj":inputObj,"domainTop":domainTop},scrollFunc);
			});
		}
	} catch (e) {
		// do nothing
	}
	
	if(win != domainTop) {
		try{
			var parent = win.parent;
			if(parent != null && parent.document.domain == window.document.domain) {
			   bindScrollFunc(divObj, inputObj, domainTop, win.parent);
			}
		}catch(e){
			// do nothing
		}
	}
}

/**
 * 滚动条滚动触发事件
 */
function scrollFunc(event){
    var divObj = event.data.divObj;
    var inputObj = event.data.inputObj;
    var domainTop = event.data.domainTop;
    if(domainTop.$(divObj).length > 0 && domainTop.$(divObj).css("display") != "none"){
        var scrollFlag = true;//是否是滚动时的
        var settings = {};
        setElementPosition(divObj, inputObj, domainTop, settings, scrollFlag);
    }
}

/**
 * 解绑滚动条事件
 */
function unbindScrollFunc(domainTop, win){
	try{
		$(win).unbind("scroll",scrollFunc);
		//当前窗口为frame时，给frame框架的父元素也进行绑定
		if(win.frameElement != null){
			$(win.frameElement).parents().each(function(){
				$(this).unbind("scroll",scrollFunc);
			});
		}
	}catch(e){
		//do nothing
	}
	
	if(win != domainTop) {
		try{
			var parent = win.parent;
			if(parent != null && parent.document.domain == window.document.domain) {
			    unbindScrollFunc(domainTop, win.parent);
			}
		}catch(e){
			//do nothing
		}
	}
}

/**
 * 解绑关闭事件
 */
function unbindCloseDialogFunc(closeFunc, win){
	try{
		$("html",win.document).unbind("mousedown",closeFunc);
		if(win.frames.length > 0){
			for(var i=0; i<win.frames.length; i++){
				unbindCloseDialogFunc(closeFunc, win.frames[i]);
			}
		}
	}catch(e){}
}
