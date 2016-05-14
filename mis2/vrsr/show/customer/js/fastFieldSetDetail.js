  $(document).ready(function(){
  	// 创建button
  	 createButton();
	 if(navigator.userAgent.indexOf("MSIE 9.0")>0) {   
		$(".wrap").attr("style","margin:0px 2px;");
	 }
	 $(".wrap").height($(window).height()-$("#fieldSetBtns").outerHeight());
	 try{fieldInfo = eval('(' + fieldInfo +')');}catch(e){}
	 var src = PathUtils.getRelativeJspUrl("/fastReport/analysis/groupListFieldSet.html");
	 if(fieldInfo.componentType == "group" || fieldInfo.dataType == ""){//分组字段或列表字段的文件夹
		 src = PathUtils.getRelativeJspUrl("/fastReport/analysis/groupFieldSet.html");
	 }
	 $("#fastFieldSet").attr("src",src);
	 $("#fastFieldSet").bind("load",function(){
		$("td[name='textAlign']",window.frames["fastFieldSet"].document).find("div.icon_div").css("text-align","center");
		$("td[name='textAlign']",window.frames["fastFieldSet"].document).find("i.icon").width("24px");
		$("td[name='textAlign']",window.frames["fastFieldSet"].document).find("span[buttonType='singleButton']").css({"padding-left":"0px","padding-right":"5px"})
		//隐藏合计方式
        if(fieldInfo.componentType == "group"){//分组字段
        }else{//列表字段
			//指标字段封掉合计方式、排序方式
			if(fieldInfo.targetFlag == true || fieldInfo.targetFlag == "true"){//指标
				//合计方式行
				var countTR = $("td[name='count'",window.frames["fastFieldSet"].document).parent("tr");
				countTR.hide();
				countTR.prev("tr").hide();
				countTR.next("tr").hide();
				//指标字段无排序方式
				var orderTr = $("td[name='order']",window.frames["fastFieldSet"].document).parent("tr");
				orderTr.prev("tr").remove();
				orderTr.remove();
			}
			
			//预警反显
		    if(fieldInfo.alarmString != "" && fieldInfo.alarmString != "null" && typeof fieldInfo.alarmString != "undefined"){
				$("td[name='isWarning']",window.frames["fastFieldSet"].document)[0].setAttribute("value","1");
				$("td[name='isWarning']",window.frames["fastFieldSet"].document).find("input[type='checkbox']").attr("checked","checked");
			}else{
				$("td[name='isWarning']",window.frames["fastFieldSet"].document)[0].setAttribute("value","0");       
			}
        }
		
		//合计方式默认值改为count
		if(fieldInfo.statExp == ""){
			fieldInfo.statExp = "count";
		}
		//列宽默认值修改99
		if(fieldInfo.width == ""){
			fieldInfo.width = "99";
		}
		
        filterStatExp(parseInt(fieldInfo.dataType));
		if(fieldInfo["alarmValue"] != "" && typeof fieldInfo["alarmValue"] != "undefined"){
			delete fieldInfo["alarmString"];
		}else{
			filterAlarmString();//解析预警串，判断是高级设置还是基本预警设置
		}
		$("td[name='dispValue']",window.frames["fastFieldSet"].document).children("input[type='text']").attr("disabled","disabled");
		window.frames["fastFieldSet"]._effect_load_data(fieldInfo);
		
		//新增配置项：对齐方式
		var styleNew = fieldInfo.styleNew;
		if(styleNew != "" && typeof styleNew != "undefined"){
			var base64 = new Base64();
			try{
				styleNew = base64.decode(styleNew);
				styleNew = JSON.parse(styleNew);
				var textAlign = styleNew.textAlign;
				$("td[name='textAlign']",window.frames["fastFieldSet"].document).find("span[name='" + textAlign + "']").click();
			}catch(e){}
		}
     
		$(window.frames["fastFieldSet"].document.body).click(function (e) {
			if ($(e.target).is($("td[name='dispFormat']",window.frames["fastFieldSet"].document)))
				return;
			closeSwf();			
		});
        $("td[name='alarmString']",window.frames["fastFieldSet"].document).text("");
        $("td[name='dispFormat']",window.frames["fastFieldSet"].document).attr("onclick","parent.showFormatSwf('dispFormat','fastFieldSet')").css("padding-left","5px");

        if(fieldInfo.componentType != "group"){//列表字段
            if(fieldInfo.statExp == "no" || fieldInfo.statExp == "" || fieldInfo.statExp == "null" || typeof fieldInfo.statExp == "undefined" ){
                removeStatExp();
	        }
        }
     });
  });


