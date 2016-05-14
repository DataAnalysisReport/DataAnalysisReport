
function addInput(hrefForm,c,v,isCover){
	if(isCover==null||typeof(isCover) == "undefined"){
		isCover=false;
	}
	if(document.getElementById("urlParam_id_"+c)){
		var inputValue=$("#urlParam_id_"+c).attr("value");
		if((inputValue==null||$.trim(inputValue)=="")&&(v!=null&&$.trim(v)!="")){//表单中原值为空，新值不为空，新值默认覆盖旧值
			$("#urlParam_id_"+c).attr("value",v);
		}
		if(isCover&&(v!=null&&$.trim(v)!="")){//可覆盖时，新值不为空即覆盖旧值
			$("#urlParam_id_"+c).attr("value",v);
		}
	}else{
		var inputObj = document.createElement("input");
		$(inputObj).attr("name",c);
		$(inputObj).attr("id","urlParam_id_"+c);
		$(inputObj).attr("type","hidden");
		$(inputObj).attr("value",v);
		hrefForm.appendChild(inputObj);
	}
}
function linkForm(hrefParams,hrefTarget,actionUrl,isRes,resID,params,isSelf,reportType,cellVlaue){
	var paramObj={};
	if(hrefParams!=null||hrefParams!=""){
		paramObj =hrefParams;
	}else{
		paramObj={};
	}
	

	var FidArgName="";
	var FidValue="";
	var linkURLParam_CommonQuery="no";
	for(var c in paramObj){
		if(c=="linkURLParam_CommonQuery"){
			try{
				linkURLParam_CommonQuery=paramObj[c];
				break;
			}catch(e){}
		}else if(c=="FidArgName"){
			FidArgName=paramObj[c];
		}else if(c=="FidValue"){
			FidValue=paramObj[c];
		}
	}
	if(FidArgName!=""){
		paramObj[FidArgName]=FidValue;
	}
	
	document.charset = "UTF-8";
	var hrefForm = document.createElement("form");
	document.body.appendChild(hrefForm);
	hrefForm.method = "POST";
	if(actionUrl.indexOf("http:")>=0){
		hrefForm.method = "GET";
	} 
	if(linkURLParam_CommonQuery=="yes"){
		if(!isSelf){
			if(parent.query2){//通用查询中的参数
			    /*
				var queryJson=parent.query2.submit2(false,function(data){
				    var condition=data.condition;
				    $.each(condition,function(k,v){
				        if(k.indexOf(".")!=0){
				            var key=k.split(".")[1];
				            addInput(hrefForm,key,v,true);
				        }
				        addInput(hrefForm,k,v,true);
				    });
				});*/
				//获取完整版结果json
				var gps = parent.query2.submit1();
				// 获取页面条件JSON：
				var condition = parent.query2.getConditionJSON(gps);	
				$.each(condition,function(k,v){
				    if(k.indexOf(".")!=0){
				        var key=k.split(".")[1];
				        addInput(hrefForm,key,v,true);
				    }
				    addInput(hrefForm,k,v,true);
				});
				//是否是快速查询
				var iqs = $("#fastSearchText",parent.document).length > 0;
				var json=parent.query2.submit2(iqs);
				var base64 = new Base64();
				addInput(hrefForm,"commonQueryJson",base64.encode(json));
			}
		} 
	}
	
	for(var c in paramObj){  //遍历报表中的数据
		addInput(hrefForm,c,paramObj[c],true);
	}

	for(var i=0;i<params.length;i++){  //遍历链接中的默认参数
		var p = params[i].split("=",2);
		if(p[0]=="") continue;
		var tempV=base64.decode(p[1]);
		if(p[1]==base64.encode(tempV)){
			var tempV=Number(p[1]);
			if(id) tempV=p[1];
		}else{
			tempV=p[1];
		}
		addInput(hrefForm,p[0],tempV,true);
	}

	if (isRes) {
		if(typeof(reportType)!="undefined"&&reportType!=null){
			if(isSelf){//自我连接
				addInput(hrefForm,"resType",reportType);
				if(typeof(frConfig)!="undefined"&&frConfig!=null&&frConfig!=""&&frConfig!="null"){
					addInput(hrefForm,"frConfig",frConfig);
				}
				if(typeof(reportDefineId)!="undefined"&&reportDefineId!=null&&reportDefineId!=""&&reportDefineId!="null"){
					addInput(hrefForm,"reportDefineId",reportDefineId);
				}
			}
		}
		try{
			var id=Number(resID);
			if(id)
				addInput(hrefForm,"resID",Number(resID));
		}catch(e){}
		if(isMobileSR()){
			hrefTarget="_self";
			hrefForm.action =getContextPath()+"/mis2/vrsr/showReport_mobile.jsp";
		}else{
			hrefForm.action =getContextPath()+"/mis2/vrsr/showReport1.jsp";
		}
	}else{
		if(actionUrl.indexOf("javascript:")>-1){
			if(actionUrl.indexOf("(")==-1||actionUrl.indexOf(")")==-1||actionUrl.indexOf("alert")>-1||actionUrl.indexOf("confirm")>-1){
				alert("不支持直接写javascript语句，请输入要调用的方法！");
				return;
			}else{
				var base64 = new Base64();
				var cellValues = base64.decode(cellVlaue).split(";");
				var func = actionUrl.substring(actionUrl.indexOf(":")+1,actionUrl.indexOf("("));
				var funcParams =  actionUrl.substring(actionUrl.indexOf("(")+1,actionUrl.indexOf(")"));
				var paramsObj = {};
				var paramsArray = funcParams.split(";");
				$.each(paramsArray,function(n,value){
					var paramObject = value.split("=");
					if(paramObject[1]=="value"){
						paramsObj[paramObject[0]] = "value";
					}else if(paramObject[1]=="\\\\text"){
						paramsObj[paramObject[0]] = cellValues[0];
					}else if(paramObject[1]=="\\\\value"){
						paramsObj[paramObject[0]] = cellValues[1];
					}else if(paramObject[1].substring(0,1)=="\\"){
						if(paramObject[1].indexOf(".")>-1){
							var array = paramObject[1].split(".");
							var letter = array[0].substring(2).match(/^[a-z|A-Z]+/gi)[0];
							var munber = array[0].substring(2).match(/\d+$/gi)[0];
							var trIndex = letter2Num(letter)-1;
							var tdIndex = parseInt(munber);
							paramsObj[paramObject[0]] = $("tr[rn='"+tdIndex+"']").children('td').eq(trIndex).attr(array[1]);
						}else{
							var letter = paramObject[1].substring(2).match(/^[a-z|A-Z]+/gi)[0];
							var munber = paramObject[1].substring(2).match(/\d+$/gi)[0];
							var trIndex = letter2Num(letter)-1;
							var tdIndex = parseInt(munber);
							paramsObj[paramObject[0]] = $("tr[rn='"+tdIndex+"']").children('td').eq(trIndex).text();
							if(paramsObj[paramObject[0]]==""){
								var eleValue = $("tr[rn='"+tdIndex+"']").children('td').eq(trIndex).attr("value");
								if(eleValue){
									paramsObj[paramObject[0]]=eleValue;
								}
							}
						}
					}else{
						paramsObj[paramObject[0]] = paramObject[1];
					}
				});
				try{
					window[func](paramsObj);
				}catch(e){
					alert("不支持直接写javascript语句，请输入要调用的方法！");
				}
				return;
			}
			
		}else{
			hrefForm.action =actionUrl;
		}
	}
	if(typeof(urlParams)!="undefined"&&urlParams!=null){
		var tempParams=urlParams.split("&");
		for(var i=0;i<tempParams.length;i++){  //遍历
			var p = tempParams[i].split("=",2);
			if(p[0]=="") continue;
			if(document.getElementById(p[0])){
				//confirm(p[0]+":"+p[1]);
			}else{
				addInput(hrefForm,p[0],p[1],false);//不覆盖
			}
		}
	}
	
	if(hrefTarget=="_self"){
		hrefTarget="_parent";
		
		hrefForm.target = hrefTarget;
		hrefForm.submit();
	}else if(hrefTarget!="_parent"&&hrefTarget!="_blank"&&hrefTarget!="_top"&&hrefTarget!="null"&&hrefTarget!=null&&hrefTarget!=""){
		hrefForm.target = hrefTarget;
		hrefForm.submit();
		$('#dialogLink_div').css('display','block');
	}else{
		hrefForm.target = hrefTarget;
		hrefForm.submit();
	}
	$(hrefForm).remove();
}
function letter2Num(letter){
	var sum = 0;
	for(i=0;i<letter.length;i++){
		var num = letter.charAt(i).charCodeAt()-64;
		sum+=num*Math.pow(26,letter.length-i-1)
	}
	return sum;
}
function isMobileSR(){
	var url = window.location.pathname;
	if(url.indexOf("showReport_mobile.jsp")==-1 && url.indexOf("appEntry.url")==-1){
		//confirm("false");
		return false;
	}else{
		//confirm("true");
		return true;
	}
	
}
/**
 * 获取当前应用名称
 * @returns
 */
