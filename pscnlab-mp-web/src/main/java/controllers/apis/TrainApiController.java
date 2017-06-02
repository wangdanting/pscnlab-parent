package controllers.apis;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.core.vos.ResultsVO;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.project.models.Funds;
import com.pscnlab.project.models.Project;
import com.pscnlab.project.models.ProjectProgressPeople;
import com.pscnlab.project.services.dtos.ProjectQueryPageDTO;
import com.pscnlab.train.models.Train;
import com.pscnlab.train.services.TrainService;
import com.pscnlab.train.services.dtos.TrainPageDTO;
import ninja.Context;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;
import ninja.params.PathParam;

import java.util.List;

/**
 * Created by zengyh on 2017/6/3.
 */
@FilterWith(JsonAndJsonpResult.class)
public class TrainApiController {


    @Inject
    private TrainService trainService;


    /**
     * 查询培训列表
     * @param time    时间
     * @param offset   分页偏移量
     * @param size     分页大小
     * @param memberUUId  成员主键ID
     * @param context
     * @return
     */
    public Result trainList(@Param("time") String time,
                              @Param("offset") Integer offset,
                              @Param("size") Integer size,
                              @Param("memberUUId") Integer memberUUId,
                              Context context){

        ResultsTotalDTO<TrainPageDTO> resultsTotalDTO =  trainService.findPageByTime(time,offset,size,memberUUId);
        return Results.ok().render(resultsTotalDTO);

    }

    //新增项目
    public Result trainNew(Train train){
        trainService.saveTrain(train);
        return Results.ok().render(Boolean.TRUE);
    }

    //更新项目
    public Result trainUpdate(Train train){
        trainService.updateTrain(train);
        return Results.ok().render(Boolean.TRUE);
    }

    //删除项目
    public Result trainDelete(@PathParam("trainId") Integer trainId){
        trainService.deleteTrain(trainId);
        return Results.ok().render(Boolean.TRUE);
    }



    //培训加入成员
    public Result trainAddMember(@PathParam("trainId") Integer trainId,
                                 @Param("memberUUId") Integer memberUUId){

        trainService.trainAddMember(trainId,memberUUId);
        return Results.ok().render(Boolean.TRUE);
    }

    //培训删除成员
    public Result trainDeleteMember(@PathParam("trainId") Integer trainId,
                                      @Param("memberUUId") Integer memberUUId){

        trainService.trainDeleteMember(trainId,memberUUId);
        return Results.ok().render(Boolean.TRUE);
    }


}