// 根据字段类型过滤合计方式
function filterStatExp(dataTypeNum){
    // 数值型字段，-6-1,1,2,3,4,5,6,7是数值型
    var dataNumTypeArray = [-6,-1,1,2,3,4,5,6,7];
    if($.inArray(dataTypeNum, dataNumTypeArray) == -1){
        //非数值型字段合计方式禁用求和、平均
        var starExpConfig = [];
        var editConfig = $("td[name='statExp']",window.frames["fastFieldSet"].document).attr("editConfig");
        if(editConfig != "" && editConfig != null && typeof editConfig != "undefined"){
            var base64 = new Base64();
            editConfig = base64.decode(editConfig);
            try{editConfig = JSON.parse(editConfig);}catch(e){}
            for(var i=0; i<editConfig.length; i++){
                if(editConfig[i].value != "sum" && editConfig[i].value != "avg"){
                    starExpConfig.push(editConfig[i]);
                }
            }
            $("td[name='statExp']",window.frames["fastFieldSet"].document).attr("editConfig", base64.encode(JSON.stringify(starExpConfig)));
        }
    }
}
  /**
   * 创建Button按钮
   */
  function createButton() {
	var jsondata=[];
	var jsonSettings = {"data":jsondata,"datatype":"json"};
	$("#fieldSetBtns").rqtoolbar(jsonSettings);
  }
//保存数据
function successCallback (){
	var base64=new Base64();
	var groupFieldJson = window.frames["fastFieldSet"]._effect_submit_data();
	
	 if(groupFieldJson.dispValue == "" || groupFieldJson.dispValue == "null" || typeof groupFieldJson.dispValue == "undefined"){
        alert("字段名称显示值不能为空!");
        return;
    }
	if(groupFieldJson.isWarning == "1"){// 有设置预警
        if(groupFieldJson.alarmString == "" || groupFieldJson.alarmString == "null" || typeof groupFieldJson.alarmString == "undefined"){
            //基本预警设置
			if(groupFieldJson.conditionValue == "" || groupFieldJson.conditionValue == "value" || typeof groupFieldJson.conditionValue == "undefined"){
				alert("请进行预警设置!");
				return;
			}
			groupFieldJson.alarmString = getAlarmStr();
        }else{//高级预警设置
		}
	}else{
		groupFieldJson.alarmString = "";
	}
	delete groupFieldJson["compareExp"];
	delete groupFieldJson["conditionValue"];
	delete groupFieldJson["isBgBright"];
    if(!(fieldInfo.targetFlag == true || fieldInfo.targetFlag == "true") && (groupFieldJson.order == "" || groupFieldJson.order == "null" || typeof groupFieldJson.order == "undefined")){
        alert("排序方式不能为空!");
        return;
    }

    if(groupFieldJson.statExp == "" || groupFieldJson.statExp == "null" || typeof groupFieldJson.statExp == "undefined"){
        groupFieldJson.statExp = "no";
    }
	
	//字段设置页面新增的属性都放到styleNew保存
	var styleNew = {};
	//对齐方式
	styleNew["textAlign"] = groupFieldJson["textAlign"];
	delete groupFieldJson["textAlign"];
	fieldInfo["styleNew"] = base64.encode(JSON.stringify(styleNew));

	for(var key in groupFieldJson){
        fieldInfo[key] = groupFieldJson[key];
    }
    if(fieldInfo.alarms != "" && fieldInfo.alarms != null){
        var alarms = fieldInfo.alarms;
        for(var i=0;i<alarms.length;i++){
            alarms[i] = eval('(' + alarms[i] + ')');
        }
        fieldInfo.alarms = alarms;
    }
	var action = 29;
	if(fieldInfo.componentType == "group"){
		action = 31;
	}
	
	fieldInfo = JSON.stringify(fieldInfo);
	$.ajax({
		url:PathUtils.getRelativeUrl("showFastReportServlet"),
		data:{"action":action,"fieldName":fieldName,"reportDefineId":reportDefineId,"resID":resID,"fieldInfo":base64.encode(fieldInfo),"time":new Date().getTime()},
		async:true,
		cache:false,
		success:function(data){
			try{$("li#showReport",window.parent.document).click();}catch(e){}
			closePop();
		},
		error:function(){
			
		}
	});
	
}
  /**
   * 关闭弹出层
   */
  function closePop() {
	 
  	  parent.closeDialog(window.name);
  }
 
