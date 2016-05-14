$(document).ready(function(){
	$.rqGetTimeRandomNum = function(){
		var randomNum = new RandomNumUtil();
		return randomNum.getTimeRandomNum();
	};
	$.rqJsonToString = function(obj){
		var randomNum = new RandomNumUtil();
		return randomNum.jsonToString(obj);
	};
});
/**
 * 随机数工具类
 * @class 
 * @name RandomNumUtil
 */
function RandomNumUtil(){
	/**
	 * 得到一个时间的随机数，用于比如：发送ajax请求时拼在url后面，防止请求时读取缓存
	 * @name getTimeRandomNum
	 * @methodOf RandomNumUtil
	 * @return 随机数
	 */
	this.getTimeRandomNum = function(){
		var date = new Date();
		var number = Math.random();
		var id = date.getTime()*1000+number;//取时间和4位随机数为id
		return id;
	};
	/**
	 * 把对象转化为json字符串
	 * @name jsonToString
	 * @methodOf RandomNumUtil
	 * @param obj 要被转化的对象
	 * @return 对象所对应的json字符串
	 */
	this.jsonToString = function(obj){   
        var THIS = this;    
        switch(typeof(obj)){   
            case 'string':   
                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';   
            case 'array':   
                return '[' + obj.map(THIS.jsonToString).join(',') + ']';   
            case 'object':   
                 if(obj instanceof Array){   
                    var strArr = [];   
                    var len = obj.length;   
                    for(var i=0; i<len; i++){   
                        strArr.push(THIS.jsonToString(obj[i]));   
                    }   
                    return '[' + strArr.join(',') + ']';   
                }else if(obj==null){   
                    return 'null';   
  
                }else{   
                    var string = [];   
                    for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));   
                    return '{' + string.join(',') + '}';   
                }   
            case 'number':   
                return obj;   
            case false:   
                return obj;   
        }   
    };

}
