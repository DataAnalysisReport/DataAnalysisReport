function customSpellChinese(zh_cn){
	var rtnArray=new Array();
	if(zh_cn=='厦门'){
		rtnArray.push("XM");
	}else if(zh_cn=='沈阳'){
		rtnArray.push("XY");
	}else if(zh_cn=='合肥'){
		rtnArray.push("HF");
	}
	return rtnArray;
}

function provice_init_map(){
	//confirm("area_code:");
	autoSetReportHeight();
	if(parent.parent.area_code!=''){
		var config={};
		var paramDefaultValue=mapCont.paramDefaultValue;
		paramDefaultValue['area_code']=parent.parent.area_code;
		config.paramDefaultValue=paramDefaultValue;
		setTimeout("map_refresh('area_code="+parent.parent.area_code+"')",500);
	}
}

var thisCity="星美区域图";
function map_refresh(args){
	//解析数据
	//var aaa=args;
	var argsArray=args.split("&");
	var argsJSON={};
	for(index in argsArray){
		var argStr=argsArray[index];
		var item=argStr.split("=");
		var name=item[0];
		var value=item[1];
		argsJSON[name]=value;
		if(name=="prop_type"){
			var searchValue=value;
			while(searchValue.indexOf(",")!=-1){
				searchValue = searchValue.replace(",","|");
			}
			searchValue = searchValue.replace("20","住宅小区");
			searchValue = searchValue.replace("30","商业");
			searchValue = searchValue.replace("40","公共设施");
			searchValue = searchValue.replace("50","其他");
			argsJSON['searchType']=searchValue; 
		}
	}
	
	argsJSON['city']=thisCity;
	var argsStr=JSON.stringify(argsJSON); 
	mapCont.refresh(argsStr);
}

function map_check(area){
	thisCity = area;
	var paramSet={};
	if(area=='北区'){
		paramSet["area_code"]='01';
		paramSet["city"]=area;
		paramSet["useLastParam"]=true;
		mapCont.refresh(JSON.stringify(paramSet));
	}else if(area=='南区'){
		paramSet["area_code"]='04';
		paramSet["city"]=area;
		paramSet["useLastParam"]=true;
		mapCont.refresh(JSON.stringify(paramSet));
	}else if(area=='东区'){
		paramSet["area_code"]='03';
		paramSet["city"]=area;
		paramSet["useLastParam"]=true;
		mapCont.refresh(JSON.stringify(paramSet));
	}else if(area=='东北区'){
		paramSet["area_code"]='02';
		paramSet["city"]=area;
		paramSet["useLastParam"]=true;
		mapCont.refresh(JSON.stringify(paramSet));
	}else if(area=='西区'){
		paramSet["area_code"]='06';
		paramSet["city"]=area;
		paramSet["useLastParam"]=true;
		mapCont.refresh(JSON.stringify(paramSet));
	}else if(area=='中区'){
		paramSet["area_code"]='05';
		paramSet["city"]=area;
		paramSet["useLastParam"]=true;
		mapCont.refresh(JSON.stringify(paramSet));
	}else{
		paramSet["city"]=area;
		mapCont.moveMarker(JSON.stringify(paramSet));
	}
}

function changeMapArea(area){
	mapCharts.changeMapArea(area);
}
//加载打印图标
function vr_ui_toolbar_print_icon(){
	
}
	   
//加载导出excel图标
function vr_ui_toolbar_export_excel_icon(){
	
}
	  
//加载导出word图标
function vr_ui_toolbar_export_word_icon(){
	
}
//加载导出txt
function vr_ui_toolbar_export_txt_icon(){
	
}
//导出CSV
function vr_ui_toolbar_export_csv_icon(){
	
}
//导出RAT
function vr_ui_toolbar_export_rat_icon(){
	
}

//导出RAT
function vr_ui_toolbar_export_rat_icon(){
	
}

//提交数据
function vr_ui_toolbar_submit_icon(){
	
}

//行式报表插入行
function vr_ui_toolbar_insert_row_icon(){
	
}

//行式报表追加行
function vr_ui_toolbar_addTo_row_icon(){
	
}

//行市报表删除行
function vr_ui_toolbar_delete_row_icon(){
	
}
//加载刷新图标
function vr_ui_toolbar_refresh_icon(){
	
}
	   
//加载订阅图标
function vr_ui_toolbar_subscribe_icon(){
	
}

//加载上一页图标
function vr_ui_toolbar_prePage_icon(){
	
}

//加载下一页图标
function vr_ui_toolbar_nextPage_icon(){
	
}

//第一页图标
function vr_ui_toolbar_firstPage_icon(){
	
}

//最后一页图标
function vr_ui_toolbar_lastPage_icon(){
	
}
	  
//远程导出图标
function vr_ui_toolbar_remote_export_icon(){
	
}
	  
//普通查询图标	
function vr_ui_toolbar_filterSet1_icon(){
	
}

//自定义过滤
function vr_ui_toolbar_filterSet2_icon(){
	
}

//字段过滤图标
function vr_ui_toolbar_fleldSet_icon(){
	
}

//排序设置
function vr_ui_toolbar_sortSet_icon(){
	
}

//打印设置
function vr_ui_toolbar_printSet_icon(){
	
}

//基本设置
function vr_ui_toolbar_basicSet_icon(){
	
}

//展现数据
function vr_ui_toolbar_showReport_icon(){
	
}

//显示隐藏列图标
function vr_ui_toolbar_showCol_icon(){
	
}

//导入excel错误信息
function vr_ui_excel_import_error_message(errormsgs){
//errormsgs
	var error = ""
	//最多显示条数
	var errorlen = 4;
	var errorltmp = "";
	var i,j;
	var k=0;
	//将二维数组转为一维数组
	//errorMsgsdf为传入的错误信息二维数组 每个元素表示每行出错格子出错信息的一维数组
	var errorMsgsdf = new Array();
	for(i = 0;i<errormsgs.length;i++){
		var arr_1 = errormsgs[i];
		for(j=0;j<arr_1.length;j++){
			errorMsgsdf[k]=arr_1[j];
			k++;
		}
	}
	for(var i=0;i<errorMsgsdf.length;i++){
		if(i<errorlen){
		error +=errorMsgsdf[i]+"\r\n";
	}
	else if(i==errorlen+1){
		error += "...";
		break;
	}
	}
	
	if(errorMsgsdf.length>errorlen){
		errorltmp = errorlen;
	}else{
		errorltmp =errorMsgsdf.length;
	}
	//共N处校验错误，其中前N处为xxxxx
	if(errorMsgsdf.length!=0){
		var errorInfo = "共"+errorMsgsdf.length.toString()+"处校验错误，其中前"+errorltmp+"处为:"+"\r\n"+error;
		confirm(errorInfo);
	}
}