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
import com.pscnlab.train.daos.TrainDao;
import com.pscnlab.train.models.Train;
import com.pscnlab.train.services.TrainDaoService;

import javax.inject.Inject;

/**
 * Created by xiong on 2017/5/15 .
 */
public class TrainDaoServiceImpl extends BaseServiceImpl<Integer,Train> implements TrainDaoService {
    @Inject
    private TrainDao trainDao;

    @Override
    protected IBaseDao<Integer, Train> getBaseDao() {
        return trainDao;
    }


}
