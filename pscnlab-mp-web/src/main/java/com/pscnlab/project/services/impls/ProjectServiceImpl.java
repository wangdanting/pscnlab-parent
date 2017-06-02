package com.pscnlab.project.services.impls;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.google.inject.Inject;
import com.jiabangou.core.beans.ConvertUtils;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.member.services.dtos.MemberPageDTO;
import com.pscnlab.project.daos.ProjectDao;
import com.pscnlab.project.daos.ProjectProgessPeopleDao;
import com.pscnlab.project.models.Project;
import com.pscnlab.project.models.ProjectProgressPeople;
import com.pscnlab.project.services.ProjectService;
import com.pscnlab.project.services.dtos.ProjectProgressPeopleDTO;
import com.pscnlab.project.services.dtos.ProjectQueryPageDTO;
import org.apache.commons.collections.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by zengyh on 2017/5/15.
 */
public class ProjectServiceImpl extends BaseServiceImpl implements ProjectService{

    @Inject
    private ProjectDao projectDao;

    @Inject
    private ProjectProgessPeopleDao projectProgessPeopleDao;

    @Inject
    private MemberSevice memberSevice;

    @Override
    public void projectAddMember(Integer uuidProject, Integer memberUUId){

        ProjectProgressPeople people = projectProgessPeopleDao.findOneByMemberUUIdAndProjectId(uuidProject,memberUUId);
        if(people!=null){
            throw ServiceException.build(500001l,"项目中已添加该成员");
        }

        people = new ProjectProgressPeople();
        people.setProgress("");
        people.setProgressInfo("");
        people.setUuidMember(memberUUId);
        people.setUuidProject(uuidProject);

        projectProgessPeopleDao.save(people);

    }

    //删除项目
    @Override
    public void deleteProject(Integer projectId){

        Project  project = projectDao.findOneByUUId(projectId);
        if(project!=null){
            projectDao.delete(project);
        }

    }

    @Override
    public void projectDeleteMember(Integer uuidProject,Integer memberUUId){

        ProjectProgressPeople people = projectProgessPeopleDao.findOneByMemberUUIdAndProjectId(uuidProject,memberUUId);
        if(people!=null){
            projectProgessPeopleDao.delete(people);
        }
    }

    @Override
    public List<ProjectProgressPeopleDTO> findProjectMemberList(Integer uuid){
        //查询项目成员
        List<ProjectProgressPeople> projectProgressPeoples = projectProgessPeopleDao.findListByProjectIdsSet(new HashSet<>(uuid));
        if(CollectionUtils.isEmpty(projectProgressPeoples)){
            return Collections.EMPTY_LIST;
        }

        List<ProjectProgressPeopleDTO> projectPepoles = Lists.newArrayList();
        //查询成员信息
        Set<Integer> memberIdsSet = projectProgressPeoples.stream().map(p->p.getUuidMember()).collect(Collectors.toSet());
        Map<Integer,MemberPageDTO> memberMap = memberSevice.findMemberWithRoleByIds(memberIdsSet);

        //项目有成员
        projectProgressPeoples.stream().forEach(p -> {
            ProjectProgressPeopleDTO dto = new ProjectProgressPeopleDTO();
            dto.setProgress(p.getProgress());
            dto.setProgressInfo(p.getProgressInfo());
            MemberPageDTO memberPageDTO = memberMap.get(p.getUuidMember());
            dto.setMemberName(memberPageDTO.getMember().getName());
            dto.setPosition(memberPageDTO.getRole().getPosition());
            dto.setRoleName(memberPageDTO.getRole().getRole());
            dto.setTelephone(memberPageDTO.getMember().getTelephone());
            dto.setUuidMember(memberPageDTO.getMember().getUuidMember());
            projectPepoles.add(dto);
        });

        return projectPepoles;
    }

    //更新项目
    @Override
    public void updateProject(Project newProject){
        Project  project = projectDao.findOneByUUId(newProject.getUuid());
        project.setTitle(newProject.getTitle());
        project.setAttention(newProject.getAttention());
        project.setDemand(newProject.getDemand());
        project.setResponsiblePersonName(newProject.getResponsiblePersonName());
        project.setStartTime(newProject.getStartTime());
        project.setStartEnd(newProject.getStartEnd());
        project.setState(newProject.getState());
        project.setUuidProjectProgress(newProject.getUuidProjectProgress());
        projectDao.update(project);
    }

    //新增项目
    @Override
    public void saveProject(Project project){
        projectDao.save(project);
    }

    //查询单个项目信息
    @Override
    public ProjectQueryPageDTO findOneProjectInfo(Integer projectId, Integer memberUUId){

        //查询项目列表
        Project project = projectDao.findOneByUUId(projectId);
        if(project==null){
            return new ProjectQueryPageDTO();
        }

        //查询项目成员
        List<ProjectProgressPeople> projectProgressPeoples = projectProgessPeopleDao.findListByProjectIdsSet(Sets.newHashSet(projectId));
        if(CollectionUtils.isEmpty(projectProgressPeoples)){
            ProjectQueryPageDTO projectQueryPageDTO = ConvertUtils.convert(project,ProjectQueryPageDTO.class);
            return projectQueryPageDTO;
        }

        ProjectQueryPageDTO projectQueryPageDTO = this.assembleProjectPeople(project,projectProgressPeoples,memberUUId);

        return projectQueryPageDTO;
    }

