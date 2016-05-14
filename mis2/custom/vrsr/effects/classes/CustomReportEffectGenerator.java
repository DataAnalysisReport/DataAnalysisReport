import java.util.Map;

import com.geezn.view.effects.AbstractReportEffectGenerator;
import com.runqian.report4.usermodel.Context;
import com.runqian.report4.usermodel.IReport;

/**
 * 客户化特效生成器
 * 由DefaultReportEffectGenerator固定调用
 * 该类需要放到固定路径下：mis2/custom/vrsr/effects/classes
 * 该类不能有包名
 * 该类名称固定
 * @author sun
 *
 */
public class CustomReportEffectGenerator extends AbstractReportEffectGenerator {

	@Override
	public IReport generate(IReport ir, Context ctx, Map<String, Object> params) {
		// TODO Auto-generated method stub
		
		System.out.println("客户化特效生成器...");
		
		return ir;
	}

}
