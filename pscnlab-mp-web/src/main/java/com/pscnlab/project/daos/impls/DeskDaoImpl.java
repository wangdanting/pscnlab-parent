package com.pscnlab.project.daos.impls;

import com.google.inject.Singleton;
import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.project.daos.DeskDao;
import com.pscnlab.project.models.Desk;
import org.apache.commons.lang.StringUtils;

/**
 * Created by zengyh on 2017/6/2.
 */
@Singleton
public class DeskDaoImpl extends BaseDao<Integer,Desk> implements DeskDao {

    //按条件查询桌位
    @Override
    public Page<Desk> findListByConditions(String tableNum,
                                            String userName,
                                            String state,
                                            Integer offset,
                                            Integer size){

        FilterMap filterMap = new FilterMap();
        if(StringUtils.isNotBlank(tableNum)) {
            filterMap.like("num","%"+tableNum+"%");
        }
        if(StringUtils.isNotBlank(userName)) {
            filterMap.like("userName","%"+userName+"%");
        }
        if(StringUtils.isNotBlank(state)) {
            filterMap.eq("state",state);
        }

        return super.page(filterMap,offset,size);
    }

    //查询桌位
    @Override
    public Desk findOneByTableId(Integer uuid){
        if(uuid==null){
            return null;
        }

        FilterMap filterMap = new FilterMap();
        filterMap.eq("uuid",uuid);
        return super.findOne(filterMap);
    }
}
