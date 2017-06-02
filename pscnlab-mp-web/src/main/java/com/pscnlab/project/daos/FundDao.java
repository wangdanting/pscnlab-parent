package com.pscnlab.project.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.project.daos.impls.FundDaoImpl;
import com.pscnlab.project.models.Funds;

import java.util.List;

/**
 * Created by zengyh on 2017/6/3.
 */
@ImplementedBy(FundDaoImpl.class)
public interface FundDao extends IBaseDao<Integer,Funds>{
    Page<Funds> findPageByCondition(Integer offset, Integer size);

    Funds findOneById(Integer fundIds);

    List<Funds> findListAll();
}
