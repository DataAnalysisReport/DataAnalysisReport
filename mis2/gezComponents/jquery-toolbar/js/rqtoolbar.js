$(document).ready(function(){
	//自定义工具栏js
	$.rq2ToolBar = function(){
		$(".toolbar").find("button,input:submit,a").button();
		/*$(".ui-button").mousedown(function(){
		$(this).addClass("toolbarMousedown");										
		}).mouseup(function(){
			$(this).removeClass("toolbarMousedown");		
		})*/
		$(".ui-button").addClass("rq-ui-toolbar-button-default");
		$(".ui-button").mouseover(function(){
			$(this).removeClass("rq-ui-toolbar-button-default");
			$(this).addClass("rq-ui-toolbar-button-hover");
		});
		$(".ui-button").mouseout(function(){
			$(this).removeClass("rq-ui-toolbar-button-hover");
			$(this).removeClass("rq-ui-toolbar-button-active");
			$(this).addClass("rq-ui-toolbar-button-default");
		});
		$(".ui-button").mousedown(function(){
			$(this).removeClass("rq-ui-toolbar-button-default");
			$(this).addClass("rq-ui-toolbar-button-active");
		});
		$(".ui-button").mouseup(function(){
			$(this).removeClass("rq-ui-toolbar-button-active");
			$(this).addClass("rq-ui-toolbar-button-default");
		});
		
		if($(".ui-button").length>0){
			$(".ui-button").each(function(){
				$(this).css("position","relative");
				var topValue=-4;
				var leftValue=0;
				if($.browser.version=="7.0"){
					topValue=-5;
					leftValue=-1;
				}
				if(!$.browser.msie && $.browser.version!="11.0"){
					topValue=-5;
				}
				try{//由于有些按钮是input类型的，无法用append添加内容，此处进行下异常处理
					var icon=$(IconFactory.getIcon("gezico_p_anniuxuanzhong")).html();
					$(this).append('<span class="iconfont selectIcon hideSelectIcon" style="display:inline-block;position:absolute;top:'+topValue+'px;left:'+leftValue+'px;color:#3D6DAD;font-size:32px;">'+icon+'</span>')
				}catch(e){}
			});
		}
	};
	/**
	 * 把给定的数据，加上css样式，产生工具条
	 * 暂时参考页面 ros中报表管理，资源上方的按钮工具条
	 * html格式 
	 * isdel属性表示按钮是否采用删除的特殊样式对应toolbarDelete样式，
	 * closetonext表示是否和下个按钮紧连在一起，对应toolbarCloseToNext样式
	 * <button isdel="true/false" closetonext="true/false" onclick="xx">按钮1</button>
	 * <button onclick="xx">按钮2</button>
	 * json格式
	 * [
	 *		{
	 *			"text":"按钮1",
	 *			"isdel":"true/false",//可无
	 *			"closetonext":"true/false",//可无
	 *			"onclick":"cl1",//可无
	 *			"onmouseover":"mo1",//可无
	 *			"onmouseout":"mo2",//可无
	 *			"onmousedown":"md1",//可无 鼠标上的按钮被按下了 
	 *			"onmousedup":"mu1"//可无
	 *		},
	 *		xxxx
	 *	]
	 *  
	 *  要解析成的标准的html格式
	 *  <button class="toolbarDelete toolbarCloseToNext" onclick="xx">按钮1</button>
	 *  <button onclick="xx">按钮2</button>
	 * 使用/jquery-toolbar/css/jquery.ui.theme.css
	 */
	 //settings 容器内的值
	$.fn.rqtoolbar = function(settings){
		$(this).addClass("toolbar");
		settings = extendSettings(settings);
		var resultHtml = "";
		if(settings.datatype=="html"){
			resultHtml = genToolBarHtmlByhtmldata(settings.data);
		}else if(settings.datatype=="json"){
			resultHtml = genToolBarHtmlByjsondata(settings.data);
		}
		$(this).append(resultHtml);
		$.rq2ToolBar();
		//todo 把json数据转化成标准的html数据
		function genToolBarHtmlByjsondata(data){
			var htmlStr = "";
		    if(data){
		      $.each(data,function(i,jsonObj){
		              htmlStr += "<button" ;
		              htmlStr += " onclick=" ;
		              htmlStr += jsonObj["onclick"] ;
		              if(jsonObj["closetonext"]=="true"){
		              	htmlStr += " class='toolbarCloseToNext'";
		              }
		              else if(jsonObj["isdel"]=="true"){
		              	htmlStr += " class='toolbarDelete'";
		              }
		              htmlStr += ">" ;
		              if(settings.imgUrl!="" && settings.imgUrl!=null){
		              	htmlStr+="<img height='19px' style='vertical-align:-4px;display:inline-block;margin-left:-5px;margin-right:10px;' src="+settings.imgUrl+" />";
		              }
		              htmlStr += jsonObj["text"] ;
		              htmlStr += "</button>" ;
		      });
		   }
		    return htmlStr;
		}
		//todo 把html数据转化成标准的html数据
		function genToolBarHtmlByhtmldata(data){
			var dataObj = $(data);
			dataObj.addClass("toolbarCloseToNext");
			return dataObj;
		}
		//todo 把设置的参数和默认的进行属性合并
		function extendSettings(settings){
			var ds = {
				"datatype":"json/html",
				"data":""
			};
			var lastsettings = $.extend(ds,settings) ;
			return lastsettings ;
		}
		this.addClass("rq-ui-toolbar-div");
		this.addClass(this.attr("customclass")); //加入用户自定义的class属性。
	};
	$.rq2ToolBar();
});
