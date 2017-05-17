package com.pscnlab.project.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.project.daos.impls.ProjectDaoImpl;
import com.pscnlab.project.models.Project;

/**
 * Created by zengyh on 2017/5/15.
 */
@ImplementedBy(ProjectDaoImpl.class)
public interface ProjectDao extends IBaseDao<Long,Project> {


    Page<Project> findPageProjectByState(String state, Integer offset, Integer size);
}
