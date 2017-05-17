package com.pscnlab.project.services.impls;

import com.google.common.collect.Lists;
import com.google.inject.Inject;
import com.jiabangou.core.beans.ConvertUtils;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.project.daos.ProjectDao;
import com.pscnlab.project.daos.ProjectProgessPeopleDao;
import com.pscnlab.project.models.Project;
import com.pscnlab.project.models.ProjectProgressPeople;
import com.pscnlab.project.services.ProjectService;
import com.pscnlab.project.services.dtos.ProjectQueryPageDTO;
import org.apache.commons.collections.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Created by zengyh on 2017/5/15.
 */
public class ProjectServiceImpl implements ProjectService{

    @Inject
    private ProjectDao projectDao;

    @Inject
    private ProjectProgessPeopleDao projectProgessPeopleDao;

    @Inject
    private MemberSevice memberSevice;

    //@Override
    public ResultsTotalDTO<ProjectQueryPageDTO> findPageProject(String state,Integer offset,Integer size){

        Page<Project> projectPage = projectDao.findPageProjectByState(state,offset,size);
        if(CollectionUtils.isEmpty(projectPage.getResults())){
            return ResultsTotalDTO.build(Collections.EMPTY_LIST,0l);
        }
        Set<Integer> projectIdsSet = projectPage.getResults().stream().map(project -> project.getUuid()).collect(Collectors.toSet());
        List<ProjectProgressPeople> projectProgressPeoples = projectProgessPeopleDao.findListByProjectIdsSet(projectIdsSet);
        if(CollectionUtils.isEmpty(projectProgressPeoples)){
            List<ProjectQueryPageDTO> projectQueryPageDTOList = ConvertUtils.converts(projectPage.getResults(),ProjectQueryPageDTO.class);
            return ResultsTotalDTO.build(projectQueryPageDTOList,projectPage.getTotalCount());
        }

        Set<Integer> memberIdsSet = projectProgressPeoples.stream().map(p->p.getUuidMember()).collect(Collectors.toSet());

        //memberSevice.findMap


        return ResultsTotalDTO.build(Lists.newArrayList(),projectPage.getTotalCount());

    }
}
