package controllers.apis;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.recruit.models.Recruit;
import com.pscnlab.recruit.services.RecruitService;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;
import ninja.params.PathParam;

/**
 * Created by zengyh on 2017/6/3.
 */
@FilterWith(JsonAndJsonpResult.class)
public class RecruitApiController {

    @Inject
    private RecruitService recruitService;

    //查询经费
    public Result recruitList(@Param("position") String position,
                           @Param("offset") Integer offset,
                           @Param("size") Integer size){

        ResultsTotalDTO resultsTotalDTO = recruitService.findPageByCondition(position,offset,size);
        return Results.ok().render(resultsTotalDTO);
    }

    //查询某项经费
    public Result recruitInfo(@PathParam("recruitId") Integer recruitId){
        Recruit recruit = recruitService.findOneRecruit(recruitId);
        return Results.ok().render(recruit);
    }

    //新增经费
    public Result newRecruit(Recruit recruit){
        recruitService.saveRecruit(recruit);
        return Results.ok().render(Boolean.TRUE);
    }

    //修改经费
    public Result updateRecruit(Recruit recruit){
        recruitService.updateRecruit(recruit);
        return Results.ok().render(Boolean.TRUE);
    }

    //删除经费
    public Result deleteRecruit(@PathParam("recruitId") Integer recruitId ){
        recruitService.deleteRecruit(recruitId);
        return Results.ok().render(Boolean.TRUE);
    }
}
