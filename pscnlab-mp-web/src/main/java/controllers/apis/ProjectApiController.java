package controllers.apis;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.core.vos.ResultsVO;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.project.models.Project;
import com.pscnlab.project.models.ProjectProgressPeople;
import com.pscnlab.project.services.ProjectService;
import com.pscnlab.project.services.dtos.ProjectQueryPageDTO;
import ninja.Context;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;
import ninja.params.PathParam;

import java.util.List;

/**
 * Created by zengyh on 2017/6/1.
 */
@FilterWith(JsonAndJsonpResult.class)
public class ProjectApiController {


    @Inject
    private ProjectService projectService;

    public Result projectInfo(@PathParam("projectId") Integer projectId,
                              @Param("memberUUId") Integer memberUUId){

        ProjectQueryPageDTO dto = projectService.findOneProjectInfo(projectId,memberUUId);
        return Results.ok().render(dto);
    }

    /**
     * 查询项目列表
     * @param state    状态：未开始 进行中 已完成
     * @param offset   分页偏移量
     * @param size     分页大小
     * @param memberUUId  成员主键ID
     * @param context
     * @return
     */
    public Result projectList(@Param("state") String state,
                              @Param("offset") Integer offset,
                              @Param("size") Integer size,
                              @Param("memberUUId") Integer memberUUId,
                              Context context){

        ResultsTotalDTO<ProjectQueryPageDTO> resultsTotalDTO =  projectService.findPageProject(state,offset,size,memberUUId);
        return Results.ok().render(resultsTotalDTO);

    }

    //新增项目
    public Result projectNew(Project project){
        projectService.saveProject(project);
        return Results.ok().render(Boolean.TRUE);
    }

    //更新项目
    public Result projectUpdate(Project project){
        projectService.updateProject(project);
        return Results.ok().render(Boolean.TRUE);
    }

    //删除项目
    public Result projectDelete(@PathParam("projectId") Integer projectId){
        projectService.deleteProject(projectId);
        return Results.ok().render(Boolean.TRUE);
    }

    //查询项目成员
    public Result projectMember(@PathParam("projectId") Integer projectId){

        List list = projectService.findProjectMemberList(projectId);
        return Results.ok().render(ResultsVO.build(list));

    }

    //项目加入成员
    public Result projectAddMember(@PathParam("projectId") Integer projectId,
                                   @Param("memberUUId") Integer memberUUId){

        projectService.projectAddMember(projectId,memberUUId);
        return Results.ok().render(Boolean.TRUE);
    }

    //项目删除成员
    public Result projectDeleteMember(@PathParam("projectId") Integer projectId,
                                      @Param("memberUUId") Integer memberUUId){

        projectService.projectDeleteMember(projectId,memberUUId);
        return Results.ok().render(Boolean.TRUE);
    }

    //查询成员项目进度
    public Result projectProgressInfo(@PathParam("projectId") Integer projectId,
                                      @PathParam("memberId") Integer memberId){

        ProjectProgressPeople people = projectService.findProjectProgress(projectId,memberId);
        return Results.ok().render(people);
    }

    //项目编辑进度
    public Result projectUpdateProgress(@PathParam("projectId") Integer projectId,
                                        @PathParam("memberId") Integer memberId,
                                        @Param("progress") String progress,
                                        @Param("progressInfo") String progressInfo){
        projectService.updateProjectProgress(projectId,memberId,progress,progressInfo);
        return Results.ok().render(Boolean.TRUE);
    }
}
