package controllers.apis;

//import com.google.inject.Inject;

import com.jiabangou.core.vos.ResultVO;
import com.jiabangou.core.vos.ResultsVO;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.member.models.Member;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.member.services.dtos.MemberPageDTO;
import com.pscnlab.member.services.dtos.MemberPageQueryDTO;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;
import ninja.params.PathParam;

import javax.inject.Inject;
import java.util.List;

@FilterWith(JsonAndJsonpResult.class)
public class MemberApiController {

    @Inject
    private MemberSevice memberSevice;

    //成员姓名查询成员信息
    public Result memberList(@Param("memberName") String memberName){

        List list = memberSevice.findMemberWithMemberName(memberName);
        return Results.ok().render(ResultsVO.build(list));

    }

    public Result newMember(Member member) {
        memberSevice.save(member);
        return Results.ok().render(ResultVO.build(true));
    }

    public Result findOneMember(@PathParam("memberId")Integer memberId) {
        Member member = memberSevice.findOne(memberId);
        return Results.ok().render(member);
    }

    public Result updateMember(Member member) {
        memberSevice.update(member);
        return Results.ok().render(ResultVO.build(true));
    }

    public Result deleteMember(@Param("id") Integer id) {
        memberSevice.deleteByUUId(id);
        return Results.ok().render(ResultVO.build(true));
    }

    public Result findPage(@Param("uuidRole") Integer uuidRole,
                           @Param("gender") String gender,
                           @Param("name") String name,
                           @Param("telephone") String telephone,
                           @Param("offset") Integer offset,
                           @Param("size") Integer size) {
        MemberPageQueryDTO dto = new MemberPageQueryDTO();
        dto.setGender(gender);
        dto.setName(name);
        dto.setTelephone(telephone);
        dto.setUuidRole(uuidRole);
        Page<MemberPageDTO> page = memberSevice.findPage(dto, offset, size);
        return Results.ok().render(page);
    }


}
