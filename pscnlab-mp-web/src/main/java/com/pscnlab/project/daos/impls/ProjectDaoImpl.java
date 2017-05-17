package com.pscnlab.project.daos.impls;

import com.google.inject.Singleton;
import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.project.daos.ProjectDao;
import com.pscnlab.project.models.Project;

/**
 * Created by zengyh on 2017/5/15.
 */
@Singleton
public class ProjectDaoImpl extends BaseDao<Long,Project> implements ProjectDao {


    @Override
    public Page<Project> findPageProjectByState(String state, Integer offset, Integer size){

        FilterMap filterMap = new FilterMap();
        filterMap.eq("state",state);
        return super.page(filterMap,offset,size);
    }
}
