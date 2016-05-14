$(document).ready(function(){
	/**
	 * 自动截取字符串的方法，
	 * 使用场景：当文字超过容器宽度，则需要对文字截取，只显示一部分
	 * str 源字符串
	 * width 文字所在容器宽度（高度）
	 */
	$.autoSubstring = function(str,width){
		var stringWidth = $.getStringWidth(str);
		var result = str;
		var containerWidth = parseInt(width);
		if(stringWidth>containerWidth){
			var stringNum = $.getStringByteLen(str);
			//首先计算给定的宽度能放多少个当前字，非精确，向左偏移，小数点时少算字
			var containerFontNum = parseInt(containerWidth/(stringWidth/stringNum));
			//末尾改成...，所以个数去3
			containerFontNum = containerFontNum-3; 
			//然后根据个数截取字符串
			var endIndex=str.length-1;
			for(var i=0,len=str.length;i<len;i++){
				var charItem = str.charCodeAt(i);
				if(charItem>255){
					containerFontNum = containerFontNum-2;
				}else{
					containerFontNum = containerFontNum-1;
				}
				if(containerFontNum==0){
					endIndex = i;
					break;
				}else if(containerFontNum<0){
					endIndex = i-1;
					break;
				}
			}
			result = str.substring(0,endIndex+1)+"...";
		}
		return result;
	};
	/**
	 * 计算字符串的宽度
	 */
	$.getStringWidth = function(str){
		var span = $("<a style=\"white-space: nowrap\">"+str+"</a>");
		$(document.body).append(span);
		var strwidth = span.width();
		span.remove();
		return strwidth;
	};
	/**
	 * 计算字符串的字节数
	 */
	$.getStringByteLen = function(str){
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
	};
});