function regNotNull(value){//判断不为空
	if($.trim(value) === ''){
		return false;
	}else{
		return true;
	}
}

function regMaxChar(value,maxChar){//最大字符数
	if(value.length > maxChar){
		return false;
	}else{
		return true;
	}
}

function regMinChar(value,minChar){//最小字符数
	var MIN_LEN = 100;
	if(value.length < minChar){
		return false;
	}else{
		return true;
	}
}

function regIsEmail(value){//email判断
	var reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
	return reg.test(value);
}

function regIsNumber(value){//数字判断
	var reg =  /^\d+(\.{1}\d+)?$/;
	return reg.test(value);
}

function regIsInteger(value){//整数判断
	var reg = /^-?\d+$/;
	return reg.test(value);
}

function regIsURL(value){//url判断
	var reg = /^[a-zA-z]+:\/\/(\w+)(\.(\w+))*(:\d+)?(\/(\w+\/)*\w+\.\w+)?(\?\S*)?$/;
	return reg.test(value);
}

/**
	whiteList 数组或字符串
	value 需要校验的字符串
*/
function regWhiteList(whiteList,value){//白名单（数组或字符串）
	return true;
}
/**
	blackList 数组或字符串
	value 需要校验的字符串
*/
function regBlackList(blackList,value){//黑名单（数组或字符串）
	var list = blackList.split(","); //黑名单是一个字符串，以","分隔
	for(var i = 0; i < list.length; i++){
		if(value.indexOf(list[i]) !== -1){
			return false;
		}
	}
	return true;
}

/**
	regStr 自定义正则表达式（字符串）
	value 需要校验的字符串
*/
function regCustomRegex(regStr,value){//
	var reg = new RegExp(regStr);
	return reg.test(value);
}
/**
	加密value值
	
*/
function encodeInput(ctrl){
	var base64 = new Base64();
	var value = $(ctrl).val();
	value = base64.encode(value);
	$(ctrl).val(value);
}
/**
	为form创建隐藏域，值为value
*/
function setEncodeFields(frm,value){
	var inputStr = "<input name='encodeFields' value='"+value+"' type='hidden'/>";
	$(frm).append(inputStr);
}