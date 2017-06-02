package controllers.apis;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.project.models.Desk;
import com.pscnlab.project.services.DeskService;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;
import ninja.params.PathParam;

/**
 * Created by zengyh on 2017/6/2.
 */
@FilterWith(JsonAndJsonpResult.class)
public class DeskApiController {

    @Inject
    private DeskService deskService;

    //桌位查询
    public Result deskList(@Param("tableNum") String tableNum,
                            @Param("userName") String userName,
                            @Param("state") String state,
                            @Param("offset") Integer offset,
                            @Param("size") Integer size){

        ResultsTotalDTO<Desk> resultsTotalDTO = deskService.findListByCondition(tableNum,userName,state,offset,size);
        return Results.ok().render(resultsTotalDTO);

    }

    //查询单个桌位
    public Result deskInfo(@PathParam("deskId") Integer deskId){

        Desk desk = deskService.findOneByTableId(deskId);
        return Results.ok().render(desk);
    }

    //添加桌位
    public Result addDesk(Desk desk){
        deskService.addDesk(desk);
        return Results.ok().render(Boolean.TRUE);
    }

    //修改桌位
    public Result updateDesk(Desk desk){

        deskService.updateDesk(desk);
        return Results.ok().render(Boolean.TRUE);
    }

    //删除桌位
    public Result deleteDesk(@PathParam("deskId") Integer deskId){
        deskService.delete(deskId);
        return Results.ok().render(Boolean.TRUE);
    }

}
