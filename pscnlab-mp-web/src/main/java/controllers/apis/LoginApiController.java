package controllers.apis;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.jiabangou.core.vos.ResultVO;
import com.pscnlab.user.services.UserService;
import com.pscnlab.user.services.dtos.LoginDTO;
import ninja.Result;
import ninja.Results;

/**
 * Created by wangdanting on 17/5/15.
 */
@Singleton
public class LoginApiController {

    @Inject private UserService userService;

    /**
     * 登录逻辑
     * @param loginDTO 登录用户信息
     * @return
     */
    public Result login(LoginDTO loginDTO){

        userService.login(loginDTO);

        return Results.ok().render(ResultVO.build(true));
    }

}
