var NameValidator = function(){
	/** 0-9 构成 */
	this.DIGITS = "^\\d+$";
	/** a-z A-Z 构成 */								
	this.LETTERS = "^[a-zA-Z]+$";		
	/** 0-9 a-z A-Z 构成 */					
	this.DIGIT_LETTERS = "^[a-zA-Z\\d]+$";
	/** 字母、数字、下划线构成	*/					
	this.DIGIT_LETTER_UNDERLINES ="^[a-zA-Z\\d_]+$";	
	/** 数字，英文，中文 */	
	this.DIGIT_EN_CN = "^[a-zA-Z\\d\\u4e00-\\u9fa5]+$";	
	/** 中文 */		
	this.CHINESE = "^[\\u4e00-\\u9fa5]+$";
	/** 普通名字，数字、英文、下划线构成，数字不能开头 */					
	this.NORMAL_NAME = "^[a-zA-Z_][a-zA-Z\\d_]*$";	
	/** 比NORMAL_NAME增加中文 */			
	this.NORMAL_NAME_CN = "^[a-zA-Z_\\u4e00-\\u9fa5][a-zA-Z\\d_\\u4e00-\\u9fa5]*$";
	
	this.tips = {
				"^\\d+$":"应由数字构成","^[a-zA-Z]+$": "应由字母构成","^[a-zA-Z\\d]+$": "应由数字、字母构成","^[a-zA-Z\\d_]+$": "字母、数字、下划线构成",
				"^[a-zA-Z\\d\\u4e00-\\u9fa5]+$": "应由数字、字母、中文构成","^[\\u4e00-\\u9fa5]+$": "应由中文构成","^[a-zA-Z_][a-zA-Z\\d_]*$": "应由数字、英文、下划线构成，数字不能开头","^[a-zA-Z_\\u4e00-\\u9fa5][a-zA-Z\\d_\\u4e00-\\u9fa5]*$": "应由数字、英文、下划线、中文构成，数字不能开头"
			   };
	
	/**
	 * 验证方法
	 * @param toBeValidated 要被验证的字符串
	 * @param regex 字符串应符合的格式规则，鼓励使用本类定义的常量，也可以使用任意的正则表达式
	 * @return 如果字符串符合规则，返回null，否则返回出错原因;
	 */
	this.validate = function(toBeValidated,regex){
		if(toBeValidated == null||toBeValidated=="") {
			return "要校验的字符串是null或“”";
		}
		var regExp = new RegExp(regex);
		if(regExp.test(toBeValidated)){
			return null;
		}else{
			if(this.tips.hasOwnProperty(regex)){
				return this.tips[regex];
			}else{
				tip = "名字["+toBeValidated+"]不符合规则["+regex+"]";
			}
		};
	};

	/**
	 * 验证数据集命名
	 * 规则：数据集名称不能以数字开头，不能包含有. / \ : * ? < > | - + — ! "字符，长度不能超过50
	 * @param dsName 数据集名称
	 * @return 如果字符串符合规则，返回null，否则返回出错原因;
	 */
	this.validateDsName = function(dsName){
		if(dsName == null||dsName=="") {
			return "要校验的字符串是null或“”";
		}
		// 特定字符集
		var letters = [".","/","\\",":","<",">","!","|","-","+","—","(",")"];
		// 检测名称是否以数字开头
		var regExp = new RegExp("^\\d+$");
		if(regExp.test(dsName.substring(0, 1))){
			return "名字["+dsName+"]不能以数字开头";
		}
		// 检测名称的长度
		if(dsName.length>50){
			return "名字["+dsName+"]长度不能超过50";
		}
		// 检测名称是否包含指定的字符
		for(var i=0;i<letters.length;i++){
			if(dsName.indexOf(letters[i])!=-1){
				return "名字["+dsName+"]中不能包含字符："+letters[i];
			}
		}
		return null;
	};
}