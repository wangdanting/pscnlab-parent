package com.pscnlab.project.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.project.daos.impls.TableDaoImpl;
import com.pscnlab.project.models.Table;
import javafx.scene.control.Tab;

/**
 * Created by zengyh on 2017/6/2.
 */
@ImplementedBy(TableDaoImpl.class)
public interface TableDao extends IBaseDao<Integer,Table> {

    Page<Table> findListByConditions(String tableNum,
                                     String userName,
                                     String state,
                                     Integer offset,
                                     Integer size);

    //查询桌位
    Table findOneByTableId(Integer uuid);
}
