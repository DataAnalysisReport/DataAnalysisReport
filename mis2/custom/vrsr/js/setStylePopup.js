

//等报表页加载完
function regeditStyleCallback(report){
	try{
		autoSetReportWH(report);
	}catch(e){
	}
	var currentWindowTitle="predefine";
	try{
		currentWindowTitle=parent.parent.getStyleDefine();
	}catch(e){
		
	}
	var windowWidth=document.body.clientWidth;
	//showStyleSampleReport("2055031863");
	//设置报表的显示区域
	$("td").each(function(element){
		$(this).mouseenter(function(event){
			var evt = event || window.event;
			var target = evt.target || evt.srcElement;
			if(target != this){
				return;
			}
			var Y = $(this).offset().top;
			var X = $(this).offset().left;
			//$("#div_style_popup").hide();
			//单元格上的style属性
			var style_name=$(this).attr("style_name");
			if(style_name!=null&&typeof(style_name)!='undefined'){//显示气泡
				//获得当前单元格的位置	
				var gloabal_style=$(this).attr("gloabal_style");
				if(gloabal_style=='true'||gloabal_style==true){
					if(currentWindowTitle=='predefine'){
						$("#btn_saveas").hide();
						$("#btn_apply").hide();
						$("#btn_show").hide();
						$("#div_style_span").text("该单元格没有使用样式/使用的是全局样式，请到样式库管理中设置样表目录或切换到高级");
					}else{
						$("#btn_show").show();
						$("#btn_apply").show();
						$("#btn_saveas").hide();
						$("#div_style_span").text($(this).attr("style_name"));
					}
				}else{
					if(currentWindowTitle=='global'){
						$("#btn_saveas").hide();
						$("#btn_apply").hide();
						$("#btn_show").hide();
						$("#div_style_span").text("该单元格没有使用全局样式，请到全局样式管理中设置样表目录或切换到高级");
					}else{
						$("#btn_show").show();
						$("#btn_apply").show();
						$("#btn_saveas").show();
						$("#div_style_span").text($(this).attr("style_name"));
					}
				}				
			}else{
				if(currentWindowTitle=='global'){
					$("#div_style_span").text("该单元格没有使用全局样式，请到全局样式管理中设置样表目录或切换到高级");
				}else{
					$("#div_style_span").text("该单元格没有使用样式/使用的是全局样式，请到样式库管理中设置样表目录或切换到高级");
				}
				$("#btn_saveas").hide();
				$("#btn_apply").hide();
				$("#btn_show").hide();
			}
			var width=$("#div_style_popup").width();
			//获得
			if((X+20)>(windowWidth-width)){
				X=windowWidth-width-40;
			}
			$("#div_style_popup").css({"top":(Y+20),"left":(X+20)});
			$("#div_style_popup").show();
		});
		$("body").click(function(){
			$("#div_style_popup").hide();
		});
	});
	
}

//创建样式悬浮层
function createStylePopupDiv(){
	var div_style_popup=document.createElement("div");  
    div_style_popup.setAttribute("id", "div_style_popup"); 
	div_style_popup.setAttribute("z-index","99999");
	div_style_popup.style.cssText="float:right;position:absolute;line-height:25px;border:2px solid #ECECEC;-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;-moz-box-shadow:0px 0px 1px #EEE inset;-webkit-box-shadow:0px 0px 1px #EEE inset;box-shadow:0px 0px 1px #EEE inset;background:#FFF;text-align:center;float:left;overflow:hidden;padding:5px 3px";
	document.body.appendChild(div_style_popup);
	
	var span_style_name=document.createElement("span");  
	span_style_name.setAttribute("id", "div_style_span");  
	div_style_popup.appendChild(span_style_name);
	
	var span_style_cellposition=document.createElement("span");  
	span_style_cellposition.setAttribute("id", "span_style_cellposition");  
	span_style_cellposition.style.display="none";
	div_style_popup.appendChild(span_style_cellposition);

	var div_style_apply=document.createElement("input");
	div_style_apply.setAttribute("type", "button");  
	div_style_apply.setAttribute("value", "应用");  
	div_style_apply.setAttribute("id", "btn_apply");  
	div_style_apply.setAttribute("onclick", "parent.parent.styleLibApply(getStyleName())");  
	div_style_apply.style.cssText="margin:0px 5px 0px 5px;";
	div_style_popup.appendChild(div_style_apply);		

	var div_style_show=document.createElement("input");
	div_style_show.setAttribute("type", "button");  
	div_style_show.setAttribute("value", "查看");  
	div_style_show.setAttribute("id", "btn_show"); 
	div_style_show.setAttribute("onclick", "parent.parent.styleLibView(getStyleName())");  
	div_style_show.style.cssText="margin:0px 5px 0px 5px;";
	div_style_popup.appendChild(div_style_show);

	var div_style_saveas=document.createElement("input");
	div_style_saveas.setAttribute("type", "button");  
	div_style_saveas.setAttribute("value", "转存");  
	div_style_saveas.setAttribute("id", "btn_saveas"); 
	div_style_saveas.setAttribute("onclick", "parent.parent.styleLibStore(getStyleName())");  
	div_style_saveas.style.cssText="margin:0px 5px 0px 5px;";
	div_style_popup.appendChild(div_style_saveas);

	$("#btn_saveas").button();
	$("#btn_show").button();
	$("#btn_apply").button();
}
//获得当前单元格样式名
function getStyleName(){
	var styleName=$("#div_style_span").text();
	return styleName;
}

$(function(){
	createStylePopupDiv();
});