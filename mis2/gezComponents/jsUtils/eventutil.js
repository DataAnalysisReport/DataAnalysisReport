var EventUtil = {
	"formatEvent":function(oEvent){
		if(this.isIE()){
			oEvent.target = oEvent.srcElement;
			oEvent.preventDefault = function(){
				this.returnValue = false;
			};
			oEvent.stopPropogation = function(){
				this.cancelBubble = true;
			};
			oEvent.charCode = oEvent.type=="keypress"?oEvent.keyCode:0;
			oEvent.isChar = oEvent.charCode>0;
			oEvent.eventPhase = 2;
			var sLeft = document.body.scrollLeft;
			if(sLeft==0){
				sLeft = document.documentElement.scrollLeft;
			}
			var sTop = document.body.scrollTop;
			if(sTop==0){
				sTop = document.documentElement.scrollTop;//兼容IE,DTD设置
			}
			oEvent.pageX = oEvent.clientX+sLeft;
			oEvent.pageY = oEvent.clientY+sTop;
			if(oEvent.type=="mouseover"){
				oEvent.relatedTarget = oEvent.fromElement;
			}else if(oEvent.type=="mouseout"){
				oEvent.relatedTarget = oEvent.toElement;
			}
			oEvent.time = (new Date()).getTime();
		}
		return oEvent;
	},
	"getEvent":function(){
		if(this.isIE()){
			return this.formatEvent(window.event);
		}
		return EventUtil.getEvent.caller.arguments[0];
	},
	"isIE":function(){
		if(document.attachEvent){
			return true;
		}
		return false;
	},
	"addEventHandler":function(oTarget,eventType,handlerFn){
		if(document.attachEvent){
			oTarget.attachEvent("on"+eventType,handlerFn);
		}else if(document.addEventListener){
			oTarget.addEventListener(eventType,handlerFn,false);
		}else{
			oTarget["on"+eventType] = handlerFn;
		}
	},
	"removeEventHandler":function(oTarget,eventType,handlerFn){
		if(document.attachEvent){
			oTarget.detachEvent("on"+eventType,handlerFn);
		}else if(document.addEventListener){
			oTarget.removeEventListener(eventType,handlerFn,false);
		}else{
			oTarget["on"+eventType] = null;
		}
	}
};