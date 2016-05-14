var PathUtils={
	/** 为url拼接绝对路径前缀，到apppath为止，并处理路径中的错误格式 */
	getAbsoluteUrl:function(url){
		url = absoluteUrlPrefix+"/"+url;
		return PathUtils.urlProcess(url);
	},
	/** 为url拼接相对路径前缀，到apppath为止，并处理路径中的错误格式 */
	getRelativeUrl:function(url){
		url = relativeUrlPrefix+"/"+url;
		return PathUtils.urlProcess(url);
	},
	/** 为url拼接绝对路径前缀，到mis2为止，并处理路径中的错误格式 */
	getAbsoluteJspUrl:function(url){
		url = absoluteJspUrlPrefix+"/"+url;
		return PathUtils.urlProcess(url);
	},
	/** 为url拼接相对路径前缀，到mis2为止，并处理路径中的错误格式 */
	getRelativeJspUrl:function(url){
		url = relativeJspUrlPrefix+"/"+url;
		return PathUtils.urlProcess(url);
	},
	urlProcess:function(url){
		var dowithString = url;
		var prePart = "";
		if(url.indexOf("http")==0){
			var a = url.indexOf("//");
			prePart = url.substring(0,a+2);
			dowithString = url.substring(a+2);
		}
		var reg = /\/{2}/g;
		dowithString = dowithString.replace(reg,"/");
		while(dowithString.indexOf("//")!=-1){
			dowithString = dowithString.replace(reg,"/");
		}
		return prePart+dowithString;
	}
}
