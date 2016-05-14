function rqLoadJS(modules,appname,callback)
{
	if(typeof appname!=="string"){
		var pathn = window.location.pathname;
		appname = pathn.substring(0,pathn.indexOf("/",1));
	}
    var filename = null;
    for(var i=0,len=modules.length-1;i<len; i++){
    	filename = appname+modules[i];
		IncludeJavaScript(filename);
	}
	filename = appname+modules[i];
	IncludeJavaScript(filename,callback);
	function IncludeJavaScript(jsFile,cb)
    {
        var oScript = document.createElement('script');
        oScript.setAttribute('type', 'text/javascript');
        oScript.setAttribute('language', 'javascript');
        if(oScript.readyState){
        	oScript.onreadystatechange=function(){
        		if(oScript.readyState=="loaded"||oScript.readyState=="complete"){
        			oScript.onreadystatechange = null;
        			if(typeof cb ==="function"){
        				cb();
        			}
        		}
        	};
        }else{
        	oScript.onload=function(){
        		if(typeof cb ==="function"){
        			cb();
        		}
        	};
        }
        oScript.setAttribute('src', jsFile);
        var oHead = document.getElementsByTagName('head')[0];
        oHead.appendChild(oScript);
    }
}