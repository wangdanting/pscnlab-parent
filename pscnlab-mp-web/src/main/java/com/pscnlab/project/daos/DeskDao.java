package com.pscnlab.project.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.project.daos.impls.DeskDaoImpl;
import com.pscnlab.project.models.Desk;

/**
 * Created by zengyh on 2017/6/2.
 */
@ImplementedBy(DeskDaoImpl.class)
public interface DeskDao extends IBaseDao<Integer,Desk> {

    Page<Desk> findListByConditions(String tableNum,
                                    String userName,
                                    String state,
                                    Integer offset,
                                    Integer size);

    //查询桌位
    Desk findOneByTableId(Integer uuid);
}