//格式设置回调函数
function contentStyleBack(from,result){
	$(window.frames["fastFieldSet"].document).find("td[name='"+formatName+"']").attr("value",result);
	$(window.frames["fastFieldSet"].document).find("td[name='"+formatName+"']").text(result);
	 	if(from == 1){
	 		closeSwf();
//	 	}else{
//	 		closeContentSWF();
	 	}
	 	//此处添加数据填入，result是返回的格式
}
  //是否隐藏预警
 function isWarning(isWarning) {
	var warningTr = $("td[name='isWarning']",window.frames["fastFieldSet"].document).parent("tr");
	if(isWarning == 1){
		warningTr.find("td").show();
		warningTr.prev("tr").show();
		warningTr.prev("tr").prev("tr").hide();
		warningTr.next("tr").show();
		warningTr.next("tr").next("tr").hide();
	} else{
		warningTr.prev("tr").prev("tr").show();
		warningTr.prev("tr").hide();
		warningTr.next("tr").next("tr").show();
		warningTr.next("tr").hide();
		
		warningTr.find("td[effect]:not([name='isWarning'])").prev("td").hide();
		warningTr.find("td[effect]:not([name='isWarning'])").next("td").hide();
		warningTr.find("td[effect]:not([name='isWarning'])").attr("value","").hide();
		
		//$("td[name='alarmWholeLine']",window.frames["fastFieldSet"].document).attr("value",false);
		$("td[name='alarmString']",window.frames["fastFieldSet"].document).attr("value","");
	}
	
	//设置默认值
	var compareTd = $("td[name='compareExp']",window.frames["fastFieldSet"].document);
	compareTd.find("input[type='text']").attr("realvalue",">").attr("value","大于");
	compareTd.attr("value",">");
 }
 //弹出预定义样式
 function predefinedStyle(name){
	parent.globalStyleSet(2,name);

 }
 //弹出全局样式
 function globalStyle(name){
	parent.globalStyleSet(1,name);

 }
 //弹出预警
 function warning(){
	var base64 = new Base64();
	var alarmString = $("td[name='alarmString']",window.frames["fastFieldSet"].document).attr("value");
	parent.WarningPropertiesSet(alarmString);
}
//弹窗返回赋值
function setBackValue(name,value){
	if(name != "alarmString"){
		$("td[name='"+name+"']",window.frames["fastFieldSet"].document).text(value);
	}else{//预警为空
		var tempValue = new Base64().decode(value);
		tempValue = JSON.parse(tempValue);
		if(typeof tempValue.result == "undefined" || tempValue.result.length == 0){
			value = "";
		}
	}
	$("td[name='"+name+"']",window.frames["fastFieldSet"].document).attr("value",value)
}

