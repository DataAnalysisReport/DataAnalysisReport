	function getI18nString(patternString,paramObj) {
			var patString = patternString;
			//处理patternString的单引号
			patString = patString.replace(new RegExp("''","gm"),"@#此处为两个单引号@@");
			patString = patString.replace(new RegExp("'","gm"),"");
			patString = patString.replace(new RegExp("@#此处为两个单引号@@","gm"),"'");
			if(paramObj==null){
				return patString;
			} else {
				//获取patternString的参数
				var str = patternString.replace(new RegExp("''","gm"),"").split("'");
				for(var i=0;i<str.length;i++){
					if(i%2==1){
						var param = str[i];
						var value = paramObj[param];
						alert(value);
						if(value==undefined){
							value = " ";
							log("I18n","warn","GetI18nString:在【" +  patternString + "】中引用的参数名【" + param + "】没有找到");
						}
						patString = patString.replace(param,value);
					}
				}
			}
			return patString;
		}