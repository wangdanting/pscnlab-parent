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
import com.pscnlab.train.daos.TrainPeopleDao;
import com.pscnlab.train.models.TrainPeople;

/**
 * Created by xiong on 2017/5/15 .
 */
public class TrainPeopleDaoImpl  extends BaseDao<Integer,TrainPeople> implements TrainPeopleDao {

    @Override
    public TrainPeople findOneByUuidTrainAndUuidMember(String uuidTrain, String uuidMember) {
        FilterMap filterMap=new FilterMap();
        filterMap.eq("uuidTrain",uuidTrain);
        filterMap.eq("uuidMember",uuidMember);
        return super.findOne(filterMap);
    }
}
