package com.pscnlab.project.daos.impls;

import com.google.inject.Singleton;
import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.project.daos.TableDao;
import com.pscnlab.project.models.Table;
import org.apache.commons.lang.StringUtils;

/**
 * Created by zengyh on 2017/6/2.
 */
@Singleton
public class TableDaoImpl extends BaseDao<Integer,Table> implements TableDao{

    //按条件查询桌位
    @Override
    public Page<Table> findListByConditions(String tableNum,
                                            String userName,
                                            String state,
                                            Integer offset,
                                            Integer size){

        FilterMap filterMap = new FilterMap();
        if(StringUtils.isNotBlank(tableNum)) {
            filterMap.eq("num",tableNum);
        }
        if(StringUtils.isNotBlank(userName)) {
            filterMap.eq("userName",userName);
        }
        if(StringUtils.isNotBlank(state)) {
            filterMap.eq("state",state);
        }

        return super.page(filterMap,offset,size);
    }

    //查询桌位
    @Override
    public Table findOneByTableId(Integer uuid){
        if(uuid==null){
            return null;
        }

        FilterMap filterMap = new FilterMap();
        filterMap.eq("uuid",uuid);
        return super.findOne(filterMap);
    }
}
