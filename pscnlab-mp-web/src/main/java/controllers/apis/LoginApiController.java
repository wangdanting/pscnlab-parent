package controllers.apis;

import com.google.inject.Singleton;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.SessionConstant;
import com.pscnlab.member.models.Member;
import com.pscnlab.member.services.MemberSevice;
import ninja.Context;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;

import javax.inject.Inject;

/**
 * Created by wangdanting on 17/5/15.
 */
@Singleton
@FilterWith(JsonAndJsonpResult.class)
public class LoginApiController {

    @Inject
    private MemberSevice memberSevice;
    /**
     * 登录逻辑
     * @param
     * @return
     */
    public Result login(@Param("telephone") String telephone, @Param("password") String password, Context context){
        Member member= memberSevice.login(telephone, password);
        context.getSession().put(SessionConstant.USER_ID,member.getUuidMember()+"");
        return Results.ok().render(member);
    }
}
