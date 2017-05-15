package controllers.apis;

import com.google.inject.Singleton;
import com.jiabangou.core.vos.ResultVO;
import ninja.Result;
import ninja.Results;

/**
 * Created by wangdanting on 17/5/15.
 */
@Singleton
public class LoginApiController {



    /**
     * 登录逻辑
     * @param
     * @return
     */
    public Result login(){


        return Results.ok().render(ResultVO.build(true));
    }

}
