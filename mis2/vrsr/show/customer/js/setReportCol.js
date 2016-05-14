
$(document).ready(function(){
   //获取过滤数据
   var json = parent.getColData(colName);
   var dataNum = json.dataNum;
   var filterData = json.data;
   var filteredData = new Array();//未被选中的字段
   if(!hasCol(colName)){//保存列所有字段
   	storeColValues(colName,filterData);
   }else{
   		filteredData = getFilteredValue(filterData,filteredData);
   }
   if(dataNum >= 10){
//      for(var i=0;i<10;i++){
//         var filterHtml = '<li><input type="checkbox" value="'+filterData[i]+'" class="filterChk"></input><span>'+filterData[i]+'</span></li>';
//         $("#filterDatas").append(filterHtml);
//      }
	   $("#filterDatas").css("display","none");
   }else{
      for(var i=0;i<dataNum;i++){
      	//if(filterData[i].indexOf("总计")==-1&&filterData[i].indexOf("合计")==-1&&filterData[i].indexOf("单计")==-1&&filterData[i].indexOf("计数")==-1&&filterData[i].indexOf("求平均值")==-1&&filterData[i].indexOf("求最小值")==-1&&filterData[i].indexOf("求最大值")==-1&&filterData[i].indexOf("求和")==-1&&filterData[i]!=""&&filterData[i]!=" "){
      		var filterHtml = '<li><input type="checkbox" value="'+filterData[i]+'" class="filterChk" checked="true"></input><span>'+filterData[i]+'</span></li>';
         	$("#filterDatas").append(filterHtml);
      	//}
      }
      for(var i=0;i<filteredData.length;i++){
         //if(filteredData[i].indexOf("总计")==-1&&filteredData[i].indexOf("合计")==-1&&filteredData[i].indexOf("单计")==-1&&filteredData[i].indexOf("计数")==-1&&filteredData[i].indexOf("求平均值")==-1&&filteredData[i].indexOf("求最小值")==-1&&filteredData[i].indexOf("求最大值")==-1&&filteredData[i].indexOf("求和")==-1&&filteredData[i]!=""&&filterData[i]!=" "){
         	 var filterHtml = '<li><input type="checkbox" value="'+filteredData[i]+'" class="filterChk"></input><span>'+filteredData[i]+'</span></li>';
         	$("#filterDatas").append(filterHtml);
         //}
        
      }
   }
   //生成工具条
   var jsondata = []; 
   var jsonSettings = {"data":jsondata,"datatype":"json"}; 
   $("#filterBtns").rqtoolbar(jsonSettings); 
   $("#toolbar").rqtoolbar(jsonSettings); 

   $("table tr").mouseover(function(){
      $(this).css("background-color","#EBF0F6");
   });
   $("table tr").mouseout(function(){
      $(this).css("background-color","#FBFBFB");
   });

   $("#filterDatas li").mouseover(function(){
      $(this).css("background-color","#EBF0F6");
   });
   $("#filterDatas li").mouseout(function(){
      $(this).css("background-color","#FBFBFB");
   });
});
//选择排序方式
function selectSortMode(mode){
   var cls = $("#"+mode+"Mode").attr("class");
   if(cls != "" && cls != null){
	  $("#"+mode+"Mode").html("");
	  $("#"+mode+"Mode").removeClass("selected");
      sortMode = "auto";
   }else{
	  if(mode == "asc"){
		  $("#descMode").html("");
		  $("#descMode").removeClass("selected");
	  }else if(mode == "desc"){
		  $("#ascMode").html("");
		  $("#ascMode").removeClass("selected");
	  }
	  var selHtml = '<img src="'+appPath+'/mis2/vrsr/show/images/select.png"></img>';
	  $("#"+mode+"Mode").append(selHtml);
	  $("#"+mode+"Mode").addClass("selected");
      sortMode = mode;
   }
}
//是否隐藏列
function isColVisible(){
   var cls = $("#hideCol").attr("class");
   if(cls != "" && cls != null){
      $("#hideCol").html("");
	  $("#hideCol").removeClass("selected");
	  isVisible = "true";
   }else{
      var selHtml = '<img src="'+appPath+'/mis2/vrsr/show/images/select.png"></img>';
	  $("#hideCol").html(selHtml);
	  $("#hideCol").addClass("selected");
	  isVisible = "false";
   }
}
//选择全部
function selAll(){
	if($("#selall").attr("checked") == "checked"){
	    $(".filterChk").attr("checked","checked");
	}else{
		 $(".filterChk").removeAttr("checked");
	}
}
//选择全部
function disAll(){
	$("#selall").removeAttr("checked");
	selAll();
}
//set方法
function set(){
    var filterArr = new Array();
	var filterChkNum = 0;//记录按钮个数
    var filterArrLength = 0;//记录选中的按钮个数
	$(".filterChk").each(function(){
			filterChkNum++;
	    if($(this).attr("checked") == "checked"){
		   filterArr.push($(this).val());
			 filterArrLength++;
		}
	});
	//处理全选问题
	if(filterArrLength==filterChkNum){//判断所有复选框都已勾选则filterArr赋值“ALLDATA”
		filterArr = new Array();
		filterArr.push("ALLDATA");
	}
	var json = {
				  colIndex:colIndex,
				  colName:colName,
		          sort:sortMode,
			      visible:isVisible,
				  filterData:filterArr
	           };
	parent.set(json);
}
//保存colName（列名）列的所有字段
function storeColValues(colName,filterArr){

		var filterValue = {
				  colName:colName,
				  filterData:filterArr
	   };
	   parent.filterValues.push(filterValue);
		
}
	
//是否保存colName（列名）列的所有字段
function hasCol(colName){
	for(var i = 0;i<parent.filterValues.length;i++){
		if(parent.filterValues[i].colName==colName){
			return true;
		}
	}
	return false;
}
//获取被过滤掉的数据
function getFilteredValue(filterData,filteredData){
	for(var i = 0;i<parent.filterValues.length;i++){
		if(parent.filterValues[i].colName==colName){
			for(var j = 0;j<parent.filterValues[i].filterData.length;j++){
				filteredData = filter(parent.filterValues[i].filterData[j].toString(),filterData,filteredData);
			}
		}
	}
	return filteredData;
}
//判断当前显示字段是否包含该列所有过滤的字段，不包含的放在filteredData中
function filter(value, filterData,filteredData) { 
	if(!isContains(filterData,value)){
			filteredData.push(value); 
		}
	return filteredData; 
} 
//判断filterData中是否已有value这个字段值
function isContains(filterData,value){
	for(var i=0;i<filterData.length;i++){
		if(filterData[i]==value){
			return true;	
		}	
	}
	return false;
}