function getContextPath() {
	var contextPath = document.location.pathname;
	var index = contextPath.substr(1).indexOf("/");
	contextPath = contextPath.substr(0, index + 1);
	if(contextPath.charAt(0)!="/"){
		contextPath = "/"+contextPath;
	}
	return contextPath;
}
function customerModifyHrefParams(href,hrefParams){
	return hrefParams;
}
//统一报表超链接参数格式
function setHrefParams(href,hrefParams,linkURLParam_GroupFields){
	var base64 = new Base64();
	var params = {};
	var urlParams;
	if(href.indexOf("?")>0){
		urlParams = href.substring(href.indexOf("?")+1).split("&");
	}
	if(linkURLParam_GroupFields=="yes"){
		if(hrefParams!=""&&hrefParams!=null){
			var notBase64Params = base64.decode(hrefParams);
			if(hrefParams==base64.encode(notBase64Params)){
					hrefParams = notBase64Params;
					try{
						hrefParams = eval("(" + hrefParams + ")");//交叉报表超链接参数处理
					}catch(e){}
					params = hrefParams;
			}
		}
		if(typeof(hrefParams)=="string"&&hrefParams!=""){
			var hrefParams = hrefParams.split("&");
			for(var i=0;i<hrefParams.length;i++){
				var strs = hrefParams[i].split("=");
				if(strs.length>1){
					var val = strs[1];
					var notBase64Val = base64.decode(val);
					if(val!=base64.encode(notBase64Val)||base64.encode(notBase64Val)==base64.decode(base64.encode(val))){
						params[hrefParams[i].split("=")[0]] = val;//参数没base64编码
					}else{
						params[hrefParams[i].split("=")[0]] = notBase64Val;//参数base64编码
					}
				}
			}
		}
	}
	if(typeof(urlParams)!="undefined"&&urlParams!=null){
		for(var i=0;i<urlParams.length;i++){
			var temp=urlParams[i].split("=");
			var val="";
			for(var j=1;j<temp.length;j++){
				if(j==1){
					val = temp[j];
				}else{
					val+="="+temp[j];
				}
			}
			var notBase64Val = base64.decode(val);
			if(val!=base64.encode(notBase64Val)||base64.encode(notBase64Val)==base64.decode(base64.encode(val))){
				params[urlParams[i].split("=")[0]] = val;//参数没base64编码
			}else{
				params[urlParams[i].split("=")[0]] = notBase64Val;//参数base64编码
			}
		}
	}
	var result="";
	for(var c in params){
		if(result==""){
			result+=c+"="+params[c];
		}else{
			result+="&"+c+"="+params[c];
		}
	}
	if(result.indexOf("selfLink")>0){
		return params;
	}else{
		return result;
	}
}
function dataHref(href,hrefTarget,hrefParams,hrefUseBase64,cellValue){
	var base64 = new Base64();

	var ACTION_GET_REPORT_LINK=38;

	var p = {};
	if(typeof(linkTarget)!="undefined"&&linkTarget!=null&&linkTarget!="null"&&linkTarget!=""){
		hrefTarget=linkTarget;
	}
	if(typeof(params)!="undefined"&&params!=null){
		p=params;
	}
	
	if(hrefUseBase64==true){
		href=base64.decode(href);
	}
	
	var urlParams;
	if(href.indexOf("?")>0){
		urlParams = href.substring(href.indexOf("?")+1).split("&");
	}

	var linkURLParam_GroupFields="no";
	if(typeof(urlParams)!="undefined"&&urlParams!=null){
		for(var i=0;i<urlParams.length;i++){
			var strs = urlParams[i].split("=");
			if(strs[0]=="linkURLParam_GroupFields"){
				linkURLParam_GroupFields=strs[1];
				break;
			}
		}
	}
	if(href.indexOf("drill")==-1){//非数据钻取
		hrefParams = setHrefParams(href,hrefParams,linkURLParam_GroupFields);
	}

	
	try{
		hrefParams=customerModifyHrefParams(href,hrefParams);
	}catch(e){}
	
	
	if(href.indexOf("/LinkServlet")>=0||href.indexOf("/Linkservlet")>=0){
		if(typeof(reportID)!="undefined"&&reportID!=null){
			linkForm(hrefParams,hrefTarget,"",true,reportID,p,true,"12");
			return;
		}
	}else if(href.indexOf("drill")>=0){//数据钻取
		saveDrillXml(hrefParams,reportID);
		return;
	}
	$.ajax({
		url : PathUtils.getAbsoluteJspUrl("/viewReportServlet"), //"../viewReportServlet",
		type : 'POST',
		data : {
			action : ACTION_GET_REPORT_LINK,
			reportName : base64.encode("0"),
			cacheId : "0",
			link : href,
			hrefParams : hrefParams
		},
		dataType : 'json',
		context : this,
		success : function(data) {
			if (data['status']) {
				if(data['href'].indexOf("/LinkServlet")>=0||data['href'].indexOf("/Linkservlet")>=0){
					if(typeof(reportID)!="undefined"&&reportID!=null){
						linkForm(data['hrefParams'],hrefTarget,"",true,reportID,p,true,"12");
					}else{
						linkForm(data['hrefParams'],hrefTarget,data['href'],data['isRes'],data['resID'],p,false,"12");
					}
				}else{
					linkForm(data['hrefParams'],hrefTarget,data['href'],data['isRes'],data['resID'],p,false,"12",cellValue);
				}
			}else{
				alert(data['error']);
			}
		}
	});
}

//获取钻取报表xml并保存，返回schemaId，跳转到sr页面
function saveDrillXml(hrefParams,reportId){
	var hrefForm = document.createElement("form");
	document.body.appendChild(hrefForm);
	hrefForm.method = "POST"; 
	var genXmlParam = "";
	var paramObj = JSON.parse(base64.decode(hrefParams));
	for(var c in paramObj){  //遍历
		genXmlParam = genXmlParam+c+":"+paramObj[c]+";"
	}
	$.ajax({type:"POST", url:PathUtils.getRelativeUrl("/showPivotReportServlet?action=12"), async:true, cache:false, data:{"resID":base64.encode(reportId), "reportDefineId":base64.encode(reportDefineId),"hrefParam":base64.encode(genXmlParam)}, dataType:"json", 
				success:function (data) {
					//confirm(data);
					addInput(hrefForm,"schemaId",data);
					addInput(hrefForm,"drill","true");
					hrefForm.action ="../showReport1.jsp";
					hrefForm.target = "_blank";
					hrefForm.submit();
					$(hrefForm).remove();
				}, error:function () {
					confirm("钻取报表失败");
				}}
		);
}
