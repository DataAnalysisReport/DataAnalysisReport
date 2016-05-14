/**
 * 通用工具类
 * @returns
 */
var CommonUtils = {
	
	_top : null, // 当前top对象
		
	/**
	 * 设置 、 获得top
	 * top可以手动设置
	 * top计算规则：
	 * 		如果当前有名称为RQTop的iframe，则返回该iframe；否则，返回顶层top
	 * 调用方式：
	 * 		1.设置frame1为top：var RQTop = CommonUtils.RQTop(top.frame1);
	 * 		2.获得top：var RQTop = CommonUtils.RQTop();
	 */
	RQTop : function (topObj) {
		//设置top
		CommonUtils._top = topObj;
		
		if(CommonUtils._top == undefined || CommonUtils._top == null){
			CommonUtils._top = top.RQTop ? top.RQTop : top;
		}
		
		return CommonUtils._top;
	}
	
}