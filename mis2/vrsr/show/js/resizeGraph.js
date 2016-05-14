
//table:需要添加拖动大小功能的表格对象，callback：回调函数，在拖动完成松开鼠标左键时调用，如果回调函数为空，则不会调用
function ResizeGraph(obj,h,callback){
	$(obj).mousemove(function(){mouseMoveCursor()});
	var left=false;
	var top=false;
	var resizeObj = new resizeObject();
	resizeObj.border=$(obj).css("border");
	function resizeObject() {
		this.dir   = "";
		this.grabx = null;
		this.graby = null;
		this.width = null;
		this.height = null;
		this.mouseup = null;
		this.mousemove = null;
		this.border = null;
	}
	//拖曳开始
	var doDown=function() {
		
		resizeObj.width = $(this).width();
		resizeObj.height =$(this).height();
		resizeObj.dir=event.srcElement.style.cursor;
		resizeObj.grabx = window.event.clientX;
		resizeObj.graby = window.event.clientY;
		resizeObj.mouseup = document.onmouseup;
		resizeObj.mousemove = document.onmousemove;

	 
		resizeObj.graphDivHeight =$("#graphDiv").height();
		resizeObj.tableDivHeight =$("#tableDiv").height();
		window.event.returnValue = false;
		window.event.cancelBubble = true;
		document.onmouseup = doUp;
		document.onmousemove = doMove;
		$(obj).unbind("mousemove");;
	}
	//拖曳结束
	function doUp(){

		if(callback!="" && typeof(callback)!="undefined"){
			try{
//				confirm(callback+"("+width+","+height+")");
				var func=callback+"("+$(obj).width()+","+$(obj).height()+")";
				$("#graphContent").html("");
				eval(func);
			}catch(e){}
		}
		document.onmouseup   = null;
		document.onmousemove = null;
		resizeObj = new resizeObject();
		left=false;
		top=false;
		//$(obj).mousemove(function(){mouseMoveCursor()});
	}
	//拖曳过程中宽高的实时变化
	function doMove() {
	 	var temp;
		if(resizeObj != null) {
			var dir=resizeObj.dir;
			var ttt=dir.split("-");
			if(ttt.length>1){
				if (ttt[0].indexOf("e") != -1) {
					temp=(window.event.clientX - resizeObj.grabx)*2;
					try{
						if(left){
							$(obj).width(parseInt(resizeObj.width)-temp);
						}else{
							$(obj).width(parseInt(resizeObj.width)+temp);
						}
					}catch(e){}
				}
				if (ttt[0].indexOf("s") != -1) {
					temp=(window.event.clientY - resizeObj.graby);
					try{
						if(top){
							$(obj).height(parseInt(resizeObj.height)-temp);
							$("#graphDiv").height(resizeObj.graphDivHeight-temp);
							$("#tableDiv").height(resizeObj.tableDivHeight+temp);
						}
					}catch(e){}
				}
				
			}
		} 
	}
	//鼠标移动时的指针样式
	function mouseMoveCursor() {
		var dir = "";
		if ((window.event.offsetY<4)){ dir += "s";top=true;};
		if (window.event.offsetX<4){ dir += "e";left=true;}
		//if ((window.event.offsetY > $(obj)[0].offsetHeight-4)) dir += "s";
		if (window.event.offsetX > $(obj)[0].offsetWidth-4){ dir += "e";left=false};
		if (dir == ""){
			dir="auto";
			$(event.srcElement).unbind("mousedown",doDown);
		}else{
			dir =dir+ "-resize";
			$(event.srcElement).bind("mousedown",doDown);
		}
		if((window.event.offsetY<=0)||(window.event.offsetX<=0)||(window.event.offsetY >= $(obj)[0].offsetHeight-1)||(window.event.offsetY >= $(obj)[0].offsetHeight-1)){
			$(obj).css("border",resizeObj.border);
		}else{
			$(obj).css("border","1px solid black");
		}
		$("#resizeTest").val(window.event.offsetY);
		event.srcElement.style.cursor=dir;
	}
}