//保存报表
function saveReportDoc() {
	var resID = viewer.reportId; // 资源ID
	var reportDefineId = viewer.reportDefineId; // 实体ID
	var path = PathUtils.getRelativeUrl("/mis2/vrsr/show/saveFastReportDialog.jsp?resID="
				  + resID+"&reportDefineId="+reportDefineId);
	showDialog(path, "SaveFastReportDialog", "保存报表", 120, 320, null, null, null, null, null, null, null, true, null, null, true);
}

// 报表另存为：
function saveAsReport(gradePath) {
	var filePath = '/mis2/reportcenter/res/pivot/snapshot';
	showSaveDialog('另存为', 'ResAndFile', null, 'saveDialogCallback4SaveAs', true, 14, '', '', gradePath, '', filePath, 'xml');
}

// 保存窗口回调函数：
function saveDialogCallback4SaveAs(data){
	data.order = 10;
	data.resID = base64.encode(reportID); 
	data.reportDefineId = base64.encode(reportDefineId); 
	data.serverPath = base64.encode(serverPath);
	data.fastReportDir = base64.encode(filePath);
	data.operation = 'save_as';
	$.ajax({
		type : "POST",
		url : PathUtils.getRelativeUrl("/showPivotReportServlet?action=15"),
		async : true,
		cache : false,
		data : data,
		dataType : "json",
		success : function(data) {
			console.log(data);
			if(data.status == 'success'){
				alert("保存成功！");
			}else{
				alert(data.message);
			}
		},
		error : function(e) {
			alert(JSON.stringify(e));
		}
	});
}

// 更新报表XML：
function updateReport() {
	var resID = viewer.reportId; // 资源ID
	$.ajax({
		type : "POST",
		url : PathUtils.getRelativeUrl("/showPivotReportServlet?action=15"),
		async : true,
		cache : false,
		data : {
			"resID" : base64.encode(reportID),
			"reportDefineId" : base64.encode(reportDefineId),
			"serverPath" : base64.encode(serverPath),
			"fastReportDir" : base64.encode(filePath)
		},
		dataType : "json",
		success : function(data) {
			if(data.status == 'success'){
				alert("保存成功！");
				viewer.reportConfig.rowHeight = rowHeight;
			}else{
				alert(data.message);
			}
		},
		error : function(e) {
			alert(JSON.stringify(e));
		}
	});
}


