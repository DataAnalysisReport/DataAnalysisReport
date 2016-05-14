
/**
 * 操作记录模块js方法
 * @param {Object} module 操作的模块
 * @param {Object} message 显示的操作信息
 * @param {Object} otherId 其他用于标识的ID
 * @param {Object} userId 用户ID
 * @param {Object} operationJson 操作记录JSON由各模块自行规定格式。
 * @param {Object} operationTag用于过滤用的标签,可包括多个，以#分隔
 */
	function recordUtils(module,message,otherId,userId,operationJson,operationTag) {
		var params = {};
		params.moduleEntryClass = "com.geezn.operationRecord.RecordUtils";	
		params.moduleEntryName = "operationRecord";
		params.module = module;
		params.message = message;
		params.otherId = otherId;
		params.userId = userId;
		params.operationJson = operationJson;
		params.operationTag = operationTag;
		$.ajax({
			type:"POST",
			url: "EntryServlet",
			cache:false,
			data:params,
			dataType:"json",
			success:function(data, textStatus){
				//alert("成功"+data.result);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				//alert("失败"+textStatus);
			}
		});
	}    