//清除文本框信息
function cleanStyle(name){
	$("td[name='"+name+"']",window.frames["fastFieldSet"].document).attr("value","").text("");
}
// 切换合计方式触发方法
function changeStats(){
	var stats = $("td[name='statExp']",window.frames["fastFieldSet"].document).attr("value");
	if(stats != "" && stats != "null" && typeof stats != "undefined" && stats != "no"){
        /*
        var statsArr = stats.split(",");
		
		var length = statsArr.length;
		//标示量
		var flag = 1;
		//如果合计方式只有一种，则不显示复选框
		if(length==1){
			flag = 0;
		}
		

        $("tr[rn='18'],tr[rn='19'],tr[rn='56'],tr[rn='57'],tr[rn='58']",window.frames["fastFieldSet"].document).show();

        // (count)计数
        if($.inArray("count", statsArr) != -1){
            $("tr[rn='20'],tr[rn='21'],tr[rn='22'],tr[rn='23'],tr[rn='24'],tr[rn='25']",window.frames["fastFieldSet"].document).show();
			if(flag==1){
				addCheckBox("otherField1");
				flag = 0;
			} else {
				addBlank("otherField1");
			}
			
        }else{
            $("tr[rn='20'],tr[rn='21'],tr[rn='22'],tr[rn='23'],tr[rn='24'],tr[rn='25']",window.frames["fastFieldSet"].document).hide();
            $("td[name='countFormat'],td[name='countStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
        }

        // (dcount)单计
        if($.inArray("dcount", statsArr) != -1){
            $("tr[rn='26'],tr[rn='27'],tr[rn='28'],tr[rn='29'],tr[rn='30'],tr[rn='31']",window.frames["fastFieldSet"].document).show();
			if(flag==1){
				addCheckBox("otherField2");
				flag = 0;
			} else {
				addBlank("otherField2");
			}
        }else{
            $("tr[rn='26'],tr[rn='27'],tr[rn='28'],tr[rn='29'],tr[rn='30'],tr[rn='31']",window.frames["fastFieldSet"].document).hide();
            $("td[name='dcountFormat'],td[name='dcountStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
        }

        // (sum)求和
        if($.inArray("sum", statsArr) != -1){
            $("tr[rn='32'],tr[rn='33'],tr[rn='34'],tr[rn='35'],tr[rn='36'],tr[rn='37']",window.frames["fastFieldSet"].document).show();
			if(flag==1){
				addCheckBox("otherField3");
				flag = 0;
			} else {
				addBlank("otherField3");
			}
        }else{
            $("tr[rn='32'],tr[rn='33'],tr[rn='34'],tr[rn='35'],tr[rn='36'],tr[rn='37']",window.frames["fastFieldSet"].document).hide();
            $("td[name='sumFormat'],td[name='sumStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
        }

        // (avg)求平均
        if($.inArray("avg", statsArr) != -1){
            $("tr[rn='38'],tr[rn='39'],tr[rn='40'],tr[rn='41'],tr[rn='42'],tr[rn='43']",window.frames["fastFieldSet"].document).show();
			if(flag==1){
				addCheckBox("otherField4");
				flag = 0;
			} else {
				addBlank("otherField4");
			}
        }else{
            $("tr[rn='38'],tr[rn='39'],tr[rn='40'],tr[rn='41'],tr[rn='42'],tr[rn='43']",window.frames["fastFieldSet"].document).hide();
            $("td[name='avgFormat'],td[name='avgStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
        }

        // (max)最大
        if($.inArray("max", statsArr) != -1){
            $("tr[rn='44'],tr[rn='45'],tr[rn='46'],tr[rn='47'],tr[rn='48'],tr[rn='49']",window.frames["fastFieldSet"].document).show();
			if(flag==1){
				addCheckBox("otherField5");
				flag = 0;
			} else {
				addBlank("otherField5");
			}
        }else{
            $("tr[rn='44'],tr[rn='45'],tr[rn='46'],tr[rn='47'],tr[rn='48'],tr[rn='49']",window.frames["fastFieldSet"].document).hide();
            $("td[name='maxFormat'],td[name='maxStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
        }

        // (min)最小
        if($.inArray("min", statsArr) != -1){
            $("tr[rn='50'],tr[rn='51'],tr[rn='52'],tr[rn='53'],tr[rn='54'],tr[rn='55']",window.frames["fastFieldSet"].document).show();
			if(flag==1){
				addCheckBox("otherField6");
				flag = 0;
			} else {
				addBlank("otherField6");
			}
        }else{
            $("tr[rn='50'],tr[rn='51'],tr[rn='52'],tr[rn='53'],tr[rn='54'],tr[rn='55']",window.frames["fastFieldSet"].document).hide();
            $("td[name='minFormat'],td[name='minStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
        }
        */
	}else{// 不合计
        removeStatExp();
    }
}
//添加应用到同字段其他合计复选框
function addCheckBox(name){
	$("td[name='"+name+"']",window.frames["fastFieldSet"].document).html("<input style = 'vertical-align: -2px;' type='checkbox' id = 'checkBox' name = 'checkBox' onclick='parent.otherField()' >应用到同字段其他合计");
}
function addBlank(name){
	$("td[name='"+name+"']",window.frames["fastFieldSet"].document).html("");
}
//应用到同字段其他合计
function otherField(){
	var checkbox =  $("#checkBox",window.frames["fastFieldSet"].document).attr("checked");
	var flag = 1;
	var format = "";
	var styleString = "";
	var stats = $("td[name='statExp']",window.frames["fastFieldSet"].document).attr("value");
	var statsArr = stats.split(",");
	if(checkbox=="checked"){
		if($.inArray("count", statsArr) != -1){
           if(flag==1){
				format = $("td[name='countFormat']",window.frames["fastFieldSet"].document).attr("value");
				styleString = $("td[name='countStyleString']",window.frames["fastFieldSet"].document).attr("value");
				flag = 0;
		   } else {
				$("td[name='countFormat']",window.frames["fastFieldSet"].document).attr("value",format).text(format);
				$("td[name='countStyleString']",window.frames["fastFieldSet"].document).attr("value",styleString).text(styleString);
		   }
			
        }

        // (dcount)单计
        if($.inArray("dcount", statsArr) != -1){
            if(flag==1){
				format = $("td[name='dcountFormat']",window.frames["fastFieldSet"].document).attr("value");
				styleString = $("td[name='dcountStyleString']",window.frames["fastFieldSet"].document).attr("value");
				flag = 0;
		   } else {
				$("td[name='dcountFormat']",window.frames["fastFieldSet"].document).attr("value",format).text(format);
				$("td[name='dcountStyleString']",window.frames["fastFieldSet"].document).attr("value",styleString).text(styleString);
		   }
        }

        // (sum)求和
        if($.inArray("sum", statsArr) != -1){
            if(flag==1){
				format = $("td[name='sumFormat']",window.frames["fastFieldSet"].document).attr("value");
				styleString = $("td[name='sumStyleString']",window.frames["fastFieldSet"].document).attr("value");
				flag = 0;
		   } else {
				$("td[name='sumFormat']",window.frames["fastFieldSet"].document).attr("value",format).text(format);
				$("td[name='sumStyleString']",window.frames["fastFieldSet"].document).attr("value",styleString).text(styleString);
		   }
        }

        // (avg)求平均
        if($.inArray("avg", statsArr) != -1){
            if(flag==1){
				format = $("td[name='avgFormat']",window.frames["fastFieldSet"].document).attr("value");
				styleString = $("td[name='avgStyleString']",window.frames["fastFieldSet"].document).attr("value");
				flag = 0;
		   } else {
				$("td[name='avgFormat']",window.frames["fastFieldSet"].document).attr("value",format).text(format);
				$("td[name='avgStyleString']",window.frames["fastFieldSet"].document).attr("value",styleString).text(styleString);
		   }
        }

        // (max)最大
        if($.inArray("max", statsArr) != -1){
            if(flag==1){
				format = $("td[name='maxFormat']",window.frames["fastFieldSet"].document).attr("value");
				styleString = $("td[name='maxStyleString']",window.frames["fastFieldSet"].document).attr("value");
				flag = 0;
		   } else {
				$("td[name='maxFormat']",window.frames["fastFieldSet"].document).attr("value",format).text(format);
				$("td[name='maxStyleString']",window.frames["fastFieldSet"].document).attr("value",styleString).text(styleString);
		   }
        }

        // (min)最小
        if($.inArray("min", statsArr) != -1){
             if(flag==1){
				format = $("td[name='minFormat']",window.frames["fastFieldSet"].document).attr("value");
				styleString = $("td[name='minStyleString']",window.frames["fastFieldSet"].document).attr("value");
				flag = 0;
		   } else {
				$("td[name='minFormat']",window.frames["fastFieldSet"].document).attr("value",format).text(format);
				$("td[name='minStyleString']",window.frames["fastFieldSet"].document).attr("value",styleString).text(styleString);
		   }
        }
	} else {
		if($.inArray("count", statsArr) != -1){
           if(flag==1){
				flag = 0;
		   } else {
				$("td[name='countFormat']",window.frames["fastFieldSet"].document).attr("value","").text("");
				$("td[name='countStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
		   }
			
        }

        // (dcount)单计
        if($.inArray("dcount", statsArr) != -1){
            if(flag==1){
				flag = 0;
		   } else {
				$("td[name='dcountFormat']",window.frames["fastFieldSet"].document).attr("value","").text("");
				$("td[name='dcountStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
		   }
        }

        // (sum)求和
        if($.inArray("sum", statsArr) != -1){
            if(flag==1){
				flag = 0;
		   } else {
				$("td[name='sumFormat']",window.frames["fastFieldSet"].document).attr("value","").text("");
				$("td[name='sumStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
		   }
        }

        // (avg)求平均
        if($.inArray("avg", statsArr) != -1){
            if(flag==1){
				flag = 0;
		   } else {
				$("td[name='avgFormat']",window.frames["fastFieldSet"].document).attr("value","").text("");
				$("td[name='avgStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
		   }
        }

        // (max)最大
        if($.inArray("max", statsArr) != -1){
            if(flag==1){
				flag = 0;
		   } else {
				$("td[name='maxFormat']",window.frames["fastFieldSet"].document).attr("value","").text("");
				$("td[name='maxStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
		   }
        }

        // (min)最小
        if($.inArray("min", statsArr) != -1){
             if(flag==1){
				flag = 0;
		   } else {
				$("td[name='minFormat']",window.frames["fastFieldSet"].document).attr("value","").text("");
				$("td[name='minStyleString']",window.frames["fastFieldSet"].document).attr("value","").text("");
		   }
        }
	}
}

// 不合计
function removeStatExp(){
    $("td[name='statExp']",window.frames["fastFieldSet"].document).find("input[type='text']").attr("value","不合计");
    $("td[name='statExp']",window.frames["fastFieldSet"].document).attr("value","no");
}

//设置对齐方式
function setTextAlign(textAlign){
	var tdObj = $("td[name='textAlign']",window.frames["fastFieldSet"].document);
	tdObj.attr("value",textAlign);
	tdObj.find("span.gezSmallSizeIcon").css({"border":"solid 1px #FFFFFF","background-color":"#FFFFFF"})
	tdObj.find("span[name='" + textAlign + "']").find("span.gezSmallSizeIcon").css({"border":"solid 1px #3399FF","background-color":"#E6F0FA"});
}

//解析预警串
function filterAlarmString(){
	var base64 = new Base64();
	if(fieldInfo.alarmString != "" && typeof fieldInfo.alarmString != "undefined"){
		var alarmString = base64.decode(fieldInfo.alarmString);
		try{alarmString = JSON.parse(alarmString);}catch(e){}
		if(typeof alarmString == "object" && alarmString.type == "basic"){//基本设置
			var alarmJson = alarmString.result[0];
			fieldInfo["alarmString"] = "";
			fieldInfo["compareExp"] = alarmJson["compare"];
			fieldInfo["conditionValue"] = alarmJson["conditionValue"];
			if(alarmJson["backColor"] != -256){
				fieldInfo["isBgBright"] = "false";
			}else{
				fieldInfo["isBgBright"] = "true";
			}
		}
	}
}

//生成预警串
 function getAlarmStr(){
	//底色高亮
	var isBgBright = $("td[name='isBgBright']",window.frames["fastFieldSet"].document);
	isBgBright = isBgBright[0].getAttribute("value");
	var backColor = 99999;
	if(isBgBright == "true"){
		backColor = -256;
	}
	//运算符
	var compareTd = $("td[name='compareExp']",window.frames["fastFieldSet"].document);
	var compareValue = compareTd.attr("value");
	var compareDispValue = compareTd.find("input[type='text']").attr("value");
	//警戒值
	var alarmValue = $("td[name='conditionValue']",window.frames["fastFieldSet"].document).attr("value");
	var label = compareDispValue + "  " + alarmValue;
	var data = compareValue + "  " + alarmValue;
	var alarmString = {
		"result": [
			{
				"conditionType": "普通", 
				"exp": "", 
				"conditionListData": {
					"source": [
						{
							"label": "当前值  " +  label, 
							"data": "当前值  " +  data
						}
					], 
					"sort": null, 
					"list": {
						"source": [
							{
								"label":"当前值  " +   label, 
								"data": "当前值  " +  data
							}
						], 
						"uid": "C42A89C1-86F5-2E37-69AA-C64DF1EA0054", 
						"length": 1
					}, 
					"filterFunction": null, 
					"length": 1
				}, 
				"logic": "&&", 
				"foreColor": -65536, 
				"backColor": backColor, 
				"expCondition":"当前值  " +   data, 
				"caseName": "情况1：", 
				"conditionValue": alarmValue, 
				"dataType": "数值", 
				"compare": compareValue
			}
		], 
		"colorResult": {
			"expForeColor": "case (true,list( value()  " + data + " ),-65536  )", 
			"expBackColor": "case (true,list( value()  " + data + " )," + backColor+"  )"
		},
		"type":"basic"//标记为基本预警设置
	};
	
	var base64 = new Base64();
	alarmString = base64.encode(JSON.stringify(alarmString));
	return alarmString;
 }
 

