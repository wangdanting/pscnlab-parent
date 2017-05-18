package controllers.apis;

import com.jiabangou.core.vos.ResultVO;
import ninja.Result;
import ninja.Results;

/**
 * Created by wangdanting on 17/5/17.
 */
public class PasswordApiController {

    /**
     * 找回密码逻辑
     * @param
     * @return
     */
    public Result password(){


        return Results.ok().render(ResultVO.build(true));
    }
}
