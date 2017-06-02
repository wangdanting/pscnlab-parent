package controllers.apis;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.core.vos.ResultVO;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.project.models.Funds;
import com.pscnlab.project.services.FundService;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;
import ninja.params.PathParam;

/**
 * Created by zengyh on 2017/6/3.
 */
@FilterWith(JsonAndJsonpResult.class)
public class FundApiController {

    @Inject
    private FundService fundService;

    //计算经费余额
    public Result fundCount(){
        Integer fundBalance = fundService.countAllFund();
        return Results.ok().render(ResultVO.build(fundBalance));
    }

    //查询经费
    public Result fundList(@Param("offset") Integer offset,
                           @Param("size") Integer size){

        ResultsTotalDTO resultsTotalDTO = fundService.findPageByCondition(offset,size);
        return Results.ok().render(resultsTotalDTO);
    }

    //查询某项经费
    public Result fundInfo(@PathParam("fundId") Integer fundId){
        Funds funds = fundService.findOneFund(fundId);
        return Results.ok().render(funds);
    }

    //新增经费
    public Result newFund(Funds funds){
        fundService.saveFunds(funds);
        return Results.ok().render(Boolean.TRUE);
    }

    //修改经费
    public Result updateFund(Funds funds){
        fundService.updateFund(funds);
        return Results.ok().render(Boolean.TRUE);
    }

    //删除经费
    public Result deleteFund(@PathParam("fundId") Integer fundId ){
        fundService.deleteFund(fundId);
        return Results.ok().render(Boolean.TRUE);
    }
}
