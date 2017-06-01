package controllers.apis;

import com.google.inject.Inject;
import com.jiabangou.core.vos.ResultsVO;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.member.services.MemberSevice;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;

import java.util.List;

/**
 * Created by zengyh on 2017/6/1.
 */
@FilterWith(JsonAndJsonpResult.class)
public class MemberApiController {

    @Inject
    private MemberSevice memberSevice;

    //成员姓名查询成员信息
    public Result memberList(@Param("memberName") String memberName){

        List list = memberSevice.findMemberWithMemberName(memberName);
        return Results.ok().render(ResultsVO.build(list));

    }
}
