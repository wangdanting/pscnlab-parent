package com.pscnlab.project.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.project.daos.impls.ProjectDaoImpl;
import com.pscnlab.project.models.Project;

@ImplementedBy(ProjectDaoImpl.class)
public interface ProjectDao extends IBaseDao<Long,Project> {


    Project findOneByUUId(Integer uuid);

    Page<Project> findPageProjectByState(String state, Integer offset, Integer size);
}
