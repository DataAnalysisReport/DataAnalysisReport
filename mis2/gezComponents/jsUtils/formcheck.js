/***
 * 表单输入校验组件
 */
var FormCheck = {
	inited:false,
	/**
	 * 初始化表单校验
	 */
	init : function() {
		if(!this.inited){
			this.inited = true;
			$('form').each(function(){
				// 为页面上所有表单添加数据校验
				FormCheck.addCheck(this);
			});
		}
	},

	/**
	 * 为form添加校验
	 * @param frm 表单对象
	 */
	addCheck : function(frm) {
		// 获取表单校验规则
		var rule = $(frm).attr('checkRule');
		//  未指定校验规则，直接返回
		if(!rule){ return;}
		// 若非内联校验规则，则读取对应json文件，并将其中的规则添加到表单的控件中
		// JSON文件格式见rule.txt
		if(rule != 'inline') {
			$.getJSON(rule, function(data) {
				FormCheck.addRuleToForm(frm, data);
			});
		}
		var isFormFrameWork = $(frm).attr("oper");
		// 拦截表单提交事件，执行校验
		if(!isFormFrameWork){
			$(frm).submit(function(){
				return FormCheck.doCheck(this);
			});
		}else{
			$(frm)[0].submit = function(){
				var enow = window.event;
				enow.returnValue = false;
				var checkResult = FormCheck.doCheck(this);
				if(checkResult){
					FormUtil.doSubmit(this);
				}
			};		
		}
	},

	/**
	 * 为表单中的控件添加校验规则
	 * @param frm 表单对象
	 * @param rule 校验规则对象
	 */
	addRuleToForm : function(frm, rule) {
		// TODO 将rule中定义的规则，添加到表单的对应控件上
		var hiddenFields = '';
		$(frm).find('input:text,input:hidden,input:password,textarea').each(function(){
			var name = $(this).attr("name");
			var inpJson = $(rule).attr(name);
			if(inpJson!==undefined){
				if(inpJson.notNull!==undefined){
					$(this).attr("notNull",inpJson.notNull);
				}
				if(inpJson.maxChar!==undefined){
					$(this).attr("maxChar",inpJson.maxChar);
				}
				if(inpJson.minChar!==undefined){
					$(this).attr("minChar",inpJson.minChar);
				}
				if(inpJson.isNumber!==undefined){
					$(this).attr("isNumber",inpJson.isNumber);
				}
				if(inpJson.isInteger!==undefined){
					$(this).attr("isInteger",inpJson.isInteger);
				}
				if(inpJson.isEmail!==undefined){
					$(this).attr("isEmail",inpJson.isEmail);
				}
				if(inpJson.isURL!==undefined){
					$(this).attr("isURL",inpJson.isURL);
				}
				if(inpJson.blackList!==undefined){
					$(this).attr("blackList",inpJson.blackList);
				}
				if(inpJson.whiteList!==undefined){
					$(this).attr("whiteList",inpJson.whiteList);
				}
				if(inpJson.customRegex!==undefined){
					$(this).attr("customRegex",inpJson.customRegex);
				}
				if(inpJson.testFunction!==undefined){
					$(this).attr("testFunction",inpJson.testFunction);
				}
				if(inpJson.errorMsg!==undefined){
					$(this).attr("errorMsg",inpJson.errorMsg);
				}
				if(inpJson.needEncode!==undefined){
					$(this).attr("needEncode",inpJson.needEncode);
					hiddenFields += ',' + name;
				}
			}
		});
		if(hiddenFields !== ''){//创建隐藏域
			setEncodeFields(frm,hiddenFields.substr(1));
		}
	},

	/**
	 * 对整体表单进行输入校验
	 * @return 成功或失败
	 */
	doCheck : function(frm) {
		var result = true;
		// 只校验输入框，有其他需求请修改此处
		$(frm).find('input:text,input:hidden,input:password,textarea').each(function(){
			// 检查组件的输入合法性
			// 此处返回result，当找到一处不通过校验的内容，即可中断遍历
			if(!FormCheck.checkInput(this)){
				var errMsg = $(this).attr("errorMsg");
				FormCheck.showError(this,errMsg);
				result=false;
				return false;
			}
		});
		if(result){
			FormUtil.encodeForm(frm);
		}
		return result;
	},

	/**
	 * 执行单个组件的输入校验
	 * @return 成功或失败
	 */
	checkInput : function(ctrl) {
		// TODO 读取组件上的校验规则，并判断输入值是否符合规则
		// 若不符合，在此方法中调用FormCheck.showError，显示错误信息
		var canPass = true;
		var value = $(ctrl).val();
		var notNull = $(ctrl).attr("notNull");//是否不能为空(true|false)
		if(canPass && notNull === "true"){
			canPass = regNotNull(value);
		}
		var maxChar = $(ctrl).attr("maxChar");//最大长度(正整数)
		if(maxChar!==undefined && canPass){
			canPass = regMaxChar(value,maxChar);
		}
		var minChar = $(ctrl).attr("minChar");//最小长度(正整数)
		if(minChar!==undefined && canPass){
			canPass = regMinChar(value,minChar);
		}
		var isEmail = $(ctrl).attr("isEmail");// 是否应该为Email格式(true|false)
		if(canPass && isEmail === "true"){
			canPass = regIsEmail(value);
		}
		var isNumber = $(ctrl).attr("isNumber");//是否应该为数字(true|false)
		if(isNumber!==undefined && canPass){
			canPass = regIsNumber(value);
		}
		var isInteger = $(ctrl).attr("isInteger");//是否应该为整数(true|false)
		if(canPass && isInteger === "true"){
			canPass = regIsInteger(value);
		}
		var isURL = $(ctrl).attr("isURL");//是否应该为URL格式(true|false)
		if(canPass && isURL === "true"){
			canPass = regIsURL(value);
		}
		var blackList = $(ctrl).attr("blackList");//黑名单（数组或字符串）
		if(blackList!==undefined && canPass){
			canPass = regBlackList(blackList,value);
		}
		var whiteList = $(ctrl).attr("whiteList");//白名单（数组或字符串）
		if(whiteList!==undefined && canPass){
			canPass = regWhiteList(whiteList,value);
		}
		var customRegex = $(ctrl).attr("customRegex");//自定义正则表达式（字符串）
		if(customRegex!==undefined && canPass){
			canPass = regCustomRegex(customRegex,value);
		}
		var testFunction = $(ctrl).attr("testFunction");//自定义校验函数（字符串，填入函数名即可，代码中使用eval调用
		if(testFunction!==undefined && canPass){
			testFunction = eval(testFunction);
			canPass = testFunction(value);
		}
		return canPass;
	},

	/**
	 * 错误提示
	 * @param ctrl 组件对象
	 * @param errMsg 错误信息
	 */
	showError : function(ctrl, errMsg) {
		var eh = $(ctrl).focus().attr("errHandler");
		if(eh){
			eval(eh).apply(ctrl, [errMsg]);
		} else {
			FormCheck.showDefaultError(errMsg);
		}
	},

	/**
	 * 缺省错误提示信息
	 * @param errMsg 错误信息
	 */
	showDefaultError : function(errMsg) {
		top.alert(errMsg);
	},
	/**
	 *对需要加密的字段加密
	 *@param frm form对象
	 */
	encodeForm : function(frm) {
		var needEncode,value;
		var base64 = new Base64();
		$(frm).find("input:text,input:hidden,input:password,textarea").each(function(){
			needEncode = $(this).attr("needEncode");
			if(needEncode === "true"){
				value = $(this).val();
				var name = $(this).attr("name");
				value = base64.encode(value);
				var inputStr = "<input name='"+name+"_encoded' value='"+value+"' type='hidden'/>";
				$(frm).append(inputStr);
			}
		});
	}
};
var FormUtil = {
	/**
	 * 对整体表单进行输入校验
	 * @return 成功或失败
	 */
	doSubmit : function(frm) {
		var formjsonobj = FormUtil.serializeForm(frm);
		var jsonstr = $.rqJsonToString(formjsonobj);
		jsonstr = Base64Util.encode(jsonstr);
		var webroot = $(frm).attr("webroot");
		var reqUrl = webroot+"/commonServlet";
		var paramData = "gezTarget=GezEntity&formdata="+jsonstr;
		$.ajax({
			type:"POST",
			url: reqUrl,
			cache:false,
			data:paramData,
			dataType:"text",
			success:function(data, textStatus){
				data = $.parseJSON(Base64Util.decode(data));
				if(textStatus=="success"){
					if(formjsonobj.success){
						eval(formjsonobj.success+"(data);");
					}
				}else{
					if(formjsonobj.fail){
						eval(formjsonobj.fail+"(data);");
					}
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(textStatus+":"+errorThrown);
			}
		});
	},
	serializeForm:function(frm){
		//拼装json,想后台发送请求
		var success = $(frm).attr("success");
		var faild = $(frm).attr("fail");
		var entity = $(frm).attr("entity");
		if(!entity){
			entity = "commonform";
		}
		var oper = $(frm).attr("oper");
		var tablename = $(frm).attr("name");
		var pkcol = $(frm).attr("pk");
		//{name:xx,oper:xx,entity,formitems:[
		//			{name:xx,isencode:true/false,isdbcol:true/false,value:xx,dbtype:xx,dateformat},xxx]}
		var formjson = {};
		formjson.entity = entity;
		if(tablename){
			formjson.name = tablename;
		}
		if(pkcol){
			formjson.pk = pkcol;
		}
		if(oper){
			formjson.oper = oper;
		}else{
			FormCheck.showDefaultError("form表单没有指定oper属性,无法确定表单的行为");
			return;
		}
		if(success){
			formjson.success = success;
		}
		if(faild){
			formjson.faild = faild;
		}
		var formitemjsonarr = [];
		$.each($(frm).find("input:text,input:hidden,input:password,textarea,input[type=checkbox]:checked,input[type=radio]:checked,select"),function(key,value){
			var formitemjson = {};
			var itemname = $(value).attr("name");
			var itemIsEncode = $(value).attr("needEncode");
			var itemIsDBCol = $(value).attr("dbcol");
			var itemdbtype = $(value).attr("dbtype");
			var itemcompare = $(value).attr("compare");
			var itemVal = $(value).val();
			if(itemname){
				formitemjson.name = itemname;
			}
			if(itemVal){
				formitemjson.value = itemVal;
			}else{
				formitemjson.value = "";
			}
			if(itemdbtype){
				formitemjson.dbtype = itemdbtype;
			}else{
				formitemjson.dbtype = "12";
			}
			if(itemIsEncode){
				formitemjson.isencode = itemIsEncode;
				formitemjson.value = Base64Util.encode(formitemjson.value); 
			}
			if(itemIsDBCol){
				formitemjson.isdbcol = itemIsDBCol;
			}
			if(itemcompare){
				formitemjson.compare = itemcompare;
			}else{
				formitemjson.compare = "=";
			}
			formitemjsonarr.push(formitemjson);
		});
		formjson.formitems = formitemjsonarr;
		return formjson;
	},
	/**
	 *对需要加密的字段加密
	 *@param frm form对象
	 */
	encodeForm : function(frm) {
		var needEncode,value;
		var base64 = new Base64();
		$(frm).find("input:text,input:hidden,input:password,textarea").each(function(){
			needEncode = $(this).attr("needEncode");
			if(needEncode === "true"){
				value = $(this).val();
				var name = $(this).attr("name");
				value = base64.encode(value);
				var inputStr = "<input name='"+name+"_encoded' value='"+value+"' type='hidden'/>";
				$(frm).append(inputStr);
			}
		});
	}
};
$(document).ready(function(){
	FormCheck.init();
});