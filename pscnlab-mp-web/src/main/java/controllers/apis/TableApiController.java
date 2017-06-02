package controllers.apis;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.project.models.Table;
import com.pscnlab.project.services.TableService;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;

/**
 * Created by zengyh on 2017/6/2.
 */
@FilterWith(JsonAndJsonpResult.class)
public class TableApiController {

    @Inject
    private TableService tableService;

    //桌位查询
    public Result tableList(@Param("tableNum") String tableNum,
                            @Param("userName") String userName,
                            @Param("state") String state,
                            @Param("offset") Integer offset,
                            @Param("size") Integer size){

        ResultsTotalDTO<Table> resultsTotalDTO = tableService.findListByCondition(tableNum,userName,state,offset,size);
        return Results.ok().render(resultsTotalDTO);

    }

    //添加桌位
    public Result addTable(Table table){

        tableService.save(table);
        return Results.ok().render(Boolean.TRUE);
    }

    //修改桌位
    public Result updateTable(Table table){

        tableService.updateTable(table);
        return Results.ok().render(Boolean.TRUE);
    }

    //删除桌位
    public Result deleteTable(@Param("tableId") Integer tableId){
        tableService.delete(tableId);
        return Results.ok().render(Boolean.TRUE);
    }

}
