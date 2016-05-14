(
	function(){
		/** 通用组件输入框增加按钮图片*/
		$.fn.appendIcon = function(settings){
			//var inputObj = $(settings.inputObj);
			var inputObj = this;
			var inputObjID = inputObj.attr("id");
			var imageWidth = settings.imageWidth;
			if(isNaN(imageWidth)){
			    imageWidth = 20;
			}else{
			    imageWidth = parseInt(imageWidth);
			}
			var idPrex = settings.idPrex;
			if(idPrex == "" || idPrex == null || typeof (idPrex) == "undefined"){
				idPrex = "select";
			}
			var select_image = null;
			if(settings.iconFont){//使用矢量图标
			    if(settings.datetime){
			        select_image = $(IconFactory.getIcon('gezico_p_rili'));
                //选中后的图标
                var selectedChild = $(IconFactory.getIcon('gezico_p_rilib')).children().addClass("childIconFont");
                //移出时切换为初始图标
                var selectChild = select_image.children().addClass("childIconFont");
                select_image.css("cursor", "pointer");
                select_image.attr("id", "selectImg_" + inputObjID);
                //矢量化图标没有上下左右居中，这里微调
                select_image.children().addClass("childIconFont");
                select_image.mousedown(function() {
                    //$(this).css("background","#fff");
                });
                //给日历图标增加白色背景
                select_image.addClass("selectIconFont");
                
                select_image.mouseover(function() {
					try{
						if(!!window.ActiveXObject || "ActiveXObject" in window){//ie浏览器鼠标移入div内部元素后会默认为移出了div导致出错，此处做一下兼容
							var innerObj = event.fromElement || event.relatedTarget;
							if(this.contains(innerObj)) return;
						}
					}catch(e){}
                    $(this).removeClass("selectIconFont");
                    $(this).addClass("selectedIconFont");
                    settings.module != "vr_input" && $("#"+inputObjID).addClass("qryTxtHover");
                    $(this).html(selectedChild);
                });

                select_image.mouseout(function() {
					try{
						if(!!window.ActiveXObject || "ActiveXObject" in window){//ie浏览器鼠标移入div内部元素后会默认为移出了div导致出错，此处做一下兼容
							var innerObj = event.toElement || event.relatedTarget;
							if(this.contains(innerObj)) return;
						}
					}catch(e){}
                    $(this).removeClass("selectedIconFont");
                    $(this).addClass("selectIconFont");
                    settings.module != "vr_input" && $("#"+inputObjID).removeClass("qryTxtHover");
                    $(this).html(selectChild);
                });
            }else{
                select_image = $(IconFactory.getIcon('gezico_p_xialajiantoub'));
                var childClassName = "childIconFont";
                if(inputObjID.indexOf("selectMonth_") == 0 || inputObjID.indexOf("selectYear_") == 0){
                    childClassName = "childIconFontDatetime";
                }
				select_image.addClass("selectIconFont");
                select_image.css("line-height","normal");
                select_image.css("cursor", "pointer");
                select_image.attr("id", "selectImg_" + inputObjID);
                //矢量化图标没有上下左右居中，这里微调
                select_image.children().addClass(childClassName).addClass("dropDownIcon");
                select_image.mousedown(function() {
                    //$(this).css("background","#fff");
                });
                select_image.mouseover(function() {
					try{
						if(!!window.ActiveXObject || "ActiveXObject" in window){//ie浏览器鼠标移入div内部元素后会默认为移出了div导致出错，此处做一下兼容
							var innerObj = event.fromElement || event.relatedTarget;
							if(this.contains(innerObj)) return;
						}
					}catch(e){
					}
	                $(this).addClass("selectedIconFont").removeClass("selectIconFont");          
					settings.module != "vr_input" && $("#"+inputObjID).addClass("qryTxtHover");	
                });
                select_image.bind("mouseout", {"settings":settings}, function(e) {
					try{
						if(!!window.ActiveXObject || "ActiveXObject" in window){//ie浏览器鼠标移入div内部元素后会默认为移出了div导致出错，此处做一下兼容
							var innerObj = event.toElement || event.relatedTarget;
							if(this.contains(innerObj)) return;
						}
					}catch(e){
					}
					var settings = e.data.settings;
					if(typeof(getDomainTop) == "undefined") return;
					var domainTop = getDomainTop(window);
					var objId = (settings.src && settings.src.id) || settings.txtid;
					if($("#treediv_"+objId, domainTop.document).length > 0 || $("#rqDropDownList_"+objId, domainTop.document).length > 0) return;
					$(this).addClass("selectIconFont").removeClass("selectedIconFont");
					settings.module != "vr_input" && $("#"+inputObjID).removeClass("qryTxtHover");
			   });
            }
			}else if(settings.image){//使用图片
			    select_image = $("<img id='" + idPrex+ "Img_"+inputObjID+"' name='" + idPrex +"Img_"+inputObjID+"' />");
			    if(settings.image.indexOf($.contextPath) == -1){
				    settings.image = $.contextPath + settings.image;
				}
				select_image.attr("src",settings.image);
                //鼠标移入、移出切换图片
				if(settings.hoverImage){
					if(settings.hoverImage.indexOf($.contextPath) == -1){
				        settings.hoverImage = $.contextPath + settings.hoverImage;
				    }
                    select_image.mousedown(function(){select_image.attr("src",settings.image);});
    		        select_image.mousemove(function(){select_image.attr("src",settings.hoverImage);});
    	            select_image.mouseout(function(){select_image.attr("src",settings.image);});
			    }
			}

			//绑定按钮click触发事件
			if(settings.click){
				select_image.unbind("click");
				select_image.bind("click", settings.click);
				if(select_image.find(".icon").length > 0){
				    select_image.find(".icon").unbind("click");
				    select_image.find(".icon").bind("click", settings.click);
				}
			}
            //设置图片样式
			var inputTopBorder = parseInt(inputObj.css("border-top-width"));//输入框上边框宽度
			var inputBtmBorder = parseInt(inputObj.css("border-bottom-width"));//输入框下边框宽度
			var inputRightBorder = parseInt(inputObj.css("border-right-width"));//输入框右边框宽度
    		if(inputObj.height() == 0){
    			select_image.height(parseInt(inputObj.parent().outerHeight())-(inputTopBorder+inputBtmBorder));	
    		}else{
    			select_image.height(parseInt(inputObj.outerHeight())-(inputTopBorder+inputBtmBorder));	
    		}
			select_image.width(imageWidth);
    		select_image.css({"margin":"0px","padding":"0px","vertical-align":"text-bottom","cursor":"pointer"});
				
			//设置图片外span容器
    		var select_span = $("<span id='" + idPrex + "Span_"+inputObjID+"'></span>"); 
			var inputMarginTop = inputObj.css("margin-top");//输入框的外上边距		
    		if(isNaN(inputMarginTop)){
    			inputMarginTop = 0;
    		}
			inputMarginTop = parseInt(inputMarginTop);
            select_span.css({"margin":"0px","padding":"0px","position":"static","display":"inline-block","line-height": (parseInt(select_image.height()) - 5)+ "px","z-index":"1"});
			select_span.width(imageWidth);
    		select_span.height(select_image.height());
           
		    //根据输入框的样式重新设置span容器的样式
			if(inputObj.css("vertical-align") == "middle" ){//垂直对齐方式
			    select_span.css("vertical-align","middle");
			}else if(inputObj.css("vertical-align") == "bottom"){
			    select_span.css("vertical-align","bottom");
				select_span.css("padding-bottom",inputMarginTop+inputTopBorder+"px");
			}else{
			    select_span.css("vertical-align","top");
				select_span.css("padding-top",inputMarginTop+inputTopBorder+"px");
			}
			if(inputObj.css("float") != "none"){//浮动样式
				select_span.css("float",inputObj.css("float"));
			}
			if(inputObj.css("position") == "absolute"){//position定位
				select_span.css("position","relative");
				var inputLeftBorder = parseInt(inputObj.css("border-left-width"));//输入框左边框宽度
				select_span.css("left",parseInt(inputObj.outerWidth()) - imageWidth - inputLeftBorder);
			}else if(inputObj.css("position") == "relative"){
				select_span.css("position","relative");
				var inputLeftBorder = parseInt(inputObj.css("border-left-width"));//输入框左边框宽度
				if(inputObj.width() == inputObj.parent().width()){
				    select_span.css("left",parseInt(inputObj.outerWidth()) - imageWidth - inputLeftBorder);
					select_span.css("top","-" + (parseInt(select_image.height()) + inputBtmBorder +inputTopBorder ) + "px");
				}else{
				    select_span.css("left",parseInt(inputObj.outerWidth()) - imageWidth - inputLeftBorder);
				}	
			}else{
			    select_span.css("margin-left","-" + (inputRightBorder + imageWidth) + "px");
			}

    		select_span.insertAfter(inputObj);
    		select_span.append(select_image);
		};
		//恢复图片样式
		$.fn.restoreIconStyle = function(_originalWin){
			if(typeof(_originalWin)=='undefined'||_originalWin==null){
				_originalWin=window;
			}
		    var inputObjID =$(this).attr("id");
		    if(!inputObjID) return;
		    $("#"+inputObjID,_originalWin.document).removeClass("qryTxtHover").removeClass("qryTxtPopup");
		    //var childClassName = "childIconFont";
		    //if(inputObjID.indexOf("selectMonth_") == 0 || inputObjID.indexOf("selectYear_") == 0){
		    //    childClassName = "childIconFontDatetime";
		    //}
		   // var selectChild = $(IconFactory.getIcon('gezico_p_xialajiantou')).children().addClass(childClassName);
		    $("#selectImg_" + inputObjID,_originalWin.document).addClass("selectIconFont").removeClass("selectedIconFont")//.html(selectChild);
		};
		/** 工具条样式 */
		$.fn.gezToggleButton = function(selectedFunc, unselectedFunc, selected){
		    var _this=this;
		    try{
		    	var icon=$(IconFactory.getIcon("gezico_p_anniuxuanzhong"));
			    $(this).toggle(
			        function(){
			        	if(selected){
			        		$(_this).removeClass("selectedGezBtn");
			        		icon.remove();
			        		if(unselectedFunc!=null && unselectedFunc!=''){
					    		eval(unselectedFunc+'()');
					    	}
			        	}else{
			        		if($("#selectedIcon").length==0){
			        			$(_this).addClass("selectedGezBtn");
					    		$(_this).css("position","relative");
					    		icon.prependTo($(_this));
					    		icon.css({"position":"absolute","left":"0px","top":"0px","margin":"0px"});
					    		icon.find("i").css("line-height","16px");
					    	}
					    	if(selectedFunc!=null && selectedFunc!=''){
					    		eval(selectedFunc+'()');
					    	}
			        	}		        	
			        }, 
			        function(){
			        	if(selected){
			        		if($("#selectedIcon").length==0){
			        			$(_this).addClass("selectedGezBtn");
					    		$(_this).css("position","relative");
					    		icon.prependTo($(_this));
					    		icon.css({"position":"absolute","left":"0px","top":"0px","margin":"0px"});
					    		icon.find("i").css("line-height","16px");
					    	}
					    	if(selectedFunc!=null && selectedFunc!=''){
					    		eval(selectedFunc+'()');
					    	}
			        	}else{
			        		$(_this).removeClass("selectedGezBtn");
			        		icon.remove();
			        		if(unselectedFunc!=null && unselectedFunc!=''){
					    		eval(unselectedFunc+'()');
					    	}
			        	}
			        }
			    );
			    if(selected){
			    	if($("#selectedIcon").length==0){
			    		$(_this).addClass("selectedGezBtn");
			    		$(_this).css("position","relative");
			    		icon.prependTo($(_this));
			    		icon.css({"position":"absolute","left":"-1px","top":"0px","margin":"0px"});
			    		icon.find("i").css("line-height","16px");
			    	}
			    }else{
			    	$(_this).removeClass("selectedGezBtn");
			    	icon.remove();
			    }
		    }catch(e){}	
		};
		
		$.extend($.fn,{
			/**
			 * 销毁下拉列表 <br />
			 * 调用方法： <br />
			 * jquery插件的机制进行开发，调用方式类似jquery其他方法<br />
			 * 举例如下：<br />
			 *		$('#dispfile2').destroyDropDown();<br />
			 *		(1)dispfile2意义为id=dispfile2的input输入框<br />
			 * @name destroyDropDown 
			 */
			destroyDropDown:function(settings){
				var id = $(this).attr("id");
				var curId = typeof(id)=='undefined'?settings.inputObj.attr('id'):id;
				//允许为空等0，即不能为空，此时需要验证输入框的值是否为空
				if($("#rqDropDownList_"+curId,settings.curWindow.document).length > 0 && settings.allowNulls == "0" && settings.inputObj.val() == ""){
				    alert("不能为空");
				    return false;
				}
				//canMoveFocus为false时不删除面板
				if(typeof canMoveFocus != "undefined" && !canMoveFocus){
				    return false;
				}
				if(settings.onTop){
				    $("#rqDropDownList_"+curId,settings.curWindow.document).remove();
					try{removeJsCssFile(settings.curWindow,settings.loadFileArray);}catch(e){}
				}else{
				    if(settings.showOnTop == true){
					      top.$("#rqDropDownList_"+curId).remove();
				    }else{
					      $("#rqDropDownList_"+curId,settings.curWindow.document).remove();
					      $('#selectedNumber',settings.curWindow.document).remove()
				    }
				}
				if(settings.iconFont){
					$("#" + curId).restoreIconStyle();
				}
				if($.browser.version==6.0 || $.browser.version==7.0){
					$(".rqDataList").remove();
					$(".rqDropDownList").remove();
				}
				
				//除此加载时找不到该方法则退出
				if(typeof(getDomainTop) == "undefined"){
					return;	
				}
				var domainTop = getDomainTop(window);
				//解绑关闭树组件的方法
				if(settings.inDateDiv != "yes"){
					unbindCloseDialogFunc(this.closeFormFunc, domainTop);
				}
				//将当前域顶层页面中还未移除的rqDropDownList和rqDropDownNum移除
				if(domainTop != null && typeof(domainTop.document) != "undefined" && $(".rqDropDownList", domainTop.document).length > 0){
				    $(".rqDropDownList",domainTop.document).each(function(i, element){
				        var dropDownId = $(element).attr("id");
				        var srcId = dropDownId.replace("rqDropDownList_","");
				        //tdWidth存在表示在填报里
				        if(typeof(settings.tdWidth) != "undefined"){
				            $('#'+srcId).destroySelect();
				            //settings.filterTimer==null时为数据集过滤，此时不消除输入框
				            typeof(settings.filterTimer) != "undefined" && settings.filterTimer == null ? "" : $('#'+srcId).parent().html($('#'+srcId).val());
				        }
				    });
					$(".rqDropDownList",domainTop.document).remove();
					$('.rqDropDownNum',domainTop.document).remove();
				}		
			},
			/**
			 * 销毁选择样式 <br />
			 * 调用方法： <br />
			 * jquery插件的机制进行开发，调用方式类似jquery其他方法<br />
			 * 举例如下：<br />
			 *		$('#dispfile2').destroySelect();<br />
			 *		(1)dispfile2意义为id=dispfile2的input输入框<br />
			 * @name destroySelect 
			 */
			destroySelect:function(){
				$("#selectImg_"+$(this).attr("id")).remove();
				$("#selectSpan_"+$(this).attr("id")).remove();
			},
			//新样式
			createNewStyle:function(settings){
			    if(settings.data && settings.data.length > 0){
					//需要隐藏的divid
					try{
						if(typeof(settings.hiddenDom)!= undefined){
							$(settings.hiddenDom).hide();
							if(settings.preCreate!= undefined){
								eval(settings.preCreate);
							}
						}
					}catch(e){
						$(settings.htmlElement).parent().parent().hide();
						//这个影响不应该
						$("#"+settings.panelName+" .qryConditionDiv").hide();
						$("#"+settings.panelName+" .qryBtns").hide();
					}

					if(typeof(settings.selectionDiv)== undefined){
						if($("#"+settings.panelName + "_selectConditionNew").length == 0){
							$("#commonQueryContent").after("<div id='"+settings.panelName + "_selectConditionNew' class=selectedCondition><b class=b>已选条件：</b></div>");
						}
						settings.selectionDiv=settings.panelName + "_selectConditionNew";
					}
			        
			        var defaultSettings = {type:"text",imageFolder:$.contextPath+"/mis2/gezComponents/newFormstyle/images/"};
			        if(settings.style == "text_select_style"){
			            defaultSettings.type = "text";
			        }else if(settings.style == "icon_select_style"){
			            defaultSettings.type = "icon";
			        }else if(settings.style == "interval_select_style"){
			            defaultSettings.type = "interval";
			        }
			        settings = $.extend(true,settings,defaultSettings);
					if(typeof(settings.targetDom)!='undefined'){
						 $(settings.targetDom).appendCondition(settings);
					}else{
						 $("#commonQueryContent").parent().appendCondition(settings);
					}
			    }
			},
			/**
			 * 下拉列表单复选钮  <br />
			 * 调用方法：<br />
			 * jquery插件的机制进行开发，调用方式类似jquery其他方法<br />
			 * 举例如下：<br />
			 *		$('#dispfile2').createColorLump();<br />
			 *		(1)dispfile2意义为id=dispfile2的input输入框<br />
			 */
			createRadioAndCheckbox:function(settings){
			    //单复选钮高度24px
			    var radioAndCheckboxHeight = 24;
			    //单复选按钮单行的高度,用于计算可以放几行
			    settings.rowHeight = radioAndCheckboxHeight;
			    // 单复选钮能放文字的区域宽度  30为左右各预留15px
			    var itemLabelWidth = settings.optionLength - 30;
			    settings.itemLabelWidth = itemLabelWidth;
			    //没有传txtid时为填报或者参数表单
			    if(typeof(settings.txtid) == "undefined"){
			        //自动隐藏时使用
			        if((typeof(settings.autoHideEditor) == "undefined" || settings.autoHideEditor == "true") && (typeof(settings.autoGroup) == "undefined" || settings.autoGroup == "true")){
			            typeof(settings.data) != "undefined" ? $(this).rqSpellClass(settings) : "";
			            return false;
			        }else if(typeof(settings.autoHideEditor) != "undefined" && settings.autoHideEditor == "false"){
			            var element = typeof(settings.element) != "undefined" ? settings.element : null;
			            if(element == null){
			                return false;    
			            }
			            //单元格高度
			            var cellHeight = $(element).parent().height();
			            //cellHeight=23是单元格默认高度，这里也按24计算
			            cellHeight = cellHeight == 23 ? 24 : cellHeight;
			            var cellWidth = $(element).width();
			            if($.browser.msie && ((parseInt($.browser.version) <= 8 && (typeof(document.documentMode) == "undefined" || parseInt(document.documentMode) <= 8)) || (typeof(document.documentMode) != "undefined" && parseInt(document.documentMode) <= 8))){
			                //ie8及更早的ie版本宽度少了4。这里加上
			                cellWidth += 4;
			            }
			            var cellFontSize = parseInt($(element).css("font-size"));
			            //单复选钮能放的字数
			            var itemLabelNum = parseInt(itemLabelWidth / cellFontSize);
			            //能显示的单复选按钮个数
			            var showNum = getShowNum(cellHeight, cellWidth, settings);
			            //单复选钮区域的paddingtop
			            var paddingTop = 0;
			            //单元格高度大于单复选钮高度时重新计算paddingtop和height
			            if(cellHeight > radioAndCheckboxHeight){
			                var rowCount = typeof(settings.rowCount) != "undefined" ? settings.rowCount : 1;
			                paddingTop = parseInt((cellHeight - radioAndCheckboxHeight * rowCount)/2);
			                cellHeight -=  paddingTop;
			            }
			            //单复选钮区域div对象  左填充5px，宽度减5
			            var radioAndCheckboxDiv = $("<div style='float:left;padding-left:5px;padding-top:"+paddingTop+"px;width:" + (cellWidth-5) +"px;height:"+cellHeight+"px'></div>");
			            //列表数据大于所能显示的个数时，显示的个数减1，空余一个位置放【更多】按钮
			            showNum = settings.data.length > showNum ? showNum - 1 : showNum;
			            // 【更多】按钮标志
			            var hasMore = settings.data.length > showNum;
			            settings.itemLabelNum = itemLabelNum;
			            for (var i = 0; i < settings.data.length; i++) {
			                //单复选钮是否显示，在showNum内时显示，否则不显示.  当有"更多"按钮时i<showNum,否则i<=showNum
			                var display = hasMore ? i < showNum : i <= showNum;
			                //复选可多选，否则为单选
			                var multi = settings.style == 'checkbox_style';
			                //增加单复选钮到单复选钮div
			                appendEditorArgsToCellHtml(element, settings.data[i], display, multi, radioAndCheckboxDiv, settings);
			            }
			            //hasMore为true增加 【更多】按钮
			            if(hasMore){
			                var cellId= $(element).attr("id");
			                appendMoreOperate(cellId, cellId, radioAndCheckboxDiv,settings);
			            }
			            //将色块div增加到对比符号之后
			            $(element).html(radioAndCheckboxDiv);
			            return false;  
			        }
			    }
			    //如果但复选钮区域已存在，则先移除    			    
			    if($("#radioAndCheckbox_"+settings.txtid).length > 0){
			        $("#radioAndCheckbox_"+settings.txtid).remove();
			    }			    
			    //输入框对象
			    var inputObj = $("#"+settings.txtid);
			    //条件名称
			    var conditionName = inputObj.attr("name");
			    //条件高度
			    var filterHeight = parseInt(inputObj.attr("height"));
			    //条件宽度
			    var filterWidth = parseInt(inputObj.attr("width"));
			    //面板的字体大小
			    var fontSize = parseInt( typeof($(".qryPanelDiv").css("font-size")) != "undefined" ? $(".qryPanelDiv").css("font-size") : "12");
			    //按钮区域能放的字数
			    var itemLabelNum = parseInt(itemLabelWidth / fontSize);
			    //按钮区域div对象   width再继续减5px，表示编辑风格改进输入框减少的宽度
			    var radioAndCheckboxDiv = $("<div id='radioAndCheckbox_"+settings.txtid+"' style='float:left;width:" + inputObj.outerWidth() +"px;height:"+filterHeight+"px' txtid='"+settings.txtid+"'></div>");
			    //能显示的色块个数
			    var showNum = getShowNum(filterHeight, inputObj.outerWidth(), settings);
			    //列表数据大于所能显示的个数时，显示的个数减1，空余一个位置放【更多】按钮
			    showNum = settings.data.length > showNum ? showNum - 1 : showNum;
			    // 【更多】按钮标志
			    var hasMore = settings.data.length > showNum;
			    settings.conditionName = conditionName;
			    settings.itemLabelNum = itemLabelNum;
			    for (var i = 0; i < settings.data.length; i++) {
			        //色块是否显示，在showNum内时显示，否则不显示.  当有"更多"按钮时i<showNum,否则i<=showNum
			        var display = hasMore ? i < showNum : i <= showNum;
			        //复选块可多选，否则为单选
			        var multi = settings.style == 'checkbox_style';
			        //增加色块到色块div
			        appendEditorArgsToInputHtml(inputObj, settings.data[i], display, multi, radioAndCheckboxDiv, settings);
			    }
			    //hasMore为true增加 【更多】按钮
			    if(hasMore){
			        appendMoreOperate(conditionName, settings.txtid, radioAndCheckboxDiv,settings);   
			    }
			    //将色块div增加到对比符号之后
				inputObj.before(radioAndCheckboxDiv);
			    //将输入框隐藏之
			    inputObj.css("display","none");
			    
			},
			/**
			 * 下拉列表色块选择  <br />
			 * 调用方法：<br />
			 * jquery插件的机制进行开发，调用方式类似jquery其他方法<br />
			 * 举例如下：<br />
			 *		$('#dispfile2').createColorLump();<br />
			 *		(1)dispfile2意义为id=dispfile2的input输入框<br />
			 */
			createColorLump:function(settings){
			    //色块高度24px
			    var colorLumpHeight = 24;
			    // 单复选钮能放文字的区域宽度  30为左右各预留15px
			    var itemLabelWidth = settings.optionLength - 30;
			    settings.itemLabelWidth = itemLabelWidth;
			    if(typeof(settings.txtid) == "undefined"){
			        //自动隐藏时使用
			        if((typeof(settings.autoHideEditor) == "undefined" || settings.autoHideEditor == "true") && (typeof(settings.autoGroup) == "undefined" || settings.autoGroup == "true")){
			            typeof(settings.data) != "undefined" ? $(this).rqSpellClass(settings) : "";
			            //changeInputStyle(settings);
			            return false;
			        }else if(typeof(settings.autoHideEditor) != "undefined" && settings.autoHideEditor == "false"){
			            var element = typeof(settings.element) != "undefined" ? settings.element : null;
			            if(element == null){
			                return false;    
			            }
			            //单元格高度
			            var cellHeight = $(element).parent().height();
			            //cellHeight=23是单元格默认高度，这里也按24计算
			            cellHeight = cellHeight == 23 ? 24 : cellHeight;
			            var cellWidth = $(element).width();
			            if($.browser.msie && ((parseInt($.browser.version) <= 8 && (typeof(document.documentMode) == "undefined" || parseInt(document.documentMode) <= 8)) || (typeof(document.documentMode) != "undefined" && parseInt(document.documentMode) <= 8))){
			                //ie8及更早的ie版本宽度少了4。这里加上
			                cellWidth += 4;
			            }
			            var cellFontSize = parseInt($(element).css("font-size"));
			            //色块能放的字数
			            var itemLabelNum = parseInt(itemLabelWidth / cellFontSize);
			            //单复选色块单行的高度,用于计算可以放几行  单元格高度小于30肯定放一行，此时不考虑上下边界，故行高取24
			            settings.rowHeight = cellHeight < 30 ? colorLumpHeight : 30;
			            //能显示的色块个数
			            var showNum = getShowNum(cellHeight, cellWidth, settings);
			            //色块区域的paddingtop
			            var paddingTop = 0;
			            //单元格高度大于色块高度时重新计算paddingtop和height
			            if(cellHeight > colorLumpHeight){
			                var rowCount = typeof(settings.rowCount) != "undefined" ? settings.rowCount : 1;
			                paddingTop = parseInt((cellHeight - colorLumpHeight * rowCount)/2);
			                cellHeight -=  paddingTop;
			            }
			            //色块区域div对象  左填充5px，宽度减5
			            var colorLumpDiv = $("<div style='float:left;padding-left:5px;padding-top:"+paddingTop+"px;width:" + (cellWidth-5) +"px;height:"+cellHeight+"px'></div>");
			            //列表数据大于所能显示的个数时，显示的个数减1，空余一个位置放【更多】按钮
			            showNum = settings.data.length > showNum ? showNum - 1 : showNum;
			            // 【更多】按钮标志
			            var hasMore = settings.data.length > showNum;
			            settings.itemLabelNum = itemLabelNum;
			            for (var i = 0; i < settings.data.length; i++) {
			                //色块是否显示，在showNum内时显示，否则不显示.  当有"更多"按钮时i<showNum,否则i<=showNum
			                var display = hasMore ? i < showNum : i <= showNum;
			                //复选块可多选，否则为单选
			                var multi = settings.style == 'multi_color_lump_style';
			                //增加色块到色块div
			                appendEditorArgsToCellHtml(element, settings.data[i], display, multi, colorLumpDiv, settings);
			            }
			            //hasMore为true增加 【更多】按钮
			            if(hasMore){
			                var cellId= $(element).attr("id");
			                appendMoreOperate(cellId, cellId, colorLumpDiv,settings);
			            }
			            //将色块div增加到对比符号之后
			            $(element).html(colorLumpDiv);
			            return false;
			        }
			    }
			    //如果色块区域已存在，则先移除    			    
			    if($("#colorLump_"+settings.txtid).length > 0){
			        $("#colorLump_"+settings.txtid).remove();
			    }			    
			    //输入框对象
			    var inputObj = $("#"+settings.txtid);
			    //条件名称
			    var conditionName = inputObj.attr("name");
			    //条件高度
			    var filterHeight = parseInt(inputObj.attr("height"));
			    //条件宽度
			    var filterWidth = parseInt(inputObj.attr("width"));
			    //面板的字体大小
			    var fontSize = parseInt( typeof($(".qryPanelDiv").css("font-size")) != "undefined" ? $(".qryPanelDiv").css("font-size") : "12");
			    //色块能放的字数
			    var itemLabelNum = parseInt(itemLabelWidth / fontSize);
			    //色块高度
			    settings.rowHeight = colorLumpHeight;
			    //色块区域div对象  width再继续减5px，表示编辑风格改进输入框减少的宽度
			    var colorLumpDiv = $("<div class='colorLumpDivContainer' id='colorLump_"+settings.txtid+"' style='float:left;width:" + inputObj.outerWidth() +"px;height:"+filterHeight+"px' txtid='"+settings.txtid+"'></div>");
			    //能显示的色块个数
			    var showNum = getShowNum(filterHeight, inputObj.outerWidth(), settings);
			    //列表数据大于所能显示的个数时，显示的个数减1，空余一个位置放【更多】按钮
			    showNum = settings.data.length > showNum ? showNum - 1 : showNum;
			    // 【更多】按钮标志
			    var hasMore = settings.data.length > showNum;
			    settings.conditionName = conditionName;
			    settings.itemLabelNum = itemLabelNum;
			    for (var i = 0; i < settings.data.length; i++) {
			        //色块是否显示，在showNum内时显示，否则不显示.  当有"更多"按钮时i<showNum,否则i<=showNum
			        var display = hasMore ? i < showNum : i <= showNum;
			        //复选块可多选，否则为单选
			        var multi = settings.style == 'multi_color_lump_style';
			        //增加色块到色块div
			        appendEditorArgsToInputHtml(inputObj, settings.data[i], display, multi, colorLumpDiv, settings);
			    }
			    //hasMore为true增加 【更多】按钮
			    if(hasMore){
			        appendMoreOperate(conditionName, settings.txtid, colorLumpDiv, settings);   
			    }
			    //非通查将色块div增加到对比符号之后，通查加到标签之后
			    if(settings.targetColorLumpDom=='commonQuery'){
			    	colorLumpDiv.width(colorLumpDiv.width()-52);//通查后面有设置按钮，故此减去按钮宽度
			    	$("#"+settings.spanid).parent().parent().find('.qryFieldInputDiv').append(colorLumpDiv);
			    }else{
			    	$("#"+settings.spanid).after(colorLumpDiv);
			    }
			    //将输入框隐藏之
			    inputObj.css("display","none");
			   
			},
			/**
			 * 展现下拉列表 <br />
			 * 调用方法： <br />
			 * jquery插件的机制进行开发，调用方式类似jquery其他方法<br />
			 * 举例如下：<br />
			 *		$('#dispfile2').rqDropDown(settings);<br />
			 *		(1)dispfile2意义为id=dispfile2的input输入框<br />
			 *      (2)参数settings ,下拉列表配置参数，json对象.举例：<br />var settings = {<br />"apppath":,//web应用根路径<br />"datatype":"local",//数据类型,如果为local，则source属性为json对象。如果为json，则source为远程数据的url<br />"source":jsonDataArr,<br />"multi":true,//是否具备多选的能力<br />"urlData"://datatype为json时，此处为source指定的url的参数对<br />};<br />
			 * @name rqDropDown
			 * @param settings 
			 */
			rqDropDown:function(settings){
				var DATALIST_DIV_HEIGHT = "190";
				var INITI_VALUE = settings.source;
				var IS_ORDER = false;
				if(settings.height){
                    DATALIST_DIV_HEIGHT = settings.height;
                }
				var down_text = "";
				settings = extendSettings(settings,$(this));
				gcResource(settings);
				changeInputStyle(settings);
				initEvents(settings);
				function showDataBySettings(settings){
					switch(settings.datatype){
						case "json":
							showRqDropDownByJson(settings);
							break;
						case "local":
							showRqDropDownByLocal(settings);
							displayNowValue(settings);
							break;	
					}
				}
				/**
				 * 初始化事件
				 * 1.下拉图片的click事件，控制下拉列表的创建显示和销毁
				 * 2.输入框的数据过滤事件
				 */
				function initEvents(settings){
					var curWin = getDomainTop(window);
					//2.定义它的click事件-点击则出现数据
					if(settings.inDateDiv == "yes"){
					    var selectImge = $('#selectImg_'+getSrcId(settings),curWin.document);
					}else{
					    var selectImge = $('#selectImg_'+getSrcId(settings));
					}
					/*
					selectImge.unbind("click");
					selectImge.bind("click",function(e){
					    e.stopPropagation();
					    if($('#rqDropDownList_'+getSrcId(settings), curWin.document).length>0){
					        $('#'+getSrcId(settings)).destroyDropDown(settings);
					    }else{
					        showDataBySettings(settings);
					    }
					});
					*/
					//3.定义 事件,数据改变了则改变下拉列表的数据
					settings.inputObj.keydown(
						function(event){
							down_text = $(this).val();
							//tab键时关闭编辑风格
							if(event.keyCode == 9){
							    $('#'+getSrcId(settings)).destroyDropDown(settings);
							}
						}
					)
					settings.inputObj.keyup(
						function(event){
							if($("#"+settings.inputid).attr("readonly")=="readonly"){
								settings.editable=0;
							}
							//当可编辑或者允许新值的时候才启用停顿查询
							if(settings.editable==1 || settings.newValue==1){//是否可编辑 0.不可编辑 1.可编辑；是否允许新值 0.不允许 1.允许
							    //if(event.keyCode != 8){//当按键不是BackSpace（退格）键时才执行停顿查询
							    if(event.keyCode != 9){//tab键切换时不查询
							        var up_text = $(this).val();
							        $(this).attr("realvalue",$(this).val());
							        //if(down_text!=up_text){
								      filterData(up_text);
							        //}
						      }
							}
						}
					)
				}
				function testBox(settings){
					var a = $(settings.inputObj);
					confirm("height:>"+a.outerHeight()+"="+a.height()+"=="+a.innerHeight()
						+"=="+a.css("margin-top")+"=="+a.css("margin-bottom")
						+"=="+a.css("border-top-width")+"=="+a.css("border-bottom-width")
						+"=="+a.css("padding-top")+"=="+a.css("padding-bottom")
						+"=="+a.css("height"));
				}
				/**
				 * 改变输入框的样式
				 * 1.输入框后增加一个下拉图片。图片的大小，位置，由输入框计算而得
				 */
				function changeInputStyle(settings){
				    try{
    					//1.改变input的外观，
    					var inputObjID = getSrcId(settings);
    					var curWin = getDomainTop(window);
    					if(settings.inDateDiv == "yes"){
    					    //图标已存在时不再添加
    					    if($('#selectImg_'+inputObjID,curWin.document).length > 0){
    					        return;
    					    }
    					}
						
					    var imageClick = function(e){
					        e.stopPropagation();
					        if($('#rqDropDownList_'+getSrcId(settings), curWin.document).length>0){
								$('#'+getSrcId(settings)).destroyDropDown(settings);
								try{$('#selectImg_'+getSrcId(settings)).mouseover();}catch(e){}
					        }else{
					            //reloadData重新加载数据的标志，用于下拉按钮再次点击时重新取数，当显示数据之后移除该属性；没有关联过滤时也不再重新取数
					            if($(this).attr("reloadData") == "true" || !settings.hasFilters){
					                showDataBySettings(settings);
					                $(this).removeAttr("reloadData");
					            }else{
					                $(settings.htmlElement).click();
					            }
					        }
					    };
						settings.idPrex = "select";
						settings.image = "/mis2/gezComponents/formstyle/css/images/seect-write.gif";//默认图片
						settings.hoverImage = "/mis2/gezComponents/formstyle/css/images/select-blue.gif";//鼠标移入图片
						settings.click = imageClick;
						if($("#" + inputObjID).length > 0){
						    $("#" + inputObjID).appendIcon(settings);
						}else if(settings.curWindow != "null" && settings.curWindow != "undefined"){
							//解决填报中，有多个日历时，日历面板上年月下拉按钮不显示的问题
						    if($("#" + inputObjID,settings.curWindow.document).length > 0){
							    $("#" + inputObjID,settings.curWindow.document).appendIcon(settings);
							}
						}
                        
				    }catch(e){}
				}
				/**
				 * 回收资源，销毁之前输入框创建的下拉列表等，便于重新创建
				 * 1.销毁下拉列表DIV
				 * 2.销毁下拉图片DIV
				 */
				function gcResource(settings){
					$('#'+getSrcId(settings)).destroyDropDown(settings);
					$('#'+getSrcId(settings)).destroySelect();
				}
				
				/**
				 * 初始化配置参数
				 * 将传入的覆盖到默认的对象上，
				 */
				function extendSettings(settings,containerobj){
					var containertag = "INPUT";
					if($(containerobj)[0]){
						containertag = $(containerobj)[0].tagName;
					} 
					var inputnow = null;
					if(containertag=="INPUT"){//兼容以前，但以后不推荐使用
						inputnow = containerobj;
						/*下面这块儿代码导致新版的编辑风格出现bug，先删除
						//添加一层过滤，如果真实值而没有显示值则去掉真实值，防止文本框中删了显示值，真实值还存在而产生下拉列表中的选项仍然是勾选状态
						if((inputnow.attr("realvalue")!=null && inputnow.attr("realvalue")!="")){
							var realvalues = inputnow.attr("realvalue").split(",");
							var values=[];
							var arr = [];
							if((inputnow.attr("value")!=null && inputnow.attr("value")!="")){
								values=inputnow.attr("value").split(",");
								for(var i=0;i<realvalues.length;i++){
									for(var j=0;j<values.length;j++){
										if(realvalues[i]==values[j]){
											arr.push(realvalues[i]);
										}
									}
								}
							}

							inputnow.attr("realvalue",arr);
						}*/
					}else{//推荐使用外层容器，然后内层input等元素由组件创建
						$(containerobj).find("input[forrqdropdown]").remove();
						var inputobj = $("<input type='text'/>");
						containerobj.append(inputobj);
						inputnow = inputobj;
						if(!settings.inputid){
							settings.inputid = containerobj.attr("id")+"_rqdropdown_input";
						}
						inputnow.attr("id",settings.inputid);
						inputnow.attr("realvalue",containerobj.attr("realvalue"));
						inputnow.val(containerobj.attr("dispvalue"));
					}
					if(typeof(saveArr[inputnow.attr("id")])=="undefined"){
						saveArr[inputnow.attr("id")]=new Object();
						saveArr[inputnow.attr("id")].checkedRealValues=[];
						saveArr[inputnow.attr("id")].checkedShowValues=[];
					}
					//confirm(inputnow.attr("id")+"   "+saveArr[inputnow.attr("id")].checkedRealValues)
					//confirm(saveArr[inputnow.attr("id")].checkedRealValues)
					$(inputnow).attr("forrqdropdown","true");
					var defaultSettings = {
						"apppath":"rqLib",
						"datatype":"json",//json + local
						"source":null,
						"multi":false,
						"inputObj":inputnow,
						"inputid":null,
						"urlData":"",
						"imageFolder":"",
						"onchange":null,
						"changedata":"",
						"delay":1000,
						"displaylen":10,
						"searchData":false,
						"sortData":false,
						"pageCount":0,
						"countPerPage":10,
						"nowPageNum":1,
						"curWindow":window,
						"pageData":[],
						"checkedRealValues":saveArr[inputnow.attr("id")].checkedRealValues,
						"checkedShowValues":saveArr[inputnow.attr("id")].checkedShowValues
					};
					settings = $.extend(true,defaultSettings,settings);
					if(settings.imageFolder==null||settings.imageFolder==""){
						if(settings.apppath!=null&&settings.apppath!=""){
							settings.imageFolder = settings.apppath+"/mis2/gezComponents/formstyle/css/images/";
						}else{
							settings.imageFolder = "";
						}
					}
					if(settings.pageCount>=1){
						settings.displaylen = settings.pageCount * settings.countPerPage+1;
					}else{
						settings.displaylen = "";	
					}
					return settings; 
				}
				/**
				 * 复选的情况下，反显输入框中的值,
				 * 单选的反显没有弄,
				 */
				function displayNowValue(settings){
					var realvalue = settings.inputObj.attr("realvalue");
					var realvalueArray = new Array();
					if(typeof(realvalue) != "undefined" && realvalue.indexOf("[") == 0 && realvalue.indexOf("]") == realvalue.length - 1){
					    var realvalues = eval(realvalue);
					    for(var i=0;i<realvalues.length;i++){
					        realvalueArray.push(realvalues[i]);
					    }
					}else{
					    realvalueArray = typeof(realvalue) != "undefined" ? realvalue.split(",") : new Array();
					}
					var sunNum = 0;
					//当下拉列表有多页时并且为复选，全选后将所有选项信息保存到变量中
					if(settings.pageCount>1 && settings.multi && settings.multi==true){
						if((settings.checkedRealValues+"")!=""){
							var itemsCount = settings.source.length;
							
							if(settings.pageCount>=1){
								if(settings.pageData.length>(settings.pageCount*settings.countPerPage)){
									itemsCount = (settings.pageCount*settings.countPerPage)+"+";
								}else{
									itemsCount = settings.pageData.length;
								}
							}
							var rvs = realvalueArray;
							/*
							var rvs="";
							if(!(settings.inputObj.val().search("等")!=-1 && settings.inputObj.val().search("项")!=-1)){
								rvs=settings.inputObj.val().split(",");
							}else{
								rvs=(settings.checkedRealValues+"").split(",");
							}*/
							if(rvs.length==itemsCount){
								if(settings.showOnTop == true){
									  $('#rqChooseAllImg_'+getSrcId(settings),settings.domainTop.document).removeClass("rqUnChooseAllImg");
									  $('#rqChooseAllImg_'+getSrcId(settings),settings.domainTop.document).addClass("rqChooseAllImg");
								}else{
									  $('#rqChooseAllImg_'+getSrcId(settings),settings.curWindow.document).removeClass("rqUnChooseAllImg");
									  $('#rqChooseAllImg_'+getSrcId(settings),settings.curWindow.document).addClass("rqChooseAllImg");
								}
							}
							for(var i=0;i<rvs.length;i++){
							  //遍历rqDataList_获取当前行对象
							  $.each($('#rqDataList_'+getSrcId(settings)+' input',settings.domainTop.document),function(key,value){
							    if(rvs[i] == $(this).attr("value")){
							      $(this).attr("checked",true);
							      $(this).parent().find('span').eq(0).attr("class","rqFormalignSelected");
							      return false;
							    }
							  });
								//$('#rqdata_'+getSrcId(settings)+'_'+rvs[i],settings.curWindow.document).attr("checked",true)
								//$('#rqdata_'+getSrcId(settings)+'_'+rvs[i],settings.curWindow.document).parent().find('span').eq(0).attr("class","rqFormalignSelected");
							}
						}else if(settings.inputObj.val()!=""){
							var checkItems=settings.inputObj.val().split(",");
							var items=settings.pageData;
							for(var i=0;i<items.length;i++){
								for(var j=0;j<checkItems.length;j++){
									if(items[i][1]==checkItems[j]){
									  //遍历rqDataList_获取当前行对象
									  $.each($('#rqDataList_'+getSrcId(settings)+' input',settings.domainTop.document),function(key,value){
									    if(items[i][0] == $(this).attr("value")){
									      $(this).attr("checked",true);
									      $(this).parent().find('span').eq(0).attr("class","rqFormalignSelected");
									      return false;
									    }
									  });
									  break;
										//$('#rqdata_'+getSrcId(settings)+'_'+items[i][0],settings.curWindow.document).attr("checked",true)
										//$('#rqdata_'+getSrcId(settings)+'_'+items[i][0],settings.curWindow.document).parent().find('span').eq(0).attr("class","rqFormalignSelected");
									}
								}
							}
						}
					}
					var curWindow = settings.curWindow;
					if(realvalue&&realvalue!=""){
						if(settings.multi&&settings.multi==true){
							//var realids = realvalue.split(",");
							var realids = realvalueArray;
							var reallen = realids.length;
							for(var i=0;i<reallen;i++){
								var realid = realids[i];
								realid = realid.replace(/\s+/g,""); 
								//遍历rqDataList_获取当前行对象
								$.each($('#rqDataList_'+getSrcId(settings)+' input',curWindow.document),function(key,value){
								  if(realid == $(this).attr("value")){
								    $(this).attr("checked","checked");
								    $(this).parent().find('span').eq(0).attr("class","rqFormalignSelected");
								    sunNum++;
								    return false;
								  }
								});
								
								/*如果找不到复选框
								if(typeof($('#rqdata_'+getSrcId(settings)+'_'+realid).attr("id"),curWindow.document) == "undefined"){
									$.each($("#rqDataList_"+getSrcId(settings),curWindow.document).children("div"),function(k,v){
										if($(v).attr("value") == realid){
											$(v).children("input").attr('checked','checked');
											sunNum++;
											var a = $(v).attr("id");
											a = a.replace(/\//g,"\\/");
											$("#"+a).find('span').eq(0).attr("class","rqFormalignSelected");
										}
									})
								}else{
									if(!(settings.pageCount>1 && settings.multi && settings.multi==true)){
										$('#rqdata_'+getSrcId(settings)+'_'+realid,curWindow.document).attr('checked','checked');
										sunNum++;
										realid = realid.replace(/\//g,"\\/");
										$('#rqdata_'+getSrcId(settings)+'_'+realid,curWindow.document).parent().find('span').eq(0).attr("class","rqFormalignSelected");
									}
								}*/
							}
							var sumLen = $("#rqDataList_"+getSrcId(settings),curWindow.document).children().length;
							if(!(settings.pageCount>1 && settings.multi && settings.multi==true)){
								if(reallen<sumLen){
									afterNotAllChecked(settings);
								}else if(reallen==sumLen){
									afterAllChecked(settings);
								}
							}
						}else{
						  //遍历rqDataList_获取当前行对象  为避免真实值带有特殊符号
						  $.each($("#rqDataList_"+getSrcId(settings),curWindow.document).children("div"),function(k,v){
						    if($(v).attr("value") == realvalueArray[0]){
						      $(v).addClass("rqdataDivleft");
						      $(v).addClass("rqDropDownListDataOver");
						      return false;
						    }
						  });
						  /*
							if(typeof($('#rqdata_'+getSrcId(settings)+'_'+realvalue).attr("id"),curWindow.document) == "undefined"){
								$.each($("#rqDataList_"+getSrcId(settings),curWindow.document).children("div"),function(k,v){
									if($(v).attr("value") == realvalue){
										$(v).addClass("rqdataDivleft");
									}
								})
							}else{
								$('#rqdataDiv_'+getSrcId(settings)+'_'+realvalue,curWindow.document).addClass("rqdataDivleft");
							}
							$('#rqdataDiv_'+getSrcId(settings)+'_'+realid,curWindow.document).addClass("rqDropDownListDataOver");
							*/
						}
					}else{
						if(settings.multi&&settings.multi==true){
							afterAllUnChecked(settings);
						}
						
					}
					//当下拉列表有多页时并且为复选，全选后将所有选项信息保存到变量中
					if(settings.pageCount>1 && settings.multi && settings.multi==true){
						if(!(settings.inputObj.val().search("等")!=-1 && settings.inputObj.val().search("项")!=-1)){
						  var inputValue = settings.inputObj.val();
						  sunNum = ""==inputValue ? 0 : inputValue.split(",").length;
						}else{
						  sunNum=settings.checkedRealValues.length
						}
					}
					
					selectedAmount(sunNum, settings.curWindow); 
					/*搜索框的反显*/
					if(settings.filter !=undefined){
						$('#searchDataFilter',curWindow.document).val(settings.filter);
					}else{
						$('#searchDataFilter',curWindow.document).val('搜索');
					}
					/*排序样式的修改*/
					if(IS_ORDER){//已排序
						$('#rqsortImg').removeClass("rqsortImg");
						$('#rqsortImg').addClass("rqunsortImg");
						IS_ORDER = false;
					}else{//未排序
						$('#rqsortImg').removeClass("rqunsortImg");
						$('#rqsortImg').addClass("rqsortImg");
						IS_ORDER = true;
					}
					/*使用autoPosition方法在createHTMLByData方法中
					//原面板top值
					var formerlyTop = settings.inputObj.offset().top+$(settings.inputObj).height()+5;
					//超出top值
					var beyondHei = $('#rqDropDownList_'+getSrcId(settings)).height() - ($(window).height()+$(document).scrollTop() - settings.inputObj.offset().top - $(settings.inputObj).height());
					//计算得出如果面板区域下面显示不全，面板向上移动超出的高度
					if($(window).height()+$(document).scrollTop()-settings.inputObj.offset().top-$(settings.inputObj).height() < $('#rqDropDownList_'+getSrcId(settings)).height()){
						$('#rqDropDownList_'+getSrcId(settings)).css("top",formerlyTop-beyondHei);
					}*/
				}
				/**
				 * 获取源输入框的ID的统一方法
				 */
				function getSrcId(settings){
					return settings.inputObj.attr('id');
				}
				/**
				 * 过滤数据的核心方法
				 */
				function filterData(filter_text){
					if(settings.filterTimer){
						clearTimeout(settings.filterTimer);
					}
					var timerId = setTimeout(function(){
						settings.filterTimer = null;
						//输入框已不存在时不过滤，主要用于填报自动计算
						if($('#'+getSrcId(settings)).length == 0){
						    return;    
						}
						(typeof canMoveFocus == "undefined" || canMoveFocus) && $('#'+getSrcId(settings)).destroyDropDown(settings);
						settings.filter = filter_text;
						//添加一层过滤，如果真实值而没有显示值则去掉真实值，防止文本框中删了显示值，真实值还存在而产生下拉列表中的选项仍然是勾选状态
						/*
						if((settings.inputObj.attr("realvalue")!=null && settings.inputObj.attr("realvalue")!="")){	
							var realvalues = settings.inputObj.attr("realvalue").split(",");
							var values=[];
							var arr = [];
							if((settings.inputObj.attr("value")!=null && settings.inputObj.attr("value")!="")){
								values=settings.inputObj.attr("value").split(",");
								for(var i=0;i<realvalues.length;i++){
									for(var j=0;j<values.length;j++){
										if(realvalues[i]==values[j]){
											arr.push(realvalues[i]);
										}
									}
								}
							}
							
							settings.inputObj.attr("realvalue",arr);
						}
						*/
						showDataBySettings(settings);
					},settings.delay);
					settings.filterTimer = timerId;
					
					/*
					if($('#rqDataList_'+getSrcId(settings)).length>0){
						$.each($('#rqDataList_'+getSrcId(settings)+'>div'),function(key,value){
							var text = $(value).attr('text');
							if(text.indexOf(filter_text)==-1){
								$(value).css('display','none');
							}else{
								$(value).css('display','block');
							}
						});
					}
					*/
				}
				/**
				 * 如果数据类型是远程json数据，则此方法为入口
				 */
				function showRqDropDownByJson(settings){
					settings.urlData = settings.urlData||{};
					var filterreq = settings.filter;
					if(window.Base64Util){
						var filterreq = (settings.filter==null||settings.filter=="")?"":Base64Util.encode(settings.filter);
					}
					var exter = {"ddreq":filterreq,"ddlen":settings.displaylen};

					$.extend(true,settings.urlData,exter);
					$.ajax({
						type:"POST",
						url: settings.source,
						cache:false,
						data:settings.urlData,
						dataType:"json",
						success:function(data, textStatus){
							createHTMLByData(data,settings);
						},
						error:function(XMLHttpRequest, textStatus, errorThrown){
							alert(errorThrown);
						}
					});
				}
				/**
				 * 如果数据类型是本地数据，则此方法为入口
				 */
				function showRqDropDownByLocal(settings){
					var data = settings.source;
					var filter = settings.filter;
					if(filter!=null){
						var dataFilter = [];
						//防止选中三个及以上，删除一个或多个（剩余两个以上），会显示选中条目为0个
						var filters = filter.split(",");
						for(var i=0;i<filters.length;i++){
							$.each(data,function(key,value){
								var text = value[1];
								if(text.indexOf(filters[i])!=-1){
									dataFilter.push(value);
								}
							});
						}
						data = dataFilter;
					}
					createHTMLByData(data,settings);
				}
				/**
				 * 创建下拉列表最外层整体的DIV
				 */
				function createBorderDiv(settings){
					var inId = settings.inputObj.attr('id');
					var curWindow = settings.curWindow;

					var frameDiv = $("<div id='rqDropDownList_"+inId+"' class='rqDropDownList' style='min-width:120px;'></div>");
					if(settings.inDateDiv == "yes"){
					   var dpWindow = getDomainTop(window);//获取日历所在窗口
					   curWindow = dpWindow;
					   var positiondiv = getAbsolutePosition($("#"+inId,dpWindow.document).get()[0], dpWindow);
					   var dateDivTop = $("#ui-datepicker-div",dpWindow.document).css("top");
					   var dateDivLeft = $("#ui-datepicker-div",dpWindow.document).css("left");
                       positiondiv.top = (parseInt(positiondiv.top) - parseInt(dateDivTop));
                       positiondiv.left = (parseInt(positiondiv.left) - parseInt(dateDivLeft) - 1);
					   var rqsettingobj = positiondiv;
					   frameDiv.css("border-top-color","#CCCCCC");
					}else{
					    //填报里可能会存在输入框已经消失的情况，此时取单元格
					    var obj = $("#"+inId).length > 0 ? $("#"+inId).get()[0] : $("#"+(inId.replace("_input",""))).get()[0];
					    var positiondiv = getAbsolutePosition(obj, window);
					    var rqsettingobj = settings.showOnTop ? positiondiv : settings.inputObj.offset();
					}

					frameDiv.css('left',rqsettingobj.left);
					frameDiv.css('top',parseInt(rqsettingobj.top)+parseInt(settings.inputObj.height()));
					var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null
					if(isChrome){
						frameDiv.width(settings.inputObj.outerWidth()-2);
					}else{
						frameDiv.width(settings.inputObj.outerWidth()-2);
					}
					if(settings.inputObj.attr('customclass') != undefined) {
					    frameDiv.addClass(settings.inputObj.attr('customclass'));
					}

					// div添加属性及事件，标记鼠标是否在此div上：
					$(frameDiv).attr("mouse_on",false);
					$(frameDiv).bind('mouseover',function(e){//查找a对象，并给对象创建onmouseover事件--这里可以替换成其他的如：div($('div').bind())，ul下的 li $('ul > li').bind()
						$(this,curWindow.document).attr("mouse_on",true);
					}).bind('mouseout',function(){//给对象创建mouseout事件
						$(this,curWindow.document).attr("mouse_on",false);
					});
                    
				    $(frameDiv).mousedown(
                        function(e){
						   var event = e||window.event; 
                           event.stopPropagation();
                        }
                     );
					return frameDiv;
				}
	
	//监听窗口关闭事件，窗口关闭时同时关闭下拉列表
	/*
	function bindWindowCloseForm(settings, borderDiv, srcId, win){
		//监听窗口关闭
		$(win).unbind("beforeunload");
		$(win).bind("beforeunload", {"settings":settings, "borderDiv":borderDiv,"srcId":srcId,"win":win}, closeFormFunc);
		
		var domainTop = settings.curWindow;
		if(win != domainTop){
			try{bindWindowCloseForm(settings, borderDiv, srcId, win.parent);}catch(e){}
		}
	}
	*/
    
	/**
	 * 给窗口绑定点击空白下拉列表消失方法
	 */
	function bindCloseFormFunc(settings, borderDiv, srcId, win){
		$("html",win.document).unbind("mousedown",closeFormFunc);//删除unbind的closeFormFunc  因为这中调用 传进closeFormFunc的evt始终是第一次调用的evt
		$("html",win.document).bind("mousedown", {"settings":settings, "borderDiv":borderDiv,"srcId":srcId,"win":win}, closeFormFunc);
		
		if(win.frames.length > 0){
			try{
				for(var i=0; i<win.frames.length; i++){
					bindCloseFormFunc(settings, borderDiv, srcId, win.frames[i]);
				}
			}catch(e){
				
			}
		}
	}
    
	/**
	 * 点击空白区域关闭下拉列表的方法
	 */
	function closeFormFunc(evt){
		var settings = evt.data.settings;
		var borderDiv = evt.data.borderDiv;
		var srcId = evt.data.srcId;
		var domainTop = settings.curWindow;
		var win = evt.data.win;
		
		evt = evt || win.event;
		var targetElement = evt.target || evt.srcElement;
		if($(borderDiv,domainTop.document).length > 0 && $(borderDiv,domainTop.document).css("dispaly") != "none"){
			if($(targetElement,win.document).attr("editstyle") == 2 || $(targetElement,win.document).attr("editstyle") == 3){
				return;
			}else if($(targetElement,win.document).attr("id") == srcId){
				return;
			}
			
			var left = parseInt($(borderDiv,domainTop.document).offset().left);//下拉树树面板左边距
			var top = parseInt($(borderDiv,domainTop.document).offset().top);//下拉树树面板上边距
			var height = parseInt($(borderDiv,domainTop.document).outerHeight());//下拉树树面板上高度
			var width = parseInt($(borderDiv,domainTop.document).outerWidth());//下拉树树面板上宽度
			
			var absLeft = parseInt(settings.absPosition.left);//输入框左边距
			var absTop = parseInt(settings.absPosition.top);//输入框上边距
			var absHeight = parseInt(settings.absElementHeight);//输入框高度
			var absWidth = parseInt(settings.absElementWidth);//输入框宽度
			
			//获取鼠标相对于顶层窗口的绝对位置
			var mousePosition = getMouseAbsolutePosition(evt,win);
			var mX = mousePosition.mX;
			var mY = mousePosition.mY;
			
			if(left<=mX && mX<=(left+width) && top<=mY && mY<=(top+height)){
				//点击面板区域无操作
			}else if(absLeft<=mX && mX<=(absLeft+absWidth) && absTop<=mY && mY<=(absTop+absHeight)){
				//点击输入框区域无操作				
			}else{
				//清空选中项信息
				if(settings.inputObj.val()=="" || settings.inputObj.val()==null){
					 settings.checkedRealValues.length=0;
					 settings.checkedShowValues.length=0;
				}else{
					/*saveArr[settings.inputObj.attr("id")].checkedRealValues=preCRV;
					saveArr[settings.inputObj.attr("id")].checkedShowValues=preCSV;*/
				}
				
				//tdWidth存在表示在填报里
				if(typeof(settings.tdWidth) != "undefined" && settings.autoHideEditor != "false"){
				    var cellElement = settings.element;
				    if(cellElement){
				        var canEmpty = $(cellElement).attr("canEmpty") == "1";
				        //不能为空且输入框为空时    
				        if(!canEmpty && $('#'+srcId).val() == "") {
				            alert("不能为空");
				            // 光标聚焦在文本框内
				            $('#'+srcId).focus();
				            canMoveFocus = false;
				        }else{
				            var autoHideEditor = $(cellElement).attr("autoHideEditor");
				            //输入框自动隐藏属性不存在或者为true时才隐藏
				            if(typeof(autoHideEditor) == "undefined" || autoHideEditor == "true"){
				                $('#'+srcId).trigger("blur");
				                if(canMoveFocus){
				                    $('#'+srcId).destroyDropDown(settings);
				                    //允许为空或者输入框值不为空才执行下面操作
				                    $('#'+srcId).destroySelect();
				                    $('#'+srcId).parent().html($('#'+srcId).val());
				                    //$('#'+srcId).remove();
				                }else{
				                    $('#'+srcId).focus();    
				                }
				            }
				        }
				    }
				}else{
				    $('#'+srcId).destroyDropDown(settings);    
				}
			}
		}
	 }
				/**
				 * 把下拉列表的数据转化成html元素
				 */
				function createHTMLByData(data,settings){
					/*
					var displayLen = settings.displaylen;
					if(data.length>displayLen){
						data = data.slice(0,displayLen);
					}*/
					if(settings.pageCount>=1){
						settings.pageData = data;
						settings.nowPageNum = 1;
						var dataPageCount = Math.floor(data.length/settings.countPerPage);
						if(data.length%settings.countPerPage>0){
							dataPageCount = dataPageCount+1;
						}
						if(dataPageCount<settings.pageCount){
								settings.pageCount = dataPageCount;
						}
						data = data.slice(0,settings.countPerPage);
					}
					var domainTop = getDomainTop(window);
					settings.domainTop = domainTop;
					var borderDiv = createBorderDiv(settings);
					
					//搜索框
					if(settings.searchData&&settings.searchData==true){
						var dataSearch = dataSearchFun(data,settings);
						borderDiv.append(dataSearch);
					}
					//全选复选框
					if(settings.multi&&settings.multi==true){
						var chooseAllDiv = createChooseAll(settings);
						borderDiv.append(chooseAllDiv);
					}
					//数据
					var dataDiv = createDataList(data,settings);
					borderDiv.append(dataDiv);
					
					//已选项，及确定取消
					var funcDiv = createFuncDiv(data,settings);
					borderDiv.append(funcDiv);
					//判断弹出数据列表是否顶层显示
					if(settings.showOnTop == true){
						$(top.document.body).append(borderDiv);
					}else if(settings.inDateDiv == "yes"){
					    $("#ui-datepicker-div",getDomainTop(window).document).append(borderDiv);
					}else{
						$(document.body).append(borderDiv);
					}

					//重置下拉框的位置以自适应窗口
					if(settings.inDateDiv != "yes"){//当为日历中的年月下拉时，不需要调整位置
					    var _window = autoPosition($(borderDiv),settings.inputObj, settings);
					    settings.curWindow = _window;
						settings.inputid = $(settings.inputObj).attr("id");
					    settings.txtid = $(settings.inputObj).attr("id");
						if(_window != window){
							var file00 = {name:getContextPath() + "/mis2/gezComponents/jquery/jquery.js",type:"js"};
							var file01 = {name:getContextPath() + "/mis2/gezComponents/formstyle/js/form.js",type:"js"};
							var file02 = {name:getContextPath() + "/mis2/style/s1/customStyle/customStyle.css",type:"css"};
							var file03 = {name:getContextPath() + "/mis2/custom/commonquery/css/customEditStyle.css",type:"css"};
					    
							var file05 = {name:getContextPath()+"/mis2/gezComponents/formstyle/css/form.css",type:"css"};
							var loadFileArray = new Array(file00,file01,file02,file03,file05);
							settings.loadFileArray = loadFileArray;
							loadJsCssFile(_window,loadFileArray);
						}
						
						//给下拉列表所在窗口的和所有父窗口绑定方法
						bindCloseFormFunc(settings, borderDiv,getSrcId(settings),_window);//为当前窗口以及所有父窗口绑定点击空白下拉树面板消失的方法 
						//给下拉列表的所有祖先元素解绑滚动监听事件
						$(settings.inputObj).parents().each(function(){
							$(this).unbind("scroll",scrollFunc);
						});
						unbindScrollFunc(settings.curWindow, window);//先解绑当前窗口到顶层窗口间，下拉列表位置调整的监听事件
							
						setTimeout(function(){
							 //给下拉列表的所有祖先元素进行绑定滚动监听事件
							$(settings.inputObj).parents().each(function(){
								$(this).bind("scroll",{"divObj":$(borderDiv),"inputObj":settings.inputObj,"domainTop":settings.curWindow},scrollFunc);
							 });
							bindScrollFunc($(borderDiv) ,settings.inputObj, settings.curWindow, window);
						},200);
					    
					    if(_window == top){
						   settings.onTop = true;//为autoPosition增加的onTop属性，区别于上面的showOnTop，目的是为了不影响其他功能
					    }	
					}else{
					    settings.curWindow = getDomainTop(window);
					}

					displayNowValue(settings);
					if(!(settings.inputObj.val().search("等")!=-1 && settings.inputObj.val().search("项")!=-1)){
						if(settings.inputObj.val()!=""){
							selectedAmount(settings.inputObj.val().split(",").length, settings.curWindow);
						}else{
							// saveArr[settings.inputObj.attr("id")]=settings.checkedRealValues;
					 	// 	saveArr[settings.inputObj.attr("id")]=settings.checkedShowValues;
							settings.checkedRealValues.length=0;
							selectedAmount(0, settings.curWindow);
						}
					}
				}
				function link2Page(pageNum,settings){
					if(pageNum<1){
						pageNum = 1;
					}
					if(pageNum>settings.pageCount){
						alert("更多数据无法显示，请缩小范围查询");
						return;
					}
					settings.nowPageNum = pageNum;
					var inid = getSrcId(settings);
					$(getDomainTop(window).document.getElementById("pageSelect_"+inid)).val(pageNum);
					var listDiv = $(getDomainTop(window).document.getElementById("rqDataList_"+inid));//$("#rqDataList_"+inid);
					listDiv.empty();
					var startIndex = settings.countPerPage*(pageNum-1)+1;
					var endIndex = settings.countPerPage*pageNum;
					// 单选下拉数据集并且settings.allowNulls=1才增加一个置为空的选项
					(typeof(settings.multi) == "undefined" || !settings.multi) && (typeof(settings.allowNulls) != "undefined" && settings.allowNulls == "1")  ? createClearDiv(listDiv,settings) : "";
					for(var i=startIndex-1;i<endIndex;i++){
					  var id = "";
					  var text = "";
						if(settings.pageData.length>i){
								var value = settings.pageData[i];
								id = value[0];
								text = value[1];
								var dataDiv = createOneData(id,text,settings,i);
								listDiv.append(dataDiv);
						}
						
						//此处为下拉列表有多页时并且为复选，多页面切换时返显选中状态的选项--add by jiajianhui 2014/5/7
						if(settings.pageCount>1){
							for(var j=0;j<settings.checkedRealValues.length;j++){
								if(id==settings.checkedRealValues[j]){
								  //多选
								  if(settings.multi && settings.multi==true){
  								  //遍历rqDataList_获取当前行对象
  								  $.each($('#rqDataList_'+getSrcId(settings)+' input',settings.domainTop.document),function(key,value){
  								    if(id == $(this).attr("value")){
  								      $(this).attr("checked","checked");
  								      $(this).parent().find('span').eq(0).attr("class","rqFormalignSelected");
  								      return false;
  								    }
  								  });
								  }else{//单选
								    $.each($("#rqDataList_"+getSrcId(settings),settings.domainTop.document).children("div"),function(k,v){
								      if($(v).attr("value") == id){
								        $(v).addClass("rqdataDivleft");
								        $(v).addClass("rqDropDownListDataOver");
								        return false;
								      }
								    });
								  }
								  break;
									//$('#rqdata_'+getSrcId(settings)+"_"+id,settings.curWindow.document).attr("checked","checked")
									//$('#rqdata_'+getSrcId(settings)+"_"+id,settings.curWindow.document).parent().find('span').eq(0).attr("class","rqFormalignSelected");
								}
							}									
						}
					}

					//将下拉div高度调整为自适应，其他地方对显示下拉div的高度设置了固定值为初始值，导致后面选项比第一页少，但是div的高度没变
					$(getDomainTop(window).document.getElementById("rqDropDownList_"+inid)).height("auto");
				}

				/**
				 * 已选项，确定取消按钮的div
				 */
				function createFuncDiv(data,settings){
					var inId = getSrcId(settings);
					var num = 0;
					var tiaomushu = data.length;
					if(settings.pageCount>=1){
						if(settings.pageData.length>(settings.pageCount*settings.countPerPage)){
							tiaomushu = (settings.pageCount*settings.countPerPage)+"+";
						}else{
							tiaomushu = settings.pageData.length;
						}
					}
					if(settings.multi&&settings.multi==true){
						var funcFont = $("<font class='rqDropDownNum' id='selectedNumber'>已选"+num+"项</font>");
					}
					if(settings.pageCount>=1){
						var funcFontT = $("<font class='rqDropDownNum'>总条目数:"+tiaomushu+"</font>");
					}
					
					var funcBtn1 = $("<span id='OKBtn_" + inId + "' class='formButtonSpan' onMouseover=\"this.style.cursor='pointer';this.style.cursor='hand'\" style='position:relative'>选择</span>");
					//funcBtn1.attr("src", settings.imageFolder + "OKButton.gif");      
					$(funcBtn1).click(
						function(e){
						    typeof(e.stopPropagation) != "undefined" ? e.stopPropagation() : e.cancelBubble = true; 
						    if(setValue2Src(settings)!=false){
							    //关闭窗口
							    $('#'+getSrcId(settings)).destroyDropDown(settings);
							}
						}
					);
					var funcBtn2 = $("<span id='CancelBtn_" + inId + "' class='formButtonSpan' onMouseover=\"this.style.cursor='pointer';this.style.cursor='hand'\" style='position:relative;'>取消</span>");
					//funcBtn2.attr("src", settings.imageFolder + "CancelButton.gif");      
					$(funcBtn2).click(
						function(){
							if(settings.inputObj.val()==""){
								settings.checkedRealValues.length=0;
								settings.checkedShowValues.length=0;
								settings.inputObj.val("")
								if($(settings.element).attr("canEmpty") == "0"){
								    alert("不能为空");
								    return false;
								}
							}else{
								/*saveArr[settings.inputObj.attr("id")].checkedRealValues=preCRV;
								saveArr[settings.inputObj.attr("id")].checkedShowValues=preCSV;*/
							}
							//关闭窗口
							$('#'+getSrcId(settings)).destroyDropDown(settings);
						}
					)
					var funcDivResult = $("<div id='funcDivResult_"+inId+"' class='funcDiv'></div>");
					var funcDiv = $("<div id='funcDiv_"+inId+"' class='funcDiv'></div>");

					if(settings.multi&&settings.multi==true){
						funcDiv.append(funcFont);
						funcDiv.append(funcBtn2);
						funcDiv.append(funcBtn1);
					}
					var funcDiv2 = $("<div id='funcDiv2_"+inId+"' class='funcDiv2'></div>");
					//页数大于1页才显示分页
					if(settings.pageCount>1){
						window.link2Page = link2Page;
						var pageBar = $("<span style='float:right;padding-right:3px;padding-top:2px;'></span>");
						var firstPage = $("<span style='display:block;float:left;padding-right:1px;cursor:pointer;margin-top:4px;'><img src='" + settings.imageFolder + "firstpage.png' width='14px' height='14px'></img></span>");
						var prePage = $("<span style='display:block;float:left;padding-right:1px;cursor:pointer;margin-top:4px;'><img src='" + settings.imageFolder + "prepage.png' width='14px' height='14px'></img></span>");
						var selectPage = $("<select style='display:block;float:left;border:1px solid #cccccc;font-size:12px;' id='pageSelect_" + inId + "'></select>");
						var nextPage = $("<span style='display:block;float:left;padding-right:1px;padding-left:1px;cursor:pointer;margin-top:4px;'><img src='" + settings.imageFolder + "nextpage.png' width='14px' height='14px'></img></span>");
						var lastPage = $("<span style='display:block;float:left;padding-right:1px;cursor:pointer;margin-top:4px;'><img src='" + settings.imageFolder + "lastpage.png' width='14px' height='14px'></img></span>");
                    
						for(var i=1;i<=settings.pageCount;i++){
							selectPage.append("<option value='"+i+"'>"+i+"</option>");
						}

						//添加"mouse_on"属性，在inputReportStyle.js的showCellFilterDropDataSet(cell)方法中进行焦点判断
						var curWindow = settings.curWindow;
						selectPage.attr("mouse_on",false);
						selectPage.bind('mouseover',function(e){//查找a对象，并给对象创建onmouseover事件--这里可以替换成其他的如：div($('div').bind())，ul下的 li $('ul > li').bind()
							$(this,curWindow.document).attr("mouse_on",true);
						}).bind('mouseout',function(){//给对象创建mouseout事件
							$(this,curWindow.document).attr("mouse_on",false);
						});

						firstPage.bind("click",{settings:settings},function(event){
							if(event.stopPropagation()){event.stopPropagation();}else{event.cancelBubble = true;}
							link2Page(1,event.data.settings);
						});
						prePage.bind("click",{settings:settings},function(event){
							link2Page(parseInt(event.data.settings.nowPageNum)-1,event.data.settings);
						});
						nextPage.bind("click",{settings:settings},function(event){
							link2Page(parseInt(event.data.settings.nowPageNum)+1,event.data.settings);
						});
						lastPage.bind("click",{settings:settings},function(event){
							link2Page(event.data.settings.pageCount,event.data.settings);
						});
						selectPage.bind("change",{inId:inId,settings:settings},function(event){
							link2Page($(getDomainTop(window).document.getElementById("pageSelect_"+event.data.inId)).val(),event.data.settings);
						});
						pageBar.append(firstPage).append(prePage)
												.append(selectPage)
												.append(nextPage).append(lastPage);			
						funcDiv2.append(funcFontT);				
						funcDiv2.append(pageBar);
					}
					if(settings.pageCount>=1){
						funcDivResult.append(funcDiv2);
					}
					funcDivResult.append(funcDiv);
					return funcDivResult;
				}
				/*
				 * 复选框-已选项
				 */
				function selectedAmount(selectedNum, curWindow){
					$('#selectedNumber',curWindow.document).text("已选"+selectedNum+"项")
					return selectedNum;
				}
				/**
				 * 工具方法，获取字符串的字节数
				 */
				function getStrByteLen(str){
					//计算字节数
					var charCount = 0;
					for(var i=0,len=str.length;i<len;i++){
						var item = str.charCodeAt(i);
						if(item>255){
							charCount+=2;
						}else{
							charCount+=1;
						}
					}
					return charCount;
				}
				/**
				 * 工具方法，获取字符串的宽度
				 */
				function getStrWidth(str){
					//计算字符串宽度
					var span = $("<span>"+str+"</span>");
					$(document.body).append(span);
					var strwidth = span.width();
					span.remove();
					return strwidth;
				}
				
				/**
				 * 给源输入框赋值的方法
				 */
				function setValue2Src(settings){
					//填报中不为空、不允许新值的提示窗，在关闭下拉面板时应一同关闭
					try{$("#AlertMessage",settings.curWindow.document).hide();}catch(e){}
					var inId = getSrcId(settings);
					//回填值
					var realvalue = new Array();
					var dispvalue = new Array();
					var realvalueStr = "";
					var dispvalueStr = "";
					//是否有特殊符号  逗号
					var hasSpecialSymbol = false;
					if(settings.multi&&settings.multi==true){
						if(settings.showOnTop == true){
							$.each($('#rqDataList_'+inId+' input',settings.domainTop.document),function(key,value){
								var id = $(value).attr('id');
								if(id.indexOf("rqdata_"+inId+"_")==0){
									var checkAttr = $(value).attr('checked');
									if(checkAttr){
									    hasSpecialSymbol = $(value).val().indexOf(",") != -1 || $(value).attr('text').indexOf(",") != -1;
									    realvalueStr += $(value).val() + ",";
									    dispvalueStr += $(value).attr('text') + ",";
									    realvalue.push($(value).val());
									    dispvalue.push($(value).attr('text'));
									}
								}
							});
						}else{
							$.each($('#rqDataList_'+inId+' input',settings.curWindow.document),function(key,value){
								var id = $(value).attr('id');
								if(id.indexOf("rqdata_"+inId+"_")==0){
									var checkAttr = $(value).attr('checked');
									if(checkAttr){
									    hasSpecialSymbol = $(value).val().indexOf(",") != -1 || $(value).attr('text').indexOf(",") != -1;
									    realvalueStr += $(value).val() + ",";
									    dispvalueStr += $(value).attr('text') + ",";
									    realvalue.push($(value).val());
									    dispvalue.push($(value).attr('text'));
									}
								}
							});
						}
						
						if(realvalueStr!=""){
							realvalueStr = realvalueStr.substring(0,realvalueStr.length-1);
						}
						if(dispvalueStr!=""){
							dispvalueStr = dispvalueStr.substring(0,dispvalueStr.length-1);
						}
					}else{
					    hasSpecialSymbol = settings.radioDataDiv.attr("value").indexOf(",") != -1 || settings.radioDataDiv.attr("text").indexOf(",") != -1;
					    realvalueStr = settings.radioDataDiv.attr("value");
					    dispvalueStr = settings.radioDataDiv.attr("text");
					    realvalue.push(settings.radioDataDiv.attr("value"));
					    //显示值为“（空）”，真实值为“”时将显示值设置为空值
					    dispvalue.push(settings.radioDataDiv.text() == "(空)" && settings.radioDataDiv.attr("value") == "" ? "" : settings.radioDataDiv.text());
					    // dispvalue.push(settings.radioDataDiv.attr("text"));
					}
					//此处为下拉列表有多页时并且为复选，所有选中选项的真实值和显示值--add by jiajianhui 2014/5/7
					if(settings.pageCount>1 && settings.multi && settings.multi==true){
					    realvalue = settings.checkedRealValues;
					    dispvalue = settings.checkedShowValues;
					    realvalueStr = realvalue.toString();
					}
					if(!(settings.inputObj.val().search("等")!=-1 && settings.inputObj.val().search("项")!=-1)){
						//textValue=clearNull(textValue);
					}

					//var valueArr = textValue.split(",");
					var valueArr = dispvalue;
					
					var vc = valueArr.length;
					var temp = "";
					if(vc<2){
						//settings.inputObj.attr('title',textValue);
						temp = vc == 0 ? "" : valueArr[0];
						//将截取显示的字符串还原为完整的真实字符串
						if(temp && temp.indexOf('...')!=-1 && realvalue[0].indexOf(temp.split('...')[0])!=-1){
							temp=realvalue[0];
						}
					}else{
						//var temp = valueArr[0]+","+valueArr[1]+","+valueArr[2]+","+valueArr[3]+","+valueArr[4]+" 等"+vc+"项";
						temp = valueArr[0]+" 等"+vc+"项";
					}
					settings.inputObj.attr('title',temp);

					$('#selectImg_'+getSrcId(settings)).attr('title',settings.inputObj.attr('title'));
					var inputWidth = settings.inputObj.width()-$('#selectImg_'+getSrcId(settings)).width(); 
					qryValueCache = settings.inputObj.val();//将文本框值记入到缓冲变量
					preCRV=realvalue.toString();
					preCSV=dispvalue.toString();
					
					//真实值的限制长度  当tdWidth有值时表示填报，取此值。否则，取输入框的
					var permitWidth = typeof(settings.tdWidth) != "undefined" ? settings.tdWidth : inputWidth;
					if($(settings.element).attr("canEmpty") == "0" && temp == ""){
					    alert("不能为空");
					    return false;
					}
					settings.inputObj.val(textSubstring(temp,permitWidth));
					
					//转为数组的形式  这样真实值与显示值中可以带逗号
					var realvalueArray = new Array();
					var realvalueStrCallBack = "";

					var dispvalueArray = new Array();
					var dispvalueStrCallBack = "";
					for(var i = 0; i < realvalue.length; i++){
					    //var realvalueObj = {realvalue:realvalue[i]};
					    realvalueArray.push(realvalue[i]);
					    realvalueStrCallBack += realvalue[i] + " ";
					    					    
					    //var dispvalueObj = {dispvalue:dispvalue[i]};
					    dispvalueArray.push(dispvalue[i]);
					    dispvalueStrCallBack += dispvalue[i];
					}
					realvalueStr = hasSpecialSymbol ? JSON.stringify(realvalueArray) : realvalueStr;
					dispvalueStr = hasSpecialSymbol ? JSON.stringify(dispvalueArray) : dispvalueStr;
					
					//var dispvalueStr = dispvalue.length > 1 ? ("["+dispvalue.toString()+"]") : dispvalue.toString();
					settings.inputObj.attr('realvalue',realvalueStr);
					$("#"+inId).attr("realvalue",realvalueStr);
					
					if(settings.onchange){
						settings.realvalue=new Array();
						settings.dispvalue=new Array();
						var backSettings = {
							inputid:settings.inputObj.attr("id"),
							multi:settings.multi,
							conditionName:settings.conditionName,
							conditionAliasName:settings.conditionAliasName,
							realvalue:realvalue,
							dispvalue:dispvalue
						};
						backSettings = $.extend(settings,backSettings);
						if(typeof(settings.onchange)=='function'){
							settings.onchange(dispvalueStr, realvalueStr, backSettings);
						}else{
							eval(settings.onchange+"('"+dispvalueStr+"','"+realvalueStr+"',backSettings);");
						}
					}
				}

				function clearNull(value){
					var values=value.split(",");
					var str="";
					for(var i=0;i<values.length;i++){
						if(values[i]!=""){
							str+=values[i]+",";
						}
					}
					str=str.substring(0,str.length-1)
					return str;
				}
				
				function textSubstring(text,width){
					var fontWidth = getStrWidth(text.toString());
					var result = text.toString();
					if(result && $.getStringWidth(result)>(width-20)){
						result=$.autoSubstring(result,width-20);
					}
					return result;
				}
				/**
				 * 当全选触发以后，其他元件的状态变化。
				 * 全选既包括全选按钮被点击的情况，也包括单选按钮全部选中的情况
				 */
				function afterAllChecked(settings){
					var inId = getSrcId(settings);
					if(settings.showOnTop == true){
						  $('#rqChooseAllImg_'+inId,settings.domainTop.document).removeClass("rqUnChooseAllImg");
						  $('#rqChooseAllImg_'+inId,settings.domainTop.document).addClass("rqChooseAllImg");
					}else{
					    $('#rqChooseAllImg_'+inId,settings.curWindow.document).removeClass("rqUnChooseAllImg");
						  $('#rqChooseAllImg_'+inId,settings.curWindow.document).addClass("rqChooseAllImg");
					}			
				}
				/**
				 * 当全不选触发以后，其他元件的状态变化。
				 * 全不选既包括全选按钮被点击的情况，也包括单选按钮全部不选中的情况
				 */
				function afterAllUnChecked(settings){
					var inId = getSrcId(settings);
					if(settings.showOnTop == true){
						  $('#rqChooseAllImg_'+inId,settings.domainTop.document).removeClass("rqChooseAllImg");
						  $('#rqChooseAllImg_'+inId,settings.domainTop.document).addClass("rqUnChooseAllImg");
					}else{
						  $('#rqChooseAllImg_'+inId,settings.curWindow.document).removeClass("rqChooseAllImg");
						  $('#rqChooseAllImg_'+inId,settings.curWindow.document).addClass("rqUnChooseAllImg");
					}
				}
				/**
				 * 当不全选触发以后，其他元件的状态变化。
				 * 不全选既包括单选按钮不全部选中的情况
				 */ 
				function afterNotAllChecked(settings){
					var inId = getSrcId(settings);
					if(settings.showOnTop == true){
						  $('#rqChooseAllImg_'+inId,settings.domainTop.document).removeClass("rqChooseAllImg");
						  $('#rqChooseAllImg_'+inId,settings.domainTop.document).addClass("rqUnChooseAllImg");
					}else{
						  $('#rqChooseAllImg_'+inId,settings.curWindow.document).removeClass("rqChooseAllImg");
						  $('#rqChooseAllImg_'+inId,settings.curWindow.document).addClass("rqUnChooseAllImg");
					}
				}
				/**
				 * 创建全选部分的DIV
				 */
				function createChooseAll(settings){
					var chooseAllImg = $("<img id='rqChooseAllImg_"+getSrcId(settings)+"' class='rqUnChooseAllImg'/>");
					chooseAllImg.attr("src",settings.imageFolder+"write.gif");
					chooseAllImg.toggle(
						function(){
							var checked_num = 0;
							afterAllChecked(settings);
							//当下拉列表有多页时并且为复选，全选后将所有选项信息保存到变量中
							if(settings.pageCount>1 && settings.multi && settings.multi==true){
								settings.checkedRealValues.length=0;
								settings.checkedShowValues.length=0;
								for(var i=0;i<settings.pageData.length;i++){
									settings.checkedRealValues.push(settings.pageData[i][0]);
									settings.checkedShowValues.push(settings.pageData[i][1]);
								}
							}
							if(settings.showOnTop == true){
								$.each($('#rqDataList_'+getSrcId(settings)+' input',settings.domainTop.document),function(key,value){
									var id = $(value).attr('id');
									if(id.indexOf("rqdata_"+getSrcId(settings)+"_")==0){
										$(value).attr('checked','checked');
										checked_num++;
										$("#"+id).parent().find("span").eq(0).removeClass("rqFormalignSelect");
										$("#"+id).parent().find("span").eq(0).addClass("rqFormalignSelected");										
									}
								});
							}else{
								var curWindow = settings.curWindow;
								$.each($('#rqDataList_'+getSrcId(settings)+' input',curWindow.document),function(key,value){
									var id = $(value).attr('id');
									if(id.indexOf("rqdata_"+getSrcId(settings)+"_")==0){
										$(value).attr('checked','checked');
										checked_num++;
										$("#"+id,curWindow.document).parent().find("span").eq(0).removeClass("rqFormalignSelect");
										$("#"+id,curWindow.document).parent().find("span").eq(0).addClass("rqFormalignSelected");
									}
								});
							}

							if(settings.pageCount>1 && settings.multi && settings.multi==true){
								checked_num=settings.checkedRealValues.length;
							}
							selectedAmount(checked_num, settings.curWindow);
						},
						function(){
							afterAllUnChecked(settings);
							if(settings.showOnTop == true){
								$.each($('#rqDataList_'+getSrcId(settings)+' input',settings.domainTop.document),function(key,value){
									//当下拉列表有多页时并且为复选，清空变量中的选项信息--add by jiajianhui 2014/5/7
									removeAllUncheckedInfo(value,settings);

									var id = $(value).attr('id');
									if(id.indexOf("rqdata_"+getSrcId(settings)+"_")==0){
										$(value).removeAttr('checked');
										$("#"+id).parent().find("span").eq(0).removeClass("rqFormalignSelected");
										$("#"+id).parent().find("span").eq(0).addClass("rqFormalignSelect");
									}
								});
							}else{
								var curWindow = settings.curWindow;
								$.each($('#rqDataList_'+getSrcId(settings)+' input',curWindow.document),function(key,value){
									//此处为下拉列表有多页时并且为复选，取消选中选项后删除保存变量中对应选项的真实值和显示值及选项ID--add by jiajianhui 2014/5/7
									removeAllUncheckedInfo(value,settings);

									var id = $(value).attr('id');
									if(id.indexOf("rqdata_"+getSrcId(settings)+"_")==0){
										$(value).removeAttr('checked');
										$("#"+id,curWindow.document).parent().find("span").eq(0).removeClass("rqFormalignSelected");
										$("#"+id,curWindow.document).parent().find("span").eq(0).addClass("rqFormalignSelect");
									}
								});
							}
							selectedAmount(0, settings.curWindow);
						}
					)
					
					var chooseAllFont = $("<font class='rqChooseAllFont'>全选</font>");
					var chooseAllDiv = $("<div id='rqChooseAllDiv_"+getSrcId(settings)+"' class='rqChooseAllDiv'></div>");
					chooseAllDiv.append(chooseAllImg);
					chooseAllDiv.append(chooseAllFont);
					return chooseAllDiv;
				}
				
				/*
				 * 搜索框
				 */
				function dataSearchFun(data,settings){
					var chooseDataDiv = $("<div id='' class='rqChooseAllDiv'></div>");
					var inputSearch = $("<input id='searchDataFilter' value='搜索' class='rqSearchInput'/>");
					var searchImg = $("<img id='' class='rqSearchImg'/>");
					searchImg.attr("src",settings.imageFolder+"filterData.gif");
					searchImg.width("29px");
					searchImg.height("24px");
					var divWai = $("<span id='' class='rqSearchSpan'></span>");

					if(settings.sortData&&settings.sortData==true){//显示排序
						inputSearch.width(settings.inputObj.width()-8-30);
						divWai.css("margin-left",inputSearch.width()-searchImg.width()+3+"px");
						var sortImg = $("<img id='rqsortImg' src='"+settings.imageFolder+"write.gif' /></span>");
						sortImg.width("26px");
						sortImg.height("26px");
						sortImg.css("margin-left",inputSearch.width()+5+"px");
					}else{
						inputSearch.width(settings.inputObj.width()-8);
						divWai.css("margin-left",inputSearch.width()-searchImg.width()+3+"px");
						
					}
					divWai.width(searchImg.width());
					divWai.height(searchImg.height());
					divWai.insertAfter(inputSearch);
					divWai.append(searchImg);
					/*点击搜索*/
					$(divWai).click(
						function(){
							var searchCondition = $('#searchDataFilter').val();
							showFilterData(searchCondition);
					});

					$(inputSearch).focus(function(){
						if($('#searchDataFilter').val() == '搜索'){
							$('#searchDataFilter').val('');
						}
					});

					/*点击排序*/
					$(sortImg).click(
						function(){
							showSortData(data,settings);
					});
					chooseDataDiv.append(inputSearch);
					if(settings.sortData&&settings.sortData==true){//显示排序
						chooseDataDiv.append(sortImg);
					}
					chooseDataDiv.prepend(divWai);
					return chooseDataDiv;
				}
				/*
				 * 显示符合搜索条件的数据
				 */
				function showFilterData(filterText){
					$('#'+getSrcId(settings)).destroyDropDown(settings);
					settings.filter = filterText;
					//添加一层过滤，如果真实值而没有显示值则去掉真实值，防止文本框中删了显示值，真实值还存在而产生下拉列表中的选项仍然是勾选状态
					if((settings.inputObj.attr("realvalue")!=null && settings.inputObj.attr("realvalue")!="")){	
						var realvalues = settings.inputObj.attr("realvalue").split(",");
						var values=[];
						var arr = [];
						if((settings.inputObj.attr("value")!=null && settings.inputObj.attr("value")!="")){
							values=settings.inputObj.attr("value").split(",");
							for(var i=0;i<realvalues.length;i++){
								for(var j=0;j<values.length;j++){
									if(realvalues[i]==values[j]){
										arr.push(realvalues[i]);
									}
								}
							}
						}
						
						settings.inputObj.attr("realvalue",arr);
						
					}
					showDataBySettings(settings);
					
				}
				/*
				 * 列表排序
				 */
				function showSortData(data,settings){
					$('#'+getSrcId(settings)).destroyDropDown(settings);
					//var resultValue = settings.source;

					var resultValue = data;
					var arrayData = [];//排序
					var showList = [];//暂时存储列表数据
					var sourceDataNew = [];//按照排序组成新的数据

					for(var j=0;j<resultValue.length;j++){
						var text = resultValue[j][1];
						var key = resultValue[j][0];
						arrayData.push(text+"_"+key);
					}
					arrayData= arrayData.sort(
						function compareFunction(param1,param2){
							return param1.localeCompare(param2);
						}
					);
					for(var i=0;i<arrayData.length;i++){
						showList = arrayData[i].split("_");
						sourceDataNew.push([showList[1],showList[0]])
					}
					if(resultValue.toString() == sourceDataNew.toString()){//未排序
						settings.source = INITI_VALUE;
						IS_ORDER  = false;
					}else{//已排序
						settings.source = sourceDataNew;
						IS_ORDER  = true;
					}
					
					showDataBySettings(settings);

				}
				
				/**
				 * 创建数据列表部分的DIV
				 */
				function createDataList(data,settings){
					var listDiv = $("<div id='rqDataList_"+getSrcId(settings)+"' class='rqDataList'></div>");
					if(data.length>9){
						listDiv.height(DATALIST_DIV_HEIGHT);
						listDiv.css('overflow-y','scroll');
						listDiv.css('overflow-x','no');	
					}
					$(settings.borderDiv).append(listDiv);
					// 单选下拉数据集并且settings.allowNulls=1才增加一个置为空的选项
					(typeof(settings.multi) == "undefined" || !settings.multi) && (typeof(settings.allowNulls) != "undefined" && settings.allowNulls == "1")  ? createClearDiv(listDiv,settings) : "";
					$.each(data,function(key,value){
						var id = value[0];
						var text = value[1];
						var dataDiv = createOneData(id,text,settings,key);
						listDiv.append(dataDiv);
					});
					return listDiv;
				}
				
				//创建清空的div
				function createClearDiv(listDiv,settings){
					// 第一个置为空的id和text都是空字符串
					var clearDiv = createOneData("","(空)",settings);
					listDiv.append(clearDiv);
				}
				
				/**
				 * 下拉列表选项有多页时，保存选中选项信息
				 */
				function saveCheckedItemInfo(obj,settings){
					if(settings.pageCount>1 && settings.multi && settings.multi==true){
						isSame=true;//是否已有当前选项属性值
						for(var i=0;i<settings.checkedRealValues.length;i++){
							if($(obj).val()==settings.checkedRealValues[i]){
								isSame=false;
							}
						}
						if(isSame==true){//没有当前选项的属性值，则加入保存变量中
							settings.checkedRealValues.push($(obj).val());
							settings.checkedShowValues.push($(obj).attr('text'));
						}
					}
				}
				
				/**
				 * 不使用全选按钮时，单个取消选中项，去掉变量中保存的该选项信息
				 */
				function removeUncheckedInfo(obj,settings){
					//此处为下拉列表有多页时并且为复选，取消选中选项后删除保存变量中对应选项的真实值和显示值及选项ID--add by jiajianhui 2014/5/8
					if(settings.pageCount>1 && settings.multi && settings.multi==true && $(obj).attr("checked")!="checked"){
						if($.inArray($(obj).val(),settings.checkedRealValues)!=-1){
							settings.checkedRealValues.splice($.inArray($(obj).val(),settings.checkedRealValues),1);
							settings.checkedShowValues.splice($.inArray($(obj).attr('text'),settings.checkedShowValues),1);
							$(obj).attr("checked",false)
						}
					}
				}
				
				/**
				 * 使用全选按钮时，取消所有选中项，去掉变量中保存的所有选项信息
				 */
				function removeAllUncheckedInfo(obj,settings){
					//此处为下拉列表有多页时并且为复选时执行此操作--add by jiajianhui 2014/5/8
					if(settings.pageCount>1 && settings.multi && settings.multi==true){
						settings.checkedRealValues.length=0;
						settings.checkedShowValues.length=0;
					}
				}
				
				/**
				 * 创建单条数据的DIV
				 */
				function createOneData(id,text,settings,arrayIndex){
					var textTemp = text;
					// text为空时表示置空
					if("(空)" == text){
						text = "";
					}
					//生成“空”时，arrayIndex未传，此时初始化为null
					if(typeof(arrayIndex) == "undefined"){
					  arrayIndex = "null";
					}
					var idValue = (id+"").replace(/\s+/g,""); 
					var dataCheckBox = $("<input id='rqdata_"+getSrcId(settings)+"_"+arrayIndex+"' type='checkbox' value='"+id+"' style='width:20px;' text='"+text+"' class='rqFormalign' />");
					var dataCheckBox1 = $("<span class='rqFormalignSelect' id='a'>&nbsp;</span>");
					if(!(settings.inputObj.val().search("等")!=-1 && settings.inputObj.val().search("项")!=-1) && settings.inputObj.val()!=""){
					    var realvalues = settings.inputObj.attr("realvalue");
					    realvalues = typeof(realvalues) != "undefined" ? realvalues : "";
					    settings.checkedRealValues = new Array();
					    settings.checkedShowValues = new Array();
					    if(realvalues.indexOf("[") == 0 && realvalues.indexOf("]") == realvalues.length - 1){
					        realvalues = eval(realvalues);
					    }else{
					        realvalues = realvalues != "" ? realvalues.split(",") : new Array();  
					    }
					    for(var i = 0; i < realvalues.length; i++){
					        settings.checkedRealValues.push(realvalues[i]);
					    }
					    if($.inArray(id,settings.checkedRealValues)!=-1){
					        dataCheckBox.attr("checked",true);
					        dataCheckBox1.attr("class","rqFormalignSelected");
					    }
					}
					dataCheckBox.click(
						function(){
							var no_checked_num = 0;
							var checked_num = 0;
							var sum_num = 0; 
							var curWindow = settings.curWindow;
							if(settings.showOnTop == true){
								//此处为下拉列表有多页时并且为复现，取消选中选项后删除保存变量中对应选项的真实值和显示值及选项ID--add by jiajianhui 2014/5/8
								removeUncheckedInfo(this,settings);
								$.each($('#rqDataList_'+getSrcId(settings)+' input',settings.domainTop.document),function(key,value){
									var id = $(value).attr('id');
									if(id.indexOf("rqdata_"+getSrcId(settings)+"_")==0){
										sum_num++;
										var valuechecked = $(value).attr("checked");
										if(valuechecked){
											checked_num++;
											//此处为下拉列表有多页时并且为复选，记录所有选中选项的真实值和显示值及选项ID--add by jiajianhui 2014/5/8
											saveCheckedItemInfo(value,settings)

											id = id.replace(/\//g,"\\/");
											$('#'+id).parent().find('span').eq(0).attr("class","rqFormalignSelected");
										}else{
											no_checked_num++;
											id = id.replace(/\//g,"\\/");
											$('#'+id).parent().find('span').eq(0).attr("class","rqFormalignSelect");
										}
									}
								});
							}else{
								//此处为下拉列表有多页时并且为复现，取消选中选项后删除保存变量中对应选项的真实值和显示值及选项ID--add by jiajianhui 2014/5/8
								removeUncheckedInfo(this,settings);
                                
								$.each($('#rqDataList_'+getSrcId(settings)+' input',curWindow.document),function(key,value){
									var id = $(value).attr('id');
									if(id.indexOf("rqdata_"+getSrcId(settings)+"_")==0){
										sum_num++;
										var valuechecked = $(value).attr("checked");
										if(valuechecked){
											checked_num++;
											//此处为下拉列表有多页时并且为复选，记录所有选中选项的真实值和显示值及选项ID--add by jiajianhui 2014/5/8
											saveCheckedItemInfo(value,settings)

											id = id.replace(/\//g,"\\/");
											$('#'+id,curWindow.document).parent().find('span').eq(0).attr("class","rqFormalignSelected");
										}else{
											no_checked_num++;
											id = id.replace(/\//g,"\\/");
											$('#'+id,curWindow.document).parent().find('span').eq(0).attr("class","rqFormalignSelect");
										}
									}
								});
							}
							//此处为下拉列表有多页时并且为复选，记录选中选项的数目--add by jiajianhui 2014/5/8
							if(settings.pageCount>1 && settings.multi && settings.multi==true){
								checked_num=settings.checkedRealValues.length;
							}

							if(no_checked_num==0){
								afterAllChecked(settings);
							}else if(checked_num==0){
								afterAllUnChecked(settings);
							}else{
								afterNotAllChecked(settings);
							}
							//选中所有选项时，全选变为选中状态
							var itemsCount = settings.source.length;
							if(settings.pageCount>=1){
								if(settings.pageData.length>(settings.pageCount*settings.countPerPage)){
									itemsCount = (settings.pageCount*settings.countPerPage)+"+";
								}else{
									itemsCount = settings.pageData.length;
								}
							}
							if(checked_num==itemsCount){
								$('#rqChooseAllImg_'+getSrcId(settings)).addClass("rqChooseAllImg");
							}
							selectedAmount(checked_num, settings.curWindow);
						}
					)
					var dataDiv = $("<div id='rqdataDiv_"+getSrcId(settings)+"_"+arrayIndex+"' class='rqdataDiv' style='position:relative;cursor:pointer;*position:static;' value='"+id+"' text='"+text+"' title='"+text+"'></div>");
					dataDiv.mouseover(
						function(){
						    $(".rqdataDiv",settings.domainTop.document).removeClass("rqDropDownListDataOver");
						    $(this).addClass("rqDropDownListDataOver");
						}
					)
					dataDiv.mouseout(
						function(){
							$(this).removeClass("rqDropDownListDataOver");
						}
					)
					if(!(settings.multi&&settings.multi==true)){
						dataDiv.click(
							function(e){
								settings.radioDataDiv = $(this); 
								typeof(e.stopPropagation) != "undefined" ? e.stopPropagation() : e.cancelBubble = true; 
								setValue2Src(settings);
								//关闭窗口
								$('#'+getSrcId(settings)).destroyDropDown(settings);
							}
						);
					}
					if(settings.multi&&settings.multi==true){
						
						dataDiv.append(dataCheckBox1);
						dataDiv.append(dataCheckBox);
					}
					var limitWidth = settings.inputObj.width() < 120 ? 120 : settings.inputObj.width();
					var tmptext = "(空)" == textTemp ? textTemp : textSubstring(text,limitWidth-20);
					var dataFont = $("<font class='rqDataFont'>"+tmptext+"</font>"); 
					dataDiv.append(dataFont);
					return dataDiv;
				}
			}
		})
	}
)();

var saveArr=[];
var i=0;
// var checkedRealValues=new Array();//选中选项的真实值
// var checkedShowValues=new Array();//选中选项的显示值
/**
 * 点击下拉列表以外的地方，则下拉列表关闭
 * 此方法加入，会使QTP脚本运行失败，所以暂时注掉。但是功能上是好用的
 */
/*
$(document).bind(
	"click",
	function(event){
		$.each($("div"),function(key,value){
			var curr_id = $(value).attr("id");
			if(curr_id.indexOf("rqDropDownList_")==0){
				var minX = $(value).offset().left;
				var minY = $(value).offset().top;
				var maxX = minX+$(value).width();
				var maxY = minY+$(value).height();
				
				var inDropDown =((event.pageX>=minX&&event.pageX<=maxX)&&(event.pageY>=minY&&event.pageY<=maxY)); 
				
				var inputid = curr_id.substring(curr_id.indexOf("_")+1);
				
				minX = $('#'+inputid).offset().left;
				minY = $('#'+inputid).offset().top;
				maxX = $('#selectDiv_'+inputid).offset().left+$('#selectDiv_'+inputid).width();
				maxY = minY+$('#'+inputid).height();
				var inSelect = ((event.pageX>=minX&&event.pageX<=maxX)&&(event.pageY>=minY&&event.pageY<=maxY));
				if(!(inDropDown||inSelect)){
					$('#'+inputid).destroyDropDown();
				}
			}
		});
	}
);
*/
//点其他地方，关闭div

//add by:liuyimin 2013-11-27
//add begin
function rqform(){
	var settings;
	this.setConfig = function(){
		settings = arguments[0];
		settings.onchange = settings.onSet;
		if(settings.datatype == "url"){
			settings.datatype = "json";
		}
	};
	this.show = function(){
		if(arguments.length == 0){
			if(settings == undefined){
				alert("首先调用setConfig(settings)方法");
				return;
			}
		}else{
			setConfig(arguments[0]);
		}
		$(settings.htmlElement).rqDropDown(settings);
	};
}
//add end

//add by:liuyimin 2013-12-31
//add begin
//文本框
function rqText(){
	var settings;
	this.setConfig = function(){
		settings = arguments[0];
	};
	this.getConfig = function(){
		return this.settings;
	};
	this.show = function(){
		if(arguments == 0){
			if(settings == undefined){
				alert("首先设置settings!");
				return;
			}
		}else if(arguments.length == 1){
			this.setConfig(arguments[0]);
		}
		$(settings.htmlElement).bind('keyup',function(){
			if(settings.onSet != undefined){
				eval(settings.onSet);
			}
		});
	}
};

//复选框
function rqCheckBox(){
	var settings;
	this.setConfig = function(){
		settings = arguments[0];
	};
	this.getConfig = function(){
		return this.settings;
	};
	this.show = function(){
		if(arguments == 0){
			if(settings == undefined){
				alert("首先设置settings!");
				return;
			}
		}else if(arguments.length == 1){
			this.setConfig(arguments[0]);
		}
		$(settings.htmeElement).bind('click',function(){
			if(settings.onSet != undefined){
				eval(settings.onSet);
			}
		});
	}
};

//单选框
function rqRadio(){
	var settings;
	this.setConfig = function(){
		settings = arguments[0];
	};
	this.getConfig = function(){
		return this.settings;
	};
	this.show = function(){
		if(arguments == 0){
			if(settings == undefined){
				alert("首先设置settings!");
				return;
			}
		}else if(arguments.length == 1){
			this.setConfig(arguments[0]);
		}
		$(settings.htmeElement).bind('click',function(){
			if(settings.onSet != undefined){
				eval(settings.onSet);
			}
		});
	}
};

/**
* @param s待截取字符串
* @param num  截取字符数(汉字个数，认为俩个英文字母的宽度==一个汉字的宽度)
* @return
*/
function getSubstring(s, num) {
    var result = "";
    var realLen = s.length;
    var maxLen = num;// 由于当前个数为汉字个数*2所以需要除以2
    if (maxLen > 0) {
        if (realLen > maxLen) {
            if (realLen == maxLen + 1 && isNotZHCN(s, realLen - 2) && isNotZHCN(s, realLen - 1)) { // 当后两个字母为英文时则全部输出
                result = s;
            } else {
                var endP = maxLen;
                if (endP > 0) {
                    result = innerSubString(s, 0, endP - 1) + "..";
                }
            }
        } else {
            result = s;
        }
    }
    return result;
}

/** 是否为小写字母 */
function isNotZHCN(s, index) {
    return (s.charCodeAt(index) >= 97 && s.charCodeAt(index) <= 122) || (s.charCodeAt(index) >= 48 && s.charCodeAt(index) <= 57);
}

/**
* @param str待截取字符串
* @param sp 截取字符串的起始位置
* @param sp 截取字符串的结束位置
* @return
*/
function innerSubString(str, sp, ep) {
    var result = "";
    var times = 0;
    var flag = 0;
    var len = str.length;
    if (ep <= 0){
        return "";
    }
    
    for (var i = 0; i < len; i++) {
        if (str.charCodeAt(i) < 122 || str.charCodeAt(i) > 97) {
            if (flag == 0){
                times++;
            }else {
                if (times + 1 == ep){
                    break;// 如果汉字前有半个英文则退出循环不增加该汉字退出
                }else{
                    times++;                
                }
            }
        } else {
            if (flag == 0) {
                flag = 1;
            } else if (flag == 1) {
                flag = 0;
                times++;
            }
        }
        result += str.charAt(i);
        if (times == ep){
            break;// 如果执行次数满足截取结束索引则退出
        }
    }
    return result;
}

//获取能够显示的个数
function getShowNum(filterHeight, filterWidth, settings){
  var rowWidth = 0; // 总长度
  var rowHeight = settings.rowHeight;//行高
  var rowNum = filterHeight / rowHeight; // 行数
  rowNum = rowNum == 0 ? 1 : parseInt(rowNum);//不是整数舍去取整
  rowWidth = (filterWidth - (typeof(settings.labelWidth) != "undefined" ? settings.labelWidth : 0)); // 单行宽度
  var rowCount = parseInt(rowWidth / settings.optionLength);//一行可以放的个数
  var showNum = rowCount * rowNum; // 每行可以显示的个数乘以行数。总共可以显示的个数
  settings.rowCount = rowNum;
  return parseInt(showNum);
}

//将下列列表单复选色块、单复选钮的值增加到条件区域
function appendEditorArgsToInputHtml(inputObj, item, display, multi, editStyleDiv, settings){
    if("null" != item.value && item.value != null && "null" != item.disp && item.disp != null){
        var className = "";
        if (item.selected == true || item.selected == "true") {
            className = "colorlumpChecked";
        } else {
            className = "colorlumpUNChecked";
        }
        var checked = "";
        if (item.selected == true || item.selected == "true") {
            checked = "checked";
        }
        var dispTag = "";
        var condition = inputObj.attr("condition");
        if (condition == "3") {
            dispTag = "disabled = 'disabled'";
        }
        //display为true时，标签显示，否则隐藏
        var spanObj = display ? $("<span class='colorLumpSpan' style='float:left;width:" + settings.optionLength + "px;height:24px' ></span>") : $("<span name='"+settings.conditionName+"_none' style='display:none;'></span>");
        if(settings.style == 'multi_color_lump_style' || settings.style == 'single_color_lump_style'){
            //multi true时为复选，否则单选
            spanObj.append("<span " + dispTag + " name='" + settings.conditionName + "_color' id='" + settings.conditionName + "_" + item.value + "_color' title='" + item.disp + "' class='" + className + "' dispvalue='"+item.disp+"' value='" + item.value + "' onkeydown='keyCheck(event,"+multi+",this);' onclick='"+(multi ? "checkColorlump(this)" : "radioColorlump(this)")+"' style='TEXT-ALIGN: center; margin-right:5px; cursor:pointer;float:left;height:22px;line-height:22px;width:" + (settings.optionLength - 10) + "px' >" + $.autoSubstring(item.disp, settings.itemLabelWidth) + "</span>");
        }else if(settings.style == 'checkbox_style' || settings.style == 'radio_button_style'){
            spanObj.append("<span style='height:24px;line-height:24px;'  title='" + item.disp + "' ><input " + dispTag + " "+(multi ? "type='checkbox'" : "type='radio'")+" name='" + settings.conditionName + (multi ? "_checkbox' " : "_radio'") +checked+" title='" + item.disp + "' dispvalue='"+item.disp+"' value='" + item.value + "' style='vertical-align:middle;"+(multi ? "" : "margin-top:1px;")+"' onclick='radioAndCheckBoxEvent(this, "+multi+")' ><span onclick='radioAndCheckBoxEvent(this, "+multi+",\"span\")' style='vertical-align:middle;cursor:pointer;'>" + $.autoSubstring(item.disp, settings.itemLabelWidth) + "</span></span>");
        }
        editStyleDiv.append(spanObj);
    }
}

//将下列列表单复选色块、单复选钮的值增加到单元格区域
function appendEditorArgsToCellHtml(element, item, display, multi, editStyleDiv, settings){
    if("null" != item.realvalue && item.realvalue != null && "null" != item.dispvalue && item.dispvalue != null){
        var className = "";
        if (item.selected == true || item.selected == "true") {
            className = "colorlumpCheckedSpellClass";
        } else {
            className = "colorlumpUNCheckedSpellClass";
        }
        var checked = "";
        if (item.selected == true || item.selected == "true") {
            checked = "checked";
        }
        var dispTag = "";
        var condition = $(element).attr("condition");
        if (condition == "3") {
            dispTag = "disabled = 'disabled'";
        }
        //display为true时，标签显示，否则隐藏
        var spanObj = display ? $("<span class='colorLumpSpan' style='float:left;width:" + settings.optionLength + "px;height:24px' ></span>") : $("<span name='"+settings.conditionName+"_none' style='display:none;'></span>");
        if(settings.style == 'multi_color_lump_style' || settings.style == 'single_color_lump_style'){
            //multi true时为复选，否则单选
            spanObj.append("<span " + dispTag + " name='" + settings.conditionName + "_color' id='" + item.realvalue + "_color' title='" + item.dispvalue + "' class='" + className + "' value='" + item.realvalue + "' onkeydown='keyCheck(event,"+multi+",this);' onclick='"+(multi ? "checkColorlump(this)" : "radioColorlump(this)")+"' style='TEXT-ALIGN: center; margin-right:5px; cursor:pointer;float:left;height:22px;line-height:22px;width:" + (settings.optionLength - 10) + "px' >" + $.autoSubstring(item.dispvalue, settings.itemLabelWidth) + "</span>");
        }else if(settings.style == 'checkbox_style' || settings.style == 'radio_button_style'){
            spanObj.append("<span style='height:24px;line-height:24px;'  title='" + item.dispvalue + "' ><input " + dispTag + " "+(multi ? "type='checkbox'" : "type='radio'")+" name='" + settings.conditionName + (multi ? "_checkbox' " : "_radio'") +checked+" title='" + item.dispvalue + "' dispvalue='"+item.dispvalue+"' value='" + item.realvalue + "' style='vertical-align:middle;"+(multi ? "" : "margin-top:1px;")+"' onclick='radioAndCheckBoxEvent(this, "+multi+")' ><span onclick='radioAndCheckBoxEvent(this, "+multi+",\"span\")' style='vertical-align:middle;cursor:pointer;'>" + $.autoSubstring(item.dispvalue, settings.itemLabelWidth) + "</span></span>");
        }
        editStyleDiv.append(spanObj);
    }
}

/**
 * 增加“更多按钮”
 */
function appendMoreOperate(conditionName, txtid, editStyleDiv,settingsObj) {
	settingsObj.hiddenDom = "";//settingsObj.hiddenDom导致chrome下转字符串报错，这里后面不需要这个属性，设置为空。
    var spanObj = $("<span style='float:left;width:51px;height:24px' ></span>");
    var ecArg = $("#"+txtid).attr("editorConfigArg");
    conditionName = conditionName.replace(new RegExp("\\.","gm"),"_");
	var settingsStr ;
	try{
	 settingsStr =JSON.stringify(settingsObj) ;
	}catch(e){
	}
	var settings64 =Base64Util.encode(settingsStr);
    var imgStyle = "";
    if(!!window.ActiveXObject || "ActiveXObject" in window){
        imgStyle = "padding-top:6px;";
    }
    //更多按钮需要添加到这里
    //spanObj.append("<span name='" + conditionName + "_more' id='" + conditionName + "_more' txtid='"+txtid+"' editorConfigArg='"+editorConfigArg+"' filtername='"+conditionName+"' class='moreOperate' onclick='moreOperate(this)' style='TEXT-ALIGN: center; margin-left:5px; cursor:pointer;float:left;height:22px;line-height:22px;width:45px' >更多<<</span>");
    spanObj.append("<span name='" + conditionName + "_more' id='" + conditionName + "_more' txtid='" + txtid + "' settings='"+settings64+"' editorConfigArg='" + ecArg + "' filtername='" + conditionName + "' class='moreOperate' onclick='moreOperate(this)' style='TEXT-ALIGN: center; cursor:pointer;float:left;height:22px;line-height:22px;width:60px;' ><li class='moreText'>更多</li><li class='moreImg' style='height:22px;line-height:22px;'><img src='"+ $.contextPath + "/mis2/gezComponents/gezSpellClass/css/images/iconfont-gengduoxiala-xia.png' height='10' style='"+imgStyle+"' /></li></span>");
    editStyleDiv.append(spanObj);
}
//add end