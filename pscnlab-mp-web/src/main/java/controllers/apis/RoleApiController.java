package controllers.apis;

import com.jiabangou.core.vos.ResultVO;
import ninja.Result;
import ninja.Results;

/**
 * Created by wangdanting on 17/5/18.
 */
public class RoleApiController {
    /**
     * 角色
     * @param
     * @return
     */
    public Result role(){

        return Results.ok().render(ResultVO.build(true));
    }
}
