package com.pscnlab.project.services;

import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.project.models.Project;
import com.pscnlab.project.services.dtos.ProjectProgressPeopleDTO;
import com.pscnlab.project.services.dtos.ProjectQueryPageDTO;

import java.util.List;

/**
 * Created by zengyh on 2017/5/15.
 */
public interface ProjectService extends BaseService{
    void projectAddMember(Integer uuidProject, Integer memberUUId);

    //删除项目
    void deleteProject(Integer projectId);

    void projectDeleteMember(Integer uuidProject, Integer memberUUId);

    List<ProjectProgressPeopleDTO> findProjectMemberList(Integer uuid);

    void updateProject(Project newProject);

    void saveProject(Project project);

    //查询单个项目信息
    ProjectQueryPageDTO findOneProjectInfo(Integer projectId, Integer memberUUId);

    ResultsTotalDTO<ProjectQueryPageDTO> findPageProject(String state, Integer offset, Integer size, Integer memberUUId);
}
