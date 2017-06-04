package com.pscnlab.project.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.project.daos.impls.ProjectProgressPeopleDaoImpl;
import com.pscnlab.project.models.ProjectProgressPeople;

import java.util.List;
import java.util.Set;

@ImplementedBy(ProjectProgressPeopleDaoImpl.class)
public interface ProjectProgessPeopleDao extends IBaseDao<Long,ProjectProgressPeople>{
    List<ProjectProgressPeople> findListByProjectIdsSet(Set<Integer> projectIdsSet);

    ProjectProgressPeople findOneByMemberUUIdAndProjectId(Integer uuidProject, Integer memberUUId);
}
