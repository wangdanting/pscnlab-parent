package controllers.apis;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.project.services.ProjectService;
import com.pscnlab.project.services.dtos.ProjectQueryPageDTO;
import ninja.Context;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;

/**
 * Created by zengyh on 2017/6/1.
 */
@FilterWith(JsonAndJsonpResult.class)
public class ProjectApiController {


    @Inject
    private ProjectService projectService;


    public Result projectList(@Param("state") String state,
                              @Param("offset") Integer offset,
                              @Param("size") Integer size,
                              Context context){

        ResultsTotalDTO<ProjectQueryPageDTO> resultsTotalDTO =  projectService.findPageProject(state,offset,size);
        return Results.ok().render(resultsTotalDTO);

    }
}
