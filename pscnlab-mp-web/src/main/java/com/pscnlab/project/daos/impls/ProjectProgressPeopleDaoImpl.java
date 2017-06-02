package com.pscnlab.project.daos.impls;

import com.google.inject.Singleton;
import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.pscnlab.project.daos.ProjectProgessPeopleDao;
import com.pscnlab.project.models.ProjectProgressPeople;

import java.util.List;
import java.util.Set;

/**
 * Created by zengyh on 2017/5/15.
 */
@Singleton
public class ProjectProgressPeopleDaoImpl extends BaseDao<Long,ProjectProgressPeople> implements ProjectProgessPeopleDao{


    @Override
    public List<ProjectProgressPeople> findListByProjectIdsSet(Set<Integer> projectIdsSet){
        FilterMap filterMap = new FilterMap();
        filterMap.in("uuidProject",projectIdsSet);
        return super.list(filterMap);
    }


    @Override
    public ProjectProgressPeople findOneByMemberUUIdAndProjectId(Integer uuidProject,Integer memberUUId){
        if(uuidProject==null||memberUUId==null){
            return null;
        }
        FilterMap filterMap = new FilterMap();
        filterMap.eq("uuidProject",uuidProject);
        filterMap.eq("uuidMember",memberUUId);

        return super.findOne(filterMap);
    }


}
