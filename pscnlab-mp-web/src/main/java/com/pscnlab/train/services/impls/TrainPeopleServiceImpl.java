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

package com.pscnlab.train.services.impls;

import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.train.daos.TrainPeopleDao;
import com.pscnlab.train.models.TrainPeople;
import com.pscnlab.train.services.TrainPeopleService;

import javax.inject.Inject;

/**
 * Created by xiong on 2017/5/15 .
 */
public class TrainPeopleServiceImpl  extends BaseServiceImpl<Integer,TrainPeople> implements TrainPeopleService {
    @Inject
    private TrainPeopleDao trainPeopleDao;

    @Override
    protected IBaseDao<Integer, TrainPeople> getBaseDao() {
        return trainPeopleDao;
    }

    @Override
    public void save(TrainPeople var1) {
        TrainPeople member = trainPeopleDao.findOneByUuidTrainAndUuidMember(var1.getUuidTrain(), var1.getUuidMember());
        if(member==null) {
            super.save(var1);
        }
    }
}
