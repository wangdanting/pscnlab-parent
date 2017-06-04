package com.pscnlab.project.daos.impls;

import com.google.inject.Singleton;
import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.project.daos.FundDao;
import com.pscnlab.project.models.Funds;

import java.util.List;

@Singleton
public class FundDaoImpl extends BaseDao<Integer,Funds> implements FundDao{


    @Override
    public Page<Funds> findPageByCondition(Integer offset, Integer size){
        FilterMap filterMap = new FilterMap();
        return super.page(filterMap,offset,size);
    }

    @Override
    public Funds findOneById(Integer fundIds){
        if(fundIds==null){
            return null;
        }
        FilterMap filterMap = new FilterMap();
        filterMap.eq("uuidFund",fundIds);
        return super.findOne(filterMap);
    }

    @Override
    public List<Funds> findListAll(){
        FilterMap filterMap = new FilterMap();
        return super.list(filterMap);
    }

}
