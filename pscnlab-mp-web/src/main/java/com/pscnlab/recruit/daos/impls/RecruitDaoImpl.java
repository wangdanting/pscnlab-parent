/*
 *  Copyright (c) 2015.  meicanyun.com Corporation Limited.
 *  All rights reserved.
 *
 *  This software is the confidential and proprietary information of
 *  meicanyun Company. ("Confidential Information").  You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into
 *  with meicanyun.com.
 */

package com.pscnlab.recruit.daos.impls;

import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.recruit.daos.RecruitDao;
import com.pscnlab.recruit.models.Recruit;
import org.apache.commons.lang.StringUtils;

import java.util.List;

/**
 * Created by xiong on 2017/5/16 .
 */
public class RecruitDaoImpl extends BaseDao<Integer,Recruit> implements RecruitDao {


    @Override
    public Page<Recruit> findPageByCondition(String position,Integer offset, Integer size){
        FilterMap filterMap = new FilterMap();
        if(StringUtils.isNotBlank(position)) {
            filterMap.eq("position", position);
        }
        return super.page(filterMap,offset,size);
    }

    @Override
    public Recruit findOneById(Integer uuid){
        if(uuid==null){
            return null;
        }
        FilterMap filterMap = new FilterMap();
        filterMap.eq("uuid",uuid);
        return super.findOne(filterMap);
    }


}
