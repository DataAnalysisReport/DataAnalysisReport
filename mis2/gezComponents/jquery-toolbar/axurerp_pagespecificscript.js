var PageName="\u5e2e\u52a9\u63d0\u793a";var PageId="bbff33137b9042039ac724b2e49d4452";var PageUrl="\u5e2e\u52a9\u63d0\u793a.html";document.title="\u5e2e\u52a9\u63d0\u793a";var PageNotes={pageName:"\u5e2e\u52a9\u63d0\u793a",showNotesNames:"False"};var $OnLoadVariable="";var $CSUM;var hasQuery=false;var query=window.location.hash.substring(1);if(query.length>0){hasQuery=true}var vars=query.split("&");for(var i=0;i<vars.length;i++){var pair=vars[i].split("=");if(pair[0].length>0){eval("$"+pair[0]+" = decodeURIComponent(pair[1]);")}}if(hasQuery&&$CSUM!=1){alert("Prototype Warning: The variable values were too long to pass to this page.\nIf you are using IE, using Firefox will support more data.")}function GetQuerystring(){return"#OnLoadVariable="+encodeURIComponent($OnLoadVariable)+"&CSUM=1"}function PopulateVariables(a){var b=new Date();a=a.replace(/\[\[OnLoadVariable\]\]/g,$OnLoadVariable);a=a.replace(/\[\[PageName\]\]/g,PageName);a=a.replace(/\[\[GenDay\]\]/g,"7");a=a.replace(/\[\[GenMonth\]\]/g,"7");a=a.replace(/\[\[GenMonthName\]\]/g,"\u4e03\u6708");a=a.replace(/\[\[GenDayOfWeek\]\]/g,"\u661f\u671f\u56db");a=a.replace(/\[\[GenYear\]\]/g,"2011");a=a.replace(/\[\[Day\]\]/g,b.getDate());a=a.replace(/\[\[Month\]\]/g,b.getMonth()+1);a=a.replace(/\[\[MonthName\]\]/g,GetMonthString(b.getMonth()));a=a.replace(/\[\[DayOfWeek\]\]/g,GetDayString(b.getDay()));a=a.replace(/\[\[Year\]\]/g,b.getFullYear());return a}function OnLoad(a){}var u4=document.getElementById("u4");gv_vAlignTable.u4="top";var u5=document.getElementById("u5");if(bIE){u5.attachEvent("onmouseover",MouseOveru5)}else{u5.addEventListener("mouseover",MouseOveru5,true)}function MouseOveru5(a){windowEvent=a;if(!IsTrueMouseOver("u5",a)){return}if(true){SetPanelState("u0","pd1u0","none","",500,"none","",500)}}var u6=document.getElementById("u6");gv_vAlignTable.u6="center";var u0=document.getElementById("u0");var u1=document.getElementById("u1");if(bIE){u1.attachEvent("onmouseout",MouseOutu1)}else{u1.addEventListener("mouseout",MouseOutu1,true)}function MouseOutu1(a){windowEvent=a;if(!IsTrueMouseOut("u1",a)){return}if(true){SetPanelState("u0","pd0u0","none","",500,"none","",500)}}var u2=document.getElementById("u2");gv_vAlignTable.u2="center";var u3=document.getElementById("u3");if(window.OnLoad){OnLoad()};