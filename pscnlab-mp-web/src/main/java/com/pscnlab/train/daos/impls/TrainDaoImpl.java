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

package com.pscnlab.train.daos.impls;

import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.train.daos.TrainDao;
import com.pscnlab.train.models.Train;
import org.apache.commons.lang.StringUtils;

public class TrainDaoImpl  extends BaseDao<Integer,Train> implements TrainDao {
    @Override
    public Page<Train> findPage(Long  startTime,Long endTime, Integer offset, Integer size) {
        FilterMap filterMap=new FilterMap();
        if(startTime!=null&&startTime!=null) {
            filterMap.between("time",startTime,endTime);
        }
        return super.page(filterMap,offset,size);
    }

    @Override
    public Page<Train> findPageByTime(String time, Integer offset, Integer size) {
        FilterMap filterMap=new FilterMap();
        if(StringUtils.isNotBlank(time)) {
            filterMap.eq("time",time);
        }
        return super.page(filterMap,offset,size);
    }

    @Override
    public Train findOneByUUId(Integer uuid){
        if (uuid==null){
            return null;
        }
        FilterMap filterMap = new FilterMap();
        filterMap.eq("uuidTrain",uuid);
        return super.findOne(filterMap);
    }


}