    //查询项目
    @Override
    public ResultsTotalDTO<ProjectQueryPageDTO> findPageProject(String state,Integer offset,Integer size, Integer memberUUId){

        //查询项目列表
        Page<Project> projectPage = projectDao.findPageProjectByState(state,offset,size);
        if(CollectionUtils.isEmpty(projectPage.getResults())){
            return ResultsTotalDTO.build(Collections.EMPTY_LIST,0l);
        }
        Set<Integer> projectIdsSet = projectPage.getResults().stream().map(project -> project.getUuid()).collect(Collectors.toSet());

        //查询项目成员
        List<ProjectProgressPeople> projectProgressPeoples = projectProgessPeopleDao.findListByProjectIdsSet(projectIdsSet);
        if(CollectionUtils.isEmpty(projectProgressPeoples)){
            List<ProjectQueryPageDTO> projectQueryPageDTOList = ConvertUtils.converts(projectPage.getResults(),ProjectQueryPageDTO.class);
            projectQueryPageDTOList.stream().forEach(o->{o.setIsInProject(Boolean.FALSE);});
            return ResultsTotalDTO.build(projectQueryPageDTOList,projectPage.getTotalCount());
        }

        List<ProjectQueryPageDTO> resultList = this.assembleProjectPeople(projectPage.getResults(),projectProgressPeoples,memberUUId);

        return ResultsTotalDTO.build(resultList,projectPage.getTotalCount());
    }


    //拼装项目成员
    public List<ProjectQueryPageDTO> assembleProjectPeople(List<Project> projects,List<ProjectProgressPeople> projectProgressPeoples,Integer memberUUId){

        //查询成员信息
        Set<Integer> memberIdsSet = projectProgressPeoples.stream().map(p->p.getUuidMember()).collect(Collectors.toSet());
        Map<Integer,MemberPageDTO> memberMap = memberSevice.findMemberWithRoleByIds(memberIdsSet);


        Map<Integer,List<ProjectProgressPeople>> projectProgressPeopleListMap = projectProgressPeoples.stream().collect(Collectors.groupingBy(ProjectProgressPeople::getUuidProject));
        Map<Integer,Project> projectMap = Maps.newHashMap();
        List<ProjectQueryPageDTO> resultList = Lists.newArrayList();
        for(Project project :projects){
            ProjectQueryPageDTO projectQueryPageDTO = ConvertUtils.convert(project,ProjectQueryPageDTO.class);
            //项目信息拼装项目成员
            List<ProjectProgressPeopleDTO> projectPepoles = Lists.newArrayList();
            List<ProjectProgressPeople> peoples = projectProgressPeopleListMap.get(project.getUuid());
            //项目没有成员
            if(CollectionUtils.isEmpty(peoples)){
                projectQueryPageDTO.setProjectPepoles(projectPepoles);
                resultList.add(projectQueryPageDTO);
                continue;
            }
            Boolean isInProject = Boolean.FALSE;
            //项目有成员
            for(ProjectProgressPeople people:peoples){
                ProjectProgressPeopleDTO dto = new ProjectProgressPeopleDTO();
                dto.setProgress(people.getProgress());
                dto.setProgressInfo(people.getProgressInfo());
                MemberPageDTO memberPageDTO = memberMap.get(people.getUuidMember());
                dto.setMemberName(memberPageDTO.getMember().getName());
                dto.setRoleName(memberPageDTO.getRole().getRole());
                dto.setPosition(memberPageDTO.getRole().getPosition());
                dto.setUuidMember(memberPageDTO.getMember().getUuidMember());
                projectPepoles.add(dto);

                if(memberPageDTO.getMember().getUuidMember().equals(memberUUId)){
                    isInProject = Boolean.TRUE;
                }
            }

            projectQueryPageDTO.setIsInProject(isInProject);
            projectQueryPageDTO.setProjectPepoles(projectPepoles);
            resultList.add(projectQueryPageDTO);
        }

        return resultList;
    }

    //拼装项目成员
    public ProjectQueryPageDTO assembleProjectPeople(Project project,List<ProjectProgressPeople> projectProgressPeoples,Integer memberUUId){

        //查询成员信息
        Set<Integer> memberIdsSet = projectProgressPeoples.stream().map(p->p.getUuidMember()).collect(Collectors.toSet());
        Map<Integer,MemberPageDTO> memberMap = memberSevice.findMemberWithRoleByIds(memberIdsSet);

        //成员分组

        ProjectQueryPageDTO projectQueryPageDTO = ConvertUtils.convert(project,ProjectQueryPageDTO.class);
        //项目信息拼装项目成员
        List<ProjectProgressPeopleDTO> projectPepoles = Lists.newArrayList();

        //项目没有成员
        if(CollectionUtils.isEmpty(projectProgressPeoples)){
            projectQueryPageDTO.setProjectPepoles(projectPepoles);
            return projectQueryPageDTO;
        }
        Boolean isInProject = Boolean.FALSE;
        //项目有成员
        for(ProjectProgressPeople people:projectProgressPeoples){
            ProjectProgressPeopleDTO dto = new ProjectProgressPeopleDTO();
            dto.setProgress(people.getProgress());
            dto.setProgressInfo(people.getProgressInfo());
            MemberPageDTO memberPageDTO = memberMap.get(people.getUuidMember());
            dto.setUuidMember(memberPageDTO.getMember().getUuidMember());
            dto.setMemberName(memberPageDTO.getMember().getName());
            dto.setPosition(memberPageDTO.getRole().getPosition());
            dto.setRoleName(memberPageDTO.getRole().getRole());
            projectPepoles.add(dto);

            if(memberPageDTO.getMember().getUuidMember().equals(memberUUId)){
                isInProject = Boolean.TRUE;
            }
        }

        projectQueryPageDTO.setIsInProject(isInProject);
        projectQueryPageDTO.setProjectPepoles(projectPepoles);

        return projectQueryPageDTO;
    }


    @Override
    protected IBaseDao getBaseDao() {
        return null;
    }
}
